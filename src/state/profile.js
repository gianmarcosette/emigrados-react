// Perfil del jugador: validación y normalización (sin React, para testear).
import { isCountryCode } from '../data/residence.js'

export const MIN_AGE = 16
export const MAX_AGE = 120
export const NAME_MAX = 40
export const BIO_MAX = 200

// Código de pasajero como el localizador de una reserva aérea: 6 caracteres,
// sin los que se confunden al leerlos (0/O, 1/I/L).
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
export const CODE_PATTERN = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`)

export function generatePassengerCode(random = cryptoRandom) {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)]).join('')
}

function cryptoRandom() {
  const [n] = globalThis.crypto.getRandomValues(new Uint32Array(1))
  return n / 2 ** 32
}

/** Devuelve { campo: mensaje } con los errores; vacío si el perfil es válido. */
export function validateProfile({ name, age, bio, country }) {
  const errors = {}
  const cleanName = (name ?? '').trim()
  if (!cleanName) errors.name = 'Contanos cómo te llamás.'
  else if (cleanName.length > NAME_MAX) errors.name = `Usá hasta ${NAME_MAX} caracteres.`

  const n = Number(age)
  if (age === '' || age === null || age === undefined || !Number.isInteger(n)) errors.age = 'Ingresá tu edad en años.'
  else if (n < MIN_AGE) errors.age = `Emigrados es para personas de ${MIN_AGE} años o más.`
  else if (n > MAX_AGE) errors.age = 'Revisá la edad ingresada.'

  // El país donde vivís conecta a las personas en el modo online
  if (!isCountryCode(country)) errors.country = 'Elegí el país donde vivís hoy.'

  if ((bio ?? '').length > BIO_MAX) errors.bio = `Usá hasta ${BIO_MAX} caracteres.`
  return errors
}

/** Arma el perfil a guardar a partir del formulario, conservando la fecha de creación. */
export function buildProfile(form, previous, now = new Date().toISOString()) {
  return {
    name: form.name.trim(),
    age: Number(form.age),
    bio: (form.bio ?? '').trim(),
    country: isCountryCode(form.country) ? form.country : null,
    photo: form.photo ?? null,
    code: previous?.code ?? generatePassengerCode(),
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
      // Los perfiles anteriores no tenían país: se pide al completar el perfil
      country: isCountryCode(data.country) ? data.country : null,
      photo: typeof data.photo === 'string' && data.photo.startsWith('data:image/') ? data.photo : null,
      // Los perfiles creados antes de que existiera el código reciben uno nuevo
      code: typeof data.code === 'string' && CODE_PATTERN.test(data.code) ? data.code : generatePassengerCode(),
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : null,
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : null,
    }
  }
  if (typeof legacyName === 'string' && legacyName.trim()) {
    return {
      name: legacyName.trim(),
      age: null,
      bio: '',
      country: null,
      photo: null,
      code: generatePassengerCode(),
      createdAt: null,
      updatedAt: null,
    }
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
