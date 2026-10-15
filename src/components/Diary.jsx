import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, CATEGORY_BY_KEY, QUESTION_BY_ID } from '../data/questions.js'
import { formatDate, formatLongDate, plural } from '../lib/format.js'
import { useJourney } from '../state/useJourney.js'

// En el celular entran dos anotaciones por hoja para que el cuaderno no quede tan largo.
const MOBILE = '(max-width: 760px)'

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
// cada una con su fecha, la pregunta subrayada y la firma. Vive en "Mi perfil" (#diario).
export default function Diary() {
  const { answers, answeredCount, dispatch, profile } = useJourney()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(null) // null: el cuaderno abre en la última página escrita
  const [turned, setTurned] = useState(false) // después de la primera hoja ya no se espera a la tapa
  const [open, setOpen] = useState(false)
  const [closed, setClosed] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false) // en el celular, buscar y opciones van plegados
  const bookRef = useRef(null)
  const touchRef = useRef(null)
  const perPage = useIsMobile() ? 2 : 3

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

  // Cada respuesta es una anotación del diario, en orden cronológico.
  const notes = useMemo(() => {
    const term = search.trim().toLowerCase()
    return Object.entries(answers)
      .flatMap(([id, list]) => (QUESTION_BY_ID[id] ? list.map((a) => ({ question: QUESTION_BY_ID[id], ...a })) : []))
      .filter(({ question }) => category === 'all' || question.category === category)
      .filter(
        ({ question, text }) =>
          !term ||
          question.text.toLowerCase().includes(term) ||
          text.toLowerCase().includes(term) ||
          COUNTRY_BY_ID[question.countryId].name.toLowerCase().includes(term),
      )
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [answers, category, search])

  const pages = Math.max(1, Math.ceil(notes.length / perPage))
  const current = Math.min(page ?? pages - 1, pages - 1)
  const visible = notes.slice(current * perPage, current * perPage + perPage)
  const signature = profile?.name ?? 'yo'

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
    if (!start || closed) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    turnTo(dx < 0 ? current + 1 : current - 1)
  }

  function exportDiary() {
    const lines = [`EMIGRADOS · Diario${profile ? ` de ${profile.name}` : ''}`, '']
    for (const { question, text, date } of notes) {
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

  function reset() {
    if (window.confirm('¿Seguro que querés borrar todas tus respuestas? Esta acción no se puede deshacer.')) {
      dispatch({ type: 'reset' })
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
            {answeredCount
              ? plural(answeredCount, 'pregunta respondida', 'preguntas respondidas')
              : 'Todavía sin anotaciones'}
          </p>

          {answeredCount > 0 && (
            <button
              type="button"
              className="notebook__tools-toggle"
              aria-expanded={toolsOpen}
              onClick={() => setToolsOpen((v) => !v)}
            >
              {toolsOpen ? 'Ocultar búsqueda' : search || category !== 'all' ? 'Búsqueda activa' : 'Buscar y opciones'}
            </button>
          )}

          {answeredCount > 0 && (
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
          key={current}
          onTouchStart={pages > 1 ? onTouchStart : undefined}
          onTouchEnd={pages > 1 ? onTouchEnd : undefined}
        >
          {!answeredCount && (
            <div className="notebook__empty">
              <p>Tu primera respuesta va a quedar escrita en esta hoja.</p>
              <Link to="/individual" className="btn btn--primary">
                Empezar a responder
              </Link>
            </div>
          )}
          {answeredCount > 0 && !notes.length && (
            <p className="notebook__empty">No hay anotaciones que coincidan con la búsqueda.</p>
          )}
          {visible.map(({ question, text, date }, i) => (
            <article key={`${question.id}-${date}`} className="note" style={{ '--d': `${(turned ? 0.35 : 1.3) + i * 1.1}s` }}>
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
          ))}
          {notes.length > 0 && <span className="notebook__folio">{current + 1}</span>}
        </div>
      </div>

      {pages > 1 && !closed && (
        <nav className="notebook__nav" aria-label="Hojas del diario">
          <button type="button" className="btn btn--text" disabled={current === 0} onClick={() => turnTo(current - 1)}>
            ‹ Anterior
          </button>
          <span>
            {current + 1} / {pages}
          </span>
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
