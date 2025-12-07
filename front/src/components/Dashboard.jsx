import ClimateCard from "./ClimateCard";
import GasCard from "./GasCard";
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('realTimeMonitoring')}</h2>
          <p className="text-gray-600">{t('liveSensorData')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ClimateCard />
          </div>
          <div>
            <GasCard />
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('systemStatus')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">{t('mqttConnected')}</span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">{t('sensorsActive')}</span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">{t('dataStreaming')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
