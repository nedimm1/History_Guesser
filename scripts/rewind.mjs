// d3-geo wants clockwise exterior rings. Flip any polygon that covers > half the globe.
import { geoArea } from 'd3-geo'
import fs from 'fs'
const dir = 'public/data'
const fix = (poly) => geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly
for (const f of fs.readdirSync(dir)) {
  const fc = JSON.parse(fs.readFileSync(`${dir}/${f}`))
  fc.features = fc.features.filter((x) => x.geometry).map((x) => {
    const g = x.geometry
    g.coordinates = g.type === 'Polygon' ? fix(g.coordinates) : g.coordinates.map(fix)
    return x
  })
  fs.writeFileSync(`${dir}/${f}`, JSON.stringify(fc))
}
