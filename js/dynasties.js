/* ============================================================
   histoviz — Dynasties & kingdoms of Iran (Median → Pahlavi)
   window.DYNASTIES: ordered list used by the left navigator and
   by the dedicated Kingdom pages (fullpage.js). Rulers ("kings")
   and their coins are pulled from the existing event pages by id;
   each dynasty adds a period, colour, historical map and overview.
   ============================================================ */
window.DYNASTIES = [
 // ---------- Ancient (pre-Islamic) ----------
 { id:"median", era:"iron", group:"Ancient empires", name:"Median Kingdom", years:"c. 678–550 BCE", start:-678, end:-550,
   color:"#5a4a7e", capital:"Ecbatana (Hamadan)", eraYear:-600, kingIds:[],
   url:"https://en.wikipedia.org/wiki/Medes",
   map:"Median (empire) (kingdom) at its beginning.png",
   coins:[],
   body:[
    "The kingdom of the Medes (c. 678–550 BCE) was the first great Iranian-speaking power. From their capital at Ecbatana in the north-western Zagros, the Median kings united the tribes of the plateau and, in alliance with Babylon, destroyed the Assyrian Empire in 612 BCE.",
    "Much of what we know comes from Greek writers, especially Herodotus, and remains debated. The Median realm was absorbed around 550 BCE by its Persian kinsman Cyrus the Great, whose Achaemenid empire inherited and expanded it."
   ] },
 { id:"achaemenid", era:"ach", group:"Ancient empires", name:"Achaemenid Empire", years:"550–330 BCE", start:-550, end:-330,
   color:"#23408E", capital:"Pasargadae · Persepolis · Susa", eraYear:-500,
   kingIds:["e067","e073","e074","e082","e084","e085"],
   url:"https://en.wikipedia.org/wiki/Achaemenid_Empire",
   map:"Persian Empire, 490 BC-it.png",
   coins:["Achaemenid_coin_daric_420BC_front.jpg","AchaemenidDaric4thCenturyBCE.jpg"],
   body:[
    "The Achaemenid Empire (550–330 BCE), founded by Cyrus the Great, was the first world empire — the largest the earth had yet seen — uniting the Iranian plateau with Mesopotamia, Egypt, Anatolia and Central Asia under a single King of Kings.",
    "It was governed through satrapies, the Royal Road, a gold and silver coinage and a tolerant, multilingual bureaucracy, and raised the ceremonial capital of Persepolis. After two centuries of dominance it fell to Alexander the Great in 330 BCE."
   ] },
 { id:"seleucid", era:"hel", group:"Ancient empires", name:"Seleucid Empire", years:"312–63 BCE", start:-312, end:-63,
   color:"#4F6078", capital:"Seleucia · Antioch", eraYear:-280, kingIds:["e087"],
   url:"https://en.wikipedia.org/wiki/Seleucid_Empire",
   map:"Seleucid Empire (flat map) (green).png",
   coins:["Seleucos_I_Bucephalos_coin.jpg"],
   body:[
    "After Alexander's death his general Seleucus won the largest share of the empire, founding the Seleucid dynasty (312–63 BCE). From Mesopotamia it ruled Iran and the east, planting Greek cities, coinage and art across the plateau.",
    "Always overstretched, the Seleucids lost the Iranian lands to the rising Parthians by about 140 BCE, and Greek rule in Iran faded — though its coins and culture left a lasting mark."
   ] },
 { id:"parthian", era:"par", group:"Ancient empires", name:"Parthian (Arsacid) Empire", years:"247 BCE – 224 CE", start:-247, end:224,
   color:"#135F63", capital:"Ctesiphon · Nisa", eraYear:-100,
   kingIds:["e090","e091","e092"],
   url:"https://en.wikipedia.org/wiki/Parthian_Empire",
   map:"Map of the Parthian Empire and Kushan Empire.png",
   coins:["Coin_of_Arsaces_I_(1),_Nisa_mint.jpg","MithridatesIParthiaCoinHistoryofIran.jpg","Tetradrachm_of_Mithridates_II_of_Parthia,_minted_at_Seleucia_between_120_and_109_BC.jpg"],
   body:[
    "The Parthian or Arsacid Empire (247 BCE – 224 CE) was founded by the nomadic Parni chief Arsaces I and grew into a power that ruled Iran for almost five centuries. Masters of mounted archery and heavy cavalry, the Parthians controlled the Silk Road and held Rome at bay — most famously annihilating Crassus at Carrhae in 53 BCE.",
    "Ruling a loose, feudal realm from Ctesiphon, the Arsacids blended Iranian and Hellenistic culture and kept alive the heroic traditions later gathered into the Shahnameh, until they were overthrown by the Sasanians in 224 CE."
   ] },
 { id:"sasanian", era:"sas", group:"Ancient empires", name:"Sasanian Empire", years:"224–651 CE", start:224, end:651,
   color:"#8a6a1a", capital:"Ctesiphon", eraYear:500,
   kingIds:["e099","e101","e106","e107","e109","e112","e114","e118"],
   url:"https://en.wikipedia.org/wiki/Sasanian_Empire",
   map:"The Sasanian Empire from 600 A.D.-620 A.D.png",
   coins:["Dinar_of_Ardashir_I_(cropped).jpg","Gold_coin_of_Shapur_II,_struck_c._320.jpg","KhosrauIIGoldCoinCroppedHistoryofIran.jpg"],
   body:[
    "The Sasanian Empire (224–651 CE), founded by Ardashir I of Fars, was the last and one of the greatest of the pre-Islamic Persian empires — a superpower that rivalled Rome and Byzantium for four centuries.",
    "The Sasanians revived Achaemenid imperial ambition, built great cities, founded the academy of Gondishapur, and gave Zoroastrianism an official, codified form. Weakened by the long last war with Byzantium, the empire fell to the Arab-Muslim conquest at Qadisiyyah and Nahavand, ending with the death of Yazdegerd III in 651."
   ] },
 // ---------- Islamic-era (medieval) ----------
 { id:"tahirid", era:"later", group:"Medieval dynasties", name:"Tahirid Dynasty", years:"821–873 CE", start:821, end:873,
   color:"#6b7a3a", capital:"Nishapur", eraYear:850, kingIds:["e179"],
   url:"https://en.wikipedia.org/wiki/Tahirid_dynasty",
   map:"", coins:["TahiribnHusaynCoinHistoryofIran.jpg"],
   body:[
    "The Tahirids (821–873), founded by the general Tahir ibn Husayn, were the first effectively independent Iranian dynasty of the Islamic era, ruling Khorasan from Nishapur under nominal Abbasid overlordship.",
    "Their rise marks the beginning of the ‘Iranian Intermezzo’, the age in which local dynasties, rather than the distant caliphate, governed the plateau and revived Persian culture."
   ] },
 { id:"saffarid", era:"later", group:"Medieval dynasties", name:"Saffarid Dynasty", years:"861–1003 CE", start:861, end:1003,
   color:"#7a6a2e", capital:"Zaranj", eraYear:880, kingIds:["e180"],
   url:"https://en.wikipedia.org/wiki/Saffarid_dynasty",
   map:"Saffarid dynasty 861-1003-ar.png",
   coins:["Ya'qub_al-Layth's_Silver_Dirham.jpg"],
   body:[
    "The Saffarids (861–1003) rose from humble origins — their founder Ya'qub ibn al-Layth was a coppersmith from Sistan who carved out an empire by the sword and even threatened Baghdad.",
    "Fiercely proud of their Iranian roots, the Saffarids were among the first to patronise poetry in the New Persian language, a milestone in the revival of Persian letters."
   ] },
 { id:"samanid", era:"later", group:"Medieval dynasties", name:"Samanid Empire", years:"819–999 CE", start:819, end:999,
   color:"#2e7d6b", capital:"Bukhara", eraYear:950, kingIds:["e181"],
   url:"https://en.wikipedia.org/wiki/Samanid_Empire",
   map:"Samanid khorasan 900 ad.jpg",
   coins:["Coin of the Samanid ruler Nuh I, minted at Nishapur in 948 or 949.jpg"],
   body:[
    "The Samanid Empire (819–999), centred on Bukhara and Samarkand, was the greatest of the eastern Iranian dynasties and the cradle of the New Persian renaissance.",
    "Under the Samanids, Rudaki sang at court, the young Avicenna studied in the great library, and Persian literature and learning flourished as never before. Their silver dirhams flowed north along the Volga to fuel the trade of the Viking world."
   ] },
 { id:"ziyarid", era:"later", group:"Medieval dynasties", name:"Ziyarid Dynasty", years:"931–1090 CE", start:931, end:1090,
   color:"#5f7a86", capital:"Gorgan · Isfahan", eraYear:980, kingIds:["e182"],
   url:"https://en.wikipedia.org/wiki/Ziyarid_dynasty",
   map:"", coins:["Coin_of_Qabus,_minted_in_Jurjan_(Gorgan).jpg"],
   body:[
    "The Ziyarids (931–1090) were a minor Iranian dynasty of the Caspian region, best remembered for the learned prince Qabus ibn Wushmagir — patron of al-Biruni — and for his soaring brick tomb-tower, the Gonbad-e Qabus.",
    "The ‘Mirror for Princes’ known as the Qabus-nama, written by a Ziyarid ruler for his son, is a classic of Persian prose."
   ] },
 { id:"buyid", era:"later", group:"Medieval dynasties", name:"Buyid Dynasty", years:"934–1062 CE", start:934, end:1062,
   color:"#3f6aa0", capital:"Shiraz · Rayy · Baghdad", eraYear:980, kingIds:["e183"],
   url:"https://en.wikipedia.org/wiki/Buyid_dynasty",
   map:"Buyid Dynasty Flag Map.png",
   coins:["Adud_al-Dawla_medallion.jpg"],
   body:[
    "The Buyids (934–1062) were a Shia Iranian dynasty that dominated western Iran and Iraq, reducing the Abbasid caliphs to figureheads while ruling in their name.",
    "Under ‘Adud al-Dawla the Iranian ‘Intermezzo’ reached its cultural height, with great hospitals, libraries, observatories and the Band-e Amir dam in Fars."
   ] },
 { id:"ghaznavid", era:"later", group:"Medieval dynasties", name:"Ghaznavid Empire", years:"977–1186 CE", start:977, end:1186,
   color:"#9c6b2e", capital:"Ghazni", eraYear:1030, kingIds:["e184"],
   url:"https://en.wikipedia.org/wiki/Ghaznavids",
   map:"Map of the Ghaznavid Empire (drab).png",
   coins:["Mahmud of Ghazni Coin.jpg","Mahmud of Ghazni bilingual dirham.jpg"],
   body:[
    "The Ghaznavids (977–1186) were a Turko-Persian dynasty based at Ghazni in Afghanistan whose greatest ruler, Mahmud of Ghazni, led seventeen campaigns into India and carried Persianate court culture deep into the subcontinent.",
    "Mahmud's brilliant court drew the scholar al-Biruni and the poet Ferdowsi, whose Shahnameh was completed in this age."
   ] },
 { id:"seljuk", era:"later", group:"Medieval dynasties", name:"Great Seljuk Empire", years:"1037–1194 CE", start:1037, end:1194,
   color:"#b5651d", capital:"Isfahan · Nishapur", eraYear:1090,
   kingIds:["e185","e186","e187","e188"],
   url:"https://en.wikipedia.org/wiki/Seljuk_Empire",
   map:"Map of the Seljuk Empire (1092).png",
   coins:["TughrilCoin.jpg","Dinar_of_Muhammad_Alp_Arslan,_AH_455-465.jpg","Dinar_of_Malik_Shah_I,_AH_465-485.jpg"],
   body:[
    "The Great Seljuk Empire (1037–1194), founded by the Oghuz Turkish chief Tughril Beg, reunited the Iranian lands and the heart of the Islamic world under a single dynasty that embraced Persian administration and culture.",
    "Its golden age under Alp Arslan and Malik-Shah, guided by the great vizier Nizam al-Mulk, saw the victory at Manzikert that opened Anatolia to the Turks, the founding of the Nizamiyya colleges, and the Jalali calendar of Omar Khayyam."
   ] },
 { id:"khwarazmian", era:"later", group:"Medieval dynasties", name:"Khwarazmian Empire", years:"1077–1231 CE", start:1077, end:1231,
   color:"#7a4fa0", capital:"Gurganj · Samarkand", eraYear:1210,
   kingIds:["e189","e190"],
   url:"https://en.wikipedia.org/wiki/Khwarazmian_Empire",
   map:"Map of the Khwarazmian Empire.png",
   coins:["Dinar_of_'Ala_al-Din_Muhammad_II,_struck_at_the_Bukhara_mint.jpg"],
   body:[
    "The Khwarazmian Empire (c. 1077–1231) grew from a province into the last great Iranian-Islamic power before the Mongols, ruling from Central Asia across Iran to the borders of India.",
    "Its shah Ala ad-Din Muhammad II fatally provoked Genghis Khan, and the empire was annihilated by the Mongol invasion — though his son Jalal al-Din Mangburni fought on for a decade as Iran's bravest resistance leader."
   ] },
 { id:"ilkhanate", era:"later", group:"Medieval dynasties", name:"Ilkhanate (Mongol Iran)", years:"1256–1335 CE", start:1256, end:1335,
   color:"#8a3b3b", capital:"Tabriz · Soltaniyeh", eraYear:1300,
   kingIds:["e191","e192","e193"],
   url:"https://en.wikipedia.org/wiki/Ilkhanate",
   map:"Ilkhanate Map.png",
   coins:["GhazanCoin.jpg"],
   body:[
    "The Ilkhanate (1256–1335) was the Mongol state of Iran, founded by Hulagu Khan after he destroyed the Assassins at Alamut and sacked Baghdad, ending the Abbasid caliphate.",
    "Though its conquest was devastating, the later Ilkhans converted to Islam and, under Ghazan and Oljaitu with the vizier-historian Rashid al-Din, presided over a brilliant revival of Persian art, architecture and historiography."
   ] },
 { id:"timurid", era:"later", group:"Medieval dynasties", name:"Timurid Empire", years:"1370–1507 CE", start:1370, end:1507,
   color:"#3b6ea0", capital:"Samarkand · Herat", eraYear:1400,
   kingIds:["e194","e195","e196"],
   url:"https://en.wikipedia.org/wiki/Timurid_Empire",
   map:"Map of the Timurid Empire.png",
   coins:["Timurids._Ulugh_Beg_I._AH_850-853_AD_1447-1449._AR_Tanka_(25.5mm,_5.53_g,_3h)._Herat_mint._Dated_AH_852_AD_1448-9.jpg"],
   body:[
    "The Timurid Empire (1370–1507), founded by the conqueror Timur (Tamerlane), united Iran and Central Asia through brutal campaigns and then flowered into one of the great golden ages of Persian art and science.",
    "At Samarkand and Herat, under Shah Rukh, his queen Gawhar Shad, and the astronomer-king Ulugh Beg, the Timurids produced sublime architecture, miniature painting and the most accurate star catalogue since antiquity."
   ] },
 { id:"aqqoyunlu", era:"later", group:"Medieval dynasties", name:"Aq Qoyunlu (White Sheep)", years:"1378–1503 CE", start:1378, end:1503,
   color:"#a07a2e", capital:"Tabriz", eraYear:1470, kingIds:["e197"],
   url:"https://en.wikipedia.org/wiki/Aq_Qoyunlu",
   map:"Map Aq Qoyunlu 1478-en.png",
   coins:["Coin of Uzun Hasan, minted in Amed (Amid, Diyarbakır). Reverse.jpg","Aq Qoyunlu. Two AR tankas of Sultan Rustam.jpg"],
   body:[
    "The Aq Qoyunlu (‘White Sheep’) were a Turkmen tribal confederation that dominated western Iran, Azerbaijan and Iraq from Tabriz in the 15th century.",
    "Their greatest ruler, Uzun Hasan, defeated the Timurids and allied with Venice against the Ottomans. Through his daughter he was grandfather of Shah Ismail I, founder of the Safavid dynasty that supplanted his own."
   ] },
 // ---------- Early modern ----------
 { id:"safavid", era:"later", group:"Early-modern & modern", name:"Safavid Empire", years:"1501–1736 CE", start:1501, end:1736,
   color:"#2f6f8a", capital:"Tabriz · Qazvin · Isfahan", eraYear:1600,
   kingIds:["e198","e199","e200"],
   url:"https://en.wikipedia.org/wiki/Safavid_Iran",
   map:"Map of the Safavid Empire, circa 1630.png",
   coins:["Coin of Abbas I struck at the Zagam (Zagem) mint.jpg","Coin of Abbas III, struck at the Isfahan mint, dated 1732-1733.jpg"],
   body:[
    "The Safavid Empire (1501–1736), founded by Shah Ismail I, reunified Iran and made Twelver Shia Islam the state religion — a decision that set the country apart and shaped Iranian identity to this day.",
    "Under Shah Abbas the Great the empire reached its zenith, with a reformed army, flourishing silk trade and the incomparable capital of Isfahan, ‘half the world’, whose mosques and squares are among the masterpieces of Islamic art."
   ] },
 { id:"afsharid", era:"later", group:"Early-modern & modern", name:"Afsharid Empire", years:"1736–1796 CE", start:1736, end:1796,
   color:"#8a4b2e", capital:"Mashhad", eraYear:1745, kingIds:["e201"],
   url:"https://en.wikipedia.org/wiki/Afsharid_dynasty",
   map:"Revised Map of the Afsharid Empire.png",
   coins:["Coin of Nader Shah, minted in Daghestan (Dagestan).jpg"],
   body:[
    "The Afsharid dynasty (1736–1796) was the empire of Nader Shah, the military genius who rose from obscurity to expel Iran's invaders, seize the throne, and build the last great Iranian conquest-empire.",
    "His sack of Mughal Delhi in 1739 brought home fabulous plunder — including the Peacock Throne and the Koh-i-Noor and Darya-ye Noor diamonds — but his harsh rule collapsed into chaos after his assassination."
   ] },
 { id:"zand", era:"later", group:"Early-modern & modern", name:"Zand Dynasty", years:"1751–1794 CE", start:1751, end:1794,
   color:"#4e7a52", capital:"Shiraz", eraYear:1770, kingIds:["e202"],
   url:"https://en.wikipedia.org/wiki/Zand_dynasty",
   map:"Map of the Zand dynasty-ar.png",
   coins:["Coin_of_Karim_Khan_Zand,_minted_in_Isfahan.jpg"],
   body:[
    "The Zand dynasty (1751–1794) of Karim Khan gave Iran a rare interval of peace and good government after decades of turmoil. Famous for his humanity, Karim Khan refused the title of shah, styling himself only ‘Deputy of the People’.",
    "He made Shiraz his capital and adorned it with the Arg citadel, the Vakil bazaar and mosque and lovely gardens — a reign remembered with unusual affection."
   ] },
 { id:"qajar", era:"later", group:"Early-modern & modern", name:"Qajar Iran", years:"1789–1925 CE", start:1789, end:1925,
   color:"#9c3f6a", capital:"Tehran", eraYear:1850,
   kingIds:["e203","e204","e205","e206","e207"],
   url:"https://en.wikipedia.org/wiki/Qajar_dynasty",
   map:"Map of the Qajar Empire.png",
   coins:["Coin of Fath-Ali Shah Qajar, minted in Isfahan.jpg","Coin of Fath-Ali Shah Qajar, minted in Lahijan.jpg"],
   body:[
    "The Qajar dynasty (1789–1925) reunified Iran under Agha Mohammad Khan and made Tehran the capital, but ruled through an age of mounting European pressure.",
    "The Qajars lost the Caucasus to Russia, sold ruinous concessions to foreign powers, and faced the Tobacco Protest and the Constitutional Revolution of 1906 — the birth of modern Iranian politics — before the dynasty was deposed in 1925."
   ] },
 { id:"pahlavi", era:"later", group:"Early-modern & modern", name:"Pahlavi Dynasty", years:"1925–1979 CE", start:1925, end:1979,
   color:"#556070", capital:"Tehran", eraYear:1950,
   kingIds:["e208","e209"],
   url:"https://en.wikipedia.org/wiki/Pahlavi_dynasty",
   map:"Map of the Pahlavi state 1964-1980.png",
   coins:["Reza Shah Pahlavi 1938 silver coin.JPG"],
   body:[
    "The Pahlavi dynasty (1925–1979) was Iran's last monarchy. Reza Shah, a Cossack officer who seized power, drove a forceful programme of modernisation, secularisation and centralisation, building railways, a national army and the University of Tehran.",
    "His son Mohammad Reza Shah, restored to full power by the 1953 coup against Mossadegh and enriched by oil, pursued the ‘White Revolution’ but was swept away by the Islamic Revolution of 1979 — the point at which this atlas draws to a close."
   ] }
];
