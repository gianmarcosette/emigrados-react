import { describe, expect, it } from 'vitest'
import { GENERAL, TRIVIA } from '../data/trivia.js'
import { countryShape } from '../lib/countryShapes.js'
import { ROUNDS, buildDuel, duelReducer, isCorrect, outcome, score } from '../online/duel.js'

// Aleatorio determinístico para que las pruebas den siempre lo mismo
function seeded(seed = 1) {
  let n = seed
  return () => {
    n = (n * 9301 + 49297) % 233280
    return n / 233280
  }
}

describe('preguntas de cultura general', () => {
  it('cada país tiene suficientes preguntas con 4 opciones distintas', () => {
    for (const [code, { questions, mapId }] of Object.entries(TRIVIA)) {
      expect(code).toMatch(/^[A-Z]{2}$/)
      expect(mapId).toMatch(/^\d{3}$/)
      expect(countryShape(mapId), `silueta de ${code}`).toBeTruthy()
      expect(questions.length).toBeGreaterThanOrEqual(ROUNDS)
      for (const q of questions) {
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options).size).toBe(4)
      }
    }
    expect(GENERAL.length).toBeGreaterThanOrEqual(ROUNDS)
  })
})

describe('duelo', () => {
  const play = (duel, mine, theirs) => {
    let d = duel
    for (let i = 0; i < d.rounds.length; i++) {
      const r = d.rounds[d.index]
      d = duelReducer(d, { type: 'answer', choice: mine(r.mine) })
      d = duelReducer(d, { type: 'opponentAnswer', choice: theirs(r.theirs) })
      d = duelReducer(d, { type: 'next' })
    }
    return d
  }

  it('pregunta sobre el país del rival y el rival sobre el tuyo', () => {
    const duel = buildDuel({ target: 'ES', home: 'AR', random: seeded() })
    expect(duel.rounds).toHaveLength(ROUNDS)
    const es = TRIVIA.ES.questions.map((q) => q.text)
    const ar = TRIVIA.AR.questions.map((q) => q.text)
    for (const r of duel.rounds) {
      expect(es).toContain(r.mine.text)
      expect(ar).toContain(r.theirs.text)
      // La opción marcada como correcta es la correcta original
      const original = TRIVIA.ES.questions.find((q) => q.text === r.mine.text)
      expect(r.mine.options[r.mine.answer]).toBe(original.options[0])
    }
    expect(new Set(duel.rounds.map((r) => r.mine.text)).size).toBe(ROUNDS)
  })

  it('usa cultura general si tu país todavía no tiene preguntas', () => {
    const duel = buildDuel({ target: 'ES', home: 'JP', random: seeded() })
    const general = GENERAL.map((q) => q.text)
    for (const r of duel.rounds) expect(general).toContain(r.theirs.text)
  })

  it('solo pasa de ronda cuando respondieron los dos y no deja cambiar la respuesta', () => {
    let d = buildDuel({ target: 'IT', home: 'UY', random: seeded(3) })
    d = duelReducer(d, { type: 'answer', choice: 2 })
    expect(duelReducer(d, { type: 'next' }).index).toBe(0)
    d = duelReducer(d, { type: 'answer', choice: 1 })
    expect(d.rounds[0].myChoice).toBe(2)
    d = duelReducer(d, { type: 'opponentAnswer', choice: null })
    expect(duelReducer(d, { type: 'next' }).index).toBe(1)
  })

  it('suma puntos y decide quién gana', () => {
    const base = buildDuel({ target: 'FR', home: 'CL', random: seeded(7) })
    const win = play(
      base,
      (q) => q.answer,
      () => null,
    )
    expect(win.finished).toBe(true)
    expect(score(win)).toEqual({ me: ROUNDS, them: 0 })
    expect(outcome(win)).toBe('win')

    const tie = play(
      base,
      (q) => q.answer,
      (q) => q.answer,
    )
    expect(outcome(tie)).toBe('tie')

    const lose = play(
      base,
      (q) => (q.answer + 1) % 4,
      (q) => q.answer,
    )
    expect(outcome(lose)).toBe('lose')
  })

  it('una respuesta fuera de tiempo no suma', () => {
    const q = { answer: 0 }
    expect(isCorrect(q, null)).toBe(false)
    expect(isCorrect(q, undefined)).toBe(false)
    expect(isCorrect(q, 0)).toBe(true)
  })
})
