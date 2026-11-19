// Dates Cliopatria's border changes to the month, for 1800 on (src/dates.js: MONTHS_FROM).
//
// Cliopatria only knows years: the Soviet Union's last row ends in 1991 and Russia's first starts in
// 1992. Each such change is a "boundary": the rows ending in year B - 1 and the rows starting in B.
// A dated event says when the change really happened ('1991-12'), and the rows on both sides of the
// boundary are moved to that month: the old ones end the month before, the new ones start then.
//
// Which rows an event moves, at its boundary:
//   1. the rows covering part of its box (or, for OHM's dates, that state's rows);
//   2. the rows on the other side of the boundary that share land with those: who the land came
//      from or went to (French West Africa and the states it split into);
//   3. every row at the boundary of the states named so far, so each state's old shape ends the
//      month before its new one starts: never drawn twice, never missing.
// Only one step out (2): Cliopatria redraws many states in the same year, and overlapping empires
// would otherwise chain the whole world together. Rows already moved by an earlier event stay put.
//
// Events come from two places, in this order (the first event to reach a row wins):
//   1. scripts/history-fixes/months.mjs, hand-written: [date, [west, south, east, north], what,
//      boundary?]. It applies at the boundary nearest the date (within a year of it: Cliopatria
//      often shows a change a year early or late) with a row covering part of the box, or at the
//      boundary given; never where it would make a row end before it starts.
//   2. OpenHistoricalMap's start and end dates for the same state (matched by Wikidata ID), when
//      they are given to the month and within a year of Cliopatria's boundary.
// Changes no event reaches keep whole years (they show from January of year B).

import fs from 'fs'
import { MONTHS_FROM, parseMonth, yearOf, monthOf, monthIndex, rowStart, rowEnd, withSpan } from '../src/dates.js'

const P = (f) => f.properties
const MAX_VERTICES = 400 // per ring, for the overlap tests (plenty for "do these overlap at all")

// Planar outline of a feature: [{ box, rings }] per polygon, rings thinned out.
function outline(f) {
  const g = f.geometry
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
  return polys.map((poly) => {
    const rings = poly.map((r) => {
      const step = Math.ceil(r.length / MAX_VERTICES)
      return step > 1 ? r.filter((_, i) => i % step === 0) : r
    })
    let [w, s, e, n] = [Infinity, Infinity, -Infinity, -Infinity]
    for (const [x, y] of rings[0]) {
      w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y)
    }
    return { box: [w, s, e, n], rings }
  })
}

const meets = (a, b) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]

function inRings([x, y], rings) {
  let inside = false
  for (const r of rings)
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i]
      const [xj, yj] = r[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  return inside
}
const covers = (shape, pt) => shape.some((p) => pt[0] >= p.box[0] && pt[0] <= p.box[2] && pt[1] >= p.box[1] && pt[1] <= p.box[3] && inRings(pt, p.rings))

// n × n points spread over a box.
function grid([w, s, e, n], k = 8) {
  const pts = []
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) pts.push([w + ((e - w) * (i + 0.5)) / k, s + ((n - s) * (j + 0.5)) / k])
  return pts
}

// Points spread evenly over a shape's land (about 200, more spread out for bigger shapes).
function samples(shape) {
  const area = shape.reduce((t, p) => t + (p.box[2] - p.box[0]) * (p.box[3] - p.box[1]), 0)
  const step = Math.max(Math.sqrt(area / 200), 0.05)
  const pts = []
  for (const p of shape) {
    const [w, s, e, n] = p.box
    const inside = []
    for (let x = w + step / 2; x < e; x += step) for (let y = s + step / 2; y < n; y += step) if (inRings([x, y], p.rings)) inside.push([x, y])
    // Pieces smaller than the grid still count, by their middle.
    pts.push(...(inside.length ? inside : [[(w + e) / 2, (s + n) / 2]]))
  }
  return pts
}

// Do two shapes share land? At least a sixth or so of one lies inside the other: not just the
// sliver where two neighbours' borders, traced separately, overlap a little.
const SHARE = 0.15
function overlap(a, b, pa, pb) {
  const share = (pts, shape) => pts.filter((pt) => covers(shape, pt)).length / pts.length
  return share(pa, b) >= SHARE || share(pb, a) >= SHARE
}

// The rows at boundary B: those ending in B - 1 and those starting in B (not yet moved to a month).
function rowsAt(features, B) {
  const ending = []
  const starting = []
  features.forEach((f, i) => {
    if (P(f).ToYear === B - 1 && (P(f).ToMonth ?? 12) === 12) ending.push(i)
    if (P(f).FromYear === B && (P(f).FromMonth ?? 1) === 1) starting.push(i)
  })
  return { ending, starting }
}

const fmt = (t) => `${yearOf(t)}-${String(monthOf(t)).padStart(2, '0')}`

// OHM dates by Wikidata ID: { Q…: [[start, end], …] } (raw date strings), downloaded on first use.
export async function ohmDates(file, overpassUrl) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file))
  console.log('Downloading OpenHistoricalMap country dates…')
  const res = await fetch(overpassUrl, {
    method: 'POST',
    headers: { 'User-Agent': 'history-guesser-data-build/1.0' },
    body: new URLSearchParams({ data: '[out:json][timeout:180];relation["boundary"="administrative"]["admin_level"="2"]["wikidata"];out tags;' }),
  })
  if (!res.ok) throw new Error(`Overpass: ${res.status}`)
  const out = {}
  for (const { tags } of (await res.json()).elements) (out[tags.wikidata] ??= []).push([tags.start_date ?? null, tags.end_date ?? null])
  fs.writeFileSync(file, JSON.stringify(out))
  return out
}

// A date given to the month ("1960-08", "1960-08-20") → month index; a bare year → null.
const monthly = (s) => (/^\d{4}-\d{2}/.test(s ?? '') ? parseMonth(s) : null)

// The month a state's end_date takes it off the map: the month after its last day's month, unless
// that day ends the month (src/dates.js: a month's map is the borders at its end).
function goneFrom(s) {
  const [y, m, d] = s.split('-').map(Number)
  if (!d) return monthIndex(y, m)
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return d === lastDay ? monthIndex(y, m) + 1 : monthIndex(y, m)
}

export function dateChanges(features, events, ohm, log = console.log) {
  const cache = new Map()
  const shapes = (i) => (cache.has(i) ? cache.get(i) : (cache.set(i, outline(features[i])), cache.get(i)))
  const pointCache = new Map()
  const points = (i) => (pointCache.has(i) ? pointCache.get(i) : (pointCache.set(i, samples(shapes(i))), pointCache.get(i)))
  const shareLand = (i, j) => meets(boundsOf(i), boundsOf(j)) && overlap(shapes(i), shapes(j), points(i), points(j))
  const boundsCache = new Map()
  const boundsOf = (i) => {
    if (!boundsCache.has(i)) boundsCache.set(i, shapes(i).reduce((b, p) => [Math.min(b[0], p.box[0]), Math.min(b[1], p.box[1]), Math.max(b[2], p.box[2]), Math.max(b[3], p.box[3])], [Infinity, Infinity, -Infinity, -Infinity]))
    return boundsCache.get(i)
  }
  const boundaries = new Map()
  const at = (B) => (boundaries.has(B) ? boundaries.get(B) : (boundaries.set(B, rowsAt(features, B)), boundaries.get(B)))
  const lastB = MONTHS_FROM - 1 + 200 // 1999: from 2000 the data is OHM's
  const ok = (B) => B > MONTHS_FROM && B <= lastB

  // Hand-written events first, then OHM's.
  const todo = events.map(([date, box, what, boundary]) => ({ t: parseMonth(date), box, what, boundary }))
  const byQ = new Map()
  features.forEach((f, i) => {
    const q = P(f).Wikidata
    if (q && ohm[q]) (byQ.get(q) ?? byQ.set(q, []).get(q)).push(i)
  })
  for (const [q, rows] of byQ) {
    const first = Math.min(...rows.map((i) => P(features[i]).FromYear))
    const last = Math.max(...rows.map((i) => P(features[i]).ToYear))
    const name = P(features[rows[0]]).Name
    const starts = ohm[q].map(([s]) => monthly(s)).filter((t) => t !== null)
    const ends = ohm[q].map(([, e]) => (/^\d{4}-\d{2}/.test(e ?? '') ? goneFrom(e) : null)).filter((t) => t !== null)
    // The OHM date nearest Cliopatria's boundary, within a year of it.
    const dist = (t, B) => Math.abs(t - monthIndex(B, 1))
    const near = (ts, B) => ts.filter((t) => dist(t, B) <= 12).sort((a, b) => dist(a, B) - dist(b, B))[0]
    const born = near(starts, first)
    if (ok(first) && born !== undefined) todo.push({ t: born, rows: rows.filter((i) => P(features[i]).FromYear === first), what: `${name} begins (OHM)`, boundary: first })
    const died = near(ends, last + 1)
    if (ok(last + 1) && died !== undefined) todo.push({ t: died, rows: rows.filter((i) => P(features[i]).ToYear === last), what: `${name} ends (OHM)`, boundary: last + 1 })
  }

  // Each row has two ends that can be moved: its start (at boundary FromYear) and its end (at
  // boundary ToYear + 1). An end once moved stays put.
  const movedStart = new Set()
  const movedEnd = new Set()
  let changes = 0
  let rowsMoved = 0
  for (const ev of todo) {
    const y = yearOf(ev.t)
    const options = ev.boundary ? [ev.boundary] : [y, y + 1, y + 2]
      .filter((B) => Math.abs(ev.t - monthIndex(B, 1)) <= 12)
      .sort((a, b) => Math.abs(ev.t - monthIndex(a, 1)) - Math.abs(ev.t - monthIndex(b, 1)))
    const pts = ev.box && grid(ev.box, 6)
    const hits = (i) => (ev.rows ? ev.rows.includes(i) : pts.some((pt) => covers(shapes(i), pt)))
    let pick = null
    let refused = null
    for (const B of options.filter(ok)) {
      const all = at(B)
      const ending = all.ending.filter((i) => !movedEnd.has(i))
      const starting = all.starting.filter((i) => !movedStart.has(i))
      const isEnding = new Set(ending)
      // 1. Rows covering the box.
      const direct = [...ending, ...starting].filter(hits)
      if (!direct.length) continue
      // 2. One step out: rows on the other side of the boundary sharing land with the direct ones.
      const rows = new Set(direct)
      for (const d of direct) for (const o of isEnding.has(d) ? starting : ending) if (!rows.has(o) && shareLand(d, o)) rows.add(o)
      // 3. Both sides of every state named so far.
      const names = new Set([...rows].map((i) => P(features[i]).Name))
      for (const i of [...ending, ...starting]) if (names.has(P(features[i]).Name)) rows.add(i)
      // Never further than the rows themselves reach: no row may end before it starts.
      const bad = [...rows].find((i) => (isEnding.has(i) ? ev.t - 1 < rowStart(P(features[i])) : ev.t > rowEnd(P(features[i]))))
      if (bad !== undefined) { refused ??= `${P(features[bad]).Name} ${P(features[bad]).FromYear}–${P(features[bad]).ToYear} at boundary ${B}`; continue }
      pick = { B, rows, isEnding, names }
      break
    }
    if (!pick) {
      if (ev.box) log(`  ${fmt(ev.t)} ${ev.what}: ${refused ? `left alone (would cut short ${refused})` : 'no change in the data near then (or already dated)'}`)
      continue
    }
    for (const i of pick.rows) {
      const p = P(features[i])
      if (pick.isEnding.has(i)) {
        movedEnd.add(i)
        features[i] = { ...features[i], properties: withSpan(p, rowStart(p), ev.t - 1) }
      } else {
        movedStart.add(i)
        features[i] = { ...features[i], properties: withSpan(p, ev.t, rowEnd(p)) }
      }
    }
    changes++
    rowsMoved += pick.rows.size
    const names = [...pick.names]
    if (ev.box || names.length > 1) log(`  ${fmt(ev.t)} ${ev.what} (boundary ${pick.B}): ${names.slice(0, 6).join(', ')}${names.length > 6 ? ` +${names.length - 6} more` : ''}`)
  }
  log(`Dated ${changes} border changes to the month (${rowsMoved} row ends)`)
  return features
}
