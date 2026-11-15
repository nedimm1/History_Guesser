// Tags the polygons that are peoples, tribes and archaeological cultures rather than states
// ("Amazon hunter-gatherers", "Slavic tribes", "Comanche", "Wardandi"…) with KIND: "people".
// The map draws those without colour or borders, so only real states stand out.
//
// Run after scripts/fill-names.mjs:  node scripts/mark-peoples.mjs   (safe to re-run)
import fs from 'fs'
import { feature } from 'topojson-client'
import { geoArea, geoCentroid } from 'd3-geo'

// Generic descriptions of non-state groups.
const PEOPLE_WORDS =
  /hunt|gather|\btribes?\b|tribal|\bpeoples?\b|nomad|pastoral|herder|farmers|\bcultures?\b|clans\b|aborigin|forager|fisher|horticult|mammal/i
// Contain a people-word but describe states.
const STATE_WORDS =
  /empire|kingdom|republic|viceroyalty|sultanate|confedera(cy|tion) of (?!tribes)|states|province|colony|captaincy|duchy|caliphate|khanate|dynasty|union|territory|commonwealth|dominion|county|principality|emirate|shogun|\bstate\b/i

// Peoples in Europe, Africa and Asia that the data names without a giveaway word.
const NAMED_PEOPLES = new Set([
  'Slavs', 'Proto-Slavs', 'Balts', 'Finns', 'Permians', 'Karelians', 'Veps', 'Chuds', 'Ests', 'Curonians',
  'Prussians', 'Mordvinians', 'Samoyèdes', 'Tungus', 'Samis', 'Saami', 'Sámi', 'Siberians', 'Koryaks', 'Enets',
  'Nenets', 'Ainus', 'Ainu', 'Papuans', 'Tuaregs', 'Berbers', 'Bedouins', 'Arabs', 'Guanches', 'Cushites',
  'Khoisan', 'Polynesians', 'Maori', 'Māori', 'Inuit', 'Aleut', 'Aleuts', 'Pygmies', 'Yup\'ik & Cup\'ik', 'Inupiaq',
  // American peoples whose names happen to contain a place word the state list below looks for.
  'New River Shasta', 'Sivuqaq (St. Lawrence Island) Yupik', 'Chimariko (territory)', 'Mayangna', 'Wari’', 'Xinca',
  'Delaware', 'Guachichiles', 'Aaniiih',
])

// In the Americas, Australia and the Pacific almost every name before colonisation is a people.
// These are the real states (and colonies or countries the data names without a ruler).
const AMERICAS_STATES =
  /aztec|mexica|triple alliance|inca|tawantinsuyu|maya|purépecha|p’urhépecha|tarascan|mixtec|ñuu savi|zapotec|tlaxcala|muisca|chim[uú]|tiwanaku|wari|teotihuacan|moche|toltec|chich[eé]n|mayap[aá]n|cahokia|hawai|tonga|carolina|virginia|massachusetts|georgia|florida|luisiana|louisiana|quebec|\bnew |nueva|nouvelle|guiana|guyana|surinam|essequibo|cayenne|rupert|acadia|canada|belize|mosquito|hudson|texas|california|oregon|plymouth|maryland|connecticut|rhode|pennsylvania|delaware|jersey|hampshire|audiencia|brazil|peru|mexico|chile|argentin|bolivia|colombia|venezuela|ecuador|paraguay|uruguay|haiti|cuba|hispaniola|santo domingo|jamaica|barbados|bahamas|bermuda|trinidad|martinique|guadeloupe|antilles|virgin|panama|costa rica|nicaragua|honduras|salvador|guatemala|alaska|australia|zealand|wales|queensland|victoria|tasmania \(|fiji|samoa|monte alb[aá]n|veracruz|denmark|norway|iceland|greenland|\bsaint\b|\bst\.|antigua|kitts|vincent|barth|wallis|caicos|grenad|dominica|montserrat|anguilla|aruba|cura[cç]ao|cayman|\bislands$|\(uk\)|\(gb\)|\(france\)|\(spain\)/i

const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'))
const MODERN = new Set(world.objects.countries.geometries.map((g) => g.properties.name))

const rewind = (poly) => (geoArea({ type: 'Polygon', coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly)
function fixWinding(g) {
  if (g.type === 'Polygon') g.coordinates = rewind(g.coordinates)
  else if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map(rewind)
  return g
}

function isPeople({ NAME, SUBJECTO }, geometry) {
  const name = (NAME || '').trim()
  if (!name) return false
  if (NAMED_PEOPLES.has(name)) return true
  if (SUBJECTO && /[a-z]/i.test(SUBJECTO) && SUBJECTO !== NAME) return false // ruled by someone: a colony or vassal
  if (MODERN.has(name)) return false
  if (PEOPLE_WORDS.test(name) && !STATE_WORDS.test(name)) return true
  if (STATE_WORDS.test(name)) return false
  const [lon, lat] = geoCentroid(fixWinding(geometry))
  const newWorld = lon < -30 || lon > 165 || (lon > 110 && lat < -8) // the Americas, Australia, the Pacific
  return newWorld && !AMERICAS_STATES.test(name)
}

const years = JSON.parse(fs.readFileSync('src/years.json')).years
for (const year of years) {
  const file = `public/data/${year}.json`
  const topo = JSON.parse(fs.readFileSync(file))
  const geoms = topo.objects.borders.geometries
  const feats = feature(topo, topo.objects.borders).features
  let peoples = 0
  feats.forEach((f, i) => {
    if (!f.geometry || !geoms[i].properties) return
    const { KIND: _old, ...rest } = geoms[i].properties
    geoms[i].properties = isPeople(rest, f.geometry) ? { ...rest, KIND: 'people' } : rest
    if (geoms[i].properties.KIND) peoples++
  })
  fs.writeFileSync(file, JSON.stringify(topo))
  const named = feats.filter((f) => (f.properties.NAME || '').trim()).length
  console.log(year, `${peoples} of ${named} named shapes are peoples`)
}
