// ============================================================================
// KISWAHILI GRADE 6, SARUFI: NGELI (Themes 4 to 7): YA-YA, U-U, I-I and PA-KU-MU. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. Original sentences, Kenyan names and places.
// Nouns used are the clear members of each class; a native speaker must confirm them (see the native-speaker list).
// ============================================================================
import { trio, duo, one } from './kiswahili_g6_lib.js';

const H = (a, b) => [a, b];
const PFX = 'Chagua kiambishi kinachokamilisha sentensi.';
const PFX_GAP = 'Andika kiambishi kinachokosekana:';

// YA-YA: nouns with ma- that are always many (maji, maziwa, mafuta, mate, machozi, manukato, maradhi, marashi): ya- in the subject.
const YAYA = [
  ['Maji ___meisha kisimani.', 'ya', ['li', 'M_YAYA_LI'], ['u', 'M_YAYA_OTHER'], ['zi', 'M_YAYA_OTHER'], 'Maji ni ya ngeli ya YA-YA. Hupatana na ya-: maji yameisha.'],
  ['Maziwa ___meichacha jikoni.', 'ya', ['li', 'M_YAYA_LI'], ['i', 'M_YAYA_OTHER'], ['a', 'M_YAYA_A'], 'Maziwa ni ya ngeli ya YA-YA: maziwa yameichacha.'],
  ['Mafuta ___meisha chupani.', 'ya', ['li', 'M_YAYA_LI'], ['u', 'M_YAYA_OTHER'], ['zi', 'M_YAYA_OTHER'], 'Mafuta ni ya ngeli ya YA-YA: mafuta yameisha.'],
  ['Machozi ___natoka machoni mwa mtoto.', 'ya', ['li', 'M_YAYA_LI'], ['zi', 'M_YAYA_OTHER'], ['a', 'M_YAYA_A'], 'Machozi ni ya ngeli ya YA-YA: machozi yanatoka.'],
  ['Mate ___mekauka mdomoni.', 'ya', ['li', 'M_YAYA_LI'], ['u', 'M_YAYA_OTHER'], ['i', 'M_YAYA_OTHER'], 'Mate ni ya ngeli ya YA-YA: mate yamekauka.'],
  ['Manukato ___nanukia vizuri.', 'ya', ['li', 'M_YAYA_LI'], ['zi', 'M_YAYA_OTHER'], ['vi', 'M_YAYA_OTHER'], 'Manukato ni ya ngeli ya YA-YA: manukato yananukia.'],
  ['Maradhi ___mepungua kijijini.', 'ya', ['li', 'M_YAYA_LI'], ['zi', 'M_YAYA_OTHER'], ['i', 'M_YAYA_OTHER'], 'Maradhi ni ya ngeli ya YA-YA: maradhi yamepungua.'],
  ['Marashi ___nanukia chumbani.', 'ya', ['li', 'M_YAYA_LI'], ['u', 'M_YAYA_OTHER'], ['zi', 'M_YAYA_OTHER'], 'Marashi ni ya ngeli ya YA-YA: marashi yananukia.'],
];
const YAYA_ID = [
  ['Ni nomino ipi ni ya ngeli ya YA-YA?', 'maji', ['kitabu', 'M_YAYA_NOUN'], ['mtoto', 'M_YAYA_NOUN'], ['nyumba', 'M_YAYA_NOUN'], 'Maji hayana umoja na hupatana na ya-: maji yamemwagika.'],
  ['Ni nomino ipi ni ya ngeli ya YA-YA?', 'maziwa', ['kiti', 'M_YAYA_NOUN'], ['mwalimu', 'M_YAYA_NOUN'], ['meza', 'M_YAYA_NOUN'], 'Maziwa hupatana na ya-: maziwa yamechemka.'],
  ['Ni nomino ipi ni ya ngeli ya YA-YA?', 'mafuta', ['kikombe', 'M_YAYA_NOUN'], ['mkulima', 'M_YAYA_NOUN'], ['barabara', 'M_YAYA_NOUN'], 'Mafuta hupatana na ya-: mafuta yamekwisha.'],
  ['Ni nomino ipi ni ya ngeli ya YA-YA?', 'machozi', ['kisu', 'M_YAYA_NOUN'], ['mvulana', 'M_YAYA_NOUN'], ['shule', 'M_YAYA_NOUN'], 'Machozi hupatana na ya-: machozi yametoka.'],
  ['Ni nomino ipi ni ya ngeli ya YA-YA?', 'mate', ['kalamu', 'M_YAYA_NOUN'], ['mgeni', 'M_YAYA_NOUN'], ['kiatu', 'M_YAYA_NOUN'], 'Mate hupatana na ya-: mate yamekauka.'],
  ['Ni nomino ipi ni ya ngeli ya YA-YA?', 'maradhi', ['mlango', 'M_YAYA_NOUN'], ['rafiki', 'M_YAYA_NOUN'], ['sufuria', 'M_YAYA_NOUN'], 'Maradhi hupatana na ya-: maradhi yamepungua.'],
];

// U-U: nouns with no plural, often a substance or a state (uji, unga, ugali, usingizi, uchafu, wino, mchele, mchanga): u- in the subject.
const UU = [
  ['Uji ___metiwa sukari.', 'u', ['ya', 'M_UU_PLURAL'], ['i', 'M_UU_OTHER'], ['li', 'M_UU_OTHER'], 'Uji ni wa ngeli ya U-U. Hupatana na u-: uji umetiwa sukari.'],
  ['Unga ___mekwisha sokoni.', 'u', ['ya', 'M_UU_PLURAL'], ['zi', 'M_UU_PLURAL'], ['i', 'M_UU_OTHER'], 'Unga ni wa ngeli ya U-U: unga umekwisha.'],
  ['Ugali ___meiva sasa.', 'u', ['i', 'M_UU_OTHER'], ['ya', 'M_UU_PLURAL'], ['li', 'M_UU_OTHER'], 'Ugali ni wa ngeli ya U-U: ugali umeiva.'],
  ['Usingizi ___mempata mtoto.', 'u', ['i', 'M_UU_OTHER'], ['ya', 'M_UU_PLURAL'], ['li', 'M_UU_OTHER'], 'Usingizi ni wa ngeli ya U-U: usingizi umempata mtoto.'],
  ['Uchafu ___mejaa mtaroni.', 'u', ['ya', 'M_UU_PLURAL'], ['i', 'M_UU_OTHER'], ['li', 'M_UU_OTHER'], 'Uchafu ni wa ngeli ya U-U: uchafu umejaa mtaroni.'],
  ['Wino ___mekauka kalamuni.', 'u', ['ya', 'M_UU_PLURAL'], ['i', 'M_UU_OTHER'], ['li', 'M_UU_OTHER'], 'Wino ni wa ngeli ya U-U: wino umekauka.'],
  ['Mchele ___mepikwa vizuri.', 'u', ['ya', 'M_UU_PLURAL'], ['i', 'M_UU_OTHER'], ['li', 'M_UU_OTHER'], 'Mchele ni wa ngeli ya U-U: mchele umepikwa.'],
  ['Mchanga ___meletwa shuleni.', 'u', ['ya', 'M_UU_PLURAL'], ['zi', 'M_UU_PLURAL'], ['i', 'M_UU_OTHER'], 'Mchanga ni wa ngeli ya U-U: mchanga umeletwa.'],
];
const UU_ID = [
  ['Ni nomino ipi ni ya ngeli ya U-U?', 'uji', ['kitabu', 'M_UU_NOUN'], ['mtoto', 'M_UU_NOUN'], ['nyumba', 'M_UU_NOUN'], 'Uji hauna wingi na hupatana na u-: uji umepoa.'],
  ['Ni nomino ipi ni ya ngeli ya U-U?', 'unga', ['kiti', 'M_UU_NOUN'], ['jiwe', 'M_UU_NOUN'], ['mwalimu', 'M_UU_NOUN'], 'Unga hupatana na u-: unga umekwisha.'],
  ['Ni nomino ipi ni ya ngeli ya U-U?', 'ugali', ['kikombe', 'M_UU_NOUN'], ['jicho', 'M_UU_NOUN'], ['meza', 'M_UU_NOUN'], 'Ugali hupatana na u-: ugali umeiva.'],
  ['Ni nomino ipi ni ya ngeli ya U-U?', 'usingizi', ['kisu', 'M_UU_NOUN'], ['jino', 'M_UU_NOUN'], ['kalamu', 'M_UU_NOUN'], 'Usingizi hupatana na u-: usingizi umempata mtoto.'],
  ['Ni nomino ipi ni ya ngeli ya U-U?', 'uchafu', ['kiatu', 'M_UU_NOUN'], ['mgeni', 'M_UU_NOUN'], ['sufuria', 'M_UU_NOUN'], 'Uchafu hupatana na u-: uchafu umejaa.'],
  ['Ni nomino ipi ni ya ngeli ya U-U?', 'wino', ['kiti', 'M_UU_NOUN'], ['mkulima', 'M_UU_NOUN'], ['barabara', 'M_UU_NOUN'], 'Wino hupatana na u-: wino umekauka.'],
];

// I-I: nouns for a state or an idea that are not counted (afya, njaa, nguvu, subira, heshima, akili, haki, bahati): i- in the subject.
const II = [
  ['Afya ___meimarika baada ya matibabu.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['li', 'M_II_OTHER'], 'Afya ni ya ngeli ya I-I. Hupatana na i-: afya imeimarika.'],
  ['Njaa ___nauma tumboni.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['a', 'M_II_OTHER'], 'Njaa ni ya ngeli ya I-I: njaa inauma.'],
  ['Nguvu ___mepungua mwilini.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['li', 'M_II_OTHER'], 'Nguvu ni ya ngeli ya I-I: nguvu imepungua.'],
  ['Subira ___na faida nyingi.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['ya', 'M_II_OTHER'], 'Subira ni ya ngeli ya I-I: subira ina faida.'],
  ['Heshima ___mepungua mtaani.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['li', 'M_II_OTHER'], 'Heshima ni ya ngeli ya I-I: heshima imepungua.'],
  ['Akili ___memwisha kwa uchovu.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['a', 'M_II_OTHER'], 'Akili ni ya ngeli ya I-I: akili imemwisha.'],
  ['Haki ___metendeka mahakamani.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['li', 'M_II_OTHER'], 'Haki ni ya ngeli ya I-I: haki imetendeka.'],
  ['Bahati ___memjia mkulima.', 'i', ['zi', 'M_II_PLURAL'], ['u', 'M_II_OTHER'], ['ya', 'M_II_OTHER'], 'Bahati ni ya ngeli ya I-I: bahati imemjia.'],
];
const II_ID = [
  ['Ni nomino ipi ni ya ngeli ya I-I?', 'afya', ['kitabu', 'M_II_NOUN'], ['mtoto', 'M_II_NOUN'], ['jiwe', 'M_II_NOUN'], 'Afya hupatana na i-: afya imeimarika.'],
  ['Ni nomino ipi ni ya ngeli ya I-I?', 'njaa', ['kiti', 'M_II_NOUN'], ['mwalimu', 'M_II_NOUN'], ['jino', 'M_II_NOUN'], 'Njaa hupatana na i-: njaa inauma.'],
  ['Ni nomino ipi ni ya ngeli ya I-I?', 'nguvu', ['kikombe', 'M_II_NOUN'], ['mkulima', 'M_II_NOUN'], ['jicho', 'M_II_NOUN'], 'Nguvu hupatana na i-: nguvu imepungua.'],
  ['Ni nomino ipi ni ya ngeli ya I-I?', 'subira', ['kisu', 'M_II_NOUN'], ['mgeni', 'M_II_NOUN'], ['jiko', 'M_II_NOUN'], 'Subira hupatana na i-: subira ina faida.'],
  ['Ni nomino ipi ni ya ngeli ya I-I?', 'heshima', ['kiatu', 'M_II_NOUN'], ['mvulana', 'M_II_NOUN'], ['jani', 'M_II_NOUN'], 'Heshima hupatana na i-: heshima imepungua.'],
  ['Ni nomino ipi ni ya ngeli ya I-I?', 'haki', ['kiti', 'M_II_NOUN'], ['mchele', 'M_II_NOUN'], ['jiwe', 'M_II_NOUN'], 'Haki hupatana na i-: haki imetendeka.'],
];

// PA-KU-MU: pa- (a place that is near and exact), ku- (far or general), mu- or m- (inside).
const PKM = [
  ['Mahali pale ___ kwa takataka.', 'pamejaa', ['kumejaa', 'M_PKM_MIX'], ['mmejaa', 'M_PKM_MIX'], ['imejaa', 'M_PKM_CLASS'], 'Pale ni mahali maalum, kwa hiyo pa-: pamejaa.'],
  ['Kule shambani ___ mazao mengi.', 'kuna', ['pana', 'M_PKM_MIX'], ['mna', 'M_PKM_MIX'], ['ina', 'M_PKM_CLASS'], 'Kule ni mahali pa mbali, kwa hiyo ku-: kuna.'],
  ['Humu ndani ___ giza.', 'mna', ['kuna', 'M_PKM_MIX'], ['pana', 'M_PKM_MIX'], ['una', 'M_PKM_CLASS'], 'Humu ndani ni ndani ya kitu, kwa hiyo mu- (m-): mna.'],
  ['Pale chini ya mti ___ kivuli.', 'pana', ['kuna', 'M_PKM_MIX'], ['mna', 'M_PKM_MIX'], ['una', 'M_PKM_CLASS'], 'Pale ni mahali maalum, kwa hiyo pa-: pana kivuli.'],
  ['Kule mbali ___ kijiji kikubwa.', 'kuna', ['pana', 'M_PKM_MIX'], ['mna', 'M_PKM_MIX'], ['ina', 'M_PKM_CLASS'], 'Kule mbali ni mahali pa mbali, kwa hiyo ku-: kuna.'],
  ['Mle mtoni ___ samaki wengi.', 'mna', ['pana', 'M_PKM_MIX'], ['kuna', 'M_PKM_MIX'], ['una', 'M_PKM_CLASS'], 'Mle mtoni ni ndani ya mto, kwa hiyo mu- (m-): mna samaki.'],
];
const PKM_S = [
  ['', 'Hapa pazuri.', ['Hapa kuzuri.', 'M_PKM_MIX'], ['Hapa mzuri.', 'M_PKM_MIX'], 'Hapa ni mahali maalum, kwa hiyo pa-: hapa pazuri.'],
  ['', 'Kule kuzuri.', ['Kule pazuri.', 'M_PKM_MIX'], ['Kule mzuri.', 'M_PKM_MIX'], 'Kule ni mahali pa mbali, kwa hiyo ku-: kule kuzuri.'],
  ['', 'Mle mnanuka vizuri.', ['Mle panonuka vizuri.', 'M_PKM_MIX'], ['Mle kunanuka vizuri.', 'M_PKM_MIX'], 'Mle ni ndani, kwa hiyo mu- (m-): mle mnanuka vizuri.'],
  ['', 'Pale pana kivuli.', ['Pale kuna kivuli.', 'M_PKM_MIX'], ['Pale ina kivuli.', 'M_PKM_CLASS'], 'Pale ni mahali maalum, kwa hiyo pa-: pale pana kivuli.'],
  ['', 'Huko kuna joto jingi.', ['Huko pana joto jingi.', 'M_PKM_MIX'], ['Huko una joto jingi.', 'M_PKM_CLASS'], 'Huko ni mahali pa mbali, kwa hiyo ku-: huko kuna joto jingi.'],
  ['', 'Humu mna harufu mbaya.', ['Humu pana harufu mbaya.', 'M_PKM_MIX'], ['Humu una harufu mbaya.', 'M_PKM_CLASS'], 'Humu ni ndani, kwa hiyo mu- (m-): humu mna harufu mbaya.'],
];

export const FAMILIES = [
  ...trio('ngeli.yaya', 'SARUFI.T4_NGELI_YA_YA_YA.YA_YA', YAYA, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'c', 'c'], topic: 'kuhusu ngeli ya YA-YA', hints: H('Maji, maziwa, mafuta, mate na machozi hupatana na ya-.', 'Nomino za YA-YA huanza na ma- na hazina umoja.') }),
  ...one('ngeli.yaya.tambua', 'SARUFI.T4_NGELI_YA_YA_YA.YA_YA', YAYA_ID, { stem: 'Chagua nomino ya ngeli ya YA-YA.', oc: 'b', tag: 'tambua', hints: H('Nomino za YA-YA hupatana na ya-: maji yamemwagika.', 'Hazina umoja, kama maji na maziwa.') }),
  ...trio('ngeli.uu', 'SARUFI.T5_NGELI_YA_U_U.U_U', UU, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'c', 'c'], topic: 'kuhusu ngeli ya U-U', hints: H('Uji, unga, ugali, usingizi na uchafu hupatana na u-.', 'Nomino za U-U hazina wingi, kwa hiyo hazitumii ya-.') }),
  ...one('ngeli.uu.tambua', 'SARUFI.T5_NGELI_YA_U_U.U_U', UU_ID, { stem: 'Chagua nomino ya ngeli ya U-U.', oc: 'b', tag: 'tambua', hints: H('Nomino za U-U hupatana na u-: uji umepoa.', 'Hazina wingi.') }),
  ...trio('ngeli.ii', 'SARUFI.T6_NGELI_YA_I_I.I_I', II, { stem: PFX, gapStem: PFX_GAP, oc: ['a', 'c', 'c'], topic: 'kuhusu ngeli ya I-I', hints: H('Afya, njaa, nguvu na subira hupatana na i-.', 'Nomino za I-I hazihesabiki, kwa hiyo hazitumii zi-.') }),
  ...one('ngeli.ii.tambua', 'SARUFI.T6_NGELI_YA_I_I.I_I', II_ID, { stem: 'Chagua nomino ya ngeli ya I-I.', oc: 'b', tag: 'tambua', hints: H('Nomino za I-I hupatana na i-: afya imeimarika.', 'Hizi ni hali au mawazo yasiyohesabika.') }),
  ...trio('ngeli.pakumu', 'SARUFI.T7_NGELI_YA_PA_KU_MU.PA_KU_MU', PKM, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika neno linalokosekana:', oc: ['a', 'b', 'b'], topic: 'kuhusu ngeli ya PA-KU-MU', hints: H('Pa- ni mahali maalum, ku- ni mahali pa mbali, mu- (m-) ni ndani ya kitu.', 'Soma neno la mahali mwanzoni: pale, kule, humu.') }),
  ...duo('ngeli.pakumu.sentensi', 'SARUFI.T7_NGELI_YA_PA_KU_MU.PA_KU_MU', PKM_S, { stem: 'Chagua sentensi sahihi.', tag: 'sentensi', oc: ['a', 'b'], topic: 'kuhusu ngeli ya PA-KU-MU', hints: H('Pa- ni mahali maalum, ku- ni mahali pa mbali, mu- (m-) ni ndani.', 'Neno la mahali na kiambishi cha kitenzi lazima vipatane.') }),
];
