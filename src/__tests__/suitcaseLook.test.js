import { describe, expect, it } from 'vitest'
import { COUNTRIES } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { PLACE_BOUNDS, buildStickers, clampPlace, placeStickers } from '../lib/suitcase.js'
import {
  DEFAULT_SUITCASE,
  SUITCASE_KEY,
  clearSuitcase,
  loadSuitcase,
  saveSuitcase,
  suitcaseColor,
} from '../state/suitcaseLook.js'

function memoryStorage() {
  const data = {}
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => (data[k] = String(v)),
    removeItem: (k) => delete data[k],
  }
}

// Una maleta con los primeros países respondidos
function someStickers(n) {
  const answers = {}
  const route = []
  for (const c of COUNTRIES.slice(0, n)) {
    const q = QUESTIONS.find((qq) => qq.countryId === c.id)
    answers[q.id] = [{ text: 'x', date: '2026-01-01' }]
    route.push(q.id)
  }
  return buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers, route })
}

describe('tu maleta a tu manera', () => {
  it('guarda el color y los lugares, y descarta lo desconocido', () => {
    const storage = memoryStorage()
    expect(loadSuitcase(storage)).toEqual(DEFAULT_SUITCASE)
    saveSuitcase({ color: 'coral', places: { '032': { x: 100, y: 120, rotate: 5 } } }, storage)
    expect(loadSuitcase(storage)).toEqual({ color: 'coral', places: { '032': { x: 100, y: 120, rotate: 5 } } })
    storage.setItem(
      SUITCASE_KEY,
      JSON.stringify({ color: 'violeta', places: { '032': { x: 'a' }, 380: { x: 1, y: 2, rotate: 0 } } }),
    )
    expect(loadSuitcase(storage)).toEqual({ color: 'noche', places: { 380: { x: 1, y: 2, rotate: 0 } } })
    storage.setItem(SUITCASE_KEY, '{roto')
    expect(loadSuitcase(storage)).toEqual(DEFAULT_SUITCASE)
    clearSuitcase(storage)
    expect(storage.getItem(SUITCASE_KEY)).toBeNull()
    expect(suitcaseColor('nada').id).toBe('noche')
  })

  it('ningún afiche se sale de la maleta', () => {
    const p = clampPlace({ x: -500, y: 9999, rotate: 200 })
    expect(p).toEqual({ x: PLACE_BOUNDS.minX, y: PLACE_BOUNDS.maxY, rotate: 45 })
    expect(clampPlace({ x: 200.4, y: 150.6, rotate: -3.2 })).toEqual({ x: 200, y: 151, rotate: -3 })
  })

  it('sin lugares elegidos, la maleta queda como siempre', () => {
    const stickers = someStickers(6)
    expect(placeStickers(stickers, {})).toBe(stickers)
  })

  it('respeta los lugares elegidos y los afiches nuevos no caen encima', () => {
    const stickers = someStickers(10)
    // Se mueve el primero justo encima del lugar automático del segundo
    const target = clampPlace({ x: stickers[1].x, y: stickers[1].y, rotate: 10 })
    const placed = placeStickers(stickers, { [stickers[0].countryId]: target })
    expect(placed[0]).toMatchObject(target)
    expect(placed).toHaveLength(stickers.length)
    for (const s of placed.slice(1)) {
      expect(Math.hypot(s.x - target.x, s.y - target.y)).toBeGreaterThanOrEqual(48)
    }
  })
})
