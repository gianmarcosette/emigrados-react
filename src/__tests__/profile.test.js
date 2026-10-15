import { describe, expect, it } from 'vitest'
import { initialJourney, journeyReducer, loadJourney, saveJourney } from '../state/journey.js'
import {
  CODE_PATTERN,
  buildProfile,
  generatePassengerCode,
  initials,
  isProfileComplete,
  normalizeProfile,
  validateProfile,
} from '../state/profile.js'

function memoryStorage() {
  const data = {}
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => (data[k] = v) }
}

describe('validateProfile', () => {
  it('acepta un perfil completo', () => {
    expect(validateProfile({ name: 'Gian', age: '28', bio: '' })).toEqual({})
  })

  it('pide nombre y edad', () => {
    const errors = validateProfile({ name: '  ', age: '', bio: '' })
    expect(errors.name).toBeDefined()
    expect(errors.age).toBeDefined()
  })

  it('rechaza menores de 16 y edades no enteras', () => {
    expect(validateProfile({ name: 'A', age: '15' }).age).toMatch(/16/)
    expect(validateProfile({ name: 'A', age: '20.5' }).age).toBeDefined()
    expect(validateProfile({ name: 'A', age: '200' }).age).toBeDefined()
  })

  it('limita la descripción', () => {
    expect(validateProfile({ name: 'A', age: 30, bio: 'x'.repeat(201) }).bio).toBeDefined()
  })
})

describe('buildProfile', () => {
  it('limpia los datos y conserva la fecha de creación al editar', () => {
    const first = buildProfile({ name: ' Ana ', age: '30', bio: ' hola ', photo: null }, null, 't1')
    expect(first).toEqual({
      name: 'Ana',
      age: 30,
      bio: 'hola',
      photo: null,
      code: expect.stringMatching(CODE_PATTERN),
      createdAt: 't1',
      updatedAt: 't1',
    })
    const edited = buildProfile({ ...first, age: '31' }, first, 't2')
    expect(edited.code).toBe(first.code)
    expect(edited.createdAt).toBe('t1')
    expect(edited.updatedAt).toBe('t2')
  })
})

describe('perfil en el estado del juego', () => {
  it('se guarda, se borra y sobrevive al reinicio de respuestas', () => {
    const profile = buildProfile({ name: 'Ana', age: 30 }, null, 't')
    let s = journeyReducer(initialJourney, { type: 'saveProfile', profile })
    s = journeyReducer(s, { type: 'saveAnswer', questionId: 1, text: 'x' })
    s = journeyReducer(s, { type: 'reset' })
    expect(s.profile).toEqual(profile)
    expect(s.answers).toEqual({})
    expect(journeyReducer(s, { type: 'deleteProfile' }).profile).toBeNull()
  })

  it('persiste en el almacenamiento', () => {
    const storage = memoryStorage()
    const profile = buildProfile({ name: 'Ana', age: 30, photo: 'data:image/jpeg;base64,AAA' }, null, 't')
    saveJourney(journeyReducer(initialJourney, { type: 'saveProfile', profile }), storage)
    expect(loadJourney(storage).profile).toEqual(profile)
  })

  it('migra la versión anterior que solo guardaba el nombre', () => {
    const storage = memoryStorage()
    storage.setItem('emigrados:v1', JSON.stringify({ name: 'Gian', answers: {}, route: [] }))
    const { profile } = loadJourney(storage)
    expect(profile.name).toBe('Gian')
    expect(isProfileComplete(profile)).toBe(false)
  })

  it('descarta fotos que no son imágenes', () => {
    expect(normalizeProfile({ name: 'A', age: 20, photo: 'javascript:alert(1)' }).photo).toBeNull()
  })
})

it('initials', () => {
  expect(initials('Gian Marco Settembrini')).toBe('GS')
  expect(initials('Ana')).toBe('A')
  expect(initials('')).toBe('')
})

describe('código de pasajero', () => {
  it('tiene 6 caracteres sin letras ni números ambiguos', () => {
    for (let i = 0; i < 200; i++) {
      const code = generatePassengerCode()
      expect(code).toMatch(CODE_PATTERN)
      expect(code).not.toMatch(/[01OIL]/)
    }
  })

  it('se mantiene al recargar y se asigna a perfiles viejos', () => {
    expect(normalizeProfile({ name: 'A', age: 20, code: 'K7M4QX' }).code).toBe('K7M4QX')
    expect(normalizeProfile({ name: 'A', age: 20 }).code).toMatch(CODE_PATTERN)
    expect(normalizeProfile({ name: 'A', age: 20, code: 'abc' }).code).toMatch(CODE_PATTERN)
    expect(normalizeProfile(null, 'Viejo').code).toMatch(CODE_PATTERN)
  })
})
