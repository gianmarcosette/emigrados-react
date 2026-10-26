import { describe, expect, it } from 'vitest'
import {
  FALLBACK_PX,
  TEXT_SIZES,
  baseFromMeasures,
  chromeZoom,
  readTextSize,
  rootFontPx,
  saveTextSize,
} from '../lib/textSize.js'

function memoryStorage() {
  const data = new Map()
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) }
}

describe('tamaño de letra', () => {
  it('hay dos tamaños más chicos y dos más grandes que el normal', () => {
    const i = TEXT_SIZES.findIndex((s) => s.id === 'normal')
    expect(i).toBe(2)
    expect(TEXT_SIZES).toHaveLength(5)
    const scales = TEXT_SIZES.map((s) => s.scale)
    expect([...scales].sort((a, b) => a - b)).toEqual(scales)
  })

  it('normal es la letra del dispositivo', () => {
    expect(rootFontPx(20, 'normal')).toBe(20)
    // iPhone con el tamaño estándar (17 px) equivale a 16
    expect(baseFromMeasures({ appleBody: 17, browserDefault: 16 })).toBe(16)
    // iPhone con texto más grande en Ajustes
    expect(baseFromMeasures({ appleBody: 21, browserDefault: 16 })).toBeCloseTo(19.76)
    // Navegador con la letra configurada en 20
    expect(baseFromMeasures({ appleBody: 0, browserDefault: 20 })).toBe(20)
  })

  it('si no se puede leer el dispositivo, usa un tamaño normal', () => {
    expect(baseFromMeasures({ appleBody: 0, browserDefault: NaN })).toBeNull()
    expect(rootFontPx(null, 'normal')).toBe(FALLBACK_PX)
    expect(rootFontPx(null, 'xl')).toBe(20.8)
    expect(rootFontPx(16, 'inventado')).toBe(16)
  })

  it('los menús cambian poco: nunca más de 8 % arriba o abajo del normal', () => {
    expect(chromeZoom('normal')).toBe(1)
    for (const s of TEXT_SIZES) {
      const effective = s.scale * chromeZoom(s.id)
      expect(effective).toBeGreaterThanOrEqual(0.919)
      expect(effective).toBeLessThanOrEqual(1.081)
    }
  })

  it('se recuerda la elección', () => {
    const storage = memoryStorage()
    expect(readTextSize(storage)).toBe('normal')
    saveTextSize('l', storage)
    expect(readTextSize(storage)).toBe('l')
    saveTextSize('normal', storage)
    expect(readTextSize(storage)).toBe('normal')
    storage.setItem('emigrados:letra', 'gigante')
    expect(readTextSize(storage)).toBe('normal')
  })
})
