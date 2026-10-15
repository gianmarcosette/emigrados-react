import { useId } from 'react'
import './PlaneWindow.css'

// Ventanilla de avión con escenas animadas (motion graphics en SVG + CSS).
// Cada sección del juego elige qué se ve del otro lado del vidrio.
const SCENES = {
  takeoff: { label: 'Despegando', Scene: Takeoff },
  clouds: { label: 'Sobre las nubes', Scene: Clouds },
  sunset: { label: 'Atardecer sobre el mar', Scene: Sunset },
}

export default function PlaneWindow({ scene = 'clouds', variant = 'portrait', caption = true }) {
  const { label, Scene } = SCENES[scene] ?? SCENES.clouds
  return (
    <figure className={`plane-window plane-window--${variant}`}>
      <div className="plane-window__frame">
        <div className="plane-window__pane">
          {/* key: al cambiar de sección la escena nueva entra con un fundido */}
          <Scene key={scene} />
          <div className="plane-window__shade" aria-hidden="true" />
        </div>
      </div>
      {caption && <figcaption className="plane-window__caption">{label}</figcaption>}
    </figure>
  )
}

/* ───────── Piezas compartidas ───────── */

// Nube suave: varios círculos con degradé radial (sin filtros, para que sea liviana).
function Cloud({ x, y, s = 1, fill }) {
  const puffs = [
    [0, 0, 26],
    [-30, 8, 20],
    [30, 6, 22],
    [-12, -14, 20],
    [14, -16, 18],
    [52, 12, 14],
    [-52, 14, 13],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {puffs.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r * 1.5} fill={fill} />
      ))}
    </g>
  )
}

// Una franja de 400 de ancho repetida dos veces: al moverse -400 vuelve a empezar sin saltos.
function Loop({ className, children }) {
  return (
    <g className={className}>
      <g>{children}</g>
      <g transform="translate(400 0)">{children}</g>
    </g>
  )
}

function Wing({ id, tone = 'day' }) {
  const fill = tone === 'dusk' ? `url(#${id}-wing-dusk)` : `url(#${id}-wing)`
  return (
    <g className="pw-wing">
      <path
        d="M-20 468 C110 474 250 490 352 510 L366 519 L348 530 C240 530 100 538 -20 552 Z"
        fill={fill}
      />
      <path d="M346 512 L382 462 L391 466 L366 522 Z" fill={fill} />
      <path d="M40 506 C140 508 240 516 330 526" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2" />
      {tone === 'dusk' && (
        <path d="M-20 468 C110 474 250 490 352 510" fill="none" stroke="#f2a06b" strokeWidth="2.5" opacity=".8" />
      )}
    </g>
  )
}

function WingDefs({ id }) {
  return (
    <>
      <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eef1f3" />
        <stop offset="1" stopColor="#9aa4ac" />
      </linearGradient>
      <linearGradient id={`${id}-wing-dusk`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3a5c" />
        <stop offset="1" stopColor="#1c1630" />
      </linearGradient>
    </>
  )
}

/* ───────── Escena 1: despegue ───────── */
function Takeoff() {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="pw-scene" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb2e3" />
          <stop offset=".45" stopColor="#c9e1f2" />
          <stop offset=".9" stopColor="#f3e7cf" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9bb877" />
          <stop offset="1" stopColor="#5a7d43" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f9ccc" />
          <stop offset="1" stopColor="#2f6f9e" />
        </linearGradient>
        <WingDefs id={id} />
      </defs>

      {/* Horizonte: se inclina un poco cuando el avión levanta la nariz */}
      <g className="pw-tilt">
        <rect x="-200" y="-200" width="800" height="500" fill={`url(#${id}-sky)`} />
        <Loop className="pw-drift pw-drift--slow">
          <Cloud x={90} y={120} s={0.55} fill="rgba(255,255,255,.75)" />
          <Cloud x={300} y={70} s={0.4} fill="rgba(255,255,255,.6)" />
        </Loop>
        <rect x="-200" y="290" width="800" height="600" fill={`url(#${id}-sea)`} />
        <path d="M-200 296 L-60 292 L0 286 L60 291 L120 284 L180 290 L600 290 L600 298 L-200 300 Z" fill="#7e8fa0" opacity=".55" />
        <Loop className="pw-drift pw-drift--sea">
          {[20, 110, 190, 280, 350].map((x, i) => (
            <rect key={x} x={x} y={310 + i * 34} width={22 + (i % 3) * 10} height="2" rx="1" fill="rgba(255,255,255,.45)" />
          ))}
        </Loop>
        {/* La costa que aparece abajo al ganar altura */}
        <path d="M-200 360 C-60 352 20 372 80 392 C140 412 150 452 120 500 C100 540 140 600 160 700 L-200 700 Z" fill="#e8d7a8" />
        <path d="M-200 372 C-70 366 6 384 64 402 C118 420 126 456 100 500 C84 536 120 600 136 700 L-200 700 Z" fill="#7f9f5f" />
        {[[-10, 420], [20, 445], [-30, 470], [10, 500], [40, 470]].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="16" height="12" rx="2" fill="#d9d2c3" opacity=".9" />
        ))}

        {/* Pista y pasto: pasan rápido y después quedan abajo cuando el avión sube */}
        <g className="pw-ground">
          <rect x="-200" y="326" width="800" height="420" fill={`url(#${id}-ground)`} />
          <Loop className="pw-roll pw-roll--far">
            {[0, 100, 200, 300].map((x) => (
              <rect key={x} x={x} y="338" width="60" height="5" rx="2" fill="rgba(60,90,40,.35)" />
            ))}
          </Loop>
          <rect x="-200" y="398" width="800" height="116" fill="#5d6166" />
          <rect x="-200" y="404" width="800" height="3" fill="rgba(255,255,255,.75)" />
          <rect x="-200" y="505" width="800" height="3" fill="rgba(255,255,255,.75)" />
          <Loop className="pw-roll">
            <rect x="10" y="452" width="120" height="8" rx="2" fill="#f4f4f0" />
            <rect x="210" y="452" width="120" height="8" rx="2" fill="#f4f4f0" />
            {[0, 50, 100, 150, 200, 250, 300, 350].map((x) => (
              <circle key={x} cx={x + 20} cy="396" r="3.2" fill="#ffd36b" />
            ))}
          </Loop>
        </g>
      </g>

      <Wing id={id} />
      <rect className="pw-loop-fade" width="400" height="560" fill="#e9f1f6" opacity="0" />
    </svg>
  )
}

/* ───────── Escena 2: sobre las nubes ───────── */
function Clouds() {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="pw-scene pw-bob" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f7fc4" />
          <stop offset=".4" stopColor="#8fc1ea" />
          <stop offset=".56" stopColor="#d9eefb" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8fbf" />
          <stop offset="1" stopColor="#174d72" />
        </linearGradient>
        <radialGradient id={`${id}-puff`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-puff-soft`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <WingDefs id={id} />
      </defs>

      <rect width="400" height="560" fill={`url(#${id}-sky)`} />
      <rect y="310" width="400" height="250" fill={`url(#${id}-sea)`} />
      <Loop className="pw-drift pw-drift--sea">
        {[15, 70, 140, 210, 260, 330, 380].map((x, i) => (
          <rect key={x} x={x} y={330 + ((i * 37) % 160)} width={18 + (i % 3) * 8} height="2" rx="1" fill="rgba(255,255,255,.4)" />
        ))}
      </Loop>

      {/* Banco de nubes lejano, sobre el horizonte */}
      <Loop className="pw-drift pw-drift--far">
        {[30, 130, 230, 330].map((x, i) => (
          <Cloud key={x} x={x} y={312 + (i % 2) * 6} s={0.7} fill={`url(#${id}-puff-soft)`} />
        ))}
      </Loop>
      {/* Nubes debajo del avión, entre nosotros y el mar */}
      <Loop className="pw-drift pw-drift--mid">
        <Cloud x={60} y={400} s={1.1} fill={`url(#${id}-puff)`} />
        <Cloud x={250} y={430} s={1.3} fill={`url(#${id}-puff)`} />
      </Loop>
      {/* Una nube que pasa cerca, rápida */}
      <g className="pw-pass">
        <Cloud x={200} y={200} s={2.4} fill={`url(#${id}-puff)`} />
      </g>

      <Wing id={id} />
    </svg>
  )
}

/* ───────── Escena 3: atardecer ───────── */
function Sunset() {
  const id = useId().replace(/:/g, '')
  const glints = [
    [214, 334, 32],
    [206, 352, 48],
    [220, 370, 26],
    [198, 390, 60],
    [214, 412, 40],
    [190, 436, 72],
    [210, 462, 46],
    [184, 490, 84],
  ]
  return (
    <svg className="pw-scene pw-bob" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#232554" />
          <stop offset=".25" stopColor="#5b3a72" />
          <stop offset=".42" stopColor="#c45e7c" />
          <stop offset=".52" stopColor="#f39b5c" />
          <stop offset=".57" stopColor="#ffd283" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a4a78" />
          <stop offset=".3" stopColor="#3a2c5c" />
          <stop offset="1" stopColor="#141633" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffe3a6" stopOpacity=".9" />
          <stop offset=".35" stopColor="#ffb878" stopOpacity=".45" />
          <stop offset="1" stopColor="#ff9a6a" stopOpacity="0" />
        </radialGradient>
        <WingDefs id={id} />
      </defs>

      <rect width="400" height="560" fill={`url(#${id}-sky)`} />
      <circle className="pw-glow" cx="224" cy="316" r="170" fill={`url(#${id}-glow)`} />
      <Loop className="pw-drift pw-drift--slow">
        <ellipse cx="80" cy="200" rx="90" ry="7" fill="#8e4f7c" opacity=".55" />
        <ellipse cx="300" cy="160" rx="70" ry="5" fill="#7a4573" opacity=".5" />
        <ellipse cx="200" cy="250" rx="110" ry="6" fill="#d9707f" opacity=".45" />
      </Loop>
      <circle cx="224" cy="314" r="30" fill="#fff0c9" />
      <rect y="318" width="400" height="242" fill={`url(#${id}-sea)`} />
      {glints.map(([x, y, w], i) => (
        <rect
          key={y}
          className="pw-glint"
          style={{ animationDelay: `${(i % 4) * 0.45}s` }}
          x={x}
          y={y}
          width={w}
          height="3"
          rx="1.5"
          fill="#ffcf8f"
        />
      ))}
      <Loop className="pw-drift pw-drift--sea">
        {[30, 120, 300, 360].map((x, i) => (
          <rect key={x} x={x} y={350 + i * 38} width="22" height="2" rx="1" fill="rgba(255,190,150,.35)" />
        ))}
      </Loop>

      <Wing id={id} tone="dusk" />
    </svg>
  )
}
