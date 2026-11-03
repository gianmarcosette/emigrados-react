import { describe, expect, it } from 'vitest'
import { CATEGORIES, QUESTIONS, QUESTION_BY_ID, QUESTIONS_VERSION, RETIRED_QUESTIONS } from '../data/questions.js'
import { DRAFTS_KEY } from '../state/drafts.js'
import { buildEntries } from '../lib/journal.js'
import { DEEP, initialJourney, loadJourney, paceDeck, pickQuestion } from '../state/journey.js'

function memoryStorage(seed = {}) {
  const data = { ...seed }
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => (data[k] = v),
    removeItem: (k) => delete data[k],
    data,
  }
}

describe('banco de preguntas revisado', () => {
  it('cada etapa tiene 26 preguntas y cada una su intensidad', () => {
    for (const c of CATEGORIES) expect(QUESTIONS.filter((q) => q.category === c.key)).toHaveLength(26)
    for (const q of QUESTIONS) expect([1, 2, 3]).toContain(q.depth)
  })

  it('no quedan preguntas que dependan de otra ni con "/a"', () => {
    for (const q of QUESTIONS) {
      expect(q.text, q.text).not.toMatch(/^¿Y /)
      expect(q.text, q.text).not.toMatch(/\/a\b/)
    }
  })

  it('las preguntas retiradas apuntan a un lugar que existe y ya no están en el juego', () => {
    const texts = new Set(QUESTIONS.map((q) => q.text))
    for (const [id, text] of Object.entries(RETIRED_QUESTIONS[QUESTIONS_VERSION])) {
      expect(QUESTION_BY_ID[id]).toBeDefined()
      expect(texts.has(text)).toBe(false)
    }
  })
})

describe('migración de lo respondido', () => {
  const [retiredId, oldText] = Object.entries(RETIRED_QUESTIONS[2])[0]

  it('lo respondido a una pregunta que cambió pasa al diario con su pregunta original', () => {
    const saved = {
      answers: {
        [retiredId]: [{ text: 'mi respuesta', date: '2026-10-01' }],
        1: [{ text: 'otra', date: '2026-10-02' }],
      },
      route: [Number(retiredId), 1],
    }
    const storage = memoryStorage({
      'emigrados:v1': JSON.stringify(saved),
      [DRAFTS_KEY]: JSON.stringify({ [retiredId]: { text: 'a medias', date: 'd' }, 1: { text: 'sigue', date: 'd' } }),
    })
    const state = loadJourney(storage)
    expect(state.answers[retiredId]).toBeUndefined()
    expect(state.answers[1]).toHaveLength(1)
    expect(state.route).toEqual([1])
    expect(state.archive).toEqual([
      { questionId: Number(retiredId), question: oldText, text: 'mi respuesta', date: '2026-10-01' },
    ])
    expect(state.questionsVersion).toBe(QUESTIONS_VERSION)
    // El borrador de la pregunta vieja se descarta; los demás quedan
    expect(Object.keys(JSON.parse(storage.data[DRAFTS_KEY]))).toEqual(['1'])

    const entry = buildEntries({
      answers: {},
      archive: state.archive,
      questionById: QUESTION_BY_ID,
      countryById: {},
    })[0]
    expect(entry.question.text).toBe(oldText)
    expect(entry.retired).toBe(true)
  })

  it('lo guardado con la versión actual no se toca', () => {
    const s = {
      ...initialJourney,
      answers: { [retiredId]: [{ text: 'nueva', date: 'd' }] },
      route: [Number(retiredId)],
    }
    const state = loadJourney(memoryStorage({ 'emigrados:v1': JSON.stringify(s) }))
    expect(state.answers[retiredId]).toHaveLength(1)
    expect(state.archive).toEqual([])
  })
})

describe('dosificar la intensidad', () => {
  const qs = [
    { id: 1, depth: 3 },
    { id: 2, depth: 1 },
    { id: 3, depth: 3 },
  ]

  it('con gentle no elige una profunda si hay otras', () => {
    for (const r of [0, 0.5, 0.99]) expect(pickQuestion(qs, {}, { gentle: true, random: () => r }).id).toBe(2)
  })

  it('si solo quedan profundas, igual elige una', () => {
    expect(pickQuestion(qs, { 2: [{ text: 'x' }] }, { gentle: true }).depth).toBe(DEEP)
  })

  it('el mazo de Grupal no arranca con una profunda ni pone dos seguidas', () => {
    const paced = paceDeck(QUESTIONS)
    expect(paced).toHaveLength(QUESTIONS.length)
    expect(new Set(paced.map((q) => q.id)).size).toBe(QUESTIONS.length)
    expect(paced[0].depth).not.toBe(DEEP)
    paced.forEach((q, i) => {
      if (i) expect(q.depth === DEEP && paced[i - 1].depth === DEEP).toBe(false)
    })
  })

  it('hay una pregunta que no va en Grupal', () => {
    expect(QUESTIONS.filter((q) => q.only === 'individual')).toHaveLength(1)
  })
})
