import { MIN_YEAR, MAX_YEAR } from './chunks'
import { MONTHS_FROM, MONTH_NAMES, monthIndex } from './dates'

export { MIN_YEAR, MAX_YEAR, MONTHS_FROM, MONTH_NAMES }
export const ROUNDS = 5
export const MAX_POINTS = 5000

// [west, south, east, north] in degrees. minYear: the earliest round for that region (the
// Americas have few states in the data before the Aztec and Inca empires).
export const REGIONS = {
  world: { label: 'Whole World', bbox: null, minYear: MIN_YEAR },
  europe: { label: 'Europe & Mediterranean', bbox: [-12, 25, 50, 62], minYear: MIN_YEAR },
  mideast: { label: 'Africa & Middle East', bbox: [-20, -36, 65, 42], minYear: MIN_YEAR },
  asia: { label: 'Asia', bbox: [45, -10, 150, 58], minYear: MIN_YEAR },
  americas: { label: 'The Americas', bbox: [-170, -56, -30, 72], minYear: 1400 },
}

// Any year can come up, but recent history is favoured: about 72% of rounds are from
// 1800 on (19th–21st centuries), 14% from 1500–1799, and 14% from before 1500. The
// weights are set above those shares because MIN_GAP rejects more draws in the crowded
// recent era. A region whose minYear cuts into an era gets that era's weight scaled down
// by the share it keeps.
const ERAS = [
  { from: 1800, to: MAX_YEAR, weight: 0.78 },
  { from: 1500, to: 1799, weight: 0.11 },
  { from: MIN_YEAR, to: 1499, weight: 0.11 },
]
const MIN_GAP = 20 // rounds in one game are at least this many years apart

const randomInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))

function erasFrom(lo) {
  return ERAS.filter((e) => e.to >= lo).map((e) => {
    const from = Math.max(e.from, lo)
    return { from, to: e.to, weight: (e.weight * (e.to - from + 1)) / (e.to - e.from + 1) }
  })
}

function randomYear(eras) {
  let r = Math.random() * eras.reduce((s, e) => s + e.weight, 0)
  for (const e of eras) {
    if ((r -= e.weight) < 0) return randomInt(e.from, e.to)
  }
  const last = eras[eras.length - 1]
  return randomInt(last.from, last.to)
}

// Draws n rounds for a game, in the order they'll be played: { year, month }, with month 1–12
// from MONTHS_FROM on and null before (the data only knows years there).
export function pickRounds(regionKey, n = ROUNDS) {
  const eras = erasFrom(REGIONS[regionKey].minYear)
  const picked = []
  for (let tries = 0; picked.length < n && tries < 1000; tries++) {
    const year = randomYear(eras)
    if (picked.every((p) => Math.abs(p.year - year) >= MIN_GAP)) {
      picked.push({ year, month: year >= MONTHS_FROM ? randomInt(1, 12) : null })
    }
  }
  return picked
}

export function formatYear(y) {
  y = Math.round(y)
  if (y < 0) return `${-y} BC`
  return `AD ${y}`
}

// { year: 1995, month: 11 } → "November 1995"; without a month, "AD 1995".
export function formatDate({ year, month }) {
  return month ? `${MONTH_NAMES[month - 1]} ${year}` : formatYear(year)
}

// Whether a guess's month counts: the round has one and the guess is in the months era too.
const monthly = (guess, actual) => !!(actual.month && guess.month && guess.year >= MONTHS_FROM)

// How far off a guess is, in months when both have one, else in years: '2 years 3 months off',
// 'spot on', or 'right year, no month' (the round had one, the guess didn't).
export function offBy(guess, actual) {
  if (monthly(guess, actual)) {
    const m = Math.abs(monthIndex(guess.year, guess.month) - monthIndex(actual.year, actual.month))
    if (m === 0) return 'spot on'
    const [y, r] = [Math.floor(m / 12), m % 12]
    return [y && `${y} year${y > 1 ? 's' : ''}`, r && `${r} month${r > 1 ? 's' : ''}`].filter(Boolean).join(' ') + ' off'
  }
  const y = Math.abs(guess.year - actual.year)
  if (y === 0) return actual.month ? 'right year, no month' : 'spot on'
  return `${y} year${y > 1 ? 's' : ''} off`
}

// The further back in time, the more forgiving the scoring.
export function tolerance(actual) {
  const age = 2026 - actual
  return Math.max(25, age * 0.15)
}

// Rounds with a month keep MONTH_POINTS of the total for getting the month close; the rest is
// scored on the years off, as before (full marks within 2 years).
export const MONTH_POINTS = 500
const monthPoints = (monthsOff) => (monthsOff === 0 ? MONTH_POINTS : monthsOff === 1 ? 300 : monthsOff <= 3 ? 150 : 0)

// guess and actual are { year, month }. Returns { points, yearPoints, monthPoints }.
export function scoreGuess(guess, actual) {
  const max = actual.month ? MAX_POINTS - MONTH_POINTS : MAX_POINTS
  let diff = Math.abs(guess.year - actual.year)
  let bonus = 0
  if (monthly(guess, actual)) {
    const monthsOff = Math.abs(monthIndex(guess.year, guess.month) - monthIndex(actual.year, actual.month))
    diff = monthsOff / 12
    bonus = monthPoints(monthsOff)
  }
  const yearPoints = Math.round(diff <= 2 ? max : max * Math.exp(-diff / tolerance(actual.year)))
  return { points: yearPoints + bonus, yearPoints, monthPoints: bonus }
}

// Non-linear timeline: modern centuries get more slider space than ancient ones.
const ANCHORS = [
  [0, MIN_YEAR],
  [0.25, 500],
  [0.45, 1000],
  [0.65, 1500],
  [0.8, 1800],
  [0.9, 1900],
  [1, MAX_YEAR],
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
