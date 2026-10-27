import './PlaneWindow.css'

// Ventanilla de avión vista desde adentro, con escenas animadas en colores planos,
// como los afiches de viaje: cielo, nubes y mar en bloques de color y el ala clara
// cruzando. Detrás del vidrio asoma un borde de color, como luz que se filtra.
// Cada sección del juego elige qué se ve del otro lado del vidrio.
const SCENES = {
  takeoff: Takeoff,
  clouds: Clouds,
  sunset: Sunset,
}

export default function PlaneWindow({ scene = 'clouds' }) {
  const Scene = SCENES[scene] ?? SCENES.clouds
  return (
    <figure className={`plane-window plane-window--${SCENES[scene] ? scene : 'clouds'}`} aria-hidden="true">
      <div className="plane-window__frame">
        <div className="plane-window__pane">
          {/* key: al cambiar de sección la escena nueva entra con un fundido */}
          <Scene key={scene} />
          <div className="plane-window__shade" aria-hidden="true" />
        </div>
      </div>
    </figure>
  )
}

/* ───────── Piezas compartidas ───────── */

const LINE = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }

// Nube de contorno: rellena de papel para tapar lo que pasa por detrás.
function Cloud({ x, y, s = 1 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-40 14 C-56 14 -58 -6 -42 -8 C-42 -26 -18 -30 -10 -16 C-4 -32 22 -32 26 -12 C40 -16 50 -2 42 8 C52 10 50 22 38 22 L-36 22 C-46 22 -48 14 -40 14 Z"
      className="pw-cloud"
      strokeWidth={2.4 / s}
    />
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

// Olas: líneas cortas que se desplazan.
function Waves({ from = 320, rows = 6, gap = 34, className = 'pw-drift pw-drift--sea pw-waves' }) {
  return (
    <Loop className={className}>
      {Array.from({ length: rows }, (_, r) =>
        [0, 1, 2].map((k) => {
          const x = ((r * 61 + k * 137) % 400) + 4
          const y = from + 14 + r * gap
          return <path key={`${r}-${k}`} d={`M${x} ${y} q8 -5 16 0 t16 0`} {...LINE} strokeWidth="2" />
        }),
      )}
    </Loop>
  )
}

function Wing() {
  return (
    <g className="pw-wing" {...LINE} strokeWidth="3">
      <path d="M-20 470 C110 476 250 492 352 512 L364 520 L346 531 C240 531 100 539 -20 552 Z" className="pw-paper" />
      <path d="M346 513 L380 466 L389 470 L364 523 Z" className="pw-paper" />
      <path d="M40 506 C140 508 240 516 330 526" strokeWidth="2" />
      <path d="M120 520 l-6 16 M200 524 l-6 14" strokeWidth="2" />
    </g>
  )
}

function Fade() {
  return <rect className="pw-loop-fade" width="400" height="560" opacity="0" />
}

/* ───────── Escena 1: despegue ───────── */
function Takeoff() {
  return (
    <svg
      className="pw-scene pw-scene--takeoff"
      viewBox="0 0 400 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="pw-tilt">
        <rect x="-200" y="-200" width="800" height="1100" className="pw-sky" />
        <path d="M-200 120 L600 40" className="pw-contrail" />
        <rect x="-200" y="292" width="800" height="600" className="pw-sea" />
        <Loop className="pw-drift pw-drift--slow">
          <Cloud x={90} y={130} s={0.7} />
          <Cloud x={300} y={80} s={0.5} />
        </Loop>
        {/* Horizonte con la costa a lo lejos */}
        <path d="M-200 292 L600 292" {...LINE} strokeWidth="2.4" />
        <path d="M-40 292 C-20 282 10 280 30 286 C50 278 80 280 96 292" {...LINE} strokeWidth="2.4" />
        <Waves from={292} rows={8} gap={30} />
        {/* La costa que aparece abajo al ganar altura */}
        <path
          d="M-200 392 C-70 386 6 400 64 414 C118 430 126 460 100 500 C84 536 120 600 136 700 L-200 700 Z"
          className="pw-paper"
          {...LINE}
          strokeWidth="2.4"
        />
        <path
          d="M-200 380 C-60 372 20 388 80 404 C140 420 150 456 120 500 C100 540 140 600 160 700"
          {...LINE}
          strokeWidth="1.8"
          strokeDasharray="4 7"
        />
        {[
          [-10, 430],
          [20, 452],
          [-30, 474],
          [10, 504],
          [42, 476],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="16" height="12" rx="2" {...LINE} strokeWidth="2" />
        ))}

        {/* Pista: pasa rápido y después queda abajo cuando el avión sube */}
        <g className="pw-ground">
          <rect x="-200" y="322" width="800" height="420" className="pw-paper" />
          <path d="M-200 322 H600" {...LINE} strokeWidth="2.4" />
          <Loop className="pw-roll pw-roll--far">
            {[0, 100, 200, 300].map((x) => (
              <path
                key={x}
                d={`M${x} 350 l10 -12 M${x + 12} 350 l10 -12 M${x + 24} 350 l10 -12`}
                {...LINE}
                strokeWidth="1.8"
              />
            ))}
          </Loop>
          <path d="M-200 396 H600 M-200 512 H600" {...LINE} strokeWidth="2.4" />
          <Loop className="pw-roll">
            <rect x="10" y="450" width="110" height="9" rx="2" fill="currentColor" />
            <rect x="210" y="450" width="110" height="9" rx="2" fill="currentColor" />
            {[0, 50, 100, 150, 200, 250, 300, 350].map((x) => (
              <circle key={x} cx={x + 20} cy="384" r="4" className="pw-light" {...LINE} strokeWidth="1.6" />
            ))}
          </Loop>
        </g>
      </g>
      <Wing />
      <Fade />
    </svg>
  )
}

/* ───────── Escena 2: sobre las nubes ───────── */
function Clouds() {
  return (
    <svg
      className="pw-scene pw-scene--clouds pw-bob"
      viewBox="0 0 400 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="400" height="560" className="pw-sky" />
      {/* Franjas de cielo: un poco de azul arriba y una banda de luz amarilla */}
      <path d="M0 0 H400 V70 L0 130 Z" className="pw-band-sky" />
      <path d="M0 200 L400 130 V200 L0 270 Z" className="pw-band-light" />
      <path d="M0 186 L400 116 M0 228 L400 160" className="pw-contrail" />
      <rect y="312" width="400" height="248" className="pw-sea" />
      <path d="M0 312 H400" {...LINE} strokeWidth="2.4" />
      <Waves from={312} rows={7} gap={34} />
      {/* Banco de nubes lejano, sobre el horizonte */}
      <Loop className="pw-drift pw-drift--far">
        <Cloud x={60} y={300} s={0.6} />
        <Cloud x={170} y={306} s={0.5} />
        <Cloud x={290} y={298} s={0.65} />
      </Loop>
      {/* Pájaros a lo lejos */}
      <Loop className="pw-drift pw-drift--slow">
        <path d="M80 150 q6 -6 12 0 q6 -6 12 0 M260 110 q5 -5 10 0 q5 -5 10 0" {...LINE} strokeWidth="2" />
      </Loop>
      {/* Nubes debajo del avión */}
      <Loop className="pw-drift pw-drift--mid">
        <Cloud x={80} y={410} s={1.1} />
        <Cloud x={290} y={440} s={1.25} />
      </Loop>
      {/* Una nube que pasa cerca, rápida */}
      <g className="pw-pass">
        <Cloud x={200} y={210} s={2.2} />
      </g>
      <Wing />
    </svg>
  )
}

/* ───────── Escena 3: atardecer ───────── */
const RAYS = Array.from({ length: 9 }, (_, i) => {
  const a = Math.PI + (i + 1) * (Math.PI / 10)
  const p = (r) => `${(224 + Math.cos(a) * r).toFixed(1)} ${(318 + Math.sin(a) * r).toFixed(1)}`
  return `M${p(60)} L${p(82)}`
})

function Sunset() {
  const glints = [
    [212, 336, 30],
    [202, 356, 50],
    [218, 378, 24],
    [194, 400, 64],
    [212, 426, 38],
    [188, 452, 76],
    [208, 482, 44],
  ]
  return (
    <svg
      className="pw-scene pw-scene--sunset pw-bob"
      viewBox="0 0 400 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="400" height="318" className="pw-sky" />
      <rect y="318" width="400" height="242" className="pw-sea" />
      {/* Nubes oscuras del atardecer, en bloques */}
      <Loop className="pw-drift pw-drift--slow">
        <path d="M40 110 q60 -40 140 -12 q60 -30 160 8 l-80 22 q-100 -12 -220 -18 z" className="pw-dusk" />
        <path d="M-10 250 q70 -18 150 -2 l-30 12 q-60 -6 -120 -10 z" className="pw-dusk" />
      </Loop>
      <g className="pw-rays" {...LINE} strokeWidth="2.2">
        {RAYS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d="M180 318 A44 44 0 0 1 268 318 Z" className="pw-sun" {...LINE} strokeWidth="2.6" />
      <Loop className="pw-drift pw-drift--slow">
        <path d="M30 190 H140 M60 202 H170 M250 150 H350 M270 162 H380" className="pw-contrail" />
      </Loop>
      <path d="M0 318 H400" className="pw-horizon" />
      {glints.map(([x, y, w], i) => (
        <path
          key={y}
          className="pw-glint"
          style={{ animationDelay: `${(i % 4) * 0.45}s` }}
          d={`M${x} ${y} H${x + w}`}
          {...LINE}
          strokeWidth="3"
        />
      ))}
      <Waves from={318} rows={7} gap={32} />
      <Wing />
    </svg>
  )
}
