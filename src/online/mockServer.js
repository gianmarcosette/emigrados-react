// Servidor simulado del modo online (versión de prueba).
//
// Todo lo que en la versión real hace el servidor pasa por estas funciones:
//   Duelo
//   - getOnlineCountries(me): en qué países hay gente conectada ahora
//   - findOpponent(code, me): conectar con alguien que vive en ese país
//   - opponentAnswer(question): la respuesta de la otra persona
//   Charla guiada (después del duelo)
//   - requestTalk(rival): pedirle a la otra persona seguir la charla (acepta o no)
//   - rivalAnswer(prompt): su respuesta a la pregunta que le hiciste
//   - rivalQuestion(stageIndex, used): la pregunta que te hace
//   - rivalReaction(stageIndex, prompt, country): su eco a tu respuesta
//   - reportRival(rival, reason) / blockRival(rival): denunciar o bloquear
// Para hacerlo online de verdad se reemplaza este archivo por uno con la misma forma
// que hable con un servidor (por ejemplo, Supabase Realtime o Firebase). Las pantallas
// y las reglas del duelo (duel.js) no cambian.
import { TRIVIA } from '../data/trivia.js'
import { randomAvatar } from '../lib/avatar.js'
import { echoOptions, promptOptions } from './talk.js'

// Nombres de pila de personas simuladas por país donde viven
const PEOPLE = {
  AR: ['Martina', 'Facundo', 'Camila', 'Joaquín', 'Florencia'],
  UY: ['Valentina', 'Mateo', 'Sofía', 'Agustín'],
  CL: ['Catalina', 'Benjamín', 'Javiera', 'Vicente'],
  CO: ['Daniela', 'Santiago', 'Valeria', 'Andrés'],
  VE: ['Gabriela', 'Luis', 'Andrea', 'José'],
  PE: ['Ximena', 'Diego', 'Lucero', 'Renato'],
  MX: ['Fernanda', 'Emiliano', 'Regina', 'Diego'],
  CU: ['Yanet', 'Alejandro', 'Dayana', 'Yoel'],
  BR: ['Ana Clara', 'João', 'Beatriz', 'Rafael'],
  ES: ['Lucía', 'Javier', 'Carmen', 'Álvaro', 'Nerea'],
  PT: ['Inês', 'Tiago', 'Mariana', 'Duarte'],
  IT: ['Giulia', 'Lorenzo', 'Chiara', 'Matteo'],
  FR: ['Camille', 'Hugo', 'Léa', 'Louis'],
  DE: ['Lena', 'Jonas', 'Mia', 'Felix'],
  GB: ['Olivia', 'Harry', 'Amelia', 'Jack'],
  US: ['Emily', 'Daniel', 'Sophia', 'Michael'],
  CA: ['Chloé', 'Liam', 'Emma', 'Noah'],
  AU: ['Charlotte', 'Oliver', 'Isla', 'William'],
}

// La misma "foto" de quién está conectado durante 10 minutos, para que no cambie en cada visita
function windowSeed(now = Date.now()) {
  return Math.floor(now / 600000)
}

function seeded(seed) {
  let n = seed % 233280
  return () => {
    n = (n * 9301 + 49297) % 233280
    return n / 233280
  }
}

function hash(text) {
  return [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100000, 7)
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** [{ code, count }]: países con gente conectada (con preguntas cargadas), sin el tuyo. */
export async function getOnlineCountries(me, now = Date.now()) {
  await wait(400)
  const seed = windowSeed(now)
  return Object.keys(TRIVIA)
    .filter((code) => code !== me.country)
    .map((code) => {
      const random = seeded(seed + hash(code))
      return { code, count: Math.floor(random() * (PEOPLE[code].length + 1)) }
    })
    .filter((c) => c.count > 0)
}

/** Una persona conectada que vive en `code`. Tarda un poco, como una búsqueda real. */
export async function findOpponent(code, me, random = Math.random) {
  await wait(1800 + random() * 1400)
  const names = PEOPLE[code] ?? ['Alex']
  const name = names[Math.floor(random() * names.length)]
  return {
    name,
    age: 20 + Math.floor(random() * 35),
    country: code,
    // Cada persona simulada trae su propio pasajero dibujado
    avatar: randomAvatar(random),
    simulated: true,
  }
}

/**
 * La otra persona responde su pregunta: acierta 6 de cada 10 y tarda entre 3 y 13 segundos.
 * Devuelve { choice, ms }; choice null si no llega a responder.
 */
export async function opponentAnswer(question, random = Math.random) {
  const ms = 3000 + random() * 10000
  await wait(ms)
  const right = random() < 0.6
  const wrong = [0, 1, 2, 3].filter((i) => i !== question.answer)
  return { choice: right ? question.answer : wrong[Math.floor(random() * wrong.length)], ms }
}

/** La otra persona decide si quiere seguir la charla: en la prueba acepta 8 de cada 10 veces. */
export async function requestTalk(rival, random = Math.random) {
  await wait(1800 + random() * 2000)
  return { accepted: random() < 0.8 }
}

/** Respuesta a la pregunta que le hiciste (en la prueba, una respuesta de ejemplo). */
export async function rivalAnswer(prompt, random = Math.random) {
  await wait(2500 + random() * 2500)
  return prompt.sample
}

/** Pregunta que te hace, del mismo momento de la charla y sin repetir. */
export async function rivalQuestion(stageIndex, used, random = Math.random) {
  await wait(1200 + random() * 1500)
  return promptOptions(stageIndex, used, random, 1)[0] ?? null
}

/** Eco a tu respuesta: casi siempre el propio de la pregunta que te hizo, a veces uno del momento. */
export async function rivalReaction(stageIndex, prompt, countryLabel, random = Math.random) {
  await wait(1500 + random() * 1500)
  const options = echoOptions(stageIndex, prompt, countryLabel, random)
  return random() < 0.6 ? options[0] : options[1 + Math.floor(random() * (options.length - 1))]
}

// En la versión real, la denuncia llega a moderación y el bloqueo evita volver a cruzarse.
export async function reportRival() {
  await wait(500)
  return { ok: true }
}

export async function blockRival() {
  await wait(300)
  return { ok: true }
}
