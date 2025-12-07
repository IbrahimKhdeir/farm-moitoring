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
    if (!value) return { bgClass: 'bg-gray-500', statusKey: 'noData' };
    const numValue = parseFloat(value);
    if (numValue < 50) return { bgClass: 'bg-green-500', statusKey: 'good' };
    if (numValue < 100) return { bgClass: 'bg-yellow-500', statusKey: 'moderate' };
    return { bgClass: 'bg-red-500', statusKey: 'high' };
  };

  const status = getGasStatus(gas);

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-xl p-6 text-black transform hover:scale-105 transition duration-300">
      <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
        <h2 className="text-2xl font-bold">{t('gasQuality')}</h2>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-2xl">🌫</span>
        </div>
      </div>

      <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm mb-4">
        <p className="text-sm opacity-90 mb-1">{t('mq135Sensor')}</p>
        <p className="text-3xl font-bold">
          {gas ? `${gas}%` : '--'}
        </p>
      </div>

      <div className={`${status.bgClass} bg-opacity-30 rounded-lg p-3 text-center`}>
        <p className="text-sm font-semibold">{t('status')}: {t(status.statusKey)}</p>
      </div>
    </div>
  );
}
