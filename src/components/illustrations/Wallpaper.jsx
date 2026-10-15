import { useId } from 'react'
import { Passenger, WindowShape } from './Vignettes.jsx'

// Fondo de pantalla: un patrón tenue con ventanillas y dibujos de viaje.
const TILE = { w: 560, h: 480 }

const WINDOWS = [
  { name: 'sleeper', x: 30, y: 40, r: -6 },
  { name: 'reader', x: 330, y: 20, r: 5 },
  { name: 'mate', x: 190, y: 220, r: -3 },
  { name: 'shade', x: 450, y: 250, r: 7 },
  { name: 'waver', x: 40, y: 330, r: 4 },
  { name: 'headphones', x: 320, y: 380, r: -5 },
]

export default function Wallpaper() {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="wallpaper" aria-hidden="true">
      <defs>
        <pattern id={`${id}-tile`} width={TILE.w} height={TILE.h} patternUnits="userSpaceOnUse">
          {WINDOWS.map(({ name, x, y, r }, i) => (
            <g key={name} transform={`translate(${x} ${y}) rotate(${r} 35 42)`}>
              <svg width="70" height="84" viewBox="0 0 100 120" overflow="visible">
                <WindowShape id={`${id}-w${i}`}>
                  <Passenger name={name} />
                </WindowShape>
              </svg>
            </g>
          ))}
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* avioncito de papel con su estela */}
            <path d="M170 70 l40 -16 l-14 36 l-8 -12 z M188 78 l22 -24" />
            <path d="M166 76 c-20 8 -30 0 -48 10" strokeDasharray="3 6" />
            {/* nubes */}
            <path d="M440 150 c-10 0 -12 -14 -2 -16 c0 -12 18 -14 22 -4 c8 -6 20 0 16 10 c8 2 6 12 -2 12 z" />
            <path d="M120 200 c-8 0 -9 -10 -1 -12 c0 -9 14 -10 17 -3 c6 -4 15 0 12 8 c6 1 5 9 -1 9 z" />
            {/* valija */}
            <rect x="250" y="120" width="44" height="32" rx="6" />
            <path d="M264 120 v-6 h16 v6 M258 152 v4 M286 152 v4 M250 132 h44" />
            {/* corazón y estrellita */}
            <path d="M520 420 c-6 -8 -16 0 -8 8 l8 8 l8 -8 c8 -8 -2 -16 -8 -8 z" />
            <path d="M230 440 l3 8 l8 0 l-6 5 l2 8 l-7 -5 l-7 5 l2 -8 l-6 -5 l8 0 z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-tile)`} />
    </svg>
  )
}
