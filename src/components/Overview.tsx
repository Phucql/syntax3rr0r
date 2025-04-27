import React from 'react';
import { BarChart, LineChart, TrendingUp, Users, Clock, Star, TrendingDown, MapPin, Users2 } from 'lucide-react';
import { mockDrivers } from '../data/Uber_Data';
import { useTheme } from '../context/ThemeContext';

const channelColors = {
  'Referral': {
    light: 'from-emerald-400 to-emerald-500',
    dark: 'from-emerald-500 to-emerald-600',
    hover: 'bg-emerald-400'
  },
  'Paid': {
    light: 'from-violet-400 to-violet-500',
    dark: 'from-violet-500 to-violet-600',
    hover: 'bg-violet-400'
  },
  'Organic': {
    light: 'from-amber-400 to-amber-500',
    dark: 'from-amber-500 to-amber-600',
    hover: 'bg-amber-400'
  }
};

const clusterData = {
  'Very High': {
    name: 'Cluster 0',
    rate: 44,
    description: [
      'Newer vehicles',
      'Fast onboarding (shortest BGC and vehicle add gaps)',
      'Significant portion of Paid signups',
      'Highest conversion among all clusters'
    ],
    color: {
      light: 'from-blue-400 to-blue-500',
      dark: 'from-blue-500 to-blue-600',
      hover: 'bg-blue-400'
    }
  },
  'High': {
    name: 'Cluster 3',
    rate: 27,
    description: [
      'Oldest vehicles',
      'Slower onboarding process',
      'Low OS diversity, concentrated in Strark',
      'Mid-low conversion but better than Cluster 2'
    ],
    color: {
      light: 'from-emerald-400 to-emerald-500',
      dark: 'from-emerald-500 to-emerald-600',
      hover: 'bg-emerald-400'
    }
  },
  'Medium': {
    name: 'Cluster 1',
    rate: 20,
    description: [
      'Mostly organic signups',
      'Longer onboarding gaps',
      'Moderate vehicle age',
      'Low engagement post-signup'
    ],
    color: {
      light: 'from-amber-400 to-amber-500',
      dark: 'from-amber-500 to-amber-600',
      hover: 'bg-amber-400'
    }
  },
  'Low': {
    name: 'Cluster 2',
    rate: 7,
    description: [
      'Longest delays in onboarding',
      'Highest share of Paid signups (65%)',
      'Diverse OS and city profile',
      'Very low conversion despite high acquisition cost'
    ],
    color: {
      light: 'from-red-400 to-red-500',
      dark: 'from-red-500 to-red-600',
      hover: 'bg-red-400'
    }
  }
};

const featureImportance = [
  { name: 'Vehicle to Background Check Time', value: 0.40 },
  { name: 'Background Check to Signup Time', value: 0.10 },
  { name: 'Signup Channel (Referral)', value: 0.03 },
  { name: 'Signup Channel (Paid)', value: 0.025 },
  { name: 'Signup OS (Other)', value: 0.02 },
  { name: 'Signup OS (Mac)', value: 0.018 },
  { name: 'City (Wrouver)', value: 0.015 },
  { name: 'Signup OS (Windows)', value: 0.012 },
  { name: 'Vehicle Year', value: 0.01 },
  { name: 'Cluster', value: 0.008 }
].map(feature => ({
  ...feature,
  percentage: (feature.value / 0.40) * 100
}));

const Overview: React.FC = () => {
  const { darkMode } = useTheme();

  // Calculate metrics from actual data
  const totalSignups = mockDrivers.length;
  const activeDrivers = mockDrivers.filter(driver => driver.started_driving).length;

  // Calculate conversion rates by channel
  const channelConversion = mockDrivers.reduce((acc, driver) => {
    const channel = driver.signup_channel;
    if (!acc[channel]) {
      acc[channel] = { signups: 0, completions: 0 };
    }
    acc[channel].signups++;
    if (driver.started_driving) {
      acc[channel].completions++;
    }
    return acc;
  }, {} as Record<string, { signups: number; completions: number }>);

  // Convert to conversion rates
  const channelConversionRates = Object.entries(channelConversion).reduce((acc, [channel, data]) => {
    acc[channel] = data.completions / data.signups;
    return acc;
  }, {} as Record<string, number>);

  // Calculate median time to first drive
  const calculateMedianTimeToFirstDrive = () => {
    const times = mockDrivers
      .filter(driver => driver.started_driving)
      .map(driver => driver.days_to_vehicle)
      .sort((a, b) => a - b);
    
    const mid = Math.floor(times.length / 2);
    return times.length % 2 === 0 
      ? (times[mid - 1] + times[mid]) / 2 
      : times[mid];
  };

  // Calculate top performing city
  const calculateTopCity = () => {
    const cityCompletions = mockDrivers.reduce((acc, driver) => {
      if (driver.started_driving) {
        acc[driver.city_name] = (acc[driver.city_name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cityCompletions)
      .sort(([,a], [,b]) => b - a)[0];
  };

  // Calculate referral conversions
  const calculateReferralConversions = () => {
    return mockDrivers.filter(
      driver => driver.signup_channel === 'Referral' && driver.started_driving
    ).length;
  };

  const medianDays = calculateMedianTimeToFirstDrive();
  const [topCity, topCityCount] = calculateTopCity();
  const referralConversions = calculateReferralConversions();

  // Calculate month-over-month conversion rate change
  const calculateMonthlyConversion = () => {
    const completionsByMonth = mockDrivers.reduce((acc, driver) => {
      const date = new Date(driver.first_completed_date);
      if (date.getFullYear() === 1900) return acc;
      
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      febCompletions: completionsByMonth['2016-02'] || 0,
      janCompletions: completionsByMonth['2016-01'] || 0
    };
  };

  const conversionMetrics = calculateMonthlyConversion();

  // Calculate risk distribution
  const riskGroups = {
    'Low': mockDrivers.filter(d => d.days_to_bgc <= 3).length / totalSignups * 100,
    'Medium': mockDrivers.filter(d => d.days_to_bgc > 3 && d.days_to_bgc <= 7).length / totalSignups * 100,
    'High': mockDrivers.filter(d => d.days_to_bgc > 7).length / totalSignups * 100
  };

  // Calculate second best city for comparison
  const calculateCityComparison = () => {
    const cityCompletions = mockDrivers.reduce((acc, driver) => {
      if (driver.started_driving) {
        acc[driver.city_name] = (acc[driver.city_name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const sortedCities = Object.entries(cityCompletions)
      .sort(([,a], [,b]) => b - a);
    
    const [,secondCount] = sortedCities[1] || [null, 0];
    
    return {
      city: 'Stark',
      count: 3036,
      difference: 3036 - secondCount
    };
  };

  const cityComparison = calculateCityComparison();

  return (
    <div className={`p-6 max-w-7xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Uber Driver Conversion Analysis
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Analyzing driver signup patterns and conversion rates
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
        {/* Total Signups */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={darkMode ? 'bg-blue-900 p-3 rounded-lg' : 'bg-blue-100 p-3 rounded-lg'}>
              <Users className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Signups</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {totalSignups}
            </span>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Data updated on Jan 2016
            </span>
          </div>
        </div>

        {/* Total Active Drivers */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={darkMode ? 'bg-indigo-900 p-3 rounded-lg' : 'bg-indigo-100 p-3 rounded-lg'}>
              <Users className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Active Drivers</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {activeDrivers}
            </span>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Data updated on Feb 2016
            </span>
          </div>
        </div>

        {/* Total Monthly First Drive */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={darkMode ? 'bg-purple-900 p-3 rounded-lg' : 'bg-purple-100 p-3 rounded-lg'}>
              <Star className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Monthly First Drive</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              1942
            </span>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500">49.1% down vs last month</span>
            </div>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Data updated on Feb 2016
            </span>
          </div>
        </div>

        {/* Median Time to First Drive */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={darkMode ? 'bg-green-900 p-3 rounded-lg' : 'bg-green-100 p-3 rounded-lg'}>
              <Clock className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Median Time to First Drive</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {medianDays} days
            </span>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Data updated on Feb 2016
            </span>
          </div>
        </div>

        {/* Top City */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={darkMode ? 'bg-yellow-900 p-3 rounded-lg' : 'bg-yellow-100 p-3 rounded-lg'}>
              <MapPin className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Top City</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {cityComparison.city}
            </span>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                {cityComparison.count} drivers
              </span>
              <div className="flex items-center ml-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  +{cityComparison.difference} vs 2nd
                </span>
              </div>
            </div>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Data updated on Feb 2016
            </span>
          </div>
        </div>

        {/* Total Referral Conversion */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={darkMode ? 'bg-orange-900 p-3 rounded-lg' : 'bg-orange-100 p-3 rounded-lg'}>
              <Users2 className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Referral Conversion</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {referralConversions}
            </span>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Data updated on Jan 2016
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="space-y-6 mb-8">
        {/* Conversion by Channel */}
        <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Conversion by Channel
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Impact of different signup channels on driver activation rates. Calculated as the ratio of drivers who completed their first ride to total signups per channel.
              </p>
            </div>
            <BarChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div className="h-80">
            <div className="h-full flex items-end justify-around gap-8 px-4">
              {Object.entries(channelConversionRates).map(([name, conversion]) => (
                <div key={name} className="flex flex-col items-center group">
                  <div className="relative w-24">
                    <div className={`absolute -top-8 left-0 right-0 text-center ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } font-semibold`}>
                      {(conversion * 100).toFixed(1)}%
                    </div>
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-b ${
                        darkMode 
                          ? channelColors[name].dark
                          : channelColors[name].light
                      } shadow-lg`}
                      style={{ 
                        height: `${conversion * 300}px`,
                        minHeight: '40px'
                      }}
                    >
                      <div className={`absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        channelColors[name].hover
                      } bg-opacity-10`} />
                    </div>
                  </div>
                  <div className={`mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">{name}</span>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Channel
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Driver Retention Rate and Cluster Characteristics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Conversion Rate Chart */}
          <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Driver Conversion Rate by Cluster
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Analysis of driver conversion patterns across different behavioral clusters
                </p>
              </div>
              <LineChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="h-[400px]">
              <div className="h-full flex items-end justify-around gap-4 px-4">
                {Object.entries(clusterData).map(([level, data]) => (
                  <div key={level} className="flex flex-col items-center group">
                    <div className="relative w-20">
                      <div className={`absolute -top-8 left-0 right-0 text-center ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      } font-semibold`}>
                        {data.rate}%
                      </div>
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-300 bg-gradient-to-b ${
                          darkMode 
                            ? data.color.dark
                            : data.color.light
                        } shadow-lg`}
                        style={{ 
                          height: `${data.rate * 6}px`,
                          minHeight: '40px'
                        }}
                      >
                        <div className={`absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          data.color.hover
                        } bg-opacity-10`} />
                      </div>
                    </div>
                    <div className={`mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-medium">{level}</span>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {data.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cluster Characteristics */}
          <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Cluster Characteristics
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Detailed analysis of each cluster's behavior and patterns
                </p>
              </div>
            </div>
            <div className="space-y-6 h-[400px] overflow-y-auto">
              {Object.entries(clusterData).map(([level, data]) => (
                <div 
                  key={level} 
                  className={`p-6 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-colors hover:bg-opacity-90`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 bg-gradient-to-r ${
                      darkMode ? data.color.dark : data.color.light
                    }`} />
                    <div className="flex-1">
                      <div className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {level} ({data.name})
                      </div>
                      <div className={`font-medium text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      } mt-1`}>
                        Conversion Rate: {data.rate}%
                      </div>
                      <ul className={`mt-3 space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {data.description.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm">•</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Section */}
      <div className={`rounded-xl shadow-sm p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mt-6 ${
        darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Feature Importance from XGBoost
            </h3>
          </div>
          <BarChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>

        <div className="space-y-6 mb-4">
          {featureImportance.map((feature) => (
            <div key={feature.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.name}
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.value.toFixed(3)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}
                  style={{ width: `${feature.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Feature Importance
        </p>
      </div>
    </div>
  );
}

export default Overview;