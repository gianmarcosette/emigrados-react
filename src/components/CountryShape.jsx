import { SHAPE_SIZE, countryShape } from '../lib/countryShapes.js'

// Contorno del país, en tinta, sin relleno.
export default function CountryShape({ country, className = '' }) {
  const d = countryShape(country.id)
  if (!d) return null
  return (
    <svg className={`country-shape ${className}`} viewBox={`0 0 ${SHAPE_SIZE} ${SHAPE_SIZE}`} role="img" aria-label={`Mapa de ${country.name}`}>
      <path d={d} />
    </svg>
  )
}
