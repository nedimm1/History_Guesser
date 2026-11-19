// Dates to the month, shared by the game and the build scripts.
//
// Border rows carry FromYear/FromMonth and ToYear/ToMonth (months 1–12, inclusive; a row without
// months spans whole years). A month's map is the borders as they stood at the end of that month.
// Internally a month is one number, year * 12 + month - 1, so spans compare like integers.

// Rounds from this year on are played to the month (and the player guesses the month too).
// Before it the data only knows years.
export const MONTHS_FROM = 1800

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const monthIndex = (year, month = 1) => year * 12 + month - 1
export const yearOf = (t) => Math.floor(t / 12)
export const monthOf = (t) => t - Math.floor(t / 12) * 12 + 1

export const rowStart = (p) => monthIndex(p.FromYear, p.FromMonth ?? 1)
export const rowEnd = (p) => monthIndex(p.ToYear, p.ToMonth ?? 12)

// The properties with the span set to months a–b (inclusive month indexes).
export const withSpan = (p, a, b) => ({ ...p, FromYear: yearOf(a), FromMonth: monthOf(a), ToYear: yearOf(b), ToMonth: monthOf(b) })

// "1991-12" → month index; a plain year means January (or, with end = true, December) of it.
export function parseMonth(v, end = false) {
  if (typeof v === 'number') return monthIndex(v, end ? 12 : 1)
  const m = String(v).match(/^(-?\d{1,4})(?:-(\d{1,2}))?/)
  if (!m) throw new Error(`Not a date: ${v}`)
  return monthIndex(+m[1], m[2] ? +m[2] : end ? 12 : 1)
}
