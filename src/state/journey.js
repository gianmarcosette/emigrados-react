// Lógica pura del "viaje" del modo individual: estado, reducer y persistencia.
// Se mantiene sin React para poder testearla con Vitest.

import { normalizeProfile } from './profile.js'

export const STORAGE_KEY = 'emigrados:v1'

export const initialJourney = {
  // Perfil del modo individual ({ name, age, bio, photo, createdAt, updatedAt }) o null
  profile: null,
  // { [questionId]: [{ text, date }] } — cada pregunta guarda todas sus respuestas
  answers: {},
  // Orden en que se respondió cada pregunta por primera vez (ordena las pegatinas de la maleta)
  route: [],
  // Charlas guiadas del modo online que se guardaron en el diario:
  // [{ id, date, rival: { name, country }, messages: [{ from: 'me' | 'them', kind, text }] }]
  talks: [],
}

export function journeyReducer(state, action) {
  switch (action.type) {
    case 'saveProfile':
      return { ...state, profile: action.profile }
    case 'deleteProfile':
      return { ...state, profile: null }
    case 'saveAnswer': {
      const { questionId, text, date = new Date().toISOString() } = action
      const previous = state.answers[questionId] ?? []
      return {
        ...state,
        answers: { ...state.answers, [questionId]: [...previous, { text, date }] },
        route: state.route.includes(questionId) ? state.route : [...state.route, questionId],
      }
    }
    case 'saveTalk': {
      const talk = normalizeTalk(action.talk)
      if (!talk || state.talks.some((t) => t.id === talk.id)) return state
      return { ...state, talks: [...state.talks, talk] }
    }
    case 'import':
      return normalize(action.data)
    case 'reset':
      return { ...initialJourney, profile: state.profile }
    default:
      throw new Error(`Acción desconocida: ${action.type}`)
  }
}

function normalize(data) {
  if (!data || typeof data !== 'object') return initialJourney
  const answers = data.answers && typeof data.answers === 'object' ? data.answers : {}
  const route = Array.isArray(data.route) ? data.route : Object.keys(answers).map(Number)
  const talks = Array.isArray(data.talks) ? data.talks.map(normalizeTalk).filter(Boolean) : []
  // Versiones anteriores guardaban solo `name`: se migra a un perfil incompleto.
  return { profile: normalizeProfile(data.profile, data.name), answers, route, talks }
}

const TALK_FROM = ['me', 'them']
const TALK_KINDS = ['question', 'answer', 'reaction']

function normalizeTalk(talk) {
  if (!talk || typeof talk !== 'object' || typeof talk.date !== 'string') return null
  if (typeof talk.rival?.name !== 'string') return null
  const messages = (Array.isArray(talk.messages) ? talk.messages : []).filter(
    (m) => TALK_FROM.includes(m?.from) && TALK_KINDS.includes(m?.kind) && typeof m.text === 'string',
  )
  if (!messages.length) return null
  return {
    id: String(talk.id ?? talk.date),
    date: talk.date,
    rival: { name: talk.rival.name, country: typeof talk.rival.country === 'string' ? talk.rival.country : null },
    messages: messages.map(({ from, kind, text }) => ({ from, kind, text })),
  }
}

export function loadJourney(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    return raw ? normalize(JSON.parse(raw)) : initialJourney
  } catch {
    return initialJourney
  }
}

export function saveJourney(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sin almacenamiento disponible (modo privado): el juego sigue funcionando en memoria.
  }
}

/**
 * Elige la próxima pregunta. Prioriza las que todavía no se respondieron; si ya
 * se respondieron todas (o se pide `revisit`), elige una ya respondida para
 * poder comparar con lo que se contestó antes.
 */
export function pickQuestion(questions, answers, { excludeId, revisit = false, random = Math.random } = {}) {
  const pool = questions.filter((q) => q.id !== excludeId)
  const answered = pool.filter((q) => answers[q.id]?.length)
  const pending = pool.filter((q) => !answers[q.id]?.length)
  const source = revisit ? answered : pending.length ? pending : answered
  const candidates = source.length ? source : pool
  if (!candidates.length) return null
  return candidates[Math.floor(random() * candidates.length)]
}

export function shuffle(list, random = Math.random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
