import { Suspense, lazy, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import Wordmark from '../components/Wordmark.jsx'
import { Icaro, ModeIcon } from '../components/paper.jsx'
import { COUNTRIES } from '../data/countries.js'
import { QUESTIONS } from '../data/questions.js'
import { buildStickers } from '../lib/suitcase.js'
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

  return (
    <div className="home">
      <div className="home-sky">
        <section className="hero">
          <div className="hero__text">
            {/* Lo primero que se ve: Ícaro, que se lanza con el corazón en el pecho, entre pájaros */}
            <Icaro className="hero__icaro" />
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
      </div>

      <section className="modes" aria-label="Elegí cómo jugar">
        <Link to="/individual" className="mode mode--individual">
          <h2 className="mode__title">
            <ModeIcon mode="individual" />
            Individual
          </h2>
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
          <h2 className="mode__title">
            <ModeIcon mode="grupal" />
            Grupal
          </h2>
          <p>
            Para charlar entre amigos. Cada pregunta la contesta toda la mesa, de a uno, y nada queda guardado: lo que
            se dice en la mesa, queda en la mesa. No hace falta perfil.
          </p>
          <span className="mode__cta">Armar la ronda →</span>
        </Link>

        <Link to="/online" className="mode mode--online">
          <span className="mode__badge">Versión de prueba</span>
          <h2 className="mode__title">
            <ModeIcon mode="online" />
            Online
          </h2>
          <p>
            Elegí un país y te conectamos con alguien que vive ahí: un duelo de cultura general sobre el país del otro,
            cada uno a su ritmo. Cuando terminan los dos, se abre el chat.
          </p>
          <span className="mode__cta">{profile ? 'Ver mis duelos →' : 'Crear perfil y jugar →'}</span>
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
            <strong>Te toca una pregunta</strong> sobre tu migración.
          </li>
          <li>
            <strong>Escribís lo que sentís.</strong> No hay respuestas correctas, ni puntos, ni apuro.
          </li>
          <li>
            <strong>Sumás una pegatina a tu maleta.</strong> Si una pregunta vuelve, ves lo que contestaste antes y cómo
            cambiaste.
          </li>
        </ol>
      </section>
    </div>
  )
}
