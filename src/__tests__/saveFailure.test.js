import { describe, expect, it } from 'vitest'
import { saveDraft, saveLetterDraft } from '../state/drafts.js'
import { initialJourney, saveJourney } from '../state/journey.js'

const full = {
  getItem: () => null,
  setItem: () => {
    throw new DOMException('Sin espacio', 'QuotaExceededError')
  },
  removeItem: () => {},
}
const ok = { data: {}, getItem: () => null, setItem() {}, removeItem() {} }

describe('si el celular se queda sin espacio', () => {
  it('guardar el viaje y los borradores avisa que no se pudo', () => {
    expect(saveJourney(initialJourney, full)).toBe(false)
    expect(saveDraft(1, 'hola', full)).toBe(false)
    expect(saveLetterDraft('hola', full)).toBe(false)
  })

  it('cuando hay espacio, avisa que sí', () => {
    expect(saveJourney(initialJourney, ok)).toBe(true)
    expect(saveDraft(1, 'hola', ok)).toBe(true)
    expect(saveLetterDraft('hola', ok)).toBe(true)
  })
})
