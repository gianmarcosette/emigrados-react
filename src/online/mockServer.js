// Servidor simulado del modo online (versión de prueba: todavía no hay servidor).
//
// Todo lo que en la versión real hace el servidor pasa por estas funciones:
//   Duelo (no es en vivo: cada persona responde cuando puede)
//   - findOpponent(code, me): alguien con ganas de conectar que vive en ese país
//     (o en cualquiera, si no se elige)
//   - startDuel(duel): registrar el duelo; el servidor le avisa a la otra persona
//   - fetchRivalAnswers(duel): si la otra persona ya terminó, sus respuestas
//   Charla (se abre cuando los dos terminaron el duelo)
//   - rivalAnswer(prompt): su respuesta a la pregunta que le hiciste
//   - rivalQuestion(stageIndex, used): la pregunta que te hace
//   - rivalReaction(stageIndex, prompt, country): su eco a tu respuesta
//   - reportRival(rival, reason) / blockRival(rival): denunciar o bloquear
// Para hacerlo online de verdad se reemplaza este archivo por uno con la misma forma
// que hable con un servidor (por ejemplo, Supabase o Firebase), más los avisos al
// celular cuando el otro termina. Las pantallas y las reglas del duelo (duel.js) no cambian.
import { ONLINE_COUNTRIES, TRIVIA } from '../data/trivia.js'
import { randomAvatar } from '../lib/avatar.js'
import { echoOptions, promptOptions } from './talk.js'

// Nombres de pila de las personas simuladas, según el país donde nacieron
const NAMES = {
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
  BO: ['Mariela', 'Rodrigo', 'Wara', 'Marcelo'],
  EC: ['Doménica', 'Mateo', 'Paula', 'Esteban'],
  PY: ['Ruth', 'Osvaldo', 'Liz', 'Gustavo'],
  CR: ['Mariana', 'Esteban', 'Raquel', 'Josué'],
  DO: ['Yesenia', 'Ramón', 'Paola', 'Wilson'],
  SV: ['Karla', 'Mauricio', 'Roxana', 'Óscar'],
  GT: ['Ana Lucía', 'Pablo', 'Gabriela', 'Kevin'],
  HN: ['Dania', 'Allan', 'Sofía', 'Héctor'],
  NI: ['Maryuri', 'Erick', 'Tania', 'Róger'],
  PA: ['Itzel', 'Ricardo', 'Yaritza', 'Abdiel'],
  PR: ['Coral', 'Javier', 'Yarelis', 'Luis Ángel'],
}

// Dónde nacieron, sobre todo, quienes juegan desde los destinos (la migración que más
// se mueve hacia España, la Working Holiday y Norteamérica)
const ORIGINS = ['AR', 'AR', 'CL', 'CL', 'UY', 'CO', 'CO', 'VE', 'VE', 'PE', 'MX', 'ES', 'EC', 'BO', 'PY']

const SECOND = 1000

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const pick = (list, random) => list[Math.floor(random() * list.length)]

/** Una persona con ganas de conectar que vive en `code` (o en cualquier país abierto). */
export async function findOpponent(code, me, random = Math.random) {
  await wait(1500 + random() * 1200)
  const country =
    code ??
    pick(
      ONLINE_COUNTRIES.filter((c) => c !== me.country),
      random,
    )
  // Si vive en un país de habla hispana, la mitad de las veces nació ahí; si no, viene de otro lado
  const local = NAMES[country] && random() < 0.5
  const birthCountry = local
    ? country
    : pick(
        ORIGINS.filter((c) => c !== country),
        random,
      )
  return {
    id: `sim-${Math.floor(random() * 1e9)}`,
    name: pick(NAMES[birthCountry], random),
    age: 20 + Math.floor(random() * 35),
    country,
    birthCountry,
    // Cada quien decide si muestra su origen; muchas personas simuladas lo muestran
    showOrigin: random() < 0.7,
    timeZone: TRIVIA[country]?.timeZone ?? null,
    // Cada persona simulada trae su propio pasajero dibujado
    avatar: randomAvatar(random),
    simulated: true,
  }
}

/**
 * Registra el duelo. En la prueba, además, decide cuándo termina la persona simulada:
 * entre 40 segundos y 3 minutos después (en la vida real, horas o días), acertando 6 de
 * cada 10. Una de cada 8 no llega a responder y el duelo vence. Eso queda en `sim`, un
 * campo que solo existe en la prueba.
 */
export async function startDuel(duel, random = Math.random) {
  await wait(300)
  const never = random() < 1 / 8
  const doneAt = new Date(new Date(duel.createdAt).getTime() + 40 * SECOND + random() * 140 * SECOND)
  const choices = duel.rounds.map(({ theirs }) => {
    if (random() < 0.6) return theirs.answer
    const wrong = [0, 1, 2, 3].filter((i) => i !== theirs.answer)
    return pick(wrong, random)
  })
  return { ...duel, sim: { doneAt: never ? null : doneAt.toISOString(), choices } }
}

/** Las respuestas de tu rival si ya terminó ({ choices, at }), o null si todavía no. */
export async function fetchRivalAnswers(duel, now = new Date()) {
  const doneAt = duel.sim?.doneAt
  if (!doneAt || new Date(now) < new Date(doneAt)) return null
  return { choices: duel.sim.choices, at: doneAt }
}

/** Solo en la prueba: que la persona simulada termine ya, para no esperar en una demostración. */
export function finishRivalNow(duel, now = new Date()) {
  return { ...duel, sim: { ...duel.sim, doneAt: new Date(now).toISOString() } }
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
