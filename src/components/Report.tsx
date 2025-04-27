import React from 'react';
import { FileText, TrendingUp, BarChart, Clock, Users, Car, BarChart as ChartBar, Brain, Target, BarChartIcon, LineChart, ArrowDown } from 'lucide-react';
import { mockDrivers } from '../data/Uber_Data';
import { useTheme } from '../context/ThemeContext';

const Report: React.FC = () => {
  const { darkMode } = useTheme();

  // Calculate metrics from actual data
  const totalDrivers = mockDrivers.length;
  const activeDrivers = mockDrivers.filter(d => d.started_driving).length;
  const conversionRate = ((activeDrivers / totalDrivers) * 100).toFixed(1);

  // Calculate channel performance
  const channelStats = mockDrivers.reduce((acc, curr) => {
    const channel = curr.signup_channel;
    if (!acc[channel]) {
      acc[channel] = { total: 0, converted: 0 };
    }
    acc[channel].total += 1;
    if (curr.started_driving) {
      acc[channel].converted += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; converted: number }>);

  // Calculate conversion lift for each channel
  const channelLifts = Object.entries(channelStats).map(([channel, stats]) => ({
    channel,
    conversionRate: (stats.converted / stats.total) * 100,
    lift: ((stats.converted / stats.total) - (activeDrivers / totalDrivers)) * 100
  }));

  return (
    <div className={`p-6 max-w-7xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <FileText className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Analysis Report</h1>
        </div>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Detailed analysis of driver conversion patterns and insights
        </p>
      </div>

      <div className="space-y-6">
        {/* Executive Summary */}
        <div className={`rounded-xl shadow-sm p-6 border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Executive Summary
          </h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            The goal of this project was to predict whether new Uber sign ups would go on to become active drivers, and to identify the key factors influencing that outcome. Using an ensemble model that combines XGBoost with KMeans clustering, we analyzed user behavior and onboarding characteristics.    
          </p>
          
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The results show that onboarding speed is the most critical factor—longer delays between signup, background check, and vehicle upload significantly reduce conversion likelihood. Referral signups convert better than paid, and while newer vehicles slightly boost conversion, vehicle brand and signup OS have minimal impact. 
            The model achieved strong performance with an AUC of 0.97, and SHAP analysis confirmed that process timing and signup source were the most influential drivers. These insights support strategies to streamline onboarding, prioritize referrals, and use behavioral clustering for targeted engagement.
          </p>
        </div>

        {/* Key Findings */}
        <div className={`rounded-xl shadow-sm p-6 border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Key Findings
          </h2>
          
          <div className="space-y-8">
            <div>
              <img 
                src="/accuracy.png" 
                alt="Model Accuracy Metrics"
                className="w-3/4 mx-auto rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                  <Target className={darkMode ? 'text-green-400' : 'text-green-600'} />
                </div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Model Accuracy & Performance
                </h3>
              </div>
              <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>• High overall accuracy: 95.8% (train) and 93.9% (test), showing strong generalization with no overfitting</p>
                <p>• Excellent at identifying non-drivers (Class 0) with a 97% F1-score, precision, and recall</p>
                <p>• Good performance on drivers (Class 1) with a 74% F1-score — slightly lower due to class imbalance</p>
              </div>
            </div>

            {/* Confusion Matrix Analysis */}
            <div>
              <img 
                src="/Confusion_Matrix.png" 
                alt="Confusion Matrix"
                className="w-1/2 mx-auto rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <BarChartIcon className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Prediction Analysis
                </h3>
              </div>
              <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>• True Negatives (9,305) and True Positives (960) show the model performs well in both classes</p>
                <p>• False Positives (399) are slightly higher than False Negatives (273), meaning the model sometimes predicts a driver when it's actually a non-driver</p>
                <p>• Overall, the model has strong accuracy with a slight bias toward classifying users as drivers</p>
              </div>
            </div>

            {/* ROC Analysis */}
            <div>
              <img 
                src="/ROC.png" 
                alt="ROC Curve Analysis"
                className="w-1/2 mx-auto rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <ChartBar className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                </div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  ROC Analysis
                </h3>
              </div>
              <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>• The model performs exceptionally well, with an AUC of 0.97, meaning it's great at telling drivers and non-drivers apart</p>
                <p>• The curve stays close to the top-left, showing it makes very few false alarms while catching most actual drivers</p>
                <p>• Overall, it's a reliable and confident predictor, making strong decisions with minimal confusion</p>
              </div>
            </div>

            {/* Model Architecture */}
            <div>
              <img 
                src="/ensample.png" 
                alt="Ensemble Model Architecture"
                className="w-3/4 mx-auto rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                  <Brain className={darkMode ? 'text-orange-400' : 'text-orange-600'} />
                </div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Model Architecture
                </h3>
              </div>
              <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>• Combines supervised and unsupervised learning: XGBoost focuses on predictive accuracy, while K-Means captures underlying group structures in the data</p>
                <p>• Enhances feature richness: Cluster labels from K-Means provide additional context that helps XGBoost make more accurate and nuanced predictions</p>
                <p>• Improves overall model performance: The ensemble approach increases robustness, accuracy, and generalization by leveraging the strengths of both models</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Insights */}
        <div className={`rounded-xl shadow-sm p-6 border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Data Insights
          </h2>
          
          <div className="space-y-6">
            {/* SHAP Values Analysis */}
            <div className="mb-8">
              <img 
                src="/SHAP Value.png" 
                alt="SHAP Values Analysis"
                className="w-3/4 mx-auto rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Speed of Onboarding */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Clock className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Speed of Onboarding is Crucial
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  bgc-signup and vehicle-bgc have the largest impact on driving conversion.
                </p>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="font-medium">Consideration:</span> Reducing delays between signup, background check consent, and vehicle registration can significantly increase conversion rates.
                </p>
              </div>
            </div>

            {/* Referral Performance */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <Users className={darkMode ? 'text-green-400' : 'text-green-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Referral Users Convert Better Than Paid Signups
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  signup_channel_Referral generally increases conversion, while signup_channel_Paid has a negative effect.
                </p>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="font-medium">Consideration:</span> Invest more in referral programs and re-evaluate the quality of leads from paid acquisition.
                </p>
              </div>
            </div>

            {/* Vehicle Impact */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <Car className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Vehicle Year Has Moderate Impact
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Vehicle_year helps a bit as newer cars slightly boost conversion, but it's not a top influence.
                </p>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="font-medium">Consideration:</span> Vehicle condition matters and is more important than vehicle brand. Uber should maintain a strict policy on potential driver's vehicle age to determine if they will start driving or not.
                </p>
              </div>
            </div>

            {/* Top Features Analysis */}
            <div className="mb-8">
              <img 
                src="/TopFeature.png" 
                alt="Top Features Analysis"
                className="w-3/4 mx-auto rounded-lg mb-6 border border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Logistic Regression Insights */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <LineChart className={darkMode ? 'text-orange-400' : 'text-orange-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Logistic Regression Analysis (77.34% Testing Accuracy)
                </h3>
                <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-start gap-2">
                    <ArrowDown className="w-5 h-5 mt-1 text-red-500" />
                    <p><span className="font-medium">bgc_signup_diff (-1.614):</span> For each 1-day increase in time between signup and background check consent, the odds of driver conversion decrease by 1.614.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowDown className="w-5 h-5 mt-1 text-red-500" />
                    <p><span className="font-medium">vehicle_added_bgc_diff (-1.373):</span> For every 1-day delay between BGC and vehicle addition, the odds of converting decrease by 1.373.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 mt-1 text-green-500" />
                    <p><span className="font-medium">vehicle_year (+0.885):</span> For each additional year of vehicle recency (i.e., newer vehicle), the odds of converting increase by 0.885.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`rounded-xl shadow-sm p-6 border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Recommendations
          </h2>
          <div className="space-y-6">
            {/* Recommendation 1 */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Clock className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Streamline the onboarding process
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Speed up signup, background check, and vehicle registration — faster onboarding boosts driver activation.
                </p>
              </div>
            </div>

            {/* Recommendation 2 */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <Users className={darkMode ? 'text-green-400' : 'text-green-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Prioritize and expand referral programs
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Referral signups convert better than paid — invest more in referrals and improve paid lead quality.
                </p>
              </div>
            </div>

            {/* Recommendation 3 */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <Car className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
              </div>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Enforce vehicle age standards
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Sign up candidates with newer vehicles convert better — enforce vehicle age guidelines and prioritize newer cars during onboarding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Considerations */}
        <div className={`rounded-xl shadow-sm p-6 border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Future Considerations
          </h2>
          <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Implement A/B testing for different onboarding flows</li>
            <li>Develop predictive models for early identification of high-potential drivers</li>
            <li>Create targeted retention strategies based on driver characteristics</li>
            <li>Explore new channels and referral program optimizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Report;