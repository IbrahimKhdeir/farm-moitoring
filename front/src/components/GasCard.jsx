import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import { useLanguage } from '../contexts/LanguageContext';

export default function GasCard() {
  const [gas, setGas] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const handleReading = (data) => {
      if (data.sensorType === "gas") setGas(data.value);
    };

    socket.on("sensor-reading", handleReading);

    return () => {
      socket.off("sensor-reading", handleReading);
    };
  }, []);

  const getGasStatus = (value) => {
    if (!value) return { bgClass: 'from-gray-400 to-gray-500', statusKey: 'noData', icon: '❓', percent: 0 };
    const numValue = parseFloat(value);
    if (numValue < 50) return { bgClass: 'from-green-400 to-green-500', statusKey: 'good', icon: '✅', percent: numValue };
    if (numValue < 100) return { bgClass: 'from-yellow-400 to-yellow-500', statusKey: 'moderate', icon: '⚠️', percent: numValue };
    return { bgClass: 'from-red-400 to-red-500', statusKey: 'high', icon: '🚨', percent: Math.min(numValue, 100) };
  };

  const status = getGasStatus(gas);

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
          <span>🌫️</span>
          <span className="hidden sm:inline">{t('gasQuality')}</span>
          <span className="sm:hidden">Gas</span>
        </h2>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="text-xl sm:text-2xl">🌫</span>
        </div>
      </div>

      {/* Main Reading */}
      <div className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs sm:text-sm opacity-90">{t('mq135Sensor')}</p>
          <span className="text-lg">{status.icon}</span>
        </div>
        <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${gas ? '' : 'opacity-50'}`}>
          {gas ? `${gas}%` : '--'}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${status.bgClass} rounded-full transition-all duration-500`}
              style={{ width: `${status.percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs mt-1 opacity-75">
            <span>0</span>
            <span>50</span>
            <span>100+</span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`bg-gradient-to-r ${status.bgClass} rounded-xl p-3 sm:p-4 text-center shadow-lg`}>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl">{status.icon}</span>
          <div>
            <p className="text-xs sm:text-sm font-medium opacity-90">{t('status')}</p>
            <p className="text-sm sm:text-base font-bold">{t(status.statusKey)}</p>
          </div>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-75">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Live Data</span>
      </div>
    </div>
  );
}
