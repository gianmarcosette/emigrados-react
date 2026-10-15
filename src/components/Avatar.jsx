import { initials } from '../state/profile.js'

// Foto de perfil o, si no hay, las iniciales (o una silueta) sobre un círculo.
export default function Avatar({ profile, size = 'md' }) {
  const label = profile?.name ? `Foto de ${profile.name}` : 'Perfil'
  const letters = initials(profile?.name).toUpperCase()
  return (
    <span className={`avatar avatar--me avatar--${size}`} role="img" aria-label={label}>
      {profile?.photo ? (
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
