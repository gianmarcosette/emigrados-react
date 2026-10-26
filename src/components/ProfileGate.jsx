import { Link } from 'react-router-dom'
import { isProfileComplete } from '../state/profile.js'
import { useWindowScene } from '../state/scene.js'
import { useJourney } from '../state/useJourney.js'
import ProfileForm from './ProfileForm.jsx'
import Title from './Title.jsx'

// Lo que se guarda (respuestas, maleta, diario) necesita un perfil. Sin perfil solo se juega en grupo.
export default function ProfileGate({ children }) {
  const { profile } = useJourney()
  if (isProfileComplete(profile)) return children
  return <ProfileOnboarding profile={profile} />
}

function ProfileOnboarding({ profile }) {
  const { dispatch } = useJourney()
  useWindowScene('takeoff')

  return (
    <div className="page page--narrow">
      <header className="page__header">
        <p className="kicker">Antes de despegar</p>
        <Title>{profile ? 'Completá tu perfil de viaje' : 'Creá tu perfil de viaje'}</Title>
        <p className="muted">
          Tus respuestas, tu maleta y tu diario quedan guardados a tu nombre. Lleva menos de un minuto.
        </p>
      </header>
      <section className="panel">
        <ProfileForm
          initial={profile}
          submitLabel={profile ? 'Guardar y empezar' : 'Crear perfil y empezar'}
          onSave={(next) => dispatch({ type: 'saveProfile', profile: next })}
        />
      </section>
      <GroupInvite />
    </div>
  )
}

// Alternativa para quien no quiere crear un perfil
export function GroupInvite() {
  return (
    <p className="group-invite">
      ¿Preferís no crear un perfil? Podés jugar en el <Link to="/grupal">modo Grupal</Link>: es para charlar en ronda y
      nada queda guardado.
    </p>
  )
}
