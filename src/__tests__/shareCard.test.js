import { describe, expect, it } from 'vitest'
import { ANSWER_MAX, STORY_H, cardTop, clipAnswer, stageSize, wrapLines } from '../lib/shareCard.js'
import { barcodeBars, flightCode, gateFor, seatFor } from '../lib/ticket.js'

describe('imagen para compartir', () => {
  it('la respuesta corta va entera; la larga se corta en una palabra, con "…"', () => {
    expect(clipAnswer('  Sí,   mil veces. ')).toBe('Sí, mil veces.')
    const long = 'Volvería a irme, pero esta vez con más calma, más ahorros y menos miedo a pedir ayuda. '.repeat(3)
    const clipped = clipAnswer(long)
    expect(clipped.length).toBeLessThanOrEqual(ANSWER_MAX)
    expect(clipped.endsWith('…')).toBe(true)
    expect(long.startsWith(clipped.slice(0, -1))).toBe(true)
    expect(clipAnswer(undefined)).toBe('')
  })

  it('corta el texto en líneas que entran en el ancho', () => {
    const measure = (t) => t.length * 10
    expect(wrapLines('¿Volverías a tomar la misma decisión?', 120, measure)).toEqual([
      '¿Volverías a',
      'tomar la',
      'misma',
      'decisión?',
    ])
    // Una palabra más larga que el ancho no se pierde
    expect(wrapLines('supercalifragilístico', 50, measure)).toEqual(['supercalifragilístico'])
  })

  it('la tarjeta queda dentro de la zona que no tapa Instagram', () => {
    expect(cardTop('top', 500)).toBe(250)
    expect(cardTop('bottom', 500) + 500).toBe(STORY_H - 330)
    expect(cardTop('middle', 520)).toBe((STORY_H - 520) / 2)
  })

  it('las etapas con palabras largas van más chicas en el talón', () => {
    expect(stageSize('Hogar y futuro')).toBe(30)
    expect(stageSize('Reinventarse')).toBe(21)
    expect(stageSize('Idioma y costumbres')).toBe(21)
  })
})

describe('datos de la tarjeta de embarque', () => {
  it('son fijos para cada pregunta', () => {
    expect(flightCode(96)).toBe('EM 096')
    expect(seatFor(208)).toBe('17E')
    expect(gateFor('antes')).toBe(1)
    expect(gateFor('hogar')).toBe(8)
    expect(barcodeBars(5)).toEqual(barcodeBars(5))
    expect(barcodeBars(5).every((b) => b.x + b.w <= 120)).toBe(true)
  })
})
