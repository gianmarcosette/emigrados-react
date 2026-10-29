import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COUNTRIES } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { TAB_ICONS } from './icons.jsx'

// Primer vuelo: cuatro pantallas cortas, una idea en cada una, antes de empezar.
// - Se usa un <dialog> nativo: mantiene el foco adentro y se cierra con Esc.
// - Se puede saltar en cualquier momento y volver a ver desde el pie de página.
// - Usa la misma metáfora que todo el juego: un viaje con escalas.
// - Termina eligiendo un modo: tocás uno y entrás (si pide perfil, primero se crea).

const PER_COUNTRY = QUESTIONS.length / COUNTRIES.length

const MODES = [
  { to: '/individual', name: 'Individual', tag: 'Con perfil', text: 'Para escribir a solas lo que sentís.' },
  { to: '/grupal', name: 'Grupal', tag: 'Sin perfil', text: 'Para charlar en ronda, pasándose el celular.' },
  {
    to: '/online',
    name: 'Online',
    tag: 'Con perfil · Versión de prueba',
    text: 'Para conectar con alguien que vive en otro país.',
  },
]

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
      // El foco arranca en la acción principal ("Siguiente"), no en "Saltar"
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
      <header className="first-flight__head">
        <span className="first-flight__kicker">Primer vuelo</span>
        <Stops step={step} />
        <button type="button" className="btn btn--text first-flight__skip" onClick={onClose}>
          {last ? 'Cerrar' : 'Saltar'}
        </button>
      </header>

      <div className="first-flight__body" key={step}>
        {step === 0 && (
          <>
            <RouteDrawing />
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
            <ol className="first-flight__loop">
              <li>
                <Icon>
                  <path d="M4 5h16v11H9l-5 4z" />
                  <path d="M10 9.2a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6 1v.4M12 14.4v.1" />
                </Icon>
                <p>
                  <strong>Te toca una pregunta</strong> sobre tu migración.
                </p>
              </li>
              <li>
                <Icon>{TAB_ICONS['/individual']}</Icon>
                <p>
                  <strong>Escribís lo que sentís.</strong> Queda guardado en tu diario, con fecha.
                </p>
              </li>
              <li>
                <Icon>{TAB_ICONS['/maleta']}</Icon>
                <p>
                  <strong>Sumás la pegatina de un país a tu maleta.</strong> Cuando respondés sus {PER_COUNTRY}{' '}
                  preguntas, la pegatina se ilumina.
                </p>
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
                vos lo elegís.
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
                  <button type="button" className="first-flight__mode-btn" onClick={() => go(m.to)}>
                    <Icon>{TAB_ICONS[m.to]}</Icon>
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
            Siguiente
          </button>
        )}
      </footer>
    </dialog>
  )
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="first-flight__icon" aria-hidden="true">
      {children}
    </svg>
  )
}

// Las pantallas como escalas de un vuelo, con el avión en la actual
function Stops({ step }) {
  return (
    <ol className="first-flight__stops" aria-label={`Paso ${step + 1} de ${STEPS.length}: ${STEPS[step]}`}>
      {STEPS.map((label, i) => (
        <li key={label} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} aria-hidden="true" />
      ))}
    </ol>
  )
}

// Origen y destino unidos por una ruta punteada
function RouteDrawing() {
  return (
    <svg viewBox="0 0 240 70" className="first-flight__route" aria-hidden="true">
      <path d="M20 52C70 6 170 6 220 52" className="first-flight__route-line" />
      <circle cx="20" cy="52" r="6" />
      <path d="M220 52c-3-8-10-12-10-18a10 10 0 0 1 20 0c0 6-7 10-10 18z" className="first-flight__route-pin" />
      <path
        d="M112 20l14-2 9-12h5l-5 12 9 1 3-4h4l-3 7 3 7h-4l-3-4-9 1 5 12h-5l-9-12-14-2z"
        className="first-flight__route-plane"
      />
    </svg>
  )
}
