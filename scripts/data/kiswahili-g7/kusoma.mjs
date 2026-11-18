// Kiswahili Grade 7, Kusoma: depth layer (18 Nov 2026, offline).
// The novela examples use an invented class novela, "Kisima cha Matumaini" (characters Neema, Baraka, Bwana Tajiri): the
// teacher swaps in the novela the class reads; the errors are the same.
import { m, p, x, E, H } from '../kiswahili-depth-lib.mjs';
import { ufasaha, mapana } from '../kiswahili-kinds.mjs';
import { fasihi } from '../kiswahili-kinds-upper.mjs';
import { readAdd } from '../kiswahili-reading-upper.mjs';
const R6 = (k) => `G6:KUSOMA.${k}`;
const W = { kazi: 'Kisima cha Matumaini', mhusika: 'Neema', sifa: 'jasiri', ushahidi: 'alienda kwa chifu peke yake kuripoti wizi wa maji', msaidizi: 'Baraka', mbaya: 'Bwana Tajiri', maudhui: 'ufisadi na uhaba wa maji', dhamira: 'kuonya jamii dhidi ya ufisadi na kuhimiza ujasiri', tukio: 'Neema anagundua kisima kimefungwa', mahali: 'kijiji cha Mwangaza', wakati: 'wakati wa kiangazi kirefu', mbinu: ['Bwana Tajiri ni fisi', 'sitiari', 'inaonyesha ulafi wake wa mali'] };
const F = (sub, tag, id, aspect, letters, theme, pre) => fasihi({ G: 7, sub, tag, id, genre: 'novela', aspect, letters, pre, theme, w: W });
const FT = 'KUSIKI.T3_TANZU_ZA_FASIHI.FASIHI_TANZU';
export const NEW = [
  mapana({ G: 7, sub: 'KUSOMA.T2_KUSOMA_KWA_MAPANA', tag: 'T2', letters: ['a', 'b', 'c'], topic: 'lishe bora', book: 'Sahani Yenye Rangi',
    detail: 'Mama alipika sukumawiki na ugali.', message: 'Mlo kamili wenye vyakula vya aina mbalimbali hujenga afya.',
    word: ['mlo', 'Mlo kamili una wanga, protini, vitamini na madini.', 'chakula anachokula mtu kwa wakati mmoja', 'mlango wa nyumba'],
    pre: [[R6('T9_KUSOMA_KWA_MAPANA.MATINI_YA_KUCHAGUA'), E, 'Grade 6 chose and read texts.'], ['KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_MSAMIATI', E, 'Working out a word from its sentence.']] }),
  mapana({ G: 7, sub: 'KUSOMA.T11_KUSOMA_KWA_MAPANA', tag: 'T11', letters: ['a', 'b', 'c', 'd'], topic: 'majukumu ya watoto', book: 'Kazi za Juma',
    detail: 'Juma alichota maji kisimani.', message: 'Watoto wakitimiza majukumu yao, familia hustawi.',
    word: ['jukumu', 'Kila mtoto nyumbani ana jukumu lake.', 'kazi ambayo mtu anapaswa kuifanya', 'chumba cha kulala'],
    pre: [['KUSOMA.T2_KUSOMA_KWA_MAPANA.MATINI_YA_KUCHAGUA', E, 'Theme 2 read a chosen text.'], ['KUSOMA.T15_UFUPISHO.RS_UFUPISHO', H, 'Summarising briefly.']] }),
  ufasaha({ G: 7, sub: 'KUSOMA.T4_KUSOMA_KWA_UFASAHA', tag: 'T4', letters: ['a', 'b', 'c', 'd'], theme: 'aina za maliasili',
    sentence: 'Misitu, mito na madini ni maliasili ya nchi yetu.', question: 'Je, tunatunzaje misitu yetu?', exclaim: 'Lo, mto umekauka kabisa!', lr: ['maliasili', 'maliasiri'],
    pre: [[R6('T11_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), E, 'Grade 6 read aloud fluently.'], [R6('T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE'), E, 'The features of fluent reading.']] }),
  ufasaha({ G: 7, sub: 'KUSOMA.T12_KUSOMA_KWA_UFASAHA', tag: 'T12', letters: ['a', 'b', 'c', 'd'], theme: 'magonjwa ambukizi',
    sentence: 'Kunawa mikono kwa sabuni huzuia kuenea kwa magonjwa.', question: 'Je, umepata chanjo zote?', exclaim: 'Ole wetu, ugonjwa umeenea kijijini!', lr: ['dalili', 'darili'],
    pre: [['KUSOMA.T4_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI', E, 'Theme 4 reading aloud.'], [R6('T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE'), H, 'The features of fluent reading.']] }),
  F('KUSOMA.T3_KUSOMA_KWA_KINA', 'T3', 'NOVELA_UTANZU', 'utanzu', ['a', 'b'], 'uhuru wa wanyama',
    [[FT, E, 'Fasihi andishi and its tanzu come first.'], ['KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_HABARI', E, 'Reading a long narrative for its facts.']]),
  F('KUSOMA.T6_KUSOMA_KWA_KINA', 'T6', 'NOVELA_MAUDHUI', 'maudhui', ['a', 'b', 'c', 'd'], 'usalama shuleni',
    [['KUSOMA.T3_KUSOMA_KWA_KINA.NOVELA_UTANZU', E, 'Knowing what a novela is comes before its themes.'], ['KUSOMA.T15_UFUPISHO.RS_UFUPISHO', H, 'Summarising is needed for the summary of themes (d).']]),
  F('KUSOMA.T8_KUSOMA_KWA_KINA', 'T8', 'NOVELA_MANDHARI', 'mandhari', ['a', 'b', 'c', 'd'], 'ulaguzi wa binadamu',
    [['KUSOMA.T6_KUSOMA_KWA_KINA.NOVELA_MAUDHUI', E, 'Themes come before setting and plot.'], ['KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_MATUKIO', E, 'Ordering events is the base of ploti.']]),
  F('KUSOMA.T10_KUSOMA_KWA_KINA', 'T10', 'NOVELA_WAHUSIKA', 'wahusika', ['a', 'b', 'c', 'd', 'e'], 'kujithamini',
    [['KUSOMA.T8_KUSOMA_KWA_KINA.NOVELA_MANDHARI', E, 'Setting and plot frame the characters.'], [R6('T8_KUSOMA_KWA_UFAHAMU.IGIZO'), H, 'Grade 6 found characters in a play.']]),
  F('KUSOMA.T13_KUSOMA_KWA_KINA', 'T13', 'NOVELA_MBINU', 'mbinu', ['a', 'b', 'c'], 'utatuzi wa mizozo',
    [['KUSOMA.T10_KUSOMA_KWA_KINA.NOVELA_WAHUSIKA', E, 'Characters are often drawn with devices.'], ['G6:KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', E, 'Grade 6 sitiari.']]),
];
const RS1 = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.';
export const ADD = [
  readAdd({ G: 7, ref: RS1 + 'RS_HABARI', kind: 'habari', topic: 'usafi wa kibinafsi', pre: [[R6('T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI'), E, 'Grade 6 answered from the passage.'], [R6('T1_KUSOMA_KWA_UFAHAMU.MSAMIATI'), H, 'Grade 6 vocabulary from the passage.']] }),
  readAdd({ G: 7, ref: RS1 + 'RS_MATUKIO', kind: 'matukio', topic: 'usafi wa kibinafsi', pre: [[RS1 + 'RS_HABARI', E, 'Finding the facts comes before ordering them.'], [R6('T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI'), E, 'Grade 6 ordered events of a story.']] }),
  readAdd({ G: 7, ref: RS1 + 'RS_UTABIRI', kind: 'utabiri', topic: 'usafi wa kibinafsi', pre: [[RS1 + 'RS_MATUKIO', E, 'The order of events gives the clues for a prediction.'], [RS1 + 'RS_HABARI', E, 'The facts of the passage.']] }),
  readAdd({ G: 7, ref: RS1 + 'RS_MSAMIATI', kind: 'msamiati', topic: 'usafi wa kibinafsi', pre: [[R6('T1_KUSOMA_KWA_UFAHAMU.MSAMIATI'), E, 'Grade 6 vocabulary from the passage.'], [R6('T2_KUSOMA_KWA_KINA.KAMUSI'), H, 'The dictionary for checking.']] }),
  readAdd({ G: 7, ref: 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5', kind: 'ufahamu', topic: 'unyanyasaji wa kijinsia', pre: [[RS1 + 'RS_HABARI', E, 'Finding facts in a passage.'], [RS1 + 'RS_MSAMIATI', E, 'Vocabulary from context.']] }),
  readAdd({ G: 7, ref: 'KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', kind: 'ushawishi', topic: 'vifaa vya kidijitali', pre: [['KUSOMA.T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5', E, 'Reading a passage for facts and meanings.'], [R6('T6_KUSOMA_KWA_KINA.MAKALA_MAKTABA'), E, 'Grade 6 told fact from opinion in articles.']] }),
  readAdd({ G: 7, ref: 'KUSOMA.T14_KUSOMA_KWA_UFAHAMU.RS_MJADALA', kind: 'mjadala', also: ['c'], topic: 'matumizi ya pesa', pre: [['KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', E, 'Reading a persuasive passage.'], ['KUSOMA.T15_UFUPISHO.RS_UFUPISHO', H, 'Writing briefly (c).']] }),
  readAdd({ G: 7, ref: 'KUSOMA.T15_UFUPISHO.RS_UFUPISHO', kind: 'ufupisho', also: ['c'], topic: 'maadili ya mtu binafsi', pre: [['KUSOMA.T7_UFUPISHO.UFUPISHO', E, 'Theme 7 learnt what a summary is.'], [RS1 + 'RS_HABARI', E, 'Finding the main facts.']] }),
  x('KUSOMA.T7_UFUPISHO.UFUPISHO', { also: ['c'],
    pre: [[R6('T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI'), E, 'Grade 6 wrote a short summary of a passage.'], [RS1 + 'RS_HABARI', E, 'Finding the main facts.']],
    mis: [m('M7_UF_ORDER', 'Writes the points of the summary in a different order from the passage, so the ideas no longer follow.', ['Hoja za ufupisho zipangwe vipi?', 'kama zinavyokujia', 'kwa mpangilio ule ule wa kifungu'], 'The child writes the points he remembers best first.', 'Number the main point of each paragraph in the margin; write them in that order.', 'Panga hoja za ufupisho kama zilivyo katika kifungu.', 'Hoja hii iko aya gani ya kifungu?')],
    pack: p('The child explains a summary, picks the main point of each paragraph and writes them in order in his own words without losing the meaning.', ['Finds the main idea of a paragraph.', 'Wazo kuu la aya hii ni?', 'the main sentence'], ['a passage with paragraphs numbered', 'colours for main points and examples', 'a word-count box'], ['Read the whole passage.', 'Mark the main point of each paragraph.', 'Keep their order.', 'Write in your own words.'], ['serving the school community', 'a newspaper article', 'a textbook page'], ['Aya 1: ... Aya 2: ... Aya 3: ...', ['Point at paragraph 2.', 'Wazo kuu la aya hii ni lipi?'], 'The child writes the main point of each paragraph in order.'], [['Ufupisho ni nini?', 'kutoa habari kuu kwa ufupi bila kupoteza maana', 'definition'], ['Hoja za ufupisho zipangwe vipi?', 'kwa mpangilio wa kifungu', 'order']]),
  }),
];
