import React, { useState, useMemo } from 'react';
import { BarChart2, Filter, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { mockDrivers } from '../data/Uber_Data';

type SortField = 'city_name' | 'signup_os' | 'signup_channel' | 'days_to_bgc' | 'days_to_vehicle' | 'vehicle_make' | 'vehicle_year' | 'started_driving';
type SortDirection = 'asc' | 'desc';

const DataExploration: React.FC = () => {
  const { darkMode } = useTheme();
  const [sortField, setSortField] = useState<SortField>('city_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleEntries, setVisibleEntries] = useState(10);

  const filteredAndSortedData = useMemo(() => {
    return [...mockDrivers]
      .filter(driver => 
        Object.entries(driver).some(([key, value]) => {
          if (key === 'id' || key === 'dependent variable') return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
  }, [mockDrivers, sortField, sortDirection, searchTerm]);

  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(0, visibleEntries);
  }, [filteredAndSortedData, visibleEntries]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleLoadMore = () => {
    setVisibleEntries(prev => prev + 20);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <BarChart2 className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Data Exploration
          </h1>
        </div>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Analyze and visualize driver signup patterns
        </p>
      </div>

      {/* City OS Visualization */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          City and Operating System Distribution
        </h3>
        <img 
          src="/City OS.png" 
          alt="City and OS Distribution"
          className="w-full rounded-lg"
        />
      </div>

      {/* Vehicle Year Distribution */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Vehicle Year Distribution
        </h3>
        <img 
          src="/YearCar.png" 
          alt="Vehicle Year Distribution"
          className="w-full rounded-lg"
        />
      </div>

      {/* Additional Visualization */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Additional Analysis
        </h3>
        <img 
          src="/15.png" 
          alt="Additional Analysis"
          className="w-full rounded-lg"
        />
      </div>

      {/* Signup Analysis */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Signup Analysis
        </h3>
        <img 
          src="/Signup.png" 
          alt="Signup Analysis"
          className="w-full rounded-lg"
        />
      </div>

      {/* Search and Filter */}
      <div className={`mb-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search across all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-2 pl-10 rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <Filter className={`absolute left-3 top-2.5 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            {searchTerm && (
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Found {filteredAndSortedData.length} results
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className={`rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('city_name')}
                >
                  <div className="flex items-center gap-2">
                    City {renderSortIcon('city_name')}
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('signup_os')}
                >
                  <div className="flex items-center gap-2">
                    OS {renderSortIcon('signup_os')}
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('signup_channel')}
                >
                  <div className="flex items-center gap-2">
                    Channel {renderSortIcon('signup_channel')}
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('days_to_bgc')}
                >
                  <div className="flex items-center gap-2">
                    Days to BGC {renderSortIcon('days_to_bgc')}
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('vehicle_make')}
                >
                  <div className="flex items-center gap-2">
                    Vehicle Make {renderSortIcon('vehicle_make')}
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('vehicle_year')}
                >
                  <div className="flex items-center gap-2">
                    Year {renderSortIcon('vehicle_year')}
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  onClick={() => handleSort('started_driving')}
                >
                  <div className="flex items-center gap-2">
                    Status {renderSortIcon('started_driving')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map((driver, index) => (
                <tr 
                  key={index}
                  className={`border-b last:border-b-0 ${
                    darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className="p-4">{driver.city_name}</td>
                  <td className="p-4">{driver.signup_os}</td>
                  <td className="p-4">{driver.signup_channel}</td>
                  <td className="p-4">{driver.days_to_bgc}</td>
                  <td className="p-4">{driver.vehicle_make}</td>
                  <td className="p-4">{driver.vehicle_year}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      driver.started_driving
                        ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.started_driving ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {visibleEntries < filteredAndSortedData.length && (
          <div className={`p-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
            <button
              onClick={handleLoadMore}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
              Load 20 More Entries
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExploration;