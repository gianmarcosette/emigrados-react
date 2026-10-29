// La maleta de pegatinas: cada país al que se responde pega una pegatina; con todas
// sus preguntas respondidas, la pegatina se completa y se ilumina.
// Todo es determinístico: la misma pegatina cae siempre en el mismo lugar, con la
// misma forma y la misma inclinación, así la maleta no cambia cada vez que se abre.

export const SUITCASE_W = 520
export const SUITCASE_H = 380
export const STICKER_KINDS = ['circle', 'label', 'shield', 'oval']

// Lugares para pegar (centro de cada pegatina), en una grilla sobre el cuerpo de la
// maleta que esquiva las correas. Hay uno por país.
const COLS = [64, 114, 208, 262, 316, 408, 458]
const ROWS = [96, 128, 160, 192, 224, 256, 288, 320]

function seeded(seed) {
  let n = (seed * 9301 + 49297) % 233280
  return () => {
    n = (n * 9301 + 49297) % 233280
    return n / 233280
  }
}

// Orden en que se van ocupando los lugares: cada pegatina nueva cae en el lugar más
// alejado de las que ya están, así se reparten por toda la maleta en lugar de amontonarse.
const SLOTS = (() => {
  const free = ROWS.flatMap((y, r) => COLS.map((x) => ({ x: x + (r % 2 ? 14 : 0), y })))
  const taken = [free.splice(Math.floor(free.length / 2) - 4, 1)[0]]
  while (free.length) {
    let best = 0
    let bestDistance = -1
    free.forEach((slot, i) => {
      const distance = Math.min(...taken.map((t) => Math.hypot(t.x - slot.x, (t.y - slot.y) * 1.3)))
      if (distance > bestDistance) {
        best = i
        bestDistance = distance
      }
    })
    taken.push(free.splice(best, 1)[0])
  }
  return taken
})()

export const MAX_STICKERS = SLOTS.length

/** Forma e inclinación propias de cada país (según su lugar en la lista de países). */
export function stickerLook(countryId, countryIndex) {
  const random = seeded(parseInt(countryId, 10) || countryIndex + 1)
  return {
    kind: STICKER_KINDS[countryIndex % STICKER_KINDS.length],
    rotate: Math.round((random() - 0.5) * 28),
    dx: Math.round((random() - 0.5) * 14),
    dy: Math.round((random() - 0.5) * 10),
  }
}

/** Con pocas pegatinas se ven grandes; a medida que se suman se achican un poco para que entren. */
export function stickerScale(count) {
  if (count <= 12) return 1
  return Math.max(0.7, Math.round((1 - (count - 12) * 0.0075) * 1000) / 1000)
}

/**
 * Pegatinas en el orden en que se pegaron (el de la primera respuesta en cada país).
 * questions: [{ id, countryId }], countries: [{ id }], answers: { [id]: [...] }, route: [id]
 */
export function buildStickers({ questions, countries, answers, route }) {
  const byQuestion = new Map(questions.map((q) => [q.id, q.countryId]))
  const totals = new Map()
  for (const q of questions) totals.set(q.countryId, (totals.get(q.countryId) ?? 0) + 1)
  const answered = new Map()
  const order = []
  for (const id of route) {
    const countryId = byQuestion.get(id)
    if (!countryId || !answers[id]?.length) continue
    if (!answered.has(countryId)) order.push(countryId)
    answered.set(countryId, (answered.get(countryId) ?? 0) + 1)
  }
  const index = new Map(countries.map((c, i) => [c.id, i]))
  const scale = stickerScale(order.length)
  return order.map((countryId, i) => {
    const look = stickerLook(countryId, index.get(countryId) ?? i)
    const slot = SLOTS[i % SLOTS.length]
    const total = totals.get(countryId) ?? 0
    const done = answered.get(countryId)
    return {
      countryId,
      kind: look.kind,
      x: slot.x + look.dx,
      y: slot.y + look.dy,
      rotate: look.rotate,
      scale,
      answered: done,
      total,
      complete: total > 0 && done >= total,
    }
  })
}

/** Qué pasó con la pegatina de un país al guardar una respuesta nueva ahí. */
export function stickerEvent({ answeredBefore, total }) {
  if (answeredBefore === 0) return total === 1 ? 'complete' : 'new'
  if (answeredBefore + 1 === total) return 'complete'
  return answeredBefore >= total ? 'revisit' : 'progress'
}
