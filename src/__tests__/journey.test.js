import { describe, expect, it } from 'vitest'
import { initialJourney, journeyReducer, loadJourney, pickQuestion, saveJourney, shuffle } from '../state/journey.js'

const questions = [{ id: 1 }, { id: 2 }, { id: 3 }]

function memoryStorage() {
  const data = {}
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => (data[k] = v) }
}

describe('journeyReducer', () => {
  it('guarda respuestas con fecha y conserva las anteriores', () => {
    let s = journeyReducer(initialJourney, { type: 'saveAnswer', questionId: 2, text: 'hola', date: '2026-01-01' })
    s = journeyReducer(s, { type: 'saveAnswer', questionId: 2, text: 'chau', date: '2026-02-01' })
    expect(s.answers[2]).toEqual([
      { text: 'hola', date: '2026-01-01' },
      { text: 'chau', date: '2026-02-01' },
    ])
    expect(s.route).toEqual([2])
  })

  it('reset borra respuestas pero conserva el nombre', () => {
    let s = journeyReducer(initialJourney, { type: 'setName', name: 'Gian' })
    s = journeyReducer(s, { type: 'saveAnswer', questionId: 1, text: 'x' })
    s = journeyReducer(s, { type: 'reset' })
    expect(s).toEqual({ ...initialJourney, name: 'Gian' })
  })
})

describe('persistencia', () => {
  it('guarda y recupera el viaje', () => {
    const storage = memoryStorage()
    const s = journeyReducer(initialJourney, { type: 'saveAnswer', questionId: 3, text: 'x', date: 'd' })
    saveJourney(s, storage)
    expect(loadJourney(storage)).toEqual(s)
  })

  it('tolera datos corruptos', () => {
    const storage = memoryStorage()
    storage.setItem('emigrados:v1', '{no es json')
    expect(loadJourney(storage)).toEqual(initialJourney)
  })
})

describe('pickQuestion', () => {
  it('prioriza preguntas sin responder', () => {
    const answers = { 1: [{}], 2: [{}] }
    expect(pickQuestion(questions, answers).id).toBe(3)
  })

  it('cuando están todas respondidas, repite una', () => {
    const answers = { 1: [{}], 2: [{}], 3: [{}] }
    expect(pickQuestion(questions, answers, { excludeId: 1, random: () => 0 }).id).toBe(2)
  })

  it('revisit elige solo respondidas', () => {
    const answers = { 2: [{}] }
    expect(pickQuestion(questions, answers, { revisit: true }).id).toBe(2)
  })
})

it('shuffle no pierde elementos', () => {
  expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4])
})
