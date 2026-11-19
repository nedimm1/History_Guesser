// Dev-only map viewer, for checking the border data: type a year (or step through them) and see
// that year's map, and from 1800 pick a month. Open it with ?viewer while running `npm run dev`;
// the date and region are kept in the URL (?viewer&year=1815&month=6&region=europe), so a map can
// be bookmarked or shared.
import { useEffect, useState } from 'react'
import MapView from './MapView'
import { REGIONS, MIN_YEAR, MAX_YEAR, MONTHS_FROM, MONTH_NAMES } from './game'
import { OHM_FROM } from './chunks'

const clamp = (y) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(y)))

export default function MapViewer() {
  const params = new URLSearchParams(location.search)
  const [year, setYear] = useState(() => clamp(Number(params.get('year')) || 1815))
  const [month, setMonth] = useState(() => Math.min(12, Math.max(1, Number(params.get('month')) || 12)))
  const [region, setRegion] = useState(() => (REGIONS[params.get('region')] ? params.get('region') : 'world'))
  const [text, setText] = useState(String(year))

  const go = (y) => {
    const c = clamp(y)
    setYear(c)
    setText(String(c))
  }

  useEffect(() => {
    history.replaceState(null, '', `?viewer&year=${year}${year >= MONTHS_FROM ? `&month=${month}` : ''}&region=${region}`)
  }, [year, month, region])

  // ← → step a year, Shift for ten (not while typing in the year box).
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      const step = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft') go(year - step)
      if (e.key === 'ArrowRight') go(year + step)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [year])

  const typed = Number(text)
  const valid = text.trim() !== '' && Number.isInteger(typed) && typed >= MIN_YEAR && typed <= MAX_YEAR
  const minYear = REGIONS[region].minYear ?? MIN_YEAR

  return (
    <div className="game viewer">
      <header>
        <div className="brand">Map viewer</div>
        <div className="stats">
          <span>Source <b>{year >= OHM_FROM ? 'OpenHistoricalMap' : 'Cliopatria'}</b></span>
          <a href="./">Back to game</a>
        </div>
      </header>

      <form
        className="viewer-controls"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) go(typed)
        }}
      >
        <button type="button" onClick={() => go(year - 100)}>−100</button>
        <button type="button" onClick={() => go(year - 10)}>−10</button>
        <button type="button" onClick={() => go(year - 1)}>−1</button>
        <input
          className={valid ? '' : 'invalid'}
          type="number"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            const y = Number(e.target.value)
            if (Number.isInteger(y) && y >= MIN_YEAR && y <= MAX_YEAR) setYear(y)
          }}
          onFocus={(e) => e.target.select()}
          aria-label="Year"
        />
        <button type="button" onClick={() => go(year + 1)}>+1</button>
        <button type="button" onClick={() => go(year + 10)}>+10</button>
        <button type="button" onClick={() => go(year + 100)}>+100</button>
        {year >= MONTHS_FROM && (
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Month">
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        )}
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region">
          {Object.entries(REGIONS).map(([key, r]) => (
            <option key={key} value={key}>{r.label}</option>
          ))}
        </select>
      </form>
      <input
        className="viewer-slider"
        type="range"
        min={MIN_YEAR}
        max={MAX_YEAR}
        value={year}
        onChange={(e) => go(Number(e.target.value))}
        aria-label="Year slider"
      />

      <MapView year={year} month={year >= MONTHS_FROM ? month : null} region={region} bbox={REGIONS[region].bbox} />
      <p className="fine">
        AD {MIN_YEAR}–{MAX_YEAR}. ← → step a year, Shift+← → ten.
        {year < minYear && ` The game doesn't use ${REGIONS[region].label} before ${minYear}.`}
      </p>
    </div>
  )
}
