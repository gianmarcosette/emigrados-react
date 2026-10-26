import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, CATEGORY_BY_KEY, QUESTION_BY_ID } from '../data/questions.js'
import { buildDiaryIndex } from '../lib/diaryIndex.js'
import { formatDate, formatLongDate, formatShortDate, plural } from '../lib/format.js'
import { clearAllDrafts } from '../state/drafts.js'
import { useConfirm } from '../state/confirm.js'
import { useJourney } from '../state/useJourney.js'
import { countryName } from '../data/residence.js'

// En el celular va una anotación por hoja para que el cuaderno no quede largo.
const MOBILE = '(max-width: 760px)'
// Con pocas anotaciones alcanza con pasar las hojas; después aparece el índice.
const INDEX_FROM = 6

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia?.(MOBILE).matches ?? false)
  useEffect(() => {
    const query = window.matchMedia?.(MOBILE)
    if (!query) return undefined
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return mobile
}

// Diario: un cuaderno que se abre y en el que las respuestas aparecen escritas a mano,
// cada una con su fecha, la pregunta subrayada y la firma. También guarda las charlas
// del modo online que quisiste conservar. Vive en "Mi perfil" (#diario).
export default function Diary() {
  const { answers, answeredCount, talks = [], dispatch, profile } = useJourney()
  const entryCount = answeredCount + talks.length
  const confirm = useConfirm()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(null) // null: el cuaderno abre en la última página escrita
  const [turned, setTurned] = useState(false) // después de la primera hoja ya no se espera a la tapa
  const [open, setOpen] = useState(false)
  const [closed, setClosed] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false) // en el celular, buscar y opciones van plegados
  const bookRef = useRef(null)
  const touchRef = useRef(null)
  const [showIndex, setShowIndex] = useState(false)
  const perPage = useIsMobile() ? 1 : 3

  // El cuaderno se abre recién cuando aparece en pantalla (está más abajo en el perfil).
  useEffect(() => {
    const el = bookRef.current
    if (!el || open) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOpen(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [open])

  // Cada respuesta (y cada charla guardada) es una anotación del diario, en orden cronológico.
  const notes = useMemo(() => {
    const term = search.trim().toLowerCase()
    const answerNotes = Object.entries(answers)
      .flatMap(([id, list]) => (QUESTION_BY_ID[id] ? list.map((a) => ({ question: QUESTION_BY_ID[id], ...a })) : []))
      .filter(({ question }) => category === 'all' || question.category === category)
      .filter(
        ({ question, text }) =>
          !term ||
          question.text.toLowerCase().includes(term) ||
          text.toLowerCase().includes(term) ||
          COUNTRY_BY_ID[question.countryId].name.toLowerCase().includes(term),
      )
    // Las charlas no pertenecen a una etapa: solo aparecen con "Todas"
    const talkNotes =
      category === 'all'
        ? talks
            .map((talk) => ({ talk, date: talk.date }))
            .filter(
              ({ talk }) =>
                !term ||
                talk.rival.name.toLowerCase().includes(term) ||
                countryName(talk.rival.country).toLowerCase().includes(term) ||
                talk.messages.some((m) => m.text.toLowerCase().includes(term)),
            )
        : []
    return [...answerNotes, ...talkNotes].sort((a, b) => a.date.localeCompare(b.date))
  }, [answers, talks, category, search])

  const pages = Math.max(1, Math.ceil(notes.length / perPage))
  const current = Math.min(page ?? pages - 1, pages - 1)
  const visible = notes.slice(current * perPage, current * perPage + perPage)
  const signature = profile?.name ?? 'yo'
  const hasIndex = notes.length >= INDEX_FROM
  const indexOpen = showIndex && hasIndex && !closed
  const index = useMemo(() => (indexOpen ? buildDiaryIndex(notes, perPage) : []), [indexOpen, notes, perPage])

  function filterBy(update) {
    update()
    setPage(null)
  }

  function reopen() {
    setClosed(false)
    setTurned(false)
  }

  function turnTo(next) {
    if (next < 0 || next >= pages) return
    setTurned(true)
    setShowIndex(false)
    setPage(next)
  }

  // Deslizar el dedo sobre la hoja pasa de página, como en un cuaderno de verdad.
  function onTouchStart(e) {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  function onTouchEnd(e) {
    const start = touchRef.current
    touchRef.current = null
    if (!start || closed || indexOpen) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    turnTo(dx < 0 ? current + 1 : current - 1)
  }

  function exportDiary() {
    const lines = [`EMIGRADOS · Diario${profile ? ` de ${profile.name}` : ''}`, '']
    for (const { question, text, date, talk } of notes) {
      if (talk) {
        lines.push(formatDate(date), `Charla con ${talk.rival.name} (vive en ${countryName(talk.rival.country)})`)
        for (const m of talk.messages) lines.push(`${m.from === 'me' ? signature : talk.rival.name}: ${m.text}`)
        lines.push('')
        continue
      }
      const country = COUNTRY_BY_ID[question.countryId]
      lines.push(formatDate(date), `${country.name} — ${CATEGORY_BY_KEY[question.category].label}`, question.text)
      lines.push(text, `— ${signature}`, '')
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'emigrados-diario.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  async function reset() {
    const ok = await confirm({
      title: '¿Borrar todo tu diario?',
      message: `Se borran ${[
        answeredCount && plural(answeredCount, 'respuesta', 'respuestas'),
        talks.length && plural(talks.length, 'charla', 'charlas'),
      ]
        .filter(Boolean)
        .join(
          ' y ',
        )}, tu mapa y tus borradores. No se puede deshacer: si querés conservarlas, descargá el diario antes.`,
      confirmLabel: 'Borrar todo',
      danger: true,
    })
    if (ok) {
      dispatch({ type: 'reset' })
      clearAllDrafts()
    }
  }

  return (
    <section id="diario" className="diary-section">
      <div ref={bookRef} className={`notebook ${closed ? 'is-closed' : open ? 'is-open' : ''}`}>
        {/* Tapa: se abre girando sobre el lomo; cerrada, se toca para volver a abrir */}
        <div
          className="notebook__cover"
          role={closed ? 'button' : undefined}
          tabIndex={closed ? 0 : -1}
          aria-hidden={!closed}
          aria-label={closed ? 'Abrir el diario' : undefined}
          onClick={closed ? reopen : undefined}
          onKeyDown={(e) => {
            if (closed && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              reopen()
            }
          }}
        >
          <span className="notebook__cover-title">Diario de viaje</span>
          <span className="notebook__cover-name">{profile?.name}</span>
          <span className="notebook__cover-hint">Tocá para abrir</span>
          <span className="notebook__band" />
        </div>

        <div className="notebook__page notebook__page--left">
          <button type="button" className="notebook__close" onClick={() => setClosed(true)} disabled={closed}>
            Cerrar
          </button>
          <h2 className="notebook__title">Diario de viaje</h2>
          {profile && <p className="notebook__owner">de {profile.name}</p>}
          <p className="notebook__count">
            {entryCount
              ? [
                  answeredCount && plural(answeredCount, 'pregunta respondida', 'preguntas respondidas'),
                  talks.length && plural(talks.length, 'charla', 'charlas'),
                ]
                  .filter(Boolean)
                  .join(' · ')
              : 'Todavía sin anotaciones'}
          </p>

          {(entryCount > 0 || hasIndex) && (
            <div className="notebook__buttons">
              {hasIndex && (
                <button
                  type="button"
                  className="notebook__index-toggle"
                  aria-expanded={indexOpen}
                  onClick={() => {
                    setTurned(true)
                    setShowIndex((v) => !v)
                  }}
                >
                  {indexOpen ? 'Volver a la hoja' : 'Índice'}
                </button>
              )}
              {entryCount > 0 && (
                <button
                  type="button"
                  className="notebook__tools-toggle"
                  aria-expanded={toolsOpen}
                  onClick={() => setToolsOpen((v) => !v)}
                >
                  {toolsOpen
                    ? 'Ocultar búsqueda'
                    : search || category !== 'all'
                      ? 'Búsqueda activa'
                      : 'Buscar y opciones'}
                </button>
              )}
            </div>
          )}

          {entryCount > 0 && (
            <div className={`notebook__tools ${toolsOpen ? 'is-expanded' : ''}`}>
              <label>
                <span className="sr-only">Buscar</span>
                <input
                  type="search"
                  value={search}
                  placeholder="Buscar por palabra o país…"
                  onChange={(e) => filterBy(() => setSearch(e.target.value))}
                />
              </label>
              <label className="select">
                <span>Etapa</span>
                <select value={category} onChange={(e) => filterBy(() => setCategory(e.target.value))}>
                  <option value="all">Todas</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="notebook__actions">
                <button type="button" className="btn btn--ghost" onClick={exportDiary} disabled={!notes.length}>
                  Descargar (.txt)
                </button>
                <button type="button" className="btn--link" onClick={reset}>
                  Borrar mis respuestas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="notebook__spine" aria-hidden="true" />

        {/* key: al pasar de hoja, la página gira y se vuelve a escribir */}
        <div
          className="notebook__page notebook__page--right"
          key={indexOpen ? 'indice' : current}
          onTouchStart={pages > 1 ? onTouchStart : undefined}
          onTouchEnd={pages > 1 ? onTouchEnd : undefined}
        >
          {!entryCount && (
            <div className="notebook__empty">
              <p>Tu primera respuesta va a quedar escrita en esta hoja.</p>
              <Link to="/individual" className="btn btn--primary">
                Empezar a responder
              </Link>
            </div>
          )}
          {entryCount > 0 && !notes.length && (
            <p className="notebook__empty">No hay anotaciones que coincidan con la búsqueda.</p>
          )}
          {indexOpen && (
            <nav className="notebook__index" aria-label="Índice del diario">
              <h3 className="notebook__index-title">Índice</h3>
              {index.map(({ month, entries }) => (
                <section key={month}>
                  <h4 className="notebook__index-month">{month}</h4>
                  <ol>
                    {entries.map(({ question, talk, date, page: entryPage }) => (
                      <li key={talk ? talk.id : `${question.id}-${date}`}>
                        <button
                          type="button"
                          className={entryPage - 1 === current ? 'is-current' : undefined}
                          onClick={() => turnTo(entryPage - 1)}
                        >
                          <em className="notebook__index-where">
                            {formatShortDate(date)} ·{' '}
                            {talk ? countryName(talk.rival.country) : COUNTRY_BY_ID[question.countryId].name}
                          </em>
                          <span className="notebook__index-text">
                            {talk ? `Charla con ${talk.rival.name}` : question.text}
                          </span>
                          <span className="notebook__index-dots" aria-hidden="true" />
                          <span className="notebook__index-page">{entryPage}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </nav>
          )}
          {!indexOpen &&
            visible.map(({ question, text, date, talk }, i) =>
              talk ? (
                <TalkNote
                  key={talk.id}
                  talk={talk}
                  signature={signature}
                  delay={`${(turned ? 0.35 : 1.3) + i * 1.1}s`}
                />
              ) : (
                <article
                  key={`${question.id}-${date}`}
                  className="note"
                  style={{ '--d': `${(turned ? 0.35 : 1.3) + i * 1.1}s` }}
                >
                  <p className="note__date">
                    {formatLongDate(date)} · {COUNTRY_BY_ID[question.countryId].name}
                  </p>
                  <h3 className="note__question">{question.text}</h3>
                  <p className="note__answer">{text}</p>
                  <p className="note__signature">— {signature}</p>
                  <Link to={`/individual?q=${question.id}`} className="note__again">
                    volver a responder
                  </Link>
                </article>
              ),
            )}
          {notes.length > 0 && !indexOpen && <span className="notebook__folio">{current + 1}</span>}
        </div>
      </div>

      {pages > 1 && !closed && !indexOpen && (
        <nav className="notebook__nav" aria-label="Hojas del diario">
          <button type="button" className="btn btn--text" disabled={current === 0} onClick={() => turnTo(current - 1)}>
            ‹ Anterior
          </button>
          <span>
            {current + 1} / {pages}
          </span>
          <span className="notebook__swipe">También podés deslizar la hoja con el dedo</span>
          <button
            type="button"
            className="btn btn--text"
            disabled={current === pages - 1}
            onClick={() => turnTo(current + 1)}
          >
            Siguiente ›
          </button>
        </nav>
      )}
    </section>
  )
}

// Una charla del modo online guardada en el diario: cada pregunta subrayada, la respuesta
// y el eco, con quién dijo cada cosa.
function TalkNote({ talk, signature, delay }) {
  const who = (m) => (m.from === 'me' ? signature : talk.rival.name)
  return (
    <article className="note note--talk" style={{ '--d': delay }}>
      <p className="note__date">
        {formatLongDate(talk.date)} · Charla con {talk.rival.name}, que vive en {countryName(talk.rival.country)}
      </p>
      {talk.messages.map((m, i) =>
        m.kind === 'question' ? (
          <h3 key={i} className="note__question">
            {m.text}
          </h3>
        ) : (
          <p key={i} className={m.kind === 'reaction' ? 'note__echo' : 'note__answer'}>
            {m.text} <span className="note__who">— {who(m)}</span>
          </p>
        ),
      )}
    </article>
  )
}
