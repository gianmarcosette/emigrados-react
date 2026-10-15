import { describe, expect, it } from 'vitest'
import { buildDiaryIndex } from '../lib/diaryIndex.js'

const note = (id, date) => ({ question: { id }, text: 'x', date })

describe('índice del diario', () => {
  const notes = [
    note(1, '2026-07-02T12:00:00Z'),
    note(2, '2026-07-20T12:00:00Z'),
    note(3, '2026-08-05T12:00:00Z'),
    note(4, '2026-08-06T12:00:00Z'),
  ]

  it('agrupa las anotaciones por mes, en orden', () => {
    const groups = buildDiaryIndex(notes, 1)
    expect(groups.map((g) => g.month)).toEqual(['julio de 2026', 'agosto de 2026'])
    expect(groups[1].entries.map((e) => e.question.id)).toEqual([3, 4])
  })

  it('indica la hoja de cada anotación según cuántas entran por hoja', () => {
    expect(buildDiaryIndex(notes, 1).flatMap((g) => g.entries.map((e) => e.page))).toEqual([1, 2, 3, 4])
    expect(buildDiaryIndex(notes, 3).flatMap((g) => g.entries.map((e) => e.page))).toEqual([1, 1, 1, 2])
  })

  it('sin anotaciones no hay índice', () => {
    expect(buildDiaryIndex([], 3)).toEqual([])
  })
})
