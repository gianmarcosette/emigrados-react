import { describe, expect, it } from 'vitest'
import { COUNTRIES } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { MAX_STICKERS, SUITCASE_W, buildStickers, stickerEvent, stickerLook, stickerScale } from '../lib/suitcase.js'

const answersFor = (ids) => Object.fromEntries(ids.map((id) => [id, [{ text: 'x', date: '2026-01-01' }]]))

describe('maleta de pegatinas', () => {
  it('hay lugar para todos los países', () => {
    expect(MAX_STICKERS).toBeGreaterThanOrEqual(COUNTRIES.length)
  })

  it('arranca vacía', () => {
    expect(buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers: {}, route: [] })).toEqual([])
  })

  it('una pegatina por país, en el orden en que se respondió', () => {
    const [a, b] = COUNTRIES
    const qa = QUESTIONS.filter((q) => q.countryId === a.id)
    const qb = QUESTIONS.filter((q) => q.countryId === b.id)
    const route = [qb[0].id, qa[0].id, qb[1].id]
    const stickers = buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers: answersFor(route), route })
    expect(stickers.map((s) => s.countryId)).toEqual([b.id, a.id])
    expect(stickers[0]).toMatchObject({ answered: 2, total: qb.length, complete: false })
  })

  it('con todas las preguntas del país, la pegatina se completa', () => {
    const country = COUNTRIES[3]
    const route = QUESTIONS.filter((q) => q.countryId === country.id).map((q) => q.id)
    const [sticker] = buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers: answersFor(route), route })
    expect(sticker.complete).toBe(true)
  })

  it('las pegatinas no se mueven al sumar otras (solo se achican un poco)', () => {
    const route = COUNTRIES.map((c) => QUESTIONS.find((q) => q.countryId === c.id).id)
    const few = buildStickers({
      questions: QUESTIONS,
      countries: COUNTRIES,
      answers: answersFor(route.slice(0, 5)),
      route,
    })
    const all = buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers: answersFor(route), route })
    expect(all).toHaveLength(COUNTRIES.length)
    few.forEach((s, i) => expect([all[i].x, all[i].y, all[i].rotate]).toEqual([s.x, s.y, s.rotate]))
    for (const s of all) {
      expect(s.x).toBeGreaterThan(30)
      expect(s.x).toBeLessThan(SUITCASE_W - 30)
    }
  })

  it('cada país tiene siempre la misma forma', () => {
    expect(stickerLook('380', 1)).toEqual(stickerLook('380', 1))
    const kinds = new Set(COUNTRIES.slice(0, 4).map((c, i) => stickerLook(c.id, i).kind))
    expect(kinds.size).toBe(4)
  })

  it('el tamaño baja de a poco y tiene un mínimo', () => {
    expect(stickerScale(1)).toBe(1)
    expect(stickerScale(12)).toBe(1)
    expect(stickerScale(30)).toBeLessThan(1)
    expect(stickerScale(52)).toBeGreaterThanOrEqual(0.7)
  })

  it('avisa si la pegatina es nueva, avanza o se completa', () => {
    expect(stickerEvent({ answeredBefore: 0, total: 4 })).toBe('new')
    expect(stickerEvent({ answeredBefore: 2, total: 4 })).toBe('progress')
    expect(stickerEvent({ answeredBefore: 3, total: 4 })).toBe('complete')
    expect(stickerEvent({ answeredBefore: 4, total: 4 })).toBe('revisit')
  })
})
