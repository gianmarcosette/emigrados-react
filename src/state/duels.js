// Duelos del modo online guardados en este dispositivo, para poder salir y volver a
// responder cuando quieras. En la versión real también viven en el servidor; acá queda
// la copia local. Sin React, para testear.

export const DUELS_KEY = 'emigrados:duelos'
// Países donde alguien pidió que abramos el modo Online
export const WAITLIST_KEY = 'emigrados:lista-de-espera'

function isDuel(d) {
  return (
    d &&
    typeof d === 'object' &&
    typeof d.id === 'string' &&
    typeof d.deadline === 'string' &&
    typeof d.rival?.name === 'string' &&
    Array.isArray(d.rounds)
  )
}

export function loadDuels(storage = globalThis.localStorage) {
  try {
    const list = JSON.parse(storage?.getItem(DUELS_KEY) ?? '[]')
    // Una pregunta sin responder no guarda `myChoice` (JSON no tiene undefined): vuelve igual
    return Array.isArray(list) ? list.filter(isDuel) : []
  } catch {
    return []
  }
}

export function saveDuels(duels, storage = globalThis.localStorage) {
  try {
    storage?.setItem(DUELS_KEY, JSON.stringify(duels))
  } catch {
    // Sin almacenamiento: los duelos duran lo que dure la visita.
  }
}

/** Reemplaza un duelo en su lugar (por id) o lo agrega primero si es nuevo. */
export function upsertDuel(duels, duel) {
  return duels.some((d) => d.id === duel.id) ? duels.map((d) => (d.id === duel.id ? duel : d)) : [duel, ...duels]
}

export function removeDuel(duels, id) {
  return duels.filter((d) => d.id !== id)
}

export function loadWaitlist(storage = globalThis.localStorage) {
  try {
    const list = JSON.parse(storage?.getItem(WAITLIST_KEY) ?? '[]')
    return Array.isArray(list) ? list.filter((c) => typeof c === 'string') : []
  } catch {
    return []
  }
}

export function joinWaitlist(code, storage = globalThis.localStorage) {
  const list = loadWaitlist(storage)
  const next = list.includes(code) ? list : [...list, code]
  try {
    storage?.setItem(WAITLIST_KEY, JSON.stringify(next))
  } catch {
    // Sin almacenamiento: no queda anotado en este dispositivo.
  }
  return next
}

/** Al borrar el perfil se borran también los duelos y la lista de espera. */
export function clearOnline(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(DUELS_KEY)
    storage?.removeItem(WAITLIST_KEY)
  } catch {
    // Nada que borrar.
  }
}
