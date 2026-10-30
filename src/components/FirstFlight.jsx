import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COUNTRIES } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import CountryPoster from './posters.jsx'
import { Bird, Gull, Icaro, Leaf, ModeIcon, Star } from './paper.jsx'

// Primer vuelo: cuatro pantallas cortas, una idea en cada una, antes de empezar.
// - Se usa un <dialog> nativo: mantiene el foco adentro y se cierra con Esc.
// - Se puede saltar en cualquier momento y volver a ver desde el pie de página.
// - Usa la misma metáfora que todo el juego: un viaje con escalas. Cada pantalla tiene un
//   recorte de papel arriba y el texto abajo; el progreso es un pájaro que avanza por la ruta.
// - Termina eligiendo un modo: tocás uno y entrás (si pide perfil, primero se crea).

const PER_COUNTRY = QUESTIONS.length / COUNTRIES.length

const MODES = [
  {
    to: '/individual',
    mode: 'individual',
    name: 'Individual',
    tag: 'Con perfil',
    text: 'Para escribir a solas lo que sentís.',
  },
  {
    to: '/grupal',
    mode: 'grupal',
    name: 'Grupal',
    tag: 'Sin perfil',
    text: 'Para charlar en ronda, pasándose el celular.',
  },
  {
    to: '/online',
    mode: 'online',
    name: 'Online',
    tag: 'Versión de prueba',
    text: 'Para conectar con alguien que vive en otro país.',
  },
]

// El papel de fondo del recorte de cada pantalla
const ART_COLORS = ['var(--halftone-sky)', '#ffd23f', '#e8664a', 'var(--halftone-sky)']

const STEPS = ['Bienvenida', 'Cómo se juega', 'Tu privacidad', 'Cómo viajar']

export default function FirstFlight({ open, onClose }) {
  const dialogRef = useRef(null)
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setStep(0)
      dialog.showModal()
      // El foco arranca en la acción principal, no en "Saltar"
      dialog.querySelector('.first-flight__foot .btn--primary')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function go(to) {
    onClose()
    navigate(to)
  }

  const last = step === STEPS.length - 1

  return (
    // Esc o "Saltar" disparan `close`; ahí se avisa que ya se vio
    <dialog ref={dialogRef} className="first-flight" aria-labelledby="first-flight-title" onClose={onClose}>
      <div className="first-flight__art" style={{ background: ART_COLORS[step] }} key={`art-${step}`}>
        {step === 0 && <Icaro className="first-flight__icaro" />}
        {step === 1 && <LoopArt />}
        {step === 2 && <PrivacyArt />}
        {step === 3 && <MeetArt />}
      </div>

      <div className="first-flight__sheet">
        <header className="first-flight__head">
          <Progress step={step} />
          <button type="button" className="btn btn--text first-flight__skip" onClick={onClose}>
            {last ? 'Cerrar' : 'Saltar'}
          </button>
        </header>

        <div className="first-flight__body" key={step}>
          {step === 0 && (
            <>
              <h2 id="first-flight-title" className="first-flight__title">
                Te damos la bienvenida a bordo
              </h2>
              <p>
                Emigrados es un juego de preguntas para hablar de lo que implica emigrar: lo que pensabas antes de irte,
                lo que sentís en tu nuevo lugar y cómo te fuiste reinventando.
              </p>
              <p className="first-flight__promise">No hay respuestas correctas, ni puntos que perder, ni apuro.</p>
            </>
          )}

          {step === 1 && (
            <>
              <h2 id="first-flight-title" className="first-flight__title">
                Cada pregunta es una escala
              </h2>
              <ol className="first-flight__steps">
                <li>
                  <span>
                    <strong>Te toca una pregunta</strong> sobre tu migración.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Escribís lo que sentís.</strong> Queda en tu diario, con fecha.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Ganás el afiche del país</strong> para tu maleta. Con sus {PER_COUNTRY} preguntas, se pinta
                    de color.
                  </span>
                </li>
              </ol>
              <p className="first-flight__note">
                El país no es el tema de la pregunta: es la escala de tu viaje. Respondé las {QUESTIONS.length} y das la
                vuelta al mundo.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 id="first-flight-title" className="first-flight__title">
                Lo tuyo es tuyo
              </h2>
              <ul className="first-flight__privacy">
                <li>Lo que escribís en el modo Individual queda solo en tu celular. Nadie más lo puede leer.</li>
                <li>
                  En el modo Online, la otra persona ve tu nombre, tu edad y el país donde vivís. Dónde naciste, solo si
                  vos querés.
                </li>
                <li>Podés borrar tu perfil y todo lo que escribiste cuando quieras, desde Mi perfil.</li>
              </ul>
            </>
          )}

          {step === 3 && (
            <>
              <h2 id="first-flight-title" className="first-flight__title">
                ¿Cómo querés viajar?
              </h2>
              <ul className="first-flight__modes">
                {MODES.map((m) => (
                  <li key={m.to}>
                    <button
                      type="button"
                      className={`first-flight__mode-btn first-flight__mode-btn--${m.mode}`}
                      onClick={() => go(m.to)}
                    >
                      <ModeIcon mode={m.mode} />
                      <span>
                        <span className="first-flight__mode">
                          <strong>{m.name}</strong> <span>{m.tag}</span>
                        </span>
                        <span className="first-flight__mode-text">{m.text}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <footer className="first-flight__foot">
          {step > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}>
              Atrás
            </button>
          ) : (
            <span />
          )}
          {!last && (
            <button type="button" className="btn btn--primary" onClick={() => setStep(step + 1)}>
              {step === 0 ? 'Empezar el viaje' : 'Siguiente'}
            </button>
          )}
        </footer>
      </div>
    </dialog>
  )
}

// El progreso: una ruta punteada con una escala por pantalla y un pájaro en la actual
const STOPS = [
  [10, 22],
  [57, 11],
  [103, 11],
  [150, 22],
]

function Progress({ step }) {
  const [x, y] = STOPS[step]
  return (
    <svg
      viewBox="0 0 160 30"
      className="first-flight__progress"
      role="img"
      aria-label={`Paso ${step + 1} de ${STEPS.length}: ${STEPS[step]}`}
    >
      <path d="M10 22 C50 4 110 4 150 22" className="first-flight__progress-line" />
      {STOPS.map(([cx, cy], i) => (
        <circle key={cx} cx={cx} cy={cy} r="4" className={i < step ? 'is-done' : ''} />
      ))}
      <Bird x={x} y={y - 4} s={0.3} fill="#e8664a" />
    </svg>
  )
}

// Pregunta, diario y afiche: lo que pasa con cada pregunta
function LoopArt() {
  return (
    <div className="first-flight__loop" aria-hidden="true">
      <span className="first-flight__tile first-flight__tile--question">?</span>
      <span className="first-flight__arrow">→</span>
      <span className="first-flight__tile first-flight__tile--note">
        <i />
        <i />
        <i />
      </span>
      <span className="first-flight__arrow">→</span>
      <svg viewBox="-33 -43 66 86" className="first-flight__poster">
        <CountryPoster countryId="724" uid="primer-vuelo-afiche" complete fallback={null} />
      </svg>
    </div>
  )
}

// El corazón con el pájaro, entre hojas: lo tuyo queda cuidado
function PrivacyArt() {
  return (
    <svg viewBox="0 0 300 170" className="first-flight__scene" aria-hidden="true">
      <Leaf x={52} y={160} s={1} fill="#ffd23f" rot={-18} />
      <Leaf x={252} y={160} s={0.9} fill="#ffd23f" rot={20} />
      <g transform="translate(80 -6) scale(0.55)">
        <path
          filter="url(#papel-corte)"
          d="M200 318 C150 286 86 242 86 172 C86 126 120 98 156 98 C178 98 192 110 200 124 C208 110 222 98 244 98 C280 98 314 126 314 172 C314 242 250 286 200 318 Z"
          fill="#f3ede0"
        />
        <Bird x={200} y={188} s={2.1} fill="#e8664a" />
      </g>
      <Star x={250} y={36} r={14} fill="#ffd23f" />
    </svg>
  )
}

// Dos rutas que se juntan: cada modo es una forma de encontrarse
function MeetArt() {
  return (
    <svg viewBox="0 0 300 160" className="first-flight__scene" aria-hidden="true">
      <path d="M20 140 C80 120 106 80 122 62" className="first-flight__trail" stroke="#f3ede0" />
      <path d="M280 140 C220 120 194 80 180 62" className="first-flight__trail" stroke="#ffd23f" />
      <Bird x={124} y={36} s={0.62} fill="#f3ede0" rot={-8} />
      <Bird x={178} y={36} s={0.62} fill="#ffd23f" rot={8} />
      <Gull x={60} y={40} s={0.7} fill="#f3ede0" rot={-8} />
      <Gull x={250} y={60} s={0.5} fill="#e8664a" rot={8} />
    </svg>
  )
}
