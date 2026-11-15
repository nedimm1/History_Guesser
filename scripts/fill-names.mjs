// The historical data leaves some places unnamed: Switzerland and Taiwan in 1994/2010, Crete in
// 1914, the Hebrides, many small islands… This fills in a name (and ruler), writing it into
// public/data/<year>.json:
//  - from 1945 on: the modern country the piece lies in (Natural Earth 1:50m);
//  - earlier, for pieces under 100,000 km²: the modern name if src/owners.js knows who ruled that
//    place in that year (e.g. Taiwan, Japanese in 1900), otherwise the nearest polity on the same
//    map within 300 km (the Hebrides join the UK, the Aleutians the Russian Empire in 1815).
//    Only islands and detached pieces are filled this way, never unnamed land along a border.
// Big unnamed areas in older maps (the Sahara, the Amazon) are genuinely unclaimed and stay blank.
//
// Run with: node scripts/fill-names.mjs   (safe to re-run; already-named features are untouched)
import fs from 'fs'
import { feature } from 'topojson-client'
import { geoArea, geoContains, geoCentroid, geoDistance } from 'd3-geo'
import { ruledBy } from '../src/owners.js'

const EARTH_KM2 = 4 * Math.PI * 6371 ** 2
const MAX_NEIGHBOUR_KM = 300
const MAX_SMALL_KM2 = 100_000
const TOUCHING_KM = 5 // closer than this to a named polity = unclaimed land on its border, not an island
const rewind = (poly) => (geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly)
function fixWinding(g) {
  if (g.type === 'Polygon') g.coordinates = rewind(g.coordinates)
  else if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map(rewind)
  return g
}

const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'))
const countries = feature(world, world.objects.countries).features
  .filter((c) => c.geometry && c.properties.name !== 'Antarctica')
  .map((c) => ({ name: c.properties.name, geometry: fixWinding(c.geometry) }))

// Points to try: centroid of each polygon (largest first), then each polygon's vertices.
function samplePoints(g) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
  const sorted = [...polys].sort((a, b) => geoArea({ type: 'Polygon', coordinates: b }) - geoArea({ type: 'Polygon', coordinates: a }))
  const pts = sorted.map((p) => geoCentroid({ type: 'Polygon', coordinates: p }))
  for (const p of sorted) for (let i = 0; i < p[0].length; i += Math.max(1, (p[0].length / 8) | 0)) pts.push(p[0][i])
  return pts
}

function modernName(g) {
  for (const pt of samplePoints(g)) {
    const hit = countries.find((c) => geoContains(c.geometry, pt))
    if (hit) return hit.name
  }
  return null
}

function vertices(g) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
  const out = []
  for (const p of polys) for (const ring of p) for (let i = 0; i < ring.length; i += 3) out.push(ring[i])
  return out
}

// Nearest named polity on the same map, measured from the piece's own outline: { km, props } or null.
function nearestNamed(f, named) {
  const mine = vertices(f.geometry).filter((_, i) => i % 4 === 0)
  let best = null
  for (const o of named) {
    for (const v of o.verts) {
      for (const m of mine) {
        const km = geoDistance(v, m) * 6371
        if (km < (best?.km ?? MAX_NEIGHBOUR_KM)) best = { km, props: o.props }
      }
    }
  }
  return best
}

const years = JSON.parse(fs.readFileSync('src/years.json')).years
for (const year of years) {
  const file = `public/data/${year}.json`
  const topo = JSON.parse(fs.readFileSync(file))
  const geoms = topo.objects.borders.geometries
  const feats = feature(topo, topo.objects.borders).features
  feats.forEach((f) => f.geometry && fixWinding(f.geometry))
  const named = feats
    .filter((f) => f.geometry && (f.properties.NAME || '').trim())
    .map((f) => ({ props: f.properties, verts: vertices(f.geometry) }))
  let filled = 0
  feats.forEach((f, i) => {
    if (!f.geometry || (f.properties.NAME || '').trim()) return
    const km2 = (geoArea(f.geometry) / (4 * Math.PI)) * EARTH_KM2
    let props = null
    if (year >= 1945) {
      const name = modernName(f.geometry)
      if (name) props = { NAME: name, SUBJECTO: '' }
    } else if (km2 < MAX_SMALL_KM2) {
      // Only islands and detached pieces: unnamed land touching a polity is unclaimed, not theirs.
      const near = nearestNamed(f, named)
      if (near && near.km >= TOUCHING_KM) {
        const name = modernName(f.geometry)
        if (name && ruledBy(name, year)) props = { NAME: name, SUBJECTO: '' }
        else props = { NAME: near.props.NAME, SUBJECTO: near.props.SUBJECTO ?? '' }
      }
    }
    if (!props) return
    geoms[i].properties = { ...geoms[i].properties, ...props }
    filled++
  })
  if (filled) fs.writeFileSync(file, JSON.stringify(topo))
  console.log(year, `named ${filled}`)
}
