import { useEffect, useState } from 'react'

// Modo noche del diario y de la escritura en Individual. Si la persona no eligió,
// sigue al teléfono (modo oscuro del sistema); si eligió, se recuerda su elección.
const KEY = 'emigrados:noche'
const DARK = '(prefers-color-scheme: dark)'

export function readNightChoice(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(KEY)
    return value === 'si' || value === 'no' ? value : null
  } catch {
    return null
  }
}

/** Con una elección guardada manda esa; si no, la del sistema. */
export function resolveNight(choice, systemDark) {
  return choice ? choice === 'si' : systemDark
}

export function nextNightChoice(currentlyNight, systemDark, storage = globalThis.localStorage) {
  const wantNight = !currentlyNight
  // Si lo elegido coincide con el sistema, se vuelve a seguir al sistema
  const choice = wantNight === systemDark ? null : wantNight ? 'si' : 'no'
  try {
    if (choice) storage?.setItem(KEY, choice)
    else storage?.removeItem(KEY)
  } catch {
    // Sin almacenamiento igual cambia, solo no se recuerda
  }
  return choice
}

export function useNightMode() {
  const [choice, setChoice] = useState(readNightChoice)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.(DARK).matches ?? false)

  useEffect(() => {
    const query = window.matchMedia?.(DARK)
    if (!query) return undefined
    const update = () => setSystemDark(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const night = resolveNight(choice, systemDark)
  return [night, () => setChoice(nextNightChoice(night, systemDark))]
}
