// Pegatinas como afiches de viaje en miniatura: cada país con su lugar emblemático,
// el cielo en franjas, el borde crema y el nombre grande. Se dibujan en una caja de
// 100 × 132 con el centro en (50, 66). Los países que todavía no tienen afiche usan la
// pegatina simple (ver Sticker.jsx). Se van sumando por tandas.

const C = {
  ink: '#161616',
  cream: '#fbf9f5',
  snow: '#f4f1ea',
  yellow: '#ffd700',
  orange: '#f37c1e',
  coral: '#e8664a',
  sky: '#3a6fd6',
  mint: '#a9cdb8',
  navy: '#1f2f5c',
  peach: '#f6b48f',
  rose: '#f3a6b8',
  green: '#3f7d5a',
  deepGreen: '#2f6a49',
  teal: '#2f8f8a',
  tan: '#d9a35b',
  brown: '#8a5a32',
  stone: '#c9b48a',
}

function Bands({ colors, y = 7, h = 118 }) {
  const step = h / colors.length
  return colors.map((c, i) => <rect key={c + i} x="7" y={y + step * i} width="86" height={step + 0.5} fill={c} />)
}

function Title({ children, y, fill, size, stroke, spacing = 0.5 }) {
  return (
    <text
      x="50"
      y={y}
      textAnchor="middle"
      className="poster__title"
      style={{ fontSize: size, letterSpacing: spacing }}
      fill={fill}
      stroke={stroke ?? 'none'}
      strokeWidth={stroke ? 0.8 : 0}
      paintOrder="stroke"
    >
      {children}
    </text>
  )
}

function Sub({ children, y, fill = C.cream }) {
  return (
    <text x="50" y={y} textAnchor="middle" className="poster__sub" fill={fill}>
      {children}
    </text>
  )
}

// Marco crema del afiche; la ilustración se recorta adentro
function Frame({ uid, children }) {
  return (
    <g className="poster">
      <clipPath id={`${uid}-clip`}>
        <rect x="7" y="7" width="86" height="118" />
      </clipPath>
      <rect x="0" y="0" width="100" height="132" rx="3" fill={C.cream} stroke={C.ink} strokeWidth="2" />
      <g clipPath={`url(#${uid}-clip)`}>{children}</g>
      <rect x="7" y="7" width="86" height="118" fill="none" stroke={C.ink} strokeWidth="1.2" />
    </g>
  )
}

function Argentina({ uid }) {
  // El Obelisco de Buenos Aires sobre la avenida, con el sol de mayo
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    return `M${26 + Math.cos(a) * 9} ${40 + Math.sin(a) * 9} L${26 + Math.cos(a) * 12.5} ${40 + Math.sin(a) * 12.5}`
  })
  return (
    <Frame uid={uid}>
      <Bands colors={['#9fcde9', '#bfe0f2', '#dcedf5']} />
      <circle cx="26" cy="40" r="6.5" fill={C.yellow} stroke={C.orange} strokeWidth="1" />
      <path d={rays.join(' ')} stroke={C.orange} strokeWidth="1.3" />
      <path d="M7 98 H93 V125 H7 Z" fill="#8f9bab" />
      <path d="M38 125 L47 98 H53 L62 125 Z" fill="#b9c2cc" />
      <path d="M50 102 V125" stroke={C.yellow} strokeWidth="1" strokeDasharray="3 3" />
      <path d="M7 98 Q14 84 22 92 Q28 82 36 96 Z M64 96 Q72 82 78 92 Q86 84 93 98 Z" fill={C.green} />
      <path d="M45.5 98 L47 38 L50 29 L53 38 L54.5 98 Z" fill={C.snow} stroke={C.ink} strokeWidth="1" />
      <rect x="48.8" y="42" width="2.4" height="3.4" fill={C.ink} />
      <Title y={22} fill={C.navy} size={13} spacing={0.3}>
        ARGENTINA
      </Title>
      <rect x="7" y="110" width="86" height="15" fill={C.navy} />
      <Sub y={120}>BUENOS AIRES</Sub>
    </Frame>
  )
}

function Brasil({ uid }) {
  // El Cristo Redentor sobre el Corcovado, la bahía y el Pan de Azúcar
  return (
    <Frame uid={uid}>
      <Bands colors={['#ffd76a', '#ffe3a0', '#cfeedc']} />
      <circle cx="78" cy="40" r="8" fill={C.orange} />
      <path d="M7 96 Q26 70 40 58 Q46 54 52 58 Q62 70 74 96 Z" fill={C.green} />
      <path d="M66 98 Q72 78 80 78 Q88 78 93 98 Z" fill={C.deepGreen} />
      <g fill={C.snow} stroke={C.ink} strokeWidth="0.8" strokeLinejoin="round">
        <path d="M45.5 56 V40 H54.5 V56 Z" />
        <path d="M36 41 H64 V44.5 H36 Z" />
        <circle cx="50" cy="36.5" r="2.6" />
      </g>
      <rect x="7" y="96" width="86" height="29" fill={C.sky} />
      <path d="M14 106 h18 M44 113 h24 M72 104 h14" stroke={C.cream} strokeWidth="1.2" />
      <Title y={24} fill={C.green} size={19} stroke={C.cream} spacing={1.5}>
        BRASIL
      </Title>
      <Sub y={121}>RÍO DE JANEIRO</Sub>
    </Frame>
  )
}

function Italia({ uid }) {
  // El Coliseo bajo un cielo con nubes
  return (
    <Frame uid={uid}>
      <Bands colors={['#9cc6e8', '#bcd9ee', '#e5eef3']} />
      <path d="M20 46 q6 -6 12 -2 q6 -6 13 0 q6 0 6 5 h-31 z M62 56 q5 -5 10 -1 q5 -4 10 1 h-20 z" fill={C.cream} />
      <path d="M10 125 V84 Q50 62 90 84 V125 Z" fill={C.tan} stroke={C.brown} strokeWidth="1" />
      {[0, 1, 2].map((r) =>
        Array.from({ length: 7 }, (_, i) => (
          <path key={`${r}-${i}`} d={`M${16 + i * 11} ${98 + r * 9} v-4 a3 3 0 0 1 6 0 v4 z`} fill={C.brown} />
        )),
      )}
      <path d="M10 84 Q50 62 90 84" fill="none" stroke={C.cream} strokeWidth="1.5" />
      <Title y={30} fill={C.yellow} size={20} stroke={C.ink}>
        ITALIA
      </Title>
      <Sub y={37} fill={C.ink}>
        ROMA
      </Sub>
    </Frame>
  )
}

function Francia({ uid }) {
  // La Torre Eiffel recortada contra un cielo coral
  return (
    <Frame uid={uid}>
      <rect x="7" y="7" width="86" height="118" fill={C.coral} />
      <circle cx="72" cy="46" r="10" fill={C.peach} />
      <path d="M7 104 H93 V125 H7 Z" fill={C.navy} />
      <path d="M7 104 Q20 96 30 104 Q42 94 52 104 Q66 96 76 104 Q86 98 93 104 Z" fill={C.green} />
      <g fill={C.ink}>
        <path d="M49 26 H51 L52 38 H48 Z" />
        <path d="M47.5 38 H52.5 L56 62 H44 Z" />
        <path d="M42 62 H58 L68 104 H60 Q50 86 40 104 H32 Z" />
        <rect x="40" y="61" width="20" height="3" />
        <rect x="35" y="80" width="30" height="3" />
      </g>
      <Title y={24} fill={C.cream} size={18}>
        París
      </Title>
      <Sub y={119}>F R A N C I A</Sub>
    </Frame>
  )
}

function Mexico({ uid }) {
  // La pirámide de Chichén Itzá entre la selva
  return (
    <Frame uid={uid}>
      <Bands colors={['#7fc4c0', '#a6d7cf', '#cbe7dc']} />
      <circle cx="74" cy="42" r="8" fill={C.yellow} />
      <path d="M7 96 Q18 84 28 92 Q40 80 52 90 Q66 80 78 90 Q88 84 93 92 V125 H7 Z" fill={C.green} />
      <g fill={C.stone} stroke={C.brown} strokeWidth="0.8">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={24 + i * 5} y={104 - i * 9} width={52 - i * 10} height="9" />
        ))}
        <rect x="44" y="51" width="12" height="8" />
      </g>
      <path d="M45 104 V60 H55 V104 Z" fill={C.tan} stroke={C.brown} strokeWidth="0.8" />
      <path d="M45 66 H55 M45 74 H55 M45 82 H55 M45 90 H55 M45 98 H55" stroke={C.brown} strokeWidth="0.6" />
      <rect x="47.5" y="53" width="5" height="6" fill={C.brown} />
      <rect x="7" y="104" width="86" height="21" fill={C.deepGreen} />
      <Title y={26} fill={C.cream} size={16} stroke={C.ink} spacing={1.5}>
        MÉXICO
      </Title>
      <Sub y={118}>CHICHÉN ITZÁ</Sub>
    </Frame>
  )
}

function Japon({ uid }) {
  // El monte Fuji, una pagoda y flores de cerezo
  return (
    <Frame uid={uid}>
      <Bands colors={['#ffd88a', '#fbc56a', '#f6a85e']} />
      <circle cx="70" cy="34" r="9" fill={C.coral} />
      <path d="M7 78 L40 40 L52 52 L58 46 L93 80 V125 H7 Z" fill="#8fa4c4" />
      <path d="M33 48 L40 40 L47 48 L43 47 L40 50 L37 47 Z" fill={C.snow} />
      <path d="M7 92 Q30 80 50 88 T93 86 V125 H7 Z" fill={C.green} />
      <g fill={C.navy}>
        <rect x="47.5" y="40" width="1.4" height="12" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M${36 + i * 1.5} ${56 + i * 9} H${61 - i * 1.5} l4 -4 H${32 + i * 1.5} Z`} />
            <rect x={41 + i} y={56 + i * 9} width={16 - i * 2} height="5" fill={C.coral} />
          </g>
        ))}
      </g>
      {[
        [20, 96],
        [27, 92],
        [74, 94],
        [82, 98],
        [14, 103],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill={C.rose} />
      ))}
      <rect x="7" y="104" width="86" height="21" fill={C.navy} />
      <Title y={120} fill={C.coral} size={15} spacing={1}>
        JAPÓN
      </Title>
    </Frame>
  )
}

function Espana({ uid }) {
  // La Sagrada Familia al atardecer
  return (
    <Frame uid={uid}>
      <Bands colors={['#f6a07a', '#f9bf86', '#fcd98f', '#f5b36b']} />
      <circle cx="26" cy="40" r="8" fill={C.yellow} />
      <g fill="#5b3a5e">
        {[
          [34, 34],
          [43, 26],
          [52, 26],
          [61, 34],
        ].map(([x, y]) => (
          <path key={x} d={`M${x} 100 V${y + 12} L${x + 3.5} ${y} L${x + 7} ${y + 12} V100 Z`} />
        ))}
        <path d="M24 108 V78 L30 70 L36 78 V108 Z M66 108 V80 L72 72 L78 80 V108 Z M20 108 H82 V96 H20 Z" />
      </g>
      {[
        [37.5, 52],
        [46.5, 44],
        [55.5, 44],
        [64.5, 52],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.2" fill={C.yellow} />
      ))}
      <rect x="7" y="104" width="86" height="21" fill={C.navy} />
      <Title y={120} fill={C.peach} size={15} spacing={1.5}>
        ESPAÑA
      </Title>
    </Frame>
  )
}

function Marruecos({ uid }) {
  // Un arco de cerradura que enmarca las dunas y una palmera
  return (
    <Frame uid={uid}>
      <rect x="7" y="7" width="86" height="118" fill={C.teal} />
      <clipPath id={`${uid}-arch`}>
        <path d="M22 125 V62 Q22 40 50 34 Q78 40 78 62 V125 Z" />
      </clipPath>
      <g clipPath={`url(#${uid}-arch)`}>
        <Bands colors={['#fbd98a', '#f9b16a', '#f28f5a']} y={30} h={60} />
        <circle cx="58" cy="66" r="8" fill={C.yellow} />
        <path d="M22 100 Q40 84 58 96 T78 92 V125 H22 Z" fill={C.orange} />
        <path d="M22 110 Q46 98 78 108 V125 H22 Z" fill="#d9752f" />
        <path
          d="M36 100 V82 M36 82 q-6 -3 -10 0 M36 82 q6 -4 10 -1 M36 82 q-3 -5 -8 -6 M36 82 q3 -6 9 -6"
          stroke={C.green}
          strokeWidth="1.8"
          fill="none"
        />
      </g>
      <path d="M22 125 V62 Q22 40 50 34 Q78 40 78 62 V125" fill="none" stroke={C.cream} strokeWidth="2" />
      <Title y={24} fill={C.yellow} size={12.5} spacing={1}>
        MARRUECOS
      </Title>
    </Frame>
  )
}

// Por código de país (el mismo id que usa el resto del juego)
const POSTERS = {
  '032': Argentina,
  '076': Brasil,
  380: Italia,
  250: Francia,
  484: Mexico,
  392: Japon,
  724: Espana,
  504: Marruecos,
}

// El afiche del país, centrado en 0,0 como el resto de las pegatinas. Hasta completar el
// país se ve en blanco y negro (monoId: filtro definido en la maleta). Si el país todavía
// no tiene afiche, se muestra `fallback`.
export default function CountryPoster({ countryId, uid, complete, monoId, fallback }) {
  const Poster = POSTERS[countryId]
  if (!Poster) return fallback
  return (
    <g transform="translate(-31 -41) scale(0.62)" filter={complete ? undefined : `url(#${monoId})`}>
      <Poster uid={uid} />
    </g>
  )
}
