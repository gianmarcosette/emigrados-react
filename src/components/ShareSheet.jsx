import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CATEGORY_BY_KEY } from '../data/questions.js'
import { canvasToFile, clipAnswer, loadShareFonts, renderSticker, renderStory } from '../lib/shareCard.js'
import { flightCode, seatFor } from '../lib/ticket.js'

const POSITION_LABELS = { top: 'Arriba', middle: 'Al medio', bottom: 'Abajo' }
const STYLE_LABELS = { shadow: 'Blanco con sombra', white: 'Blanco', black: 'Negro' }

// Compartir una pregunta como historia (Instagram, TikTok, WhatsApp): la tarjeta de embarque
// en líneas sobre una foto propia o sobre el cielo del juego.
// - La respuesta no se comparte nunca sin que la persona lo pida: el interruptor arranca
//   apagado cada vez que se abre.
// - La foto se usa solo en este dispositivo.
// Se monta solo mientras está abierta (así todo vuelve a empezar la próxima vez).
export default function ShareSheet({ question, answer, profile, onClose }) {
  const dialogRef = useRef(null)
  const previewRef = useRef(null)
  const fileInput = useRef(null)
  const fileRef = useRef(null)
  const [image, setImage] = useState(null)
  const [position, setPosition] = useState('bottom')
  const [style, setStyle] = useState('shadow')
  const [withAnswer, setWithAnswer] = useState(false)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')

  const data = {
    question: question.text,
    flight: flightCode(question.id),
    stage: CATEGORY_BY_KEY[question.category].label,
    seat: seatFor(question.id),
    code: profile?.code ?? null,
    answer: withAnswer && answer ? clipAnswer(answer) : null,
  }
  const slug = `emigrados-${data.flight.replace(' ', '').toLowerCase()}`

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  // La vista previa es la imagen final; el archivo queda listo para compartir al toque
  // (algunos celulares no dejan compartir si se tarda en armarlo después del toque)
  useEffect(() => {
    let active = true
    setReady(false)
    loadShareFonts().then(async () => {
      if (!active || !previewRef.current) return
      renderStory(previewRef.current, { data, image, position, style })
      const file = await canvasToFile(previewRef.current, `${slug}.png`)
      if (active) {
        fileRef.current = file
        setReady(true)
      }
    })
    return () => {
      active = false
    }
    // data se arma en cada render; lo que cambia la imagen son estos valores
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, position, style, withAnswer])

  async function pickPhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setImage(await loadImage(file))
      setMessage('')
    } catch {
      setMessage('No pudimos abrir esa foto. Probá con otra.')
    }
  }

  async function share() {
    const file = fileRef.current
    if (!file) return
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] })
      } catch (err) {
        if (err?.name !== 'AbortError') download(file)
      }
    } else {
      download(file)
      setMessage('Listo: la imagen se descargó. Subila desde tu celular como historia.')
    }
  }

  async function downloadSticker() {
    await loadShareFonts()
    const canvas = document.createElement('canvas')
    renderSticker(canvas, { data, style })
    download(await canvasToFile(canvas, `${slug}-transparente.png`))
    setMessage('Listo: se descargó la tarjeta sola, con fondo transparente, para pegarla sobre tus fotos.')
  }

  function close() {
    if (dialogRef.current?.open) dialogRef.current.close()
    onClose()
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="share-sheet"
      aria-labelledby="share-title"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
    >
      <header className="share-sheet__head">
        <h2 id="share-title">Compartir esta pregunta</h2>
        <button type="button" className="btn btn--text" onClick={close}>
          Cerrar
        </button>
      </header>

      <div className="share-sheet__body">
        <figure className="share-sheet__preview">
          <canvas ref={previewRef} role="img" aria-label={`Vista previa de la historia: ${question.text}`} />
        </figure>

        <div className="share-sheet__controls">
          <div className="share-sheet__group">
            <p className="share-sheet__label">Fondo</p>
            <div className="share-sheet__row">
              <button type="button" className="btn btn--ghost" onClick={() => fileInput.current?.click()}>
                {image ? 'Cambiar foto' : 'Elegir una foto'}
              </button>
              {image && (
                <button type="button" className="btn btn--text" onClick={() => setImage(null)}>
                  Usar el cielo del juego
                </button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              onChange={pickPhoto}
            />
            <p className="share-sheet__hint">
              Una foto tuya que responda la pregunta: un lugar, una comida, alguien. Se usa solo en este dispositivo, no
              se sube a ningún lado.
            </p>
          </div>

          <Choice label="Dónde va la tarjeta" options={POSITION_LABELS} value={position} onChange={setPosition} />
          <Choice label="Color de las líneas" options={STYLE_LABELS} value={style} onChange={setStyle} />

          {answer && (
            <label className="relaxed-toggle share-sheet__answer">
              <input type="checkbox" checked={withAnswer} onChange={(e) => setWithAnswer(e.target.checked)} />
              <span className="relaxed-toggle__switch" aria-hidden="true" />
              <span>
                <strong>Incluir mi respuesta</strong>
                Solo si querés que se vea. Si es larga, va recortada.
              </span>
            </label>
          )}

          <div className="share-sheet__actions">
            <button type="button" className="btn btn--primary" disabled={!ready} onClick={share}>
              {ready ? 'Compartir' : 'Preparando la imagen…'}
            </button>
            <button type="button" className="btn btn--text" onClick={downloadSticker}>
              Descargar la tarjeta sola (fondo transparente)
            </button>
          </div>
          {message && (
            <p className="share-sheet__message" role="status">
              {message}
            </p>
          )}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

function Choice({ label, options, value, onChange }) {
  return (
    <fieldset className="share-sheet__group">
      <legend className="share-sheet__label">{label}</legend>
      <div className="share-sheet__seg">
        {Object.entries(options).map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

// La foto del celular, ya girada como se ve en la galería
async function loadImage(file) {
  if (globalThis.createImageBitmap) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Algunos navegadores no aceptan esa opción: se prueba con una imagen común
    }
  }
  const img = new Image()
  img.src = URL.createObjectURL(file)
  await img.decode()
  return img
}

function download(file) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
