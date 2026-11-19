// Corrections to the OpenHistoricalMap data (2000–2024), applied by scripts/build-ohm.mjs. Same
// format as the other files here (see scripts/history-fixes.mjs). Each month shows the map at the
// end of that month; outlines are approximate (front lines to within a few km) and are kept inside
// the country they are taken from.
//
// De facto control is shown, as for Crimea (Russian from 2014 in OHM): breakaway states that held
// their land for the whole period, and the parts of Ukraine Russia occupied.

const UA = ['Ukraine', 2013]

// Front lines in Ukraine, north to south, as they stood at the end of each year. East of the line
// (up to the Russian border, drawn generously: the outline is kept inside Ukraine) is occupied.
const FAR_EAST = [[40.8, 46.6], [40.8, 50.6]]
const SOUTH_COAST = [[31.4, 46.45], [31.4, 46.25], [33.3, 46.25], [33.9, 46.22], [34.9, 46.1], [36.5, 46.45], [38.4, 46.9]]
const DNIPRO = [ // from Vasylivka down the Kakhovka reservoir and the Dnipro to the Kinburn spit
  [35.35, 47.47], [35.15, 47.62], [34.6, 47.53], [34.2, 47.3], [33.9, 47.1], [33.45, 46.8], [33.0, 46.66],
  [32.6, 46.62], [32.3, 46.52], [31.6, 46.55],
]
const FRONT_2022 = [ // after the Kharkiv and Kherson counter-offensives (Sept–Nov 2022)
  [38.6, 50.6], [38.05, 49.95], [38.0, 49.6], [38.05, 49.35], [38.12, 49.05], [38.17, 48.85], [38.08, 48.6],
  [37.95, 48.35], [37.8, 48.16], [37.68, 48.04], [37.55, 47.95], [37.4, 47.75], [36.9, 47.62], [36.4, 47.5],
  [35.9, 47.42],
]
const FRONT_2023 = [ // Bakhmut taken in May 2023, Marinka in December
  [38.6, 50.6], [38.05, 49.95], [38.0, 49.6], [38.05, 49.35], [38.12, 49.05], [38.12, 48.85], [37.93, 48.6],
  [37.9, 48.35], [37.8, 48.16], [37.62, 48.04], [37.45, 47.95], [37.4, 47.75], [36.9, 47.62], [36.4, 47.5],
  [35.9, 47.42],
]
const FRONT_2024 = [ // Avdiivka (Feb), Vuhledar (Oct), Selydove (Oct) taken; Kurakhove and Pokrovsk's approaches
  [38.6, 50.6], [37.95, 49.95], [37.75, 49.7], [37.9, 49.4], [38.05, 49.1], [38.05, 48.85], [37.88, 48.6],
  [37.78, 48.42], [37.4, 48.3], [37.25, 48.15], [37.2, 47.95], [37.12, 47.78], [36.85, 47.75], [36.4, 47.5],
  [35.9, 47.42],
]

export default [
  // --- Ukraine ---
  // OHM keeps Crimea in Ukraine's shape after Russia's 2014 annexation and relies on drawing order;
  // cut it out so Russia's Crimea is the only one, whatever order the shapes end up in.
  ['Crimea', '2014-03', 2024, { within: UA, eraseFrom: ['Ukraine'], draw: [[32.3, 46.05], [33.4, 46.2], [34.0, 46.22], [34.9, 46.1], [36.8, 45.6], [36.8, 44.2], [32.3, 44.2]] }],
  // April 2014 – February 2022: the Russian-backed "people's republics" (proclaimed April 2014),
  // drawn behind the 2015 Minsk II contact line throughout.
  ["Donetsk People's Republic", '2014-04', '2022-02', { within: UA, wikidata: 'Q16150196', draw: [
    [40.8, 48.75], [39.5, 48.62], [39.0, 48.55], [38.7, 48.58], [38.45, 48.52], [38.36, 48.36], [38.0, 48.36],
    [37.85, 48.18], [37.73, 48.06], [37.6, 47.97], [37.66, 47.75], [37.85, 47.45], [37.75, 47.07], [37.6, 46.6], [40.8, 46.6],
  ] }],
  ["Luhansk People's Republic", '2014-04', '2022-02', { within: UA, wikidata: 'Q16746854', draw: [
    [40.8, 48.75], [39.5, 48.62], [39.0, 48.55], [38.7, 48.58], [38.45, 48.52], [38.3, 48.45], [39.2, 48.05], [39.85, 47.85], [40.8, 47.85],
  ] }],
  // From the invasion (24 February 2022): Russia's occupation (annexation claimed September 2022),
  // drawn in Russia's colour. Each year's line is where the front stood at its end; March–November
  // 2022, when Russia also held the north, Kharkiv oblast and Kherson, get the end-of-2022 line too.
  ['Russian-occupied Ukraine', '2022-03', 2022, { within: UA, member: '(Russia)', wikidata: null, draw: [...FRONT_2022, ...DNIPRO, ...SOUTH_COAST, ...FAR_EAST] }],
  ['Russian-occupied Ukraine', 2023, 2023, { within: UA, member: '(Russia)', wikidata: null, draw: [...FRONT_2023, ...DNIPRO, ...SOUTH_COAST, ...FAR_EAST] }],
  ['Russian-occupied Ukraine', 2024, 2024, { within: UA, member: '(Russia)', wikidata: null, draw: [...FRONT_2024, ...DNIPRO, ...SOUTH_COAST, ...FAR_EAST] }],

  // --- Breakaway states holding their land throughout 2000–2024 ---
  ['Turkish Republic of Northern Cyprus', 2000, 2024, { within: ['Cyprus', 2000], wikidata: 'Q23681', draw: [ // north of the Green Line (1974)
    [32.5, 35.2], [32.75, 35.17], [33.0, 35.16], [33.2, 35.15], [33.36, 35.18], [33.45, 35.16], [33.7, 35.08],
    [33.95, 35.05], [34.3, 35.05], [34.8, 35.9], [32.5, 35.9],
  ] }],
  ['Somaliland', 2000, 2024, { within: ['Somalia', 2000], wikidata: 'Q34754', draw: [ // former British Somaliland, independent de facto since 1991
    [42.5, 12.5], [49.1, 12.5], [49.1, 10.8], [48.0, 8.0], [42.5, 8.0],
  ] }],
  ['Transnistria', 2000, 2024, { within: ['Moldova', 2000], wikidata: 'Q907112', draw: [ // the Dniester's left bank and Bender, since 1992
    [28.4, 48.5], [28.45, 48.15], [28.75, 47.9], [28.95, 47.5], [29.12, 47.2], [29.38, 46.88], [29.55, 46.75],
    [29.88, 46.42], [31.0, 46.3], [31.0, 48.6],
  ] }],
  ['Abkhazia', 2000, 2024, { within: ['Georgia', 2000], wikidata: 'Q23334', draw: [ // west of the Inguri, since 1993
    [39.5, 44.0], [42.0, 44.0], [42.0, 42.95], [41.75, 42.75], [41.62, 42.6], [41.55, 42.35], [39.5, 42.35],
  ] }],
  ['South Ossetia', 2000, 2024, { within: ['Georgia', 2000], wikidata: 'Q23427', draw: [ // around Tskhinvali, since 1992
    [43.4, 42.15], [43.6, 42.0], [44.1, 42.05], [44.4, 42.2], [44.5, 42.5], [44.1, 42.65], [43.6, 42.6], [43.4, 42.45],
  ] }],
  // Nagorno-Karabakh: with the seven surrounding districts from the 1994 ceasefire until the 2020
  // war (ceasefire 10 November), then the rump around Stepanakert until the September 2023
  // offensive ended it.
  ['Republic of Artsakh', 2000, '2020-10', { within: ['Azerbaijan', 2010], wikidata: 'Q244165', draw: [
    [45.3, 40.5], [46.0, 40.4], [46.5, 40.3], [46.75, 40.2], [46.95, 40.05], [47.0, 39.8], [47.0, 39.5], [46.9, 39.1], [45.3, 39.1],
  ] }],
  ['Republic of Artsakh', '2020-11', '2023-08', { within: ['Azerbaijan', 2020], wikidata: 'Q244165', draw: [
    [46.45, 40.25], [46.9, 40.15], [47.0, 39.95], [46.95, 39.7], [46.8, 39.66], [46.67, 39.79], [46.5, 39.9], [46.35, 40.1],
  ] }],
  // Western Sahara: shown apart from Morocco, as on most world maps (its status is unresolved).
  ['Western Sahara', 2000, 2024, { within: ['Morocco', 2000], wikidata: 'Q6250', draw: [
    [-17.5, 27.667], [-8.667, 27.667], [-8.667, 20.5], [-17.5, 20.5],
  ] }],
]
