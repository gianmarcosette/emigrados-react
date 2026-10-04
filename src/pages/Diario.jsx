import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CountryStamp from '../components/CountryStamp.jsx'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, CATEGORY_BY_KEY, QUESTION_BY_ID } from '../data/questions.js'
import { formatDate, plural } from '../lib/format.js'
import { useJourney } from '../state/useJourney.js'

// Diario: todas las respuestas del modo individual, con su historial de fechas.
export default function Diario() {
  const { answers, answeredCount, dispatch, name } = useJourney()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const entries = useMemo(() => {
    const term = search.trim().toLowerCase()
    return Object.entries(answers)
      .map(([id, list]) => ({ question: QUESTION_BY_ID[id], list }))
      .filter(({ question, list }) => question && list.length)
      .filter(({ question }) => category === 'all' || question.category === category)
      .filter(
        ({ question, list }) =>
          !term ||
          question.text.toLowerCase().includes(term) ||
          list.some((a) => a.text.toLowerCase().includes(term)) ||
          COUNTRY_BY_ID[question.countryId].name.toLowerCase().includes(term),
      )
      .sort((a, b) => b.list[b.list.length - 1].date.localeCompare(a.list[a.list.length - 1].date))
  }, [answers, category, search])

  function exportDiary() {
    const lines = [`EMIGRADOS · Diario${name.trim() ? ` de ${name.trim()}` : ''}`, '']
    for (const { question, list } of entries) {
      const country = COUNTRY_BY_ID[question.countryId]
      lines.push(`${country.name} — ${CATEGORY_BY_KEY[question.category].label}`, question.text)
      for (const a of list) lines.push(`  · ${formatDate(a.date)}: ${a.text}`)
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

  function reset() {
    if (window.confirm('¿Seguro que querés borrar todas tus respuestas? Esta acción no se puede deshacer.')) {
      dispatch({ type: 'reset' })
    }
  }

  if (!answeredCount) {
    return (
      <div className="page page--narrow center">
        <h1>Tu diario está vacío</h1>
        <p className="muted">Las respuestas que guardes en el modo individual van a aparecer acá, con su fecha.</p>
        <Link to="/individual" className="btn btn--primary">
          Empezar a responder
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1>Diario de viaje</h1>
        <p className="muted">
          {plural(answeredCount, 'pregunta respondida', 'preguntas respondidas')}. Volvé a responder cualquiera para ver
          cómo cambió lo que sentís.
        </p>
      </header>

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Buscar</span>
          <input
            type="search"
            value={search}
            placeholder="Buscar por palabra o país…"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="select">
          <span>Etapa</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {entries.length === 0 && <p className="muted center">No hay respuestas que coincidan con la búsqueda.</p>}

      <ul className="diary">
        {entries.map(({ question, list }) => {
          const cat = CATEGORY_BY_KEY[question.category]
          return (
            <li key={question.id} className="entry" style={{ '--cat': cat.color }}>
              <div className="entry__head">
                <CountryStamp country={COUNTRY_BY_ID[question.countryId]} size="sm" />
                <span className="chip" style={{ background: cat.color }}>
                  {cat.label}
                </span>
              </div>
              <h2 className="entry__question">{question.text}</h2>
              <ol className="history__list">
                {list.map((a, i) => (
                  <li key={a.date + i}>
                    <time>{formatDate(a.date)}</time>
                    <p>{a.text}</p>
                  </li>
                ))}
              </ol>
              <Link to={`/individual?q=${question.id}`} className="btn btn--text">
                Volver a responder
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="actions actions--end">
        <button type="button" className="btn btn--danger" onClick={reset}>
          Borrar mis respuestas
        </button>
        <button type="button" className="btn btn--ghost" onClick={exportDiary} disabled={!entries.length}>
          Descargar diario (.txt)
        </button>
      </div>
    </div>
  )
}
