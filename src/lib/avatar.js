// Avatares: tu pasajero en el vuelo. Se guarda como un puñado de elecciones (no como
// imagen), así pesa casi nada y se puede mostrar en cualquier tamaño.

export const AVATAR_OPTIONS = {
  // Tonos de piel suaves, para que convivan con la paleta tinta / papel / amarillo
  skin: [
    { id: 'p1', label: 'Muy clara', color: '#f6dfca' },
    { id: 'p2', label: 'Clara', color: '#ecc6a2' },
    { id: 'p3', label: 'Trigueña', color: '#d6a578' },
    { id: 'p4', label: 'Morena', color: '#b47f55' },
    { id: 'p5', label: 'Oscura', color: '#8f5f3e' },
    { id: 'p6', label: 'Muy oscura', color: '#6f4630' },
  ],
  hair: [
    { id: 'corto', label: 'Corto' },
    { id: 'largo', label: 'Largo' },
    { id: 'rulos', label: 'Rulos' },
    { id: 'rodete', label: 'Rodete' },
    { id: 'rapado', label: 'Rapado' },
    { id: 'pelado', label: 'Sin pelo' },
  ],
  hairColor: [
    { id: 'negro', label: 'Negro', color: '#161616' },
    { id: 'castano', label: 'Castaño', color: '#5b3a24' },
    { id: 'rubio', label: 'Rubio', color: '#e6bf6a' },
    { id: 'cobrizo', label: 'Cobrizo', color: '#a9502b' },
    { id: 'canas', label: 'Canas', color: '#c9c3b8' },
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
  expression: [
    { id: 'sonrisa', label: 'Sonriente' },
    { id: 'sereno', label: 'Sereno' },
    { id: 'pensativo', label: 'Pensativo' },
  ],
  // El objeto de viaje: lo más "Emigrados" del personaje
  item: [
    { id: 'ninguno', label: 'Nada' },
    { id: 'mate', label: 'Mate' },
    { id: 'cafe', label: 'Café' },
    { id: 'auriculares', label: 'Auriculares' },
    { id: 'libro', label: 'Libro' },
    { id: 'camara', label: 'Cámara' },
    { id: 'mochila', label: 'Mochila' },
    { id: 'carta', label: 'Carta' },
  ],
  shirt: [
    { id: 'papel', label: 'Crudo', color: '#fbf9f5' },
    { id: 'amarillo', label: 'Amarillo', color: '#ffd700' },
    { id: 'tinta', label: 'Negro', color: '#161616' },
    { id: 'arena', label: 'Arena', color: '#ddd0b6' },
    { id: 'salvia', label: 'Salvia', color: '#bcc7ab' },
  ],
  // Lo que se ve por tu ventanilla: las mismas escenas del juego
  scene: [
    { id: 'nubes', label: 'Nubes' },
    { id: 'mar', label: 'Mar' },
    { id: 'atardecer', label: 'Atardecer' },
    { id: 'noche', label: 'Noche' },
    { id: 'montanas', label: 'Montañas' },
    { id: 'ciudad', label: 'Ciudad' },
    { id: 'ala', label: 'El ala del avión' },
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
  expression: 'sonrisa',
  item: 'ninguno',
  shirt: 'amarillo',
  scene: 'nubes',
}

const has = (part, id) => AVATAR_OPTIONS[part].some((o) => o.id === id)

/** Un avatar válido a partir de datos guardados; cada pieza desconocida vuelve a su valor por defecto. */
export function normalizeAvatar(data) {
  if (!data || typeof data !== 'object') return null
  return Object.fromEntries(
    AVATAR_PARTS.map((part) => [part, has(part, data[part]) ? data[part] : DEFAULT_AVATAR[part]]),
  )
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
