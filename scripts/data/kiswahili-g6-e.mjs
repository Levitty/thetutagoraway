// KISWAHILI GRADE 6, part E: Kusikiliza na Kuzungumza (the recognition and meaning parts a question can test). Draft, written offline by Claude (13 Nov 2026).
// Methali, nahau, visawe and kitendawili misconceptions are the same learner errors the Grade 5 library records
// (same codes, same lines); they are copied from scripts/data/kiswahili-g5-skills.mjs onto the Grade 6 skills.
import { S, M, G5, INTERFERENCE } from './kiswahili-g6-lib.mjs';
import { MIS as MIS5 } from './kiswahili-g5-skills.mjs';

export const SKILLS = [
  S('KUSIKI.T2_MAAMKUZI_NA_MAAGANO', 'MAAMKUZI', 'Chagua maamkuzi na maagano yanayofaa', ['a', 'b'],
    'Picks the greeting or farewell that fits the time and the number of people (Hujambo and Hamjambo, Kwaheri and Kwa herini, Lala salama at night, Marahaba as the answer to Shikamoo), in 8 of 10 new situations. Using them in real talk (outcome c) stays with the teacher.',
    ['choose the word', 'fill the gap', 'spot the mistake'], [G5('KUSIKI.T2_MAAMKUZI_NA_MAAGANO.a')], ['recall']),
  S('KUSIKI.T4_HESHIMA_ADABU_NA_VYE', 'HESHIMA', 'Tambua na tumia maneno ya heshima', ['a', 'b'],
    'Picks the polite word the situation needs (tafadhali to ask, asante to thank, samahani to say sorry, pole to comfort, karibu to welcome, shikamoo to greet an elder) and the sentence that is polite, in 8 of 10 new items. Using the words in daily talk (outcome c) stays with the teacher.',
    ['choose the word', 'fill the gap', 'spot the mistake', 'choose the polite sentence'], [G5('KUSIKI.T4_MANENO_YA_HESHIMA_NA.a')], ['recall']),
  S('KUSIKI.T5_METHALI_KUFIKIA_MWIS', 'METHALI', 'Tambua na eleza maana ya methali za umoja na ushirikiano', ['a', 'b'],
    'Completes a methali about unity and working together (umoja ni nguvu, kidole kimoja hakivunji chawa, mkono mmoja haulei mwana, wengi wape) and says what it means, and does not read it word for word, in 8 of 10 new items. Using a methali when speaking (outcome c) stays with the teacher.',
    ['choose the meaning', 'fill the gap', 'spot the mistake'], [G5('KUSIKI.T5_METHALI.a')], ['recall', 'infer']),
  S('KUSIKI.T7_NAHAU', 'NAHAU', 'Tambua na eleza maana ya nahau za kazi na ushirikiano', ['a', 'b'],
    'Completes a nahau about work and teamwork (kuchapa kazi, kuvaa njuga, kuunga mkono, kutoa jasho, kujikaza kisabuni, kufunga mkanda) and says what it means, and does not read it word for word, in 8 of 10 new items. Using a nahau when speaking (outcome c) stays with the teacher.',
    ['choose the meaning', 'fill the gap', 'spot the mistake'], [G5('KUSIKI.T7_NAHAU.a')], ['recall', 'infer']),
  S('KUSIKI.T8_VISAWE', 'VISAWE', 'Tambua visawe na makundi ya maneno yenye maana sawa', ['a'],
    'Picks the word with almost the same meaning (furaha-bashasha, haraka-upesi) and the group of four words that all share one meaning, and does not pick the opposite, a related word or a group with one opposite in it, in 8 of 10 new items.',
    ['choose the word', 'fill the gap', 'spot the mistake', 'choose the group'], [G5('KUSIKI.T8_VISAWE.a')], ['recall']),
  S('KUSIKI.T10_SITIARI_ZA_TABIA', 'SITIARI', 'Tambua na tumia sitiari za tabia', ['a', 'b'],
    'Completes a sitiari about behaviour (Kamau ni nyuki, mkuu wa shule ni simba, mwenzako ni kinyonga) and picks the sentence that is a sitiari and not a tashbihi (with kama) or a plain statement, in 8 of 10 new items. Using sitiari in speech (outcome c) stays with the teacher.',
    ['choose the word', 'fill the gap', 'spot the mistake', 'choose the sentence'], [G5('KUSIKI.T10_TASHBIHI.a')], ['recall', 'infer']),
  S('KUSIKI.T3_MATAMSHI_BORA', 'VITENDAWILI', 'Tambua vitendawili na uvitegue', ['a'],
    'Picks the kitendawili (riddle) from a methali, a nahau and an ordinary sentence, and gives the answer to a known riddle, in 8 of 10 new items. Setting and guessing riddles aloud (outcome b) stays with the teacher.',
    ['choose the riddle', 'fill the gap', 'spot the mistake'], [G5('KUSIKI.T3_VITENDAWILI.a')], ['recall']),
  S('KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT', 'MUKTADHA', 'Tofautisha lugha rasmi na isiyo rasmi', ['a', 'b'],
    'Tells formal language (for a meeting, a leader, a letter) from informal language (for friends and home) and picks the sentence that fits the person and the place, in 8 of 10 new items. Speaking in each context (outcome b, in full) stays with the teacher.',
    ['choose the kind', 'fill the gap', 'spot the mistake', 'choose the sentence'], [G5('KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.a')], ['recall', 'rule']),
];

export const ALSO = {};

// Grade 5 keys of the skills whose misconceptions carry over unchanged, mapped to the Grade 6 skill key.
const CARRY = {
  'KUSIKI.T5_METHALI.METHALI': 'KUSIKI.T5_METHALI_KUFIKIA_MWIS.METHALI',
  'KUSIKI.T7_NAHAU.NAHAU': 'KUSIKI.T7_NAHAU.NAHAU',
  'KUSIKI.T8_VISAWE.VISAWE': 'KUSIKI.T8_VISAWE.VISAWE',
  'KUSIKI.T3_VITENDAWILI.VITENDAWILI': 'KUSIKI.T3_MATAMSHI_BORA.VITENDAWILI',
  'KUSIKI.T10_TASHBIHI.TASHBIHI': null,
};

export const MIS = [
  ...MIS5.filter(m => CARRY[m.skill]).map(m => ({ ...m, skill: CARRY[m.skill] })),
  M('KUSIKI.T8_VISAWE.VISAWE', 'M_VIS_MIXED', 'Picks a group that has one opposite or unrelated word among the synonyms.',
    'Ni kundi lipi lina maneno yote yenye maana sawa na "furaha"?', 'bashasha, huzuni, raha, tabasamu', 'bashasha, shangwe, raha, nderemo', 'The child checks the first words of the group and not every word.',
    'A group with three synonyms and one opposite.', 'Kila neno la kundi lazima liwe na maana sawa. Huzuni ni kinyume cha furaha.'),
  // ---- MAAMKUZI
  M('KUSIKI.T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI', 'M_MAA_NUMBER', 'Uses the greeting or farewell for one person with many (Hujambo for Hamjambo, Kwaheri for Kwa herini).',
    'Unawasalimia wanafunzi wengi darasani: "___!"', 'Hujambo', 'Hamjambo', 'The child learned the greeting for one person and uses it for everyone.',
    'A situation with many people and both greetings among the options.', 'Kwa mtu mmoja tunasema Hujambo na Kwaheri. Kwa watu wengi tunasema Hamjambo na Kwa herini.'),
  M('KUSIKI.T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI', 'M_MAA_TIME', 'Uses a night farewell in the morning or a morning greeting at night.',
    'Asubuhi unamwamkia mwalimu: "___, mwalimu."', 'Lala salama', 'Habari za asubuhi', 'The child does not match the greeting to the time of day.',
    'A situation with a clue word such as asubuhi or usiku.', 'Asubuhi tunasema Habari za asubuhi. Usiku tunasema Lala salama au Usiku mwema.'),
  M('KUSIKI.T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI', 'M_MAA_FAREWELL', 'Uses a greeting where a farewell is needed, or a farewell where a greeting is needed (Hujambo when leaving).',
    'Unaondoka na kumwaga mtu mmoja: "___!"', 'Hujambo', 'Kwaheri', 'The child does not ask whether he is arriving or leaving.',
    'A leaving situation with a greeting among the options.', 'Tunasalimia tunapokutana (Hujambo) na tunaaga tunapoondoka (Kwaheri).'),
  M('KUSIKI.T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI', 'M_MAA_REPLY', 'Repeats the greeting (Shikamoo) where the reply (Marahaba) is needed.',
    'Mdogo anamwambia mzee "Shikamoo". Mzee anajibu: "___."', 'Shikamoo', 'Marahaba', 'The child does not know the reply is a different word.',
    'The elder\'s turn with both words among the options.', 'Mdogo husema Shikamoo kwa heshima, na mzee hujibu Marahaba.'),
  // ---- HESHIMA
  M('KUSIKI.T4_HESHIMA_ADABU_NA_VYE.HESHIMA', 'M_HESH_MISUSE', 'Uses a polite word for the wrong job (asante to ask, pole to thank).',
    'Ukimwomba mwalimu kalamu unasema, "Mwalimu, nipe kalamu, ___."', 'asante', 'tafadhali', 'The child knows the words but not what each is for.',
    'A situation with all the polite words among the options.', 'Tafadhali ni kuomba, asante ni kushukuru, samahani ni kuomba msamaha, pole ni kufariji, karibu ni kukaribisha.'),
  M('KUSIKI.T4_HESHIMA_ADABU_NA_VYE.HESHIMA', 'M_HESH_RUDE', 'Picks the sentence without a polite word, as if a command were polite.',
    'Ni sentensi ipi ina heshima zaidi?', 'Nisaidie kubeba mzigo huu!', 'Tafadhali nisaidie kubeba mzigo huu.', 'The child does not notice the tone of a command.',
    'A request with and without tafadhali or naomba.', 'Ombi la heshima lina maneno kama tafadhali, naomba, samahani na asante.'),
  // ---- SITIARI
  M('KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', 'M_SIT_WRONG_ANIMAL', 'Names the wrong animal for the behaviour (kobe for a hard worker).',
    'Kamau hufanya kazi kutwa nzima bila kuchoka. Kamau ni ___.', 'kobe', 'nyuki', 'The child does not link the animal with the behaviour it stands for.',
    'A behaviour with several animals among the options.', 'Kila mnyama hutumika kuonyesha tabia: nyuki (bidii), simba (ujasiri), kobe (polepole), kinyonga (kubadilika), mbweha (ujanja), tausi (kujionyesha).'),
  M('KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', 'M_SIT_TASHBIHI', 'Takes a sentence with kama (a tashbihi) for a sitiari.',
    'Chagua sentensi iliyo sitiari.', 'Mwalimu ni kama simba.', 'Mwalimu ni simba.', 'The child does not tell the two figures apart.',
    'A sitiari and a tashbihi on the same subject.', 'Tashbihi hulinganisha kwa kutumia "kama". Sitiari husema moja ni lingine bila "kama".'),
  M('KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', 'M_SIT_LITERAL', 'Takes the sitiari word for word (the teacher really has a lion).',
    'Chagua sentensi iliyo sitiari.', 'Mwalimu ana simba.', 'Mwalimu ni simba.', 'The child reads the sentence as a plain statement.',
    'A sitiari beside a sentence with the verb kuwa na.', 'Sitiari haisemi mtu ana mnyama. Inasema mtu ni mnyama kwa tabia yake.'),
  // ---- MUKTADHA
  M('KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA', 'M_MUK_MIX', 'Calls formal language informal, or informal language formal.',
    '"Niaje, msee?" ni lugha ___.', 'rasmi', 'isiyo rasmi', 'The child does not look at who is speaking to whom.',
    'A greeting between friends and a greeting to a leader.', 'Lugha rasmi ni ya heshima na ya viongozi. Lugha isiyo rasmi ni ya marafiki na nyumbani.'),
  M('KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA', 'M_MUK_INFORMAL', 'Uses slang or casual words with a teacher, a leader or at a meeting.',
    'Chagua sentensi inayofaa unapozungumza na mwalimu mkuu.', 'Nipe ruhusa tu.', 'Mwalimu mkuu, naomba ruhusa ya kuondoka mapema.', 'The child uses the way he talks to friends everywhere.',
    'A request to a leader with a casual version among the options.', 'Kwa mwalimu, kiongozi au mkutano rasmi tunatumia maneno ya heshima.'),
  M('KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA', 'M_MUK_FORMAL_FRIEND', 'Uses very formal words with a friend or a sister at home.',
    'Chagua sentensi inayofaa unapozungumza na rafiki uwanjani.', 'Naomba kibali cha kuanza mchezo.', 'Twende tucheze mpira, rafiki!', 'The child thinks formal words are always better.',
    'A friendly invitation next to a formal one.', 'Kwa rafiki au ndugu nyumbani, lugha ya kawaida inafaa. Lugha rasmi kupita kiasi inasikika ya ajabu.'),
];
