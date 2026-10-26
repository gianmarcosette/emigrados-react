// "Primer vuelo": la bienvenida de tres pantallas para quien entra por primera vez.
// Se muestra sola una única vez y solo a quien todavía no empezó a jugar; después
// se puede volver a ver desde el pie de página.
import { createContext } from 'react'

// Para abrir el primer vuelo desde cualquier pantalla (por ejemplo, desde "¿Cómo se juega?")
export const FirstFlightContext = createContext(() => {})

export const FIRST_FLIGHT_KEY = 'emigrados:primer-vuelo'

export function hasSeenFirstFlight(storage = globalThis.localStorage) {
  try {
    return storage?.getItem(FIRST_FLIGHT_KEY) === '1'
  } catch {
    return false
  }
}

export function markFirstFlightSeen(storage = globalThis.localStorage) {
  try {
    storage?.setItem(FIRST_FLIGHT_KEY, '1')
  } catch {
    // Sin almacenamiento: se volvería a mostrar en la próxima visita.
  }
}

/** Abrir solo en el inicio, para alguien sin perfil ni respuestas que no lo vio. */
export function shouldShowFirstFlight({ pathname, profile, answeredCount, seen }) {
  return pathname === '/' && !seen && !profile && !answeredCount
}
