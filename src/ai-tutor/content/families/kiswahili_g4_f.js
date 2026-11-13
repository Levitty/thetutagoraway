// ============================================================================
// KISWAHILI GRADE 4, KUANDIKA: aina za insha na sehemu zake, barua ya kirafiki, sehemu za tarakilishi, uakifishi.
// DRAFT families, all off for children. Written offline by Claude (13 Nov 2026), no model call.
// A question can test only the recognition outcomes here. Writing an insha or a barua is composition marking (HOREB's insha
// marker, which itself waits for a native-speaker review); using a computer is a practical task.
// A native Kiswahili speaker must check every item, above all the parts of a barua ya kirafiki and the kinds of insha:
// docs/qa/kiswahili-g4-native-check-2026-11-13.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g4_lib.js';

const H = (a, b) => [a, b];
const W = (pre, text, right, ws, because) => [text, right, ...ws.split(' ').map(w => { const [t, c] = w.split(':'); return [t.replace(/_/g, ' '), `M4_${pre}_${c}`]; }), because];

// ---------------------------------------------------------------- aina za insha
const INSHA_TEXT = [
  W('INS', '"Otieno ni mvulana mrefu na mwenye bidii. Ana macho makubwa na anapenda kusoma." Ni insha ya aina gani?', 'wasifu', 'masimulizi:WASIFU_STORY maelezo:WASIFU_STORY', 'Kifungu kinamwelezea Otieno: sura yake na tabia yake. Hiyo ni insha ya wasifu.'),
  W('INS', '"Bibi yangu ni mpole na mkarimu. Ana nywele nyeupe na kila mtu anamheshimu." Ni insha ya aina gani?', 'wasifu', 'masimulizi:WASIFU_STORY maelezo:WASIFU_STORY', 'Kifungu kinamwelezea bibi: tabia yake na sura yake. Hiyo ni insha ya wasifu.'),
  W('INS', '"Jumamosi, Achieng alienda sokoni. Mvua ilipoanza, alikimbilia kibandani." Ni insha ya aina gani?', 'masimulizi', 'wasifu:STORY_WASIFU maelezo:STORY_WASIFU', 'Kifungu kinasimulia mambo yaliyotokea kwa mpangilio. Hiyo ni insha ya masimulizi.'),
  W('INS', '"Siku moja, Juma alipotea msituni. Alitembea kwa muda mrefu kisha akaona moshi. Alifuata moshi hadi kijijini." Ni insha ya aina gani?', 'masimulizi', 'wasifu:STORY_WASIFU maelezo:STORY_WASIFU', 'Kifungu kinasimulia matukio kwa mpangilio. Hiyo ni insha ya masimulizi.'),
  W('INS', '"Ili kupika uji, chemsha maji kwanza. Kisha koroga unga taratibu hadi uji uwe laini." Ni insha ya aina gani?', 'maelezo', 'masimulizi:MAELEZO_STORY wasifu:MAELEZO_STORY', 'Kifungu kinaeleza jinsi ya kufanya kitu hatua kwa hatua. Hiyo ni insha ya maelezo.'),
  W('INS', '"Kibodi ni sehemu ya tarakilishi yenye vitufe vya herufi. Tunaitumia kuandika maneno." Ni insha ya aina gani?', 'maelezo', 'masimulizi:MAELEZO_STORY wasifu:MAELEZO_STORY', 'Kifungu kinaeleza kitu ni nini na hutumika vipi. Hiyo ni insha ya maelezo.'),
];
const INSHA_DEF = [
  W('INS', 'Insha inayosimulia matukio kwa mpangilio huitwa insha ya ___.', 'masimulizi', 'wasifu:STORY_WASIFU maelezo:STORY_WASIFU', 'Insha ya masimulizi husimulia matukio yaliyotokea kwa mpangilio.'),
  W('INS', 'Insha inayomwelezea mtu, sura yake na tabia yake huitwa insha ya ___.', 'wasifu', 'masimulizi:WASIFU_STORY maelezo:WASIFU_STORY', 'Insha ya wasifu humwelezea mtu: sura, tabia na maisha yake.'),
  W('INS', 'Insha inayoeleza jinsi ya kufanya kitu huitwa insha ya ___.', 'maelezo', 'masimulizi:MAELEZO_STORY wasifu:MAELEZO_STORY', 'Insha ya maelezo hueleza jambo au jinsi ya kufanya kitu.'),
  W('INS', 'Insha inayoanza na "Siku moja..." na kueleza kilichotokea huitwa insha ya ___.', 'masimulizi', 'wasifu:STORY_WASIFU maelezo:STORY_WASIFU', 'Kueleza kilichotokea kwa mpangilio ni masimulizi.'),
  W('INS', 'Insha inayoeleza tabia na sura ya rafiki yako huitwa insha ya ___.', 'wasifu', 'masimulizi:WASIFU_STORY maelezo:WASIFU_STORY', 'Kumwelezea mtu ni wasifu.'),
  W('INS', 'Insha inayoeleza hatua za kupanda mche huitwa insha ya ___.', 'maelezo', 'masimulizi:MAELEZO_STORY wasifu:MAELEZO_STORY', 'Kueleza hatua za kufanya kitu ni maelezo.'),
];
const INSHA_PART = [
  W('INS', 'Sehemu ya mwisho ya insha huitwa ___.', 'hitimisho', 'utangulizi:PART_ORDER kiini:PART_ORDER kichwa:PART_ORDER', 'Insha huisha na hitimisho.'),
  W('INS', 'Sehemu ya kwanza ya insha huitwa ___.', 'utangulizi', 'hitimisho:PART_ORDER kiini:PART_ORDER kichwa:PART_ORDER', 'Insha huanza na utangulizi.'),
  W('INS', 'Sehemu ya katikati ya insha, yenye mambo makuu, huitwa ___.', 'kiini', 'utangulizi:PART_ORDER hitimisho:PART_ORDER kichwa:PART_ORDER', 'Katikati ya insha kuna kiini.'),
  W('INS', 'Sehemu inayotambulisha mada ya insha huitwa ___.', 'utangulizi', 'kiini:PART_ORDER hitimisho:PART_ORDER kichwa:PART_ORDER', 'Utangulizi hutambulisha mada.'),
  W('INS', 'Sehemu inayomaliza insha kwa muhtasari huitwa ___.', 'hitimisho', 'utangulizi:PART_ORDER kiini:PART_ORDER kichwa:PART_ORDER', 'Hitimisho humaliza insha.'),
  W('INS', 'Insha ina sehemu tatu: utangulizi, kiini na ___.', 'hitimisho', 'kichwa:PART_ORDER aya:PART_ORDER herufi:PART_ORDER', 'Sehemu tatu za insha ni utangulizi, kiini na hitimisho.'),
];

// ---------------------------------------------------------------- sehemu za tarakilishi
const TARA = [
  W('TAR', 'Tunatumia ___ kupigia herufi na nambari.', 'kibodi', 'kipanya:MIX_PARTS skrini:MIX_PARTS kichapishi:MIX_PARTS', 'Kibodi ina vitufe vya herufi na nambari.'),
  W('TAR', 'Maandishi yetu huonekana kwenye ___.', 'skrini', 'kibodi:MIX_PARTS kipanya:MIX_PARTS kichapishi:MIX_PARTS', 'Skrini huonyesha maandishi na picha.'),
  W('TAR', 'Tunasogeza kielekezi kwa kutumia ___.', 'kipanya', 'kibodi:MIX_PARTS skrini:MIX_PARTS kichapishi:MIX_PARTS', 'Kipanya husogeza kielekezi na hutumika kubofya.'),
  W('TAR', 'Tunachapisha kazi yetu kwenye karatasi kwa kutumia ___.', 'kichapishi', 'kibodi:MIX_PARTS kipanya:MIX_PARTS skrini:MIX_PARTS', 'Kichapishi huchapisha kwenye karatasi.'),
  W('TAR', 'Ili kuacha nafasi kati ya maneno, tunabonyeza kitufe cha ___.', 'nafasi', 'herufi:MIX_PARTS nambari:MIX_PARTS skrini:MIX_PARTS', 'Kitufe cha nafasi huacha nafasi kati ya maneno.'),
  W('TAR', 'Ili kuona picha niliyoitengeneza, ninatazama ___.', 'skrini', 'kibodi:MIX_PARTS kichapishi:MIX_PARTS kipanya:MIX_PARTS', 'Skrini huonyesha picha na maandishi.'),
];
const TARA_FN = [
  W('TAR', 'Kibodi hufanya nini?', 'Hutumika kupigia herufi na nambari', 'Huchapisha_kwenye_karatasi:FUNCTION Huonyesha_picha:FUNCTION Husogeza_kielekezi:FUNCTION', 'Kibodi ina vitufe vya kuandika herufi na nambari.'),
  W('TAR', 'Skrini hufanya nini?', 'Huonyesha maandishi na picha', 'Huchapisha_kwenye_karatasi:FUNCTION Hutumika_kupigia_herufi:FUNCTION Husogeza_kielekezi:FUNCTION', 'Skrini inatuonyesha tunachoandika na kuona.'),
  W('TAR', 'Kichapishi hufanya nini?', 'Huchapisha maandishi kwenye karatasi', 'Huonyesha_picha:FUNCTION Hutumika_kupigia_herufi:FUNCTION Husogeza_kielekezi:FUNCTION', 'Kichapishi huweka maandishi kwenye karatasi.'),
  W('TAR', 'Kipanya hufanya nini?', 'Husogeza kielekezi na kubofya', 'Huchapisha_kwenye_karatasi:FUNCTION Huonyesha_picha:FUNCTION Hutumika_kupigia_herufi:FUNCTION', 'Kipanya hutuwezesha kusogeza kielekezi kwenye skrini.'),
  W('TAR', 'Kitufe cha nafasi hufanya nini?', 'Huacha nafasi kati ya maneno', 'Huchapisha_kwenye_karatasi:FUNCTION Huonyesha_picha:FUNCTION Husogeza_kielekezi:FUNCTION', 'Kitufe cha nafasi huacha nafasi kati ya maneno tunapoandika.'),
];

// ---------------------------------------------------------------- uakifishi
const UAK = [
  W('UAK', '', 'Unaenda wapi?', 'unaenda_wapi?:CAPITAL Unaenda_wapi.:FULLSTOP unaenda_wapi.:FULLSTOP', 'Sentensi huanza kwa herufi kubwa na swali huisha kwa kiulizi (?).'),
  W('UAK', '', 'Wanjiru alienda Mombasa jana.', 'wanjiru_alienda_mombasa_jana.:CAPITAL Wanjiru_alienda_Mombasa_jana:NO_END Wanjiru_alienda_mombasa_jana.:CAPITAL', 'Majina ya pekee na mwanzo wa sentensi huanza kwa herufi kubwa, na sentensi huisha kwa kikomo.'),
  W('UAK', '', 'Nilinunua maembe, machungwa na ndizi.', 'Nilinunua_maembe_machungwa_na_ndizi.:KOMA Nilinunua,_maembe_machungwa,_na_ndizi.:KOMA nilinunua_maembe,_machungwa_na_ndizi.:CAPITAL', 'Koma hutenganisha vitu katika orodha: maembe, machungwa na ndizi.'),
  W('UAK', '', 'Hongera, umeshinda!', 'Hongera,_umeshinda?:MARK Hongera,_umeshinda.:MARK hongera,_umeshinda!:CAPITAL', 'Alama ya hisi (!) huonyesha furaha au mshangao.'),
  W('UAK', '', 'Je, umefanya kazi yako?', 'Je,_umefanya_kazi_yako.:FULLSTOP je,_umefanya_kazi_yako?:CAPITAL Je_umefanya_kazi_yako?:KOMA', 'Swali huisha kwa kiulizi (?) na huanza kwa herufi kubwa.'),
  W('UAK', '', 'Juma, Otieno na Achieng wanacheza.', 'Juma_Otieno_na_Achieng_wanacheza.:KOMA juma,_otieno_na_achieng_wanacheza.:CAPITAL Juma,_Otieno_na_Achieng_wanacheza:NO_END', 'Majina ya watu huanza kwa herufi kubwa na koma hutenganisha majina katika orodha.'),
  W('UAK', '', 'Lo! Nyoka ameingia nyumbani.', 'Lo?_Nyoka_ameingia_nyumbani.:MARK Lo._Nyoka_ameingia_nyumbani.:MARK lo!_Nyoka_ameingia_nyumbani.:CAPITAL', 'Kihisishi "Lo" huandikwa na alama ya hisi (!).'),
];
const UAK_RULE = [
  W('UAK', 'Sentensi ya swali huisha kwa alama gani?', '?', '.:FULLSTOP ,:KOMA !:MARK', 'Swali huisha kwa kiulizi (?).'),
  W('UAK', 'Sentensi ya kawaida huisha kwa alama gani?', '.', '?:FULLSTOP ,:KOMA !:MARK', 'Sentensi ya kawaida huisha kwa kikomo (.).'),
  W('UAK', 'Alama ya hisi ni ipi?', '!', '?:MARK .:MARK ,:MARK', 'Alama ya hisi ni (!). Huonyesha furaha au mshangao.'),
  W('UAK', 'Alama ya kutenganisha vitu katika orodha ni ipi?', ',', '.:KOMA ?:KOMA !:KOMA', 'Koma (,) hutenganisha vitu katika orodha.'),
  W('UAK', 'Sentensi huanza kwa herufi gani?', 'herufi kubwa', 'herufi_ndogo:CAPITAL alama_ya_hisi:CAPITAL koma:CAPITAL', 'Kila sentensi huanza kwa herufi kubwa.'),
];

// ---------------------------------------------------------------- barua ya kirafiki
const BARUA = [
  W('BAR', 'Barua ya kirafiki huanza kwa anwani ya mwandishi, kisha tarehe, kisha ___.', 'salamu', 'hitimisho:ORDER jina:ORDER mwili:ORDER', 'Baada ya tarehe huja salamu, kisha mwili wa barua.'),
  W('BAR', 'Salamu ya barua ya kirafiki huanza kwa neno "___" na jina la rafiki.', 'Mpendwa', 'Wako:GREETING Heshima:GREETING Mheshimiwa:GREETING', 'Barua ya kirafiki huanza kwa "Mpendwa" na jina la rafiki.'),
  W('BAR', 'Hitimisho la barua ya kirafiki ni "___ yako" na jina lako.', 'Rafiki', 'Mtumishi:GREETING Mkuu:GREETING Mwalimu:GREETING', 'Barua ya kirafiki huisha kwa "Rafiki yako" na jina.'),
  W('BAR', 'Anwani ya mwandishi huandikwa upande wa ___ juu.', 'kulia', 'kushoto:PLACE katikati:PLACE chini:PLACE', 'Anwani ya mwandishi huandikwa upande wa kulia juu.'),
  W('BAR', 'Sehemu ya barua yenye ujumbe wote huitwa ___ wa barua.', 'mwili', 'mwisho:ORDER mwanzo:ORDER kichwa:ORDER', 'Ujumbe wote huandikwa katika mwili wa barua.'),
  W('BAR', 'Barua ya kirafiki huisha kwa hitimisho kisha ___ la mwandishi.', 'jina', 'salamu:ORDER tarehe:ORDER anwani:ORDER', 'Barua huisha kwa hitimisho, kisha jina la mwandishi.'),
];
const BARUA_FORM = [
  W('BAR', 'Ni hitimisho lipi linafaa barua ya kirafiki?', 'Rafiki yako, Wanjiru', 'Wako_mtiifu,_Wanjiru:GREETING Mheshimiwa,_Wanjiru:GREETING Kwa_heshima,_Wanjiru:GREETING', 'Barua ya kirafiki huisha kwa "Rafiki yako". "Wako mtiifu" ni ya barua rasmi.'),
  W('BAR', 'Ni salamu ipi inafaa barua ya kirafiki?', 'Mpendwa Atieno,', 'Mheshimiwa_Mkuu,:GREETING Kwa_Mkurugenzi,:GREETING Bwana_Mkubwa,:GREETING', 'Barua ya kirafiki huanza kwa "Mpendwa" na jina la rafiki.'),
  W('BAR', 'Ni hitimisho lipi linafaa barua ya kirafiki?', 'Rafiki yako, Juma', 'Wako_mtiifu,_Juma:GREETING Wako_katika_ujenzi_wa_taifa,_Juma:GREETING Mheshimiwa,_Juma:GREETING', 'Barua ya kirafiki huisha kwa "Rafiki yako".'),
  W('BAR', 'Ni salamu ipi inafaa barua ya kirafiki?', 'Mpendwa Baraka,', 'Kwa_Mwalimu_Mkuu,:GREETING Bwana_Mheshimiwa,:GREETING Waheshimiwa,:GREETING', 'Barua ya kirafiki huanza kwa "Mpendwa" na jina la rafiki.'),
  W('BAR', 'Ni hitimisho lipi linafaa barua ya kirafiki?', 'Rafiki yako mpendwa, Neema', 'Wako_mtiifu_daima,_Neema:GREETING Mheshimiwa_mkuu,_Neema:GREETING Kwa_heshima_kubwa,_Neema:GREETING', 'Barua ya kirafiki huisha kwa "Rafiki yako".'),
];

export const FAMILIES = [
  // ---- AINA ZA INSHA
  ...one('insha.kifungu', 'KUANDI.T1_INSHA_YA_WASIFU.AINA_ZA_INSHA', INSHA_TEXT, { stem: 'Chagua aina ya insha.', oc: 'a', tag: 'kifungu', rung: 2, hints: H('Je, kifungu kinamwelezea mtu, kinasimulia matukio, au kinaeleza jinsi ya kufanya kitu?', 'Wasifu humwelezea mtu, masimulizi husimulia kilichotokea, na maelezo hueleza jambo.') }),
  ...trio('insha.maana', 'KUANDI.T1_INSHA_YA_WASIFU.AINA_ZA_INSHA', INSHA_DEF, { stem: 'Chagua aina sahihi ya insha.', gapStem: 'Andika aina ya insha:', oc: ['a', 'a', 'a'], thinOk: true, topic: 'kuhusu aina za insha', hints: H('Fikiria insha hiyo inafanya nini: kumwelezea mtu, kusimulia matukio, au kueleza jinsi ya kufanya kitu.', 'Aina tatu za insha zina majina tofauti.') }),
  ...trio('insha.sehemu', 'KUANDI.T1_INSHA_YA_WASIFU.AINA_ZA_INSHA', INSHA_PART, { stem: 'Chagua sehemu sahihi ya insha.', gapStem: 'Andika sehemu ya insha:', oc: ['a', 'a', 'a'], tag: 'sehemu', topic: 'kuhusu sehemu za insha', hints: H('Insha ina mwanzo, katikati na mwisho.', 'Kila sehemu ya insha ina kazi yake.') }),
  // ---- SEHEMU ZA TARAKILISHI
  ...trio('tarakilishi.sehemu', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.SEHEMU_TARAKILISHI', TARA, { stem: 'Chagua sehemu ya tarakilishi inayokamilisha sentensi.', gapStem: 'Andika sehemu ya tarakilishi inayokosekana:', oc: ['a', 'a', 'a'], topic: 'kuhusu sehemu za tarakilishi', hints: H('Kila sehemu ya tarakilishi ina kazi yake.', 'Fikiria unachoshika au unachotazama.') }),
  ...one('tarakilishi.kazi', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.SEHEMU_TARAKILISHI', TARA_FN, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'kazi', rung: 2, hints: H('Kila sehemu ya tarakilishi ina kazi yake.', 'Fikiria unachofanya unapotumia sehemu hiyo.') }),
  // ---- UAKIFISHI
  ...duo('uakifishi', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.UAKIFISHI', UAK, { stem: 'Chagua sentensi sahihi.', oc: ['d', 'd'], topic: 'kuhusu alama za uakifishi', hints: H('Angalia herufi ya kwanza ya sentensi na ya kila jina la pekee.', 'Angalia alama ya mwisho na mahali pa kupumzika katika orodha.') }),
  ...one('uakifishi.kanuni', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.UAKIFISHI', UAK_RULE, { stem: 'Chagua jibu sahihi.', oc: 'd', tag: 'kanuni', rung: 1, hints: H('Fikiria sentensi ya aina hiyo inavyoisha.', 'Kila alama ya uakifishi ina kazi yake.') }),
  // ---- BARUA YA KIRAFIKI
  ...trio('barua', 'KUANDI.T4_BARUA_YA_KIRAFIKI.BARUA', BARUA, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'a', 'a'], topic: 'kuhusu sehemu za barua ya kirafiki', hints: H('Barua ya kirafiki ina sehemu kadhaa zenye mpangilio wake.', 'Barua ya kirafiki si ya heshima rasmi.') }),
  ...one('barua.rafiki', 'KUANDI.T4_BARUA_YA_KIRAFIKI.BARUA', BARUA_FORM, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'rafiki', rung: 2, hints: H('Fikiria barua hiyo inamwandikia nani: rafiki au afisa?', 'Barua ya kirafiki hutumia maneno ya ukaribu.') }),
];
