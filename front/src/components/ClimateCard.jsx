import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import { useLanguage } from '../contexts/LanguageContext';

export default function ClimateCard() {
  const [temp, setTemp] = useState("");
  const [hum, setHum] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const handleReading = (data) => {
      if (data.sensorType === "temperature") setTemp(data.value);
      if (data.sensorType === "humidity") setHum(data.value);
    };

    socket.on("sensor-reading", handleReading);

    return () => {
      socket.off("sensor-reading", handleReading);
    };
  }, []);

  const getTempStatus = (value) => {
    if (!value) return { color: "text-gray-400", status: "—" };
    const numValue = parseFloat(value);
    if (numValue < 15) return { color: "text-blue-400", status: "❄️" };
    if (numValue < 25) return { color: "text-green-400", status: "✅" };
    if (numValue < 35) return { color: "text-yellow-400", status: "☀️" };
    return { color: "text-red-400", status: "🔥" };
  };

  const getHumStatus = (value) => {
    if (!value) return { color: "text-gray-400", status: "—" };
    const numValue = parseFloat(value);
    if (numValue < 30) return { color: "text-yellow-400", status: "🏜️" };
    if (numValue < 60) return { color: "text-green-400", status: "✅" };
    return { color: "text-blue-400", status: "💧" };
  };

  const tempStatus = getTempStatus(temp);
  const humStatus = getHumStatus(hum);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
          <span>🌡️</span>
          <span className="hidden sm:inline">{t('climateMonitoring')}</span>
          <span className="sm:hidden">{t('temperature')}</span>
        </h2>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <span className="text-xl sm:text-2xl">🌡</span>
        </div>
      </div>

      {/* Readings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Temperature */}
        <div className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm opacity-90">{t('temperature')}</p>
            <span className="text-lg">{tempStatus.status}</span>
          </div>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${temp ? '' : 'opacity-50'}`}>
            {temp ? `${temp}°C` : '--'}
          </p>
          {temp && (
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(parseFloat(temp) * 2, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Humidity */}
        <div className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm opacity-90">{t('humidity')}</p>
            <span className="text-lg">{humStatus.status}</span>
          </div>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${hum ? '' : 'opacity-50'}`}>
            {hum ? `${hum}%` : '--'}
          </p>
          {hum && (
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${parseFloat(hum)}%` }}
              />
            </div>
          )}
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
