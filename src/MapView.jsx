import { useEffect, useMemo, useRef, useState } from 'react'
import polylabel from 'polylabel'
import { geoArea, geoContains, geoMercator, geoPath, geoGraticule10 } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import land50 from 'world-atlas/land-50m.json'
import { ownerOf, assignColors, displayName } from './owners'
import { chunkStart, FLAGS_FROM } from './chunks'
import { monthIndex, rowStart, rowEnd } from './dates'
import { citiesIn } from './cities'

const W = 960
const H = 540
const MAX_ZOOM = 24 // deep enough to read the smallest states (the Holy Roman Empire's, say)
// Natural Earth 1:50m coastlines: real-looking shores; polities are clipped to them.
const LAND = feature(land50, land50.objects.land)
const GRATICULE = geoGraticule10()
// Flat world view: Mercator from 56°S to 79°N fills a 16:9 frame exactly (Antarctica and the far Arctic are cropped).
const WORLD_BBOX = [-180, -56, 180, 79]
// How zoomed in a view is compared with the whole-world map, at which each rank of city appears.
const WORLD_SCALE = geoMercator().fitExtent([[0, 0], [W, H]], { type: 'MultiPoint', coordinates: [[-180, -56], [180, 79]] }).scale()
const CITY_ZOOM = { 1: 1, 2: 2, 3: 4.5 }
const CITY_PX = { 1: 10, 2: 9, 3: 8.5 } // on-screen font size
const CONTROLS = [50, 110] // map units the zoom buttons take from the bottom-right corner

const corners = ([w, s, e, n]) => ({
  type: 'MultiPoint',
  coordinates: [[w, s], [e, s], [e, n], [w, n]],
})

// d3-geo wants clockwise exterior rings. Flip any polygon that covers more than half the globe.
const rewind = (poly) =>
  geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly

function fixWinding(f) {
  const g = f.geometry
  if (g.type === 'Polygon') g.coordinates = rewind(g.coordinates)
  else if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map(rewind)
  return f
}

// The bbox as a geographic polygon, densified so its edges follow parallels and meridians.
function regionPolygon([w, s, e, n]) {
  const ring = []
  const steps = 60
  for (let i = 0; i <= steps; i++) ring.push([w + ((e - w) * i) / steps, s])
  for (let i = 1; i <= steps; i++) ring.push([e, s + ((n - s) * i) / steps])
  for (let i = 1; i <= steps; i++) ring.push([e - ((e - w) * i) / steps, n])
  for (let i = 1; i < steps; i++) ring.push([w, n - ((n - s) * i) / steps])
  ring.push(ring[0])
  return { type: 'Polygon', coordinates: rewind([ring]) }
}

const inBox = ([lon, lat], [w, s, e, n]) => lon >= w && lon <= e && lat >= s && lat <= n

// Clamp one axis so the region keeps filling the viewport; if it's smaller than the viewport, centre it.
function clampAxis(t, lo, hi, k, size) {
  const min = size - hi * k
  const max = -lo * k
  return min > max ? (min + max) / 2 : Math.min(max, Math.max(min, t))
}

// Keep the view locked on the region: you can zoom in and pan around inside it, but never off it.
function clampView({ k, x, y }, [[x0, y0], [x1, y1]]) {
  k = Math.min(MAX_ZOOM, Math.max(1, k))
  return { k, x: clampAxis(x, x0, x1, k, W), y: clampAxis(y, y0, y1, k, H) }
}

const overlaps = (box, boxes) => boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])

function zoomAt(v, k, [cx, cy], bounds) {
  k = Math.min(MAX_ZOOM, Math.max(1, k))
  return clampView({ k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k }, bounds)
}

// Sutherland–Hodgman: clip a ring (screen coords) to an axis-aligned rectangle.
function clipToRect(ring, [[x0, y0], [x1, y1]]) {
  const edges = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
  ]
  let out = ring
  for (const [inside, cross] of edges) {
    const input = out
    out = []
    for (let i = 0; i < input.length; i++) {
      const cur = input[i]
      const prev = input[(i + input.length - 1) % input.length]
      if (inside(cur)) {
        if (!inside(prev)) out.push(cross(prev, cur))
        out.push(cur)
      } else if (inside(prev)) out.push(cross(prev, cur))
    }
    if (!out.length) break
  }
  return out
}

const MIN_PIECE_AREA = 20 // map units²: smaller extra pieces (islands, exclaves) don't get their own label

// Where to put a polity's name: for its largest piece, and any other sizeable piece (Greenland as
// well as Denmark), the point deepest inside it. Not the centroid, which can land in the sea for
// crescent-shaped or scattered empires. Returns [{ point, area }] in map coordinates.
// Only the part inside `frame` ([[x0, y0], [x1, y1]], the playable area) counts, so a label is
// never placed off-screen (the Russian Empire's sits in European Russia on the Europe map).
function labelPoints(f, proj, frame) {
  const g = f.geometry
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []
  const pieces = []
  for (const poly of polys) {
    const rings = poly
      .map((ring) => clipToRect(ring.map((p) => proj(p)).filter((p) => p && Number.isFinite(p[0])), frame))
      .filter((r, i) => i === 0 || r.length >= 3)
    if (rings[0].length < 3) continue
    let a = 0
    const r = rings[0]
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1])
    pieces.push({ area: Math.abs(a) / 2, rings })
  }
  pieces.sort((a, b) => b.area - a.area)
  return pieces
    .filter((p, i) => i === 0 || p.area >= MIN_PIECE_AREA)
    .map(({ area, rings }) => ({ area, point: polylabel(rings, 0.5) }))
    .filter(({ point }) => Number.isFinite(point[0]))
}

// Border data comes in chunks (see src/chunks.js); each holds every territory alive at some point
// in its span, with the months it existed (src/dates.js). A month's map is the rows whose span
// contains it; a year without a month is shown as at its end.
const chunkCache = new Map()
function loadChunk(start) {
  if (!chunkCache.has(start)) {
    chunkCache.set(
      start,
      fetch(`${import.meta.env.BASE_URL}data/${start}.json`).then((r) => r.json()),
    )
  }
  return chunkCache.get(start)
}

// Which territories border each other, for picking neighbour colours that differ: two count as
// neighbours when their outlines pass through the same 1° grid cell. (Shared arcs alone miss many
// pairs, since neighbouring territories in the data are often traced separately.)
function nearbyTerritories(features) {
  const cells = new Map()
  features.forEach((f, i) => {
    const g = f.geometry
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
    for (const poly of polys)
      for (const ring of poly)
        for (const [lon, lat] of ring) {
          const key = `${Math.floor(lon)},${Math.floor(lat)}`
          if (!cells.has(key)) cells.set(key, new Set())
          cells.get(key).add(i)
        }
  })
  const near = features.map(() => new Set())
  for (const ids of cells.values()) {
    if (ids.size < 2) continue
    for (const a of ids) for (const b of ids) if (a !== b) near[a].add(b)
  }
  return near.map((s) => [...s])
}

// Flags (built by scripts/build-flags.mjs): { flags: { id: aspect }, names: { name: [[from, to, id]] } }.
let flagIndex = null
function loadFlags() {
  flagIndex ??= fetch(`${import.meta.env.BASE_URL}flags/index.json`)
    .then((r) => (r.ok ? r.json() : { flags: {}, names: {} }))
    .catch(() => ({ flags: {}, names: {} }))
  return flagIndex
}

// The flag a territory flies in a year: { href, aspect } or null.
function flagOf(index, name, year) {
  if (!index || year < FLAGS_FROM) return null
  const id = index.names[name]?.find(([a, b]) => a <= year && year <= b)?.[2]
  return id ? { href: `${import.meta.env.BASE_URL}flags/${id}.png`, aspect: Math.min(2, Math.max(1, index.flags[id])) } : null
}

const mapCache = new Map()
async function loadMap(year, month) {
  const t = monthIndex(year, month ?? 12)
  if (!mapCache.has(t)) {
    mapCache.set(
      t,
      loadChunk(chunkStart(year)).then((topo) => {
        const alive = {
          type: 'GeometryCollection',
          geometries: topo.objects.borders.geometries.filter(
            (g) => g.type && rowStart(g.properties) <= t && t <= rowEnd(g.properties),
          ),
        }
        const features = feature(topo, alive).features.map(fixWinding)
        return {
          features,
          neighbours: nearbyTerritories(features),
          // Only lines shared by two territories: the shores come from the real coastline instead.
          borders: mesh(topo, alive, (a, b) => a !== b),
        }
      }),
    )
  }
  return mapCache.get(t)
}

// Land mask of a game region (built by scripts/build-regions.mjs): only polities inside it are drawn.
const regionCache = new Map()
function loadRegionMask(key) {
  if (!regionCache.has(key)) {
    regionCache.set(
      key,
      fetch(`${import.meta.env.BASE_URL}regions/${key}.json`)
        .then((r) => r.json())
        .then((topo) => fixWinding(feature(topo, topo.objects.region).features[0])),
    )
  }
  return regionCache.get(key)
}

export function preloadYear(year, month) {
  loadMap(year, month)
}

// A five-pointed star centred on (x, y), r to the tips: how capitals are marked.
function starPoints(x, y, r) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const d = i % 2 ? r * 0.45 : r
    pts.push(`${x + d * Math.cos(a)},${y + d * Math.sin(a)}`)
  }
  return pts.join(' ')
}

// month: 1–12, or null/undefined for a year's map (as at its end).
export default function MapView({ year, month, region, bbox }) {
  const [data, setData] = useState(null)
  const [mask, setMask] = useState(null) // { key, feature } for the active region
  const features = data?.features
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  const [hover, setHover] = useState(null)
  const [flags, setFlags] = useState(null)
  const drag = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    let alive = true
    setData(null)
    setView({ k: 1, x: 0, y: 0 })
    loadMap(year, month).then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [year, month])

  useEffect(() => {
    let alive = true
    loadFlags().then((f) => alive && setFlags(f))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!region || region === 'world') return
    let alive = true
    loadRegionMask(region).then((f) => alive && setMask({ key: region, feature: f }))
    return () => {
      alive = false
    }
  }, [region])
  const regionMask = region && region !== 'world' && mask?.key === region ? mask.feature : null
  const maskReady = !region || region === 'world' || regionMask !== null

  const regionOutline = useMemo(() => (bbox ? regionPolygon(bbox) : null), [bbox])

  const path = useMemo(() => {
    // Mercator keeps the map flat and rectangular: parallels are straight, regions are rectangles.
    const proj = geoMercator()
    // Centre the projection on the region so the date line (where the map ends) is on the far side.
    if (bbox) proj.rotate([-(bbox[0] + bbox[2]) / 2, 0]).fitExtent([[10, 10], [W - 10, H - 10]], corners(bbox))
    else proj.fitExtent([[0, 0], [W, H]], corners(WORLD_BBOX))
    return geoPath(proj)
  }, [bbox])

  const landPath = useMemo(() => path(LAND), [path])
  const bounds = useMemo(() => path.bounds(regionOutline || corners(WORLD_BBOX)), [path, regionOutline])

  const shapes = useMemo(() => {
    if (!features) return []
    const proj = path.projection()
    // The playable area, kept inside the viewport.
    const frame = [
      [Math.max(0, bounds[0][0]), Math.max(0, bounds[0][1])],
      [Math.min(W, bounds[1][0]), Math.min(H, bounds[1][1])],
    ]
    const colors = assignColors(features.map((f) => ownerOf(f.properties)), data.neighbours)
    return features.map((f, i) => {
      const name = (f.properties.Name || '').trim()
      const inRegion = (pt) => {
        const geo = proj.invert(pt)
        return !!geo && (regionMask ? geoContains(regionMask, geo) : !bbox || inBox(geo, bbox))
      }
      return {
        id: i,
        name,
        label: displayName(name),
        d: path(f),
        fill: colors[i],
        flag: flagOf(flags, name, year),
        // The check that the point is really inside f catches shapes that wrap across the date line.
        anchors: labelPoints(f, proj, frame).filter((a) => inRegion(a.point) && geoContains(f, proj.invert(a.point))),
      }
    })
  }, [features, data, path, bbox, regionMask, bounds, flags, year])

  // Cities of this year inside the region, in map coordinates.
  const cities = useMemo(() => {
    const proj = path.projection()
    // Port cities can sit just off the region's 1:50m coastline (New York), so a near miss counts.
    const NEAR = [[0, 0], [0.3, 0], [-0.3, 0], [0, 0.3], [0, -0.3]]
    const inRegion = (c) =>
      regionMask
        ? NEAR.some(([dx, dy]) => geoContains(regionMask, [c.lon + dx, c.lat + dy]))
        : !bbox || inBox([c.lon, c.lat], bbox)
    return citiesIn(year)
      .filter(inRegion)
      .map((c) => ({ ...c, point: proj([c.lon, c.lat]) }))
      .filter(({ point: p }) => p && p[0] >= bounds[0][0] && p[0] <= bounds[1][0] && p[1] >= bounds[0][1] && p[1] <= bounds[1][1])
  }, [year, path, bbox, regionMask, bounds])
  const zoom = (path.projection().scale() / WORLD_SCALE) * view.k

  // Every territory gets a label, biggest first. Labels that would overlap a bigger one at the
  // current zoom wait until you zoom in; hovering always shows the name.
  const labels = useMemo(() => {
    const candidates = shapes
      .flatMap((s) => s.anchors.map((a, j) => ({ key: `${s.id}-${j}`, text: s.label, flag: s.flag, ...a })))
      .sort((a, b) => b.area - a.area)
    const placed = []
    const byText = new Map() // where each name is already shown, so repeats stay well apart
    const out = []
    const apart = 160 / view.k
    for (const c of candidates) {
      const [x, y] = c.point
      const seen = byText.get(c.text) || []
      if (seen.some(([sx, sy]) => Math.hypot(sx - x, sy - y) < apart)) continue
      const px = Math.min(15, Math.max(7, 5 + (Math.sqrt(c.area) * view.k) / 14)) // on-screen font size
      const size = px / view.k
      const textW = c.text.length * size * 0.5 + size * 0.4
      // A flag sits left of the name; the pair is centred on the label point.
      const flagH = size * 0.8
      const flagW = c.flag ? flagH * c.flag.aspect : 0
      const gap = c.flag ? size * 0.3 : 0
      const w = textW + flagW + gap
      const h = size * 1.15
      const box = [x - w / 2, y - h / 2, x + w / 2, y + h / 2]
      if (overlaps(box, placed)) continue
      placed.push(box)
      byText.set(c.text, [...seen, [x, y]])
      out.push({
        ...c,
        size,
        textX: x + (flagW + gap) / 2,
        flagBox: c.flag && { x: x - w / 2, y: y - flagH / 2 - size * 0.05, w: flagW, h: flagH },
      })
    }

    // Then the cities, most important first, wherever they don't cover a country's name: the name
    // goes right of the dot, else left, above or below, whichever fits on the visible map.
    const visible = [-view.x / view.k, -view.y / view.k, (W - view.x) / view.k, (H - view.y) / view.k]
    // The zoom buttons cover the bottom-right corner.
    const toMap = (sx, sy) => [(sx - view.x) / view.k, (sy - view.y) / view.k]
    placed.push([...toMap(W - CONTROLS[0], H - CONTROLS[1]), ...toMap(W, H)])
    const shown = []
    for (const c of [...cities].sort((a, b) => a.rank - b.rank)) {
      if (zoom < CITY_ZOOM[c.rank]) continue
      const size = CITY_PX[c.rank] / view.k
      const r = (c.capital || c.colony ? 3.6 : c.rank === 1 ? 2.4 : 1.9) / view.k
      const [x, y] = c.point
      const tw = c.name.length * size * (c.rank === 1 ? 0.62 : 0.58)
      const pad = r + size * 0.35
      const h = size * 0.6
      const spots = [
        { anchor: 'start', tx: x + pad, ty: y, box: [x - r, y - h, x + pad + tw, y + h] },
        { anchor: 'end', tx: x - pad, ty: y, box: [x - pad - tw, y - h, x + r, y + h] },
        { anchor: 'middle', tx: x, ty: y - pad - h, box: [x - tw / 2, y - pad - 2 * h, x + tw / 2, y + r] },
        { anchor: 'middle', tx: x, ty: y + pad + h, box: [x - tw / 2, y - r, x + tw / 2, y + pad + 2 * h] },
      ]
      const inView = ([x0, y0, x1, y1]) => x0 >= visible[0] && x1 <= visible[2] && y0 >= visible[1] && y1 <= visible[3]
      const spot = spots.find((p) => inView(p.box) && !overlaps(p.box, placed))
      if (!spot) continue
      placed.push(spot.box)
      shown.push({ ...c, size, r, ...spot })
    }
    return { countries: out, cities: shown }
  }, [shapes, cities, view, zoom])

  // --- pan & zoom ---
  function toSvg(e) {
    const r = svgRef.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }
  function onWheel(e) {
    const [mx, my] = toSvg(e)
    setView((v) => zoomAt(v, v.k * (e.deltaY < 0 ? 1.2 : 1 / 1.2), [mx, my], bounds))
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
    setView(clampView({ ...v0, x: v0.x + x - start[0], y: v0.y + y - start[1] }, bounds))
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
          <clipPath id="land-clip">
            <path d={regionMask ? path(regionMask) : landPath} />
          </clipPath>
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
          <path d={path(GRATICULE)} className="graticule" />
          <path d={landPath} className="land" />
          <g clipPath="url(#land-clip)" visibility={maskReady ? "visible" : "hidden"}>
          {/* Bleed: the historical shapes don't hug the real coastline exactly, so each polity
              gets a wide stroke in its own colour underneath to fill the gaps up to the shore. */}
          {shapes.map((s) => (
            <path key={`b${s.id}`} d={s.d} fill={s.fill} stroke={s.fill} className="bleed" />
          ))}
          {shapes.map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill={s.fill}
              className={`polity ${hover === s.id ? 'hover' : ''}`}
              onPointerEnter={() => setHover(s.id)}
              onPointerLeave={() => setHover((h) => (h === s.id ? null : h))}
            />
          ))}
          {data && <path d={path(data.borders)} className="borders" />}
          </g>
          <path d={landPath} className="coast" />
          {labels.cities.map((c) => (
            <g key={`c-${c.name}-${c.lon}`} className={`city rank${c.rank}${c.capital ? ' capital' : c.colony ? ' colony' : ''}`}>
              {c.capital || c.colony ? <polygon points={starPoints(c.point[0], c.point[1], c.r)} /> : <circle cx={c.point[0]} cy={c.point[1]} r={c.r} />}
              <text x={c.tx} y={c.ty} textAnchor={c.anchor} style={{ fontSize: c.size, strokeWidth: c.size * 0.25 }}>
                {c.name}
              </text>
            </g>
          ))}
          {labels.countries.map((s) => (
            <g key={s.key}>
              {s.flagBox && (
                <>
                  <image href={s.flag.href} x={s.flagBox.x} y={s.flagBox.y} width={s.flagBox.w} height={s.flagBox.h} preserveAspectRatio="none" />
                  <rect x={s.flagBox.x} y={s.flagBox.y} width={s.flagBox.w} height={s.flagBox.h} className="flag-edge" />
                </>
              )}
              <text x={s.textX} y={s.point[1]} className="label" style={{ fontSize: s.size, strokeWidth: s.size * 0.22 }}>
                {s.text}
              </text>
            </g>
          ))}
        </g>
        <rect width={W} height={H} filter="url(#paper)" fill="transparent" pointerEvents="none" />
      </svg>
      {(!features || !maskReady) && <div className="map-loading">Unrolling the map…</div>}
      {hover !== null && shapes[hover]?.name && (
        <div className="tooltip">
          {shapes[hover].flag && <img src={shapes[hover].flag.href} alt="" className="tooltip-flag" />}
          {shapes[hover].name}
        </div>
      )}
      <div className="map-controls">
        <button onClick={() => setView((v) => zoomAt(v, v.k * 1.5, [W / 2, H / 2], bounds))}>+</button>
        <button onClick={() => setView((v) => zoomAt(v, v.k / 1.5, [W / 2, H / 2], bounds))}>−</button>
        <button onClick={() => setView({ k: 1, x: 0, y: 0 })}>⟲</button>
      </div>
    </div>
  )
}
