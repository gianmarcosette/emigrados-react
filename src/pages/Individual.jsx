import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CountryStamp from '../components/CountryStamp.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import WorldMap from '../components/WorldMap.jsx'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, QUESTIONS, QUESTION_BY_ID } from '../data/questions.js'
import { formatDate, plural } from '../lib/format.js'
import { useJourney } from '../state/useJourney.js'
import { pickQuestion } from '../state/journey.js'

const MAX_LENGTH = 1500

// Se remonta cuando cambian los parámetros (?q= o ?pais=) para arrancar con esa pregunta.
export default function Individual() {
  const [params] = useSearchParams()
  return <IndividualGame key={params.toString()} params={params} />
}

function firstQuestion(params, answers) {
  const byId = QUESTION_BY_ID[Number(params.get('q'))]
  if (byId) return byId
  const countryId = params.get('pais')
  if (countryId) {
    const inCountry = QUESTIONS.filter((q) => q.countryId === countryId)
    const picked = pickQuestion(inCountry, answers)
    if (picked) return picked
  }
  return pickQuestion(QUESTIONS, answers)
}

function IndividualGame({ params }) {
  const { answers, dispatch, answeredCount, totalQuestions, pins, routeCountries, name } = useJourney()
  const [category, setCategory] = useState('all')
  const [question, setQuestion] = useState(() => firstQuestion(params, answers))
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(true)

  const previous = answers[question.id] ?? []
  const country = COUNTRY_BY_ID[question.countryId]
  const pool = category === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.category === category)
  const pendingInPool = pool.filter((q) => !answers[q.id]?.length).length
  const finished = answeredCount === totalQuestions

  function goTo(next) {
    if (!next) return
    setQuestion(next)
    setDraft('')
    setSaved(false)
    setShowHistory(true)
  }

  function nextQuestion({ revisit = false } = {}) {
    goTo(pickQuestion(pool, answers, { excludeId: question.id, revisit }))
  }

  function changeCategory(value) {
    setCategory(value)
    const nextPool = value === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.category === value)
    goTo(pickQuestion(nextPool, answers, { excludeId: question.id }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    dispatch({ type: 'saveAnswer', questionId: question.id, text })
    setSaved(true)
  }

  if (saved) {
    const firstTime = previous.length <= 1
    return (
      <div className="page page--narrow">
        <section className="saved">
          <p className="saved__check" aria-hidden="true">
            ✔
          </p>
          <h1>Tu respuesta se ha guardado con éxito.</h1>
          <p className="saved__where">
            {firstTime ? 'Nueva escala en tu vuelta al mundo:' : 'Volviste a pasar por:'}{' '}
            <CountryStamp country={country} size="sm" />
          </p>
          <WorldMap pins={pins} route={routeCountries.slice(-8)} highlightId={country.id} compact />
          <ProgressBar value={answeredCount} max={totalQuestions} label="Preguntas respondidas" />
          <p className="muted">
            En el mapa encontrarás todas tus respuestas y las preguntas que faltan por responder para dar la vuelta al
            mundo.
          </p>
          <div className="actions">
            <Link to="/mapa" className="btn btn--ghost">
              Ver mi mapa
            </Link>
            <button type="button" className="btn btn--primary" onClick={() => nextQuestion()}>
              Siguiente pregunta »
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="toolbar">
        <span className="pill">Individual{name.trim() ? ` · ${name.trim()}` : ''}</span>
        <label className="select">
          <span>Etapa</span>
          <select value={category} onChange={(e) => changeCategory(e.target.value)}>
            <option value="all">Todas las etapas</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </label>
        <span className="toolbar__count">
          {finished ? '🌍 ¡Diste la vuelta al mundo!' : `${plural(pendingInPool, 'pregunta pendiente', 'preguntas pendientes')}`}
        </span>
      </div>

      <QuestionCard question={question}>
        {previous.length > 0 && (
          <div className="history">
            <button type="button" className="history__toggle" onClick={() => setShowHistory((v) => !v)}>
              🔁 Ya respondiste esta pregunta {plural(previous.length, 'vez', 'veces')} ·{' '}
              {showHistory ? 'Ocultar' : 'Comparar'}
            </button>
            {showHistory && (
              <ol className="history__list">
                {previous.map((a, i) => (
                  <li key={a.date + i}>
                    <time>{formatDate(a.date)}</time>
                    <p>{a.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        <form className="answer" onSubmit={handleSubmit}>
          <label htmlFor="answer" className="sr-only">
            Tu respuesta
          </label>
          <textarea
            id="answer"
            className="answer__input"
            value={draft}
            maxLength={MAX_LENGTH}
            rows={6}
            placeholder={previous.length ? '¿Qué responderías hoy? ¿Cambió algo?' : 'Escribí lo que sientas, sin apuro…'}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="answer__footer">
            <span className="muted">
              {draft.length}/{MAX_LENGTH}
            </span>
            <div className="actions">
              {answeredCount - (previous.length ? 1 : 0) > 0 && (
                <button type="button" className="btn btn--text" onClick={() => nextQuestion({ revisit: true })}>
                  🔁 Repetir una anterior
                </button>
              )}
              <button type="button" className="btn btn--ghost" onClick={() => nextQuestion()}>
                Saltar »
              </button>
              <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
                Guardar respuesta
              </button>
            </div>
          </div>
        </form>
      </QuestionCard>

      <ProgressBar value={answeredCount} max={totalQuestions} label="Tu vuelta al mundo" />
    </div>
  )
}
