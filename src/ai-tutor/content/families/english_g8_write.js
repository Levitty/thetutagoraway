// ============================================================================
// ENGLISH GRADE 8, WRITING AND LITERATURE: punctuation, spelling, prefixes and suffixes, similes and metaphors, personification
// and flashback, the parts of a poem, silent letters (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the library
// misconception behind it (curriculum/english/g8.json). Off for children (reviewed:false) until a Kenyan English teacher
// signs them off. Writing a composition, reading a passage, pronouncing sounds and speaking are marked by the teacher: see
// docs/qa/english-g8-non-question-outcomes-2026-11-13.md.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './english_g8_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
const GH = ['Read the sentence one word at a time, without hurrying.', 'Check your word by reading the sentence aloud.'];
const w = (code, ...xs) => xs.map(x => [x, code]);
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english8.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english8.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english8.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
const C = (key, kind, cs, pool, { stem = 'Choose.', hints, oc, form = 'direct', rung = 1 }) =>
  eng({ id: `english8.${key}`, kind, cs, oc: oc || outcomeLetters(cs, 1)[0], form, rung, gen: choose(pool, { stem, hints }) });
const SP = (key, cs, pool, { topic, hints, oc, rung = 3 }) =>
  eng({ id: `english8.${key}.spot`, cs, oc: oc || outcomeLetters(cs, 1)[0], form: 'spot', rung, gen: spot(pool, { topic, hints }) });

const PUNCT = [
  ['', 'Mama bought three mangoes at the market.', ['Mama bought three mango\'s at the market.', 'M8_PN_APOS_PLURAL'], ['Mama bought three mangoes\' at the market.', 'M8_PN_APOS_PLURAL'], 'An apostrophe shows belonging or a short form, not a plural.'],
  ['', 'The boys\' bags are in the classroom.', ['The boy\'s bags are in the classroom.', 'M8_PN_APOS_POSS'], ['The boys bags are in the classroom.', 'M8_PN_APOS_POSS'], 'Many boys own the bags, so the apostrophe goes after the s.'],
  ['', 'We bought rice, beans and maize.', ['We bought rice beans and maize.', 'M8_PN_COMMA_LIST'], ['We bought, rice beans, and maize.', 'M8_PN_COMMA_LIST'], 'Separate the items in a list with commas.'],
  ['', 'The cow licked its calf.', ['The cow licked it\'s calf.', 'M8_PN_ITS'], ['The cow licked its\' calf.', 'M8_PN_ITS'], 'Its (no apostrophe) shows belonging.'],
  ['', 'It\'s a sunny day today.', ['Its a sunny day today.', 'M8_PN_ITS'], ['It\'s\' a sunny day today.', 'M8_PN_ITS'], 'It\'s is short for it is.'],
  ['', 'The girl\'s dress is red.', ['The girls dress is red.', 'M8_PN_APOS_POSS'], ['The girl\'s\' dress is red.', 'M8_PN_APOS_POSS'], 'One girl owns the dress, so the apostrophe goes before the s.'],
  ['', 'Wanjiru packed pens, books and a ruler.', ['Wanjiru packed pens books and a ruler.', 'M8_PN_COMMA_LIST'], ['Wanjiru packed, pens, books, and a ruler.', 'M8_PN_COMMA_LIST'], 'Use commas between the items of a list.'],
  ['', 'Three girls are in the choir.', ['Three girl\'s are in the choir.', 'M8_PN_APOS_PLURAL'], ['Three girls\' are in the choir.', 'M8_PN_APOS_PLURAL'], 'A plain plural does not need an apostrophe.'],
];
const SPELL = [
  I('Please ___ the red beans from the green ones.', 'separate', w('M8_SP_MISSPELT', 'seperate', 'separete', 'seprate'), 'Separate has an a in the middle: sep-a-rate.'),
  I('We ___ a letter from Nairobi yesterday.', 'received', w('M8_SP_IE_EI', 'recieved', 'receeved', 'recived'), 'After c, write ei: received.'),
  I('I ___ you will pass the test.', 'believe', w('M8_SP_IE_EI', 'beleive', 'belive', 'beleave'), 'Believe has ie: believe.'),
  I('The hotel can ___ forty guests.', 'accommodate', w('M8_SP_DOUBLE', 'acommodate', 'accomodate', 'acomodate'), 'Accommodate has a double c and a double m.'),
  I('It is ___ to wash your hands before eating.', 'necessary', w('M8_SP_DOUBLE', 'neccessary', 'necesary', 'nessessary'), 'Necessary has one c and two s.'),
  I('We will visit our cousins ___.', 'tomorrow', w('M8_SP_DOUBLE', 'tommorow', 'tomorow', 'tomorrrow'), 'Tomorrow has one m and two r.'),
  I('She will ___ pass the exam.', 'definitely', w('M8_SP_MISSPELT', 'definately', 'definitly', 'defanitely'), 'Definitely has -ite-: def-i-nite-ly.'),
  I('The lights hang from the ___.', 'ceiling', w('M8_SP_IE_EI', 'cieling', 'cealing', 'seiling'), 'After c, write ei: ceiling.'),
];
const AFFIX = [
  I('The boys had a ___ about the rules.', 'disagreement', w('M8_PS_WRONG_PREFIX', 'unagreement', 'misagreement', 'reagreement'), 'Dis- goes with agree: disagree, disagreement.'),
  I('Juma was ___ when he lost his bag.', 'unhappy', w('M8_PS_WRONG_PREFIX', 'dishappy', 'mishappy', 'rehappy'), 'Un- goes with happy: unhappy.'),
  I('The teacher asked us to ___ the story in our own words.', 'retell', w('M8_PS_WRONG_PREFIX', 'untell', 'distell', 'mistel'), 'Re- means again: retell.'),
  I('I did not hear well, so I ___ what he said.', 'misunderstood', w('M8_PS_WRONG_PREFIX', 'disunderstood', 'ununderstood', 'reunderstood'), 'Mis- means wrongly: misunderstood.'),
  I('Kindness and ___ are good values.', 'happiness', w('M8_PS_SPELL', 'happyness', 'happynes', 'happines'), 'Change y to i before -ness: happiness.'),
  I('Wanjiru is very ___ when she crosses the road.', 'careful', w('M8_PS_SPELL', 'carefull', 'carful', 'carefal'), 'The suffix -ful has one l: careful.'),
  I('The old pen was ___ and could not write.', 'useless', w('M8_PS_SPELL', 'uselesss', 'usles', 'useles'), 'The suffix -less has two s: useless.'),
];
const AFFIX_MEAN = [
  ['What does careless mean?', 'without care', ['full of care', 'M8_PS_MEANING'], ['very careful', 'M8_PS_MEANING'], ['again and again', 'M8_PS_MEANING'], 'The suffix -less means without.'],
  ['What does careful mean?', 'full of care', ['without care', 'M8_PS_MEANING'], ['not at all', 'M8_PS_MEANING'], ['again and again', 'M8_PS_MEANING'], 'The suffix -ful means full of.'],
  ['What does unhappy mean?', 'not happy', ['very happy', 'M8_PS_MEANING'], ['happy again', 'M8_PS_MEANING'], ['happy for a short time', 'M8_PS_MEANING'], 'The prefix un- means not.'],
  ['What does replay mean?', 'play again', ['not play', 'M8_PS_MEANING'], ['play wrongly', 'M8_PS_MEANING'], ['play before', 'M8_PS_MEANING'], 'The prefix re- means again.'],
  ['What does misunderstand mean?', 'understand wrongly', ['understand again', 'M8_PS_MEANING'], ['not understand at all', 'M8_PS_MEANING'], ['understand very well', 'M8_PS_MEANING'], 'The prefix mis- means wrongly.'],
  ['What does disagree mean?', 'not agree', ['agree again', 'M8_PS_MEANING'], ['agree wrongly', 'M8_PS_MEANING'], ['agree strongly', 'M8_PS_MEANING'], 'The prefix dis- means not or the opposite of.'],
];
const FIG = [
  I('He ran like the wind. This figure of speech is a ___.', 'simile', w('M8_SM_SIMILE_AS_METAPHOR', 'metaphor', 'personification', 'proverb'), 'Like or as makes a simile.'),
  I('The boy is a lion in the game. This figure of speech is a ___.', 'metaphor', w('M8_SM_METAPHOR_AS_SIMILE', 'simile', 'idiom', 'proverb'), 'A metaphor says one thing is another.'),
  I('Her smile was as bright as the sun. This figure of speech is a ___.', 'simile', w('M8_SM_SIMILE_AS_METAPHOR', 'metaphor', 'personification', 'riddle'), 'As bright as makes a simile.'),
  I('The classroom was a zoo. This figure of speech is a ___.', 'metaphor', w('M8_SM_METAPHOR_AS_SIMILE', 'simile', 'idiom', 'riddle'), 'The classroom is said to be a zoo: a metaphor.'),
  I('The old man was as slow as a tortoise. This figure of speech is a ___.', 'simile', w('M8_SM_SIMILE_AS_METAPHOR', 'metaphor', 'personification', 'proverb'), 'As slow as makes a simile.'),
  I('Time is money. This figure of speech is a ___.', 'metaphor', w('M8_SM_METAPHOR_AS_SIMILE', 'simile', 'idiom', 'riddle'), 'Time is said to be money: a metaphor.'),
];
const FIG_MEAN = [
  ['The boy is a lion in the game. What does it mean?', 'He is brave and strong', ['He is a real animal', 'M8_SM_LITERAL'], ['He has a mane and claws', 'M8_SM_LITERAL'], ['He lives in the forest', 'M8_SM_LITERAL'], 'A lion is brave, so the boy is brave and strong.'],
  ['The classroom was a zoo. What does it mean?', 'It was noisy and out of control', ['It had animals in it', 'M8_SM_LITERAL'], ['It was very clean', 'M8_SM_LITERAL'], ['It was a place to visit', 'M8_SM_LITERAL'], 'A zoo is noisy, so the classroom was noisy.'],
  ['Her smile was as bright as the sun. What does it mean?', 'Her smile was warm and cheerful', ['Her smile was burning hot', 'M8_SM_LITERAL'], ['The sun was in her face', 'M8_SM_LITERAL'], ['She was standing outdoors', 'M8_SM_LITERAL'], 'The sun is bright and warm, so her smile was cheerful.'],
  ['He is as slow as a tortoise. What does it mean?', 'He moves very slowly', ['He is a tortoise', 'M8_SM_LITERAL'], ['He has a hard shell', 'M8_SM_LITERAL'], ['He lives for a hundred years', 'M8_SM_LITERAL'], 'A tortoise is slow, so he moves very slowly.'],
  ['Time is money. What does it mean?', 'Time is valuable and should not be wasted', ['Time can be bought with coins', 'M8_SM_LITERAL'], ['Money grows with time', 'M8_SM_LITERAL'], ['Clocks are made of money', 'M8_SM_LITERAL'], 'Time is valuable like money.'],
  ['She is an early bird. What does it mean?', 'She wakes up early', ['She is a real bird', 'M8_SM_LITERAL'], ['She has wings', 'M8_SM_LITERAL'], ['She sings every morning', 'M8_SM_LITERAL'], 'An early bird gets up early.'],
];
const PERSON = [
  ['Which sentence has personification?', 'The wind whispered in my ear.', ['The wind was strong.', 'M8_LD_PERSON_PLAIN'], ['The wind blew from the east.', 'M8_LD_PERSON_PLAIN'], ['The wind is a kind of weather.', 'M8_LD_PERSON_PLAIN'], 'The wind is given a human action: whispering.'],
  ['Which sentence has personification?', 'The cloud smiled at the hills.', ['The cloud was like a pillow.', 'M8_LD_SIMILE'], ['The cloud was grey.', 'M8_LD_PERSON_PLAIN'], ['The cloud covered the sun.', 'M8_LD_PERSON_PLAIN'], 'The cloud is given a human action: smiling.'],
  ['Which sentence has personification?', 'The old tree sighed and bent in the storm.', ['The tree was tall.', 'M8_LD_PERSON_PLAIN'], ['The tree was like a giant.', 'M8_LD_SIMILE'], ['The tree lost its leaves.', 'M8_LD_PERSON_PLAIN'], 'The tree is given a human action: sighing.'],
  ['Which sentence has personification?', 'The sun woke up and stretched over the field.', ['The sun rose at six.', 'M8_LD_PERSON_PLAIN'], ['The sun was like a ball of fire.', 'M8_LD_SIMILE'], ['The sun was hot.', 'M8_LD_PERSON_PLAIN'], 'The sun is given human actions: waking and stretching.'],
  ['Which sentence has personification?', 'The river laughed as it ran over the stones.', ['The river was long.', 'M8_LD_PERSON_PLAIN'], ['The river was as wide as a road.', 'M8_LD_SIMILE'], ['The river is near the school.', 'M8_LD_PERSON_PLAIN'], 'The river is given a human action: laughing.'],
  ['Which sentence has personification?', 'The drum called the villagers to the meeting.', ['The drum was loud.', 'M8_LD_PERSON_PLAIN'], ['The drum was as loud as thunder.', 'M8_LD_SIMILE'], ['The drum was made of wood.', 'M8_LD_PERSON_PLAIN'], 'The drum is given a human action: calling.'],
];
const FLASH = [
  ['What is a flashback?', 'A return to an earlier time in the story', ['A jump to the future of the story', 'M8_LD_FLASHBACK_FUTURE'], ['The end of the story', 'M8_LD_FLASHBACK_FUTURE'], ['A new character joining the story', 'M8_LD_FLASHBACK_FUTURE'], 'A flashback shows something that happened earlier.'],
  ['Which sentence begins a flashback?', 'Years before, Wanjiru had lived in a small village near Kisii.', ['Next year Wanjiru will move to Nairobi.', 'M8_LD_FLASHBACK_FUTURE'], ['Right now Wanjiru is reading a book.', 'M8_LD_FLASHBACK_FUTURE'], ['Tomorrow she will visit her aunt.', 'M8_LD_FLASHBACK_FUTURE'], 'Years before takes the reader back to an earlier time.'],
  ['What does personification do?', 'Gives a human action or feeling to a thing', ['Compares two things with like or as', 'M8_LD_SIMILE'], ['Takes the reader to an earlier time', 'M8_LD_FLASHBACK_FUTURE'], ['Tells the reader a lesson', 'M8_LD_PERSON_PLAIN'], 'Personification makes a thing act like a person.'],
  ['Why does a writer use a flashback?', 'To show something that happened before', ['To show what will happen next', 'M8_LD_FLASHBACK_FUTURE'], ['To end the story at once', 'M8_LD_FLASHBACK_FUTURE'], ['To describe the weather', 'M8_LD_FLASHBACK_FUTURE'], 'A flashback gives background from the past.'],
  ['Which sentence is a flashback?', 'He remembered the day his grandfather first taught him to fish.', ['He will remember tomorrow.', 'M8_LD_FLASHBACK_FUTURE'], ['He fishes every Saturday now.', 'M8_LD_FLASHBACK_FUTURE'], ['He plans to teach his son.', 'M8_LD_FLASHBACK_FUTURE'], 'He remembers an earlier time.'],
  ['In a flashback the story...', 'goes back to an earlier time', ['jumps forward in time', 'M8_LD_FLASHBACK_FUTURE'], ['stays the same', 'M8_LD_FLASHBACK_FUTURE'], ['stops', 'M8_LD_FLASHBACK_FUTURE'], 'Flash back means go back.'],
];
const POEM = [
  I('A group of lines in a poem is called a ___.', 'stanza', w('M8_PM_STANZA_LINE', 'line', 'word', 'title'), 'A stanza is a group of lines.'),
  I('One row of words in a poem is called a ___.', 'line', w('M8_PM_STANZA_LINE', 'stanza', 'chapter', 'page'), 'A line is one row of words.'),
  I('Words that end with the same sound, such as day and play, make a ___.', 'rhyme', w('M8_PM_RHYME_REPEAT', 'repetition', 'stanza', 'rhythm'), 'Rhyme is the same end sound.'),
  I('A word or line that the poet says again is called ___.', 'repetition', w('M8_PM_RHYME_REPEAT', 'rhyme', 'rhythm', 'stanza'), 'Repetition is the same words again.'),
  I('The voice that speaks in a poem is the ___.', 'persona', w('M8_PM_POET_PERSONA', 'poet', 'reader', 'title'), 'The persona is the voice in the poem.'),
  I('The beat of a poem when it is read aloud is its ___.', 'rhythm', w('M8_PM_RHYME_REPEAT', 'rhyme', 'stanza', 'persona'), 'Rhythm is the beat of the poem.'),
];
const SILENT = [
  I('The silent letter in knife is ___.', 'k', w('M8_SL_SOUNDED', 'f', 'n', 'e'), 'In knife the k is silent.'),
  I('The silent letter in write is ___.', 'w', w('M8_SL_SOUNDED', 'r', 't', 'i'), 'In write the w is silent.'),
  I('The silent letter in island is ___.', 's', w('M8_SL_SOUNDED', 'i', 'l', 'd'), 'In island the s is silent.'),
  I('The silent letter in castle is ___.', 't', w('M8_SL_WRONG_LETTER', 'c', 's', 'l'), 'In castle the t is silent.'),
  I('The silent letter in honest is ___.', 'h', w('M8_SL_WRONG_LETTER', 'n', 's', 't'), 'In honest the h is silent.'),
  I('The silent letter in listen is ___.', 't', w('M8_SL_WRONG_LETTER', 's', 'l', 'n'), 'In listen the t is silent.'),
  I('The silent letter in lamb is ___.', 'b', w('M8_SL_SOUNDED', 'l', 'm', 'a'), 'In lamb the b is silent.'),
];
const SILENT_SPELL = [
  I('Spell the tool used to cut: ___.', 'knife', w('M8_SL_SPELL', 'nife', 'nyfe', 'knif'), 'Knife begins with a silent k.'),
  I('Spell the word for putting words on paper: ___.', 'write', w('M8_SL_SPELL', 'rite', 'wrte', 'writ'), 'Write begins with a silent w.'),
  I('Spell the word for land with water all round it: ___.', 'island', w('M8_SL_SPELL', 'iland', 'ilsand', 'isand'), 'Island has a silent s.'),
  I('Spell the word for a big old fort or palace: ___.', 'castle', w('M8_SL_SPELL', 'casle', 'cassle', 'castel'), 'Castle has a silent t.'),
  I('Spell the word for a young sheep: ___.', 'lamb', w('M8_SL_SPELL', 'lam', 'lammb', 'lamp'), 'Lamb ends with a silent b.'),
  I('Spell the word for telling the truth: ___.', 'honest', w('M8_SL_SPELL', 'onest', 'honnest', 'honist'), 'Honest begins with a silent h.'),
];

export const FAMILIES = [
  C('punct.choose', 'choose-sentence', 'WRITIN.T2.PUNCTUATION', PUNCT, { stem: SENT, oc: 'a', hints: ['An apostrophe is for belonging or a short form, not a plural.', 'A comma separates the items in a list.'] }),
  SP('punct', 'WRITIN.T2.PUNCTUATION', PUNCT, { topic: 'with commas and apostrophes', hints: ['Check each apostrophe and each comma.', 'Its has no apostrophe when it shows belonging.'], oc: 'b' }),
  ...P('spelling', 'WRITIN.T6.SPELLING', SPELL, { stem: 'Choose the correct spelling.', hints: ['Look at the letters in the middle of the word.', 'I before e, except after c.'], topic: 'with tricky spellings', oc: ['a', 'c', 'a'] }),
  ...P('affix', 'WRITIN.T11.PREFIXES_SUFFIXES', AFFIX, { stem: 'Choose the correct word.', hints: ['A prefix goes at the front and a suffix at the end.', 'Change y to i before -ness.'], topic: 'with prefixes and suffixes', oc: ['b', 'b', 'c'] }),
  C('affix.mean', 'choose-meaning', 'WRITIN.T11.PREFIXES_SUFFIXES', AFFIX_MEAN, { stem: 'Choose the meaning.', oc: 'c', form: 'word', rung: 2, hints: ['-ful means full of, -less means without.', 'un- and dis- mean not; re- means again; mis- means wrongly.'] }),
  ...P('figure', 'READIN.T9_INTENSIVE_READING_SI.SIMILE_METAPHOR', FIG, { stem: 'Choose the figure of speech.', hints: ['Look for like or as.', 'A metaphor says one thing is another.'], topic: 'about figures of speech', oc: ['a', 'a', 'a'] }),
  C('figure.mean', 'choose-meaning', 'READIN.T9_INTENSIVE_READING_SI.SIMILE_METAPHOR', FIG_MEAN, { stem: 'Choose the meaning.', oc: 'c', form: 'word', rung: 2, hints: ['Ask what quality the two things share.', 'Do not read the comparison word for word.'] }),
  C('person', 'choose-example', 'READIN.T13_SHORT_STORY_STYLE_CL.LITERARY_DEVICES', PERSON, { stem: 'Choose the sentence.', oc: 'a', hints: ['Does a thing act or feel like a person?', 'A simile uses like or as.'] }),
  C('flash', 'choose-device', 'READIN.T13_SHORT_STORY_STYLE_CL.LITERARY_DEVICES', FLASH, { stem: 'Choose the answer.', oc: 'a', form: 'word', rung: 2, hints: ['Flashback means go back.', 'Personification gives human actions to things.'] }),
  ...P('poem', 'READIN.T3_INTENSIVE_READING_PO.POEM_PARTS', POEM, { stem: 'Choose the word for the part of a poem.', hints: ['A stanza is a group of lines.', 'Rhyme is the same end sound; repetition is the same words again.'], topic: 'about the parts of a poem', oc: ['a', 'a', 'a'] }),
  ...P('silent', 'LISTEN.T14.SILENT_LETTERS', SILENT, { stem: 'Choose the silent letter.', hints: ['Say the word slowly and listen for each letter.', 'The silent letter is written but not said.'], topic: 'about silent letters', oc: ['a', 'a', 'a'] }),
  eng({ id: 'english8.silent.spell.choose', kind: 'choose-spelling', cs: 'LISTEN.T14.SILENT_LETTERS', oc: 'a', form: 'word', rung: 2, gen: choose(SILENT_SPELL, { stem: 'Choose the correct spelling.', hints: ['A silent letter is still written.', 'Say the word slowly and picture it.'] }) }),
  eng({ id: 'english8.silent.spell.gap', kind: 'type-spelling', cs: 'LISTEN.T14.SILENT_LETTERS', oc: 'a', form: 'word', rung: 2, gen: gap(SILENT_SPELL, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
];
