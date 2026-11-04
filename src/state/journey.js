// Lógica pura del "viaje" del modo individual: estado, reducer y persistencia.
// Se mantiene sin React para poder testearla con Vitest.

import { QUESTIONS_VERSION, RETIRED_QUESTIONS } from '../data/questions.js'
import { normalizeLetter } from '../lib/letter.js'
import { clearDraft } from './drafts.js'
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
  // Respuestas a preguntas que ya no están en el juego (se cambiaron por otras). Siguen en el
  // diario con su pregunta original: [{ questionId, question, text, date }]
  archive: [],
  // Cartas al futuro: [{ id, text, writtenAt, openOn: 'AAAA-MM-DD', openedAt?, reply?: { text, date } }]
  letters: [],
  // Versión del banco de preguntas con la que se guardó lo de arriba
  questionsVersion: QUESTIONS_VERSION,
}

export function journeyReducer(state, action) {
  switch (action.type) {
    case 'saveProfile':
      return { ...state, profile: action.profile }
    // Borrar el perfil borra todo lo personal: respuestas, maleta y charlas guardadas
    case 'deleteProfile':
      return initialJourney
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
    // Carta al futuro: se cierra, se abre el día elegido y se le puede contestar
    case 'sealLetter': {
      const letter = normalizeLetter(action.letter)
      if (!letter || state.letters.some((l) => l.id === letter.id)) return state
      return { ...state, letters: [...state.letters, letter] }
    }
    case 'openLetter':
      return updateLetter(state, action.id, (l) =>
        l.openedAt ? l : { ...l, openedAt: action.date ?? new Date().toISOString() },
      )
    case 'replyLetter':
      return updateLetter(state, action.id, (l) =>
        l.openedAt ? { ...l, reply: { text: action.text, date: action.date ?? new Date().toISOString() } } : l,
      )
    case 'deleteLetter':
      return { ...state, letters: state.letters.filter((l) => l.id !== action.id) }
    case 'import':
      return normalize(action.data)
    // Borrar el diario no borra las cartas al futuro: son aparte, y puede haber alguna cerrada
    case 'reset':
      return { ...initialJourney, profile: state.profile, letters: state.letters }
    default:
      throw new Error(`Acción desconocida: ${action.type}`)
  }
}

function updateLetter(state, id, change) {
  return { ...state, letters: state.letters.map((l) => (l.id === id ? change(l) : l)) }
}

function normalize(data) {
  if (!data || typeof data !== 'object') return initialJourney
  const answers = data.answers && typeof data.answers === 'object' ? { ...data.answers } : {}
  let route = Array.isArray(data.route) ? data.route : Object.keys(answers).map(Number)
  const talks = Array.isArray(data.talks) ? data.talks.map(normalizeTalk).filter(Boolean) : []
  const archive = Array.isArray(data.archive) ? data.archive.filter(isArchived) : []
  const letters = Array.isArray(data.letters) ? data.letters.map(normalizeLetter).filter(Boolean) : []
  // Si una pregunta cambió por otra desde que se guardó, lo respondido pasa al archivo con su
  // pregunta original, y la pregunta nueva queda por responder.
  const version = Number.isInteger(data.questionsVersion) ? data.questionsVersion : 1
  for (let v = version + 1; v <= QUESTIONS_VERSION; v++) {
    for (const [id, question] of Object.entries(RETIRED_QUESTIONS[v] ?? {})) {
      const list = answers[id]
      if (!Array.isArray(list)) continue
      for (const a of list) archive.push({ questionId: Number(id), question, text: a.text, date: a.date })
      delete answers[id]
      route = route.filter((r) => String(r) !== id)
    }
  }
  // Versiones anteriores guardaban solo `name`: se migra a un perfil incompleto.
  return {
    profile: normalizeProfile(data.profile, data.name),
    answers,
    route,
    talks,
    archive,
    letters,
    questionsVersion: QUESTIONS_VERSION,
  }
}

function isArchived(a) {
  return (
    a &&
    Number.isInteger(a.questionId) &&
    typeof a.question === 'string' &&
    typeof a.text === 'string' &&
    typeof a.date === 'string'
  )
}

/** Los borradores de las preguntas que cambiaron se descartan: eran para la pregunta vieja. */
function dropRetiredDrafts(version, storage) {
  for (let v = version + 1; v <= QUESTIONS_VERSION; v++) {
    for (const id of Object.keys(RETIRED_QUESTIONS[v] ?? {})) clearDraft(Number(id), storage)
  }
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
    if (!raw) return initialJourney
    const data = JSON.parse(raw)
    const version = Number.isInteger(data?.questionsVersion) ? data.questionsVersion : 1
    if (version < QUESTIONS_VERSION) dropRetiredDrafts(version, storage)
    return normalize(data)
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
export function pickQuestion(
  questions,
  answers,
  { excludeId, revisit = false, gentle = false, random = Math.random } = {},
) {
  const pool = questions.filter((q) => q.id !== excludeId)
  const answered = pool.filter((q) => answers[q.id]?.length)
  const pending = pool.filter((q) => !answers[q.id]?.length)
  const source = revisit ? answered : pending.length ? pending : answered
  let candidates = source.length ? source : pool
  // Con `gentle` (al empezar, o después de una pregunta profunda) se evita otra profunda, si hay
  const lighter = candidates.filter((q) => q.depth !== DEEP)
  if (gentle && lighter.length) candidates = lighter
  if (!candidates.length) return null
  return candidates[Math.floor(random() * candidates.length)]
}

/** Intensidad de las preguntas que más remueven (ver data/questions.js). */
export const DEEP = 3

/**
 * Ordena un mazo ya mezclado para dosificar: no arranca con una pregunta profunda y no
 * pone dos profundas seguidas, mientras alcancen las otras para separarlas.
 */
export function paceDeck(deck) {
  const deep = deck.filter((q) => q.depth === DEEP)
  const rest = deck.filter((q) => q.depth !== DEEP)
  // Cada cuántas preguntas livianas o medias va una profunda, para repartirlas en toda la partida
  const gap = deep.length ? Math.max(1, Math.floor(rest.length / deep.length)) : Infinity
  const paced = []
  let since = 0
  while (deep.length || rest.length) {
    if (deep.length && (since >= gap || !rest.length)) {
      paced.push(deep.shift())
      since = 0
    } else {
      paced.push(rest.shift())
      since++
    }
  }
  return paced
}

export function shuffle(list, random = Math.random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
