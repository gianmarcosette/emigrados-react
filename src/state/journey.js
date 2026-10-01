// Lógica pura del "viaje" del modo individual: estado, reducer y persistencia.
// Se mantiene sin React para poder testearla con Vitest.

export const STORAGE_KEY = 'emigrados:v1'

export const initialJourney = {
  name: '',
  // { [questionId]: [{ text, date }] } — cada pregunta guarda todas sus respuestas
  answers: {},
  // Orden en que se respondió cada pregunta por primera vez (traza la ruta en el mapa)
  route: [],
}

export function journeyReducer(state, action) {
  switch (action.type) {
    case 'setName':
      return { ...state, name: action.name }
    case 'saveAnswer': {
      const { questionId, text, date = new Date().toISOString() } = action
      const previous = state.answers[questionId] ?? []
      return {
        ...state,
        answers: { ...state.answers, [questionId]: [...previous, { text, date }] },
        route: state.route.includes(questionId) ? state.route : [...state.route, questionId],
      }
    }
    case 'import':
      return normalize(action.data)
    case 'reset':
      return { ...initialJourney, name: state.name }
    default:
      throw new Error(`Acción desconocida: ${action.type}`)
  }
}

function normalize(data) {
  if (!data || typeof data !== 'object') return initialJourney
  const answers = data.answers && typeof data.answers === 'object' ? data.answers : {}
  const route = Array.isArray(data.route) ? data.route : Object.keys(answers).map(Number)
  return { name: typeof data.name === 'string' ? data.name : '', answers, route }
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
