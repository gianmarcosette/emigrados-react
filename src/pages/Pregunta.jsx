import { Link, useParams, useSearchParams } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard.jsx'
import Title from '../components/Title.jsx'
import { QUESTION_BY_ID } from '../data/questions.js'
import { countryName } from '../data/residence.js'
import { readAsk, replyMessage, whatsappUrl } from '../lib/ask.js'
import NotFound from './NotFound.jsx'

// Lo que ve quien recibe "Preguntale a alguien de allá": la pregunta en la tarjeta de
// embarque y la invitación a contestarle a quien se la mandó. No hace falta perfil ni jugar.
export default function Pregunta() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const question = QUESTION_BY_ID[Number(id)]
  if (!question) return <NotFound />

  const { name, country } = readAsk(params)
  const from = name || 'Alguien'
  const where = country ? `, desde ${countryName(country)},` : ''

  return (
    <div className="page page--narrow ask-page">
      <header className="ask-page__head">
        <p className="ask-page__eyebrow">Una pregunta para vos</p>
        <Title>
          {from}
          {where} quiere hablar de esta pregunta con vos
        </Title>
      </header>

      <QuestionCard question={question} eyebrow={name ? `De ${name}` : undefined} passenger="Vos" />

      <section className="panel ask-page__reply">
        <p>
          No hace falta que la contestes acá: respondele directo a {name || 'quien te la mandó'}. No hay respuestas
          correctas, y lo que te pase con esta pregunta también vale.
        </p>
        <div className="actions">
          <a
            className="btn btn--whatsapp"
            href={whatsappUrl(replyMessage({ question: question.text }))}
            target="_blank"
            rel="noreferrer"
          >
            Responderle por WhatsApp
          </a>
          <Link to="/" className="btn btn--ghost">
            ¿Emigraste vos también? Conocé Emigrados
          </Link>
        </div>
      </section>
    </div>
  )
}
