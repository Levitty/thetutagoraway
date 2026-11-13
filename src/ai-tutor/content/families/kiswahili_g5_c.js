// ============================================================================
// KISWAHILI GRADE 5, SARUFI: VITENZI (Themes 8 to 11): mnyambuliko, vinyume, hali ya mazoea na timilifu, ukanushaji,
// ukubwa na udogo wa nomino. DRAFT families, all off for children. Written offline by Claude (12 Nov 2026), no model call.
// A native Kiswahili speaker must check every item, and above all the ukubwa na udogo forms of the n- nouns
// (jumba, jibwa, jindoo) and the opposites: docs/qa/kiswahili-g5-native-check-2026-11-12.md.
// ============================================================================
import { trio, one } from './kiswahili_g5_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- mnyambuliko: tell the three forms apart
const MNY_ID = [
  ['Kitenzi kipi kiko katika hali ya kutendeka (kitu kinaweza kutendwa, au kinatendeka chenyewe)?', 'kuvunjika', ['kuvunja', 'M_MNY_NO_CHANGE'], ['kuvunjiwa', 'M_MNY_MIX_FORMS'], ['kuvunjana', 'M_MNY_MIX_FORMS'], 'Kuvunjika kinaishia -ika: kitu kinavunjika chenyewe au kinaweza kuvunjwa.'],
  ['Kitenzi kipi kiko katika hali ya kutendewa (kitendo kimefanyiwa mtu)?', 'kupikiwa', ['kupika', 'M_MNY_NO_CHANGE'], ['kupikika', 'M_MNY_MIX_FORMS'], ['kupikiana', 'M_MNY_MIX_FORMS'], 'Kupikiwa kinaishia -iwa: chakula kimepikwa kwa ajili ya mtu.'],
  ['Kitenzi kipi kiko katika hali ya kutendana (watu wanafanyiana kitendo)?', 'kupendana', ['kupenda', 'M_MNY_NO_CHANGE'], ['kupendwa', 'M_MNY_MIX_FORMS'], ['kupendeka', 'M_MNY_MIX_FORMS'], 'Kupendana kinaishia -ana: watu wawili wanapendana wao kwa wao.'],
  ['Kitenzi kipi kiko katika hali ya kutendeka (kitu kinaweza kutendwa, au kinatendeka chenyewe)?', 'kusomeka', ['kusoma', 'M_MNY_NO_CHANGE'], ['kusomewa', 'M_MNY_MIX_FORMS'], ['kusomana', 'M_MNY_MIX_FORMS'], 'Kusomeka kinaishia -eka: maandishi yanaweza kusomwa kwa urahisi.'],
  ['Kitenzi kipi kiko katika hali ya kutendana (watu wanafanyiana kitendo)?', 'kusalimiana', ['kusalimia', 'M_MNY_NO_CHANGE'], ['kusalimiwa', 'M_MNY_MIX_FORMS'], ['kusalimika', 'M_MNY_MIX_FORMS'], 'Kusalimiana kinaishia -ana: kila mmoja anamsalimia mwenzake.'],
  ['Kitenzi kipi kiko katika hali ya kutendewa (kitendo kimefanyiwa mtu)?', 'kuandikiwa', ['kuandika', 'M_MNY_NO_CHANGE'], ['kuandikika', 'M_MNY_MIX_FORMS'], ['kuandikana', 'M_MNY_MIX_FORMS'], 'Kuandikiwa kinaishia -iwa: barua imeandikwa kwa ajili ya mtu.'],
  ['Kitenzi kipi kiko katika hali ya kutendeka (kitu kinaweza kutendwa, au kinatendeka chenyewe)?', 'kufunguka', ['kufungua', 'M_MNY_NO_CHANGE'], ['kufunguliwa', 'M_MNY_MIX_FORMS'], ['kufunguana', 'M_MNY_MIX_FORMS'], 'Kufunguka kinaishia -ka: mlango unafunguka wenyewe.'],
  ['Kitenzi kipi kiko katika hali ya kutendana (watu wanafanyiana kitendo)?', 'kusaidiana', ['kusaidia', 'M_MNY_NO_CHANGE'], ['kusaidiwa', 'M_MNY_MIX_FORMS'], ['kusaidika', 'M_MNY_MIX_FORMS'], 'Kusaidiana kinaishia -ana: watu wanasaidiana wao kwa wao.'],
];
const MNY = [
  ['Marafiki wawili ___ kila asubuhi.', 'wanasalimiana', ['wanasalimu', 'M_MNY_TENDANA_ONE'], ['wanasalimiwa', 'M_MNY_MIX_FORMS'], ['wanasalimika', 'M_MNY_MIX_FORMS'], 'Wanasalimiana ni hali ya kutendana: kila mmoja anamsalimia mwenzake.'],
  ['Ndugu hao ___ sana.', 'wanapendana', ['wanapenda', 'M_MNY_TENDANA_ONE'], ['wanapendwa', 'M_MNY_MIX_FORMS'], ['wanapendeka', 'M_MNY_MIX_FORMS'], 'Wanapendana ni hali ya kutendana: wanapendana wao kwa wao.'],
  ['Majirani ___ wanapokuwa na shida.', 'wanasaidiana', ['wanasaidia', 'M_MNY_TENDANA_ONE'], ['wanasaidiwa', 'M_MNY_MIX_FORMS'], ['wanasaidika', 'M_MNY_MIX_FORMS'], 'Wanasaidiana ni hali ya kutendana: wanasaidiana wao kwa wao.'],
  ['Kikombe kilianguka na ___.', 'kilivunjika', ['kilivunja', 'M_MNY_NO_CHANGE'], ['kilivunjiwa', 'M_MNY_MIX_FORMS'], ['kilivunjana', 'M_MNY_MIX_FORMS'], 'Kilivunjika ni hali ya kutendeka: kikombe kilivunjika chenyewe.'],
  ['Mwandiko wake ni safi; ___ kwa urahisi.', 'unasomeka', ['unasoma', 'M_MNY_NO_CHANGE'], ['unasomewa', 'M_MNY_MIX_FORMS'], ['unasomana', 'M_MNY_MIX_FORMS'], 'Unasomeka ni hali ya kutendeka: mwandiko unaweza kusomwa kwa urahisi.'],
  ['Mama alimpikia mtoto uji. Mtoto ___ uji na mama.', 'alipikiwa', ['alipika', 'M_MNY_NO_CHANGE'], ['alipikika', 'M_MNY_MIX_FORMS'], ['alipikiana', 'M_MNY_MIX_FORMS'], 'Alipikiwa ni hali ya kutendewa: uji ulipikwa kwa ajili ya mtoto.'],
  ['Baba alimnunulia Wanjiru kitabu. Wanjiru ___ kitabu na baba.', 'alinunuliwa', ['alinunua', 'M_MNY_NO_CHANGE'], ['alinunulika', 'M_MNY_MIX_FORMS'], ['alinunuana', 'M_MNY_MIX_FORMS'], 'Alinunuliwa ni hali ya kutendewa: kitabu kilinunuliwa kwa ajili ya Wanjiru.'],
];

// ---------------------------------------------------------------- vinyume vya vitenzi
const VIN = [
  ['Kinyume cha kufunga ni ___.', 'kufungua', ['kutofunga', 'M_VIN_NEGATE'], ['kuziba', 'M_VIN_SYNONYM'], ['kufungwa', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kufunga ni kufungua: kitendo cha kutengua.'],
  ['Kinyume cha kuvaa ni ___.', 'kuvua', ['kutovaa', 'M_VIN_NEGATE'], ['kuvalia', 'M_VIN_SYNONYM'], ['kuvaua', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kuvaa ni kuvua.'],
  ['Kinyume cha kuingia ni ___.', 'kutoka', ['kutoingia', 'M_VIN_NEGATE'], ['kuingiza', 'M_VIN_SYNONYM'], ['kuingilia', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kuingia ni kutoka.'],
  ['Kinyume cha kupanda ni ___.', 'kushuka', ['kutopanda', 'M_VIN_NEGATE'], ['kupandisha', 'M_VIN_SYNONYM'], ['kupandua', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kupanda ni kushuka.'],
  ['Kinyume cha kujenga ni ___.', 'kubomoa', ['kutojenga', 'M_VIN_NEGATE'], ['kuunda', 'M_VIN_SYNONYM'], ['kujengua', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kujenga ni kubomoa.'],
  ['Kinyume cha kuamka ni ___.', 'kulala', ['kutoamka', 'M_VIN_NEGATE'], ['kuamsha', 'M_VIN_SYNONYM'], ['kuamkua', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kuamka ni kulala.'],
  ['Kinyume cha kufunika ni ___.', 'kufunua', ['kutofunika', 'M_VIN_NEGATE'], ['kuziba', 'M_VIN_SYNONYM'], ['kufunikua', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kufunika ni kufunua.'],
  ['Kinyume cha kuziba ni ___.', 'kuzibua', ['kutoziba', 'M_VIN_NEGATE'], ['kufunga', 'M_VIN_SYNONYM'], ['kuzibika', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kuziba ni kuzibua.'],
];
const VIN_USE = [
  ['Asubuhi Mama hufungua duka na jioni ___ duka.', 'hufunga', ['hufungua', 'M_VIN_SYNONYM'], ['hutofunga', 'M_VIN_NEGATE'], ['hufungia', 'M_VIN_WRONG_SUFFIX'], 'Hufungua duka asubuhi, na kinyume chake ni kufunga duka jioni.'],
  ['Mtoto alivua viatu nje, kisha ___ nguo ya kulalia.', 'akavaa', ['akavua', 'M_VIN_SYNONYM'], ['hakuvaa', 'M_VIN_NEGATE'], ['akavalisha', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kuvua ni kuvaa.'],
  ['Ndege waliingia ndani ya nyumba, kisha ___ nje.', 'wakatoka', ['wakaingia', 'M_VIN_SYNONYM'], ['hawakutoka', 'M_VIN_NEGATE'], ['wakatokea', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kuingia ni kutoka.'],
  ['Mpira ulipanda juu, kisha ukaanza ___ chini.', 'kushuka', ['kupanda', 'M_VIN_SYNONYM'], ['kutopanda', 'M_VIN_NEGATE'], ['kushukia', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kupanda ni kushuka.'],
  ['Alifunika chungu cha chai ili kisipoe, kisha baadaye akaanza ___ ili anywe chai.', 'kukifunua', ['kukifunika', 'M_VIN_SYNONYM'], ['kutokifunika', 'M_VIN_NEGATE'], ['kukifunikua', 'M_VIN_WRONG_SUFFIX'], 'Kinyume cha kufunika ni kufunua.'],
];

// ---------------------------------------------------------------- hali ya mazoea (hu-) na hali timilifu (-me-)
const NYK = [
  ['Kila asubuhi Juma ___ maji (mazoea).', 'hunywa', ['anahunywa', 'M_NYK_HU_SUBJECT'], ['anakunywa', 'M_NYK_NA_HABIT'], ['alikunywa', 'M_NYK_NA_HABIT'], 'Kila asubuhi ni mazoea. Hali ya mazoea hutumia hu- bila kiambishi cha mtu: Juma hunywa maji.'],
  ['Kila Jumamosi Wanjiru ___ nguo (mazoea).', 'hufua', ['anahufua', 'M_NYK_HU_SUBJECT'], ['anafua', 'M_NYK_NA_HABIT'], ['alifua', 'M_NYK_NA_HABIT'], 'Kila Jumamosi ni mazoea: Wanjiru hufua nguo.'],
  ['Wakulima ___ mapema kila siku (mazoea).', 'huamka', ['wanahuamka', 'M_NYK_HU_SUBJECT'], ['wanaamka', 'M_NYK_NA_HABIT'], ['waliamka', 'M_NYK_NA_HABIT'], 'Kila siku ni mazoea: wakulima huamka mapema.'],
  ['Mama ___ chakula jioni kila siku (mazoea).', 'hupika', ['anahupika', 'M_NYK_HU_SUBJECT'], ['anapika', 'M_NYK_NA_HABIT'], ['alipika', 'M_NYK_NA_HABIT'], 'Kila siku ni mazoea: mama hupika chakula jioni.'],
  ['Wanafunzi ___ shuleni saa mbili kila siku ya juma (mazoea).', 'hufika', ['wanahufika', 'M_NYK_HU_SUBJECT'], ['wanafika', 'M_NYK_NA_HABIT'], ['walifika', 'M_NYK_NA_HABIT'], 'Kila siku ya juma ni mazoea: wanafunzi hufika shuleni saa mbili.'],
  ['Bibi ___ hadithi kila jioni (mazoea).', 'husimulia', ['anahusimulia', 'M_NYK_HU_SUBJECT'], ['anasimulia', 'M_NYK_NA_HABIT'], ['alisimulia', 'M_NYK_NA_HABIT'], 'Kila jioni ni mazoea: bibi husimulia hadithi.'],
  ['Mama ___ kupika chakula; kiko tayari (hali timilifu).', 'amemaliza', ['alimaliza', 'M_NYK_ME_PAST'], ['atamaliza', 'M_NYK_ME_PAST'], ['anamaliza', 'M_NYK_NA_HABIT'], 'Chakula kiko tayari sasa. Hali timilifu hutumia -me-: amemaliza.'],
  ['Wanafunzi ___ kazi yao ya nyumbani; wanaweza kucheza sasa (hali timilifu).', 'wamemaliza', ['walimaliza', 'M_NYK_ME_PAST'], ['watamaliza', 'M_NYK_ME_PAST'], ['wanamaliza', 'M_NYK_NA_HABIT'], 'Kazi imekamilika na matokeo yapo sasa. Hali timilifu: wamemaliza.'],
  ['Mvua ___; ardhi imelowa (hali timilifu).', 'imenyesha', ['ilinyesha', 'M_NYK_ME_PAST'], ['itanyesha', 'M_NYK_ME_PAST'], ['inanyesha', 'M_NYK_NA_HABIT'], 'Ardhi imelowa sasa kwa sababu mvua imenyesha. Hali timilifu hutumia -me-.'],
  ['Baba ___ nyumbani; yuko sebuleni (hali timilifu).', 'amefika', ['alifika', 'M_NYK_ME_PAST'], ['atafika', 'M_NYK_ME_PAST'], ['anafika', 'M_NYK_NA_HABIT'], 'Baba yuko sebuleni sasa, kwa hiyo amefika: hali timilifu.'],
];

// ---------------------------------------------------------------- ukanushaji wa viambishi vya nafsi na wakati
const NEG = [
  ['Ninasoma kitabu. Ukanushaji: ___ kitabu.', 'sisomi', ['sinasoma', 'M_NEG_SI_ONLY'], ['nisisomi', 'M_NEG_PERSON'], ['sikusoma', 'M_NEG_WRONG_TENSE'], 'Wakati uliopo hukanushwa bila -na-: ninasoma - sisomi.'],
  ['Amesoma kitabu. Ukanushaji: ___ kitabu.', 'hajasoma', ['hamesoma', 'M_NEG_KEEP_TENSE'], ['hasomi', 'M_NEG_WRONG_TENSE'], ['hakusoma', 'M_NEG_WRONG_TENSE'], '-me- hukanushwa kwa -ja-: amesoma - hajasoma.'],
  ['Alisoma kitabu. Ukanushaji: ___ kitabu.', 'hakusoma', ['halisoma', 'M_NEG_KEEP_TENSE'], ['hajasoma', 'M_NEG_WRONG_TENSE'], ['hasomi', 'M_NEG_WRONG_TENSE'], '-li- hukanushwa kwa -ku-: alisoma - hakusoma.'],
  ['Tutasoma kesho. Ukanushaji: ___ kesho.', 'hatutasoma', ['tusitasoma', 'M_NEG_PERSON'], ['hatusomi', 'M_NEG_WRONG_TENSE'], ['hatukusoma', 'M_NEG_WRONG_TENSE'], 'Tu- hukanushwa kwa hatu-, na -ta- hubaki: tutasoma - hatutasoma.'],
  ['Anasoma kitabu. Ukanushaji: ___ kitabu.', 'hasomi', ['hanasoma', 'M_NEG_KEEP_NA'], ['hakusoma', 'M_NEG_WRONG_TENSE'], ['hajasoma', 'M_NEG_WRONG_TENSE'], 'Wakati uliopo hukanushwa bila -na-: anasoma - hasomi.'],
  ['Wanacheza uwanjani. Ukanushaji: ___ uwanjani.', 'hawachezi', ['hawanacheza', 'M_NEG_KEEP_NA'], ['wasichezi', 'M_NEG_PERSON'], ['hawakucheza', 'M_NEG_WRONG_TENSE'], 'Wa- hukanushwa kwa hawa-, bila -na-: wanacheza - hawachezi.'],
  ['Tumekula chakula. Ukanushaji: ___ chakula.', 'hatujala', ['hatumekula', 'M_NEG_KEEP_TENSE'], ['hatukula', 'M_NEG_WRONG_TENSE'], ['hatuli', 'M_NEG_WRONG_TENSE'], 'Tu- hukanushwa kwa hatu-, na -me- kwa -ja-: tumekula - hatujala.'],
  ['Nilikuja jana. Ukanushaji: ___ jana.', 'sikuja', ['silikuja', 'M_NEG_KEEP_TENSE'], ['sijaja', 'M_NEG_WRONG_TENSE'], ['nisikuja', 'M_NEG_PERSON'], 'Ni- hukanushwa kwa si-, na -li- kwa -ku-: nilikuja - sikuja.'],
  ['Mnasoma darasani. Ukanushaji: ___ darasani.', 'hamsomi', ['hamnasoma', 'M_NEG_KEEP_NA'], ['msisomi', 'M_NEG_PERSON'], ['hamkusoma', 'M_NEG_WRONG_TENSE'], 'M- hukanushwa kwa ham-, bila -na-: mnasoma - hamsomi.'],
  ['Utakula wali. Ukanushaji: ___ wali.', 'hutakula', ['usitakula', 'M_NEG_PERSON'], ['hukukula', 'M_NEG_WRONG_TENSE'], ['huli', 'M_NEG_WRONG_TENSE'], 'U- hukanushwa kwa hu-, na -ta- hubaki: utakula - hutakula.'],
];

// ---------------------------------------------------------------- ukubwa na udogo
const UKM = [
  ['Mtoto mkubwa sana huitwa ___.', 'jitoto', ['jimtoto', 'M_UKM_KEEP_M'], ['kitoto', 'M_UKM_SWAP']],
  ['Mtoto mdogo sana huitwa ___.', 'kitoto', ['kimtoto', 'M_UKM_KEEP_M'], ['jitoto', 'M_UKM_SWAP']],
  ['Mji mkubwa sana huitwa ___.', 'jiji', ['jimji', 'M_UKM_KEEP_M'], ['kijiji', 'M_UKM_SWAP'], ['kimji', 'M_UKM_ONE_SYLLABLE']],
  ['Mji mdogo huitwa ___.', 'kijiji', ['kimji', 'M_UKM_ONE_SYLLABLE'], ['jiji', 'M_UKM_SWAP'], ['kijimji', 'M_UKM_KEEP_M']],
  ['Mto mdogo huitwa ___.', 'kijito', ['kimto', 'M_UKM_ONE_SYLLABLE'], ['jito', 'M_UKM_SWAP'], ['kijimto', 'M_UKM_KEEP_M']],
  ['Mti mdogo huitwa ___.', 'kijiti', ['kimti', 'M_UKM_ONE_SYLLABLE'], ['jiti', 'M_UKM_SWAP'], ['kijimti', 'M_UKM_KEEP_M']],
  ['Mkono mkubwa sana huitwa ___.', 'jikono', ['jimkono', 'M_UKM_KEEP_M'], ['kikono', 'M_UKM_SWAP']],
  ['Mkono mdogo huitwa ___.', 'kikono', ['kimkono', 'M_UKM_KEEP_M'], ['jikono', 'M_UKM_SWAP']],
  ['Mguu mkubwa sana huitwa ___.', 'jiguu', ['jimguu', 'M_UKM_KEEP_M'], ['kiguu', 'M_UKM_SWAP']],
  ['Mkate mdogo huitwa ___.', 'kikate', ['kimkate', 'M_UKM_KEEP_M'], ['jikate', 'M_UKM_SWAP']],
].map(it => [...it, `${it[1]} ndilo umbo sahihi: m- ya mwanzo huondolewa, kisha ji- (ukubwa) au ki- (udogo) inaongezwa.`]);
const UKN = [
  ['Nyumba kubwa sana huitwa ___.', 'jumba', ['jinyumba', 'M_UKN_KEEP_N'], ['kijumba', 'M_UKN_SWAP']],
  ['Nyumba ndogo huitwa ___.', 'kijumba', ['kinyumba', 'M_UKN_KEEP_N'], ['jumba', 'M_UKN_SWAP']],
  ['Mbwa mkubwa sana huitwa ___.', 'jibwa', ['jimbwa', 'M_UKN_KEEP_N'], ['kibwa', 'M_UKN_SWAP']],
  ['Mbwa mdogo huitwa ___.', 'kibwa', ['kimbwa', 'M_UKN_KEEP_N'], ['jibwa', 'M_UKN_SWAP']],
  ['Ndoo kubwa sana huitwa ___.', 'jindoo', ['jinndoo', 'M_UKN_KEEP_N'], ['kindoo', 'M_UKN_SWAP']],
  ['Ndoo ndogo huitwa ___.', 'kindoo', ['kinndoo', 'M_UKN_KEEP_N'], ['jindoo', 'M_UKN_SWAP']],
].map(it => [...it, `${it[1]} ndilo umbo sahihi: ki- huonyesha udogo, na ukubwa huonyeshwa na ji- au umbo la pekee kama jumba.`]);

export const FAMILIES = [
  ...one('mnyambuliko.tambua', 'SARUFI.T8_MNYAMBULIKO_WA_VITEN.MNYAMBULIKO', MNY_ID, { stem: 'Chagua kitenzi sahihi.', oc: 'a', tag: 'tambua', hints: H('Tazama mwisho wa kitenzi: -ika, -iwa au -ana.', '-ika: kinaweza kutendwa. -iwa: kimefanyiwa mtu. -ana: wanafanyiana.') }),
  ...trio('mnyambuliko.tumia', 'SARUFI.T8_MNYAMBULIKO_WA_VITEN.MNYAMBULIKO', MNY, { stem: 'Chagua kitenzi kinachokamilisha sentensi.', gapStem: 'Andika kitenzi kinachokosekana:', oc: ['b', 'b', 'b'], tag: 'tumia', topic: 'kuhusu hali za vitenzi', hints: H('Fikiria nani anafanya kitendo na kwa ajili ya nani.', 'Watu wanapofanyiana kitendo, tumia -ana.') }),
  ...trio('vinyume.tambua', 'SARUFI.T9_VINYUME_VYA_VITENZI.VINYUME', VIN, { stem: 'Chagua kinyume sahihi.', gapStem: 'Andika kinyume kinachokosekana:', oc: ['a', 'a', 'a'], topic: 'kuhusu vinyume vya vitenzi', hints: H('Kinyume ni neno moja lenye maana ya kutengua kitendo.', '"Kutofanya" si kinyume cha "kufanya".') }),
  ...trio('vinyume.tumia', 'SARUFI.T9_VINYUME_VYA_VITENZI.VINYUME', VIN_USE, { stem: 'Chagua kitenzi kinachokamilisha sentensi.', gapStem: 'Andika kitenzi kinachokosekana:', oc: ['b', 'b', 'b'], tag: 'tumia', topic: 'kuhusu vinyume vya vitenzi', hints: H('Tafuta kitendo cha kinyume na kilichotajwa mwanzoni.', 'Soma sentensi nzima kabla ya kuchagua.') }),
  ...trio('nyakati.mazoea', 'SARUFI.T10_NYAKATI_NA_HALI.MAZOEA_TIMILIFU', NYK, { stem: 'Chagua kitenzi kinachokamilisha sentensi.', gapStem: 'Andika kitenzi kinachokosekana:', topic: 'kuhusu hali ya mazoea na hali timilifu', hints: H('Mazoea (kila mara) hutumia hu- bila kiambishi cha mtu.', 'Kitendo kilichokamilika na matokeo yake yanaonekana sasa hutumia -me-.') }),
  ...trio('ukanushaji', 'SARUFI.T11_UKANUSHAJI.UKANUSHAJI', NEG, { stem: 'Chagua ukanushaji sahihi.', gapStem: 'Andika ukanushaji unaokosekana:', topic: 'kuhusu ukanushaji', hints: H('Kiambishi cha nafsi hubadilika katika ukanusho: ni- inakuwa si-, a- inakuwa ha-.', '-na- huondolewa, -me- inakuwa -ja-, -li- inakuwa -ku-, na -ta- hubaki.') }),
  ...trio('ukubwa.m', 'SARUFI.T11_UKUBWA_NA_UDOGO_WA_N.UKUBWA_M', UKM, { stem: 'Chagua umbo sahihi.', gapStem: 'Andika umbo linalokosekana:', oc: ['b', 'd', 'c'], thinOk: true, topic: 'kuhusu ukubwa na udogo wa nomino za m-', hints: H('Ji- huonyesha ukubwa na ki- huonyesha udogo.', 'Ondoa m- ya mwanzo kabla ya kuongeza kiambishi.') }),
  ...trio('ukubwa.n', 'SARUFI.T11_UKUBWA_NA_UDOGO_WA_N_2.UKUBWA_N', UKN, { stem: 'Chagua umbo sahihi.', gapStem: 'Andika umbo linalokosekana:', oc: ['b', 'd', 'c'], thinOk: true, topic: 'kuhusu ukubwa na udogo wa nomino za n-', hints: H('Ki- huonyesha udogo.', 'Ukubwa huonyeshwa na ji- au umbo la pekee.') }),
];
