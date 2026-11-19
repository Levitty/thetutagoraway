// Kiswahili Grade 2, Kusikiliza na Kuzungumza (18 Nov 2026, offline). The file had KICD outcomes only; every skill is new.
// The design names the target sounds of Themes 4 (ch, dh) and 6 (ny, ng) only; for Themes 2, 8 and 10 HOREB chose sounds a Grade 2
// child meets in the theme (mw/nj, gh/ng', r/l): for a teacher to confirm against the class textbook.
import { E, H } from '../kiswahili-depth-lib.mjs';
import { salamu, heshima, sauti, sikiliza, maagizo, mazungumzo, down } from '../kiswahili-kinds-lower.mjs';
const D = (k) => down(1, k);
const G = 2;
const MAT2 = 'KUSIKI.T2_MATAMSHI_BORA.MATAMSHI';

export const NEW = [
  salamu({ G, sub: 'KUSIKI.T1_MAAMKUZI_NA_MAAGANO', tag: 'T1', letters: ['a', 'b'], theme: 'shuleni',
    time: ['Mnakutana na mwalimu mchana baada ya chakula. Unamsalimu vipi?', 'Habari za asubuhi mwalimu!', 'Habari za mchana mwalimu!'],
    leave: ['Unaondoka shuleni jioni. Unamuaga mwalimu vipi?', 'Hujambo mwalimu!', 'Kwaheri mwalimu, tutaonana kesho!'],
    pre: [[D('KUSIKI.T1_MAAMKUZI_NA_MAAGANO.b'), E, 'The first greetings and farewells of Grade 1 come before the greetings of the times of day.'], [D('KUSIKI.T3_MANENO_YA_ADABU_NA_H.b'), H, 'Words of courtesy of Grade 1.']] }),
  sauti({ G, sub: 'KUSIKI.T2_MATAMSHI_BORA', tag: 'T2', letters: ['a', 'b', 'c', 'd'], theme: 'haki zangu: haki ya elimu',
    sounds: ['mw', 'nj'], words: ['mwalimu', 'njia', 'mwana'], near: ['mw', 'w', 'mwezi', 'wezi'], split: ['mwalimu', 'muwalimu'], drop: ['njia', 'jia'], noword: 'kalamu',
    sentence: 'Mwalimu wetu anatufundisha kuvuka njia salama.',
    pre: [[D('KUSIKI.T2_MATAMSHI_BORA.a'), E, 'Hearing the syllables of a target sound in Grade 1 comes first.'], [D('KUSOMA.T2_KUSOMA_KWA_UFASAHA.a'), H, 'Reading open syllables (ma, me, mi, mo, mu) in Grade 1.']] }),
  heshima({ G, sub: 'KUSIKI.T3_MANENO_YA_HESHIMA_NA', tag: 'T3', letters: ['a', 'b'], theme: 'lishe bora: mezani wakati wa chakula',
    pre: [[D('KUSIKI.T3_MANENO_YA_ADABU_NA_H.b'), E, 'The words of courtesy of Grade 1 come first.'], ['KUSIKI.T1_MAAMKUZI_NA_MAAGANO.MAAMKUZI', H, 'Greeting properly comes before a polite request.']] }),
  sauti({ G, sub: 'KUSIKI.T4_MATAMSHI_BORA_SAUTI_', tag: 'T4', letters: ['a', 'b', 'c'], theme: 'usafiri',
    sounds: ['ch', 'dh'], words: ['chombo', 'dhoruba', 'chai'], near: ['dh', 'z', 'dhoruba', 'zoruba'], near2: ['ch', 'sh', 'chombo', 'shombo'], drop: ['dhahabu', 'dahabu'], noword: 'basi',
    sentence: 'Chombo kilisimama baharini kwa sababu ya dhoruba.',
    pre: [[MAT2, E, 'Splitting words into syllables (Theme 2) comes before the two-letter sounds ch and dh.'], [D('KUSIKI.T4_MATAMSHI_BORA_SAUTI_.a'), E, 'Hearing target syllables in Grade 1.']] }),
  sikiliza({ G, sub: 'KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ', tag: 'T5', letters: ['a', 'b', 'c', 'd'], theme: 'mnyama nimpendaye',
    story: 'Sungura mjanja alimdanganya fisi akaokoa chakula chake',
    word: ['mjanja', 'mjinga', 'mwenye akili ya kutafuta njia', 'Sungura mjanja alitafuta njia ya kumtoroka fisi.'],
    msg: ['Sungura alikuwa na chakula.', 'Akili hutusaidia kujiokoa tukiwa hatarini.'],
    order: ['Sungura alitoroka, fisi alimkuta sungura, sungura alimdanganya fisi', 'Fisi alimkuta sungura, sungura alimdanganya fisi, sungura akatoroka'],
    pre: [[D('KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.b'), E, 'Listening to a short story and answering about it in Grade 1 comes first.'], ['KUSOMA.T1_KUSOMA_UFAHAMU_KUSOM.UFAHAMU', H, 'Finding the message of a read passage is the same work as for a heard one.']] }),
  sauti({ G, sub: 'KUSIKI.T6_MATAMSHI_BORA', tag: 'T6', letters: ['a', 'b'], theme: 'ukoo: bibi, babu na nyanya',
    sounds: ['ny', 'ng'], words: ['nyanya', 'ngoma', 'nyama'], near: ['ny', 'n', 'nyanya', 'nanya'], split: ['nyota', 'niyota'], drop: ['ngoma', 'goma'], noword: 'baba',
    sentence: 'Nyanya alicheza ngoma kwenye sherehe ya ukoo.',
    pre: [[MAT2, E, 'Splitting words into syllables comes before ny and ng.'], [D('KUSIKI.T6_MATAMSHI_BORA.a'), E, 'Hearing target syllables in Grade 1.']] }),
  maagizo({ G, sub: 'KUSIKI.T7_MAAGIZO', tag: 'T7', letters: ['a', 'b'], theme: 'sebuleni',
    two: ['Panga viti, kisha ufagie sebule.', 'anapanga viti tu', 'anapanga viti kisha anafagia sebule'],
    dir: ['Weka kikombe juu ya meza.', 'anakiweka chini ya meza', 'anakiweka juu ya meza'],
    pre: [[D('KUSIKI.T7_MAAGIZO.b'), E, 'Following one-step instructions in Grade 1 comes before two steps.'], ['KUSIKI.T3_MANENO_YA_HESHIMA_NA.HESHIMA', H, 'A polite instruction uses tafadhali.']] }),
  sauti({ G, sub: 'KUSIKI.T8_MATAMSHI_BORA', tag: 'T8', letters: ['a', 'b'], theme: 'usalama wangu barabarani',
    sounds: ['gh', "ng'"], words: ['ghafla', "ng'ombe", 'ghala'], near: ['gh', 'g', 'ghafla', 'gafla'], near2: ["ng'", 'ng', "ng'ombe", 'ngombe'], noword: 'taa',
    sentence: "Ng'ombe alitokea ghafla barabarani.",
    pre: [[MAT2, E, 'Syllables of target sounds (Theme 2) come first.'], [D('KUSIKI.T8_MATAMSHI_BORA.a'), E, 'Hearing target syllables in Grade 1.']] }),
  mazungumzo({ G, sub: 'KUSIKI.T9_MAZUNGUMZO_YA_PAPO_K', tag: 'T9', letters: ['a', 'b', 'c'], theme: 'hospitalini', topic: 'kumtembelea daktari',
    mix: ['Daktari alinipa injection.', 'Daktari alinidunga sindano.'],
    pre: [[D('KUSIKI.T9_MAZUNGUMZO.b'), E, 'Taking part in a short conversation in Grade 1 comes first.'], ['KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.UFAHAMU_KUSIKILIZA', H, 'Listening for what others say is half of a conversation.']] }),
  sauti({ G, sub: 'KUSIKI.T10_MATAMSHI_BORA', tag: 'T10', letters: ['a', 'b'], theme: 'hali ya anga',
    sounds: ['r', 'l'], words: ['radi', 'baridi', 'leo'], near: ['r', 'l', 'radi', 'ladi'], near2: ['l', 'r', 'leo', 'reo'], noword: 'jua',
    sentence: 'Leo kuna baridi na radi.',
    pre: [['KUSIKI.T8_MATAMSHI_BORA.MATAMSHI', E, 'The sounds of the earlier themes come before all the sounds of the alphabet.'], [D('KUSIKI.T10_MATAMSHI_BORA.a'), E, 'Hearing target syllables in Grade 1.']] }),
];
export const ADD = [];
