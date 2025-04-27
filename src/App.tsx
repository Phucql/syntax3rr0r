import React, { useState } from 'react';
import { LayoutDashboard, Calculator, FileText, Info, Sun, Moon, Menu, BarChart2, FileQuestion, X, Database } from 'lucide-react';
import Overview from './components/Overview';
import DataExploration from './components/DataExploration';
import Forecast from './components/Forecast';
import Report from './components/Report';
import About from './components/About';
import { ThemeProvider, useTheme } from './context/ThemeContext';

type TabType = 'overview' | 'data-exploration' | 'forecast' | 'report' | 'about';

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        {children}
      </div>
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isDataPrepOpen, setIsDataPrepOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'data-exploration', label: 'Data Exploration', icon: BarChart2 },
    { id: 'forecast', label: 'Forecast', icon: Calculator },
    { id: 'report', label: 'Report', icon: FileText },
    { id: 'about', label: 'About', icon: Info },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'data-exploration':
        return <DataExploration />;
      case 'forecast':
        return <Forecast />;
      case 'report':
        return <Report />;
      case 'about':
        return <About />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        } border-r border-gray-200 dark:border-gray-700`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BarChart2 className={`h-8 w-8 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Driver Analytics
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`w-full flex items-center px-3 py-2.5 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group ${
                activeTab === id
                  ? `${darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                    } shadow-lg shadow-blue-500/30`
                  : `${darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
              }`}
            >
              <Icon className={`w-5 h-5 mr-2 ${
                activeTab === id
                  ? 'text-white'
                  : darkMode
                    ? 'text-gray-400 group-hover:text-white'
                    : 'text-gray-500 group-hover:text-gray-700'
              }`} />
              <span className={`${
                activeTab === id
                  ? 'font-semibold'
                  : ''
              }`}>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">
        {/* Fixed Header */}
        <header className={`fixed top-0 right-0 left-0 md:left-64 z-40 h-16 flex items-center justify-between px-4 ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        } border-b`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Datathon @ UCI 2025
            </span>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsDataPrepOpen(true)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              title="Data Preparation"
            >
              <Database className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              title="View Disclaimer"
            >
              <FileQuestion className="w-5 h-5" />
            </button>
          </div>

          {/* Logo in top right */}
          <div className="flex items-center">
            <img 
              src="/team_logo.png"
              alt="Team Logo"
              className="h-24 w-auto"
            />
          </div>
        </header>
        
        {/* Main Content with padding for fixed header */}
        <main className={`pt-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
          {renderContent()}
        </main>

        {/* Disclaimer Modal */}
        <Modal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                <FileQuestion className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Disclaimer
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  This dashboard is a demonstration project using sample data from StrataScratch. 
                  It is not affiliated with or endorsed by Uber Technologies Inc.
                </p>
                
                <h3 className={`text-lg font-semibold mt-4 mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Data Usage
                </h3>
                <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>All data shown is sample data and does not represent real Uber drivers or operations</li>
                  <li>The predictive models and analytics are for demonstration purposes only</li>
                  <li>No real personal information is collected or displayed</li>
                </ul>
                
                <h3 className={`text-lg font-semibold mt-4 mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Purpose
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  This project demonstrates data visualization and predictive analytics capabilities in a real-world context. 
                  It showcases:
                </p>
                <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Interactive data exploration</li>
                  <li>Predictive modeling</li>
                  <li>Business intelligence dashboards</li>
                  <li>Modern web development practices</li>
                </ul>

                <div className="mt-6 mb-6">
                  <img 
                    src="/Website.jpg" 
                    alt="Website Preview"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <p className={darkMode ? 'text-blue-200' : 'text-blue-800'}>
                  <strong>Note:</strong> This is an educational project. For actual Uber driver statistics and information, 
                  please visit the official Uber website.
                </p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Data Preparation Modal */}
        <Modal isOpen={isDataPrepOpen} onClose={() => setIsDataPrepOpen(false)}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Database className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Data Preparation
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Data Collection
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  The dataset was collected from StrataScratch and includes information about Uber driver signups,
                  their onboarding process, and conversion status. The data spans multiple cities and includes
                  various driver and vehicle characteristics.
                </p>

                <h3 className={`text-lg font-semibold mt-6 mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Data Cleaning
                </h3>
                <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Original dataset contained 54,681 rows and 12 columns</li>
                  <li>Checked duplicate and invalid records</li>
                  <li>Standardized date formats and calculated time-based differences</li>
                  <li>Removed irrelevant and high-cardinality columns (e.g., id, vehicle_model)</li>
                </ul>

                <h3 className={`text-lg font-semibold mt-6 mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Feature Engineering
                </h3>
                <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Created dependent variable: 1 if first_completed_date exists, 0 otherwise</li>
                  <li>Created 'bgc - signup' (days between signup_date and bgc_date)</li>
                  <li>Created 'vehicle - bgc' (days between bgc_date and vehicle_added_date)</li>
                  <li>Dummy-encoded all categorical variables using one-hot encoding</li>
                  <li>Removed date columns (e.g., bgc_date, vehicle_added_date)</li>
                </ul>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Model Development
                </h3>
                <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Final dataset contained 54,681 rows and 56 columns</li>
                  <li>Split data into training (80%) and testing (20%) sets</li>
                  <li>Performed feature scaling</li>
                </ul>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;