import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Envelope from '../components/Envelope.jsx'
import Title from '../components/Title.jsx'
import { formatLongDate } from '../lib/format.js'
import {
  LETTER_MAX,
  OPEN_OPTIONS,
  daysUntil,
  formatDay,
  formatWritten,
  letterCalendar,
  openDay,
  sortLetters,
  tomorrow,
} from '../lib/letter.js'
import { useConfirm } from '../state/confirm.js'
import { useJourney } from '../state/useJourney.js'

// Carta al futuro: escribís hoy, elegís cuándo se abre y hasta ese día queda cerrada.
// El día que llega, te reencontrás con quien eras y le podés contestar.
// Todo queda en este dispositivo; el aviso lo da el calendario de la persona (un archivo .ics).
export default function Carta() {
  const { letters = [], dispatch } = useJourney()
  const [params, setParams] = useSearchParams()
  const confirm = useConfirm()
  const [writing, setWriting] = useState(false)
  const [justSealed, setJustSealed] = useState(null)
  const { due, sealed, opened } = sortLetters(letters)
  const reading = letters.find((l) => l.id === params.get('leer') && l.openedAt)

  function read(id) {
    setParams({ leer: id })
    window.scrollTo(0, 0)
  }

  function openLetter(letter) {
    dispatch({ type: 'openLetter', id: letter.id })
    read(letter.id)
  }

  async function breakSeal(letter) {
    const ok = await confirm({
      title: '¿Romper el sobre?',
      message: `La carta que se abría el ${formatDay(letter.openOn)} se borra sin leerse. No se puede deshacer.`,
      confirmLabel: 'Romper el sobre',
      danger: true,
    })
    if (ok) dispatch({ type: 'deleteLetter', id: letter.id })
  }

  if (reading) {
    return (
      <Reading
        letter={reading}
        onReply={(text) => dispatch({ type: 'replyLetter', id: reading.id, text })}
        onBack={() => setParams({})}
        onWrite={() => {
          setParams({})
          setWriting(true)
        }}
      />
    )
  }

  if (justSealed) {
    return (
      <div className="page page--narrow letter-page">
        <section className="panel letter-sealed">
          <Envelope />
          <Title>Tu carta está en camino</Title>
          <p>
            Se abre el <b>{formatDay(justSealed.openOn)}</b>. Hasta ese día queda cerrada: ni vos la podés leer.
          </p>
          <CalendarButton letter={justSealed} primary />
          <p className="muted letter-hint">Así tu calendario te avisa ese día. La carta no sale de este celular.</p>
          <button type="button" className="btn btn--ghost" onClick={() => setJustSealed(null)}>
            Listo
          </button>
        </section>
      </div>
    )
  }

  const showForm = writing || !letters.length

  return (
    <div className="page page--narrow letter-page">
      <header className="page__header letter-page__head">
        <Title>Carta al futuro</Title>
        <p>Escribile a quien vas a ser. Elegí cuándo se abre: hasta ese día queda cerrada.</p>
      </header>

      {due.map((letter) => (
        <section key={letter.id} className="panel letter-due">
          <Envelope />
          <h2>Hoy se abre tu carta</h2>
          <p className="muted">La escribiste el {formatLongDate(letter.writtenAt)}.</p>
          <button type="button" className="btn btn--primary" onClick={() => openLetter(letter)}>
            Abrir la carta
          </button>
        </section>
      ))}

      {showForm ? (
        <LetterForm
          onCancel={letters.length ? () => setWriting(false) : undefined}
          onSeal={(letter) => {
            dispatch({ type: 'sealLetter', letter })
            setWriting(false)
            setJustSealed(letter)
            window.scrollTo(0, 0)
          }}
        />
      ) : (
        <button type="button" className="btn btn--primary letter-page__new" onClick={() => setWriting(true)}>
          Escribir una carta nueva
        </button>
      )}

      {sealed.length > 0 && (
        <section className="letter-list" aria-labelledby="sealed-title">
          <h2 id="sealed-title">En camino</h2>
          <ul>
            {sealed.map((letter) => {
              const left = daysUntil(letter.openOn)
              return (
                <li key={letter.id} className="letter-item">
                  <Envelope className="letter-item__envelope" />
                  <div>
                    <strong>Se abre el {formatDay(letter.openOn)}</strong>
                    <span>
                      {left === 1 ? 'Falta 1 día' : `Faltan ${left} días`} · Escrita el{' '}
                      {formatWritten(letter.writtenAt)}
                    </span>
                    <div className="letter-item__actions">
                      <CalendarButton letter={letter} />
                      <button type="button" className="btn--link" onClick={() => breakSeal(letter)}>
                        Romper el sobre
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {opened.length > 0 && (
        <section className="letter-list" aria-labelledby="opened-title">
          <h2 id="opened-title">Ya abiertas</h2>
          <ul>
            {opened.map((letter) => (
              <li key={letter.id}>
                <button type="button" className="letter-item letter-item--opened" onClick={() => read(letter.id)}>
                  <Envelope open className="letter-item__envelope" />
                  <span>
                    <strong>Escrita el {formatWritten(letter.writtenAt)}</strong>
                    <span>{letter.reply ? 'Ya le contestaste' : 'Todavía no le contestaste'} · Leer</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="privacy-note">Tus cartas se guardan solo en este dispositivo. Nadie más puede leerlas.</p>
    </div>
  )
}

function LetterForm({ onSeal, onCancel }) {
  const [text, setText] = useState('')
  const [option, setOption] = useState('6m')
  const [custom, setCustom] = useState('')
  const [error, setError] = useState('')
  const preview = openDay(option, custom)

  function submit(e) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) return setError('Escribí algo antes de cerrar el sobre.')
    if (!preview) return setError('Elegí el día en que se abre (a partir de mañana).')
    onSeal({ id: newId(), text: clean, writtenAt: new Date().toISOString(), openOn: preview })
  }

  return (
    <form className="panel letter-form" onSubmit={submit} noValidate>
      <label htmlFor="letter-text" className="letter-form__label">
        Tu carta
      </label>
      <p id="letter-ideas" className="muted letter-hint">
        Contale cómo estás hoy, qué te preocupa, qué extrañás y qué esperás que haya cambiado cuando la leas.
      </p>
      <textarea
        id="letter-text"
        className="letter-form__text"
        aria-describedby="letter-ideas"
        value={text}
        maxLength={LETTER_MAX}
        rows={9}
        placeholder="Hoy…"
        onChange={(e) => {
          setText(e.target.value)
          setError('')
        }}
      />

      <fieldset className="letter-form__when">
        <legend>¿Cuándo la abrís?</legend>
        {OPEN_OPTIONS.map((o) => {
          const day = o.months ? openDay(o.key) : null
          return (
            <label key={o.key} className={`letter-option ${option === o.key ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="open"
                value={o.key}
                checked={option === o.key}
                onChange={() => {
                  setOption(o.key)
                  setError('')
                }}
              />
              <span>
                <strong>{o.label}</strong>
                {day && <small>El {formatDay(day)}</small>}
              </span>
            </label>
          )
        })}
        {option === 'date' && (
          <input
            type="date"
            className="letter-form__date"
            aria-label="Día en que se abre la carta"
            min={tomorrow()}
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value)
              setError('')
            }}
          />
        )}
      </fieldset>

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="submit" className="btn btn--primary">
          Cerrar el sobre
        </button>
        {onCancel && (
          <button type="button" className="btn btn--text" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

function Reading({ letter, onReply, onBack, onWrite }) {
  const [reply, setReply] = useState('')
  return (
    <div className="page page--narrow letter-page">
      <header className="page__header letter-page__head">
        <p className="letter-page__eyebrow">Abierta el {formatWritten(letter.openedAt)}</p>
        <Title>Una carta de quien eras</Title>
      </header>
      <article className="letter-paper">
        <p className="letter-paper__date">Escrita el {formatLongDate(letter.writtenAt)}</p>
        <p className="letter-paper__text">{letter.text}</p>
      </article>

      <section className="panel letter-reply">
        {letter.reply ? (
          <>
            <h2>Lo que le contestaste</h2>
            <p className="muted">{formatLongDate(letter.reply.date)}</p>
            <p className="letter-paper__text">{letter.reply.text}</p>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (reply.trim()) onReply(reply.trim())
            }}
          >
            <label htmlFor="letter-reply" className="letter-form__label">
              ¿Qué le contestarías hoy?
            </label>
            <textarea
              id="letter-reply"
              className="letter-form__text"
              value={reply}
              maxLength={LETTER_MAX}
              rows={6}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="actions">
              <button type="submit" className="btn btn--primary" disabled={!reply.trim()}>
                Responderle a quien eras
              </button>
            </div>
          </form>
        )}
        <div className="actions">
          <button type="button" className="btn btn--ghost" onClick={onWrite}>
            Escribir una carta nueva
          </button>
          <button type="button" className="btn btn--text" onClick={onBack}>
            Volver a mis cartas
          </button>
        </div>
      </section>
      <Link to="/" className="btn--link letter-page__home">
        Ir al inicio
      </Link>
    </div>
  )
}

// El aviso lo da el calendario de la persona: se descarga un evento para ese día
function CalendarButton({ letter, primary = false }) {
  function add() {
    const ics = letterCalendar({ id: letter.id, openOn: letter.openOn, url: `${window.location.origin}/carta` })
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `carta-emigrados-${letter.openOn}.ics`
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <button type="button" className={primary ? 'btn btn--primary' : 'btn--link'} onClick={add}>
      Agregar a mi calendario
    </button>
  )
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
