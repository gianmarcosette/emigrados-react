// Diario de viaje al estilo de una app de notas: cada respuesta (y cada charla guardada)
// es una entrada; la lista va de la más nueva a la más vieja, agrupada por mes, y la
// búsqueda resalta lo encontrado. Sin React, para poder testearlo.
import { formatMonth } from './format.js'

/** Normaliza para buscar sin importar mayúsculas ni tildes ("Mexico" encuentra "México"). */
export function fold(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Entradas del diario, de la más nueva a la más vieja.
 * Cada respuesta: { key, kind: 'answer', question, country, text, date, earlier: [{ text, date }] }
 * Cada charla:    { key, kind: 'talk', talk, date }
 */
export function buildEntries({ answers, talks = [], questionById, countryById }) {
  const answerEntries = Object.entries(answers).flatMap(([id, list]) => {
    const question = questionById[id]
    if (!question) return []
    return list.map((a, i) => ({
      key: `${question.id}-${a.date}`,
      kind: 'answer',
      question,
      country: countryById[question.countryId],
      text: a.text,
      date: a.date,
      // Lo que se respondió antes a la misma pregunta, para comparar
      earlier: list.slice(0, i).reverse(),
    }))
  })
  const talkEntries = talks.map((talk) => ({ key: `talk-${talk.id}`, kind: 'talk', talk, date: talk.date }))
  return [...answerEntries, ...talkEntries].sort((a, b) => b.date.localeCompare(a.date))
}

/** Textos donde se busca en cada entrada. */
function searchable(entry, countryName) {
  if (entry.kind === 'talk') {
    const { talk } = entry
    return [talk.rival.name, countryName(talk.rival.country), ...talk.messages.map((m) => m.text)]
  }
  return [entry.question.text, entry.text, entry.country.name]
}

export function filterEntries(entries, { term = '', category = 'all', countryName = (c) => c } = {}) {
  const wanted = fold(term.trim())
  return entries.filter((entry) => {
    // Las charlas no pertenecen a una etapa: solo aparecen con "Todas"
    if (category !== 'all' && (entry.kind === 'talk' || entry.question.category !== category)) return false
    return !wanted || searchable(entry, countryName).some((t) => fold(t).includes(wanted))
  })
}

/** Agrupa por mes, respetando el orden recibido: [{ month, entries }]. */
export function groupByMonth(entries) {
  const groups = []
  for (const entry of entries) {
    const month = formatMonth(entry.date)
    const last = groups[groups.length - 1]
    if (last?.month === month) last.entries.push(entry)
    else groups.push({ month, entries: [entry] })
  }
  return groups
}

/** Parte un texto en pedazos para resaltar lo buscado: [{ text, match }]. */
export function highlight(text, term) {
  const wanted = fold(term.trim())
  if (!wanted) return [{ text, match: false }]
  // Se busca sobre el texto sin tildes, que tiene el mismo largo que el original
  const plain = fold(text)
  const parts = []
  let from = 0
  for (let at = plain.indexOf(wanted); at !== -1; at = plain.indexOf(wanted, at + wanted.length)) {
    if (at > from) parts.push({ text: text.slice(from, at), match: false })
    parts.push({ text: text.slice(at, at + wanted.length), match: true })
    from = at + wanted.length
  }
  if (from < text.length) parts.push({ text: text.slice(from), match: false })
  return parts
}
