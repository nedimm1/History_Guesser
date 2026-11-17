// Tries out history fixes without rebuilding: applies RENAMES and scripts/history-fixes/ (plus an
// optional draft file of extra fixes, `export default [...]`) to the Cliopatria source in memory, then
// answers questions about the result.
//
//   node scripts/check-fixes.mjs [--draft file.mjs] at YEAR LAT LON [YEAR LAT LON …]
//       which territories cover that point in that year
//   node scripts/check-fixes.mjs [--draft file.mjs] list YEAR TEXT [TEXT …]
//       territories alive in YEAR whose name contains TEXT: area (thousand km²), largest piece
//
// Takes a minute or so; warnings print for fixes that match nothing.
import fs from 'fs'
import path from 'path'
import { geoArea, geoCentroid, geoContains } from 'd3-geo'
import { FIXES, applyFixes } from './history-fixes.mjs'
import { RENAMES } from './build-cliopatria-renames.mjs'

const args = process.argv.slice(2)
let draft = []
if (args[0] === '--draft') {
  draft = (await import(path.resolve(args[1]))).default
  args.splice(0, 2)
}
const src = JSON.parse(fs.readFileSync('data-src/' + fs.readdirSync('data-src').find((f) => /^cliopatria.*\.geojson$/.test(f))))
const feats = src.features.filter((f) => f.properties.Type === 'POLITY' && f.properties.Name[0] !== '(')
for (const f of feats) {
  const fix = RENAMES.find(([n, y]) => f.properties.Name === n && f.properties.FromYear >= y)
  if (fix) f.properties.Name = fix[2]
}
const out = await applyFixes(feats, [...FIXES, ...draft])
const alive = (y) => out.filter((f) => f.properties.FromYear <= y && y <= f.properties.ToYear)
const K = 40589641 / 1000
const upright = (c) => { const q = { type: 'Polygon', coordinates: c }; return geoArea(q) > 2 * Math.PI ? { type: 'Polygon', coordinates: c.map((r) => [...r].reverse()) } : q }
const pieces = (f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).map(upright)
const [cmd, ...rest] = args
if (cmd === 'at') {
  for (let i = 0; i < rest.length; i += 3) {
    const [y, lat, lon] = rest.slice(i, i + 3).map(Number)
    const hits = alive(y).filter((f) => pieces(f).some((q) => geoContains(q, [lon, lat]))).map((f) => f.properties.Name)
    console.log(`${y} ${lat},${lon}: ${hits.join(' | ') || '(nobody)'}`)
  }
} else if (cmd === 'list') {
  const [y, ...texts] = rest
  for (const f of alive(+y)) {
    const p = f.properties
    if (!texts.some((t) => p.Name.includes(t))) continue
    const ps = pieces(f).map((q) => ({ a: geoArea(q) * K, c: geoCentroid(q) })).sort((a, b) => b.a - a.a)
    console.log(`${p.Name} ${p.FromYear}-${p.ToYear}: ${Math.round(ps.reduce((t, x) => t + x.a, 0))}k, largest ${Math.round(ps[0].a)}k@${ps[0].c[1].toFixed(1)},${ps[0].c[0].toFixed(1)} (${ps.length} pieces)${p.MemberOf ? ' ' + p.MemberOf : ''}`)
  }
}
