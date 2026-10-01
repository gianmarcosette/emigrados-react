import { createContext, useContext } from 'react'

export const JourneyContext = createContext(null)

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney debe usarse dentro de <JourneyProvider>')
  return ctx
}
