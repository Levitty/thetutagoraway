// ============================================================================
// ENGLISH GRADE 4, MECHANICS OF WRITING and THE PARTS OF A COMPOSITION (checked in text): DRAFT families.
// Written offline, no model call. Original sentences with Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g4.json). The composition itself (writing a letter, a narrative,
// a descriptive piece, a diary) is marked by HOREB's composition marker or a teacher: these families test what a
// typed answer can test, the knowledge of the parts. Off for children (reviewed:false) until a Kenyan English
// teacher signs them off. See docs/qa/english-g4-2026-11-12.md.
// ============================================================================
import { eng, choose, gap, spot, mc, feedbackOf, shuffle, pick, randInt, outcomeLetters } from './english_g4_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
const id = (k, s) => `english4.${k}.${s}`;
const L = (label, arr) => { arr.label = label; return arr; };
const trio = (key, cs, pool, { stem = WORD, hints, topic, thinOk = false }) => {
  const oc = outcomeLetters(cs, 3);
  return [
    eng({ id: id(key, 'choose'), cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
    eng({ id: id(key, 'gap'), cs, oc: oc[1], form: 'direct', rung: 2, thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints }) }),
    eng({ id: id(key, 'spot'), cs, oc: oc[2], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
  ];
};
const duo = (key, cs, pool, { stem = SENT, hints, topic, sentences = false, oc = outcomeLetters(cs, 2) }) => [
  eng({ id: id(key, sentences ? 'choose-sentence' : 'choose'), kind: sentences ? 'choose-sentence' : 'choose', cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
  eng({ id: id(key, 'spot'), cs, oc: oc[1], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
];

// ---------------------------------------------------------------- capital letters and full stops
const CAP = [
  ['', 'We went to the lake.', ['we went to the lake.', 'M_PUN_NO_CAPITAL_START'], ['We went to the lake', 'M_PUN_NO_FULL_STOP'], ['We Went To The Lake.', 'M_PUN_CAPITAL_MID'], 'A sentence starts with a capital letter and ends with a full stop.'],
  ['', 'My mother went to the market.', ['My Mother went to the Market.', 'M_PUN_CAPITAL_MID'], ['my mother went to the market.', 'M_PUN_NO_CAPITAL_START'], ['My mother went to the market', 'M_PUN_NO_FULL_STOP'], 'Mother and market are ordinary words, so they have small letters.'],
  ['', 'We live in Nairobi.', ['We live in nairobi.', 'M_PUN_NAME_LOWER'], ['We live in Nairobi', 'M_PUN_NO_FULL_STOP'], ['we live in Nairobi.', 'M_PUN_NO_CAPITAL_START'], 'The name of a place starts with a capital letter.'],
  ['', 'Today I played football.', ['Today i played football.', 'M_PUN_I_LOWER'], ['today I played football.', 'M_PUN_NO_CAPITAL_START'], ['Today I played football', 'M_PUN_NO_FULL_STOP'], 'The word I is always a capital letter.'],
  ['', 'Wanjiru is my friend.', ['wanjiru is my friend.', 'M_PUN_NAME_LOWER'], ['Wanjiru is my friend', 'M_PUN_NO_FULL_STOP'], ['Wanjiru Is My Friend.', 'M_PUN_CAPITAL_MID'], 'A name starts with a capital letter, and the sentence ends with a full stop.'],
  ['', 'On Monday we went to church.', ['On monday we went to church.', 'M_PUN_NAME_LOWER'], ['On Monday we went to church', 'M_PUN_NO_FULL_STOP'], ['On Monday we went to Church.', 'M_PUN_CAPITAL_MID'], 'The name of a day starts with a capital letter. Church is an ordinary word.'],
  ['', 'Juma and I ran home.', ['Juma and i ran home.', 'M_PUN_I_LOWER'], ['juma and I ran home.', 'M_PUN_NAME_LOWER'], ['Juma and I ran home', 'M_PUN_NO_FULL_STOP'], 'Names and the word I take capital letters.'],
  ['', 'The bus left at six.', ['the bus left at six.', 'M_PUN_NO_CAPITAL_START'], ['The Bus left at six.', 'M_PUN_CAPITAL_MID'], ['The bus left at six', 'M_PUN_NO_FULL_STOP'], 'Start with a capital, keep ordinary words small and end with a full stop.'],
];
const COM = [
  ['', 'Mama bought rice, beans and maize.', ['Mama bought rice beans and maize.', 'M_COM_NO_COMMA_LIST'], ['Mama bought rice, beans and maize,', 'M_COM_AFTER_LAST'], ['Mama bought rice. beans. and maize.', 'M_COM_FULL_STOP_LIST'], 'Put a comma between the items of a list, and and before the last.'],
  ['', 'We saw lions, zebras and giraffes.', ['We saw lions zebras and giraffes.', 'M_COM_NO_COMMA_LIST'], ['We saw lions, zebras and giraffes,', 'M_COM_AFTER_LAST'], ['We saw lions. zebras. and giraffes.', 'M_COM_FULL_STOP_LIST'], 'A comma goes between the items of a list.'],
  ['', 'Wafula kicked the ball.', ['Wafula, kicked the ball.', 'M_COM_SPLIT_SENTENCE'], ['Wafula kicked, the ball.', 'M_COM_SPLIT_SENTENCE'], ['Wafula kicked the ball,', 'M_COM_AFTER_LAST'], 'A comma does not come between who and what they did.'],
  ['', 'I like mangoes, oranges and bananas.', ['I like mangoes oranges and bananas.', 'M_COM_NO_COMMA_LIST'], ['I like mangoes, oranges and bananas,', 'M_COM_AFTER_LAST'], ['I like mangoes. oranges. and bananas.', 'M_COM_FULL_STOP_LIST'], 'A comma goes between the items of a list.'],
  ['', 'The teacher opened the door.', ['The teacher, opened the door.', 'M_COM_SPLIT_SENTENCE'], ['The teacher opened, the door.', 'M_COM_SPLIT_SENTENCE'], ['The teacher opened the door,', 'M_COM_AFTER_LAST'], 'A comma is not a breathing mark.'],
  ['', 'Bring a pen, a book and a ruler.', ['Bring a pen a book and a ruler.', 'M_COM_NO_COMMA_LIST'], ['Bring a pen, a book and a ruler,', 'M_COM_AFTER_LAST'], ['Bring a pen. a book. and a ruler.', 'M_COM_FULL_STOP_LIST'], 'Commas separate the things in a list.'],
  ['', 'Our farm has cows, goats and hens.', ['Our farm has cows goats and hens.', 'M_COM_NO_COMMA_LIST'], ['Our farm has cows. goats. and hens.', 'M_COM_FULL_STOP_LIST'], ['Our farm has cows, goats and hens,', 'M_COM_AFTER_LAST'], 'Commas separate the things in a list.'],
  ['', 'The children sang a song.', ['The children, sang a song.', 'M_COM_SPLIT_SENTENCE'], ['The children sang, a song.', 'M_COM_SPLIT_SENTENCE'], ['The children sang a song,', 'M_COM_AFTER_LAST'], 'No comma is needed in this short sentence.'],
];
const QMK = [
  ['', 'Where is the book?', ['Where is the book.', 'M_QMK_FULL_STOP'], ['Where is the book,', 'M_QMK_COMMA'], ['Where is the book', 'M_QMK_NO_MARK'], 'A question ends with a question mark.'],
  ['', 'I do not know where he lives.', ['I do not know where he lives?', 'M_QMK_STATEMENT'], ['I do not know where he lives', 'M_QMK_NO_MARK'], ['I do not know where he lives,', 'M_QMK_COMMA'], 'It tells something, so it ends with a full stop.'],
  ['', 'Are you hungry?', ['Are you hungry.', 'M_QMK_FULL_STOP'], ['Are you hungry,', 'M_QMK_COMMA'], ['Are you hungry', 'M_QMK_NO_MARK'], 'A question ends with a question mark.'],
  ['', 'Mama asked where I was.', ['Mama asked where I was?', 'M_QMK_STATEMENT'], ['Mama asked where I was', 'M_QMK_NO_MARK'], ['Mama asked where I was,', 'M_QMK_COMMA'], 'It tells what Mama did, so it ends with a full stop.'],
  ['', 'What is your name?', ['What is your name.', 'M_QMK_FULL_STOP'], ['What is your name', 'M_QMK_NO_MARK'], ['What is your name,', 'M_QMK_COMMA'], 'A question ends with a question mark.'],
  ['', 'Can you swim?', ['Can you swim.', 'M_QMK_FULL_STOP'], ['Can you swim', 'M_QMK_NO_MARK'], ['Can you swim,', 'M_QMK_COMMA'], 'A question ends with a question mark.'],
  ['', 'Wanjiru wants to know why you are late.', ['Wanjiru wants to know why you are late?', 'M_QMK_STATEMENT'], ['Wanjiru wants to know why you are late', 'M_QMK_NO_MARK'], ['Wanjiru wants to know why you are late,', 'M_QMK_COMMA'], 'It tells what Wanjiru wants, so it ends with a full stop.'],
  ['', 'How old are you?', ['How old are you.', 'M_QMK_FULL_STOP'], ['How old are you', 'M_QMK_NO_MARK'], ['How old are you,', 'M_QMK_COMMA'], 'A question ends with a question mark.'],
];
// ---------------------------------------------------------------- spelling
const MISSPELT = [
  ['Wanjiru is my best ___.', 'friend', ['freind', 'M_SPL_VOWEL_ORDER'], ['frend', 'M_SPL_DROPPED_LETTER'], ['frind', 'M_SPL_PHONETIC'], 'Friend has ie: fr-ie-nd.'],
  ['We stayed home ___ it rained.', 'because', ['becos', 'M_SPL_PHONETIC'], ['becuase', 'M_SPL_VOWEL_ORDER'], ['becaus', 'M_SPL_DROPPED_LETTER'], 'Because is spelt be-cau-se.'],
  ['We have a ___ at school.', 'library', ['libary', 'M_SPL_DROPPED_LETTER'], ['liberry', 'M_SPL_PHONETIC'], ['librery', 'M_SPL_PHONETIC'], 'Library is spelt li-brar-y.'],
  ['The flowers are very ___.', 'beautiful', ['beutiful', 'M_SPL_EXTRA_LETTER'], ['beatiful', 'M_SPL_DROPPED_LETTER'], ['beautifull', 'M_SPL_PHONETIC'], 'Beautiful begins with beau.'],
  ['I ___ you.', 'believe', ['beleive', 'M_SPL_VOWEL_ORDER'], ['belive', 'M_SPL_DROPPED_LETTER'], ['beleve', 'M_SPL_PHONETIC'], 'Believe has ie: bel-ie-ve.'],
  ['Our class visits the zoo on ___.', 'Wednesday', ['Wensday', 'M_SPL_DROPPED_LETTER'], ['Wednsday', 'M_SPL_DROPPED_LETTER'], ['Wendesday', 'M_SPL_PHONETIC'], 'Wednesday is spelt Wed-nes-day.'],
  ['I will see you ___.', 'tomorrow', ['tomorow', 'M_SPL_DROPPED_LETTER'], ['tommorrow', 'M_SPL_EXTRA_LETTER'], ['tomorrov', 'M_SPL_PHONETIC'], 'Tomorrow has one m and two r.'],
  ['The birthday gift was a nice ___.', 'surprise', ['suprise', 'M_SPL_DROPPED_LETTER'], ['surprize', 'M_SPL_PHONETIC'], ['serprise', 'M_SPL_PHONETIC'], 'Surprise has an r after the first su.'],
];
const DBL = [
  ['In ___ the days are hot.', 'summer', ['sumer', 'M_DBL_SINGLE'], ['summar', 'M_DBL_PHONETIC'], ['sumner', 'M_DBL_PHONETIC'], 'Summer has a double m.'],
  ['Mama drinks ___ every morning.', 'coffee', ['cofee', 'M_DBL_SINGLE'], ['coffe', 'M_DBL_SINGLE'], ['cofe', 'M_DBL_SINGLE'], 'Coffee has a double f and a double e.'],
  ['Please write your ___ on the form.', 'address', ['adress', 'M_DBL_SINGLE'], ['addres', 'M_DBL_SINGLE'], ['adres', 'M_DBL_PHONETIC'], 'Address has a double d and a double s.'],
  ['I wrote a ___ to my aunt.', 'letter', ['leter', 'M_DBL_SINGLE'], ['lettter', 'M_DBL_EXTRA'], ['lettar', 'M_DBL_PHONETIC'], 'Letter has a double t.'],
  ['The ___ ran into its hole.', 'rabbit', ['rabit', 'M_DBL_SINGLE'], ['rabbet', 'M_DBL_PHONETIC'], ['rabbitt', 'M_DBL_EXTRA'], 'Rabbit has a double b.'],
  ['Our school play was a great ___.', 'success', ['sucess', 'M_DBL_SINGLE'], ['succes', 'M_DBL_SINGLE'], ['sucses', 'M_DBL_PHONETIC'], 'Success has a double c and a double s.'],
  ['She is ___ because she won.', 'happy', ['hapy', 'M_DBL_SINGLE'], ['happey', 'M_DBL_PHONETIC'], ['happpy', 'M_DBL_EXTRA'], 'Happy has a double p.'],
  ['The little ___ drank milk.', 'kitten', ['kiten', 'M_DBL_SINGLE'], ['kitton', 'M_DBL_PHONETIC'], ['kittten', 'M_DBL_EXTRA'], 'Kitten has a double t.'],
  ['The water in the ___ was cold.', 'bottle', ['botle', 'M_DBL_SINGLE'], ['bottel', 'M_DBL_PHONETIC'], ['botttle', 'M_DBL_EXTRA'], 'Bottle has a double t.'],
];
// ---------------------------------------------------------------- forms and letters
const FORM = [
  L('Date of birth', ['A form asks for "Date of birth". What do you write.', '14th March 2016', ['9 years', 'M_FRM_AGE_FOR_DOB'], ['Nairobi', 'M_FRM_DETAIL_MIX'], ['Kamau', 'M_FRM_DETAIL_MIX'], 'Date of birth is the day, month and year you were born.']),
  L('Home address', ['A form asks for "Home address". What do you write.', 'P.O. Box 12, Kisumu', ['0712 345 678', 'M_FRM_CONTACT_FOR_ADDRESS'], ['14th March 2016', 'M_FRM_DETAIL_MIX'], ['Grade 4', 'M_FRM_DETAIL_MIX'], 'An address says where you live or get letters.']),
  L("Parent's phone number", ['A form asks for "Parent\'s phone number". What do you write.', '0712 345 678', ['P.O. Box 12, Kisumu', 'M_FRM_DETAIL_MIX'], ['Wanjiru Njeri', 'M_FRM_DETAIL_MIX'], ['Grade 4', 'M_FRM_DETAIL_MIX'], 'A phone number is a contact, not an address.']),
  L('Class', ['A school form asks for "Class". What do you write.', 'Grade 4', ['9 years', 'M_FRM_DETAIL_MIX'], ['0712 345 678', 'M_FRM_DETAIL_MIX'], ['Nairobi', 'M_FRM_DETAIL_MIX'], 'Class is the grade you are in.']),
  L('Full names', ['A form asks for "Full names". What do you write.', 'Wanjiru Kamau Njeri', ['Wanjiru', 'M_FRM_NAME_PART'], ['0712 345 678', 'M_FRM_DETAIL_MIX'], ['Grade 4', 'M_FRM_DETAIL_MIX'], 'Full names means all your names.']),
  L('Age', ['A form asks for "Age". What do you write.', '9 years', ['14th March 2016', 'M_FRM_DETAIL_MIX'], ['Kisumu', 'M_FRM_DETAIL_MIX'], ['Wanjiru', 'M_FRM_DETAIL_MIX'], 'Age is how old you are, as a number.']),
  L('Name of school', ['A form asks for "Name of school". What do you write.', 'Kabiru Primary School', ['Nyeri town', 'M_FRM_DETAIL_MIX'], ['Grade 4', 'M_FRM_DETAIL_MIX'], ['9 years', 'M_FRM_DETAIL_MIX'], 'The name of the school is the name of the place where you learn.']),
];
const LETTER = [
  L('The part that starts "Dear Amina,"', ['Which part of a friendly letter says "Dear Amina,".', 'the greeting', ['the closing', 'M_LTR_PART_MIX'], ['the body', 'M_LTR_PART_MIX'], ['the date', 'M_LTR_PART_MIX'], 'The greeting says Dear and the name of the person.']),
  L('The part that says "Yours lovingly,"', ['Which part of a friendly letter says "Yours lovingly,".', 'the closing', ['the greeting', 'M_LTR_PART_MIX'], ['the body', 'M_LTR_PART_MIX'], ['the date', 'M_LTR_PART_MIX'], 'The closing comes at the end.']),
  L('The part with the news', ['Which part of a friendly letter tells your news.', 'the body', ['the greeting', 'M_LTR_PART_MIX'], ['the closing', 'M_LTR_PART_MIX'], ['the address', 'M_LTR_PART_MIX'], 'The body holds what you want to say.']),
  L('What comes first', ['Which comes first in a friendly letter.', 'your address and the date', ['the closing', 'M_LTR_ORDER'], ['the body', 'M_LTR_ORDER'], ['your name', 'M_LTR_ORDER'], 'A friendly letter starts with your address and the date.']),
  L('Whose address is at the top', ['Whose address goes at the top of a friendly letter.', "the writer's", ['the person getting the letter', 'M_LTR_RECEIVER_ADDRESS'], ["the headteacher's", 'M_LTR_RECEIVER_ADDRESS'], ["the postman's", 'M_LTR_RECEIVER_ADDRESS'], 'Write your own address at the top.']),
  L('The greeting', ['Which greeting is written correctly.', 'Dear Amina,', ['Dear Amina', 'M_LTR_NO_COMMA'], ['Dear Amina.', 'M_LTR_NO_COMMA'], ['Dear, Amina', 'M_LTR_NO_COMMA'], 'A comma follows the greeting.']),
  L('The closing', ['Which closing is written correctly.', 'Yours lovingly,', ['Yours lovingly', 'M_LTR_NO_COMMA'], ['Yours lovingly.', 'M_LTR_NO_COMMA'], ['Yours, lovingly', 'M_LTR_NO_COMMA'], 'A comma follows the closing.']),
  L('Where the name goes', ['Where do you write your name in a friendly letter.', 'at the end, after the closing', ['before the greeting', 'M_LTR_ORDER'], ['in the middle of the body', 'M_LTR_ORDER'], ['above the date', 'M_LTR_ORDER'], 'Your name comes last, after the closing.']),
];
const LETTER_PARTS = ['Your address', 'The date', 'The greeting', 'The body', 'The closing', 'Your name'];
// A letter that has been cut into its parts and mixed up: choose the order.
const letterOrder = (cskill) => {
  const i = randInt(0, 1), parts = LETTER_PARTS.slice(i, i + 5);   // five parts, so each draw differs
  let show; do { show = shuffle(parts.map((t, k) => k)); } while (show.every((v, k) => v === k));
  const letter = (k) => 'ABCDE'[show.indexOf(k)];
  const seq = (arr) => arr.map(letter).join(', ');
  const base = [0, 1, 2, 3, 4], right = seq(base), rev = seq([...base].reverse());
  const sw = [...base], j = randInt(0, 3); [sw[j], sw[j + 1]] = [sw[j + 1], sw[j]];
  const rot = seq([4, 0, 1, 2, 3]);
  const f = feedbackOf(cskill, 'M_LTR_ORDER');
  const options = mc(right, [[rev, f, 'M_LTR_ORDER'], [seq(sw), f, 'M_LTR_ORDER'], [rot, f, 'M_LTR_ORDER']]);
  if (!options) return null;
  const list = show.map((k, n) => `${'ABCDE'[n]} ${parts[k]}`).join('. ');
  return { question: `These parts of a friendly letter are mixed up. Which list puts them in the right order. ${list}.`, options, instruction: 'Choose the best answer.', hints: ['A friendly letter starts at the top with the writer and the date.', 'The greeting comes before the news. The closing and the name come last.'], steps: [`The order is: ${parts.map((t, n) => `${n + 1}. ${t}`).join('. ')}.`, `Written as letters this is ${right}.`] };
};
// ---------------------------------------------------------------- parts of a composition
const NARR = [
  L('Where and when it happens', ['Which part of a narrative tells where and when the story happens.', 'the setting', ['the characters', 'M_NAR_SETTING_CHARACTER'], ['the ending', 'M_NAR_PART_MIX'], ['the title', 'M_NAR_TITLE'], 'The setting is where and when the story happens.']),
  L('The people or animals', ['Which part of a narrative names the people or animals in the story.', 'the characters', ['the setting', 'M_NAR_SETTING_CHARACTER'], ['the title', 'M_NAR_TITLE'], ['the ending', 'M_NAR_PART_MIX'], 'The characters are the people or animals in the story.']),
  L('How the story finishes', ['Which part of a narrative tells how the story finishes.', 'the end', ['the beginning', 'M_NAR_PART_MIX'], ['the middle', 'M_NAR_PART_MIX'], ['the title', 'M_NAR_TITLE'], 'The end tells how the story finishes.']),
  L('The introduction', ['Which part of a narrative introduces the characters and the place.', 'the beginning', ['the end', 'M_NAR_PART_MIX'], ['the middle', 'M_NAR_PART_MIX'], ['the title', 'M_NAR_TITLE'], 'The beginning introduces the characters and the place.']),
  L('Where the problem starts', ['Where does the problem of a story usually start.', 'in the middle', ['at the end', 'M_NAR_PROBLEM_END'], ['in the title', 'M_NAR_PROBLEM_END'], ['after the story', 'M_NAR_PROBLEM_END'], 'The problem usually starts in the middle. The end shows how it was solved.']),
  L('What a title does', ['What does the title of a narrative do.', 'gives a short name to the story', ['tells the whole story', 'M_NAR_TITLE'], ['tells how it ends', 'M_NAR_TITLE'], ['names every character', 'M_NAR_TITLE'], 'A title is a short name that hints at the story.']),
  L('What happens as people try', ['Which part of a narrative tells what happens as the people try to solve the problem.', 'the middle', ['the beginning', 'M_NAR_PART_MIX'], ['the end', 'M_NAR_PART_MIX'], ['the title', 'M_NAR_TITLE'], 'The middle tells what happens as the problem grows and people try to solve it.']),
];
const DESC = [
  L('A description of a market', ['Which sentence is part of a description of a market.', 'The market is noisy and smells of fresh fruit.', ['Yesterday I went to the market and bought a hat.', 'M_DES_TELLS_STORY'], ['First I paid and then I went home.', 'M_DES_TELLS_STORY'], 'A description tells what a place is like, not what happened.']),
  L('A description of a river', ['Which sentence is part of a description of a river.', 'The river is wide and its water is cool and brown.', ['Last week we swam and then we ate lunch.', 'M_DES_TELLS_STORY'], ['After that I went to the shop.', 'M_DES_TELLS_STORY'], 'A description tells what the river is like.']),
  L('A sentence about smell', ['Which sentence uses the sense of smell.', 'The kitchen smells of fresh bread.', ['The kitchen is big and clean.', 'M_DES_ONE_SENSE'], ['The kitchen has two doors.', 'M_DES_ONE_SENSE'], 'Smells of fresh bread uses the sense of smell.']),
  L('A sentence about sound', ['Which sentence uses the sense of sound.', 'The drums beat loudly in the hall.', ['The hall is wide and tall.', 'M_DES_ONE_SENSE'], ['The hall has a red floor.', 'M_DES_ONE_SENSE'], 'Beat loudly uses the sense of hearing.']),
  L('A sentence about touch', ['Which sentence uses the sense of touch.', 'The cloth is soft and warm.', ['The cloth is blue.', 'M_DES_ONE_SENSE'], ['The cloth is on the table.', 'M_DES_ONE_SENSE'], 'Soft and warm use the sense of touch.']),
  L('The introduction', ['Which part of a description names what you will describe.', 'the introduction', ['the conclusion', 'M_DES_PART_MIX'], ['the middle', 'M_DES_PART_MIX'], 'The introduction names the thing you will describe.']),
  L('The conclusion', ['Which part of a description ends with a last thought or feeling about it.', 'the conclusion', ['the introduction', 'M_DES_PART_MIX'], ['the beginning', 'M_DES_PART_MIX'], 'The conclusion ends with a last thought or feeling.']),
];
const DIARY = [
  L('How a diary entry starts', ['What does a diary entry start with.', 'the date', ['a title', 'M_DIA_NO_DATE'], ['the name of the teacher', 'M_DIA_NO_DATE'], 'A diary entry begins with the date.']),
  L('A diary beginning', ['Which is the best start of a diary entry.', 'Monday, 4th March. Dear Diary,', ['Dear Mum, how are you?', 'M_DIA_LETTER_FORMAT'], ['To the headteacher,', 'M_DIA_LETTER_FORMAT'], 'A diary starts with the date and Dear Diary.']),
  L('The voice of a diary', ['Which sentence is in the right voice for a diary.', 'I woke up early and fed the hens.', ['Wanjiru woke up early and fed the hens.', 'M_DIA_THIRD_PERSON'], ['You woke up early and fed the hens.', 'M_DIA_THIRD_PERSON'], 'A diary is about you, so write I.']),
  L('What else a diary has', ['What else does a diary entry have besides what happened.', 'how the writer felt', ['a list of names', 'M_DIA_NO_FEELINGS'], ['the price of things', 'M_DIA_NO_FEELINGS'], 'A diary also tells how you felt.']),
  L('A feeling in a diary', ['Which sentence shows a feeling in a diary.', 'I was very happy when we won.', ['We played at four o\'clock.', 'M_DIA_NO_FEELINGS'], ['The match was on the field.', 'M_DIA_NO_FEELINGS'], 'Happy shows how the writer felt.']),
  L('Who a diary is for', ['Who is a diary written for.', 'the writer', ['the headteacher', 'M_DIA_LETTER_FORMAT'], ['a friend far away', 'M_DIA_LETTER_FORMAT'], 'A diary is written to yourself.']),
];
// ---------------------------------------------------------------- paragraphs and pictures (events in order)
const PARAS = [
  ['Wanjiru makes tea for her family every morning.', 'First she boils the water.', 'Then she adds the tea leaves and milk.', 'Finally she pours the tea into cups.'],
  ['Our school garden grows many vegetables.', 'We plant seeds in neat rows.', 'We water them every day after class.', 'After two months we pick sukuma wiki for lunch.'],
  ['Washing hands properly takes three steps.', 'First wet your hands with clean water.', 'Next rub them with soap for twenty seconds.', 'Last rinse and dry them with a clean cloth.'],
  ['Baraka had a busy Saturday.', 'In the morning he fed the goats.', 'In the afternoon he played football with friends.', 'In the evening he did his homework.'],
  ['The market in our town is busy on Fridays.', 'Early in the morning the traders arrive with fruit.', 'By ten o\'clock the buyers fill every path.', 'In the evening the traders pack their goods and go home.'],
  ['It is easy to make a paper boat.', 'First fold a sheet of paper in half.', 'Then fold the two top corners to the middle.', 'At last fold up the edges and open the boat.'],
];
const PICS = [
  ['Wafula picks a mango from the tree.', 'He washes the mango at the tap.', 'He cuts the mango with a knife.', 'He eats the sweet mango.'],
  ['Amina plants a seed in a pot.', 'She waters the seed every day.', 'A small green plant grows.', 'The plant gives a red flower.'],
  ['Baraka wakes up as the sun rises.', 'He brushes his teeth.', 'He eats breakfast and packs his bag.', 'He walks to school.'],
  ['Dark clouds gather over the hills.', 'Heavy rain starts to fall.', 'The river fills and the water runs fast.', 'The sun comes out and a rainbow shows.'],
  ['A girl sees a cup on the table.', 'The cat jumps on the table.', 'The cup falls and breaks.', 'The girl sweeps up the pieces.'],
  ['A farmer digs the shamba.', 'He plants maize seeds.', 'The maize grows tall.', 'He harvests the maize.'],
];
// Four events in a mixed order: the child picks the list of letters that puts them in order.
const orderGen = (what, code, source, hintLine, word) => (cskill) => {
  const ev = pick(source);
  let show; do { show = shuffle(ev.map((t, i) => i)); } while (show.every((v, i) => v === i));
  const letter = (idx) => 'ABCD'[show.indexOf(idx)];
  const seq = (arr) => arr.map(letter).join(', ');
  const base = [0, 1, 2, 3], right = seq(base), reversed = seq([...base].reverse());
  const i = randInt(0, 2), sw = [...base]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const codeSwap = code.replace('REVERSED', 'SWAPPED');
  const f = (c) => feedbackOf(cskill, c);
  const options = mc(right, [[reversed, f(code), code], [seq(sw), f(codeSwap), codeSwap], [seq([3, 0, 1, 2]), f(code), code]]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { question: `${what} ${list}`, options, instruction: 'Choose the best answer.', hints: [hintLine, 'Ask what has to happen first for the next one to make sense.'], steps: [`The order is: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Written as letters this is ${right}.`] };
};
// The topic sentence of a paragraph.
const topicGen = (cskill) => {
  const p = pick(PARAS), show = shuffle(p.map((t, i) => i));
  const options = mc(p[0], p.slice(1).map(t => [t, feedbackOf(cskill, 'M_PAR_TOPIC_DETAIL'), 'M_PAR_TOPIC_DETAIL']));
  if (!options) return null;
  return { passage: { title: 'A paragraph', text: show.map(i => p[i]).join(' ') }, question: 'Which sentence is the topic sentence of the paragraph. It tells what the whole paragraph is about.', options, instruction: 'Read the paragraph. Then choose the best answer.', hints: ['The topic sentence names what the whole paragraph is about.', 'The other sentences give details, steps or times.'], steps: ['The topic sentence covers all the others.', `The topic sentence is "${p[0]}"`] };
};
const PICSENT = [
  ['Picture: a boy is picking a mango from a tree. Tell it as a story that already happened. Which sentence tells the picture best.', 'The boy picked a mango from the tree.', ['The boy picks a mango from the tree.', 'M_PIC_TENSE'], ['The boy sold a mango at the market.', 'M_PIC_MISMATCH'], ['The boy ate a mango under the tree.', 'M_PIC_MISMATCH'], 'The story is told after the event, so we use the past tense.'],
  ['Picture: a girl is watering a small plant. Tell it as a story that already happened. Which sentence tells the picture best.', 'The girl watered the small plant.', ['The girl waters the small plant.', 'M_PIC_TENSE'], ['The girl planted a big tree.', 'M_PIC_MISMATCH'], ['The girl picked a red flower.', 'M_PIC_MISMATCH'], 'The picture shows watering, told in the past tense.'],
  ['Picture: two children are walking to school with bags. Tell it as a story that already happened. Which sentence tells the picture best.', 'The children walked to school with their bags.', ['The children walk to school with their bags.', 'M_PIC_TENSE'], ['The children rode a bus to the market.', 'M_PIC_MISMATCH'], ['The children played football at home.', 'M_PIC_MISMATCH'], 'The picture shows a walk to school, told in the past tense.'],
  ['Picture: a cat is knocking a cup off a table. Tell it as a story that already happened. Which sentence tells the picture best.', 'The cat knocked the cup off the table.', ['The cat knocks the cup off the table.', 'M_PIC_TENSE'], ['The cat drank milk from the cup.', 'M_PIC_MISMATCH'], ['The cat slept on the table.', 'M_PIC_MISMATCH'], 'The picture shows the cup being knocked off, told in the past tense.'],
  ['Picture: dark clouds are over the hills and rain is falling. Tell it as a story that already happened. Which sentence tells the picture best.', 'Dark clouds gathered and the rain fell.', ['Dark clouds gather and the rain falls.', 'M_PIC_TENSE'], ['The sun shone over the hills.', 'M_PIC_MISMATCH'], ['The farmer went to the market.', 'M_PIC_MISMATCH'], 'The picture shows clouds and rain, told in the past tense.'],
  ['Picture: a farmer is cutting ripe maize in a shamba. Tell it as a story that already happened. Which sentence tells the picture best.', 'The farmer harvested the ripe maize.', ['The farmer harvests the ripe maize.', 'M_PIC_TENSE'], ['The farmer planted the maize seeds.', 'M_PIC_MISMATCH'], ['The farmer sold the cows.', 'M_PIC_MISMATCH'], 'The picture shows a harvest, told in the past tense.'],
];

export const FAMILIES = [
  ...duo('cap', 'WRITIN.T7.CAPITALS_FULL_STOPS', CAP, { sentences: true, topic: 'with capital letters and full stops', hints: ['Look at the first letter of the sentence, the names and the word I.', 'Only the first word, names and I take a capital. A sentence that tells something ends with a full stop.'] }),
  ...duo('comma', 'WRITIN.T9.COMMAS', COM, { sentences: true, topic: 'with commas', hints: ['Look for a list: commas go between the items.', 'A comma is not a breath mark: never split who from what they did.'] }),
  ...duo('qmark', 'WRITIN.T9.QUESTION_MARKS', QMK, { sentences: true, topic: 'with question marks and full stops', hints: ['Is the sentence asking something? Then a question mark.', 'A sentence that tells something ends with a full stop, even if it has a word like where in it.'] }),
  ...trio('spell', 'WRITIN.T11.MISSPELT_WORDS', MISSPELT, { stem: 'Choose the correct spelling to complete the sentence.', topic: 'with words that are often spelt wrongly', hints: ['Say the word slowly in parts and picture the whole word.', 'Learn the tricky part: ie, the middle letters, the double letters.'] }),
  ...trio('dbl', 'WRITIN.T13.DOUBLE_CONSONANTS', DBL, { stem: 'Choose the correct spelling to complete the sentence.', topic: 'with words that have double letters', hints: ['Say the word slowly in parts and listen for a sound that needs two letters.', 'Think of other words you know that have double letters.'] }),
  ...duo('form', 'WRITIN.T1.FORM_INFORMATION', FORM, { stem: '', topic: 'about what to write in a form', hints: ['Read the name of the box first.', 'Write only what the box asks for.'] }),
  ...duo('letter', 'WRITIN.T4.LETTER_PARTS', LETTER, { stem: '', topic: 'about the parts of a friendly letter', hints: ['The greeting comes first, the closing last.', 'A comma follows the greeting and the closing.'] }),
  eng({ id: id('letter', 'order'), kind: 'choose-order', cs: 'WRITIN.T4.LETTER_PARTS', oc: 'a', form: 'steps', rung: 2, gen: letterOrder }),
  ...duo('narr', 'WRITIN.T5.NARRATIVE_PARTS', NARR, { stem: '', topic: 'about the parts of a narrative', hints: ['A narrative has a title, a beginning, a middle and an end.', 'The beginning names the people and place, the middle holds the problem and the end solves it.'] }),
  eng({ id: id('para', 'order'), kind: 'choose-order', cs: 'WRITIN.T5.PARAGRAPH_ORDER', oc: 'b', form: 'steps', rung: 2, gen: orderGen('These four sentences are mixed up. Which list puts them in the right order for a paragraph.', 'M_PAR_ORDER_REVERSED', PARAS, 'Start with the sentence that names the topic.', 'sentences') }),
  eng({ id: id('para', 'topic'), kind: 'choose-topic', cs: 'WRITIN.T5.PARAGRAPH_ORDER', oc: 'b', form: 'word', rung: 2, gen: topicGen }),
  ...duo('desc', 'WRITIN.T10.DESCRIPTIVE_PARTS', DESC, { stem: '', topic: 'about describing a place or a thing', hints: ['A description tells what something looks, sounds, smells, feels or tastes like.', 'A story tells what happened. A description tells what it is like.'] }),
  ...duo('diary', 'WRITIN.T12.DIARY_PARTS', DIARY, { stem: '', topic: 'about a diary entry', hints: ['A diary starts with the date and is written to yourself.', 'Write I, and say how you felt.'] }),
  eng({ id: id('pic', 'order'), kind: 'choose-order', cs: 'WRITIN.T6.PICTURE_SEQUENCE', oc: 'a', form: 'steps', rung: 2, gen: orderGen('Four pictures are told in words and mixed up. Which list shows the order that makes a story.', 'M_PIC_ORDER_REVERSED', PICS, 'Find the picture that starts the story.', 'pictures') }),
  eng({ id: id('pic', 'sentence'), kind: 'choose-sentence', cs: 'WRITIN.T6.PICTURE_SEQUENCE', oc: 'a', form: 'direct', rung: 2, gen: choose(PICSENT, { stem: '', hints: ['Look at what the people are doing in the picture.', 'A story told after the event uses the past tense.'] }) }),
];
