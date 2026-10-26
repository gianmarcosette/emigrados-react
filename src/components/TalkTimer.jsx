import { useEffect, useState } from 'react'
import { createTimer, formatClock, pauseTimer, secondsLeft, startTimer } from '../lib/timer.js'

// Reloj para que todos tengan su momento de hablar. No arranca solo: la persona
// primero lee la pregunta tranquila y lo pone en marcha cuando empieza a contar.
// Al terminar no suena nada (puede haber alguien emocionado): vibra y lo dice.
export default function TalkTimer({ seconds }) {
  const [timer, setTimer] = useState(() => createTimer(seconds))
  const [now, setNow] = useState(() => Date.now())
  const running = Boolean(timer.endsAt)
  const left = secondsLeft(timer, now)
  const done = left <= 0

  useEffect(() => {
    if (!timer.endsAt) return
    const id = setInterval(() => {
      const at = Date.now()
      setNow(at)
      if (secondsLeft(timer, at) <= 0) {
        setTimer(pauseTimer(timer, at))
        navigator.vibrate?.(200)
      }
    }, 250)
    return () => clearInterval(id)
  }, [timer])

  function toggle() {
    const at = Date.now()
    setNow(at)
    setTimer((t) => (t.endsAt ? pauseTimer(t, at) : startTimer(t, at)))
  }

  function restart() {
    setNow(Date.now())
    setTimer(createTimer(seconds))
  }

  const progress = left / seconds
  return (
    <div className={`talk-timer ${done ? 'is-done' : ''}`}>
      <div className="talk-timer__clock">
        <span className="talk-timer__time" aria-hidden="true">
          {formatClock(left)}
        </span>
        <span className="sr-only">{`Tiempo restante: ${formatClock(left)}`}</span>
        <span className="talk-timer__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
      {done ? (
        <>
          <p className="talk-timer__msg" role="status">
            Se terminó el tiempo. ¿Alguien quiere sumar algo antes de pasar?
          </p>
          <button type="button" className="btn btn--ghost" onClick={restart}>
            Otra vuelta de reloj
          </button>
        </>
      ) : (
        <div className="talk-timer__actions">
          <button type="button" className="btn btn--ghost" onClick={toggle}>
            {running ? 'Pausar' : left < seconds ? 'Seguir' : 'Empezar a contar'}
          </button>
          {left < seconds && (
            <button type="button" className="btn btn--text" onClick={restart}>
              Reiniciar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
