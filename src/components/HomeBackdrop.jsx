import { PAPER } from '../lib/paper.js'
import { House, Star, Swallow } from './paper.jsx'

// Fondo del inicio: una ruta punteada sale de una casa, cruza por detrás del logo y se va
// con una bandada de golondrinas hacia un barrio nuevo. Es la historia del juego: irse de un
// lugar y llegar a otro. En la compu ocupa todo el ancho; en el celular, una versión angosta.
const { cream, coral, yellow, navy, green } = PAPER
const PEACH = '#f6b48f'

function Flock({ birds }) {
  return birds.map(([x, y, s, color], i) => <Swallow key={i} x={x} y={y} s={s} fill={color} rot={-30} />)
}

function Route({ d }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={cream}
      strokeOpacity="0.55"
      strokeWidth="4"
      strokeDasharray="2 16"
      strokeLinecap="round"
    />
  )
}

export default function HomeBackdrop() {
  return (
    <div className="home-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMax slice" className="home-backdrop__wide">
        <Route d="M168 690 C330 640 250 330 420 220 S 860 140 1080 200 S 1300 150 1480 40" />
        <House x={120} y={760} w={110} h={86} roof={56} wall={coral} top={navy} />
        <Flock
          birds={[
            [1150, 168, 0.42, cream],
            [1222, 140, 0.36, cream],
            [1286, 112, 0.31, yellow],
            [1342, 88, 0.27, cream],
            [1392, 68, 0.23, coral],
          ]}
        />
        <Star x={250} y={150} r={22} fill={yellow} seed={2} />
        <Star x={1180} y={560} r={16} fill={PEACH} seed={5} />
        {/* El barrio nuevo, del otro lado */}
        <House x={1250} y={760} w={74} h={70} roof={40} wall={yellow} top={coral} />
        <House x={1340} y={760} w={92} h={112} roof={50} wall={green} top={navy} window={yellow} />
        <House x={1420} y={760} w={70} h={60} roof={36} wall={PEACH} top={green} />
      </svg>
      <svg viewBox="0 0 390 560" preserveAspectRatio="xMidYMax slice" className="home-backdrop__narrow">
        <Route d="M50 500 C6 420 4 240 26 150 S 150 70 280 84 S 380 60 420 50" />
        <House x={44} y={560} w={56} h={46} roof={30} wall={coral} top={navy} />
        <Flock
          birds={[
            [292, 80, 0.24, cream],
            [330, 68, 0.2, yellow],
            [362, 58, 0.17, cream],
          ]}
        />
        <Star x={84} y={46} r={10} fill={yellow} seed={2} />
        <House x={326} y={560} w={42} h={40} roof={24} wall={yellow} top={coral} />
        <House x={372} y={560} w={50} h={62} roof={28} wall={green} top={navy} window={yellow} />
      </svg>
    </div>
  )
}
