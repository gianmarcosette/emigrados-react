import { SHAPE_SIZE, countryShape } from '../lib/countryShapes.js'

// Contorno del país, en tinta, sin relleno.
// Con `decorative` no se anuncia (cuando el nombre del país ya está escrito al lado).
export default function CountryShape({ country, className = '', decorative = false }) {
  const d = countryShape(country.id)
  if (!d) return null
  return (
    <svg
      className={`country-shape ${className}`}
      viewBox={`0 0 ${SHAPE_SIZE} ${SHAPE_SIZE}`}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `Mapa de ${country.name}` })}
    >
      <path d={d} />
    </svg>
  )
}
