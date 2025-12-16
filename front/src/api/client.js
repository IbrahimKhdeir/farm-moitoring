import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getAuthHeaders() {
  // Check both Cookies and localStorage for token
  const token = Cookies.get("token") || localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  // 204 No Content or empty body
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  const json = await response.json();

  // Backend wraps responses in { status, message, data }
  // Extract the data if it's wrapped
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data;
  }

  return json;
}

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function apiPut(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function apiDelete(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
}

// Convenience wrappers for your domain endpoints

// Auth
export const authApi = {
  me: () => apiGet("/api/auth/me"),
};

// Devices
export const devicesApi = {
  list: () => apiGet("/api/devices"),
  get: (id) => apiGet(`/api/devices/${id}`),
  create: (payload) => apiPost("/api/devices", payload), // { deviceUuid, name }
  update: (id, payload) => apiPut(`/api/devices/${id}`, payload), // { name }
  remove: (id) => apiDelete(`/api/devices/${id}`),
};

// Sensors (based on your actual backend)
export const sensorsApi = {
  byDevice: (deviceId) => apiGet(`/api/sensors/device/${deviceId}`),
  readings: (sensorId, params) =>
    apiGet(
      `/api/sensors/${sensorId}/readings?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(
        params.to,
      )}`,
    ),
  alertsByDevice: (deviceId) => apiGet(`/api/sensors/device/${deviceId}/alerts`),
};

// Alerts
export const alertsApi = {
  list: () => apiGet("/api/alerts"),
  markRead: (id) => apiPut(`/api/alerts/${id}/read`, {}),
  unreadCount: () => apiGet("/api/alerts/unread-count"),
};

// Alert Settings
export const alertSettingsApi = {
  get: (deviceId) => apiGet(`/api/alert-settings/${deviceId}`),
  update: (deviceId, settings) => apiPut(`/api/alert-settings/${deviceId}`, settings),
};

// API Keys (according to your earlier spec: /api-keys and /api-keys/:deviceId)
export const apiKeysApi = {
  list: () => apiGet("/api-keys"),
  createForDevice: (deviceId) => apiPost(`/api-keys/${deviceId}`, { deviceId }),
  deleteForDevice: (deviceId) => apiDelete(`/api-keys/${deviceId}`),
};

// Dashboard / Extras (optional; backend may or may not implement these)
export const dashboardApi = {
  stats: () => apiGet("/api/dashboard/stats"),
  notifications: () => apiGet("/api/notifications"),
};



