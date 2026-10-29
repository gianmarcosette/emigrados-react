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
