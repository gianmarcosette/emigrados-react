import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import PlaneWindow from '../components/PlaneWindow.jsx'
import WindowRow from '../components/illustrations/WindowRow.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Wordmark from '../components/Wordmark.jsx'
import { COUNTRIES } from '../data/countries.js'
import { useJourney } from '../state/useJourney.js'

export default function Home() {
  const { profile, answeredCount, totalQuestions, pins } = useJourney()
  const started = answeredCount > 0

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__window">
          <PlaneWindow scene={profile ? 'clouds' : 'takeoff'} />
        </div>
        <div className="hero__text">
        <h1 className="hero__title">
          <Wordmark />
        </h1>
        <p className="hero__tagline">El juego de preguntas creado para hablar de todo el proceso que implica emigrar.</p>
        <p className="hero__lead">
          De lo que pensabas antes de irte, a lo que sentís en tu nuevo lugar y cómo te reinventaste. Un espacio seguro
          para conocerte más y entender por qué estás donde estás.
        </p>

        {profile ? (
          <Link to="/perfil" className="hero__profile">
            <Avatar profile={profile} size="md" />
            <span>
              ¡Buen viaje, {profile.name.split(' ')[0]}!<small>Ver mi perfil</small>
            </span>
          </Link>
        ) : (
          <Link to="/perfil" className="btn btn--hero">
            Creá tu perfil
          </Link>
        )}
        </div>
      </section>

      <WindowRow />

      <section className="modes" aria-label="Elegí cómo jugar">
        <Link to="/individual" className="mode mode--individual">
          <h2>Individual</h2>
          <p>
            Preguntas al azar. Tus respuestas se guardan con fecha y cada una marca un país en el mapa: respondé las{' '}
            {totalQuestions} y das la vuelta al mundo.
          </p>
          {started ? (
            <ProgressBar value={answeredCount} max={totalQuestions} label="Tu vuelta al mundo" />
          ) : (
            <span className="mode__cta">Empezar el viaje →</span>
          )}
        </Link>

        <Link to="/grupal" className="mode mode--grupal">
          <h2>Grupal</h2>
          <p>
            Para charlar entre amigos. Las preguntas van rotando entre los jugadores y nada queda guardado: lo que se
            dice en la mesa, queda en la mesa.
          </p>
          <span className="mode__cta">Armar la ronda →</span>
        </Link>

        <div className="mode mode--online" aria-disabled="true">
          <span className="mode__badge">Próximamente</span>
          <h2>Online</h2>
          <p>Escribí una pregunta y alguien, en algún lugar del mundo, la responderá. Llega en la próxima etapa.</p>
        </div>
      </section>

      {started && (
        <section className="home__stats">
          <Link to="/mapa" className="statlink">
            Visitaste <strong>{pins.length}</strong> de {COUNTRIES.length} países · Ver mi mapa →
          </Link>
          <Link to="/perfil#diario" className="statlink">
            Releer mi diario →
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
