// ============================================================================
// KISWAHILI GRADE 5, KUANDIKA NA MATUMIZI YA KIDIJITALI: aina za insha, baruapepe, sehemu za tarakilishi, usalama wa kidijitali.
// DRAFT families, all off for children. Written offline by Claude (12 Nov 2026), no model call.
// A question can test only the recognition outcomes here. Writing an insha or a baruapepe is composition marking
// (HOREB's insha marker, which itself waits for a native-speaker review); using a computer is a practical task.
// A native Kiswahili speaker must check every item, and above all the baruapepe parts and the kinds of insha:
// docs/qa/kiswahili-g5-native-check-2026-11-12.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g5_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- aina za insha
const INSHA_TEXT = [
  ['"Otieno ni mvulana mrefu na mwenye bidii. Ana umri wa miaka kumi na macho makubwa. Anapenda kucheza mpira na kusoma vitabu." Ni insha ya aina gani?', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Kifungu kinamwelezea Otieno: sura yake, umri wake na anachopenda. Hiyo ni insha ya wasifu.'],
  ['"Bibi yangu ni mwanamke mpole na mkarimu. Ana nywele nyeupe na anapenda kusimulia hadithi. Kila mtu kijijini anamheshimu." Ni insha ya aina gani?', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Kifungu kinamwelezea bibi: tabia yake na sura yake. Hiyo ni insha ya wasifu.'],
  ['"Jumamosi iliyopita, Achieng alienda sokoni. Alipofika, aliona mvua inaanza kunyesha. Alikimbilia kwenye duka na kusubiri hadi mvua ikakoma." Ni insha ya aina gani?', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Kifungu kinasimulia mambo yaliyotokea kwa mpangilio. Hiyo ni insha ya masimulizi.'],
  ['"Siku moja, Juma alipotea msituni. Alitembea kwa muda mrefu, kisha akaona moshi. Alifuata moshi huo hadi akafika kijijini." Ni insha ya aina gani?', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Kifungu kinasimulia matukio kwa mpangilio. Hiyo ni insha ya masimulizi.'],
  ['"Ili kupika wali, kwanza osha mchele. Kisha chemsha maji na uweke mchele ndani. Funika sufuria hadi maji yakauke." Ni insha ya aina gani?', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Kifungu kinaeleza jinsi ya kufanya kitu hatua kwa hatua. Hiyo ni insha ya maelezo.'],
  ['"Kibodi ni sehemu ya tarakilishi yenye vitufe vya herufi na nambari. Tunaitumia kuandika maneno. Iko mbele ya skrini." Ni insha ya aina gani?', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Kifungu kinaeleza kitu ni nini na hutumika vipi. Hiyo ni insha ya maelezo.'],
];
const INSHA_DEF = [
  ['Insha inayosimulia matukio kwa mpangilio huitwa insha ya ___.', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Insha ya masimulizi husimulia matukio yaliyotokea kwa mpangilio.'],
  ['Insha inayomwelezea mtu, sura yake na tabia yake huitwa insha ya ___.', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Insha ya wasifu humwelezea mtu: sura, tabia na maisha yake.'],
  ['Insha inayoeleza jinsi ya kufanya kitu huitwa insha ya ___.', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Insha ya maelezo hueleza jambo au jinsi ya kufanya kitu.'],
  ['Insha inayoanza na "Siku moja..." na kueleza kilichotokea huitwa insha ya ___.', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Kueleza kilichotokea kwa mpangilio ni masimulizi.'],
  ['Insha inayoeleza tabia na sura ya rafiki yako huitwa insha ya ___.', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Kumwelezea mtu ni wasifu.'],
  ['Insha inayoeleza hatua za kupanda mche huitwa insha ya ___.', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Kueleza hatua za kufanya kitu ni maelezo.'],
];

// ---------------------------------------------------------------- baruapepe
const BARUA = [
  ['Anwani ya mpokeaji wa baruapepe huandikwa katika sehemu ya "___".', 'Kwa', ['Mada', 'M_BAR_NO_SUBJECT'], ['kona ya juu', 'M_BAR_LETTER_FORM'], ['Hitimisho', 'M_BAR_ORDER'], 'Katika baruapepe, anwani ya mpokeaji huandikwa katika sehemu ya "Kwa".'],
  ['Kichwa kifupi kinachosema baruapepe inahusu nini huandikwa katika sehemu ya "___".', 'Mada', ['Ujumbe', 'M_BAR_NO_SUBJECT'], ['Salamu', 'M_BAR_ORDER'], ['kona ya juu', 'M_BAR_LETTER_FORM'], 'Mada ni kichwa kifupi cha baruapepe.'],
  ['Mwili wa baruapepe huanza kwa ___.', 'salamu', ['hitimisho', 'M_BAR_ORDER'], ['jina la mwandishi', 'M_BAR_ORDER'], ['mada', 'M_BAR_NO_SUBJECT'], 'Mwili wa baruapepe huanza kwa salamu, kisha ujumbe.'],
  ['Baruapepe huisha kwa hitimisho na ___ la mwandishi.', 'jina', ['salamu', 'M_BAR_ORDER'], ['mada', 'M_BAR_NO_SUBJECT'], ['anwani', 'M_BAR_LETTER_FORM'], 'Baruapepe huisha kwa hitimisho kisha jina la mwandishi.'],
  ['Maelezo kamili ya baruapepe huandikwa katika ___.', 'ujumbe', ['mada', 'M_BAR_NO_SUBJECT'], ['anwani', 'M_BAR_LETTER_FORM'], ['salamu', 'M_BAR_ORDER'], 'Ujumbe wote huandikwa katika mwili wa baruapepe. Mada ni kichwa kifupi tu.'],
  ['Sehemu ya mada huja ___ ya ujumbe.', 'kabla', ['baada', 'M_BAR_ORDER'], ['mwishoni', 'M_BAR_ORDER'], ['ndani', 'M_BAR_NO_SUBJECT'], 'Mada huja juu, kabla ya ujumbe, ili mpokeaji ajue baruapepe inahusu nini.'],
];

// ---------------------------------------------------------------- sehemu za tarakilishi
const TARA = [
  ['Tunatumia ___ kupigia herufi na nambari.', 'kibodi', ['kipanya', 'M_TAR_MIX_PARTS'], ['skrini', 'M_TAR_MIX_PARTS'], ['kichapishi', 'M_TAR_MIX_PARTS'], 'Kibodi ina vitufe vya herufi na nambari.'],
  ['Maandishi yetu huonekana kwenye ___.', 'skrini', ['kibodi', 'M_TAR_MIX_PARTS'], ['kipanya', 'M_TAR_MIX_PARTS'], ['kichapishi', 'M_TAR_MIX_PARTS'], 'Skrini huonyesha maandishi na picha.'],
  ['Tunasogeza kielekezi kwa kutumia ___.', 'kipanya', ['kibodi', 'M_TAR_MIX_PARTS'], ['skrini', 'M_TAR_MIX_PARTS'], ['kichapishi', 'M_TAR_MIX_PARTS'], 'Kipanya husogeza kielekezi na hutumika kubofya.'],
  ['Tunachapisha kazi yetu kwenye karatasi kwa kutumia ___.', 'kichapishi', ['kibodi', 'M_TAR_MIX_PARTS'], ['kipanya', 'M_TAR_MIX_PARTS'], ['skrini', 'M_TAR_MIX_PARTS'], 'Kichapishi huchapisha kwenye karatasi.'],
  ['Ili kuona picha niliyoitengeneza, ninatazama ___.', 'skrini', ['kibodi', 'M_TAR_MIX_PARTS'], ['kichapishi', 'M_TAR_MIX_PARTS'], ['kipanya', 'M_TAR_MIX_PARTS'], 'Skrini huonyesha picha na maandishi.'],
  ['Ili kuandika jina langu, ninabonyeza vitufe vya ___.', 'kibodi', ['kipanya', 'M_TAR_MIX_PARTS'], ['skrini', 'M_TAR_MIX_PARTS'], ['kichapishi', 'M_TAR_MIX_PARTS'], 'Vitufe vya herufi viko kwenye kibodi.'],
];
const TARA_FN = [
  ['Kibodi hufanya nini?', 'Hutumika kupigia herufi na nambari', ['Huchapisha kwenye karatasi', 'M_TAR_FUNCTION'], ['Huonyesha picha', 'M_TAR_FUNCTION'], ['Husogeza kielekezi', 'M_TAR_FUNCTION'], 'Kibodi ina vitufe vya kuandika herufi na nambari.'],
  ['Skrini hufanya nini?', 'Huonyesha maandishi na picha', ['Huchapisha kwenye karatasi', 'M_TAR_FUNCTION'], ['Hutumika kupigia herufi', 'M_TAR_FUNCTION'], ['Husogeza kielekezi', 'M_TAR_FUNCTION'], 'Skrini inatuonyesha tunachoandika na kuona.'],
  ['Kichapishi hufanya nini?', 'Huchapisha maandishi kwenye karatasi', ['Huonyesha picha', 'M_TAR_FUNCTION'], ['Hutumika kupigia herufi', 'M_TAR_FUNCTION'], ['Husogeza kielekezi', 'M_TAR_FUNCTION'], 'Kichapishi huweka maandishi kwenye karatasi.'],
  ['Kipanya hufanya nini?', 'Husogeza kielekezi na kubofya', ['Huchapisha kwenye karatasi', 'M_TAR_FUNCTION'], ['Huonyesha picha', 'M_TAR_FUNCTION'], ['Hutumika kupigia herufi', 'M_TAR_FUNCTION'], 'Kipanya hutuwezesha kusogeza kielekezi kwenye skrini.'],
  ['Ni sehemu ipi ya tarakilishi inayotumika kuchapisha kwenye karatasi?', 'kichapishi', ['kibodi', 'M_TAR_MIX_PARTS'], ['kipanya', 'M_TAR_MIX_PARTS'], ['skrini', 'M_TAR_MIX_PARTS'], 'Kichapishi huchapisha kwenye karatasi.'],
];

// ---------------------------------------------------------------- usalama wa kidijitali
const DIG_SITUATION = [
  ['Ujumbe kutoka kwa mtu usiyemjua unasema umeshinda zawadi, na una kiungo. Ufanye nini?', 'Nimwonyeshe mzazi au mwalimu kwanza', ['Nikifungue haraka', 'M_DIG_LINK'], ['Nitume kiungo kwa marafiki wote', 'M_DIG_LINK'], ['Nijibu kwa kutoa jina langu na nambari ya simu', 'M_DIG_SHARE'], 'Viungo vya watu usiowajua vinaweza kuwa hatari. Mwonyeshe mtu mzima kabla ya kukifungua.'],
  ['Unatafuta kifungu cha kusoma mtandaoni. Utumie tovuti ipi?', 'Tovuti ya shule au maktaba iliyopendekezwa na mwalimu', ['Tovuti yoyote inayotokea kwanza', 'M_DIG_UNSAFE_SITE'], ['Tovuti inayotaka nambari yangu ya simu kabla ya kusoma', 'M_DIG_UNSAFE_SITE'], ['Tovuti inayodai pesa kabla ya kusoma', 'M_DIG_UNSAFE_SITE'], 'Tumia tovuti salama zilizopendekezwa na mwalimu au mzazi.'],
  ['Unamaliza kutumia kompyuta ya shule. Ufanye nini?', 'Nitoke kwenye akaunti yangu', ['Niiache akaunti yangu wazi', 'M_DIG_SHARE'], ['Nimwachie mwenzangu nenosiri langu', 'M_DIG_SHARE'], ['Niandike nenosiri langu ubaoni', 'M_DIG_SHARE'], 'Ukitoka kwenye akaunti yako, hakuna mtu mwingine anayeweza kuitumia.'],
  ['Mtu usiyemjua mtandaoni anakuomba anwani ya nyumbani kwenu. Ufanye nini?', 'Nisimpe, na nimweleze mzazi', ['Nimpe kwa kuwa ni mwema', 'M_DIG_SHARE'], ['Nimpe nusu ya anwani', 'M_DIG_SHARE'], ['Nimtumie picha ya nyumba yetu', 'M_DIG_SHARE'], 'Maelezo binafsi kama anwani si ya kumpa mtu usiyemjua.'],
  ['Rafiki anakuomba umpe nenosiri la simu yako ili acheze mchezo. Ufanye nini?', 'Nikatae na niweke nenosiri langu siri', ['Nimpe kwa muda mfupi tu', 'M_DIG_SHARE'], ['Nimpe na nimwambie asimwambie mtu', 'M_DIG_SHARE'], ['Nimwandikie kwenye karatasi', 'M_DIG_SHARE'], 'Nenosiri ni siri yako. Usimpe mtu mwingine, hata rafiki.'],
  ['Kikundi cha ujumbe kina kiungo kisichojulikana. Ufanye nini?', 'Nimwonyeshe mtu mzima kabla ya kukifungua', ['Nikifungue kuona kinaelekea wapi', 'M_DIG_LINK'], ['Nikitume kwa wengine', 'M_DIG_LINK'], ['Nikibofye mara mbili', 'M_DIG_LINK'], 'Kiungo kisichojulikana kinaweza kuwa hatari. Mwonyeshe mtu mzima kwanza.'],
];
const DIG_STATEMENT = [
  ['', 'Ninaweka nenosiri langu siri.', ['Ninampa rafiki yangu nenosiri langu.', 'M_DIG_SHARE'], ['Ninaandika nenosiri langu kwenye ukuta wa shule.', 'M_DIG_SHARE'], 'Nenosiri ni siri yako. Usimpe mtu mwingine.'],
  ['', 'Ninamwonyesha mzazi kiungo nisichokijua kabla ya kukifungua.', ['Ninafungua kila kiungo ninachotumiwa.', 'M_DIG_LINK'], ['Ninatuma kiungo kwa wengine bila kukisoma.', 'M_DIG_LINK'], 'Viungo visivyojulikana vinaweza kuwa hatari. Mwonyeshe mtu mzima kwanza.'],
  ['', 'Ninasoma kwenye tovuti ya shule iliyopendekezwa na mwalimu.', ['Ninasoma kwenye tovuti yoyote inayoomba nambari ya simu yangu.', 'M_DIG_UNSAFE_SITE'], ['Ninaingiza maelezo yangu kwenye tovuti ya zawadi.', 'M_DIG_UNSAFE_SITE'], 'Tumia tovuti salama na usitoe maelezo yako binafsi.'],
  ['', 'Ninatoka kwenye akaunti yangu ninapomaliza kutumia kompyuta ya shule.', ['Ninaiacha akaunti yangu wazi kwa kila mtu.', 'M_DIG_SHARE'], ['Ninamwachia mwenzangu nenosiri langu.', 'M_DIG_SHARE'], 'Ukitoka kwenye akaunti yako, hakuna mwingine anayeweza kuitumia.'],
  ['', 'Ninamwambia mzazi mtu asiyejulikana akiniomba anwani yangu.', ['Ninampa anwani yangu mtu nisiyemjua.', 'M_DIG_SHARE'], ['Ninamtumia picha zangu mtu nisiyemjua.', 'M_DIG_SHARE'], 'Maelezo binafsi si ya kumpa mtu usiyemjua.'],
  ['', 'Ninauliza mwalimu kabla ya kupakua faili ya mtandaoni.', ['Ninapakua faili yoyote ninayoiona.', 'M_DIG_LINK'], ['Ninafungua faili kutoka kwa mtu nisiyemjua.', 'M_DIG_LINK'], 'Faili zisizojulikana zinaweza kuwa hatari. Uliza mtu mzima kwanza.'],
];

export const FAMILIES = [
  // ---- AINA ZA INSHA
  ...one('insha.kifungu', 'KUANDI.T1_INSHA_YA_WASIFU.AINA_ZA_INSHA', INSHA_TEXT, { stem: 'Chagua aina ya insha.', oc: 'a', tag: 'kifungu', rung: 2, hints: H('Je, kifungu kinamwelezea mtu, kinasimulia matukio, au kinaeleza jinsi ya kufanya kitu?', 'Wasifu humwelezea mtu, masimulizi husimulia kilichotokea, na maelezo hueleza jambo.') }),
  ...trio('insha.maana', 'KUANDI.T1_INSHA_YA_WASIFU.AINA_ZA_INSHA', INSHA_DEF, { stem: 'Chagua aina sahihi ya insha.', gapStem: 'Andika aina ya insha:', oc: ['a', 'a', 'a'], thinOk: true, topic: 'kuhusu aina za insha', hints: H('Fikiria insha hiyo inafanya nini: kumwelezea mtu, kusimulia matukio, au kueleza jinsi ya kufanya kitu.', 'Aina tatu za insha zina majina tofauti.') }),
  // ---- BARUAPEPE
  ...trio('baruapepe', 'KUANDI.T4_BARUAPEPE.BARUAPEPE', BARUA, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'a', 'a'], topic: 'kuhusu muundo wa baruapepe', hints: H('Baruapepe ina sehemu kadhaa zenye mpangilio wake.', 'Baruapepe haitumii anwani kwenye kona kama barua ya karatasi.') }),
  // ---- SEHEMU ZA TARAKILISHI
  ...trio('tarakilishi.sehemu', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.SEHEMU_TARAKILISHI', TARA, { stem: 'Chagua sehemu ya tarakilishi inayokamilisha sentensi.', gapStem: 'Andika sehemu ya tarakilishi inayokosekana:', oc: ['a', 'a', 'a'], topic: 'kuhusu sehemu za tarakilishi', hints: H('Kila sehemu ya tarakilishi ina kazi yake.', 'Fikiria unachoshika au unachotazama.') }),
  ...one('tarakilishi.kazi', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.SEHEMU_TARAKILISHI', TARA_FN, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'kazi', rung: 2, hints: H('Kila sehemu ya tarakilishi ina kazi yake.', 'Fikiria unachofanya unapotumia sehemu hiyo.') }),
  // ---- USALAMA WA KIDIJITALI
  ...one('usalama.hali', 'KUSOMA.T4_KUSOMA_KWA_MAPANA.USALAMA_DIJITALI', DIG_SITUATION, { stem: 'Chagua hatua ya kiusalama.', oc: 'a', tag: 'hali', rung: 2, hints: H('Nenosiri na maelezo yako binafsi ni siri.', 'Mwonyeshe mtu mzima kabla ya kufungua kitu usichokijua.') }),
  ...duo('usalama.sentensi', 'KUSOMA.T4_KUSOMA_KWA_MAPANA.USALAMA_DIJITALI', DIG_STATEMENT, { stem: 'Chagua sentensi inayoonyesha hatua ya kiusalama.', oc: ['a', 'a'], tag: 'sentensi', topic: 'kuhusu usalama wa kidijitali', hints: H('Hatua salama hulinda nenosiri na maelezo yako.', 'Hatua isiyo salama humpa mtu usiyemjua nafasi ya kuingia kwenye akaunti yako.') }),
];
