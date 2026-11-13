// ============================================================================
// KISWAHILI GRADE 9: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/kiswahili/g9.json by scripts/build-kiswahili-g9.mjs. KICD's outcomes and rubrics are never touched.
// Skills cover the grammar (sarufi), punctuation, letter, diary, proverb-essay, speech and ufupisho knowledge outcomes a tapped question
// can test. Listening, reading passages, composition and attitudes are not tested here (see the non-question note).
// Items whose answer depends on a contested rule are left out (the ngeli of LI is not asked). Everything is draft until a native Kiswahili
// teacher who teaches Kiswahili reviews it.
// A skill: [sub-strand key after 'KISW.G9.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const V1 = 'SARUFI.T1_VIHUSISHI', V2 = 'SARUFI.T2_VIHUSISHI', V3 = 'SARUFI.T3_VIHUSISHI', N4 = 'SARUFI.T4_NYAKATI_NA_HALI', N5 = 'SARUFI.T5_HALI_ZA_MASHARTI';
const E6 = 'SARUFI.T6_VIELEZI', E7 = 'SARUFI.T7_VIELEZI', G8 = 'SARUFI.T8_NGELI_NA_UPATANISHO_', G9 = 'SARUFI.T9_NGELI_NA_UPATANISHO_';
const VN = 'SARUFI.T10_VINYUME_VYA_VIHUSISH', MN = 'SARUFI.T11_MNYAMBULIKO_WA_VITEN', ST = 'SARUFI.T12_AINA_ZA_SENTENSI', UK = 'SARUFI.T13_UKANUSHAJI', UD = 'SARUFI.T14_UDOGO_NA_UKUBWA_WA_N';
const K1 = 'KUANDI.T1_VIAKIFISHI', K8 = 'KUANDI.T8_VIAKIFISHI', JB = 'KUANDI.T2_INSHA_ZA_KIUAMILIFU', SH = 'KUANDI.T5_INSHA_ZA_KIUAMILIFU', MT = 'KUANDI.T6_INSHA_ZA_KUBUNI', BK = 'KUANDI.T10_BARUA_RASMI_YA_KUOMB', HT = 'KUANDI.T12_HOTUBA_YA_KUSHAWISHI', UF = 'KUSOMA.T15_UFUPISHO';
const FM = ['chagua jibu sahihi', 'chagua jibu katika hadithi fupi', 'tafuta hatua yenye kosa'];
export const SKILLS = [
  [V1, 'VIH_MAHALI', 'Tambua vihusishi vya mahali na vya wakati', ['a', 'b'], [], FM, 'Mtoto hutambua vihusishi vya mahali (mbele ya, nyuma ya, juu ya, chini ya, ndani ya) na vya wakati (kabla ya, baada ya, wakati wa) na kuvitumia ipasavyo.'],
  [V2, 'VIH_SABABU', 'Tambua vihusishi vya -a unganifu na vya sababu', ['a'], ['VIH_MAHALI'], FM, 'Mtoto hutambua kihusishi cha -a unganifu (cha, wa, ya: kitabu cha mwalimu) na cha sababu (kwa sababu ya, kwa ajili ya, kutokana na).'],
  [V3, 'VIH_LINGANISHI', 'Tambua vihusishi vilinganishi na kihusishi na', ['a'], ['VIH_MAHALI'], FM, 'Mtoto hutambua vihusishi vilinganishi (kuliko, kama, mithili ya) na kihusishi na kinachoonyesha pamoja (pamoja na).'],
  [N4, 'KI_KA', 'Tofautisha -ki- ya masharti na -ka- ya kufuatana', ['a', 'b'], [], FM, 'Mtoto hutambua -ki- ya masharti (Ukisoma utafaulu) na -ka- ya kufuatana (Alifika akaketi), na hutofautisha kila mmoja.'],
  [N5, 'NGE_NGALI', 'Tambua hali ya masharti ya -nge- na -ngali-', ['a', 'b', 'c'], ['KI_KA'], FM, 'Mtoto hueleza hali ya masharti na hutambua -nge- (Angesoma angefaulu) na -ngali- (Angalijua angalikuja) zinazoonyesha sharti lisilotimia.'],
  [E6, 'VIE_NAMNA', 'Tambua vielezi vya namna na vya wakati', ['a'], [], FM, 'Mtoto hutambua vielezi vya namna (polepole, haraka, kwa upole) na vya wakati (jana, leo, kesho, mapema, sasa).'],
  [E7, 'VIE_MAHALI', 'Tambua vielezi vya mahali na vya idadi', ['a'], ['VIE_NAMNA'], FM, 'Mtoto hutambua vielezi vya mahali (hapa, pale, huku, kule, nyumbani, mjini) na vya idadi (mara mbili, kidogo, sana, mara nyingi).'],
  [K1, 'KOLONI', 'Tumia koloni na semi koloni', ['a', 'b'], [], FM, 'Mtoto hutumia koloni (:) kuleta orodha au maelezo, na semi koloni (;) kutenganisha sentensi zinazohusiana.'],
  [K8, 'MABANO_KISTARI', 'Tumia mabano na kistari kifupi', ['a'], ['KOLONI'], FM, 'Mtoto hutumia mabano ( ) kuweka maelezo ya ziada na kistari kifupi (-) kati ya tarakimu (kurasa 5-10) au kuvunja neno mwishoni mwa mstari.'],
  [G8, 'NGELI_UZI_YAYA', 'Tumia ngeli za U-ZI na YA-YA na upatanisho wa kisarufi', ['a', 'b', 'c'], [], FM, 'Mtoto hutambua nomino za U-ZI (ukuta, kuta; wimbo, nyimbo) zinazotumia u- na zi-, na za YA-YA (maji, mafuta) zinazotumia ya-.'],
  [G9, 'NGELI_KU_PAKUMU', 'Tumia ngeli za KU na PA-KU-MU na upatanisho wa kisarufi', ['a', 'b', 'c'], ['NGELI_UZI_YAYA'], FM, 'Mtoto hutambua ngeli ya KU (vitenzi-jina: kusoma kunafurahisha) na ya PA-KU-MU (mahali: hapa pazuri, kule kuzuri, humu mwazuri).'],
  [VN, 'VINYUME_VIHUSISHI', 'Tambua vinyume vya vihusishi', ['a', 'b'], ['VIH_MAHALI'], FM, 'Mtoto hutambua vinyume vya vihusishi (mbele ya na nyuma ya, juu ya na chini ya, ndani ya na nje ya, kabla ya na baada ya).'],
  [MN, 'KAULI_TENDANA', 'Tambua kauli ya kutendana, kutendeana na kutendesha', ['a', 'b'], [], FM, 'Mtoto hutambua kutendana (pigana), kutendeana (pigiana) na kutendesha (somesha), na hutofautisha maana zake.'],
  [ST, 'SENTENSI_TATA', 'Tambua sentensi tata', ['a', 'b'], [], FM, 'Mtoto hueleza sentensi tata ni yenye maana zaidi ya moja kutokana na muundo wake, kama "Mama alimpiga mtoto na fimbo".'],
  [UK, 'UKANUSHAJI_MASHARTI', 'Kanusha hali ya masharti', ['a', 'b'], ['NGE_NGALI'], FM, 'Mtoto hukanusha -nge- kwa -singe- (angekuja, asingekuja), -ngali- kwa -singali- na -ki- kwa -sipo- (akisoma, asiposoma).'],
  [UD, 'UDOGO_UKUBWA', 'Tambua nomino katika hali ya udogo na ukubwa', ['a', 'b'], [], FM, 'Mtoto hutambua udogo (kijiji, kijiti, kitoto, kijumba) na ukubwa (jitu, jumba, joka), na hubadilisha nomino ipasavyo.'],
  [JB, 'JIBU_BARUA', 'Tambua ujumbe, lugha na muundo wa kujibu barua ya kirafiki', ['a', 'b', 'c'], [], FM, 'Mtoto hueleza kuwa jibu la barua hushukuru, hujibu maswali ya mwandishi, hutumia lugha ya kirafiki na hufuata muundo wa barua ya kirafiki.'],
  [SH, 'SHAJARA', 'Eleza shajara na vipengele vyake', ['a', 'b'], [], FM, 'Mtoto hueleza shajara ni kumbukumbu ya kila siku ya matukio na hisia za mwandishi, huandikwa kwa nafsi ya kwanza na huwa na tarehe.'],
  [MT, 'INSHA_METHALI', 'Eleza insha za methali', ['a', 'b'], [], FM, 'Mtoto hueleza methali ni msemo wenye hekima na kuwa insha ya methali hufafanua maana ya methali kwa kutumia hadithi au mfano.'],
  [BK, 'BARUA_KAZI', 'Tambua vipengele vya barua rasmi ya kuomba kazi', ['a', 'b'], [], FM, 'Mtoto hutambua anwani mbili, tarehe, salamu rasmi, kichwa cha barua, utangulizi, sifa za mwombaji, hitimisho na jina, na kuwa lugha ni ya heshima.'],
  [HT, 'HOTUBA_KUSHAWISHI', 'Eleza hotuba ya kushawishi na vipengele vyake', ['a', 'b'], [], FM, 'Mtoto hueleza hotuba ya kushawishi hulenga kumfanya msikilizaji akubali wazo au achukue hatua, na hutambua salamu, utangulizi, hoja, mifano, wito na shukrani.'],
  [UF, 'UFUPISHO', 'Jadili vipengele vya ufupisho wa habari', ['a'], [], FM, 'Mtoto hujadili kuwa ufupisho huhifadhi habari kuu na mtiririko wake, hutumia maneno ya mfupishaji na haunakili kifungu.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback (child, Kiswahili)]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_KS9_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('VIH_MAHALI', 'VM_MAHALI', 'Gives a time word for a place.', 'Ni kihusishi kipi cha mahali?', 'baada ya', 'mbele ya', 'Mbele ya ni kihusishi cha mahali.'),
  m('VIH_MAHALI', 'VM_WAKATI', 'Gives a place word for a time.', 'Ni kihusishi kipi cha wakati?', 'karibu na', 'kabla ya', 'Kabla ya ni kihusishi cha wakati.'),
  m('VIH_MAHALI', 'VM_SENTENSI', 'Does not use "ya" after the preposition.', 'Chagua sentensi sahihi.', 'Kitabu kiko juu meza.', 'Kitabu kiko juu ya meza.', 'Vihusishi vingi hufuatwa na ya.'),
  m('VIH_SABABU', 'VS_UNGANIFU', 'Mixes the -a unganifu with the cause word.', 'Ni kihusishi kipi cha -a unganifu?', 'kwa sababu ya', 'cha', 'Cha ni kihusishi cha -a unganifu.'),
  m('VIH_SABABU', 'VS_SABABU', 'Mixes the cause word with the -a unganifu.', 'Ni kihusishi kipi cha sababu?', 'cha', 'kwa sababu ya', 'Kwa sababu ya ni kihusishi cha sababu.'),
  m('VIH_SABABU', 'VS_UPATANISHO', 'Wrong agreement of -a unganifu.', 'Kamilisha: kitabu ___ mwalimu.', 'wa', 'cha', 'Kitabu hupatana na cha.'),
  m('VIH_LINGANISHI', 'VL_KULIKO', 'Does not know kuliko.', 'Ni kihusishi kipi kinalinganisha?', 'pamoja na', 'kuliko', 'Kuliko hulinganisha.'),
  m('VIH_LINGANISHI', 'VL_NA', 'Does not know na as togetherness.', 'Katika "Alikuja na rafiki yake", na inaonyesha nini?', 'ulinganisho', 'pamoja', 'Na hapa inaonyesha pamoja.'),
  m('VIH_LINGANISHI', 'VL_KAMA', 'Mixes kama with sababu.', 'Ni kihusishi kipi kinalinganisha vitu viwili?', 'kwa ajili ya', 'kama', 'Kama hulinganisha vitu viwili.'),
  m('KI_KA', 'KK_KI', 'Takes -ki- as sequence.', 'Katika "Ukisoma utafaulu", -ki- inaonyesha nini?', 'kufuatana', 'sharti', '-ki- hapa inaonyesha sharti.'),
  m('KI_KA', 'KK_KA', 'Takes -ka- as condition.', 'Katika "Alifika akaketi", -ka- inaonyesha nini?', 'sharti', 'kufuatana', '-ka- inaonyesha tendo linalofuata.'),
  m('KI_KA', 'KK_MATUMIZI', 'Uses -ki- where -ka- is needed.', 'Kamilisha: Aliamka ___oga.', 'akioga', 'akaoga', 'Tendo linalofuata hutumia -ka-.'),
  m('NGE_NGALI', 'NN_MAANA', 'Thinks nge- shows a fact.', 'Hali ya masharti ya -nge- huonyesha nini?', 'ukweli uliotimia', 'sharti lisilotimia', '-nge- huonyesha sharti ambalo halikutimia.'),
  m('NGE_NGALI', 'NN_NGE', 'Mixes -nge- with -ngali-.', 'Ni sentensi ipi ina -nge-?', 'Angalijua angalikuja.', 'Angejua angekuja.', 'Angejua ina -nge-.'),
  m('NGE_NGALI', 'NN_NGALI', 'Mixes -ngali- with -nge-.', 'Ni sentensi ipi ina -ngali-?', 'Angejua angekuja.', 'Angalijua angalikuja.', 'Angalijua ina -ngali-.'),
  m('VIE_NAMNA', 'VN_NAMNA', 'Gives a time word for manner.', 'Ni kielezi kipi cha namna?', 'jana', 'polepole', 'Polepole ni kielezi cha namna.'),
  m('VIE_NAMNA', 'VN_WAKATI', 'Gives a manner word for time.', 'Ni kielezi kipi cha wakati?', 'polepole', 'kesho', 'Kesho ni kielezi cha wakati.'),
  m('VIE_NAMNA', 'VN_SWALI', 'Wrong question for the adverb.', 'Kielezi cha namna hujibu swali gani?', 'Lini?', 'Vipi?', 'Kielezi cha namna hujibu "vipi?".'),
  m('VIE_MAHALI', 'VE_MAHALI', 'Gives a number word for place.', 'Ni kielezi kipi cha mahali?', 'mara mbili', 'pale', 'Pale ni kielezi cha mahali.'),
  m('VIE_MAHALI', 'VE_IDADI', 'Gives a place word for number.', 'Ni kielezi kipi cha idadi?', 'huku', 'mara mbili', 'Mara mbili ni kielezi cha idadi.'),
  m('VIE_MAHALI', 'VE_SWALI', 'Wrong question for the adverb.', 'Kielezi cha mahali hujibu swali gani?', 'Lini?', 'Wapi?', 'Kielezi cha mahali hujibu "wapi?".'),
  m('KOLONI', 'KO_KOLONI', 'Uses a semi-colon before a list.', 'Ni alama ipi huleta orodha?', 'semi koloni', 'koloni', 'Koloni huleta orodha.'),
  m('KOLONI', 'KO_SEMI', 'Uses a colon between two related sentences.', 'Ni alama ipi hutenganisha sentensi mbili zinazohusiana?', 'koloni', 'semi koloni', 'Semi koloni hutenganisha sentensi zinazohusiana.'),
  m('KOLONI', 'KO_MFANO', 'Wrong example.', 'Ni sentensi ipi imetumia koloni sawa?', 'Nilinunua: mkate maziwa sukari.', 'Nilinunua vitu hivi: mkate, maziwa na sukari.', 'Koloni hufuata maelezo kisha orodha.'),
  m('MABANO_KISTARI', 'MK_MABANO', 'Uses a hyphen for extra information.', 'Ni alama ipi huweka maelezo ya ziada?', 'kistari kifupi', 'mabano', 'Mabano huweka maelezo ya ziada.'),
  m('MABANO_KISTARI', 'MK_KISTARI', 'Uses brackets between numbers.', 'Ni alama ipi inatumika kati ya tarakimu kama kurasa 5 hadi 10?', 'mabano', 'kistari kifupi', 'Kistari kifupi hutumika kati ya tarakimu.'),
  m('MABANO_KISTARI', 'MK_NENO', 'Wrong use at the end of a line.', 'Ni alama ipi hutumika kuvunja neno mwishoni mwa mstari?', 'koloni', 'kistari kifupi', 'Kistari kifupi huvunja neno.'),
  m('NGELI_UZI_YAYA', 'GU_UKUTA', 'Uses ya- for ukuta.', 'Chagua sentensi sahihi.', 'Ukuta yameanguka.', 'Ukuta umeanguka.', 'Ukuta ni wa U-ZI na hutumia u-.'),
  m('NGELI_UZI_YAYA', 'GU_KUTA', 'Uses u- for the plural kuta.', 'Chagua sentensi sahihi kwa wingi.', 'Kuta umeanguka.', 'Kuta zimeanguka.', 'Wingi wa U-ZI hutumia zi-.'),
  m('NGELI_UZI_YAYA', 'GU_MAJI', 'Uses zi- for maji.', 'Chagua sentensi sahihi.', 'Maji zimemwagika.', 'Maji yamemwagika.', 'Maji ni ya YA-YA na hutumia ya-.'),
  m('NGELI_KU_PAKUMU', 'GK_KUSOMA', 'Uses ki- for a verbal noun.', 'Chagua sentensi sahihi.', 'Kusoma kinafurahisha.', 'Kusoma kunafurahisha.', 'Vitenzi-jina hutumia ku-.'),
  m('NGELI_KU_PAKUMU', 'GK_PA', 'Uses ku- for a near place.', 'Chagua sentensi sahihi.', 'Hapa kuzuri.', 'Hapa pazuri.', 'Mahali karibu hutumia pa-.'),
  m('NGELI_KU_PAKUMU', 'GK_MU', 'Uses pa- for inside.', 'Chagua sentensi sahihi.', 'Humu pazuri.', 'Humu mwazuri.', 'Ndani hutumia mu-.'),
  m('VINYUME_VIHUSISHI', 'VH_JUU', 'Gives the wrong opposite.', 'Kinyume cha juu ya ni kipi?', 'mbele ya', 'chini ya', 'Kinyume cha juu ya ni chini ya.'),
  m('VINYUME_VIHUSISHI', 'VH_NDANI', 'Gives the wrong opposite.', 'Kinyume cha ndani ya ni kipi?', 'juu ya', 'nje ya', 'Kinyume cha ndani ya ni nje ya.'),
  m('VINYUME_VIHUSISHI', 'VH_KABLA', 'Gives the wrong opposite.', 'Kinyume cha kabla ya ni kipi?', 'wakati wa', 'baada ya', 'Kinyume cha kabla ya ni baada ya.'),
  m('KAULI_TENDANA', 'KN_TENDANA', 'Confuses kutendana with kutendesha.', 'Ni kitenzi kipi kiko katika kauli ya kutendana?', 'somesha', 'pigana', 'Pigana ni kutendana.'),
  m('KAULI_TENDANA', 'KN_TENDESHA', 'Confuses kutendesha with kutendana.', 'Ni kitenzi kipi kiko katika kauli ya kutendesha?', 'pigana', 'somesha', 'Somesha ni kutendesha.'),
  m('KAULI_TENDANA', 'KN_TENDEANA', 'Does not know kutendeana.', 'Ni kitenzi kipi kiko katika kauli ya kutendeana?', 'somesha', 'pigiana', 'Pigiana ni kutendeana.'),
  m('SENTENSI_TATA', 'SZ_MAANA', 'Thinks a tata sentence has one meaning.', 'Sentensi tata ina nini?', 'maana moja tu', 'maana zaidi ya moja', 'Sentensi tata ina maana zaidi ya moja.'),
  m('SENTENSI_TATA', 'SZ_KISAHILI', 'Calls a clear sentence tata.', 'Ni sentensi ipi ni tata?', 'Mama anapika.', 'Mama alimpiga mtoto na fimbo.', 'Sentensi tata inaweza kufasiriwa kwa njia mbili.'),
  m('SENTENSI_TATA', 'SZ_SABABU', 'Does not know the cause of the ambiguity.', 'Sentensi tata hutokana na nini?', 'matumizi ya herufi kubwa', 'muundo unaoleta maana mbili', 'Muundo huleta maana mbili.'),
  m('UKANUSHAJI_MASHARTI', 'UM_NGE', 'Wrong negation of nge.', 'Kanusha: Angekuja.', 'Hangekuja', 'Asingekuja', '-nge- hukanushwa kwa -singe-.'),
  m('UKANUSHAJI_MASHARTI', 'UM_NGALI', 'Wrong negation of ngali.', 'Kanusha: Angalisoma.', 'Hangalisoma', 'Asingalisoma', '-ngali- hukanushwa kwa -singali-.'),
  m('UKANUSHAJI_MASHARTI', 'UM_KI', 'Wrong negation of ki.', 'Kanusha: Akisoma.', 'Hakisoma', 'Asiposoma', '-ki- hukanushwa kwa -sipo-.'),
  m('UDOGO_UKUBWA', 'UU_UDOGO', 'Mixes udogo and ukubwa.', 'Kijiji ni nini?', 'mji mkubwa', 'mji mdogo', 'Kijiji ni mji mdogo.'),
  m('UDOGO_UKUBWA', 'UU_UKUBWA', 'Mixes ukubwa and udogo.', 'Jitu ni nini?', 'mtu mdogo', 'mtu mkubwa', 'Jitu ni mtu mkubwa.'),
  m('UDOGO_UKUBWA', 'UU_KIAMBISHI', 'Wrong prefix.', 'Ni kiambishi kipi cha udogo?', 'ji-', 'ki-', 'Udogo hutumia ki-.'),
  m('JIBU_BARUA', 'JB_SHUKRANI', 'Starts a reply with a complaint.', 'Jibu la barua huanza kwa nini?', 'malalamiko', 'shukrani kwa barua uliyopokea', 'Jibu huanza kwa shukrani.'),
  m('JIBU_BARUA', 'JB_MASWALI', 'Ignores the questions.', 'Jibu la barua hufanya nini kuhusu maswali?', 'huyapuuza', 'huyajibu', 'Jibu hujibu maswali ya mwandishi.'),
  m('JIBU_BARUA', 'JB_LUGHA', 'Uses a formal register.', 'Lugha ya kujibu barua ya kirafiki ni ipi?', 'ya kiofisi kali', 'ya kirafiki na heshima', 'Lugha ni ya kirafiki na heshima.'),
  m('SHAJARA', 'SJ_MAANA', 'Calls a diary a letter.', 'Shajara ni nini?', 'barua kwa rafiki', 'kumbukumbu ya kila siku', 'Shajara ni kumbukumbu ya kila siku.'),
  m('SHAJARA', 'SJ_NAFSI', 'Uses the third person.', 'Shajara huandikwa kwa nafsi ipi?', 'ya tatu', 'ya kwanza', 'Shajara huandikwa kwa nafsi ya kwanza.'),
  m('SHAJARA', 'SJ_TAREHE', 'Leaves out the date.', 'Kila ingizo la shajara huanza kwa nini?', 'jina la rafiki', 'tarehe', 'Ingizo huanza kwa tarehe.'),
  m('INSHA_METHALI', 'IM_MAANA', 'Thinks a proverb is a joke.', 'Methali ni nini?', 'kichekesho', 'msemo wenye hekima', 'Methali ni msemo wenye hekima.'),
  m('INSHA_METHALI', 'IM_KAZI', 'Thinks the essay retells any story.', 'Insha ya methali hufanya nini?', 'husimulia hadithi yoyote', 'hufafanua maana ya methali', 'Insha ya methali hufafanua maana.'),
  m('INSHA_METHALI', 'IM_MFANO', 'Wrong meaning of a proverb.', 'Methali "Haraka haraka haina baraka" inafundisha nini?', 'Fanya kila kitu upesi', 'Kufanya mambo kwa haraka kuna hasara', 'Haraka kupita kiasi huleta hasara.'),
  m('BARUA_KAZI', 'BK_ANWANI', 'Gives one address.', 'Barua ya kuomba kazi ina anwani ngapi?', 'moja', 'mbili', 'Ina anwani mbili.'),
  m('BARUA_KAZI', 'BK_KICHWA', 'Leaves out the heading.', 'Barua ya kuomba kazi huwa na nini kabla ya ujumbe?', 'hakuna kitu', 'kichwa cha barua', 'Ina kichwa cha barua.'),
  m('BARUA_KAZI', 'BK_SIFA', 'Leaves out the applicant\'s qualifications.', 'Barua ya kuomba kazi hutaja nini kuhusu mwombaji?', 'rangi yake anayopenda', 'sifa zake', 'Hutaja sifa za mwombaji.'),
  m('HOTUBA_KUSHAWISHI', 'HK_LENGO', 'Thinks a persuasive speech only informs.', 'Hotuba ya kushawishi hulenga nini?', 'kuburudisha tu', 'kumfanya msikilizaji akubali wazo', 'Hotuba ya kushawishi hulenga kushawishi.'),
  m('HOTUBA_KUSHAWISHI', 'HK_MWANZO', 'Starts with the call to action.', 'Hotuba huanza kwa nini?', 'wito', 'salamu na utangulizi', 'Hotuba huanza kwa salamu na utangulizi.'),
  m('HOTUBA_KUSHAWISHI', 'HK_HOJA', 'Leaves out reasons.', 'Hotuba ya kushawishi hutumia nini kuunga wazo?', 'hoja na mifano', 'kelele tu', 'Hutumia hoja na mifano.'),
  m('UFUPISHO', 'UF_NAKALA', 'Thinks a summary copies.', 'Ufupisho ni nini?', 'kunakili kifungu chote', 'kutoa habari kuu kwa ufupi', 'Ufupisho si kunakili.'),
  m('UFUPISHO', 'UF_MANENO', 'Copies the passage\'s words.', 'Ufupisho huandikwa kwa maneno ya nani?', 'ya mwandishi pekee', 'ya mfupishaji mwenyewe', 'Hutumia maneno ya mfupishaji.'),
  m('UFUPISHO', 'UF_MTIRIRIKO', 'Changes the order.', 'Ufupisho huhifadhi nini cha habari?', 'hubadilisha mpangilio', 'mtiririko wake', 'Huhifadhi mtiririko.'),
];
