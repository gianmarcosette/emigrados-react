// Imágenes para compartir en historias (Instagram, TikTok, WhatsApp), dibujadas en un
// <canvas> en el mismo dispositivo:
// - la tarjeta de embarque sola, con fondo transparente, para pegarla sobre cualquier foto
//   propia (estilo Strava): es la principal. Va en líneas blancas o negras, o a color, con
//   los papeles del juego;
// - una historia lista, con la tarjeta a color sobre el cobalto del juego y sus pájaros.
//
// Lo de arriba (medidas, cortes de línea) no usa el navegador y se puede testear; lo de
// abajo dibuja en el canvas.
import { BIRD, LETTERS, S_BIRDS } from '../data/logo.js'
import { FLYING_BIRD, GULL, HEART, PAPER } from './paper.js'
import { barcodeBars } from './ticket.js'

export const STORY_W = 1080
export const STORY_H = 1920
// Zonas que tapan los botones de Instagram arriba y abajo de una historia
const SAFE_TOP = 250
const SAFE_BOTTOM = 330

// Lo que entra de la respuesta en la tarjeta: unas tres líneas
export const ANSWER_MAX = 140

const CARD = { x: 70, w: 940, stub: 236, radius: 26, line: 4, pad: 38 }
const COBALT = '#2a4f9e'

/** Recorta la respuesta en una palabra entera y le agrega "…" si es más larga que `max`. */
export function clipAnswer(text, max = ANSWER_MAX) {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s.,;:]+$/, '')}…`
}

/** Corta un texto en líneas que entran en `width`, según `measure(text)` (ancho en px). */
export function wrapLines(text, width, measure) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (line && measure(next) > width) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Dónde empieza la tarjeta (arriba, al medio o abajo), dentro de la zona segura. */
export function cardTop(position, height) {
  if (position === 'top') return SAFE_TOP
  if (position === 'middle') return Math.round((STORY_H - height) / 2)
  return STORY_H - SAFE_BOTTOM - height
}

// ───────────── Dibujo ─────────────

const FONT_QUESTION = (size) => `700 ${size}px Archivo`
const FONT_TEXT = '600 32px Montserrat'
const FONT_SMALL = '800 18px Montserrat'
const FONT_BIG = '700 32px Archivo'
const FONT_FIELD = '700 34px Archivo'
const FONT_CODE = '700 40px Archivo'

// Medidas fijas de la tarjeta (en px de la historia de 1080 de ancho)
const LOGO = { cap: 40, top: 96 } // altura de las letras y dónde empiezan (los pájaros vuelan arriba)
const HEAD_H = 170 // banda del logo
const ROUTE_H = 66
const BOX_PAD = 28

/** Espera a que estén las tipografías del juego (si no, el canvas dibuja con otras). */
export async function loadShareFonts() {
  if (!globalThis.document?.fonts) return
  await Promise.all(
    [FONT_QUESTION(84), FONT_TEXT, FONT_SMALL, FONT_FIELD].map((f) => document.fonts.load(f, 'ÁÉÍÓÚáéíóúñ¿?')),
  ).catch(() => {})
}

// Texto con espaciado entre letras (no todos los navegadores tienen ctx.letterSpacing)
function spaced(ctx, text, x, y, spacing) {
  let cursor = x
  for (const ch of text) {
    ctx.fillText(ch, cursor, y)
    cursor += ctx.measureText(ch).width + spacing
  }
  return cursor - x - spacing
}

function spacedWidth(ctx, text, spacing) {
  return [...text].reduce((w, ch) => w + ctx.measureText(ch).width + spacing, -spacing)
}

/** Los colores de cada versión: líneas blancas, líneas negras o los papeles del juego. */
function paletteFor(style) {
  if (style === 'color')
    return { fg: PAPER.ink, logo: PAPER.cream, band: COBALT, card: PAPER.cream, heart: PAPER.coral, bird: PAPER.coral }
  const fg = style === 'black' ? PAPER.ink : '#fff'
  return { fg, logo: fg, band: null, card: null, heart: fg, bird: fg }
}

/**
 * Mide la tarjeta y decide los cortes de línea.
 * data: { question, flight, stage, stageColor, country, gate, seat, code, answer }
 */
function layout(ctx, data) {
  const textW = CARD.w - CARD.stub - CARD.pad * 2 - BOX_PAD * 2
  const qSize = data.question.length < 45 ? 80 : data.question.length < 90 ? 66 : 56
  ctx.font = FONT_QUESTION(qSize)
  const qLines = wrapLines(data.question, textW, (t) => ctx.measureText(t).width)
  ctx.font = FONT_TEXT
  const foot = data.answer
    ? { label: 'MI RESPUESTA', text: data.answer }
    : { label: 'TU TURNO', text: '¿Y vos qué responderías?' }
  const footLines = wrapLines(foot.text, CARD.w - CARD.stub - CARD.pad * 2, (t) => ctx.measureText(t).width)

  const boxH = BOX_PAD + 18 + 14 + qLines.length * qSize * 1.04 + BOX_PAD
  const footH = 3 + 18 + 22 + 6 + footLines.length * 32 * 1.3
  const leftH = HEAD_H + 26 + ROUTE_H + 22 + boxH + 30 + footH + 34
  const stubH = HEAD_H + 26 + 3 * 92 + 60 + 40
  return { qSize, qLines, boxH, foot, footLines, height: Math.ceil(Math.max(leftH, stubH)) }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Un trazo SVG (path) ubicado en x, y con giro y escala
function shape(ctx, d, x, y, scale, rotate = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotate * Math.PI) / 180)
  ctx.scale(scale, scale)
  ctx.fill(new Path2D(d))
  ctx.restore()
}

function flyingBird(ctx, x, y, scale, rotate = 0) {
  shape(ctx, FLYING_BIRD, x, y, scale, rotate)
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotate * Math.PI) / 180)
  ctx.beginPath()
  ctx.arc(0, 2 * scale, 6 * scale, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/** El ícono: el pájaro dentro del corazón. En las versiones de una sola tinta el pájaro queda calado. */
function drawHeartBird(ctx, x, y, size, heart, bird) {
  const k = size / 260
  const layer = document.createElement('canvas')
  layer.width = layer.height = Math.ceil(size * 2)
  const c = layer.getContext('2d')
  c.scale(2 * k, 2 * k)
  c.translate(-70, -80)
  c.fillStyle = heart
  c.fill(new Path2D(HEART))
  if (bird === heart) c.globalCompositeOperation = 'destination-out'
  else c.fillStyle = bird
  flyingBird(c, 200, 188, 2.1)
  ctx.drawImage(layer, x, y, size, size)
}

/** Logo: EMIGRADO y la S de pájaros que se vuelan. (x, y) es la esquina de arriba de las letras. */
function drawWordmark(ctx, x, y, cap, color) {
  const k = cap / 146
  ctx.save()
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.scale(k, k)
  ctx.translate(0, -237)
  ctx.fill(new Path2D(LETTERS))
  const bird = new Path2D(BIRD)
  for (const [bx, by, rot, s] of S_BIRDS) {
    ctx.save()
    ctx.translate(bx, by)
    ctx.rotate((rot * Math.PI) / 180)
    ctx.scale(s, s)
    ctx.fill(bird)
    ctx.restore()
  }
  ctx.restore()
}

/** Dibuja la tarjeta con su esquina superior izquierda en (x, y). */
function drawCard(ctx, x, y, data, look, style) {
  const p = paletteFor(style)
  const w = CARD.w
  const h = look.height
  const left = x + CARD.pad
  const stubX = x + w - CARD.stub
  const leftW = stubX - CARD.pad - left

  ctx.save()
  if (style === 'shadow') {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetY = 2
  }
  ctx.fillStyle = p.fg
  ctx.strokeStyle = p.fg
  ctx.lineWidth = CARD.line
  ctx.textBaseline = 'alphabetic'

  // Papel y banda del logo (a color) o marco de líneas (blanco y negro)
  if (p.card) {
    ctx.save()
    roundRect(ctx, x, y, w, h, CARD.radius)
    ctx.clip()
    ctx.fillStyle = p.card
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = p.band
    ctx.fillRect(x, y, w, HEAD_H)
    ctx.restore()
  } else {
    roundRect(ctx, x + 2, y + 2, w - 4, h - 4, CARD.radius)
    ctx.stroke()
    ctx.fillRect(x + 2, y + HEAD_H - 2, w - 4, 4)
  }

  // Encabezado: el corazón con el pájaro, el logo y el vuelo
  const capTop = y + LOGO.top
  drawHeartBird(ctx, left - 6, capTop - 12, 64, p.heart, p.card ? PAPER.cream : p.heart)
  drawWordmark(ctx, left + 70, capTop, LOGO.cap, p.logo)
  ctx.fillStyle = p.logo
  ctx.font = FONT_SMALL
  const flight = `VUELO ${data.flight}`
  spaced(ctx, flight, x + w - CARD.pad - spacedWidth(ctx, flight, 3), capTop + LOGO.cap - 8, 3)
  ctx.fillStyle = p.fg

  // Ruta: de tu casa a la escala, con un pájaro en el medio
  let cy = y + HEAD_H + 26
  ctx.font = FONT_SMALL
  spaced(ctx, 'DESDE', left, cy + 18, 3)
  const toLabel = 'ESCALA'
  spaced(ctx, toLabel, left + leftW - spacedWidth(ctx, toLabel, 3), cy + 18, 3)
  ctx.font = FONT_BIG
  ctx.fillText('TU CASA', left, cy + 56)
  const country = data.country.toUpperCase()
  const countryW = ctx.measureText(country).width
  ctx.fillText(country, left + leftW - countryW, cy + 56)
  const fromX = left + ctx.measureText('TU CASA').width + 26
  const toX = left + leftW - countryW - 26
  if (toX - fromX > 80) {
    ctx.save()
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.setLineDash([2, 10])
    ctx.beginPath()
    ctx.moveTo(fromX, cy + 50)
    ctx.quadraticCurveTo((fromX + toX) / 2, cy - 4, toX, cy + 50)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(fromX, cy + 50, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(toX, cy + 50, 6, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = p.bird
    flyingBird(ctx, (fromX + toX) / 2 + 12, cy + 14, 0.5, 8)
    ctx.restore()
  }

  // La pregunta, en el papel de su etapa (a color) o en un recuadro de línea
  cy += ROUTE_H + 22
  if (p.card) {
    ctx.save()
    ctx.fillStyle = data.stageColor
    roundRect(ctx, left, cy, leftW, look.boxH, 18)
    ctx.fill()
    ctx.restore()
  } else {
    ctx.save()
    ctx.lineWidth = 3
    roundRect(ctx, left, cy, leftW, look.boxH, 18)
    ctx.stroke()
    ctx.restore()
  }
  ctx.font = FONT_SMALL
  spaced(ctx, `ETAPA · ${data.stage.toUpperCase()}`, left + BOX_PAD, cy + BOX_PAD + 16, 3)
  let qy = cy + BOX_PAD + 18 + 14
  ctx.font = FONT_QUESTION(look.qSize)
  for (const line of look.qLines) {
    qy += look.qSize * 1.04
    ctx.fillText(line, left + BOX_PAD, qy - look.qSize * 0.2)
  }

  // Pie: "Tu turno" o "Mi respuesta", siempre abajo de todo con una línea arriba
  const footH = 3 + 18 + 22 + 6 + look.footLines.length * 32 * 1.3
  let fy = y + h - 34 - footH
  ctx.fillRect(left, fy, leftW, 3)
  fy += 3 + 18 + 18
  ctx.font = FONT_SMALL
  spaced(ctx, look.foot.label, left, fy, 3)
  fy += 10
  ctx.font = FONT_TEXT
  for (const line of look.footLines) {
    fy += 32 * 1.3
    ctx.fillText(line, left, fy - 8)
  }

  // Talón: troquel, puerta, asiento, código de pasajero y código de barras
  ctx.save()
  ctx.setLineDash([10, 8])
  ctx.beginPath()
  ctx.moveTo(stubX, y + HEAD_H + 16)
  ctx.lineTo(stubX, y + h - 16)
  ctx.stroke()
  ctx.restore()
  const sx = stubX + 30
  let sy = y + HEAD_H + 26
  const fields = [
    ['PUERTA', String(data.gate)],
    ['ASIENTO', data.seat],
    ...(data.code ? [['PASAJERO', data.code]] : []),
  ]
  for (const [label, value] of fields) {
    ctx.font = FONT_SMALL
    spaced(ctx, label, sx, sy + 18, 3)
    ctx.font = label === 'PASAJERO' ? FONT_CODE : FONT_FIELD
    spaced(ctx, value, sx, sy + 60, label === 'PASAJERO' ? 3.5 : 1)
    sy += 92
  }
  for (const bar of barcodeBars(Number(data.flight.replace(/\D/g, '')) || 1, 116)) {
    ctx.fillRect(sx + bar.x * 1.5, y + h - 34 - 60, bar.w * 1.5, 60)
  }
  ctx.restore()

  // Las muescas del troquel, caladas en el papel
  if (p.card) {
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    for (const ny of [y + HEAD_H, y + h]) {
      ctx.beginPath()
      ctx.arc(stubX, ny, 16, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

// Gaviotas de papel sobre el cobalto, arriba y abajo de la tarjeta
const GULLS = [
  [0.16, 0.08, 1.6, -8, PAPER.cream],
  [0.3, 0.05, 1, 6, PAPER.cream],
  [0.82, 0.11, 1.3, 10, PAPER.yellow],
  [0.14, 0.92, 1.2, 4, PAPER.yellow],
  [0.78, 0.9, 1.7, -6, PAPER.cream],
  [0.9, 0.95, 0.9, 8, PAPER.coral],
]

function drawBackdrop(ctx, band) {
  ctx.fillStyle = COBALT
  ctx.fillRect(0, 0, STORY_W, STORY_H)
  for (const [gx, gy, s, rot, color] of GULLS) {
    const y = gy * STORY_H
    if (y > band.top - 60 && y < band.bottom + 60) continue
    ctx.fillStyle = color
    shape(ctx, GULL, gx * STORY_W, y, s * 1.6, rot)
  }
}

/**
 * Historia lista (1080 × 1920) en `canvas`: la tarjeta a color sobre el cobalto del juego.
 * options: { data, position }
 */
export function renderStory(canvas, { data, position = 'middle' }) {
  canvas.width = STORY_W
  canvas.height = STORY_H
  const ctx = canvas.getContext('2d')
  const look = layout(ctx, data)
  const top = cardTop(position, look.height)
  drawBackdrop(ctx, { top, bottom: top + look.height })
  // La tarjeta se dibuja aparte, así las muescas dejan ver el cobalto y no un agujero
  const card = document.createElement('canvas')
  card.width = STORY_W
  card.height = look.height + 40
  drawCard(card.getContext('2d'), CARD.x, 20, data, look, 'color')
  ctx.save()
  ctx.shadowColor = 'rgba(10, 20, 50, 0.35)'
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 8
  ctx.drawImage(card, 0, top - 20)
  ctx.restore()
}

/** Solo la tarjeta, con fondo transparente y al doble de resolución, para pegar sobre otra foto. */
export function renderSticker(canvas, { data, style = 'shadow' }) {
  const scale = 2
  const pad = 24
  const ctx0 = canvas.getContext('2d')
  const look = layout(ctx0, data)
  canvas.width = (CARD.w + pad * 2) * scale
  canvas.height = (look.height + pad * 2) * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  drawCard(ctx, pad, pad, data, look, style)
}

/** PNG del canvas como archivo, para compartir o descargar. */
export function canvasToFile(canvas, name) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(new File([blob], name, { type: 'image/png' }))
      else reject(new Error('No se pudo armar la imagen.'))
    }, 'image/png')
  })
}
