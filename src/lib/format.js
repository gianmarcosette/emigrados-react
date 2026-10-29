const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })

export function formatDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : `${dateFormatter.format(d)} · ${timeFormatter.format(d)}`
}

// "19:20"
export function formatTime(date) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? '' : timeFormatter.format(d)
}

export function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`
}

const longDateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// "martes, 2 de junio de 2026": la fecha como se escribe en un diario
export function formatLongDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : longDateFormatter.format(d)
}

const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })
const dayFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' })

// "agosto de 2026": para agrupar el índice del diario
export function formatMonth(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : monthFormatter.format(d)
}

// "31 ago"
export function formatShortDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dayFormatter.format(d).replace('.', '')
}

const listFormatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' })

// "Italia, Chile y España"
export function listJoin(items) {
  return listFormatter.format(items)
}

// "03:12" en la zona horaria de otra persona (para que la distancia se note)
export function formatTimeIn(timeZone, date = new Date()) {
  try {
    return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).format(
      date,
    )
  } catch {
    return ''
  }
}
