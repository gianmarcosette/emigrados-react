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

describe('charlas guardadas en el diario', () => {
  const talk = {
    id: 't1',
    date: '2026-10-20T10:00:00Z',
    rival: { name: 'Javier', country: 'ES', simulated: true },
    messages: [
      { from: 'me', kind: 'question', text: '¿Qué extrañás?' },
      { from: 'them', kind: 'answer', text: 'El ruido de mi barrio.' },
      { from: 'system', kind: 'stage', text: 'Para cerrar' },
    ],
  }

  it('se guarda una sola vez y sin los avisos del sistema', () => {
    let s = journeyReducer(initialJourney, { type: 'saveTalk', talk })
    s = journeyReducer(s, { type: 'saveTalk', talk })
    expect(s.talks).toHaveLength(1)
    expect(s.talks[0].messages).toHaveLength(2)
    expect(s.talks[0].rival).toEqual({ name: 'Javier', country: 'ES' })
  })

  it('persiste, ignora datos rotos y se borra con el diario', () => {
    const storage = memoryStorage()
    const s = journeyReducer(initialJourney, { type: 'saveTalk', talk })
    saveJourney(s, storage)
    expect(loadJourney(storage).talks).toEqual(s.talks)
    expect(journeyReducer(initialJourney, { type: 'saveTalk', talk: { date: 'x' } })).toBe(initialJourney)
    expect(journeyReducer(s, { type: 'reset' }).talks).toEqual([])
  })
})

describe('borrar el perfil', () => {
  it('borra también las respuestas, la ruta de la maleta y las charlas guardadas', () => {
    let s = journeyReducer(initialJourney, { type: 'saveProfile', profile: { name: 'Ana' } })
    s = journeyReducer(s, { type: 'saveAnswer', questionId: 1, text: 'algo personal' })
    s = journeyReducer(s, {
      type: 'saveTalk',
      talk: {
        id: 't',
        date: '2026-01-01',
        rival: { name: 'Luz' },
        messages: [{ from: 'me', kind: 'answer', text: 'hola' }],
      },
    })
    expect(journeyReducer(s, { type: 'deleteProfile' })).toEqual(initialJourney)
  })
})
