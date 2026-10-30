import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CountryStamp from '../components/CountryStamp.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import ShareSheet from '../components/ShareSheet.jsx'
import Title from '../components/Title.jsx'
import Suitcase from '../components/Suitcase.jsx'
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, QUESTIONS, QUESTION_BY_ID } from '../data/questions.js'
import { formatDate, formatLongDate, formatTime, plural } from '../lib/format.js'
import { buildStickers, stickerEvent } from '../lib/suitcase.js'
import { clearDraft, getDraft, latestDraft, saveDraft } from '../state/drafts.js'
import { useJourney } from '../state/useJourney.js'
import { pickQuestion } from '../state/journey.js'
import { useNightMode } from '../state/nightMode.js'

const MAX_LENGTH = 1500

// Se remonta cuando cambian los parámetros (?q= o ?pais=) para arrancar con esa pregunta.
// El perfil lo pide ProfileGate (ver App.jsx) antes de llegar acá.
export default function Individual() {
  const [params] = useSearchParams()
  return <IndividualGame key={params.toString()} params={params} />
}

function firstQuestion(params, answers) {
  const byId = QUESTION_BY_ID[Number(params.get('q'))]
  if (byId) return byId
  // Si quedó algo a medio escribir, se retoma esa pregunta
  if (!params.get('pais')) {
    const pending = latestDraft()
    if (pending && QUESTION_BY_ID[pending.questionId]) return QUESTION_BY_ID[pending.questionId]
  }
  const countryId = params.get('pais')
  if (countryId) {
    const inCountry = QUESTIONS.filter((q) => q.countryId === countryId)
    const picked = pickQuestion(inCountry, answers)
    if (picked) return picked
  }
  return pickQuestion(QUESTIONS, answers)
}

function IndividualGame({ params }) {
  const { answers, route, dispatch, answeredCount, totalQuestions, profile } = useJourney()
  const [category, setCategory] = useState('all')
  const [question, setQuestion] = useState(() => firstQuestion(params, answers))
  // Lo escrito se guarda solo, en cada tecla, hasta que se guarda la respuesta
  const [resumed, setResumed] = useState(() => getDraft(question.id))
  const [draft, setDraft] = useState(() => resumed?.text ?? '')
  const [saved, setSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const [night, toggleNight] = useNightMode()
  // La hora que se ve arriba del espacio para escribir, como en una nota nueva
  const [startedAt] = useState(() => new Date())

  const previous = answers[question.id] ?? []
  const country = COUNTRY_BY_ID[question.countryId]
  const pool = category === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.category === category)
  const pendingInPool = pool.filter((q) => !answers[q.id]?.length).length
  const finished = answeredCount === totalQuestions

  function updateDraft(text) {
    setDraft(text)
    saveDraft(question.id, text)
  }

  function startOver() {
    updateDraft('')
    setResumed(null)
  }

  function goTo(next) {
    if (!next) return
    const pending = getDraft(next.id)
    setQuestion(next)
    setResumed(pending)
    setDraft(pending?.text ?? '')
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
    clearDraft(question.id)
    setResumed(null)
    setSaved(true)
  }

  if (saved) {
    return (
      <SavedScreen
        question={question}
        country={country}
        answers={answers}
        route={route}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        profile={profile}
        onNext={() => nextQuestion()}
      />
    )
  }

  return (
    <div className="page">
      <div className="toolbar">
        <span className="pill">Individual</span>
        <label className="select">
          <span>Etapa</span>
          <select value={category} onChange={(e) => changeCategory(e.target.value)}>
            <option value="all">Todas las etapas</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <span className="toolbar__count">
          {finished
            ? '¡Diste la vuelta al mundo!'
            : `${plural(pendingInPool, 'pregunta pendiente', 'preguntas pendientes')}`}
        </span>
      </div>

      <QuestionCard
        question={question}
        passenger={profile?.name}
        passengerCode={profile?.code}
        passengerProfile={profile}
        className={night ? 'ticket--night' : ''}
      >
        {previous.length > 0 && (
          <div className="history">
            <button type="button" className="history__toggle" onClick={() => setShowHistory((v) => !v)}>
              Ya respondiste esta pregunta {plural(previous.length, 'vez', 'veces')} ·{' '}
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
          {resumed && (
            <p className="answer__resumed">
              Retomaste lo que estabas escribiendo el {formatLongDate(resumed.date)}.{' '}
              <button type="button" className="btn--link" onClick={startOver}>
                Empezar de cero
              </button>
            </p>
          )}
          <div className="answer__head">
            <label htmlFor="answer" className="answer__when">
              <span className="sr-only">Tu respuesta · </span>Hoy · {formatTime(startedAt)}
            </label>
            <button
              type="button"
              className="answer__night"
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
          <textarea
            id="answer"
            className="answer__input"
            value={draft}
            maxLength={MAX_LENGTH}
            rows={5}
            placeholder={
              previous.length ? '¿Qué responderías hoy? ¿Cambió algo?' : 'Escribí lo que sientas, sin apuro…'
            }
            onChange={(e) => updateDraft(e.target.value)}
          />
          <div className="answer__footer">
            <span className="answer__meta">
              {draft.length} / {MAX_LENGTH}
              {draft.trim() && <span className="answer__autosave"> · Guardado</span>}
            </span>
            <div className="actions">
              {answeredCount - (previous.length ? 1 : 0) > 0 && (
                <button type="button" className="btn btn--text" onClick={() => nextQuestion({ revisit: true })}>
                  Volver a una que ya respondí
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

// Después de guardar: la pegatina del país se pega en la maleta (o avanza, o se completa).
function SavedScreen({ question, country, answers, route, answeredCount, totalQuestions, profile, onNext }) {
  const [sharing, setSharing] = useState(false)
  const stickers = useMemo(
    () => buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers, route }),
    [answers, route],
  )
  const sticker = stickers.find((s) => s.countryId === country.id)
  const total = sticker?.total ?? 0
  const answeredNow = sticker?.answered ?? 0
  const repeated = (answers[question.id]?.length ?? 0) > 1
  const event = repeated ? 'revisit' : stickerEvent({ answeredBefore: answeredNow - 1, total })
  const left = total - answeredNow
  const leftText = `Te ${left === 1 ? 'queda' : 'quedan'} ${plural(left, 'pregunta', 'preguntas')} de ${country.name} para completarlo.`

  const headline = {
    new: 'Nuevo afiche en tu maleta:',
    progress: 'Una escala más en',
    complete: '¡Completaste',
    revisit: 'Volviste a pasar por',
  }[event]
  const detail = {
    new: left ? leftText : '',
    progress: leftText,
    complete: 'Respondiste todas sus preguntas: su afiche se pintó de color en tu maleta.',
    revisit: 'Tu nueva respuesta quedó junto a la anterior en el diario.',
  }[event]

  return (
    <div className="page page--narrow">
      <section className="saved">
        <svg className="saved__check" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="28" />
          <path d="M17 29l7 7 15-16" />
        </svg>
        <Title>Tu respuesta se ha guardado con éxito.</Title>
        <p className="saved__where" role="status">
          {headline} <CountryStamp country={country} size="sm" />
          {event === 'complete' && '!'}
        </p>
        {detail && <p className="muted saved__detail">{detail}</p>}
        <Suitcase
          className="suitcase--saved"
          stickers={stickers}
          freshId={event === 'new' || event === 'complete' ? country.id : null}
          selectedId={country.id}
          label={`Tu maleta, con ${plural(stickers.length, 'afiche', 'afiches')}`}
        />
        <ProgressBar value={answeredCount} max={totalQuestions} label="Preguntas respondidas" />
        <div className="actions">
          <button type="button" className="btn btn--ghost" onClick={() => setSharing(true)}>
            Compartir la pregunta
          </button>
          <Link to="/maleta" className="btn btn--ghost">
            Ver mi maleta
          </Link>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            Siguiente pregunta »
          </button>
        </div>
      </section>
      {sharing && (
        <ShareSheet
          question={question}
          answer={answers[question.id]?.at(-1)?.text}
          profile={profile}
          onClose={() => setSharing(false)}
        />
      )}
    </div>
  )
}
