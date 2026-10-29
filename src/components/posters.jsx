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

function Chile({ uid }) {
  // Las Torres del Paine sobre un lago turquesa
  return (
    <Frame uid={uid}>
      <Bands colors={['#8fc3e8', '#b5d8ef', '#dcecf4']} />
      <path d="M7 90 L20 72 L28 78 L36 66 L64 64 L74 74 L82 68 L93 80 V125 H7 Z" fill="#8a9bb2" />
      <g fill="#5d6675" stroke={C.ink} strokeWidth="0.8" strokeLinejoin="round">
        <path d="M31 92 L33 52 L36 46 L39 52 L41 92 Z" />
        <path d="M44 92 L46 42 L49.5 35 L53 42 L55 92 Z" />
        <path d="M58 92 L60 54 L63 48 L66 54 L68 92 Z" />
      </g>
      <g fill={C.snow}>
        <path d="M34.2 49 L36 46 L37.8 49 L36 50.5 Z" />
        <path d="M47.3 39 L49.5 35 L51.7 39 L49.5 41 Z" />
        <path d="M61.2 51 L63 48 L64.8 51 L63 52.5 Z" />
      </g>
      <rect x="7" y="90" width="86" height="16" fill="#3fb3c2" />
      <path d="M16 96 h14 M50 100 h18 M74 95 h10" stroke={C.cream} strokeWidth="1" />
      <path d="M7 106 Q24 100 40 106 Q60 98 93 106 V125 H7 Z" fill={C.green} />
      <Title y={26} fill={C.navy} size={20} spacing={2}>
        CHILE
      </Title>
      <rect x="7" y="112" width="86" height="13" fill={C.navy} />
      <Sub y={120.5}>TORRES DEL PAINE</Sub>
    </Frame>
  )
}

function Uruguay({ uid }) {
  // El Palacio Salvo de Montevideo y la rambla, al atardecer sobre el río
  return (
    <Frame uid={uid}>
      <Bands colors={['#f7b183', '#fbcf8f', '#fde6a8']} />
      <circle cx="74" cy="78" r="9" fill={C.orange} />
      <g fill={C.navy}>
        <path d="M32 98 V70 H40 V60 H45 V48 H47.5 V40 Q50 34 52.5 40 V48 H55 V60 H60 V70 H68 V98 Z" />
        <rect x="49.5" y="30" width="1" height="5" />
      </g>
      <path
        d="M36 76 h28 M36 82 h28 M36 88 h28 M36 94 h28 M42 66 h16 M47 54 h6"
        stroke={C.yellow}
        strokeWidth="1"
        strokeDasharray="1.5 1.5"
      />
      <path d="M7 92 Q16 88 24 94 V98 H7 Z M76 94 Q84 88 93 92 V98 H76 Z" fill={C.navy} />
      <rect x="7" y="98" width="86" height="27" fill="#8a5f4a" />
      <rect x="7" y="98" width="86" height="3" fill={C.cream} />
      <path d="M12 108 h16 M40 114 h22 M70 106 h16" stroke="#f3c08f" strokeWidth="1.2" />
      <Title y={24} fill={C.navy} size={15} spacing={1}>
        URUGUAY
      </Title>
      <Sub y={121} fill={C.cream}>
        MONTEVIDEO
      </Sub>
    </Frame>
  )
}

function Colombia({ uid }) {
  // Las casas de colores con balcones de Cartagena, con la catedral atrás
  const houses = [
    { x: 7, w: 29, fill: C.yellow },
    { x: 36, w: 28, fill: C.coral },
    { x: 64, w: 29, fill: C.teal },
  ]
  return (
    <Frame uid={uid}>
      <Bands colors={['#7cc6e6', '#a8dbee', '#d2edf4']} />
      <g fill={C.cream} stroke={C.ink} strokeWidth="0.8">
        <path d="M44 66 V46 L50 37 L56 46 V66 Z" />
        <circle cx="50" cy="50" r="2" fill={C.ink} />
      </g>
      {houses.map(({ x, w, fill }) => (
        <g key={x}>
          <rect x={x} y="62" width={w} height="63" fill={fill} stroke={C.ink} strokeWidth="0.8" />
          <rect x={x + 3} y="74" width={w - 6} height="3" fill={C.brown} />
          <path d={`M${x + 4} 77 v8 M${x + w / 2} 77 v8 M${x + w - 4} 77 v8`} stroke={C.brown} strokeWidth="1" />
          <rect x={x + w / 2 - 4} y="96" width="8" height="13" rx="4" fill={C.brown} />
          <rect x={x + 5} y="64" width="6" height="8" fill={C.cream} stroke={C.ink} strokeWidth="0.5" />
          <rect x={x + w - 11} y="64" width="6" height="8" fill={C.cream} stroke={C.ink} strokeWidth="0.5" />
        </g>
      ))}
      {[
        [12, 74],
        [16, 72],
        [40, 73],
        [88, 74],
        [84, 72],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.4" fill={C.rose} />
      ))}
      <Title y={24} fill={C.navy} size={14} stroke={C.cream} spacing={1}>
        COLOMBIA
      </Title>
      <rect x="7" y="112" width="86" height="13" fill={C.navy} />
      <Sub y={120.5}>CARTAGENA</Sub>
    </Frame>
  )
}

function Peru({ uid }) {
  // Machu Picchu con el Huayna Picchu detrás y las terrazas de piedra
  return (
    <Frame uid={uid}>
      <Bands colors={['#cfe3e8', '#e3eee9', '#f2f2e6']} />
      <path d="M7 70 L22 52 L32 60 L44 46 L54 58 V125 H7 Z" fill="#9db3b5" />
      <path d="M46 125 Q54 74 62 46 Q66 36 72 40 Q80 50 86 72 L93 84 V125 Z" fill={C.deepGreen} />
      <path d="M7 92 Q30 84 52 90 Q70 94 93 92 V125 H7 Z" fill={C.green} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${12 + i * 3} ${98 + i * 6} H${88 - i * 3}`} stroke="#2a5a3d" strokeWidth="1.2" />
      ))}
      <g fill={C.stone} stroke={C.brown} strokeWidth="0.6">
        <rect x="22" y="86" width="9" height="6" />
        <rect x="34" y="83" width="12" height="7" />
        <rect x="50" y="85" width="8" height="6" />
        <path d="M34 83 L40 79 L46 83 Z M22 86 L26.5 83 L31 86 Z" />
      </g>
      <path d="M20 40 q6 -4 12 0 q5 -3 10 1 h-22 z M60 30 q5 -3 10 0 h-10 z" fill={C.cream} />
      <Title y={29} fill={C.coral} size={19} stroke={C.ink} spacing={2}>
        PERÚ
      </Title>
      <rect x="7" y="112" width="86" height="13" fill={C.navy} />
      <Sub y={120.5}>MACHU PICCHU</Sub>
    </Frame>
  )
}

function Venezuela({ uid }) {
  // El Salto Ángel cayendo de un tepuy, sobre la selva
  return (
    <Frame uid={uid}>
      <Bands colors={['#9fd2e3', '#c2e3e9', '#e2f1ea']} />
      <path
        d="M12 125 L15 54 Q15 46 22 45 H70 Q78 46 80 54 L86 125 Z"
        fill="#b5694a"
        stroke={C.ink}
        strokeWidth="0.8"
      />
      <path d="M22 45 H70 Q78 46 80 54 H15 Q15 46 22 45 Z" fill={C.green} />
      <path d="M24 60 V96 M34 58 V90 M64 60 V94 M72 62 V100" stroke="#8f4f37" strokeWidth="1" />
      <rect x="47" y="52" width="4" height="52" fill={C.snow} />
      <rect x="48.4" y="52" width="1.2" height="52" fill="#cfe9f2" />
      <circle cx="47" cy="103" r="5" fill={C.snow} />
      <circle cx="53" cy="104" r="4" fill={C.snow} />
      <path d="M7 104 Q16 96 26 102 Q34 94 44 104 Q56 96 66 102 Q78 94 93 102 V125 H7 Z" fill={C.green} />
      <path d="M7 112 Q24 106 40 112 Q60 104 93 112 V125 H7 Z" fill={C.deepGreen} />
      <Title y={26} fill={C.yellow} size={12} stroke={C.ink} spacing={1}>
        VENEZUELA
      </Title>
      <Sub y={120.5}>SALTO ÁNGEL</Sub>
    </Frame>
  )
}

function Australia({ uid }) {
  // La Ópera de Sídney y el puente de la bahía
  return (
    <Frame uid={uid}>
      <Bands colors={['#7fb6e6', '#a6cdee', '#cfe3f3']} />
      <circle cx="76" cy="40" r="8" fill={C.yellow} />
      <path d="M7 86 Q30 54 56 86" fill="none" stroke={C.navy} strokeWidth="2.4" />
      <path d="M7 86 H60" stroke={C.navy} strokeWidth="2" />
      <path d="M15 86 V76 M25 86 V68 M35 86 V66 M45 86 V70" stroke={C.navy} strokeWidth="0.8" />
      <rect x="7" y="94" width="86" height="31" fill={C.sky} />
      <rect x="30" y="90" width="58" height="5" fill={C.stone} stroke={C.ink} strokeWidth="0.6" />
      <g fill={C.snow} stroke={C.ink} strokeWidth="0.8" strokeLinejoin="round">
        <path d="M34 90 Q36 70 50 62 Q47 76 48 90 Z" />
        <path d="M46 90 Q50 66 64 58 Q60 74 62 90 Z" />
        <path d="M60 90 Q64 72 76 66 Q73 78 75 90 Z" />
        <path d="M73 90 Q76 78 85 74 Q83 82 85 90 Z" />
      </g>
      <path d="M14 104 h16 M44 111 h24 M74 102 h12" stroke={C.cream} strokeWidth="1.2" />
      <Title y={24} fill={C.coral} size={13} stroke={C.cream} spacing={1}>
        AUSTRALIA
      </Title>
      <Sub y={120}>SÍDNEY</Sub>
    </Frame>
  )
}

function Alemania({ uid }) {
  // La Puerta de Brandeburgo, en Berlín
  const columns = [24, 32, 40, 56, 64, 72]
  return (
    <Frame uid={uid}>
      <Bands colors={['#b9d3e6', '#d3e2ec', '#e9eef0']} />
      <g fill={C.stone} stroke={C.ink} strokeWidth="0.8">
        <rect x="18" y="64" width="64" height="9" />
        <rect x="34" y="57" width="32" height="7" />
        <rect x="16" y="98" width="68" height="5" />
        {columns.map((x) => (
          <rect key={x} x={x} y="73" width="4" height="25" />
        ))}
      </g>
      <path d="M40 57 L42 49 L46 47 L50 44 L54 47 L58 49 L60 57 Z" fill={C.green} stroke={C.ink} strokeWidth="0.6" />
      <path d="M50 44 V39" stroke={C.ink} strokeWidth="1" />
      <rect x="7" y="103" width="86" height="22" fill="#8f9bab" />
      <path d="M44 125 L46 103 H54 L56 125 Z" fill="#b9c2cc" />
      <Title y={26} fill={C.ink} size={14} spacing={1}>
        ALEMANIA
      </Title>
      <rect x="7" y="112" width="86" height="13" fill={C.ink} />
      <Sub y={120.5} fill={C.yellow}>
        BERLÍN
      </Sub>
    </Frame>
  )
}

function EstadosUnidos({ uid }) {
  // La Estatua de la Libertad frente a los rascacielos de Nueva York
  return (
    <Frame uid={uid}>
      <Bands colors={['#f6b48f', '#f9cc9c', '#fbe2b3']} />
      <g fill="#7e86a3">
        <rect x="9" y="70" width="8" height="30" />
        <rect x="18" y="60" width="7" height="40" />
        <rect x="66" y="64" width="8" height="36" />
        <path d="M76 100 V56 L80 46 L84 56 V100 Z" />
        <rect x="85" y="72" width="8" height="28" />
      </g>
      <rect x="7" y="100" width="86" height="25" fill={C.navy} />
      <g fill="#7fb8a4" stroke={C.ink} strokeWidth="0.8" strokeLinejoin="round">
        <rect x="42" y="90" width="16" height="12" fill={C.stone} />
        <path d="M44 90 L46 58 Q50 54 54 58 L56 90 Z" />
        <circle cx="50" cy="52" r="3.2" />
        <path d="M53 60 L57 40 L59 41 L56 61 Z" />
        <path d="M45 66 L42 72 L46 74 Z" />
      </g>
      <path d="M47 50 L45.5 46 M50 49 V45 M53 50 L54.5 46" stroke={C.ink} strokeWidth="0.8" />
      <path d="M58 40 Q56 35 58.5 32 Q61 35 59 40 Z" fill={C.orange} />
      <path d="M14 108 h14 M66 112 h18" stroke={C.cream} strokeWidth="1.2" />
      <Title y={22} fill={C.navy} size={8.8} spacing={0.2}>
        ESTADOS UNIDOS
      </Title>
      <Sub y={120}>NUEVA YORK</Sub>
    </Frame>
  )
}

function NuevaZelanda({ uid }) {
  // El pico Mitre reflejado en el fiordo de Milford Sound
  return (
    <Frame uid={uid}>
      <Bands colors={['#8ec7d9', '#b4dbe3', '#d9eeee']} />
      <path d="M7 88 L26 64 L42 28 L50 52 L62 46 L78 64 L93 70 V88 Z" fill={C.deepGreen} />
      <path d="M38 38 L42 28 L45 37 L42 35 Z" fill={C.snow} />
      <path d="M7 88 L18 74 L30 82 L40 74 L50 84 L62 78 L76 84 L93 76 V88 Z" fill={C.green} />
      <rect x="7" y="88" width="86" height="37" fill={C.teal} />
      <path d="M7 88 L26 108 L42 122 L50 102 L62 106 L78 96 L93 92 V88 Z" fill="#256b5f" opacity="0.7" />
      <path d="M16 96 h12 M54 112 h16 M76 100 h10" stroke={C.cream} strokeWidth="1" />
      <Title y={22} fill={C.navy} size={9} spacing={0.2}>
        NUEVA ZELANDA
      </Title>
      <Sub y={120}>MILFORD SOUND</Sub>
    </Frame>
  )
}

function Irlanda({ uid }) {
  // Los acantilados de Moher, con su torre, frente al Atlántico
  return (
    <Frame uid={uid}>
      <Bands colors={['#c8d8e2', '#dbe5ea', '#eef1ee']} />
      <path d="M22 44 q6 -5 12 -1 q6 -5 12 1 h-24 z M60 36 q5 -4 10 0 q4 -3 8 1 h-18 z" fill={C.snow} />
      <rect x="7" y="78" width="86" height="47" fill={C.navy} />
      <path d="M93 60 L60 64 L58 125 H93 Z" fill="#6f5a4a" stroke={C.ink} strokeWidth="0.6" />
      <path d="M93 56 L60 62 L60 66 L93 60 Z" fill={C.green} />
      <path d="M58 72 L34 76 L36 125 H58 Z" fill="#8a7563" stroke={C.ink} strokeWidth="0.6" />
      <path d="M58 70 L34 74 L34 77 L58 73 Z" fill={C.green} />
      <path d="M32 82 L14 84 L16 125 H32 Z" fill="#a39080" />
      <path d="M32 80 L14 82 V85 L32 83 Z" fill="#7fb06a" />
      <path d="M64 76 v40 M72 74 v42 M80 72 v44 M42 82 v34 M50 80 v38" stroke="#5b4a3d" strokeWidth="0.8" />
      <g fill={C.stone} stroke={C.ink} strokeWidth="0.6">
        <rect x="76" y="49" width="5" height="9" />
        <path d="M75.5 49 h6 v-1.5 h-6 z" />
      </g>
      <path d="M8 100 h14 M10 112 h10" stroke={C.cream} strokeWidth="1" />
      <Title y={26} fill={C.green} size={16} spacing={1.5}>
        IRLANDA
      </Title>
      <rect x="7" y="112" width="86" height="13" fill={C.navy} />
      <Sub y={120.5} fill={C.cream}>
        MOHER
      </Sub>
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
  152: Chile,
  858: Uruguay,
  170: Colombia,
  604: Peru,
  862: Venezuela,
  '036': Australia,
  276: Alemania,
  840: EstadosUnidos,
  554: NuevaZelanda,
  372: Irlanda,
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
