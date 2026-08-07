/** LAN backend for phone / APK builds. Change if your Wi‑Fi IP changes. */
export const LAN_API_HOST = '192.168.0.115'
export const LAN_API_PORT = 8080
export const LAN_API_URL = `http://${LAN_API_HOST}:${LAN_API_PORT}`

/**
 * Prefer EXPO_PUBLIC_API_URL when set at build/start time.
 * Otherwise always use the LAN IP (required for real devices / APK).
 */

export const API_URL = process.env.EXPO_PUBLIC_API_URL || LAN_API_URL

let authToken = null

export function setAuthToken(token) {
  authToken = token || null
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch {
    throw new Error('NETWORK_ERROR')
  }

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  health: () => request('/api/health'),
  login: (phone, pin) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, pin }),
    }),
  units: (farmerId) => request(`/api/farmers/${farmerId}/units`),
  unit: (farmerId, unitId) => request(`/api/farmers/${farmerId}/units/${unitId}`),
  alerts: (farmerId) => request(`/api/farmers/${farmerId}/alerts`),
  unreadCount: (farmerId) => request(`/api/farmers/${farmerId}/alerts/unread-count`),
  markAlertRead: (farmerId, alertId) =>
    request(`/api/farmers/${farmerId}/alerts/${alertId}/read`, { method: 'PATCH' }),
  markAllAlertsRead: (farmerId) =>
    request(`/api/farmers/${farmerId}/alerts/read-all`, { method: 'PATCH' }),
  helpTickets: (farmerId) => request(`/api/farmers/${farmerId}/help`),
  createHelpTicket: (farmerId, payload) =>
    request(`/api/farmers/${farmerId}/help`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  registerDeviceToken: (farmerId, payload) =>
    request(`/api/farmers/${farmerId}/device-tokens`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
