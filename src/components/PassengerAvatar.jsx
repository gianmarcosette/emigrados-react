import { useId } from 'react'
import { DEFAULT_AVATAR, colorOf, normalizeAvatar } from '../lib/avatar.js'
import { PAPER } from '../lib/paper.js'
import { Bird, Goo, Leaf, SmallHeart, Star } from './paper.jsx'

// Tu pasajero, recortado en papel de color: cabeza y hombros sobre un círculo, con dos ojos de
// tinta y nada más en la cara (cualquiera puede verse ahí y, en el modo Online, cuida la privacidad). Se dibuja en
// una caja de 400 × 400 y se arma por capas: fondo, adorno, ropa, pelo, cabeza y lo que va encima.

const HAIR = {
  corto: [
    [200, 132, 50],
    [160, 120, 18],
    [200, 102, 22],
    [240, 120, 18],
  ],
  rulos: Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + (i / 10) * Math.PI
    return [200 + Math.cos(a) * 52, 150 + Math.sin(a) * 50, 20]
  }).concat([[200, 118, 40]]),
  largo: [
    [200, 124, 50],
    [156, 150, 150, 200, 158, 250, 34],
    [244, 150, 250, 200, 242, 250, 34],
  ],
  rodete: [
    [200, 130, 50],
    [200, 76, 24],
  ],
  trenzas: [
    [200, 128, 50],
    [158, 160, 150, 210, 160, 270, 16],
    [242, 160, 250, 210, 240, 270, 16],
    [160, 270, 12],
    [240, 270, 12],
  ],
  flequillo: [
    [200, 128, 50],
    [152, 140, 160, 112, 210, 120, 30],
  ],
  rapado: [[200, 146, 47]],
  pelado: [],
}

// El adorno, en un color que se vea sobre cada fondo
const ACCENT = {
  cielo: PAPER.yellow,
  coral: PAPER.cream,
  durazno: PAPER.navy,
  amarillo: PAPER.coral,
  verde: PAPER.yellow,
  menta: PAPER.coral,
  rosa: PAPER.navy,
  noche: PAPER.yellow,
}

export default function PassengerAvatar({ avatar, size = 120, label = 'Avatar', decorative = false, className = '' }) {
  const a = normalizeAvatar(avatar) ?? DEFAULT_AVATAR
  const clip = `${useId().replace(/:/g, '')}-recorte`
  const skin = colorOf('skin', a.skin)
  const hair = colorOf('hairColor', a.hairColor)
  const shirt = colorOf('shirt', a.shirt)
  const accent = ACCENT[a.background]
  // Gorro y pañuelo en un papel que no se pierda contra la ropa ni contra el fondo
  const taken = [shirt, colorOf('background', a.background)]
  const free = (order) => order.find((c) => !taken.includes(c)) ?? order[0]
  const hat = free([PAPER.coral, PAPER.yellow, PAPER.green, PAPER.navy])
  const scarf = free([PAPER.navy, PAPER.coral, PAPER.green, PAPER.yellow])

  return (
    <svg
      viewBox="40 40 320 320"
      width={size ?? undefined}
      height={size ?? undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={`passenger-avatar ${className}`}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="200" cy="200" r="160" />
        </clipPath>
      </defs>
      <circle cx="200" cy="200" r="160" fill={colorOf('background', a.background)} />
      <g clipPath={`url(#${clip})`}>
        <Deco deco={a.deco} color={accent} />
        <Goo
          fill={shirt}
          parts={[
            [200, 380, 120],
            [128, 306, 200, 278, 272, 306, 56],
          ]}
        />
        {a.headwear === 'panuelo' ? (
          <Goo
            fill={scarf}
            parts={[
              [200, 150, 56],
              [168, 200, 158, 240, 150, 280, 30],
              [232, 200, 242, 240, 250, 280, 30],
            ]}
          />
        ) : (
          a.headwear !== 'gorro' && HAIR[a.hair].length > 0 && <Goo fill={hair} parts={HAIR[a.hair]} />
        )}
        <Goo
          fill={skin}
          parts={[
            [200, 166, 44],
            [200, 200, 200, 220, 200, 262, 34],
          ]}
        />
        {a.facialHair === 'barba' && (
          <Goo
            fill={hair}
            parts={[
              [160, 176, 200, 250, 240, 176, 15],
              [200, 214, 13],
            ]}
          />
        )}
        {a.facialHair === 'bigote' && <Goo fill={hair} parts={[[180, 196, 200, 186, 220, 196, 9]]} />}
        {a.headwear === 'panuelo' && <Goo fill={scarf} parts={[[154, 154, 200, 96, 246, 154, 20]]} />}
        {a.headwear === 'gorro' && (
          <Goo
            fill={hat}
            parts={[
              [200, 118, 48],
              [148, 134, 200, 124, 252, 134, 18],
              [200, 68, 13],
            ]}
          />
        )}
        {a.headwear === 'gorra' && (
          <g filter="url(#papel-corte)" fill={hat}>
            <path d="M152 150 C150 100 250 100 248 150 Z" />
            <path d="M150 146 Q206 136 272 150 Q274 162 250 162 Q204 152 150 158 Z" />
          </g>
        )}
        <Eyes style={a.eyes} />
        <Glasses style={a.glasses} />
      </g>
    </svg>
  )
}

function Deco({ deco, color }) {
  if (deco === 'ninguno') return null
  return (
    <>
      <Leaf x={92} y={330} s={1.1} fill={color} rot={-20} />
      {deco === 'estrella' && <Star x={300} y={108} r={26} fill={color} rot={0.3} />}
      {deco === 'hoja' && <Leaf x={310} y={150} s={1.3} fill={color} rot={30} />}
      {deco === 'corazon' && <SmallHeart x={300} y={110} s={0.55} fill={color} rot={12} />}
      {deco === 'pajaro' && <Bird x={298} y={104} s={0.8} fill={color} rot={10} />}
    </>
  )
}

// Ojos de tinta: dos puntos, dos arcos que sonríen o dos arcos cerrados
function Eyes({ style }) {
  if (style === 'abiertos')
    return (
      <g fill={PAPER.ink}>
        <ellipse cx="183" cy="167" rx="5.5" ry="7" />
        <ellipse cx="217" cy="167" rx="5.5" ry="7" />
      </g>
    )
  const d = {
    sonrientes: ['M175 170 Q183 159 191 170', 'M209 170 Q217 159 225 170'],
    serenos: ['M175 165 Q183 174 191 165', 'M209 165 Q217 174 225 165'],
  }[style]
  if (!d) return null
  return (
    <g fill="none" stroke={PAPER.ink} strokeWidth="5" strokeLinecap="round">
      <path d={d[0]} />
      <path d={d[1]} />
    </g>
  )
}

function Glasses({ style }) {
  if (style === 'ninguno') return null
  const lens =
    style === 'redondos'
      ? [<circle key="i" cx="181" cy="170" r="13" />, <circle key="d" cx="219" cy="170" r="13" />]
      : [
          <rect key="i" x="164" y="159" width="32" height="22" rx="5" />,
          <rect key="d" x="204" y="159" width="32" height="22" rx="5" />,
        ]
  return (
    <g fill="none" stroke={PAPER.ink} strokeWidth="5" strokeLinejoin="round">
      {lens}
      <path d="M194 168 Q200 164 206 168" />
    </g>
  )
}
