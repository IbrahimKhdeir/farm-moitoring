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

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6  transform hover:scale-105 transition duration-300">
      <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
        <h2 className="text-2xl font-bold">{t('climateMonitoring')}</h2>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-2xl">🌡</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90 mb-1">{t('temperature')}</p>
          <p className="text-3xl font-bold">
            {temp ? `${temp}°C` : '--'}
          </p>
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90 mb-1">{t('humidity')}</p>
          <p className="text-3xl font-bold">
            {hum ? `${hum}%` : '--'}
          </p>
        </div>
      </div>
    </div>
  );
}
