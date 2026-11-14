import { useEffect, useMemo, useRef, useState } from 'react'
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import land110 from 'world-atlas/land-110m.json'

const W = 960
const H = 540
const LAND = feature(land110, land110.objects.land)
const GRATICULE = geoGraticule10()

const PALETTE = [
  '#c9a26b', '#a7b37a', '#d4876a', '#8fa9b8', '#c48fa0', '#b7a3cf',
  '#9fc29a', '#e0b85c', '#a98a6d', '#7fb3a6', '#d99a8f', '#b4b86a',
]

function colorFor(name) {
  name = name || ''
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

const cache = new Map()
async function loadYear(year) {
  if (!cache.has(year)) {
    const url = `${import.meta.env.BASE_URL}data/${year}.json`
    cache.set(
      year,
      fetch(url)
        .then((r) => r.json())
        .then((fc) => fc.features), // rings pre-wound for d3 by scripts/rewind.mjs
    )
  }
  return cache.get(year)
}

export function preloadYear(year) {
  loadYear(year)
}

export default function MapView({ year, bbox, showNames }) {
  const [features, setFeatures] = useState(null)
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  const [hover, setHover] = useState(null)
  const drag = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    let alive = true
    setFeatures(null)
    setView({ k: 1, x: 0, y: 0 })
    loadYear(year).then((f) => alive && setFeatures(f))
    return () => {
      alive = false
    }
  }, [year])

  const path = useMemo(() => {
    const proj = geoNaturalEarth1()
    if (bbox) {
      const [w, s, e, n] = bbox
      proj.fitExtent([[10, 10], [W - 10, H - 10]], {
        type: 'MultiPoint',
        coordinates: [[w, s], [e, s], [e, n], [w, n], [(w + e) / 2, n], [(w + e) / 2, s]],
      })
    } else {
      proj.fitExtent([[10, 10], [W - 10, H - 10]], { type: 'Sphere' })
    }
    return geoPath(proj)
  }, [bbox])

  const shapes = useMemo(() => {
    if (!features) return []
    return features.map((f, i) => ({
      id: i,
      name: f.properties.NAME,
      d: path(f),
      fill: f.properties.NAME ? colorFor(f.properties.SUBJECTO || f.properties.NAME) : null,
      area: path.area(f),
      centroid: path.centroid(f),
    }))
  }, [features, path])

  const labels = useMemo(() => {
    if (!showNames) return []
    const minArea = 900 / view.k ** 2
    return shapes
      .filter((s) => s.name && s.area > minArea && Number.isFinite(s.centroid[0]))
      .sort((a, b) => b.area - a.area)
      .slice(0, 60)
  }, [shapes, showNames, view.k])

  // --- pan & zoom ---
  function toSvg(e) {
    const r = svgRef.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }
  function onWheel(e) {
    const [mx, my] = toSvg(e)
    setView((v) => {
      const k = Math.min(12, Math.max(1, v.k * (e.deltaY < 0 ? 1.2 : 1 / 1.2)))
      if (k === 1) return { k: 1, x: 0, y: 0 }
      return { k, x: mx - ((mx - v.x) * k) / v.k, y: my - ((my - v.y) * k) / v.k }
    })
  }
  useEffect(() => {
    const el = svgRef.current
    const stop = (e) => e.preventDefault()
    el.addEventListener('wheel', stop, { passive: false })
    return () => el.removeEventListener('wheel', stop)
  }, [])
  function onPointerDown(e) {
    drag.current = { start: toSvg(e), view }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e) {
    if (!drag.current) return
    const [x, y] = toSvg(e)
    const { start, view: v0 } = drag.current
    setView({ ...v0, x: v0.x + x - start[0], y: v0.y + y - start[1] })
  }
  const endDrag = () => (drag.current = null)

  return (
    <div className="map-wrap">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="map"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={() => {
          endDrag()
          setHover(null)
        }}
      >
        <defs>
          <filter id="paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.06" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        <rect width={W} height={H} className="ocean" />
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          <path d={path({ type: 'Sphere' })} className="sphere" />
          <path d={path(GRATICULE)} className="graticule" />
          <path d={path(LAND)} className="land" />
          {shapes.map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill={s.fill || undefined}
              className={s.fill ? `polity ${hover === s.id ? 'hover' : ''}` : 'unclaimed'}
              onPointerEnter={() => setHover(s.id)}
              onPointerLeave={() => setHover((h) => (h === s.id ? null : h))}
            />
          ))}
          {labels.map((s) => (
            <text
              key={s.id}
              x={s.centroid[0]}
              y={s.centroid[1]}
              className="label"
              style={{ fontSize: Math.min(14, 6 + Math.sqrt(s.area) / 12) / view.k }}
            >
              {s.name}
            </text>
          ))}
        </g>
        <rect width={W} height={H} filter="url(#paper)" fill="transparent" pointerEvents="none" />
      </svg>
      {!features && <div className="map-loading">Unrolling the map…</div>}
      {showNames && hover !== null && shapes[hover]?.name && (
        <div className="tooltip">{shapes[hover].name}</div>
      )}
      <div className="map-controls">
        <button onClick={() => setView((v) => ({ ...v, k: Math.min(12, v.k * 1.5) }))}>+</button>
        <button onClick={() => setView({ k: 1, x: 0, y: 0 })}>⟲</button>
      </div>
    </div>
  )
}
