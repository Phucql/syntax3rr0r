import React from 'react';
import { BarChart, LineChart, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { modelResults } from '../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Uber Driver Conversion Analysis</h1>
        <p className="text-gray-600 mt-2">Analyzing driver signup patterns and conversion rates</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Signups</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-700">2,847</span>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12.5% vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Conversion Rate</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-700">45.2%</span>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+3.2% vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Avg Time to Drive</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-700">4.8 days</span>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">-0.5 days vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Active Drivers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-700">1,286</span>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8.3% vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Conversion Lift by Intervention</h3>
              <p className="text-sm text-gray-500 mt-1">Impact of different strategies on driver conversion</p>
            </div>
            <BarChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-80">
            <div className="h-64 flex items-end justify-between gap-4 mt-8">
              {Object.entries(modelResults.conversionLift).map(([name, lift]) => (
                <div key={name} className="flex flex-col items-center group">
                  <div className="relative">
                    <div 
                      className="w-16 bg-blue-500 bg-opacity-75 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                      style={{ height: `${lift * 20}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        +{lift}%
                      </div>
                    </div>
                  </div>
                  <span className="text-sm mt-4 text-gray-600 transform -rotate-45 origin-top-left whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Risk Distribution</h3>
              <p className="text-sm text-gray-500 mt-1">Driver signup risk assessment breakdown</p>
            </div>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-80">
            <div className="grid grid-cols-3 h-64 gap-8 mt-8">
              {Object.entries(modelResults.riskGroups).map(([group, value]) => (
                <div key={group} className="flex flex-col items-center justify-end group">
                  <div className="relative w-full">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 group-hover:opacity-90 ${
                        group === 'Low' ? 'bg-green-500' : 
                        group === 'Medium' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ height: `${value * 2}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {value}%
                      </div>
                    </div>
                  </div>
                  <span className="text-sm mt-4 font-medium text-gray-600">{group} Risk</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Feature Importance Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Key factors influencing driver conversion</p>
          </div>
          <BarChart className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {modelResults.topFeatures.map(({ feature, importance }) => (
            <div key={feature} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {feature.split('_').join(' ').replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.abs(importance) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {(Math.abs(importance) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;