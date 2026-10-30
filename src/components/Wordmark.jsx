import { BIRD, LETTERS, LOGO_VIEWBOX, S_BIRDS } from '../data/logo.js'

// Logotipo: EMIGRADO en letra sólida y la S hecha de pájaros, con algunos que se sueltan y se
// van volando. Toma el color del texto (currentColor); los pájaros pueden ir de otro color.
export default function Wordmark({ className = '', birds = 'currentColor' }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={`wordmark ${className}`} role="img" aria-label="Emigrados">
      <path d={LETTERS} fill="currentColor" />
      <g fill={birds}>
        {S_BIRDS.map(([x, y, rot, s], i) => (
          <path key={i} d={BIRD} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} />
        ))}
      </g>
    </svg>
  )
}
