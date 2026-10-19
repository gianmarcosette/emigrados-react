import { useId, useRef, useState } from 'react'
import { RESIDENCE_OPTIONS } from '../data/residence.js'
import { photoToDataUrl } from '../lib/image.js'
import { BIO_MAX, MAX_AGE, MIN_AGE, NAME_MAX, buildProfile, validateProfile } from '../state/profile.js'
import Avatar from './Avatar.jsx'

export default function ProfileForm({ initial, onSave, onCancel, submitLabel = 'Guardar perfil' }) {
  const id = useId()
  const fileInput = useRef(null)
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    age: initial?.age ?? '',
    bio: initial?.bio ?? '',
    country: initial?.country ?? '',
    photo: initial?.photo ?? null,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [loadingPhoto, setLoadingPhoto] = useState(false)

  function update(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    // Después del primer intento de guardar, los errores se actualizan mientras se escribe.
    if (submitted) setErrors(validateProfile(next))
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPhotoError('')
    setLoadingPhoto(true)
    try {
      update('photo', await photoToDataUrl(file))
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setLoadingPhoto(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const found = validateProfile(form)
    setErrors(found)
    if (Object.keys(found).length === 0) onSave(buildProfile(form, initial))
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <div className="profile-form__photo">
        <button
          type="button"
          className="photo-picker"
          onClick={() => fileInput.current?.click()}
          aria-label={form.photo ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
        >
          <Avatar profile={{ name: form.name, photo: form.photo }} size="lg" />
          <span className="photo-picker__label">
            {loadingPhoto ? 'Cargando…' : form.photo ? 'Cambiar foto' : 'Subir foto'}
          </span>
        </button>
        <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={handlePhoto} tabIndex={-1} />
        {form.photo && (
          <button type="button" className="btn btn--text" onClick={() => update('photo', null)}>
            Quitar foto
          </button>
        )}
        {photoError && <p className="field__error">{photoError}</p>}
      </div>

      <div className="profile-form__fields">
        <div className="field">
          <label htmlFor={`${id}-name`}>Nombre</label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="given-name"
            value={form.name}
            maxLength={NAME_MAX}
            placeholder="¿Cómo te llamás?"
            aria-invalid={Boolean(errors.name)}
            onChange={(e) => update('name', e.target.value)}
          />
          {errors.name && <p className="field__error">{errors.name}</p>}
        </div>

        <div className="field field--short">
          <label htmlFor={`${id}-age`}>Edad</label>
          <input
            id={`${id}-age`}
            type="number"
            inputMode="numeric"
            min={MIN_AGE}
            max={MAX_AGE}
            value={form.age}
            placeholder="Años"
            aria-invalid={Boolean(errors.age)}
            onChange={(e) => update('age', e.target.value)}
          />
          {errors.age && <p className="field__error">{errors.age}</p>}
        </div>

        <div className="field">
          <label htmlFor={`${id}-country`}>País donde vivís</label>
          <select
            id={`${id}-country`}
            value={form.country}
            autoComplete="country"
            aria-invalid={Boolean(errors.country)}
            onChange={(e) => update('country', e.target.value)}
          >
            <option value="">Elegí un país…</option>
            {RESIDENCE_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && <p className="field__error">{errors.country}</p>}
        </div>

        <div className="field">
          <label htmlFor={`${id}-bio`}>
            Sobre vos <span className="muted">(opcional)</span>
          </label>
          <textarea
            id={`${id}-bio`}
            rows={3}
            value={form.bio}
            maxLength={BIO_MAX}
            placeholder="De dónde venís, qué te trajo hasta acá…"
            aria-invalid={Boolean(errors.bio)}
            onChange={(e) => update('bio', e.target.value)}
          />
          <p className="field__hint">
            {form.bio.length}/{BIO_MAX}
          </p>
          {errors.bio && <p className="field__error">{errors.bio}</p>}
        </div>

        <div className="actions">
          <button type="submit" className="btn btn--primary" disabled={loadingPhoto}>
            {submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              {initial ? 'Cancelar' : 'Seguir sin perfil'}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
