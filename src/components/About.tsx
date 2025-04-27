import React from 'react';
import { Info, Github, Mail, Heart, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About: React.FC = () => {
  const { darkMode } = useTheme();
  
  const team = [
    {
      name: "Justin Winoto",
      role: "ML Engineer",
      image: "/Justin.jpg",
      codeImage: "/Justin_code.jpg",
      description: "Expert in machine learning and predictive modeling, leading our driver conversion analysis initiatives."
    },
    {
      name: "Yiwei Lu (David)",
      role: "ML Engineer",
      image: "/David.jpg",
      codeImage: "/David_code.jpg",
      description: "Develops robust backend infrastructure for our prediction models and data pipeline."
    },
    {
      name: "Phuc Lam",
      role: "Data Analyst - Backend Developer",
      image: "/Phuc.jpg",
      codeImage: "/Phuc_code.jpg",
      description: "Expert in machine learning and predictive modeling, leading our driver conversion analysis initiatives."
    },
    {
      name: "Sorasak Joshi",
      role: "ML Engineer",
      image: "/Sorasak.jpg",
      codeImage: "/Sorasak_code.jpg",
      description: "Expert in machine learning and predictive modeling, specializing in driver conversion patterns."
    }
  ];

  return (
    <div className={`p-4 sm:p-6 max-w-7xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <Info className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            About This Project
          </h1>
        </div>
        <p className={`text-sm sm:text-base mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Understanding the driver conversion prediction model
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Project Overview */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Target className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Overview
            </h2>
          </div>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            This dashboard provides insights into Uber driver conversion patterns using machine learning models.
            The analysis is based on historical data from StrataScratch, focusing on various factors that influence whether
            a driver signup leads to active participation on the platform.
          </p>
        </div>

        {/* Project Details */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Methodology
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              The prediction model uses logistic regression to analyze various features including:
            </p>
            <ul className={`list-disc list-inside space-y-2 text-sm sm:text-base ml-2 sm:ml-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Signup channel and platform</li>
              <li>Background check completion time</li>
              <li>Vehicle information and verification timeline</li>
              <li>Geographic location and market characteristics</li>
            </ul>
          </div>
        </div>

        {/* Meet the Team */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-8 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Meet Our Team
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our diverse team brings together expertise in machine learning, data science, and
              software development to build innovative solutions for driver conversion optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {team.map((member) => (
              <div key={member.name} className={`flex flex-col items-center text-center group ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } p-6 rounded-xl transition-colors duration-200`}>
                <div className="mb-3 sm:mb-4 relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {member.name}
                </h3>
                <p className={`text-blue-${darkMode ? '400' : '600'} font-medium mb-2`}>{member.role}</p>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {member.description}
                </p>
                <div className="mt-4 w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={member.codeImage}
                    alt={`${member.name}'s Code`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version Information */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Version Information
          </h2>
          <div className={`space-y-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>Version: 0.1.0</p>
            <p>Last Updated: April 12 2025</p>
            <p>Data Source: <a href="https://platform.stratascratch.com/data-projects/will-new-drivers-start-driving" 
              className={`text-blue-${darkMode ? '400' : '600'} hover:text-blue-${darkMode ? '300' : '700'}`}>
              StrataScratch
            </a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;