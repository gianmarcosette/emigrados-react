import { useCallback, useEffect, useRef, useState } from 'react'
import { ConfirmContext } from '../state/confirm.js'

// Ventana de confirmación del juego, en lugar de la del navegador:
// - el botón dice qué va a pasar ("Borrar todo"), no "Aceptar";
// - explica la consecuencia antes de que ocurra;
// - el foco arranca en la opción segura, para que un Enter apurado no borre nada;
// - Esc o tocar afuera cancelan.
export default function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)
  const dialogRef = useRef(null)
  const resolveRef = useRef(null)

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolveRef.current = resolve
        setRequest(options)
      }),
    [],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (request && !dialog.open) {
      dialog.showModal()
      dialog.querySelector('[data-safe]')?.focus()
    }
  }, [request])

  function finish(answer) {
    resolveRef.current?.(answer)
    resolveRef.current = null
    setRequest(null)
    if (dialogRef.current?.open) dialogRef.current.close()
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        className="confirm"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onCancel={(e) => {
          e.preventDefault()
          finish(false)
        }}
        onClick={(e) => {
          // Tocar el fondo oscuro cancela
          if (e.target === dialogRef.current) finish(false)
        }}
      >
        {request && (
          <div className="confirm__box">
            <h2 id="confirm-title" className="confirm__title">
              {request.title}
            </h2>
            {request.message && (
              <p id="confirm-message" className="confirm__message">
                {request.message}
              </p>
            )}
            <div className="confirm__actions">
              <button type="button" className="btn btn--ghost" data-safe onClick={() => finish(false)}>
                {request.cancelLabel ?? 'Cancelar'}
              </button>
              <button
                type="button"
                className={`btn ${request.danger ? 'btn--danger' : 'btn--primary'}`}
                onClick={() => finish(true)}
              >
                {request.confirmLabel}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  )
}
