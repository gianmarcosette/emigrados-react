import { describe, expect, it } from 'vitest'
import { GENERAL, ONLINE_COUNTRIES, TRIVIA, isOnlineCountry } from '../data/trivia.js'
import { countryShape } from '../lib/countryShapes.js'
import {
  DEADLINE_HOURS,
  MAX_OPEN_DUELS,
  ROUNDS,
  answer,
  createDuel,
  currentRound,
  duelStatus,
  hoursLeft,
  isCorrect,
  myProgress,
  openDuels,
  outcome,
  receiveRival,
  score,
} from '../online/duel.js'
import { fetchRivalAnswers, finishRivalNow, startDuel } from '../online/mockServer.js'
import { joinWaitlist, loadDuels, loadWaitlist, removeDuel, saveDuels, upsertDuel } from '../state/duels.js'

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
      // Suficientes para que dos duelos seguidos no repitan preguntas
      expect(questions.length).toBeGreaterThanOrEqual(ROUNDS * 2)
      for (const q of questions) {
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options).size).toBe(4)
        expect(q.fact?.length, `dato curioso: ${q.text}`).toBeGreaterThan(20)
      }
      expect(new Set(questions.map((q) => q.text)).size).toBe(questions.length)
    }
    expect(GENERAL.length).toBeGreaterThanOrEqual(ROUNDS)
    for (const q of GENERAL) expect(q.fact?.length).toBeGreaterThan(20)
  })
})

describe('países del modo Online', () => {
  it('está abierto en España, Latinoamérica y los destinos más elegidos', () => {
    for (const code of ['ES', 'AU', 'DE', 'IE', 'NZ', 'FR', 'US', 'CA', 'GB'])
      expect(isOnlineCountry(code), code).toBe(true)
    const latam = ['AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE']
    for (const code of [...latam, 'PR', 'UY', 'VE']) expect(isOnlineCountry(code), code).toBe(true)
    // El caso que lo empezó todo: desde Albania se ve la lista de espera, no preguntas sobre Egipto
    expect(isOnlineCountry('AL')).toBe(false)
  })

  it('cada país abierto sabe qué hora es allá', () => {
    for (const code of ONLINE_COUNTRIES) {
      const { timeZone } = TRIVIA[code]
      expect(() => new Intl.DateTimeFormat('es', { timeZone }), code).not.toThrow()
    }
  })
})

describe('duelo a su ritmo', () => {
  const rival = { id: 'r1', name: 'Lucía', country: 'ES' }
  const start = new Date('2026-10-01T10:00:00Z')
  const newDuel = (seed = 1) => createDuel({ rival, home: 'AR', now: start, random: seeded(seed) })
  const answerAll = (duel, pick, now = start) => {
    let d = duel
    while (currentRound(d)) d = answer(d, pick(currentRound(d).round.mine), now)
    return d
  }

  it('pregunta sobre el país del rival y el rival sobre el tuyo', () => {
    const duel = newDuel()
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

  it('se responde sin esperar al otro: de a una, sin poder cambiar la respuesta', () => {
    let d = newDuel()
    expect(duelStatus(d, start)).toBe('yourTurn')
    d = answer(d, 2, start)
    expect(myProgress(d)).toBe(1)
    expect(d.rounds[0].myChoice).toBe(2)
    expect(currentRound(d).index).toBe(1)
    d = answerAll(d, (q) => q.answer)
    expect(myProgress(d)).toBe(ROUNDS)
    expect(d.rounds[0].myChoice).toBe(2)
    expect(answer(d, 0, start)).toBe(d)
    expect(duelStatus(d, start)).toBe('waiting')
  })

  it('el resultado y el chat aparecen recién cuando terminaron los dos', () => {
    let d = answerAll(newDuel(7), (q) => q.answer)
    const theirs = d.rounds.map(() => null)
    // El otro terminó antes que vos: igual se espera a que termines
    const early = receiveRival(newDuel(7), { choices: theirs, at: start })
    expect(duelStatus(early, start)).toBe('yourTurn')
    d = receiveRival(d, { choices: theirs, at: start })
    expect(duelStatus(d, start)).toBe('ready')
    expect(score(d)).toEqual({ me: ROUNDS, them: 0 })
    expect(outcome(d)).toBe('win')
    // Las respuestas llegan una sola vez
    expect(receiveRival(d, { choices: d.rounds.map((r) => r.theirs.answer), at: start })).toBe(d)
  })

  it('empate y derrota', () => {
    const base = newDuel(3)
    const right = base.rounds.map((r) => r.theirs.answer)
    const tie = receiveRival(
      answerAll(base, (q) => q.answer),
      { choices: right, at: start },
    )
    expect(outcome(tie)).toBe('tie')
    const lose = receiveRival(
      answerAll(base, (q) => (q.answer + 1) % 4),
      { choices: right, at: start },
    )
    expect(outcome(lose)).toBe('lose')
  })

  it(`vence a las ${DEADLINE_HOURS} horas si no terminaron los dos`, () => {
    const d = answerAll(newDuel(), (q) => q.answer)
    const almost = new Date(start.getTime() + (DEADLINE_HOURS - 1) * 3600000)
    const after = new Date(start.getTime() + (DEADLINE_HOURS + 1) * 3600000)
    expect(hoursLeft(d, almost)).toBe(1)
    expect(duelStatus(d, almost)).toBe('waiting')
    expect(duelStatus(d, after)).toBe('expired')
    expect(hoursLeft(d, after)).toBe(0)
    // Un duelo vencido ya no se puede responder
    expect(answer(newDuel(), 0, after).rounds[0].myChoice).toBeUndefined()
  })

  it(`cuenta como abiertos solo los que esperan a alguien (máximo ${MAX_OPEN_DUELS})`, () => {
    const playing = newDuel(1)
    const ready = receiveRival(
      answerAll(newDuel(2), (q) => q.answer),
      { choices: [0, 0, 0, 0, 0], at: start },
    )
    expect(openDuels([playing, ready], start)).toEqual([playing])
  })

  it('una respuesta sin elegir no suma', () => {
    const q = { answer: 0 }
    expect(isCorrect(q, null)).toBe(false)
    expect(isCorrect(q, undefined)).toBe(false)
    expect(isCorrect(q, 0)).toBe(true)
  })
})

describe('servidor simulado', () => {
  it('la persona simulada termina después de un rato, o se la puede apurar en la prueba', async () => {
    const duel = await startDuel(createDuel({ rival: { id: 'r', name: 'Ana', country: 'AU' }, home: 'CL' }), seeded(5))
    expect(duel.sim.choices).toHaveLength(ROUNDS)
    expect(await fetchRivalAnswers(duel, new Date(duel.createdAt))).toBeNull()
    const now = new Date(new Date(duel.createdAt).getTime() + 1000)
    const res = await fetchRivalAnswers(finishRivalNow(duel, now), now)
    expect(res.choices).toEqual(duel.sim.choices)
  })
})

describe('duelos guardados en el dispositivo', () => {
  function memoryStorage() {
    const data = {}
    return {
      getItem: (k) => data[k] ?? null,
      setItem: (k, v) => (data[k] = v),
      removeItem: (k) => delete data[k],
    }
  }

  it('se guardan con el progreso y se retoman', () => {
    const storage = memoryStorage()
    let d = createDuel({ rival: { id: 'r', name: 'Ana', country: 'DE' }, home: 'UY', random: seeded(2) })
    d = answer(d, 1)
    saveDuels([d], storage)
    const [loaded] = loadDuels(storage)
    expect(myProgress(loaded)).toBe(1)
    expect(currentRound(loaded).index).toBe(1)
    expect(loadDuels({ getItem: () => 'no es json' })).toEqual([])
  })

  it('reemplaza un duelo en su lugar y lo quita', () => {
    const a = { id: 'a' }
    const b = { id: 'b' }
    const list = upsertDuel(upsertDuel([], a), b)
    expect(list.map((d) => d.id)).toEqual(['b', 'a'])
    expect(upsertDuel(list, { id: 'a', x: 1 }).map((d) => d.id)).toEqual(['b', 'a'])
    expect(removeDuel(list, 'a').map((d) => d.id)).toEqual(['b'])
  })

  it('la lista de espera no repite países', () => {
    const storage = memoryStorage()
    joinWaitlist('AL', storage)
    joinWaitlist('AL', storage)
    expect(loadWaitlist(storage)).toEqual(['AL'])
  })
})
