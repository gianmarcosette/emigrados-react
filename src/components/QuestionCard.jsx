import { COUNTRY_BY_ID } from '../data/countries.js'
import { CATEGORY_BY_KEY } from '../data/questions.js'
import { barcodeBars, flightCode, gateFor, seatFor } from '../lib/ticket.js'
import Avatar from './Avatar.jsx'
import CountryStamp from './CountryStamp.jsx'
import Title from './Title.jsx'

// La pregunta se presenta como una tarjeta de embarque: cada pregunta es un vuelo
// con destino a un país. El talón lleva el pasajero, el sello y un código de barras.
export default function QuestionCard({
  question,
  eyebrow,
  passenger,
  passengerCode,
  passengerProfile,
  className = '',
  children,
}) {
  const country = COUNTRY_BY_ID[question.countryId]
  const category = CATEGORY_BY_KEY[question.category]
  const flight = flightCode(question.id)
  const gate = gateFor(question.category)

  return (
    <article className={`ticket ${className}`}>
      <div className="ticket__main">
        <header className="ticket__head">
          <span>Tarjeta de embarque</span>
          <span className="ticket__flight">
            <PlaneIcon />
            {eyebrow ?? `Vuelo ${flight}`}
          </span>
        </header>

        <dl className="ticket__fields">
          <div>
            <dt>Etapa</dt>
            <dd>{category.label}</dd>
          </div>
          <div>
            <dt>Puerta</dt>
            <dd>{gate}</dd>
          </div>
          <div>
            <dt>Asiento</dt>
            <dd>{seatFor(question.id)}</dd>
          </div>
        </dl>

        <Title className="ticket__question">{question.text}</Title>
        {children}
      </div>

      <aside className="ticket__stub">
        <div className="ticket__passenger">
          {/* Tu pasajero dibujado (o tu foto) en el talón */}
          {(passengerProfile?.avatar || passengerProfile?.photo) && <Avatar profile={passengerProfile} size="md" />}
          <span>Pasajero</span>
          <strong>{passenger || 'Invitado'}</strong>
          {passengerCode && <em className="ticket__code">{passengerCode}</em>}
        </div>
        <CountryStamp country={country} shape="below" />
        <Barcode seed={question.id} label={flight} />
      </aside>
    </article>
  )
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ticket__plane" aria-hidden="true">
      <path d="M2 13l8-1 5-8h3l-3 8 5 .5 2-2.5h2l-1.5 4 1.5 4h-2l-2-2.5-5 .5 3 8h-3l-5-8-8-1z" />
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
