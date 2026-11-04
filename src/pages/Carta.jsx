import { useEffect, useRef, useState } from 'react'
import Envelope from '../components/Envelope.jsx'
import Title from '../components/Title.jsx'
import { formatDate, formatShortDate, formatTime, plural } from '../lib/format.js'

// "4 may 2027": entra en una fila de la lista
const shortMonth = new Intl.DateTimeFormat('es-AR', { month: 'short' })
const short = (date) => `${date.getDate()} ${shortMonth.format(date).replace('.', '')} ${date.getFullYear()}`
import {
  LETTER_MAX,
  OPEN_OPTIONS,
  daysUntil,
  formatDay,
  letterCalendar,
  openDay,
  parseDay,
  sortLetters,
  tomorrow,
} from '../lib/letter.js'
import { useConfirm } from '../state/confirm.js'
import { clearLetterDraft, getLetterDraft, saveLetterDraft } from '../state/drafts.js'
import { useNightMode } from '../state/nightMode.js'
import { useJourney } from '../state/useJourney.js'

// Carta al futuro, con el mismo estilo de notas que la escritura de Individual y el diario:
// papel limpio, la fecha arriba, letra grande sin caja y modo noche.
// - Escribís hoy, elegís cuándo se abre y hasta ese día queda cerrada (ni vos la leés).
// - El día que llega, te reencontrás con quien eras y le podés contestar.
// Todo queda en este dispositivo; el aviso lo da el calendario de la persona (un archivo .ics).
export default function Carta() {
  const { letters = [], dispatch } = useJourney()
  const confirm = useConfirm()
  const [night, toggleNight] = useNightMode()
  // Qué se ve dentro de la nota: la lista, escribir una carta o una carta puntual
  const [view, setView] = useState(() => (letters.length ? { kind: 'list' } : { kind: 'write' }))
  const [fresh, setFresh] = useState(null)
  const noteRef = useRef(null)
  const { due, sealed, opened } = sortLetters(letters)
  const current = view.kind === 'letter' ? letters.find((l) => l.id === view.id) : null

  // Al cambiar de vista, la nota vuelve a quedar arriba
  useEffect(() => {
    const note = noteRef.current
    if (note && note.getBoundingClientRect().top < 0) note.scrollIntoView({ block: 'start' })
  }, [view])

  const back = letters.length ? () => setView({ kind: 'list' }) : null

  async function breakSeal(letter) {
    const ok = await confirm({
      title: '¿Romper el sobre?',
      message: `La carta que se abría el ${formatDay(letter.openOn)} se borra sin leerse. No se puede deshacer.`,
      confirmLabel: 'Romper el sobre',
      danger: true,
    })
    if (ok) {
      dispatch({ type: 'deleteLetter', id: letter.id })
      setView(letters.length > 1 ? { kind: 'list' } : { kind: 'write' })
    }
  }

  const inList = view.kind === 'list' || (view.kind === 'letter' && !current)
  const bar = (
    <div className={`journal__bar ${back && !inList ? 'journal__bar--entry' : ''}`}>
      {back && !inList && (
        <button type="button" className="journal__back" onClick={back}>
          ‹ Mis cartas
        </button>
      )}
      <button
        type="button"
        className="journal__icon"
        aria-pressed={night}
        title={night ? 'Pasar a modo día' : 'Pasar a modo noche'}
        onClick={toggleNight}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
        <span className="sr-only">Modo noche</span>
      </button>
    </div>
  )

  let content
  if (view.kind === 'write') {
    content = (
      <Write
        bar={bar}
        onSeal={(letter) => {
          dispatch({ type: 'sealLetter', letter })
          setFresh(letter.id)
          setView({ kind: 'letter', id: letter.id })
        }}
      />
    )
  } else if (current?.openedAt) {
    content = (
      <Reading
        bar={bar}
        letter={current}
        onReply={(text) => dispatch({ type: 'replyLetter', id: current.id, text })}
        onWrite={() => setView({ kind: 'write' })}
      />
    )
  } else if (current) {
    content = (
      <Sealed
        bar={bar}
        letter={current}
        fresh={fresh === current.id}
        onOpen={() => dispatch({ type: 'openLetter', id: current.id })}
        onBreak={() => breakSeal(current)}
      />
    )
  } else {
    content = (
      <List
        bar={bar}
        due={due}
        sealed={sealed}
        opened={opened}
        onPick={(id) => setView({ kind: 'letter', id })}
        onWrite={() => setView({ kind: 'write' })}
      />
    )
  }

  return (
    <div className="page page--narrow letter-page">
      <header className="page__header letter-page__head">
        <Title>Carta al futuro</Title>
        <p>Escribile a quien vas a ser. Elegí cuándo se abre: hasta ese día queda cerrada.</p>
      </header>
      <section ref={noteRef} className={`journal letter-note ${night ? 'is-night' : ''}`} aria-label="Carta al futuro">
        {content}
      </section>
      <p className="privacy-note">Tus cartas se guardan solo en este dispositivo. Nadie más puede leerlas.</p>
    </div>
  )
}

// Las cartas como las notas del diario: primero la que se abre hoy, después las que están en
// camino y al final las que ya se abrieron
function List({ bar, due, sealed, opened, onPick, onWrite }) {
  const total = due.length + sealed.length + opened.length
  return (
    <>
      {bar}
      <h2 className="journal__title">Tus cartas</h2>
      <p className="journal__count">
        {plural(total, 'carta', 'cartas')}
        {sealed.length > 0 && ` · ${sealed.length} en camino`}
      </p>
      <button type="button" className="btn btn--primary letter-note__new" onClick={onWrite}>
        Escribir una carta nueva
      </button>

      {due.length > 0 && (
        <Rows title="Hoy se abre" className="letter-rows--due">
          {due.map((l) => (
            <Row
              key={l.id}
              onClick={() => onPick(l.id)}
              title="Hoy se abre tu carta"
              preview={`Escrita el ${short(new Date(l.writtenAt))} · Tocá para abrirla`}
            />
          ))}
        </Rows>
      )}
      {sealed.length > 0 && (
        <Rows title="En camino">
          {sealed.map((l) => {
            const left = daysUntil(l.openOn)
            return (
              <Row
                key={l.id}
                onClick={() => onPick(l.id)}
                title={`Se abre el ${short(parseDay(l.openOn))}`}
                preview={`${left === 1 ? 'Falta 1 día' : `Faltan ${left} días`} · Escrita el ${short(new Date(l.writtenAt))}`}
              />
            )
          })}
        </Rows>
      )}
      {opened.length > 0 && (
        <Rows title="Ya abiertas">
          {opened.map((l) => (
            <Row
              key={l.id}
              open
              onClick={() => onPick(l.id)}
              title={`Escrita el ${short(new Date(l.writtenAt))}`}
              preview={l.text}
            />
          ))}
        </Rows>
      )}
    </>
  )
}

function Rows({ title, className = '', children }) {
  return (
    <section className={`journal__month ${className}`} aria-label={title}>
      <h3 className="journal__month-title">{title}</h3>
      <ul className="journal__rows">{children}</ul>
    </section>
  )
}

function Row({ title, preview, open = false, onClick }) {
  return (
    <li>
      <button type="button" className="journal__row" onClick={onClick}>
        <span className="journal__row-main">
          <span className="journal__row-title">{title}</span>
          <span className="journal__row-preview">{preview}</span>
        </span>
        <Envelope open={open} className="letter-note__icon" />
      </button>
    </li>
  )
}

// Escribir: la fecha arriba, la carta en letra grande sin caja, y cuándo se abre
function Write({ bar, onSeal }) {
  const [startedAt] = useState(() => new Date())
  const [resumed] = useState(() => getLetterDraft())
  const [text, setText] = useState(resumed?.text ?? '')
  const [saved, setSaved] = useState(true)
  const [option, setOption] = useState('6m')
  const [custom, setCustom] = useState('')
  const [error, setError] = useState('')
  const preview = openDay(option, custom)

  function change(value) {
    setText(value)
    setSaved(saveLetterDraft(value))
    setError('')
  }

  function submit(e) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) return setError('Escribí algo antes de cerrar el sobre.')
    if (!preview) return setError('Elegí el día en que se abre (a partir de mañana).')
    clearLetterDraft()
    onSeal({ id: newId(), text: clean, writtenAt: nowIso(), openOn: preview })
  }

  return (
    <article className="journal-entry">
      {bar}
      <p className="journal-entry__date">Hoy · {formatTime(startedAt)}</p>
      <p className="journal-entry__stage">Carta al futuro</p>
      <h2 className="journal-entry__title">Escribile a quien vas a ser</h2>
      <p className="journal-entry__sub">
        Contale cómo estás hoy, qué te preocupa, qué extrañás y qué esperás que haya cambiado cuando la leas.
      </p>

      <form className="answer letter-note__form" onSubmit={submit} noValidate>
        {resumed && (
          <p className="answer__resumed">Retomaste lo que estabas escribiendo el {formatDate(resumed.date)}.</p>
        )}
        <label htmlFor="letter-text" className="sr-only">
          Tu carta
        </label>
        <textarea
          id="letter-text"
          className="answer__input"
          value={text}
          maxLength={LETTER_MAX}
          rows={8}
          placeholder="Hoy…"
          onChange={(e) => change(e.target.value)}
        />
        <p className="answer__meta letter-note__meta" aria-live="polite">
          {text.trim() && (saved ? 'Guardado' : 'No se pudo guardar el borrador: tu celular no tiene espacio')}
        </p>

        <fieldset className="letter-note__when">
          <legend>¿Cuándo la abrís?</legend>
          <div className="letter-note__chips">
            {OPEN_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                className={`chip chip--toggle ${option === o.key ? 'chip--on' : ''}`}
                aria-pressed={option === o.key}
                onClick={() => {
                  setOption(o.key)
                  setError('')
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          {option === 'date' && (
            <input
              type="date"
              className="letter-note__date"
              aria-label="Día en que se abre la carta"
              min={tomorrow()}
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value)
                setError('')
              }}
            />
          )}
          <p className="letter-note__opens" aria-live="polite">
            {preview ? (
              <>
                Se abre el <b>{formatDay(preview)}</b>
              </>
            ) : (
              'Elegí un día a partir de mañana'
            )}
          </p>
        </fieldset>

        {error && (
          <p className="field__error" role="alert">
            {error}
          </p>
        )}
        <div className="answer__footer">
          <div className="actions">
            <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
              Cerrar el sobre
            </button>
          </div>
        </div>
      </form>
    </article>
  )
}

// Una carta cerrada: el sobre, cuándo se abre y, si ya llegó el día, el botón para abrirla
function Sealed({ bar, letter, fresh, onOpen, onBreak }) {
  const left = daysUntil(letter.openOn)
  const ready = left === 0
  return (
    <article className="journal-entry letter-note__sealed">
      {bar}
      <p className="journal-entry__date">Escrita el {formatDate(letter.writtenAt)}</p>
      <Envelope />
      <h2 className="journal-entry__title">{ready ? 'Hoy se abre tu carta' : 'Tu carta está en camino'}</h2>
      {ready ? (
        <>
          <p className="journal-entry__sub">La que te escribiste. Tomate un momento para leerla.</p>
          <button type="button" className="btn btn--primary" onClick={onOpen}>
            Abrir la carta
          </button>
        </>
      ) : (
        <>
          <p className="journal-entry__sub">
            Se abre el <b>{formatDay(letter.openOn)}</b> · {left === 1 ? 'falta 1 día' : `faltan ${left} días`}. Hasta
            ese día queda cerrada: ni vos la podés leer.
          </p>
          <CalendarButton letter={letter} primary={fresh} />
          <p className="answer__meta">Así tu calendario te avisa ese día. La carta no sale de este celular.</p>
          <button type="button" className="btn--link letter-note__break" onClick={onBreak}>
            Romper el sobre
          </button>
        </>
      )}
    </article>
  )
}

// Leer: como una entrada del diario (fecha, título y la carta en letra grande) y, abajo,
// la respuesta de hoy escrita como una nota nueva
function Reading({ bar, letter, onReply, onWrite }) {
  const [startedAt] = useState(() => new Date())
  const [reply, setReply] = useState('')
  return (
    <article className="journal-entry">
      {bar}
      <p className="journal-entry__date">Escrita el {formatDate(letter.writtenAt)}</p>
      <p className="journal-entry__stage">Carta al futuro · Abierta el {formatShortDate(letter.openedAt)}</p>
      <h2 className="journal-entry__title">Una carta de quien eras</h2>
      <p className="journal-entry__answer">{letter.text}</p>

      <div className="letter-note__reply">
        {letter.reply ? (
          <>
            <p className="journal-entry__stage">Lo que le contestaste · {formatShortDate(letter.reply.date)}</p>
            <p className="journal-entry__answer">{letter.reply.text}</p>
          </>
        ) : (
          <form
            className="answer"
            onSubmit={(e) => {
              e.preventDefault()
              if (reply.trim()) onReply(reply.trim())
            }}
          >
            <div className="answer__head">
              <label htmlFor="letter-reply" className="answer__when">
                <span className="sr-only">Tu respuesta · </span>Hoy · {formatTime(startedAt)}
              </label>
            </div>
            <textarea
              id="letter-reply"
              className="answer__input"
              value={reply}
              maxLength={LETTER_MAX}
              rows={5}
              placeholder="¿Qué le contestarías hoy?"
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="answer__footer">
              <div className="actions">
                <button type="submit" className="btn btn--primary" disabled={!reply.trim()}>
                  Responderle a quien eras
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="journal-entry__nav letter-note__nav">
        <button type="button" className="btn btn--text" onClick={onWrite}>
          Escribir una carta nueva
        </button>
      </div>
    </article>
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
    <button type="button" className={`btn ${primary ? 'btn--primary' : 'btn--ghost'}`} onClick={add}>
      Agregar a mi calendario
    </button>
  )
}

function nowIso() {
  return new Date().toISOString()
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
