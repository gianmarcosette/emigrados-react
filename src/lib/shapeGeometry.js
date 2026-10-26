// Cálculo de la silueta de un país a partir de su contorno en el mapa del mundo.
// Se queda con la parte principal del territorio (sin islas lejanas ni territorios
// de ultramar) y la centra en una caja de 100 × 100.
// Lo usa scripts/country-shapes.mjs para generar src/data/countryShapes.json: así el
// juego no necesita descargar el mapa del mundo para dibujar sellos y pegatinas.
import { geoArea, geoCentroid, geoDistance, geoMercator, geoPath } from 'd3-geo'
import { SHAPE_SIZE } from './shapeSize.js'

const PAD = 6

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

/** Trazo SVG de la silueta, con un decimal (más no se nota en un sello). */
export function shapeFromFeature(f) {
  const geometry = mainland(f.geometry)
  const [lon] = geoCentroid(geometry)
  const projection = geoMercator()
    .rotate([-lon, 0])
    .fitExtent(
      [
        [PAD, PAD],
        [SHAPE_SIZE - PAD, SHAPE_SIZE - PAD],
      ],
      geometry,
    )
  return geoPath(projection.precision(0.3))(geometry).replace(/\d+\.\d+/g, (n) => String(Math.round(n * 10) / 10))
}
