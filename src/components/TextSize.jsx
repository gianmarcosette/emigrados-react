import { useEffect, useRef, useState } from 'react'
import { TEXT_SIZES, applyTextSize, detectDeviceBase, readTextSize, saveTextSize } from '../lib/textSize.js'

// Botón "Aa" en la barra de arriba, en todas las pantallas. Abre una ventana con los
// cinco tamaños; el cambio se ve al instante, sin tener que confirmar.
export default function TextSize() {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(readTextSize)
  const dialogRef = useRef(null)
  const fromDevice = detectDeviceBase() !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      dialog.querySelector('input:checked')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function choose(id) {
    setSize(id)
    applyTextSize(id)
    saveTextSize(id)
  }

  return (
    <>
      <button
        type="button"
        className="text-size-btn"
        aria-haspopup="dialog"
        title="Tamaño de letra"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">Aa</span>
        <span className="sr-only">Tamaño de letra</span>
      </button>

      <dialog
        ref={dialogRef}
        className="text-size"
        aria-labelledby="text-size-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Tocar el fondo oscuro cierra
          if (e.target === dialogRef.current) setOpen(false)
        }}
      >
        <div className="text-size__box">
          <h2 id="text-size-title" className="text-size__title">
            Tamaño de letra
          </h2>
          <p className="text-size__note">
            {fromDevice
              ? '"Normal" es la letra que tenés configurada en tu dispositivo.'
              : '"Normal" es el tamaño estándar.'}
          </p>

          <fieldset className="text-size__options">
            <legend className="sr-only">Elegí un tamaño</legend>
            {TEXT_SIZES.map((s) => (
              <label key={s.id} className={`text-size__option ${size === s.id ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="text-size"
                  value={s.id}
                  checked={size === s.id}
                  onChange={() => choose(s.id)}
                />
                {/* Cada "Aa" se ve con el tamaño que elige, relativo al actual */}
                <span
                  className="text-size__sample"
                  aria-hidden="true"
                  style={{ fontSize: `${(1.4 * s.scale) / TEXT_SIZES.find((t) => t.id === size).scale}em` }}
                >
                  Aa
                </span>
                <span className="text-size__label">{s.label}</span>
              </label>
            ))}
          </fieldset>

          <p className="text-size__preview">¿Qué fue lo primero que extrañaste cuando te fuiste?</p>

          <button type="button" className="btn btn--primary btn--block" onClick={() => setOpen(false)}>
            Listo
          </button>
        </div>
      </dialog>
    </>
  )
}
