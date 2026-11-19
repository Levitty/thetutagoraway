// Kiswahili Grade 1, Kuandika (18 Nov 2026, offline). The file had KICD outcomes only; every skill is new.
import { m, p, s, E, H } from '../kiswahili-depth-lib.mjs';
import { hati, alama, tahajia, insha } from '../kiswahili-kinds-lower.mjs';
const G = 1;
const UB = 'KUANDI.T1_UANDISHI_BORA.UANDISHI_BORA';

export const NEW = [
  s('KUANDI.T1_UANDISHI_BORA', 'UANDISHI_BORA', 'Keti vizuri, shika kalamu ipasavyo na uandike kutoka kushoto kwenda kulia', ['a', 'b', 'c', 'd'],
    'Sits upright with both feet on the floor and the book straight, holds the pencil between thumb and two fingers without pressing hard, and writes from left to right along the line, in 8 of 10 new items (the teacher also watches it in class).',
    ['chagua picha ya mkao bora', 'chagua jinsi ya kushika kalamu', 'andika (mwalimu anaangalia)'], ['application'], {
      pre: [['PP:PENCIL_PATTERNS', E, 'Holding a crayon and drawing patterns from left to right in pre-primary comes first.'], ['PP:PICTURE_TALK', H, 'Knowing which way a page goes, from handling books.']],
      mis: [
        m('M1_UAN_FIST_T1', 'Grips the pencil in the fist, or with all the fingers wrapped round it.', ['Kalamu inashikwa vipi?', 'kwa ngumi nzima', 'kwa kidole gumba na vidole viwili'], 'A fist grip is how small children first hold a crayon; the tripod grip has not been taught.', 'Pinch the pencil with thumb and pointer, rest it on the middle finger; a small rubber band can mark the place.', 'Shika kalamu kwa vidole vitatu, si kwa ngumi.', 'Vidole vipi vinashika kalamu?'),
        m('M1_UAN_SLUMP_T1', 'Writes with the head on the desk or the body twisted, the book at an angle.', ['Mkao upi ni bora unapoandika?', 'kichwa juu ya meza', 'kuketi wima, miguu sakafuni, daftari limenyooka'], 'The child tires quickly and nobody has shown the writing position.', 'Check four things before writing: back straight, feet down, book straight, free hand holding the page.', 'Keti wima na unyooshe daftari kabla ya kuandika.', 'Mgongo wako umenyooka?'),
        m('M1_UAN_RTL_T1', 'Starts writing at the right of the line, or writes letters from right to left.', ['Unaanza kuandika mstari kutoka wapi?', 'upande wa kulia', 'upande wa kushoto'], 'The child starts wherever there is space, or copies the direction of a sibling\'s writing in another script.', 'A green start line at the left margin of each line.', 'Tunaandika kutoka kushoto kwenda kulia.', 'Mstari wa kijani uko upande gani?'),
        m('M1_UAN_PRESS_T1', 'Presses so hard the pencil breaks or tears the page.', ['Unaandika kwa nguvu kiasi gani?', 'kwa nguvu sana mpaka karatasi ikatike', 'kwa upole, kalamu ikiteleza'], 'The child holds the pencil too tight from worry or from the fist grip.', 'Write on a sheet with carbon or soft paper below; the mark should not come through.', 'Andika kwa upole: kalamu iteleze.', 'Ukurasa unaofuata una alama za kalamu yako?'),
      ],
      pack: p('Before writing the child checks posture and grip, then starts at the left of the line and moves right.',
        ['Draws a line and a circle with a crayon.', 'Chora mstari kutoka kushoto kwenda kulia.', 'the child draws a straight line'],
        ['pictures of good and poor writing positions', 'a pencil grip marked with a band', 'a green start line on each line'],
        ['Sit up, feet down.', 'Straighten the book.', 'Hold the pencil with three fingers.', 'Start at the green line and go right.'],
        ['darasani: the first writing lesson', 'writing at home at the table', 'copying a pattern from the board'],
        ['a a a a', ['Point at the green start line.', 'Unaanza kuandika wapi?'], 'The child writes a row of a from left to right with the right grip.'],
        [['Kalamu inashikwa kwa vidole vingapi?', 'vitatu', 'grip'], ['Unaandika kutoka upande gani?', 'kushoto kwenda kulia', 'direction']]),
    }),
  hati({ G, sub: 'KUANDI.T2_HATI_NADHIFU_HERUFI_', tag: 'T2', letters: ['a', 'b'], theme: 'familia', focus: 'kubwa', words: '5', line: 'Mama na Baba wako nyumbani.',
    pre: [[UB, E, 'Posture and grip come before forming letters.'], ['PP:PENCIL_PATTERNS', E, 'Lines and curves of pre-primary are the strokes of the letters.']] }),
  hati({ G, sub: 'KUANDI.T3_HATI_NADHIFU_HERUFI_', tag: 'T3', letters: ['a', 'b'], theme: 'tarakimu', focus: 'ndogo', words: '5', line: 'Kaka ana kalamu tatu.',
    pre: [[UB, E, 'Posture and grip come before forming letters.'], ['KUANDI.T2_HATI_NADHIFU_HERUFI_.HATI_NADHIFU', H, 'The capitals of Theme 2 show the shape families of the letters.']] }),
  s('KUANDI.T4_HATI_NADHIFU', 'KUUNGANISHA_SILABI', 'Andika maneno kwa kuunganisha silabi bila nafasi kati ya herufi', ['a', 'b'],
    'Writes a word by joining its syllables (ma + ma = mama), with the letters of the word close together and no gap inside it, in the right order of syllables, in 8 of 10 new items (the teacher also checks it in the exercise book).',
    ['unganisha silabi', 'chagua neno lililoandikwa vizuri', 'andika neno (mwalimu anasahihisha)'], ['application'], {
      pre: [['KUANDI.T3_HATI_NADHIFU_HERUFI_.HATI_NADHIFU', E, 'Forming the small letters comes before joining them into words.'], ['KUSIKI.T2_MATAMSHI_BORA.MATAMSHI', E, 'Hearing the syllables of a word lets the child write them in order.']],
      mis: [
        m('M1_UNG_GAPS_T4', 'Leaves a gap between every letter of a word (m a m a).', ['Ni lipi limeandikwa vizuri?', 'm a m a', 'mama'], 'The child learnt each letter alone and keeps a space after it.', 'Write the syllable as one block (ma), then put two blocks together (mama), close.', 'Herufi za neno moja hukaa karibu: mama.', 'Herufi hizi ni neno moja?'),
        m('M1_UNG_ORDER_T4', 'Joins the syllables in the wrong order (ta + tu written tuta for tatu).', ['Unganisha silabi: ta + tu', 'tuta', 'tatu'], 'The child hears both syllables but writes the one he remembers best first.', 'Clap the word and write one syllable per clap, in order, saying each.', 'Andika silabi kwa mpangilio unaozisikia: ta-tu.', 'Silabi ya kwanza unayoisikia ni ipi?'),
        m('M1_UNG_DROP_T4', 'Leaves out the vowel of a syllable (mm for mama, kk for kaka).', ['Unganisha silabi: ka + ka', 'kk', 'kaka'], 'The child writes the consonants he hears most strongly; the vowel ending each syllable is missed.', 'Every syllable ends in a vowel: say the vowel long (kaaa) and write it.', 'Kila silabi huishia kwa irabu: ka-ka.', 'Silabi "ka" inaishia kwa herufi gani?'),
        m('M1_UNG_LINES_T4', 'Writes each syllable on a new line, or one above the other.', ['Neno "baba" liandikwe vipi?', 'ba juu, ba chini', 'baba katika mstari mmoja'], 'Syllable cards were stacked in class and the child copies the stack.', 'Lay the syllable cards side by side on the desk before writing.', 'Silabi za neno moja hukaa kwenye mstari mmoja.', 'Neno lako liko kwenye mstari mmoja?'),
      ],
      pack: p('The child claps the word, writes one syllable per clap in order, close together, and reads the word back.',
        ['Writes a single syllable (ma, ka).', 'Andika silabi: ma', 'ma'],
        ['syllable cards to lay side by side', 'claps for each syllable', 'three-line paper'],
        ['Say the word.', 'Clap the syllables.', 'Write each syllable close to the last.', 'Read the word back.'],
        ['siku za wiki: names of the days', 'labelling a picture of the family', 'writing his own name'],
        ['ma + ma = mama', ['Point at the two syllables.', 'Tukiziunganisha tunapata neno gani?'], 'The child joins ka + ka and ta + tu and reads them.'],
        [['Unganisha: ba + ba', 'baba', 'joining'], ['Unganisha: ki + ti', 'kiti', 'joining']]),
    }),
  alama({ G, sub: 'KUANDI.T5_MATUMIZI_YA_KIKOMO', tag: 'T5', letters: ['a', 'b', 'c'], theme: 'mimi na wenzangu', mark: 'kikomo', words: '5',
    q: 'Je, unaitwa nani?', st: 'Mimi ni Amina.',
    pre: [['KUANDI.T4_HATI_NADHIFU.KUUNGANISHA_SILABI', E, 'Writing whole words comes before ending a sentence.'], ['KUANDI.T2_HATI_NADHIFU_HERUFI_.HATI_NADHIFU', E, 'The capital that starts the sentence the kikomo ends.']] }),
  tahajia({ G, sub: 'KUANDI.T6_TAHAJIA_IMLA', tag: 'T6', letters: ['a', 'b'], theme: 'mwili wangu', mode: 'imla', words: '5',
    mt: ['damu', 'tamu'], nasal: ['ndevu', 'devu'], vowel: ['kaa', 'ka', 'kuketi'],
    pre: [['KUANDI.T4_HATI_NADHIFU.KUUNGANISHA_SILABI', E, 'Joining syllables into words comes before writing them from dictation.'], ['KUSIKI.T6_MATAMSHI_BORA.MATAMSHI', E, 'Hearing d and t, s and z clearly.']] }),
  tahajia({ G, sub: 'KUANDI.T7_KUANDIKA_MANENO_IPAS', tag: 'T7', letters: ['a', 'b'], theme: 'usafi wa mwili', mode: 'maneno', words: '5',
    mt: ['taulo', 'tauro'], nasal: ['ndoo', 'doo'], vowel: ['choo', 'cho', 'chumba cha kujisaidia'],
    pre: [['KUANDI.T6_TAHAJIA_IMLA.IMLA', E, 'Writing words from dictation (Theme 6) comes first.'], ['KUANDI.T4_HATI_NADHIFU.KUUNGANISHA_SILABI', H, 'Joining syllables into a word.']] }),
  tahajia({ G, sub: 'KUANDI.T8_TAHAJIA', tag: 'T8', letters: ['a', 'b'], theme: 'vyakula vyetu', mode: 'tahajia', words: '10',
    mt: ['mchele', 'mchere'], nasal: ['ndizi', 'dizi'], vowel: ['mkaa', 'mka', 'kitu kinachochomwa kupikia'],
    pre: [['KUANDI.T7_KUANDIKA_MANENO_IPAS.TAHAJIA', E, 'Spelling single words comes before spelling in three sentences.'], ['KUANDI.T5_MATUMIZI_YA_KIKOMO.ALAMA', E, 'Each of the three sentences ends with a kikomo.']] }),
  insha({ G, sub: 'KUANDI.T9_KIFUNGU_KUTOKANA_NA_', tag: 'T9', id: 'KIFUNGU', letters: ['a', 'b'], theme: 'jikoni', type: 'picha', title: 'Jikoni Kwetu', words: '15',
    mix: ['Mama anapika rice.', 'Mama anapika wali.'], tense: ['Mama alipika ugali. Dada anaosha vyombo.', 'Mama alipika ugali. Dada aliosha vyombo.'],
    pre: [['PP:PICTURE_TALK', E, 'Saying what is happening in a picture comes before writing it.'], ['KUANDI.T8_TAHAJIA.TAHAJIA', E, 'Writing three short sentences with correct spelling (Theme 8).']] }),
  insha({ G, sub: 'KUANDI.T10_KIFUNGU_KUTOKANA_NA_', tag: 'T10', id: 'KIFUNGU', letters: ['a', 'b'], theme: 'michezo', type: 'picha', title: 'Michezo Shuleni', words: '20',
    mix: ['Tulicheza football.', 'Tulicheza mpira wa miguu.'], tense: ['Jana tulicheza mpira. Juma anafunga bao.', 'Jana tulicheza mpira. Juma alifunga bao.'],
    pre: [['KUANDI.T9_KIFUNGU_KUTOKANA_NA_.KIFUNGU', E, 'A paragraph from a picture (Theme 9) comes first.'], ['PP:PICTURE_TALK', H, 'Talking about a picture.']] }),
];
export const ADD = [];
