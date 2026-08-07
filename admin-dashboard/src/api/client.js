const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  health: () => request('/api/health'),
  login: (email, password) =>
    request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  overview: () => request('/api/admin/overview'),
  units: () => request('/api/admin/units'),
  unit: (id) => request(`/api/admin/units/${id}`),
  farmers: () => request('/api/admin/farmers'),
  alerts: () => request('/api/admin/alerts'),
  tickets: () => request('/api/admin/tickets'),
  updateTicket: (id, status) =>
    request(`/api/admin/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}
