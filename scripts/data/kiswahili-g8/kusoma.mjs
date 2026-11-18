// Kiswahili Grade 8, Kusoma: depth layer (18 Nov 2026, offline).
// The tamthilia examples use an invented class play, "Kilio cha Msitu" (Bi. Zuhura, Kazungu, Mzee Tamaa): the teacher swaps
// in the tamthilia the class reads; the errors are the same.
import { E, H } from '../kiswahili-depth-lib.mjs';
import { ufasaha, mapana } from '../kiswahili-kinds.mjs';
import { fasihi, ufupisho } from '../kiswahili-kinds-upper.mjs';
import { readAdd } from '../kiswahili-reading-upper.mjs';
const R7 = (k) => `G7:KUSOMA.${k}`;
const W = { kazi: 'Kilio cha Msitu', mhusika: 'Bi. Zuhura', sifa: 'jasiri', ushahidi: 'alisimama mbele ya malori ya mbao akakataa yapite', msaidizi: 'Kazungu', mbaya: 'Mzee Tamaa', maudhui: 'uharibifu wa mazingira na ufisadi', dhamira: 'kuhimiza jamii kutunza msitu na kupinga ufisadi', tukio: 'Zuhura anazuia malori ya mbao', mahali: 'kijiji cha Msitu Mweusi', wakati: 'wakati wa kampeni za uchaguzi', mbinu: ['Mzee Tamaa ni chatu anayemeza msitu', 'sitiari', 'inaonyesha ulafi wake wa mali'] };
const F = (sub, tag, id, aspect, letters, theme, pre) => fasihi({ G: 8, sub, tag, id, genre: 'tamthilia', aspect, letters, pre, theme, w: W });
const RS1 = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.';
export const NEW = [
  F('KUSOMA.T3_KUSOMA_KWA_KINA', 'T3', 'TAMTHILIA_UTANZU', 'utanzu', ['a', 'b'], 'dhiki zinazokumba wanyama', [[R7('T3_KUSOMA_KWA_KINA.NOVELA_UTANZU'), E, 'Grade 7 novela as an utanzu of fasihi andishi.'], ['G6:KUSOMA.T8_KUSOMA_KWA_UFAHAMU.IGIZO', E, 'Grade 6 short plays.']]),
  F('KUSOMA.T6_KUSOMA_KWA_KINA_TAMT', 'T6', 'TAMTHILIA_MAUDHUI', 'maudhui', ['a', 'b', 'c'], 'usalama nyumbani', [['KUSOMA.T3_KUSOMA_KWA_KINA.TAMTHILIA_UTANZU', E, 'What a tamthilia is comes first.'], [R7('T6_KUSOMA_KWA_KINA.NOVELA_MAUDHUI'), E, 'Grade 7 maudhui and dhamira in a novela.']]),
  F('KUSOMA.T8_KUSOMA_KWA_KINA_TAMT', 'T8', 'TAMTHILIA_MANDHARI', 'mandhari', ['a', 'b', 'c'], 'uhalifu wa mtandaoni', [['KUSOMA.T6_KUSOMA_KWA_KINA_TAMT.TAMTHILIA_MAUDHUI', E, 'Themes of the play first.'], [R7('T8_KUSOMA_KWA_KINA.NOVELA_MANDHARI'), E, 'Grade 7 mandhari and ploti of a novela.']]),
  F('KUSOMA.T10_KUSOMA_KWA_KINA', 'T10', 'TAMTHILIA_WAHUSIKA', 'wahusika', ['a', 'b', 'c'], 'kukabiliana na hisia', [['KUSOMA.T8_KUSOMA_KWA_KINA_TAMT.TAMTHILIA_MANDHARI', E, 'Setting and plot frame the characters.'], [R7('T10_KUSOMA_KWA_KINA.NOVELA_WAHUSIKA'), E, 'Grade 7 characters of a novela.']]),
  F('KUSOMA.T13_KUSOMA_KWA_KINA_TAMT', 'T13', 'TAMTHILIA_MBINU', 'mbinu', ['a', 'b'], 'heshima kwa tamaduni za wengine', [['KUSOMA.T10_KUSOMA_KWA_KINA.TAMTHILIA_WAHUSIKA', E, 'Characters are drawn with devices.'], [R7('T13_KUSOMA_KWA_KINA.NOVELA_MBINU'), E, 'Grade 7 devices in a novela.']]),
  ufasaha({ G: 8, sub: 'KUSOMA.T4_KUSOMA_KWA_UFASAHA', tag: 'T4', letters: ['a', 'b', 'c', 'd', 'e'], theme: 'matumizi bora ya maliasili',
    sentence: 'Wakulima walichimba mitaro ili kuhifadhi maji ya mvua.', question: 'Je, tutaacha misitu yetu iangamie?', exclaim: 'Lo, mto umerudi kutiririka!', lr: ['rasilimali', 'lasilimali'],
    pre: [[R7('T12_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), E, 'Grade 7 read aloud fluently.'], [R7('T4_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), H, 'Grade 7 Theme 4 reading aloud.']] }),
  ufasaha({ G: 8, sub: 'KUSOMA.T12_KUSOMA_KWA_UFASAHA', tag: 'T12', letters: ['a', 'b', 'c', 'd', 'e'], theme: 'magonjwa yasiyoambukizwa',
    sentence: 'Kisukari na shinikizo la damu vinaweza kuzuiwa kwa lishe bora na mazoezi.', question: 'Je, unafanya mazoezi kila siku?', exclaim: 'Hongera, umepunguza sukari mwilini!', lr: ['mazoezi', 'masoezi'],
    pre: [['KUSOMA.T4_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI', E, 'Theme 4 reading aloud.'], [R7('T12_KUSOMA_KWA_UFASAHA.KUSOMA_KWA_SAUTI'), H, 'Grade 7 reading aloud.']] }),
  mapana({ G: 8, sub: 'KUSOMA.T11_KUSOMA_KWA_MAPANA', tag: 'T11', letters: ['a', 'b', 'c'], topic: 'haki za watoto', book: 'Sauti ya Mtoto',
    detail: 'Amani alikuwa na miaka kumi na mbili.', message: 'Kila mtoto ana haki ya elimu, ulinzi na kusikilizwa.',
    word: ['dhuluma', 'Dhuluma dhidi ya watoto lazima iripotiwe.', 'kunyimwa haki au kutendewa vibaya', 'zawadi ya siku ya kuzaliwa'],
    pre: [[R7('T11_KUSOMA_KWA_MAPANA.MATINI_YA_KUCHAGUA'), E, 'Grade 7 chose and read a text.'], ['KUSOMA.T2_KUSOMA_KWA_MAPANA.RS_UJUMBE', E, 'Theme 2 the message of a chosen text.']] }),
  ufupisho({ G: 8, sub: 'KUSOMA.T7_', tag: 'T7', letters: ['a', 'b', 'c'], theme: 'kuhudumia wenye mahitaji maalum', words: 60,
    main: 'Shule zinapaswa kujenga njia za kupitisha viti vya magurudumu.', example: 'Kwa mfano, shule ya Kilimani ilijenga njia mbili mwaka 2025.',
    pre: [[R7('T7_UFUPISHO.UFUPISHO'), E, 'Grade 7 what a summary is.'], [R7('T15_UFUPISHO.RS_UFUPISHO'), E, 'Grade 7 summary of a passage.']] }),
];
export const ADD = [
  readAdd({ G: 8, ref: RS1 + 'RS_HABARI', kind: 'habari', topic: 'usafi wa sehemu za umma', pre: [[R7('T1_KUSOMA_KWA_UFAHAMU.RS_HABARI'), E, 'Grade 7 facts from a passage.'], [R7('T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5'), H, 'Grade 7 comprehension.']] }),
  readAdd({ G: 8, ref: RS1 + 'RS_MATUKIO', kind: 'matukio', topic: 'usafi wa sehemu za umma', pre: [[R7('T1_KUSOMA_KWA_UFAHAMU.RS_MATUKIO'), E, 'Grade 7 ordering events.'], [RS1 + 'RS_HABARI', E, 'Facts of the passage.']] }),
  readAdd({ G: 8, ref: RS1 + 'RS_UTABIRI', kind: 'utabiri', topic: 'usafi wa sehemu za umma', pre: [[R7('T1_KUSOMA_KWA_UFAHAMU.RS_UTABIRI'), E, 'Grade 7 prediction from clues.'], [RS1 + 'RS_MATUKIO', E, 'The order of events.']] }),
  readAdd({ G: 8, ref: RS1 + 'RS_MSAMIATI', kind: 'msamiati', topic: 'usafi wa sehemu za umma', pre: [[R7('T1_KUSOMA_KWA_UFAHAMU.RS_MSAMIATI'), E, 'Grade 7 vocabulary in context.'], ['G6:KUSOMA.T2_KUSOMA_KWA_KINA.KAMUSI', H, 'The dictionary entry.']] }),
  readAdd({ G: 8, ref: 'KUSOMA.T2_KUSOMA_KWA_MAPANA.RS_UJUMBE', kind: 'ujumbe', also: ['b', 'c'], topic: 'matumizi yafaayo ya dawa', pre: [[R7('T2_KUSOMA_KWA_MAPANA.MATINI_YA_KUCHAGUA'), E, 'Grade 7 chosen texts.'], [RS1 + 'RS_MSAMIATI', E, 'Vocabulary in context.']] }),
  readAdd({ G: 8, ref: 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5', kind: 'ufahamu', topic: 'majukumu ya kijinsia', pre: [[R7('T5_KUSOMA_KWA_UFAHAMU.RS_UFAHAMU5'), E, 'Grade 7 comprehension.'], [RS1 + 'RS_MSAMIATI', E, 'Vocabulary in context.']] }),
  readAdd({ G: 8, ref: 'KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', kind: 'ushawishi', topic: 'majukumu ya mnunuzi', pre: [[R7('T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI'), E, 'Grade 7 persuasive passages.'], [RS1 + 'RS_UTABIRI', H, 'Prediction from the passage.']] }),
  readAdd({ G: 8, ref: 'KUSOMA.T14_KUSOMA_KWA_UFAHAMU.RS_MJADALA', kind: 'mjadala', topic: 'kuweka akiba', pre: [[R7('T14_KUSOMA_KWA_UFAHAMU.RS_MJADALA'), E, 'Grade 7 debate passages.'], ['KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', E, 'Persuasive language.']] }),
  readAdd({ G: 8, ref: 'KUSOMA.T15_UFUPISHO.RS_UFUPISHO', kind: 'ufupisho', also: ['c'], topic: 'maadili ya kijamii', pre: [['KUSOMA.T7_.KUFUPISHA', E, 'Theme 7 summarised a passage.'], [R7('T15_UFUPISHO.RS_UFUPISHO'), E, 'Grade 7 summary.']] }),
  readAdd({ G: 8, ref: 'KUSOMA.T15_UFUPISHO.UFUPISHO', kind: 'ufupisho', topic: 'maadili ya kijamii', pre: [[R7('T7_UFUPISHO.UFUPISHO'), E, 'Grade 7 what a summary is.'], ['KUSOMA.T7_.KUFUPISHA', E, 'Theme 7 features of a summary.']] }),
];
