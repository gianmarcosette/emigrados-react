import { useState } from 'react'
import QuestionCard from '../components/QuestionCard.jsx'
import { CATEGORIES, QUESTIONS } from '../data/questions.js'
import { shuffle } from '../state/journey.js'

const MAX_PLAYERS = 12

// Modo grupal: nada se guarda. Solo vive en el estado de este componente.
export default function Grupal() {
  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState('')
  const [categories, setCategories] = useState(() => CATEGORIES.map((c) => c.key))
  const [deck, setDeck] = useState(null)
  const [index, setIndex] = useState(0)
  const [turn, setTurn] = useState(0)

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
  }

  function advance({ passTurn }) {
    if (index + 1 >= deck.length) {
      // Se terminó el mazo: se vuelve a mezclar para seguir charlando.
      setDeck(shuffle(deck))
      setIndex(0)
    } else {
      setIndex((i) => i + 1)
    }
    if (passTurn) setTurn((t) => t + 1)
  }

  if (deck) {
    const question = deck[index]
    const current = players.length ? players[turn % players.length] : null
    const round = players.length ? Math.floor(turn / players.length) + 1 : null
    return (
      <div className="page">
        <div className="toolbar">
          <span className="pill">Grupal</span>
          <span className="toolbar__count">
            Pregunta {turn + 1}
            {round ? ` · Ronda ${round}` : ''}
          </span>
          <button type="button" className="btn btn--text" onClick={() => setDeck(null)}>
            Terminar partida
          </button>
        </div>

        {current && (
          <div className="turn" aria-live="polite">
            <span className="avatar" aria-hidden="true">
              {current[0].toUpperCase()}
            </span>
            <span>
              Le toca a <strong>{current}</strong>
            </span>
            <span className="turn__queue">
              Después: {players[(turn + 1) % players.length]}
            </span>
          </div>
        )}

        <QuestionCard question={question} eyebrow={`Carta ${index + 1} de ${deck.length}`}>
          <p className="group-hint">
            Respondé en voz alta. Después, cualquiera puede sumar su experiencia: ¿a alguien más le pasó algo parecido?
          </p>
          <div className="actions actions--end">
            <button type="button" className="btn btn--ghost" onClick={() => advance({ passTurn: false })}>
              Cambiar pregunta
            </button>
            <button type="button" className="btn btn--primary" onClick={() => advance({ passTurn: true })}>
              Siguiente »
            </button>
          </div>
        </QuestionCard>
        <p className="muted center">🔒 En el modo grupal no se guarda nada. Lo que se dice en la mesa, queda en la mesa.</p>
      </div>
    )
  }

  return (
    <div className="page page--narrow">
      <section className="panel">
        <h1>Armá la ronda</h1>
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
          <button type="submit" className="btn btn--ghost" disabled={!newPlayer.trim() || players.length >= MAX_PLAYERS}>
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
                <button type="button" className="player__remove" aria-label={`Quitar a ${p}`} onClick={() => removePlayer(i)}>
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
                style={active ? { background: c.color } : undefined}
                aria-pressed={active}
                onClick={() => toggleCategory(c.key)}
              >
                {c.emoji} {c.label}
              </button>
            )
          })}
        </div>

        <button type="button" className="btn btn--primary btn--block" disabled={!categories.length} onClick={start}>
          {players.length ? `Empezar con ${players.length} jugador${players.length === 1 ? '' : 'es'}` : 'Empezar sin nombres'} »
        </button>
      </section>
    </div>
  )
}
