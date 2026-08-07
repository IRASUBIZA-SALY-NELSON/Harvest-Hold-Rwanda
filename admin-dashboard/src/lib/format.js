export function severityClass(severity) {
  const s = (severity || '').toLowerCase()
  if (s === 'high') return 'bg-alert/15 text-alert'
  if (s === 'medium') return 'bg-warn/15 text-warn'
  return 'bg-forest-100 text-forest-700'
}

export function statusClass(status) {
  const s = (status || '').toLowerCase()
  if (s === 'alert') return 'bg-alert/15 text-alert'
  if (s === 'cooling') return 'bg-forest-100 text-forest-700'
  if (s === 'idle') return 'bg-ink/10 text-ink/60'
  return 'bg-mist text-ink/70'
}

export function ticketStatusClass(status) {
  const s = (status || '').toLowerCase()
  if (s === 'open') return 'bg-alert/15 text-alert'
  if (s === 'in progress') return 'bg-warn/15 text-warn'
  if (s === 'resolved' || s === 'closed') return 'bg-forest-100 text-forest-700'
  return 'bg-mist text-ink/70'
}

export function formatTime(date) {
  if (!date) return '—'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function shortIso(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
