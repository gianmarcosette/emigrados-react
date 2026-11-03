// Tu maleta a tu manera: el color que elegiste y dónde pegaste cada afiche. Se guarda en este
// dispositivo, aparte de las respuestas. Los afiches que nunca moviste se acomodan solos.
import { useCallback, useEffect, useState } from 'react'

export const SUITCASE_KEY = 'emigrados:maleta'
const CHANGED = 'emigrados:maleta-cambio'

// Los colores posibles, dentro de la paleta del juego: cuerpo, correas (y costura) y manija (y hebillas)
export const SUITCASE_COLORS = [
  { id: 'noche', label: 'Azul noche', body: '#1f2f5c', strap: '#ffd23f', handle: '#e8664a' },
  { id: 'coral', label: 'Coral', body: '#e8664a', strap: '#f3ede0', handle: '#1f2f5c' },
  { id: 'verde', label: 'Verde', body: '#3f7d5a', strap: '#ffd23f', handle: '#e8664a' },
  { id: 'amarillo', label: 'Amarillo', body: '#ffd23f', strap: '#1f2f5c', handle: '#e8664a' },
  { id: 'durazno', label: 'Durazno', body: '#f6b48f', strap: '#1f2f5c', handle: '#3f7d5a' },
  { id: 'crema', label: 'Crema', body: '#f3ede0', strap: '#e8664a', handle: '#1f2f5c' },
]

export const DEFAULT_SUITCASE = { color: 'noche', places: {} }

export function suitcaseColor(id) {
  return SUITCASE_COLORS.find((c) => c.id === id) ?? SUITCASE_COLORS[0]
}

const isPlace = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.rotate)

/** { color, places: { [countryId]: { x, y, rotate } } }, con lo desconocido descartado. */
export function loadSuitcase(storage = globalThis.localStorage) {
  try {
    const data = JSON.parse(storage?.getItem(SUITCASE_KEY) ?? 'null')
    if (!data || typeof data !== 'object') return DEFAULT_SUITCASE
    const color = SUITCASE_COLORS.some((c) => c.id === data.color) ? data.color : DEFAULT_SUITCASE.color
    const places = Object.fromEntries(
      Object.entries(data.places && typeof data.places === 'object' ? data.places : {}).filter(([, p]) => isPlace(p)),
    )
    return { color, places }
  } catch {
    return DEFAULT_SUITCASE
  }
}

export function saveSuitcase(look, storage = globalThis.localStorage) {
  try {
    storage?.setItem(SUITCASE_KEY, JSON.stringify(look))
  } catch {
    // Sin almacenamiento: la maleta vuelve a acomodarse sola la próxima vez.
  }
  globalThis.dispatchEvent?.(new Event(CHANGED))
}

/** Al borrar el perfil la maleta vuelve a ser la de siempre. */
export function clearSuitcase(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(SUITCASE_KEY)
  } catch {
    // Nada que borrar.
  }
  globalThis.dispatchEvent?.(new Event(CHANGED))
}

/** La maleta guardada, al día en todas las pantallas (la barra de abajo también la muestra). */
export function useSuitcaseLook() {
  const [look, setLook] = useState(loadSuitcase)
  useEffect(() => {
    const sync = () => setLook(loadSuitcase())
    window.addEventListener(CHANGED, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGED, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  const update = useCallback((next) => {
    setLook(next)
    saveSuitcase(next)
  }, [])
  return [look, update]
}
