import React, { useState } from 'react';
import { Car } from 'lucide-react';

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

const Predictor: React.FC = () => {
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

  const [prediction, setPrediction] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock prediction (replace with actual model)
    const mockPrediction = Math.random();
    setPrediction(mockPrediction);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Car className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Driver Conversion Predictor</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city_name"
              value={form.city_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Signup OS</label>
            <select
              name="signup_os"
              value={form.signup_os}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Signup Channel</label>
            <select
              name="signup_channel"
              value={form.signup_channel}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Organic">Organic</option>
              <option value="Referral">Referral</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Days to Background Check</label>
            <input
              type="number"
              name="days_to_bgc"
              value={form.days_to_bgc}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Days to Vehicle Added</label>
            <input
              type="number"
              name="days_to_vehicle"
              value={form.days_to_vehicle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Year</label>
            <input
              type="number"
              name="vehicle_year"
              value={form.vehicle_year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1990"
              max="2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Make</label>
            <input
              type="text"
              name="vehicle_make"
              value={form.vehicle_make}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Model</label>
            <input
              type="text"
              name="vehicle_model"
              value={form.vehicle_model}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Predict Conversion
        </button>

        {prediction !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
            <p>Probability of conversion: {(prediction * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-2">
              {prediction > 0.5 
                ? "High likelihood of becoming an active driver"
                : "May need additional support to convert"}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Predictor;