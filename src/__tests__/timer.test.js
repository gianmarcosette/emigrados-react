import { describe, expect, it } from 'vitest'
import { createTimer, formatClock, pauseTimer, secondsLeft, startTimer } from '../lib/timer.js'

describe('temporizador del modo grupal', () => {
  it('muestra minutos y segundos', () => {
    expect(formatClock(120)).toBe('2:00')
    expect(formatClock(65)).toBe('1:05')
    expect(formatClock(0.2)).toBe('0:01')
    expect(formatClock(-3)).toBe('0:00')
  })

  it('arranca quieto y descuenta desde que se inicia', () => {
    const t = createTimer(60)
    expect(secondsLeft(t, 5000)).toBe(60)
    const running = startTimer(t, 1000)
    expect(secondsLeft(running, 11000)).toBe(50)
    expect(secondsLeft(running, 99000)).toBe(0)
  })

  it('al pausar guarda lo que falta y retoma desde ahí', () => {
    const paused = pauseTimer(startTimer(createTimer(60), 0), 20000)
    expect(paused.endsAt).toBeNull()
    expect(secondsLeft(paused, 90000)).toBe(40)
    expect(secondsLeft(startTimer(paused, 100000), 110000)).toBe(30)
  })

  it('no vuelve a arrancar si ya terminó', () => {
    const done = pauseTimer(startTimer(createTimer(10), 0), 15000)
    expect(startTimer(done, 20000)).toBe(done)
  })
})
