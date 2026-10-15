import { createContext, useContext, useEffect } from 'react'

// Cada pantalla le dice al Layout qué se ve por la ventanilla.
export const SceneContext = createContext(() => {})

export function useWindowScene(scene) {
  const setScene = useContext(SceneContext)
  useEffect(() => {
    setScene(scene)
  }, [scene, setScene])
}
