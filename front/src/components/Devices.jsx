import { useEffect, useState } from "react";
import { devicesApi } from "../api/client";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newDeviceUuid, setNewDeviceUuid] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await devicesApi.list();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDeviceUuid || !newDeviceName) return;
    try {
      setCreating(true);
      setError("");
      await devicesApi.create({ deviceUuid: newDeviceUuid, name: newDeviceName });
      setNewDeviceUuid("");
      setNewDeviceName("");
      await loadDevices();
    } catch (err) {
      console.error(err);
      setError("Failed to create device");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (device) => {
    setEditingId(device.id || device.deviceId);
    setEditingName(device.name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async (device) => {
    const id = device.id || device.deviceId;
    if (!id || !editingName) return;
    try {
      setError("");
      await devicesApi.update(id, { name: editingName });
      cancelEdit();
      await loadDevices();
    } catch (err) {
      console.error(err);
      setError("Failed to update device");
    }
  };

  const handleDelete = async (device) => {
    const id = device.id || device.deviceId;
    if (!id) return;
    if (!window.confirm("Delete this device?")) return;
    try {
      setError("");
      await devicesApi.remove(id);
      await loadDevices();
    } catch (err) {
      console.error(err);
      setError("Failed to delete device");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Devices</h2>
        <p className="text-gray-600 mb-4">
          Manage the devices linked to your farm monitoring system.
        </p>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Device UUID"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newDeviceUuid}
            onChange={(e) => setNewDeviceUuid(e.target.value)}
          />
          <input
            type="text"
            placeholder="Device name"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? "Adding..." : "Add Device"}
          </button>
        </form>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="text-gray-600">No devices found.</div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => {
              const id = device.id || device.deviceId;
              const name = device.name || device.deviceId || "Unnamed device";
              return (
                <div
                  key={id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg px-4 py-3"
                >
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-xs text-gray-500">
                      ID: {device.deviceUuid || device.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId === id ? (
                      <>
                        <input
                          type="text"
                          className="px-2 py-1 border rounded-lg text-sm"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdate(device)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-300 text-sm rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(device)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(device)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg"
                        >
                          Delete
                        </button>
                      </>
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


