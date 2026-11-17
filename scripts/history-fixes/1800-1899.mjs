// Fixes for Cliopatria rows alive 1800–1899 (plus continuations of the same misnamed rows past 1899).
export default [
  // --- British Isles / Hanover ---
  ['Kingdom of Great Britain', 1800, 1800, { parts: [-11, 51.3, -5.3, 55.5], rename: 'Kingdom of Ireland' }], // Ireland was a separate kingdom until the Act of Union, 1 Jan 1801
  ['Kingdom of Great Britain', 1801, 1819, { rename: 'United Kingdom' }], // Act of Union 1801 (RENAMES skips this row because it starts in 1800)
  ['United Kingdom', 1820, 1839, { parts: [6.5, 51, 11.5, 54.5], rename: 'Kingdom of Hanover', member: '' }], // Hanover was its own kingdom (1814–1866); it only shared a monarch with Britain until 1837
  // --- Germany ---
  ['Kingdom of Hanover', 1803, 1804, { rename: 'Electorate of Hanover' }], // became a kingdom only in 1814 (French-occupied 1803–05)
  ['Duchy of Bavaria', 1800, 1805, { rename: 'Electorate of Bavaria' }], // Bavaria was an electorate 1623–1805
  ['Confederation of the Rhine', 1809, 1814, { rename: 'Kingdom of Prussia' }], // the shape is Prussia after Tilsit; Prussia never joined the Rhine Confederation (dissolved 1813)
  ['German Confederation', 1820, 1867, { rename: 'Kingdom of Prussia' }], // every piece is Prussian (core, Rhineland/Westphalia, Erfurt/Schleusingen/Ziegenrück exclaves, Hohenzollern 1850, Schleswig/Lauenburg 1864–65, 1866 annexations)
  ['Hungarian Nationalists', 1850, 1852, { rename: 'Austrian Empire' }], // the Hungarian revolution was crushed in Aug 1849
  ['Republic of Baden', 1850, 1852, { rename: 'Grand Duchy of Baden' }], // the Baden republic lasted May–July 1849
  // --- Napoleonic Italy, Switzerland, Low Countries ---
  ['Cispadane Republic', 1800, 1802, { rename: 'Cisalpine Republic' }], // the Cispadane merged into the Cisalpine Republic in 1797
  ['Italian Republic', 1805, 1813, { rename: 'Kingdom of Italy (Napoleonic)' }], // Napoleon made it the Kingdom of Italy, March 1805
  ['Kingdom of Naples (Napoleonic)', 1806, 1814, { parts: [12, 36, 16, 38.5], rename: 'Kingdom of Sicily' }], // the Bourbons kept Sicily under British protection 1806–1815
  ['Austrian Empire', 1815, 1847, { parts: [9.9, 42.3, 12.5, 44.5], rename: 'Grand Duchy of Tuscany' }], // Tuscany (and Elba) was an independent grand duchy 1814–1859, not Austrian land
  ['Austrian Empire', 1849, 1858, { parts: [9.9, 42.3, 12.5, 44.5], rename: 'Grand Duchy of Tuscany' }], // same, restored after 1848–49 until 1859
  ['Kingdom of Sardinia', 1861, 1861, { rename: 'Kingdom of Italy' }], // Kingdom of Italy proclaimed 17 March 1861
  ['Batavian Republic', 1806, 1810, { rename: 'Kingdom of Holland', member: '' }], // Louis Bonaparte's Kingdom of Holland, 1806–1810
  ['Septinsular Republic', 1815, 1819, { rename: 'United States of the Ionian Islands', member: '(British Empire)' }], // British protectorate from 1815
  ['Kingdom of Monaco', 1815, 1939, { rename: 'Principality of Monaco' }], // Monaco has always been a principality
  // --- Scandinavia ---
  ['Denmark-Norway', 1814, 1940, { rename: 'Kingdom of Denmark' }], // Norway went to Sweden under the Treaty of Kiel, Jan 1814; the shape is Denmark (+ Iceland/Faroes)
  // --- Balkans ---
  ['First Hellenic Republic', 1822, 1865, { parts: [6, 48, 9, 51], drop: true }], // stray piece in the Palatinate (49.6N 7.6E) — not Greek
  ['First Hellenic Republic', 1832, 1923, { rename: 'Kingdom of Greece' }], // Kingdom of Greece from 1832 (Otto)
  ['First Hellenic Republic', 1924, 1935, { rename: 'Second Hellenic Republic' }], // republic March 1924 – Nov 1935
  ['First Hellenic Republic', 1936, 1940, { rename: 'Kingdom of Greece' }], // monarchy restored Nov 1935
  ['Kingdom of Serbia', 1880, 1881, { rename: 'Principality of Serbia' }], // Serbia became a kingdom in March 1882
  ['Serbs', 1815, 1881, { rename: 'Principality of Serbia' }], // autonomous principality from the Second Uprising (1815/1817), independent 1878
  ['Serbs', 1882, 1915, { rename: 'Kingdom of Serbia' }], // Kingdom of Serbia from 1882
  ['United Principalities of Moldavia and Wallachia', 1866, 1880, { rename: 'Romania' }], // officially named Romania from the 1866 constitution
  ['United Principalities of Moldavia and Wallachia', 1881, 1916, { rename: 'Kingdom of Romania' }], // kingdom proclaimed 1881
  // --- Caribbean / Americas ---
  ['Saint-Domingue', 1800, 1802, { member: '(French Consulate)' }], // still a French colony until independence, 1 Jan 1804
  // In 1803–04 Cliopatria draws all of Hispaniola inside "French Louisiana" (Louisiana itself was sold in 1803).
  ['French Louisiana', 1803, 1803, { parts: [-75, 17, -68, 20.5], rename: 'Saint-Domingue' }], // French until the last troops left in Nov 1803
  ['French Louisiana', 1804, 1804, { parts: [-75, 17, -68, 20.5], rename: 'Empire of Haiti', member: '' }], // independence 1 Jan 1804; the empire of Dessalines
  ['French Louisiana', 1803, 1804, { rename: 'First French colonial empire' }], // the remaining pieces are Guiana and the Antilles
  ['Empire of Haiti', 1807, 1819, { rename: 'Haiti' }], // the Empire ended in 1806; split into the State/Kingdom (north) and the Republic (south)
  ['Empire of Haiti', 1820, 1915, { rename: 'Republic of Haiti' }], // reunified as the Republic of Haiti in 1820
  ['Netherlands Antilles', 1820, 1899, { parts: [-58.5, 1.5, -53.5, 6.5], rename: 'Surinam', member: '(Netherlands)' }], // Suriname was never part of the Netherlands Antilles (a 1954 creation)
  ['Netherlands Antilles', 1815, 1899, { rename: 'Curaçao and Dependencies', member: '(Netherlands)' }], // 19th-century name of the Dutch islands
  ['Federated Republic of Mexico', 1836, 1845, { rename: 'Centralist Mexico' }], // the federal system was abolished 1835–1846; both rows were Mexico
  ['Republic of Colombia', 1866, 1885, { rename: 'United States of Colombia' }], // United States of Colombia 1863–1886
  ['Argentine Confederation', 1862, 1929, { rename: 'Argentine Republic' }], // Argentine Republic after Pavón and Mitre (1861–62)
  // --- Spain / Pacific ---
  ['First Spanish Republic', 1875, 1876, { rename: 'Kingdom of Spain', member: '(Spanish Empire)' }], // Bourbon restoration Dec 1874
  ['Kingdom of Fiji', 1875, 1876, { rename: 'British Colonial Empire', member: '(British Empire)' }], // ceded to Britain Oct 1874
  ['French Indochina', 1860, 1899, { parts: [75, 10, 89, 23], rename: 'French India' }], // Pondicherry, Karikal, Yanam, Mahé, Chandernagore are French India, not Indochina
  ['French Indochina', 1860, 1899, { parts: [55, -22, 56, -20.5], rename: 'Réunion' }], // Réunion island
  ['French Indochina', 1860, 1899, { parts: [163, -23, 169, -20], rename: 'New Caledonia' }], // New Caledonia and the Loyalty Islands (French from 1853)
  ['French Indochina', 1860, 1899, { parts: [116, 38, 119, 41], rename: 'French concession of Tianjin' }], // Tianjin concession (1860/61)
  ['French Indochina', 1860, 1867, { rename: 'French Cochinchina' }], // only Cochinchina until 1867; the Indochinese Union was formed in 1887
  ['French India', 1800, 1804, { member: '(French Consulate)' }], // France was not a kingdom 1792–1814
  ['French India', 1805, 1814, { member: '(First French Empire)' }], // Napoleonic Empire
  ['French India', 1815, 1847, { member: '(Bourbon Kingdom of France)' }], // restored French monarchy
  // --- Southeast Asia ---
  ['Cambodia', 1800, 1802, { rename: 'Nguyễn dynasty' }], // the Mekong delta (Gia Định) was held by Nguyễn Ánh from 1788
  ['Kingdom of Cambodia', 1863, 1867, { member: '(Second French Empire)' }], // French protectorate from 1863
  ['Sultanate of Malacca', 1800, 1829, { parts: [107, -9, 111, -6], rename: 'Surakarta Sunanate' }], // the Java piece is Banyumas (Surakarta land until 1830); Malacca fell in 1511
  ['Sultanate of Malacca', 1830, 1860, { parts: [107, -9, 111, -6], rename: 'Dutch East Indies', member: '(Netherlands)' }], // Banyumas annexed by the Dutch after the Java War, 1830
  // --- South Asia ---
  ['Mughal Empire', 1805, 1856, { parts: [68, 22, 76.5, 31], rename: 'Rajput states' }], // the 240k block is Rajputana; the Mughals held only Delhi (kept as the 77.3E piece)
  ['Talpur Dynasty', 1843, 1845, { parts: [66, 23, 72, 30], rename: 'British Empire', member: '(British Empire)' }], // Sindh annexed by Britain in 1843 (Miani)
  ['Talpur Dynasty', 1840, 1894, { parts: [70, 33, 77, 38], rename: 'Dardistan' }], // the 34–37N/71–76E shape is Gilgit/Hunza/Chitral (Dard principalities), not Sindh
  // --- Arabia ---
  ['Bahrain', 1820, 1829, { rename: 'Bani Khalid Emirate' }], // the 73k shape is al-Hasa (Bani Khalid until Saudi conquest 1830); Bahrain itself is House of Khalifa
  ['Bahrain', 1840, 1845, { drop: true }], // al-Hasa, already covered by Emirate of Nejd 1830–1845
  // --- Africa ---
  ['Napoleonic Batavia Republic', 1803, 1805, { rename: 'Dutch Cape Colony', member: '(Batavian Republic)' }], // the Cape went back to the Batavian Republic under the 1802 Peace of Amiens
  ['British Cape Colony', 1803, 1805, { parts: [15, -36, 30, -25], drop: true }], // overlapped the Batavian Cape; Britain retook it in Jan 1806
  ['Kamerun', 1868, 1870, { rename: 'Duala chiefdoms' }], // only a German trading post (Woermann 1868); a German protectorate only from July 1884
  ['German Africa', 1871, 1883, { rename: 'Duala chiefdoms' }], // same Douala piece before the 1884 protectorate
  ['Kingdom of Belgium', 1885, 1899, { parts: [11, -7, 15, -4], rename: 'Congo Free State' }], // the lower Congo was Leopold II's personal state, not Belgian until 1908
  ['Belgian Congo', 1890, 1907, { rename: 'Congo Free State' }], // Congo Free State 1885–1908
  ['British Africa', 1885, 1899, { parts: [20, 10, 40, 33], rename: 'Khedivate of Egypt', member: '' }], // Egypt stayed a Khedivate (Ottoman vassal, British-occupied from 1882)
  ['People\'s Republic of Zanzibar', 1856, 1889, { rename: 'Sultanate of Zanzibar' }], // "People's Republic" dates from 1964
  ['Omani Slave Coast', 1814, 1855, { rename: 'Sultanate of Oman' }], // Omani East Africa (Said moved his capital to Zanzibar in 1840)
  ['Natalia Republic', 1843, 1910, { rename: 'Colony of Natal', member: '(British Empire)' }], // Boer Natalia 1839–1843, then British Natal until the Union of 1910
  ['Free Orange State', 1856, 1899, { rename: 'Orange Free State' }], // standard English name
  // --- Japan ---
  ['Tokugawa Shogunate', 1868, 1869, { drop: true }], // overlaps Empire of Japan 1868–69; the shogunate ended in Nov 1867 (Meiji Restoration)
]
