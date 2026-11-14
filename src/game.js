import yearsData from './years.json'

export const ALL_YEARS = yearsData.years
export const ROUNDS = 5
export const MAX_POINTS = 5000
export const MIN_YEAR = -3000
export const MAX_YEAR = 2010
export const HINT_PENALTY = 0.4 // using the names hint costs 40% of the round's points

// [west, south, east, north] in degrees
export const REGIONS = {
  world: { label: 'Whole World', bbox: null, minYear: -3000 },
  europe: { label: 'Europe & Mediterranean', bbox: [-12, 25, 50, 62], minYear: -1500 },
  mideast: { label: 'Africa & Middle East', bbox: [-20, -36, 65, 42], minYear: -3000 },
  asia: { label: 'Asia', bbox: [45, -10, 150, 58], minYear: -2000 },
  americas: { label: 'The Americas', bbox: [-170, -56, -30, 72], minYear: 500 },
}

export function pickYears(regionKey, n = ROUNDS) {
  const pool = ALL_YEARS.filter((y) => y >= REGIONS[regionKey].minYear)
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function formatYear(y) {
  y = Math.round(y)
  if (y < 0) return `${-y} BC`
  if (y === 0) return '1 BC'
  return `AD ${y}`
}

// The further back in time, the more forgiving the scoring.
export function tolerance(actual) {
  const age = 2026 - actual
  return Math.max(25, age * 0.15)
}

export function scoreGuess(guess, actual, usedHint) {
  const diff = Math.abs(guess - actual)
  let pts = MAX_POINTS * Math.exp(-diff / tolerance(actual))
  if (diff <= 2) pts = MAX_POINTS
  if (usedHint) pts *= 1 - HINT_PENALTY
  return Math.round(pts)
}

// Non-linear timeline: modern centuries get more slider space than ancient ones.
const ANCHORS = [
  [0, -3000],
  [0.18, -1000],
  [0.36, 0],
  [0.56, 1000],
  [0.76, 1600],
  [0.9, 1850],
  [1, 2010],
]

export function posToYear(t) {
  t = Math.min(1, Math.max(0, t))
  for (let i = 1; i < ANCHORS.length; i++) {
    const [t1, y1] = ANCHORS[i]
    const [t0, y0] = ANCHORS[i - 1]
    if (t <= t1) return Math.round(y0 + ((t - t0) / (t1 - t0)) * (y1 - y0))
  }
  return MAX_YEAR
}

export function yearToPos(y) {
  y = Math.min(MAX_YEAR, Math.max(MIN_YEAR, y))
  for (let i = 1; i < ANCHORS.length; i++) {
    const [t1, y1] = ANCHORS[i]
    const [t0, y0] = ANCHORS[i - 1]
    if (y <= y1) return t0 + ((y - y0) / (y1 - y0)) * (t1 - t0)
  }
  return 1
}

export const TICKS = [-3000, -2000, -1000, -500, 0, 500, 1000, 1400, 1600, 1800, 1900, 2000]

export function rating(total) {
  const pct = total / (MAX_POINTS * ROUNDS)
  if (pct > 0.9) return 'Master Chronicler'
  if (pct > 0.75) return 'Royal Historian'
  if (pct > 0.55) return 'Learned Scholar'
  if (pct > 0.35) return 'Curious Traveller'
  return 'Lost in Time'
}
