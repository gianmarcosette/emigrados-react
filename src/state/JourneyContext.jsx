import { useEffect, useMemo, useReducer } from 'react'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { QUESTIONS, QUESTION_BY_ID } from '../data/questions.js'
import { journeyReducer, loadJourney, saveJourney } from './journey.js'
import { JourneyContext } from './useJourney.js'

export function JourneyProvider({ children }) {
  const [state, dispatch] = useReducer(journeyReducer, undefined, () => loadJourney())

  useEffect(() => {
    saveJourney(state)
  }, [state])

  const value = useMemo(() => {
    const answeredIds = state.route.filter((id) => state.answers[id]?.length && QUESTION_BY_ID[id])
    const perCountry = new Map()
    for (const id of answeredIds) {
      const countryId = QUESTION_BY_ID[id].countryId
      perCountry.set(countryId, (perCountry.get(countryId) ?? 0) + 1)
    }
    return {
      ...state,
      dispatch,
      answeredCount: answeredIds.length,
      totalQuestions: QUESTIONS.length,
      // Un marcador por país visitado, con cuántas preguntas se respondieron ahí
      pins: [...perCountry].map(([id, count]) => ({ country: COUNTRY_BY_ID[id], count })),
      routeCountries: answeredIds.map((id) => COUNTRY_BY_ID[QUESTION_BY_ID[id].countryId]),
    }
  }, [state])

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}
