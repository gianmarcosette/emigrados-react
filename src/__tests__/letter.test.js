import { describe, expect, it } from 'vitest'
import { addMonths, dayKey, daysUntil, letterCalendar, normalizeLetter, openDay, sortLetters } from '../lib/letter.js'
import { initialJourney, journeyReducer } from '../state/journey.js'

const now = new Date(2026, 10, 4, 22, 30) // 4 de noviembre de 2026, de noche

describe('carta al futuro: fechas', () => {
  it('3, 6 y 12 meses después, sin pasarse de mes', () => {
    expect(openDay('3m', null, now)).toBe('2027-02-04')
    expect(openDay('6m', null, now)).toBe('2027-05-04')
    expect(openDay('1y', null, now)).toBe('2027-11-04')
    expect(dayKey(addMonths(new Date(2026, 7, 31), 6))).toBe('2027-02-28')
  })

  it('una fecha propia tiene que ser a partir de mañana', () => {
    expect(openDay('date', '2026-11-04', now)).toBeNull()
    expect(openDay('date', '2026-11-05', now)).toBe('2026-11-05')
    expect(openDay('date', '2026-02-30', now)).toBeNull()
    expect(openDay('date', '', now)).toBeNull()
  })

  it('cuenta los días que faltan y ordena las cartas', () => {
    expect(daysUntil('2026-11-05', now)).toBe(1)
    expect(daysUntil('2026-11-01', now)).toBe(0)
    const letters = [
      { id: 'a', openOn: '2027-05-04' },
      { id: 'b', openOn: '2026-11-04' },
      { id: 'c', openOn: '2026-12-01' },
      { id: 'd', openOn: '2026-10-01', openedAt: '2026-10-01T10:00:00Z' },
    ]
    const { due, sealed, opened } = sortLetters(letters, now)
    expect(due.map((l) => l.id)).toEqual(['b'])
    expect(sealed.map((l) => l.id)).toEqual(['c', 'a'])
    expect(opened.map((l) => l.id)).toEqual(['d'])
  })
})

describe('carta al futuro: calendario', () => {
  it('arma un evento de todo el día con aviso', () => {
    const ics = letterCalendar({ id: 'x1', openOn: '2027-05-04', url: 'https://emigrados.test/carta', now })
    expect(ics).toContain('DTSTART;VALUE=DATE:20270504')
    expect(ics).toContain('DTEND;VALUE=DATE:20270505')
    expect(ics).toContain('UID:carta-x1@emigrados')
    expect(ics).toContain('TRIGGER:PT10H')
    expect(ics.split('\r\n').every((line) => line.length <= 75)).toBe(true)
    // El texto de la carta nunca va al calendario
    expect(ics).not.toContain('Hoy hace')
  })
})

describe('carta al futuro: estado', () => {
  const letter = { id: 'l1', text: 'Hola', writtenAt: '2026-11-04T21:00:00Z', openOn: '2027-05-04' }

  it('se cierra, se abre una sola vez y se le contesta', () => {
    let s = journeyReducer(initialJourney, { type: 'sealLetter', letter })
    expect(s.letters).toHaveLength(1)
    expect(journeyReducer(s, { type: 'sealLetter', letter })).toBe(s)
    // No se contesta una carta cerrada
    expect(journeyReducer(s, { type: 'replyLetter', id: 'l1', text: 'x' }).letters[0].reply).toBeUndefined()
    s = journeyReducer(s, { type: 'openLetter', id: 'l1', date: '2027-05-04T10:00:00Z' })
    s = journeyReducer(s, { type: 'openLetter', id: 'l1', date: '2027-06-01T10:00:00Z' })
    expect(s.letters[0].openedAt).toBe('2027-05-04T10:00:00Z')
    s = journeyReducer(s, { type: 'replyLetter', id: 'l1', text: 'Sí', date: 'd' })
    expect(s.letters[0].reply).toEqual({ text: 'Sí', date: 'd' })
  })

  it('borrar el diario no borra las cartas; borrar el perfil, sí', () => {
    const s = journeyReducer(initialJourney, { type: 'sealLetter', letter })
    expect(journeyReducer(s, { type: 'reset' }).letters).toHaveLength(1)
    expect(journeyReducer(s, { type: 'deleteProfile' }).letters).toEqual([])
    expect(journeyReducer(s, { type: 'deleteLetter', id: 'l1' }).letters).toEqual([])
  })

  it('descarta cartas guardadas que no sirven', () => {
    expect(normalizeLetter({ ...letter, openOn: 'mañana' })).toBeNull()
    expect(normalizeLetter({ ...letter, extra: 1 })).toEqual(letter)
  })
})
