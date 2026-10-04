import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORY_BY_KEY } from '../data/questions.js'
import CountryStamp from './CountryStamp.jsx'

// La pregunta se presenta como una tarjeta de embarque: cada pregunta es una escala.
export default function QuestionCard({ question, eyebrow, children }) {
  const country = COUNTRY_BY_ID[question.countryId]
  const category = CATEGORY_BY_KEY[question.category]
  return (
    <article className="ticket" style={{ '--cat': category.color }}>
      <div className="ticket__main">
        <div className="ticket__meta">
          <span className="chip" style={{ background: category.color }}>
            {category.label}
          </span>
          <span className="ticket__number">{eyebrow ?? `Pregunta N.º ${question.id}`}</span>
        </div>
        <h1 className="ticket__question">{question.text}</h1>
        {children}
      </div>
      <aside className="ticket__stub">
        <span className="ticket__label">Escala</span>
        <CountryStamp country={country} />
      </aside>
    </article>
  )
}
