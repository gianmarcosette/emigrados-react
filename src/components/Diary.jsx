import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, CATEGORY_BY_KEY, QUESTION_BY_ID } from '../data/questions.js'
import { countryName } from '../data/residence.js'
import { formatDate, formatMonth, formatShortDate, plural } from '../lib/format.js'
import { buildEntries, filterEntries, groupByMonth, highlight } from '../lib/journal.js'
import { clearAllDrafts } from '../state/drafts.js'
import { useConfirm } from '../state/confirm.js'
import { useNightMode } from '../state/nightMode.js'
import { useJourney } from '../state/useJourney.js'
import CountryShape from './CountryShape.jsx'

// Diario de viaje al estilo de una app de notas: una lista de entradas por mes, con
// buscador, y cada entrada se abre limpia (fecha, pregunta y respuesta en letra grande).
// También guarda las charlas del modo online. Vive en "Mi perfil" (#diario).
export default function Diary() {
  const { answers, answeredCount, talks = [], dispatch, profile } = useJourney()
  const confirm = useConfirm()
  const [night, toggleNight] = useNightMode()
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [openKey, setOpenKey] = useState(null)
  const sectionRef = useRef(null)
  const lastOpened = useRef(null)

  const all = useMemo(
    () => buildEntries({ answers, talks, questionById: QUESTION_BY_ID, countryById: COUNTRY_BY_ID }),
    [answers, talks],
  )
  const entries = useMemo(() => filterEntries(all, { term, category, countryName }), [all, term, category])
  const groups = useMemo(() => groupByMonth(entries), [entries])
  const openIndex = entries.findIndex((e) => e.key === openKey)
  const opened = openIndex === -1 ? null : entries[openIndex]
  const first = all[all.length - 1]

  // Al abrir o cerrar una entrada, el diario vuelve a quedar arriba y el foco donde corresponde
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (section.getBoundingClientRect().top < 0) section.scrollIntoView({ block: 'start' })
    if (opened) section.querySelector('.journal-entry__title')?.focus({ preventScroll: true })
    else if (lastOpened.current) {
      section.querySelector(`[data-key="${CSS.escape(lastOpened.current)}"]`)?.focus({ preventScroll: true })
    }
  }, [opened])

  function open(key) {
    lastOpened.current = key
    setOpenKey(key)
  }

  function exportDiary() {
    const signature = profile?.name ?? 'yo'
    const lines = [`EMIGRADOS · Diario${profile ? ` de ${profile.name}` : ''}`, '']
    for (const entry of [...all].reverse()) {
      if (entry.kind === 'talk') {
        const { talk } = entry
        lines.push(formatDate(talk.date), `Charla con ${talk.rival.name} (vive en ${countryName(talk.rival.country)})`)
        for (const m of talk.messages) lines.push(`${m.from === 'me' ? signature : talk.rival.name}: ${m.text}`)
      } else {
        lines.push(
          formatDate(entry.date),
          `${entry.country.name} — ${CATEGORY_BY_KEY[entry.question.category].label}`,
          entry.question.text,
          entry.text,
        )
      }
      lines.push('')
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
        )}, tu maleta y tus borradores. No se puede deshacer: si querés conservarlas, descargá el diario antes.`,
      confirmLabel: 'Borrar todo',
      danger: true,
    })
    if (ok) {
      dispatch({ type: 'reset' })
      clearAllDrafts()
      setOpenKey(null)
    }
  }

  const nightButton = (
    <button
      type="button"
      className="journal__icon"
      aria-pressed={night}
      title={night ? 'Pasar a modo día' : 'Pasar a modo noche'}
      onClick={toggleNight}
    >
      <MoonIcon />
      <span className="sr-only">Modo noche</span>
    </button>
  )

  return (
    <section
      id="diario"
      ref={sectionRef}
      className={`journal ${night ? 'is-night' : ''}`}
      aria-labelledby="diario-titulo"
    >
      {opened ? (
        <Entry
          entry={opened}
          term={term}
          position={entries.length - openIndex}
          total={entries.length}
          onBack={() => setOpenKey(null)}
          onOlder={openIndex < entries.length - 1 ? () => open(entries[openIndex + 1].key) : null}
          onNewer={openIndex > 0 ? () => open(entries[openIndex - 1].key) : null}
          nightButton={nightButton}
          signature={profile?.name ?? 'Yo'}
        />
      ) : (
        <>
          <div className="journal__bar">
            {nightButton}
            {all.length > 0 && (
              <button type="button" className="journal__icon" title="Descargar el diario (.txt)" onClick={exportDiary}>
                <DownloadIcon />
                <span className="sr-only">Descargar el diario</span>
              </button>
            )}
          </div>
          <h2 id="diario-titulo" className="journal__title">
            Diario de viaje
          </h2>
          <p className="journal__count">
            {all.length
              ? `${plural(all.length, 'entrada', 'entradas')} · desde ${formatMonth(first.date)}`
              : 'Todavía sin entradas'}
          </p>

          {all.length > 0 && (
            <div className="journal__filters">
              <label className="journal__search">
                <SearchIcon />
                <span className="sr-only">Buscar en tu diario</span>
                <input
                  type="search"
                  value={term}
                  placeholder="Buscar en tu diario"
                  onChange={(e) => setTerm(e.target.value)}
                />
              </label>
              <label className="journal__stage">
                <span className="sr-only">Etapa</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">Todas las etapas</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {!all.length && (
            <div className="journal__empty">
              <p>Tu primera respuesta va a quedar guardada acá, con su fecha.</p>
              <Link to="/individual" className="btn btn--primary">
                Empezar a responder
              </Link>
            </div>
          )}
          {all.length > 0 && !entries.length && (
            <p className="journal__empty" role="status">
              No hay entradas que coincidan con la búsqueda.
            </p>
          )}

          {groups.map(({ month, entries: list }) => (
            <section key={month} className="journal__month" aria-label={month}>
              <h3 className="journal__month-title">{month}</h3>
              <ul className="journal__rows">
                {list.map((entry) => (
                  <li key={entry.key}>
                    <button type="button" className="journal__row" data-key={entry.key} onClick={() => open(entry.key)}>
                      <span className="journal__row-main">
                        <span className="journal__row-title">
                          {entry.kind === 'talk' ? `Charla con ${entry.talk.rival.name}` : entry.question.text}
                        </span>
                        <span className="journal__row-preview">
                          <time dateTime={entry.date}>{formatShortDate(entry.date)}</time>{' '}
                          {entry.kind === 'talk' ? `Vive en ${countryName(entry.talk.rival.country)}` : entry.text}
                        </span>
                      </span>
                      {entry.kind === 'talk' ? (
                        <ChatIcon />
                      ) : (
                        <CountryShape country={entry.country} className="journal__row-shape" decorative />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {all.length > 0 && (
            <button type="button" className="btn--link journal__reset" onClick={reset}>
              Borrar mis respuestas
            </button>
          )}
        </>
      )}
    </section>
  )
}

// Una entrada abierta: fecha centrada, etapa, la pregunta como título y la respuesta grande
function Entry({ entry, term, position, total, onBack, onOlder, onNewer, nightButton, signature }) {
  const marked = (text) =>
    highlight(text, term).map((part, i) => (part.match ? <mark key={i}>{part.text}</mark> : part.text))

  return (
    <article className="journal-entry">
      <div className="journal__bar journal__bar--entry">
        <button type="button" className="journal__back" onClick={onBack}>
          ‹ Diario
        </button>
        {nightButton}
      </div>
      <p className="journal-entry__date">
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      </p>

      {entry.kind === 'talk' ? (
        <>
          <p className="journal-entry__stage">Charla guiada</p>
          <h2 id="diario-titulo" className="journal-entry__title" tabIndex={-1}>
            Charla con {entry.talk.rival.name}
          </h2>
          <p className="journal-entry__sub">Vive en {countryName(entry.talk.rival.country)}</p>
          <ol className="journal-entry__talk">
            {entry.talk.messages.map((m, i) => (
              <li key={i} className={`journal-entry__msg journal-entry__msg--${m.kind ?? 'answer'}`}>
                {m.kind !== 'question' && (
                  <span className="journal-entry__who">{m.from === 'me' ? signature : entry.talk.rival.name}</span>
                )}
                <p>{marked(m.text)}</p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <p className="journal-entry__stage">{CATEGORY_BY_KEY[entry.question.category].label}</p>
          <h2 id="diario-titulo" className="journal-entry__title" tabIndex={-1}>
            {marked(entry.question.text)}
          </h2>
          <p className="journal-entry__answer">{marked(entry.text)}</p>

          {entry.earlier.length > 0 && (
            <details className="journal-entry__earlier">
              <summary>Antes respondiste {plural(entry.earlier.length, 'vez', 'veces')} esta pregunta</summary>
              <ol>
                {entry.earlier.map((a) => (
                  <li key={a.date}>
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                    <p>{a.text}</p>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <Link to="/maleta" className="journal-entry__stop">
            <CountryShape country={entry.country} className="journal-entry__shape" decorative />
            <span>
              <b>Escala en {entry.country.name}</b>
              <span>Su afiche está en tu maleta</span>
            </span>
          </Link>
          <Link to={`/individual?q=${entry.question.id}`} className="btn btn--ghost journal-entry__again">
            Volver a responder
          </Link>
        </>
      )}

      <nav className="journal-entry__nav" aria-label="Otras entradas">
        <button type="button" className="btn btn--text" disabled={!onOlder} onClick={onOlder ?? undefined}>
          ‹ Anterior
        </button>
        <span>
          {position} / {total}
        </span>
        <button type="button" className="btn btn--text" disabled={!onNewer} onClick={onNewer ?? undefined}>
          Siguiente ›
        </button>
      </nav>
    </article>
  )
}

const ICON = {
  viewBox: '0 0 24 24',
  width: 22,
  height: 22,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function MoonIcon() {
  return (
    <svg {...ICON}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg {...ICON}>
      <path d="M12 3v12M8 11l4 4 4-4M4 20h16" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg {...ICON} width={18} height={18} strokeWidth={2}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4-4" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg {...ICON} className="journal__row-shape">
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  )
}
