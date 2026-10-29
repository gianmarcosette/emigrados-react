// Reglas del duelo del modo online (sin React ni red, para testear).
// Vos respondés sobre el país de tu rival y tu rival, sobre el tuyo. El duelo no es en
// vivo: cada persona responde a su ritmo, cuando puede (hay mucha diferencia horaria
// entre países). Las respuestas del otro se ven recién cuando terminaron los dos, y ahí
// se abre el chat. Importa más tener ganas de conectar que estar conectados a la vez.
import { triviaFor } from '../data/trivia.js'

export const ROUNDS = 5
// Tiempo para que respondan los dos; después el duelo vence (no es culpa de nadie)
export const DEADLINE_HOURS = 72
// Duelos abiertos a la vez: así nadie queda esperando a una sola persona
export const MAX_OPEN_DUELS = 3

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
 * Las preguntas de un duelo.
 * - target: país sobre el que preguntás (donde vive tu rival)
 * - home: país donde vivís (sobre el que pregunta tu rival)
 */
export function buildRounds({ target, home, rounds = ROUNDS, random = Math.random }) {
  const mine = shuffle(triviaFor(target), random).slice(0, rounds)
  const theirs = shuffle(triviaFor(home), random).slice(0, rounds)
  return mine.map((question, i) => ({
    mine: prepare(question, random),
    theirs: prepare(theirs[i], random),
    // undefined: todavía no respondió
    myChoice: undefined,
  }))
}

/** Un duelo nuevo con alguien que vive en otro país. Las fechas van en ISO. */
export function createDuel({ id, rival, home, now = new Date(), random = Math.random }) {
  const start = new Date(now)
  return {
    id: id ?? `duelo-${start.getTime()}-${Math.floor(random() * 1e6)}`,
    createdAt: start.toISOString(),
    deadline: new Date(start.getTime() + DEADLINE_HOURS * 3600000).toISOString(),
    rival,
    target: rival.country,
    home,
    rounds: buildRounds({ target: rival.country, home, random }),
    // Lo que respondió tu rival: llega del servidor cuando termina todo (null hasta entonces)
    theirChoices: null,
    theirDoneAt: null,
    myDoneAt: null,
  }
}

/** Cuántas preguntas respondiste. */
export function myProgress(duel) {
  return duel.rounds.filter((r) => r.myChoice !== undefined).length
}

export function isMyTurnDone(duel) {
  return myProgress(duel) === duel.rounds.length
}

/** La pregunta que te toca, o null si ya respondiste todas. */
export function currentRound(duel) {
  const index = duel.rounds.findIndex((r) => r.myChoice === undefined)
  return index === -1 ? null : { index, round: duel.rounds[index] }
}

/** Respondés la pregunta que te toca. No se puede cambiar una respuesta ni responder un duelo vencido. */
export function answer(duel, choice, now = new Date()) {
  const current = currentRound(duel)
  if (!current || duelStatus(duel, now) === 'expired') return duel
  const rounds = duel.rounds.map((r, i) => (i === current.index ? { ...r, myChoice: choice } : r))
  const done = rounds.every((r) => r.myChoice !== undefined)
  return { ...duel, rounds, myDoneAt: done ? new Date(now).toISOString() : null }
}

/** Llegan las respuestas de tu rival (cuando terminó las suyas). */
export function receiveRival(duel, { choices, at }) {
  if (duel.theirChoices || !Array.isArray(choices) || choices.length !== duel.rounds.length) return duel
  return { ...duel, theirChoices: choices, theirDoneAt: new Date(at).toISOString() }
}

/**
 * En qué está el duelo:
 * - 'yourTurn': te faltan preguntas
 * - 'waiting': ya terminaste; falta tu rival
 * - 'ready': terminaron los dos, se ven los resultados y se abre el chat
 * - 'expired': se pasó el plazo sin que terminaran los dos
 */
export function duelStatus(duel, now = new Date()) {
  const mine = isMyTurnDone(duel)
  if (mine && duel.theirChoices) return 'ready'
  if (new Date(now) > new Date(duel.deadline)) return 'expired'
  return mine ? 'waiting' : 'yourTurn'
}

/** Duelos que todavía esperan a alguien (los que cuentan para el máximo de abiertos). */
export function openDuels(duels, now = new Date()) {
  return duels.filter((d) => ['yourTurn', 'waiting'].includes(duelStatus(d, now)))
}

/** Horas que quedan para el plazo (redondeadas hacia arriba), 0 si ya venció. */
export function hoursLeft(duel, now = new Date()) {
  return Math.max(0, Math.ceil((new Date(duel.deadline) - new Date(now)) / 3600000))
}

export function isCorrect(question, choice) {
  return choice !== undefined && choice !== null && choice === question.answer
}

/** Tus aciertos (y los de tu rival, si ya llegaron sus respuestas). */
export function score(duel) {
  return duel.rounds.reduce(
    (acc, r, i) => ({
      me: acc.me + (isCorrect(r.mine, r.myChoice) ? 1 : 0),
      them: acc.them + (isCorrect(r.theirs, duel.theirChoices?.[i]) ? 1 : 0),
    }),
    { me: 0, them: 0 },
  )
}

/** 'win' | 'lose' | 'tie' */
export function outcome(duel) {
  const { me, them } = score(duel)
  return me > them ? 'win' : me < them ? 'lose' : 'tie'
}
