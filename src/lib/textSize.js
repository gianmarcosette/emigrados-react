// Tamaño de letra elegido por cada persona. "Normal" es la letra que ya tiene
// configurada su dispositivo; las otras opciones la achican o agrandan a partir de ahí.
// Todo el juego mide la letra en rem, así que alcanza con cambiar la raíz.

export const TEXT_SIZES = [
  { id: 'xs', label: 'Muy chica', scale: 0.85 },
  { id: 's', label: 'Chica', scale: 0.92 },
  { id: 'normal', label: 'Normal', scale: 1 },
  { id: 'l', label: 'Grande', scale: 1.15 },
  { id: 'xl', label: 'Muy grande', scale: 1.3 },
]

export const DEFAULT_TEXT_SIZE = 'normal'
const KEY = 'emigrados:letra'
// Tamaño normal si no se puede leer el del dispositivo
export const FALLBACK_PX = 16
// En iPhone el texto del sistema mide 17 px con el tamaño estándar: ese es nuestro 16
const APPLE_BODY_PX = 17

export function isTextSize(id) {
  return TEXT_SIZES.some((s) => s.id === id)
}

export function readTextSize(storage = globalThis.localStorage) {
  try {
    const id = storage?.getItem(KEY)
    return isTextSize(id) ? id : DEFAULT_TEXT_SIZE
  } catch {
    return DEFAULT_TEXT_SIZE
  }
}

export function saveTextSize(id, storage = globalThis.localStorage) {
  try {
    if (id === DEFAULT_TEXT_SIZE) storage?.removeItem(KEY)
    else storage?.setItem(KEY, id)
  } catch {
    // Sin almacenamiento igual se aplica, solo no se recuerda
  }
}

/** Letra base en px a partir de lo que mide el dispositivo (o null si no se pudo leer). */
export function baseFromMeasures({ appleBody, browserDefault }) {
  if (appleBody > 0) return (FALLBACK_PX * appleBody) / APPLE_BODY_PX
  if (browserDefault > 0) return browserDefault
  return null
}

export function rootFontPx(base, id) {
  const size = TEXT_SIZES.find((s) => s.id === id) ?? TEXT_SIZES.find((s) => s.id === DEFAULT_TEXT_SIZE)
  return Math.round((base ?? FALLBACK_PX) * size.scale * 100) / 100
}

let detected
/** Mide la letra del dispositivo: en iPhone el "Tamaño del texto" del sistema; en el resto, la del navegador. */
export function detectDeviceBase() {
  if (detected !== undefined) return detected
  detected = null
  try {
    const probe = document.createElement('span')
    probe.style.position = 'absolute'
    probe.style.visibility = 'hidden'
    document.body.appendChild(probe)
    let appleBody = 0
    if (globalThis.CSS?.supports?.('font', '-apple-system-body')) {
      probe.style.font = '-apple-system-body'
      appleBody = parseFloat(getComputedStyle(probe).fontSize)
    }
    probe.style.font = ''
    probe.style.fontSize = 'medium'
    const browserDefault = parseFloat(getComputedStyle(probe).fontSize)
    probe.remove()
    detected = baseFromMeasures({ appleBody, browserDefault })
  } catch {
    detected = null
  }
  return detected
}

// Los menús (barra de arriba y de abajo) acompañan el cambio pero con tope, como en
// las apps del teléfono: así con letra muy grande no se pisan ni empujan el contenido.
const CHROME_MIN = 0.92
const CHROME_MAX = 1.08

/** Zoom que se aplica a los menús para que crezcan o se achiquen solo entre esos topes. */
export function chromeZoom(id) {
  const scale = (TEXT_SIZES.find((s) => s.id === id) ?? { scale: 1 }).scale
  const limited = Math.min(CHROME_MAX, Math.max(CHROME_MIN, scale))
  return Math.round((limited / scale) * 1000) / 1000
}

export function applyTextSize(id) {
  const base = detectDeviceBase()
  const root = document.documentElement
  root.style.fontSize = `${rootFontPx(base, id)}px`
  root.style.setProperty('--chrome-zoom', String(chromeZoom(id)))
  root.dataset.textSize = id
}
