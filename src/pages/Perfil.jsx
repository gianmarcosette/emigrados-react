import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import Diary from '../components/Diary.jsx'
import { GroupInvite } from '../components/ProfileGate.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import Title from '../components/Title.jsx'
import { COUNTRIES } from '../data/countries.js'
import { countryName } from '../data/residence.js'
import { plural } from '../lib/format.js'
import { isProfileComplete } from '../state/profile.js'
import { useConfirm } from '../state/confirm.js'
import { useJourney } from '../state/useJourney.js'

const memberSince = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })

export default function Perfil() {
  const { profile, dispatch, answeredCount, totalQuestions, pins } = useJourney()
  const complete = isProfileComplete(profile)
  const [editing, setEditing] = useState(!complete)
  const confirm = useConfirm()
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!justSaved) return undefined
    const timer = setTimeout(() => setJustSaved(false), 4000)
    return () => clearTimeout(timer)
  }, [justSaved])

  function save(next) {
    dispatch({ type: 'saveProfile', profile: next })
    setEditing(false)
    // Que se note que se guardó: un aviso que desaparece solo
    setJustSaved(true)
  }

  async function remove() {
    const ok = await confirm({
      title: '¿Borrar tu perfil?',
      message:
        'Se borran tu nombre, tu foto y tu código de pasajero. Tus respuestas, tu maleta y tu diario se mantienen en este dispositivo.',
      confirmLabel: 'Borrar perfil',
      danger: true,
    })
    if (ok) {
      dispatch({ type: 'deleteProfile' })
      setEditing(true)
    }
  }

  if (editing || !complete) {
    return (
      <div className="page page--narrow">
        <header className="page__header">
          <Title>{profile ? (complete ? 'Editar perfil' : 'Completá tu perfil') : 'Creá tu perfil'}</Title>
          <p className="muted">
            Tu perfil acompaña tus respuestas en el modo individual. Podés cambiarlo cuando quieras.
          </p>
        </header>
        <section className="panel">
          <ProfileForm
            initial={profile}
            onSave={save}
            onCancel={complete ? () => setEditing(false) : undefined}
            submitLabel={complete ? 'Guardar cambios' : 'Crear perfil'}
          />
        </section>
        <p className="privacy-note">
          Por ahora tu perfil y tus respuestas se guardan solo en este dispositivo. Nadie más puede verlos.
        </p>
        {!complete && <GroupInvite />}
      </div>
    )
  }

  const since = profile.createdAt ? memberSince.format(new Date(profile.createdAt)) : null

  return (
    <div className="page">
      <section className="profile-card">
        <Avatar profile={profile} size="lg" />
        {justSaved && (
          <p className="saved-toast" role="status">
            Perfil guardado
          </p>
        )}
        <h1 className="profile-card__name">{profile.name}</h1>
        <p className="profile-card__meta">
          {profile.age} años · Vive en {countryName(profile.country)}
          {since && ` · Viajando desde ${since}`}
        </p>
        <p className="passenger-code">
          <span>Código de pasajero</span>
          <strong>{profile.code}</strong>
        </p>
        {profile.bio && <p className="profile-card__bio">{profile.bio}</p>}

        <div className="profile-card__stats">
          <div>
            <strong>{answeredCount}</strong>
            <span>de {totalQuestions} preguntas</span>
          </div>
          <div>
            <strong>{pins.length}</strong>
            <span>de {COUNTRIES.length} países</span>
          </div>
        </div>

        <div className="actions actions--center">
          <button type="button" className="btn btn--ghost" onClick={() => setEditing(true)}>
            Editar perfil
          </button>
          <Link to="/individual" className="btn btn--primary">
            {answeredCount ? 'Seguir respondiendo' : 'Empezar el viaje'}
          </Link>
        </div>
      </section>

      <p className="privacy-note">
        Tu perfil se guarda solo en este dispositivo.{' '}
        {plural(answeredCount, 'respuesta guardada', 'respuestas guardadas')}.{' '}
        <button type="button" className="btn--link" onClick={remove}>
          Borrar perfil
        </button>
      </p>

      <Diary />
    </div>
  )
}
