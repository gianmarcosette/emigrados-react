import { describe, expect, it } from 'vitest'
import { buildEntries, filterEntries, fold, groupByMonth, highlight } from '../lib/journal.js'

const questionById = {
  1: { id: 1, text: '¿Qué extrañás de tu país?', category: 'despedida', countryId: '484' },
  2: { id: 2, text: '¿Volverías?', category: 'futuro', countryId: '380' },
}
const countryById = { 484: { id: '484', name: 'México' }, 380: { id: '380', name: 'Italia' } }
const answers = {
  1: [
    { text: 'El café de la mañana', date: '2026-06-02T10:00:00Z' },
    { text: 'Ya no tanto el café', date: '2026-08-10T10:00:00Z' },
  ],
  2: [{ text: 'Sí, con más abrigo', date: '2026-07-05T10:00:00Z' }],
  99: [{ text: 'pregunta que ya no existe', date: '2026-07-06T10:00:00Z' }],
}
const talks = [
  { id: 't1', date: '2026-07-20T10:00:00Z', rival: { name: 'Ana', country: 'PT' }, messages: [{ text: 'Hola' }] },
]
const entries = buildEntries({ answers, talks, questionById, countryById })

describe('diario estilo notas', () => {
  it('cada respuesta y cada charla es una entrada, de la más nueva a la más vieja', () => {
    expect(entries.map((e) => e.date.slice(0, 10))).toEqual(['2026-08-10', '2026-07-20', '2026-07-05', '2026-06-02'])
    expect(entries[1].kind).toBe('talk')
  })

  it('guarda lo que se respondió antes a la misma pregunta', () => {
    expect(entries[0].earlier.map((a) => a.text)).toEqual(['El café de la mañana'])
    expect(entries[3].earlier).toEqual([])
  })

  it('agrupa por mes', () => {
    expect(groupByMonth(entries).map((g) => [g.month, g.entries.length])).toEqual([
      ['agosto de 2026', 1],
      ['julio de 2026', 2],
      ['junio de 2026', 1],
    ])
  })

  it('busca sin importar tildes ni mayúsculas, también por país y en las charlas', () => {
    expect(filterEntries(entries, { term: 'CAFE' })).toHaveLength(2)
    expect(filterEntries(entries, { term: 'mexico' })).toHaveLength(2)
    expect(filterEntries(entries, { term: 'hola' })[0].kind).toBe('talk')
  })

  it('filtra por etapa (las charlas solo aparecen con todas)', () => {
    expect(filterEntries(entries, { category: 'futuro' }).map((e) => e.question.id)).toEqual([2])
  })

  it('resalta lo buscado respetando las tildes del texto', () => {
    expect(highlight('Mi café y otro cafe', 'cafe')).toEqual([
      { text: 'Mi ', match: false },
      { text: 'café', match: true },
      { text: ' y otro ', match: false },
      { text: 'cafe', match: true },
    ])
    expect(highlight('Nada', '')).toEqual([{ text: 'Nada', match: false }])
    expect(fold('Árbol')).toBe('arbol')
  })
})
