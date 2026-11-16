// Builds the flags shown next to country names, for years from FLAGS_FROM on (before about 1500
// few states had anything like a national flag).
//
// For each territory name in public/data/*.json (built by build-cliopatria.mjs and build-ohm.mjs)
// and each year it exists, the flag is the first of:
//   1. a hand-checked timeline for that name (NAME_FLAGS in scripts/flag-table.mjs),
//   2. the power's timeline, if the territory is one of the big powers (POWER_FLAGS),
//   3. its Wikidata flag (P41) for that year: dated ones, or undated ones for states founded
//      after 1945 (an undated flag is usually today's, which older states didn't fly),
//   4. its ruling power's flag, for colonies (src/owners.js decides who rules what).
// Only public-domain/CC0 images from Wikimedia Commons are used, so no credit is needed.
//
// Writes public/flags/<id>.png (small thumbnails) and public/flags/index.json:
//   { flags: { id: aspectRatio }, names: { territoryName: [[fromYear, toYear, id], …] } }
//
// Run with: npm run data:flags   (after the border data; caches Wikidata answers in data-src/)
import fs from 'fs'
import crypto from 'crypto'
import { FLAGS_FROM } from '../src/chunks.js'
import { ownerOf } from '../src/owners.js'
import { POWER_FLAGS, NAME_FLAGS, BLOCKED_FILES } from './flag-table.mjs'

const OUT = 'public/flags'
const CACHE = 'data-src/wikidata-flags.json'
const HEADERS = { 'User-Agent': 'HistoryGuesserFlagBuild/1.0 (map game data build script)' }
const PUBLIC_DOMAIN = /public domain|^PD|CC0/i
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchRetry(url, tries = 6) {
  for (let i = 0; ; i++) {
    const res = await fetch(url, { headers: HEADERS })
    if (res.ok) return res
    if (i >= tries || (res.status !== 429 && res.status < 500)) throw new Error(`${res.status} for ${url}`)
    await sleep(5000 * (i + 1))
  }
}

// --- territories: name → rows of [from, to, wikidata, memberOf] ---
const territories = new Map()
for (const f of fs.readdirSync('public/data')) {
  if (!/^-?\d+\.json$/.test(f)) continue
  for (const { properties: p } of JSON.parse(fs.readFileSync(`public/data/${f}`)).objects.borders.geometries) {
    if (p.ToYear < FLAGS_FROM) continue
    const rows = territories.get(p.Name) ?? territories.set(p.Name, []).get(p.Name)
    if (!rows.some((r) => r.from === p.FromYear && r.to === p.ToYear)) rows.push({ from: p.FromYear, to: p.ToYear, qid: p.Wikidata, memberOf: p.MemberOf })
  }
}
console.log(`${territories.size} territory names from ${FLAGS_FROM} on`)

// --- Wikidata flag statements, with their start/end dates ---
async function wikidataFlags(qids) {
  if (fs.existsSync(CACHE)) {
    const cached = JSON.parse(fs.readFileSync(CACHE))
    if (qids.every((q) => q in cached)) return cached
  }
  const out = Object.fromEntries(qids.map((q) => [q, []]))
  for (let i = 0; i < qids.length; i += 200) {
    const values = qids.slice(i, i + 200).map((q) => `wd:${q}`).join(' ')
    const query = `SELECT ?item ?flag ?start ?end ?rank WHERE { VALUES ?item { ${values} } ?item p:P41 ?st .
      ?st ps:P41 ?flag ; wikibase:rank ?rank . OPTIONAL { ?st pq:P580 ?start } OPTIONAL { ?st pq:P582 ?end }
      FILTER(?rank != wikibase:DeprecatedRank) }`
    const res = await fetchRetry(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`)
    for (const b of (await res.json()).results.bindings) {
      out[b.item.value.split('/').pop()].push({
        file: decodeURIComponent(b.flag.value.split('/').pop()),
        start: b.start?.value ?? null,
        end: b.end?.value ?? null,
        preferred: b.rank.value.endsWith('PreferredRank'),
      })
    }
  }
  fs.mkdirSync('data-src', { recursive: true })
  fs.writeFileSync(CACHE, JSON.stringify(out))
  return out
}

const qids = [...new Set([...territories.values()].flat().map((r) => r.qid).filter(Boolean))]
const statements = await wikidataFlags(qids)

const yearOf = (iso) => (iso ? parseInt(iso.slice(0, iso[0] === '-' ? 5 : 4), 10) : null)

// [from, to] a statement covers, or null if Wikidata gives no dates. Years in the file name
// ("Flag of Spain (1873–1874).svg") count as dates too.
function spanOf(s) {
  const named = [...s.file.matchAll(/(\d{4})\s*[–-]\s*(\d{4})/g)].map((m) => [+m[1], +m[2]])
  const single = s.file.match(/\((\d{4})\)/)
  let from = yearOf(s.start)
  let to = s.end ? yearOf(s.end) - 1 : null
  if (from === null && named.length) from = named[0][0]
  if (to === null && named.length) to = named[0][1] - 1
  if (from === null && single) from = +single[1]
  if (from === null && to === null) return null
  return [from ?? -Infinity, Math.max(to ?? Infinity, from ?? -Infinity)]
}

function fromWikidata(qid, year, founded) {
  const found = (statements[qid] || [])
    .filter((s) => !/fictitious|fictional|hypothetical|possible|proposal/i.test(s.file))
    .map((s) => ({ ...s, span: spanOf(s) }))
    .filter((s) => (s.span ? s.span[0] <= year && year <= s.span[1] : founded >= 1945))
    // Preferred rank first, then dated over undated, then the narrowest dates.
    .sort((a, b) => b.preferred - a.preferred || !!b.span - !!a.span || width(a.span) - width(b.span))
  return found[0]?.file ?? null
}
const width = (span) => (span ? span[1] - span[0] : Infinity)

// The file a timeline gives for the year: a name, NONE (null in the table: no flag), or undefined.
const NONE = Symbol('no flag')
function fromTimeline(timeline, year) {
  const hit = timeline?.find(([a, b]) => a <= year && year <= b)
  return hit ? (hit[2] ?? NONE) : undefined
}

function flagFor(name, row, year) {
  const named = NAME_FLAGS.find(([re]) => re.test(name))
  const self = ownerOf({ Name: name, MemberOf: '' }) // the power the name itself belongs to, else the name
  const owner = ownerOf({ Name: name, MemberOf: row.memberOf })
  const file =
    fromTimeline(named?.[1], year) ??
    fromTimeline(POWER_FLAGS[self], year) ??
    (row.qid ? fromWikidata(row.qid, year, row.from) : null) ??
    fromTimeline(POWER_FLAGS[owner], year) ??
    null
  return file === NONE ? null : file
}

// --- name → [[from, to, file]] ---
const timelines = new Map()
for (const [name, rows] of territories) {
  const years = new Map()
  for (const row of rows) {
    for (let y = Math.max(row.from, FLAGS_FROM); y <= row.to; y++) {
      const file = flagFor(name, row, y)
      if (file && !BLOCKED_FILES.test(file)) years.set(y, file)
    }
  }
  const runs = []
  for (const y of [...years.keys()].sort((a, b) => a - b)) {
    const last = runs[runs.length - 1]
    if (last && last[1] === y - 1 && last[2] === years.get(y)) last[1] = y
    else runs.push([y, y, years.get(y)])
  }
  if (runs.length) timelines.set(name, runs)
}

// --- Commons: licence and thumbnail of every file used ---
const files = [...new Set([...timelines.values()].flat().map((r) => r[2]))]
const info = {}
for (let i = 0; i < files.length; i += 40) {
  const titles = files.slice(i, i + 40).map((f) => `File:${f}`).join('|')
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1' +
    `&prop=imageinfo&iiprop=url|size|extmetadata&iiextmetadatafilter=LicenseShortName&iiurlheight=48&titles=${encodeURIComponent(titles)}`
  const j = await (await fetchRetry(url)).json()
  const back = {}
  for (const n of j.query.normalized || []) back[n.to] = n.from
  for (const r of j.query.redirects || []) back[r.to] = back[r.from] ?? r.from
  for (const p of j.query.pages) {
    const ii = p.imageinfo?.[0]
    if (ii) info[(back[p.title] ?? p.title).replace(/^File:/, '')] = { license: ii.extmetadata?.LicenseShortName?.value ?? '', thumb: ii.thumburl, aspect: ii.width / ii.height }
  }
  await sleep(1000)
}

fs.mkdirSync(OUT, { recursive: true })
const idOf = (file) => crypto.createHash('sha1').update(file).digest('hex').slice(0, 10)
const flags = {}
const dropped = []
for (const file of files) {
  const fi = info[file]
  if (!fi || !PUBLIC_DOMAIN.test(fi.license)) {
    dropped.push(`${file} (${fi ? fi.license || 'no licence' : 'missing'})`)
    continue
  }
  const id = idOf(file)
  const dest = `${OUT}/${id}.png`
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, Buffer.from(await (await fetchRetry(fi.thumb)).arrayBuffer()))
    await sleep(300)
  }
  flags[id] = Math.round(fi.aspect * 100) / 100
}

const names = {}
for (const [name, runs] of [...timelines].sort(([a], [b]) => a.localeCompare(b))) {
  const kept = runs.filter((r) => flags[idOf(r[2])]).map(([a, b, f]) => [a, b, idOf(f)])
  if (kept.length) names[name] = kept
}
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png') && !flags[f.slice(0, -4)]) fs.rmSync(`${OUT}/${f}`)
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify({ flags, names }))
fs.writeFileSync(`data-src/flags-report.txt`, [
  `Not public domain or missing, so not used:`, ...dropped.map((d) => `  ${d}`), '',
  `Flags by territory:`, ...Object.entries(names).map(([n, r]) => `  ${n}: ${r.map(([a, b, id]) => `${a}–${b} ${files.find((f) => idOf(f) === id)}`).join('; ')}`),
].join('\n'))
console.log(`${Object.keys(flags).length} flags for ${Object.keys(names).length} territories; ${dropped.length} images skipped (see data-src/flags-report.txt)`)
