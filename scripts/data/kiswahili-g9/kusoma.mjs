// Kiswahili Grade 9, Kusoma: depth layer (18 Nov 2026, offline).
// The shairi examples use an invented class poem, "Sauti ya Mama Dunia" (the persona Mama Dunia speaks; Mkata Miti is the one
// she warns): the teacher swaps in the poems the class reads; the errors are the same.
import { m, p, x, E, H } from '../kiswahili-depth-lib.mjs';
import { ufasaha, mapana } from '../kiswahili-kinds.mjs';
import { fasihi, ufupisho } from '../kiswahili-kinds-upper.mjs';
import { readAdd } from '../kiswahili-reading-upper.mjs';
const R8 = (k) => `G8:KUSOMA.${k}`;
const W = { kazi: 'Sauti ya Mama Dunia', mhusika: 'Mama Dunia (nafsineni)', sifa: 'mwenye huruma', ushahidi: 'analia akiwaomba watoto wake wasimkate', msaidizi: 'Mkata Miti', mbaya: 'Mkata Miti', maudhui: 'uharibifu wa mazingira', dhamira: 'kuhimiza jamii kutunza mazingira', tukio: 'Mkata Miti anaangusha mti wa mwisho', mahali: 'msitu unaokatwa', wakati: 'wakati wa ukame', mbinu: ['Dunia ni mama analia', 'tashihisi', 'inaipa dunia sifa za binadamu ili tuone uchungu wake'] };
const F = (sub, tag, id, aspect, letters, theme, pre) => fasihi({ G: 9, sub, tag, id, genre: 'shairi', aspect, letters, pre, theme, w: W });
const RS1 = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.', RP = 'KUSOMA.T6_KUSOMA_KWA_KINA.RP_SHAIRI';
export const NEW = [
  F('KUSOMA.T3_KUSOMA_KWA_KINA', 'T3', 'SHAIRI_UTANZU', 'utanzu', ['a', 'b', 'c'], 'utunzaji wa wanyama', [[R8('T3_KUSOMA_KWA_KINA.TAMTHILIA_UTANZU'), E, 'Grade 8 tamthilia as an utanzu.'], ['G6:KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', E, 'Grade 6 kinds of poems by lines.']]),
  F('KUSOMA.T8_KUSOMA_KWA_KINA', 'T8', 'SHAIRI_MANDHARI', 'mandhari', ['a', 'b', 'c'], 'misukosuko ya kijamii', [[RP, E, 'Themes of a poem (Theme 6).'], [R8('T8_KUSOMA_KWA_KINA_TAMT.TAMTHILIA_MANDHARI'), E, 'Grade 8 mandhari of a play.']]),
  F('KUSOMA.T8_KUSOMA_KWA_KINA', 'T8M', 'SHAIRI_MUUNDO', 'muundo', ['d', 'e'], 'misukosuko ya kijamii', [['KUSOMA.T3_KUSOMA_KWA_KINA.SHAIRI_UTANZU', E, 'The features of ushairi come first.'], ['G6:KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', E, 'Grade 6 ukwapi and utao.']]),
  F('KUSOMA.T10_KUSOMA_KWA_KINA', 'T10', 'SHAIRI_WAHUSIKA', 'wahusika', ['a', 'b', 'c', 'd'], 'kukabiliana na msongo wa mawazo', [['KUSOMA.T8_KUSOMA_KWA_KINA.SHAIRI_MANDHARI', E, 'Setting of the poem first.'], [R8('T10_KUSOMA_KWA_KINA.TAMTHILIA_WAHUSIKA'), E, 'Grade 8 characters of a play.']]),
  F('KUSOMA.T13_KUSOMA_KWA_KINA', 'T13', 'SHAIRI_MBINU', 'mbinu', ['a', 'b', 'c', 'd'], 'mshikamano wa kijamii', [['KUSOMA.T10_KUSOMA_KWA_KINA.SHAIRI_WAHUSIKA', E, 'Characters of the poem.'], [R8('T13_KUSOMA_KWA_KINA_TAMT.TAMTHILIA_MBINU'), E, 'Grade 8 devices in a play.']]),
  ufasaha({ G: 9, sub: 'KUSOMA.T4_KUSOMA_KWA_UFASAHA', tag: 'T4', letters: ['a', 'b', 'c', 'd', 'e'], theme: 'utunzaji wa maliasili',
    sentence: 'Jamii ilikubaliana kulinda chemchemi ya maji kwa kupanda miti kando yake.', question: 'Je, vizazi vijavyo vitapata maji safi?', exclaim: 'Ole wetu tusipotunza misitu!', lr: ['kulinda', 'kurinda'],
    pre: [[R8('T12_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), E, 'Grade 8 read aloud fluently.'], [R8('T4_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), H, 'Grade 8 Theme 4 reading aloud.']] }),
  ufasaha({ G: 9, sub: 'KUSOMA.T12_KUSOMA_KWA_UFASAHA', tag: 'T12', letters: ['a', 'b', 'c', 'd'], theme: 'magonjwa yanayotokana na mienendo ya maisha',
    sentence: 'Uvutaji wa sigara na unywaji wa pombe huharibu mapafu na ini.', question: 'Je, unajua madhara ya vyakula vyenye mafuta mengi?', exclaim: 'Hongera, umeacha kuvuta sigara!', lr: ['sigara', 'sigala'],
    pre: [['KUSOMA.T4_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI', E, 'Theme 4 reading aloud.'], [R8('T12_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), H, 'Grade 8 reading aloud.']] }),
  mapana({ G: 9, sub: 'KUSOMA.T11_KUSOMA_KWA_MAPANA', tag: 'T11', letters: ['a', 'b', 'c', 'd'], topic: 'haki za kibinadamu', book: 'Mwanga wa Haki',
    detail: 'Mwandishi alizaliwa mwaka 1990.', message: 'Kila binadamu ana haki sawa ambazo lazima ziheshimiwe.',
    word: ['usawa', 'Katiba inasisitiza usawa wa watu wote mbele ya sheria.', 'hali ya kuwa sawa bila ubaguzi', 'kusawazisha ardhi'],
    pre: [[R8('T11_KUSOMA_KWA_MAPANA.MATINI_YA_KUCHAGUA'), E, 'Grade 8 chose a text of the right level.'], ['KUSOMA.T2_KUSOMA_KWA_MAPANA.RS_UJUMBE', E, 'Theme 2 message of a chosen text.']] }),
  ufupisho({ G: 9, sub: 'KUSOMA.T7_', tag: 'T7', letters: ['a', 'b', 'c'], theme: 'huduma katika asasi za kijamii', words: 80,
    main: 'Asasi za kijamii huwasaidia wazee, yatima na wagonjwa kupata huduma muhimu.', example: 'Kwa mfano, kituo cha Upendo kiliwapa wazee hamsini chakula mwezi uliopita.',
    pre: [[R8('T7_.KUFUPISHA'), E, 'Grade 8 summarised a passage within a word limit.'], [R8('T15_UFUPISHO.UFUPISHO'), E, 'Grade 8 features of a summary.']] }),
];
export const ADD = [
  readAdd({ G: 9, ref: RS1 + 'RS_HABARI', kind: 'habari', topic: 'usafi wa mazingira', pre: [[R8('T1_KUSOMA_KWA_UFAHAMU.RS_HABARI'), E, 'Grade 8 facts from a passage.'], [R8('T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5'), H, 'Grade 8 comprehension.']] }),
  readAdd({ G: 9, ref: RS1 + 'RS_MATUKIO', kind: 'matukio', topic: 'usafi wa mazingira', pre: [[R8('T1_KUSOMA_KWA_UFAHAMU.RS_MATUKIO'), E, 'Grade 8 ordering events.'], [RS1 + 'RS_HABARI', E, 'Facts of the passage.']] }),
  readAdd({ G: 9, ref: RS1 + 'RS_UTABIRI', kind: 'utabiri', topic: 'usafi wa mazingira', pre: [[R8('T1_KUSOMA_KWA_UFAHAMU.RS_UTABIRI'), E, 'Grade 8 prediction from clues.'], [RS1 + 'RS_MATUKIO', E, 'Order of events.']] }),
  readAdd({ G: 9, ref: RS1 + 'RS_MSAMIATI', kind: 'msamiati', topic: 'usafi wa mazingira', pre: [[R8('T1_KUSOMA_KWA_UFAHAMU.RS_MSAMIATI'), E, 'Grade 8 vocabulary in context.'], ['SARUFI.T12_AINA_ZA_SENTENSI.SENTENSI_TATA', H, 'Words with several meanings (this year).']] }),
  readAdd({ G: 9, ref: 'KUSOMA.T2_KUSOMA_KWA_MAPANA.RS_UJUMBE', kind: 'ujumbe', also: ['b', 'c'], topic: 'mazoezi ya viungo vya mwili', pre: [[R8('T2_KUSOMA_KWA_MAPANA.RS_UJUMBE'), E, 'Grade 8 message of a chosen text.'], [RS1 + 'RS_MSAMIATI', E, 'Vocabulary in context.']] }),
  readAdd({ G: 9, ref: 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5', kind: 'ufahamu', topic: 'mitazamo hasi ya kijinsia', pre: [[R8('T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5'), E, 'Grade 8 comprehension.'], [RS1 + 'RS_UTABIRI', E, 'Prediction from the passage.']] }),
  readAdd({ G: 9, ref: 'KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', kind: 'ushawishi', topic: 'vifaa vya kidijitali katika biashara', pre: [[R8('T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI'), E, 'Grade 8 persuasive passages.'], [RS1 + 'RS_MSAMIATI', H, 'Vocabulary in context.']] }),
  readAdd({ G: 9, ref: 'KUSOMA.T14_KUSOMA_KWA_UFAHAMU.RS_MJADALA', kind: 'mjadala', topic: 'matumizi ya kodi', pre: [[R8('T14_KUSOMA_KWA_UFAHAMU.RS_MJADALA'), E, 'Grade 8 debate passages.'], ['KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', E, 'Persuasive language.']] }),
  readAdd({ G: 9, ref: 'KUSOMA.T15_UFUPISHO.RS_UFUPISHO', kind: 'ufupisho', also: ['b'], topic: 'maadili ya kitaifa', pre: [['KUSOMA.T7_.KUFUPISHA', E, 'Theme 7 summarised a passage.'], [R8('T15_UFUPISHO.RS_UFUPISHO'), E, 'Grade 8 summary.']] }),
  readAdd({ G: 9, ref: 'KUSOMA.T15_UFUPISHO.UFUPISHO', kind: 'ufupisho', topic: 'maadili ya kitaifa', pre: [[R8('T15_UFUPISHO.UFUPISHO'), E, 'Grade 8 features of a summary.'], ['KUSOMA.T7_.KUFUPISHA', E, 'Theme 7 features of a summary.']] }),
  x(RP, { also: ['a'],
    pre: [[R8('T6_KUSOMA_KWA_KINA_TAMT.TAMTHILIA_MAUDHUI'), E, 'Grade 8 maudhui and dhamira in a play.'], ['KUSOMA.T3_KUSOMA_KWA_KINA.SHAIRI_UTANZU', E, 'The features of ushairi.']],
    mis: [m('M9_RP_DHAMIRA_SWAP', 'Swaps maudhui (the issue the poem raises) and dhamira (what the poet aims at).', ['Katika shairi kuhusu usalama barabarani, "kuwahimiza madereva kuwa waangalifu" ni maudhui au dhamira?', 'maudhui', 'dhamira'], 'Both answer "what is it about?" for the child.', 'Maudhui: the issue (usalama barabarani). Dhamira: the aim (kuhimiza, kuonya). Sort sentences.', 'Dhamira ni lengo la mshairi; maudhui ni suala linalozungumziwa.', 'Ni suala au ni lengo la mshairi?')],
    pack: p('The child explains maudhui and dhamira, finds them in a poem with a line as evidence, and explains a word of the poem from its line.', ['Reads a poem for its message.', 'Ujumbe wa shairi ni upi?', 'funzo la shairi lote'], ['a road-safety poem with lines numbered', 'a two-column chart: maudhui / dhamira', 'a word-in-line card'], ['Read the poem.', 'Name the issue (maudhui).', 'Name the poet\'s aim (dhamira).', 'Prove each with a line.'], ['road safety (usalama barabarani)', 'a poetry festival', 'a class anthology'], ['Dereva punguza mwendo, uhai si mchezo', ['Point at the line.', 'Suala ni lipi na lengo ni lipi?'], 'The child fills the chart with a line for each.'], [['Maudhui ni nini?', 'masuala yanayozungumziwa katika kazi', 'term'], ['Dhamira ya shairi la usalama barabarani inaweza kuwa?', 'kuwahimiza watumiaji wa barabara kuwa waangalifu', 'aim']]),
  }),
];
