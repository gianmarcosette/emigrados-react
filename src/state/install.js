// Instalar el juego en el celular. En Android el navegador avisa cuando se puede y hay que
// guardar ese aviso para usarlo después; en iPhone no hay aviso: se instala desde "Compartir".
import { useSyncExternalStore } from 'react'

export const INSTALL_KEY = 'emigrados:instalar'

/** Qué mostrar en el inicio: el botón ('prompt'), los pasos para iPhone ('ios') o nada. */
export function installMode({ standalone, ios, canPrompt, dismissed }) {
  if (standalone || dismissed) return null
  if (canPrompt) return 'prompt'
  return ios ? 'ios' : null
}

let deferred = null
let mode = null
const listeners = new Set()

function readDismissed() {
  try {
    return localStorage.getItem(INSTALL_KEY) === 'no'
  } catch {
    return false
  }
}

function refresh() {
  const next = installMode({
    standalone: window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true,
    ios: /iPhone|iPad|iPod/.test(navigator.userAgent),
    canPrompt: deferred !== null,
    dismissed: readDismissed(),
  })
  if (next === mode) return
  mode = next
  for (const listener of listeners) listener()
}

/** Se llama una vez al abrir el juego, antes de dibujar. */
export function watchInstall() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferred = event
    refresh()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    refresh()
  })
  refresh()
}

export async function promptInstall() {
  if (!deferred) return
  const event = deferred
  deferred = null
  await event.prompt()
  refresh()
}

export function dismissInstall() {
  try {
    localStorage.setItem(INSTALL_KEY, 'no')
  } catch {
    // Sin lugar para guardarlo, vuelve a aparecer la próxima vez
  }
  deferred = null
  refresh()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useInstallMode() {
  return useSyncExternalStore(
    subscribe,
    () => mode,
    () => null,
  )
}
