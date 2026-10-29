// Imagen para compartir en historias (Instagram, TikTok, WhatsApp): la tarjeta de embarque
// en líneas, sin fondo propio, sobre una foto de la persona o sobre el cielo del juego.
// Se dibuja en un <canvas> en el mismo celular: la foto nunca se sube a ningún lado y, al
// volver a dibujarla, pierde los datos que traía (como la ubicación GPS).
//
// Lo de arriba (medidas, cortes de línea) no usa el navegador y se puede testear; lo de
// abajo dibuja en el canvas.
import { barcodeBars } from './ticket.js'

export const STORY_W = 1080
export const STORY_H = 1920
// Zonas que tapan los botones de Instagram arriba y abajo de una historia
const SAFE_TOP = 250
const SAFE_BOTTOM = 330

export const POSITIONS = ['top', 'middle', 'bottom']
export const STYLES = ['shadow', 'white', 'black']
// Lo que entra de la respuesta en la tarjeta: unas tres líneas
export const ANSWER_MAX = 140

const CARD = { x: 70, w: 940, stub: 236, radius: 22, line: 4, pad: 38, top: 36 }
const INK = '#161616'
const PLANE = 'M2 13l8-1 5-8h3l-3 8 5 .5 2-2.5h2l-1.5 4 1.5 4h-2l-2-2.5-5 .5 3 8h-3l-5-8-8-1z'

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

/** La etapa en el talón: si tiene una palabra larga, va más chica para que entre. */
export function stageSize(stage) {
  return Math.max(...stage.split(' ').map((w) => w.length)) > 9 ? 21 : 30
}

// ───────────── Dibujo ─────────────

const FONT_QUESTION = (size) => `700 ${size}px Archivo`
const FONT_TEXT = '600 32px Montserrat'
const FONT_SMALL = '800 18px Montserrat'
const FONT_FIELD_LABEL = '700 17px Montserrat'
const FONT_FIELD = (size) => `800 ${size}px Montserrat`
const FONT_CODE = '700 44px Archivo'

/** Espera a que estén las tipografías del juego (si no, el canvas dibuja con otras). */
export async function loadShareFonts() {
  if (!globalThis.document?.fonts) return
  await Promise.all(
    [FONT_QUESTION(84), FONT_TEXT, FONT_SMALL, FONT_FIELD(30), '800 44px Montserrat', 'italic 500 44px Montserrat'].map(
      (f) => document.fonts.load(f, 'ÁÉÍÓÚáéíóúñ¿?'),
    ),
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

/**
 * Mide la tarjeta y decide los cortes de línea.
 * data: { question, flight, stage, seat, code, answer }
 */
function layout(ctx, data) {
  const leftW = CARD.w - CARD.stub
  const textW = leftW - CARD.pad * 2
  const qSize = data.question.length < 45 ? 84 : 70
  ctx.font = FONT_QUESTION(qSize)
  const qLines = wrapLines(data.question, textW, (t) => ctx.measureText(t).width)
  ctx.font = FONT_TEXT
  const foot = data.answer
    ? { label: 'MI RESPUESTA', text: data.answer }
    : { label: 'TU TURNO', text: '¿Y vos qué responderías?' }
  const footLines = wrapLines(foot.text, textW, (t) => ctx.measureText(t).width)

  const brandH = 44
  const qH = qLines.length * qSize * 1.02
  const footH = 3 + 18 + 22 + 6 + footLines.length * 32 * 1.3
  const leftH = CARD.top + brandH + 30 + qH + 28 + footH + 36

  const sSize = stageSize(data.stage)
  ctx.font = FONT_FIELD(sSize)
  const stageLines = wrapLines(data.stage.toUpperCase(), CARD.stub - 52, (t) => spacedWidth(ctx, t, sSize * 0.04))
  const fields = [
    { label: 'VUELO', lines: [data.flight], size: 30 },
    { label: 'ETAPA', lines: stageLines, size: sSize },
    { label: 'ASIENTO', lines: [data.seat], size: 30 },
    ...(data.code ? [{ label: 'PASAJERO', lines: [data.code], size: 44, code: true }] : []),
  ]
  const fieldsH = fields.reduce((h, f) => h + 20 + 4 + f.lines.length * f.size * 1.1, 0)
  const stubH = 36 + fieldsH + (fields.length - 1) * 20 + 30 + 60 + 30

  return { qSize, qLines, foot, footLines, fields, height: Math.ceil(Math.max(leftH, stubH)) }
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

/** Dibuja la tarjeta con su esquina superior izquierda en (x, y). */
function drawCard(ctx, x, y, data, look, style) {
  const color = style === 'black' ? INK : '#fff'
  const w = CARD.w
  const h = look.height
  const left = x + CARD.pad
  const stubX = x + w - CARD.stub

  ctx.save()
  if (style === 'shadow') {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetY = 2
  }
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.textBaseline = 'alphabetic'

  // Marco y perforación del talón
  ctx.lineWidth = CARD.line
  roundRect(ctx, x + 2, y + 2, w - 4, h - 4, CARD.radius)
  ctx.stroke()
  ctx.setLineDash([10, 8])
  ctx.beginPath()
  ctx.moveTo(stubX, y + 4)
  ctx.lineTo(stubX, y + h - 4)
  ctx.stroke()
  ctx.setLineDash([])

  // Logo: la E recta y en negrita, el resto en itálica espaciada (como en el juego)
  let cy = y + CARD.top + 36
  ctx.font = '800 44px Montserrat'
  const eW = spaced(ctx, 'E', left, cy, 0)
  ctx.font = 'italic 500 44px Montserrat'
  spaced(ctx, 'MIGRADOS', left + eW + 8, cy, 8)
  // Avión
  ctx.save()
  ctx.translate(stubX - CARD.pad - 40, cy - 34)
  ctx.scale(40 / 24, 40 / 24)
  ctx.fill(new Path2D(PLANE))
  ctx.restore()

  // Pregunta
  cy = y + CARD.top + 44 + 30
  ctx.font = FONT_QUESTION(look.qSize)
  for (const line of look.qLines) {
    cy += look.qSize * 1.02
    ctx.fillText(line, left, cy - look.qSize * 0.2)
  }

  // Pie: "Tu turno" o "Mi respuesta", siempre abajo de todo con una línea arriba
  const footH = 3 + 18 + 22 + 6 + look.footLines.length * 32 * 1.3
  let fy = y + h - 36 - footH
  ctx.fillRect(left, fy, stubX - CARD.pad - left, 3)
  fy += 3 + 18 + 18
  ctx.font = FONT_SMALL
  spaced(ctx, look.foot.label, left, fy, 3)
  fy += 10
  ctx.font = FONT_TEXT
  for (const line of look.footLines) {
    fy += 32 * 1.3
    ctx.fillText(line, left, fy - 8)
  }

  // Talón: datos del vuelo, código de pasajero y código de barras
  const sx = stubX + 26
  let sy = y + 36
  for (const f of look.fields) {
    ctx.font = FONT_FIELD_LABEL
    sy += 18
    spaced(ctx, f.label, sx, sy, 2.7)
    sy += 6
    ctx.font = f.code ? FONT_CODE : FONT_FIELD(f.size)
    for (const line of f.lines) {
      sy += f.size * 1.1
      spaced(ctx, line, sx, sy - f.size * 0.18, f.code ? 3.5 : f.size * 0.04)
    }
    sy += 20
  }
  for (const bar of barcodeBars(Number(data.flight.replace(/\D/g, '')) || 1, 116)) {
    ctx.fillRect(sx + bar.x * 1.6, y + h - 30 - 60, bar.w * 1.6, 60)
  }
  ctx.restore()
}

// Foto que cubre toda la historia, recortada al centro
function drawCover(ctx, image) {
  const scale = Math.max(STORY_W / image.width, STORY_H / image.height)
  const w = image.width * scale
  const h = image.height * scale
  ctx.drawImage(image, (STORY_W - w) / 2, (STORY_H - h) / 2, w, h)
}

// Sin foto: el cielo del juego con nubes en trama de puntos. Las nubes esquivan la franja
// de la tarjeta, así la trama no se mezcla con el texto.
const CLOUDS = [
  [0.06, 0.09, 0.38, 0.07],
  [0.96, 0.22, 0.34, 0.07],
  [0.02, 0.4, 0.3, 0.06],
  [0.98, 0.56, 0.32, 0.06],
  [0.04, 0.74, 0.3, 0.06],
  [0.4, 1, 0.6, 0.06],
]

function drawSky(ctx, band) {
  ctx.fillStyle = '#3d7299'
  ctx.fillRect(0, 0, STORY_W, STORY_H)
  const clouds = CLOUDS.filter(([, cy, , ry]) => {
    const top = (cy - ry * 0.72) * STORY_H
    const bottom = (cy + ry * 0.72) * STORY_H
    return bottom < band.top - 40 || top > band.bottom + 40
  })
  ctx.fillStyle = '#efe6d2'
  for (let y = 0; y < STORY_H; y += 5) {
    const row = Math.round(y / 5)
    for (let x = row % 2 ? 5 : 0; x < STORY_W; x += 10) {
      let alpha = 0
      for (const [cx, cy, rx, ry] of clouds) {
        const d = Math.hypot((x / STORY_W - cx) / rx, (y / STORY_H - cy) / ry)
        alpha = Math.max(alpha, Math.min(1, Math.max(0, (0.72 - d) / 0.32)))
      }
      if (alpha <= 0) continue
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(x, y, 2.8, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

/**
 * Historia completa (1080 × 1920) en `canvas`.
 * options: { data, image (opcional), position, style }
 */
export function renderStory(canvas, { data, image, position = 'bottom', style = 'shadow' }) {
  canvas.width = STORY_W
  canvas.height = STORY_H
  const ctx = canvas.getContext('2d')
  const look = layout(ctx, data)
  const top = cardTop(position, look.height)
  if (image) drawCover(ctx, image)
  else drawSky(ctx, { top, bottom: top + look.height })
  drawCard(ctx, CARD.x, top, data, look, style)
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
