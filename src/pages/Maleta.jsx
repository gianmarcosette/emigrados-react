import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CountryShape from '../components/CountryShape.jsx'
import CountryStamp from '../components/CountryStamp.jsx'
import Suitcase from '../components/Suitcase.jsx'
import Title from '../components/Title.jsx'
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { formatDate, plural } from '../lib/format.js'
import { buildStickers, clampPlace, placeStickers } from '../lib/suitcase.js'
import { SUITCASE_COLORS, suitcaseColor, useSuitcaseLook } from '../state/suitcaseLook.js'
import { useJourney } from '../state/useJourney.js'

export default function Maleta() {
  const { answers, route, answeredCount, totalQuestions } = useJourney()
  const [selectedId, setSelectedId] = useState(null)
  const panelRef = useRef(null)
  const [look, setLook] = useSuitcaseLook()
  // Acomodando: qué afiche se está moviendo y dónde va mientras el dedo no lo suelta
  const [editing, setEditing] = useState(false)
  const [pickedId, setPickedId] = useState(null)
  const [dragging, setDragging] = useState(null)
  const auto = useMemo(
    () => buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers, route }),
    [answers, route],
  )
  const places = useMemo(
    () => (dragging ? { ...look.places, [dragging.id]: dragging.place } : look.places),
    [dragging, look.places],
  )
  const stickers = useMemo(() => placeStickers(auto, places), [auto, places])
  const stuck = new Set(stickers.map((s) => s.countryId))
  const toStick = COUNTRIES.filter((c) => !stuck.has(c.id))
  const complete = stickers.filter((s) => s.complete).length
  const selected = selectedId ? COUNTRY_BY_ID[selectedId] : null

  function select(id) {
    setSelectedId((cur) => (cur === id ? null : id))
  }

  function startEditing() {
    setSelectedId(null)
    setPickedId(stickers[0]?.countryId ?? null)
    setEditing(true)
  }

  // Mientras se arrastra solo se ve; al soltar, queda guardado
  function move(id, place, done) {
    if (!done) return setDragging({ id, place })
    setDragging(null)
    setLook({ ...look, places: { ...look.places, [id]: place } })
  }

  function rotate(delta) {
    const s = stickers.find((st) => st.countryId === pickedId)
    if (s) move(s.countryId, clampPlace({ x: s.x, y: s.y, rotate: s.rotate + delta }), true)
  }

  const picked = pickedId ? COUNTRY_BY_ID[pickedId] : null

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
          afiche va a tu maleta, en gris; cuando respondés sus {QUESTIONS.length / COUNTRIES.length} preguntas, el
          afiche se pinta de color.
        </p>
        {stickers.length > 0 && !editing && (
          <p className="muted maleta-hint">Tocá un afiche para releer lo que escribiste ahí.</p>
        )}
      </header>

      <div className="stats">
        <div className="stat">
          <strong>{stickers.length}</strong>
          <span>de {COUNTRIES.length} afiches</span>
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
          {editing ? (
            <div className="maleta-tools">
              <fieldset className="maleta-tools__colors">
                <legend>Color de la maleta</legend>
                {SUITCASE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`maleta-tools__swatch ${look.color === c.id ? 'is-selected' : ''}`}
                    style={{ '--body': c.body, '--strap': c.strap }}
                    aria-pressed={look.color === c.id}
                    title={c.label}
                    onClick={() => setLook({ ...look, color: c.id })}
                  >
                    <span className="sr-only">{c.label}</span>
                  </button>
                ))}
              </fieldset>
              {stickers.length > 0 && (
                <div className="maleta-tools__move">
                  <p>
                    {picked ? (
                      <>
                        Arrastrá los afiches donde quieras. <strong>{picked.name}</strong>:
                      </>
                    ) : (
                      'Arrastrá los afiches donde quieras.'
                    )}
                  </p>
                  <button type="button" className="btn btn--ghost" disabled={!picked} onClick={() => rotate(-8)}>
                    <span aria-hidden="true">↺</span> Girar<span className="sr-only"> a la izquierda</span>
                  </button>
                  <button type="button" className="btn btn--ghost" disabled={!picked} onClick={() => rotate(8)}>
                    Girar<span className="sr-only"> a la derecha</span> <span aria-hidden="true">↻</span>
                  </button>
                </div>
              )}
              <div className="maleta-tools__end">
                <button
                  type="button"
                  className="btn btn--text"
                  disabled={!Object.keys(look.places).length}
                  onClick={() => setLook({ ...look, places: {} })}
                >
                  Ordenar sola
                </button>
                <button type="button" className="btn btn--primary" onClick={() => setEditing(false)}>
                  Listo
                </button>
              </div>
            </div>
          ) : (
            <div className="maleta-tools maleta-tools--closed">
              <button type="button" className="btn btn--ghost" onClick={startEditing}>
                Acomodar mi maleta
              </button>
            </div>
          )}
          <Suitcase
            stickers={stickers}
            look={suitcaseColor(look.color)}
            selectedId={editing ? null : selectedId}
            onSelect={editing ? undefined : select}
            editing={editing}
            pickedId={pickedId}
            onPick={setPickedId}
            onMove={move}
            label={
              editing
                ? 'Tu maleta: arrastrá cada afiche, o elegilo y movelo con las flechas del teclado'
                : `Tu maleta, con ${plural(stickers.length, 'afiche', 'afiches')}`
            }
          />
          {!stickers.length && !editing && (
            <div className="maleta-empty">
              <p>
                <strong>Tu maleta está vacía.</strong> Cada país al que respondas suma un afiche.
              </p>
              <Link to="/individual" className="btn btn--primary">
                Responder la primera pregunta
              </Link>
            </div>
          )}
        </div>

        {selected && !editing && (
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
