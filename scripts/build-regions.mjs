// Builds one land mask per game region (public/regions/<key>.json) from Natural Earth 1:50m countries.
// Inside a region's mask the historical borders are drawn; the rest of the world stays blank.
// Run with: node scripts/build-regions.mjs
import mapshaper from 'mapshaper'
import fs from 'fs'

const MED = ['Turkey', 'Cyprus', 'N. Cyprus', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan',
  'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco']
const MIDEAST = ['Turkey', 'Cyprus', 'N. Cyprus', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan',
  'Iraq', 'Iran', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain', 'Kuwait']
const AFRICA = ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon',
  'Central African Rep.', 'Chad', 'Comoros', 'Congo', 'Dem. Rep. Congo', "Côte d'Ivoire", 'Djibouti', 'Egypt',
  'Eq. Guinea', 'Eritrea', 'eSwatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya',
  'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique',
  'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
  'Somalia', 'Somaliland', 'South Africa', 'S. Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
  'W. Sahara', 'Zambia', 'Zimbabwe', 'Saint Helena']
const EUROPE = ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herz.', 'Bulgaria', 'Croatia',
  'Czechia', 'Denmark', 'Estonia', 'Faeroe Is.', 'Finland', 'France', 'Germany', 'Greece', 'Guernsey', 'Hungary',
  'Iceland', 'Ireland', 'Isle of Man', 'Italy', 'Jersey', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
  'Portugal', 'Romania', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
  'Ukraine', 'United Kingdom', 'Vatican', 'Åland', 'Georgia', 'Armenia', 'Azerbaijan']
const ASIA = ['Afghanistan', 'Pakistan', 'India', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Maldives',
  'Siachen Glacier', 'China', 'Hong Kong', 'Macao', 'Taiwan', 'Mongolia', 'North Korea', 'South Korea', 'Japan',
  'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan', 'Iran', 'Myanmar', 'Thailand', 'Laos',
  'Cambodia', 'Vietnam', 'Malaysia', 'Singapore', 'Brunei', 'Indonesia', 'Philippines', 'Timor-Leste']
const AMERICAS = ['Canada', 'United States of America', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras',
  'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Rep.', 'Puerto Rico', 'Bahamas',
  'Trinidad and Tobago', 'Barbados', 'Grenada', 'St. Vin. and Gren.', 'Saint Lucia', 'Dominica', 'Antigua and Barb.',
  'St. Kitts and Nevis', 'Anguilla', 'Montserrat', 'British Virgin Is.', 'U.S. Virgin Is.', 'Cayman Is.',
  'Turks and Caicos Is.', 'Aruba', 'Curaçao', 'Sint Maarten', 'St-Martin', 'St-Barthélemy', 'Bermuda',
  'St. Pierre and Miquelon', 'Greenland', 'Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Peru',
  'Brazil', 'Bolivia', 'Paraguay', 'Chile', 'Argentina', 'Uruguay', 'Falkland Is.', 'S. Geo. and the Is.']

// Whole countries, plus slices of countries that span regions: [name, west, south, east, north].
const REGIONS = {
  europe: { countries: [...EUROPE, ...MED], parts: [['Russia', 15, -90, 60, 90]] }, // Russia west of the Urals
  mideast: { countries: [...AFRICA, ...MIDEAST], parts: [] },
  asia: { countries: ASIA, parts: [['Russia', 60, -90, 180, 90]] }, // Russia east of the Urals
  americas: { countries: AMERICAS, parts: [['France', -60, 0, -50, 10]] }, // French Guiana
}

const SRC = 'node_modules/world-atlas/countries-50m.json'
fs.mkdirSync('public/regions', { recursive: true })
for (const [key, { countries, parts }] of Object.entries(REGIONS)) {
  const list = JSON.stringify(countries).replace(/'/g, '\\u0027') // keep "Côte d'Ivoire" from ending the quote
  const cmds = [`-i ${SRC}`, '-target countries', `-filter '${list}.includes(name)' + name=main`]
  const layers = ['main']
  parts.forEach(([name, w, s, e, n], i) => {
    cmds.push('-target countries', `-filter 'name === "${name}"' + name=p${i}`, `-clip bbox=${w},${s},${e},${n}`)
    layers.push(`p${i}`)
  })
  cmds.push(
    `-merge-layers target=${layers.join(',')} force name=region`,
    '-dissolve',
    `-o public/regions/${key}.json format=topojson quantization=100000`,
  )
  await mapshaper.runCommands(cmds.join(' '))
}
