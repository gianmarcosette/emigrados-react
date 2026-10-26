import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS } from '../data/questions.js'
import { TAB_ICONS } from './icons.jsx'

// Primer vuelo: tres pantallas para entender el juego antes de empezar.
// - Se usa un <dialog> nativo: mantiene el foco adentro y se cierra con Esc.
// - Se puede saltar en cualquier momento y volver a ver desde el pie de página.
// - Usa la misma metáfora que todo el juego: un viaje con escalas.

const MODES = [
  {
    to: '/individual',
    name: 'Individual',
    tag: 'Con perfil',
    text: `Preguntas para vos. Lo que escribís queda en tu diario, con fecha, y cada país al que respondés le pega una pegatina a tu maleta: respondé las ${QUESTIONS.length} y das la vuelta al mundo.`,
  },
  {
    to: '/grupal',
    name: 'Grupal',
    tag: 'Sin perfil',
    text: 'Para charlar en ronda con amigos o familia, pasándose el celular. Nada queda guardado.',
  },
  {
    to: '/online',
    name: 'Online',
    tag: 'Versión de prueba · Con perfil',
    text: 'Elegí un país y desafiá a alguien que vive ahí con preguntas de cultura general. Si los dos quieren, siguen con una charla guiada.',
  },
]

const STEPS = ['Bienvenida', 'Los modos', 'Tu privacidad']

export default function FirstFlight({ open, hasProfile, onClose }) {
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
              Emigrados es un juego de preguntas para hablar de todo lo que implica emigrar: lo que pensabas antes de
              irte, lo que sentís en tu nuevo lugar y cómo te fuiste reinventando.
            </p>
            <p className="muted">No hay respuestas correctas, ni puntos que perder, ni apuro.</p>
          </>
        )}

        {step === 1 && (
          <>
            <h2 id="first-flight-title" className="first-flight__title">
              Tres formas de viajar
            </h2>
            <ul className="first-flight__modes">
              {MODES.map((m) => (
                <li key={m.to}>
                  <svg viewBox="0 0 24 24" className="first-flight__icon" aria-hidden="true">
                    {TAB_ICONS[m.to]}
                  </svg>
                  <div>
                    <p className="first-flight__mode">
                      <strong>{m.name}</strong> <span>{m.tag}</span>
                    </p>
                    <p>{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="first-flight__note">
              ¿Por qué cada pregunta tiene un país? Es la escala de tu viaje: no habla de ese país, suma su pegatina a
              tu maleta.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 id="first-flight-title" className="first-flight__title">
              Tu país y tu privacidad
            </h2>
            <p>
              Para crear tu perfil te vamos a pedir el <strong>país donde vivís hoy</strong>. Sirve para una sola cosa:
              conectarte en el modo Online con personas de otros países y que el duelo sea sobre tu país.
            </p>
            <ul className="first-flight__privacy">
              <li>Por ahora, todo se guarda solo en este dispositivo.</li>
              <li>Nadie más puede leer tu perfil, tus respuestas ni tu diario.</li>
              <li>En el modo Online, la otra persona solo ve tu nombre, tu edad y el país donde vivís.</li>
              <li>Podés borrar tu perfil y tus respuestas cuando quieras, desde Mi perfil.</li>
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
        {last &&
          (hasProfile ? (
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Seguir jugando
            </button>
          ) : (
            <div className="first-flight__cta">
              <button type="button" className="btn btn--primary" onClick={() => go('/perfil')}>
                Crear mi perfil
              </button>
              <button type="button" className="btn btn--text" onClick={() => go('/grupal')}>
                Jugar en grupo sin perfil
              </button>
            </div>
          ))}
      </footer>
    </dialog>
  )
}

// Las tres pantallas como escalas de un vuelo, con el avión en la actual
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
