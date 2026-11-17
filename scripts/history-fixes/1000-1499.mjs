// Historical fixes for Cliopatria rows in 1000–1499. Format: [name, from, to, action] (see scripts/history-fixes.mjs).
const DERBENT = [47, 40.5, 50, 42.5]
export default [
  // --- Iraq / Jazira / Caucasus: "Hamdanid Emirates" ran to 1259 (Aleppo Hamdanids ended 1004); its pieces belong to others
  ['Hamdanid Emirates', 1000, 1239, { parts: DERBENT, rename: 'Emirate of Derbent' }], // Hashimid emirs of Derbent until the Mongols, 1239
  ['Hamdanid Emirates', 1240, 1249, { parts: DERBENT, drop: true }], // Derbent taken by the Mongols in 1239
  ['Hamdanid Emirates', 1000, 1027, { parts: [44, 41, 45.5, 42.5], rename: 'Emirate of Tbilisi' }], // the Tbilisi piece: Arab emirate of Tbilisi (to 1122)
  ['Hamdanid Emirates', 1046, 1125, { parts: [45, 38.5, 47.5, 40.5], rename: 'Kingdom of Syunik' }], // the Kapan/Syunik piece: Armenian kingdom of Syunik (987–1170)
  ['Hamdanid Emirates', 1028, 1055, { parts: [38, 25, 41, 28], drop: true }], // a speck in the Hejaz, no Hamdanids there
  ['Hamdanid Emirates', 1000, 1101, { parts: [36, 30, 45, 38.5], rename: 'Uqaylid Emirate' }], // Mosul/Jazira: Uqaylids 990–1096, held Qal'at Ja'bar to 1102
  ['Hamdanid Emirates', 1102, 1125, { parts: [36, 30, 45, 38.5], drop: true }], // under the Seljuks, already drawn (Great Seljuk Empire)
  ['Hamdanid Emirates', 1192, 1201, { rename: 'Saltukids' }], // Erzurum piece: Saltukid beylik until 1202
  ['Hamdanid Emirates', 1202, 1209, { rename: 'Ahlatshahs' }], // Ahlat/Van piece: Shah-Armens until 1207
  ['Hamdanid Emirates', 1210, 1249, { parts: [60, 24, 72, 34], drop: true }], // ~900k in Afghanistan/Baluchistan, no Hamdanids there (Khwarazm/Mongol lands)
  ['Hamdanid Emirates', 1210, 1226, { parts: [39, 39.8, 41, 41.5], rename: 'Mengujekids' }], // Erzincan piece: Mengujekid beylik (to 1228)
  ['Hamdanid Emirates', 1210, 1235, { parts: [40, 37, 46, 40], rename: 'Ayyubid Sultanate' }], // Ahlat/Mayyafariqin: Ayyubids took Ahlat 1207
  ['Hamdanid Emirates', 1236, 1249, { parts: [40, 37, 46, 40], rename: 'Sultanate of Rum' }], // Rum took Ahlat/Erzurum 1230–33
  ['Hamdanid Emirates', 1236, 1259, { rename: 'Uyunid Emirate' }], // remaining Qatar/Bahrain pieces: Uyunids ruled eastern Arabia to c.1253

  // --- Anachronistic / wrong names
  ['Hashemite Arab Federation', 1415, 1432, { rename: 'Jalayirid Sultanate' }], // southern Iraq: Jalayirid remnant (Basra/Wasit) 1411–1432; the 1958 federation is anachronistic
  ['Hashemite Arab Federation', 1433, 1439, { rename: 'Qara Qoyunlu' }], // Qara Qoyunlu took the rest of Iraq after 1432
  ['Nabhani Dynasty', 1169, 1176, { rename: 'Mahdid Dynasty' }], // this piece is Yemen (15,45): Mahdids of Zabid 1159–1174
  ['Mahdids', 1169, 1499, { rename: 'Nabhani Dynasty' }], // this piece is Oman (23,58): Nabhani dynasty 1154–1624
  ['Sind-Habbari Dynasty', 1026, 1201, { rename: 'Soomra Dynasty' }], // Habbarids ended with Mahmud of Ghazni c.1025; Soomras ruled Sind after
  ['Halych-Volhynia occupation', 1056, 1240, { rename: 'Cumania' }], // Pontic steppe = Cuman lands; Halych-Volhynia formed only in 1199
  ['East Turkestan', 1463, 1474, { rename: 'Moghulistan' }], // a 20th-century name; the Turfan region was ruled by the Moghul khans
  ['Kapisa', 1475, 1499, { rename: 'Timurid Empire' }], // Kabul was a Timurid principality (Ulugh Beg Mirza, 1461–1502); Kapisa is a 7th-century name
  ['Caliphate of Córdoba', 1034, 1071, { rename: 'Taifa of Córdoba', member: '(Taifas of Iberia)' }], // caliphate abolished 1031; Jahwarid taifa to 1070
  ['Great Seljuk Empire', 1194, 1201, { rename: 'Khwarezmid Dynasty' }], // Toghrul III killed by Tekish 1194; Khwarazm took Ray, Hamadan, Isfahan
  ['Almohad Caliphate', 1270, 1343, { rename: 'Marinid Sultanate' }], // Almohads ended with the fall of Marrakesh, 1269
  ['Germiyanids', 1344, 1414, { parts: [38, 35, 44, 39], rename: 'Artuqids' }], // Mardin/Hasankeyf/Urfa pieces: Artuqids of Mardin to 1409, not Germiyan (Kütahya)
  ['Germiyanids', 1344, 1406, { parts: DERBENT, drop: true }], // speck at Derbent (Shirvanshah lands)
  ['House of Jagiellon', 1450, 1499, { rename: 'Poland-Lithuania', member: '(Polish-Lithuania Kingdom)' }], // Poland vanished from the map after 1449; Jagiellonian union of Poland and Lithuania

  // --- Serbia
  ['Kingdom of Serbia', 1346, 1351, { rename: 'Serbian Empire' }], // Dušan crowned emperor 1346
  ['Serbian Empire', 1375, 1401, { rename: 'Moravian Serbia' }], // the empire broke up in 1371; Prince Lazar's Moravian Serbia
  ['Serbian Empire', 1402, 1458, { rename: 'Serbian Despotate' }], // Stefan Lazarević became despot in 1402; fell 1459
  ['Serbian Despots', 1375, 1421, { rename: 'District of Branković' }], // the Kosovo piece (42.6,20.0) = Branković lands, merged into the despotate 1427

  // --- Byzantium: Constantinople fell 1453
  ['Byzantine Empire', 1454, 1460, { parts: [21, 36, 24, 38.5], rename: 'Despotate of the Morea' }], // the Morea held out to 1460
  ['Byzantine Empire', 1454, 1474, { drop: true }], // Constantinople piece and Aegean islands were Ottoman/Gattilusi after 1453

  // --- Iberia
  ['Taifa of Toledo', 1085, 1093, { rename: 'Kingdom of Castile', member: '' }], // Alfonso VI took Toledo in 1085
  ['Taifa of Dénia', 1092, 1115, { parts: [1, 38.5, 5, 40.5], rename: 'Taifa of Majorca' }], // Balearic pieces: independent Taifa of Majorca to 1115
  ['Taifa of Dénia', 1116, 1125, { parts: [1, 38.5, 5, 40.5], rename: 'Almoravid Dynasty', member: '' }], // Almoravids took Majorca in 1116
  ['Taifa of Dénia', 1092, 1125, { rename: 'Almoravid Dynasty', member: '' }], // mainland Dénia/Murcia annexed by the Almoravids by 1092
  ['County of Urgell', 1414, 1499, { rename: 'Principality of Andorra' }], // Urgell went to the Crown of Aragon in 1413; the tiny piece left is Andorra (a co-principality since 1278)
  ['County of Auvergne', 1440, 1499, { drop: true }], // the piece is the Pale of Calais (50.7,1.6), already drawn as Kingdom of England

  // --- Southeast Asia
  ['Sultanate of Palembang', 1459, 1474, { drop: true }], // overlaps Majapahit; the sultanate was founded only in 1659
  ['Sultanate of Palembang', 1475, 1499, { rename: 'Palembang' }], // a port polity, Majapahit vassal; not a sultanate until 1659
  ['Khmer Empire', 1432, 1499, { rename: 'Kingdom of Cambodia' }], // Angkor was abandoned after the Siamese sack of 1431; post-Angkor Cambodia

  // --- Spelling / title
  ['Livonian Conference', 1422, 1563, { rename: 'Livonian Confederation' }], // correct name (whole row run, incl. 1500–1563)
  ['Principality of Polotsky', 1056, 1249, { rename: 'Principality of Polotsk' }], // wrong word form
  ['County of Brabant', 1260, 1430, { rename: 'Duchy of Brabant' }], // a duchy since 1183
  ['County of Savoy', 1416, 1539, { rename: 'Duchy of Savoy' }], // made a duchy in 1416 (whole run, incl. 1500–1539)

  // --- Membership
  ["Kievan Rus'", 1056, 1235, { drop: true }], // 1194k polygon drawn on top of its own principalities (duplicate)
  ['Kingdom of Arles', 1034, 1384, { member: '(Holy Roman Empire)' }], // Burgundy/Arles passed to the Empire in 1032
  ['Dauphiné', 1260, 1349, { member: '(Holy Roman Empire)' }], // imperial fief until sold to France in 1349
  ['Electorate of Brandenburg', 1459, 1499, { member: '(Holy Roman Empire)' }], // HRE label lost after 1458 without cause
  ['Duchy of Bavaria', 1459, 1499, { member: '(Holy Roman Empire)' }],
  ['Duchy of Milan', 1463, 1499, { member: '(Holy Roman Empire)' }],
  ['Electorate of Saxony', 1487, 1499, { member: '(Holy Roman Empire)' }],
  ['Duchy of Lorraine', 1459, 1499, { member: '(Holy Roman Empire)' }],
  ['Electorate of Trier', 1459, 1499, { member: '(Holy Roman Empire)' }],
  ['Republic of Florence', 1487, 1499, { member: '(Holy Roman Empire)' }],
  ['Principality of Orange', 1459, 1499, { member: '(Holy Roman Empire)' }],
  ['Swiss Confederation', 1459, 1499, { member: '(Holy Roman Empire)' }], // de facto out only after the Swabian War, 1499
  ['Duchy of Savoy', 1459, 1499, { member: '(Holy Roman Empire)' }],
  ['House of Ascania', 1459, 1486, { member: '(Holy Roman Empire)' }],
  ['Duchy of Styria', 1272, 1499, { member: '(Holy Roman Empire)' }],
  ['House of Luxembourg', 1395, 1414, { member: '(Holy Roman Empire)' }],
  ['Kingdom of Bohemia', 1459, 1499, { member: '(Holy Roman Empire);(Kingdom of Bohemia)' }], // electorate of the Empire
]
