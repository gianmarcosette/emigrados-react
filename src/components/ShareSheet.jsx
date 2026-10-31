import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORY_BY_KEY } from '../data/questions.js'
import { canvasToFile, clipAnswer, loadShareFonts, renderSticker, renderStory } from '../lib/shareCard.js'
import { flightCode, gateFor, seatFor, stageColor } from '../lib/ticket.js'

const STICKERS = [
  { style: 'shadow', label: 'Blanco con sombra', hint: 'Para fotos oscuras o con colores', file: 'blanca' },
  { style: 'black', label: 'Negro', hint: 'Para fotos claras', file: 'negra' },
  { style: 'color', label: 'A color', hint: 'Con los papeles del juego', file: 'color' },
]

// Compartir una pregunta en historias (Instagram, TikTok, WhatsApp).
// - Lo principal es la tarjeta sola, con fondo transparente: la persona la pega sobre la
//   foto que quiera, como quiera (estilo Strava). La foto nunca pasa por el juego.
// - Si no quiere usar una foto propia, hay una historia lista con la tarjeta centrada
//   sobre el cobalto del juego.
// - La respuesta no se comparte nunca sin que la persona lo pida: el interruptor arranca
//   apagado cada vez que se abre.
// Se monta solo mientras está abierta (así todo vuelve a empezar la próxima vez).
export default function ShareSheet({ question, answer, profile, onClose }) {
  const dialogRef = useRef(null)
  const canvases = useRef({})
  const files = useRef({})
  const [withAnswer, setWithAnswer] = useState(false)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')

  const data = {
    question: question.text,
    flight: flightCode(question.id),
    stage: CATEGORY_BY_KEY[question.category].label,
    stageColor: stageColor(question.category),
    country: COUNTRY_BY_ID[question.countryId].name,
    gate: gateFor(question.category),
    seat: seatFor(question.id),
    code: profile?.code ?? null,
    answer: withAnswer && answer ? clipAnswer(answer) : null,
  }
  const slug = `emigrados-${data.flight.replace(' ', '').toLowerCase()}`

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  // Las vistas previas son las imágenes finales; los archivos quedan listos de antemano
  // (algunos celulares no dejan compartir si se tarda en armarlos después del toque)
  useEffect(() => {
    let active = true
    setReady(false)
    loadShareFonts().then(async () => {
      const c = canvases.current
      if (!active || !c.story) return
      for (const { style } of STICKERS) renderSticker(c[style], { data, style })
      renderStory(c.story, { data })
      const made = { story: await canvasToFile(c.story, `${slug}-historia.png`) }
      for (const { style, file } of STICKERS) {
        made[style] = await canvasToFile(c[style], `${slug}-transparente-${file}.png`)
      }
      if (active) {
        files.current = made
        setReady(true)
      }
    })
    return () => {
      active = false
    }
    // data se arma en cada render; lo único que cambia las imágenes es la respuesta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withAnswer])

  // En el celular abre el menú para compartir (desde ahí se guarda en Fotos o se sube a una
  // historia); en la compu, descarga el archivo
  async function send(kind) {
    const file = files.current[kind]
    if (!file) return
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }
    download(file)
    setMessage(
      kind === 'story'
        ? 'Listo: la historia se descargó. Subila desde tu celular.'
        : 'Listo: la tarjeta se descargó. Pegala sobre la foto que quieras.',
    )
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

        <section className="share-sheet__section" aria-labelledby="share-stickers">
          <h3 id="share-stickers">Tarjeta para tus fotos</h3>
          <p className="share-sheet__hint">
            Con fondo transparente: guardala y pegala sobre la foto que quieras, donde quieras. Tu foto no pasa por el
            juego.
          </p>
          <ul className="share-sheet__stickers">
            {STICKERS.map(({ style, label, hint }) => (
              <li key={style}>
                <div className={`share-sheet__sticker share-sheet__sticker--${style}`}>
                  <canvas
                    ref={(el) => (canvases.current[style] = el)}
                    role="img"
                    aria-label={`Tarjeta en ${label.toLowerCase()}`}
                  />
                </div>
                <p>
                  <strong>{label}</strong>
                  <span>{hint}</span>
                </p>
                <button type="button" className="btn btn--primary" disabled={!ready} onClick={() => send(style)}>
                  Guardar
                </button>
              </li>
            ))}
          </ul>
          <p className="share-sheet__hint">
            En Instagram: abrí tu foto como historia y sumá la tarjeta como sticker. En iPhone, también podés tocarla en
            Fotos, elegir Copiar y pegarla en la historia.
          </p>
        </section>

        <section className="share-sheet__section share-sheet__ready" aria-labelledby="share-story">
          <canvas
            ref={(el) => (canvases.current.story = el)}
            className="share-sheet__story"
            role="img"
            aria-label={`Historia lista: ${question.text}`}
          />
          <div>
            <h3 id="share-story">O una historia lista</h3>
            <p className="share-sheet__hint">La tarjeta a color sobre el azul de Emigrados, para subirla tal cual.</p>
            <button type="button" className="btn btn--ghost" disabled={!ready} onClick={() => send('story')}>
              Compartir la historia
            </button>
          </div>
        </section>

        {message && (
          <p className="share-sheet__message" role="status">
            {message}
          </p>
        )}
      </div>
    </dialog>,
    document.body,
  )
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
