import React, { useState, useMemo } from 'react';
import { Car } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { mockDrivers } from '../data/Uber_Data';
import { clusterData } from '../data/ClusterData';

// Feature importance weights for additional adjustments
const featureWeights = {
  vehicleToBackgroundTime: 0.15,
  backgroundToSignupTime: 0.10,
  signupChannelReferral: 0.05,
  signupChannelPaid: 0.03,
  signupOsOther: 0.02,
  signupOsMac: 0.02,
  cityWrouver: 0.02,
  signupOsWindows: 0.01,
  vehicleYear: 0.01
};

// Cluster classification rules
const clusterRules = {
  'Very High': {
    maxBgcDays: 2,
    maxVehicleDays: 4,
    minVehicleYear: 2020,
    preferredChannels: ['Referral'],
    preferredCities: ['Wrouver', 'Strark']
  },
  'High': {
    maxBgcDays: 4,
    maxVehicleDays: 7,
    minVehicleYear: 2018,
    preferredChannels: ['Organic', 'Referral'],
    preferredCities: ['Wrouver', 'Strark', 'Berton']
  },
  'Medium': {
    maxBgcDays: 7,
    maxVehicleDays: 10,
    minVehicleYear: 2015,
    preferredChannels: ['Organic', 'Paid'],
    preferredCities: ['Strark', 'Berton']
  },
  'Low': {
    maxBgcDays: Infinity,
    maxVehicleDays: Infinity,
    minVehicleYear: 0,
    preferredChannels: ['Paid'],
    preferredCities: []
  }
};

interface PredictionForm {
  city_name: string;
  signup_os: string;
  signup_channel: string;
  days_to_bgc: number;
  days_to_vehicle: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
}

const Forecast: React.FC = () => {
  const { darkMode } = useTheme();
  const [form, setForm] = useState<PredictionForm>({
    city_name: '',
    signup_os: 'ios',
    signup_channel: 'Organic',
    days_to_bgc: 3,
    days_to_vehicle: 5,
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: 2020
  });

  const [prediction, setPrediction] = useState<{
    probability: number;
    cluster: string;
    details: string[];
    baseRate: number;
    adjustments: number;
  } | null>(null);

  // Extract unique values from the data
  const uniqueCities = useMemo(() => 
    Array.from(new Set(mockDrivers.map(d => d.city_name))).sort(),
    []
  );

  const uniqueVehicleMakes = useMemo(() => 
    Array.from(new Set(mockDrivers.map(d => d.vehicle_make))).sort(),
    []
  );

  const uniqueVehicleModels = useMemo(() => 
    Array.from(new Set(mockDrivers
      .filter(d => !form.vehicle_make || d.vehicle_make === form.vehicle_make)
      .map(d => d.vehicle_model)))
      .sort(),
    [form.vehicle_make]
  );

  const uniqueVehicleYears = useMemo(() => {
    const years = Array.from(new Set(mockDrivers
      .filter(d => !form.vehicle_make || d.vehicle_make === form.vehicle_make)
      .map(d => d.vehicle_year)))
      .sort((a, b) => b - a);
    return years.length > 0 ? years : [];
  }, [form.vehicle_make]);

  const uniqueSignupOS = useMemo(() => 
    Array.from(new Set(mockDrivers.map(d => d.signup_os))).sort(),
    []
  );

  const classifyCluster = (formData: PredictionForm): string => {
    // Score each cluster based on how well the data matches the rules
    const clusterScores = Object.entries(clusterRules).map(([cluster, rules]) => {
      let score = 0;

      // Check BGC days
      if (formData.days_to_bgc <= rules.maxBgcDays) score += 2;
      
      // Check vehicle days
      if (formData.days_to_vehicle <= rules.maxVehicleDays) score += 2;
      
      // Check vehicle year
      if (formData.vehicle_year >= rules.minVehicleYear) score += 1;
      
      // Check signup channel
      if (rules.preferredChannels.includes(formData.signup_channel)) score += 2;
      
      // Check city
      if (rules.preferredCities.includes(formData.city_name)) score += 2;

      return { cluster, score };
    });

    // Return the cluster with the highest score
    return clusterScores.sort((a, b) => b.score - a.score)[0].cluster;
  };

  const calculatePrediction = (formData: PredictionForm) => {
    const details: string[] = [];
    let adjustments = 0;

    // First, classify the driver into a cluster
    const predictedCluster = classifyCluster(formData);
    const baseRate = clusterData[predictedCluster].rate / 100;
    
    details.push(`Base cluster rate: ${(baseRate * 100).toFixed(1)}%`);

    // Apply additional weights based on specific factors
    const vehicleToBackgroundTime = formData.days_to_vehicle - formData.days_to_bgc;
    if (vehicleToBackgroundTime <= 2) {
      adjustments += featureWeights.vehicleToBackgroundTime;
      details.push(`Fast vehicle verification: +${(featureWeights.vehicleToBackgroundTime * 100).toFixed(1)}%`);
    }

    if (formData.days_to_bgc <= 3) {
      adjustments += featureWeights.backgroundToSignupTime;
      details.push(`Quick background check: +${(featureWeights.backgroundToSignupTime * 100).toFixed(1)}%`);
    }

    if (formData.signup_channel === 'Referral') {
      adjustments += featureWeights.signupChannelReferral;
      details.push(`Referral channel: +${(featureWeights.signupChannelReferral * 100).toFixed(1)}%`);
    }

    if (formData.signup_os === 'Mac') {
      adjustments += featureWeights.signupOsMac;
      details.push(`Mac OS user: +${(featureWeights.signupOsMac * 100).toFixed(1)}%`);
    }

    if (formData.city_name === 'Wrouver') {
      adjustments += featureWeights.cityWrouver;
      details.push(`High-performing city: +${(featureWeights.cityWrouver * 100).toFixed(1)}%`);
    }

    const currentYear = new Date().getFullYear();
    if (currentYear - formData.vehicle_year <= 5) {
      adjustments += featureWeights.vehicleYear;
      details.push(`Recent vehicle: +${(featureWeights.vehicleYear * 100).toFixed(1)}%`);
    }

    // Calculate final probability
    const finalProbability = Math.min(baseRate + adjustments, 0.95);

    return {
      probability: finalProbability,
      cluster: predictedCluster,
      details,
      baseRate,
      adjustments
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculatePrediction(form);
    setPrediction(result);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'vehicle_make' ? { 
        vehicle_model: '',
        vehicle_year: uniqueVehicleYears[0] || 2020
      } : {})
    }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`p-6 max-w-2xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        <div className="flex items-center gap-3 mb-6">
          <Car className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Driver Conversion Predictor
          </h2>
        </div>

        <div className={`rounded-lg shadow-sm p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  City
                </label>
                <select
                  name="city_name"
                  value={form.city_name}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                >
                  <option value="">Select a city</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Signup OS
                </label>
                <select
                  name="signup_os"
                  value={form.signup_os}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  {uniqueSignupOS.map(os => (
                    <option key={os} value={os}>{os}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Signup Channel
                </label>
                <select
                  name="signup_channel"
                  value={form.signup_channel}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="Organic">Organic</option>
                  <option value="Referral">Referral</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Days to Background Check
                </label>
                <input
                  type="number"
                  name="days_to_bgc"
                  value={form.days_to_bgc}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  min="0"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Days to Vehicle Added
                </label>
                <input
                  type="number"
                  name="days_to_vehicle"
                  value={form.days_to_vehicle}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  min="0"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Vehicle Make
                </label>
                <select
                  name="vehicle_make"
                  value={form.vehicle_make}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                >
                  <option value="">Select make</option>
                  {uniqueVehicleMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Vehicle Model
                </label>
                <select
                  name="vehicle_model"
                  value={form.vehicle_model}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  disabled={!form.vehicle_make}
                >
                  <option value="">Select model</option>
                  {uniqueVehicleModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Vehicle Year
                </label>
                <select
                  name="vehicle_year"
                  value={form.vehicle_year}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  disabled={!form.vehicle_make}
                  required
                >
                  <option value="">Select year</option>
                  {uniqueVehicleYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Predict Conversion
            </button>
          </form>

          {prediction !== null && (
            <div className={`mt-6 p-4 rounded-lg ${
              darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Prediction Result
              </h3>
              <div className="space-y-2">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Predicted Cluster: <span className="font-bold text-blue-400">{prediction.cluster}</span>
                </p>
                <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Base Rate: <span className="font-bold text-blue-400">
                    {(prediction.baseRate * 100).toFixed(1)}%
                  </span>
                </p>
                <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Additional Adjustments: <span className="font-bold text-green-400">
                    +{(prediction.adjustments * 100).toFixed(1)}%
                  </span>
                </p>
                <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Final Probability: <span className="font-bold text-blue-400">
                    {(prediction.probability * 100).toFixed(1)}%
                  </span>
                </p>
                <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p className="font-medium mb-2">Prediction Breakdown:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {prediction.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forecast;