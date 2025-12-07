import { useEffect, useState } from "react";
import { sensorsApi } from "../api/client";

export default function Sensors() {
  const [deviceId, setDeviceId] = useState("");
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSensors = async (currentDeviceId) => {
    if (!currentDeviceId) {
      setSensors([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await sensorsApi.byDevice(currentDeviceId);
      setSensors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load sensors for this device");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceId) {
      loadSensors(deviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadSensors(deviceId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Sensors</h2>
        <p className="text-gray-600 mb-4">
          Enter a device ID to view all sensors attached to that device.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Device ID"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Load sensors
          </button>
        </form>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading sensors...</div>
        ) : sensors.length === 0 && deviceId ? (
          <div className="text-gray-600">No sensors found for this device.</div>
        ) : !deviceId ? (
          <div className="text-gray-600">Enter a device ID to see sensors.</div>
        ) : (
          <div className="space-y-3">
            {sensors.map((sensor) => (
              <div
                key={sensor.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg px-4 py-3"
              >
                <div>
                  <div className="font-semibold">
                    {sensor.name || `Sensor ${sensor.id}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {sensor.id}{" "}
                    {sensor.deviceId && `• Device: ${sensor.deviceId}`}
                  </div>
                  {sensor.type && (
                    <div className="text-xs text-gray-500">Type: {sensor.type}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

