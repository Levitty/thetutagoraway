// ============================================================================
// ENGLISH GRADE 6, WRITING: mechanics, spelling, forms, letters, journal and paragraphs (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g6.json). Off for children (reviewed:false) until a
// Kenyan English teacher signs them off. Composing a form, a letter, a journal or a paragraph is marked by a
// teacher with the composition rubric (see the non-question outcomes list); these families test the knowledge.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters, mc, feedbackOf, shuffle, pick, randInt } from './english_g6_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
const GH = ['Read the sentence slowly, one word at a time.', 'Check your word by reading the sentence aloud.'];
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english6.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english6.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english6.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
const D = (key, cs, pool, { stem = SENT, hints, topic, oc = outcomeLetters(cs, 2) }) => [
  eng({ id: `english6.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
  eng({ id: `english6.${key}.spot`, cs, oc: oc[1], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
];

// ---------------------------------------------------------------- abbreviations and acronyms
const ABB_SHORT = [
  I('What is the usual short form of "Doctor" before a name.', 'Dr', [['Dc', 'M_ABBR_SHORT_FORM'], ['Doc', 'M_ABBR_SHORT_FORM'], ['Dtr', 'M_ABBR_SHORT_FORM']], 'The short form of Doctor is Dr.'),
  I('What is the usual short form of "Mister" before a name.', 'Mr', [['Mstr', 'M_ABBR_SHORT_FORM'], ['Mis', 'M_ABBR_SHORT_FORM'], ['Mrs', 'M_ABBR_SHORT_FORM']], 'The short form of Mister is Mr. Mrs is for a married woman.'),
  I('Which short form means "for example".', 'e.g.', [['etc.', 'M_ABBR_ETC_EG'], ['i.e.', 'M_ABBR_ETC_EG'], ['a.m.', 'M_ABBR_ETC_EG']], 'E.g. means for example. Etc. means and so on. I.e. means that is.'),
  I('Which short form means "and so on".', 'etc.', [['e.g.', 'M_ABBR_ETC_EG'], ['i.e.', 'M_ABBR_ETC_EG'], ['p.m.', 'M_ABBR_ETC_EG']], 'Etc. means and so on.'),
  I('Which short form means "that is" or "in other words".', 'i.e.', [['e.g.', 'M_ABBR_ETC_EG'], ['etc.', 'M_ABBR_ETC_EG'], ['viz.', 'M_ABBR_ETC_EG']], 'I.e. means that is.'),
  I('What is the usual short form of "kilometres".', 'km', [['kms', 'M_ABBR_SHORT_FORM'], ['kilo', 'M_ABBR_SHORT_FORM'], ['kmt', 'M_ABBR_SHORT_FORM']], 'The short form of kilometres is km, with no s and no full stop.'),
  I('What is the short form of "Post Office Box" in an address.', 'P.O. Box', [['Po Boks', 'M_ABBR_SHORT_FORM'], ['P Box', 'M_ABBR_SHORT_FORM'], ['Post Bx', 'M_ABBR_SHORT_FORM']], 'In an address we write P.O. Box.'),
];
const ABB_FULL = [
  I('What does KNEC stand for.', 'Kenya National Examinations Council', [['Kenya National Education Centre', 'M_ABBR_WRONG_EXPAND'], ['Kenya Nursery Examinations Committee', 'M_ABBR_WRONG_EXPAND'], ['Kenyan National Exam Club', 'M_ABBR_WRONG_EXPAND']], 'Each letter is the first letter of a word: Kenya National Examinations Council.'),
  I('What does KWS stand for.', 'Kenya Wildlife Service', [['Kenya Water Supply', 'M_ABBR_WRONG_EXPAND'], ['Kenya Wild Safari', 'M_ABBR_WRONG_EXPAND'], ['Kenya Weather Service', 'M_ABBR_WRONG_EXPAND']], 'KWS is the Kenya Wildlife Service, which looks after the national parks.'),
  I('What does KRA stand for.', 'Kenya Revenue Authority', [['Kenya Road Association', 'M_ABBR_WRONG_EXPAND'], ['Kenya Railway Agency', 'M_ABBR_WRONG_EXPAND'], ['Kenya Rural Aid', 'M_ABBR_WRONG_EXPAND']], 'KRA is the Kenya Revenue Authority, which collects taxes.'),
  I('What does KBC stand for.', 'Kenya Broadcasting Corporation', [['Kenya Bus Company', 'M_ABBR_WRONG_EXPAND'], ['Kenya Banking Council', 'M_ABBR_WRONG_EXPAND'], ['Kenya Books Club', 'M_ABBR_WRONG_EXPAND']], 'KBC is the Kenya Broadcasting Corporation.'),
  I('What does KICD stand for.', 'Kenya Institute of Curriculum Development', [['Kenya Institute of Child Development', 'M_ABBR_WRONG_EXPAND'], ['Kenya Council for Primary Schools', 'M_ABBR_WRONG_EXPAND'], ['Kenya Institute of Computer Design', 'M_ABBR_WRONG_EXPAND']], 'KICD is the Kenya Institute of Curriculum Development, which designs what schools teach.'),
  I('What does NHIF stand for.', 'National Hospital Insurance Fund', [['National Health Information Forum', 'M_ABBR_WRONG_EXPAND'], ['Nairobi Hospital Investment Fund', 'M_ABBR_WRONG_EXPAND'], ['National Home Income Fund', 'M_ABBR_WRONG_EXPAND']], 'NHIF is the National Hospital Insurance Fund.'),
];
const ABB_KIND = [
  I('Which of these is an acronym, read as a word.', 'UNICEF', [['Mr', 'M_ABBR_ACRONYM_ANY'], ['Dr', 'M_ABBR_ACRONYM_ANY'], ['etc.', 'M_ABBR_ACRONYM_ANY']], 'UNICEF is said as one word, so it is an acronym.'),
  I('Which of these is an abbreviation but not an acronym.', 'Dr', [['UNICEF', 'M_ABBR_ACRONYM_ANY'], ['NASA', 'M_ABBR_ACRONYM_ANY'], ['UNESCO', 'M_ABBR_ACRONYM_ANY']], 'Dr is a short form of Doctor. It is not said as a word of its own, so it is an abbreviation.'),
  I('Which of these is an acronym, read as a word.', 'NASA', [['Mrs', 'M_ABBR_ACRONYM_ANY'], ['km', 'M_ABBR_ACRONYM_ANY'], ['e.g.', 'M_ABBR_ACRONYM_ANY']], 'NASA is said as one word, so it is an acronym.'),
  I('Which of these is an abbreviation but not an acronym.', 'Mr', [['NASA', 'M_ABBR_ACRONYM_ANY'], ['UNICEF', 'M_ABBR_ACRONYM_ANY'], ['UNESCO', 'M_ABBR_ACRONYM_ANY']], 'Mr is a short form of Mister, not a word made from first letters.'),
  I('Which of these is an acronym, read as a word.', 'UNESCO', [['St', 'M_ABBR_ACRONYM_ANY'], ['Dr', 'M_ABBR_ACRONYM_ANY'], ['etc.', 'M_ABBR_ACRONYM_ANY']], 'UNESCO is said as one word made of first letters, so it is an acronym.'),
];
// ---------------------------------------------------------------- numerals
const NUM_SPELL = [
  I('Which is the correct spelling of 40 in words.', 'forty', [['fourty', 'M_NUM_FOURTY'], ['fortie', 'M_NUM_FOURTY'], ['fotry', 'M_NUM_FOURTY']], 'Forty has no u, but fourteen keeps it.'),
  I('Which is the correct spelling of 14 in words.', 'fourteen', [['forteen', 'M_NUM_FOURTY'], ['fourten', 'M_NUM_FOURTY'], ['fortean', 'M_NUM_FOURTY']], 'Fourteen is four + teen, so it keeps the u.'),
  I('Which is the correct spelling of 90 in words.', 'ninety', [['ninty', 'M_NUM_FOURTY'], ['nintey', 'M_NUM_FOURTY'], ['ninetie', 'M_NUM_FOURTY']], 'Ninety keeps the e of nine.'),
  I('Which is the correct spelling of 8th in words.', 'eighth', [['eigth', 'M_NUM_EIGHTH'], ['eightth', 'M_NUM_EIGHTH'], ['eighthe', 'M_NUM_EIGHTH']], 'Eight + th: eighth.'),
  I('Which is the correct spelling of 9th in words.', 'ninth', [['nineth', 'M_NUM_EIGHTH'], ['ninnth', 'M_NUM_EIGHTH'], ['nienth', 'M_NUM_EIGHTH']], 'Ninth drops the e of nine.'),
  I('Which is the correct spelling of 12 in words.', 'twelve', [['twelf', 'M_NUM_FOURTY'], ['tweleve', 'M_NUM_FOURTY'], ['twelv', 'M_NUM_FOURTY']], 'Twelve ends in -elve.'),
];
const NUM_ORD = [
  I('How do you write "second" as a figure.', '2nd', [['2th', 'M_NUM_ORDINAL_END'], ['2d', 'M_NUM_ORDINAL_END'], ['2s', 'M_NUM_ORDINAL_END']], 'Second is 2nd.'),
  I('How do you write "third" as a figure.', '3rd', [['3th', 'M_NUM_ORDINAL_END'], ['3d', 'M_NUM_ORDINAL_END'], ['3ed', 'M_NUM_ORDINAL_END']], 'Third is 3rd.'),
  I('How do you write "fourth" as a figure.', '4th', [['4rd', 'M_NUM_ORDINAL_END'], ['4nd', 'M_NUM_ORDINAL_END'], ['4s', 'M_NUM_ORDINAL_END']], 'From fourth on the ending is th.'),
  I('How do you write "first" as a figure.', '1st', [['1th', 'M_NUM_ORDINAL_END'], ['1rd', 'M_NUM_ORDINAL_END'], ['1nd', 'M_NUM_ORDINAL_END']], 'First is 1st.'),
  I('How do you write "twenty-first" as a figure.', '21st', [['21th', 'M_NUM_ORDINAL_END'], ['21nd', 'M_NUM_ORDINAL_END'], ['21rd', 'M_NUM_ORDINAL_END']], 'A number ending in one is written with st: 21st.'),
  I('How do you write "twenty-second" as a figure.', '22nd', [['22th', 'M_NUM_ORDINAL_END'], ['22st', 'M_NUM_ORDINAL_END'], ['22rd', 'M_NUM_ORDINAL_END']], 'A number ending in two is written with nd: 22nd.'),
];
const NUM_SENT = [
  I('', 'Forty learners passed the test.', [['40 learners passed the test.', 'M_NUM_START_FIGURE'], ['Fourty learners passed the test.', 'M_NUM_FOURTY'], ['40 Learners passed the test.', 'M_NUM_START_FIGURE']], 'A sentence does not begin with a figure, and forty has no u.'),
  I('', 'Twenty-five children were absent on Monday.', [['25 children were absent on Monday.', 'M_NUM_START_FIGURE'], ['Twentyfive children were absent on Monday.', 'M_NUM_START_FIGURE'], ['25 Children were absent on Monday.', 'M_NUM_START_FIGURE']], 'A sentence does not begin with a figure. Write the number in words.'),
  I('', 'Wanjiru came 2nd in the race.', [['Wanjiru came 2th in the race.', 'M_NUM_ORDINAL_END'], ['Wanjiru came 2d in the race.', 'M_NUM_ORDINAL_END'], ['Wanjiru came 2s in the race.', 'M_NUM_ORDINAL_END']], 'Second is written 2nd.'),
  I('', 'Peter finished in 3rd place.', [['Peter finished in 3th place.', 'M_NUM_ORDINAL_END'], ['Peter finished in 3d place.', 'M_NUM_ORDINAL_END'], ['Peter finished in 3ed place.', 'M_NUM_ORDINAL_END']], 'Third is written 3rd.'),
  I('', 'Ninety learners joined the choir.', [['90 learners joined the choir.', 'M_NUM_START_FIGURE'], ['Ninty learners joined the choir.', 'M_NUM_FOURTY'], ['90 Learners joined the choir.', 'M_NUM_START_FIGURE']], 'A sentence does not begin with a figure, and ninety keeps the e.'),
  I('', 'Our class is on the 4th floor.', [['Our class is on the 4rd floor.', 'M_NUM_ORDINAL_END'], ['Our class is on the 4nd floor.', 'M_NUM_ORDINAL_END'], ['Our class is on the 4s floor.', 'M_NUM_ORDINAL_END']], 'From fourth on the ending is th: 4th.'),
];
// ---------------------------------------------------------------- comma
const COMMA = [
  I('', 'The boy in the blue shirt is my cousin.', [['The boy in the blue shirt, is my cousin.', 'M_COMMA_SUBJECT_VERB'], ['The boy, in the blue shirt is my cousin.', 'M_COMMA_SUBJECT_VERB'], ['The boy in the blue, shirt is my cousin.', 'M_COMMA_SUBJECT_VERB']], 'Do not put a comma between a subject and its verb.'),
  I('', 'Mama bought rice, beans, maize and sugar.', [['Mama bought rice beans maize and sugar.', 'M6_COMMA_LIST_MISSING'], ['Mama bought rice beans, maize and sugar.', 'M6_COMMA_LIST_MISSING'], ['Mama bought, rice, beans, maize and sugar.', 'M_COMMA_SUBJECT_VERB']], 'Put a comma between the items in a list. And joins the last two.'),
  I('', 'After lunch, we played football.', [['After, lunch we played football.', 'M_COMMA_OPENING_MISSING'], ['After lunch we, played football.', 'M_COMMA_SUBJECT_VERB']], 'A phrase that opens the sentence is followed by a comma.'),
  I('', 'It was raining, so we stayed at home.', [['It was raining, we stayed at home.', 'M6_COMMA_SPLICE'], ['It was raining so, we stayed at home.', 'M6_COMMA_SPLICE'], ['It was raining we stayed at home.', 'M6_COMMA_SPLICE']], 'A comma cannot join two sentences by itself. Add a joining word such as so.'),
  I('', 'Mama said, "Come and eat."', [['Mama said "Come and eat."', 'M_COMMA_SPEECH_MISSING'], ['Mama, said "Come and eat."', 'M_COMMA_SPEECH_MISSING'], ['Mama said "Come and eat",', 'M_COMMA_SPEECH_MISSING']], 'Put a comma between the speaker and the spoken words.'),
  I('', 'In the morning, the children walk to school.', [['In the morning the children, walk to school.', 'M_COMMA_SUBJECT_VERB'], ['In, the morning the children walk to school.', 'M_COMMA_OPENING_MISSING']], 'The opening phrase In the morning is followed by a comma.'),
  I('', 'We visited Nairobi, Nakuru, Kisumu and Mombasa.', [['We visited Nairobi Nakuru Kisumu and Mombasa.', 'M6_COMMA_LIST_MISSING'], ['We visited, Nairobi, Nakuru, Kisumu and Mombasa.', 'M_COMMA_SUBJECT_VERB'], ['We visited Nairobi, Nakuru Kisumu and Mombasa.', 'M6_COMMA_LIST_MISSING']], 'Commas separate the places in a list.'),
  I('', 'The test was hard, but everybody passed.', [['The test was hard but, everybody passed.', 'M6_COMMA_SPLICE'], ['The test was hard everybody passed.', 'M6_COMMA_SPLICE'], ['The test, was hard but everybody passed.', 'M_COMMA_SUBJECT_VERB']], 'A comma goes before but when it joins two full sentences.'),
];
// ---------------------------------------------------------------- quotation marks
const QM = [
  I('', 'Mama said, "Come and eat."', [['Mama said, Come and eat.', 'M_QM_MISSING'], ['Mama said, "Come and eat".', 'M_QM_PUNCT_OUTSIDE']], 'The exact words go inside double quotation marks, and the full stop goes inside too.'),
  I('', 'Juma asked, "Where is my bag?"', [['Juma asked, "Where is my bag"?', 'M_QM_PUNCT_OUTSIDE'], ['Juma asked, Where is my bag?', 'M_QM_MISSING'], ['Juma asked, "Where is my bag?".', 'M_QM_PUNCT_OUTSIDE']], 'The question mark goes inside the closing quotation marks.'),
  I('', '"I am tired," said Amina, "but I will finish."', [['"I am tired," said Amina, "But I will finish."', 'M_QM_CAPITAL_SPLIT'], ['"I am tired", said Amina, "but I will finish".', 'M_QM_PUNCT_OUTSIDE'], ['I am tired, said Amina, but I will finish.', 'M_QM_MISSING']], 'In split speech the second part starts with a small letter, because the sentence goes on.'),
  I('', 'She said that she was tired.', [['She said that "she was tired."', 'M_QM_REPORTED'], ['She said "that she was tired."', 'M_QM_REPORTED'], ['She said, that "she was tired".', 'M_QM_REPORTED']], 'Reported speech does not use quotation marks.'),
  I('', '"Please sit down," said the teacher.', [['"Please sit down", said the teacher.', 'M_QM_PUNCT_OUTSIDE'], ['Please sit down, said the teacher.', 'M_QM_MISSING'], ['"please sit down," said the teacher.', 'M_QM_CAPITAL_SPLIT']], 'The comma goes inside the closing quotation marks, and the speech starts with a capital letter.'),
  I('', 'The headteacher shouted, "Stop!"', [['The headteacher shouted, "Stop"!', 'M_QM_PUNCT_OUTSIDE'], ['The headteacher shouted, Stop!', 'M_QM_MISSING']], 'The exclamation mark goes inside the closing quotation marks.'),
  I('', '"We are ready," said Otieno, "so let us begin."', [['"We are ready," said Otieno, "So let us begin."', 'M_QM_CAPITAL_SPLIT'], ['"We are ready", said Otieno, "so let us begin".', 'M_QM_PUNCT_OUTSIDE'], ['We are ready, said Otieno, so let us begin.', 'M_QM_MISSING']], 'The second part of split speech starts with a small letter.'),
  I('', 'Wanjiru told us that the bus was late.', [['Wanjiru told us that "the bus was late."', 'M_QM_REPORTED'], ['Wanjiru told us "that the bus was late."', 'M_QM_REPORTED'], ['Wanjiru told us, that "the bus was late".', 'M_QM_REPORTED']], 'This reports what she said, not her exact words, so there are no quotation marks.'),
];
// ---------------------------------------------------------------- hyphens
const HYP = [
  I('', 'She is a well-known singer.', [['She is a well known singer.', 'M_HYP_MISSING'], ['She is a well-known-singer.', 'M_HYP_MISSING'], ['She is a-well known singer.', 'M_HYP_MISSING']], 'A compound that describes the noun after it takes a hyphen: a well-known singer.'),
  I('', 'There are twenty-one learners in the choir.', [['There are twenty one learners in the choir.', 'M_HYP_NUMBER'], ['There are twentyone learners in the choir.', 'M_HYP_NUMBER'], ['There are twen-ty one learners in the choir.', 'M_HYP_NUMBER']], 'Numbers from twenty-one to ninety-nine take a hyphen.'),
  I('', 'He is a ten-year-old boy.', [['He is a ten-years-old boy.', 'M_HYP_PLURAL_COMPOUND'], ['He is a ten years old boy.', 'M_HYP_PLURAL_COMPOUND'], ['He is a ten-years old boy.', 'M_HYP_PLURAL_COMPOUND']], 'Before a noun the unit stays singular: a ten-year-old boy.'),
  I('', 'My mother-in-law lives in Eldoret.', [['My mother in law lives in Eldoret.', 'M_HYP_RELATIVE'], ['My motherinlaw lives in Eldoret.', 'M_HYP_RELATIVE'], ['My mother-in law lives in Eldoret.', 'M_HYP_RELATIVE']], 'Words for relations by marriage are hyphenated: mother-in-law.'),
  I('', 'Ninety-nine learners took part.', [['Ninety nine learners took part.', 'M_HYP_NUMBER'], ['Ninetynine learners took part.', 'M_HYP_NUMBER'], ['Nine-ty nine learners took part.', 'M_HYP_NUMBER']], 'Numbers from twenty-one to ninety-nine take a hyphen.'),
  I('', 'It was a part-time job.', [['It was a part time job.', 'M_HYP_MISSING'], ['It was a parttime job.', 'M_HYP_MISSING'], ['It was a part-time-job.', 'M_HYP_MISSING']], 'Part-time describes the job, so it takes a hyphen.'),
  I('', 'We bought a five-litre jerrycan.', [['We bought a five-litres jerrycan.', 'M_HYP_PLURAL_COMPOUND'], ['We bought a five litre jerrycan.', 'M_HYP_MISSING'], ['We bought a five-litres-jerrycan.', 'M_HYP_PLURAL_COMPOUND']], 'Before a noun the unit stays singular: a five-litre jerrycan.'),
  I('', 'Her sister-in-law is a nurse.', [['Her sister in law is a nurse.', 'M_HYP_RELATIVE'], ['Her sisterinlaw is a nurse.', 'M_HYP_RELATIVE'], ['Her sister-in law is a nurse.', 'M_HYP_RELATIVE']], 'Sister-in-law is written with two hyphens.'),
];
// ---------------------------------------------------------------- synonyms and antonyms
const SA = [
  I('The old man was weak but his son was ___.', 'strong', [['feeble', 'M_SA_SYN_FOR_ANT'], ['weak', 'M_SA_REPEAT'], ['tall', 'M_SA_RELATED_NOT_PAIR']], 'An antonym is the opposite: weak and strong.'),
  I('Wafula was delighted with his gift. He was very ___.', 'happy', [['sad', 'M_SA_ANT_FOR_SYN'], ['angry', 'M_SA_ANT_FOR_SYN'], ['rich', 'M_SA_RELATED_NOT_PAIR']], 'A synonym has the same meaning: delighted and happy.'),
  I('The road was wide but the path was ___.', 'narrow', [['broad', 'M_SA_SYN_FOR_ANT'], ['long', 'M_SA_RELATED_NOT_PAIR'], ['wide', 'M_SA_REPEAT']], 'The opposite of wide is narrow.'),
  I('The soup was hot, but the juice was ___.', 'cold', [['sticky', 'M_SA_RELATED_NOT_PAIR'], ['hot', 'M_SA_REPEAT'], ['boiling', 'M_SA_SYN_FOR_ANT']], 'The opposite of hot is cold.'),
  I('The thief was caught and brought to the police. He was a ___.', 'robber', [['guard', 'M_SA_ANT_FOR_SYN'], ['judge', 'M_SA_RELATED_NOT_PAIR'], ['policeman', 'M_SA_ANT_FOR_SYN']], 'A synonym of thief is robber.'),
  I('Amina is very clever. Another word for clever is ___.', 'intelligent', [['foolish', 'M_SA_ANT_FOR_SYN'], ['quiet', 'M_SA_RELATED_NOT_PAIR'], ['tall', 'M_SA_RELATED_NOT_PAIR']], 'Intelligent has the same meaning as clever.'),
  I('The opposite of ancient is ___.', 'modern', [['old', 'M_SA_SYN_FOR_ANT'], ['ancient', 'M_SA_REPEAT'], ['rare', 'M_SA_RELATED_NOT_PAIR']], 'An antonym is the opposite: ancient and modern.'),
  I('The boy was exhausted. Another word for exhausted is ___.', 'tired', [['energetic', 'M_SA_ANT_FOR_SYN'], ['hungry', 'M_SA_RELATED_NOT_PAIR'], ['angry', 'M_SA_RELATED_NOT_PAIR']], 'Exhausted and tired have the same meaning.'),
];
// ---------------------------------------------------------------- prefixes and suffixes
const AFF = [
  I('___happy', 'un', [['dis', 'M_AFF_WRONG_PREFIX'], ['in', 'M_AFF_WRONG_PREFIX'], ['mis', 'M_AFF_WRONG_PREFIX']], 'Un- gives the word the opposite meaning: unhappy.'),
  I('___agree', 'dis', [['un', 'M_AFF_WRONG_PREFIX'], ['im', 'M_AFF_WRONG_PREFIX'], ['re', 'M_AFF_WRONG_PREFIX']], 'Disagree takes dis-.'),
  I('___spell', 'mis', [['dis', 'M_AFF_WRONG_PREFIX'], ['un', 'M_AFF_WRONG_PREFIX'], ['in', 'M_AFF_WRONG_PREFIX']], 'Misspell means to spell wrongly: mis + spell.'),
  I('___possible', 'im', [['un', 'M_AFF_WRONG_PREFIX'], ['dis', 'M_AFF_WRONG_PREFIX'], ['mis', 'M_AFF_WRONG_PREFIX']], 'Impossible takes im- before p.'),
  I('care___', 'ful', [['full', 'M_AFF_FULL'], ['ious', 'M_AFF_FULL'], ['ness', 'M_AFF_FULL']], 'The suffix -ful has one l: careful.'),
  I('help___', 'ful', [['full', 'M_AFF_FULL'], ['fool', 'M_AFF_FULL'], ['ment', 'M_AFF_FULL']], 'Helpful is help + ful, with one l.'),
  I('___appear', 'dis', [['diss', 'M_AFF_DOUBLE_LETTER'], ['un', 'M_AFF_WRONG_PREFIX'], ['mis', 'M_AFF_WRONG_PREFIX']], 'Dis + appear = disappear. Keep every letter once and do not add an extra s.'),
  I('happy + ness = ___', 'happiness', [['happyness', 'M_AFF_Y_TO_I'], ['happinness', 'M_AFF_Y_TO_I'], ['happynes', 'M_AFF_Y_TO_I']], 'Change the y to i before -ness: happiness.'),
  I('enjoy___', 'ment', [['full', 'M_AFF_WRONG_PREFIX'], ['ness', 'M_AFF_WRONG_PREFIX'], ['less', 'M_AFF_WRONG_PREFIX']], 'Enjoyment is enjoy + ment.'),
];
// ---------------------------------------------------------------- spelling
const SPELL = [
  I('We ___ the parcel on Friday.', 'received', [['recieved', 'M_SP_IE_EI'], ['receeved', 'M_SP_VOWEL'], ['recived', 'M_SP_SILENT']], 'I before e, except after c: received.'),
  I('I do not ___ that he told a lie.', 'believe', [['beleive', 'M_SP_IE_EI'], ['belive', 'M_SP_SILENT'], ['beleeve', 'M_SP_VOWEL']], 'I before e, except after c: believe.'),
  I('The twins sit at ___ desks.', 'separate', [['seperate', 'M_SP_VOWEL'], ['seprate', 'M_SP_SILENT'], ['separete', 'M_SP_VOWEL']], 'Separate has an a in the middle: sep-a-rate.'),
  I('It is ___ to wash your hands before eating.', 'necessary', [['neccessary', 'M_SP_DOUBLE'], ['necesary', 'M_SP_DOUBLE'], ['necessery', 'M_SP_VOWEL']], 'Necessary has one c and two s.'),
  I('The ___ built a new road to the village.', 'government', [['goverment', 'M_SP_SILENT'], ['govenment', 'M_SP_SILENT'], ['guvernment', 'M_SP_VOWEL']], 'Say it slowly: govern-ment.'),
  I('We must protect the ___.', 'environment', [['enviroment', 'M_SP_SILENT'], ['enviornment', 'M_SP_SILENT'], ['envirenment', 'M_SP_VOWEL']], 'Say it slowly: environ-ment.'),
  I('I will visit my grandmother ___.', 'tomorrow', [['tommorow', 'M_SP_DOUBLE'], ['tomorow', 'M_SP_DOUBLE'], ['tommorrow', 'M_SP_DOUBLE']], 'Tomorrow has one m and two r.'),
  I('Our school ___ has many books.', 'library', [['libary', 'M_SP_SOUND'], ['liberry', 'M_SP_SOUND'], ['librery', 'M_SP_VOWEL']], 'Say the r in the middle: lib-r-ary.'),
  I('The second month of the year is ___.', 'February', [['Febuary', 'M_SP_SOUND'], ['Feburary', 'M_SP_SOUND'], ['Februery', 'M_SP_VOWEL']], 'February has an r after the b.'),
  I('She is my best ___.', 'friend', [['freind', 'M_SP_IE_EI'], ['frend', 'M_SP_SILENT'], ['friand', 'M_SP_VOWEL']], 'Friend has ie: fr-ie-nd.'),
];
// ---------------------------------------------------------------- forms
const FORM_ENTRY = [
  I('Wanjiru Kamau Mwangi is filling in a school form. Her surname is Mwangi. What goes in the box "Surname".', 'Mwangi', [['Wanjiru', 'M_FORM_SURNAME'], ['Kamau', 'M_FORM_SURNAME'], ['Wanjiru Kamau', 'M_FORM_SURNAME']], 'The surname is the family name, Mwangi.'),
  I('Which of these goes in the box "Date of birth".', 'the day you were born', [['the date today', 'M_FORM_DATE_TODAY'], ['the date of the exam', 'M_FORM_DATE_TODAY'], ['the date you joined the school', 'M_FORM_DATE_TODAY']], 'Date of birth is the day you were born.'),
  I('The box "Allergies" does not apply to Peter. What is the best entry.', 'None', [['(leave it empty)', 'M_FORM_SKIP'], ['Yes', 'M_FORM_SKIP'], ['Peter', 'M_FORM_SKIP']], 'Do not leave a box empty. Write None or N/A.'),
  I('The form says "Write in BLOCK LETTERS". Which entry is right for a girl called Amina Odhiambo.', 'AMINA ODHIAMBO', [['amina odhiambo', 'M_FORM_BLOCK'], ['Amina Odhiambo', 'M_FORM_BLOCK'], ['aMiNa OdHiAmBo', 'M_FORM_BLOCK']], 'Block letters are capital letters.'),
  I('What do you put in the box "Signature".', 'your name written in your own handwriting', [['your name printed in capital letters', 'M_FORM_SIGN_PRINT'], ['your admission number', 'M_FORM_SIGN_PRINT'], ['your parent\'s name typed', 'M_FORM_SIGN_PRINT']], 'A signature is your own handwritten name.'),
  I('Otieno Juma Okello is filling in a library form. His surname is Okello. Which entry goes in "First name".', 'Otieno', [['Okello', 'M_FORM_SURNAME'], ['Juma Okello', 'M_FORM_SURNAME'], ['Otieno Juma Okello', 'M_FORM_SURNAME']], 'The first name is the name given to him, Otieno. The family name goes in Surname.'),
  I('The box "Date of birth" asks for DD/MM/YYYY. Wanjiku was born on 5 March 2014. What does she write.', '05/03/2014', [['03/05/2014', 'M_FORM_DATE_TODAY'], ['today\'s date', 'M_FORM_DATE_TODAY'], ['2014', 'M_FORM_DATE_TODAY']], 'Day, month, year in the order the form shows: 05/03/2014.'),
];
const FORM_PLAN = [
  I('A school wants someone to call in an emergency. Which field must its admission form have.', 'Parent or guardian phone number', [['Favourite colour', 'M_FORM_WRONG_FIELD'], ['Shoe size', 'M_FORM_WRONG_FIELD'], ['Number of pencils', 'M_FORM_WRONG_FIELD']], 'The school needs a way to reach a parent or guardian.'),
  I('A library wants to know who has borrowed a book. Which field must its borrower form have.', 'Name and class of the borrower', [['Favourite book colour', 'M_FORM_WRONG_FIELD'], ['Weight of the borrower', 'M_FORM_WRONG_FIELD'], ['Name of the borrower\'s dog', 'M_FORM_WRONG_FIELD']], 'The library must know who took the book.'),
  I('A clinic needs to know if a child can safely take a medicine. Which field must its form have.', 'Allergies', [['Favourite game', 'M_FORM_WRONG_FIELD'], ['Number of friends', 'M_FORM_WRONG_FIELD'], ['Shoe size', 'M_FORM_WRONG_FIELD']], 'Allergies show whether the medicine could harm the child.'),
  I('A school football club wants to know who will join the Saturday match. Which field must its sign-up form have.', 'Name and a yes or no for Saturday', [['Height of the learner\'s father', 'M_FORM_WRONG_FIELD'], ['Colour of the learner\'s house', 'M_FORM_WRONG_FIELD'], ['Name of the learner\'s teacher', 'M_FORM_WRONG_FIELD']], 'The club needs to know who is coming.'),
  I('A shop asks customers for feedback. Which field is useful on its feedback form.', 'What did you like or dislike', [['Your shoe size', 'M_FORM_WRONG_FIELD'], ['Your favourite song', 'M_FORM_WRONG_FIELD'], ['Your grandmother\'s name', 'M_FORM_WRONG_FIELD']], 'The shop wants the customer\'s opinion about its service.'),
];
// ---------------------------------------------------------------- formal letter
const LET_PARTS = [
  I('A letter begins "Dear Sir". How should it end.', 'Yours faithfully', [['Yours sincerely', 'M_LET_CLOSING'], ['Your loving friend', 'M_LET_INFORMAL'], ['Bye for now', 'M_LET_INFORMAL']], 'Dear Sir goes with Yours faithfully.'),
  I('A letter begins "Dear Mr Otieno". How should it end.', 'Yours sincerely', [['Yours faithfully', 'M_LET_CLOSING'], ['Your best friend', 'M_LET_INFORMAL'], ['See you soon', 'M_LET_INFORMAL']], 'A named person goes with Yours sincerely.'),
  I('Where does the writer\'s own address go in a formal letter.', 'at the top right', [['at the bottom', 'M_LET_ADDRESS'], ['after the greeting', 'M_LET_ADDRESS'], ['in the middle', 'M_LET_ADDRESS']], 'The writer\'s address goes at the top right.'),
  I('Which part of a formal letter briefly tells the reader what it is about.', 'the subject line', [['the closing', 'M_LET_NO_SUBJECT'], ['the date', 'M_LET_NO_SUBJECT'], ['the signature', 'M_LET_NO_SUBJECT']], 'The subject line sits under the greeting and names the topic.'),
  I('Where does the signature go in a formal letter.', 'under the closing, with the name printed below', [['above the greeting', 'M_LET_SIGNATURE'], ['at the top right', 'M_LET_SIGNATURE'], ['before the date', 'M_LET_SIGNATURE']], 'Greeting, body, closing, then signature and name.'),
  I('A letter begins "Dear Madam". How should it end.', 'Yours faithfully', [['Yours sincerely', 'M_LET_CLOSING'], ['Love from', 'M_LET_INFORMAL'], ['Cheers', 'M_LET_INFORMAL']], 'Dear Madam goes with Yours faithfully.'),
];
const LET_WORDING = [
  I('Which line is right for a formal invitation.', 'You are kindly invited to our school open day.', [['Hi! Come to our school, it will be fun.', 'M_LET_INFORMAL'], ['Don\'t miss our open day, it\'ll be cool.', 'M_LET_INFORMAL'], ['Come on, you must come to our open day.', 'M_LET_INFORMAL']], 'A formal invitation is polite and uses full forms.'),
  I('Which line is a suitable opening for a formal letter to the headteacher.', 'I am writing to request permission to attend the competition.', [['Hey, can I go to the competition?', 'M_LET_INFORMAL'], ['I want to go to the competition, OK?', 'M_LET_INFORMAL'], ['Please let me go, I beg you!', 'M_LET_INFORMAL']], 'A formal letter says its purpose politely and plainly.'),
  I('Which line is a suitable ending sentence for a formal invitation.', 'We look forward to seeing you.', [['Be there or be square.', 'M_LET_INFORMAL'], ['Don\'t be late!', 'M_LET_INFORMAL'], ['See ya!', 'M_LET_INFORMAL']], 'A formal ending is polite: We look forward to seeing you.'),
  I('Which is the best way to give the date and place of an event in a formal invitation.', 'The event will take place on Friday, 20 November, at the school hall.', [['It\'s happening Friday at the hall, you know.', 'M_LET_INFORMAL'], ['Friday the hall, come.', 'M_LET_INFORMAL'], ['We\'ll be at the hall some time.', 'M_LET_INFORMAL']], 'A formal invitation states the day, date and place clearly.'),
  I('Which sentence is suitable in a formal letter.', 'I would be grateful if you could reply by Monday.', [['Reply fast, will you?', 'M_LET_INFORMAL'], ['Tell me quick, OK?', 'M_LET_INFORMAL'], ['Write back or else.', 'M_LET_INFORMAL']], 'A formal letter asks politely.'),
];
// ---------------------------------------------------------------- journal
const JRN_PART = [
  I('What should a journal entry begin with.', 'the date', [['Yours faithfully', 'M_JRN_NO_DATE'], ['the receiver\'s address', 'M_JRN_NO_DATE'], ['a subject line', 'M_JRN_NO_DATE']], 'Each entry belongs to one day, so the date comes first.'),
  I('Which of these does a journal entry NOT have.', 'Yours sincerely at the end', [['the date', 'M_JRN_NO_DATE'], ['what happened in order', 'M_JRN_FACTS_ONLY'], ['the writer\'s feelings', 'M_JRN_FACTS_ONLY']], 'A journal is private and is not sent, so it has no closing like Yours sincerely.'),
  I('In which person is a journal usually written.', 'the first person: I and my', [['the third person: he and she', 'M_JRN_THIRD_PERSON'], ['the second person: you', 'M_JRN_THIRD_PERSON'], ['the person of a news reader', 'M_JRN_THIRD_PERSON']], 'A journal is your own record, so you write I.'),
  I('What makes a journal different from a timetable.', 'it says what you felt as well as what happened', [['it lists only the times', 'M_JRN_FACTS_ONLY'], ['it is written for a teacher to mark', 'M_JRN_LETTER_FORM'], ['it has a greeting', 'M_JRN_LETTER_FORM']], 'A journal tells what happened and how you felt about it.'),
  I('Which of these is a part of a journal entry.', 'what happened during the day', [['a closing such as Yours faithfully', 'M_JRN_LETTER_FORM'], ['the receiver\'s address', 'M_JRN_LETTER_FORM'], ['a subject line for the reader', 'M_JRN_LETTER_FORM']], 'A journal records the events of the day.'),
];
const JRN_ENTRY = [
  I('Which line could be from a journal.', 'Today I went to the market with Mama and I felt happy.', [['Otieno went to the market with his mother.', 'M_JRN_THIRD_PERSON'], ['Dear Sir, I am writing to ask for a book.', 'M_JRN_LETTER_FORM'], ['The market opens at six every day.', 'M_JRN_FACTS_ONLY']], 'A journal uses I and tells how the writer felt.'),
  I('Which text is a journal entry.', 'Friday, 13 November. Today we played netball and I was so proud when we won.', [['Dear Aunt Njeri, we are well. Yours sincerely, Atieno.', 'M_JRN_LETTER_FORM'], ['The school won the netball match on Friday.', 'M_JRN_FACTS_ONLY'], ['Atieno was proud when her team won.', 'M_JRN_THIRD_PERSON']], 'It has a date, I, and a feeling.'),
  I('Which line could be from a journal.', 'I was nervous before the test, but I felt better after the first question.', [['The test starts at nine and ends at eleven.', 'M_JRN_FACTS_ONLY'], ['Juma was nervous before the test.', 'M_JRN_THIRD_PERSON'], ['Dear Madam, I wish to inform you about the test.', 'M_JRN_LETTER_FORM']], 'It uses I and tells a feeling.'),
  I('Which text is a journal entry.', 'Monday, 2 November. I woke up early today. I was excited because it was the first day of the term.', [['To the headteacher, I request a day off. Yours faithfully, Peter.', 'M_JRN_LETTER_FORM'], ['The term starts on Monday, 2 November.', 'M_JRN_FACTS_ONLY'], ['Peter woke up early and was excited.', 'M_JRN_THIRD_PERSON']], 'It has a date, uses I and tells how the writer felt.'),
  I('Which line could NOT be from a journal.', 'Yours faithfully, Amina Wanjiku.', [['Today I felt very tired after the long walk.', 'M_JRN_LETTER_FORM'], ['I met my cousin at the bus stop.', 'M_JRN_LETTER_FORM'], ['I hope tomorrow will be better.', 'M_JRN_LETTER_FORM']], 'Yours faithfully ends a formal letter, not a journal.'),
];
// ---------------------------------------------------------------- paragraphs
const PARAS = [
  { topic: 'Our school trip to Nakuru taught us many things.', d: ['First, we learnt how flamingos feed in the lake.', 'Next, the guide showed us how to count the birds.', 'Then we wrote down our findings in notebooks.'], end: 'So the trip was a day we will remember.', odd: 'My uncle sells shoes in Eldoret.', seq: true },
  { topic: 'The Saturday market in our town is full of life.', d: ['Traders arrive early and spread colourful cloth on the ground.', 'Mamas stack tomatoes and onions in neat heaps.', 'Children run between the stalls carrying bags for shoppers.'], end: 'By noon the whole town has passed through the market.', odd: 'The river near my school is dry in January.' },
  { topic: 'Growing beans is easy if you follow simple steps.', d: ['First, dig the soil and make small holes.', 'Next, drop two seeds in each hole and cover them.', 'Then water the seeds every morning.'], end: 'After a few weeks, green shoots push through the soil.', odd: 'Our teacher drives a blue car.', seq: true },
  { topic: 'Reading every day makes a learner stronger in English.', d: ['A learner who reads meets many new words.', 'She also sees how good sentences are built.', 'In time her own writing becomes clearer.'], end: 'So a little reading each day brings big rewards.', odd: 'Bananas grow well in warm places.' },
  { topic: 'Passengers can keep themselves safe on a matatu.', d: ['They should wear a seat belt as soon as they sit down.', 'They should ask the driver to slow down if he speeds.', 'They should get off only when the vehicle has stopped.'], end: 'A safe passenger helps the whole journey go well.', odd: 'The football match starts at four.' },
  { topic: 'Making tea the Kenyan way takes very little time.', d: ['First, boil water and milk together in a pan.', 'Next, add tea leaves and let them simmer.', 'Then pour the tea through a strainer into cups.'], end: 'Now the tea is ready to drink.', odd: 'The bus to Kisumu leaves at dawn.', seq: true },
  { topic: 'Washing hands properly stops germs from spreading.', d: ['First, wet your hands with clean water.', 'Next, rub soap on every part of your hands.', 'Then rinse and dry your hands well.'], end: 'Clean hands keep the whole family healthy.', odd: 'The new classroom has a green door.', seq: true },
  { topic: 'Collecting rainwater helps a family in many ways.', d: ['The water can be used for washing clothes.', 'It can water the vegetable garden in the dry months.', 'It saves money that would otherwise be spent on buying water.'], end: 'Rainwater is a gift that no family should waste.', odd: 'The headteacher wears glasses.' },
];
const showAll = (xs) => xs.map((t, i) => `${'ABCD'[i]} ${t}`).join(' ');
const topicGen = (cskill) => {
  const p = pick(PARAS), wrongs = [[p.d[0], 'M_PARA_DETAIL_OPENS'], [p.end, 'M_PARA_CONCLUSION'], [p.odd, 'M_PARA_OFF_TOPIC']];
  const options = mc(p.topic, wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]));
  if (!options) return null;
  return { question: `A learner is writing a paragraph that has these sentences: "${p.d.join(' ')}" Which sentence is the best topic sentence to begin it.`, options, instruction: 'Choose the best answer.',
    hints: ['The topic sentence tells what the whole paragraph is about.', 'The other sentences give details that come after it.'], steps: ['The topic sentence covers all the details that follow.', `The answer is "${p.topic}".`] };
};
const oddGen = (cskill) => {
  const p = pick(PARAS), set = shuffle([...p.d, p.odd]);
  const options = mc(p.odd, p.d.map(t => [t, feedbackOf(cskill, 'M_PARA_OFF_TOPIC'), 'M_PARA_OFF_TOPIC']));
  if (!options) return null;
  return { question: `A paragraph begins: "${p.topic}" Here are four more sentences. ${showAll(set)} Which sentence does not belong in this paragraph.`, options, instruction: 'Choose the best answer.',
    hints: ['Check each sentence: does it help the topic sentence?', 'A sentence that is about something else does not belong.'], steps: ['Every sentence in a paragraph must help the main idea.', `The answer is "${p.odd}".`] };
};
const orderGen = (cskill) => {
  const p = pick(PARAS.filter(x => x.seq)), ev = [p.topic, ...p.d];
  let show; do { show = shuffle([0, 1, 2, 3]); } while (show.every((v, i) => v === i));
  const letter = (idx) => 'ABCD'[show.indexOf(idx)];
  const seq = (arr) => arr.map(letter).join(', ');
  const right = seq([0, 1, 2, 3]), reversed = seq([3, 2, 1, 0]), i = randInt(1, 2), sw = [0, 1, 2, 3]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const F = feedbackOf(cskill, 'M_PARA_ORDER');
  const options = mc(right, [[reversed, F, 'M_PARA_ORDER'], [seq(sw), F, 'M_PARA_ORDER'], [seq([1, 0, 2, 3]), F, 'M_PARA_ORDER']]);
  if (!options) return null;
  return { question: `These four sentences make one paragraph, but they are mixed up. Which list shows the best order. ${showAll(show.map(idx => ev[idx]))}`, options, instruction: 'Choose the best answer.',
    hints: ['Find the sentence that opens the paragraph, then look for First, Next and Then.', 'The sentence that tells what the paragraph is about comes first.'], steps: [`The best order is: ${ev.join(' ')}`, `Written as letters this is ${right}.`] };
};
const endGen = (cskill) => {
  const p = pick(PARAS), wrongs = [[p.topic, 'M_PARA_DETAIL_OPENS'], [p.odd, 'M_PARA_OFF_TOPIC'], ['Next week we start a new project.', 'M_PARA_CONCLUSION']];
  const options = mc(p.end, wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]));
  if (!options) return null;
  return { question: `A paragraph has the topic sentence "${p.topic}" and these details: "${p.d.join(' ')}" Which sentence is the best ending for the paragraph.`, options, instruction: 'Choose the best answer.',
    hints: ['A closing sentence wraps up the paragraph.', 'A new topic does not belong at the end of this paragraph.'], steps: ['The last sentence sums up the paragraph without starting a new idea.', `The answer is "${p.end}".`] };
};

export const FAMILIES = [
  eng({ id: 'english6.abbr.short', kind: 'choose-short-form', cs: 'WRITIN.T3.ABBREVIATIONS', oc: 'a', form: 'word', rung: 1, gen: choose(ABB_SHORT, { stem: 'Choose.', hints: ['Think of the whole word first, then of how it is usually shortened.', 'E.g. means for example. Etc. means and so on.'] }) }),
  eng({ id: 'english6.abbr.full', kind: 'choose-full-form', cs: 'WRITIN.T3.ABBREVIATIONS', oc: 'd', form: 'word', rung: 2, gen: choose(ABB_FULL, { stem: 'Choose.', hints: ['Each letter is the first letter of a word in the name.', 'Try each answer: do its first letters spell the acronym?'] }) }),
  eng({ id: 'english6.abbr.kind', kind: 'choose-acronym', cs: 'WRITIN.T3.ABBREVIATIONS', oc: 'a', form: 'word', rung: 2, gen: choose(ABB_KIND, { stem: 'Choose.', hints: ['An acronym is read as one word, made from first letters.', 'An abbreviation is a short form of a longer word or phrase.'] }) }),
  eng({ id: 'english6.num.spell', kind: 'choose-spelling', cs: 'WRITIN.T3.NUMERALS', oc: 'a', form: 'word', rung: 1, gen: choose(NUM_SPELL, { stem: 'Choose.', hints: ['Say the number slowly and think of the root word.', 'Four keeps its u in fourteen, but forty drops it.'] }) }),
  eng({ id: 'english6.num.ordinal', kind: 'choose-ordinal', cs: 'WRITIN.T3.NUMERALS', oc: 'd', form: 'word', rung: 2, gen: choose(NUM_ORD, { stem: 'Choose.', hints: ['The endings are st, nd and rd for 1, 2 and 3, and th from 4.', 'Numbers ending in 1, 2 and 3 (but not 11, 12, 13) keep st, nd and rd.'] }) }),
  ...D('num', 'WRITIN.T3.NUMERALS', NUM_SENT, { topic: 'with numbers', hints: ['A sentence should not begin with a figure.', 'Check the spelling of the number words and the endings of the ordinals.'], oc: ['d', 'd'] }),
  ...D('comma', 'WRITIN.T7.COMMA_USE', COMMA, { topic: 'with commas', hints: ['A comma goes between list items and after an opening phrase, not between subject and verb.', 'A comma alone cannot join two sentences.'], oc: ['a', 'b'] }),
  ...D('quote', 'WRITIN.T7.QUOTATION_MARKS', QM, { topic: 'with direct speech', hints: ['The exact words spoken go inside double quotation marks, and the end mark goes inside them.', 'Reported speech has no quotation marks.'], oc: ['a', 'b'] }),
  ...D('hyphen', 'WRITIN.T9.HYPHENS', HYP, { topic: 'with hyphens', hints: ['Numbers from 21 to 99 and compound words before a noun take a hyphen.', 'Before a noun, the unit stays singular: a ten-year-old boy.'], oc: ['a', 'c'] }),
  ...P('synant', 'WRITIN.T11.SYNONYMS_ANTONYMS', SA, { topic: 'with synonyms and antonyms', hints: ['A synonym has the same meaning. An antonym has the opposite meaning.', 'Read the first part of the sentence to see which one is needed.'], oc: ['a', 'b', 'b'] }),
  ...P('affix', 'WRITIN.T13.AFFIXES', AFF, { stem: 'Choose the word part that completes the word.', topic: 'with prefixes and suffixes', hints: ['Say the whole word out loud with each choice.', 'Each word takes its own prefix or suffix. Keep every letter of both parts.'], oc: ['a', 'b', 'd'] }),
  ...P('spell', 'WRITIN.T13.SPELLING_RULES', SPELL, { stem: 'Choose the correct spelling.', topic: 'that are often spelt wrongly', hints: ['Say the word slowly, with every letter.', 'I before e, except after c.'], oc: ['c', 'c', 'c'] }),
  eng({ id: 'english6.form.entry', kind: 'choose-entry', cs: 'WRITIN.T1.FORM_FIELDS', oc: 'a', form: 'direct', rung: 1, gen: choose(FORM_ENTRY, { stem: 'Choose.', hints: ['Read the name of the box carefully and what it asks for.', 'A form asks for one piece of information in each box.'] }) }),
  eng({ id: 'english6.form.plan', kind: 'choose-field', cs: 'WRITIN.T1.FORM_FIELDS', oc: 'b', form: 'why', rung: 2, gen: choose(FORM_PLAN, { stem: 'Choose.', hints: ['Ask: what will the reader do with this answer?', 'A form should ask only for what its purpose needs.'] }) }),
  eng({ id: 'english6.letter.part', kind: 'choose-part', cs: 'WRITIN.T4.FORMAL_LETTER', oc: 'a', form: 'direct', rung: 1, gen: choose(LET_PARTS, { stem: 'Choose.', hints: ['Dear Sir or Madam ends with faithfully. A named person ends with sincerely.', 'The sender\'s address is at the top right.'] }) }),
  eng({ id: 'english6.letter.wording', kind: 'choose-wording', cs: 'WRITIN.T4.FORMAL_LETTER', oc: 'c', form: 'why', rung: 2, gen: choose(LET_WORDING, { stem: 'Choose.', hints: ['A formal letter is polite, plain and uses full forms.', 'No slang and no short forms like it\'ll.'] }) }),
  eng({ id: 'english6.journal.part', kind: 'choose-part', cs: 'WRITIN.T12.JOURNAL', oc: 'a', form: 'direct', rung: 1, gen: choose(JRN_PART, { stem: 'Choose.', hints: ['A journal is your own private record of the day.', 'It begins with the date and tells what happened and how you felt.'] }) }),
  eng({ id: 'english6.journal.entry', kind: 'choose-entry', cs: 'WRITIN.T12.JOURNAL', oc: 'c', form: 'why', rung: 2, gen: choose(JRN_ENTRY, { stem: 'Choose.', hints: ['A journal uses I and tells how the writer felt.', 'A letter has a greeting and a closing; a news report uses he and she.'] }) }),
  eng({ id: 'english6.para.topic', kind: 'choose-topic-sentence', cs: 'WRITIN.T2.PARAGRAPH_ORDER', oc: 'b', form: 'direct', rung: 1, gen: topicGen }),
  eng({ id: 'english6.para.odd', kind: 'choose-odd-one', cs: 'WRITIN.T2.PARAGRAPH_ORDER', oc: 'd', form: 'word', rung: 2, gen: oddGen }),
  eng({ id: 'english6.para.order', kind: 'order-sentences', cs: 'WRITIN.T2.PARAGRAPH_ORDER', oc: 'b', form: 'steps', rung: 3, gen: orderGen }),
  eng({ id: 'english6.para.end', kind: 'choose-ending', cs: 'WRITIN.T2.PARAGRAPH_ORDER', oc: 'b', form: 'direct', rung: 2, gen: endGen }),
];
