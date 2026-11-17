// Historical corrections to Cliopatria, applied by scripts/build-cliopatria.mjs after RENAMES.
//
// Each fix is [name, from, to, action]: it touches the rows of territory `name` for the years
// from–to (inclusive), splitting a row that only partly overlaps. Actions:
//   { rename: 'New name' }   those years get another name
//   { drop: true }           those years are removed (a state that ended earlier, a duplicate)
//   { member: '(Empire)' }   those years belong to another empire ('' for none)
//   { extend: year }         the row ending at `to` is stretched to end at `year` (a state that
//                            lasted longer than the data says; `from` is ignored)
//   { restore: year, as: 'Name', member: '(Empire)' }
//                            `name`'s shape in `year` is drawn for from–to as `as` (default
//                            `name`), and cut out of everything else drawn there in those years:
//                            a country the source swallows into a neighbour (Czechoslovakia
//                            inside the Soviet Union's shape 1969–1990)
//   { draw: [[lon, lat], …], as, member, wikidata }
//                            a hand-drawn outline (kept to land), for borders the source lacks;
//                            cut out of everything else drawn there in those years
// `restore` and `draw` also take:
//   within: [name, year]     keep only the part inside that territory's shape in that year (the
//                            Louisiana Purchase is the part of the 1890 United States inside an outline)
//   under: true              fill only land nobody else holds instead of cutting into it
//   eraseFrom: [names]       only cut the shape out of those territories and add nothing (Crimea out
//                            of Ukraine once Russia holds it)
// Add `parts: [west, south, east, north]` (degrees) to rename, drop or re-member only the pieces
// of the shape whose centre lies in that box, and leave the rest alone: Algeria left inside
// France's shape after 1962, a colony drawn as part of its neighbour.
// Fixes run in order, so a later fix sees the names an earlier one gave.

// The fixes themselves are in scripts/history-fixes/, one file per era, applied oldest first.

import fs from 'fs'
import { geoArea, geoBounds, geoCentroid } from 'd3-geo'
import mapshaper from 'mapshaper'
import era1 from './history-fixes/1-999.mjs'
import era2 from './history-fixes/1000-1499.mjs'
import era3 from './history-fixes/1500-1799.mjs'
import era4 from './history-fixes/1800-1899.mjs'
import era5 from './history-fixes/1900-1999.mjs'
import restores from './history-fixes/restores.mjs'
import bordersEurope from './history-fixes/borders-europe.mjs'
import bordersAmericas from './history-fixes/borders-americas.mjs'
import bordersAsiaAfrica from './history-fixes/borders-asia-africa.mjs'

export const FIXES = [...era1, ...era2, ...era3, ...era4, ...era5, ...restores, ...bordersEurope, ...bordersAmericas, ...bordersAsiaAfrica]

const P = (f) => f.properties

// A polygon wound the wrong way covers the globe minus itself; its centre would be the antipode.
const upright = (rings) => (geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI ? rings.map((r) => [...r].reverse()) : rings)

// [pieces whose centre is in the box, the other pieces], as features (either may be null).
function byBox(f, [w, s, e, n]) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  const inBox = (rings) => {
    const [x, y] = geoCentroid({ type: 'Polygon', coordinates: upright(rings) })
    return x >= w && x <= e && y >= s && y <= n
  }
  const make = (ps) => (ps.length ? { ...f, properties: { ...P(f) }, geometry: { type: 'MultiPolygon', coordinates: ps } } : null)
  return [make(polys.filter(inBox)), make(polys.filter((r) => !inBox(r)))]
}

function split(f, from, to) {
  const { FromYear: a, ToYear: b } = P(f)
  const part = (x, y) => ({ ...f, properties: { ...P(f), FromYear: x, ToYear: y } })
  const inside = part(Math.max(a, from), Math.min(b, to))
  const outside = []
  if (a < from) outside.push(part(a, from - 1))
  if (b > to) outside.push(part(to + 1, b))
  return { inside, outside }
}

const overlaps = (a, b) => a[0][0] <= b[1][0] && b[0][0] <= a[1][0] && a[0][1] <= b[1][1] && b[0][1] <= a[1][1]
const FC = (features) => ({ type: 'FeatureCollection', features })
const multi = (fs) => ({ type: 'MultiPolygon', coordinates: fs.flatMap((f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)) })
const shapeFeature = (geometry) => ({ type: 'Feature', properties: {}, geometry })

// Runs one mapshaper command on in-memory layers: '-i a.json -erase b.json' → the features left.
async function mapshape(cmd, layers) {
  const out = await mapshaper.applyCommands(`${cmd} -o out.json format=geojson`, layers)
  const json = JSON.parse(out['out.json'])
  // Layers without attributes come back as a bare GeometryCollection.
  const features = (json.features ?? json.geometries.map(shapeFeature)).filter((f) => f.geometry)
  // mapshaper writes RFC 7946 winding (outer rings anticlockwise), the reverse of the source data
  // and of d3; fed back into mapshaper it reads as holes. Turn every ring back.
  for (const f of features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    f.geometry = { type: 'MultiPolygon', coordinates: polys.map(upright) }
  }
  return features
}

let land = null
async function landShape() {
  if (!land) {
    const { feature } = await import('topojson-client')
    const topo = JSON.parse(fs.readFileSync(new URL('../node_modules/world-atlas/land-50m.json', import.meta.url)))
    land = feature(topo, topo.objects.land)
  }
  return land
}

// The rows alive in `year` named `name`, as one shape (null if none).
function rowShape(features, name, year) {
  const rows = features.filter((f) => P(f).Name === name && P(f).FromYear <= year && year <= P(f).ToYear)
  return rows.length ? { geometry: multi(rows), template: rows[0] } : null
}

// The new shape a `restore` or `draw` fix describes, or null.
async function newShape(features, [name, , , act]) {
  let geometry
  let template = null
  if (act.restore !== undefined) {
    const row = rowShape(features, name, act.restore)
    if (!row) return null
    ;({ geometry, template } = row)
  } else {
    // A hand-drawn outline ([lon, lat] corners), kept to land.
    const ring = [...act.draw, act.draw[0]]
    const outline = shapeFeature({ type: 'Polygon', coordinates: [geoArea({ type: 'Polygon', coordinates: [ring] }) > 2 * Math.PI ? ring : [...ring].reverse()] })
    const clipped = await mapshape('-i a.json -clip b.json', { 'a.json': FC([outline]), 'b.json': await landShape() })
    if (!clipped.length) return null
    geometry = multi(clipped)
  }
  if (act.within) {
    // Only the part inside another territory's shape in some year: [name, year].
    const outer = rowShape(features, act.within[0], act.within[1])
    if (!outer) return null
    const inside = await mapshape('-i a.json -clip b.json', { 'a.json': FC([shapeFeature(geometry)]), 'b.json': FC([shapeFeature(outer.geometry)]) })
    if (!inside.length) return null
    geometry = multi(inside)
    template ??= outer.template
  }
  return { geometry, template }
}

// `restore` / `draw`: draws a shape for from–to as a territory of its own. Normally it is cut out of
// everything else drawn there in those years; with `under: true` it only fills land nobody holds.
async function addShape(features, fix) {
  const [name, from, to, act] = fix
  const made = await newShape(features, fix)
  if (!made) {
    console.warn(`Fix matched nothing: ${name} ${from}–${to} ${JSON.stringify(act).slice(0, 120)}`)
    return features
  }
  const box = geoBounds(made.geometry)
  const props = { ...(made.template ? P(made.template) : { Wikidata: null, MemberOf: null }), Name: act.as ?? name }
  if (act.member !== undefined) props.MemberOf = act.member || null
  if (act.wikidata !== undefined) props.Wikidata = act.wikidata
  const near = (f) => !(P(f).ToYear < from || P(f).FromYear > to) && overlaps(geoBounds(f), box)
  if (!act.under) {
    const keep = []
    const cut = []
    for (const f of features) {
      if (!near(f) || (act.eraseFrom && !act.eraseFrom.includes(P(f).Name))) { keep.push(f); continue }
      const { inside, outside } = split(f, from, to)
      keep.push(...outside)
      // Only the pieces near the new shape go through the cut: far-off pieces (islands across the
      // 180° line) confuse mapshaper's flat-map clipping and can come back bloated.
      const polys = inside.geometry.type === 'Polygon' ? [inside.geometry.coordinates] : inside.geometry.coordinates
      const isNear = (c) => overlaps(geoBounds({ type: 'Polygon', coordinates: upright(c) }), box)
      const far = polys.filter((c) => !isNear(c))
      if (far.length) keep.push({ ...inside, properties: { ...P(inside) }, geometry: { type: 'MultiPolygon', coordinates: far } })
      if (far.length < polys.length) cut.push({ ...inside, geometry: { type: 'MultiPolygon', coordinates: polys.filter(isNear) } })
    }
    const left = cut.length ? await mapshape('-i a.json -erase b.json', { 'a.json': FC(cut), 'b.json': FC([shapeFeature(made.geometry)]) }) : []
    if (act.eraseFrom) return [...keep, ...left]
    return [...keep, ...left, { type: 'Feature', geometry: made.geometry, properties: { ...props, FromYear: from, ToYear: to } }]
  }
  // Under: one piece per stretch of years in which the neighbours stay the same.
  const others = features.filter(near)
  const cuts = new Set([from, to + 1])
  for (const f of others) for (const y of [P(f).FromYear, P(f).ToYear + 1]) if (y > from && y <= to) cuts.add(y)
  const edges = [...cuts].sort((a, b) => a - b)
  const added = []
  for (let i = 0; i < edges.length - 1; i++) {
    const [a, b] = [edges[i], edges[i + 1] - 1]
    const there = others.filter((f) => P(f).FromYear <= a && b <= P(f).ToYear)
    const left = there.length ? await mapshape('-i a.json -erase b.json', { 'a.json': FC([shapeFeature(made.geometry)]), 'b.json': FC(there) }) : [shapeFeature(made.geometry)]
    if (left.length) added.push({ type: 'Feature', geometry: multi(left), properties: { ...props, FromYear: a, ToYear: b } })
  }
  return [...features, ...added]
}

export async function applyFixes(features, fixes) {
  // Same winding everywhere (the source's, d3's), however the features were read: mapshaper's own
  // output, which build-cliopatria.mjs feeds in, has it the other way round.
  let out = features.map((f) => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    return { ...f, geometry: { type: 'MultiPolygon', coordinates: polys.map(upright) } }
  })
  for (const [name, from, to, act] of fixes) {
    if (act.restore !== undefined || act.draw) { out = await addShape(out, [name, from, to, act]); continue }
    let hits = 0
    const next = []
    for (const f of out) {
      if (P(f).Name !== name) { next.push(f); continue }
      if (act.extend !== undefined) {
        if (P(f).ToYear === to) { next.push({ ...f, properties: { ...P(f), ToYear: act.extend } }); hits++ }
        else next.push(f)
        continue
      }
      if (P(f).ToYear < from || P(f).FromYear > to) { next.push(f); continue }
      const { inside: span, outside } = split(f, from, to)
      next.push(...outside)
      let inside = span
      if (act.parts) {
        const [picked, rest] = byBox(span, act.parts)
        if (rest) next.push(rest)
        if (!picked) continue
        inside = picked
      }
      hits++
      if (act.drop) continue
      if (act.rename !== undefined) P(inside).Name = act.rename
      if (act.member !== undefined) P(inside).MemberOf = act.member || null
      next.push(inside)
    }
    if (!hits) console.warn(`Fix matched nothing: ${name} ${from}–${to} ${JSON.stringify(act)}`)
    out = next
  }
  return out
}
