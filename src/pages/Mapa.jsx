import { useState } from 'react'
import { Link } from 'react-router-dom'
import CountryStamp from '../components/CountryStamp.jsx'
import WorldMap from '../components/WorldMap.jsx'
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { formatDate, plural } from '../lib/format.js'
import { useJourney } from '../state/useJourney.js'

export default function Mapa() {
  const { answers, answeredCount, totalQuestions, pins, routeCountries } = useJourney()
  const [selectedId, setSelectedId] = useState(null)
  const selected = selectedId ? COUNTRY_BY_ID[selectedId] : null
  const pct = Math.round((answeredCount / totalQuestions) * 100)

  return (
    <div className="page page--wide">
      <header className="page__header">
        <h1>Tu vuelta al mundo</h1>
        <p className="muted">
          Cada pregunta respondida marca un país. Tocá un marcador para releer lo que escribiste ahí, o un punto para ver qué destinos te faltan.
        </p>
      </header>

      <div className="stats">
        <div className="stat">
          <strong>{answeredCount}</strong>
          <span>de {totalQuestions} preguntas</span>
        </div>
        <div className="stat">
          <strong>{pins.length}</strong>
          <span>de {COUNTRIES.length} países</span>
        </div>
        <div className="stat">
          <strong>{pct}%</strong>
          <span>de la vuelta al mundo</span>
        </div>
      </div>

      <div className="map-layout">
        <div className="map-card">
          <WorldMap
            pins={pins}
            destinations={COUNTRIES}
            route={routeCountries.slice(-12)}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
          />
          {!answeredCount && (
            <div className="map-empty">
              <p>Tu mapa todavía está en blanco.</p>
              <Link to="/individual" className="btn btn--primary">
                Responder la primera pregunta
              </Link>
            </div>
          )}
        </div>

        {selected && <CountryPanel country={selected} answers={answers} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  )
}

function CountryPanel({ country, answers, onClose }) {
  const questions = QUESTIONS.filter((q) => q.countryId === country.id)
  const answered = questions.filter((q) => answers[q.id]?.length)
  const pending = questions.length - answered.length

  return (
    <aside className="country-panel" aria-label={`Respuestas en ${country.name}`}>
      <div className="country-panel__head">
        <CountryStamp country={country} />
        <button type="button" className="btn btn--text" onClick={onClose} aria-label="Cerrar">
          Cerrar
        </button>
      </div>
      <p className="muted">
        {plural(answered.length, 'pregunta respondida', 'preguntas respondidas')} ·{' '}
        {pending ? `te ${pending === 1 ? 'falta' : 'faltan'} ${pending}` : '¡país completo!'}
      </p>
      <ul className="country-panel__list">
        {answered.map((q) => {
          const last = answers[q.id][answers[q.id].length - 1]
          return (
            <li key={q.id}>
              <p className="country-panel__q">{q.text}</p>
              <p className="country-panel__a">“{last.text}”</p>
              <time className="muted">{formatDate(last.date)}</time>
            </li>
          )
        })}
      </ul>
      {pending > 0 && (
        <Link to={`/individual?pais=${country.id}`} className="btn btn--primary btn--block">
          Responder otra en {country.name}
        </Link>
      )}
    </aside>
  )
}
