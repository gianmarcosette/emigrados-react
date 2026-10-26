import { describe, expect, it } from 'vitest'
import { hasSeenFirstFlight, markFirstFlightSeen, shouldShowFirstFlight } from '../state/firstFlight.js'

function memoryStorage() {
  const data = {}
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => (data[k] = v) }
}

describe('primer vuelo', () => {
  it('se muestra solo en el inicio a quien todavía no empezó', () => {
    const base = { pathname: '/', profile: null, answeredCount: 0, seen: false }
    expect(shouldShowFirstFlight(base)).toBe(true)
    expect(shouldShowFirstFlight({ ...base, pathname: '/grupal' })).toBe(false)
    expect(shouldShowFirstFlight({ ...base, seen: true })).toBe(false)
    expect(shouldShowFirstFlight({ ...base, profile: { name: 'Ana' } })).toBe(false)
    expect(shouldShowFirstFlight({ ...base, answeredCount: 3 })).toBe(false)
  })

  it('recuerda que ya se vio', () => {
    const storage = memoryStorage()
    expect(hasSeenFirstFlight(storage)).toBe(false)
    markFirstFlightSeen(storage)
    expect(hasSeenFirstFlight(storage)).toBe(true)
    expect(hasSeenFirstFlight(undefined)).toBe(false)
  })
})
