// Historical fixes for Cliopatria rows alive 1500–1799. Format: [name, from, to, action] (see scripts/history-fixes.mjs).
export default [
  // --- Holy Roman Empire memberships (continuing the 1000–1499 reviewer's restorations; rows 1500+ lack them) ---
  ['Electorate of Brandenburg', 1500, 1618, { member: '(Holy Roman Empire)' }], // prince-elector of the Empire
  ['Duchy of Bavaria', 1500, 1805, { member: '(Holy Roman Empire)' }], // imperial duchy (electorate from 1623) until 1806
  ['Electorate of Saxony', 1500, 1805, { member: '(Holy Roman Empire)' }], // prince-elector of the Empire
  ['Electorate of Trier', 1500, 1618, { member: '(Holy Roman Empire)' }], // ecclesiastical elector
  ['Electorate of Hanover', 1709, 1802, { member: '(Holy Roman Empire)' }], // ninth electorate, 1692/1708
  ['Duchy of Milan', 1500, 1539, { member: '(Holy Roman Empire)' }], // imperial fief (Imperial Italy)
  ['Duchy of Lorraine', 1500, 1542, { member: '(Holy Roman Empire)' }], // in the Empire until the Treaty of Nuremberg 1542 made it 'free and unincorporated'
  ['Republic of Florence', 1500, 1737, { member: '(Holy Roman Empire)' }], // Florence/Tuscany was an imperial fief (Imperial Italy)
  ['Principality of Orange', 1500, 1571, { member: '(Holy Roman Empire)' }], // imperial principality (Kingdom of Arles)
  ['Duchy of Savoy', 1500, 1539, { member: '(Holy Roman Empire)' }], // imperial duchy (renamed from County of Savoy by the earlier fixes)
  ['House of Savoy', 1564, 1720, { member: '(Holy Roman Empire)' }], // Duchy of Savoy-Piedmont, imperial fief
  ['Kingdom of Bohemia', 1500, 1528, { member: '(Holy Roman Empire);(Kingdom of Bohemia)' }], // Bohemia was an electorate of the Empire
  ['Duchy of Styria', 1500, 1501, { member: '(Holy Roman Empire)' }], // Habsburg duchy within the Empire
  ['Principality of Liechtenstein', 1721, 1806, { member: '(Holy Roman Empire)' }], // imperial principality from 1719 until 1806

  // --- Continuations from the 1000–1499 reviewer ---
  ['Mahdids', 1500, 1506, { rename: 'Nabhani Dynasty' }], // polygon is in Oman (23,59), which the Nabhani ruled; Mahdids were in Yemen
  ['Kapisa', 1500, 1506, { rename: 'Timurid Empire' }], // Kabul under the Timurid Ulugh Beg Mirza, then Babur from 1504; same shape as Timurid Empire 1507–1511

  // --- Steppe / Russia ---
  ['Golden Horde', 1547, 1635, { rename: 'Northern Yuan' }], // Golden Horde/Great Horde ended 1502; these rows are Khalkha Mongolia under the Northern Yuan
  ['Golden Horde', 1636, 1695, { rename: 'Khalkha Mongols' }], // after Ligdan Khan's death (1634) the Khalkha khanates were separate; submitted to Qing 1691
  ['Astrakhan Khanate', 1642, 1768, { rename: 'Don Cossacks' }], // Russia conquered Astrakhan in 1556; this shape continues the Don Cossacks rows (1636–1641, same 126k @49,42)

  // --- Poland / Prussia ---
  ['House of Jagiellon', 1500, 1568, { rename: 'Poland-Lithuania', member: '(Polish-Lithuania Kingdom)' }], // continues the 1000–1499 reviewer's rename: Jagiellonian personal union of Poland and Lithuania
  ['House of Jagiellon', 1569, 1571, { rename: 'Polish-Lithuanian Commonwealth' }], // Union of Lublin, 1569
  ['Brandenburg-Prussia', 1702, 1717, { drop: true }], // duplicate of Kingdom of Prussia rows 1702–1720 (same shape)
  ['Brandenburg-Prussia', 1701, 1701, { rename: 'Kingdom of Prussia' }], // Frederick I crowned King in Prussia, Jan 1701

  // --- British Isles ---
  ['Kingdom of England', 1707, 1708, { rename: 'Kingdom of Great Britain', member: '(British Empire)' }], // Acts of Union, 1 May 1707
  ['Kingdom of England', 1558, 1563, { parts: [1.4, 50.6, 2.6, 51.3], drop: true }], // Calais lost to France, Jan 1558
  ['Kingdom of England', 1663, 1690, { parts: [1.4, 50.6, 2.6, 51.3], drop: true }], // Dunkirk sold to France 1662
  ['County of Auvergne', 1500, 1501, { drop: true }], // this 1k piece is Calais, already drawn inside Kingdom of England
  ['Commonwealth of England', 1645, 1648, { rename: 'Parliamentarian England' }], // Commonwealth declared 1649 after Charles I's execution; 1645–48 is the Civil War
  ['Commonwealth of England', 1661, 1661, { rename: 'Kingdom of England', member: '(Kingdom of England)' }], // Restoration, May 1660
  ['English Colonial Empire', 1709, 1712, { drop: true }], // duplicate of British Colonial Empire 1709–1712 (same shape)
  ['English Colonial Empire', 1707, 1708, { rename: 'British Colonial Empire', member: '(British Empire)' }], // colonies became British in 1707
  ['English Colonial Empire', 1713, 1779, { rename: 'British Colonial Empire', member: '(British Empire)' }], // Madras (Fort St George), British after 1707

  // --- Americas ---
  ['Haiti', 1792, 1802, { rename: 'Saint-Domingue' }], // Haiti declared independence 1 Jan 1804; until then the French colony Saint-Domingue
  ['New France', 1616, 1621, { parts: [-47, -5, -42, -1], rename: 'Spanish Empire', member: '(Spanish Empire)' }], // France Équinoxiale (São Luís) taken by Portugal (Iberian Union) 1615
  ['New France', 1622, 1625, { parts: [-47, -5, -42, -1], drop: true }], // same, already covered by Spanish Empire rows
  ['New France', 1769, 1779, { parts: [-96, 28, -87, 45], drop: true }], // Louisiana ceded 1762 (Spain took over by 1769), Illinois east bank British 1763; covered by those rows
  ['New France', 1763, 1791, { rename: 'First French colonial empire' }], // New France (Canada) ended 1763; remaining rows are Saint-Domingue, Antilles, Guiana, Senegal
  ['New Netherland', 1622, 1802, { parts: [-62, 1, -50, 9.5], rename: 'Dutch Guiana' }], // Suriname/Essequibo/Berbice pieces
  ['New Netherland', 1622, 1654, { parts: [-42, -12, -33, -2], rename: 'Dutch Brazil' }], // Dutch Brazil 1630–1654
  ['New Netherland', 1655, 1669, { parts: [-42, -12, -33, -2], drop: true }], // Dutch left Brazil Jan 1654
  ['New Netherland', 1622, 1802, { parts: [-71, 10.5, -60, 19], rename: 'Dutch West Indies' }], // Curaçao, Aruba, Bonaire, Sint Eustatius, Tobago
  ['New Netherland', 1665, 1669, { parts: [-77, 38, -70, 45], rename: 'English Colonial Empire', member: '(Kingdom of England)' }], // New Amsterdam became New York, 1664

  // --- Italy ---
  ['Republic of Florence', 1532, 1568, { rename: 'Duchy of Florence' }], // Alessandro de' Medici made Duke 1532
  ['Republic of Florence', 1569, 1737, { rename: 'Grand Duchy of Tuscany' }], // Grand Duchy of Tuscany from 1569
  ['Kingdom of Spain', 1720, 1733, { parts: [12, 36.5, 16, 38.6], rename: 'Habsburg Monarchy', member: '(Habsburg Monarchy)' }], // Sicily Austrian 1720–1734 (Treaty of The Hague)
  ['Kingdom of Spain', 1721, 1733, { parts: [8, 38.5, 10, 41.5], drop: true }], // Sardinia Savoyard from 1720; duplicate of Kingdom of Sardinia
  ['Kingdom of Spain', 1735, 1761, { parts: [13, 37.8, 19, 42.3], rename: 'Kingdom of Naples', member: '' }], // Bourbon Naples a separate kingdom from 1735 (Charles, then Ferdinand IV)
  ['Kingdom of Spain', 1762, 1777, { parts: [13, 37.8, 19, 42.3], drop: true }], // same land already drawn by the Naples row
  ['Kingdom of Spain', 1735, 1747, { parts: [9, 44.3, 10.8, 45.3], rename: 'Habsburg Monarchy', member: '(Habsburg Monarchy)' }], // Parma Austrian 1735–1748
  ['Kingdom of Spain', 1748, 1802, { parts: [9, 44.3, 10.8, 45.3], rename: 'Duchy of Parma and Piacenza', member: '' }], // Bourbon-Parma a separate duchy from 1748 (Aachen)
  ['Kingdom of Naples (Napoleonic)', 1762, 1805, { rename: 'Kingdom of Naples' }], // Napoleonic Naples only 1806–1815; before that Bourbon Naples
  ['Kingdom of Spain', 1529, 1555, { parts: [12, 46, 19.5, 52.5], rename: 'Habsburg Monarchy', member: '(Habsburg Monarchy)' }], // Austria/Bohemia/Lusatia under Ferdinand I, not the Spanish crown
  ['Swiss Confederation', 1798, 1798, { rename: 'Helvetic Republic' }], // Helvetic Republic proclaimed April 1798
  ['Helvetic Republic', 1803, 1814, { rename: 'Swiss Confederation' }], // Act of Mediation 1803 ended the Helvetic Republic
  ['Sultanate of Palembang', 1500, 1658, { rename: 'Palembang' }], // the sultanate was proclaimed c. 1659; before that a port polity under Javanese overlords
  ['County of Urgell', 1500, 1808, { rename: 'Principality of Andorra' }], // this 0k piece is Andorra (co-principality since the 1278 paréage); Urgell county was absorbed 1413

  // --- Scandinavia / Caucasus ---
  ['Swedish Empire', 1722, 1814, { rename: 'Kingdom of Sweden' }], // the Swedish Empire (great-power era) ended at Nystad 1721
  ['Kingdom of Georgia', 1490, 1578, { rename: 'Kingdom of Kartli' }], // Georgia split into Kartli, Kakheti, Imereti c. 1490; this shape is Kartli
  ['Kingdom of Georgia', 1706, 1761, { rename: 'Kingdom of Kartli' }], // still Kartli (continues Kingdom of Kartli rows to 1705); united with Kakheti 1762

  // --- South Asia ---
  ['Lodi Dynasty', 1526, 1528, { rename: 'Mughal Empire', member: '' }], // Babur defeated Ibrahim Lodi at Panipat, April 1526
  ['Sur Empire', 1564, 1594, { rename: 'Karrani Sultanate' }], // Sur rule ended 1556; Bengal/Orissa under the Afghan Karrani dynasty and its remnants
  ['Ahmadnagar Sultanate', 1637, 1652, { rename: 'Mughal Empire' }], // annexed by Shah Jahan 1636
  ['Gorkha Kingdom', 1769, 1787, { rename: 'Nepal' }], // Prithvi Narayan Shah took Kathmandu 1768; Gorkha became the Kingdom of Nepal

  // --- East Asia ---
  ['Maynila', 1521, 1599, { rename: 'Ryukyu Kingdom' }], // shape is Okinawa (26,128), continuing Ryukyu Kingdom rows; Ryukyu lasted to 1879
  ['Later Jin Dynasty', 1636, 1644, { rename: 'Qing Dynasty' }], // Hong Taiji proclaimed the Qing dynasty 1636
  ['Southern Ming', 1662, 1672, { rename: 'Kingdom of Tungning' }], // Yongli emperor executed 1662; Taiwan held by Zheng family's Tungning
  ['Southern Ming', 1673, 1682, { parts: [119, 21.5, 122.5, 26], rename: 'Kingdom of Tungning' }], // Taiwan piece: Tungning to 1683
  ['Southern Ming', 1673, 1682, { rename: 'Revolt of the Three Feudatories' }], // Wu Sangui's revolt 1673–1681, not the Ming

  // --- Southeast Asia ---
  ['Konbaung Dynasty', 1741, 1756, { rename: 'Hanthawaddy Kingdom' }], // Restored Hanthawaddy (Pegu) 1740–1757; Konbaung founded 1752 in the north
  ['First Toungoo Empire', 1752, 1756, { rename: 'Konbaung Dynasty' }], // Ava fell to Hanthawaddy 1752; Upper Burma then held by Alaungpaya (Konbaung)
  ['Đại Việt', 1653, 1682, { parts: [108, 10.5, 110, 13], rename: 'Champa' }], // Panduranga (rump Champa) piece, independent/vassal to 1832
  ['Đại Việt', 1683, 1833, { rename: 'Champa' }], // same Panduranga piece (12,109)
  ['Đại Việt', 1529, 1677, { rename: 'Mạc dynasty' }], // Mạc usurped 1527; held Cao Bằng until 1677
  ['Đại Việt', 1678, 1682, { rename: 'Trịnh lords' }], // Cao Bằng retaken by Lê–Trịnh 1677
  ['Nguyễn dynasty', 1791, 1802, { rename: 'Nguyễn lords' }], // Gia Long founded the Nguyễn dynasty 1802; before that Nguyễn Ánh's Gia Định realm
  ['Khmer Empire', 1500, 1867, { rename: 'Kingdom of Cambodia' }], // Angkor-era Khmer Empire ended 1431; post-Angkor Kingdom of Cambodia (matches the 'Cambodia' rows)
  ['Kingdom of Pajana', 1572, 1587, { rename: 'Pajang Sultanate' }], // misspelling: Pajang
  ['Sultan of Yogyakarta', 1744, 1754, { rename: 'Mataram Sultanate' }], // Yogyakarta created by the Treaty of Giyanti 1755
  ['Sultan of Yogyakarta', 1755, 1829, { rename: 'Sultanate of Yogyakarta' }], // name fix
  ['Portuguese Ceylon', 1659, 1686, { rename: 'Dutch Ceylon', member: '(Dutch Republic)' }], // Dutch took Colombo 1656 and Jaffna 1658

  // --- Africa / Indian Ocean ---
  ['Kingdom of Kongo', 0, 1669, { extend: 1708 }], // Kongo survived its civil war after Mbwila (1665), reunited 1709
  ['Kingdom of Lunda', 1709, 1889, { rename: 'Kingdom of Kongo' }], // shape sits on Kongo (-6,14); Lunda was far inland (~-8,23)
  ['Saadi Sultanate', 1670, 1740, { drop: true }], // Saadi dynasty ended 1659; Alaouite Morocco row covers the land
  ['French India', 1673, 1809, { parts: [54.5, -21.7, 58, -19.8], rename: 'Isle de France and Bourbon' }], // Réunion (French 1642/1665) and Mauritius (French 1715) are Mascarene islands, not India
  ['French India', 1677, 1814, { parts: [43, -13.2, 45.3, -11.3], rename: 'Comoro Sultanates', member: '' }], // Comoros not French until Mayotte 1841
  ['French India', 1677, 1740, { parts: [48.5, -17.5, 50.5, -14.5], drop: true }], // no French post in NE Madagascar 1674–1750 (Fort Dauphin abandoned 1674)

  // --- Pacific ---
  ['Kingdom of Hawaï\'i', 1791, 1894, { rename: 'Kingdom of Hawai\'i' }], // misspelling (matches 'Republic of Hawai\'i')
]
