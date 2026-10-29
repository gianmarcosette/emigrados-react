// Turnos del modo grupal: cada pregunta la contesta toda la mesa, de a uno.
// Quien abre va rotando (la pregunta 1 la abre el primero, la 2 el segundo…),
// así nadie tiene que arrancar siempre en frío.

export function startRound() {
  return { question: 0, step: 0 }
}

/** Índices de los jugadores en el orden en que hablan para esta pregunta. */
export function speakingOrder(count, question) {
  return Array.from({ length: count }, (_, i) => (question + i) % count)
}

export function isLastSpeaker(state, count) {
  return state.step >= count - 1
}

/** Termina de hablar quien tiene el turno. Después del último, pregunta nueva. */
export function nextSpeaker(state, count) {
  if (count > 0 && state.step + 1 < count) return { ...state, step: state.step + 1 }
  return { question: state.question + 1, step: 0 }
}

/** Estado de cada jugador en la pregunta actual, en orden de habla. */
export function speakersStatus(state, count) {
  return speakingOrder(count, state.question).map((player, i) => ({
    player,
    status: i < state.step ? 'done' : i === state.step ? 'current' : 'next',
  }))
}
