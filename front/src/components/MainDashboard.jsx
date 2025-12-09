import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import WeatherCard from "./WeatherCard";
import { dashboardApi, alertsApi } from "../api/client";
import { useLanguage } from "../contexts/LanguageContext";

export default function MainDashboard() {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [statsData, notificationsData, unreadAlertsData] = await Promise.all([
          dashboardApi.stats().catch(() => null),
          dashboardApi.notifications().catch(() => []),
          alertsApi.unreadCount().catch(() => ({ count: 0 })),
        ]);
        setStats(statsData);
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        setUnreadAlerts(unreadAlertsData?.count || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statCards = [
    { 
      title: t("devices") || "Devices", 
      value: stats?.devicesCount, 
      icon: "📱", 
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50"
    },
    { 
      title: t("sensors") || "Sensors", 
      value: stats?.sensorsCount, 
      icon: "📊", 
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50"
    },
    { 
      title: t("unreadAlerts") || "Unread Alerts", 
      value: unreadAlerts, 
      icon: "🔔", 
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {statCards.map((card, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-5 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    {card.title}
                  </h3>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {card.value ?? (loading ? "..." : "—")}
                  </div>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.bgLight} rounded-full flex items-center justify-center`}>
                  <span className="text-xl sm:text-2xl">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weather + Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Weather Card */}
          <div className="lg:col-span-1">
            <WeatherCard location="Jerusalem" />
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <Dashboard />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span>📬</span> {t("notifications") || "Notifications"}
            </h3>
            {notifications.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          
          {loading && !notifications.length ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">📭</span>
              <p className="text-gray-500">{t("noNotifications") || "No notifications"}</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="border border-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {n.title || "Notification"}
                      </div>
                      {n.message && (
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                          {n.message}
                        </div>
                      )}
                    </div>
                    {n.createdAt && (
                      <div className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


