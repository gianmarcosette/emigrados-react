import { describe, expect, it } from 'vitest'
import { installMode } from '../state/install.js'

describe('invitación a instalar el juego', () => {
  const base = { standalone: false, ios: false, canPrompt: false, dismissed: false }

  it('muestra el botón cuando el navegador ofrece instalar', () => {
    expect(installMode({ ...base, canPrompt: true })).toBe('prompt')
  })

  it('en iPhone explica los pasos, porque no hay aviso del navegador', () => {
    expect(installMode({ ...base, ios: true })).toBe('ios')
  })

  it('no aparece si ya está instalado, si se dijo "Ahora no" o si el dispositivo no lo permite', () => {
    expect(installMode({ ...base, canPrompt: true, standalone: true })).toBeNull()
    expect(installMode({ ...base, ios: true, dismissed: true })).toBeNull()
    expect(installMode(base)).toBeNull()
  })
})
