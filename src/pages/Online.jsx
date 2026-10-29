import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import GuidedTalk from '../components/GuidedTalk.jsx'
import CountryShape from '../components/CountryShape.jsx'
import Title from '../components/Title.jsx'
import { countryName } from '../data/residence.js'
import { ONLINE_COUNTRIES, TRIVIA, isOnlineCountry } from '../data/trivia.js'
import { formatTimeIn, plural } from '../lib/format.js'
import {
  MAX_OPEN_DUELS,
  ROUNDS,
  answer as answerDuel,
  createDuel,
  currentRound,
  duelStatus,
  hoursLeft,
  isCorrect,
  myProgress,
  openDuels,
  outcome,
  receiveRival,
  score,
} from '../online/duel.js'
import { fetchRivalAnswers, findOpponent, finishRivalNow, startDuel } from '../online/mockServer.js'
import { useConfirm } from '../state/confirm.js'
import { joinWaitlist, loadDuels, loadWaitlist, removeDuel, saveDuels, upsertDuel } from '../state/duels.js'
import { useJourney } from '../state/useJourney.js'

// Modo online (versión de prueba, sin servidor todavía). Los duelos no son en vivo:
// elegís un país, te conectamos con alguien que vive ahí y cada uno responde a su ritmo
// sobre el país del otro, aunque estén a doce horas de diferencia. Cuando terminaron los
// dos, se ven los resultados y se abre el chat. Importa más tener ganas de conectar que
// estar conectados a la vez.
// Las personas son simuladas (ver online/mockServer.js). El perfil lo pide ProfileGate.
export default function Online() {
  const { profile } = useJourney()
  const [duels, setDuels] = useState(loadDuels)
  const [screen, setScreen] = useState({ name: 'lobby' })
  const now = useNow()

  useEffect(() => saveDuels(duels), [duels])

  // Lo que en la versión real llega por un aviso del servidor: las respuestas de quien ya terminó
  useEffect(() => {
    let active = true
    for (const duel of duels.filter((d) => !d.theirChoices)) {
      fetchRivalAnswers(duel, now).then((res) => {
        if (active && res) setDuels((list) => list.map((d) => (d.id === duel.id ? receiveRival(d, res) : d)))
      })
    }
    return () => {
      active = false
    }
  }, [duels, now])

  const save = (duel) => setDuels((list) => upsertDuel(list, duel))
  const toLobby = () => setScreen({ name: 'lobby' })
  const open = (id) => {
    const duel = duels.find((d) => d.id === id)
    setScreen({ name: duel && duelStatus(duel, now) === 'yourTurn' ? 'play' : 'view', id })
  }

  async function begin(rival) {
    const duel = await startDuel(createDuel({ rival, home: profile.country }))
    save(duel)
    setScreen({ name: 'play', id: duel.id })
  }

  if (!isOnlineCountry(profile.country)) return <Waitlist me={profile} />

  const duel = duels.find((d) => d.id === screen.id)
  const canStart = openDuels(duels, now).length < MAX_OPEN_DUELS

  if (screen.name === 'pick') {
    return <Pick me={profile} onPick={(code) => setScreen({ name: 'searching', code })} onBack={toLobby} />
  }
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
        now={now}
        onStart={() => begin(screen.rival)}
        onAnother={() => setScreen({ name: 'searching', code: screen.code })}
        onCancel={() => setScreen({ name: 'pick' })}
      />
    )
  }
  if (screen.name === 'play' && duel) {
    return (
      <Play
        duel={duel}
        me={profile}
        onAnswer={(choice) => save(answerDuel(duel, choice))}
        onDone={() => setScreen({ name: 'view', id: duel.id })}
        onLater={toLobby}
      />
    )
  }
  if (screen.name === 'view' && duel) {
    return (
      <View
        duel={duel}
        me={profile}
        now={now}
        canRematch={canStart}
        onFinishRival={() => {
          const sped = finishRivalNow(duel)
          fetchRivalAnswers(sped).then((res) => save(res ? receiveRival(sped, res) : sped))
        }}
        onTalk={() => setScreen({ name: 'talk', id: duel.id })}
        onRematch={() => begin(duel.rival)}
        onRemove={() => {
          setDuels((list) => removeDuel(list, duel.id))
          toLobby()
        }}
        onBack={toLobby}
      />
    )
  }
  if (screen.name === 'talk' && duel) {
    return (
      <GuidedTalk
        me={profile}
        rival={duel.rival}
        onExit={toLobby}
        // Bloquear o denunciar cierra la charla y saca el duelo de la lista
        onClosed={(rival) => setDuels((list) => list.filter((d) => d.rival.id !== rival.id))}
      />
    )
  }
  return (
    <Lobby
      me={profile}
      duels={duels}
      now={now}
      canStart={canStart}
      onNew={() => setScreen({ name: 'pick' })}
      onOpen={open}
      onRemove={(id) => setDuels((list) => removeDuel(list, id))}
    />
  )
}

// La hora, actualizada cada pocos segundos: los estados de los duelos dependen de ella
function useNow(ms = 4000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(timer)
  }, [ms])
  return now
}

const deadlineFormat = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

// "el jueves 31, 14:00"
function formatDeadline(iso) {
  return `el ${deadlineFormat.format(new Date(iso))}`
}

function TrialNote() {
  return <p className="online-trial">Versión de prueba · todavía sin servidor: las personas son simuladas</p>
}

// Dónde vive y, si eligió mostrarlo, dónde nació
function whereFrom(person) {
  const born =
    person.showOrigin && person.birthCountry && person.birthCountry !== person.country
      ? `Nació en ${countryName(person.birthCountry)} · `
      : ''
  return `${born}Vive en ${countryName(person.country)}`
}

// "Allá son las 03:12": que la distancia se note
function TheirTime({ rival, now }) {
  const time = rival.timeZone ? formatTimeIn(rival.timeZone, now) : ''
  return time ? <span className="their-time">Allá son las {time}</span> : null
}

function Waitlist({ me }) {
  const [joined, setJoined] = useState(() => loadWaitlist().includes(me.country))
  const country = countryName(me.country)
  return (
    <div className="page page--narrow">
      <header className="page__header">
        <p className="kicker">Online</p>
        <Title>Todavía no llegamos a {country}</Title>
        <p className="muted">
          El modo Online está abierto en {ONLINE_COUNTRIES.length} países: España, Latinoamérica y los destinos más
          elegidos para emigrar. Mientras tanto, los modos Individual y Grupal funcionan en cualquier lugar.
        </p>
        <TrialNote />
      </header>
      <section className="panel waitlist">
        {joined ? (
          <p role="status">
            <strong>Listo: te anotaste.</strong> Cuando abramos el modo Online en {country}, te avisamos.
          </p>
        ) : (
          <>
            <p>¿Querés que lo abramos en {country}? Cada persona anotada nos dice dónde conviene abrir primero.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setJoined(joinWaitlist(me.country).includes(me.country))}
            >
              Anotarme en la lista de espera
            </button>
          </>
        )}
        <details className="waitlist__countries">
          <summary>Ver los países abiertos</summary>
          <p>{ONLINE_COUNTRIES.map(countryName).join(' · ')}</p>
        </details>
      </section>
      <div className="actions actions--center">
        <Link to="/individual" className="btn btn--ghost">
          Jugar en modo Individual
        </Link>
        <Link to="/perfil" className="btn btn--text">
          Cambiar mi país en el perfil
        </Link>
      </div>
    </div>
  )
}

const STATUS_ORDER = { yourTurn: 0, ready: 1, waiting: 2, expired: 3 }

function Lobby({ me, duels, now, canStart, onNew, onOpen, onRemove }) {
  const confirm = useConfirm()
  const sorted = [...duels].sort((a, b) => STATUS_ORDER[duelStatus(a, now)] - STATUS_ORDER[duelStatus(b, now)])

  async function abandon(duel) {
    const ok = await confirm({
      title: '¿Abandonar el duelo?',
      message: `El duelo con ${duel.rival.name} se cierra y no se abre el chat.`,
      confirmLabel: 'Abandonar',
      cancelLabel: 'Seguir en el duelo',
      danger: true,
    })
    if (ok) onRemove(duel.id)
  }

  return (
    <div className="page">
      <header className="page__header">
        <p className="kicker">Online</p>
        <Title>Tus duelos</Title>
        <p className="muted">
          Cada uno responde sobre el país del otro, a su ritmo: no hace falta estar conectados al mismo tiempo. Cuando
          terminan los dos, se ven los resultados y se abre el chat.
        </p>
        <TrialNote />
      </header>

      <div className="actions">
        {canStart ? (
          <button type="button" className="btn btn--primary" onClick={onNew}>
            Nuevo duelo
          </button>
        ) : (
          <p className="online-note">
            Tenés {MAX_OPEN_DUELS} duelos abiertos. Cuando termine alguno, podés empezar otro.
          </p>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="online-loading">
          Todavía no tenés duelos. Empezá uno: te conectamos con alguien que vive en otro país.
        </p>
      ) : (
        <ul className="duel-list">
          {sorted.map((duel) => (
            <DuelItem
              key={duel.id}
              duel={duel}
              now={now}
              onOpen={() => onOpen(duel.id)}
              onAbandon={() => abandon(duel)}
              onRemove={() => onRemove(duel.id)}
            />
          ))}
        </ul>
      )}

      <Notices />
      <p className="muted online-home">
        Vos jugás desde {countryName(me.country)}: tus rivales responden preguntas sobre {countryName(me.country)}.
      </p>
    </div>
  )
}

function DuelItem({ duel, now, onOpen, onAbandon, onRemove }) {
  const { rival } = duel
  const status = duelStatus(duel, now)
  const answered = myProgress(duel)
  const lines = {
    yourTurn: answered ? `Te toca: respondiste ${answered} de ${ROUNDS}` : `Te toca: ${ROUNDS} preguntas sobre su país`,
    waiting: `Ya respondiste. Esperando a ${rival.name}`,
    ready: '¡Terminaron los dos! El chat está abierto',
    expired: duelStatusLabelExpired(duel),
  }
  const action = {
    yourTurn: answered ? 'Seguir respondiendo' : 'Empezar a responder',
    waiting: 'Ver el duelo',
    ready: 'Ver resultado y chatear',
  }[status]

  return (
    <li className={`panel duel-item duel-item--${status}`}>
      <Avatar profile={rival} size="md" />
      <div className="duel-item__body">
        <strong>{rival.name}</strong>
        <span className="duel-item__where">
          {whereFrom(rival)} · <TheirTime rival={rival} now={now} />
        </span>
        <span className="duel-item__status">{lines[status]}</span>
        {['yourTurn', 'waiting'].includes(status) && (
          <span className="duel-item__deadline">
            Tienen hasta {formatDeadline(duel.deadline)} ({plural(hoursLeft(duel, now), 'hora', 'horas')})
          </span>
        )}
      </div>
      <div className="duel-item__actions">
        {action && (
          <button type="button" className="btn btn--primary" onClick={onOpen}>
            {action}
          </button>
        )}
        {status === 'expired' && (
          <button type="button" className="btn btn--ghost" onClick={onRemove}>
            Quitar
          </button>
        )}
        {status === 'ready' && (
          <button type="button" className="btn btn--text" onClick={onRemove}>
            Quitar
          </button>
        )}
        {['yourTurn', 'waiting'].includes(status) && (
          <button type="button" className="btn btn--text" onClick={onAbandon}>
            Abandonar
          </button>
        )}
      </div>
    </li>
  )
}

function duelStatusLabelExpired(duel) {
  return myProgress(duel) === duel.rounds.length
    ? `${duel.rival.name} no llegó a responder a tiempo. Pasa: no es culpa de nadie`
    : 'Se terminó el plazo antes de que respondieras. Pasa: no es culpa de nadie'
}

// Los avisos necesitan el servidor y la app instalada: por ahora se muestran apagados
function Notices() {
  return (
    <section className="panel notices">
      <label className="relaxed-toggle">
        <input type="checkbox" disabled checked={false} onChange={() => {}} />
        <span className="relaxed-toggle__switch" aria-hidden="true" />
        <span>
          <strong>Avisarme cuando alguien termine de responder</strong>
          Llega con la versión online: vas a poder instalar Emigrados en tu celular y recibir el aviso, sin tener que
          entrar a revisar.
        </span>
      </label>
    </section>
  )
}

function Pick({ me, onPick, onBack }) {
  const countries = ONLINE_COUNTRIES.filter((code) => code !== me.country)
  return (
    <div className="page">
      <header className="page__header">
        <p className="kicker">Nuevo duelo</p>
        <Title>¿Sobre qué país te gustaría saber?</Title>
        <p className="muted">
          Te conectamos con alguien que vive ahí y tiene ganas de conectar. Vos respondés sobre su país y esa persona,
          sobre el tuyo, cada uno cuando pueda.
        </p>
        <TrialNote />
      </header>
      <ul className="online-countries">
        <li>
          <button type="button" className="online-country online-country--any" onClick={() => onPick(null)}>
            <strong>Cualquier país</strong>
            <span>Con quien tenga ganas de conectar</span>
          </button>
        </li>
        {countries.map((code) => (
          <li key={code}>
            <button type="button" className="online-country" onClick={() => onPick(code)}>
              <CountryShape country={{ id: TRIVIA[code].mapId, name: countryName(code) }} />
              <strong>{countryName(code)}</strong>
            </button>
          </li>
        ))}
      </ul>
      <div className="actions actions--center">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Volver a mis duelos
        </button>
      </div>
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
          {code && <CountryShape country={{ id: TRIVIA[code].mapId, name: countryName(code) }} />}
        </div>
        <Title>
          {code
            ? `Buscando a alguien en ${countryName(code)} con ganas de conectar…`
            : 'Buscando a alguien con ganas de conectar…'}
        </Title>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </div>
  )
}

function PlayerCard({ player, label, now, simulated = false }) {
  return (
    <div className="player-card">
      <Avatar profile={player} size="lg" />
      <span className="player-card__label">{label}</span>
      <strong>{player.name}</strong>
      <span>
        {player.age} años · {whereFrom(player)}
      </span>
      {now && <TheirTime rival={player} now={now} />}
      {simulated && <em className="player-card__sim">Persona simulada</em>}
    </div>
  )
}

function Found({ me, rival, now, onStart, onAnother, onCancel }) {
  const [starting, setStarting] = useState(false)
  return (
    <div className="page page--narrow">
      <header className="page__header">
        <p className="kicker">Conexión encontrada</p>
        <Title>¡Ya tenés con quién jugar!</Title>
      </header>
      <section className="versus">
        <PlayerCard player={me} label="Vos" />
        <span className="versus__vs">vs</span>
        <PlayerCard player={rival} label="Rival" now={now} simulated={rival.simulated} />
      </section>
      <p className="online-rules">
        Vos respondés {ROUNDS} preguntas sobre <strong>{countryName(rival.country)}</strong>; {rival.name}, sobre{' '}
        <strong>{countryName(me.country)}</strong>. Cada uno a su ritmo, sin reloj: tienen 3 días. Cuando terminen los
        dos, ven los resultados y se abre el chat.
      </p>
      <div className="actions actions--center">
        <button
          type="button"
          className="btn btn--primary"
          disabled={starting}
          onClick={() => {
            setStarting(true)
            onStart()
          }}
        >
          {starting ? 'Preparando el duelo…' : 'Empezar a responder'}
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

function Play({ duel, me, onAnswer, onDone, onLater }) {
  // La pregunta que se ve: después de responder se queda en pantalla con el dato curioso
  const [shown, setShown] = useState(() => currentRound(duel)?.index ?? 0)
  const { rival } = duel
  const round = duel.rounds[shown]
  const answered = round.myChoice !== undefined
  const last = shown === duel.rounds.length - 1

  function next() {
    const upcoming = currentRound(duel)
    if (upcoming) setShown(upcoming.index)
    else onDone()
  }

  return (
    <div className="page page--narrow">
      <section className="duel-card">
        <header className="duel-card__head">
          <span>
            Pregunta {shown + 1} de {duel.rounds.length} · Sobre {countryName(rival.country)}
          </span>
          <span className="duel-card__time">Sin reloj</span>
        </header>

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
                onClick={() => onAnswer(i)}
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
              : `No era esa. Era: ${round.mine.options[round.mine.answer]}.`}
          </p>
        )}
        {/* Más que ganar, conocer el país del otro */}
        {answered && round.mine.fact && (
          <p className="duel-fact">
            <span>Dato curioso</span>
            {round.mine.fact}
          </p>
        )}
      </section>

      <p className="rival-turn">
        <strong>{rival.name}</strong> responde sobre {countryName(me.country)} cuando pueda. Sus respuestas se ven
        cuando terminen los dos.
      </p>

      <div className="actions actions--center">
        {answered && (
          <button type="button" className="btn btn--primary" onClick={next}>
            {last ? 'Terminar' : 'Siguiente pregunta'}
          </button>
        )}
        <button type="button" className="btn btn--text" onClick={onLater}>
          Seguir después
        </button>
      </div>
      <TrialNote />
    </div>
  )
}

function View({ duel, me, now, canRematch, onFinishRival, onTalk, onRematch, onRemove, onBack }) {
  const status = duelStatus(duel, now)
  if (status === 'ready') {
    return <Result duel={duel} me={me} canRematch={canRematch} onTalk={onTalk} onRematch={onRematch} onBack={onBack} />
  }
  const { rival } = duel
  const { me: myScore } = score(duel)

  if (status === 'expired') {
    return (
      <div className="page page--narrow">
        <section className="panel waiting-card">
          <Title>Este duelo venció</Title>
          <p>{duelStatusLabelExpired(duel)}.</p>
          <p className="muted">Pasa: cada uno tiene su vida, sus horarios y su diferencia horaria.</p>
          <div className="actions actions--center">
            <button type="button" className="btn btn--primary" onClick={onRemove}>
              Quitar el duelo
            </button>
            <button type="button" className="btn btn--ghost" onClick={onBack}>
              Volver a mis duelos
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page page--narrow">
      <section className="panel waiting-card" aria-live="polite">
        <p className="kicker">Duelo con {rival.name}</p>
        <Title>¡Listo! Respondiste las {duel.rounds.length}</Title>
        <p>
          Acertaste {myScore} de {duel.rounds.length} sobre {countryName(rival.country)}.
        </p>
        <p>
          Ahora le toca a {rival.name}. <TheirTime rival={rival} now={now} />. Tiene hasta{' '}
          {formatDeadline(duel.deadline)}.
        </p>
        <p className="muted">
          Cuando termine, se ven los resultados y se abre el chat. En la versión real te llega un aviso al celular; no
          hace falta que te quedes esperando.
        </p>
        <div className="actions actions--center">
          <button type="button" className="btn btn--primary" onClick={onBack}>
            Volver a mis duelos
          </button>
        </div>
      </section>

      {/* Solo para mostrar la prueba sin esperar */}
      <section className="demo-box">
        <p>
          <strong>Versión de prueba.</strong>{' '}
          {duel.sim?.doneAt
            ? `${rival.name} es una persona simulada y va a terminar en unos minutos.`
            : `${rival.name} es una persona simulada que no va a responder, para mostrar cómo vence un duelo.`}
        </p>
        <button type="button" className="btn btn--ghost" onClick={onFinishRival}>
          Simular que {rival.name} ya terminó
        </button>
      </section>
    </div>
  )
}

function Result({ duel, me, canRematch, onTalk, onRematch, onBack }) {
  const { rival } = duel
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

      {/* Terminaron los dos: el chat ya está abierto */}
      <section className="talk-invite">
        <Avatar profile={rival} size="md" />
        <div>
          <p className="talk-invite__title">El chat con {rival.name} está abierto</p>
          <p className="muted">
            Una charla guiada, con preguntas para conocerse un poco más. Cada uno responde cuando puede.
          </p>
          <div className="actions">
            <button type="button" className="btn btn--primary" onClick={onTalk}>
              Abrir el chat
            </button>
          </div>
        </div>
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
                <Mark ok={isCorrect(r.theirs, duel.theirChoices[i])} /> {rival.name}: {r.theirs.text}{' '}
                <em>{r.theirs.options[r.theirs.answer]}</em>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="actions actions--center">
        {canRematch && (
          <button type="button" className="btn btn--ghost" onClick={onRematch}>
            Revancha con {rival.name}
          </button>
        )}
        <button type="button" className="btn btn--text" onClick={onBack}>
          Volver a mis duelos
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
