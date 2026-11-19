// Kiswahili Grade 3, Kusikiliza na Kuzungumza (18 Nov 2026, offline). The file had KICD outcomes only; every skill is new.
import { m, p, s, E, H, ENG, MT } from '../kiswahili-depth-lib.mjs';
import { salamu, heshima, sauti, sikiliza, maagizo, mazungumzo, down } from '../kiswahili-kinds-lower.mjs';
const D = (k) => down(2, k);
const G = 3;
const VOK = 'KUSIKI.T2_MATAMSHI_BORA_VOKALI.VOKALI_KONSONANTI';

export const NEW = [
  salamu({ G, sub: 'KUSIKI.T1_MAAMKUZI_NA_MAAGANO', tag: 'T1', letters: ['a', 'b'], theme: 'uzalendo: kuwasalimu wazee wa jamii',
    time: ['Unamkuta mwalimu shuleni saa nne asubuhi. Unamsalimu vipi?', 'Habari za jioni mwalimu!', 'Habari za asubuhi mwalimu!'],
    leave: ['Rafiki anasafiri kwenda kijijini. Unamuaga vipi?', 'Karibu sana!', 'Safiri salama!'],
    pre: [[D('KUSIKI.T1_MAAMKUZI_NA_MAAGANO.b'), E, 'Greeting and answering at the times of day (Grade 2) comes before the wider greetings of the community.'], [D('KUSIKI.T3_MANENO_YA_HESHIMA_NA.b'), H, 'Words of respect of Grade 2 carry into greeting elders.']] }),

  s('KUSIKI.T2_MATAMSHI_BORA_VOKALI', 'VOKALI_KONSONANTI', 'Tambua na utamke vokali na konsonanti za Kiswahili', ['a', 'b', 'c', 'd'],
    'Names the five Kiswahili vowels (a, e, i, o, u), tells a vowel from a consonant, says each with its Kiswahili sound (not the English letter name), and treats ch, sh, dh, th, gh, ny, ng\' as one consonant each, in 8 of 10 new items (the teacher also hears it in class, with the KICD rubric).',
    ['chagua irabu', 'tambua konsonanti', 'chagua matamshi sahihi', 'tamka sauti (mwalimu anasikiliza)'], ['recall', 'discrimination'], {
      pre: [[D('KUSIKI.T10_MATAMSHI_BORA.a'), E, 'Recognising the sounds of the Kiswahili alphabet (Grade 2) is the base for sorting them into vowels and consonants.'], [D('KUSOMA.T10_KUSOMA_KWA_UFASAHA.a'), H, 'Finding those sounds in a read passage in Grade 2.']],
      mis: [
        m('M3_VOK_Y_T2', 'Counts y (and sometimes w) as a vowel.', ['Ni zipi ni irabu za Kiswahili?', 'a, e, i, o, u, y', 'a, e, i, o, u'], 'English lessons teach that y is "sometimes a vowel"; Kiswahili has five vowels only.', 'Sort letter cards into two baskets; y and w go with the consonants.', 'Kiswahili kina irabu tano tu: a, e, i, o, u.', 'Irabu za Kiswahili ni ngapi?', undefined, ENG),
        m('M3_VOK_DIGRAPH_T2', 'Counts a two-letter consonant (sh, ch, ny, dh) as two sounds.', ['Neno "shamba" linaanza na konsonanti ngapi?', 'mbili: s na h', 'moja: sh'], 'The child counts letters, not sounds.', 'Say the sound alone (sh!) and show it is one sound on one card.', '"sh" ni sauti moja, ingawa ina herufi mbili.', 'Unasikia sauti moja au mbili mwanzoni?'),
        m('M3_VOK_NAME_T2', 'Says the English letter name for a vowel (i as "ai", e as "ii").', ['Irabu "i" katika neno "iko" inatamkwaje?', 'ai', 'i'], 'English letter names were learnt alongside; the child uses them for the Kiswahili sound.', 'Sing the Kiswahili vowel song with each vowel sound held.', 'Kwa Kiswahili, "i" inatamkwa /i/, kama katika "iko".', 'Hili ni jina la herufi kwa Kiingereza au sauti yake kwa Kiswahili?', undefined, ENG),
        m('M3_VOK_UO_T2', 'Mixes u and o (or i and e) in speech and writing (kuku said and written koko).', ['Ni lipi sahihi kwa ndege wa nyumbani anayetaga mayai?', 'koko', 'kuku'], 'Some Kenyan first languages have seven vowels, with sounds between u and o and between i and e; the child hears the Kiswahili vowels through them.', 'Mouth shapes with a mirror: round and small for u, round and open for o.', 'Sikiliza: "kuku" ina /u/ mara mbili.', 'Mdomo wako unakaaje unaposema /u/?', undefined, MT),
        m('M3_VOK_NG_T2', "Does not tell ng' from ng (ngoma and ng'ombe start with the same sound to the child).", ["Ni neno lipi lina sauti ng' mwanzoni?", 'ngoma', "ng'ombe"], "Ng' has no /g/ after the nasal; the child hears both as one.", "Say ngoma and ng'ombe with a hand on the throat: the /g/ of ngoma is felt.", "Ng'ombe: sauti ng' bila /g/; ngoma: ng yenye /g/.", 'Unasikia /g/ katika neno hili?'),
      ],
      pack: p('The child says each sound, not the letter name, and asks "one sound or two?" before counting consonants.',
        ['Says the five vowels in order.', 'Taja irabu za Kiswahili.', 'a, e, i, o, u'],
        ['vowel and consonant baskets with letter cards', 'a mirror for the mouth shapes', 'a sound chart of the alphabet with sh, ch, ny, ng\' on single cards'],
        ['Hear the sound.', 'Ask: is it a vowel?', 'If not, is it one consonant written with two letters?', 'Say it in a word.'],
        ['shambani: names of crops (mahindi, maharagwe, mtama)', 'the alphabet song', 'a word tree'],
        ['sh - a - m - b - a', ['Point at "sh".', 'Hii ni sauti moja au mbili?'], 'The child sorts six letter cards into vowels and consonants and says each.'],
        [['Taja irabu tano za Kiswahili.', 'a, e, i, o, u', 'vowels'], ['"ch" katika "chai" ni sauti ngapi?', 'moja', 'one consonant']]),
    }),

  heshima({ G, sub: 'KUSIKI.T3_MANENO_YA_HESHIMA_NA', tag: 'T3', letters: ['a', 'b'], theme: 'miezi ya mwaka: sherehe za kuzaliwa na sikukuu',
    pre: [[D('KUSIKI.T3_MANENO_YA_HESHIMA_NA.b'), E, 'Using the words of respect and courtesy of Grade 2 is the base.'], ['KUSIKI.T1_MAAMKUZI_NA_MAAGANO.MAAMKUZI', H, 'Greeting properly comes before a polite request.']] }),

  sauti({ G, sub: 'KUSIKI.T4_MATAMSHI_BORA', tag: 'T4', letters: ['a', 'b', 'c'], theme: 'kazi mbalimbali: mkulima, fundi, mpishi',
    sounds: ['py', 'vy', 'sh'], words: ['kipya', 'vyakula', 'shamba'], near: ['sh', 's', 'shamba', 'samba'], split: ['vyakula', 'viyakula'], drop: ['kipya', 'kipa'], noword: 'kalamu',
    sentence: 'Mpishi alipika vyakula kwenye sufuria mpya.',
    pre: [[VOK, E, 'Every Kiswahili syllable ends in a vowel; the child must know the vowels to split the syllables of py, vy, sh.'], [D('KUSIKI.T2_MATAMSHI_BORA.a'), E, 'Hearing the syllables of a target sound in Grade 2 comes first.']] }),

  sikiliza({ G, sub: 'KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ', tag: 'T5', letters: ['a', 'b', 'c', 'd'], theme: 'usalama barabarani',
    story: 'Wanjiru alivuka barabara bila kuangalia na nusura agongwe na gari',
    word: ['kivuko', 'kivuli', 'mahali palipotengwa pa kuvuka barabara', 'Tulivuka barabara kwenye kivuko cha watembea kwa miguu.'],
    msg: ['Wanjiru alienda dukani.', 'Tuangalie kulia na kushoto na kuvuka kwenye kivuko ili tuwe salama.'],
    order: ['Gari lilisimama ghafla, Wanjiru alienda dukani, alivuka barabara bila kuangalia', 'Wanjiru alienda dukani, alivuka barabara bila kuangalia, gari likasimama ghafla'],
    pre: [[D('KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.d'), E, 'Saying the message of a heard story in Grade 2 comes first.'], ['KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU', H, 'Finding the message and new words of a read passage is the same work as for a heard one.']] }),

  sauti({ G, sub: 'KUSIKI.T6_MATAMSHI_BORA', tag: 'T6', letters: ['a', 'b', 'c'], theme: 'usafi wa mazingira',
    sounds: ['dh', 'th', 'ch'], words: ['dhahabu', 'thelathini', 'chupa'], near: ['dh', 'z', 'dhahabu', 'zahabu'], near2: ['ch', 'sh', 'chai', 'shai'], drop: ['thelathini', 'telatini'], noword: 'mama',
    sentence: 'Tuliokota chupa thelathini tukasafisha mazingira.',
    pre: [[VOK, E, 'Knowing that dh, th and ch are each one consonant comes from the vowels and consonants sub-strand.'], [D('KUSIKI.T6_MATAMSHI_BORA.a'), E, 'Hearing the syllables of target sounds in words and sentences (Grade 2).']] }),

  maagizo({ G, sub: 'KUSIKI.T7_MAAGIZO', tag: 'T7', letters: ['a', 'b'], theme: 'dukani',
    two: ['Chukua kikapu, kisha uende dukani.', 'anachukua kikapu tu', 'anachukua kikapu kisha anaenda dukani'],
    dir: ['Weka sukari upande wa kulia wa meza.', 'anaiweka upande wa kushoto', 'anaiweka upande wa kulia'],
    pre: [[D('KUSIKI.T7_MAAGIZO.b'), E, 'Giving and following two-step instructions in Grade 2 comes first.'], ['KUSIKI.T3_MANENO_YA_HESHIMA_NA.HESHIMA', H, 'A polite instruction uses tafadhali.']] }),

  sauti({ G, sub: 'KUSIKI.T8_MATAMSHI_BORA', tag: 'T8', letters: ['a', 'b', 'c'], theme: 'ndege nimpendaye',
    sounds: ['mbw', 'nd', 'ny'], words: ['mbweha', 'ndege', 'nyumba'], near: ['ny', 'n', 'nyama', 'nama'], split: ['mbwa', 'mubwa'], drop: ['ndege', 'dege'], noword: 'kuku',
    sentence: 'Ndege mdogo ametua juu ya nyumba ya mbwa.',
    pre: [[VOK, E, 'Every syllable ends in a vowel; nd, ny and mbw start a syllable.'], [D('KUSIKI.T8_MATAMSHI_BORA.a'), E, 'Saying words and sentences with target sounds (Grade 2).']] }),

  mazungumzo({ G, sub: 'KUSIKI.T9_MAZUNGUMZO', tag: 'T9', letters: ['a', 'b', 'c', 'd'], theme: 'sokoni', topic: 'bidhaa za sokoni',
    mix: ['Tulienda market tukabuy tomatoes.', 'Tulienda sokoni tukanunua nyanya.'],
    pre: [[D('KUSIKI.T9_MAZUNGUMZO_YA_PAPO_K.c'), E, 'Speaking fluently in an unprepared talk (Grade 2) comes first.'], ['KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.UFAHAMU_KUSIKILIZA', H, 'Listening for what others say is half of a conversation.']] }),

  sauti({ G, sub: 'KUSIKI.T10_MATAMSHI_BORA', tag: 'T10', letters: ['a', 'b', 'c'], theme: 'teknolojia: simu na redio',
    sounds: ['mb', 'nz', 'tw'], words: ['mbali', 'nzuri', 'twiga'], near: ['nz', 'ns', 'nzuri', 'nsuri'], split: ['twiga', 'tuwiga'], drop: ['mbali', 'bali'], noword: 'redio',
    sentence: 'Simu nzuri hutusaidia kuzungumza na watu walio mbali.',
    pre: [['KUSIKI.T8_MATAMSHI_BORA.MATAMSHI', E, 'The nasal clusters nd and mbw come before mb and nz.'], [D('KUSIKI.T4_MATAMSHI_BORA_SAUTI_.a'), E, 'Hearing target syllables in words (Grade 2).']] }),
];
export const ADD = [];
