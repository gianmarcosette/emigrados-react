import { useId } from 'react'
import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORY_BY_KEY } from '../data/questions.js'
import { barcodeBars, flightCode, gateFor, seatFor, stageColor } from '../lib/ticket.js'
import Avatar from './Avatar.jsx'
import { Bird, HeartBird } from './paper.jsx'
import CountryPoster from './posters.jsx'
import Title from './Title.jsx'
import Wordmark from './Wordmark.jsx'

// La pregunta se presenta como una tarjeta de embarque: cada pregunta es un vuelo de tu casa
// a la escala de un país. La pregunta va sobre el papel de color de su etapa; en el talón
// van el pasajero, el código de barras y el afiche del país.
export default function QuestionCard({
  question,
  eyebrow,
  passenger,
  passengerCode,
  passengerProfile,
  className = '',
  children,
}) {
  const uid = useId().replace(/:/g, '')
  const country = COUNTRY_BY_ID[question.countryId]
  const category = CATEGORY_BY_KEY[question.category]
  const flight = flightCode(question.id)

  return (
    <article className={`ticket ${className}`}>
      <header className="ticket__band">
        <span className="ticket__brand">
          <HeartBird className="ticket__heart" />
          <Wordmark compact className="ticket__word" />
        </span>
        <span className="ticket__flight">{eyebrow ?? `Vuelo ${flight}`}</span>
      </header>

      <div className="ticket__main">
        <div className="ticket__route">
          <span>
            <small>Desde</small>
            <b>Tu casa</b>
          </span>
          <RouteLine />
          <span className="ticket__to">
            <small>Escala</small>
            <b>{country.name}</b>
          </span>
        </div>

        <div className="ticket__q" style={{ '--stage': stageColor(question.category) }}>
          <small>Etapa · {category.label}</small>
          <Title className="ticket__question">{question.text}</Title>
        </div>

        <dl className="ticket__fields">
          <div>
            <dt>Puerta</dt>
            <dd>{gateFor(question.category)}</dd>
          </div>
          <div>
            <dt>Asiento</dt>
            <dd>{seatFor(question.id)}</dd>
          </div>
          <div>
            <dt>Vuelo</dt>
            <dd>{flight}</dd>
          </div>
        </dl>
        {children}
      </div>

      <aside className="ticket__stub">
        <div className="ticket__passenger">
          {/* Tu avatar de recorte (o tu foto) en el talón */}
          {(passengerProfile?.avatar || passengerProfile?.photo) && <Avatar profile={passengerProfile} size="md" />}
          <span>
            <small>Pasajero</small>
            <strong>{passenger || 'Invitado'}</strong>
            {passengerCode && <em className="ticket__code">{passengerCode}</em>}
          </span>
        </div>
        {/* El afiche del país: el mismo que se pega en la maleta */}
        <svg viewBox="-33 -43 66 86" className="ticket__poster" role="img" aria-label={`Escala: ${country.name}`}>
          <CountryPoster countryId={country.id} uid={`${uid}-afiche`} complete fallback={null} />
        </svg>
        <Barcode seed={question.id} label={flight} />
      </aside>
    </article>
  )
}

// Ruta punteada de tu casa a la escala, con un pájaro de papel en el medio
function RouteLine() {
  return (
    <svg viewBox="0 0 300 54" className="ticket__line" aria-hidden="true">
      <path d="M12 44 C80 4 220 4 288 44" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
      <circle cx="12" cy="44" r="5" className="ticket__dot" />
      <circle cx="288" cy="44" r="5" className="ticket__ring" />
      <Bird x={170} y={14} s={0.38} fill="#e8664a" rot={8} />
    </svg>
  )
}

// Código de barras decorativo, siempre igual para la misma pregunta.
function Barcode({ seed, label }) {
  const bars = barcodeBars(seed)
  return (
    <div className="ticket__barcode">
      <svg viewBox="0 0 116 36" preserveAspectRatio="none" aria-hidden="true">
        {bars.map(({ x, w }) => (
          <rect key={x} x={x} y="0" width={w} height="36" />
        ))}
      </svg>
      <span>{label}</span>
    </div>
  )
}
