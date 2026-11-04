// Carta al futuro: escribís hoy, elegís cuándo se abre y hasta ese día queda cerrada.
// Las fechas de apertura son días del calendario ("2027-05-04"), en la hora de quien juega.
// Sin React, para poder testearlo.

export const LETTER_MAX = 3000

export const OPEN_OPTIONS = [
  { key: '3m', label: 'En 3 meses', months: 3 },
  { key: '6m', label: 'En 6 meses', months: 6 },
  { key: '1y', label: 'En un año', months: 12 },
  { key: 'date', label: 'Elegir otra fecha' },
]

const pad = (n) => String(n).padStart(2, '0')

/** El día de hoy (u otra fecha) como "AAAA-MM-DD", en la hora local. */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** "AAAA-MM-DD" → Date a la medianoche local, o null si no es una fecha válida. */
export function parseDay(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? '')
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return dayKey(d) === key ? d : null
}

/** Suma meses sin pasarse de mes: del 31 de agosto, 6 meses después es el 28 (o 29) de febrero. */
export function addMonths(date, months) {
  const day = date.getDate()
  const d = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, last))
  return d
}

/** El día en que se abre la carta según la opción elegida (o la fecha propia). Siempre a partir de mañana. */
export function openDay(option, customDay, now = new Date()) {
  const choice = OPEN_OPTIONS.find((o) => o.key === option)
  if (!choice) return null
  if (choice.months) return dayKey(addMonths(now, choice.months))
  const custom = parseDay(customDay)
  return custom && customDay > dayKey(now) ? customDay : null
}

const dayFormatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

/** "AAAA-MM-DD" → "4 de mayo de 2027" */
export function formatDay(key) {
  const d = parseDay(key)
  return d ? dayFormatter.format(d) : ''
}

/** El día (local) en que se escribió, a partir de la fecha y hora guardadas. */
export function formatWritten(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dayFormatter.format(d)
}

/** El primer día que se puede elegir como fecha propia: mañana. */
export function tomorrow(now = new Date()) {
  return dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))
}

export function isDue(letter, now = new Date()) {
  return letter.openOn <= dayKey(now)
}

/** Días que faltan para que se abra (0 si ya se puede abrir). */
export function daysUntil(openOn, now = new Date()) {
  const target = parseDay(openOn)
  if (!target) return 0
  const today = parseDay(dayKey(now))
  return Math.max(0, Math.round((target - today) / 86400000))
}

/**
 * Cómo están las cartas hoy:
 * - due: listas para abrir (llegó el día y todavía no se abrieron)
 * - sealed: cerradas, de la más próxima a la más lejana
 * - opened: ya leídas, de la más nueva a la más vieja
 */
export function sortLetters(letters = [], now = new Date()) {
  const unopened = letters.filter((l) => !l.openedAt).sort((a, b) => a.openOn.localeCompare(b.openOn))
  return {
    due: unopened.filter((l) => isDue(l, now)),
    sealed: unopened.filter((l) => !isDue(l, now)),
    opened: letters.filter((l) => l.openedAt).sort((a, b) => b.openedAt.localeCompare(a.openedAt)),
  }
}

// Texto de un .ics: comas, punto y coma y barras se escapan; las líneas largas se cortan.
function icsText(text) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function fold(line) {
  const parts = []
  for (let i = 0; i < line.length; i += 70) parts.push((i ? ' ' : '') + line.slice(i, i + 70))
  return parts.join('\r\n')
}

function stamp(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

/**
 * Un evento de calendario para el día que se abre la carta, con aviso a las 10 de la mañana.
 * Lo guarda el calendario de la persona: el juego no necesita servidor para avisarle.
 */
export function letterCalendar({ id, openOn, url, now = new Date() }) {
  const start = parseDay(openOn)
  const next = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
  const day = (d) => dayKey(d).replace(/-/g, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Emigrados//Carta al futuro//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:carta-${id}@emigrados`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART;VALUE=DATE:${day(start)}`,
    `DTEND;VALUE=DATE:${day(next)}`,
    `SUMMARY:${icsText('Hoy se abre tu carta · Emigrados')}`,
    fold(`DESCRIPTION:${icsText(`La carta que te escribiste está lista para abrir: ${url}`)}`),
    fold(`URL:${url}`),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsText('Hoy se abre tu carta')}`,
    'TRIGGER:PT10H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

/** Valida una carta guardada; devuelve null si no sirve. */
export function normalizeLetter(l) {
  if (!l || typeof l !== 'object') return null
  if (typeof l.id !== 'string' || typeof l.text !== 'string' || typeof l.writtenAt !== 'string') return null
  if (!parseDay(l.openOn)) return null
  const letter = { id: l.id, text: l.text, writtenAt: l.writtenAt, openOn: l.openOn }
  if (typeof l.openedAt === 'string') letter.openedAt = l.openedAt
  if (l.reply && typeof l.reply.text === 'string' && typeof l.reply.date === 'string') {
    letter.reply = { text: l.reply.text, date: l.reply.date }
  }
  return letter
}
