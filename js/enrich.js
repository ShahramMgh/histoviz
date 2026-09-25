/* histoviz — enrichment (additive, keyed by event id)
 * Merged over base events in app.js. Photos hotlinked from Wikimedia Commons.
 * Each image: {file, alt, credit}. `file` is a real Commons File name; the app
 * builds the Special:FilePath URL. `gallery` powers the full-page photo archive
 * (gallery[0] is the hero); `img` is the side-panel thumbnail.
 */
window.ENRICH = {
 "e019": {
  "img": [
   { "file": "Ganj_Dareh_site.jpg", "alt": "Ganj Dareh", "credit": "The mound of Ganj Dareh, Kermanshah · Wikimedia Commons" }
  ],
  "body": [
   "Ganj Dareh (“Treasure Valley”) is a small aceramic Neolithic mound in the high Zagros near Kermanshah, occupied around 8200–7600 BCE. Its mud-brick houses, some two storeys tall, were rebuilt many times, and a fierce fire baked parts of the site — preserving architecture and clay artefacts unusually well.",
   "The goat bones show one of the earliest known shifts from hunting to managed herding: a slaughter pattern favouring young males, the signature of a herded flock. Ancient-DNA work published in 2016 found these early Zagros farmers were genetically distinct from the first farmers of Anatolia — evidence that agriculture in the eastern Fertile Crescent was a local development, not an import."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Ganj Dareh", "url": "https://www.iranicaonline.org/articles/ganj-dara" },
   { "label": "Broushaki et al., \"Early Neolithic genomes from the eastern Fertile Crescent\", Science (2016)", "url": "https://www.science.org/doi/10.1126/science.aaf7943" },
   { "label": "Wikipedia — Ganj Dareh", "url": "https://en.wikipedia.org/wiki/Ganj_Dareh" }
  ],
  "related": [ "e017", "e020", "e018" ]
 },

 "e020": {
  "body": [
   "Ali Kosh is an early farming village on the Deh Luran plain, the lowland edge of the Zagros in Ilam, occupied from roughly 7500 BCE. Excavations by Frank Hole, Kent Flannery and James Neely in the 1960s produced one of the most influential studies of early agriculture anywhere, tracing the shift from gathering wild seeds to cultivating emmer wheat and barley and herding goats.",
   "Careful sieving of the deposits recovered charred seeds and tiny animal bones that let the excavators reconstruct diet and environment season by season — a method that became a model for archaeology across the Near East."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Deh Luran", "url": "https://www.iranicaonline.org/articles/deh-luran" },
   { "label": "Wikipedia — Ali Kosh", "url": "https://en.wikipedia.org/wiki/Ali_Kosh" }
  ],
  "related": [ "e019", "e021", "e017" ]
 },

 "e026": {
  "img": [
   { "file": "Tepe_Sialk,_Kashan,_Irán,_2016-09-19,_DD_24.jpg", "alt": "Tepe Sialk", "credit": "The stepped southern mound of Tepe Sialk, Kashan · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Tepe_Sialk,_Kashan,_Irán,_2016-09-19,_DD_24.jpg", "alt": "Tepe Sialk mound", "credit": "The stepped southern mound of Tepe Sialk, Kashan · Wikimedia Commons" },
   { "file": "Tepe_Sialk,_Kashan,_Irán,_2016-09-19,_DD_23.jpg", "alt": "Tepe Sialk", "credit": "Tepe Sialk archaeological site, Kashan · Wikimedia Commons" },
   { "file": "Tepe_Sialk,_Kashan,_Irán,_2016-09-19,_DD_25.jpg", "alt": "Tepe Sialk", "credit": "Tepe Sialk archaeological site, Kashan · Wikimedia Commons" },
   { "file": "Sialk_pot.jpg", "alt": "Sialk painted pottery", "credit": "Painted pottery from Tepe Sialk · Wikimedia Commons" },
   { "file": "Céramiques_de_Tepe_Sialk_-_musée_du_Louvre.jpg", "alt": "Sialk ceramics, Louvre", "credit": "Sialk ceramics, Musée du Louvre · Wikimedia Commons" },
   { "file": "Bridge-spouted_Painted_Vase_LACMA_M.47.2.2_(1_of_3).jpg", "alt": "Bridge-spouted painted vase", "credit": "Bridge-spouted painted vase, Sialk style, LACMA · Wikimedia Commons" }
  ],
  "body": [
   "Tepe Sialk, on the edge of Kashan beside the springs that still feed the Fin Garden, holds one of the longest cultural sequences on the central Iranian plateau — from a 6th-millennium BCE village through to the early 1st millennium BCE. Roman Ghirshman’s excavations of 1933–37 made it a reference point for the whole prehistory of the region.",
   "Sialk is famous above all for its painted pottery: fine buff and red wares decorated with ibex, birds and geometric friezes, and later black-on-red vessels with long-spouted “teapot” forms. A stepped mud-brick platform on the southern mound is popularly called the Sialk “ziggurat”, though its date and function are debated. Later cemeteries yielded weapons and grey ware linked to the arrival of early Iranian-speaking groups."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Sialk", "url": "https://www.iranicaonline.org/articles/sialk-tepe" },
   { "label": "Wikipedia — Tepe Sialk", "url": "https://en.wikipedia.org/wiki/Tepe_Sialk" }
  ],
  "related": [ "e029", "e022", "e033" ]
 },

 "e028": {
  "img": [
   { "file": "Choghamish-edited.jpg", "alt": "Chogha Mish", "credit": "The mound of Chogha Mish, Khuzestan · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Choghamish-edited.jpg", "alt": "Chogha Mish site", "credit": "The mound of Chogha Mish, Khuzestan · Wikimedia Commons" },
   { "file": "Ceramic_pot_-_Chogha_Mish_-_5200_-_4200_BC_-_National_museum_of_Iran_-_Inventory_number_7032.JPG", "alt": "Chogha Mish ceramic pot", "credit": "Painted pot, Chogha Mish, c. 5200–4200 BCE, National Museum of Iran · Wikimedia Commons" },
   { "file": "Musicians_portrayed_on_pottery_found_at_Chogha_Mish_archeological_site.jpg", "alt": "Chogha Mish musicians", "credit": "Musicians and a seated ruler drawn from finds at Chogha Mish · Wikimedia Commons" }
  ],
  "body": [
   "Chogha Mish was the dominant centre of the Susiana plain for millennia before Susa rose to prominence, with occupation reaching back to the 7th millennium BCE. Excavations by Pinhas Delougaz and Helene Kantor exposed a deep sequence of painted-pottery villages growing into a substantial town.",
   "By the Late Uruk period Chogha Mish was a place of administration and early record-keeping: cylinder seals, sealings and numerical clay tablets point to an accounting system on the eve of writing. One drawing recovered from the site — a seated ruler with attendants and, on painted pottery, a group of musicians — is among the earliest depictions of music-making in Iran."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Čoḡā Miš", "url": "https://www.iranicaonline.org/articles/coga-mis" },
   { "label": "Wikipedia — Chogha Mish", "url": "https://en.wikipedia.org/wiki/Chogha_Mish" }
  ],
  "related": [ "e032", "e021", "e035" ]
 },

 "e029": {
  "body": [
   "Cheshmeh Ali (“Ali’s Spring”) is a prehistoric mound at Rey, on the southern edge of modern Tehran, that gives its name to a distinctive 5th-millennium BCE painted ware. The fine red-slipped pottery, decorated in black with ibex, birds and hatched geometric bands, is a hallmark of the Chalcolithic on the north-central plateau.",
   "Excavated by Erich Schmidt in the 1930s, the site sits by a spring that has drawn people since deep prehistory and remained important into the Islamic period."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Čašma-ye ʿAli", "url": "https://www.iranicaonline.org/articles/casma-ali-tepe" },
   { "label": "Wikipedia — Cheshmeh Ali (Ray)", "url": "https://en.wikipedia.org/wiki/Cheshmeh_Ali_(Ray)" }
  ],
  "related": [ "e026", "e031" ]
 },

 "e032": {
  "img": [
   { "file": "Iran_époque_d'Obeid_Sèvres.jpg", "alt": "Susa I painted goblet", "credit": "Susa I painted goblet, 4th millennium BCE, Sèvres · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Iran_époque_d'Obeid_Sèvres.jpg", "alt": "Susa I painted goblet", "credit": "Susa I painted goblet, 4th millennium BCE, Sèvres · Wikimedia Commons" },
   { "file": "S03_06_01_017_image_2344.jpg", "alt": "Ruins of Susa", "credit": "Ruins of Susa (Brooklyn Museum Archives, Goodyear Collection) · Wikimedia Commons" },
   { "file": "Susa,_Middle-Elamite_basrelief_of_warrior_gods_1600-1100_BCE.jpg", "alt": "Elamite warrior gods relief", "credit": "Middle-Elamite relief of warrior gods, Susa, 1600–1100 BCE · Wikimedia Commons" },
   { "file": "Archers_frieze_Darius_1st_Palace_Suse_Louvre_AOD_488_a.jpg", "alt": "Archers frieze from Susa", "credit": "Glazed-brick archers from Darius’ palace at Susa, Louvre · Wikimedia Commons" }
  ],
  "body": [
   "Susa rose on the Susiana plain around 4200 BCE and remained inhabited for roughly six millennia, making it one of the longest-lived cities on Earth. Its founders raised a great mud-brick platform and buried their dead in a vast cemetery, accompanied by thin-walled “Susa I” beakers painted with elongated ibex, running dogs and wading birds — masterpieces of prehistoric ceramic art now in the Louvre.",
   "Susa later became the lowland capital of Elam and a royal seat of the Achaemenid Persians, a hinge between the Mesopotamian and Iranian worlds. Darius I built a palace here whose walls were faced with glazed-brick friezes of archers and lions. It was inscribed as a UNESCO World Heritage Site in 2015."
  ],
  "refs": [
   { "label": "UNESCO — Susa", "url": "https://whc.unesco.org/en/list/1455" },
   { "label": "Encyclopædia Iranica — Susa", "url": "https://www.iranicaonline.org/articles/susa-index" },
   { "label": "Wikipedia — Susa", "url": "https://en.wikipedia.org/wiki/Susa" }
  ],
  "related": [ "e038", "e064", "e053" ]
 },

 "e033": {
  "img": [
   { "file": "Tepe_hissar.jpg", "alt": "Tepe Hissar", "credit": "The mound of Tepe Hissar, Damghan · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Tepe_hissar.jpg", "alt": "Tepe Hissar site", "credit": "The mound of Tepe Hissar, Damghan · Wikimedia Commons" },
   { "file": "Painted_Redware_from_Tepe_Hissar_in_modern_day_Iran_4000_BCE_Ceramic.jpg", "alt": "Tepe Hissar painted redware", "credit": "Painted redware, Tepe Hissar (period IB), c. 4000 BCE · Wikimedia Commons" },
   { "file": "Keramikkanne_aus_Iran,_Tappe_Hesar,_Schicht_III,_2300-1900_v.C.jpg", "alt": "Tepe Hissar III jug", "credit": "Grey-ware jug, Tepe Hissar III, c. 2300–1900 BCE · Wikimedia Commons" },
   { "file": "Figurine_aus_Iran,_Tappe_Hesar,_Schicht_III,_Alabaster,_2300-1900_v.C._(2).jpg", "alt": "Tepe Hissar alabaster figurine", "credit": "Alabaster figurine, Tepe Hissar III · Wikimedia Commons" }
  ],
  "body": [
   "Tepe Hissar stands on the road to Khorasan near Damghan, a long-lived town occupied from about 4000 to 1900 BCE. Erich Schmidt’s excavations in 1931–32 traced its rise from a painted-pottery village to a metalworking centre on one of the plateau’s great east–west arteries.",
   "Its later levels are known for burnished grey ware, fine copper and silver objects, and evidence of contact stretching to Central Asia and Mesopotamia — a picture of the plateau’s Bronze Age towns as busy hubs of craft and exchange rather than isolated villages."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Hesar, Tepe", "url": "https://www.iranicaonline.org/articles/hesar-tepe" },
   { "label": "Wikipedia — Tepe Hissar", "url": "https://en.wikipedia.org/wiki/Tepe_Hissar" }
  ],
  "related": [ "e026", "e050", "e036" ]
 },

 "e034": {
  "img": [
   { "file": "Cuenco_de_Cerámica_(Godin_Tepe,_Irán)_-_MARQ.jpg", "alt": "Godin Tepe painted bowl", "credit": "Painted bowl, Godin Tepe, MARQ (Alicante) · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Cuenco_de_Cerámica_(Godin_Tepe,_Irán)_-_MARQ.jpg", "alt": "Godin Tepe painted bowl", "credit": "Painted bowl, Godin Tepe level III, MARQ (Alicante) · Wikimedia Commons" },
   { "file": "Sello_cilíndrico_-_MARQ.jpg", "alt": "Godin Tepe cylinder seal", "credit": "Cylinder seal, Godin Tepe, c. 3200–3000 BCE, MARQ · Wikimedia Commons" },
   { "file": "Vaso_con_decoración_pintada_(Godin_Tepe,_Irán)_-_MARQ.jpg", "alt": "Godin Tepe painted vessel", "credit": "Painted vessel, Godin Tepe, MARQ (Alicante) · Wikimedia Commons" }
  ],
  "body": [
   "Godin Tepe commands the Kangavar valley on the high road between the Mesopotamian lowlands and the Iranian plateau. During the Late Uruk period around 3500–3100 BCE it held a walled compound that looks like a fortified trading post, where lowland merchants kept accounts with clay tokens and numerical tablets.",
   "Godin is best known for chemistry: residues in its storage jars provided some of the earliest chemical evidence anywhere for both barley beer and resinated grape wine, pushing the documented history of these drinks back into the 4th millennium BCE."
  ],
  "refs": [
   { "label": "Royal Ontario Museum — Godin Tepe", "url": "https://www.rom.on.ca/en/exhibitions-galleries/galleries/world-cultures/wine" },
   { "label": "Wikipedia — Godin Tepe", "url": "https://en.wikipedia.org/wiki/Godin_Tepe" }
  ],
  "related": [ "e027", "e035", "e022" ]
 },

 "e036": {
  "img": [
   { "file": "National_Museum_of_Iran_Darafsh_(128).JPG", "alt": "Chlorite vessel from Kerman", "credit": "Carved chlorite vessel, Kerman region, 3rd millennium BCE, National Museum of Iran · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "National_Museum_of_Iran_Darafsh_(128).JPG", "alt": "Chlorite vessel", "credit": "Carved chlorite vessel, Kerman region, 3rd millennium BCE, National Museum of Iran · Wikimedia Commons" },
   { "file": "Tablilla_del_periodo_protoelamita_-_MARQ.jpg", "alt": "Proto-Elamite tablet", "credit": "Proto-Elamite tablet from Tepe Yahya, MARQ (Alicante) · Wikimedia Commons" }
  ],
  "body": [
   "Tepe Yahya, in the Soghun valley of Kerman, was excavated by C. C. Lamberg-Karlovsky from 1967 and revealed a sequence running from the Neolithic into historical times. It became central to debates about how the plateau’s eastern towns connected to Mesopotamia and the Indus.",
   "Two finds stand out: Proto-Elamite clay tablets, showing the site shared in an early administrative system spread across the plateau, and a workshop for carving soft chlorite (steatite) into elaborately decorated bowls and vessels that were traded as far as the cities of Sumer."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Yaḥyā, Tepe", "url": "https://www.iranicaonline.org/articles/yahya-tepe" },
   { "label": "Wikipedia — Tepe Yahya", "url": "https://en.wikipedia.org/wiki/Tepe_Yahya" }
  ],
  "related": [ "e038", "e039", "e037" ]
 },

 "e037": {
  "img": [
   { "file": "ورودی_شهر_سوخته.jpg", "alt": "Entrance to Shahr-i Sokhta", "credit": "Entrance to the Burnt City, Sistan · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "ورودی_شهر_سوخته.jpg", "alt": "Entrance to the Burnt City", "credit": "Entrance to Shahr-i Sokhta, Sistan · Wikimedia Commons" },
   { "file": "منطقه_شرقی_مسکونی_شهر_سوخته.jpg", "alt": "Residential quarter", "credit": "Eastern residential area of Shahr-i Sokhta · Wikimedia Commons" },
   { "file": "گورستان_شهر_سوخته.JPG", "alt": "Cemetery", "credit": "The great cemetery of Shahr-i Sokhta · Wikimedia Commons" },
   { "file": "Shahr-i-sokhta-board-game.jpg", "alt": "Board game", "credit": "The Shahr-i Sokhta board game, 27 pieces and 4 dice, c. 2700 BCE · Wikimedia Commons" },
   { "file": "Vase_animation.gif", "alt": "The leaping-goat goblet animated", "credit": "Frames from the painted goblet (c. 3178 BCE) animated — the goat appears to leap · Wikimedia Commons" },
   { "file": "Vaso_de_cerámica_de_la_Edad_del_Bronce_(Shahr-i_Sokhta,_Irán)_-_MARQ.jpg", "alt": "Bronze Age ceramic vase", "credit": "Bronze Age ceramic vase, Shahr-i Sokhta, c. 2600–2400 BCE, MARQ · Wikimedia Commons" }
  ],
  "body": [
   "Shahr-i Sokhta, the “Burnt City”, spread over some 150 hectares of the Helmand delta in Sistan between about 3200 and 2000 BCE. A cosmopolitan Bronze Age town at the crossroads of routes linking Mesopotamia, the plateau and the Indus, it had specialised craft quarters and enormous cemeteries.",
   "Its finds are extraordinary: an artificial eyeball of bitumen and gold thread worn by a woman around 2900–2800 BCE, a backgammon-like board game with dice, and a goblet painted with a wild goat that appears to leap when the vessel is spun — sometimes called the world’s first animation. It became a UNESCO World Heritage Site in 2014."
  ],
  "refs": [
   { "label": "UNESCO — Shahr-i Sokhta", "url": "https://whc.unesco.org/en/list/1456" },
   { "label": "Encyclopædia Iranica — Shahr-e Sūḵta", "url": "https://www.iranicaonline.org/articles/shahr-e-sukhta" },
   { "label": "Wikipedia — Shahr-e Sukhteh", "url": "https://en.wikipedia.org/wiki/Shahr-e_Sukhteh" }
  ],
  "related": [ "e038", "e036", "e039" ]
 },

 "e039": {
  "img": [
   { "file": "Konar_Sandal_B-_South_mound-_Jiroft-Kerman-ID510-_تم_کنار_صندل_ب_-تپه_توجا-تپه_چنوبی.jpg", "alt": "Konar Sandal south mound", "credit": "Konar Sandal South, Jiroft, Kerman · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Konar_Sandal_B-_South_mound-_Jiroft-Kerman-ID510-_تم_کنار_صندل_ب_-تپه_توجا-تپه_چنوبی.jpg", "alt": "Konar Sandal south mound", "credit": "Konar Sandal South, Jiroft, Kerman · Wikimedia Commons" },
   { "file": "Konar_Sandal.jpg", "alt": "Konar Sandal", "credit": "The mounds of Konar Sandal near Jiroft · Wikimedia Commons" },
   { "file": "National_Museum_of_Iran_Darafsh_(124).JPG", "alt": "Carved chlorite vessel", "credit": "Carved chlorite vessel, Halil Rud / Jiroft culture, 3rd millennium BCE, National Museum of Iran · Wikimedia Commons" }
  ],
  "body": [
   "In 2001 flash floods along the Halil Rud in Kerman exposed graves that looters quickly stripped, flooding the market with elaborately carved chlorite vessels. The scandal drew archaeologists to the twin mounds of Konar Sandal, where Yousef Majidzadeh uncovered a massive Bronze Age platform and city of the 3rd millennium BCE.",
   "The Jiroft, or Halil Rud, culture produced dark soft-stone vessels teeming with scorpion-men, humped bulls, eagles and intertwined serpents. Some scholars have linked it to Marhashi, a land named in Mesopotamian texts, or even to the legendary Aratta of Sumerian epic — connections that remain unproven but underline how rich the eastern plateau was."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Jiroft", "url": "https://www.iranicaonline.org/articles/jiroft-i-general" },
   { "label": "Wikipedia — Konar Sandal", "url": "https://en.wikipedia.org/wiki/Konar_Sandal" }
  ],
  "related": [ "e036", "e037" ]
 },

 "e042": {
  "img": [
   { "file": "Anubanini_rock_relief_Ernst_Herzfeld_1913.jpg", "alt": "Anubanini rock relief", "credit": "The Anubanini relief at Sarpol-e Zahab, photographed by Ernst Herzfeld, 1913 · Wikimedia Commons" }
  ],
  "body": [
   "Carved into a cliff at Sarpol-e Zahab in the Zagros, the Anubanini relief shows a king of the Lullubi — a mountain people of the late 3rd millennium BCE — trampling a fallen enemy while the goddess Ishtar leads bound captives before him on a rope. It is among the oldest rock reliefs in Iran.",
   "The composition, with its triumphant ruler and rows of prisoners, set a template that echoes down more than fifteen centuries to Darius I’s great relief at Bisotun a short distance away — a reminder of how long the language of royal victory endured on these mountain roads."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Anobanini", "url": "https://www.iranicaonline.org/articles/anobanini" },
   { "label": "Wikipedia — Anubanini rock relief", "url": "https://en.wikipedia.org/wiki/Anubanini_rock_relief" }
  ],
  "related": [ "e075", "e045" ]
 },

 "e051": {
  "img": [
   { "file": "Grabgewölbe_Haft_Tepe.JPG", "alt": "Royal tomb at Haft Tepe", "credit": "Vaulted royal tomb at Haft Tepe, Khuzestan · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Grabgewölbe_Haft_Tepe.JPG", "alt": "Royal tomb at Haft Tepe", "credit": "Vaulted royal tomb at Haft Tepe, Khuzestan · Wikimedia Commons" },
   { "file": "Elamisches_Bestattungsgefaess.JPG", "alt": "Elamite burial vessel", "credit": "Elamite burial container, Haft Tepe museum · Wikimedia Commons" },
   { "file": "Keramik_aus_Iran,_Elamisches_Totenportrait,_Haft_Tappe,_um_1750_v.C.jpg", "alt": "Elamite funerary head", "credit": "Elamite funerary ceramic head, Haft Tepe, c. 1750 BCE · Wikimedia Commons" }
  ],
  "body": [
   "Haft Tepe — ancient Kabnak — lies a short distance from Susa and was a royal centre of the Elamite king Tepti-ahar in the 14th century BCE. Excavations by Ezat Negahban in the 1960s uncovered a vaulted funerary complex, temples and workshops built of mud brick.",
   "The tombs held multiple burials and a striking group of moulded ceramic heads, giving a rare, intimate glimpse of Middle Elamite funerary practice a century before nearby Chogha Zanbil was raised."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Haft Tepe", "url": "https://www.iranicaonline.org/articles/haft-tepe" },
   { "label": "Wikipedia — Haft Tepe", "url": "https://en.wikipedia.org/wiki/Haft_Tepe" }
  ],
  "related": [ "e047", "e053", "e032" ]
 },

 "e053": {
  "img": [
   { "file": "Choqa_Zanbil_Darafsh_1_(36).JPG", "alt": "Chogha Zanbil ziggurat", "credit": "The ziggurat of Chogha Zanbil (Dur-Untash), Khuzestan · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Choqa_Zanbil_Darafsh_1_(36).JPG", "alt": "Chogha Zanbil ziggurat", "credit": "The ziggurat of Chogha Zanbil (Dur-Untash), Khuzestan · Wikimedia Commons" },
   { "file": "Choqa_Zanbil_2.jpg", "alt": "Chogha Zanbil", "credit": "Brickwork of the Chogha Zanbil ziggurat · Wikimedia Commons" },
   { "file": "Axe_Sb_3973.jpg", "alt": "Axe of Untash-Napirisha", "credit": "Ceremonial axe bearing the name of King Untash-Napirisha, Louvre · Wikimedia Commons" },
   { "file": "Bull_with_elamite_inscription_-_Late_2nd_millen_BC_-_National_museum_of_Iran_-_inventory_number_3213.JPG", "alt": "Elamite bull figure", "credit": "Bull with Elamite inscription, late 2nd millennium BCE, National Museum of Iran · Wikimedia Commons" }
  ],
  "body": [
   "Around 1250 BCE the Elamite king Untash-Napirisha founded a sacred city, Dur-Untash, near Susa and raised at its heart a ziggurat dedicated to the gods Inshushinak and Napirisha. Built of millions of mud bricks faced with fired brick and bands of cuneiform, it still stands more than 25 metres high — the best-preserved ziggurat in the world.",
   "The city was never fully completed and was later damaged by the Assyrian king Ashurbanipal. Excavated by Roman Ghirshman, Chogha Zanbil became Iran’s first UNESCO World Heritage Site in 1979."
  ],
  "refs": [
   { "label": "UNESCO — Tchogha Zanbil", "url": "https://whc.unesco.org/en/list/113" },
   { "label": "Encyclopædia Iranica — Čoḡā Zanbil", "url": "https://www.iranicaonline.org/articles/coga-zanbil" },
   { "label": "Wikipedia — Chogha Zanbil", "url": "https://en.wikipedia.org/wiki/Chogha_Zanbil" }
  ],
  "related": [ "e032", "e051", "e064" ]
 },

 "e054": {
  "img": [
   { "file": "Marlik_cup_iran.jpg", "alt": "Golden cup from Marlik", "credit": "Golden cup with winged bulls and griffins, Marlik, early 1st millennium BCE · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Marlik_cup_iran.jpg", "alt": "Golden cup from Marlik", "credit": "Golden cup with winged bulls and griffins, Marlik · Wikimedia Commons" },
   { "file": "Goblet_mouflons_Louvre_AO22125.jpg", "alt": "Gold goblet with mouflons", "credit": "Gold goblet with a frieze of mouflons, Marlik, Louvre · Wikimedia Commons" },
   { "file": "Cup_with_a_frieze_of_gazelles_MET.jpg", "alt": "Cup with gazelles", "credit": "Gold cup with a frieze of gazelles, Marlik, Metropolitan Museum · Wikimedia Commons" },
   { "file": "Swastika_iran.jpg", "alt": "Gold necklace from Marlik", "credit": "Gold necklace, Marlik, first millennium BCE · Wikimedia Commons" }
  ],
  "body": [
   "Marlik is a rich cemetery of chieftains in the wooded Gohar Rud valley of Gilan, excavated by Ezat Negahban in 1961–62. Its tombs, dating to the late 2nd and early 1st millennium BCE, held some of the finest metalwork of ancient Iran.",
   "The most celebrated find is a golden beaker embossed with winged bulls and griffins, a design so admired it appeared on Iranian banknotes. Alongside it came gold and silver cups with mouflons and gazelles, painted pottery and humped-bull figures — the art of a wealthy highland society at the dawn of the Iron Age."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Marlik", "url": "https://www.iranicaonline.org/articles/marlik" },
   { "label": "Wikipedia — Marlik", "url": "https://en.wikipedia.org/wiki/Marlik" }
  ],
  "related": [ "e059", "e050" ]
 },

 "e070": {
  "img": [
   { "file": "Pasargad_Tomb_Cyrus3.jpg", "alt": "Pasargadae", "credit": "The tomb of Cyrus the Great, Pasargadae · Wikimedia Commons" }
  ],
  "body": [
   "Pasargadae was the first dynastic capital of the Achaemenid Empire, laid out by Cyrus the Great after about 546 BCE across a high plain in Fars. Its scattered palaces, audience hall and gatehouse sat within a network of watercourses and plantings — the earliest known Persian “paradise” garden, the chahar bagh.",
   "At its edge stands the austere gabled tomb of Cyrus, a six-stepped plinth carrying a simple gabled chamber; Alexander the Great is said to have paid his respects there. Pasargadae was inscribed by UNESCO in 2004."
  ],
  "refs": [
   { "label": "UNESCO — Pasargadae", "url": "https://whc.unesco.org/en/list/1106" },
   { "label": "Encyclopædia Iranica — Pasargadae", "url": "https://www.iranicaonline.org/articles/pasargadae" },
   { "label": "Wikipedia — Pasargadae", "url": "https://en.wikipedia.org/wiki/Pasargadae" }
  ],
  "related": [ "e067", "e072", "e076" ]
 },
 "e071": {
  "img": [
   { "file": "Cyrus_Cylinder_front.jpg", "alt": "Cyrus Cylinder", "credit": "The Cyrus Cylinder, British Museum · Wikimedia Commons" }
  ],
  "body": [
   "In 539 BCE Cyrus the Great took Babylon, and the event was commemorated on a barrel-shaped clay cylinder inscribed in Akkadian cuneiform. In it Cyrus presents himself as chosen by the Babylonian god Marduk and describes restoring temples and returning deported peoples and their gods to their homelands — a message echoed in the Hebrew Bible’s account of the Jews’ return to Jerusalem.",
   "Excavated at Babylon in 1879 and now in the British Museum, the cylinder is a masterpiece of royal propaganda. Its popular billing as the “first charter of human rights” is a modern interpretation that most historians regard as anachronistic."
  ],
  "refs": [
   { "label": "British Museum — The Cyrus Cylinder", "url": "https://www.britishmuseum.org/collection/object/W_1880-0617-1941" },
   { "label": "Encyclopædia Iranica — Cyrus Cylinder", "url": "https://www.iranicaonline.org/articles/cyrus-cylinder" },
   { "label": "Wikipedia — Cyrus Cylinder", "url": "https://en.wikipedia.org/wiki/Cyrus_Cylinder" }
  ],
  "related": [ "e067", "e072" ]
 },
 "e075": {
  "img": [
   { "file": "Bisotun_Iran_Relief_Achamenid_Period.JPG", "alt": "Behistun relief", "credit": "The relief and inscription of Darius I at Bisotun · Wikimedia Commons" }
  ],
  "body": [
   "High on a limestone cliff above the old road between Ecbatana and Babylon, Darius I carved the story of his contested rise to power around 520 BCE. A relief shows the king facing nine bound rebel “liar kings”, with the winged symbol of Ahuramazda above; a long trilingual text in Old Persian, Elamite and Babylonian spells out his version of events.",
   "Because the same text appears in three scripts, Bisotun became the key that unlocked cuneiform — the role Henry Rawlinson’s copies of the 1830s–40s played for Mesopotamian writing, much as the Rosetta Stone did for Egyptian hieroglyphs. It is a UNESCO World Heritage Site (2006)."
  ],
  "refs": [
   { "label": "UNESCO — Bisotun", "url": "https://whc.unesco.org/en/list/1222" },
   { "label": "Encyclopædia Iranica — Bisotun", "url": "https://www.iranicaonline.org/articles/bisotun-1-introduction" },
   { "label": "Wikipedia — Behistun Inscription", "url": "https://en.wikipedia.org/wiki/Behistun_Inscription" }
  ],
  "related": [ "e074", "e076", "e042" ]
 },
 "e076": {
  "img": [
   { "file": "2018-09-21_Iran,_Persepolis,_Tachara_(from_the_southeast).jpg", "alt": "Persepolis", "credit": "The Tachara palace, Persepolis · Wikimedia Commons" }
  ],
  "body": [
   "Begun by Darius I from about 518 BCE and continued by Xerxes and their successors, Persepolis (Old Persian Parsa) was the ceremonial heart of the Achaemenid Empire. Its terrace carried the great columned audience hall, the Apadana, whose stairway reliefs show delegations from twenty-three subject peoples bringing gifts — a stone image of empire.",
   "Behind the ceremony lay a working bureaucracy: tens of thousands of Elamite clay tablets record rations paid to labourers, among them extra allowances for women who had just given birth. Persepolis was burned in 330 BCE during Alexander’s conquest and inscribed by UNESCO in 1979."
  ],
  "refs": [
   { "label": "UNESCO — Persepolis", "url": "https://whc.unesco.org/en/list/114" },
   { "label": "Encyclopædia Iranica — Persepolis", "url": "https://www.iranicaonline.org/articles/persepolis" },
   { "label": "Wikipedia — Persepolis", "url": "https://en.wikipedia.org/wiki/Persepolis" }
  ],
  "related": [ "e075", "e081", "e085" ]
 },
 "e111": {
  "img": [
   { "file": "Takht-e-soleiman-1.jpg", "alt": "Takht-e Soleyman", "credit": "The lake and sanctuary of Takht-e Soleyman · Wikimedia Commons" }
  ],
  "body": [
   "Takht-e Soleyman, the “Throne of Solomon”, lies in a volcanic valley of West Azerbaijan around a deep, spring-fed lake. Here stood Adur Gushnasp, one of the three great fires of the Sasanian empire, associated with kings and warriors; a Zoroastrian fire temple, palaces and a royal sanctuary clustered around the water.",
   "The site was rebuilt in the Ilkhanid period and its architecture influenced later Islamic design. It was inscribed by UNESCO in 2003."
  ],
  "refs": [
   { "label": "UNESCO — Takht-e Soleyman", "url": "https://whc.unesco.org/en/list/1077" },
   { "label": "Encyclopædia Iranica — Taḵt-e Solaymān", "url": "https://www.iranicaonline.org/articles/takt-e-solayman" },
   { "label": "Wikipedia — Takht-e Soleyman", "url": "https://en.wikipedia.org/wiki/Takht-e_Soleyman" }
  ],
  "related": [ "e099" ]
 },
 "e114": {
  "img": [
   { "file": "تاق‌بستان.jpg", "alt": "Taq-e Bostan", "credit": "The grottoes of Taq-e Bostan, Kermanshah · Wikimedia Commons" }
  ],
  "body": [
   "At Taq-e Bostan near Kermanshah, the late Sasanian kings cut a series of grottoes and reliefs into the rock beside a spring. The larger grotto, usually linked to Khosrow II (r. 590–628 CE), shows an investiture scene above and, below, a heavily armoured royal horseman — a vivid picture of the cataphract cavalry that made Sasanian armies feared.",
   "Other panels depict royal boar and deer hunts in marshland, crowded with elephants, boats and musicians — among the finest surviving works of Sasanian art."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Ṭāq-e Bostān", "url": "https://www.iranicaonline.org/articles/taq-e-bostan" },
   { "label": "Wikipedia — Taq-e Bostan", "url": "https://en.wikipedia.org/wiki/Taq-e_Bostan" }
  ],
  "related": [ "e115", "e102" ]
 },

 "e120": {
  "body": [
   "Do-Ashkaft (“Two Caves”) is a Middle Palaeolithic cave on the northern slopes above the Kermanshah plain, one of the best-surveyed Neanderthal-period sites of the central Zagros. Repeated seasons of collection recovered thousands of Mousterian stone tools made by the Levallois technique.",
   "The site helps map how Neanderthal groups moved through the Zagros valleys over tens of thousands of years, hunting wild goat and sheep in a landscape of caves and springs."
  ],
  "refs": [
   { "label": "Wikipedia — Do-Ashkaft Cave", "url": "https://en.wikipedia.org/wiki/Do-Ashkaft_Cave" }
  ],
  "related": [ "e002", "e003", "e007" ]
 },

 "e122": {
  "body": [
   "Jarmo, in the Zagros foothills of Iraqi Kurdistan just west of Iran, was excavated by Robert and Linda Braidwood from 1948 as part of a deliberate search for the origins of farming. It became one of the type-sites for the Neolithic of the eastern Fertile Crescent.",
   "Its packed-mud houses, querns, cultivated emmer and barley and herded goats showed a fully agricultural village of about 7000 BCE. Jarmo’s careful excavation — sieving deposits and studying seeds and bones — set the template for how the beginnings of agriculture are investigated across the region, including at the Iranian sites of Ganj Dareh and Ali Kosh."
  ],
  "refs": [
   { "label": "Wikipedia — Jarmo", "url": "https://en.wikipedia.org/wiki/Jarmo" }
  ],
  "related": [ "e019", "e020", "e017" ]
 },

 "e126": {
  "body": [
   "Tepe Ghabristan is a late Chalcolithic tell on the Qazvin plain, roughly 130 km west of Tehran. Excavation exposed a compact town of the 5th and early 4th millennium BCE with courtyard houses and, crucially, a workshop for metal.",
   "Kilns, crucibles, moulds and slag show copper being smelted and cast on the spot — one of the clearest early Iranian pictures of metallurgy passing from occasional experiment to an organised, specialised craft feeding the exchange networks of the plateau."
  ],
  "refs": [
   { "label": "Wikipedia — Tepe Ghabristan", "url": "https://en.wikipedia.org/wiki/Tepe_Ghabristan" }
  ],
  "related": [ "e127", "e030", "e025" ]
 },

 "e127": {
  "body": [
   "Arisman, near Kashan on the western edge of the central desert, is one of the largest early metal-production sites yet found. Joint Iranian–German work uncovered furnaces, slag heaps and workshops where copper — and, remarkably, silver — were smelted from the late 4th into the 3rd millennium BCE.",
   "The scale of production points to a plateau economy already tied into long-distance trade, supplying metal to the towns of Iran and Mesopotamia and standing behind objects like the seals and vessels found across the region."
  ],
  "refs": [
   { "label": "Wikipedia — Arisman", "url": "https://en.wikipedia.org/wiki/Arisman" }
  ],
  "related": [ "e126", "e026", "e030" ]
 },

 "e128": {
  "body": [
   "Dalma Tepe, a small mound in the Solduz valley south of Lake Urmia, gives its name to Dalma ware — a 5th-millennium BCE pottery decorated with impressed dimples and bold painted designs. The style spread widely across the northern Zagros, tracing contacts between communities from Azerbaijan into the central mountains."
  ],
  "refs": [
   { "label": "Wikipedia — Dalma Tepe", "url": "https://en.wikipedia.org/wiki/Dalma_Tepe" }
  ],
  "related": [ "e059", "e025" ]
 },

 "e131": {
  "body": [
   "Anshan — the mound of Tal-e Malyan in the Beyza district of Fars — was the highland half of Elam, twinned with lowland Susa in the ancient royal title “king of Anshan and of Susa”. Survey and excavation revealed a walled city that at its height covered more than 200 hectares, among the largest of the Bronze Age Near East.",
   "Its levels span the Proto-Elamite period, when inscribed tablets record an early accounting system, through the great days of Elam in the 2nd millennium BCE. Centuries later the significance of Anshan endured: the ancestors of Cyrus the Great called themselves kings of Anshan, planting the Persian dynasty in Elam’s old highland seat."
  ],
  "refs": [
   { "label": "Encyclopædia Iranica — Anšan", "url": "https://www.iranicaonline.org/articles/anshan" },
   { "label": "Wikipedia — Anshan (Persia)", "url": "https://en.wikipedia.org/wiki/Anshan_(Persia)" }
  ],
  "related": [ "e040", "e067", "e038" ]
 },

 "e132": {
  "img": [
   { "file": "Bronze_flag,_Shadad_Kerman,_Iran.JPG", "alt": "The Shahdad Standard", "credit": "The Shahdad Standard, a bronze flag of c. 2400 BCE, National Museum of Iran · Wikimedia Commons" }
  ],
  "body": [
   "Shahdad lay on the western margin of the Dasht-e Lut, watered by streams from the Kerman mountains — a Bronze Age oasis town excavated by Ali Hakemi in the 1960s–70s. Its extensive cemeteries preserved an extraordinary funerary culture, including moulded clay busts set over the graves.",
   "Among its metalwork is the famous “Shahdad Standard”, a bronze flag mounted on a shaft and topped with a figure, dated to about 2400 BCE and counted among the oldest known standards in the world. The town was a node on the routes carrying metal, chlorite and lapis across the plateau."
  ],
  "refs": [
   { "label": "Wikipedia — Shahdad", "url": "https://en.wikipedia.org/wiki/Shahdad" }
  ],
  "related": [ "e039", "e036", "e037" ]
 },

 "e133": {
  "img": [
   { "file": "Cow_and_hut.JPG", "alt": "Tureng Tepe", "credit": "The mound of Tureng Tepe above the modern village, Gorgan plain · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Cow_and_hut.JPG", "alt": "Tureng Tepe mound", "credit": "The mound of Tureng Tepe above the modern village, Gorgan plain · Wikimedia Commons" },
   { "file": "Female_Figurine_Iran_Tureng_Tepe_IIIB_Period_3rd_Millenium_BCE_(64322880).jpg", "alt": "Female figurine", "credit": "Female figurine, Tureng Tepe period IIIB, 3rd millennium BCE · Wikimedia Commons" },
   { "file": "Tureng_Tepe_(4475081915).jpg", "alt": "Painted pottery", "credit": "Bronze Age painted pottery from Tureng Tepe, Louvre · Wikimedia Commons" }
  ],
  "body": [
   "Tureng Tepe rises above the fertile Gorgan plain in Iran’s north-east, occupied from the Neolithic but best known for its Bronze Age town of burnished grey ware and a great mud-brick terrace. Its material culture belongs to a north-eastern world stretching across the Kopet Dagh mountains toward the Oxus civilisation of Central Asia.",
   "Excavations by Frederick Wulsin and later Jean Deshayes traced its long life, from prehistoric village to a fortified centre and, much later, a station on the Sasanian frontier wall of Gorgan."
  ],
  "refs": [
   { "label": "Wikipedia — Tureng Tepe", "url": "https://en.wikipedia.org/wiki/Tureng_Tepe" }
  ],
  "related": [ "e134", "e050", "e033" ]
 },

 "e137": {
  "body": [
   "Geoy Tepe is a long-lived mound near Lake Urmia whose deep sequence, first dug in the 1930s, runs from prehistory into the Iron Age. Because its layers can be tied to datable objects, the site became a yardstick for ordering the cultures of north-western Iran and their links to Mesopotamia, Urartu and the Caucasus."
  ],
  "refs": [
   { "label": "Wikipedia — Geoy Tepe", "url": "https://en.wikipedia.org/wiki/Geoy_Tepe" }
  ],
  "related": [ "e059", "e128" ]
 },

 "e139": {
  "img": [
   { "file": "Standard_Finial_LACMA_M.76.97.90.jpg", "alt": "Luristan master-of-animals standard", "credit": "Bronze “master of animals” standard finial, Luristan, LACMA · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Standard_Finial_LACMA_M.76.97.90.jpg", "alt": "Master-of-animals standard", "credit": "Bronze “master of animals” standard finial, Luristan, LACMA · Wikimedia Commons" },
   { "file": "Lurestan_Fibula_(4484325444).jpg", "alt": "Luristan fibula", "credit": "Fibula with a woman giving birth flanked by antelopes, Luristan, c. 1000–650 BCE · Wikimedia Commons" },
   { "file": "Horse_Bit_Cheekpiece,_about_700_BC,_Luristan,_Iran,_bronze_-_Cleveland_Museum_of_Art_-_DSC08162.JPG", "alt": "Horse-bit cheekpiece", "credit": "Bronze horse-bit cheekpiece with master-of-animals motif, Luristan, c. 700 BCE, Cleveland Museum of Art · Wikimedia Commons" },
   { "file": "Harness_Ring,_Iran,_Luristan_10th-9th_centuries_BCE,_HAA.JPG", "alt": "Harness ring", "credit": "Bronze harness ring with ibex and felines, Luristan, 10th–9th century BCE · Wikimedia Commons" },
   { "file": "Standard_Finial_LACMA_M.76.97.13.jpg", "alt": "Standard finial", "credit": "Bronze standard finial, Luristan, LACMA · Wikimedia Commons" },
   { "file": "Votive_pin_with_decorated_disc,_800-600_BCE,_silver,_Luristan,_Cleveland_Museum_of_Art.jpg", "alt": "Votive pin", "credit": "Silver votive pin with decorated disc, Luristan, 800–600 BCE, Cleveland Museum of Art · Wikimedia Commons" }
  ],
  "body": [
   "In the early Iron Age the valleys of Luristan, in the central Zagros, produced a distinctive flood of small cast-bronze objects: cheekpieces and rings from horse harness, pins with decorated heads, weapons, vessels and openwork “standards” crowned with a hero mastering rearing beasts. Together they are known as the Luristan bronzes.",
   "Because most were dug up by local people rather than archaeologists, their exact contexts are often lost and the market has long been flooded with fakes — which is why controlled excavations such as the sanctuary of Surkh Dum-e Luri matter so much. They remain one of the most recognisable arts of ancient Iran, the work of horse-riding communities of the 10th to 7th centuries BCE."
  ],
  "refs": [
   { "label": "Wikipedia — Luristan bronze", "url": "https://en.wikipedia.org/wiki/Luristan_bronze" },
   { "label": "The Met — Luristan bronzes (Iran)", "url": "https://www.metmuseum.org/toah/hd/luri/hd_luri.htm" }
  ],
  "related": [ "e140", "e141", "e057" ]
 },

 "e141": {
  "body": [
   "Baba Jan Tepe, in the high Delfan valleys of Luristan, was excavated by Clare Goff in the 1960s–70s. Its Iron Age levels included a painted “manor” and a building with a decorated hall, along with distinctive painted pottery.",
   "The site gives a rare, everyday picture of the Zagros communities that the Assyrian kings encountered — and taxed — when they campaigned into the mountains in the early first millennium BCE, the world from which the Medes and Persians would emerge."
  ],
  "refs": [
   { "label": "Wikipedia — Baba Jan Tepe", "url": "https://en.wikipedia.org/wiki/Baba_Jan_Tepe" }
  ],
  "related": [ "e139", "e140", "e057" ]
 },

 "e142": {
  "img": [
   { "file": "Gold_Rhyton_in_the_form_of_a_Ram's_Head_-_Reza_Abbasi_Museum_-_Tehran,_Iran.jpg", "alt": "Gold ram's-head rhyton", "credit": "Gold ram’s-head rhyton associated with Ziwiye, Reza Abbasi Museum, Tehran · Wikimedia Commons" }
  ],
  "gallery": [
   { "file": "Gold_Rhyton_in_the_form_of_a_Ram's_Head_-_Reza_Abbasi_Museum_-_Tehran,_Iran.jpg", "alt": "Gold ram's-head rhyton", "credit": "Gold ram’s-head rhyton associated with Ziwiye, Reza Abbasi Museum, Tehran · Wikimedia Commons" },
   { "file": "ZeviyehGoldPiece.jpg", "alt": "Gold plaque", "credit": "Worked gold from the Ziwiye hoard · Wikimedia Commons" },
   { "file": "ZeviyehNecklaces.jpg", "alt": "Gold ornaments", "credit": "Gold ornaments attributed to the Ziwiye hoard · Wikimedia Commons" },
   { "file": "Ram_shaped_pottery_object_(Rython)_-_Ziwiyeh_(Kurdistan)_-_1st_mill_BC_-_National_Museum_of_Iran_-_Inventory_number_2859.JPG", "alt": "Ram-shaped vessel", "credit": "Ram-shaped pottery rhyton, Ziwiye, 1st millennium BCE, National Museum of Iran · Wikimedia Commons" },
   { "file": "ZeviyehGoldenbracelet.jpg", "alt": "Gold bracelet", "credit": "Gold bracelet attributed to the Ziwiye hoard · Wikimedia Commons" },
   { "file": "ZeviyehTray.jpg", "alt": "Decorated tray", "credit": "Decorated metalwork attributed to the Ziwiye hoard · Wikimedia Commons" }
  ],
  "body": [
   "In 1947 villagers near Ziwiye, above Saqqez in Kurdistan, uncovered a hoard of gold, silver and ivory that scattered onto the antiquities market before it could be studied. What survives shows a dazzling mix of styles — Assyrian, Urartian, Scythian and local Mannaean — hinting at a treasure gathered where several peoples met.",
   "Because so much passed through dealers’ hands, the hoard’s true contents, date and even its find-spot are debated, and forgeries muddy the picture further. Even so, dated to around the 7th century BCE, it remains a vivid emblem of the turbulent, cosmopolitan Iron Age of north-western Iran, on the eve of the Median kingdom."
  ],
  "refs": [
   { "label": "Wikipedia — Ziwiye hoard", "url": "https://en.wikipedia.org/wiki/Ziwiye_hoard" }
  ],
  "related": [ "e058", "e065", "e139" ]
 }
};
