import { describe, expect, it } from 'vitest'
import { STAGE_ECHOES, TALK_STAGES } from '../data/talk.js'
import { ANSWER_MAX, checkAnswer, echoOptions, fillPrompt, findContactInfo, promptOptions } from '../online/talk.js'

describe('charla guiada', () => {
  it('tiene tres momentos con preguntas únicas y respuesta de ejemplo', () => {
    expect(TALK_STAGES.map((s) => s.key)).toEqual(['abrir', 'profundizar', 'cerrar'])
    const ids = TALK_STAGES.flatMap((s) => s.prompts.map((p) => p.id))
    expect(new Set(ids).size).toBe(ids.length)
    for (const stage of TALK_STAGES) {
      // Alcanza para ofrecer 3 opciones aunque la otra persona ya haya usado una
      expect(stage.prompts.length).toBeGreaterThanOrEqual(4)
      for (const p of stage.prompts) {
        expect(p.sample.length).toBeLessThanOrEqual(ANSWER_MAX)
        expect(p.echo.length).toBeGreaterThan(20)
      }
      expect(STAGE_ECHOES[stage.key].length).toBeGreaterThanOrEqual(3)
    }
  })

  it('ofrece primero el eco de la pregunta y después ecos del momento, con el país', () => {
    const prompt = TALK_STAGES[0].prompts.find((p) => p.id === 'explicar')
    const echoes = echoOptions(0, prompt, 'España')
    expect(echoes).toHaveLength(3)
    expect(echoes[0]).toBe('Me dieron ganas de conocer España con tus ojos.')
    for (const e of echoes) expect(e).not.toContain('{pais}')
    // Después del eco propio vienen ecos del momento indicado
    for (const e of echoOptions(1, prompt, 'España').slice(1)) expect(STAGE_ECHOES.profundizar).toContain(e)
    expect(echoOptions(9, prompt, 'España')).toEqual([])
  })

  it('pone el país de quien responde', () => {
    expect(fillPrompt({ text: '¿Qué te sorprendió de {pais}?' }, 'España')).toBe('¿Qué te sorprendió de España?')
  })

  it('ofrece opciones del momento sin repetir las usadas', () => {
    const options = promptOptions(0, ['sorpresa', 'palabra'])
    expect(options).toHaveLength(3)
    for (const o of options) {
      expect(['sorpresa', 'palabra']).not.toContain(o.id)
      expect(TALK_STAGES[0].prompts).toContainEqual(o)
    }
    expect(promptOptions(9)).toEqual([])
  })
})

describe('datos de contacto', () => {
  it('detecta teléfonos, mails, links, usuarios y redes', () => {
    expect(findContactInfo('llamame al +34 612 345 678')).toBe('teléfono')
    expect(findContactInfo('mi número es 11-4567-8901')).toBe('teléfono')
    expect(findContactInfo('escribime a ana.paz@gmail.com')).toBe('mail')
    expect(findContactInfo('mirá www.misitio.com')).toBe('link')
    expect(findContactInfo('buscame en tiktok')).toBe('red')
    expect(findContactInfo('soy @ana_paz')).toBe('usuario')
    expect(findContactInfo('pasame tu WhatsApp')).toBe('red')
  })

  it('deja pasar respuestas normales, con años y números chicos', () => {
    expect(findContactInfo('Llegué en 2019, a los 24 años, con 2 valijas.')).toBeNull()
    expect(findContactInfo('Extraño a mi abuela y los domingos en familia.')).toBeNull()
  })

  it('revisa la respuesta antes de enviarla', () => {
    expect(checkAnswer('   ').error).toBeDefined()
    expect(checkAnswer('x'.repeat(ANSWER_MAX + 1)).error).toBeDefined()
    expect(checkAnswer('mi insta es anita').error).toMatch(/contacto/)
    expect(checkAnswer('  Que se dé tiempo.  ')).toEqual({ ok: 'Que se dé tiempo.' })
  })
})
