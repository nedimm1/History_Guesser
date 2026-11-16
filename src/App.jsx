import { useEffect, useState } from 'react'
import MapView, { preloadYear } from './MapView'
import Timeline from './Timeline'
import {
  REGIONS, ROUNDS, MAX_POINTS, MIN_YEAR, MAX_YEAR,
  pickYears, scoreGuess, formatYear, rating,
} from './game'

export default function App() {
  const [phase, setPhase] = useState('menu') // menu | guessing | reveal | summary
  const [region, setRegion] = useState('world')
  const [years, setYears] = useState([])
  const [round, setRound] = useState(0)
  const [guess, setGuess] = useState(1000)
  const [results, setResults] = useState([])

  const actual = years[round]
  const total = results.reduce((s, r) => s + r.points, 0)

  useEffect(() => {
    if (years[round + 1] !== undefined) preloadYear(years[round + 1])
  }, [years, round])

  function start(regionKey) {
    const ys = pickYears(regionKey)
    // Dev only: ?year=1815 makes the first round that year, for checking a particular map.
    const forced = import.meta.env.DEV && Number(new URLSearchParams(location.search).get('year'))
    if (forced) ys[0] = forced
    ys.forEach((y, i) => i < 2 && preloadYear(y))
    setRegion(regionKey)
    setYears(ys)
    setRound(0)
    setResults([])
    setGuess(1000)
    setPhase('guessing')
  }

  function submit() {
    const points = scoreGuess(guess, actual)
    setResults((r) => [...r, { actual, guess, points }])
    setPhase('reveal')
  }

  function next() {
    if (round + 1 >= ROUNDS) return setPhase('summary')
    setRound(round + 1)
    setGuess(1000)
    setPhase('guessing')
  }

  if (phase === 'menu') {
    return (
      <div className="menu">
        <h1>History Guesser</h1>
        <p className="tagline">
          You're shown the borders of the world at some moment in the past.
          <br />Read the empires, kingdoms and tribes, then guess the year.
        </p>
        <div className="region-grid">
          {Object.entries(REGIONS).map(([key, r]) => (
            <button key={key} className="region-btn" onClick={() => start(key)}>
              {r.label}
            </button>
          ))}
        </div>
        <p className="fine">
          {ROUNDS} rounds · up to {MAX_POINTS.toLocaleString()} points each · AD {MIN_YEAR} – {MAX_YEAR}
        </p>
        <Credits />
        {import.meta.env.DEV && <p className="fine"><a href="?viewer">Map viewer</a> (dev only)</p>}
      </div>
    )
  }

  if (phase === 'summary') {
    return (
      <div className="menu summary">
        <h1>{total.toLocaleString()}</h1>
        <p className="tagline">
          out of {(MAX_POINTS * ROUNDS).toLocaleString()} · <strong>{rating(total)}</strong>
        </p>
        <table className="results">
          <thead>
            <tr><th>#</th><th>Actual</th><th>Your guess</th><th>Off by</th><th>Points</th></tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{formatYear(r.actual)}</td>
                <td>{formatYear(r.guess)}</td>
                <td>{Math.abs(r.guess - r.actual)} yrs</td>
                <td>{r.points.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row">
          <button className="primary" onClick={() => start(region)}>Play again</button>
          <button onClick={() => setPhase('menu')}>Change region</button>
        </div>
      </div>
    )
  }

  const last = results[results.length - 1]
  const revealed = phase === 'reveal'

  return (
    <div className="game">
      <header>
        <div className="brand" onClick={() => setPhase('menu')}>History Guesser</div>
        <div className="stats">
          <span>{REGIONS[region].label}</span>
          <span>Round <b>{round + 1}</b>/{ROUNDS}</span>
          <span>Score <b>{total.toLocaleString()}</b></span>
        </div>
      </header>

      <MapView year={actual} region={region} bbox={REGIONS[region].bbox} />

      <section className="panel">
        <Timeline guess={guess} onChange={setGuess} actual={revealed ? actual : undefined} locked={revealed} />
        <div className="actions">
          {!revealed ? (
            <>
              <div className="guess-readout">{formatYear(guess)}</div>
              <button className="primary" onClick={submit}>Guess</button>
            </>
          ) : (
            <>
              <div className="reveal-text">
                It was <b>{formatYear(last.actual)}</b>. You were{' '}
                {last.guess === last.actual ? 'spot on!' : `${Math.abs(last.guess - last.actual)} years off.`}
                <span className="pts">+{last.points.toLocaleString()}</span>
              </div>
              <button className="primary" onClick={next}>
                {round + 1 >= ROUNDS ? 'See results' : 'Next round'}
              </button>
            </>
          )}
        </div>
        {!revealed && <p className="fine">Drag the timeline or use ← → (Shift for big steps). Scroll the map to zoom in on smaller states.</p>}
      </section>
    </div>
  )
}

// Required by the data licences (Cliopatria is CC BY 4.0: credit, licence link, note of changes).
// OpenHistoricalMap is CC0 and needs no credit, but gets one anyway.
function Credits() {
  return (
    <p className="fine credits">
      Borders:{' '}
      <a href="https://github.com/Seshat-Global-History-Databank/cliopatria">Cliopatria</a>, Seshat Global
      History Databank,{' '}
      <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> (simplified and recoloured);
      from 2000, <a href="https://www.openhistoricalmap.org">OpenHistoricalMap</a>.
      Flags: <a href="https://commons.wikimedia.org">Wikimedia Commons</a> (public domain), chosen with{' '}
      <a href="https://www.wikidata.org">Wikidata</a>. Coastlines: <a href="https://www.naturalearthdata.com">Natural Earth</a>.
    </p>
  )
}
