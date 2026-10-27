import { useState } from 'react'
import QuestionCard from '../components/QuestionCard.jsx'
import TalkTimer from '../components/TalkTimer.jsx'
import Title from '../components/Title.jsx'
import { CATEGORIES, QUESTIONS } from '../data/questions.js'
import { shuffle } from '../state/journey.js'
import { useConfirm } from '../state/confirm.js'
import { isLastSpeaker, nextSpeaker, speakersStatus, speakingOrder, startRound } from '../lib/groupTurns.js'
import { TIMER_OPTIONS } from '../lib/timer.js'

const MAX_PLAYERS = 12
const BIG_TEXT_KEY = 'emigrados:grupal-letra-grande'

const STATUS_LABEL = { done: 'ya habló', passed: 'pasó', current: 'habla ahora', next: 'después' }

// Letra grande por defecto: el teléfono queda en la mesa y se lee de más lejos.
function readBigText() {
  try {
    return localStorage.getItem(BIG_TEXT_KEY) !== 'no'
  } catch {
    return true
  }
}

// Modo grupal: un solo teléfono en el medio de la mesa y nada se guarda.
// Cada pregunta la contesta toda la mesa, de a uno; recién después se pasa a otra.
export default function Grupal() {
  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState('')
  const [categories, setCategories] = useState(() => CATEGORIES.map((c) => c.key))
  const [deck, setDeck] = useState(null)
  const [index, setIndex] = useState(0)
  const [round, setRound] = useState(startRound)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [bigText, setBigText] = useState(readBigText)
  const confirm = useConfirm()

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
    setRound(startRound())
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

  // Saca otra carta del mazo; si se terminó, se vuelve a mezclar para seguir charlando.
  function drawCard() {
    if (index + 1 >= deck.length) {
      setDeck(shuffle(deck))
      setIndex(0)
    } else {
      setIndex((i) => i + 1)
    }
    window.scrollTo({ top: 0 })
  }

  function finishSpeaker({ pass = false } = {}) {
    const last = isLastSpeaker(round, players.length)
    setRound((r) => nextSpeaker(r, players.length, { pass }))
    if (last) drawCard()
  }

  if (deck) {
    const question = deck[index]
    const named = players.length > 0
    const order = speakersStatus(round, players.length)
    const current = named ? players[order[round.step].player] : null
    const last = isLastSpeaker(round, players.length)
    const following = named && !last ? players[order[round.step + 1].player] : null
    const nextOpener = named ? players[speakingOrder(players.length, round.question + 1)[0]] : null

    return (
      <div className={`page grupal ${bigText ? 'grupal--big' : ''}`}>
        <div className="toolbar">
          <span className="pill">Grupal</span>
          <span className="toolbar__count">Pregunta {round.question + 1}</span>
          <button
            type="button"
            className="btn btn--text grupal__size"
            aria-pressed={bigText}
            title="Letra grande para la mesa"
            onClick={toggleBigText}
          >
            <span aria-hidden="true">A+</span>
            <span className="grupal__size-text">Letra para la mesa</span>
          </button>
          <button type="button" className="btn btn--text" onClick={endGame}>
            Terminar partida
          </button>
        </div>

        {named && (
          <>
            {/* Quién ya habló y quién sigue, en el orden de esta pregunta */}
            <ol className="speakers" aria-label="Orden para esta pregunta">
              {order.map(({ player, status }) => (
                <li key={player} className={`speaker speaker--${status}`}>
                  <span className="speaker__mark" aria-hidden="true">
                    {status === 'done' ? '✓' : status === 'passed' ? '–' : players[player][0].toUpperCase()}
                  </span>
                  <span className="speaker__name">{players[player]}</span>
                  <span className="sr-only">, {STATUS_LABEL[status]}</span>
                </li>
              ))}
            </ol>
            <p className="sr-only" aria-live="polite">
              Le toca a {current}
            </p>
          </>
        )}

        <QuestionCard
          question={question}
          eyebrow={`Carta ${index + 1} de ${deck.length}`}
          passenger={current ?? 'Toda la mesa'}
        >
          <p className="group-hint">
            {!named
              ? 'Respondan todos, de a uno. Cuando la mesa haya hablado, pasen a la siguiente.'
              : round.step === 0
                ? `${current} abre la pregunta. Después responde cada uno, de a uno.`
                : `Ahora ${current} cuenta lo suyo con la misma pregunta.`}
          </p>
          {/* key: el reloj vuelve a cero con cada persona que habla */}
          {timerSeconds > 0 && <TalkTimer key={`${round.question}-${round.step}`} seconds={timerSeconds} />}
          <div className="actions actions--end">
            {named && round.step === 0 && (
              <button type="button" className="btn btn--text" onClick={drawCard}>
                Cambiar pregunta
              </button>
            )}
            {named && (
              // Nadie está obligado a contestar
              <button type="button" className="btn btn--ghost" onClick={() => finishSpeaker({ pass: true })}>
                {current} prefiere pasar
              </button>
            )}
            <button type="button" className="btn btn--primary" onClick={() => finishSpeaker()}>
              {following
                ? `Listo, sigue ${following} »`
                : named && players.length > 1
                  ? `Siguiente pregunta: abre ${nextOpener} »`
                  : 'Siguiente pregunta »'}
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
          Sumá a quienes van a jugar: cada pregunta la contesta toda la mesa, de a uno, y quien la abre va rotando. Si
          preferís, también pueden jugar sin nombres.
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
