import { useEffect, useReducer, useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import CountryShape from '../components/CountryShape.jsx'
import Title from '../components/Title.jsx'
import { countryName } from '../data/residence.js'
import { TRIVIA, hasTrivia } from '../data/trivia.js'
import { ANSWER_SECONDS, ROUNDS, buildDuel, duelReducer, isCorrect, outcome, roundDone, score } from '../online/duel.js'
import { findOpponent, getOnlineCountries, opponentAnswer } from '../online/mockServer.js'
import { useWindowScene } from '../state/scene.js'
import { useJourney } from '../state/useJourney.js'

// Modo online (versión de prueba): elegís un país, te conectamos con alguien que vive ahí
// y se desafían con preguntas de cultura general sobre el país del otro.
// Las personas conectadas son simuladas (ver online/mockServer.js). El perfil lo pide ProfileGate.
export default function Online() {
  useWindowScene('clouds')
  const { profile } = useJourney()
  const [screen, setScreen] = useState({ name: 'lobby' })

  const toLobby = () => setScreen({ name: 'lobby' })

  if (screen.name === 'searching') {
    return (
      <Searching
        code={screen.code}
        me={profile}
        onFound={(rival) => setScreen({ name: 'found', code: screen.code, rival })}
        onCancel={toLobby}
      />
    )
  }
  if (screen.name === 'found') {
    return (
      <Found
        me={profile}
        rival={screen.rival}
        onStart={() => setScreen({ name: 'duel', rival: screen.rival, key: Date.now() })}
        onAnother={() => setScreen({ name: 'searching', code: screen.code })}
        onCancel={toLobby}
      />
    )
  }
  if (screen.name === 'duel') {
    return (
      <Duel
        key={screen.key}
        me={profile}
        rival={screen.rival}
        onRematch={() => setScreen({ ...screen, key: Date.now() })}
        onExit={toLobby}
      />
    )
  }
  return <Lobby me={profile} onPick={(code) => setScreen({ name: 'searching', code })} />
}

function TrialNote() {
  return <p className="online-trial">Versión de prueba · las personas conectadas son simuladas</p>
}

function Lobby({ me, onPick }) {
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    let active = true
    getOnlineCountries(me).then((list) => active && setCountries(list))
    return () => {
      active = false
    }
  }, [me])

  return (
    <div className="page">
      <header className="page__header">
        <p className="kicker">Online</p>
        <Title>¿Sobre qué país te gustaría saber?</Title>
        <p className="muted">
          Te conectamos con alguien que vive ahí y se desafían: vos respondés sobre su país y esa persona, sobre el
          tuyo. Gana quien sepa más del país del otro.
        </p>
        <TrialNote />
      </header>

      {!hasTrivia(me.country) && (
        <p className="online-note">
          Todavía no hay preguntas sobre {countryName(me.country)}: tu rival va a responder preguntas de cultura
          general.
        </p>
      )}

      {!countries && <p className="online-loading">Viendo quién está conectado…</p>}
      {countries && countries.length === 0 && (
        <p className="online-loading">Ahora no hay nadie conectado. Probá de nuevo en unos minutos.</p>
      )}
      {countries && countries.length > 0 && (
        <ul className="online-countries">
          {countries.map(({ code, count }) => (
            <li key={code}>
              <button type="button" className="online-country" onClick={() => onPick(code)}>
                <CountryShape country={{ id: TRIVIA[code].mapId, name: countryName(code) }} />
                <strong>{countryName(code)}</strong>
                <span>
                  <i className="online-dot" aria-hidden="true" />
                  {count} en línea
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Searching({ code, me, onFound, onCancel }) {
  useEffect(() => {
    let active = true
    findOpponent(code, me).then((rival) => active && onFound(rival))
    return () => {
      active = false
    }
    // Solo se busca una vez por pantalla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  return (
    <div className="page page--narrow">
      <section className="online-search" aria-live="polite">
        <div className="radar" aria-hidden="true">
          <span />
          <span />
          <span />
          <CountryShape country={{ id: TRIVIA[code].mapId, name: countryName(code) }} />
        </div>
        <Title>Buscando personas conectadas en {countryName(code)}…</Title>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </div>
  )
}

function PlayerCard({ player, label, simulated = false }) {
  return (
    <div className="player-card">
      <Avatar profile={player} size="lg" />
      <span className="player-card__label">{label}</span>
      <strong>{player.name}</strong>
      <span>
        {player.age} años · Vive en {countryName(player.country)}
      </span>
      {simulated && <em className="player-card__sim">Rival simulado</em>}
    </div>
  )
}

function Found({ me, rival, onStart, onAnother, onCancel }) {
  return (
    <div className="page page--narrow">
      <header className="page__header">
        <p className="kicker">Conexión encontrada</p>
        <Title>¡Ya tenés rival!</Title>
      </header>
      <section className="versus">
        <PlayerCard player={me} label="Vos" />
        <span className="versus__vs">vs</span>
        <PlayerCard player={rival} label="Rival" simulated={rival.simulated} />
      </section>
      <p className="online-rules">
        Vos respondés sobre <strong>{countryName(rival.country)}</strong>. {rival.name} responde sobre{' '}
        <strong>{countryName(me.country)}</strong>. Son {ROUNDS} preguntas, con {ANSWER_SECONDS} segundos cada una.
      </p>
      <div className="actions actions--center">
        <button type="button" className="btn btn--primary" onClick={onStart}>
          Empezar el duelo
        </button>
        <button type="button" className="btn btn--ghost" onClick={onAnother}>
          Buscar a otra persona
        </button>
        <button type="button" className="btn btn--text" onClick={onCancel}>
          Elegir otro país
        </button>
      </div>
    </div>
  )
}

function Duel({ me, rival, onRematch, onExit }) {
  const [duel, dispatch] = useReducer(duelReducer, { target: rival.country, home: me.country }, buildDuel)
  const [left, setLeft] = useState(ANSWER_SECONDS)
  const round = duel.rounds[duel.index]
  const answered = round.myChoice !== undefined
  const { me: myScore, them: theirScore } = score(duel)

  // Cuenta regresiva: si se termina el tiempo, la respuesta queda en blanco
  useEffect(() => {
    if (duel.finished) return undefined
    const start = Date.now()
    setLeft(ANSWER_SECONDS)
    const timer = setInterval(() => {
      const rest = Math.max(0, ANSWER_SECONDS - (Date.now() - start) / 1000)
      setLeft(rest)
      if (rest === 0) {
        clearInterval(timer)
        dispatch({ type: 'answer', choice: null })
      }
    }, 200)
    return () => clearInterval(timer)
  }, [duel.index, duel.finished])

  // Mientras tanto, tu rival responde sobre tu país
  useEffect(() => {
    if (duel.finished) return undefined
    let active = true
    opponentAnswer(duel.rounds[duel.index].theirs).then(({ choice }) => {
      if (active) dispatch({ type: 'opponentAnswer', choice })
    })
    return () => {
      active = false
    }
    // Una respuesta por ronda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duel.index, duel.finished])

  if (duel.finished) return <Result duel={duel} me={me} rival={rival} onRematch={onRematch} onExit={onExit} />

  const last = duel.index === duel.rounds.length - 1
  const theirStatus =
    round.theirChoice === undefined
      ? 'está respondiendo…'
      : !answered
        ? 'ya respondió'
        : isCorrect(round.theirs, round.theirChoice)
          ? 'acertó'
          : 'no acertó'

  return (
    <div className="page page--narrow">
      <div className="scoreboard" aria-label={`Vos ${myScore}, ${rival.name} ${theirScore}`}>
        <span className="scoreboard__player">
          <Avatar profile={me} size="nav" /> Vos
        </span>
        <strong className="scoreboard__score">
          {myScore} <span>—</span> {theirScore}
        </strong>
        <span className="scoreboard__player scoreboard__player--rival">
          {rival.name} <Avatar profile={rival} size="nav" />
        </span>
      </div>

      <section className="duel-card">
        <header className="duel-card__head">
          <span>
            Pregunta {duel.index + 1} de {duel.rounds.length} · Sobre {countryName(rival.country)}
          </span>
          <span className="duel-card__time">{answered ? '' : `${Math.ceil(left)} s`}</span>
        </header>
        <div className="duel-timer" aria-hidden="true">
          <span style={{ transform: `scaleX(${answered ? 0 : left / ANSWER_SECONDS})` }} />
        </div>

        <Title className="duel-card__question">{round.mine.text}</Title>

        <div className="duel-options">
          {round.mine.options.map((option, i) => {
            const state = !answered
              ? ''
              : i === round.mine.answer
                ? 'is-right'
                : i === round.myChoice
                  ? 'is-wrong'
                  : 'is-dim'
            return (
              <button
                key={option}
                type="button"
                className={`duel-option ${state}`}
                disabled={answered}
                onClick={() => dispatch({ type: 'answer', choice: i })}
              >
                {option}
              </button>
            )
          })}
        </div>

        {answered && (
          <p className="duel-feedback" aria-live="polite">
            {isCorrect(round.mine, round.myChoice)
              ? '¡Correcto! Sumás un punto.'
              : round.myChoice === null
                ? `Se terminó el tiempo. Era: ${round.mine.options[round.mine.answer]}.`
                : `No era esa. Era: ${round.mine.options[round.mine.answer]}.`}
          </p>
        )}
      </section>

      <section className="rival-turn" aria-live="polite">
        <p>
          <strong>{rival.name}</strong> responde sobre {countryName(me.country)}: “{round.theirs.text}”
        </p>
        <p className={`rival-turn__status ${round.theirChoice === undefined ? 'is-thinking' : ''}`}>
          {rival.name} {theirStatus}
          {answered && round.theirChoice !== undefined && !isCorrect(round.theirs, round.theirChoice) && (
            <> (era {round.theirs.options[round.theirs.answer]})</>
          )}
        </p>
      </section>

      <div className="actions actions--center">
        {roundDone(round) ? (
          <button type="button" className="btn btn--primary" onClick={() => dispatch({ type: 'next' })}>
            {last ? 'Ver resultado' : 'Siguiente pregunta'}
          </button>
        ) : (
          answered && <p className="muted">Esperando a {rival.name}…</p>
        )}
        <button
          type="button"
          className="btn btn--text"
          onClick={() => window.confirm('¿Abandonar el duelo?') && onExit()}
        >
          Abandonar
        </button>
      </div>
      <TrialNote />
    </div>
  )
}

function Result({ duel, me, rival, onRematch, onExit }) {
  const { me: myScore, them: theirScore } = score(duel)
  const result = outcome(duel)
  const title = result === 'win' ? '¡Ganaste!' : result === 'lose' ? `Ganó ${rival.name}` : '¡Empate!'
  const line =
    result === 'win'
      ? `Sabés más de ${countryName(rival.country)} que ${rival.name} de ${countryName(me.country)}.`
      : result === 'lose'
        ? `${rival.name} sabe más de ${countryName(me.country)} que vos de ${countryName(rival.country)}.`
        : 'Los dos saben lo mismo del país del otro.'

  return (
    <div className="page page--narrow">
      <section className="duel-result">
        <p className="kicker">Resultado del duelo</p>
        <Title>{title}</Title>
        <p className="duel-result__score">
          <span>Vos</span> {myScore} — {theirScore} <span>{rival.name}</span>
        </p>
        <p className="muted">{line}</p>
      </section>

      <ol className="duel-review">
        {duel.rounds.map((r, i) => (
          <li key={r.mine.text}>
            <span className="duel-review__n">{i + 1}</span>
            <div>
              <p>
                <Mark ok={isCorrect(r.mine, r.myChoice)} /> {r.mine.text} <em>{r.mine.options[r.mine.answer]}</em>
              </p>
              <p className="muted">
                <Mark ok={isCorrect(r.theirs, r.theirChoice)} /> {rival.name}: {r.theirs.text}{' '}
                <em>{r.theirs.options[r.theirs.answer]}</em>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="actions actions--center">
        <button type="button" className="btn btn--primary" onClick={onRematch}>
          Revancha
        </button>
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          Elegir otro país
        </button>
      </div>
      <TrialNote />
    </div>
  )
}

function Mark({ ok }) {
  return (
    <svg
      className={`mark ${ok ? 'mark--ok' : 'mark--no'}`}
      viewBox="0 0 16 16"
      role="img"
      aria-label={ok ? 'Acierto' : 'Error'}
    >
      <path d={ok ? 'M3 8.5l3.2 3.2L13 4.5' : 'M4 4l8 8M12 4l-8 8'} />
    </svg>
  )
}
