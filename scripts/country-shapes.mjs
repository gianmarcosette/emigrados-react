// Genera src/data/countryShapes.json con las siluetas de los países del juego
// (recorrido + modo online). Correr después de sumar un país: npm run shapes
import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'
import { COUNTRIES } from '../src/data/countries.js'
import { TRIVIA } from '../src/data/trivia.js'
import { shapeFromFeature } from '../src/lib/shapeGeometry.js'

const world = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url)))
const features = new Map(feature(world, world.objects.countries).features.map((f) => [f.id, f]))
const ids = [...new Set([...COUNTRIES.map((c) => c.id), ...Object.values(TRIVIA).map((t) => t.mapId)])].sort()

const shapes = {}
for (const id of ids) {
  const f = features.get(id)
  if (!f) throw new Error(`El país ${id} no está en el mapa`)
  shapes[id] = shapeFromFeature(f)
}
writeFileSync(new URL('../src/data/countryShapes.json', import.meta.url), JSON.stringify(shapes, null, 1) + '\n')
console.log(`${ids.length} siluetas guardadas`)
