import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { dashboardApi, alertsApi } from "../api/client";

export default function MainDashboard() {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Devices</h3>
            <div className="text-2xl font-bold">
              {stats?.devicesCount ?? (loading ? "..." : "—")}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Sensors</h3>
            <div className="text-2xl font-bold">
              {stats?.sensorsCount ?? (loading ? "..." : "—")}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Unread alerts</h3>
            <div className="text-2xl font-bold">
              {loading ? "..." : unreadAlerts}
            </div>
          </div>
        </div>

        <Dashboard />

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
          {loading && !notifications.length ? (
            <div className="text-gray-600">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-600">No notifications.</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="border rounded-lg px-4 py-3 bg-gray-50"
                >
                  <div className="font-semibold">{n.title || "Notification"}</div>
                  {n.message && (
                    <div className="text-sm text-gray-700">{n.message}</div>
                  )}
                  {n.createdAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


