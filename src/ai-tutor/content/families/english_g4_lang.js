// ============================================================================
// ENGLISH GRADE 4, LANGUAGE USE (words and sentences, checked in text): DRAFT families.
// Written offline, no model call. Original sentences with Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g4.json). Off for children (reviewed:false) until a Kenyan
// English teacher signs them off. See docs/qa/english-g4-2026-11-12.md.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './english_g4_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const WORDS = 'Choose the words that complete the sentence correctly.';
const SENT = 'Which sentence is correct.';
const id = (k, s) => `english4.${k}.${s}`;
const L = (label, arr) => { arr.label = label; return arr; };
// Three families from one pool of gap items: choose, type the gap, find the mistake in a child's four sentences.
const trio = (key, cs, pool, { stem = WORD, hints, topic, thinOk = false, rungs = [1, 2, 3] }) => {
  const oc = outcomeLetters(cs, 3);
  return [
    eng({ id: id(key, 'choose'), cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
    eng({ id: id(key, 'gap'), cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints }) }),
    eng({ id: id(key, 'spot'), cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
  ];
};
// Whole-sentence pools: choose and find the mistake.
const duo = (key, cs, pool, { stem = SENT, hints, topic, sentences = false }) => {
  const oc = outcomeLetters(cs, 2);
  return [
    eng({ id: id(key, sentences ? 'choose-sentence' : 'choose'), kind: sentences ? 'choose-sentence' : 'choose', cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
    eng({ id: id(key, 'spot'), cs, oc: oc[1], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
  ];
};
const sentenceChoose = (key, cs, pool, { stem = SENT, hints, rung = 2 }) => eng({ id: id(key, 'sentence'), kind: 'choose-sentence', cs, oc: outcomeLetters(cs, 2)[1], form: 'direct', rung, gen: choose(pool, { stem, hints }) });

// ---------------------------------------------------------------- articles
const ART = [
  ['Mama gave me ___ apple. It was sweet.', 'an', ['a', 'M_ART_A_BEFORE_VOWEL'], ['the', 'M_ART_THE_FIRST_MENTION'], 'Apple starts with a vowel sound and has not been mentioned before: an apple.'],
  ['Kamau bought ___ book. The book was about lions.', 'a', ['an', 'M_ART_AN_BEFORE_CONSONANT'], ['the', 'M_ART_THE_FIRST_MENTION'], 'Book starts with a consonant sound and is mentioned for the first time: a book.'],
  ['There is only one sun. We feel the heat of ___ sun.', 'the', ['a', 'M_ART_A_FOR_KNOWN'], ['an', 'M_ART_AN_BEFORE_CONSONANT'], 'There is only one sun, so we use the.'],
  ['We waited for ___ hour at the clinic.', 'an', ['a', 'M_ART_SOUND_NOT_LETTER'], ['the', 'M_ART_THE_FIRST_MENTION'], 'Hour starts with the vowel sound "ow" because the h is silent: an hour.'],
  ['Every pupil at our school wears ___ uniform.', 'a', ['an', 'M_ART_SOUND_NOT_LETTER'], ['the', 'M_ART_THE_FIRST_MENTION'], 'Uniform starts with the consonant sound "yoo": a uniform.'],
  ['Please close ___ door. It is open.', 'the', ['a', 'M_ART_A_FOR_KNOWN'], ['an', 'M_ART_AN_BEFORE_CONSONANT'], 'Both people know which door, so we use the.'],
  ['Njeri wants to be ___ engineer.', 'an', ['a', 'M_ART_A_BEFORE_VOWEL'], ['the', 'M_ART_THE_FIRST_MENTION'], 'Engineer starts with a vowel sound: an engineer.'],
  ['Is there ___ egg in the basket?', 'an', ['a', 'M_ART_A_BEFORE_VOWEL'], ['the', 'M_ART_THE_FIRST_MENTION'], 'Egg starts with a vowel sound, and it is a new thing: an egg.'],
];
const ART_SENT = [
  ['', 'Kamau has a new bicycle.', ['Kamau has new bicycle.', 'M_ART_OMITTED'], ['Kamau has an new bicycle.', 'M_ART_AN_BEFORE_CONSONANT'], 'A singular thing you can count needs a, an or the before it: a new bicycle.'],
  ['', 'Lions are strong animals.', ['The lions are strong animals.', 'M_ART_THE_GENERAL'], ['A lions are strong animals.', 'M_ART_THE_GENERAL'], 'Speaking about lions in general needs no article.'],
  ['', 'My mother is a nurse.', ['My mother is nurse.', 'M_ART_OMITTED'], ['My mother is an nurse.', 'M_ART_AN_BEFORE_CONSONANT'], 'A job needs a or an: a nurse.'],
  ['', 'Wanjiru ate an egg and a banana.', ['Wanjiru ate egg and banana.', 'M_ART_OMITTED'], ['Wanjiru ate a egg and an banana.', 'M_ART_A_BEFORE_VOWEL'], 'Egg needs an and banana needs a.'],
  ['', 'Children need food and water.', ['The children need the food and the water.', 'M_ART_THE_GENERAL'], ['Children need food and the water.', 'M_ART_THE_GENERAL'], 'Things in general need no article.'],
  ['', 'I saw a hippo at the lake.', ['I saw hippo at the lake.', 'M_ART_OMITTED'], ['I saw an hippo at the lake.', 'M_ART_AN_BEFORE_CONSONANT'], 'Hippo starts with the consonant sound h: a hippo.'],
];
// ---------------------------------------------------------------- plurals
const PLR = [
  ['Wafula carried two ___ of books. (box)', 'boxes', ['boxs', 'M_PLR_NO_ES'], ['box', 'M_PLR_SINGULAR_AFTER_NUMBER'], 'After x we add -es: boxes. Two means more than one.'],
  ['We sing in two ___ every Sunday. (church)', 'churches', ['churchs', 'M_PLR_NO_ES'], ['church', 'M_PLR_SINGULAR_AFTER_NUMBER'], 'After ch we add -es: churches.'],
  ['The ___ are crying. (baby)', 'babies', ['babys', 'M_PLR_Y_TO_S'], ['babyes', 'M_PLR_Y_TO_S'], 'Consonant + y: change y to i and add -es: babies.'],
  ['We saw two ___ at the park. (monkey)', 'monkeys', ['monkies', 'M_PLR_VOWEL_Y_IES'], ['monkey', 'M_PLR_SINGULAR_AFTER_NUMBER'], 'A vowel comes before the y, so just add -s: monkeys.'],
  ['Mama cut the cake with two ___. (knife)', 'knives', ['knifes', 'M_PLR_F_NO_VES'], ['knife', 'M_PLR_SINGULAR_AFTER_NUMBER'], 'Knife changes to knives in the plural.'],
  ['The wind blew the ___ off the tree. (leaf)', 'leaves', ['leafs', 'M_PLR_F_NO_VES'], ['leafes', 'M_PLR_F_NO_VES'], 'Leaf changes to leaves in the plural.'],
  ['Mama washed all the ___ after supper. (dish)', 'dishes', ['dishs', 'M_PLR_NO_ES'], ['dish', 'M_PLR_SINGULAR_AFTER_NUMBER'], 'After sh we add -es: dishes.'],
  ['Kenya has many big ___. (city)', 'cities', ['citys', 'M_PLR_Y_TO_S'], ['citis', 'M_PLR_Y_TO_S'], 'Consonant + y: change y to i and add -es: cities.'],
];
const PLI = [
  ['Three ___ are playing outside. (child)', 'children', ['childs', 'M_PLI_ADD_S'], ['childrens', 'M_PLI_DOUBLE_PLURAL'], 'The plural of child is children. It is already plural.'],
  ['Two ___ are digging in the shamba. (man)', 'men', ['mans', 'M_PLI_ADD_S'], ['mens', 'M_PLI_DOUBLE_PLURAL'], 'The plural of man is men.'],
  ['The ___ are selling fruit at the stall. (woman)', 'women', ['womans', 'M_PLI_ADD_S'], ['womens', 'M_PLI_DOUBLE_PLURAL'], 'The plural of woman is women.'],
  ['Two ___ swam on the pond. (goose)', 'geese', ['gooses', 'M_PLI_FOOT_TOOTH'], ['geeses', 'M_PLI_DOUBLE_PLURAL'], 'The plural of goose is geese.'],
  ['The baby already has four ___. (tooth)', 'teeth', ['tooths', 'M_PLI_FOOT_TOOTH'], ['teeths', 'M_PLI_DOUBLE_PLURAL'], 'The plural of tooth is teeth.'],
  ['Three ___ ran across the kitchen floor. (mouse)', 'mice', ['mouses', 'M_PLI_FOOT_TOOTH'], ['mices', 'M_PLI_DOUBLE_PLURAL'], 'The plural of mouse is mice.'],
  ['Ten ___ are grazing on the hill. (sheep)', 'sheep', ['sheeps', 'M_PLI_SAME_FORM_S'], ['sheepes', 'M_PLI_SAME_FORM_S'], 'Sheep stays the same in the plural.'],
  ['Many ___ came to the market today. (person)', 'people', ['peoples', 'M_PLI_DOUBLE_PLURAL'], ['persones', 'M_PLI_ADD_S'], 'The plural of person is people. It is already plural.'],
];
// ---------------------------------------------------------------- polite pattern
const POLITE = [
  ['', 'May I come in, please?', ['May I to come in, please?', 'M_PAT_VERB_FORM'], ['May I coming in, please?', 'M_PAT_VERB_FORM'], ['May come I in, please?', 'M_PAT_ORDER'], 'After May I the verb stays plain: May I come in?'],
  ['', 'Could you help me carry this box?', ['Could you to help me carry this box?', 'M_PAT_VERB_FORM'], ['Could you helps me carry this box?', 'M_PAT_VERB_FORM'], ['Could help you me carry this box?', 'M_PAT_ORDER'], 'After Could you the verb stays plain: Could you help me?'],
  ['', 'Would you like some tea?', ['Would you likes some tea?', 'M_PAT_WOULD_LIKE_FORM'], ['You would like some tea?', 'M_PAT_ORDER'], ['Would like you some tea?', 'M_PAT_ORDER'], 'An offer starts with Would you like.'],
  ['', 'Could you please close the window?', ['Close the window.', 'M_PAT_NO_PLEASE'], ['Could you please to close the window?', 'M_PAT_VERB_FORM'], ['Could closing you the window please?', 'M_PAT_ORDER'], 'A polite request uses Could you and please.'],
  ['', 'May I borrow your pencil, please?', ['Give me your pencil.', 'M_PAT_NO_PLEASE'], ['May I borrowing your pencil, please?', 'M_PAT_VERB_FORM'], ['Borrow I may your pencil, please?', 'M_PAT_ORDER'], 'May I and the plain verb make a polite request.'],
  ['', 'Would you like to sit down?', ['Would you like sit down?', 'M_PAT_WOULD_LIKE_FORM'], ['Would you like sitting down?', 'M_PAT_WOULD_LIKE_FORM'], ['Sit down.', 'M_PAT_NO_PLEASE'], 'After Would you like we say to + the plain verb: to sit down.'],
  ['', 'May I ask a question, please?', ['May I asks a question, please?', 'M_PAT_VERB_FORM'], ['I want to ask a question.', 'M_PAT_NO_PLEASE'], ['May ask I a question, please?', 'M_PAT_ORDER'], 'May I plus the plain verb asks politely.'],
  ['', 'Could you tell me the time, please?', ['Tell me the time.', 'M_PAT_NO_PLEASE'], ['Could you to tell me the time, please?', 'M_PAT_VERB_FORM'], ['Could tell you me the time, please?', 'M_PAT_ORDER'], 'A request uses Could you and the plain verb.'],
];
// ---------------------------------------------------------------- pronouns
const PRO = [
  ['Mum gave the book to ___.', 'me', ['I', 'M_PRO_SUBJECT_AS_OBJECT'], ['we', 'M_PRO_SUBJECT_AS_OBJECT'], 'After a small word like to, use the object form: me.'],
  ['Wanjiru and ___ went to the market.', 'I', ['me', 'M_PRO_OBJECT_AS_SUBJECT'], ['us', 'M_PRO_OBJECT_AS_SUBJECT'], 'Before the verb, use the subject form: Wanjiru and I went.'],
  ['The teacher thanked ___ for the gift. (the children)', 'them', ['they', 'M_PRO_SUBJECT_AS_OBJECT'], ['we', 'M_PRO_SUBJECT_AS_OBJECT'], 'After the verb, use the object form: them.'],
  ['Juma is a boy. ___ is nine years old.', 'He', ['She', 'M_PRO_GENDER'], ['Him', 'M_PRO_OBJECT_AS_SUBJECT'], 'A boy is he.'],
  ['Akinyi is my sister. ___ is eleven.', 'She', ['He', 'M_PRO_GENDER'], ['Her', 'M_PRO_OBJECT_AS_SUBJECT'], 'A girl is she.'],
  ['Amina said, "Please help ___."', 'me', ['I', 'M_PRO_SUBJECT_AS_OBJECT'], ['we', 'M_PRO_SUBJECT_AS_OBJECT'], 'After the verb help, use the object form: me.'],
  ['Mrs Otieno is kind. We like ___ very much.', 'her', ['she', 'M_PRO_SUBJECT_AS_OBJECT'], ['he', 'M_PRO_GENDER'], 'After the verb like, use the object form: her.'],
  ['Baraka and Otieno are my cousins. ___ live in Kisumu.', 'They', ['Them', 'M_PRO_OBJECT_AS_SUBJECT'], ['Us', 'M_PRO_OBJECT_AS_SUBJECT'], 'Before the verb, use the subject form: they.'],
];
const PRO_SENT = [
  ['', 'Wanjiru is tall.', ['Wanjiru she is tall.', 'M_PRO_NOUN_AND_PRONOUN'], ['Wanjiru her is tall.', 'M_PRO_OBJECT_AS_SUBJECT'], 'Say the name or the pronoun, not both.'],
  ['', 'My brother plays football.', ['My brother he plays football.', 'M_PRO_NOUN_AND_PRONOUN'], ['My brother him plays football.', 'M_PRO_OBJECT_AS_SUBJECT'], 'Say the noun or the pronoun, not both.'],
  ['', 'The children are singing.', ['The children they are singing.', 'M_PRO_NOUN_AND_PRONOUN'], ['The children them are singing.', 'M_PRO_OBJECT_AS_SUBJECT'], 'The noun is enough.'],
  ['', 'Amina and I read the story.', ['Amina and me read the story.', 'M_PRO_OBJECT_AS_SUBJECT'], ['Me and Amina read the story.', 'M_PRO_OBJECT_AS_SUBJECT'], 'Before the verb, use the subject form I.'],
  ['', 'Mum gave the cake to her and me.', ['Mum gave the cake to she and I.', 'M_PRO_SUBJECT_AS_OBJECT'], ['Mum gave the cake to she and me.', 'M_PRO_SUBJECT_AS_OBJECT'], 'After to, use the object forms: her and me.'],
  ['', 'Akinyi is my sister. She is nine.', ['Akinyi is my sister. He is nine.', 'M_PRO_GENDER'], ['Akinyi is my sister. Him is nine.', 'M_PRO_OBJECT_AS_SUBJECT'], 'A girl is she.'],
];
const POSS = [
  ['This bag belongs to me. It is ___.', 'mine', ['my', 'M_POS_DETERMINER_FOR_PRONOUN'], ['your', 'M_POS_WRONG_PERSON'], 'Nothing follows the gap, so we use mine.'],
  ['That is not my pen. It is ___, Wafula.', 'yours', ['your', 'M_POS_DETERMINER_FOR_PRONOUN'], ["your's", 'M_POS_APOSTROPHE'], 'Wafula is spoken to, and nothing follows: yours.'],
  ['The red house belongs to her. The red house is ___.', 'hers', ['her', 'M_POS_DETERMINER_FOR_PRONOUN'], ["her's", 'M_POS_APOSTROPHE'], 'Nothing follows the gap: hers, with no apostrophe.'],
  ['We own this farm. The farm is ___.', 'ours', ['our', 'M_POS_DETERMINER_FOR_PRONOUN'], ["our's", 'M_POS_APOSTROPHE'], 'Nothing follows the gap: ours.'],
  ['The shoes belong to them. They are ___.', 'theirs', ['their', 'M_POS_DETERMINER_FOR_PRONOUN'], ["their's", 'M_POS_APOSTROPHE'], 'Nothing follows the gap: theirs.'],
  ['Please take ___ seat, Amina.', 'your', ['yours', 'M_POS_PRONOUN_BEFORE_NOUN'], ["your's", 'M_POS_APOSTROPHE'], 'A noun (seat) follows the gap, so we use your.'],
  ['Wanjiru lost ___ pencil.', 'her', ['hers', 'M_POS_PRONOUN_BEFORE_NOUN'], ["her's", 'M_POS_APOSTROPHE'], 'A noun (pencil) follows the gap, so we use her.'],
  ['This lunch box is ___, not yours.', 'mine', ['my', 'M_POS_DETERMINER_FOR_PRONOUN'], ['your', 'M_POS_WRONG_PERSON'], 'Nothing follows the gap, and the owner is the speaker: mine.'],
];
// ---------------------------------------------------------------- adjectives
const ADJ = [
  L('Adjective in "The red bus stopped."', ['Which word in the sentence "The red bus stopped." is an adjective.', 'red', ['bus', 'M_ADJ_NOUN_AS_ADJ'], ['stopped', 'M_ADJ_VERB_AS_ADJ'], ['The', 'M_ADJ_ARTICLE_AS_ADJ'], 'Red tells more about the bus.']),
  L('Adjective in "The tall girl ran home."', ['Which word in the sentence "The tall girl ran home." is an adjective.', 'tall', ['girl', 'M_ADJ_NOUN_AS_ADJ'], ['ran', 'M_ADJ_VERB_AS_ADJ'], ['The', 'M_ADJ_ARTICLE_AS_ADJ'], 'Tall tells more about the girl.']),
  L('Adjective in "Mama bought a sweet mango."', ['Which word in the sentence "Mama bought a sweet mango." is an adjective.', 'sweet', ['mango', 'M_ADJ_NOUN_AS_ADJ'], ['bought', 'M_ADJ_VERB_AS_ADJ'], ['a', 'M_ADJ_ARTICLE_AS_ADJ'], 'Sweet tells more about the mango.']),
  L('Adjective in "The small boy walked slowly."', ['Which word in the sentence "The small boy walked slowly." is an adjective.', 'small', ['slowly', 'M_ADJ_ADVERB_AS_ADJ'], ['boy', 'M_ADJ_NOUN_AS_ADJ'], ['walked', 'M_ADJ_VERB_AS_ADJ'], 'Small tells more about the boy. Slowly tells how he walked.']),
  L('Adjective in "A hungry lion roared loudly."', ['Which word in the sentence "A hungry lion roared loudly." is an adjective.', 'hungry', ['loudly', 'M_ADJ_ADVERB_AS_ADJ'], ['lion', 'M_ADJ_NOUN_AS_ADJ'], ['roared', 'M_ADJ_VERB_AS_ADJ'], 'Hungry tells more about the lion.']),
  L('Adjective in "We drank cold water."', ['Which word in the sentence "We drank cold water." is an adjective.', 'cold', ['water', 'M_ADJ_NOUN_AS_ADJ'], ['drank', 'M_ADJ_VERB_AS_ADJ'], 'Cold tells more about the water.']),
  L('Adjective in "The old man walked carefully."', ['Which word in the sentence "The old man walked carefully." is an adjective.', 'old', ['carefully', 'M_ADJ_ADVERB_AS_ADJ'], ['man', 'M_ADJ_NOUN_AS_ADJ'], ['walked', 'M_ADJ_VERB_AS_ADJ'], 'Old tells more about the man.']),
  L('Adjective in "Achieng wore a yellow dress."', ['Which word in the sentence "Achieng wore a yellow dress." is an adjective.', 'yellow', ['dress', 'M_ADJ_NOUN_AS_ADJ'], ['wore', 'M_ADJ_VERB_AS_ADJ'], ['a', 'M_ADJ_ARTICLE_AS_ADJ'], 'Yellow tells more about the dress.']),
];
const ORD = [
  ['She sat on a ___ stool.', 'big round', ['round big', 'M_ADO_SHAPE_BEFORE_SIZE'], ['big and round', 'M_ADO_NO_AND'], ['stool big round', 'M_ADO_AFTER_NOUN'], 'Size comes before shape: a big round stool.'],
  ['Wafula kicked a ___ ball.', 'small round', ['round small', 'M_ADO_SHAPE_BEFORE_SIZE'], ['small and round', 'M_ADO_NO_AND'], ['ball small round', 'M_ADO_AFTER_NOUN'], 'Size comes before shape: a small round ball.'],
  ['Mama bought a ___ table.', 'large square', ['square large', 'M_ADO_SHAPE_BEFORE_SIZE'], ['large and square', 'M_ADO_NO_AND'], ['table large square', 'M_ADO_AFTER_NOUN'], 'Size comes before shape: a large square table.'],
  ['The goat ate a ___ stick.', 'long thin', ['thin long', 'M_ADO_SHAPE_BEFORE_SIZE'], ['long and thin', 'M_ADO_NO_AND'], ['stick long thin', 'M_ADO_AFTER_NOUN'], 'Size comes before shape: a long thin stick.'],
  ['Amina has a ___.', 'big ball', ['ball big', 'M_ADO_AFTER_NOUN'], ['ball and big', 'M_ADO_AFTER_NOUN'], ['big and ball', 'M_ADO_NO_AND'], 'The adjective comes before the noun: a big ball.'],
  ['We live in a ___.', 'small house', ['house small', 'M_ADO_AFTER_NOUN'], ['house and small', 'M_ADO_AFTER_NOUN'], ['small and house', 'M_ADO_NO_AND'], 'The adjective comes before the noun: a small house.'],
  ['Baraka kicked a ___.', 'big round ball', ['ball big round', 'M_ADO_AFTER_NOUN'], ['round big ball', 'M_ADO_SHAPE_BEFORE_SIZE'], ['big and round ball', 'M_ADO_NO_AND'], 'Size, then shape, then the noun: a big round ball.'],
  ['The hall has a ___ roof.', 'huge flat', ['flat huge', 'M_ADO_SHAPE_BEFORE_SIZE'], ['huge and flat', 'M_ADO_NO_AND'], ['roof huge flat', 'M_ADO_AFTER_NOUN'], 'Size comes before shape: a huge flat roof.'],
];
// ---------------------------------------------------------------- quantifiers
const CNT = [
  ['There are not ___ chairs in the hall.', 'many', ['much', 'M_QUA_MUCH_COUNT'], ['little', 'M_QUA_FEW_UNCOUNT'], 'Chairs can be counted: many.'],
  ['There is not ___ water in the tank.', 'much', ['many', 'M_QUA_MANY_UNCOUNT'], ['few', 'M_QUA_FEW_UNCOUNT'], 'Water cannot be counted: much.'],
  ['We have ___ sugar left. We must buy more.', 'little', ['few', 'M_QUA_FEW_UNCOUNT'], ['many', 'M_QUA_MANY_UNCOUNT'], 'Sugar cannot be counted, and there is hardly any: little.'],
  ['Only ___ pupils came to school today. It rained heavily.', 'few', ['little', 'M_QUA_FEW_UNCOUNT'], ['much', 'M_QUA_MUCH_COUNT'], 'Pupils can be counted, and there were hardly any: few.'],
  ['How ___ eggs do you need?', 'many', ['much', 'M_QUA_MUCH_COUNT'], ['little', 'M_QUA_FEW_UNCOUNT'], 'Eggs can be counted: how many.'],
  ['How ___ milk is in the jug?', 'much', ['many', 'M_QUA_MANY_UNCOUNT'], ['few', 'M_QUA_FEW_UNCOUNT'], 'Milk cannot be counted: how much.'],
  ['She has ___ friends at the new school.', 'many', ['much', 'M_QUA_MUCH_IN_STATEMENT'], ['little', 'M_QUA_FEW_UNCOUNT'], 'Friends can be counted: many.'],
  ['He did not drink ___ tea.', 'much', ['many', 'M_QUA_MANY_UNCOUNT'], ['few', 'M_QUA_FEW_UNCOUNT'], 'Tea cannot be counted: much.'],
];
const SOM = [
  ['I have ___ sugar in my tea.', 'some', ['any', 'M_QSA_ANY_STATEMENT'], ['a lot', 'M_QSA_A_LOT_NOUN'], 'A positive sentence uses some: some sugar.'],
  ['I do not have ___ money.', 'any', ['some', 'M_QSA_SOME_NEGATIVE'], ['a lot', 'M_QSA_A_LOT_NOUN'], 'After not we use any.'],
  ['Is there ___ water in the jug?', 'any', ['some', 'M_QSA_SOME_NEGATIVE'], ['a lot', 'M_QSA_A_LOT_NOUN'], 'A question uses any.'],
  ['We have ___ for everyone.', 'enough food', ['food enough', 'M_QSA_ENOUGH_AFTER'], ['foods enough', 'M_QSA_ENOUGH_AFTER'], 'Enough comes before the noun: enough food.'],
  ['There are ___ mangoes on the tree.', 'a lot of', ['a lot', 'M_QSA_A_LOT_NOUN'], ['lot of', 'M_QSA_A_LOT_NOUN'], 'A lot needs of before the noun: a lot of mangoes.'],
  ['She has ___ books at home.', 'a lot of', ['a lot', 'M_QSA_A_LOT_NOUN'], ['lot of', 'M_QSA_A_LOT_NOUN'], 'A lot needs of before the noun: a lot of books.'],
  ['Please give me ___ water.', 'some', ['any', 'M_QSA_ANY_STATEMENT'], ['a lot', 'M_QSA_A_LOT_NOUN'], 'A polite request in a positive sentence uses some: some water.'],
  ['There was not ___ time left.', 'any', ['some', 'M_QSA_SOME_NEGATIVE'], ['a lot', 'M_QSA_A_LOT_NOUN'], 'After not we use any.'],
];
// ---------------------------------------------------------------- tenses
const PRP = [
  ['She ___ reading a story now.', 'is', ['are', 'M_PRP_WRONG_BE'], ['am', 'M_PRP_WRONG_BE'], 'She is one person: is.'],
  ['The children ___ playing football.', 'are', ['is', 'M_PRP_WRONG_BE'], ['am', 'M_PRP_WRONG_BE'], 'Children is plural: are.'],
  ['I ___ writing a letter.', 'am', ['is', 'M_PRP_WRONG_BE'], ['are', 'M_PRP_WRONG_BE'], 'I goes with am.'],
  ['He is ___ his lunch.', 'eating', ['eat', 'M_PRP_NO_ING'], ['eats', 'M_PRP_NO_ING'], 'After is the verb ends in -ing: eating.'],
  ['My mother is ___ a cake.', 'making', ['makeing', 'M_PRP_ING_SPELLING'], ['make', 'M_PRP_NO_ING'], 'Drop the silent e before -ing: making.'],
  ['The boy is ___ in the river.', 'swimming', ['swiming', 'M_PRP_ING_SPELLING'], ['swim', 'M_PRP_NO_ING'], 'Double the last letter before -ing: swimming.'],
  ['Listen! The baby ___ crying.', 'is', ['are', 'M_PRP_WRONG_BE'], ['am', 'M_PRP_WRONG_BE'], 'The baby is one person: is.'],
  ['We are ___ for the bus.', 'waiting', ['wait', 'M_PRP_NO_ING'], ['waitting', 'M_PRP_ING_SPELLING'], 'After are the verb ends in -ing: waiting.'],
];
const PRP_SENT = [
  ['', 'She is reading now.', ['She reading now.', 'M_PRP_NO_BE'], ['She are reading now.', 'M_PRP_WRONG_BE'], 'An action now needs is, am or are.'],
  ['', 'They are cooking.', ['They cooking.', 'M_PRP_NO_BE'], ['They is cooking.', 'M_PRP_WRONG_BE'], 'They goes with are.'],
  ['', 'I am eating mangoes.', ['I eating mangoes.', 'M_PRP_NO_BE'], ['I is eating mangoes.', 'M_PRP_WRONG_BE'], 'I goes with am.'],
  ['', 'The dog is running.', ['The dog running.', 'M_PRP_NO_BE'], ['The dog are running.', 'M_PRP_WRONG_BE'], 'One dog: is.'],
  ['', 'We are singing.', ['We singing.', 'M_PRP_NO_BE'], ['We is singing.', 'M_PRP_WRONG_BE'], 'We goes with are.'],
  ['', 'Wanjiru is washing clothes.', ['Wanjiru washing clothes.', 'M_PRP_NO_BE'], ['Wanjiru am washing clothes.', 'M_PRP_WRONG_BE'], 'One girl: is.'],
];
const PAP = [
  ['When I arrived, Mum ___ cooking.', 'was', ['is', 'M_PAP_PRESENT_FOR_PAST'], ['were', 'M_PAP_WAS_WERE'], 'It happened in the past and Mum is one person: was.'],
  ['The boys ___ running when it began to rain.', 'were', ['was', 'M_PAP_WAS_WERE'], ['are', 'M_PAP_PRESENT_FOR_PAST'], 'Boys is plural and the time is past: were.'],
  ['He was ___ his lunch when the bell rang.', 'eating', ['ate', 'M_PAP_PAST_FORM'], ['eat', 'M_PAP_NO_ING'], 'After was the verb ends in -ing: eating.'],
  ['They were ___ football at five o\'clock.', 'playing', ['played', 'M_PAP_PAST_FORM'], ['play', 'M_PAP_NO_ING'], 'After were the verb ends in -ing: playing.'],
  ['I ___ sleeping when you called.', 'was', ['were', 'M_PAP_WAS_WERE'], ['am', 'M_PAP_PRESENT_FOR_PAST'], 'I goes with was.'],
  ['We were ___ to the radio all evening.', 'listening', ['listened', 'M_PAP_PAST_FORM'], ['listen', 'M_PAP_NO_ING'], 'After were the verb ends in -ing: listening.'],
  ['Wanjiru ___ washing clothes at six yesterday.', 'was', ['were', 'M_PAP_WAS_WERE'], ['is', 'M_PAP_PRESENT_FOR_PAST'], 'Wanjiru is one girl and it was yesterday: was.'],
  ['The birds were ___ in the tree.', 'singing', ['sang', 'M_PAP_PAST_FORM'], ['sing', 'M_PAP_NO_ING'], 'After were the verb ends in -ing: singing.'],
];
const SPA = [
  ['Yesterday I ___ to the market.', 'went', ['go', 'M_SPA_BASE_FOR_PAST'], ['goed', 'M_SPA_ED_ON_IRREGULAR'], 'Yesterday is in the past, and go changes to went.'],
  ['Last night she ___ rice for supper.', 'ate', ['eat', 'M_SPA_BASE_FOR_PAST'], ['eated', 'M_SPA_ED_ON_IRREGULAR'], 'Last night is in the past, and eat changes to ate.'],
  ['Did you ___ the film?', 'see', ['saw', 'M_SPA_DID_PLUS_PAST'], ['seen', 'M_SPA_DID_PLUS_PAST'], 'After did the verb stays plain: see.'],
  ['Cows ___ grass every day.', 'eat', ['ate', 'M_SPA_PAST_FOR_HABIT'], ['eaten', 'M_SPA_PAST_FOR_HABIT'], 'Something that always happens uses the present: eat.'],
  ['Last week we ___ our grandmother.', 'visited', ['visit', 'M_SPA_BASE_FOR_PAST'], ['visiting', 'M_SPA_BASE_FOR_PAST'], 'Last week is in the past: visited.'],
  ['On Monday he ___ me a letter.', 'wrote', ['write', 'M_SPA_BASE_FOR_PAST'], ['writed', 'M_SPA_ED_ON_IRREGULAR'], 'It happened on Monday, and write changes to wrote.'],
  ['Did he ___ the ball?', 'kick', ['kicked', 'M_SPA_DID_PLUS_PAST'], ['kicks', 'M_SPA_DID_PLUS_PAST'], 'After did the verb stays plain: kick.'],
  ['Yesterday Amina ___ her sums before supper.', 'finished', ['finish', 'M_SPA_BASE_FOR_PAST'], ['finishing', 'M_SPA_BASE_FOR_PAST'], 'Yesterday is in the past: finished.'],
];
const CONTR = [
  ['I ___ like cold milk. (do not)', "don't", ['dont', 'M_CON_NO_APOSTROPHE'], ["do'nt", 'M_CON_WRONG_PLACE'], "The apostrophe stands where the o is missing: don't."],
  ['She ___ at home today. (is not)', "isn't", ['isnt', 'M_CON_NO_APOSTROPHE'], ["is'nt", 'M_CON_WRONG_PLACE'], "The apostrophe stands where the o is missing: isn't."],
  ['___ raining outside. (It is)', "It's", ['Its', 'M_CON_ITS'], ["It'is", 'M_CON_WRONG_PLACE'], "It's is it is. The apostrophe stands where the i is missing."],
  ['We ___ go to the party. (will not)', "won't", ["willn't", 'M_CON_WRONG_FORM'], ['wont', 'M_CON_NO_APOSTROPHE'], "Will not changes to won't."],
  ['___ my best friend. (She is)', "She's", ['Shes', 'M_CON_NO_APOSTROPHE'], ["Sh'es", 'M_CON_WRONG_PLACE'], "She's is she is. The apostrophe stands where the i is missing."],
  ['The cat licked ___ paw.', 'its', ["it's", 'M_CON_ITS'], ["its'", 'M_CON_ITS'], 'Its with no apostrophe means belonging to it.'],
  ['They ___ finished yet. (have not)', "haven't", ['havent', 'M_CON_NO_APOSTROPHE'], ["have'nt", 'M_CON_WRONG_PLACE'], "The apostrophe stands where the o is missing: haven't."],
  ['I ___ swim. (can not)', "can't", ['cant', 'M_CON_NO_APOSTROPHE'], ["ca'nt", 'M_CON_WRONG_PLACE'], "Can not becomes can't."],
];
const NEG = [
  ['He does not ___ meat.', 'eat', ['eats', 'M_NEG_VERB_S'], ['eating', 'M_NEG_VERB_S'], 'After does not the verb stays plain: eat.'],
  ['She did not ___ the door.', 'open', ['opened', 'M_NEG_VERB_S'], ['opens', 'M_NEG_VERB_S'], 'After did not the verb stays plain: open.'],
  ['They did not ___ the answer.', 'know', ['knew', 'M_NEG_VERB_S'], ['knows', 'M_NEG_VERB_S'], 'After did not the verb stays plain: know.'],
  ['My sister does not ___ tea.', 'drink', ['drinks', 'M_NEG_VERB_S'], ['drinking', 'M_NEG_VERB_S'], 'After does not the verb stays plain: drink.'],
  ['I do not have ___ pencil.', 'a', ['no', 'M_NEG_DOUBLE'], ['none', 'M_NEG_DOUBLE'], 'Not is the negative already, so we use a, not no.'],
  ['There is not ___ milk.', 'any', ['no', 'M_NEG_DOUBLE'], ['none', 'M_NEG_DOUBLE'], 'Not is the negative already, so we use any, not no.'],
];
const NEG_SENT = [
  ['', 'I do not have a pen.', ['I do not have no pen.', 'M_NEG_DOUBLE'], ['I not have a pen.', 'M_NEG_NO_DO'], 'Use do not before the verb, and only one negative.'],
  ['', 'She does not like milk.', ['She not like milk.', 'M_NEG_NO_DO'], ['She does not likes milk.', 'M_NEG_VERB_S'], 'Use does not, then the plain verb.'],
  ['', 'He did not go to school.', ['He did not went to school.', 'M_NEG_VERB_S'], ['He not go to school.', 'M_NEG_NO_DO'], 'After did not the verb stays plain.'],
  ['', 'We do not have any food.', ['We do not have no food.', 'M_NEG_DOUBLE'], ['We not have any food.', 'M_NEG_NO_DO'], 'One negative is enough.'],
  ['', 'I am not tired.', ['I do not tired.', 'M_NEG_DO_WITH_BE'], ['I not tired.', 'M_NEG_NO_DO'], 'With am, put not after it.'],
  ['', 'The children are not at home.', ['The children do not at home.', 'M_NEG_DO_WITH_BE'], ['The children not at home.', 'M_NEG_NO_DO'], 'With are, put not after it.'],
  ['', 'Wafula does not eat meat.', ['Wafula does not eats meat.', 'M_NEG_VERB_S'], ['Wafula not eat meat.', 'M_NEG_NO_DO'], 'Use does not and the plain verb.'],
];
// ---------------------------------------------------------------- adverbs
const ADV = [
  ['She sings ___.', 'beautifully', ['beautiful', 'M_ADV_ADJ_FOR_ADV'], ['beautifuly', 'M_ADV_ADJ_FOR_ADV'], 'Sings is a verb, so the describing word is the adverb beautifully.'],
  ['The bus goes very ___.', 'fast', ['fastly', 'M_ADV_FASTLY'], ['fastily', 'M_ADV_FASTLY'], 'Fast is an adverb already: goes fast.'],
  ['He plays football ___.', 'well', ['good', 'M_ADV_GOOD_WELL'], ['goodly', 'M_ADV_GOOD_WELL'], 'Plays is a verb, so we use well, not good.'],
  ['The tortoise walked ___ across the road.', 'slowly', ['slow', 'M_ADV_ADJ_FOR_ADV'], ['slowy', 'M_ADV_ADJ_FOR_ADV'], 'Walked is a verb, so we use the adverb slowly.'],
  ['The girl worked ___ for her exams.', 'hard', ['hardly', 'M_ADV_FASTLY'], ['hardy', 'M_ADV_FASTLY'], 'Hard is an adverb already: worked hard. Hardly means almost not.'],
  ['We arrived ___ for the match.', 'late', ['lately', 'M_ADV_FASTLY'], ['latly', 'M_ADV_FASTLY'], 'Late is an adverb already: arrived late.'],
  ['Mama spoke ___ to the baby.', 'softly', ['soft', 'M_ADV_ADJ_FOR_ADV'], ['softy', 'M_ADV_ADJ_FOR_ADV'], 'Spoke is a verb, so we use the adverb softly.'],
  ['Please write ___.', 'neatly', ['neat', 'M_ADV_ADJ_FOR_ADV'], ['neatful', 'M_ADV_ADJ_FOR_ADV'], 'Write is a verb, so we use the adverb neatly.'],
];
const ADV_KIND = [
  ['"We went to the lake yesterday." Which kind of adverb is yesterday.', 'time', ['manner', 'M_ADV_KIND_MIX'], ['place', 'M_ADV_KIND_MIX'], 'Yesterday tells when.'],
  ['"The children played outside." Which kind of adverb is outside.', 'place', ['time', 'M_ADV_KIND_MIX'], ['manner', 'M_ADV_KIND_MIX'], 'Outside tells where.'],
  ['"She spoke softly." Which kind of adverb is softly.', 'manner', ['time', 'M_ADV_KIND_MIX'], ['place', 'M_ADV_KIND_MIX'], 'Softly tells how.'],
  ['"He will come tomorrow." Which kind of adverb is tomorrow.', 'time', ['place', 'M_ADV_KIND_MIX'], ['manner', 'M_ADV_KIND_MIX'], 'Tomorrow tells when.'],
  ['"The bird flew away." Which kind of adverb is away.', 'place', ['manner', 'M_ADV_KIND_MIX'], ['time', 'M_ADV_KIND_MIX'], 'Away tells where.'],
  ['"He ran quickly." Which kind of adverb is quickly.', 'manner', ['place', 'M_ADV_KIND_MIX'], ['time', 'M_ADV_KIND_MIX'], 'Quickly tells how.'],
  ['"Come here." Which kind of adverb is here.', 'place', ['time', 'M_ADV_KIND_MIX'], ['manner', 'M_ADV_KIND_MIX'], 'Here tells where.'],
  ['"We left early." Which kind of adverb is early.', 'time', ['manner', 'M_ADV_KIND_MIX'], ['place', 'M_ADV_KIND_MIX'], 'Early tells when.'],
];
// ---------------------------------------------------------------- conjunctions and questions
const CNJ = [
  ['Ali likes tea ___ coffee.', 'and', ['but', 'M_CNJ_BUT_FOR_AND'], ['or', 'M_CNJ_OR_FOR_AND'], 'He likes both, so and joins them.'],
  ['It was raining, ___ we stayed inside.', 'so', ['because', 'M_CNJ_BECAUSE_SO'], ['but', 'M_CNJ_BUT_FOR_AND'], 'Staying inside is the result: so.'],
  ['We stayed inside ___ it was raining.', 'because', ['so', 'M_CNJ_BECAUSE_SO'], ['but', 'M_CNJ_BUT_FOR_AND'], 'The rain is the reason: because.'],
  ['I wanted to play, ___ I was tired.', 'but', ['and', 'M_CNJ_AND_FOR_BUT'], ['or', 'M_CNJ_OR_FOR_AND'], 'The two ideas go against each other: but.'],
  ['Mama bought rice ___ beans.', 'and', ['or', 'M_CNJ_OR_FOR_AND'], ['but', 'M_CNJ_BUT_FOR_AND'], 'She bought both: and.'],
  ['Would you like tea ___ juice?', 'or', ['and', 'M_CNJ_AND_FOR_OR'], ['but', 'M_CNJ_BUT_FOR_AND'], 'A choice between two things: or.'],
  ['He was hungry, ___ he ate two plates of ugali.', 'so', ['because', 'M_CNJ_BECAUSE_SO'], ['but', 'M_CNJ_BUT_FOR_AND'], 'Eating is the result of being hungry: so.'],
  ['She is small ___ strong.', 'but', ['and', 'M_CNJ_AND_FOR_BUT'], ['or', 'M_CNJ_OR_FOR_AND'], 'Small and strong go against each other: but.'],
];
const CNJ_SENT = [
  ['', 'Although it was late, we kept working.', ['Although it was late, but we kept working.', 'M_CNJ_DOUBLE'], ['Although it was late but, we kept working.', 'M_CNJ_DOUBLE'], 'One joining word is enough.'],
  ['', 'Because I was tired, I slept early.', ['Because I was tired, so I slept early.', 'M_CNJ_DOUBLE'], ['Because I was tired so, I slept early.', 'M_CNJ_DOUBLE'], 'Use because or so, not both.'],
  ['', 'Although Mum was busy, she helped me.', ['Although Mum was busy, but she helped me.', 'M_CNJ_DOUBLE'], ['Although Mum was busy but, she helped me.', 'M_CNJ_DOUBLE'], 'Although already shows the contrast.'],
  ['', 'Because it was hot, we sat under a tree.', ['Because it was hot, so we sat under a tree.', 'M_CNJ_DOUBLE'], ['Because it was hot so, we sat under a tree.', 'M_CNJ_DOUBLE'], 'Because already gives the reason.'],
  ['', 'Although he ran fast, he lost the race.', ['Although he ran fast, but he lost the race.', 'M_CNJ_DOUBLE'], ['Although he ran fast but, he lost the race.', 'M_CNJ_DOUBLE'], 'One joining word is enough.'],
  ['', 'Because Amina was sick, she stayed at home.', ['Because Amina was sick, so she stayed at home.', 'M_CNJ_DOUBLE'], ['Because Amina was sick so, she stayed at home.', 'M_CNJ_DOUBLE'], 'One joining word is enough.'],
];
const INT = [
  ['___ is your teacher? Mr Otieno is my teacher.', 'Who', ['What', 'M_INT_WHO_FOR_WHAT'], ['Whose', 'M_INT_WHOSE_WHOS'], 'The answer is a person, so we ask who.'],
  ['___ do we start? We start at nine o\'clock.', 'When', ['Where', 'M_INT_WHERE_FOR_WHEN'], ['Who', 'M_INT_WHO_FOR_WHAT'], 'The answer is a time, so we ask when.'],
  ['___ is the market? The market is in town.', 'Where', ['When', 'M_INT_WHERE_FOR_WHEN'], ['Who', 'M_INT_WHO_FOR_WHAT'], 'The answer is a place, so we ask where.'],
  ['___ is that? That is a hammer.', 'What', ['Who', 'M_INT_WHO_FOR_WHAT'], ['When', 'M_INT_WHERE_FOR_WHEN'], 'The answer is a thing, so we ask what.'],
  ['___ bag is this? It is Amina\'s bag.', 'Whose', ["Who's", 'M_INT_WHOSE_WHOS'], ['Whos', 'M_INT_WHOSE_WHOS'], 'The answer shows who owns it, so we ask whose.'],
  ['Where ___ you going? I am going home.', 'are', ['you are', 'M_INT_NO_INVERSION'], ['do are', 'M_INT_DO_EXTRA'], 'The helping word goes before you: Where are you going?'],
  ['How ___ you? I am fine, thank you.', 'are', ['you are', 'M_INT_NO_INVERSION'], ['do are', 'M_INT_DO_EXTRA'], 'The helping word goes before you: How are you?'],
  ['What ___ she doing? She is reading.', 'is', ['she is', 'M_INT_NO_INVERSION'], ['does is', 'M_INT_DO_EXTRA'], 'The helping word goes before she: What is she doing?'],
];
const PPF = [
  ['I have ___ my lunch.', 'eaten', ['ate', 'M_PPF_PAST_FORM'], ['eat', 'M_PPF_BASE_VERB'], 'After have the verb is a participle: eaten.'],
  ['She ___ finished her work.', 'has', ['have', 'M_PPF_HAS_HAVE'], ['having', 'M_PPF_HAS_HAVE'], 'She is one person: has.'],
  ['They have ___ home.', 'gone', ['went', 'M_PPF_PAST_FORM'], ['go', 'M_PPF_BASE_VERB'], 'After have the verb is a participle: gone.'],
  ['Wanjiru has ___ the letter.', 'written', ['wrote', 'M_PPF_PAST_FORM'], ['write', 'M_PPF_BASE_VERB'], 'After has the verb is a participle: written.'],
  ['We ___ just arrived.', 'have', ['has', 'M_PPF_HAS_HAVE'], ['having', 'M_PPF_HAS_HAVE'], 'We goes with have.'],
  ['Yesterday I ___ him at the market.', 'saw', ['have seen', 'M_PPF_WITH_PAST_TIME'], ['has seen', 'M_PPF_WITH_PAST_TIME'], 'Yesterday names the time, so we use the simple past: saw.'],
  ['He has ___ the window.', 'broken', ['broke', 'M_PPF_PAST_FORM'], ['break', 'M_PPF_BASE_VERB'], 'After has the verb is a participle: broken.'],
  ['Last week she ___ to Mombasa.', 'went', ['has gone', 'M_PPF_WITH_PAST_TIME'], ['have gone', 'M_PPF_WITH_PAST_TIME'], 'Last week names the time, so we use the simple past: went.'],
];
const PAF = [
  ['The bus ___ left before I arrived.', 'had', ['was', 'M_PAF_HAD_MISSING'], ['has', 'M_PAF_HAVE_FOR_HAD'], 'The bus left first, so we use had.'],
  ['When I got home, Mum ___ cooked the supper.', 'had', ['has', 'M_PAF_HAVE_FOR_HAD'], ['have', 'M_PAF_HAVE_FOR_HAD'], 'Cooking came first, so we use had.'],
  ['She had ___ her homework before supper.', 'finished', ['finish', 'M_PAF_BASE_VERB'], ['finishing', 'M_PAF_BASE_VERB'], 'After had the verb is a participle: finished.'],
  ['By the time we reached school, the bell ___ rung.', 'had', ['has', 'M_PAF_HAVE_FOR_HAD'], ['was', 'M_PAF_HAD_MISSING'], 'The bell rang first, so we use had.'],
  ['Kamau ___ eaten when his friend came.', 'had', ['has', 'M_PAF_HAVE_FOR_HAD'], ['have', 'M_PAF_HAVE_FOR_HAD'], 'Eating came first, so we use had.'],
  ['They had ___ the water before the rain came.', 'fetched', ['fetch', 'M_PAF_BASE_VERB'], ['fetching', 'M_PAF_BASE_VERB'], 'After had the verb is a participle: fetched.'],
  ['I ___ already seen the film before you told me.', 'had', ['have', 'M_PAF_HAVE_FOR_HAD'], ['has', 'M_PAF_HAVE_FOR_HAD'], 'Seeing the film came first, so we use had.'],
  ['The teacher had ___ the register when the headteacher entered.', 'taken', ['take', 'M_PAF_BASE_VERB'], ['taking', 'M_PAF_BASE_VERB'], 'After had the verb is a participle: taken.'],
];
const PAF_ORDER = [
  ['Wanjiru had left when I arrived. Which happened first.', 'Wanjiru left', ['I arrived', 'M_PAF_WRONG_ORDER'], ['They happened together', 'M_PAF_WRONG_ORDER'], 'Had marks the event that happened first.'],
  ['The rain had stopped when we left school. Which happened first.', 'The rain stopped', ['We left school', 'M_PAF_WRONG_ORDER'], ['They happened together', 'M_PAF_WRONG_ORDER'], 'Had marks the event that happened first.'],
  ['Mum had cooked when the guests came. Which happened first.', 'Mum cooked', ['The guests came', 'M_PAF_WRONG_ORDER'], ['They happened together', 'M_PAF_WRONG_ORDER'], 'Had marks the event that happened first.'],
  ['The bell had rung before Juma reached the gate. Which happened first.', 'The bell rang', ['Juma reached the gate', 'M_PAF_WRONG_ORDER'], ['They happened together', 'M_PAF_WRONG_ORDER'], 'Had marks the event that happened first.'],
  ['Akinyi had eaten when her cousin arrived. Which happened first.', 'Akinyi ate', ['Her cousin arrived', 'M_PAF_WRONG_ORDER'], ['They happened together', 'M_PAF_WRONG_ORDER'], 'Had marks the event that happened first.'],
];
// ---------------------------------------------------------------- prepositions
const PPOS = [
  ['The cup is ___ the table. It is on top of it.', 'on', ['in', 'M_PRE_IN_ON'], ['under', 'M_PRE_UNDER_OVER'], 'Touching the top of something is on.'],
  ['The coins are ___ the box. You cannot see them.', 'in', ['on', 'M_PRE_IN_ON'], ['behind', 'M_PRE_UNDER_OVER'], 'Inside something is in.'],
  ['The cat is hiding ___ the bed, below it.', 'under', ['on', 'M_PRE_UNDER_OVER'], ['in', 'M_PRE_IN_ON'], 'Below something is under.'],
  ['The ball is ___ the two boys.', 'between', ['among', 'M_PRE_BETWEEN_AMONG'], ['behind', 'M_PRE_UNDER_OVER'], 'Two things: between.'],
  ['The goat is ___ the many trees.', 'among', ['between', 'M_PRE_BETWEEN_AMONG'], ['on', 'M_PRE_IN_ON'], 'More than two things: among.'],
  ['Juma stood ___ Achieng at the end of the line. He was last.', 'behind', ['in front of', 'M_PRE_FRONT_BEHIND'], ['on', 'M_PRE_IN_ON'], 'At the back of someone is behind.'],
  ['The teacher stood ___ the class and faced the pupils.', 'in front of', ['behind', 'M_PRE_FRONT_BEHIND'], ['between', 'M_PRE_BETWEEN_AMONG'], 'Before someone, facing them, is in front of.'],
  ['My house is ___ the school. They share a fence.', 'next to', ['in', 'M_PRE_IN_ON'], ['under', 'M_PRE_UNDER_OVER'], 'Beside something is next to.'],
];
const PDIR = [
  ['He ran ___ the room when he heard the bell.', 'into', ['to', 'M_PRD_TO_INTO'], ['at', 'M_PRD_AT_FOR_TO'], 'Going from outside to inside is into.'],
  ['We go ___ school every morning.', 'to', ['at', 'M_PRD_AT_FOR_TO'], ['in', 'M_PRD_AT_FOR_TO'], 'After go we use to: go to school.'],
  ['I went ___ after school.', 'home', ['to home', 'M_PRD_TO_HOME'], ['at home', 'M_PRD_AT_FOR_TO'], 'Home needs no word before it after go.'],
  ['The goat ran ___ the road to the other side.', 'across', ['through', 'M_PRD_THROUGH_ACROSS'], ['into', 'M_PRD_TO_INTO'], 'From one side of a flat place to the other is across.'],
  ['The train goes ___ the tunnel and comes out the other side.', 'through', ['across', 'M_PRD_THROUGH_ACROSS'], ['into', 'M_PRD_TO_INTO'], 'In at one end and out at the other is through.'],
  ['Mama is going ___ the market.', 'to', ['at', 'M_PRD_AT_FOR_TO'], ['in', 'M_PRD_AT_FOR_TO'], 'After going we use to: going to the market.'],
  ['The ball rolled ___ the gate and into the road.', 'through', ['across', 'M_PRD_THROUGH_ACROSS'], ['to', 'M_PRD_TO_INTO'], 'In at one side and out at the other is through.'],
  ['The children walked ___ the river to the bridge.', 'along', ['across', 'M_PRD_THROUGH_ACROSS'], ['through', 'M_PRD_THROUGH_ACROSS'], 'Following the line of the river is along.'],
];

export const FAMILIES = [
  ...trio('art', 'LANGUA.T1.ARTICLES', ART, { thinOk: true, topic: 'using a, an and the', hints: ['Say the next word aloud. Does it start with a vowel sound or a consonant sound?', 'Use a or an for a new thing and the for a thing both people know.'] }),
  sentenceChoose('art', 'LANGUA.T1.ARTICLES', ART_SENT, { hints: ['Look for a missing small word before a singular noun.', 'Things in general need no article.'] }),
  ...trio('plr', 'LANGUA.T2.PLURALS_REGULAR', PLR, { thinOk: true, topic: 'about more than one thing', hints: ['Look at the last letters of the word. They tell you how to make the plural.', 'After s, x, ch and sh add -es. After a consonant and y, change y to -ies.'] }),
  ...trio('pli', 'LANGUA.T2.PLURALS_IRREGULAR', PLI, { thinOk: true, topic: 'about people, animals and body parts', hints: ['A few nouns do not take -s. They change in their own way.', 'A plural that already means many needs no -s.'] }),
  ...duo('pattern', 'LANGUA.T3.POLITE_PATTERN', POLITE, { stem: 'Which sentence is a polite and correct request or offer.', sentences: true, topic: 'asking politely', hints: ['A polite request starts with May I or Could you.', 'After May I and Could you, the verb stays plain.'] }),
  ...trio('pro', 'LANGUA.T4.PERSONAL_PRONOUNS', PRO, { thinOk: true, topic: 'using I, me, he, she, we, us, they and them', hints: ['Is the gap before the verb or after it?', 'Before the verb use I, he, she, we, they. After the verb or a small word use me, him, her, us, them.'] }),
  sentenceChoose('pro', 'LANGUA.T4.PERSONAL_PRONOUNS', PRO_SENT, { hints: ['Do not say the name and the pronoun together.', 'Before the verb use the subject form. After a small word use the object form.'] }),
  ...trio('poss', 'LANGUA.T4.POSSESSIVE_PRONOUNS', POSS, { thinOk: true, topic: 'saying who owns something', hints: ['Look at what comes after the gap. Is there a noun, or nothing?', 'Mine, yours, hers, ours and theirs stand alone and never take an apostrophe.'] }),
  ...duo('adj', 'LANGUA.T5.ADJECTIVES', ADJ, { stem: '', topic: 'about the describing word in a sentence', hints: ['An adjective tells more about a noun, such as a person or a thing.', 'A verb tells what is done. An adverb tells how, when or where.'] }),
  ...trio('ado', 'LANGUA.T5.ADJECTIVE_ORDER', ORD, { thinOk: false, stem: WORDS, topic: 'with describing words before a noun', hints: ['In English the describing words come before the noun.', 'Size comes first, then shape. Do not put and between them.'] }),
  ...trio('cnt', 'LANGUA.T6.COUNT_UNCOUNT', CNT, { thinOk: true, topic: 'about how much or how many', hints: ['Can you count the thing one by one?', 'Many and few go with things you can count. Much and little go with things you cannot.'] }),
  ...trio('som', 'LANGUA.T6.SOME_ANY', SOM, { thinOk: true, stem: WORDS, topic: 'about how much there is of something', hints: ['Is the sentence positive, a question or a negative?', 'Some goes in a positive sentence. Any goes in a question or after not. Enough comes before the noun.'] }),
  ...trio('prp', 'LANGUA.T7.PRESENT_PROGRESSIVE', PRP, { thinOk: true, topic: 'about what is happening now', hints: ['An action happening now needs am, is or are and a verb ending in -ing.', 'Match am, is or are to the subject. Drop a silent e or double the last letter before -ing.'] }),
  sentenceChoose('prp', 'LANGUA.T7.PRESENT_PROGRESSIVE', PRP_SENT, { hints: ['Look for the helping word before the -ing verb.', 'I goes with am. One person or thing goes with is. Many go with are.'] }),
  ...trio('pap', 'LANGUA.T7.PAST_PROGRESSIVE', PAP, { thinOk: true, topic: 'about what was going on in the past', hints: ['The action was going on at a time in the past, so use was or were.', 'After was or were the verb ends in -ing.'] }),
  ...trio('spa', 'LISTEN.T7.SIMPLE_PAST', SPA, { thinOk: true, topic: 'about the past and the present', hints: ['Look for a time word such as yesterday, last night or every day.', 'After did the verb stays plain. A fact or a habit uses the present.'] }),
  ...trio('con', 'LANGUA.T8.CONTRACTIONS', CONTR, { thinOk: true, topic: 'with short forms of verbs', hints: ["The apostrophe takes the place of the letter that is left out.", "It's means it is. Its with no apostrophe means belonging to it."] }),
  ...trio('negv', 'LANGUA.T8.NEGATIVE_STATEMENTS', NEG, { thinOk: true, topic: 'with negative sentences', hints: ['After does not and did not the verb stays plain.', 'Not is already the negative word, so do not add no.'] }),
  sentenceChoose('neg', 'LANGUA.T8.NEGATIVE_STATEMENTS', NEG_SENT, { stem: 'Which sentence is a correct negative statement.', hints: ['Look for do not, does not, did not or am, is, are not.', 'Use one negative only.'] }),
  ...trio('adv', 'LANGUA.T9.ADVERBS', ADV, { thinOk: true, topic: 'using adverbs', hints: ['The gap tells how something is done, so it needs an adverb.', 'Many adverbs end in -ly, but fast, hard and late do not.'] }),
  eng({ id: id('advkind', 'choose'), kind: 'classify', cs: 'LANGUA.T9.ADVERBS', oc: 'a', form: 'direct', rung: 2, gen: choose(ADV_KIND, { stem: '', hints: ['Ask: does the word tell how, when or where?', 'Manner answers how, time answers when, place answers where.'] }) }),
  ...trio('cnj', 'LANGUA.T10.CONJUNCTIONS', CNJ, { thinOk: true, topic: 'joining ideas', hints: ['Say the two parts. Is the second a reason, a result, a surprise or a choice?', 'And adds, but goes against, because gives a reason, so gives a result, or gives a choice.'] }),
  eng({ id: id('cnj', 'sentence'), kind: 'choose-sentence', cs: 'LANGUA.T10.CONJUNCTIONS', oc: 'c', form: 'direct', rung: 2, gen: choose(CNJ_SENT, { stem: SENT, hints: ['Use only one joining word between two ideas.', 'Although and because already join the ideas, so do not add but or so.'] }) }),
  ...trio('int', 'LANGUA.T11.INTERROGATIVES', INT, { thinOk: true, stem: WORDS, topic: 'asking questions', hints: ['Look at the answer given. Does it name a person, a time, a place or a thing?', 'In a question the helping word comes before the subject.'] }),
  ...trio('ppf', 'LANGUA.T12.PRESENT_PERFECT', PPF, { thinOk: true, stem: WORDS, topic: 'with have and has', hints: ['After have or has the verb is a participle, such as eaten, gone, written.', 'If the time is named (yesterday, last week), use the simple past instead.'] }),
  ...trio('paf', 'LANGUA.T12.PAST_PERFECT', PAF, { thinOk: true, stem: WORDS, topic: 'about what had already happened', hints: ['Two things happened in the past. Which came first?', 'The first event takes had and a participle.'] }),
  eng({ id: id('paf', 'order'), kind: 'choose-order', cs: 'LANGUA.T12.PAST_PERFECT', oc: 'a', form: 'why', rung: 3, gen: choose(PAF_ORDER, { stem: '', hints: ['Look for the word had.', 'The event with had happened first.'] }) }),
  ...trio('ppos', 'LANGUA.T13.PREP_POSITION', PPOS, { thinOk: true, topic: 'about where things are', hints: ['Picture where the thing is.', 'Use between for two things and among for more than two.'] }),
  ...trio('pdir', 'LANGUA.T13.PREP_DIRECTION', PDIR, { thinOk: true, topic: 'about moving to places', hints: ['Picture the movement.', 'After go use to, but home needs no word. Into is going inside; through goes in and out the other side.'] }),
];
