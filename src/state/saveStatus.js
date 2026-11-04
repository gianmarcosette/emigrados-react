// Si lo último se pudo guardar en el dispositivo. Lo actualiza JourneyContext después de cada
// guardado y lo lee el aviso de Layout (useSaveFailed).
import { useSyncExternalStore } from 'react'

let failed = false
const listeners = new Set()

export function setSaveFailed(value) {
  if (failed === value) return
  failed = value
  for (const listener of listeners) listener()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSaveFailed() {
  return useSyncExternalStore(
    subscribe,
    () => failed,
    () => false,
  )
}
