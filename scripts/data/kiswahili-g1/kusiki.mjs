// Kiswahili Grade 1, Kusikiliza na Kuzungumza (18 Nov 2026, offline). The file had KICD outcomes only; every skill is new.
// Target sounds from the design's content: T2 m a u k t l, T4 n o w e i h, T6 s b y z g d, T8 j r p f v sh, T10 ny dh th ch gh ng ng'.
import { E, H } from '../kiswahili-depth-lib.mjs';
import { salamu, heshima, sauti, sikiliza, maagizo, mazungumzo } from '../kiswahili-kinds-lower.mjs';
const G = 1;
const MAT2 = 'KUSIKI.T2_MATAMSHI_BORA.MATAMSHI';

export const NEW = [
  salamu({ G, sub: 'KUSIKI.T1_MAAMKUZI_NA_MAAGANO', tag: 'T1', letters: ['a', 'b'], theme: 'darasani',
    time: ['Unamwona mwalimu asubuhi. Unamsalimu vipi?', 'Habari za jioni mwalimu!', 'Habari za asubuhi mwalimu!'],
    leave: ['Unaenda nyumbani baada ya shule. Unamuaga mwalimu vipi?', 'Hujambo mwalimu!', 'Kwaheri mwalimu!'],
    pre: [['PP:GREET_FAMILY', E, 'Greeting at home and in pre-primary comes before the Kiswahili greetings of Grade 1.'], ['PP:HEAR_REPEAT_SOUNDS', H, 'Hearing and repeating short words lets the child say the greeting back.']] }),
  sauti({ G, sub: 'KUSIKI.T2_MATAMSHI_BORA', tag: 'T2', letters: ['a', 'b', 'c', 'd'], theme: 'familia',
    sounds: ['m', 'a', 'u', 'k', 't', 'l'], words: ['mama', 'kaka', 'tatu'], near: ['l', 'r', 'lala', 'rara'], near2: ['k', 'g', 'kaka', 'gaga'], lname: ['m', 'em'], noword: 'baba',
    sentence: 'Mama na kaka wanalala.',
    pre: [['PP:VOWEL_SOUNDS', E, 'The vowels a and u are the end of every syllable of this theme (ma, ku, ta).'], ['PP:HEAR_REPEAT_SOUNDS', E, 'Hearing and repeating a sound comes before saying it in a syllable.']] }),
  heshima({ G, sub: 'KUSIKI.T3_MANENO_YA_ADABU_NA_H', tag: 'T3', letters: ['a', 'b'], theme: 'tarakimu: kugawana vitu darasani',
    pre: [['KUSIKI.T1_MAAMKUZI_NA_MAAGANO.MAAMKUZI', E, 'Greeting comes before the other polite words.'], ['PP:GREET_FAMILY', H, 'Polite talk at home in pre-primary.']] }),
  sauti({ G, sub: 'KUSIKI.T4_MATAMSHI_BORA_SAUTI_', tag: 'T4', letters: ['a', 'b', 'c', 'd'], theme: 'siku za wiki',
    sounds: ['n', 'o', 'w', 'e', 'i', 'h'], words: ['nane', 'wewe', 'hii'], near: ['e', 'i', 'wewe', 'wiwi'], near2: ['o', 'u', 'nono', 'nunu'], lname: ['e', 'ii'], noword: 'mama',
    sentence: 'Wewe na mimi tutaenda nyumbani.',
    pre: [[MAT2, E, 'Building syllables from m, a, u, k, t, l (Theme 2) comes before the next sounds.'], ['PP:VOWEL_SOUNDS', E, 'The vowels o, e and i are new targets here.']] }),
  sikiliza({ G, sub: 'KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ', tag: 'T5', letters: ['a', 'b', 'c', 'd'], theme: 'mimi na wenzangu',
    story: 'Otieno alishiriki chakula chake na Kamau aliyesahau chakula',
    word: ['kushiriki', 'kushinda', 'kugawana kitu na mwenzako', 'Tulishiriki mkate darasani.'],
    msg: ['Kamau alisahau chakula.', 'Tushiriki tulicho nacho na wenzetu.'],
    order: ['Walikula pamoja, Kamau alisahau chakula, Otieno alimgawia', 'Kamau alisahau chakula, Otieno alimgawia, walikula pamoja'],
    pre: [['PP:STORY_WHO_WHAT', E, 'Saying who and what after a story in pre-primary comes first.'], ['PP:NAME_EVERYDAY_THINGS', H, 'Knowing everyday words lets the child follow the passage.']] }),
  sauti({ G, sub: 'KUSIKI.T6_MATAMSHI_BORA', tag: 'T6', letters: ['a', 'b', 'c', 'd'], theme: 'mwili wangu',
    sounds: ['s', 'b', 'y', 'z', 'g', 'd'], words: ['sikio', 'bega', 'damu'], near: ['d', 't', 'damu', 'tamu'], near2: ['z', 's', 'ziwa', 'siwa'], lname: ['g', 'ji'], noword: 'mkono',
    sentence: 'Bega, goti na sikio ni sehemu za mwili.',
    pre: [['KUSIKI.T4_MATAMSHI_BORA_SAUTI_.MATAMSHI', E, 'The sounds of Theme 4 come first.'], ['PP:NAME_EVERYDAY_THINGS', H, 'Naming body parts in Kiswahili.']] }),
  maagizo({ G, sub: 'KUSIKI.T7_MAAGIZO', tag: 'T7', letters: ['a', 'b', 'c'], theme: 'usafi wa mwili',
    two: ['Osha mikono, kisha uikaushe.', 'anaosha mikono tu', 'anaosha mikono kisha anaikausha'],
    dir: ['Inua mkono wa kulia.', 'anainua mkono wa kushoto', 'anainua mkono wa kulia'],
    pre: [['PP:FOLLOW_ONE_STEP', E, 'Following a one-step instruction in pre-primary comes first.'], ['KUSIKI.T3_MANENO_YA_ADABU_NA_H.HESHIMA', H, 'A polite instruction uses tafadhali.']] }),
  sauti({ G, sub: 'KUSIKI.T8_MATAMSHI_BORA', tag: 'T8', letters: ['a', 'b', 'c', 'd'], theme: 'vyakula vyetu',
    sounds: ['j', 'r', 'p', 'f', 'v', 'sh'], words: ['viazi', 'papai', 'shamba'], near: ['v', 'f', 'viazi', 'fiazi'], near2: ['sh', 's', 'shamba', 'samba'], lname: ['j', 'jei'], noword: 'ugali',
    sentence: 'Tulikula viazi na papai.',
    pre: [['KUSIKI.T6_MATAMSHI_BORA.MATAMSHI', E, 'The sounds of Theme 6 come first.'], ['PP:NAME_EVERYDAY_THINGS', H, 'Naming foods in Kiswahili.']] }),
  mazungumzo({ G, sub: 'KUSIKI.T9_MAZUNGUMZO', tag: 'T9', letters: ['a', 'b', 'c'], theme: 'jikoni', topic: 'vyombo vya jikoni',
    mix: ['Mama ana fridge jikoni.', 'Mama ana jokofu jikoni.'],
    pre: [['PP:PICTURE_TALK', E, 'Talking about a picture in pre-primary comes before a short conversation.'], ['KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.UFAHAMU_KUSIKILIZA', H, 'Listening for what others say is half of a conversation.']] }),
  sauti({ G, sub: 'KUSIKI.T10_MATAMSHI_BORA', tag: 'T10', letters: ['a', 'b', 'c', 'd'], theme: 'michezo',
    sounds: ['ny', 'dh', 'th', 'ch', 'gh', 'ng', "ng'"], words: ['ngoma', 'chenga', 'nyota'], near: ['dh', 'z', 'dhahabu', 'zahabu'], near2: ['ch', 'sh', 'chenga', 'shenga'], drop: ['ngoma', 'goma'], noword: 'mpira',
    sentence: 'Tulicheza ngoma na kupiga chenga uwanjani.',
    pre: [['KUSIKI.T8_MATAMSHI_BORA.MATAMSHI', E, 'The single sounds of Themes 2 to 8 come before the two-letter sounds.'], ['PP:HEAR_REPEAT_SOUNDS', H, 'Hearing and repeating a sound.']] }),
];
export const ADD = [];
