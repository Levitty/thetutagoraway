// KISWAHILI GRADE 6, part D: Kusoma. Draft, written offline by Claude (13 Nov 2026).
// The misconceptions of msamiati, ufahamu, kamusi, igizo, ufasaha and usalama wa kidijitali are the same learner errors the
// Grade 5 library records (same codes, same lines); they are copied from scripts/data/kiswahili-g5-skills.mjs onto the Grade 6 skills.
import { S, M, G5, INTERFERENCE } from './kiswahili-g6-lib.mjs';
import { MIS as MIS5 } from './kiswahili-g5-skills.mjs';

export const SKILLS = [
  S('KUSOMA.T1_KUSOMA_KWA_UFAHAMU', 'MSAMIATI', 'Elewa maana ya msamiati katika kifungu', ['a', 'b'],
    'Works out what a word means from the passage it is in, and picks the right word for a gap, and does not choose a look-alike word or a word from a nearby sentence, in 8 of 10 new items.',
    ['choose the meaning', 'fill the gap', 'spot the mistake'], [G5('KUSOMA.T1_KUSOMA_KWA_UFAHAMU.a')], ['recall', 'infer']),
  S('KUSOMA.T1_KUSOMA_KWA_UFAHAMU', 'UFAHAMU_HADITHI', 'Elewa ujumbe, matukio na wahusika wa hadithi', ['c'],
    'Answers who, where, what happened and what the main message is from a short story, and puts events in order, without using outside knowledge or a detail from the wrong place, in 8 of 10 new questions.',
    ['choose the answer', 'type a short answer', 'put in order'], ['KUSOMA.T1_KUSOMA_KWA_UFAHAMU.MSAMIATI'], ['recall', 'infer']),
  S('KUSOMA.T2_KUSOMA_KWA_KINA', 'KAMUSI', 'Tumia mpangilio wa maneno katika kamusi', ['a', 'b'],
    'Puts words in dictionary (alphabetical) order, looking at the second and third letter when the first letters match, and finds the word that comes first or last, in 8 of 10 new lists.',
    ['choose the first word', 'choose the last word', 'spot the mistake'], [G5('KUSOMA.T2_KUSOMA_KWA_KINA.a')], ['rule']),
  S('KUSOMA.T5_KUSOMA_KWA_UFAHAMU', 'SHAIRI_AINA', 'Tambua aina za mashairi: tathnia, tathlitha, tarbia', ['a', 'b'],
    'Names the kind of poem by the lines in a stanza (tathnia: two, tathlitha: three, tarbia: four), and names the two parts of a line (ukwapi, the first, and utao, the second), without swapping them or counting mizani instead, in 8 of 10 new items. Reading a poem for its message (outcome c) stays with the teacher.',
    ['choose the kind', 'fill the gap', 'spot the mistake'], [G5('KUSOMA.T5_KUSOMA_KWA_UFAHAMU.a')], ['recall', 'rule']),
  S('KUSOMA.T8_KUSOMA_KWA_UFAHAMU', 'IGIZO', 'Tambua na elewa mchezo wa kuigiza', ['a', 'c'],
    'Tells a play from a story (names of speakers, words spoken, directions in brackets), says what a word in the play means, and answers questions about it, in 8 of 10 new items.',
    ['choose the answer', 'type a short answer', 'identify the part'], [G5('KUSOMA.T8_KUSOMA_KWA_UFAHAMU.a')], ['recall', 'infer']),
  S('KUSOMA.T3_KUSOMA_KWA_UFASAHA', 'UFASAHA_VIPENGELE', 'Tambua vipengele vya kusoma kwa ufasaha', ['a'],
    'Names what a fluent reader does (clear sounds, a fitting speed, a fitting voice, a pause at the koma and the kikomo, a rising voice for a question, fitting gestures) and does not take speed or loudness for fluency, in 8 of 10 new items. Reading a passage aloud (outcomes b to e) is judged by a teacher listening.',
    ['choose the answer', 'spot the mistake'], [G5('KUSOMA.T3_KUSOMA_KWA_UFASAHA.a')], ['recall']),
  S('KUSOMA.T4_KUSOMA_KWA_MAPANA', 'USALAMA_DIJITALI', 'Zingatia hatua za kiusalama unapotumia vifaa vya kidijitali', ['a'],
    'Chooses the safe step when reading on a phone, tablet or computer (use a site an adult or teacher suggested, keep the password secret, ask an adult before an unknown link, log out) and not the unsafe one, in 8 of 10 new situations. Searching and opening a file (outcomes b and c) is a practical task for the teacher.',
    ['choose the safe step', 'spot the unsafe step'], [G5('KUSOMA.T10_MATINI_YA_KIDIJITALI.a')], ['rule']),
];

export const ALSO = {
  'KUSOMA.T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE': ['KUSOMA.T11_KUSOMA_KWA_UFASAHA.a'],
  'KUSOMA.T4_KUSOMA_KWA_MAPANA.USALAMA_DIJITALI': ['KUSOMA.T10_KUSOMA_KWA_MAPANA.b'],
};

const KEEP = new Set(SKILLS.map(k => `KUSOMA.${k.sub.split('.')[1]}.${k.id}`));
export const MIS = [
  ...MIS5.filter(m => KEEP.has(m.skill)).map(m => ({ ...m })),
  M('KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', 'M_SHA_AINA_SWAP', 'Gives the name of another kind of poem for the number of lines (tathlitha for tathnia).',
    'Ubeti wenye mishororo miwili huitwa ___.', 'tathlitha', 'tathnia', 'The child has the names but not the numbers behind them.',
    'The number of lines asked with all three names among the options.', 'Tathnia ni mishororo miwili, tathlitha mitatu na tarbia minne. Jina linaonyesha idadi.'),
  M('KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', 'M_SHA_AINA_COUNT', 'Names the kind of a stanza shown without counting its lines.',
    'Ubeti huu ni wa aina gani? "Mvua imenyesha, / Mito imejaa."', 'tathlitha', 'tathnia', 'The child guesses from the look of the stanza.',
    'A short stanza with the three names among the options.', 'Hesabu mishororo kwanza. Mistari miwili ni tathnia, mitatu ni tathlitha, minne ni tarbia.'),
  M('KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', 'M_SHA_UKWAPI_SWAP', 'Swaps ukwapi (the first part of a line) and utao (the second).',
    'Kipande cha kwanza cha mshororo wa shairi huitwa ___.', 'utao', 'ukwapi', 'The child knows the two names but not their order.',
    'Both names among the options for the first or the second part.', 'Mshororo hugawanyika katika sehemu mbili: ukwapi ni ya kwanza, utao ni ya pili.'),
  M('KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', 'M_SHA_PART_MIX', 'Gives vina or mizani for the parts of a line.',
    'Kipande cha pili cha mshororo wa shairi huitwa ___.', 'vina', 'utao', 'The child mixes the parts of a line with its sounds and counts.',
    'Options with vina and mizani.', 'Vina ni sauti za mwisho zinazofanana, na mizani ni silabi. Vipande vya mshororo ni ukwapi na utao.'),
];
