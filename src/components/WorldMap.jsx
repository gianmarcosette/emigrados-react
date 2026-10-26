import { geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo'
import { select } from 'd3-selection'
import 'd3-transition'
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom'
import { useEffect, useRef } from 'react'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'

const WIDTH = 960
const HEIGHT = 470
const MAX_ZOOM = 8

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
 * - interactive: se puede acercar (pellizcar, Ctrl + rueda o botones) y arrastrar;
 *   arranca centrado en `focus` (un país)
 */
export default function WorldMap({
  pins = [],
  destinations = [],
  route = [],
  highlightId,
  selectedId,
  onSelect,
  compact = false,
  interactive = false,
  focus,
}) {
  const visited = new Set(pins.map((p) => p.country.id))
  const routeCoords = dedupeConsecutive(route).map((c) => c.coords)
  const routePath = routeCoords.length > 1 ? path({ type: 'LineString', coordinates: routeCoords }) : null
  const boxRef = useRef(null)
  const svgRef = useRef(null)
  const viewRef = useRef(null)
  const zoomRef = useRef(null)
  const focusRef = useRef(focus)
  const minZoomRef = useRef(1)

  useEffect(() => {
    if (!interactive) return undefined
    const box = boxRef.current
    const svg = select(svgRef.current)
    const view = select(viewRef.current)

    const behavior = d3zoom()
      .scaleExtent([1, MAX_ZOOM])
      .translateExtent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      // En la compu la rueda sola sigue bajando la página; el zoom va con Ctrl/⌘ o el pellizco del trackpad.
      .filter((event) => (event.type === 'wheel' ? event.ctrlKey || event.metaKey : !event.button))
      .on('zoom', (event) => {
        view.attr('transform', event.transform)
        // Los marcadores y puntos mantienen su tamaño al acercarse
        svgRef.current.style.setProperty('--k', event.transform.k)
      })
    zoomRef.current = behavior

    // El mapa llena el recuadro (aunque sea más alto que ancho, como en el celular):
    // la zona visible se calcula en coordenadas del mapa para que se pueda recorrer entero.
    // La vista inicial se aplica una sola vez; después solo se ajusta el recuadro
    // (en el celular la barra del navegador cambia el alto al hacer scroll).
    let placed = false
    const fit = () => {
      const { width, height } = box.getBoundingClientRect()
      if (!width || !height) return
      const s = Math.max(width / WIDTH, height / HEIGHT)
      const w = width / s
      const h = height / s
      const x0 = (WIDTH - w) / 2
      const y0 = (HEIGHT - h) / 2
      // Alejándose al máximo se ve el mundo entero, aunque el recuadro sea angosto
      minZoomRef.current = Math.min(1, w / WIDTH, h / HEIGHT)
      behavior.scaleExtent([minZoomRef.current, MAX_ZOOM]).extent([
        [x0, y0],
        [x0 + w, y0 + h],
      ])
      svg.call(behavior)
      if (placed) return
      placed = true
      const target = focusRef.current
      // translateTo respeta los bordes del mapa: no queda una franja vacía arriba o abajo
      if (target) svg.call(behavior.translateTo, ...projection(target.coords))
      else svg.call(behavior.transform, zoomIdentity)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => {
      observer.disconnect()
      svg.on('.zoom', null)
    }
  }, [interactive])

  function zoomBy(factor) {
    select(svgRef.current).transition().duration(320).call(zoomRef.current.scaleBy, factor)
  }

  function zoomReset() {
    select(svgRef.current)
      .transition()
      .duration(450)
      .call(zoomRef.current.scaleTo, minZoomRef.current, [WIDTH / 2, HEIGHT / 2])
  }

  const map = (
    <svg
      ref={svgRef}
      className={`worldmap ${compact ? 'worldmap--compact' : ''} ${interactive ? 'worldmap--interactive' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio={interactive ? 'xMidYMid slice' : 'xMidYMid meet'}
      role="img"
      aria-label={`Mapa del mundo con ${pins.length} países visitados`}
    >
      <g ref={viewRef}>
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
              <g key={c.id} transform={`translate(${x} ${y})`}>
                <g
                  className={`destination ${selectedId === c.id ? 'destination--selected' : ''}`}
                  onClick={onSelect ? () => onSelect(c.id) : undefined}
                >
                  <title>{`${c.name}: por visitar`}</title>
                  {/* Área de toque más grande que el punto, para los dedos */}
                  <circle r="12" className="destination__hit" />
                  <circle r={selectedId === c.id ? 6 : 4} className="destination__dot" />
                </g>
              </g>
            )
          })}
        {pins.map(({ country, count }) => {
          const [x, y] = projection(country.coords)
          const isNew = country.id === highlightId
          const label = `${country.name}: ${count} ${count === 1 ? 'respuesta' : 'respuestas'}`
          return (
            <g key={country.id} transform={`translate(${x} ${y})`}>
              <g
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
            </g>
          )
        })}
      </g>
    </svg>
  )

  if (!interactive) return map

  return (
    <div ref={boxRef} className="worldmap-zoom">
      {map}
      <p className="worldmap-zoom__hint" aria-hidden="true">
        Pellizcá para acercarte
      </p>
      <div className="worldmap-zoom__controls">
        <button type="button" onClick={() => zoomBy(1.6)} aria-label="Acercar">
          +
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.6)} aria-label="Alejar">
          −
        </button>
        <button type="button" onClick={zoomReset} aria-label="Ver el mundo entero" className="worldmap-zoom__reset">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function dedupeConsecutive(countries) {
  return countries.filter((c, i) => i === 0 || c.id !== countries[i - 1].id)
}

/**
 * Referencia del mapa: cada marca dibujada igual que en el mapa, con lo que significa.
 */
export function MapLegend({ showRoute = true }) {
  return (
    <ul className="map-legend" aria-label="Referencias del mapa">
      <li>
        <svg viewBox="-12 -28 24 30" aria-hidden="true" className="map-legend__mark">
          <path d={PIN_PATH} className="pin__body" />
          <circle cy={-15} r={3.6} className="pin__hole" />
        </svg>
        Ya respondiste ahí
      </li>
      <li>
        <svg viewBox="-8 -8 16 16" aria-hidden="true" className="map-legend__mark">
          <circle r="4.5" className="destination__dot map-legend__dot" />
        </svg>
        Te falta visitar
      </li>
      {showRoute && (
        <li>
          <svg viewBox="0 0 30 10" aria-hidden="true" className="map-legend__mark map-legend__mark--wide">
            <path d="M1 5h28" className="worldmap__route" />
          </svg>
          Tu ruta
        </li>
      )}
    </ul>
  )
}
