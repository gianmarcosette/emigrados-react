import { useId } from 'react'
import { DEFAULT_AVATAR, colorOf, normalizeAvatar } from '../lib/avatar.js'

// Tu pasajero en el vuelo: un busto de línea, como los pasajeros de las ventanillas
// del juego, dentro de una ventanilla redonda. Se dibuja en una caja de 120 × 120 y
// se arma por capas: escena, cuerpo, pelo de atrás, cara, pelo de adelante y objetos.

const INK = '#161616'
const PAPER = '#fbf9f5'
const SAND = '#e9e2d3'
const YELLOW = '#ffd700'
const STROKE = { stroke: INK, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

export default function PassengerAvatar({ avatar, size = 120, label = 'Avatar', decorative = false, className = '' }) {
  const a = normalizeAvatar(avatar) ?? DEFAULT_AVATAR
  const id = useId().replace(/:/g, '')
  const skin = colorOf('skin', a.skin)
  const hair = colorOf('hairColor', a.hairColor)
  const shirt = colorOf('shirt', a.shirt)
  const covered = a.headwear === 'panuelo'

  return (
    <svg
      viewBox="0 0 120 120"
      width={size ?? undefined}
      height={size ?? undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={`passenger-avatar ${className}`}
    >
      <defs>
        <clipPath id={`${id}-win`}>
          <circle cx="60" cy="60" r="56" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-win)`} fill="none" {...STROKE}>
        <Scene scene={a.scene} />
        {a.item === 'mochila' && <BackpackBack />}
        {/* Cuerpo y cuello */}
        <path d="M14 124 C16 100 36 88 60 88 C84 88 104 100 106 124 Z" fill={shirt} />
        <path d="M51 74 L51 90 C55 94 65 94 69 90 L69 74" fill={skin} />
        {covered && <ScarfBack color={headwearColor(a)} />}
        {!covered && <HairBack style={a.hair} color={hair} />}
        {!covered && (
          <>
            <ellipse cx="41" cy="60" rx="4.5" ry="6" fill={skin} />
            <ellipse cx="79" cy="60" rx="4.5" ry="6" fill={skin} />
          </>
        )}
        {/* Cara */}
        <ellipse cx="60" cy="58" rx="18.5" ry="21.5" fill={skin} />
        {covered && <ScarfFront color={headwearColor(a)} />}
        {!covered && <HairFront style={a.hair} color={hair} />}
        <FacialHair style={a.facialHair} color={hair} />
        <Face expression={a.expression} />
        <Glasses style={a.glasses} />
        {a.headwear === 'gorro' && <WoolHat />}
        {a.headwear === 'gorra' && <Cap />}
        <Item item={a.item} skin={skin} />
      </g>
      <circle cx="60" cy="60" r="56" fill="none" stroke={INK} strokeWidth="4" />
    </svg>
  )
}

function headwearColor(a) {
  // El pañuelo toma el color de la remera para que el conjunto combine
  return a.shirt === 'papel' ? '#ddd0b6' : colorOf('shirt', a.shirt)
}

/* ───────── Escena de la ventanilla ───────── */

function Scene({ scene }) {
  if (scene === 'noche') {
    return (
      <g>
        {/* Gris cálido muy oscuro (no negro), para que el pelo y la gorra se distingan */}
        <rect x="0" y="0" width="120" height="120" fill="#46423d" stroke="none" />
        <path d="M86 20 a9 9 0 1 0 8 13 a7 7 0 1 1 -8 -13 Z" fill={YELLOW} stroke="none" />
        {[
          [22, 26],
          [36, 14],
          [100, 50],
          [16, 48],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill={PAPER} stroke="none" />
        ))}
      </g>
    )
  }
  return (
    <g>
      <rect x="0" y="0" width="120" height="120" fill="#fdfcfa" stroke="none" />
      {scene === 'nubes' && (
        <g strokeWidth="1.8" fill={PAPER}>
          <path d="M10 40 c0 -6 8 -8 11 -4 c2 -7 13 -7 14 1 c6 0 7 7 1 8 h-24 c-3 0 -4 -4 -2 -5 Z" />
          <path d="M84 26 c0 -5 7 -6 9 -3 c2 -6 11 -5 11 1 c5 0 5 6 1 6 h-19 c-3 0 -3 -3 -2 -4 Z" />
        </g>
      )}
      {scene === 'mar' && (
        <g strokeWidth="1.8">
          <path d="M0 44 H120" />
          <path d="M10 54 q4 -3 8 0 M86 52 q4 -3 8 0 M30 64 q4 -3 8 0 M98 66 q4 -3 8 0" />
        </g>
      )}
      {scene === 'montanas' && (
        <g strokeWidth="1.8">
          <path d="M-4 66 L16 38 L28 52 L42 30 L56 50 L72 28 L88 48 L102 34 L124 62 V120 H-4 Z" fill={SAND} />
          <path d="M10 46 L16 38 L21 45 M37 37 L42 30 L47 37 M98 39 L102 34 L107 40" fill={PAPER} />
        </g>
      )}
      {scene === 'ciudad' && (
        <g strokeWidth="1.8">
          <path d="M-2 74 V48 H12 V40 H26 V58 H36 V74 Z" fill={SAND} />
          <path d="M84 74 V54 H94 V36 H108 V50 H122 V74 Z" fill={SAND} />
          <path
            d="M4 54 h4 M4 62 h4 M17 47 h4 M17 55 h4 M17 63 h4 M99 43 h4 M99 51 h4 M99 59 h4 M89 61 h3 M112 57 h4 M112 65 h4"
            strokeWidth="2.2"
          />
          <circle cx="62" cy="18" r="7" fill={YELLOW} />
        </g>
      )}
      {scene === 'ala' && (
        <g strokeWidth="1.8">
          {/* La vista desde el asiento de la ventanilla: el ala, con la punta levantada, y nubes abajo */}
          <path d="M2 50 c5 -4 10 -4 14 0" />
          <path d="M-8 84 L24 60 L33 61 L-8 104 Z" fill={SAND} strokeWidth="2.2" />
          <path d="M23 61 L25 40 L31 41 L33 61 Z" fill={YELLOW} strokeWidth="2.2" />
          <path d="M0 92 L26 70" strokeWidth="1.4" />
          <path d="M86 28 c0 -5 7 -6 9 -3 c2 -6 11 -5 11 1 c5 0 5 6 1 6 h-19 c-3 0 -3 -3 -2 -4 Z" fill={PAPER} />
          <path d="M94 64 c0 -4 6 -5 8 -2 c2 -5 10 -4 10 1 c4 0 4 5 1 5 h-17 c-2 0 -3 -3 -2 -4 Z" fill={PAPER} />
        </g>
      )}
      {scene === 'atardecer' && (
        <g strokeWidth="1.8">
          <path d="M84 44 a14 14 0 0 1 28 0 Z" fill={YELLOW} />
          <path d="M98 22 v-6 M84 28 l-4 -4 M112 28 l4 -4" />
          <path d="M0 44 H120" />
        </g>
      )}
    </g>
  )
}

/* ───────── Pelo ───────── */

function HairBack({ style, color }) {
  if (style === 'largo') {
    return (
      <path d="M38 62 C35 38 47 30 60 30 C74 30 85 39 82 62 L85 98 L71 96 L70 72 L50 72 L49 96 L35 98 Z" fill={color} />
    )
  }
  if (style === 'rulos') {
    return (
      <path
        d="M37 74 a7 7 0 0 1 -3 -12 a7 7 0 0 1 0 -12 a7 7 0 0 1 5 -11 a7 7 0 0 1 9 -7 a7 7 0 0 1 12 -3 a7 7 0 0 1 12 3 a7 7 0 0 1 9 7 a7 7 0 0 1 5 11 a7 7 0 0 1 0 12 a7 7 0 0 1 -3 12 Z"
        fill={color}
      />
    )
  }
  if (style === 'rodete') return <circle cx="60" cy="31" r="9" fill={color} />
  return null
}

function HairFront({ style, color }) {
  switch (style) {
    case 'corto':
      return (
        <path
          d="M41.5 56 C40 40 49 33 60 33 C72 33 81 41 78.5 56 C74 47 66 44 58 46 C51 47 45 51 41.5 56 Z"
          fill={color}
        />
      )
    case 'largo':
      return (
        <path
          d="M41.5 56 C41 41 50 35 60 35 C70 35 79 41 78.5 56 C72 46 62 43 54 45 C48 47 44 50 41.5 56 Z"
          fill={color}
        />
      )
    case 'rulos':
      return (
        <path
          d="M43 50 a5 5 0 0 1 4 -8 a5 5 0 0 1 8 -4 a5 5 0 0 1 10 0 a5 5 0 0 1 8 4 a5 5 0 0 1 4 8 C70 45 50 45 43 50 Z"
          fill={color}
        />
      )
    case 'rodete':
      return (
        <path
          d="M41.5 56 C40 41 49 36 60 36 C71 36 80 41 78.5 56 C76 46 68 42 60 42 C52 42 44 46 41.5 56 Z"
          fill={color}
        />
      )
    case 'rapado':
      return <path d="M42 50 C44 39 52 36.5 60 36.5 C68 36.5 76 39 78 50" strokeDasharray="1.5 3" strokeWidth="2" />
    default:
      return null
  }
}

function ScarfBack({ color }) {
  return <path d="M35 64 C33 40 45 29 60 29 C75 29 87 40 85 64 C85 82 78 96 60 99 C42 96 35 82 35 64 Z" fill={color} />
}

function ScarfFront({ color }) {
  // Borde del pañuelo que enmarca la cara
  return <path d="M41 58 C40 44 49 37 60 37 C71 37 80 44 79 58 C76 48 68 43 60 43 C52 43 44 48 41 58 Z" fill={color} />
}

function WoolHat() {
  return (
    <g>
      <path d="M40 48 C40 31 80 31 80 48 Z" fill={YELLOW} />
      <path d="M38.5 46 H81.5 V53 H38.5 Z" fill={PAPER} />
      <circle cx="60" cy="28.5" r="4.5" fill={PAPER} />
    </g>
  )
}

function Cap() {
  return (
    <g>
      <path d="M41.5 49 C41.5 34 78.5 34 78.5 49 Z" fill={YELLOW} />
      <path d="M44 49 C56 46 72 46 90 51 C82 55 60 53 44 52 Z" fill={INK} />
      <path d="M60 35 V44" strokeWidth="1.8" />
    </g>
  )
}

/* ───────── Cara ───────── */

function Face({ expression }) {
  // Pensativo mira de reojo hacia arriba, como quien busca un recuerdo
  const look = expression === 'pensativo' ? { dx: 1.2, dy: -0.8 } : { dx: 0, dy: 0 }
  return (
    <g>
      {expression === 'sereno' ? (
        <>
          <path d="M50 58 q3.5 2.5 7 0" />
          <path d="M63 58 q3.5 2.5 7 0" />
        </>
      ) : (
        <>
          <circle cx={53.5 + look.dx} cy={58 + look.dy} r="1.9" fill={INK} stroke="none" />
          <circle cx={66.5 + look.dx} cy={58 + look.dy} r="1.9" fill={INK} stroke="none" />
        </>
      )}
      {expression === 'pensativo' && (
        <>
          <path d="M50 52.5 h6.5" strokeWidth="2" />
          <path d="M63.5 51.5 q3.5 -3 7 -0.5" strokeWidth="2" />
        </>
      )}
      <path d="M60 60.5 q-2.4 4.5 0.4 5.5" strokeWidth="2" />
      {expression === 'sonrisa' && <path d="M52 68.5 Q60 78.5 68 68.5 Z" fill={PAPER} strokeLinejoin="round" />}
      {expression === 'sereno' && <path d="M55.5 70.5 q4.5 2.4 9 0" />}
      {expression === 'pensativo' && <path d="M55.5 71.5 q4.5 0.8 9 -2" />}
    </g>
  )
}

function FacialHair({ style, color }) {
  if (style === 'bigote')
    return <path d="M52.5 66.5 C56 63.5 64 63.5 67.5 66.5 C64 68.5 56 68.5 52.5 66.5 Z" fill={color} />
  if (style === 'barba') {
    // Barba que enmarca la mandíbula y deja la boca a la vista, con bigote
    return (
      <g>
        <path d="M53 66.5 C56 64 64 64 67 66.5 C64 68 56 68 53 66.5 Z" fill={color} />
        <path
          d="M41.8 62 C43 76 51 82 60 82 C69 82 77 76 78.2 62 C75 72 69 75.5 60 75.5 C51 75.5 45 72 41.8 62 Z"
          fill={color}
        />
      </g>
    )
  }
  return null
}

function Glasses({ style }) {
  if (style === 'ninguno') return null
  const lens =
    style === 'redondos' ? (
      <>
        <circle cx="53.5" cy="58" r="6" />
        <circle cx="66.5" cy="58" r="6" />
      </>
    ) : (
      <>
        <rect x="46.5" y="53" width="13" height="10" rx="2.5" />
        <rect x="60.5" y="53" width="13" height="10" rx="2.5" />
      </>
    )
  return (
    <g strokeWidth="2">
      {lens}
      <path d="M59.5 58 h1 M41.5 56 l5 1.5 M78.5 56 l-5 1.5" />
    </g>
  )
}

/* ───────── Objeto de viaje ───────── */

function BackpackBack() {
  return <path d="M28 96 C28 88 34 84 40 84 L80 84 C86 84 92 88 92 96 L92 124 L28 124 Z" fill="#ddd0b6" />
}

function Item({ item, skin }) {
  switch (item) {
    case 'mate':
      return (
        <g>
          <path d="M84 92 L77 81" strokeWidth="2" />
          <path d="M78 92 H95 C96 103 93 112 86.5 112 C80 112 77 103 78 92 Z" fill={INK} />
          <path d="M74 112 C74 104 80 102 84 106" fill={skin} />
        </g>
      )
    case 'cafe':
      return (
        <g>
          <path d="M78 94 H96 L94 112 H80 Z" fill={PAPER} />
          <path d="M95.5 98 c6 0 6 8 -1 8" />
          <path d="M84 90 c-2 -3 2 -5 0 -8 M90 90 c-2 -3 2 -5 0 -8" strokeWidth="1.8" />
          <path d="M72 114 C72 106 78 104 82 108" fill={skin} />
        </g>
      )
    case 'auriculares':
      return (
        <g>
          <path d="M38 58 C36 30 84 30 82 58" strokeWidth="4" />
          <rect x="34" y="54" width="8" height="14" rx="3.5" fill={INK} />
          <rect x="78" y="54" width="8" height="14" rx="3.5" fill={INK} />
        </g>
      )
    case 'libro':
      return (
        <g>
          <path d="M42 102 L60 106 L78 102 L78 124 L60 128 L42 124 Z" fill={PAPER} />
          <path d="M60 106 V128" strokeWidth="1.8" />
          <path d="M47 108 h9 M47 113 h9 M64 108 h9 M64 113 h9" strokeWidth="1.4" />
        </g>
      )
    case 'camara':
      return (
        <g>
          <path d="M46 90 L52 100 M74 90 L68 100" strokeWidth="1.8" />
          <rect x="49" y="98" width="22" height="15" rx="3" fill={INK} />
          <circle cx="60" cy="105.5" r="4.5" fill={PAPER} />
          <rect x="65" y="95" width="4" height="3" fill={INK} />
        </g>
      )
    case 'mochila':
      return <path d="M44 90 L41 124 M76 90 L79 124" strokeWidth="5" />
    case 'carta':
      return (
        <g>
          <path d="M76 96 H100 V114 H76 Z" fill={PAPER} />
          <path d="M76 96 L88 106 L100 96" strokeWidth="1.8" />
          <path d="M70 116 C70 108 76 106 80 110" fill={skin} />
        </g>
      )
    default:
      return null
  }
}
