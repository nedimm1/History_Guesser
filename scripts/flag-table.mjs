// Hand-checked flag timelines, used by scripts/build-flags.mjs on top of Wikidata.
//
// Wikidata's flag data (property P41) is good where it is dated, but many historical states have
// no flag there, or an undated modern flag that would show up centuries too early (Morocco's 1915
// star in 1700). These timelines win over Wikidata for the territories they match.
//
// Files are on Wikimedia Commons; build-flags only uses the ones whose licence is public domain or
// CC0, so they need no credit. Years are inclusive. Years a timeline doesn't cover fall through to
// Wikidata; if that has nothing dated either, no flag is shown. A null file means "no flag" and
// stops there (the German Confederation had none before 1848). Many states had no national flag
// (Ming China, the Mughals, Tokugawa Japan).

// Never shown, whatever Wikidata says: Nazi flags are restricted in Germany and by ad networks.
export const BLOCKED_FILES = /NSDAP|Nazi|swastika|Hakenkreuz|\(1935.1945\)|Reichskriegsflagge/i

// The big powers: their colonies and territories (see src/owners.js) fly the same flag unless a
// territory has one of its own below or in Wikidata.
export const POWER_FLAGS = {
  'United Kingdom': [
    // The 1606 union flag was only flown at sea; England and its colonies flew St George's cross
    // until the 1707 Union.
    [1500, 1706, 'Flag of England.svg'],
    [1707, 1800, 'Flag of Great Britain (1707–1800).svg'],
    [1801, 2024, 'Flag of the United Kingdom.svg'],
  ],
  France: [
    [1500, 1789, 'Pavillon royal de France.svg'],
    [1790, 1793, 'Flag of France (1790–1794).svg'],
    [1794, 1814, 'Flag of France.svg'],
    [1815, 1829, 'Flag of the Kingdom of France (1814-1830).svg'],
    [1830, 2024, 'Flag of France.svg'],
  ],
  Spain: [
    [1500, 1505, null], // the Cross of Burgundy came with Philip I in 1506
    [1506, 1784, 'Flag of Cross of Burgundy.svg'],
    [1785, 1930, 'Flag of Spain 1785.svg'],
    [1931, 1938, 'Flag of the Second Spanish Republic.svg'],
    // 1939–1980: the plain civil flag (the versions with Franco's arms aren't public domain).
    [1939, 1980, 'Bandera de España (sin escudo).svg'],
    [1981, 2024, 'Flag of Spain.svg'],
  ],
  Portugal: [
    [1500, 1520, 'Flag of Portugal (1495).svg'],
    [1521, 1577, 'Flag of Portugal (1521).svg'],
    [1578, 1639, 'Flag of Portugal (1578).svg'],
    [1640, 1666, 'Flag Portugal (1640).svg'],
    [1667, 1706, 'Flag of Portugal (1667).svg'],
    [1707, 1815, 'Flag of Portugal (1707).svg'],
    [1816, 1829, 'Flag of the United Kingdom of Portugal, Brazil and the Algarves (1816).svg'],
    [1830, 1910, 'Flag of Portugal (1830–1910).svg'],
    [1911, 2024, 'Flag of Portugal.svg'],
  ],
  Netherlands: [
    [1581, 1629, 'Prinsenvlag.svg'], // orange-white-blue until red replaced orange (c. 1630–1660)
    [1630, 1794, 'Statenvlag.svg'],
    [1795, 2024, 'Flag of the Netherlands.svg'],
  ],
  Belgium: [[1831, 2024, 'Flag of Belgium.svg']],
  Germany: [
    // Prussia until unification, then the German Empire.
    [1701, 1866, 'Civil flag of Prussia 1701-1935.svg'],
    [1867, 1918, 'Flag of Germany (1867–1918).svg'],
    [1919, 1932, 'Flag of Germany (3-2 aspect ratio).svg'],
    // 1933–1945: deliberately no flag (the swastika flag is restricted in Germany and by ad networks).
    [1949, 2024, 'Flag of Germany.svg'],
  ],
  Austria: [
    [1500, 1699, null], // the black-yellow flag only came into use in the 18th century
    [1700, 1866, 'Flag of the Habsburg Monarchy.svg'],
    [1867, 1918, 'Flag of Austria-Hungary (1869-1918).svg'],
    [1919, 1933, 'Flag of Austria.svg'],
    [1945, 2024, 'Flag of Austria.svg'],
  ],
  Italy: [
    [1861, 1945, 'Flag of Italy (1861–1946).svg'],
    [1946, 2024, 'Flag of Italy.svg'],
  ],
  Denmark: [[1500, 2024, 'Flag of Denmark.svg']],
  Sweden: [[1500, 2024, 'Flag of Sweden.svg']],
  Russia: [
    [1696, 1857, 'Flag of Russia.svg'],
    [1858, 1895, 'Flag of Russia (1858–1896).svg'],
    [1896, 1917, 'Flag of Russia.svg'],
    [1918, 1922, 'Flag of the Russian Soviet Federative Socialist Republic (1918–1925).svg'],
    [1923, 1991, 'Flag of the Soviet Union.svg'],
    [1992, 2024, 'Flag of Russia.svg'],
  ],
  Japan: [[1870, 2024, 'Flag of Japan.svg']],
  'Ottoman Empire': [
    [1793, 1843, 'Ottoman red flag.svg'], // before 1793 the Ottomans had no single flag
    [1844, 1922, 'Flag of the Ottoman Empire (1844–1922).svg'],
  ],
  'United States': [
    [1777, 1794, 'Flag of the United States (1777–1795).svg'],
    [1795, 1817, 'Flag of the United States (1795–1818).svg'],
    // 1818–1958: many star counts, which Wikidata has dated.
    [1959, 1959, 'Flag of the United States (1959–1960).svg'],
    [1960, 2024, 'Flag of the United States.svg'],
  ],
}

// Other well-known states, matched on the territory's name. [pattern, [[from, to, file], …]]
export const NAME_FLAGS = [
  // Territories whose Wikidata ID in the border data is another country's, or that a broad
  // pattern further down would catch wrongly.
  [/^Federal Republic of Yugoslavia$/, [[1992, 2002, 'Flag of Serbia and Montenegro (1992–2006).svg']]],
  [/^Russian-occupied Ukraine$|People's Republic$/, [[2014, 2024, null]]], // occupation and Russian proxy states: no flag
  [/^Western Sahara$/, [[2000, 2024, null]]], // disputed: neither Morocco's nor the Sahrawi Republic's flag
  [/^Republic of Artsakh$/, [[1992, 2023, 'Flag of Artsakh.svg']]],
  [/^Abkhazia$/, [[1993, 2024, 'Flag of the Republic of Abkhazia.svg']]],
  [/^Republic of Texas$/, [[1836, 1838, 'Flag of the Republic of Texas (1836–1839).svg'], [1839, 1845, 'Flag of Texas.svg']]], // the Lone Star flag from 1839
  [/^Yemen$|^Republic of Yemen$/, [[1990, 2024, 'Flag of Yemen.svg']]],
  [/^Guinea$/, [[1958, 2024, 'Flag of Guinea.svg']]],
  [/^Republic of the Congo$/, [[1959, 1969, 'Flag of the Republic of the Congo.svg'], [1970, 1991, "Flag of the People's Republic of the Congo.svg"], [1992, 2024, 'Flag of the Republic of the Congo.svg']]],
  [/^People's Republic of Angola$|^Angola$/, [[1975, 2024, 'Flag of Angola.svg']]],
  [/^Slovakia$|^Slovak Republic$/, [[1992, 2024, 'Flag of Slovakia.svg']]],
  [/^Syria$|^Syrian Arab Republic$|^Ba'athist Syria$|^Arab Socialist Ba'ath Party$/, [
    [1963, 1971, 'Flag of Syria (1963–1972).svg'],
    [1972, 1979, 'Flag of Syria (1972–1980).svg'],
    [1980, 2023, 'Flag of the United Arab Republic (1958–1971), Flag of Syria (1980–2024) (stars variant 1).svg'],
    // 2024: the year ends after Assad's fall (8 December), so Wikidata's new flag is right.
  ]],
  [/Brunei/, [[1959, 2024, 'Flag of Brunei.svg']]],
  [/^Republic of Cabo Verde$|^Cape Verde$|^Cabo Verde$/, [[1975, 1991, 'Flag of Cape Verde (1975–1992).svg'], [1992, 2024, 'Flag of Cape Verde (3-2).svg']]],
  [/^Papua New Guinea$|^Territory of Papua and New Guinea$/, [[1946, 1970, 'Flag of Australia.svg'], [1971, 2024, 'Flag of Papua New Guinea.svg']]],
  [/^Burkina Faso$|Upper Volta/, [[1959, 1983, 'Flag of Upper Volta.svg'], [1984, 2024, 'Flag of Burkina Faso.svg']]],
  [/^Belgian Congo$|^Congo Free State$/, [[1885, 1907, 'Flag of the Congo Free State.svg'], [1908, 1959, 'Flag of Belgium.svg'], [1960, 1962, 'Flag of the Republic of the Congo (Léopoldville) (1960–1963).svg']]],
  [/^Saint Vincent$/, [[1969, 1984, null], [1985, 2024, 'Flag of Saint Vincent and the Grenadines.svg']]], // the 1979–85 flag has no public-domain file
  [/^Kuomintang$/, [[1917, 1929, 'Flag of the Republic of China.svg']]], // Sun Yat-sen's Canton government, not the Beiyang flag
  [/^Peru-Bolivian Confederation$/, [[1836, 1839, null]]],
  [/^Federated Republic of Mexico$/, [[1823, 1867, 'Flag of Mexico (1823-1864, 1867-1893).svg']]], // Juárez kept the tricolour against the Empire
  [/^Tanzania$|^Tanganyika$/, [[1961, 1963, null], [1964, 2024, 'Flag of Tanzania.svg']]], // Tanganyika's flag has no public-domain file
  [/^Republic of Cameroon$/, [[1960, 1960, 'Flag of Cameroon (1957–1961).svg'], [1961, 1974, 'Flag of Cameroon (1961–1975).svg'], [1975, 2024, 'Flag of Cameroon.svg']]],
  [/^Republic of Burundi$/, [[1962, 1966, 'Flag of Burundi (1962–1966).svg'], [1967, 2024, 'Flag of Burundi.svg']]],
  [/^Republic of Benin$|Dahomey/, [[1959, 1974, 'Flag of Benin.svg'], [1975, 1989, 'Flag of Benin (1975–1990).svg'], [1990, 2024, 'Flag of Benin.svg']]],
  [/Northern Cyprus|Turkish Federated State of Cyprus/, [[1975, 1983, 'Flag of Turkey.svg'], [1984, 2024, 'Flag of the Turkish Republic of Northern Cyprus.svg']]],
  [/^Russian-occupied territories$/, [[1992, 2024, null]]], // separatist statelets, not Russian territory
  [/^Pro-Swedish Poland$/, [[1500, 2024, null]]], // a Swedish client, not Sweden
  [/^Trucial States$/, [[1820, 1971, null]]], // each sheikhdom flew its own red flag; no common flag before the UAE
  [/^Sultanate of Muscat and Oman$/, [[1856, 1969, 'Flag of Muscat.svg']]], // plain red until the 1970 flag
  [/^Kingdom of Cambodia$/, [[1948, 1969, 'Flag of Cambodia.svg'], [1993, 2024, 'Flag of Cambodia.svg']]], // the royal flag, restored in 1993
  [/^East Turkestan Republic$/, [[1944, 1949, null]]], // the Second Republic's green flag has no public-domain file
  [/^Cuban Communists$/, [[1950, 1964, null]]], // the Communist Party of Cuba was founded in 1965
  [/^Hungarian People's Republic$/, [[1949, 1956, 'Flag of Hungary (1949-1956).svg'], [1957, 1989, 'Flag of Hungary.svg']]],
  [/^Zimbabwe Rhodesia$/, [[1979, 1979, 'Flag of Zimbabwe Rhodesia (1979).svg']]],
  [/^British Virgin Islands$/, [[1960, 2024, 'Flag of the British Virgin Islands.svg']]],
  [/^Saint Helena/, [[1984, 2024, 'Flag of Saint Helena.svg']]],
  [/^Netherlands Antilles$/, [[1986, 2010, 'Flag of the Netherlands Antilles (1986–2010).svg']]],
  [/^Second Polish Republic$|^Republic of Poland$|^Polish People's Republic$|^Poland$/, [[1919, 2024, 'Flag of Poland.svg']]],
  [/^Qing Dynasty$/, [[1862, 1888, 'Flag of China (1862–1889).svg'], [1889, 1911, 'Flag of China (1889–1912).svg']]],
  [/^Republic of China$|^Beiyang|^Nationalist China/, [[1912, 1927, 'Flag of China (1912–1928).svg'], [1928, 2024, 'Flag of the Republic of China.svg']]],
  [/^People's Republic of China$/, [[1949, 2024, "Flag of the People's Republic of China.svg"]]],
  [/^Morocco$|Sultanate of Morocco|Alaouite/, [[1666, 1914, 'Flag of Morocco (1666–1915).svg'], [1915, 2024, 'Flag of Morocco.svg']]],
  [/^Ethiopian Empire$|^Ethiopia$/, [[1897, 1974, 'Flag of Ethiopia (1897–1974).svg']]],
  [/Mexic/, [ // the Empire's flag only for the Empire's own rows, see Federated Republic above
    [1821, 1822, 'Flag of Mexico (1821-1823).svg'],
    [1823, 1863, 'Flag of Mexico (1823-1864, 1867-1893).svg'],
    [1864, 1866, 'Flag of the Second Mexican Empire.svg'],
    [1867, 1892, 'Flag of Mexico (1823-1864, 1867-1893).svg'],
    [1893, 1915, 'Flag of Mexico (1893–1916).svg'],
    [1916, 1933, 'Flag of Mexico (1916–1934).svg'],
    [1934, 1967, 'Flag of Mexico (1934-1968).svg'],
    [1968, 2024, 'Flag of Mexico.svg'],
  ]],
  [/Brazil/, [
    [1822, 1888, 'Flag of Brazil (1870–1889).svg'],
    [1889, 1959, 'Flag of Brazil (1889–1960).svg'],
    [1960, 2024, 'Flag of Brazil.svg'],
  ]],
  [/Argentin|Río de la Plata/, [[1812, 2024, 'Flag of Argentina.svg']]],
  [/Chile/, [[1817, 2024, 'Flag of Chile.svg']]],
  [/Peru/, [[1825, 2024, 'Flag of Peru.svg']]],
  [/Colombia|Gran Colombia|New Granada/, [[1861, 2024, 'Flag of Colombia.svg']]],
  [/Venezuela/, [
    [1836, 1858, 'Flag of Venezuela (1836–1859).svg'],
    [1859, 1862, 'Flag of Venezuela (1859–1863).svg'],
    [1863, 1904, 'Flag of Venezuela (1863–1905).svg'],
    [1905, 1929, 'Flag of Venezuela (1905–1930).svg'],
    [1930, 2005, 'Flag of Venezuela (1930–2006).svg'],
    [2006, 2024, 'Flag of Venezuela.svg'],
  ]],
  [/Qajar|^Persia/, [[1907, 1932, 'State flag of Persia (1907–1933).svg']]],
  [/Pahlavi|Imperial State of Iran/, [[1933, 1979, 'State flag of Iran (1964–1980).svg']]],
  [/Islamic Republic of Iran|^Iran$/, [[1980, 2024, 'Flag of Iran.svg']]],
  [/^Republic of Turkey$|^Turkey$|^Türkiye$|Grand National Assembly/, [[1923, 2024, 'Flag of Turkey.svg']]],
  [/Rattanakosin|^Siam|Kingdom of Thailand|^Thailand$/, [[1917, 2024, 'Flag of Thailand.svg']]],
  [/Korean Empire|^Joseon$/, [[1883, 1910, 'Flag of Korea (1882–1910).svg']]],
  [/^Republic of Korea$|^South Korea$/, [[1948, 2024, 'Flag of South Korea.svg']]],
  [/Democratic People's Republic of Korea|^North Korea$/, [[1948, 2024, 'Flag of North Korea.svg']]],
  [/Empire of Japan|^Japan$/, [[1870, 2024, 'Flag of Japan.svg']]],
  [/Republic of India|^India$/, [[1947, 2024, 'Flag of India.svg']]],
  [/Pakistan/, [[1947, 2024, 'Flag of Pakistan.svg']]],
  [/^Union of Soviet Socialist Republics$/, [[1923, 1991, 'Flag of the Soviet Union.svg']]],
  [/^German Democratic Republic$/, [[1959, 1990, 'Flag of East Germany.svg'], [1949, 1958, 'Flag of Germany.svg']]],
  [/^Federal Republic of Germany$|^Federated Republic of Germany$/, [[1949, 2024, 'Flag of Germany.svg']]],
  [/^Kingdom of Great Britain$|^United Kingdom$|^United Kingdom of Great Britain/, [[1707, 1800, 'Flag of Great Britain (1707–1800).svg'], [1801, 2024, 'Flag of the United Kingdom.svg']]],
  [/^Kingdom of Scotland$/, [[1500, 1706, 'Flag of Scotland.svg']]],
  [/^Kingdom of Sardinia$/, [[1720, 1860, 'Flag of the Kingdom of Sardinia.svg']]],
  [/^Swiss Confederation$|^Switzerland$|^Old Swiss Confederacy$/, [[1815, 2024, 'Flag of Switzerland.svg']]],
  [/^Republic of Venice$/, [[1500, 1797, 'Flag of Most Serene Republic of Venice.svg']]],
  [/^Kingdom of Hungary$|^Hungary$|^Hungarian/, [[1918, 2024, 'Flag of Hungary.svg']]],
  [/Egypt/, [[1922, 1952, 'Flag of Egypt (1922–1958).svg'], [1972, 1983, 'Flag of Egypt (1972–1984).svg'], [1984, 2024, 'Flag of Egypt.svg']]],
  [/Saudi Arabia/, [[1932, 2024, 'Flag of Saudi Arabia.svg']]],
  [/^Afghanistan$|Kingdom of Afghanistan/, [[1931, 1973, 'Flag of Afghanistan (1931–1973).svg']]],
  [/^Commonwealth of Australia$|^Australia$/, [[1901, 2024, 'Flag of Australia.svg']]],
  [/^Canada$|Dominion of Canada/, [[1957, 1964, 'Flag of Canada (1957–1965).svg'], [1965, 2024, 'Flag of Canada.svg']]],
  [/New Zealand/, [[1902, 2024, 'Flag of New Zealand.svg']]],
  [/^South Africa$|Union of South Africa/, [[1928, 1993, 'Flag of South Africa (1928–1982).svg'], [1994, 2024, 'Flag of South Africa.svg']]],
  [/^Kingdom of Greece$|^Greece$|Hellenic/, [[1822, 1969, 'Flag of Greece (1822-1978).svg'], [1970, 2024, 'Flag of Greece.svg']]],
  [/^Kingdom of Norway$|^Norway$/, [[1905, 2024, 'Flag of Norway.svg']]],
  [/^Republic of Finland$|^Finland$/, [[1918, 2024, 'Flag of Finland.svg']]],
  [/^Romania$|Kingdom of Romania/, [[1867, 1947, 'Flag of Romania.svg'], [1990, 2024, 'Flag of Romania.svg']]],
  [/Yugoslav/, [[1918, 1940, 'Flag of the Kingdom of Yugoslavia.svg'], [1946, 1991, 'Flag of Yugoslavia (1946-1992).svg']]],
  [/Czechoslovak/, [[1920, 1992, 'Flag of the Czech Republic.svg']]],
  [/Sweden and Norway/, [[1814, 1905, 'Flag of Sweden.svg']]],
  [/^Spanish Nationalists$/, [[1936, 1939, 'Bandera de España (sin escudo).svg']]],
  // Black-red-gold only from 1848 until the Federal Diet dropped it in 1852.
  [/^German Confederation$/, [[1815, 1847, null], [1848, 1851, 'Flag of Germany (3-2 aspect ratio).svg'], [1852, 1866, null]]],
  [/^Republic of Vietnam$|^South Vietnam$/, [[1955, 1975, 'Flag of South Vietnam.svg']]],
  [/^Burma$|^Union of Burma$|^Union of Myanmar$|^Myanmar$/, [[1948, 1973, 'Flag of Burma (1948–1974).svg'], [1974, 2009, 'Flag of Myanmar (1974–2010).svg']]],
  [/^Lebanon$|^Lebanese Republic$/, [[1943, 2024, 'Flag of Lebanon.svg']]],
  [/^Ghana$/, [[1957, 1963, 'Flag of Ghana.svg'], [1966, 2024, 'Flag of Ghana.svg']]],
]
