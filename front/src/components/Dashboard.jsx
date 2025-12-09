import ClimateCard from "./ClimateCard";
import GasCard from "./GasCard";
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span>📡</span> {t('realTimeMonitoring')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{t('liveSensorData')}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-500">{t('dataStreaming')}</span>
          </div>
        </div>
      </div>
      
      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <ClimateCard />
        <GasCard />
      </div>
      
      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <span>⚡</span> {t('systemStatus')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            <span className="text-gray-700 font-medium text-sm sm:text-base">{t('mqttConnected')}</span>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700 font-medium text-sm sm:text-base">{t('sensorsActive')}</span>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700 font-medium text-sm sm:text-base">{t('dataStreaming')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
