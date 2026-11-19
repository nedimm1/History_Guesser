// Builds the game's border data for 2000 on from OpenHistoricalMap (CC0, no strings attached):
// https://www.openhistoricalmap.org
//
// Cliopatria (scripts/build-cliopatria.mjs) has only four different world maps after 2000, some
// with the wrong year (South Sudan from 2014). OHM records each country's borders with start and
// end dates, so Montenegro (2006), Kosovo (2008), South Sudan (2011), Crimea (2014), Eswatini
// (2018), North Macedonia (2019), Türkiye (2022) … all appear in the right year.
//
// It writes public/data/<OHM_FROM>.json (same TopoJSON layout as the Cliopatria chunks), replacing
// that chunk. Spans are kept to the month (FromYear/FromMonth–ToYear/ToMonth, see src/dates.js):
// each month shows the map as it stood at the end of that month, so South Sudan (independent
// 9 July 2011) is on the map from July 2011.
//
// Run with: npm run data:modern   (downloads the source into data-src/ on first run, ~280 MB)
import fs from 'fs'
import { createRequire } from 'module'
import { geoArea } from 'd3-geo'
import mapshaper from 'mapshaper'
import { MAX_YEAR, OHM_FROM } from '../src/chunks.js'
import { monthIndex, withSpan } from '../src/dates.js'
import { applyFixes } from './history-fixes.mjs'
import MODERN_FIXES from './history-fixes/modern.mjs'

const osmtogeojson = createRequire(import.meta.url)('osmtogeojson')

const OVERPASS = 'https://overpass-api.openhistoricalmap.org/api/interpreter'
const SRC = 'data-src/ohm-modern.json'
const OUT = `public/data/${OHM_FROM}.json`

// Not real countries: test edits left in OHM, and a river condominium that has no land. Numbers
// are OHM relation IDs: outdated versions of a country that a newer, better version replaces.
const SKIP = new Set([
  'Goseria', 'Pulerid', 'Kongroneria', 'Germany-Luxembourg condominium',
  2851798, // Norway before 2004, without Svalbard and Jan Mayen (Norwegian since 1925/1929)
  2945317, // Ecuador before 2012, whose Galápagos is a huge block of ocean
])

// Dates OHM has wrong or only to the year: [name or OHM relation ID, field, date]. An empty date
// means none (no end date: still exists).
const DATES = [
  ['Transitional Islamic State of Afghanistan', 'start_date', '2001-12-22'], // the interim government took over in December 2001
  // OHM ends these British territories in 2002 (when they became "overseas territories") with no
  // successor; they never stopped being British.
  ['British Virgin Islands', 'end_date', ''],
  ['Cayman Islands', 'end_date', ''],
  ['Colony of the Turks and Caicos Islands', 'end_date', ''],
  ['Montserrat', 'end_date', ''],
  ['Anguilla', 'start_date', '1980-12-19'], // separate from Saint Kitts and Nevis since 1980
  [2876342, 'start_date', '1946-10-27'], // French Polynesia (a French territory since 1946)
  ['Wallis and Futuna', 'start_date', '1961-07-29'],
  [2851792, 'start_date', '1925-08-14'], // Norway with Svalbard, replacing the older version
  [2945316, 'start_date', '1966-11-10'], // Ecuador, replacing the older version
]

// Names OHM gives that aren't the ones in use: [name or OHM relation ID, name to show].
const NAMES = [
  ['Colony of the Turks and Caicos Islands', 'Turks and Caicos Islands'], // a colony until 1976
  [2864409, 'East Timor (UN administration)'], // UNTAET ran it from 1999 until independence in May 2002
  [2822856, 'Islamic Emirate of Afghanistan'], // the Taliban's state since August 2021
  ['Yugoslavia', 'Federal Republic of Yugoslavia'], // its official name until Serbia and Montenegro (February 2003)
]

// Wikidata IDs for the countries OHM has none for (scripts/build-flags.mjs finds flags by them).
const WIKIDATA = {
  'United Kingdom': 'Q145', Mongolia: 'Q711', Tajikistan: 'Q863', Uzbekistan: 'Q265', Kyrgyzstan: 'Q813',
  Laos: 'Q819', Pakistan: 'Q843', Sudan: 'Q1049', Maldives: 'Q826', Ethiopia: 'Q115', Somalia: 'Q1045',
  Eritrea: 'Q986', Honduras: 'Q783', Afghanistan: 'Q889', 'Islamic Republic of Afghanistan': 'Q889',
  'Transitional Islamic State of Afghanistan': 'Q889', 'Islamic Emirate of Afghanistan': 'Q427941',
  'Turks and Caicos Islands': 'Q18221',
  Kuwait: 'Q817', Syria: 'Q858', Guatemala: 'Q774', Malaysia: 'Q833', Cambodia: 'Q424',
  'Guinea-Bissau': 'Q1007', Nicaragua: 'Q811',
}

// Dependencies OHM maps as countries of their own; MemberOf gives them their ruler's colour.
const RULERS = {
  'United Kingdom': [
    'Gibraltar', 'Bermuda', 'British Virgin Islands', 'Montserrat', 'Colony of the Turks and Caicos Islands',
    'Cayman Islands', 'Anguilla', 'Turks and Caicos Islands', 'Pitcairn Islands', 'Akrotiri and Dhekelia', 'British Indian Ocean Territory',
    'Saint Helena and Dependencies', 'Saint Helena, Ascension and Tristan da Cunha', 'Guernsey', 'Jersey', 'Isle of Man',
  ],
  Denmark: ['Greenland'],
  France: ['French Polynesia', 'Wallis and Futuna'],
}

async function overpass(query) {
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'User-Agent': 'history-guesser-data-build/1.0' },
    body: new URLSearchParams({ data: query }),
  })
  if (!res.ok) throw new Error(`Overpass: ${res.status} ${await res.text()}`)
  return res.text()
}

// "2006-06-03" → [2006, 6, 3]; missing parts are null ("1945" → [1945, null, null]).
function parts(s) {
  const m = String(s ?? '').match(/^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?/)
  return m ? [+m[1], m[2] ? +m[2] : null, m[3] ? +m[3] : null] : null
}

// The months whose end a country lived through: from the month it began in, to the last month it
// still held at the month's end. end_date is its last day, so one ending on 31 December 1991 counts
// for December; one ending on 9 July 2011 ends with June. A bare year or month means its first day.
function firstMonth(s) {
  const p = parts(s)
  return p && monthIndex(p[0], p[1] ?? 1)
}
function lastMonth(s) {
  const p = parts(s)
  if (!p) return monthIndex(MAX_YEAR, 12)
  const [y, m, d] = p
  if (m === null) return monthIndex(y, 1) - 1
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return d === lastDay ? monthIndex(y, m) : monthIndex(y, m) - 1
}

async function source() {
  if (fs.existsSync(SRC)) return JSON.parse(fs.readFileSync(SRC))
  console.log('Listing OHM countries…')
  const list = JSON.parse(await overpass('[out:json][timeout:180];relation["boundary"="administrative"]["admin_level"="2"];out tags;'))
  const ids = list.elements
    .filter(({ tags }) => {
      const start = firstMonth(tags.start_date)
      return start !== null && start <= monthIndex(MAX_YEAR, 12) && lastMonth(tags.end_date) >= monthIndex(OHM_FROM, 1)
    })
    .map((r) => r.id)
  console.log(`Downloading ${ids.length} countries (a few minutes)…`)
  const text = await overpass(`[out:json][timeout:1100];relation(id:${ids.join(',')});out geom;`)
  fs.mkdirSync('data-src', { recursive: true })
  fs.writeFileSync(SRC, text)
  return JSON.parse(text)
}

const osm = await source()
const ruler = new Map(Object.entries(RULERS).flatMap(([r, names]) => names.map((n) => [n, `(${r})`])))
// d3 wants polygons wound clockwise; one wound the wrong way covers the whole globe but itself.
const rewind = (poly) => (geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly)

const features = []
for (const f of osmtogeojson(osm, { flatProperties: true }).features) {
  if (!/Polygon/.test(f.geometry?.type) || !f.id?.startsWith('relation')) continue
  const p = f.properties
  const id = +f.id.split('/')[1]
  const is = (n) => n === id || p.name === n || p['name:en'] === n
  for (const [n, field, date] of DATES) if (is(n)) p[field] = date
  let name = (p['name:en'] || p.name || '').replace(/\s*\([^)]*\d{4}[^)]*\)$/, '') // "Ethiopia (1993-)"
  name = NAMES.find(([n]) => is(n))?.[1] ?? name
  const start = firstMonth(p.start_date)
  if (!name || SKIP.has(name) || SKIP.has(id) || start === null) continue
  const from = Math.max(start, monthIndex(OHM_FROM, 1))
  const to = Math.min(lastMonth(p.end_date), monthIndex(MAX_YEAR, 12))
  if (from > to) continue
  const g = f.geometry
  g.coordinates = g.type === 'Polygon' ? rewind(g.coordinates) : g.coordinates.map(rewind)
  // A relation that is really a border line assembles into a near-global polygon.
  if (geoArea(g) > 4 * Math.PI * 0.08) continue
  const props = withSpan({ Name: name, MemberOf: ruler.get(name) ?? null, Wikidata: p.wikidata || WIKIDATA[name] || null }, from, to)
  features.push({ type: 'Feature', properties: props, geometry: g })
}

// Where two countries claim the same land (Ukraine keeps Crimea in OHM after Russia's 2014
// annexation), the one whose borders are newer is drawn on top: the side holding it now.
const startOf = ({ properties: p }) => monthIndex(p.FromYear, p.FromMonth)
features.sort((a, b) => startOf(a) - startOf(b))

// Breakaway states and occupied land (scripts/history-fixes/modern.mjs), drawn last so they sit on top.
const fixed = await applyFixes(features, MODERN_FIXES)

const tmp = 'data-src/ohm-modern.geojson'
fs.writeFileSync(tmp, JSON.stringify({ type: 'FeatureCollection', features: fixed }))
await mapshaper.runCommands(
  `-i ${tmp} -rename-layers borders -simplify 3% keep-shapes -filter-islands min-area=20km2 ` +
    `-o ${OUT} format=topojson quantization=100000`,
)
fs.rmSync(tmp)
console.log(`Wrote ${fixed.length} territories to ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`)
