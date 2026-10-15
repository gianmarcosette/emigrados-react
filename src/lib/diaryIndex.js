import { formatMonth } from './format.js'

/**
 * Índice del diario: las anotaciones agrupadas por mes, cada una con la hoja
 * en la que está (empezando en 1), como el índice de un libro.
 */
export function buildDiaryIndex(notes, perPage) {
  const groups = []
  notes.forEach((note, i) => {
    const month = formatMonth(note.date)
    let group = groups[groups.length - 1]
    if (!group || group.month !== month) {
      group = { month, entries: [] }
      groups.push(group)
    }
    group.entries.push({ ...note, page: Math.floor(i / perPage) + 1 })
  })
  return groups
}
