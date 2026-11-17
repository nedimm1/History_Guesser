// Asia / Africa / Oceania border fixes (draft). Applied after scripts/history-fixes/*.

// --- Mongol Empire 1260–1293: the source draws one piece; after Möngke's death (1259) it split into
// the Golden Horde, the Chagatai Khanate (Kaidu's domain), the Ilkhanate and Kublai's realm (Yuan from 1271).
const GH_IL = [[30, 43], [37, 44.3], [40, 43.4], [45, 42.6], [47.5, 41.8], [50, 42], [53, 41.3], [56, 40.7], [59.5, 40.6], [62.5, 40.8]] // Caucasus crest, Caspian, south of Khwarezm
const GH_CH = [[62.5, 40.8], [66, 43.5], [68.5, 44.2], [72, 45], [75, 46.3], [79, 46.6], [82, 47.2], [85, 48.5]] // lower Syr Darya, Balkhash, Tarbagatai
const CH_IL = [[62.5, 40.8], [63.6, 39.2], [65.2, 37.9], [67.3, 37.2], [69, 37.1], [71, 36.8], [74, 36.5]] // the Amu Darya
const GOLDEN_HORDE = [...GH_IL, ...GH_CH, [87, 50], [88, 55], [86, 62], [60, 68], [20, 62], [20, 43.5], [28, 42]]
const ILKHANATE = [...[...GH_IL].reverse().slice(0, -1), [25, 42], [25, 35], [35, 35.5], [37.5, 35.3], [40, 34], [44, 31], [47, 28], [56, 22], [64, 23], [67, 25], [68, 30], [69.5, 33], [71, 36.8], ...[...CH_IL].reverse().slice(1)]
const CHAGATAI = [...CH_IL, [77, 35], [80, 35], [85, 36], [88, 40], [88, 43], [87, 45], [85, 48.5], ...[...GH_CH].reverse().slice(1, -1)]
const KHANATES = [
  ['Golden Horde', GOLDEN_HORDE, 'Q79965'],
  ['Chagatai Khanate', CHAGATAI, 'Q487829'],
  ['Ilkhanate', ILKHANATE, 'Q178084'],
]
const MONGOL_ROWS = [[1260, 1271], [1272, 1278], [1279, 1284], [1285, 1293]] // the source's Mongol Empire rows
const mongols = MONGOL_ROWS.flatMap(([a, b]) => KHANATES.map(([as, draw, wikidata]) => ['Mongol Empire', a, b, { draw, as, wikidata, member: '', within: ['Mongol Empire', a] }]))

// --- Japan outlines ---
const YAMATO = [[128.6, 33.6], [129.5, 31.0], [131.0, 30.9], [132.0, 32.5], [132.6, 32.6], [134.5, 33.1], [136.5, 33.4], [138.5, 34.4], [140.0, 34.7], [141.0, 35.6], [140.8, 36.9], [139.9, 37.2], [139.6, 37.9], [138.7, 38.3], [137.5, 37.7], [136.2, 36.6], [133.5, 35.8], [131.5, 35.0], [130.2, 34.3]] // Kyushu, Shikoku, Honshu to Kanto / Niigata
const SHIKOKU = [[132.05, 33.0], [132.05, 33.5], [132.7, 34.05], [133.4, 34.37], [134.0, 34.42], [134.75, 34.25], [134.9, 33.8], [134.3, 33.1], [133.0, 32.5], [132.3, 32.6]]
const OSHIMA = [[139.0, 41.3], [140.6, 41.38], [141.0, 41.65], [141.3, 41.9], [140.7, 42.2], [140.3, 42.4], [139.6, 42.4]] // Hakodate, Matsumae, Esashi

// --- Nepal outlines ---
const GORKHA = [[84.4, 27.85], [84.45, 28.4], [84.75, 28.55], [85.0, 28.3], [84.95, 27.9], [84.7, 27.75]] // Gorkha district
const GORKHA_NUWAKOT = [[84.4, 27.85], [84.45, 28.4], [84.75, 28.6], [85.15, 28.4], [85.45, 28.1], [85.4, 27.85], [85.2, 27.8], [84.9, 27.7]]
const GORKHA_MAKWANPUR = [[84.4, 27.85], [84.45, 28.4], [84.75, 28.6], [85.15, 28.4], [85.45, 28.1], [85.4, 27.85], [85.2, 27.8], [85.2, 27.55], [85.45, 27.45], [85.4, 27.1], [84.8, 27.15], [84.6, 27.5]]
const GORKHA_VALLEY = [[84.4, 27.85], [84.45, 28.4], [84.75, 28.6], [85.15, 28.4], [85.45, 28.1], [85.7, 27.85], [85.65, 27.5], [85.4, 27.1], [84.8, 27.15], [84.6, 27.5]]

// --- Malacca outlines ---
const MALACCA_EARLY = [[101.3, 2.85], [101.9, 3.15], [102.5, 3.05], [103.0, 2.6], [103.1, 2.0], [102.6, 1.6], [101.9, 1.9], [101.0, 2.3]] // Malacca, Muar, the Negeri Sembilan coast
const MALACCA_EMPIRE = [[100.3, 5.1], [101.0, 5.4], [101.8, 5.4], [102.0, 4.8], [102.4, 5.0], [102.5, 5.8], [103.4, 6.2], [104.6, 5.5], [104.8, 2.5], [105.0, 0.5], [104.7, -0.7], [103.8, -1.1], [103.0, -0.9], [102.0, -0.2], [101.2, 0.6], [100.6, 1.3], [100.4, 1.9], [100.9, 2.6], [100.8, 4.0]] // Perak, Pahang, Terengganu, Johor, Riau, and Rokan–Siak–Kampar–Indragiri in Sumatra

// --- Africa outlines ---
const LUNDA = [[19.5, -6.8], [21.0, -5.8], [22.8, -5.8], [24.3, -6.5], [25.0, -8.0], [25.5, -10.0], [24.8, -11.3], [23.0, -11.8], [21.5, -11.2], [20.0, -10.0], [19.3, -8.5]] // between the Kwango-Kasai and the Lualaba headwaters, Musumba at ~-8.5,22.5
const XINJIANG = [[70, 34], [78, 35.3], [80, 35.6], [84, 36], [87, 36], [90, 36], [91, 37], [93.5, 38.5], [94.9, 39.4], [95.4, 40.6], [96.4, 42.7], [91, 45.2], [90.5, 47], [87.8, 49.2], [85, 52], [70, 52]] // drawn generously towards the USSR (kept within the ROC's own 1939 shape)
const NDEBELE = [[26.0, -17.8], [28.5, -17.6], [30.0, -18.3], [30.5, -19.8], [30.0, -21.2], [29.0, -22.2], [27.5, -21.6], [26.5, -20.5], [25.8, -19.0]] // Matabeleland around Bulawayo
// Manchukuo: Great Wall / Jehol in the south-west, the Yalu–Tumen border with Korea, Kwantung (Dalian) left to Japan; generous towards the USSR and Mongolia (kept within Japan's shape)
const MANCHUKUO = [[119.8, 39.95], [118.5, 40.2], [117.3, 40.5], [116.4, 40.9], [116.0, 41.8], [115.4, 42.8], [115.8, 44.5], [115.0, 46.5], [114, 49], [118, 54], [130, 52], [136, 49], [135, 43], [130.6, 42.35], [130.3, 42.7], [129.8, 42.98], [129.2, 42.25], [128.1, 42.0], [128.15, 41.4], [127.0, 41.8], [126.3, 41.15], [125.3, 40.6], [124.4, 40.1], [124.2, 39.8], [123.0, 39.3], [122.4, 39.5], [122.0, 39.45], [121.6, 39.55], [121.0, 39.6], [120.0, 39.6]]

export default [
  ...mongols,
  ['Mongol Empire', 1260, 1293, { parts: [24, 22, 70, 43], rename: 'Ilkhanate' }], // small islands and coast bits left over west of the Ilkhanate's drawn line
  ['Mongol Empire', 1260, 1293, { parts: [20, 43, 62, 70], rename: 'Golden Horde' }], // coast slivers left around the Black Sea, Caspian and Baltic
  ['Mongol Empire', 1271, 1293, { rename: 'Yuan Dynasty' }], // what is left is Kublai's realm; Great Yuan proclaimed 1271 (Kublai stayed nominal Great Khan 1260–1270, so the name stays)

  // --- Japan ---
  // Kofun-period Yamato kingship (keyhole tombs from Kyushu to Kanto) from c. 300; the source starts Japan at 540.
  ['Yamato', 300, 539, { draw: YAMATO, under: true }],
  // The source leaves Shikoku empty until the Kamakura period; it was part of the Japanese state throughout.
  ['Asuka Japan', 540, 709, { draw: SHIKOKU, under: true, wikidata: 'Q210688' }],
  ['Nara Japan', 710, 792, { draw: SHIKOKU, under: true, wikidata: 'Q189178' }],
  ['Heian Japan', 793, 1187, { draw: SHIKOKU, under: true, wikidata: 'Q193292' }],
  // Ryukyu stayed a kingdom (Satsuma vassal from 1609, also tributary to China) until annexed in 1879.
  ['Ryukyu Kingdom', 1600, 1878, { restore: 1599 }],
  ['Ryukyu Kingdom', 1611, 1867, { parts: [128.5, 27, 130.5, 29], rename: 'Tokugawa Shogunate' }], // Amami islands ceded to Satsuma 1611
  ['Ryukyu Kingdom', 1868, 1878, { parts: [128.5, 27, 130.5, 29], rename: 'Empire of Japan' }],
  // Empire of Japan 1868–69 is only scraps (57k) and Hokkaido is empty: the Meiji state held Japan from 1868 (Boshin War over by mid-1869).
  ['Empire of Japan', 1868, 1869, { restore: 1870 }],
  // Republic of Ezo: Tokugawa loyalists held the Oshima peninsula (Hakodate, Matsumae) Jan–June 1869.
  ['Republic of Ezo', 1869, 1869, { draw: OSHIMA }],

  // --- China: Three Kingdoms ---
  // 'Han Dynasty' 215–223 is Liu Bei's Yi province (Sichuan) plus Sun Quan's south; split along the Shu Han border of 224.
  ['Shu Han', 215, 220, { restore: 224, as: 'Liu Bei' }], // Liu Bei held Yi province from 214; Hanzhong from 219
  ['Shu Han', 221, 223, { restore: 224 }], // Liu Bei proclaimed emperor of Shu Han in 221
  ['Han Dynasty', 215, 223, { rename: 'Eastern Wu' }], // the rest (Jiao province, the Xiang valley) was Sun Quan's

  // --- Sri Lanka ---
  ['Ceylon', 1412, 1506, { rename: 'Kingdom of Kotte' }], // Parakramabahu VI of Kotte (1412–67) ruled the island outside Jaffna
  // Cliopatria's 'Portuguese/Dutch/British Ceylon' is the inland highland kingdom, i.e. Kandy, which stayed independent until 1815;
  // the colonial powers held the coasts (drawn as their empires' shapes). Portugal held only Colombo fort until Kotte passed to it in 1597.
  ['Portuguese Ceylon', 1507, 1658, { rename: 'Kingdom of Kandy', member: '' }],
  ['Dutch Ceylon', 1670, 1795, { rename: 'Kingdom of Kandy', member: '' }],
  ['British Ceylon', 1796, 1814, { rename: 'Kingdom of Kandy', member: '' }], // Kandy fell to the British in 1815
  ['Portuguese Empire', 1507, 1594, { parts: [79.5, 5.8, 80.6, 7.6], rename: 'Kingdom of Kotte', member: '' }], // the west-coast lowlands were the Kingdom of Kotte (Portuguese protectorate)
  ['Portuguese Colonies', 1507, 1594, { parts: [79.5, 5.8, 80.6, 7.6], rename: 'Kingdom of Kotte', member: '' }],
  ['Spanish Empire', 1507, 1594, { parts: [79.5, 5.8, 80.6, 7.6], rename: 'Kingdom of Kotte', member: '' }],
  ['Portuguese Colonies', 1659, 1661, { parts: [79.4, 5.8, 82, 10], drop: true }], // the Dutch expelled the Portuguese from Ceylon by 1658
  ['Jaffna kingdom', 1595, 1618, { restore: 1594 }], // Jaffna fell to Portugal only in 1619
  ['Kingdom of Kandy', 1659, 1669, { restore: 1670 }], // Dutch Ceylon's 1659–69 shape covers the whole island; the Dutch held only the coasts
  ['Kingdom of Kandy', 1670, 1768, { restore: 1700 }], // cut out of the overlapping Dutch coastal shape
  ['Kingdom of Kandy', 1769, 1814, { restore: 1780 }], // cut out of the overlapping Dutch / British coastal shape

  // --- Nepal ---
  // Gorkha was a small hill kingdom (founded 1559) until Prithvi Narayan Shah (1743–75) conquered Nuwakot (1744),
  // Makwanpur (1762) and the Kathmandu valley (1768); the rest of Nepal was the Chaubisi/Baise petty kingdoms and Sen states.
  ['Gorkha Kingdom', 1588, 1768, { drop: true }],
  ['Gorkha Kingdom', 1588, 1743, { draw: GORKHA }],
  ['Gorkha Kingdom', 1744, 1761, { draw: GORKHA_NUWAKOT }],
  ['Gorkha Kingdom', 1762, 1767, { draw: GORKHA_MAKWANPUR }],
  ['Gorkha Kingdom', 1768, 1768, { draw: GORKHA_VALLEY }],
  ['Kathmandu', 1757, 1761, { extend: 1767 }], // the Malla valley kingdoms lasted until 1768

  // --- Malacca ---
  // Founded c. 1400 by Parameswara under Ming protection; by the 1460s–70s it ruled the southern peninsula and the east Sumatran coast.
  // Majapahit had no hold on the peninsula then.
  ['Sultanate of Malacca', 1400, 1458, { draw: MALACCA_EARLY, member: '', wikidata: 'Q46652' }],
  ['Sultanate of Malacca', 1459, 1511, { draw: MALACCA_EMPIRE, member: '', wikidata: 'Q46652' }],
  ['Majapahit', 1402, 1474, { parts: [100, 1.6, 105, 7.5], drop: true }], // its leftover Malay-peninsula piece

  // --- Central Africa ---
  ['Kingdom of Lunda', 1665, 1887, { draw: LUNDA, under: true, member: '', wikidata: 'Q1796223' }], // Lunda Empire of the Mwata Yamvo, c. 1665 until the Chokwe invasion of 1887
  ['Congo Free State', 1885, 1889, { restore: 1890 }], // Leopold II's state recognised at Berlin, 1885; the source draws only the lower Congo until 1890
  ['Mahdist State', 1885, 1889, { restore: 1890 }], // Khartoum fell to the Mahdi in January 1885

  // --- South Asia ---
  ['Talpur Dynasty', 1840, 1841, { restore: 1842 }], // the Talpur Amirs ruled Sindh until the British conquest of 1843

  // --- Xinjiang ---
  ['Republic of China', 1940, 1942, { draw: XINJIANG, within: ['Republic of China', 1939] }], // Sheng Shicai's Xinjiang was a Chinese province (Soviet-backed); the USSR never annexed it

  // --- Southern Africa 1961–66 (British East Africa's piece = Rhodesias, Nyasaland and Bechuanaland) ---
  ['Republic of Botswana', 1961, 1965, { restore: 1967, as: 'Bechuanaland Protectorate', member: '(British Empire)', wikidata: null }], // British protectorate until 30 Sept 1966
  ['Republic of Botswana', 1966, 1966, { restore: 1967 }],
  ['Rhodesia', 1964, 1965, { restore: 1967, as: 'Southern Rhodesia', member: '(British Empire)' }], // self-governing British colony
  ['Rhodesia', 1966, 1966, { restore: 1967 }], // UDI 11 Nov 1965
  ['British East Africa', 1961, 1963, { parts: [20, -23, 36, -8], rename: 'Federation of Rhodesia and Nyasaland' }], // the Federation (1953–63) dissolved 31 Dec 1963
  ['British East Africa', 1964, 1966, { parts: [20, -23, 36, -8], drop: true }], // slivers left between Zambia, Malawi, Rhodesia and Botswana

  // --- More ---
  ['Ndebele Kingdom', 1840, 1893, { draw: NDEBELE, under: true }], // Mzilikazi's Ndebele kingdom (Bulawayo) from c. 1840 until the BSAC took it in 1893
  // Manchukuo, Japan's puppet state in Manchuria, March 1932 – August 1945 (the source draws it as Japan); Japan's shape changes yearly, so one fix per year.
  ...Array.from({ length: 14 }, (_, i) => ['Empire of Japan', 1932 + i, 1932 + i, { draw: MANCHUKUO, within: ['Empire of Japan', 1932 + i], as: 'Manchukuo', member: '', wikidata: null }]),
]
