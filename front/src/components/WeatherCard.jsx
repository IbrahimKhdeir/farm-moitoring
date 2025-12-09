import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const WEATHER_API_KEY = "ff8b6e17a1f14708bf1135116250912";

export default function WeatherCard({ location = "Jerusalem" }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch current weather and forecast
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=3&lang=${language === 'ar' ? 'ar' : 'en'}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        
        const data = await response.json();
        setWeather(data.current);
        setForecast(data.forecast?.forecastday || []);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(t("weatherError"));
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, language, t]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl shadow-xl p-4 sm:p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="h-16 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl shadow-xl p-4 sm:p-6 text-white">
        <div className="text-center py-4">
          <span className="text-4xl mb-2 block">⚠️</span>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl shadow-xl p-4 sm:p-6 text-white transform hover:scale-[1.02] transition duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>☀️</span>
            {t("weatherTitle")}
          </h2>
          <p className="text-xs sm:text-sm opacity-80">{location}</p>
        </div>
        {weather?.condition?.icon && (
          <img 
            src={`https:${weather.condition.icon}`} 
            alt={weather.condition.text}
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        )}
      </div>

      {/* Current Weather */}
      <div className="bg-white/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl sm:text-4xl font-bold">
              {weather?.temp_c}°C
            </p>
            <p className="text-xs sm:text-sm opacity-90 mt-1">
              {weather?.condition?.text}
            </p>
          </div>
          <div className="text-right text-xs sm:text-sm space-y-1">
            <p className="flex items-center justify-end gap-1">
              <span>💧</span> {weather?.humidity}%
            </p>
            <p className="flex items-center justify-end gap-1">
              <span>💨</span> {weather?.wind_kph} km/h
            </p>
            <p className="flex items-center justify-end gap-1">
              <span>🌡️</span> {t("feelsLike")}: {weather?.feelslike_c}°C
            </p>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      {forecast.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-semibold mb-2 opacity-90">
            {t("forecast")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {forecast.map((day, index) => (
              <div 
                key={day.date} 
                className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm"
              >
                <p className="text-[10px] sm:text-xs opacity-80">
                  {index === 0 
                    ? t("today") 
                    : new Date(day.date).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US', 
                        { weekday: 'short' }
                      )
                  }
                </p>
                <img 
                  src={`https:${day.day?.condition?.icon}`} 
                  alt={day.day?.condition?.text}
                  className="w-8 h-8 mx-auto"
                />
                <p className="text-xs sm:text-sm font-semibold">
                  {Math.round(day.day?.maxtemp_c)}° / {Math.round(day.day?.mintemp_c)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <span className="block text-lg">🌅</span>
          <p className="opacity-80">{t("sunrise")}</p>
          <p className="font-semibold">{forecast[0]?.astro?.sunrise}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2 text-center">
          <span className="block text-lg">🌇</span>
          <p className="opacity-80">{t("sunset")}</p>
          <p className="font-semibold">{forecast[0]?.astro?.sunset}</p>
        </div>
      </div>
    </div>
  );
}
