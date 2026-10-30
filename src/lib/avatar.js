// Avatares: tu pasajero, recortado en papel de color. Se guarda como un puñado de elecciones
// (no como imagen), así pesa casi nada y se puede mostrar en cualquier tamaño.

export const AVATAR_OPTIONS = {
  // Tonos de piel en papel de color: cálidos, para que convivan con el coral y el cobalto
  skin: [
    { id: 'p1', label: 'Muy clara', color: '#f3d2b6' },
    { id: 'p2', label: 'Clara', color: '#e8b48a' },
    { id: 'p3', label: 'Trigueña', color: '#d9a06e' },
    { id: 'p4', label: 'Morena', color: '#c68a5e' },
    { id: 'p5', label: 'Oscura', color: '#8d5a3b' },
    { id: 'p6', label: 'Muy oscura', color: '#6b4430' },
  ],
  hair: [
    { id: 'corto', label: 'Corto' },
    { id: 'largo', label: 'Largo' },
    { id: 'rulos', label: 'Rulos' },
    { id: 'rodete', label: 'Rodete' },
    { id: 'trenzas', label: 'Trenzas' },
    { id: 'flequillo', label: 'Flequillo' },
    { id: 'rapado', label: 'Rapado' },
    { id: 'pelado', label: 'Sin pelo' },
  ],
  hairColor: [
    { id: 'negro', label: 'Negro', color: '#161616' },
    { id: 'castano', label: 'Castaño', color: '#4a2c1a' },
    { id: 'rubio', label: 'Rubio', color: '#e2b04a' },
    { id: 'cobrizo', label: 'Cobrizo', color: '#b5532c' },
    { id: 'canas', label: 'Canas', color: '#d8d2c6' },
  ],
  headwear: [
    { id: 'ninguno', label: 'Nada' },
    { id: 'panuelo', label: 'Pañuelo' },
    { id: 'gorro', label: 'Gorro de lana' },
    { id: 'gorra', label: 'Gorra' },
  ],
  facialHair: [
    { id: 'ninguno', label: 'Nada' },
    { id: 'bigote', label: 'Bigote' },
    { id: 'barba', label: 'Barba' },
  ],
  glasses: [
    { id: 'ninguno', label: 'Sin anteojos' },
    { id: 'redondos', label: 'Redondos' },
    { id: 'cuadrados', label: 'Cuadrados' },
  ],
  shirt: [
    { id: 'coral', label: 'Coral', color: '#e8664a' },
    { id: 'amarillo', label: 'Amarillo', color: '#ffd23f' },
    { id: 'verde', label: 'Verde', color: '#3f7d5a' },
    { id: 'noche', label: 'Azul noche', color: '#1f2f5c' },
    { id: 'cielo', label: 'Celeste', color: '#3d7299' },
    { id: 'papel', label: 'Crema', color: '#f3ede0' },
  ],
  // El papel de fondo del recorte
  background: [
    { id: 'cielo', label: 'Celeste', color: '#3d7299' },
    { id: 'coral', label: 'Coral', color: '#e8664a' },
    { id: 'durazno', label: 'Durazno', color: '#f6b48f' },
    { id: 'amarillo', label: 'Amarillo', color: '#ffd23f' },
    { id: 'verde', label: 'Verde', color: '#3f7d5a' },
    { id: 'menta', label: 'Menta', color: '#a9cdb8' },
    { id: 'rosa', label: 'Rosa', color: '#f3a6b8' },
    { id: 'noche', label: 'Azul noche', color: '#1f2f5c' },
  ],
  // Un adorno de papel junto a la cabeza, como en los recortes de Matisse
  deco: [
    { id: 'ninguno', label: 'Nada' },
    { id: 'estrella', label: 'Estrella' },
    { id: 'hoja', label: 'Hoja' },
    { id: 'corazon', label: 'Corazón' },
    { id: 'pajaro', label: 'Pájaro' },
  ],
}

export const AVATAR_PARTS = Object.keys(AVATAR_OPTIONS)

export const DEFAULT_AVATAR = {
  skin: 'p2',
  hair: 'corto',
  hairColor: 'castano',
  headwear: 'ninguno',
  facialHair: 'ninguno',
  glasses: 'ninguno',
  shirt: 'coral',
  background: 'cielo',
  deco: 'estrella',
}

const has = (part, id) => AVATAR_OPTIONS[part].some((o) => o.id === id)

/** Un avatar válido a partir de datos guardados; cada pieza desconocida vuelve a su valor por defecto. */
export function normalizeAvatar(data) {
  if (!data || typeof data !== 'object') return null
  // Los avatares de antes elegían lo que se veía por la ventanilla: pasa a ser el color de fondo
  const migrated = data.background ? data : { ...data, background: SCENE_BACKGROUND[data.scene] }
  return Object.fromEntries(
    AVATAR_PARTS.map((part) => [part, has(part, migrated[part]) ? migrated[part] : DEFAULT_AVATAR[part]]),
  )
}

const SCENE_BACKGROUND = {
  nubes: 'cielo',
  mar: 'menta',
  atardecer: 'durazno',
  noche: 'noche',
  montanas: 'verde',
  ciudad: 'amarillo',
  ala: 'coral',
}

/** "Sorprendeme": una combinación al azar. */
export function randomAvatar(random = Math.random) {
  const pick = (part) => AVATAR_OPTIONS[part][Math.floor(random() * AVATAR_OPTIONS[part].length)].id
  const avatar = Object.fromEntries(AVATAR_PARTS.map((part) => [part, pick(part)]))
  // El pañuelo ya cubre el pelo: se ve mejor sin barba ni gorro encima
  if (avatar.headwear === 'panuelo') avatar.facialHair = 'ninguno'
  return avatar
}

export function colorOf(part, id) {
  return AVATAR_OPTIONS[part].find((o) => o.id === id)?.color
}
