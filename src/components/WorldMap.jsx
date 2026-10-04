import { geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'

const WIDTH = 960
const HEIGHT = 470

// La Antártida ocupa mucho espacio y no aporta al recorrido.
const LAND = feature(world, world.objects.countries).features.filter((f) => f.id !== '010')
const projection = geoEqualEarth().fitExtent(
  [
    [8, 8],
    [WIDTH - 8, HEIGHT - 8],
  ],
  { type: 'FeatureCollection', features: LAND },
)
const path = geoPath(projection)
const SHAPES = LAND.map((f) => ({ id: f.id, d: path(f) }))
const GRATICULE = path(geoGraticule10())
const OUTLINE = path({ type: 'Sphere' })
// Marcador de ubicación dibujado en SVG, con la punta en (0, 0).
const PIN_PATH = 'M0 0C-2-5.5-9-10-9-15.5a9 9 0 0 1 18 0C9-10 2-5.5 0 0Z'

/**
 * Mapa del mundo con los países "visitados" pintados y un marcador por cada país.
 * - pins: [{ country, count }] países con respuestas
 * - destinations: países por visitar (se marcan con un punto)
 * - route: países en el orden en que se respondieron (se dibuja la ruta del viaje)
 * - highlightId: país recién visitado (se anima)
 * - selectedId / onSelect: para ver el detalle de un país
 */
export default function WorldMap({
  pins = [],
  destinations = [],
  route = [],
  highlightId,
  selectedId,
  onSelect,
  compact = false,
}) {
  const visited = new Set(pins.map((p) => p.country.id))
  const routeCoords = dedupeConsecutive(route).map((c) => c.coords)
  const routePath = routeCoords.length > 1 ? path({ type: 'LineString', coordinates: routeCoords }) : null

  return (
    <svg
      className={`worldmap ${compact ? 'worldmap--compact' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Mapa del mundo con ${pins.length} países visitados`}
    >
      <path d={OUTLINE} className="worldmap__sea" />
      <path d={GRATICULE} className="worldmap__graticule" />
      {SHAPES.map((s) => (
        <path
          key={s.id ?? s.d.slice(0, 12)}
          d={s.d}
          className={`worldmap__land ${visited.has(s.id) ? 'worldmap__land--visited' : ''} ${
            selectedId === s.id ? 'worldmap__land--selected' : ''
          }`}
        />
      ))}
      {routePath && <path d={routePath} className="worldmap__route" />}
      {destinations
        .filter((c) => !visited.has(c.id))
        .map((c) => {
          const [x, y] = projection(c.coords)
          return (
            <circle
              key={c.id}
              cx={x}
              cy={y}
              r={selectedId === c.id ? 6 : 4}
              className={`destination ${selectedId === c.id ? 'destination--selected' : ''}`}
              onClick={onSelect ? () => onSelect(c.id) : undefined}
            >
              <title>{`${c.name}: por visitar`}</title>
            </circle>
          )
        })}
      {pins.map(({ country, count }) => {
        const [x, y] = projection(country.coords)
        const isNew = country.id === highlightId
        const label = `${country.name}: ${count} ${count === 1 ? 'respuesta' : 'respuestas'}`
        return (
          <g
            key={country.id}
            transform={`translate(${x} ${y})`}
            className={`pin ${isNew ? 'pin--new' : ''} ${onSelect ? 'pin--clickable' : ''} ${
              selectedId === country.id ? 'pin--selected' : ''
            }`}
            onClick={onSelect ? () => onSelect(country.id) : undefined}
            onKeyDown={
              onSelect
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(country.id)
                    }
                  }
                : undefined
            }
            tabIndex={onSelect ? 0 : undefined}
            role={onSelect ? 'button' : undefined}
            aria-label={onSelect ? label : undefined}
          >
            <title>{label}</title>
            <g className="pin__shape">
              <path d={PIN_PATH} className="pin__body" />
              <circle cy={-15} r={3.6} className="pin__hole" />
            </g>
          </g>
        )
      })}
    </svg>
  )
}

function dedupeConsecutive(countries) {
  return countries.filter((c, i) => i === 0 || c.id !== countries[i - 1].id)
}
