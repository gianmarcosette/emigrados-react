import { useId } from 'react'
import './illustrations.css'

// Ilustraciones de línea: ventanillas de avión vistas desde afuera, con pasajeros
// haciendo distintas cosas. Cada viñeta se dibuja en una caja de 100 × 120.
// Usan currentColor para el trazo, así toman el color de tinta del CSS.

const INNER = { x: 17, y: 17, w: 66, h: 86, r: 20 }

export function WindowVignette({ name, animated = false, className = '' }) {
  const id = useId().replace(/:/g, '')
  const Person = PEOPLE[name] ?? PEOPLE.sleeper
  return (
    <svg
      viewBox="0 0 100 120"
      className={`vignette ${animated ? 'vignette--animated' : ''} ${className}`}
      aria-hidden="true"
    >
      <WindowShape id={id}>
        <Person />
      </WindowShape>
    </svg>
  )
}

// Marco + recorte; se usa también dentro del patrón de fondo.
export function WindowShape({ id, children }) {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={INNER.r} />
        </clipPath>
      </defs>
      <rect x="7" y="7" width="86" height="106" rx="28" strokeWidth="3.6" className="vg-paper" />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} className="vg-sky" stroke="none" />
        {children}
        {/* Cortina enrollada arriba, como en las ventanillas reales */}
        <path d="M17 17 H83 V27 C70 23 30 23 17 27 Z" fill="currentColor" stroke="none" />
      </g>
      <rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} rx={INNER.r} strokeWidth="2.2" />
    </g>
  )
}

/* ───────── Pasajeros ───────── */

function Sleeper() {
  return (
    <g strokeWidth="2.4">
      <path d="M16 106 C20 90 34 84 48 86 C62 84 76 90 84 106" className="vg-paper" />
      <g transform="rotate(-16 46 62)">
        <ellipse cx="46" cy="62" rx="14" ry="17" className="vg-paper" />
        <path d="M32 60 C30 44 44 38 58 46 C52 46 44 49 40 58 Z" fill="currentColor" />
        <path d="M39 64 q3 2.5 6 0" />
        <path d="M49 64 q3 2.5 6 0" />
        <circle cx="48" cy="72" r="1.6" fill="currentColor" stroke="none" />
      </g>
      <path d="M30 80 C32 94 60 96 64 80" strokeWidth="6.5" />
      <g className="vg-z" strokeWidth="2">
        <path d="M64 44 h7 l-7 7 h7" />
        <path d="M72 34 h5 l-5 5 h5" />
      </g>
    </g>
  )
}

function Reader() {
  return (
    <g strokeWidth="2.4">
      <path d="M36 44 C38 33 62 33 64 44" fill="currentColor" />
      <g className="vg-paper-shake">
        <path d="M21 42 L50 46 L79 42 L79 104 L50 108 L21 104 Z" className="vg-paper" />
        <path d="M50 46 V108" strokeWidth="1.6" />
        <text x="35.5" y="56" className="vg-headline" textAnchor="middle" stroke="none" fill="currentColor">
          MUNDO
        </text>
        <rect x="26" y="61" width="19" height="14" fill="currentColor" stroke="none" />
        {[80, 85, 90, 95].map((y) => (
          <path key={y} d={`M26 ${y} H45`} strokeWidth="1.4" />
        ))}
        {[52, 57, 62, 67, 72, 77, 82, 87, 92].map((y, i) => (
          <path key={y} d={`M55 ${y} H${i % 3 === 2 ? 66 : 74}`} strokeWidth="1.4" />
        ))}
      </g>
      <ellipse cx="20" cy="74" rx="5" ry="7" className="vg-paper" />
      <ellipse cx="80" cy="74" rx="5" ry="7" className="vg-paper" />
    </g>
  )
}

function MateDrinker() {
  return (
    <g strokeWidth="2.4">
      <path d="M12 106 C16 90 28 85 40 86 C52 86 60 92 64 106" className="vg-paper" />
      {/* Cara de perfil mirando a la derecha */}
      <path d="M28 58 C28 46 36 40 46 40 C56 40 62 48 62 56 L66 62 L61 64 C61 72 56 78 46 78 C36 78 28 70 28 58 Z" className="vg-paper" />
      <path d="M27 60 C24 44 34 34 47 35 C56 36 62 42 62 48 C54 44 44 46 38 58 C36 54 31 56 27 60 Z" fill="currentColor" />
      <circle cx="52" cy="54" r="1.6" fill="currentColor" stroke="none" />
      {/* Mate con bombilla, a la altura de la boca */}
      <path d="M58 68 L66 76" strokeWidth="2" />
      <path d="M60 76 H77 C78 86 75 96 68.5 96 C62 96 59 86 60 76 Z" fill="currentColor" />
      <path d="M58 90 C54 98 66 104 72 98" className="vg-paper" />
      <g className="vg-steam" strokeWidth="1.8">
        <path d="M66 70 c-2 -3 2 -5 0 -8" />
        <path d="M72 70 c-2 -3 2 -5 0 -8" />
      </g>
    </g>
  )
}

function ShadeDown() {
  return (
    <g strokeWidth="2.4">
      <g className="vg-shade">
        <rect x="17" y="10" width="66" height="74" fill="currentColor" stroke="none" />
        <path d="M44 84 h12" stroke="var(--paper, #f3efe8)" strokeWidth="2" />
      </g>
      <g className="vg-shade">
        <path d="M40 104 C40 96 42 90 44 86 C45 83 49 83 49 86 L49 90 C49 86 53 85 54 88 L54 92 C55 89 59 89 59 92 L58 104 Z" className="vg-paper" />
      </g>
    </g>
  )
}

function Waver() {
  return (
    <g strokeWidth="2.4">
      <path d="M18 106 C22 92 34 86 46 88 C58 86 70 92 74 106" className="vg-paper" />
      <path d="M33 64 C33 50 40 44 47 44 C55 44 61 50 61 64 C61 74 55 80 47 80 C39 80 33 74 33 64 Z" className="vg-paper" />
      <path d="M31 70 C26 52 34 38 47 38 C61 38 68 52 63 70 C62 62 60 56 56 52 C50 56 40 56 36 52 C33 56 32 62 31 70 Z" fill="currentColor" />
      <circle cx="42" cy="64" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="52" cy="64" r="1.6" fill="currentColor" stroke="none" />
      <path d="M42 71 q5 4 10 0" />
      <g className="vg-wave">
        <path d="M66 104 L70 76" />
        <path d="M64 74 C62 64 64 58 66 58 C68 58 68 62 68 66 L68 56 C68 53 72 53 72 56 L72 65 L72 55 C72 52 76 52 76 55 L76 66 L77 59 C77 56 81 57 80 60 L79 74 C78 80 66 82 64 74 Z" className="vg-paper" />
      </g>
    </g>
  )
}

function Writer() {
  return (
    <g strokeWidth="2.4">
      <path d="M16 106 C18 94 30 88 50 88 C70 88 82 94 84 106" className="vg-paper" />
      <path d="M32 58 C32 46 42 40 50 40 C60 40 68 46 68 58 C68 70 60 76 50 76 C40 76 32 70 32 58 Z" fill="currentColor" />
      <circle cx="50" cy="36" r="6" fill="currentColor" />
      <path d="M38 70 C42 76 58 76 62 70" className="vg-paper" />
      <path d="M26 92 L50 86 L74 92 L74 104 L26 104 Z" className="vg-paper" />
      <path d="M50 86 V104" strokeWidth="1.6" />
      <path d="M31 96 L45 93 M31 100 L45 97 M55 93 L68 96" strokeWidth="1.3" />
      <g className="vg-pen">
        <path d="M62 98 L72 84" strokeWidth="2.6" />
        <ellipse cx="73" cy="83" rx="5" ry="4" className="vg-paper" />
      </g>
    </g>
  )
}

function Headphones() {
  return (
    <g strokeWidth="2.4">
      <g className="vg-bob">
        <path d="M14 106 C18 92 32 86 50 86 C68 86 82 92 86 106" className="vg-paper" />
        <path d="M32 60 C32 46 40 40 50 40 C60 40 68 46 68 60 C68 72 60 80 50 80 C40 80 32 72 32 60 Z" fill="currentColor" />
        <path d="M30 60 C30 34 70 34 70 60" strokeWidth="3.2" />
        <rect x="25" y="55" width="9" height="15" rx="4" className="vg-paper" />
        <rect x="66" y="55" width="9" height="15" rx="4" className="vg-paper" />
      </g>
      <g className="vg-notes" strokeWidth="1.8">
        <path d="M74 40 v-8 l5 -2 v8" />
        <circle cx="73" cy="40" r="1.8" fill="currentColor" />
        <circle cx="78" cy="38" r="1.8" fill="currentColor" />
      </g>
    </g>
  )
}

function Kid() {
  return (
    <g strokeWidth="2.4">
      <path d="M22 106 C24 94 34 90 50 90 C66 90 76 94 78 106" className="vg-paper" />
      <circle cx="50" cy="66" r="17" className="vg-paper" />
      <path d="M34 60 C34 46 44 44 50 50 C56 44 66 46 66 60 C60 54 54 54 50 56 C46 54 40 54 34 60 Z" fill="currentColor" />
      <circle cx="44" cy="66" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="56" cy="66" r="2.2" fill="currentColor" stroke="none" />
      <ellipse cx="50" cy="73" rx="4" ry="3" className="vg-paper" />
      <g className="vg-press" transform="translate(-1 20)">
        <path d="M20 58 C18 50 20 44 24 44 L24 40 C24 36 28 36 28 40 L28 38 C28 34 32 34 32 38 L32 46 C34 46 35 50 33 54 C32 60 22 62 20 58 Z" className="vg-paper" />
        <path d="M80 58 C82 50 80 44 76 44 L76 40 C76 36 72 36 72 40 L72 38 C72 34 68 34 68 38 L68 46 C66 46 65 50 67 54 C68 60 78 62 80 58 Z" className="vg-paper" />
      </g>
    </g>
  )
}

const PEOPLE = {
  sleeper: Sleeper,
  reader: Reader,
  mate: MateDrinker,
  shade: ShadeDown,
  waver: Waver,
  writer: Writer,
  headphones: Headphones,
  kid: Kid,
}


// Solo el pasajero (sin marco), para armar composiciones propias.
export function Passenger({ name }) {
  const Person = PEOPLE[name] ?? PEOPLE.sleeper
  return <Person />
}
