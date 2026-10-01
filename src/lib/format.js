const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })

export function formatDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : `${dateFormatter.format(d)} · ${timeFormatter.format(d)}`
}

export function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`
}
