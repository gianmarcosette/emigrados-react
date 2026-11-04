import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RELATIONS, askLink, askMessage, whatsappUrl } from '../lib/ask.js'

// "Preguntale a alguien de allá": la pregunta sale armada para WhatsApp, para abrir una
// conversación con alguien querido (o con quien hace tiempo no hablás).
// - Tu respuesta no viaja nunca sin que la sumes: el interruptor arranca apagado.
// - El mensaje se puede editar. Si lo cambiaste, elegir a quién ya no lo pisa (y se puede volver al original).
// Se monta solo mientras está abierta.
export default function AskSheet({ question, answer, profile, onClose }) {
  const dialogRef = useRef(null)
  const [relation, setRelation] = useState('mama')
  const [withAnswer, setWithAnswer] = useState(false)
  // Lo que escribiste a mano; mientras sea null, el mensaje sigue a lo que elegís
  const [draft, setDraft] = useState(null)
  const [status, setStatus] = useState('')

  const link = askLink({
    origin: window.location.origin,
    questionId: question.id,
    // Solo el primer nombre: es lo que hace falta para que sepan quién la manda
    name: profile?.name?.split(' ')[0],
    country: profile?.country,
  })
  const original = askMessage({ relation, question: question.text, link, answer: withAnswer ? answer : null })
  const text = draft ?? original

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  function close() {
    if (dialogRef.current?.open) dialogRef.current.close()
    onClose()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Listo: el mensaje quedó copiado. Pegalo en el chat que quieras.')
    } catch {
      setStatus('No se pudo copiar. Seleccioná el mensaje y copialo a mano.')
    }
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="share-sheet ask-sheet"
      aria-labelledby="ask-title"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
    >
      <header className="share-sheet__head">
        <h2 id="ask-title">Preguntale a alguien de allá</h2>
        <button type="button" className="btn btn--text" onClick={close}>
          Cerrar
        </button>
      </header>

      <div className="share-sheet__body">
        <p className="share-sheet__hint">
          A veces una pregunta abre la charla que no nos animamos a empezar. Mandásela a alguien querido, o a alguien
          con quien hace tiempo no hablás.
        </p>

        <section className="share-sheet__section" aria-labelledby="ask-who">
          <h3 id="ask-who">¿A quién se la querés hacer?</h3>
          <div className="ask-sheet__who">
            {RELATIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                className={`chip chip--toggle ${relation === r.key ? 'chip--on' : ''}`}
                aria-pressed={relation === r.key}
                onClick={() => setRelation(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        {answer && (
          <label className="relaxed-toggle share-sheet__answer">
            <input type="checkbox" checked={withAnswer} onChange={(e) => setWithAnswer(e.target.checked)} />
            <span className="relaxed-toggle__switch" aria-hidden="true" />
            <span>
              <strong>Sumar mi respuesta</strong>
              Solo si querés que la lea. Si es larga, va recortada.
            </span>
          </label>
        )}

        <section className="share-sheet__section" aria-labelledby="ask-text">
          <h3 id="ask-text">El mensaje</h3>
          <p className="share-sheet__hint">Cambialo como quieras: es tuyo.</p>
          <textarea
            className="ask-sheet__text"
            aria-labelledby="ask-text"
            value={text}
            rows={9}
            onChange={(e) => setDraft(e.target.value)}
          />
          {draft !== null && (
            <button type="button" className="btn--link" onClick={() => setDraft(null)}>
              Volver al mensaje original
            </button>
          )}
        </section>

        <div className="ask-sheet__actions">
          <a className="btn btn--whatsapp" href={whatsappUrl(text)} target="_blank" rel="noreferrer">
            Mandar por WhatsApp
          </a>
          <button type="button" className="btn btn--ghost" onClick={copy}>
            Copiar el mensaje
          </button>
        </div>
        <p className="share-sheet__hint">
          Le llega un link que le abre esta pregunta. No necesita jugar ni crear un perfil: te contesta a vos.
        </p>

        {status && (
          <p className="share-sheet__message" role="status">
            {status}
          </p>
        )}
      </div>
    </dialog>,
    document.body,
  )
}
