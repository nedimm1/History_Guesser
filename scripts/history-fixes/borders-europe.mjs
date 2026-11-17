// Europe, the Mediterranean and the Middle East: shape fixes (draft, applied after all existing fixes).

// Constantinople's peninsula and the Marmara shore of Thrace (c. 41.0–41.08°N) lie outside every
// Cliopatria polygon in every year; fill that strip (only land nobody holds) for whoever held the city.
const CITY = [[27.3, 41.17], [29.05, 41.17], [29.03, 41.06], [29.0, 41.02], [28.99, 40.97], [28.9, 40.88], [27.3, 40.88]]

export default [
  // --- Anglo-Saxon England ---
  ['Kingdom of Kent', 692, 704, { restore: 691 }], // Wihtred ruled an independent Kent 690–725; the source fuses it into Wessex
  ['Kingdom of Sussex', 692, 717, { restore: 691 }], // South Saxon kings (Nothhelm, c. 692–725) under West Saxon overlordship, not annexed
  ['Kingdom of Wessex', 741, 754, { restore: 740 }], // Wessex kept its own kings under Æthelbald's overlordship (Cuthred won at Burford 752)
  ['Kingdom of Wessex', 788, 805, { restore: 787 }], // Beorhtric (786–802) and Egbert (802–) ruled Wessex; Offa never annexed it
  ['Kingdom of Essex', 666, 824, { restore: 665 }], // the East Saxon kingdom lasted (under Mercian overlordship) until it submitted to Egbert in 825
  // --- Scotland ---
  ['Pictland', 540, 749, { restore: 750, under: true }], // the Pictish kingdoms north of the Forth (Bridei I from c. 550), outside Dál Riata
  // --- Wales ---
  ['Kingdom of Seisyllwg', 922, 959, { rename: 'Kingdom of Deheubarth' }], // Hywel Dda joined Seisyllwg and Dyfed into Deheubarth c. 920
  ['Kingdom of Gwynedd', 922, 941, { restore: 921 }], // Gwynedd was Idwal Foel's until his death in 942 (Hywel then took it)
  ['Kingdom of Gwynedd', 950, 959, { restore: 960 }], // Idwal's sons regained Gwynedd after Hywel's death in 950
  ['Brythons', 1056, 1063, { parts: [-5.5, 51.4, -3.4, 52.7], drop: true }], // Gruffydd ap Llywelyn ruled all Wales 1055–63 (drawn as his Gwynedd)
  ['Brythons', 960, 1093, { parts: [-5.5, 51.4, -3.4, 52.7], rename: 'Kingdom of Deheubarth' }], // SW Wales was Deheubarth until the Normans killed Rhys ap Tewdwr in 1093
  ['Brythons', 1136, 1197, { parts: [-5.5, 51.4, -3.4, 52.7], rename: 'Kingdom of Deheubarth' }], // restored by Gruffydd ap Rhys and the Lord Rhys (d. 1197)
  // --- Navarre ---
  ['Kingdom of Navarre', 1134, 1138, { restore: 1139 }], // García Ramírez restored Navarre's independence in 1134
  ['Kingdom of Navarre', 1329, 1332, { restore: 1333 }], // Joan II became queen in 1328, ending the union with France
  ['Kingdom of Navarre', 1429, 1511, { restore: 1428 }], // Navarre was its own kingdom (Juan II, then the Foix-Albret) until Ferdinand annexed it in 1512
  // --- Byzantium and Constantinople ---
  ['Umayyad Caliphate', 718, 723, { parts: [24, 40, 30, 42.5], rename: 'Byzantine Empire' }], // the 717–718 siege failed; the Arabs never held Thrace
  ['Latin Empire', 1261, 1278, { rename: 'Byzantine Empire' }], // Michael VIII retook Constantinople in July 1261
  ['Nicaean Empire', 1261, 1278, { rename: 'Byzantine Empire' }], // the Nicaean state became the restored Byzantine Empire in 1261
  ['Byzantine Empire', 1387, 1401, { parts: [22.3, 40.0, 24.2, 41.0], rename: 'Ottoman Empire' }], // Thessaloniki was Ottoman 1387–1403
  ['Byzantine Empire', 1402, 1406, { restore: 1407 }], // the Morea, Thessaloniki (regained 1403) and the islands stayed Byzantine after Ankara (1402)
  ['Byzantine Empire', 1423, 1429, { parts: [22.3, 40.0, 24.2, 41.0], rename: 'Republic of Venice' }], // Thessaloniki was Venetian 1423–1430
  ['Byzantine Empire', 1430, 1430, { parts: [22.3, 40.0, 24.2, 41.0], rename: 'Ottoman Empire' }], // Murad II took Thessaloniki in March 1430
  // Constantinople and its Thracian hinterland stayed Byzantine until 29 May 1453.
  ['Byzantine Empire', 1395, 1453, { draw: [[28.1, 40.85], [28.1, 41.1], [28.3, 41.6], [29.15, 41.4], [29.08, 41.2], [29.05, 41.1], [29.02, 41.05], [29.0, 41.02], [28.98, 40.95], [28.9, 40.85]] }],
  ['Roman Empire', 1, 394, { draw: CITY, under: true }],
  ['Eastern Roman Empire', 395, 632, { draw: CITY, under: true }],
  ['Byzantine Empire', 633, 1203, { draw: CITY, under: true }],
  ['Latin Empire', 1204, 1260, { draw: CITY, under: true }],
  ['Byzantine Empire', 1261, 1394, { draw: CITY, under: true }],
  ['Ottoman Empire', 1454, 1923, { draw: CITY, under: true, wikidata: 'Q12560' }],
  ['Republic of Turkey', 1924, 1999, { draw: CITY, under: true, wikidata: 'Q43' }],
  // --- Balkans and Aegean ---
  ['Serbian Empire', 1346, 1351, { restore: 1352 }], // Dušan held Macedonia and Albania by 1346 and Epirus and Thessaly by 1348
  ['Catalan Company', 1314, 1362, { rename: 'Duchy of Athens' }], // the Catalan Company ruled the Duchy of Athens 1311–1388
  ['Crown of Aragon', 1363, 1388, { parts: [22.3, 37.8, 23.6, 38.75], rename: 'Duchy of Athens', member: '' }], // Catalan duchy, under the Aragonese crown from 1379
  ['Crown of Aragon', 1389, 1394, { parts: [22.3, 37.8, 23.6, 38.75], rename: 'Duchy of Athens', member: '' }], // Nerio Acciaioli took Athens in 1388
  ['Republic of Venice', 1403, 1406, { parts: [22.3, 37.8, 23.6, 38.75], rename: 'Duchy of Athens' }], // Antonio Acciaioli took Athens from Venice in 1402–03
  ['Crown of Aragon', 1407, 1458, { parts: [22.3, 37.8, 23.6, 38.75], rename: 'Duchy of Athens', member: '' }], // the Acciaioli dukes until the Ottomans took the Acropolis in 1458
  ['Republic of Florence', 1388, 1460, { parts: [21, 37, 25, 40], rename: 'Duchy of Athens', member: '' }], // Acciaioli lands in Boeotia, part of their duchy, not of Florence
  // Knights Hospitaller: Rhodes, Kos, Leros, Kalymnos, Nisyros, Tilos, Symi, Chalki (1310–1522).
  ['Knights Hospitaller', 1310, 1522, { draw: [[27.5, 35.75], [28.4, 35.75], [28.4, 36.45], [28.0, 36.55], [27.95, 36.66], [27.45, 36.66], [27.42, 36.75], [27.45, 36.95], [27.15, 36.97], [27.1, 37.05], [27.05, 37.25], [26.6, 37.3], [26.6, 36.6], [27.0, 36.35]] }],
  ['Ottoman Empire', 1523, 1525, { draw: [[27.5, 35.75], [28.4, 35.75], [28.4, 36.45], [28.0, 36.55], [27.95, 36.66], [27.45, 36.66], [27.42, 36.75], [27.45, 36.95], [27.15, 36.97], [27.1, 37.05], [27.05, 37.25], [26.6, 37.3], [26.6, 36.6], [27.0, 36.35]], under: true, wikidata: 'Q12560' }], // Rhodes surrendered to Suleiman on 1 January 1523
  // Skanderbeg's League of Lezhë held north-central Albania (Krujë, Dibër) against the Ottomans 1444–1468.
  ['League of Lezhë', 1444, 1468, { draw: [[19.55, 41.55], [19.65, 41.85], [19.95, 42.05], [20.35, 42.0], [20.6, 41.75], [20.55, 41.35], [20.25, 41.05], [19.95, 41.05], [19.6, 41.3]] }],
  // --- Italy ---
  ['Western Roman Empire', 476, 492, { restore: 475, as: 'Kingdom of Odoacer', under: true }], // Odoacer ruled Italy as king 476–493
  ['Ostrogothic Kingdom', 493, 499, { restore: 500 }], // Theoderic killed Odoacer in March 493 and ruled Italy
  ['Kingdom of Sicily', 1735, 1805, { restore: 1806 }], // Bourbon Sicily, a separate kingdom in personal union with Naples
  ['Kingdom of Sardinia', 1799, 1799, { parts: [5.5, 43.5, 10.5, 46.6], drop: true }], // Piedmont under French occupation (drawn as the Directory)
  ['Kingdom of Sardinia', 1803, 1813, { parts: [5.5, 43.5, 10.5, 46.6], drop: true }], // France annexed Piedmont in 1802; the king kept only the island
  // --- British Isles, early modern ---
  ['Kingdom of Scotland', 1609, 1652, { restore: 1608 }], // the 1603 Union of the Crowns left Scotland a separate kingdom (Covenanter Scotland 1638–51)
  ['Kingdom of Scotland', 1661, 1706, { restore: 1608 }], // restored in 1660 after the Cromwellian union, separate until the 1707 Acts of Union
  ['Parliamentarian England', 1648, 1648, { restore: 1647, under: true }], // Cumbria is left blank once Scotland is cut out of England's shape
  ['Commonwealth of England', 1649, 1652, { restore: 1653, under: true }], // same gap; England was a Commonwealth from 1649
  // --- Germany ---
  ['Kingdom of Hanover', 1814, 1819, { restore: 1820, wikidata: 'Q164079' }], // Hanover became a kingdom in October 1814
  // --- Late 20th century ---
  ['Chechen Republic', 1996, 1999, { restore: 1995, as: 'Chechen Republic of Ichkeria' }], // de facto independent after the Khasavyurt Accord (Aug 1996)
  ['State of Israel', 1973, 1975, { restore: 1976 }], // Israel held most of Sinai until the 1979–82 phased withdrawal
  // Western two-thirds of Sinai returned to Egypt by January 1980 (line El Arish–Ras Muhammad); the rest in April 1982.
  ['Arab Republic of Egypt', 1980, 1981, { draw: [[32.2, 31.6], [33.8, 31.6], [33.8, 31.1], [34.25, 27.6], [33.6, 27.5], [32.5, 29.9], [32.3, 30.5]], within: ['State of Israel', 1979], wikidata: 'Q79' }],
  ['Arab Republic of Egypt', 1982, 1982, { restore: 1983 }],
]
