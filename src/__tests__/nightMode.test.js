import { describe, expect, it } from 'vitest'
import { nextNightChoice, readNightChoice, resolveNight } from '../state/nightMode.js'

function memoryStorage() {
  const data = new Map()
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) }
}

describe('modo noche', () => {
  it('sin elección, sigue al teléfono', () => {
    expect(resolveNight(null, true)).toBe(true)
    expect(resolveNight(null, false)).toBe(false)
  })

  it('una elección manda sobre el teléfono y se recuerda', () => {
    const storage = memoryStorage()
    expect(nextNightChoice(false, false, storage)).toBe('si')
    expect(readNightChoice(storage)).toBe('si')
    expect(resolveNight('si', false)).toBe(true)
  })

  it('si lo elegido coincide con el teléfono, vuelve a seguirlo', () => {
    const storage = memoryStorage()
    nextNightChoice(false, false, storage)
    expect(nextNightChoice(true, false, storage)).toBeNull()
    expect(readNightChoice(storage)).toBeNull()
  })
})
