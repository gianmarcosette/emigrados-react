import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import { COUNTRIES } from '../data/countries.js'
import { useJourney } from '../state/useJourney.js'

export default function Home() {
  const { name, dispatch, answeredCount, totalQuestions, pins } = useJourney()
  const started = answeredCount > 0

  return (
    <div className="home">
      <section className="hero">
        <svg className="hero__flight" viewBox="0 0 600 160" aria-hidden="true">
          <path id="flight-arc" d="M20 140 Q300 -40 580 140" className="hero__arc" />
          <text className="hero__plane">
            <textPath href="#flight-arc" startOffset="0%">
              ✈️
              <animate attributeName="startOffset" from="0%" to="100%" dur="9s" repeatCount="indefinite" />
            </textPath>
          </text>
        </svg>
        <p className="hero__tagline">El juego de preguntas creado para hablar de todo el proceso que implica emigrar.</p>
        <h1 className="hero__title">EMIGRADOS</h1>
        <p className="hero__lead">
          De lo que pensabas antes de irte, a lo que sentís en tu nuevo lugar y cómo te reinventaste. Un espacio seguro
          para conocerte más y entender por qué estás donde estás.
        </p>

        <label className="namefield">
          <span>¿Cómo te llamás?</span>
          <input
            type="text"
            value={name}
            maxLength={30}
            placeholder="Tu nombre (opcional)"
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
          />
        </label>
        {name.trim() && <p className="hero__hello">¡Buen viaje, {name.trim()}! 🧭</p>}
      </section>

      <section className="modes" aria-label="Elegí cómo jugar">
        <Link to="/individual" className="mode mode--individual">
          <span className="mode__icon" aria-hidden="true">🧍</span>
          <h2>Individual</h2>
          <p>
            Preguntas al azar. Tus respuestas se guardan con fecha y cada una clava un 📍 en el mapa: respondé las{' '}
            {totalQuestions} y das la vuelta al mundo.
          </p>
          {started ? (
            <ProgressBar value={answeredCount} max={totalQuestions} label="Tu vuelta al mundo" />
          ) : (
            <span className="mode__cta">Empezar el viaje →</span>
          )}
        </Link>

        <Link to="/grupal" className="mode mode--grupal">
          <span className="mode__icon" aria-hidden="true">👥</span>
          <h2>Grupal</h2>
          <p>
            Para charlar entre amigos. Las preguntas van rotando entre los jugadores y nada queda guardado: lo que se
            dice en la mesa, queda en la mesa.
          </p>
          <span className="mode__cta">Armar la ronda →</span>
        </Link>

        <div className="mode mode--online" aria-disabled="true">
          <span className="mode__badge">Próximamente</span>
          <span className="mode__icon" aria-hidden="true">🌐</span>
          <h2>Online</h2>
          <p>Escribí una pregunta y alguien, en algún lugar del mundo, la responderá. Llega en la próxima etapa.</p>
        </div>
      </section>

      {started && (
        <section className="home__stats">
          <Link to="/mapa" className="statlink">
            📍 Visitaste <strong>{pins.length}</strong> de {COUNTRIES.length} países · Ver mi mapa →
          </Link>
          <Link to="/diario" className="statlink">
            📓 Releer mi diario →
          </Link>
        </section>
      )}

      <section className="howto">
        <h2>¿Cómo se juega?</h2>
        <ol>
          <li>
            <strong>Elegí un modo.</strong> Solo, para escribir y guardar lo que sentís; o en grupo, para conversar.
          </li>
          <li>
            <strong>Respondé con sinceridad.</strong> No hay respuestas correctas, ni puntos, ni apuro.
          </li>
          <li>
            <strong>Mirá tu recorrido.</strong> Si una pregunta vuelve, vas a poder comparar lo que contestaste antes y
            ver cómo cambiaste.
          </li>
        </ol>
      </section>
    </div>
  )
}
