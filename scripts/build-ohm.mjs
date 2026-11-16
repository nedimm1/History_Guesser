// Builds the game's border data for 2000 on from OpenHistoricalMap (CC0, no strings attached):
// https://www.openhistoricalmap.org
//
// Cliopatria (scripts/build-cliopatria.mjs) has only four different world maps after 2000, some
// with the wrong year (South Sudan from 2014). OHM records each country's borders with start and
// end dates, so Montenegro (2006), Kosovo (2008), South Sudan (2011), Crimea (2014), Eswatini
// (2018), North Macedonia (2019), Türkiye (2022) … all appear in the right year.
//
// It writes public/data/<OHM_FROM>.json (same TopoJSON layout as the Cliopatria chunks), replacing
// that chunk. Each year shows the map as it stood at the end of that year, so South Sudan
// (independent July 2011) is on the 2011 map.
//
// Run with: npm run data:modern   (downloads the source into data-src/ on first run, ~280 MB)
import fs from 'fs'
import { createRequire } from 'module'
import { geoArea } from 'd3-geo'
import mapshaper from 'mapshaper'
import { MAX_YEAR, OHM_FROM } from '../src/chunks.js'

const osmtogeojson = createRequire(import.meta.url)('osmtogeojson')

const OVERPASS = 'https://overpass-api.openhistoricalmap.org/api/interpreter'
const SRC = 'data-src/ohm-modern.json'
const OUT = `public/data/${OHM_FROM}.json`

// Not real countries: test edits left in OHM, and a river condominium that has no land.
const SKIP = new Set(['Goseria', 'Pulerid', 'Kongroneria', 'Germany-Luxembourg condominium'])

// Dates OHM only gives to the year, which leave a gap: [name, field, exact date].
const DATES = [
  ['Transitional Islamic State of Afghanistan', 'start_date', '2001-12-22'], // the interim government took over in December 2001
]

// Wikidata IDs for the countries OHM has none for (scripts/build-flags.mjs finds flags by them).
const WIKIDATA = {
  'United Kingdom': 'Q145', Mongolia: 'Q711', Tajikistan: 'Q863', Uzbekistan: 'Q265', Kyrgyzstan: 'Q813',
  Laos: 'Q819', Pakistan: 'Q843', Sudan: 'Q1049', Maldives: 'Q826', Ethiopia: 'Q115', Somalia: 'Q1045',
  Eritrea: 'Q986', Honduras: 'Q783', Afghanistan: 'Q889', 'Islamic Republic of Afghanistan': 'Q889',
  'Transitional Islamic State of Afghanistan': 'Q889', 'Islamic Emirate of Afghanistan': 'Q427941',
  Kuwait: 'Q817', Syria: 'Q858', Guatemala: 'Q774', Malaysia: 'Q833', Cambodia: 'Q424',
  'Guinea-Bissau': 'Q1007', Nicaragua: 'Q811',
}

// Dependencies OHM maps as countries of their own; MemberOf gives them their ruler's colour.
const RULERS = {
  'United Kingdom': [
    'Gibraltar', 'Bermuda', 'British Virgin Islands', 'Montserrat', 'Colony of the Turks and Caicos Islands',
    'Cayman Islands', 'Anguilla', 'Pitcairn Islands', 'Akrotiri and Dhekelia', 'British Indian Ocean Territory',
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

// "2006-06-03" → 2006.42 (fraction of the year), "1945" → 1945.
function dateOf(s) {
  const m = String(s ?? '').match(/^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?/)
  return m ? +m[1] + ((+m[2] || 1) - 1) / 12 + ((+m[3] || 1) - 1) / 365 : null
}

// Years whose end falls in [start, end): from the year it began to the year before it ended.
const firstYear = (start) => Math.floor(start)
// (A country ending on 31 December still counts for that year.)
const lastYear = (end) => (end === null ? MAX_YEAR : Math.floor(end + 2 / 365) - 1)

async function source() {
  if (fs.existsSync(SRC)) return JSON.parse(fs.readFileSync(SRC))
  console.log('Listing OHM countries…')
  const list = JSON.parse(await overpass('[out:json][timeout:180];relation["boundary"="administrative"]["admin_level"="2"];out tags;'))
  const ids = list.elements
    .filter(({ tags }) => {
      const start = dateOf(tags.start_date)
      return start !== null && firstYear(start) <= MAX_YEAR && lastYear(dateOf(tags.end_date)) >= OHM_FROM
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
  for (const [n, field, date] of DATES) if (p.name === n || p['name:en'] === n) p[field] = date
  const name = (p['name:en'] || p.name || '').replace(/\s*\([^)]*\d{4}[^)]*\)$/, '') // "Ethiopia (1993-)"
  const start = dateOf(p.start_date)
  if (!name || SKIP.has(name) || start === null) continue
  const FromYear = Math.max(firstYear(start), OHM_FROM)
  const ToYear = Math.min(lastYear(dateOf(p.end_date)), MAX_YEAR)
  if (FromYear > ToYear) continue
  const g = f.geometry
  g.coordinates = g.type === 'Polygon' ? rewind(g.coordinates) : g.coordinates.map(rewind)
  // A relation that is really a border line assembles into a near-global polygon.
  if (geoArea(g) > 4 * Math.PI * 0.08) continue
  features.push({ type: 'Feature', properties: { Name: name, FromYear, ToYear, MemberOf: ruler.get(name) ?? null, Wikidata: p.wikidata || WIKIDATA[name] || null }, geometry: g })
}

// Where two countries claim the same land (Ukraine keeps Crimea in OHM after Russia's 2014
// annexation), the one whose borders are newer is drawn on top: the side holding it now.
features.sort((a, b) => a.properties.FromYear - b.properties.FromYear)

const tmp = 'data-src/ohm-modern.geojson'
fs.writeFileSync(tmp, JSON.stringify({ type: 'FeatureCollection', features }))
await mapshaper.runCommands(
  `-i ${tmp} -rename-layers borders -simplify 3% keep-shapes -filter-islands min-area=20km2 ` +
    `-o ${OUT} format=topojson quantization=100000`,
)
fs.rmSync(tmp)
console.log(`Wrote ${features.length} territories to ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`)
