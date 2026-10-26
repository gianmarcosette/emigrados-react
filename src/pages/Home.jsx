import { Suspense, lazy, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import PlaneWindow from '../components/PlaneWindow.jsx'
import SkyBanner, { MOTTO } from '../components/SkyBanner.jsx'
import WindowRow from '../components/illustrations/WindowRow.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Wordmark from '../components/Wordmark.jsx'
import { COUNTRIES } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { buildStickers } from '../lib/suitcase.js'
import { FirstFlightContext } from '../state/firstFlight.js'
import { useJourney } from '../state/useJourney.js'

// La maleta trae las siluetas de los países: se descarga aparte, recién cuando hay pegatinas
const Suitcase = lazy(() => import('../components/Suitcase.jsx'))

export default function Home() {
  const { profile, answers, route, answeredCount, totalQuestions, pins } = useJourney()
  const stickers = useMemo(
    () => buildStickers({ questions: QUESTIONS, countries: COUNTRIES, answers, route }),
    [answers, route],
  )
  const started = answeredCount > 0
  const openFirstFlight = useContext(FirstFlightContext)

  return (
    <div className="home">
      {/* Lo primero que se ve: el lema del juego, remolcado por una avioneta */}
      <SkyBanner hero>{MOTTO}</SkyBanner>

      <section className="hero">
        <div className="hero__window">
          <PlaneWindow scene={profile ? 'clouds' : 'takeoff'} />
        </div>
        <div className="hero__text">
          <h1 className="hero__title">
            <Wordmark />
          </h1>
          <p className="hero__lead">
            De lo que pensabas antes de irte, a lo que sentís en tu nuevo lugar y cómo te reinventaste. Un espacio
            seguro para conocerte más y entender <b>por qué estás donde estás.</b>
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
            Preguntas al azar. Tus respuestas se guardan con fecha y cada país suma una pegatina a tu maleta: respondé
            las {totalQuestions} y das la vuelta al mundo.
          </p>
          {started && profile ? (
            <>
              <Suspense fallback={null}>
                <Suitcase className="suitcase--mini" stickers={stickers} label="" />
              </Suspense>
              <ProgressBar value={answeredCount} max={totalQuestions} label="Tu vuelta al mundo" />
            </>
          ) : (
            <span className="mode__cta">{profile ? 'Empezar el viaje →' : 'Crear perfil y empezar →'}</span>
          )}
        </Link>

        <Link to="/grupal" className="mode mode--grupal">
          <h2>Grupal</h2>
          <p>
            Para charlar entre amigos. Las preguntas van rotando entre los jugadores y nada queda guardado: lo que se
            dice en la mesa, queda en la mesa. No hace falta perfil.
          </p>
          <span className="mode__cta">Armar la ronda →</span>
        </Link>

        <Link to="/online" className="mode mode--online">
          <span className="mode__badge">Versión de prueba</span>
          <h2>Online</h2>
          <p>
            Elegí un país y te conectamos con alguien que vive ahí: un duelo de cultura general para ver quién sabe más
            del país del otro.
          </p>
          <span className="mode__cta">{profile ? 'Buscar rival →' : 'Crear perfil y jugar →'}</span>
        </Link>
      </section>

      {started && (
        <section className="home__stats">
          <Link to="/maleta" className="statlink">
            <strong>{pins.length}</strong> de {COUNTRIES.length} pegatinas en tu maleta · Ver mi maleta →
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
        <button type="button" className="btn btn--ghost" onClick={openFirstFlight}>
          Ver el primer vuelo
        </button>
      </section>
    </div>
  )
}
