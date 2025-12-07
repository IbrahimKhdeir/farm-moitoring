import { useEffect, useState } from "react";
import { devicesApi, alertSettingsApi } from "../api/client";

export default function AlertSettings() {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [settings, setSettings] = useState({
        minTemperature: "",
        maxTemperature: "",
        minHumidity: "",
        maxHumidity: "",
        minOxygen: "",
        maxOxygen: "",
        emailNotifications: false,
        notificationEmail: "",
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load devices on mount
    useEffect(() => {
        loadDevices();
    }, []);

    // Load settings when device is selected
    useEffect(() => {
        if (selectedDeviceId) {
            loadSettings(selectedDeviceId);
        }
    }, [selectedDeviceId]);

    const loadDevices = async () => {
        try {
            const data = await devicesApi.list();
            setDevices(Array.isArray(data) ? data : []);
            if (data.length > 0) {
                setSelectedDeviceId(data[0].id.toString());
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load devices");
        }
    };

    const loadSettings = async (deviceId) => {
        try {
            setLoading(true);
            setError("");
            const data = await alertSettingsApi.get(deviceId);

            setSettings({
                minTemperature: data.minTemperature ?? "",
                maxTemperature: data.maxTemperature ?? "",
                minHumidity: data.minHumidity ?? "",
                maxHumidity: data.maxHumidity ?? "",
                minOxygen: data.minOxygen ?? "",
                maxOxygen: data.maxOxygen ?? "",
                emailNotifications: data.emailNotifications || false,
                notificationEmail: data.notificationEmail || "",
            });
        } catch (err) {
            console.error(err);
            setError("Failed to load alert settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (settings.emailNotifications && !settings.notificationEmail) {
            setError("Email address is required when email notifications are enabled");
            return;
        }

        try {
            setSaving(true);

            // Convert empty strings to null
            const payload = {
                minTemperature: settings.minTemperature === "" ? null : parseFloat(settings.minTemperature),
                maxTemperature: settings.maxTemperature === "" ? null : parseFloat(settings.maxTemperature),
                minHumidity: settings.minHumidity === "" ? null : parseFloat(settings.minHumidity),
                maxHumidity: settings.maxHumidity === "" ? null : parseFloat(settings.maxHumidity),
                minOxygen: settings.minOxygen === "" ? null : parseFloat(settings.minOxygen),
                maxOxygen: settings.maxOxygen === "" ? null : parseFloat(settings.maxOxygen),
                emailNotifications: settings.emailNotifications,
                notificationEmail: settings.notificationEmail || null,
            };

            await alertSettingsApi.update(selectedDeviceId, payload);
            setSuccess("Alert settings saved successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to save alert settings");
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Alert Settings</h2>
                <p className="text-gray-600 mb-6">
                    Configure alert thresholds for your devices. You'll receive alerts when sensor readings go outside these ranges.
                </p>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Device Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Device
                    </label>
                    <select
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                                {device.name || device.deviceUuid}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="text-gray-600">Loading settings...</div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Temperature Settings */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold mb-3">🌡️ Temperature (°C)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Temperature
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={settings.minTemperature}
                                        onChange={(e) => handleInputChange("minTemperature", e.target.value)}
                                        placeholder="e.g., 0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Temperature
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={settings.maxTemperature}
                                        onChange={(e) => handleInputChange("maxTemperature", e.target.value)}
                                        placeholder="e.g., 50"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Humidity Settings */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold mb-3">💧 Humidity (%)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Humidity
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={settings.minHumidity}
                                        onChange={(e) => handleInputChange("minHumidity", e.target.value)}
                                        placeholder="e.g., 20"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Humidity
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={settings.maxHumidity}
                                        onChange={(e) => handleInputChange("maxHumidity", e.target.value)}
                                        placeholder="e.g., 80"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Oxygen Settings */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold mb-3">🫁 Oxygen (%)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Oxygen
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={settings.minOxygen}
                                        onChange={(e) => handleInputChange("minOxygen", e.target.value)}
                                        placeholder="e.g., 18"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Oxygen
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={settings.maxOxygen}
                                        onChange={(e) => handleInputChange("maxOxygen", e.target.value)}
                                        placeholder="e.g., 25"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Notifications */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">📧 Email Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="emailNotifications"
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="emailNotifications" className="ml-2 text-sm font-medium text-gray-700">
                                        Enable email notifications for alerts
                                    </label>
                                </div>
                                {settings.emailNotifications && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notification Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.notificationEmail}
                                            onChange={(e) => handleInputChange("notificationEmail", e.target.value)}
                                            placeholder="your-email@example.com"
                                            required={settings.emailNotifications}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving || !selectedDeviceId}
                                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
