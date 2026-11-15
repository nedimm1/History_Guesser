import yearsData from './years.json'

export const ALL_YEARS = yearsData.years
export const ROUNDS = 5
export const MAX_POINTS = 5000
export const MIN_YEAR = 1 // the game covers the Common Era; the earliest map is 1 BC
export const MAX_YEAR = 2010

// [west, south, east, north] in degrees
export const REGIONS = {
  world: { label: 'Whole World', bbox: null, minYear: -1 },
  europe: { label: 'Europe & Mediterranean', bbox: [-12, 25, 50, 62], minYear: -1 },
  mideast: { label: 'Africa & Middle East', bbox: [-20, -36, 65, 42], minYear: -1 },
  asia: { label: 'Asia', bbox: [45, -10, 150, 58], minYear: -1 },
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

export function scoreGuess(guess, actual) {
  const diff = Math.abs(guess - actual)
  let pts = MAX_POINTS * Math.exp(-diff / tolerance(actual))
  if (diff <= 2) pts = MAX_POINTS
  return Math.round(pts)
}

// Non-linear timeline: modern centuries get more slider space than ancient ones.
const ANCHORS = [
  [0, MIN_YEAR],
  [0.25, 500],
  [0.45, 1000],
  [0.65, 1500],
  [0.8, 1800],
  [0.9, 1900],
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

export const TICKS = [1, 250, 500, 750, 1000, 1250, 1500, 1650, 1800, 1900, 2000]

export function rating(total) {
  const pct = total / (MAX_POINTS * ROUNDS)
  if (pct > 0.9) return 'Master Chronicler'
  if (pct > 0.75) return 'Royal Historian'
  if (pct > 0.55) return 'Learned Scholar'
  if (pct > 0.35) return 'Curious Traveller'
  return 'Lost in Time'
}
