// "Preguntale a alguien de allá": la pregunta viaja por WhatsApp a alguien querido, con un
// link que le abre esa misma pregunta. Quien la recibe le contesta a la persona, no al juego.
// Sin React, para poder testearlo.
import { isCountryCode } from '../data/residence.js'
import { clipAnswer } from './shareCard.js'

export const RELATIONS = [
  { key: 'mama', label: 'Mamá', greeting: 'Ma,' },
  { key: 'papa', label: 'Papá', greeting: 'Pa,' },
  { key: 'hermanos', label: 'Hermanos', greeting: 'Hola,' },
  { key: 'abuelos', label: 'Abuelos', greeting: 'Abu,' },
  { key: 'amistad', label: 'Una amistad', greeting: 'Hola,' },
  { key: 'otra', label: 'Otra persona', greeting: 'Hola,' },
]

export const NAME_MAX = 40
// La respuesta que se suma al mensaje va recortada, para que no tape la pregunta
export const ASK_ANSWER_MAX = 280

/** El link que abre la pregunta. Lleva tu nombre y el país donde vivís, para que sepan quién la manda. */
export function askLink({ origin, questionId, name, country }) {
  const params = new URLSearchParams()
  const clean = cleanName(name)
  if (clean) params.set('de', clean)
  if (isCountryCode(country)) params.set('desde', country)
  const query = params.toString()
  return `${origin}/pregunta/${questionId}${query ? `?${query}` : ''}`
}

/** El mensaje para WhatsApp, listo para editar. */
export function askMessage({ relation, question, link, answer }) {
  const greeting = RELATIONS.find((r) => r.key === relation)?.greeting ?? 'Hola,'
  const lines = [
    `${greeting} estoy jugando a Emigrados, un juego de preguntas para quienes emigramos. Me tocó esta y me gustaría hablarla con vos:`,
    '',
    `«${question}»`,
  ]
  const mine = answer ? clipAnswer(answer, ASK_ANSWER_MAX) : ''
  if (mine) lines.push('', `Yo respondí: «${mine}»`)
  lines.push('', '¿Qué te pasa a vos con esta pregunta?', link)
  return lines.join('\n')
}

/** Abre WhatsApp con el mensaje escrito; la persona elige a quién mandárselo. */
export function whatsappUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/** Lo que llega en el link: el nombre (limpio) y el país, si es uno válido. */
export function readAsk(params) {
  const country = params.get('desde')
  return { name: cleanName(params.get('de')), country: isCountryCode(country) ? country : null }
}

/** La respuesta de quien recibió la pregunta, para mandarle de vuelta por WhatsApp. */
export function replyMessage({ question }) {
  return `Sobre la pregunta que me mandaste de Emigrados, «${question}»:\n\n`
}

function cleanName(name) {
  return (name ?? '')
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NAME_MAX)
}
