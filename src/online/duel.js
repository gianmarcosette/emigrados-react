// Reglas del duelo del modo online (sin React ni red, para testear).
// En cada ronda vos respondés sobre el país de tu rival y tu rival, sobre el tuyo.
import { triviaFor } from '../data/trivia.js'

export const ROUNDS = 5
export const ANSWER_SECONDS = 20

export function shuffle(list, random = Math.random) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Mezcla las opciones y recuerda dónde quedó la correcta (en los datos siempre es la primera).
function prepare(question, random) {
  const order = shuffle(
    question.options.map((_, i) => i),
    random,
  )
  return {
    text: question.text,
    options: order.map((i) => question.options[i]),
    answer: order.indexOf(0),
    fact: question.fact,
  }
}

/**
 * Arma un duelo nuevo.
 * - target: país sobre el que preguntás (donde vive tu rival)
 * - home: país donde vivís (sobre el que pregunta tu rival)
 */
export function buildDuel({ target, home, rounds = ROUNDS, random = Math.random }) {
  const mine = shuffle(triviaFor(target), random).slice(0, rounds)
  const theirs = shuffle(triviaFor(home), random).slice(0, rounds)
  return {
    target,
    home,
    index: 0,
    finished: false,
    rounds: mine.map((question, i) => ({
      mine: prepare(question, random),
      theirs: prepare(theirs[i], random),
      // undefined: todavía no respondió; null: se le acabó el tiempo
      myChoice: undefined,
      theirChoice: undefined,
    })),
  }
}

export function roundDone(round) {
  return round.myChoice !== undefined && round.theirChoice !== undefined
}

function updateRound(duel, field, choice) {
  const round = duel.rounds[duel.index]
  if (duel.finished || round[field] !== undefined) return duel
  const rounds = duel.rounds.map((r, i) => (i === duel.index ? { ...r, [field]: choice } : r))
  return { ...duel, rounds }
}

export function duelReducer(duel, action) {
  switch (action.type) {
    case 'answer':
      return updateRound(duel, 'myChoice', action.choice ?? null)
    case 'opponentAnswer':
      return updateRound(duel, 'theirChoice', action.choice ?? null)
    case 'next': {
      if (duel.finished || !roundDone(duel.rounds[duel.index])) return duel
      const last = duel.index === duel.rounds.length - 1
      return last ? { ...duel, finished: true } : { ...duel, index: duel.index + 1 }
    }
    default:
      return duel
  }
}

export function isCorrect(question, choice) {
  return choice !== undefined && choice !== null && choice === question.answer
}

export function score(duel) {
  return duel.rounds.reduce(
    (acc, r) => ({
      me: acc.me + (isCorrect(r.mine, r.myChoice) ? 1 : 0),
      them: acc.them + (isCorrect(r.theirs, r.theirChoice) ? 1 : 0),
    }),
    { me: 0, them: 0 },
  )
}

/** 'win' | 'lose' | 'tie' */
export function outcome(duel) {
  const { me, them } = score(duel)
  return me > them ? 'win' : me < them ? 'lose' : 'tie'
}
