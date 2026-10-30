// Datos de la tarjeta de embarque de cada pregunta: el número de vuelo, la puerta
// (la etapa) y el asiento. Son fijos para cada pregunta, así la tarjeta es siempre la misma
// en el juego y en la imagen para compartir.
import { CATEGORIES } from '../data/questions.js'

export function flightCode(id) {
  return `EM ${String(id).padStart(3, '0')}`
}

export function gateFor(category) {
  return CATEGORIES.findIndex((c) => c.key === category) + 1
}

// Cada etapa tiene su papel de color, detrás de la pregunta
const STAGE_COLORS = {
  antes: '#ffd23f',
  despedida: '#f6b48f',
  llegada: '#f9c9a6',
  cultura: '#ffe48a',
  vinculos: '#f3a6b8',
  identidad: '#cfe3c8',
  reinventarse: '#a9cdb8',
  hogar: '#f3d9a4',
}

export function stageColor(category) {
  return STAGE_COLORS[category] ?? '#ffd23f'
}

// Asiento fijo para cada pregunta: fila 1–30 y letra A–F.
export function seatFor(id) {
  return `${((id * 7) % 30) + 1}${'ABCDEF'[id % 6]}`
}

// Código de barras decorativo, siempre igual para la misma pregunta: [{ x, w }] en 0..width
export function barcodeBars(seed, width = 116) {
  let n = seed * 9301 + 49297
  const random = () => {
    n = (n * 9301 + 49297) % 233280
    return n / 233280
  }
  const bars = []
  for (let x = 0; x < width; ) {
    const w = 1 + Math.floor(random() * 3)
    bars.push({ x, w })
    x += w + 1 + Math.floor(random() * 3)
  }
  return bars
}
