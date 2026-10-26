import { initials } from '../state/profile.js'
import PassengerAvatar from './PassengerAvatar.jsx'

// Foto de perfil, avatar dibujado (tu pasajero) o, si no hay ninguno, las iniciales.
export default function Avatar({ profile, size = 'md' }) {
  const label = profile?.name ? `${profile.photo ? 'Foto' : 'Avatar'} de ${profile.name}` : 'Perfil'
  const letters = initials(profile?.name).toUpperCase()
  const drawn = !profile?.photo && profile?.avatar
  return (
    <span className={`avatar avatar--me avatar--${size} ${drawn ? 'avatar--drawn' : ''}`} role="img" aria-label={label}>
      {drawn ? (
        <PassengerAvatar avatar={profile.avatar} size={null} label="" decorative />
      ) : profile?.photo ? (
        <img src={profile.photo} alt="" />
      ) : letters ? (
        letters
      ) : (
        <svg viewBox="0 0 64 64" className="avatar__silhouette" aria-hidden="true">
          <circle cx="32" cy="24" r="12" />
          <path d="M10 60c2-13 11-20 22-20s20 7 22 20Z" />
        </svg>
      )}
    </span>
  )
}
