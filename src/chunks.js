// How the border data is split into files (shared by the game and the build scripts).
// One file per century before 1700, one per 25 years after, when borders change far more often.
// public/data/<start>.json holds every territory alive at some point in that span.

export const MIN_YEAR = 1
export const MAX_YEAR = 2024
// From this year on the borders come from OpenHistoricalMap (scripts/build-ohm.mjs) instead of
// Cliopatria. It must be a chunk start.
export const OHM_FROM = 2000

export function chunkStart(year) {
  return year < 1700 ? Math.floor(year / 100) * 100 : 1700 + Math.floor((year - 1700) / 25) * 25
}

// [[start, end], …] covering MIN_YEAR–MAX_YEAR.
export function chunks() {
  const out = []
  for (let s = chunkStart(MIN_YEAR); s <= MAX_YEAR; ) {
    const next = s < 1700 ? s + 100 : s + 25
    out.push([s, Math.min(next - 1, MAX_YEAR)])
    s = next
  }
  return out
}
