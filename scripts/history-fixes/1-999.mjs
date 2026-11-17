// History fixes for AD 1–999 (Cliopatria). Format: [name, from, to, action], years inclusive.
export default [
  ['Great Yuan', -110, 50, { rename: 'Dayuan' }], // Ferghana state, Chinese "Dayuan"; "Great Yuan" reads as the Yuan dynasty
  ['Trưng sisters', 43, 50, { rename: 'Han Dynasty' }], // Trưng rising 40–43; Ma Yuan restored Han rule in 43
  ['Xiongnu', 93, 105, { rename: 'Xianbei' }], // Northern Xiongnu crushed 89–91; Xianbei occupied Mongolia from 93
  ['Parthian Empire', 224, 237, { rename: 'Sasanian Empire' }], // Ardashir defeated Artabanus IV in 224; Parthia ended
  ['Cao Cao', 220, 223, { rename: 'Cao Wei' }], // Cao Pi deposed the last Han emperor in 220, founding Cao Wei
  ['Han Dynasty', 224, 237, { rename: 'Eastern Wu' }], // Han ended 220; this southern polygon was held by Sun Quan's Wu
  ['Gallic Empire', 274, 282, { rename: 'Roman Empire' }], // Aurelian reconquered the Gallic Empire in 274
  ['Byeonhan', 300, 566, { rename: 'Gaya Confederacy' }], // Byeonhan developed into the Gaya confederacy (to 562)
  ['Western Jin', 317, 425, { rename: 'Eastern Jin' }], // Western Jin fell 316; the southern Jin of 317–420 is Eastern Jin
  ['Protectorate of the Western Regions', 330, 601, { rename: 'Tarim Basin city-states' }], // no Chinese protectorate in the Tarim from the 4th c. until Tang's Anxi (640)
  ['Hunnic Empire', 469, 673, { drop: true }], // Attila's empire collapsed after Nedao (454) and Dengizich's death (469); 0 km² remnant
  ['Himyarite Kingdom', 577, 601, { rename: 'Sasanian Empire' }], // Himyar ended c. 525; Yemen was a Sasanian province c. 570–628
  ['Kingdom of Axum', 577, 601, { parts: [42, 12, 55, 20], drop: true }], // Aksumite rule in Yemen ended with the Sasanian conquest c. 570; Yemen is drawn as Sasanian (renamed Himyarite piece)
  ['Karkota Dynasty', 592, 655, { parts: [64, 35.5, 72, 39], rename: 'Tokharistan principalities' }], // piece at 36.7°N 68.4°E is Tokharistan (Hephthalite remnants / Western Turkic yabghus); Karkota ruled Kashmir from c. 625
  ['Georgia', 567, 576, { rename: 'Kingdom of Lazica' }], // no "Georgia" before 1008; this is western Georgia (Lazica)
  ['Georgia', 638, 646, { rename: 'Principality of Iberia' }], // same polygon as Principality of Iberia (Kartli)
  ['Georgia', 724, 777, { rename: 'Principality of Abkhazia' }], // Abkhazian princes under Byzantine suzerainty
  ['Georgia', 778, 1007, { rename: 'Kingdom of Abkhazia' }], // Kingdom of Abkhazia 778–1008; unified Georgia only from 1008
  ['Kingdom of Italy', 587, 774, { rename: 'Lombard Kingdom' }], // Lombard kingdom 568–774 (Charlemagne took Pavia in 774)
  ['Frisia Kingdom', 612, 717, { rename: 'Kingdom of Alamannia' }], // polygon at 49°N 9°E = Alamannia (same shape as Alamannia 724–731), not Frisia
  ['Kingdom of Alamannia', 507, 731, { rename: 'Duchy of Alamannia' }], // Alamanni subjugated by Clovis c. 506; a Frankish duchy afterwards
  ['Teotihuacan', 656, 704, { drop: true }], // Teotihuacan's polity collapsed c. 550–650
  ['Goguryeo', 668, 673, { rename: 'Tang Dynasty' }], // Goguryeo fell to Silla–Tang in 668; Tang Protectorate to Pacify the East
  ['Goguryeo', 674, 681, { drop: true }], // 0 km² remnant after Goguryeo's fall
  ['Silla', 668, 681, { rename: 'Unified Silla' }], // Silla unification dated from 668
  ['Türgesh', 692, 744, { rename: 'Second Turkic Khaganate' }], // Mongolian polygon = Second Turkic Khaganate (682–744); Türgesh were in Zhetysu
  ['Türgesh', 745, 749, { rename: 'Uyghur Khaganate' }], // Uyghurs replaced the Turks in Mongolia in 744
  ['Turks', 692, 717, { rename: 'Türgesh' }], // Zhetysu polygon (43°N 75°E) = Türgesh khaganate (699–766)
  ['Carolingian Empire', 718, 723, { rename: 'Duchy of Provence', member: '' }], // small polygon in Provence; "Carolingian Empire" dates from 800
  ['Dál Riata', 750, 842, { rename: 'Pictland' }], // the 750–842 polygon covers Pictland; Óengus I ruled Dál Riata from 741
  ['Dál Riata', 843, 899, { rename: 'Kingdom of Alba' }], // Cináed mac Ailpín united Picts and Scots c. 843
  ['Kingdom of Kent', 534, 762, { extend: 784 }], // Kent kept its own kings until Offa annexed it c. 785
  ['Pyu City-States', 850, 1045, { drop: true }], // Pyu states ended c. 832 (Nanzhao raids); overlaps Pagan Kingdom
  ['Kingdom of Sobrarbe', 825, 829, { drop: true }], // legendary kingdom, not a historical state
  ['County of Ribagorza', 866, 1084, { rename: 'Kingdom of Pamplona' }], // polygon at 43°N 2°W is Pamplona/Navarre (Sancho III's growth 1028–39); Pamplona otherwise ends 865
  ['Magyars', 900, 910, { rename: 'Principality of Hungary' }], // the Hungarian conquest finished c. 900; avoids two Magyar polities
  ['Later Jin', 911, 921, { rename: 'Former Jin' }], // Li Keyong/Li Cunxu's Jin (907–923); Later Jin is 936–947
  ['Kingdom of Germany', 922, 961, { member: '' }], // the Holy Roman Empire begins with Otto I's coronation in 962
  ['Southern Wu', 937, 959, { rename: 'Southern Tang' }], // Wu became Southern Tang in 937
  ['Later Han', 951, 959, { rename: 'Later Zhou' }], // Guo Wei founded Later Zhou in 951
  ['Ngô Dynasty', 968, 1054, { rename: 'Đại Cồ Việt' }], // Ngô ended 965; Đinh/Early Lê/Lý state named Đại Cồ Việt 968–1054
  ['Ngô Dynasty', 1055, 1406, { rename: 'Đại Việt' }], // renamed Đại Việt in 1054 (Lý, Trần dynasties)
  ['Kingdom of Castile', 961, 1036, { rename: 'County of Castile' }], // Castile was a county until Ferdinand I became king (1037)
  ['Kingdom of Poland', 962, 1024, { rename: 'Duchy of Poland' }], // Bolesław I crowned the first king in 1025
  ['Barghawata Conference', 793, 1065, { rename: 'Barghawata Confederacy' }], // misspelling
  ['County of Blôis', 990, 1401, { rename: 'County of Blois' }], // misspelling
]
