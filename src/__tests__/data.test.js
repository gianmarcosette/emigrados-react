import { describe, expect, it } from 'vitest'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { COUNTRIES, COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORIES, QUESTIONS } from '../data/questions.js'

describe('banco de preguntas', () => {
  it('tiene al menos 200 preguntas', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(200)
  })

  it('no repite textos ni ids', () => {
    expect(new Set(QUESTIONS.map((q) => q.text)).size).toBe(QUESTIONS.length)
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })

  it('cada pregunta tiene categoría y país válidos', () => {
    const keys = new Set(CATEGORIES.map((c) => c.key))
    for (const q of QUESTIONS) {
      expect(keys.has(q.category)).toBe(true)
      expect(COUNTRY_BY_ID[q.countryId]).toBeDefined()
    }
  })

  it('reparte las preguntas entre todos los países', () => {
    const used = new Set(QUESTIONS.map((q) => q.countryId))
    expect(used.size).toBe(COUNTRIES.length)
  })

  it('todos los países existen en el mapa', () => {
    const ids = new Set(feature(world, world.objects.countries).features.map((f) => f.id))
    for (const c of COUNTRIES) expect(ids.has(c.id), c.name).toBe(true)
  })
})
