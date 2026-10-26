import { describe, expect, it } from 'vitest'
import { DRAFTS_KEY, clearAllDrafts, clearDraft, getDraft, latestDraft, saveDraft } from '../state/drafts.js'

function memoryStorage() {
  const data = {}
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => (data[k] = v),
    removeItem: (k) => delete data[k],
    data,
  }
}

describe('borradores', () => {
  it('guarda y recupera el texto de cada pregunta', () => {
    const storage = memoryStorage()
    saveDraft(12, 'Lo primero que', storage, '2026-10-01T10:00:00Z')
    expect(getDraft(12, storage)).toEqual({ text: 'Lo primero que', date: '2026-10-01T10:00:00Z' })
    expect(getDraft(13, storage)).toBeNull()
  })

  it('borra el borrador cuando el texto queda vacío o se guarda la respuesta', () => {
    const storage = memoryStorage()
    saveDraft(1, 'hola', storage)
    saveDraft(1, '   ', storage)
    expect(getDraft(1, storage)).toBeNull()
    expect(storage.data[DRAFTS_KEY]).toBeUndefined()
    saveDraft(2, 'algo', storage)
    clearDraft(2, storage)
    expect(getDraft(2, storage)).toBeNull()
  })

  it('encuentra el más reciente para retomarlo', () => {
    const storage = memoryStorage()
    expect(latestDraft(storage)).toBeNull()
    saveDraft(5, 'viejo', storage, '2026-10-01T10:00:00Z')
    saveDraft(9, 'nuevo', storage, '2026-10-02T10:00:00Z')
    expect(latestDraft(storage)).toEqual({ questionId: 9, text: 'nuevo', date: '2026-10-02T10:00:00Z' })
    clearAllDrafts(storage)
    expect(latestDraft(storage)).toBeNull()
  })

  it('tolera datos rotos o sin almacenamiento', () => {
    const storage = memoryStorage()
    storage.setItem(DRAFTS_KEY, '{roto')
    expect(getDraft(1, storage)).toBeNull()
    expect(() => saveDraft(1, 'x', undefined)).not.toThrow()
  })
})
