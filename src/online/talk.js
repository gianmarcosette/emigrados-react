// Reglas de la charla guiada (sin React ni red, para testear).
import { STAGE_ECHOES, TALK_STAGES } from '../data/talk.js'
import { shuffle } from './duel.js'

export const ANSWER_MAX = 280
export const OPTIONS_PER_TURN = 3

/** La pregunta con el país de quien responde. */
export function fillPrompt(prompt, countryLabel) {
  return fillCountry(prompt.text, countryLabel)
}

export function fillCountry(text, countryLabel) {
  return text.replaceAll('{pais}', countryLabel)
}

/**
 * Ecos para responder a lo que la otra persona contó: primero el propio de la pregunta,
 * después algunos del momento de la charla. {pais} es el país de quien respondió.
 */
export function echoOptions(stageIndex, prompt, countryLabel, random = Math.random, count = OPTIONS_PER_TURN) {
  const stage = TALK_STAGES[stageIndex]
  if (!stage) return []
  const own = prompt?.echo ? [prompt.echo] : []
  const general = shuffle(STAGE_ECHOES[stage.key] ?? [], random)
  return [...own, ...general].slice(0, count).map((text) => fillCountry(text, countryLabel))
}

/** Preguntas para elegir en un momento de la charla, sin repetir las ya usadas. */
export function promptOptions(stageIndex, used = [], random = Math.random, count = OPTIONS_PER_TURN) {
  const stage = TALK_STAGES[stageIndex]
  if (!stage) return []
  return shuffle(
    stage.prompts.filter((p) => !used.includes(p.id)),
    random,
  ).slice(0, count)
}

// Datos de contacto que no se pueden compartir en la charla
const CONTACT_PATTERNS = [
  { kind: 'mail', re: /[^\s@]+@[^\s@]+\.[a-z]{2,}/i },
  { kind: 'link', re: /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|net|org|io|me|ar|es|uy|cl|mx|co|link)\b/i },
  { kind: 'usuario', re: /(?:^|\s)@[a-z0-9_.]{2,}/i },
  { kind: 'red', re: /\b(?:whats\s?app|wsp|telegram|instagram|insta|ig|tiktok|facebook|snapchat|signal)\b/i },
  // 7 o más dígitos, aunque estén separados por espacios, puntos, guiones o paréntesis
  { kind: 'teléfono', re: /(?:\+?\d[\s().-]*){7,}/ },
]

/** Devuelve qué tipo de dato de contacto aparece en el texto, o null si no hay ninguno. */
export function findContactInfo(text) {
  const found = CONTACT_PATTERNS.find(({ re }) => re.test(text))
  return found ? found.kind : null
}

/** Revisa una respuesta antes de enviarla: { ok } o { error }. */
export function checkAnswer(text) {
  const clean = text.trim()
  if (!clean) return { error: 'Escribí tu respuesta.' }
  if (clean.length > ANSWER_MAX) return { error: `Usá hasta ${ANSWER_MAX} caracteres.` }
  if (findContactInfo(clean)) {
    return { error: 'Por tu seguridad, no compartas datos de contacto en la charla (teléfono, mail, links o redes).' }
  }
  return { ok: clean }
}
