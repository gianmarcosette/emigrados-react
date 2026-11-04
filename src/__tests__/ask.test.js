import { describe, expect, it } from 'vitest'
import { askLink, askMessage, readAsk, replyMessage, whatsappUrl } from '../lib/ask.js'

describe('preguntale a alguien de allá', () => {
  it('el link lleva la pregunta, el nombre y el país', () => {
    const link = askLink({ origin: 'https://e.test', questionId: 28, name: 'Lucía', country: 'ES' })
    expect(link).toBe('https://e.test/pregunta/28?de=Luc%C3%ADa&desde=ES')
    expect(askLink({ origin: 'https://e.test', questionId: 3 })).toBe('https://e.test/pregunta/3')
  })

  it('lo que llega se limpia: nombre corto y sin caracteres raros, país válido', () => {
    const params = new URLSearchParams({ de: '  Ana‮  María\n' + 'x'.repeat(80), desde: 'ZZ' })
    const { name, country } = readAsk(params)
    expect(name.startsWith('Ana María')).toBe(true)
    expect(name.length).toBeLessThanOrEqual(40)
    expect(country).toBeNull()
  })

  it('el mensaje saluda según a quién va y suma la respuesta solo si se pide', () => {
    const base = { question: '¿De quién te costó más despedirte?', link: 'L' }
    const plain = askMessage({ ...base, relation: 'mama' })
    expect(plain.startsWith('Ma, ')).toBe(true)
    expect(plain).toContain('«¿De quién te costó más despedirte?»')
    expect(plain).not.toContain('Yo respondí')
    expect(plain.endsWith('L')).toBe(true)
    const withAnswer = askMessage({ ...base, relation: 'abuelos', answer: 'De mi abuela.' })
    expect(withAnswer.startsWith('Abu, ')).toBe(true)
    expect(withAnswer).toContain('Yo respondí: «De mi abuela.»')
  })

  it('WhatsApp recibe el texto codificado', () => {
    expect(whatsappUrl('Hola & chau')).toBe('https://wa.me/?text=Hola%20%26%20chau')
    expect(replyMessage({ question: '¿Q?' })).toContain('«¿Q?»')
  })
})
