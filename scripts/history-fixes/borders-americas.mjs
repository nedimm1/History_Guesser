// Americas: border corrections layered on the Cliopatria data (after scripts/history-fixes/*).
// Coordinates are [lon, lat]. Outlines are clipped to land; most US ones also `within` the
// 1890 United States, so only their inner edges (rivers, meridians) are drawn with care.

const US = 'United States of America'
const US1890 = [US, 1890]
const CONTIG = [-128, 20, -60, 50] // pieces of the contiguous US (Alaska and islands lie outside)

// --- shared border lines ---
// Mississippi from 31°N up to its source, then the line to Lake of the Woods.
const MISSISSIPPI_UP = [[-91.63, 31.0], [-91.43, 31.6], [-90.95, 32.3], [-91.1, 33.0], [-91.06, 33.4], [-90.6, 34.5], [-90.08, 35.1], [-89.66, 36.19], [-89.53, 36.59], [-89.15, 37.0], [-89.5, 37.3], [-90.18, 38.63], [-90.45, 38.97], [-91.35, 39.7], [-91.4, 40.4], [-91.05, 41.42], [-90.6, 41.55], [-90.65, 42.5], [-91.2, 43.5], [-92.0, 44.4], [-92.9, 44.75], [-93.27, 45.0], [-94.2, 46.35], [-95.21, 47.24], [-95.15, 49.38]]
// Georgia–Florida line: St Marys River, then to the Chattahoochee–Flint confluence, up to 31°N.
const GA_FL = [[-81.45, 30.72], [-81.95, 30.78], [-82.04, 30.36], [-82.22, 30.57], [-84.86, 30.71], [-85.0, 31.0]]
// Isle of Orleans: Mississippi down to Bayou Manchac, the lakes, out to sea (west of it was Louisiana).
const ORLEANS = [[-91.55, 30.85], [-91.2, 30.45], [-91.05, 30.3], [-90.45, 30.28], [-90.1, 30.18], [-89.72, 30.17], [-89.4, 30.0], [-88.8, 29.4]]
// Sabine and Red rivers, 100°W, Arkansas River to its source (the Adams–Onís line of 1819).
const ADAMS_ONIS = [[-93.85, 29.7], [-93.72, 30.1], [-93.7, 30.6], [-93.55, 31.0], [-93.75, 31.5], [-94.04, 32.0], [-94.04, 33.55], [-94.48, 33.64], [-95.2, 33.9], [-96.0, 33.85], [-96.6, 33.85], [-97.2, 33.85], [-98.0, 34.1], [-98.5, 34.15], [-99.0, 34.2], [-99.5, 34.4], [-100.0, 34.56], [-100.0, 37.75], [-100.87, 37.97], [-102.0, 38.05], [-103.54, 37.98], [-104.6, 38.27], [-105.24, 38.44], [-106.0, 38.53], [-106.13, 38.84], [-106.3, 39.25]]
// Continental Divide from 42°N (Wyoming) to the Canadian border: the western edge of Louisiana.
const DIVIDE_N = [[-106.3, 42.0], [-108.9, 42.35], [-109.6, 43.0], [-110.07, 43.75], [-110.6, 44.4], [-111.3, 44.6], [-112.3, 44.56], [-113.3, 44.8], [-113.94, 45.69], [-113.2, 46.1], [-112.5, 46.0], [-112.31, 46.56], [-112.37, 47.08], [-113.35, 48.32], [-114.05, 49.0], [-114.05, 50]]
// Texas west and north: Rio Grande at 32°N, 103°W, 36.5°N, 100°W.
const TEXAS_W = [[-106.55, 24], [-106.62, 32.0], [-103.06, 32.0], [-103.04, 36.5], [-100.0, 36.5]]
// 1848 line (before the Gadsden Purchase): 32°22′N west of the Rio Grande, the Gila River to the Colorado.
const GILA = [[-106.62, 32.0], [-106.85, 32.37], [-109.0, 32.37], [-109.0, 32.95], [-109.7, 32.83], [-110.45, 32.98], [-111.4, 33.03], [-112.0, 33.2], [-112.3, 33.38], [-112.72, 32.95], [-113.5, 32.8], [-114.62, 32.72], [-114.75, 32.72], [-114.75, 30], [-130, 30]]

const NE = [[-60, 50], [-60, 30.7]] // generous over Canada and the Atlantic
const FLORIDA_SEA = [[-60, 50], [-60, 23.5], [-83, 23.5], [-88, 28.5]] // around Florida by sea
const LA_SEA = [[-88.8, 28.0], [-93.85, 28.5]] // Gulf from the Mississippi delta to the Sabine

// US 1783: Treaty of Paris — Mississippi west, 31°N and the St Marys south.
const US_1783 = [[-95.15, 50], ...NE, ...GA_FL, ...MISSISSIPPI_UP]
// + Louisiana Purchase (1803), north to 49°N and west to the Continental Divide.
const louisiana = (south) => [[-114.05, 50], ...NE, ...GA_FL, ...south, ...LA_SEA, ...ADAMS_ONIS, ...DIVIDE_N]
const US_1803 = louisiana([[-91.63, 31.0], ...ORLEANS])
const US_1810 = louisiana([[-87.6, 31.0], [-87.42, 30.6], [-87.52, 30.28], [-87.5, 29.5]]) // + West Florida to the Perdido
const US_1821 = [[-114.05, 50], ...FLORIDA_SEA, ...LA_SEA, ...ADAMS_ONIS, ...DIVIDE_N] // + Florida
// + Texas and Oregon (south of 49°N, west of the Divide, north of 42°N).
const US_1846 = [[-130, 50], ...FLORIDA_SEA, [-93.85, 28.5], [-97, 24], ...TEXAS_W, ...ADAMS_ONIS.slice(17), [-106.3, 42.0], [-130, 42.0]]
// + Mexican Cession: everything but the Gadsden strip.
const US_1848 = [[-130, 50], ...FLORIDA_SEA, [-93.85, 28.5], [-97, 24], [-106.55, 24], ...GILA]
const US_ALL = [[-130, 50], [-60, 50], [-60, 20], [-130, 20]]

// Louisiana as Spain and France held it: west of the Mississippi (plus the Isle of Orleans), to the
// Adams–Onís line and the Continental Divide, north to 49°N.
const MISSISSIPPI_DOWN = [[-95.21, 47.24], ...MISSISSIPPI_UP.slice(0, -1).reverse()]
const LOUISIANA = [[-95.15, 49.0], ...MISSISSIPPI_DOWN, ...ORLEANS, ...LA_SEA, ...ADAMS_ONIS, ...DIVIDE_N.slice(0, -1)]
// Northern New Spain / Mexico: west of the Sabine, south of the Red and Arkansas rivers and of 42°N.
const NEW_SPAIN_N = [[-97, 24], [-93.85, 28.5], ...ADAMS_ONIS, [-106.3, 42.0], [-130, 42.0], [-130, 24]]
// Both together (Spain 1769–1799).
const SPAIN_N = [[-95.15, 49.0], ...MISSISSIPPI_DOWN, ...ORLEANS, ...LA_SEA, [-97, 24], [-130, 24], [-130, 42.0], ...DIVIDE_N.slice(0, -1)]
// Mexico's north once Texas has its own shape (1836–1847): west of the Texas line.
const MEXICO_N = [...TEXAS_W, ...ADAMS_ONIS.slice(17), [-106.3, 42.0], [-130, 42.0], [-130, 24]]
// West Florida west of the Perdido, north of the Isle of Orleans.
const WEST_FLORIDA = [[-91.63, 31.0], [-87.6, 31.0], [-87.42, 30.6], [-87.52, 30.28], [-87.5, 29.5], ...ORLEANS.slice().reverse()]
// Texas in its present borders (the Republic claimed more, to the Rio Grande's source).
const TEXAS = [[-93.85, 28.5], ...ADAMS_ONIS.slice(0, 17), ...TEXAS_W.slice(1).reverse(), [-106.55, 24], [-97, 24]]

// ── Colonial North America ──
// Appalachian crest (Blue Ridge / Allegheny Front) from the Chattahoochee to Lake Ontario: the usual
// line between the British seaboard colonies and the French claim west of it.
const APPALACHIANS = [[-85.0, 32.5], [-84.5, 34.0], [-83.5, 35.0], [-82.5, 35.8], [-81.6, 36.4], [-80.8, 37.1], [-80.0, 37.8], [-79.4, 38.5], [-78.8, 39.3], [-78.4, 40.5], [-77.9, 41.2], [-77.5, 42.0], [-76.6, 43.0], [-76.3, 43.9]]
// Canada's southern edge: Lake Ontario's east end, Lake Champlain (Fort St-Frédéric), the Kennebec.
const CANADA_S = [[-75.5, 43.8], [-74.5, 43.9], [-73.4, 43.7], [-72.3, 44.3], [-71.5, 45.0], [-70.3, 45.6], [-69.8, 44.8], [-69.8, 43.8], [-69.5, 43.0]]
// The Gulf of St Lawrence (Cape Breton and Acadia inside, Newfoundland outside) and the Hudson Bay watershed.
const GULF_AND_NORTH = [[-65.5, 43.0], [-59.0, 45.5], [-59.8, 47.3], [-58.2, 50.8], [-57.2, 51.55], [-62, 52], [-66, 52], [-72, 51], [-79, 49.5], [-84, 48.8], [-88, 49.3], [-91, 49.5], [-95.15, 49.4]]
// Great Lakes south edge (Lake Erie, Niagara, Lake Ontario) and 41.5°N to the Mississippi.
const LAKES_S = [[-90.6, 41.55], [-87.5, 41.6], [-83.4, 41.7], [-82.0, 42.0], [-81.0, 42.25], [-80.0, 42.5], [-79.1, 42.85], [-79.05, 43.2], [-78.0, 43.5], [-76.6, 43.6], [-76.3, 43.9]]
// New France 1663–1699: Canada and the Great Lakes (pays d'en haut) to the upper Mississippi.
const NF_CANADA = [...GULF_AND_NORTH, [-95.21, 47.24], ...MISSISSIPPI_UP.slice(15, -1).reverse(), ...LAKES_S, ...CANADA_S]
// New France 1700–1762: + Illinois Country and Louisiana, the Mississippi basin from the Appalachians
// to the Rockies, on the Gulf from the Perdido to the Sabine.
const NF_FULL = [...GULF_AND_NORTH, [-97, 50], [-97, 49.0], ...DIVIDE_N.slice(0, -1).reverse(), ...ADAMS_ONIS.slice().reverse(), [-93.85, 28.5], [-88.8, 28.0], [-87.5, 29.5], [-87.52, 30.28], [-87.6, 31.0], [-85.0, 31.0], ...APPALACHIANS, ...CANADA_S]
// Early Canada: the St Lawrence from Tadoussac to Montreal.
const NF_EARLY = [[-69.9, 48.4], [-71.3, 47.2], [-72.7, 46.7], [-73.8, 45.9], [-74.1, 45.4], [-73.4, 45.2], [-72.4, 46.0], [-71.0, 46.5], [-69.3, 47.6], [-69.0, 48.0]]
// The British seaboard colonies, Kennebec to the Altamaha, east of the Appalachians.
const BRITISH_SEABOARD = [...CANADA_S.slice().reverse(), ...APPALACHIANS.slice(1).reverse(), [-82.5, 31.9], [-81.3, 31.3], [-80, 31], [-66, 40]]
// British Canada after 1763: the same lands north of today's US border (Lake of the Woods, the lakes and
// the St Lawrence, 45°N, the Maine border) up to the Hudson Bay watershed.
const CANADA_BR = [...GULF_AND_NORTH, [-94.6, 48.8], [-93.0, 48.6], [-91.0, 48.2], [-89.6, 48.0], [-89.2, 48.1], [-88.3, 47.9], [-86.5, 47.3], [-84.6, 46.5], [-83.6, 46.0], [-82.5, 45.3], [-82.2, 43.6], [-82.42, 43.0], [-82.65, 42.45], [-83.15, 42.05], [-82.5, 41.7], [-80.5, 42.35], [-78.95, 42.85], [-79.05, 43.25], [-77.0, 43.6], [-76.4, 44.1], [-75.3, 44.8], [-74.7, 45.0], [-71.5, 45.0], [-70.25, 45.9], [-70.0, 46.7], [-69.2, 47.45], [-68.3, 47.2], [-67.8, 47.07], [-67.8, 45.9], [-67.1, 45.1], [-66.9, 44.6]]
const NF = { member: '(Kingdom of France)', wikidata: 'Q170604', under: true }

const SPAIN = { as: 'Spanish Empire', member: '(Spanish Empire)', wikidata: 'Q80702', under: true }

const usStep = (from, to, draw, extra = {}) => [
  [US, from, to, { parts: CONTIG, drop: true }], // replaces the source's (settled-area) shape in those years
  [US, from, to, { draw, within: US1890, ...extra }],
]

export default [
  // ── United States: legal extent, step by step ──
  ...usStep(1783, 1802, US_1783, { under: true }), // Treaty of Paris 1783: to the Mississippi and 31°N (under: Vermont Republic and British-held Detroit stay until 1791/1796)
  ...usStep(1803, 1809, US_1803), // Louisiana Purchase, 1803
  ...usStep(1810, 1820, US_1810), // West Florida to the Perdido annexed by proclamation Oct 1810 (Baton Rouge 1810, Mobile occupied 1813)
  ...usStep(1821, 1845, US_1821), // Florida transferred by Spain July 1821 (Adams–Onís Treaty)
  ...usStep(1846, 1847, US_1846), // Texas annexed 29 Dec 1845; Oregon Treaty June 1846 (49°N)
  ...usStep(1848, 1853, US_1848), // Mexican Cession, Treaty of Guadalupe Hidalgo, Feb 1848
  ...usStep(1854, 1855, US_ALL), // Gadsden Purchase ratified June 1854: today's contiguous borders (cut out of Mexico's rows)
  ...usStep(1856, 1860, US_ALL, { under: true }), // (under: cutting the big British rows of these years mangles their shape)
  ...usStep(1861, 1865, US_ALL, { under: true }), // the Union: everything the Confederacy does not hold
  ...usStep(1866, 1889, US_ALL, { under: true }), // after the Civil War (under: cutting the British rows here mangles their shape)

  // ── New France and the British colonies (the source has only specks for New France) ──
  ['British Colonial Empire', 1720, 1762, { draw: BRITISH_SEABOARD, member: '(British Empire)', wikidata: 'Q8680', under: true }], // the Thirteen Colonies had settled the piedmont up to the Blue Ridge by the mid-1700s
  ['New France', 1632, 1662, { draw: NF_EARLY, ...NF }], // Quebec (1608, restored 1632), Trois-Rivières (1634), Montreal (1642)
  ['New France', 1663, 1699, { draw: NF_CANADA, ...NF }], // royal province 1663; posts on the Great Lakes (Sault Ste Marie 1668, Fort Frontenac 1673)
  ['New France', 1700, 1762, { draw: NF_FULL, ...NF }], // + Louisiana (Biloxi 1699, Mobile 1702, New Orleans 1718) and the Illinois Country; ceded 1763
  ['British Colonial Empire', 1763, 1775, { draw: US_1783, within: US1890, member: '(British Empire)', wikidata: 'Q8680', under: true }], // Paris 1763: all east of the Mississippi British (the Indian Reserve west of the Proclamation Line)

  ['British Colonial Empire', 1763, 1866, { draw: CANADA_BR, member: '(British Empire)', wikidata: 'Q8680', under: true }], // Quebec (1763), then Upper and Lower Canada (1791) / Province of Canada (1841): British until Confederation

  // ── Louisiana, Florida, northern New Spain and Mexico (the source draws only settled cores) ──
  ['Spanish Empire', 1763, 1768, { draw: LOUISIANA, ...SPAIN }], // Louisiana ceded to Spain 1762 (Fontainebleau), confirmed 1763
  ['Spanish Empire', 1769, 1799, { draw: SPAIN_N, ...SPAIN }], // Louisiana + New Spain to 42°N (Alta California settled from 1769)
  ['French Louisiana', 1800, 1802, { draw: LOUISIANA, under: true }], // retroceded to France by San Ildefonso (Oct 1800), sold to the US 1803
  ['Spanish Empire', 1783, 1809, { draw: WEST_FLORIDA, ...SPAIN }], // West Florida Spanish 1783 until the US annexed it in 1810 (the source leaves gaps or gives it to the US)
  ['Spanish Empire', 1800, 1821, { draw: NEW_SPAIN_N, ...SPAIN }], // New Spain's north (the line fixed by Adams–Onís 1819) until Mexican independence 1821
  ['Republic of Texas', 1836, 1845, { drop: true }], // the source's Texas is a 374k km² core
  ['Republic of Texas', 1836, 1845, { draw: TEXAS, within: US1890, member: '', wikidata: 'Q170588' }], // independent 1836, annexed by the US Dec 1845
  ['California Republic', 1847, 1847, { drop: true }], // the Bear Flag Republic lasted June–July 1846
  ['First Mexican Empire', 1822, 1823, { draw: NEW_SPAIN_N, under: true }], // Mexico inherited New Spain's north: Alta California, Nuevo México, Texas
  ['Federated Republic of Mexico', 1824, 1835, { draw: NEW_SPAIN_N, under: true }],
  ['Centralist Mexico', 1836, 1845, { draw: MEXICO_N, under: true, wikidata: 'Q5062192' }],
  ['Federated Republic of Mexico', 1846, 1847, { draw: MEXICO_N, under: true }], // federal again 1846; California and New Mexico Mexican until Guadalupe Hidalgo, Feb 1848

  // ── South America and the Caribbean, 19th–20th century ──
  ['Paraguay', 1870, 1876, { restore: 1877 }], // Paraguay survived the War of the Triple Alliance (1864–70) as an independent state
  ['Venezuela', 1830, 1833, { restore: 1834 }], // seceded from Gran Colombia 1830 (Páez; constitution Sept 1830)
  ['Republic of Ecuador', 1830, 1833, { restore: 1834 }], // seceded May 1830
  ['Republic of New Granada', 1831, 1833, { restore: 1834 }], // Gran Colombia dissolved Nov 1831; the State of New Granada
  ['Gran Colombia', 1831, 1833, { drop: true }], // whatever is left of its shape
  // US occupations of Hispaniola left both republics sovereign (Dominican Republic 1916–24, Haiti 1915–34);
  // the source draws the island as the US. 
  ['Republic of Haiti', 1924, 1935, { drop: true }], // the 1924–35 rows are US pieces renamed (Wikidata Q30): redrawn below
  ['Republic of Haiti', 1916, 1935, { restore: 1915 }],
  ['Dominican Republic', 1916, 1923, { restore: 1915 }],
  ['United States of America', 1916, 1923, { parts: [-74.6, 17.5, -68.2, 20.2], drop: true }], // leftovers on the island

  // ── Andes before 1532 (the source has nothing there before Chimor, 911) ──
  // Drawn over each other in this order: where they overlap in time the earlier culture keeps its valleys.
  ['Wari Empire', 600, 1000, { draw: [[-78.7, -7.4], [-77.6, -7.4], [-76.8, -9.0], [-75.5, -10.5], [-74.5, -12.0], [-73.3, -12.6], [-71.5, -13.4], [-71.3, -14.0], [-72.5, -14.6], [-73.8, -14.6], [-75.6, -13.6], [-76.8, -12.5], [-77.8, -10.8], [-78.4, -9.2], [-79.0, -8.0]] }], // Wari, highland empire from Ayacucho (Huamachuco to Cusco), c. 600–1000
  ['Tiwanaku', 500, 1000, { draw: [[-70.5, -15.0], [-69.3, -15.0], [-68.4, -15.6], [-67.6, -16.4], [-67.2, -17.5], [-67.6, -18.5], [-68.6, -18.8], [-69.6, -17.8], [-70.4, -17.6], [-71.1, -16.8], [-70.8, -16.0]] }], // Tiwanaku state, Lake Titicaca basin and altiplano (with the Moquegua colonies), c. 500–1000
  ['Moche', 100, 700, { draw: [[-81.5, -4.8], [-80.2, -4.9], [-79.6, -5.8], [-79.4, -6.6], [-79.0, -7.2], [-78.6, -7.8], [-78.3, -8.5], [-77.9, -9.3], [-77.8, -10.1], [-78.4, -10.4], [-80, -8], [-82, -6]] }], // Moche culture, north coast of Peru (Piura to Huarmey), c. 100–700
  ['Nazca', 100, 650, { draw: [[-76.6, -13.4], [-75.9, -13.3], [-75.4, -13.9], [-74.9, -14.4], [-74.5, -14.9], [-74.3, -15.4], [-74.8, -15.9], [-76.5, -14.5]] }], // Nazca culture, Ica–Nazca valleys, c. 100–650
  // Inca expansion (Rowe's chronology): Pachacuti held the Titicaca basin and central Peru by the 1460s,
  // Topa Inca added Chimor and Ecuador (to c. 1471), then Bolivia, Chile to the Maule and NW Argentina.
  ['Inca Empire', 1463, 1470, { draw: [[-85, -12], [-77.5, -11.6], [-76.5, -10], [-66, -10], [-66, -17.3], [-75, -17.3]], within: ['Inca Empire', 1497] }], // Cusco to Lake Titicaca and the central highlands (Chimor still independent)
  ['Inca Empire', 1471, 1481, { draw: [[-85, 3], [-66, 3], [-66, -17.3], [-75, -17.3]], within: ['Inca Empire', 1497] }], // + Chimor (conquered c. 1470) and Quito
  ['Chimu Empire', 1471, 1481, { restore: 1471, as: 'Inca Empire', wikidata: 'Q28573' }], // what is left of Chimor's shape
  ['Inca Empire', 1482, 1496, { restore: 1497 }], // Topa Inca's southern conquests: Charcas, Chile to the Maule, NW Argentina (by 1493)
  ['Inca Empire', 1500, 1532, { draw: [[-79.2, -0.3], [-77.0, -0.3], [-76.8, 1.4], [-78.0, 1.6], [-79.3, 0.8]], wikidata: 'Q28573' }], // Huayna Capac's northern conquests (Otavalo, Carchi, to the Ancasmayo)
  ['Inca Empire', 1534, 1539, { restore: 1534, as: 'Spanish Empire', member: '(Spanish Empire)', wikidata: 'Q80702' }], // Pizarro held Cusco from Nov 1533 (Neo-Inca state only in Vilcabamba)
]
