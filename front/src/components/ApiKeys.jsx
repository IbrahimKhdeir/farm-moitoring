import { useEffect, useState } from "react";
import { apiKeysApi } from "../api/client";

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingId, setCreatingId] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadKeys = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiKeysApi.list();
      setKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!creatingId) return;
    try {
      setCreating(true);
      setError("");
      await apiKeysApi.createForDevice(creatingId);
      setCreatingId("");
      await loadKeys();
    } catch (err) {
      console.error(err);
      setError("Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm("Delete API key for this device?")) return;
    try {
      setDeletingId(deviceId);
      setError("");
      await apiKeysApi.deleteForDevice(deviceId);
      await loadKeys();
    } catch (err) {
      console.error(err);
      setError("Failed to delete API key");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">API Keys</h2>
        <p className="text-gray-600 mb-4">
          Manage API keys used to connect external services to your devices.
        </p>

        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Device ID"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={creatingId}
            onChange={(e) => setCreatingId(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Generate API Key"}
          </button>
        </form>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading API keys...</div>
        ) : keys.length === 0 ? (
          <div className="text-gray-600">No API keys found.</div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id || key.deviceId}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg px-4 py-3"
              >
                <div>
                  <div className="font-semibold">
                    Device: {key.deviceId || key.device_id}
                  </div>
                  {key.key && (
                    <div className="text-xs text-gray-600 break-all">
                      Key: {key.key}
                    </div>
                  )}
                  {key.createdAt && (
                    <div className="text-xs text-gray-500">
                      Created: {new Date(key.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(key.deviceId || key.device_id)}
                  disabled={deletingId === (key.deviceId || key.device_id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-60"
                >
                  {deletingId === (key.deviceId || key.device_id)
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


