// ============================================================================
// KISWAHILI GRADE 5, SARUFI: NGELI (Themes 4 to 7): I-ZI, U-ZI, U-YA, KU-KU. DRAFT families, all off for children.
// Written offline by Claude (12 Nov 2026), no model call. The classes are those of the KICD design.
// Animals and people are left out of I-ZI on purpose (they take the A-WA agreement in most books).
// A native Kiswahili speaker must check every item, and above all the U-YA nouns (a short list on purpose)
// and the plurals of the U-ZI nouns: docs/qa/kiswahili-g5-native-check-2026-11-12.md.
// ============================================================================
import { trio, duo } from './kiswahili_g5_lib.js';

const H = (a, b) => [a, b];
const PFX = 'Chagua kiambishi kinachokamilisha sentensi.';
const PFX_GAP = 'Andika kiambishi kinachokosekana:';

// ---------------------------------------------------------------- I-ZI: the subject prefix
const IZI = [
  ['Nyumba moja ___meanguka.', 'i', ['zi', 'M_IZI_SG_ZI'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], 'Nyumba ni ya ngeli ya I-ZI. Nyumba moja ni umoja, kwa hiyo tunatumia i-: nyumba imeanguka.'],
  ['Nyumba nyingi ___meanguka.', 'zi', ['i', 'M_IZI_PL_I'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], '"Nyingi" inaonyesha wingi, kwa hiyo tunatumia zi-: nyumba zimeanguka.'],
  ['Meza mbili ___mevunjika.', 'zi', ['i', 'M_IZI_PL_I'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], '"Mbili" inaonyesha wingi, kwa hiyo tunatumia zi-: meza zimevunjika.'],
  ['Meza yangu ___metengenezwa jana.', 'i', ['zi', 'M_IZI_SG_ZI'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], 'Meza yangu ni umoja, kwa hiyo tunatumia i-: meza imetengenezwa.'],
  ['Barabara hii ___natoka mjini.', 'i', ['zi', 'M_IZI_SG_ZI'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], '"Hii" inaonyesha umoja, kwa hiyo tunatumia i-: barabara inatoka mjini.'],
  ['Barabara zote ___naelekea mjini.', 'zi', ['i', 'M_IZI_PL_I'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], '"Zote" inaonyesha wingi, kwa hiyo tunatumia zi-: barabara zinaelekea mjini.'],
  ['Taa moja ___meharibika.', 'i', ['zi', 'M_IZI_SG_ZI'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], 'Taa moja ni umoja, kwa hiyo tunatumia i-: taa imeharibika.'],
  ['Taa tatu ___meharibika.', 'zi', ['i', 'M_IZI_PL_I'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], '"Tatu" inaonyesha wingi, kwa hiyo tunatumia zi-: taa zimeharibika.'],
  ['Simu yangu ___mepotea.', 'i', ['zi', 'M_IZI_SG_ZI'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], 'Simu yangu ni umoja, kwa hiyo tunatumia i-: simu imepotea.'],
  ['Simu zetu ___mepotea.', 'zi', ['i', 'M_IZI_PL_I'], ['vi', 'M_IZI_KI_VI'], ['ki', 'M_IZI_KI_VI'], '"Zetu" inaonyesha wingi, kwa hiyo tunatumia zi-: simu zimepotea.'],
];
// make the plural of a sentence (c: use the nouns in the singular and plural)
const IZI_PL = [
  ['Weka kwa wingi: "Taa inawaka."', 'Taa zinawaka.', ['Taa inawaka.', 'M_IZI_PL_I'], ['Mataa yanawaka.', 'M_IZI_ADD_MA'], ['Taa vinawaka.', 'M_IZI_KI_VI'], 'Nomino ya I-ZI haibadiliki katika wingi, lakini kiambishi cha kitenzi hubadilika kuwa zi-.'],
  ['Weka kwa wingi: "Meza imevunjika."', 'Meza zimevunjika.', ['Meza imevunjika.', 'M_IZI_PL_I'], ['Mameza yamevunjika.', 'M_IZI_ADD_MA'], ['Meza vimevunjika.', 'M_IZI_KI_VI'], 'Meza haibadiliki, na kitenzi hupata zi-: meza zimevunjika.'],
  ['Weka kwa wingi: "Simu imelia."', 'Simu zimelia.', ['Simu imelia.', 'M_IZI_PL_I'], ['Masimu yamelia.', 'M_IZI_ADD_MA'], ['Simu vimelia.', 'M_IZI_KI_VI'], 'Simu haibadiliki, na kitenzi hupata zi-: simu zimelia.'],
  ['Weka kwa wingi: "Nyumba imejengwa."', 'Nyumba zimejengwa.', ['Nyumba imejengwa.', 'M_IZI_PL_I'], ['Manyumba yamejengwa.', 'M_IZI_ADD_MA'], ['Nyumba vimejengwa.', 'M_IZI_KI_VI'], 'Nyumba haibadiliki, na kitenzi hupata zi-: nyumba zimejengwa.'],
  ['Weka kwa wingi: "Kalamu imepotea."', 'Kalamu zimepotea.', ['Kalamu imepotea.', 'M_IZI_PL_I'], ['Makalamu yamepotea.', 'M_IZI_ADD_MA'], ['Kalamu vimepotea.', 'M_IZI_KI_VI'], 'Kalamu haibadiliki, na kitenzi hupata zi-: kalamu zimepotea.'],
  ['Weka kwa wingi: "Shule inafunguliwa."', 'Shule zinafunguliwa.', ['Shule inafunguliwa.', 'M_IZI_PL_I'], ['Mashule yanafunguliwa.', 'M_IZI_ADD_MA'], ['Shule vinafunguliwa.', 'M_IZI_KI_VI'], 'Shule haibadiliki, na kitenzi hupata zi-: shule zinafunguliwa.'],
];

// ---------------------------------------------------------------- U-ZI: the subject prefix, then the plural noun
const UZI = [
  ['Ukuta ___meanguka.', 'u', ['i', 'M_UZI_AGR_SG'], ['zi', 'M_UZI_AGR_SG'], ['a', 'M_UZI_AGR_SG'], 'Ukuta ni wa ngeli ya U-ZI. Ukuta mmoja ni umoja, kwa hiyo tunatumia u-: ukuta umeanguka.'],
  ['Kuta mbili ___meanguka.', 'zi', ['i', 'M_UZI_AGR_I'], ['ya', 'M_UZI_AGR_I'], ['vi', 'M_UZI_AGR_I'], 'Kuta ni wingi wa ukuta, na hupatana na zi-: kuta zimeanguka.'],
  ['Wimbo mzuri ___naimbwa shuleni.', 'u', ['i', 'M_UZI_AGR_SG'], ['zi', 'M_UZI_AGR_SG'], ['a', 'M_UZI_AGR_SG'], 'Wimbo mmoja ni umoja, kwa hiyo tunatumia u-: wimbo unaimbwa.'],
  ['Nyimbo nzuri ___naimbwa shuleni.', 'zi', ['i', 'M_UZI_AGR_I'], ['ya', 'M_UZI_AGR_I'], ['vi', 'M_UZI_AGR_I'], 'Nyimbo ni wingi wa wimbo, na hupatana na zi-: nyimbo zinaimbwa.'],
  ['Ubao mmoja ___meandikwa jina langu.', 'u', ['i', 'M_UZI_AGR_SG'], ['zi', 'M_UZI_AGR_SG'], ['a', 'M_UZI_AGR_SG'], 'Ubao mmoja ni umoja, kwa hiyo tunatumia u-: ubao umeandikwa.'],
  ['Mbao tatu ___meandikwa majina yetu.', 'zi', ['i', 'M_UZI_AGR_I'], ['ya', 'M_UZI_AGR_I'], ['vi', 'M_UZI_AGR_I'], 'Mbao ni wingi wa ubao, na hupatana na zi-: mbao zimeandikwa.'],
  ['Ufunguo huu ___mepotea.', 'u', ['i', 'M_UZI_AGR_SG'], ['zi', 'M_UZI_AGR_SG'], ['a', 'M_UZI_AGR_SG'], 'Ufunguo mmoja ni umoja, kwa hiyo tunatumia u-: ufunguo umepotea.'],
  ['Funguo zangu ___mepotea.', 'zi', ['i', 'M_UZI_AGR_I'], ['ya', 'M_UZI_AGR_I'], ['vi', 'M_UZI_AGR_I'], 'Funguo ni wingi wa ufunguo, na hupatana na zi-: funguo zimepotea.'],
  ['Uso wake ___natabasamu.', 'u', ['i', 'M_UZI_AGR_SG'], ['zi', 'M_UZI_AGR_SG'], ['a', 'M_UZI_AGR_SG'], 'Uso mmoja ni umoja, kwa hiyo tunatumia u-: uso unatabasamu.'],
  ['Nyuso zao ___natabasamu.', 'zi', ['i', 'M_UZI_AGR_I'], ['ya', 'M_UZI_AGR_I'], ['vi', 'M_UZI_AGR_I'], 'Nyuso ni wingi wa uso, na hupatana na zi-: nyuso zinatabasamu.'],
];
const UZI_PL = [
  ['Wingi wa "ukuta" ni ___.', 'kuta', ['mikuta', 'M_UZI_PL_MA'], ['makuta', 'M_UZI_PL_MA'], ['ukuta', 'M_UZI_PL_MA'], 'Wingi wa ukuta ni kuta: u- inaondolewa.'],
  ['Wingi wa "wimbo" ni ___.', 'nyimbo', ['miwimbo', 'M_UZI_PL_MA'], ['mawimbo', 'M_UZI_PL_MA'], ['wimbo', 'M_UZI_PL_MA'], 'Wingi wa wimbo ni nyimbo. Mawimbo ni wingi wa wimbi.'],
  ['Wingi wa "ubao" ni ___.', 'mbao', ['mibao', 'M_UZI_PL_MA'], ['mabao', 'M_UZI_PL_MA'], ['ubao', 'M_UZI_PL_MA'], 'Wingi wa ubao ni mbao: u- hubadilika kuwa mb-.'],
  ['Wingi wa "ufunguo" ni ___.', 'funguo', ['mifunguo', 'M_UZI_PL_MA'], ['mafunguo', 'M_UZI_PL_MA'], ['ufunguo', 'M_UZI_PL_MA'], 'Wingi wa ufunguo ni funguo: u- inaondolewa.'],
  ['Wingi wa "uso" ni ___.', 'nyuso', ['miuso', 'M_UZI_PL_MA'], ['mauso', 'M_UZI_PL_MA'], ['uso', 'M_UZI_PL_MA'], 'Wingi wa uso ni nyuso: u- hubadilika kuwa nyu-.'],
  ['Wingi wa "ulimi" ni ___.', 'ndimi', ['milimi', 'M_UZI_PL_MA'], ['malimi', 'M_UZI_PL_MA'], ['ulimi', 'M_UZI_PL_MA'], 'Wingi wa ulimi ni ndimi: ul- hubadilika kuwa nd-.'],
  ['Wingi wa "uzi" ni ___.', 'nyuzi', ['mizi', 'M_UZI_PL_MA'], ['mauzi', 'M_UZI_PL_MA'], ['uzi', 'M_UZI_PL_MA'], 'Wingi wa uzi ni nyuzi: u- hubadilika kuwa nyu-.'],
];

// ---------------------------------------------------------------- U-YA (a short list of nouns: for the native reviewer to extend)
const UYA = [
  ['Ugonjwa wake ___mepona.', 'u', ['ya', 'M_UYA_SG_WRONG'], ['zi', 'M_UYA_SG_WRONG'], ['a', 'M_UYA_SG_WRONG'], 'Ugonjwa mmoja ni umoja, kwa hiyo tunatumia u-: ugonjwa umepona.'],
  ['Magonjwa mengi ___mepona.', 'ya', ['zi', 'M_UYA_AGR_ZI'], ['i', 'M_UYA_AGR_ZI'], ['vi', 'M_UYA_AGR_ZI'], 'Magonjwa ni wingi wa ugonjwa, na hupatana na ya-: magonjwa yamepona.'],
  ['Unyoya mmoja ___meanguka.', 'u', ['ya', 'M_UYA_SG_WRONG'], ['zi', 'M_UYA_SG_WRONG'], ['a', 'M_UYA_SG_WRONG'], 'Unyoya mmoja ni umoja, kwa hiyo tunatumia u-: unyoya umeanguka.'],
  ['Manyoya ya kuku ___meanguka.', 'ya', ['zi', 'M_UYA_AGR_ZI'], ['i', 'M_UYA_AGR_ZI'], ['vi', 'M_UYA_AGR_ZI'], 'Manyoya ni wingi wa unyoya, na hupatana na ya-: manyoya yameanguka.'],
  ['Uchungu wa dawa ___meisha.', 'u', ['ya', 'M_UYA_SG_WRONG'], ['zi', 'M_UYA_SG_WRONG'], ['a', 'M_UYA_SG_WRONG'], 'Uchungu mmoja ni umoja, kwa hiyo tunatumia u-: uchungu umeisha.'],
  ['Machungu ya dawa ___meisha.', 'ya', ['zi', 'M_UYA_AGR_ZI'], ['i', 'M_UYA_AGR_ZI'], ['vi', 'M_UYA_AGR_ZI'], 'Machungu ni wingi wa uchungu, na hupatana na ya-: machungu yameisha.'],
];
const UYA_PL = [
  ['Wingi wa "unyoya" ni ___.', 'manyoya', ['minyoya', 'M_UYA_PL_FORM'], ['nyoya', 'M_UYA_PL_FORM'], ['unyoya', 'M_UYA_PL_FORM'], 'Wingi wa unyoya ni manyoya: ma- inaongezwa.'],
  ['Wingi wa "ugonjwa" ni ___.', 'magonjwa', ['migonjwa', 'M_UYA_PL_FORM'], ['gonjwa', 'M_UYA_PL_FORM'], ['ugonjwa', 'M_UYA_PL_FORM'], 'Wingi wa ugonjwa ni magonjwa: ma- inaongezwa.'],
  ['Wingi wa "uchungu" ni ___.', 'machungu', ['michungu', 'M_UYA_PL_FORM'], ['chungu', 'M_UYA_PL_FORM'], ['uchungu', 'M_UYA_PL_FORM'], 'Wingi wa uchungu ni machungu: ma- inaongezwa.'],
  ['Umoja wa "manyoya" ni ___.', 'unyoya', ['nyoya', 'M_UYA_PL_FORM'], ['minyoya', 'M_UYA_PL_FORM'], ['manyoya', 'M_UYA_PL_FORM'], 'Umoja wa manyoya ni unyoya.'],
  ['Umoja wa "magonjwa" ni ___.', 'ugonjwa', ['gonjwa', 'M_UYA_PL_FORM'], ['migonjwa', 'M_UYA_PL_FORM'], ['magonjwa', 'M_UYA_PL_FORM'], 'Umoja wa magonjwa ni ugonjwa.'],
  ['Umoja wa "machungu" ni ___.', 'uchungu', ['chungu', 'M_UYA_PL_FORM'], ['michungu', 'M_UYA_PL_FORM'], ['machungu', 'M_UYA_PL_FORM'], 'Umoja wa machungu ni uchungu.'],
];

// ---------------------------------------------------------------- KU-KU
const KUKU = [
  ['Kusoma ___napendeza.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kusoma ni kitenzi-jina cha ngeli ya KU-KU. Hupatana na ku-: kusoma kunapendeza.'],
  ['Kucheza ___nafurahisha watoto.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kucheza hupatana na ku-: kucheza kunafurahisha watoto.'],
  ['Kulima ___naleta chakula.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kulima hupatana na ku-: kulima kunaleta chakula.'],
  ['Kuimba ___natuliwaza.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kuimba hupatana na ku-: kuimba kunatuliwaza.'],
  ['Kula matunda ___nasaidia mwili.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kula hupatana na ku-: kula matunda kunasaidia mwili.'],
  ['Kunywa maji ___naburudisha.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kunywa hupatana na ku-: kunywa maji kunaburudisha.'],
  ['Kuamka mapema ___naleta afya.', 'ku', ['a', 'M_KUKU_AGR_A'], ['u', 'M_KUKU_AGR_U'], ['i', 'M_KUKU_AGR_U'], 'Kuamka hupatana na ku-: kuamka mapema kunaleta afya.'],
];
const KUKU_PL = [
  ['Wingi wa "kusoma" ni ___.', 'kusoma', ['makusoma', 'M_KUKU_PLURAL'], ['vikusoma', 'M_KUKU_PLURAL'], ['wasoma', 'M_KUKU_PLURAL'], 'Kitenzi-jina hakina wingi tofauti: kusoma hubaki kusoma.'],
  ['Wingi wa "kucheza" ni ___.', 'kucheza', ['makucheza', 'M_KUKU_PLURAL'], ['vikucheza', 'M_KUKU_PLURAL'], ['wacheza', 'M_KUKU_PLURAL'], 'Kitenzi-jina hakina wingi tofauti: kucheza hubaki kucheza.'],
  ['Wingi wa "kulima" ni ___.', 'kulima', ['makulima', 'M_KUKU_PLURAL'], ['vikulima', 'M_KUKU_PLURAL'], ['walima', 'M_KUKU_PLURAL'], 'Kitenzi-jina hakina wingi tofauti: kulima hubaki kulima.'],
  ['Wingi wa "kuimba" ni ___.', 'kuimba', ['makuimba', 'M_KUKU_PLURAL'], ['vikuimba', 'M_KUKU_PLURAL'], ['waimba', 'M_KUKU_PLURAL'], 'Kitenzi-jina hakina wingi tofauti: kuimba hubaki kuimba.'],
  ['Wingi wa "kula" ni ___.', 'kula', ['makula', 'M_KUKU_PLURAL'], ['vikula', 'M_KUKU_PLURAL'], ['wala', 'M_KUKU_PLURAL'], 'Kitenzi-jina hakina wingi tofauti: kula hubaki kula.'],
];

export const FAMILIES = [
  ...trio('ngeli.izi', 'SARUFI.T4_NGELI_YA_I_ZI.I_ZI', IZI, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'b', 'a'], topic: 'kuhusu ngeli ya I-ZI', hints: H('Nyumba, meza, barabara, taa na simu ni za ngeli ya I-ZI.', 'Umoja hutumia i-, na wingi hutumia zi-.') }),
  ...duo('ngeli.izi.wingi', 'SARUFI.T4_NGELI_YA_I_ZI.I_ZI', IZI_PL, { stem: 'Chagua sentensi sahihi ya wingi.', oc: ['c', 'c'], tag: 'wingi', topic: 'kuhusu wingi wa sentensi za I-ZI', hints: H('Nomino za I-ZI hazibadiliki katika wingi.', 'Kitenzi kinabadilika: i- inakuwa zi-.') }),
  ...trio('ngeli.uzi', 'SARUFI.T5_NGELI_YA_U_ZI.U_ZI', UZI, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'a', 'a'], topic: 'kuhusu ngeli ya U-ZI', hints: H('Ukuta, wimbo, ubao, ufunguo na uso ni za ngeli ya U-ZI.', 'Umoja hutumia u-, na wingi hutumia zi-.') }),
  ...trio('ngeli.uzi.wingi', 'SARUFI.T5_NGELI_YA_U_ZI.U_ZI', UZI_PL, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika wingi unaokosekana:', oc: ['b', 'c', 'c'], tag: 'wingi', topic: 'kuhusu wingi wa nomino za U-ZI', hints: H('Wingi wa nomino za U-ZI haupati mi- wala ma-.', 'Sauti za mwanzo hubadilika, au u- huondolewa.') }),
  ...trio('ngeli.uya', 'SARUFI.T6_NGELI_YA_U_YA.U_YA', UYA, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'a', 'a'], topic: 'kuhusu ngeli ya U-YA', thinOk: false, hints: H('Ugonjwa, unyoya na uchungu ni za ngeli ya U-YA.', 'Umoja hutumia u-, na wingi hutumia ya-.') }),
  ...trio('ngeli.uya.wingi', 'SARUFI.T6_NGELI_YA_U_YA.U_YA', UYA_PL, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno linalokosekana:', oc: ['b', 'c', 'c'], tag: 'wingi', topic: 'kuhusu umoja na wingi wa nomino za U-YA', hints: H('Wingi wa nomino za U-YA huanza na ma-.', 'Umoja huanza na u-.') }),
  ...trio('ngeli.kuku', 'SARUFI.T7_NGELI_YA_KU_KU.KU_KU', KUKU, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'a', 'a'], topic: 'kuhusu ngeli ya KU-KU', hints: H('Vitenzi-jina vinaanza na ku-.', 'Kitenzi hupatana na ku- kama neno linavyoanza.') }),
  ...trio('ngeli.kuku.wingi', 'SARUFI.T7_NGELI_YA_KU_KU.KU_KU', KUKU_PL, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno linalokosekana:', oc: ['b', 'c', 'c'], tag: 'wingi', topic: 'kuhusu vitenzi-jina na wingi', hints: H('Vitenzi-jina havina wingi tofauti.', 'Neno hubaki vilevile.') }),
];
