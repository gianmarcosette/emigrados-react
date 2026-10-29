import { useId, useRef, useState } from 'react'
import { photoToDataUrl } from '../lib/image.js'
import { RESIDENCE_OPTIONS, countryName } from '../data/residence.js'
import {
  BIO_MAX,
  MAX_AGE,
  MIN_AGE,
  NAME_MAX,
  PREVIOUS_MAX,
  buildProfile,
  cleanPrevious,
  validateProfile,
} from '../state/profile.js'
import { randomAvatar } from '../lib/avatar.js'
import Avatar from './Avatar.jsx'
import AvatarEditor from './AvatarEditor.jsx'

export default function ProfileForm({ initial, onSave, onCancel, submitLabel = 'Guardar perfil' }) {
  const id = useId()
  const fileInput = useRef(null)
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    age: initial?.age ?? '',
    bio: initial?.bio ?? '',
    country: initial?.country ?? '',
    birthCountry: initial?.birthCountry ?? '',
    previousCountries: initial?.previousCountries ?? [],
    showOrigin: initial?.showOrigin ?? false,
    photo: initial?.photo ?? null,
    // Quien todavía no tiene avatar arranca con uno armado al azar, nunca con un círculo vacío
    avatar: initial?.avatar ?? randomAvatar(),
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
      {/* Tu pasajero: lo principal es el avatar dibujado; la foto queda como opción */}
      <section className="profile-form__avatar" aria-labelledby={`${id}-avatar-title`}>
        <h2 id={`${id}-avatar-title`} className="profile-form__section-title">
          Tu pasajero
        </h2>
        {form.photo ? (
          <div className="profile-form__photo">
            <Avatar profile={{ name: form.name, photo: form.photo }} size="lg" />
            <p className="muted">Estás usando una foto. Si la quitás, se muestra tu avatar dibujado.</p>
            <div className="actions actions--center">
              <button type="button" className="btn btn--ghost" onClick={() => fileInput.current?.click()}>
                Cambiar foto
              </button>
              <button type="button" className="btn btn--text" onClick={() => update('photo', null)}>
                Usar mi avatar
              </button>
            </div>
          </div>
        ) : (
          <AvatarEditor value={form.avatar} onChange={(next) => update('avatar', next)} />
        )}
        <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={handlePhoto} tabIndex={-1} />
        {!form.photo && (
          <p className="profile-form__photo-alt">
            <button
              type="button"
              className="btn--link"
              onClick={() => fileInput.current?.click()}
              disabled={loadingPhoto}
            >
              {loadingPhoto ? 'Cargando foto…' : 'O usar una foto en lugar del avatar'}
            </button>
          </p>
        )}
        {photoError && <p className="field__error">{photoError}</p>}
      </section>

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
            aria-describedby={`${id}-country-why`}
            onChange={(e) => update('country', e.target.value)}
          >
            <option value="">Elegí un país…</option>
            {RESIDENCE_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {/* Para qué se usa el dato, justo donde se pide */}
          <p id={`${id}-country-why`} className="field__why">
            Solo sirve para conectarte con personas de otros países en el modo Online. Se guarda en este dispositivo.
          </p>
          {errors.country && <p className="field__error">{errors.country}</p>}
        </div>

        {/* "Dónde naciste" y no "de dónde venís": quien ya emigró más de una vez no duda qué elegir */}
        <div className="field">
          <label htmlFor={`${id}-birth`}>
            ¿Dónde naciste? <span className="muted">(opcional)</span>
          </label>
          <select
            id={`${id}-birth`}
            value={form.birthCountry}
            aria-invalid={Boolean(errors.birthCountry)}
            onChange={(e) => update('birthCountry', e.target.value)}
          >
            <option value="">Prefiero no decirlo</option>
            {RESIDENCE_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.birthCountry && <p className="field__error">{errors.birthCountry}</p>}
        </div>

        <PreviousCountries
          id={id}
          value={cleanPrevious(form.previousCountries, form.country)}
          country={form.country}
          onChange={(next) => update('previousCountries', next)}
        />

        {(form.birthCountry || form.previousCountries.length > 0) && (
          <label className="relaxed-toggle">
            <input type="checkbox" checked={form.showOrigin} onChange={(e) => update('showOrigin', e.target.checked)} />
            <span className="relaxed-toggle__switch" aria-hidden="true" />
            <span>
              <strong>Mostrarlo en el modo Online</strong>
              Las personas con las que juegues van a ver dónde naciste y dónde viviste. Si no lo activás, solo lo ves
              vos.
            </span>
          </label>
        )}

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

// Países donde viviste antes del actual: se suman de a uno desde una lista y se quitan con un toque.
function PreviousCountries({ id, value, country, onChange }) {
  const full = value.length >= PREVIOUS_MAX
  const options = RESIDENCE_OPTIONS.filter((c) => c.code !== country && !value.includes(c.code))
  return (
    <div className="field">
      <label htmlFor={`${id}-previous`}>
        ¿Viviste en otros países antes? <span className="muted">(opcional)</span>
      </label>
      {value.length > 0 && (
        <ul className="previous-list" aria-label="Países donde viviste antes">
          {value.map((code) => (
            <li key={code}>
              <button
                type="button"
                className="chip chip--toggle previous-list__item"
                aria-label={`Quitar ${countryName(code)}`}
                onClick={() => onChange(value.filter((c) => c !== code))}
              >
                {countryName(code)}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <select
        id={`${id}-previous`}
        value=""
        disabled={full}
        aria-describedby={`${id}-previous-why`}
        onChange={(e) => e.target.value && onChange([...value, e.target.value])}
      >
        <option value="">{full ? `Hasta ${PREVIOUS_MAX} países` : 'Sumar un país…'}</option>
        {options.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
      <p id={`${id}-previous-why`} className="field__why">
        Para quien ya emigró más de una vez: por ejemplo, si naciste en Argentina, viviste en Italia y hoy vivís en
        Australia, sumá Italia.
      </p>
    </div>
  )
}
