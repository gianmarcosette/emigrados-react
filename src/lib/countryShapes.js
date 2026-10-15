// Silueta de cada país del juego, para dibujarla junto al sello.
// Se queda con la parte principal del territorio (sin islas lejanas ni territorios
// de ultramar) y la centra en una caja de 100 × 100.
import { geoArea, geoCentroid, geoDistance, geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { COUNTRIES } from '../data/countries.js'

const SIZE = 100
const PAD = 6
const FEATURES = new Map(feature(world, world.objects.countries).features.map((f) => [f.id, f]))

function mainland(geometry) {
  if (geometry.type !== 'MultiPolygon') return geometry
  const parts = geometry.coordinates.map((coordinates) => {
    const poly = { type: 'Polygon', coordinates }
    return { coordinates, area: geoArea(poly), center: geoCentroid(poly) }
  })
  const biggest = parts.reduce((a, b) => (b.area > a.area ? b : a))
  // Partes con al menos 2 % del área de la principal y a menos de ~12° de ella
  const kept = parts.filter((p) => p.area >= biggest.area * 0.02 && geoDistance(p.center, biggest.center) < 0.22)
  return { type: 'MultiPolygon', coordinates: kept.map((p) => p.coordinates) }
}

const cache = new Map()

export function countryShape(id) {
  if (cache.has(id)) return cache.get(id)
  const f = FEATURES.get(id)
  let d = null
  if (f) {
    const geometry = mainland(f.geometry)
    const [lon] = geoCentroid(geometry)
    const projection = geoMercator()
      .rotate([-lon, 0])
      .fitExtent(
        [
          [PAD, PAD],
          [SIZE - PAD, SIZE - PAD],
        ],
        geometry,
      )
    d = geoPath(projection)(geometry)
  }
  cache.set(id, d)
  return d
}

export const SHAPE_SIZE = SIZE

// Solo para tests: todas las siluetas del juego
export function allCountryShapes() {
  return COUNTRIES.map((c) => ({ country: c, d: countryShape(c.id) }))
}
