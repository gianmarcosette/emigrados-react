import { useEffect, useRef, useState } from 'react'
import QuestionCard from '../components/QuestionCard.jsx'
import TalkTimer from '../components/TalkTimer.jsx'
import Title from '../components/Title.jsx'
import { CATEGORIES, QUESTIONS } from '../data/questions.js'
import { shuffle } from '../state/journey.js'
import { useWindowScene } from '../state/scene.js'
import { useConfirm } from '../state/confirm.js'
import { TIMER_OPTIONS } from '../lib/timer.js'

const MAX_PLAYERS = 12
const BIG_TEXT_KEY = 'emigrados:grupal-letra-grande'

// Letra grande por defecto: el teléfono queda en la mesa y se lee de más lejos.
function readBigText() {
  try {
    return localStorage.getItem(BIG_TEXT_KEY) !== 'no'
  } catch {
    return true
  }
}

// Modo grupal: nada se guarda. Solo vive en el estado de este componente.
export default function Grupal() {
  useWindowScene('clouds')
  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState('')
  const [categories, setCategories] = useState(() => CATEGORIES.map((c) => c.key))
  const [deck, setDeck] = useState(null)
  const [index, setIndex] = useState(0)
  const [turn, setTurn] = useState(0)
  // Pantalla de "Pasale el teléfono a…": tapa la pregunta hasta que llega a la mano correcta
  const [handoff, setHandoff] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [bigText, setBigText] = useState(readBigText)
  const handoffRef = useRef(null)
  const confirm = useConfirm()
  // Al pasar el teléfono, el lector de pantalla anuncia a quién le toca
  useEffect(() => {
    if (!handoff) return
    // La tarjeta queda arriba de todo, con el botón a la vista aunque la pantalla sea chica
    const card = handoffRef.current?.closest('.handoff')
    card?.scrollIntoView({ block: 'start' })
    handoffRef.current?.focus({ preventScroll: true })
  }, [handoff, turn])
  // Con una sola persona no hace falta pasar el teléfono
  const passing = players.length >= 2

  function toggleBigText() {
    setBigText((on) => {
      try {
        localStorage.setItem(BIG_TEXT_KEY, on ? 'no' : 'si')
      } catch {
        // Sin almacenamiento igual funciona, solo no se recuerda
      }
      return !on
    })
  }

  function addPlayer(e) {
    e.preventDefault()
    const name = newPlayer.trim()
    if (!name || players.length >= MAX_PLAYERS) return
    setPlayers((list) => [...list, name])
    setNewPlayer('')
  }

  function removePlayer(i) {
    setPlayers((list) => list.filter((_, j) => j !== i))
  }

  function toggleCategory(key) {
    setCategories((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]))
  }

  function start() {
    setDeck(shuffle(QUESTIONS.filter((q) => categories.includes(q.category))))
    setIndex(0)
    setTurn(0)
    setHandoff(passing)
  }

  async function endGame() {
    const ok = await confirm({
      title: '¿Terminar la partida?',
      message: 'Vuelven a la pantalla para armar la ronda. Como en todo el modo grupal, no se guarda nada.',
      confirmLabel: 'Terminar',
      cancelLabel: 'Seguir jugando',
    })
    if (ok) setDeck(null)
  }

  function advance({ passTurn }) {
    if (index + 1 >= deck.length) {
      // Se terminó el mazo: se vuelve a mezclar para seguir charlando.
      setDeck(shuffle(deck))
      setIndex(0)
    } else {
      setIndex((i) => i + 1)
    }
    if (passTurn) {
      setTurn((t) => t + 1)
      setHandoff(passing)
    }
    // La pregunta nueva arranca desde arriba
    window.scrollTo({ top: 0 })
  }

  if (deck) {
    const question = deck[index]
    const current = players.length ? players[turn % players.length] : null
    const round = players.length ? Math.floor(turn / players.length) + 1 : null
    const toolbar = (
      <div className="toolbar">
        <span className="pill">Grupal</span>
        <span className="toolbar__count">
          Pregunta {turn + 1}
          {round ? ` · Ronda ${round}` : ''}
        </span>
        <button
          type="button"
          className="btn btn--text grupal__size"
          aria-pressed={bigText}
          title="Letra grande"
          onClick={toggleBigText}
        >
          <span aria-hidden="true">Aa</span>
          <span className="grupal__size-text">Letra grande</span>
        </button>
        <button type="button" className="btn btn--text" onClick={endGame}>
          Terminar partida
        </button>
      </div>
    )

    if (handoff && current) {
      return (
        <div className={`page grupal ${bigText ? 'grupal--big' : ''}`}>
          {toolbar}
          <section className="handoff" aria-labelledby="handoff-title">
            <span className="avatar handoff__avatar" aria-hidden="true">
              {current[0].toUpperCase()}
            </span>
            <p className="handoff__eyebrow">Pasale el teléfono a</p>
            <h1 id="handoff-title" className="handoff__name" tabIndex={-1} ref={handoffRef}>
              {current}
            </h1>
            <p className="handoff__hint">La pregunta está tapada para que nadie la vea antes de tiempo.</p>
            <button type="button" className="btn btn--primary btn--block handoff__go" onClick={() => setHandoff(false)}>
              Soy {current}, ver mi pregunta
            </button>
          </section>
        </div>
      )
    }

    return (
      <div className={`page grupal ${bigText ? 'grupal--big' : ''}`}>
        {toolbar}

        {current && (
          <div className="turn" aria-live="polite">
            <span className="avatar" aria-hidden="true">
              {current[0].toUpperCase()}
            </span>
            <span>
              Le toca a <strong>{current}</strong>
            </span>
            <span className="turn__queue">Después: {players[(turn + 1) % players.length]}</span>
          </div>
        )}

        <QuestionCard
          question={question}
          eyebrow={`Carta ${index + 1} de ${deck.length}`}
          passenger={current ?? 'Toda la mesa'}
        >
          <p className="group-hint">
            Respondé en voz alta. Después, cualquiera puede sumar su experiencia: ¿a alguien más le pasó algo parecido?
          </p>
          {/* key: el reloj vuelve a cero con cada pregunta */}
          {timerSeconds > 0 && <TalkTimer key={`${turn}-${index}`} seconds={timerSeconds} />}
          <div className="actions actions--end">
            {/* Cada botón dice qué pasa: otra pregunta para quien juega, o pasarle el turno a alguien */}
            <button type="button" className="btn btn--ghost" onClick={() => advance({ passTurn: false })}>
              {current ? `Otra pregunta para ${current}` : 'Otra pregunta'}
            </button>
            <button type="button" className="btn btn--primary" onClick={() => advance({ passTurn: true })}>
              {current ? `Turno de ${players[(turn + 1) % players.length]} »` : 'Siguiente pregunta »'}
            </button>
          </div>
        </QuestionCard>
        <p className="muted center">
          En el modo grupal no se guarda nada. Lo que se dice en la mesa, queda en la mesa.
        </p>
      </div>
    )
  }

  return (
    <div className="page page--narrow">
      <section className="panel">
        <Title>Armá la ronda</Title>
        <p className="muted">
          Sumá a quienes van a jugar para que las preguntas vayan rotando. Si preferís, también pueden jugar sin
          nombres.
        </p>

        <form className="inline-form" onSubmit={addPlayer}>
          <label htmlFor="player" className="sr-only">
            Nombre del jugador
          </label>
          <input
            id="player"
            type="text"
            value={newPlayer}
            maxLength={20}
            placeholder="Nombre de un jugador"
            onChange={(e) => setNewPlayer(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn--ghost"
            disabled={!newPlayer.trim() || players.length >= MAX_PLAYERS}
          >
            Sumar
          </button>
        </form>

        {players.length > 0 && (
          <ul className="players">
            {players.map((p, i) => (
              <li key={p + i} className="player">
                <span className="avatar avatar--sm" aria-hidden="true">
                  {p[0].toUpperCase()}
                </span>
                {p}
                <button
                  type="button"
                  className="player__remove"
                  aria-label={`Quitar a ${p}`}
                  onClick={() => removePlayer(i)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <h2 className="panel__subtitle">¿De qué quieren hablar?</h2>
        <div className="chips">
          {CATEGORIES.map((c) => {
            const active = categories.includes(c.key)
            return (
              <button
                key={c.key}
                type="button"
                className={`chip chip--toggle ${active ? 'chip--on' : ''}`}
                aria-pressed={active}
                onClick={() => toggleCategory(c.key)}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        <h2 className="panel__subtitle" id="timer-title">
          ¿Tiempo para hablar?
        </h2>
        <p className="muted grupal__note">
          Un reloj opcional para que todos tengan su momento. Arranca cuando lo tocan.
        </p>
        <div className="chips" role="group" aria-labelledby="timer-title">
          {TIMER_OPTIONS.map((o) => (
            <button
              key={o.seconds}
              type="button"
              className={`chip chip--toggle ${timerSeconds === o.seconds ? 'chip--on' : ''}`}
              aria-pressed={timerSeconds === o.seconds}
              onClick={() => setTimerSeconds(o.seconds)}
            >
              {o.label}
            </button>
          ))}
        </div>

        {!categories.length && (
          <p className="field__error" role="status">
            Elegí al menos una etapa para empezar.
          </p>
        )}
        <button type="button" className="btn btn--primary btn--block" disabled={!categories.length} onClick={start}>
          {players.length
            ? `Empezar con ${players.length} jugador${players.length === 1 ? '' : 'es'}`
            : 'Empezar sin nombres'}{' '}
          »
        </button>
      </section>
    </div>
  )
}
