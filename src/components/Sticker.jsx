import { countryShape } from '../lib/countryShapes.js'

// Pegatina de un país para la maleta. Cuatro formas (círculo, etiqueta de equipaje,
// escudo y óvalo) con la silueta real del país, en la paleta del juego. Completa (todas
// las preguntas respondidas) pasa al degradé de atardecer.
// Se dibuja centrada en 0,0; quien la usa la ubica con un transform.
export default function Sticker({ country, kind, complete = false, gradientId }) {
  const d = countryShape(country.id)
  const upper = country.name.toUpperCase()
  const sunset = gradientId ? `url(#${gradientId})` : undefined
  const shape = (scale, x, y, className = 'sticker__shape') =>
    d && (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <path d={d} className={className} style={{ strokeWidth: 2.4 / scale }} />
      </g>
    )

  if (kind === 'label') {
    return (
      <g className="sticker">
        <rect
          x="-38"
          y="-26"
          width="76"
          height="52"
          rx="6"
          className="sticker__paper"
          style={complete ? { fill: sunset } : undefined}
        />
        <path d="M-32 -26 H32 A6 6 0 0 1 38 -20 V-13 H-38 V-20 A6 6 0 0 1 -32 -26 Z" className="sticker__band" />
        <text y="-16.5" textAnchor="middle" className="sticker__brand">
          EMIGRADOS
        </text>
        {shape(0.27, -34, -10)}
        <text
          x="10"
          y="8"
          textAnchor="middle"
          className="sticker__serif"
          style={{ fontSize: Math.min(13, 100 / country.name.length) }}
        >
          {country.name}
        </text>
      </g>
    )
  }
  if (kind === 'shield') {
    return (
      <g className={`sticker ${complete ? '' : 'sticker--dark'}`}>
        <path
          d="M-30 -32 H30 V4 C30 22 12 30 0 36 C-12 30 -30 22 -30 4 Z"
          className="sticker__ink"
          style={complete ? { fill: sunset } : undefined}
        />
        {shape(0.32, -16, -26, 'sticker__shape sticker__shape--light')}
        <text
          y="20"
          textAnchor="middle"
          className="sticker__caps sticker__caps--light"
          style={{ fontSize: Math.min(7, 64 / upper.length) }}
        >
          {upper}
        </text>
      </g>
    )
  }
  if (kind === 'oval') {
    return (
      <g className="sticker">
        <ellipse rx="42" ry="28" className="sticker__soft" style={complete ? { fill: sunset } : undefined} />
        {shape(0.3, -38, -15)}
        <text
          x="12"
          y="-1"
          textAnchor="middle"
          className="sticker__serif sticker__serif--italic"
          style={{ fontSize: Math.min(14, 90 / country.name.length) }}
        >
          {country.name}
        </text>
        <text x="12" y="11" textAnchor="middle" className="sticker__brand sticker__brand--ink">
          VÍA EMIGRADOS
        </text>
      </g>
    )
  }
  return (
    <g className="sticker">
      <circle r="34" className="sticker__yellow" style={complete ? { fill: sunset } : undefined} />
      <circle r="28" className="sticker__dots" />
      {shape(0.36, -18, -24)}
      <text y="21" textAnchor="middle" className="sticker__caps" style={{ fontSize: Math.min(7.5, 70 / upper.length) }}>
        {upper}
      </text>
    </g>
  )
}

// Degradé de atardecer para las pegatinas completas (una vez por SVG)
export function SunsetGradient({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffd301" />
      <stop offset="0.55" stopColor="#f9a910" />
      <stop offset="1" stopColor="#f37c1e" />
    </linearGradient>
  )
}
