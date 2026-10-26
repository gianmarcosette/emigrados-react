// Temporizador del modo grupal. Se calcula con la hora de fin (no sumando ticks),
// así no se atrasa si el teléfono se pone lento o la pestaña queda en segundo plano.

export const TIMER_OPTIONS = [
  { seconds: 0, label: 'Sin tiempo' },
  { seconds: 60, label: '1 min' },
  { seconds: 120, label: '2 min' },
  { seconds: 180, label: '3 min' },
]

/** "1:05" */
export function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function createTimer(total) {
  return { total, left: total, endsAt: null }
}

export function startTimer(timer, now) {
  if (timer.endsAt || timer.left <= 0) return timer
  return { ...timer, endsAt: now + timer.left * 1000 }
}

export function pauseTimer(timer, now) {
  if (!timer.endsAt) return timer
  return { ...timer, left: secondsLeft(timer, now), endsAt: null }
}

export function secondsLeft(timer, now) {
  if (!timer.endsAt) return timer.left
  return Math.max(0, (timer.endsAt - now) / 1000)
}
