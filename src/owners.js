// Colours territories by who rules them, so colonies and fiefs share their ruler's colour (the
// British Raj and British Africa are painted like Britain, the Duchy of Burgundy like France). The
// hover name and the map labels still show the territory's own name.
//
// Cliopatria records the empire a territory belongs to in MemberOf ("(British Empire)",
// "(Kingdom of France)"), and names some colonies after their ruler ("German Africa", "Belgian
// Congo"). Both are matched against the big powers below, which keep one fixed colour through all
// their names (Kingdom of England → United Kingdom, Tsardom of Russia → Soviet Union, …).

// [power, pattern]. The first match wins, so more specific patterns come first.
const POWERS = [
  ['United States', /^United States of America$/],
  ['United Kingdom', /\bBritish\b|\bBritain\b|\bEngland\b|\bEnglish\b|United Kingdom of Great Britain|Commonwealth of Nations/],
  ['France', /\bFrench\b|\bFrance\b|Bourbon Kingdom|Vichy/],
  ['Spain', /\bSpanish\b|\bSpain\b|\bCastile\b/],
  ['Portugal', /\bPortug/],
  ['Netherlands', /\bDutch\b|\bNetherland|\bBatavian\b/],
  ['Belgium', /\bBelgi/],
  ['Germany', /\bGerman\b|\bGermany\b|\bPrussia\b|\bNazi\b/],
  ['Austria', /\bAustria|Habsburg Monarchy/],
  ['Italy', /\bItaly\b|\bItalian\b/],
  ['Denmark', /\bDanish\b|\bDenmark\b/],
  ['Sweden', /\bSwed/],
  ['Russia', /\bRussia|\bSoviet\b|\bMuscov/],
  ['Japan', /\bJapan\b|\bTokugawa\b/],
  ['Ottoman Empire', /\bOttoman\b/],
]

const powerOf = (name) => POWERS.find(([, re]) => re.test(name))?.[0] ?? null

// The name whose colour a territory takes: its empire's power, else its own power, else itself.
export function ownerOf({ Name, MemberOf }) {
  for (const parent of (MemberOf || '').split(';')) {
    const power = powerOf(parent.replace(/^\(|\)$/g, ''))
    if (power) return power
  }
  return powerOf(Name) ?? Name
}

// Fixed colours for the big powers, so they're recognisable from map to map.
const POWER_COLORS = {
  'United Kingdom': '#d9837f',
  France: '#7f9fcf',
  Spain: '#e3c25e',
  Portugal: '#8dbb7f',
  Netherlands: '#e8a25a',
  Germany: '#9a9a8c',
  Italy: '#a6c48a',
  Belgium: '#c9b07a',
  Russia: '#b9a0cc',
  'United States': '#86b8b0',
  Japan: '#e09aa8',
  'Ottoman Empire': '#b98b6d',
  Denmark: '#d4a3b8',
  Sweden: '#8fb3c9',
  Austria: '#c7b6a0',
}

const PALETTE = [
  '#c9a26b', '#a7b37a', '#d4876a', '#8fa9b8', '#c48fa0', '#b7a3cf',
  '#9fc29a', '#e0b85c', '#a98a6d', '#7fb3a6', '#d99a8f', '#b4b86a',
]

const hashOf = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0)
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const TOO_CLOSE = 45 // RGB distance under which two neighbours' colours read as the same

// One colour per territory. owners[i] is ownerOf() of territory i; neighbours[i] lists the indexes
// of the territories bordering it. The big powers keep their fixed colours; everyone else starts
// from a colour picked by name (stable from map to map) but moves along the palette until it's
// clearly different from every neighbour's, so the Qing don't blur into the Russian Empire.
export function assignColors(owners, neighbours) {
  const near = new Map(owners.map((o) => [o, new Set()]))
  owners.forEach((o, i) => {
    for (const j of neighbours[i] || []) if (owners[j] !== o) near.get(o).add(owners[j])
  })
  const color = new Map()
  for (const o of near.keys()) if (POWER_COLORS[o]) color.set(o, POWER_COLORS[o])
  const rest = [...near.keys()].filter((o) => !color.has(o)).sort((a, b) => near.get(b).size - near.get(a).size)
  for (const o of rest) {
    const start = hashOf(o) % PALETTE.length
    const taken = [...near.get(o)].map((n) => color.get(n)).filter(Boolean).map(rgb)
    // First colour (in palette order from the name's) clear of every neighbour; if none is (a
    // territory with many neighbours), the one furthest from its nearest neighbour's colour.
    let pick = null
    let best = { c: PALETTE[start], d: -1 }
    for (let k = 0; k < PALETTE.length && !pick; k++) {
      const c = PALETTE[(start + k) % PALETTE.length]
      const [r, g, b] = rgb(c)
      const d = Math.min(Infinity, ...taken.map(([r2, g2, b2]) => Math.hypot(r - r2, g - g2, b - b2)))
      if (d >= TOO_CLOSE) pick = c
      else if (d > best.d) best = { c, d }
    }
    color.set(o, pick ?? best.c)
  }
  return owners.map((o) => color.get(o))
}

// Very long official names, shortened to the one people know.
const SHORT_NAMES = {
  'Union of Soviet Socialist Republics': 'Soviet Union',
  'United Kingdom of Great Britain and Ireland': 'United Kingdom',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  'United Kingdoms of Sweden and Norway': 'Sweden–Norway',
}

// Label text: the territory's own name; very long ones are shortened, or lose a bracketed note.
export function displayName(name) {
  if (SHORT_NAMES[name]) return SHORT_NAMES[name]
  if (name.length <= 26) return name
  return name.replace(/\s*\([^)]*\)\s*$/, '') || name
}
