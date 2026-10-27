import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CountryShape from '../components/CountryShape.jsx'
import CountryStamp from '../components/CountryStamp.jsx'
import Suitcase from '../components/Suitcase.jsx'
import Title from '../components/Title.jsx'
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { formatDate, plural } from '../lib/format.js'
import { buildStickers } from '../lib/suitcase.js'
import { useJourney } from '../state/useJourney.js'

export default function Maleta() {
  const { answers, route, answeredCount, totalQuestions } = useJourney()
  const [selectedId, setSelectedId] = useState(null)
  const panelRef = useRef(null)
  const stickers = useMemo(
    () => buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers, route }),
    [answers, route],
  )
  const stuck = new Set(stickers.map((s) => s.countryId))
  const toStick = COUNTRIES.filter((c) => !stuck.has(c.id))
  const complete = stickers.filter((s) => s.complete).length
  const selected = selectedId ? COUNTRY_BY_ID[selectedId] : null

  function select(id) {
    setSelectedId((cur) => (cur === id ? null : id))
  }

  // En pantallas medianas el panel queda abajo de la maleta: se lo trae a la vista.
  // (En el celular es una hoja fija que sube desde abajo, no hace falta.)
  useEffect(() => {
    const panel = panelRef.current
    if (selectedId && panel && getComputedStyle(panel).position !== 'fixed') {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedId])

  return (
    <div className="page page--wide page--maleta">
      <header className="page__header">
        <Title>Mi maleta de viaje</Title>
        <p className="maleta-intro">
          Cada pregunta del juego es una escala de tu viaje por un país. La primera vez que respondés en un país, su
          pegatina va a tu maleta; con sus {QUESTIONS.length / COUNTRIES.length} preguntas respondidas, se completa con
          el color del atardecer.
        </p>
        {stickers.length > 0 && (
          <p className="muted maleta-hint">Tocá una pegatina para releer lo que escribiste ahí.</p>
        )}
      </header>

      <div className="stats">
        <div className="stat">
          <strong>{stickers.length}</strong>
          <span>de {COUNTRIES.length} pegatinas</span>
        </div>
        <div className="stat">
          <strong>{complete}</strong>
          <span>{complete === 1 ? 'país completo' : 'países completos'}</span>
        </div>
        <div className="stat">
          <strong>{answeredCount}</strong>
          <span>de {totalQuestions} preguntas</span>
        </div>
      </div>

      <div className="maleta-layout">
        <div className="maleta-card">
          <Suitcase
            stickers={stickers}
            selectedId={selectedId}
            onSelect={select}
            label={`Tu maleta, con ${plural(stickers.length, 'pegatina', 'pegatinas')}`}
          />
          {!stickers.length && (
            <div className="maleta-empty">
              <p>
                <strong>Tu maleta está vacía.</strong> Cada país al que respondas suma una pegatina.
              </p>
              <Link to="/individual" className="btn btn--primary">
                Responder la primera pregunta
              </Link>
            </div>
          )}
        </div>

        {selected && (
          <CountryPanel ref={panelRef} country={selected} answers={answers} onClose={() => setSelectedId(null)} />
        )}
      </div>

      {toStick.length > 0 && (
        <details className="to-stick">
          <summary>
            Por pegar <span className="to-stick__count">{toStick.length}</span>
          </summary>
          <p className="muted">Los países que todavía no visitaste. Tocá uno para ver sus preguntas.</p>
          <ul className="to-stick__list">
            {toStick.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`to-stick__item ${selectedId === c.id ? 'is-selected' : ''}`}
                  aria-pressed={selectedId === c.id}
                  onClick={() => select(c.id)}
                >
                  <CountryShape country={c} className="to-stick__shape" decorative />
                  <span>{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

function CountryPanel({ ref, country, answers, onClose }) {
  const questions = QUESTIONS.filter((q) => q.countryId === country.id)
  const answered = questions.filter((q) => answers[q.id]?.length)
  const pending = questions.length - answered.length

  return (
    <aside ref={ref} className="country-panel" aria-label={`Respuestas en ${country.name}`}>
      <div className="country-panel__head">
        <CountryStamp country={country} shape="side" />
        <button type="button" className="btn btn--text" onClick={onClose}>
          Cerrar
        </button>
      </div>
      <p className="muted">
        {answered.length
          ? `${plural(answered.length, 'pregunta respondida', 'preguntas respondidas')} · ${
              pending ? `te ${pending === 1 ? 'falta' : 'faltan'} ${pending}` : '¡país completo!'
            }`
          : `Todavía no respondiste en ${country.name}: ${plural(questions.length, 'pregunta', 'preguntas')} por delante.`}
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
          {answered.length ? `Responder otra en ${country.name}` : `Responder en ${country.name}`}
        </Link>
      )}
    </aside>
  )
}
