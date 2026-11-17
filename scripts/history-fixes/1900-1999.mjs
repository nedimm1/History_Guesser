// Fixes for Cliopatria rows 1900–1999, in scripts/history-fixes.mjs format: [name, from, to, action].
// Names are post-RENAMES (e.g. 'United Kingdom', not 'Kingdom of Great Britain').
export default [
  // ── Geometry leftovers: United States of America ──
  ['United States of America', 1902, 1925, { parts: [-85.5, 19.5, -74, 23.5], rename: 'Republic of Cuba' }], // Cuba independent May 1902 (US occupation 1906–09 kept the state); Isle of Pines Cuban, confirmed 1925
  ['United States of America', 1924, 1935, { parts: [-74.6, 17.9, -71.6, 20.2], rename: 'Republic of Haiti' }], // US occupation 1915–34 left Haiti a sovereign republic
  ['United States of America', 1942, 1944, { parts: [-25, 63, -13, 67.5], drop: true }], // Iceland: duplicate of the UK piece (renamed below)
  ['United States of America', 1945, 1945, { parts: [-25, 63, -13, 67.5], rename: 'Republic of Iceland' }], // Iceland a republic since June 1944, US troops only stationed
  ['United States of America', 1941, 1945, { parts: [-75, 59, -10, 84], rename: 'Greenland' }], // Greenland stayed Danish; US only protected it 1941–45
  ['United States of America', 1946, 1952, { parts: [128.5, 28, 146.5, 46], rename: 'Japan' }], // occupied Japan kept its own state and government until 1952
  ['United States of America', 1953, 1966, { parts: [128.5, 28, 146.5, 46], drop: true }], // duplicate of 'Japan' (sovereign from 1952)
  ['United States of America', 1948, 1966, { parts: [124, 33, 129, 39], drop: true }], // duplicate of Republic of Korea (founded Aug 1948)
  ['United States of America', 1950, 1966, { parts: [5, 47, 12.5, 56], drop: true }], // duplicate of Federal Republic of Germany (founded 1949)
  ['United States of America', 1967, 1972, { parts: [102, 8, 110, 17.2], rename: 'Republic of Vietnam' }], // South Vietnam existed until 1975; it was never US territory
  ['United States of America', 1973, 1999, { parts: [102, 8, 110, 17.2], drop: true }], // duplicate of Republic of Vietnam / Socialist Republic of Vietnam
  ['United States of America', 1973, 1999, { parts: [122, 24, 131.5, 28.5], drop: true }], // Okinawa returned to Japan May 1972
  ['United States of America', 1991, 1999, { parts: [13, 52, 14, 53], drop: true }], // West Berlin sector: occupation ended with reunification 1990

  // ── Geometry leftovers: French Fifth Republic ──
  ['French Fifth Republic', 1963, 1999, { parts: [-10, 18, 12, 38], drop: true }], // Algeria independent July 1962; duplicate of People's Democratic Republic of Algeria
  ['French Fifth Republic', 1977, 1978, { parts: [41, 10, 44, 13], rename: 'Republic of Djibouti' }], // Djibouti independent June 1977
  ['French Fifth Republic', 1979, 1999, { parts: [41, 10, 44, 13], drop: true }], // duplicate of Republic of Djibouti
  ['French Fifth Republic', 1976, 1999, { parts: [43, -12.6, 44.6, -11], drop: true }], // Comoros independent July 1975; the islands are drawn from the Cabo Verde row below
  ['Republic of Cabo Verde', 1976, 1999, { parts: [43, -12.6, 44.6, -11], rename: 'Comoros' }], // Comoros (Grande Comore, Anjouan, Mohéli) wrongly inside Cabo Verde's shape
  ['Republic of Cabo Verde', 1976, 1999, { parts: [44.6, -13.2, 45.5, -12.5], drop: true }], // Mayotte stayed French; duplicate of the French piece
  ['French Fifth Republic', 1961, 1999, { parts: [9, 47.4, 10.4, 48], drop: true }], // Lindau area: French occupation zone, returned to Bavaria 1955
  ['French Fifth Republic', 1991, 1999, { parts: [13, 52, 14, 53], drop: true }], // Berlin sector: occupation ended 1990

  // ── Geometry leftovers: United Kingdom ──
  ['United Kingdom', 1940, 1943, { parts: [-25, 63, -13, 67.5], rename: 'Kingdom of Iceland', member: '' }], // Iceland stayed a sovereign kingdom under British/US occupation
  ['United Kingdom', 1944, 1944, { parts: [-25, 63, -13, 67.5], rename: 'Republic of Iceland', member: '' }], // Republic proclaimed 17 June 1944
  ['United Kingdom', 1961, 1968, { parts: [46, 28, 49, 31], drop: true }], // Kuwait independent June 1961; duplicate of State of Kuwait
  ['United Kingdom', 1961, 1968, { parts: [32, 34, 35, 36], drop: true }], // Cyprus independent 1960; duplicate of Republic of Cyprus
  ['United Kingdom', 1967, 1968, { parts: [14, 35.7, 14.7, 36.2], drop: true }], // Malta independent 1964; duplicate of Malta
  ['United Kingdom', 1973, 1999, { parts: [50, 16, 60, 27], drop: true }], // Oman, Trucial States/UAE, Qatar, Bahrain: independent by 1971; duplicates of their own rows
  ['United Kingdom', 1991, 1999, { parts: [13, 52, 14, 53], drop: true }], // Berlin sector: occupation ended 1990

  // ── Colonies stuck inside other colonies' rows ──
  ['Netherlands Antilles', 1900, 1975, { parts: [-59, 1, -53, 7], rename: 'Surinam' }], // Surinam was a separate Dutch colony
  ['Netherlands Antilles', 1976, 1999, { parts: [-59, 1, -53, 7], drop: true }], // Suriname independent Nov 1975; duplicate of Republic of Suriname
  ['Netherlands Antilles', 1900, 1953, { parts: [-71, 11, -62, 19], rename: 'Curaçao and Dependencies' }], // name 'Netherlands Antilles' only from 1954
  ['French Indochina', 1900, 1957, { parts: [163, -23, 169, -19], rename: 'New Caledonia' }], // French Pacific colony, not part of Indochina
  ['French Indochina', 1900, 1957, { parts: [55, -21.5, 56, -20.8], rename: 'Réunion' }], // French Indian Ocean colony (department from 1946)
  ['French Indochina', 1900, 1957, { parts: [68, -50.5, 71, -48], rename: 'Kerguelen Islands' }], // French subantarctic islands
  ['French Indochina', 1950, 1957, { parts: [88, 22, 89, 23.5], drop: true }], // Chandernagore transferred to India 1950 (de jure 1952)
  ['French Indochina', 1900, 1954, { parts: [75, 10, 89, 23.5], rename: 'French India' }], // Pondichéry, Karikal, Yanaon, Mahé, Chandernagore
  ['French Indochina', 1955, 1957, { parts: [75, 10, 89, 23.5], rename: 'Republic of India', member: '' }], // French India handed to India Nov 1954
  ['French Indochina', 1900, 1943, { parts: [116.5, 38.5, 118, 40], rename: 'French Concession of Tianjin' }], // concession, not Indochina; given up 1943
  ['French Indochina', 1944, 1945, { parts: [116.5, 38.5, 118, 40], drop: true }], // concession returned to China 1943
  ['British Colonial Empire', 1901, 1904, { parts: [112, -45, 147, -10.5], rename: 'Commonwealth of Australia', member: '' }], // federation 1 Jan 1901
  ['British Colonial Empire', 1901, 1904, { parts: [147, -45, 150, -38], rename: 'Commonwealth of Australia', member: '' }], // Flinders Island (Tasmania)
  ['British Gold Coast', 1900, 1904, { parts: [2, 4, 15, 14], rename: 'Southern Nigeria' }], // Lagos and the Southern Nigeria Protectorate
  ['British Gold Coast', 1905, 1913, { parts: [2, 4, 15, 14], rename: 'Northern and Southern Nigeria' }], // two British protectorates until 1914
  ['British Gold Coast', 1914, 1960, { parts: [2, 4, 15, 14], rename: 'Colony and Protectorate of Nigeria' }], // amalgamated 1914, independent Oct 1960
  ['British Gold Coast', 1957, 1957, { parts: [-4, 4, 2, 12], rename: 'Ghana', member: '' }], // Ghana independent 6 March 1957
  ['British Gold Coast', 1958, 1959, { parts: [-4, 4, 2, 12], drop: true }], // duplicate of Ghana
  ['British East Africa', 1963, 1968, { parts: [29, -5, 42, 5], drop: true }], // Kenya (Dec 1963) and Uganda (1962) independent; duplicates
  ['British East Africa', 1963, 1968, { parts: [39, -8.5, 40.5, -4.8], drop: true }], // Zanzibar, Pemba, Mafia: duplicate of Zanzibar / Tanzania
  ['British East Africa', 1967, 1968, { parts: [20, -23, 36, -8], drop: true }], // Zambia, Malawi (1964), Botswana (1966), Rhodesia (UDI 1965): duplicates
  ['British East Africa', 1967, 1968, { parts: [27, -31, 30, -28.5], drop: true }], // Lesotho independent 1966; duplicate
  ['British East Africa', 1967, 1968, { parts: [-17, 13, -13.5, 14], drop: true }], // The Gambia independent 1965; duplicate
  ['Estado Novo', 1973, 1975, { parts: [-17, 10.5, -13, 13], drop: true }], // duplicate of Republic of Guinea-Bissau (independent 1973/74)
  ['Estado Novo', 1974, 1975, { parts: [-32, 32, -6, 43], rename: 'Portugal' }], // Carnation Revolution ended the Estado Novo April 1974
  ['Communist Party of China', 1938, 1939, { parts: [73, 34, 97, 50], rename: 'Republic of China' }], // Xinjiang was Sheng Shicai's province, never CCP-held
  ['Communist Party of China', 1940, 1945, { parts: [73, 34, 97, 50], drop: true }], // Xinjiang: duplicate of the USSR (1940–42) / ROC (1943–45) rows
  ['Russian-occupied territories', 1992, 1999, { parts: [29, 46.5, 30.5, 48.5], rename: 'Transnistria', member: '' }], // breakaway from Moldova 1990–92
  ['Russian-occupied territories', 1992, 1999, { parts: [43, 42, 45, 43], rename: 'South Ossetia', member: '' }], // breakaway from Georgia 1991–92
  ['Russian-occupied territories', 1992, 1994, { parts: [28, 45.3, 29, 46.6], rename: 'Gagauzia', member: '' }], // Gagauz breakaway, rejoined Moldova as an autonomy 1994
  ['Russian-occupied territories', 1995, 1999, { parts: [28, 45.3, 29, 46.6], rename: 'Republic of Moldova', member: '' }], // Gagauzia autonomous within Moldova from 1995

  // ── Wrong names / misattributed rows ──
  ['Sultanate of Aceh', 1904, 1913, { rename: 'Dutch East Indies', member: '(Netherlands)' }], // Dutch conquest complete 1903–04
  ['Sultanate of Aceh', 1946, 1959, { rename: 'Republic of Indonesia' }], // Aceh was part of the Indonesian Republic from 1945 (sultanate abolished 1903)
  ['Principality of Bulgaria', 1908, 1944, { rename: 'Kingdom of Bulgaria' }], // Tsardom proclaimed Oct 1908
  ['Hungarian Republic', 1920, 1943, { rename: 'Kingdom of Hungary' }], // Horthy's regency kingdom 1920–46
  ['Kingdom of Lithuania', 1919, 1939, { rename: 'Republic of Lithuania' }], // interwar Lithuania was a republic
  ['Kuomintang', 1917, 1929, { rename: 'Republic of China' }], // Beiyang ROC, then KMT Nationalist ROC from 1928 — the state was the ROC
  ['Weimar Republic', 1933, 1935, { rename: 'Nazi Germany' }], // Hitler in power Jan 1933
  ['Kingdom of Spain', 1931, 1931, { rename: 'Second Spanish Republic', member: '' }], // Republic proclaimed 14 April 1931
  ['Kingdom of Hejaz and Nejd', 1932, 1935, { rename: 'Kingdom of Saudi Arabia' }], // unified as Saudi Arabia Sept 1932
  ['Kingdom of Thailand', 1932, 1938, { rename: 'Kingdom of Siam' }], // renamed Thailand in 1939
  ['Qatar Protectorate', 1947, 1955, { rename: 'Sultanate of Muscat and Oman' }], // the shape is Oman, not Qatar
  ['Islamic Republic of Pakistan', 1947, 1955, { rename: 'Dominion of Pakistan' }], // Islamic Republic from 1956
  ['Sri Lanka', 1948, 1971, { rename: 'Ceylon' }], // renamed Sri Lanka May 1972
  ['Papua New Guinea', 1946, 1974, { rename: 'Territory of Papua and New Guinea' }], // Australian-run until independence Sept 1975
  ['Socialist Republic of Romania', 1948, 1964, { rename: "People's Republic of Romania" }], // 'Socialist Republic' from 1965
  ['Hungarian Nationalists', 1956, 1957, { rename: "Hungarian People's Republic" }], // the 1956 uprising lasted ~3 weeks
  ['Belgian Congo', 1960, 1962, { rename: 'Ruanda-Urundi' }], // the leftover 50k shape is Ruanda-Urundi (Belgian trust territory)
  ['Federal Republic of Somalia', 1960, 1969, { rename: 'Somali Republic' }], // 'Federal Republic' only from 2012
  ['Federal Republic of Somalia', 1970, 1991, { rename: 'Somali Democratic Republic' }], // Siad Barre's state 1969–91
  ['Federal Republic of Somalia', 1992, 1999, { rename: 'Somalia' }], // collapsed state, no government
  ['Tanzania', 1961, 1963, { rename: 'Tanganyika' }], // union with Zanzibar April 1964
  ['Sultanate of Zanzibar', 1964, 1966, { rename: 'Tanzania' }], // sultan overthrown Jan 1964, union April 1964
  ['Burkina Faso', 1961, 1983, { rename: 'Republic of Upper Volta' }], // renamed Burkina Faso Aug 1984
  ['Republic of Benin', 1961, 1974, { rename: 'Republic of Dahomey' }], // renamed Benin Nov 1975
  ['Eswatini', 1969, 1999, { rename: 'Swaziland' }], // renamed Eswatini 2018
  ['Arab Socialist Ba\'ath Party', 1967, 1972, { rename: 'Syria' }], // a party, not the state (Syrian Arab Republic)
  ['Kingdom of Cambodia', 1970, 1975, { rename: 'Khmer Republic' }], // Lon Nol's republic Oct 1970–April 1975
  ['Democratic Republic of the Congo', 1972, 1972, { rename: 'Zaire' }], // renamed Zaire Oct 1971
  ['Democratic Republic of the Congo', 1996, 1996, { rename: 'Zaire' }], // Kabila restored the DRC name May 1997
  ['Greek junta', 1975, 1975, { rename: 'Third Hellenic Republic' }], // junta fell July 1974
  ['Turkish Republic of Northern Cyprus', 1976, 1982, { rename: 'Turkish Federated State of Cyprus' }], // TRNC declared Nov 1983
  ['Libyan Arab Republic', 1977, 1999, { rename: 'Libyan Arab Jamahiriya' }], // Jamahiriya proclaimed March 1977
  ['Kingdom of Bahrain', 1973, 2001, { rename: 'State of Bahrain' }], // kingdom only from 2002
  ['Zimbabwe Rhodesia', 1980, 1982, { rename: 'Republic of Zimbabwe' }], // Zimbabwe independent April 1980
  ['Mujahideen', 1987, 1991, { rename: 'Republic of Afghanistan' }], // Najibullah's government held Kabul until April 1992
  ['Mujahideen', 1992, 1995, { rename: 'Islamic State of Afghanistan' }], // the mujahideen state 1992–96
  ["People's Republic of Kampuchea", 1989, 1992, { rename: 'State of Cambodia' }], // renamed 1989
  ["People's Republic of Kampuchea", 1993, 1995, { rename: 'Kingdom of Cambodia' }], // monarchy restored Sept 1993
  ['Federated Republic of Germany', 1991, 2023, { rename: 'Federal Republic of Germany' }], // official name is 'Federal'

  // ── Gaps and early splits ──
  ['Mexico', 1912, 1912, { extend: 1919 }], // Mexico existed through the Revolution; the land is blank 1913–19
  ['Czechoslovakia', 1991, 1991, { extend: 1992 }], // dissolved 1 Jan 1993
  ['Czech Republic', 1992, 1992, { drop: true }], // independent 1 Jan 1993
  ['Slovakia', 1992, 1992, { drop: true }], // independent 1 Jan 1993
  ['Serbia-Montenegro', 1992, 1999, { rename: 'Federal Republic of Yugoslavia' }], // Serbia and Montenegro kept the name Yugoslavia (FRY) until February 2003
]
