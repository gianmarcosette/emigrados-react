const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })

export function formatDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : `${dateFormatter.format(d)} · ${timeFormatter.format(d)}`
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
