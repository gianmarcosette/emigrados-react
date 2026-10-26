// Silueta de cada país del juego, para dibujarla junto al sello. Vienen ya calculadas
// (ver scripts/country-shapes.mjs), así no hace falta descargar el mapa del mundo.
import SHAPES from '../data/countryShapes.json'
import { COUNTRIES } from '../data/countries.js'

export { SHAPE_SIZE } from './shapeSize.js'

export function countryShape(id) {
  return SHAPES[id] ?? null
}

// Solo para tests: todas las siluetas del juego
export function allCountryShapes() {
  return COUNTRIES.map((c) => ({ country: c, d: countryShape(c.id) }))
}
