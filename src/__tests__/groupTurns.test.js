import { describe, expect, it } from 'vitest'
import { isLastSpeaker, nextSpeaker, speakersStatus, speakingOrder, startRound } from '../lib/groupTurns.js'

describe('turnos del modo grupal', () => {
  it('toda la mesa contesta la misma pregunta antes de pasar a otra', () => {
    let s = startRound()
    s = nextSpeaker(s, 3)
    s = nextSpeaker(s, 3)
    expect(s).toMatchObject({ question: 0, step: 2 })
    expect(isLastSpeaker(s, 3)).toBe(true)
    s = nextSpeaker(s, 3)
    expect(s).toEqual({ question: 1, step: 0 })
  })

  it('quien abre la pregunta va rotando', () => {
    expect(speakingOrder(3, 0)).toEqual([0, 1, 2])
    expect(speakingOrder(3, 1)).toEqual([1, 2, 0])
    expect(speakingOrder(3, 2)).toEqual([2, 0, 1])
    expect(speakingOrder(3, 3)).toEqual([0, 1, 2])
  })

  it('marca quién ya habló, quién habla y quién sigue', () => {
    const s = nextSpeaker(nextSpeaker(startRound(), 3), 3)
    expect(speakersStatus(s, 3).map((x) => x.status)).toEqual(['done', 'done', 'current'])
    expect(speakersStatus(startRound(), 3).map((x) => x.status)).toEqual(['current', 'next', 'next'])
  })

  it('sin nombres, cada toque es una pregunta nueva', () => {
    expect(nextSpeaker(startRound(), 0)).toEqual({ question: 1, step: 0 })
    expect(nextSpeaker(startRound(), 1)).toEqual({ question: 1, step: 0 })
  })
})
