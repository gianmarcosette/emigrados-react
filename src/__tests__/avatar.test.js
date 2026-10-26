import { describe, expect, it } from 'vitest'
import { AVATAR_OPTIONS, AVATAR_PARTS, DEFAULT_AVATAR, colorOf, normalizeAvatar, randomAvatar } from '../lib/avatar.js'

describe('avatares', () => {
  it('el avatar por defecto usa piezas que existen', () => {
    for (const part of AVATAR_PARTS) {
      expect(AVATAR_OPTIONS[part].map((o) => o.id)).toContain(DEFAULT_AVATAR[part])
    }
  })

  it('normaliza datos guardados: lo desconocido vuelve al valor por defecto', () => {
    expect(normalizeAvatar(null)).toBeNull()
    const a = normalizeAvatar({ hair: 'rulos', skin: 'p9', item: 'mate', extra: 'x' })
    expect(a.hair).toBe('rulos')
    expect(a.item).toBe('mate')
    expect(a.skin).toBe(DEFAULT_AVATAR.skin)
    expect(Object.keys(a).sort()).toEqual([...AVATAR_PARTS].sort())
  })

  it('"Sorprendeme" arma combinaciones válidas', () => {
    for (let i = 0; i < 50; i++) {
      const a = randomAvatar()
      expect(normalizeAvatar(a)).toEqual(a)
      if (a.headwear === 'panuelo') expect(a.facialHair).toBe('ninguno')
    }
  })

  it('cada color tiene su valor', () => {
    for (const part of ['skin', 'hairColor', 'shirt']) {
      for (const o of AVATAR_OPTIONS[part]) expect(colorOf(part, o.id)).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})
