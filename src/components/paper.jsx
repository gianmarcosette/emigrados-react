// Recortes de papel al estilo Matisse: el pájaro, el corazón, Ícaro y los íconos de cada modo.
// Las figuras se arman con trazos gruesos de puntas redondas que el filtro "papel-goo" funde
// en una sola forma; el filtro "papel-corte" le da el borde irregular de la tijera. Los
// filtros se definen una sola vez, en <PaperFilters /> (ver Layout).
import { FLYING_BIRD, GULL, HEART, PAPER } from '../lib/paper.js'

export function PaperFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="papel-goo" filterUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="500">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 28 -12" result="g" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="g" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="papel-corte" filterUnits="userSpaceOnUse" x="-500" y="-500" width="2000" height="2000">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

/** Trazos que se funden: [x, y, r] es un círculo; [x1, y1, cx, cy, x2, y2, ancho], una curva. */
export function Goo({ fill, parts }) {
  return (
    <g filter="url(#papel-goo)" fill={fill} stroke={fill} strokeLinecap="round" strokeLinejoin="round">
      {parts.map((p, i) =>
        p.length === 3 ? (
          <circle key={i} cx={p[0]} cy={p[1]} r={p[2]} stroke="none" />
        ) : (
          <path key={i} d={`M${p[0]} ${p[1]} Q${p[2]} ${p[3]} ${p[4]} ${p[5]}`} fill="none" strokeWidth={p[6]} />
        ),
      )}
    </g>
  )
}

// Pájaro en vuelo visto de frente: alas abiertas, cuerpo y cola
export function Bird({ x, y, s = 1, fill, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#papel-corte)">
      <path d={FLYING_BIRD} fill={fill} />
      <circle cx="0" cy="2" r="6" fill={fill} />
    </g>
  )
}

// Gaviota: dos alas curvas
export function Gull({ x, y, s = 1, fill, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#papel-corte)">
      <path d={GULL} fill={fill} />
    </g>
  )
}

// Hoja de alga (como en "La gerbe")
export function Leaf({ x, y, s = 1, fill, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#papel-corte)">
      <path
        d="M0 0 C-14 -20 -10 -46 0 -64 C10 -46 14 -20 0 0 Z M0 -16 C-12 -22 -22 -20 -28 -30 C-16 -34 -6 -28 0 -24 Z M0 -34 C10 -40 20 -38 26 -48 C14 -52 4 -46 0 -42 Z"
        fill={fill}
      />
    </g>
  )
}

// Corazón recortado, un poco asimétrico
export function SmallHeart({ x, y, s = 1, fill, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#papel-corte)">
      <path
        d="M0 34 C-26 16 -50 -4 -46 -26 C-43 -44 -20 -50 -3 -30 C0 -27 1 -27 3 -31 C18 -50 44 -46 47 -26 C50 -6 28 14 0 34 Z"
        fill={fill}
      />
    </g>
  )
}

// Estrella de puntas irregulares
export function Star({ x, y, r, fill, rot = 0, seed = 3, points = 7 }) {
  let n = seed * 9301
  const rnd = () => (n = (n * 9301 + 49297) % 233280) / 233280
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const a = rot + (i / (points * 2)) * Math.PI * 2
    const rr = i % 2 ? r * (0.32 + rnd() * 0.12) : r * (0.8 + rnd() * 0.35)
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`)
  }
  return <polygon points={pts.join(' ')} fill={fill} stroke={fill} strokeWidth="3" strokeLinejoin="round" />
}

/** El ícono de Emigrados: un pájaro en vuelo dentro de un corazón. */
export function HeartBird({ heart = PAPER.coral, bird = PAPER.cream, size, label, className = '' }) {
  return (
    <svg
      viewBox="70 80 260 260"
      width={size}
      height={size}
      className={`heart-bird ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path filter="url(#papel-corte)" d={HEART} fill={heart} />
      <Bird x={200} y={188} s={2.1} fill={bird} />
    </svg>
  )
}

/** Ícaro: alguien que se lanza con el corazón en el pecho, entre pájaros. */
export function Icaro({ className = '' }) {
  const { cream, coral, yellow } = PAPER
  return (
    <svg viewBox="20 20 360 360" className={`icaro ${className}`} aria-hidden="true" focusable="false">
      <Gull x={70} y={70} s={1.1} fill={cream} rot={-8} />
      <Gull x={118} y={44} s={0.7} fill={cream} rot={6} />
      <Gull x={330} y={96} s={0.9} fill={cream} rot={10} />
      <Gull x={350} y={300} s={0.6} fill={yellow} rot={-6} />
      <Gull x={64} y={270} s={0.7} fill={yellow} rot={4} />
      <Goo
        fill={cream}
        parts={[
          [204, 98, 23],
          [200, 134, 203, 166, 200, 200, 50],
          [200, 200, 199, 222, 197, 240, 38],
          [182, 142, 150, 130, 122, 104, 18],
          [122, 104, 108, 92, 92, 86, 11],
          [218, 142, 252, 128, 280, 100, 18],
          [280, 100, 292, 88, 308, 82, 11],
          [190, 236, 176, 274, 160, 306, 22],
          [160, 306, 152, 324, 148, 344, 12],
          [208, 236, 230, 262, 246, 290, 20],
          [246, 290, 258, 310, 278, 322, 11],
        ]}
      />
      <SmallHeart x={208} y={168} s={0.5} fill={coral} rot={-6} />
    </svg>
  )
}

/** El dibujo de cada modo: el corazón con el pájaro, la bandada en V y las rutas que se juntan. */
export function ModeIcon({ mode, className = '' }) {
  const { coral, navy, green, yellow } = PAPER
  const cls = `mode-icon ${className}`
  if (mode === 'individual') return <HeartBird className={cls} />
  if (mode === 'grupal')
    return (
      <svg viewBox="40 80 320 180" className={cls} aria-hidden="true" focusable="false">
        <Bird x={200} y={128} s={1.3} fill={navy} />
        <Bird x={140} y={168} s={1.1} fill={coral} rot={-4} />
        <Bird x={260} y={168} s={1.1} fill={green} rot={4} />
        <Bird x={86} y={206} s={0.9} fill={yellow} rot={-6} />
        <Bird x={314} y={206} s={0.9} fill={coral} rot={6} />
      </svg>
    )
  return (
    <svg viewBox="40 70 320 200" className={cls} aria-hidden="true" focusable="false">
      <path
        d="M60 250 C100 244 136 214 156 162"
        fill="none"
        stroke={navy}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 14"
      />
      <path
        d="M340 250 C300 244 264 214 244 162"
        fill="none"
        stroke={coral}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 14"
      />
      <circle cx="60" cy="250" r="9" fill={navy} />
      <circle cx="340" cy="250" r="9" fill={coral} />
      <Bird x={152} y={120} s={0.85} fill={navy} rot={-4} />
      <Bird x={248} y={120} s={0.85} fill={coral} rot={4} />
    </svg>
  )
}
