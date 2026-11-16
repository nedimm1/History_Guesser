// Builds the game's border data from Cliopatria (Seshat Global History Databank, CC BY 4.0):
// https://github.com/Seshat-Global-History-Databank/cliopatria
//
// Cliopatria has one row per polity per period (FromYear–ToYear), so any year can be shown. This
// splits the timeline into chunks: one per century before 1700, one per 25 years after (borders
// change far more often then). public/data/<start>.json holds every territory alive at some point
// in that chunk, as TopoJSON (object "borders"); the game loads the chunk and keeps the rows whose
// FromYear–ToYear contains the year being played. public/data/index.json lists the chunks.
//
// Only real territories are kept: the "(British Empire)"-style rows that outline a whole empire
// are dropped, and each territory keeps MemberOf (its empire) so colonies get their ruler's colour.
//
// Chunks from OHM_FROM on come from OpenHistoricalMap instead (scripts/build-ohm.mjs); this script
// leaves them alone.
//
// Run with: npm run data:history   (downloads the source into data-src/ on first run)
import fs from 'fs'
import { execFileSync } from 'child_process'
import mapshaper from 'mapshaper'
import { MIN_YEAR, MAX_YEAR, OHM_FROM, chunks } from '../src/chunks.js'

// Corrections to Cliopatria's newest rows, where a polity keeps an outdated name:
// [name in the data, rows starting from this year on, corrected name].
const RENAMES = [
  ['Kingdom of Great Britain', 1801, 'United Kingdom'], // Act of Union 1801
  ['Mali Federation', 1961, 'Mali'], // the federation broke up in 1960; the shape is Mali
  ['Estado Novo', 1976, "People's Republic of Angola"], // Cabinda, part of Angola since 1975
  ['Mujahideen', 2014, 'Syrian opposition'], // the 2014+ rows are rebel-held northern Syria
]

const SOURCE_ZIP = 'https://github.com/Seshat-Global-History-Databank/cliopatria/raw/main/cliopatria.geojson.zip'
const SRC_DIR = 'data-src'
const OUT_DIR = 'public/data'

async function source() {
  fs.mkdirSync(SRC_DIR, { recursive: true })
  let file = fs.readdirSync(SRC_DIR).find((f) => /^cliopatria.*\.geojson$/.test(f))
  if (!file) {
    console.log('Downloading Cliopatria…')
    const res = await fetch(SOURCE_ZIP)
    if (!res.ok) throw new Error(`Download failed: ${res.status}`)
    fs.writeFileSync(`${SRC_DIR}/cliopatria.geojson.zip`, Buffer.from(await res.arrayBuffer()))
    execFileSync('unzip', ['-o', '-q', 'cliopatria.geojson.zip'], { cwd: SRC_DIR })
    file = fs.readdirSync(SRC_DIR).find((f) => /^cliopatria.*\.geojson$/.test(f))
  }
  console.log(`Source: ${SRC_DIR}/${file}`)
  return `${SRC_DIR}/${file}`
}

const src = await source()
const base = `${SRC_DIR}/territories.json`
await mapshaper.runCommands(
  `-i ${src} -filter 'Type === "POLITY" && Name[0] !== "(" && ToYear >= ${MIN_YEAR} && FromYear <= ${MAX_YEAR}' ` +
    `-filter-fields Name,FromYear,ToYear,MemberOf -o ${base} format=geojson`,
)

const territories = JSON.parse(fs.readFileSync(base))
for (const f of territories.features) {
  const fix = RENAMES.find(([name, from]) => f.properties.Name === name && f.properties.FromYear >= from)
  if (fix) f.properties.Name = fix[2]
}
fs.writeFileSync(base, JSON.stringify(territories))

const list = chunks()
const mine = list.filter(([from]) => from < OHM_FROM)
const keep = new Set([...list.filter(([from]) => from >= OHM_FROM).map(([from]) => `${from}.json`), 'index.json'])
for (const f of fs.readdirSync(OUT_DIR)) if (f.endsWith('.json') && !keep.has(f)) fs.rmSync(`${OUT_DIR}/${f}`)
for (const [from, to] of mine) {
  await mapshaper.runCommands(
    `-i ${base} -filter 'FromYear <= ${to} && ToYear >= ${from}' -rename-layers borders ` +
      `-simplify 40% keep-shapes -o ${OUT_DIR}/${from}.json format=topojson quantization=100000`,
  )
}
fs.writeFileSync(
  `${OUT_DIR}/index.json`,
  JSON.stringify({
    sources: { [`${MIN_YEAR}–${OHM_FROM - 1}`]: 'Cliopatria (Seshat Global History Databank), CC BY 4.0', [`${OHM_FROM}–${MAX_YEAR}`]: 'OpenHistoricalMap, CC0' },
    minYear: MIN_YEAR, maxYear: MAX_YEAR, chunks: list }),
)
fs.rmSync(base)
console.log(`Wrote ${mine.length} chunks to ${OUT_DIR}/ (chunks from ${OHM_FROM}: npm run data:modern)`)
