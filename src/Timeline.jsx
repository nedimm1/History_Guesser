import { useRef } from 'react'
import { posToYear, yearToPos, formatYear, TICKS } from './game'

export default function Timeline({ guess, onChange, actual, locked }) {
  const ref = useRef(null)

  function setFromEvent(e) {
    if (locked) return
    const r = ref.current.getBoundingClientRect()
    onChange(posToYear((e.clientX - r.left) / r.width))
  }

  function onKey(e) {
    if (locked) return
    const step = e.shiftKey ? 50 : 10
    if (e.key === 'ArrowLeft') onChange(Math.max(-3000, guess - step))
    if (e.key === 'ArrowRight') onChange(Math.min(2010, guess + step))
  }

  const pct = (y) => `${yearToPos(y) * 100}%`

  return (
    <div className="timeline">
      <div
        ref={ref}
        className={`track ${locked ? 'locked' : ''}`}
        tabIndex={0}
        role="slider"
        aria-valuemin={-3000}
        aria-valuemax={2010}
        aria-valuenow={guess}
        aria-valuetext={formatYear(guess)}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setFromEvent(e)
        }}
        onPointerMove={(e) => e.buttons & 1 && setFromEvent(e)}
      >
        <div className="rail" />
        {TICKS.map((t) => (
          <div key={t} className="tick" style={{ left: pct(t) }}>
            <span>{t < 0 ? `${-t} BC` : t === 0 ? '0' : t}</span>
          </div>
        ))}
        {actual !== undefined && (
          <>
            <div
              className="gap"
              style={{
                left: pct(Math.min(guess, actual)),
                width: `calc(${pct(Math.max(guess, actual))} - ${pct(Math.min(guess, actual))})`,
              }}
            />
            <div className="marker actual" style={{ left: pct(actual) }}>
              <span>{formatYear(actual)}</span>
            </div>
          </>
        )}
        <div className="marker guess" style={{ left: pct(guess) }}>
          <span>{formatYear(guess)}</span>
        </div>
      </div>
    </div>
  )
}
