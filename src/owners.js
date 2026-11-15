// Works out who actually rules a territory, so colonies, protectorates and dominions get their
// ruler's colour (British Raj and Nigeria are painted like the United Kingdom, for example). The
// hover name and the map labels still show the territory's own name.
//
// The source data records the ruler in SUBJECTO, but it spells the same power many ways ("UK",
// "Great Britain", "United Kingdom of Great Britain and Ireland", …) and often leaves it empty for
// colonies such as "French Guiana" or "German South-West Africa". This file evens that out.

// Every spelling of a power, mapped to one canonical name.
const ALIASES = {
  'United Kingdom': [
    'UK', 'Great Britain', 'United Kingdom of Great Britain and Ireland', 'England', 'England and Ireland',
    'English territory', 'British Empire', 'British East India Company',
  ],
  France: ['Kingdom of France', 'French Republic'],
  Spain: ['Spanish Habsburg'],
  Netherlands: ['Neterlands', 'Dutch Republic', 'United Kingdom of Netherlands'],
  Denmark: ['Danemark', 'Denmark-Norway'],
  Sweden: ['Sweden–Norway'],
  Austria: ['Austrian Empire', 'Habsburg Austria', 'Austria Hungary', 'Austria-Hungary'],
  Germany: ['German Empire'],
  Italy: ['Kingdom of Italy'],
  Russia: ['Russian Empire', 'USSR'],
  'United States': ['USA', 'United States of America'],
  Japan: ['Imperial Japan', 'Empire of Japan'],
  'Ottoman Empire': ['Ottoman Sultanate'],
  Turkey: ['Republic of Turkey'],
  'Qing Empire': ['Manchu Empire'],
  Persia: ['Persi'],
}

const CANONICAL = new Map()
for (const [name, variants] of Object.entries(ALIASES)) {
  CANONICAL.set(name, name)
  for (const v of variants) CANONICAL.set(v, name)
}
const canonical = (name) => CANONICAL.get(name) ?? name

// Colonies whose ruler is only given in their name: "French Guiana", "Madagascar (France)", "Gold Coast (GB)".
const NAME_HINTS = [
  [/\bBritish\b|\((GB|UK|Britain)\)/, 'United Kingdom'],
  [/\bFrench\b|\((France|FR)\)/, 'France'],
  [/\bSpanish\b|\(Spain\)/, 'Spain'],
  [/\bPortuguese\b|\(Portugal\)/, 'Portugal'],
  [/\bDutch\b|^Netherlands (Antilles|Indies)|\(Dutch\)|\(Netherlands\)/, 'Netherlands'],
  [/\bGerman\b/, 'Germany'],
  [/\bItalian\b/, 'Italy'],
  [/\bBelgian\b/, 'Belgium'],
  [/\bDanish\b|\(Denmark\)|\(Danemark\)/, 'Denmark'],
  [/\bJapanese\b|\(Japan\)/, 'Japan'],
  [/\bRussian\b|\(RU\)/, 'Russia'],
  [/^United States\b|\(USA\)/, 'United States'],
  [/\(Indian princely state\)/, 'United Kingdom'], // bound to the East India Company by treaty
]

const SELF = '' // marks a territory as independent, whatever the source data says

// Colonies the source data names without saying who ruled them (or names the wrong ruler):
// [ruler, from, to, territory names]. Years are inclusive; dominions count as British until the
// Statute of Westminster (1931), mandates until independence.
const RULED = [
  ['United Kingdom', 1763, 1930, ['Canada']],
  ['United Kingdom', 1788, 1930, ['Australia']],
  ['United Kingdom', 1840, 1930, ['New Zealand']],
  ['United Kingdom', 1858, 1946, ['India']],
  ['United Kingdom', 1796, 1947, ['Ceylon', 'Sri Lanka']],
  ['United Kingdom', 1886, 1947, ['Burma']],
  ['United Kingdom', 1874, 1956, ['Malaya', 'Malaysia']],
  ['United Kingdom', 1655, 1961, ['Jamaica']],
  ['United Kingdom', 1882, 1921, ['Egypt']],
  ['United Kingdom', 1899, 1955, ['Sudan']],
  ['United Kingdom', 1894, 1961, ['Uganda']],
  ['United Kingdom', 1895, 1962, ['Kenya']],
  ['United Kingdom', 1900, 1959, ['Nigeria']],
  ['United Kingdom', 1919, 1961, ['Tanzania, United Republic of']],
  ['United Kingdom', 1891, 1963, ['Zambia']],
  ['United Kingdom', 1890, 1964, ['Zimbabwe']],
  ['United Kingdom', 1820, 1970, ['Trucial Oman']],
  ['United Kingdom', 1899, 1960, ['Kuwait']],
  ['United Kingdom', 1920, 1931, ['Iraq']],
  ['United Kingdom', 1921, 1945, ['Jordan']],
  ['United Kingdom', 1920, 1947, ['Palestine']],
  ['United Kingdom', 1878, 1959, ['Cyprus']],
  ['United Kingdom', 1801, 1921, ['Ireland']],
  ['United Kingdom', 1884, 1930, ['Papua New Guinea']],
  ['Australia', 1931, 1974, ['Papua New Guinea']],
  ['France', 1830, 1961, ['Algeria']],
  ['France', 1881, 1955, ['Tunisia']],
  ['France', 1912, 1955, ['Morocco']],
  ['France', 1850, 1959, ['Senegal']],
  ['France', 1885, 1959, ['Gabon']],
  ['France', 1910, 1959, ['Congo']],
  ['France', 1916, 1959, ['Cameroon']],
  ['France', 1916, 1959, ['Togo']],
  ['France', 1896, 1959, ['Madagascar']],
  ['France', 1862, 1953, ['Cochin China', 'Cambodia', 'Laos']],
  ['France', 1920, 1943, ['Syria', 'Lebanon']],
  ['Germany', 1884, 1914, ['Togoland']],
  ['Italy', 1912, 1942, ['Libya']],
  ['Portugal', 1575, 1974, ['Angola', 'Mozambique']],
  ['Portugal', 1879, 1973, ['Guinea-Bissau']],
  ['Spain', 1778, 1967, ['Equatorial Guinea']],
  ['Spain', 1565, 1897, ['Philippines']],
  ['Spain', 1493, 1897, ['Puerto Rico', 'Cuba']],
  ['United States', 1898, 1945, ['Philippines']],
  ['United States', 1898, 2010, ['Puerto Rico']],
  ['Denmark', 1721, 2010, ['Greenland']],
  ['Denmark', 1380, 1917, ['Iceland']],
  ['Japan', 1910, 1945, ['Korea']],
  ['Japan', 1895, 1944, ['Taiwan', 'Formosa']],
  ['Qing Empire', 1683, 1894, ['Taiwan', 'Formosa']],
  ['South Africa', 1915, 1989, ['Namibia']],
  // Mislabelled in the source as still ruled by someone else.
  [SELF, 1822, 2010, ['Kingdom of Brazil', 'Brazil']],
]

export function ruledBy(name, year) {
  if (year === undefined) return null
  for (const [owner, from, to, names] of RULED) if (year >= from && year <= to && names.includes(name)) return owner
  return null
}

export function ownerOf({ NAME, SUBJECTO }, year) {
  const ruled = ruledBy((NAME || '').trim(), year)
  if (ruled === SELF) return canonical((NAME || '').trim())
  if (ruled) return ruled
  if (SUBJECTO && /[a-z]/i.test(SUBJECTO) && SUBJECTO !== NAME) { // some entries are junk like "3"
    const owner = canonical(SUBJECTO.trim())
    if (!owner.startsWith('(')) return owner // skip notes like "(Russian and Japanese claim)"
  }
  const name = (NAME || '').trim()
  if (CANONICAL.has(name)) return canonical(name)
  for (const [re, owner] of NAME_HINTS) if (re.test(name)) return owner
  return canonical(name)
}

// Fixed colours for the big empires so they're recognisable from map to map (and never share a
// colour with a neighbour by chance). Everyone else gets a palette colour picked from their name.
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
  Austria: '#c7b6a0',
}

const PALETTE = [
  '#c9a26b', '#a7b37a', '#d4876a', '#8fa9b8', '#c48fa0', '#b7a3cf',
  '#9fc29a', '#e0b85c', '#a98a6d', '#7fb3a6', '#d99a8f', '#b4b86a',
]

export function colorForOwner(owner) {
  if (POWER_COLORS[owner]) return POWER_COLORS[owner]
  let h = 0
  for (let i = 0; i < owner.length; i++) h = (h * 31 + owner.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

// Label text: the territory's own name, except that very long names get shortened. Official names
// of the big powers use their common one ("United Kingdom of Great Britain and Ireland" becomes
// "United Kingdom"), and long bracketed notes are dropped ("Nahua (Morelos, Puebla, …)" becomes "Nahua").
export function displayName(name) {
  if (name.length <= 26) return name
  if (CANONICAL.has(name)) return CANONICAL.get(name)
  const short = name.replace(/\s*\([^)]*\)\s*$/, '')
  return short || name
}
