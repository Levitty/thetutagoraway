// Kiswahili Grade 3, Kuandika (18 Nov 2026, offline). The file had KICD outcomes only; every skill is new.
import { E, H } from '../kiswahili-depth-lib.mjs';
import { hati, nafasi, alama, tahajia, insha, down } from '../kiswahili-kinds-lower.mjs';
const D = (k) => down(2, k);
const G = 3;
const HATI = 'KUANDI.T1_HATI_NADHIFU_KIFUNGU.HATI_NADHIFU';

export const NEW = [
  hati({ G, sub: 'KUANDI.T1_HATI_NADHIFU_KIFUNGU', tag: 'T1', letters: ['a', 'b'], theme: 'uzalendo', focus: 'kifungu', words: '25-30', line: 'Kenya ni nchi yetu nzuri.',
    pre: [[D('KUANDI.T1_HATI_NADHIFU.b'), E, 'Writing sentences in neat handwriting (Grade 2) comes before a whole passage.'], [D('KUANDI.T4_NAFASI_KATIKA_MAANDI.b'), E, 'Leaving space between words (Grade 2).']] }),
  hati({ G, sub: 'KUANDI.T2_HATI_NADHIFU', tag: 'T2', letters: ['a', 'b'], theme: 'shambani', focus: 'kubwa', words: '25-30', line: 'Juma na Amina wanalima shambani.',
    pre: [[HATI, E, 'Writing a neat passage (Theme 1) is the base for using capitals in it.'], [D('KUANDI.T2_HATI_NADHIFU_HERUFI_.b'), E, 'Writing capital letters in words and sentences (Grade 2).']] }),
  hati({ G, sub: 'KUANDI.T3_HATI_NADHIFU', tag: 'T3', letters: ['a', 'b'], theme: 'miezi ya mwaka', focus: 'ndogo', words: '55-60', line: 'Mwezi wa Aprili mvua hunyesha sana.',
    pre: [[HATI, E, 'Writing a neat passage (Theme 1) comes first.'], [D('KUANDI.T3_MPANGILIO_WA_HERUFI_.b'), E, 'Writing small letters in their right shapes (Grade 2).']] }),
  nafasi({ G, sub: 'KUANDI.T4_NAFASI_YA_PAMBIZO_KA', tag: 'T4', letters: ['a', 'b'], theme: 'kazi mbalimbali', words: 60, split: ['mku-lima', 'mkul-ima'],
    pre: [[HATI, E, 'A neat passage comes before laying it out with margins and aya.'], [D('KUANDI.T4_NAFASI_KATIKA_MAANDI.b'), E, 'Space between words (Grade 2) is the first rule of layout.']] }),
  alama({ G, sub: 'KUANDI.T5_MATUMIZI_YA_KIULIZI', tag: 'T5', letters: ['a', 'b', 'c'], theme: 'usalama barabarani', mark: 'kiulizi', words: '55-60',
    q: 'Je, tunavuka barabara wapi?', st: 'Tunavuka barabara kwenye kivuko.',
    pre: [[D('KUANDI.T5_UAKIFISHI.c'), E, 'Using the kiulizi in a sentence (Grade 2) comes first.'], ['KUANDI.T2_HATI_NADHIFU.HATI_NADHIFU', H, 'A capital letter follows the kiulizi.']] }),
  tahajia({ G, sub: 'KUANDI.T6_IMLA', tag: 'T6', letters: ['a', 'b'], theme: 'usafi wa mazingira', mode: 'imla', words: '55-60',
    mt: ['thelathini', 'selasini'], nasal: ['ndoo', 'doo'], vowel: ['saa', 'sa', 'kifaa cha kuonyesha wakati'],
    pre: [['KUSIKI.T6_MATAMSHI_BORA.MATAMSHI', E, 'Hearing dh, th and ch clearly comes before writing them from dictation.'], [D('KUANDI.T6_TAHAJIA_IMLA.b'), E, 'Writing three-syllable words from dictation (Grade 2).']] }),
  insha({ G, sub: 'KUANDI.T7_UANDISHI_WA_INSHA', tag: 'T7', letters: ['a', 'b'], theme: 'dukani', type: 'kisa', title: 'Siku Nilipoenda Dukani', words: '85-90',
    mix: ['Nilinunua sugar na bread.', 'Nilinunua sukari na mkate.'], tense: ['Jana nilienda dukani. Ninanunua sukari.', 'Jana nilienda dukani. Nilinunua sukari.'],
    pre: [['KUANDI.T5_MATUMIZI_YA_KIULIZI.ALAMA', E, 'Ending sentences with the right mark comes before a whole story.'], [D('KUANDI.T9_KUANDIKA_KIFUNGU.b'), E, 'Writing a short paragraph about his surroundings (Grade 2).']] }),
  tahajia({ G, sub: 'KUANDI.T8_TAHAJIA', tag: 'T8', letters: ['a', 'b'], theme: 'ndege nimpendaye', mode: 'tahajia', words: '85-90',
    mt: ['rangi', 'langi'], nasal: ['mbawa', 'bawa'], vowel: ['paa', 'pa', 'sehemu ya juu ya nyumba'],
    pre: [['KUANDI.T6_IMLA.IMLA', E, 'Spelling words from dictation comes before spelling in his own insha.'], [D('KUANDI.T8_TAHAJIA.b'), E, 'Writing sentences with correct spelling (Grade 2).']] }),
  insha({ G, sub: 'KUANDI.T9_INSHA_YA_MASIMULIZI', tag: 'T9', letters: ['a', 'b'], theme: 'sokoni', type: 'masimulizi', title: 'Safari Yangu ya Sokoni', words: '85-90',
    mix: ['Tulinunua sukuma na onions.', 'Tulinunua sukumawiki na vitunguu.'], tense: ['Tulifika sokoni mapema. Mama ananunua ndizi.', 'Tulifika sokoni mapema. Mama alinunua ndizi.'],
    pre: [['KUANDI.T7_UANDISHI_WA_INSHA.INSHA', E, 'A story with a beginning, middle and end (Theme 7) comes first.'], ['KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.UFAHAMU_KUSIKILIZA', H, 'Retelling events in order is the spoken form of a narrative.']] }),
  insha({ G, sub: 'KUANDI.T10_INSHA_YA_MAELEZO', tag: 'T10', letters: ['a', 'b'], theme: 'teknolojia', type: 'maelezo', title: 'Simu', words: '85-90',
    mix: ['Simu ina screen na battery.', 'Simu ina skrini na betri.'], tense: ['Simu hutumika kuwasiliana. Iliwasaidia watu kuzungumza.', 'Simu hutumika kuwasiliana. Huwasaidia watu kuzungumza.'],
    pre: [['KUANDI.T7_UANDISHI_WA_INSHA.INSHA', E, 'Planning and writing a short insha (Theme 7) comes first.'], [D('KUANDI.T7_UHARIRI.b'), H, 'Editing his own writing (Grade 2) before the clean copy.']] }),
];
export const ADD = [];
