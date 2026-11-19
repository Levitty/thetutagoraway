// Kiswahili Grade 2, Kuandika (18 Nov 2026, offline). The file had KICD outcomes only; every skill is new.
import { m, p, s, E, H } from '../kiswahili-depth-lib.mjs';
import { hati, alama, tahajia, insha, down } from '../kiswahili-kinds-lower.mjs';
const D = (k) => down(1, k);
const G = 2;
const HATI = 'KUANDI.T1_HATI_NADHIFU.HATI_NADHIFU';

export const NEW = [
  hati({ G, sub: 'KUANDI.T1_HATI_NADHIFU', tag: 'T1', letters: ['a', 'b'], theme: 'shuleni', focus: 'kifungu', words: '15', line: 'Shule yetu ni safi.',
    pre: [[D('KUANDI.T4_HATI_NADHIFU.b'), E, 'Neat writing of words in Grade 1 comes before neat sentences.'], [D('KUANDI.T1_UANDISHI_BORA.b'), E, 'Sitting well and holding the pencil well (Grade 1).']] }),
  hati({ G, sub: 'KUANDI.T2_HATI_NADHIFU_HERUFI_', tag: 'T2', letters: ['a', 'b'], theme: 'haki zangu', focus: 'kubwa', words: '15', line: 'Mwalimu Akinyi anafundisha darasa la pili.',
    pre: [[HATI, E, 'Neat sentences (Theme 1) come first.'], [D('KUANDI.T2_HATI_NADHIFU_HERUFI_.b'), E, 'Forming the capital letters in Grade 1.']] }),
  hati({ G, sub: 'KUANDI.T3_MPANGILIO_WA_HERUFI_', tag: 'T3', letters: ['a', 'b'], theme: 'lishe bora', focus: 'ndogo', words: '20', line: 'Tunakula matunda na mboga kila siku.',
    pre: [[HATI, E, 'Neat sentences (Theme 1) come first.'], [D('KUANDI.T3_HATI_NADHIFU_HERUFI_.b'), E, 'Forming the small letters in Grade 1.']] }),
  s('KUANDI.T4_NAFASI_KATIKA_MAANDI', 'NAFASI_KATI_YA_MANENO', 'Andika sentensi ukiacha nafasi ifaayo kati ya maneno', ['a', 'b'],
    'Writes sentences with one finger space between words, none inside a word, keeps the verb and its parts as one word (ninakwenda, not ni na kwenda) and does not run on into the next sentence, in 8 of 10 new items (the teacher also checks it in the exercise book).',
    ['chagua sentensi iliyoandikwa vizuri', 'hesabu maneno', 'andika sentensi (mwalimu anasahihisha)'], ['application'], {
      pre: [[HATI, E, 'Neat letters on the line come before spacing the words.'], [D('KUANDI.T7_KUANDIKA_MANENO_IPAS.b'), E, 'Writing single words properly in Grade 1.']],
      mis: [
        m('M2_NAF_NONE_T4', 'Leaves no space between words (Basilimefika).', ['Ni lipi limeandikwa vizuri?', 'Basilimefikamapema.', 'Basi limefika mapema.'], 'Speech runs words together and the child writes the stream as he hears it.', 'Put a finger space after each word; count the words aloud first.', 'Acha nafasi ya kidole kati ya neno na neno.', 'Sentensi hii ina maneno mangapi?'),
        m('M2_NAF_SPLIT_T4', 'Splits the verb into its parts (ni na kwenda, a li fika).', ['Ni lipi sahihi?', 'Mimi ni na kwenda sokoni.', 'Mimi ninakwenda sokoni.'], 'The child hears the parts of the verb as separate sounds and writes a space after each.', 'Underline the whole verb in one line; it is one word however long.', 'Kitendo ni neno moja: ninakwenda.', 'Neno hili linasema kitendo kimoja?'),
        m('M2_NAF_INSIDE_T4', 'Puts a space inside a word at a syllable (ba si, ga ri).', ['Ni lipi sahihi?', 'Ga ri ni jekundu.', 'Gari ni jekundu.'], 'The child has learnt to write syllable by syllable and leaves a gap after each.', 'Write the syllables close together and read the word aloud; then the gap goes after the word.', 'Silabi za neno moja hukaa pamoja: gari.', 'Ga ri ni neno moja au mawili?'),
        m('M2_NAF_UNEVEN_T4', 'Leaves very large gaps between some words and none between others.', ['Nafasi kati ya maneno inafaa kuwa vipi?', 'yoyote, kubwa au ndogo', 'sawa, kama kidole kimoja'], 'The child does not measure; he writes as space allows on the line.', 'Use a finger or a lolly stick as the measure for each gap.', 'Kila nafasi iwe sawa na kidole kimoja.', 'Nafasi zako zina ukubwa sawa?'),
      ],
      pack: p('The child counts the words aloud before writing, then writes each word whole with one finger space after it.',
        ['Writes single words neatly.', 'Andika: basi', 'basi'],
        ['a finger or lolly stick as a space measure', 'word cards to lay out with gaps', 'a sentence strip to cut into words'],
        ['Say the sentence.', 'Count the words.', 'Write each word whole.', 'Put a finger space after each word.'],
        ['usafiri: a sentence about the bus', 'copying from the board', 'labelling a picture'],
        ['Basi limefika mapema.', ['Point at each gap.', 'Kuna maneno mangapi?'], 'The child writes two sentences with a finger space after every word.'],
        [['Sentensi "Gari limesimama." ina maneno mangapi?', 'mawili', 'counting words'], ['Ni ipi sahihi: "ninakwenda" au "ni na kwenda"?', 'ninakwenda', 'verb as one word']]),
    }),
  alama({ G, sub: 'KUANDI.T5_UAKIFISHI', tag: 'T5', letters: ['a', 'b', 'c'], theme: 'mnyama nimpendaye', mark: 'kiulizi', words: '20',
    q: 'Je, sungura anakula nini?', st: 'Sungura anakula majani.',
    pre: [[D('KUANDI.T5_MATUMIZI_YA_KIKOMO.b'), E, 'Ending a sentence with a kikomo (Grade 1) comes before the kiulizi.'], ['KUANDI.T2_HATI_NADHIFU_HERUFI_.HATI_NADHIFU', H, 'A capital follows the mark.']] }),
  tahajia({ G, sub: 'KUANDI.T6_TAHAJIA_IMLA', tag: 'T6', letters: ['a', 'b', 'c'], theme: 'ukoo', mode: 'imla', words: '10',
    mt: ['shangazi', 'sangazi'], nasal: ['ndugu', 'dugu'], vowel: ['kaa', 'ka', 'kuketi au kuishi mahali'],
    pre: [['KUSIKI.T6_MATAMSHI_BORA.MATAMSHI', E, 'Hearing ny and ng clearly comes before writing family words from dictation.'], [D('KUANDI.T6_TAHAJIA_IMLA.b'), E, 'Writing two-syllable words from dictation in Grade 1.']] }),
  s('KUANDI.T7_UHARIRI', 'UHARIRI', 'Hariri maandishi yako: herufi kubwa, kikomo, maneno na tahajia', ['a', 'b'],
    'Reads his own writing back and corrects it: a capital at the start, a kikomo or kiulizi at the end, no word left out, words spelt right, then makes a clean copy, in 8 of 10 new items (the teacher also checks the before and after copies).',
    ['tambua kosa', 'sahihisha sentensi', 'hariri kifungu (mwalimu anasahihisha)'], ['evaluation'], {
      pre: [['KUANDI.T5_UAKIFISHI.ALAMA', E, 'Knowing where the marks go comes before checking for them.'], ['KUANDI.T2_HATI_NADHIFU_HERUFI_.HATI_NADHIFU', E, 'Knowing where the capitals go comes before checking for them.'], [D('KUANDI.T8_TAHAJIA.b'), H, 'Spelling words of Grade 1 correctly.']],
      mis: [
        m('M2_HAR_NEAT_T7', 'Thinks editing means copying the same writing more neatly, mistakes and all.', ['Kuhariri ni nini?', 'kuandika upya kwa mwandiko mzuri', 'kusoma maandishi na kusahihisha makosa'], 'The child has seen clean copies praised and thinks neatness is the whole job.', 'Give a short passage with three planted mistakes; the child finds them before copying.', 'Kuhariri ni kutafuta na kusahihisha makosa.', 'Umepata makosa mangapi?'),
        m('M2_HAR_NOREAD_T7', 'Does not read his writing back, so a missing word stays missing.', ['Sahihisha: Mama alipika chakula kitamu sana sana.', 'Mama alipika chakula kitamu sana sana.', 'Mama alipika chakula kitamu sana.'], 'The child knows what he meant and his eye fills the gap or skips the repeat.', 'Read it aloud with a finger under each word.', 'Soma kwa sauti, neno kwa neno.', 'Ukisoma kwa sauti, unasikia nini?'),
        m('M2_HAR_CAPSTOP_T7', 'Checks spelling only and leaves out the capital and the kikomo.', ['Hariri: tuliketi sebuleni', 'tuliketi sebuleni', 'Tuliketi sebuleni.'], 'Spelling is what the teacher marks most, so it is all the child looks for.', 'An editing card: Herufi kubwa? Kikomo? Neno limekosekana? Tahajia?', 'Angalia herufi kubwa mwanzoni na kikomo mwishoni.', 'Sentensi inaanza na kuishaje?'),
        m('M2_HAR_HOLE_T7', 'Rubs out so hard the page tears, or scribbles over the error so it cannot be read.', ['Ukipata kosa, unafanya nini?', 'ninalifuta kwa nguvu au kulichora juu', 'ninapiga mstari mmoja juu yake na kuandika sahihi'], 'The child fears a mistake showing.', 'Show one neat line through the error and the right word above it.', 'Piga mstari mmoja juu ya kosa, andika sahihi.', 'Mwalimu ataweza kusoma marekebisho yako?'),
      ],
      pack: p('The child reads his writing aloud with a finger under each word and checks four things on a card before the clean copy.',
        ['Writes a sentence with a capital and a kikomo.', 'Andika sentensi kuhusu sebule yenu.', 'Sebule yetu ni safi.'],
        ['an editing card with four checks', 'a passage with planted errors', 'a coloured pencil for corrections'],
        ['Read aloud with a finger.', 'Check capitals and marks.', 'Check for missing words and spelling.', 'Write the clean copy.'],
        ['sebuleni: a passage about the sitting room', 'a note to a parent', 'a class story wall'],
        ['tuliketi sebuleni', ['Point at the first letter.', 'Kuna kosa gani hapa?'], 'The child finds and corrects two errors in his own sentence.'],
        [['Hariri: baba anasoma gazeti', 'Baba anasoma gazeti.', 'capital and kikomo'], ['Kuhariri ni nini?', 'kusahihisha makosa', 'editing']]),
    }),
  tahajia({ G, sub: 'KUANDI.T8_TAHAJIA', tag: 'T8', letters: ['a', 'b'], theme: 'usalama wangu', mode: 'tahajia', words: '20',
    mt: ['barabara', 'balabala'], nasal: ['mbele', 'bele'], vowel: ['taa', 'ta', 'kifaa cha kutoa mwanga'],
    pre: [['KUANDI.T6_TAHAJIA_IMLA.IMLA', E, 'Spelling from dictation comes before spelling in his own sentences.'], [D('KUANDI.T8_TAHAJIA.b'), E, 'Spelling simple words in Grade 1.']] }),
  insha({ G, sub: 'KUANDI.T9_KUANDIKA_KIFUNGU', tag: 'T9', id: 'KIFUNGU', letters: ['a', 'b'], theme: 'hospitalini', type: 'picha', title: 'Hospitali Yetu', words: '30',
    mix: ['Daktari alinipa tablets.', 'Daktari alinipa vidonge.'], tense: ['Jana nilienda hospitalini. Daktari ananipima.', 'Jana nilienda hospitalini. Daktari alinipima.'],
    pre: [[D('KUANDI.T9_KIFUNGU_KUTOKANA_NA_.b'), E, 'Writing a few sentences from a picture in Grade 1 comes first.'], ['KUANDI.T7_UHARIRI.UHARIRI', H, 'Editing his own writing before the clean copy.']] }),
  tahajia({ G, sub: 'KUANDI.T10_MANENO_NA_SENTENSI', tag: 'T10', letters: ['a', 'b', 'c'], theme: 'hali ya anga', mode: 'maneno', words: '20',
    mt: ['radi', 'ladi'], nasal: ['mvua', 'vua'], vowel: ['saa', 'sa', 'kifaa cha kuonyesha wakati'],
    pre: [['KUANDI.T8_TAHAJIA.TAHAJIA', E, 'Spelling in his own sentences (Theme 8) comes first.'], ['KUANDI.T4_NAFASI_KATIKA_MAANDI.NAFASI_KATI_YA_MANENO', E, 'Space between words in a sentence.']] }),
];
export const ADD = [];
