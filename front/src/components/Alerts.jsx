import { useEffect, useState } from "react";
import { alertsApi } from "../api/client";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingId, setMarkingId] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await alertsApi.list();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();

    // Setup Socket.io for real-time alerts
    const socket = io(API_BASE_URL);

    socket.on("connect", () => {
      console.log("Connected to Socket.io for alerts");
    });

    socket.on("new-alert", (newAlert) => {
      console.log("New alert received:", newAlert);
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      setMarkingId(id);
      await alertsApi.markRead(id);
      // Update local state
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, isRead: true } : alert
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to mark alert as read");
    } finally {
      setMarkingId(null);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "danger":
        return "bg-red-100 border-red-300";
      case "warning":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case "danger":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Alerts</h2>
          <button
            onClick={loadAlerts}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          View and manage alerts generated from your sensors and devices.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <div>No alerts found. Your system is running smoothly!</div>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const isRead = alert.isRead;
              return (
                <div
                  key={alert.id}
                  className={`border rounded-lg px-4 py-3 transition-all ${isRead ? "bg-gray-50 opacity-75" : getLevelColor(alert.level)
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${getLevelBadge(
                            alert.level
                          )}`}
                        >
                          {alert.level.toUpperCase()}
                        </span>
                        {alert.emailSent && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            📧 Email Sent
                          </span>
                        )}
                        {isRead && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                            ✓ Read
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-gray-900 mb-1">
                        {alert.message}
                      </div>

                      <div className="text-sm text-gray-700 space-y-1">
                        {alert.device && (
                          <div>
                            <strong>Device:</strong> {alert.device.name || alert.device.deviceUuid}
                          </div>
                        )}
                        {alert.sensor && (
                          <div>
                            <strong>Sensor:</strong> {alert.sensor.type}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(alert.id)}
                        disabled={markingId === alert.id}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
                      >
                        {markingId === alert.id ? "Marking..." : "Mark as read"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


