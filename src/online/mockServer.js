// Servidor simulado del modo online (versión de prueba).
//
// Todo lo que en la versión real hace el servidor pasa por estas tres funciones:
//   - getOnlineCountries(me): en qué países hay gente conectada ahora
//   - findOpponent(code, me): conectar con alguien que vive en ese país
//   - opponentAnswer(question): la respuesta de la otra persona
// Para hacerlo online de verdad se reemplaza este archivo por uno con la misma forma
// que hable con un servidor (por ejemplo, Supabase Realtime o Firebase). Las pantallas
// y las reglas del duelo (duel.js) no cambian.
import { TRIVIA } from '../data/trivia.js'

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
