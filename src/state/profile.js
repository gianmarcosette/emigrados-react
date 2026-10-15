// Perfil del modo individual: validación y normalización (sin React, para testear).

export const MIN_AGE = 16
export const MAX_AGE = 120
export const NAME_MAX = 40
export const BIO_MAX = 200

/** Devuelve { campo: mensaje } con los errores; vacío si el perfil es válido. */
export function validateProfile({ name, age, bio }) {
  const errors = {}
  const cleanName = (name ?? '').trim()
  if (!cleanName) errors.name = 'Contanos cómo te llamás.'
  else if (cleanName.length > NAME_MAX) errors.name = `Usá hasta ${NAME_MAX} caracteres.`

  const n = Number(age)
  if (age === '' || age === null || age === undefined || !Number.isInteger(n)) errors.age = 'Ingresá tu edad en años.'
  else if (n < MIN_AGE) errors.age = `Emigrados es para personas de ${MIN_AGE} años o más.`
  else if (n > MAX_AGE) errors.age = 'Revisá la edad ingresada.'

  if ((bio ?? '').length > BIO_MAX) errors.bio = `Usá hasta ${BIO_MAX} caracteres.`
  return errors
}

/** Arma el perfil a guardar a partir del formulario, conservando la fecha de creación. */
export function buildProfile(form, previous, now = new Date().toISOString()) {
  return {
    name: form.name.trim(),
    age: Number(form.age),
    bio: (form.bio ?? '').trim(),
    photo: form.photo ?? null,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  }
}

/** Acepta datos guardados (o la versión anterior, que solo tenía nombre) y devuelve un perfil o null. */
export function normalizeProfile(data, legacyName) {
  if (data && typeof data === 'object' && typeof data.name === 'string' && data.name.trim()) {
    return {
      name: data.name,
      age: Number.isInteger(data.age) ? data.age : null,
      bio: typeof data.bio === 'string' ? data.bio : '',
      photo: typeof data.photo === 'string' && data.photo.startsWith('data:image/') ? data.photo : null,
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : null,
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : null,
    }
  }
  if (typeof legacyName === 'string' && legacyName.trim()) {
    return { name: legacyName.trim(), age: null, bio: '', photo: null, createdAt: null, updatedAt: null }
  }
  return null
}

/** Un perfil está completo cuando tiene todo lo obligatorio (los migrados solo traen nombre). */
export function isProfileComplete(profile) {
  return Boolean(profile) && Object.keys(validateProfile(profile)).length === 0
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
}
