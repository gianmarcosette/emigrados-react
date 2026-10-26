import { createContext, useContext } from 'react'

// Confirmación para acciones que no se pueden deshacer (borrar, bloquear, abandonar).
// Uso: const confirm = useConfirm(); if (await confirm({ title, message, confirmLabel })) { … }
// Sin proveedor (por ejemplo en tests) cae en la confirmación del navegador.
export const ConfirmContext = createContext((options) => Promise.resolve(window.confirm(options.title)))

export function useConfirm() {
  return useContext(ConfirmContext)
}
