import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { QUESTIONS, QUESTION_BY_ID } from '../data/questions.js'
import { journeyReducer, loadJourney, saveJourney } from './journey.js'

const JourneyContext = createContext(null)

export function JourneyProvider({ children }) {
  const [state, dispatch] = useReducer(journeyReducer, undefined, () => loadJourney())

  useEffect(() => {
    saveJourney(state)
  }, [state])

  const value = useMemo(() => {
    const answeredIds = state.route.filter((id) => state.answers[id]?.length && QUESTION_BY_ID[id])
    const visited = new Set(answeredIds.map((id) => QUESTION_BY_ID[id].countryId))
    return {
      ...state,
      dispatch,
      answeredCount: answeredIds.length,
      totalQuestions: QUESTIONS.length,
      visitedCountries: [...visited].map((id) => COUNTRY_BY_ID[id]),
      routeCountries: answeredIds.map((id) => COUNTRY_BY_ID[QUESTION_BY_ID[id].countryId]),
    }
  }, [state])

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney debe usarse dentro de <JourneyProvider>')
  return ctx
}
