// ============================================================================
// KISWAHILI GRADE 6, KUANDIKA: aina za insha, muundo wa insha ya wasifu, sehemu za barua rasmi, mitindo ya maandishi ya tarakilishi.
// DRAFT families, all off for children. Written offline by Claude (13 Nov 2026), no model call.
// A question can test only the recognition outcomes here. Writing an insha or a barua rasmi is composition marking
// (HOREB's insha marker, which itself waits for a native-speaker review); typing on a computer is a practical task.
// A native Kiswahili speaker must check every item, above all the layout of the barua rasmi.
// ============================================================================
import { trio, duo, one } from './kiswahili_g6_lib.js';

const H = (a, b) => [a, b];

const INSHA_TEXT = [
  ['"Mwalimu Njeri ni mtu mpole na mkarimu. Ana kimo cha wastani na tabasamu la kupendeza. Wanafunzi wote wanampenda." Ni insha ya aina gani?', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Kifungu kinamwelezea Mwalimu Njeri: tabia na sura yake. Hiyo ni insha ya wasifu.'],
  ['"Mzee Otieno ni mvuvi hodari wa Ziwa Victoria. Ana ndevu nyeupe na mikono yenye nguvu. Amevua samaki kwa miaka arobaini." Ni insha ya aina gani?', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Kifungu kinamwelezea Mzee Otieno: sura yake na kazi yake. Hiyo ni insha ya wasifu.'],
  ['"Jumapili iliyopita, tulienda kutembelea shamba la babu. Tulipofika, tulimsaidia kuvuna maharagwe. Jioni, tulirudi nyumbani tukiwa tumechoka." Ni insha ya aina gani?', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Kifungu kinasimulia mambo yaliyotokea kwa mpangilio. Hiyo ni insha ya masimulizi.'],
  ['"Siku moja, Wanjiku alipoteza kalamu yake darasani. Alitafuta kila mahali, kisha akaipata mfukoni mwake." Ni insha ya aina gani?', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Kifungu kinasimulia matukio kwa mpangilio. Hiyo ni insha ya masimulizi.'],
  ['"Ili kutengeneza chai, chemsha maji na majani ya chai. Ongeza maziwa na sukari. Koroga na uipakue." Ni insha ya aina gani?', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Kifungu kinaeleza jinsi ya kufanya kitu hatua kwa hatua. Hiyo ni insha ya maelezo.'],
  ['"Simu ni kifaa cha mawasiliano. Tunaitumia kupiga simu na kutuma ujumbe. Ina skrini na betri." Ni insha ya aina gani?', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Kifungu kinaeleza kitu ni nini na kinatumika vipi. Hiyo ni insha ya maelezo.'],
];
const INSHA_DEF = [
  ['Insha inayosimulia kilichotokea kwa mpangilio huitwa insha ya ___.', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Insha ya masimulizi husimulia kilichotokea kwa mpangilio.'],
  ['Insha inayomwelezea mtu, sura yake na tabia yake huitwa insha ya ___.', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Insha ya wasifu humwelezea mtu au kitu: sura na tabia.'],
  ['Insha inayoeleza jinsi ya kufanya kitu huitwa insha ya ___.', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Insha ya maelezo hueleza jambo au jinsi ya kufanya kitu.'],
  ['Insha inayoeleza sifa za mnyama kipenzi huitwa insha ya ___.', 'wasifu', ['masimulizi', 'M_INS_WASIFU_STORY'], ['maelezo', 'M_INS_WASIFU_STORY'], 'Kueleza sifa za mnyama, mtu, kitu au mahali ni wasifu.'],
  ['Insha inayoanza na "Siku moja..." na kueleza kilichotokea huitwa insha ya ___.', 'masimulizi', ['wasifu', 'M_INS_STORY_WASIFU'], ['maelezo', 'M_INS_STORY_WASIFU'], 'Kueleza kilichotokea kwa mpangilio ni masimulizi.'],
  ['Insha inayoeleza hatua za kupika wali huitwa insha ya ___.', 'maelezo', ['masimulizi', 'M_INS_MAELEZO_STORY'], ['wasifu', 'M_INS_MAELEZO_STORY'], 'Kueleza hatua za kufanya kitu ni maelezo.'],
];

const MUUNDO = [
  ['Insha ya wasifu huanza na ___ ambao hutaja anayeelezwa.', 'utangulizi', ['mwili', 'M_INS6_PART'], ['hitimisho', 'M_INS6_PART'], ['kichwa', 'M_INS6_PART'], 'Utangulizi ni sehemu ya kwanza ya insha. Hutaja anayeelezwa.'],
  ['Sehemu ya insha inayotoa maelezo mengi kuhusu sura na tabia huitwa ___.', 'mwili', ['utangulizi', 'M_INS6_PART'], ['hitimisho', 'M_INS6_PART'], ['kichwa', 'M_INS6_PART'], 'Mwili ni sehemu kuu ya insha yenye maelezo mengi.'],
  ['Sehemu ya mwisho ya insha huitwa ___.', 'hitimisho', ['utangulizi', 'M_INS6_PART'], ['mwili', 'M_INS6_PART'], ['kichwa', 'M_INS6_PART'], 'Hitimisho ni sehemu ya mwisho inayofunga insha.'],
  ['Jina la insha lililo juu ya ukurasa huitwa ___.', 'kichwa', ['utangulizi', 'M_INS6_PART'], ['hitimisho', 'M_INS6_PART'], ['mwili', 'M_INS6_PART'], 'Kichwa ni jina la insha na huandikwa juu.'],
];
const MUUNDO_S = [
  ['Sentensi ipi inafaa kuwa katika utangulizi wa insha ya wasifu wa rafiki?', 'Rafiki yangu Wanjiru ni msichana wa miaka kumi na moja.', ['Nywele zake ni nyeusi na ndefu.', 'M_INS6_PART'], ['Mwishowe, Wanjiru ni rafiki mwema.', 'M_INS6_PART'], 'Utangulizi hutaja anayeelezwa na kumtambulisha kwa ufupi.'],
  ['Sentensi ipi inafaa kuwa katika mwili wa insha ya wasifu wa rafiki?', 'Nywele zake ni nyeusi na ndefu, na anapenda kucheza mpira.', ['Rafiki yangu Wanjiru ni msichana wa miaka kumi na moja.', 'M_INS6_PART'], ['Mwishowe, Wanjiru ni rafiki mwema.', 'M_INS6_PART'], 'Mwili hueleza sura, tabia na mambo anayopenda.'],
  ['Sentensi ipi inafaa kuwa katika hitimisho la insha ya wasifu wa rafiki?', 'Mwishowe, Wanjiru ni rafiki ninayempenda sana.', ['Rafiki yangu Wanjiru ni msichana wa miaka kumi na moja.', 'M_INS6_PART'], ['Nywele zake ni nyeusi na ndefu.', 'M_INS6_PART'], 'Hitimisho hufunga insha kwa wazo la mwisho.'],
  ['Sentensi ipi inafaa kuwa katika utangulizi wa insha ya wasifu wa babu?', 'Babu yangu anaitwa Mzee Otieno na anaishi Kisumu.', ['Ana ndevu nyeupe na mikono yenye nguvu.', 'M_INS6_PART'], ['Hivyo, babu ni mtu wa kuigwa.', 'M_INS6_PART'], 'Utangulizi hutaja jina na mahali anapoishi.'],
  ['Sentensi ipi inafaa kuwa katika mwili wa insha ya wasifu wa babu?', 'Ana ndevu nyeupe na hupenda kuvua samaki asubuhi.', ['Babu yangu anaitwa Mzee Otieno.', 'M_INS6_PART'], ['Hivyo, babu ni mtu wa kuigwa.', 'M_INS6_PART'], 'Mwili hueleza sura na shughuli zake.'],
  ['Sentensi ipi inafaa kuwa katika hitimisho la insha ya wasifu wa babu?', 'Hivyo, babu ni mtu wa kuigwa kwa bidii yake.', ['Babu yangu anaitwa Mzee Otieno.', 'M_INS6_PART'], ['Ana ndevu nyeupe.', 'M_INS6_PART'], 'Hitimisho hufunga kwa maoni ya mwisho.'],
];

const BARUA = [
  ['Mada ya barua rasmi huandikwa katika ___ cha barua.', 'kichwa', ['mwili', 'M_BAR6_PART'], ['salamu', 'M_BAR6_PART'], ['anwani', 'M_BAR6_PART'], 'Kichwa cha barua hutaja mada, kwa mfano "KUOMBA RUHUSA".'],
  ['Anwani ya mwandikaji wa barua rasmi huandikwa upande wa ___ juu ya karatasi.', 'kulia', ['kushoto', 'M_BAR6_POSITION'], ['katikati', 'M_BAR6_POSITION'], ['chini', 'M_BAR6_POSITION'], 'Anwani ya mwandikaji huandikwa juu kulia.'],
  ['Anwani ya mwandikiwa wa barua rasmi huandikwa upande wa ___.', 'kushoto', ['kulia', 'M_BAR6_POSITION'], ['katikati', 'M_BAR6_POSITION'], ['chini', 'M_BAR6_POSITION'], 'Anwani ya mwandikiwa huandikwa upande wa kushoto, chini ya tarehe.'],
  ['Mwisho wa barua rasmi huwa "Wako ___,".', 'mwaminifu', ['mpenzi', 'M_BAR6_FRIENDLY'], ['rafiki', 'M_BAR6_FRIENDLY'], ['mdogo', 'M_BAR6_FRIENDLY'], 'Barua rasmi huisha kwa "Wako mwaminifu,".'],
  ['Mwishoni mwa barua rasmi, mwandishi huweka sahihi na ___ lake.', 'jina', ['tarehe', 'M_BAR6_PART'], ['anwani', 'M_BAR6_PART'], ['kichwa', 'M_BAR6_PART'], 'Mwandishi hutia sahihi na kuandika jina lake chini ya "Wako mwaminifu,".'],
  ['Sehemu kuu ya barua rasmi yenye ujumbe wote huitwa ___ wa barua.', 'mwili', ['kichwa', 'M_BAR6_PART'], ['salamu', 'M_BAR6_PART'], ['anwani', 'M_BAR6_PART'], 'Mwili wa barua una ujumbe wote.'],
];
const BARUA_S = [
  ['Barua kwa mwalimu mkuu huanza na salamu ipi?', 'Ndugu Mwalimu Mkuu,', ['Habari rafiki yangu,', 'M_BAR6_FRIENDLY'], ['Mambo vipi mwalimu,', 'M_BAR6_FRIENDLY'], 'Barua rasmi huanza kwa salamu ya heshima.'],
  ['Barua rasmi huisha kwa maneno gani?', 'Wako mwaminifu,', ['Rafiki yako wa dhati,', 'M_BAR6_FRIENDLY'], ['Wako mpenzi,', 'M_BAR6_FRIENDLY'], 'Barua rasmi huisha kwa "Wako mwaminifu,".'],
  ['Ni mpangilio upi sahihi wa sehemu za barua rasmi?', 'Anwani, tarehe, salamu, kichwa, mwili, mwisho', ['Salamu, mwili, anwani, kichwa, tarehe, mwisho', 'M_BAR6_ORDER'], ['Mwili, kichwa, salamu, mwisho, anwani, tarehe', 'M_BAR6_ORDER'], 'Barua rasmi huanza na anwani na tarehe, kisha salamu, kichwa, mwili na mwisho.'],
  ['Barua rasmi inatumia lugha ya aina gani?', 'Lugha ya heshima na ya wazi', ['Lugha ya mtaani', 'M_BAR6_FRIENDLY'], ['Lugha ya utani', 'M_BAR6_FRIENDLY'], 'Barua rasmi hutumia lugha ya heshima.'],
  ['Kichwa cha barua rasmi kiandikweje?', 'Kwa herufi kubwa au kupigiwa mstari', ['Ndani ya mwili wa barua', 'M_BAR6_PART'], ['Katika mstari wa sahihi', 'M_BAR6_PART'], 'Kichwa cha barua husimama peke yake na huonekana wazi.'],
];

const STYLE = [
  ['Herufi zilizonenepeshwa huitwa herufi ___.', 'nzito', ['mlazo', 'M_TAR6_MIX'], ['kubwa', 'M_TAR6_CAPS'], ['ndogo', 'M_TAR6_CAPS'], 'Herufi nzito ni zilizonenepeshwa ili zionekane zaidi.'],
  ['Herufi zinazoegemea upande huitwa herufi ___.', 'mlazo', ['nzito', 'M_TAR6_MIX'], ['kubwa', 'M_TAR6_CAPS'], ['ndogo', 'M_TAR6_CAPS'], 'Herufi mlazo huegemea upande.'],
  ['Ili neno liwe kubwa au dogo, tunabadilisha ___ ya herufi.', 'saizi', ['rangi', 'M_TAR6_MIX'], ['mstari', 'M_TAR6_MIX'], ['mlazo', 'M_TAR6_MIX'], 'Saizi ya herufi huamua ukubwa wake.'],
  ['Ili kichwa cha habari kionekane zaidi, tunakifanya herufi ___.', 'nzito', ['ndogo', 'M_TAR6_CAPS'], ['fupi', 'M_TAR6_CAPS'], 'Herufi nzito huvuta macho zaidi.'],
  ['Kuweka kazi yako salama katika tarakilishi huitwa ___.', 'kuhifadhi', ['kuchapisha', 'M_TAR6_ICON'], ['kufuta', 'M_TAR6_ICON'], ['kufunga', 'M_TAR6_ICON'], 'Kuhifadhi ni kuweka kazi salama ili isipotee.'],
  ['Kutoa kazi kwenye karatasi kwa kichapishi huitwa ___.', 'kuchapisha', ['kuhifadhi', 'M_TAR6_ICON'], ['kufuta', 'M_TAR6_ICON'], ['kufunga', 'M_TAR6_ICON'], 'Kuchapisha ni kutoa nakala ya kazi kwenye karatasi.'],
];

export const FAMILIES = [
  ...one('insha.kifungu', 'KUANDI.T5_INSHA_ZA_MAELEZO.AINA_ZA_INSHA', INSHA_TEXT, { stem: 'Chagua aina ya insha.', oc: 'a', tag: 'kifungu', rung: 2, hints: H('Je, kifungu kinamwelezea mtu, kinasimulia matukio au kinaeleza jinsi ya kufanya kitu?', 'Wasifu huelezea, masimulizi husimulia, maelezo hueleza hatua.') }),
  ...trio('insha.maana', 'KUANDI.T5_INSHA_ZA_MAELEZO.AINA_ZA_INSHA', INSHA_DEF, { stem: 'Chagua aina sahihi ya insha.', gapStem: 'Andika aina ya insha:', oc: ['a', 'a', 'a'], thinOk: true, topic: 'kuhusu aina za insha', hints: H('Kila aina ya insha ina kazi yake: kumwelezea mtu, kusimulia matukio au kueleza hatua.', 'Soma ufafanuzi kwa makini.') }),
  ...trio('insha.muundo', 'KUANDI.T6_INSHA_YA_WASIFU.MUUNDO_WASIFU', MUUNDO, { stem: 'Chagua sehemu sahihi ya insha.', gapStem: 'Andika sehemu ya insha:', oc: ['a', 'a', 'a'], topic: 'kuhusu muundo wa insha', hints: H('Insha ina sehemu nne, na kila moja ina nafasi yake.', 'Fikiria kama sehemu hiyo iko juu, mwanzoni, katikati au mwishoni.') }),
  ...one('insha.muundo.sentensi', 'KUANDI.T6_INSHA_YA_WASIFU.MUUNDO_WASIFU', MUUNDO_S, { stem: 'Chagua sentensi sahihi.', oc: 'a', tag: 'sentensi', rung: 2, hints: H('Utangulizi hutaja anayeelezwa, mwili hueleza, hitimisho hufunga.', 'Jiulize sentensi inaanzisha, inaeleza au inafunga.') }),
  ...trio('barua.rasmi', 'KUANDI.T4_BARUA_RASMI.BARUA_RASMI', BARUA, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'b', 'b'], topic: 'kuhusu sehemu za barua rasmi', hints: H('Kila sehemu ya barua rasmi ina mahali pake na kazi yake.', 'Fikiria karatasi kutoka juu hadi chini, na upande wa karatasi.') }),
  ...one('barua.rasmi.sentensi', 'KUANDI.T4_BARUA_RASMI.BARUA_RASMI', BARUA_S, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'sentensi', rung: 2, hints: H('Barua rasmi hutumia lugha ya heshima.', 'Salamu na mwisho wa barua rasmi hutofautiana na ule wa barua ya kirafiki.') }),
  ...trio('tarakilishi.mitindo', 'KUANDI.T3_KUANDIKA_KWA_TARAKIL.MAANDISHI_TARAKILISHI', STYLE, { stem: 'Chagua jibu sahihi.', gapStem: 'Andika jibu sahihi:', topic: 'kuhusu maandishi ya tarakilishi', hints: H('Kila mtindo na kila kitendo cha tarakilishi kina jina lake.', 'Fikiria jinsi herufi zinavyoonekana au kinachotokea kwa kazi yako.') }),
];
