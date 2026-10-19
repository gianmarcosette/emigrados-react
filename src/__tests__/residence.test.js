import { describe, expect, it } from 'vitest'
import { RESIDENCE_OPTIONS, countryName, isCountryCode } from '../data/residence.js'

describe('países donde se vive', () => {
  it('nombra los países en español', () => {
    expect(countryName('ES')).toBe('España')
    expect(countryName('US')).toBe('Estados Unidos')
    expect(countryName('CI')).toBe('Costa de Marfil')
  })

  it('valida los códigos', () => {
    expect(isCountryCode('AR')).toBe(true)
    expect(isCountryCode('XX')).toBe(false)
    expect(isCountryCode(undefined)).toBe(false)
  })

  it('ordena las opciones alfabéticamente', () => {
    const names = RESIDENCE_OPTIONS.map((o) => o.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'es')))
    expect(RESIDENCE_OPTIONS.length).toBeGreaterThan(200)
  })
})
