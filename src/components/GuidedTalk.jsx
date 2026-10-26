import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { countryName } from '../data/residence.js'
import { TALK_STAGES } from '../data/talk.js'
import {
  blockRival,
  reportRival,
  requestTalk,
  rivalAnswer,
  rivalQuestion,
  rivalReaction,
} from '../online/mockServer.js'
import { ANSWER_MAX, checkAnswer, echoOptions, fillPrompt, promptOptions } from '../online/talk.js'
import { useJourney } from '../state/useJourney.js'
import { useConfirm } from '../state/confirm.js'
import Avatar from './Avatar.jsx'
import Title from './Title.jsx'

const REPORT_REASONS = [
  'Me hizo sentir incómodo/a',
  'Pidió o compartió datos personales',
  'Contenido ofensivo',
  'Otro motivo',
]

// Charla guiada después del duelo. No hay mensajes sueltos: cada intercambio parte de una
// pregunta. En cada momento (abrir, ir más hondo, cerrar) elegís qué preguntarle, podés
// reaccionar a su respuesta y después te pregunta a vos.
export default function GuidedTalk({ me, rival, onExit }) {
  const [phase, setPhase] = useState('waiting')
  const [stage, setStage] = useState(0)
  const [log, setLog] = useState([])
  const [used, setUsed] = useState([])
  const [options, setOptions] = useState([])
  const [echoes, setEchoes] = useState([]) // ecos para devolverle a la otra persona
  const [current, setCurrent] = useState(null) // pregunta en curso (objeto de la charla)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [reporting, setReporting] = useState(false)
  const [savedToDiary, setSavedToDiary] = useState(false)
  const { dispatch } = useJourney()
  const confirm = useConfirm()
  const endRef = useRef(null)
  const theirCountry = countryName(rival.country)
  const myCountry = countryName(me.country)

  const say = (from, kind, text) => setLog((list) => [...list, { from, kind, text, id: list.length }])

  // Lo que hace la otra persona: cada fase de espera dispara su parte y avanza la charla.
  useEffect(() => {
    let active = true
    const done = (fn) => (value) => active && fn(value)

    if (phase === 'waiting') {
      requestTalk(rival).then(
        done(({ accepted }) => {
          if (!accepted) return setPhase('declined')
          say('system', 'stage', TALK_STAGES[0].label)
          setOptions(promptOptions(0, []))
          setPhase('pick')
        }),
      )
    }
    if (phase === 'theirAnswer') {
      rivalAnswer(current).then(
        done((text) => {
          say('them', 'answer', text)
          setEchoes(echoOptions(stage, current, theirCountry))
          setPhase('react')
        }),
      )
    }
    if (phase === 'theirQuestion') {
      rivalQuestion(stage, used).then(
        done((prompt) => {
          setCurrent(prompt)
          setUsed((list) => [...list, prompt.id])
          say('them', 'question', fillPrompt(prompt, myCountry))
          setPhase('myAnswer')
        }),
      )
    }
    if (phase === 'theirReaction') {
      rivalReaction(stage, current, myCountry).then(
        done((text) => {
          say('them', 'reaction', text)
          const next = stage + 1
          if (next >= TALK_STAGES.length) return setPhase('done')
          setStage(next)
          say('system', 'stage', TALK_STAGES[next].label)
          setOptions(promptOptions(next, used))
          setPhase('pick')
        }),
      )
    }
    return () => {
      active = false
    }
    // Cada fase corre una sola vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [log, phase])

  function ask(prompt) {
    setCurrent(prompt)
    setUsed((list) => [...list, prompt.id])
    say('me', 'question', fillPrompt(prompt, theirCountry))
    setPhase('theirAnswer')
  }

  function react(text) {
    if (text) say('me', 'reaction', text)
    setPhase('theirQuestion')
  }

  function send(e) {
    e.preventDefault()
    const checked = checkAnswer(draft)
    if (checked.error) return setError(checked.error)
    say('me', 'answer', checked.ok)
    setDraft('')
    setError('')
    setPhase('theirReaction')
  }

  // La charla queda en el diario, solo en este dispositivo
  function saveToDiary() {
    const date = new Date().toISOString()
    dispatch({
      type: 'saveTalk',
      talk: {
        id: `charla-${date}`,
        date,
        rival: { name: rival.name, country: rival.country },
        messages: log.filter((m) => m.from !== 'system'),
      },
    })
    setSavedToDiary(true)
  }

  async function block() {
    const ok = await confirm({
      title: `¿Bloquear a ${rival.name}?`,
      message: 'La charla se cierra y no van a volver a cruzarse en el modo online.',
      confirmLabel: 'Bloquear',
      danger: true,
    })
    if (!ok) return
    await blockRival(rival)
    setPhase('blocked')
  }

  async function report(reason) {
    await reportRival(rival, reason)
    setReporting(false)
    setPhase('reported')
  }

  if (phase === 'declined') {
    return (
      <TalkEnd title="Esta vez no" onExit={onExit}>
        {rival.name} prefirió no seguir la charla esta vez. Está bien: cada quien elige cuándo abrirse.
      </TalkEnd>
    )
  }
  if (phase === 'blocked') {
    return (
      <TalkEnd title="Bloqueaste a esta persona" onExit={onExit}>
        La charla se cerró y no van a volver a cruzarse en el modo online.
      </TalkEnd>
    )
  }
  if (phase === 'reported') {
    return (
      <TalkEnd title="Gracias por avisar" onExit={onExit}>
        La charla se cerró. En la versión real, el equipo de moderación revisa cada denuncia.
      </TalkEnd>
    )
  }

  const typing = ['theirAnswer', 'theirQuestion', 'theirReaction'].includes(phase)

  return (
    <div className="page page--narrow">
      <header className="talk-head">
        <Avatar profile={rival} size="md" />
        <div>
          <strong>Charla con {rival.name}</strong>
          <span>Vive en {theirCountry}</span>
        </div>
        {phase !== 'waiting' && (
          <div className="talk-head__actions">
            <button type="button" className="btn btn--text" onClick={block}>
              Bloquear
            </button>
            <button type="button" className="btn btn--text" onClick={() => setReporting(true)}>
              Denunciar
            </button>
          </div>
        )}
      </header>

      {reporting && <ReportPanel rival={rival} onSend={report} onCancel={() => setReporting(false)} />}

      {phase === 'waiting' ? (
        <section className="talk-waiting" aria-live="polite">
          <Title>Esperando a que {rival.name} acepte…</Title>
          <p className="muted">La charla se abre solo si las dos personas quieren.</p>
          <button type="button" className="btn btn--ghost" onClick={onExit}>
            Cancelar
          </button>
        </section>
      ) : (
        <>
          <p className="talk-safety">
            Charla guiada: cada intercambio parte de una pregunta. Por tu seguridad, no compartas teléfono, mail,
            dirección ni redes.
          </p>

          <ol className="talk-log" aria-live="polite">
            {log.map((m) => (
              <li key={m.id} className={`talk-msg talk-msg--${m.from} talk-msg--${m.kind}`}>
                {m.kind === 'question' && (
                  <span className="talk-msg__label">
                    {m.from === 'me' ? 'Preguntaste' : `${rival.name} te pregunta`}
                  </span>
                )}
                {m.text}
              </li>
            ))}
            {typing && (
              <li className="talk-msg talk-msg--them talk-typing" aria-label={`${rival.name} está escribiendo`}>
                <span />
                <span />
                <span />
              </li>
            )}
          </ol>
          <div ref={endRef} />

          {phase === 'pick' && (
            <section className="talk-compose">
              <p className="talk-compose__title">¿Qué te gustaría preguntarle a {rival.name}?</p>
              <div className="talk-prompts">
                {options.map((p) => (
                  <button key={p.id} type="button" className="talk-prompt" onClick={() => ask(p)}>
                    {fillPrompt(p, theirCountry)}
                  </button>
                ))}
              </div>
            </section>
          )}

          {phase === 'react' && (
            <section className="talk-compose">
              <p className="talk-compose__title">Devolvele algo de lo que te contó</p>
              <div className="talk-reactions">
                {echoes.map((r) => (
                  <button key={r} type="button" className="talk-reaction" onClick={() => react(r)}>
                    {r}
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn--text talk-skip" onClick={() => react(null)}>
                Seguir sin responder
              </button>
            </section>
          )}

          {phase === 'myAnswer' && (
            <form className="talk-compose" onSubmit={send}>
              <label htmlFor="talk-answer" className="talk-compose__title">
                Tu respuesta
              </label>
              <textarea
                id="talk-answer"
                rows={3}
                maxLength={ANSWER_MAX}
                value={draft}
                placeholder="Contá lo que quieras compartir…"
                aria-invalid={Boolean(error)}
                onChange={(e) => {
                  setDraft(e.target.value)
                  if (error) setError('')
                }}
              />
              <div className="talk-compose__foot">
                <span className="muted">
                  {draft.length}/{ANSWER_MAX}
                </span>
                <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
                  Enviar
                </button>
              </div>
              {error && (
                <p className="field__error" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}

          {phase === 'done' && (
            <section className="talk-done">
              <Title>Fin de la charla</Title>
              <p className="muted">
                Gracias por compartir. En la versión real, si los dos quieren, la charla va a poder seguir.
              </p>
              {savedToDiary ? (
                <p className="talk-saved" role="status">
                  Guardada en tu diario. <Link to="/perfil#diario">Ver mi diario</Link>
                </p>
              ) : (
                <div className="talk-keep">
                  <button type="button" className="btn btn--ghost" onClick={saveToDiary}>
                    Guardar la charla en mi diario
                  </button>
                  <span>Solo vos la vas a ver, en este dispositivo.</span>
                </div>
              )}
              <button type="button" className="btn btn--primary" onClick={onExit}>
                Jugar otro duelo
              </button>
            </section>
          )}
        </>
      )}
      <p className="online-trial">Versión de prueba · {rival.name} es una persona simulada</p>
    </div>
  )
}

function ReportPanel({ rival, onSend, onCancel }) {
  const [reason, setReason] = useState(REPORT_REASONS[0])
  return (
    <form
      className="talk-report"
      onSubmit={(e) => {
        e.preventDefault()
        onSend(reason)
      }}
    >
      <p className="talk-compose__title">¿Por qué querés denunciar a {rival.name}?</p>
      {REPORT_REASONS.map((r) => (
        <label key={r} className="talk-report__option">
          <input type="radio" name="report" value={r} checked={reason === r} onChange={() => setReason(r)} />
          {r}
        </label>
      ))}
      <div className="actions">
        <button type="submit" className="btn btn--primary">
          Enviar denuncia
        </button>
        <button type="button" className="btn btn--text" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

function TalkEnd({ title, children, onExit }) {
  return (
    <div className="page page--narrow">
      <section className="talk-done">
        <Title>{title}</Title>
        <p className="muted">{children}</p>
        <button type="button" className="btn btn--primary" onClick={onExit}>
          Jugar otro duelo
        </button>
      </section>
    </div>
  )
}
