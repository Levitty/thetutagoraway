// ============================================================================
// ENGLISH GRADE 6, LANGUAGE: word classes, tenses and sentence patterns (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g6.json). Off for children (reviewed:false) until a
// Kenyan English teacher signs them off. See docs/qa/english-g6-review-2026-11-12.md.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './english_g6_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
// An item: [text, right, [wrong, 'M_CODE']..., because]
const GH = ['Read the sentence slowly, one word at a time.', 'Check your word by reading the sentence aloud.'];
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english6.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english6.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english6.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
// Whole-sentence pools (punctuation and patterns): choose and find the mistake only.
const D = (key, cs, pool, { stem = SENT, hints, topic, oc = outcomeLetters(cs, 2) }) => [
  eng({ id: `english6.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
  eng({ id: `english6.${key}.spot`, cs, oc: oc[1], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
];

// ---------------------------------------------------------------- determiners
const DET = [
  I('Each of the girls ___ a water bottle.', 'has', [['have', 'M_DET_EACH_PLURAL'], ['are', 'M_DET_EACH_PLURAL'], ['having', 'M_DET_EACH_PLURAL']], 'Each means one at a time, so the verb is singular: each girl has.'),
  I('We saw ___ goats at the market today.', 'a lot of', [['a lots of', 'M_DET_LOTS_FORM'], ['a lot off', 'M_DET_LOTS_FORM'], ['an lot of', 'M_DET_LOTS_FORM']], 'The phrase is a lot of.'),
  I('The classroom is big ___ for all forty learners.', 'enough', [['enougher', 'M_DET_ENOUGH_AFTER'], ['enoughly', 'M_DET_ENOUGH_AFTER'], ['enow', 'M_DET_ENOUGH_AFTER']], 'The word comes after the adjective big: big enough.'),
  I('There is not ___ sugar left in the tin.', 'any', [['some', 'M_DET_SOME_ANY'], ['each', 'M_DET_SOME_ANY'], ['a lots', 'M_DET_SOME_ANY']], 'After not, we use any: not any sugar.'),
  I('Each learner ___ asked to bring a book.', 'was', [['were', 'M_DET_EACH_PLURAL'], ['are', 'M_DET_EACH_PLURAL'], ['have', 'M_DET_EACH_PLURAL']], 'Each learner is one person, so the verb is singular: was.'),
  I('Would you like ___ more tea, Grandmother?', 'some', [['each', 'M_DET_SOME_ANY'], ['enough', 'M_DET_SOME_ANY'], ['a lots of', 'M_DET_LOTS_FORM']], 'In an offer we use some: Would you like some more tea?'),
  I('There are not ___ chairs for everyone, so some will stand.', 'enough', [['each', 'M_DET_EACH_PLURAL'], ['a lots of', 'M_DET_LOTS_FORM'], ['a lot off', 'M_DET_LOTS_FORM']], 'Enough chairs means as many as are needed. It comes before the noun.'),
  I('Wanjiru gave ___ of the thirty children a mango, so nobody was left out.', 'each', [['a lot of', 'M_DET_EACH_PLURAL'], ['enough', 'M_DET_EACH_PLURAL'], ['some', 'M_DET_EACH_PLURAL']], 'She gave a mango to one child at a time, so each.'),
];
// ---------------------------------------------------------------- concrete and abstract nouns
const CA = [
  I('The headteacher praised Wanjiru for her ___.', 'honesty', [['honest', 'M_NOUN_ADJECTIVE_FORM'], ['honestly', 'M_NOUN_ADJECTIVE_FORM'], ['honesties', 'M_NOUN_ADJECTIVE_FORM']], 'After her, a noun is needed. The noun for honest is honesty.'),
  I('The soldiers showed great ___ in the battle.', 'bravery', [['brave', 'M_NOUN_ADJECTIVE_FORM'], ['bravely', 'M_NOUN_ADJECTIVE_FORM'], ['braver', 'M_NOUN_ADJECTIVE_FORM']], 'Showed great needs a noun: bravery.'),
  I('The ___ of the people in the village was clear: they were poor.', 'poverty', [['poor', 'M_NOUN_ADJECTIVE_FORM'], ['poorly', 'M_NOUN_ADJECTIVE_FORM'], ['poorer', 'M_NOUN_ADJECTIVE_FORM']], 'The ___ of ... needs a noun: poverty.'),
  I('Everyone admired the ___ of the young runner.', 'speed', [['fast', 'M_NOUN_ADJECTIVE_FORM'], ['fastly', 'M_NOUN_ADJECTIVE_FORM'], ['faster', 'M_NOUN_ADJECTIVE_FORM']], 'The ___ of ... needs a noun: speed.'),
  I('The ___ in the village made the people share food.', 'kindness', [['kind', 'M_NOUN_ADJECTIVE_FORM'], ['kindly', 'M_NOUN_ADJECTIVE_FORM'], ['kinder', 'M_NOUN_ADJECTIVE_FORM']], 'The ___ in ... needs a noun: kindness.'),
  I('Otieno could not hide his ___ when he lost the game.', 'sadness', [['sad', 'M_NOUN_ADJECTIVE_FORM'], ['sadly', 'M_NOUN_ADJECTIVE_FORM'], ['sadder', 'M_NOUN_ADJECTIVE_FORM']], 'His ___ needs a noun: sadness.'),
];
const CA_ID = [
  I('Which of these nouns is abstract.', 'kindness', [['river', 'M_NOUN_FEELING_CONCRETE'], ['table', 'M_NOUN_FEELING_CONCRETE'], ['mango', 'M_NOUN_FEELING_CONCRETE']], 'You cannot see or touch kindness. It is an idea, so it is abstract.'),
  I('Which of these nouns is concrete.', 'market', [['freedom', 'M_NOUN_PLACE_ABSTRACT'], ['honesty', 'M_NOUN_PLACE_ABSTRACT'], ['courage', 'M_NOUN_PLACE_ABSTRACT']], 'You can walk to a market and see it, so it is concrete.'),
  I('Which of these nouns is abstract.', 'hunger', [['bread', 'M_NOUN_FEELING_CONCRETE'], ['bowl', 'M_NOUN_FEELING_CONCRETE'], ['spoon', 'M_NOUN_FEELING_CONCRETE']], 'Hunger is a feeling. You cannot touch it, so it is abstract.'),
  I('Which of these nouns is abstract.', 'happiness', [['drum', 'M_NOUN_SENSE_ABSTRACT'], ['bell', 'M_NOUN_SENSE_ABSTRACT'], ['radio', 'M_NOUN_SENSE_ABSTRACT']], 'Happiness is a feeling, an idea. You cannot touch it. The drum, bell and radio are things.'),
  I('Which of these nouns is concrete.', 'teacher', [['wisdom', 'M_NOUN_PLACE_ABSTRACT'], ['patience', 'M_NOUN_PLACE_ABSTRACT'], ['friendship', 'M_NOUN_PLACE_ABSTRACT']], 'A teacher is a person we can see, so the noun is concrete.'),
  I('Which of these nouns is abstract.', 'freedom', [['school', 'M_NOUN_FEELING_CONCRETE'], ['flag', 'M_NOUN_FEELING_CONCRETE'], ['road', 'M_NOUN_FEELING_CONCRETE']], 'Freedom is an idea. We cannot touch it, so it is abstract.'),
  I('Which of these nouns is concrete.', 'chalk', [['bravery', 'M_NOUN_SENSE_ABSTRACT'], ['silence', 'M_NOUN_SENSE_ABSTRACT'], ['time', 'M_NOUN_SENSE_ABSTRACT']], 'Chalk is a thing we can touch. Bravery, silence and time are ideas and cannot be held.'),
];
// ---------------------------------------------------------------- correlative conjunctions
const CORR = [
  I('Neither Atieno ___ Juma knew the answer.', 'nor', [['or', 'M_CORR_NEITHER_OR'], ['and', 'M_CORR_NEITHER_OR'], ['but', 'M_CORR_NEITHER_OR']], 'Neither goes with nor: neither Atieno nor Juma.'),
  I('Both Mary ___ Peter passed the test.', 'and', [['or', 'M_CORR_BOTH_OR'], ['nor', 'M_CORR_BOTH_OR'], ['but', 'M_CORR_BOTH_OR']], 'Both goes with and: both Mary and Peter.'),
  I('You may either walk to school ___ take a matatu.', 'or', [['nor', 'M_CORR_EITHER_NOR'], ['and', 'M_CORR_EITHER_NOR'], ['but', 'M_CORR_EITHER_NOR']], 'Either gives a choice, so it goes with or.'),
  I('He is not only clever ___ also hardworking.', 'but', [['and', 'M_CORR_NOT_ONLY_AND'], ['or', 'M_CORR_NOT_ONLY_AND'], ['nor', 'M_CORR_NOT_ONLY_AND']], 'The pair is not only ... but also.'),
  I('Neither Ouma nor Wanjiru ___ late for the bus.', 'was', [['was not', 'M_CORR_NEITHER_NOT'], ['were not', 'M_CORR_NEITHER_NOT'], ['are not', 'M_CORR_NEITHER_NOT']], 'Neither ... nor already means no, so do not add not. The verb is singular: was.'),
  I('Either Baraka ___ his sister will bring the football.', 'or', [['nor', 'M_CORR_EITHER_NOR'], ['and', 'M_CORR_EITHER_NOR'], ['but', 'M_CORR_EITHER_NOR']], 'Either goes with or: either Baraka or his sister.'),
  I('Both the teachers ___ the learners enjoyed the trip.', 'and', [['or', 'M_CORR_BOTH_OR'], ['nor', 'M_CORR_BOTH_OR'], ['but', 'M_CORR_BOTH_OR']], 'Both goes with and.'),
  I('She can neither read ___ write in Spanish.', 'nor', [['or', 'M_CORR_NEITHER_OR'], ['and', 'M_CORR_NEITHER_OR'], ['but', 'M_CORR_NEITHER_OR']], 'Neither goes with nor: neither read nor write.'),
];
// ---------------------------------------------------------------- show me where/how/who
const SHOW = [
  I('', 'Please show me where the library is.', [['Please show me where is the library.', 'M_SHOW_INVERSION'], ['Please show me where does the library is.', 'M_SHOW_DO_SUPPORT'], ['Please show me the library is.', 'M_SHOW_WORD_MISSING']], 'After where the order stays the same as in a statement: where the library is.'),
  I('', 'Tell me how the machine works.', [['Tell me how does the machine work.', 'M_SHOW_DO_SUPPORT'], ['Tell me how works the machine.', 'M_SHOW_INVERSION'], ['Tell me the machine works.', 'M_SHOW_WORD_MISSING']], 'After how the order stays the same: how the machine works. Do not add do or does.'),
  I('', 'Can you show me who won the race?', [['Can you show me who did win the race?', 'M_SHOW_DO_SUPPORT'], ['Can you show me won who the race?', 'M_SHOW_INVERSION'], ['Can you show me the race won?', 'M_SHOW_WORD_MISSING']], 'The question word who leads the clause: who won the race. The whole sentence is still a question, so it ends with a question mark.'),
  I('', 'Tell me who won the race.', [['Tell me who won the race?', 'M_SHOW_QMARK'], ['Tell me who did win the race.', 'M_SHOW_DO_SUPPORT'], ['Tell me won who the race.', 'M_SHOW_INVERSION']], 'This sentence is a request, not a question, so it ends with a full stop.'),
  I('', 'Show me where you keep the chalk.', [['Show me where do you keep the chalk.', 'M_SHOW_DO_SUPPORT'], ['Show me where keep you the chalk.', 'M_SHOW_INVERSION'], ['Show me you keep the chalk.', 'M_SHOW_WORD_MISSING']], 'After where, the order stays: where you keep the chalk.'),
  I('', 'I will show you how it is done.', [['I will show you how is it done.', 'M_SHOW_INVERSION'], ['I will show you how does it done.', 'M_SHOW_DO_SUPPORT'], ['I will show you it is done.', 'M_SHOW_WORD_MISSING']], 'The order after how is a statement order: how it is done.'),
  I('', 'Please tell me where Mr Kimani lives.', [['Please tell me where does Mr Kimani live.', 'M_SHOW_DO_SUPPORT'], ['Please tell me where lives Mr Kimani.', 'M_SHOW_INVERSION'], ['Please tell me Mr Kimani lives.', 'M_SHOW_WORD_MISSING']], 'No do or does and no turning round: where Mr Kimani lives.'),
  I('', 'Show me how you solved the problem.', [['Show me how did you solve the problem.', 'M_SHOW_DO_SUPPORT'], ['Show me how solved you the problem.', 'M_SHOW_INVERSION'], ['Show me you solved the problem.', 'M_SHOW_WORD_MISSING']], 'After how keep the order of a statement and the past tense of the verb: how you solved.'),
];
// ---------------------------------------------------------------- relative pronouns
const REL = [
  I('The girl ___ won the race is my cousin.', 'who|that', [['which', 'M_REL_WHICH_PERSON'], ['whose', 'M_REL_WHOSE_WHO'], ['who she', 'M_REL_DOUBLE']], 'A girl is a person, so who.'),
  I('This is the book ___ I bought yesterday.', 'which|that', [['who', 'M_REL_WHO_THING'], ['whose', 'M_REL_WHOSE_WHO'], ['which it', 'M_REL_DOUBLE']], 'A book is a thing, so which.'),
  I('The boy ___ bag was stolen began to cry.', 'whose', [['who', 'M_REL_WHOSE_WHO'], ['which', 'M_REL_WHICH_PERSON'], ['whom', 'M_REL_WHOSE_WHO']], 'The bag belongs to the boy. Belonging is whose.'),
  I('The teacher ___ taught us Maths is very kind.', 'who|that', [['who she', 'M_REL_DOUBLE'], ['which', 'M_REL_WHICH_PERSON'], ['whose', 'M_REL_WHOSE_WHO']], 'Who already stands for the teacher. Do not add she.'),
  I('The dog ___ barked all night belongs to our neighbour.', 'which|that', [['whom', 'M_REL_WHO_THING'], ['whose', 'M_REL_WHOSE_WHO'], ['which it', 'M_REL_DOUBLE']], 'A dog is an animal, so which or that.'),
  I('The woman ___ shop is near the bus stage sells good mandazi.', 'whose', [['who', 'M_REL_WHOSE_WHO'], ['which', 'M_REL_WHICH_PERSON'], ['whom', 'M_REL_WHOSE_WHO']], 'The shop belongs to the woman. Belonging is whose.'),
  I('The farmer to ___ we spoke gave us a bag of maize.', 'whom', [['who', 'M_REL_WHOM_WHO'], ['which', 'M_REL_WHICH_PERSON'], ['whose', 'M_REL_WHOSE_WHO']], 'After to, the formal word for a person is whom.'),
  I('The river ___ flows past our school is very wide.', 'which|that', [['who', 'M_REL_WHO_THING'], ['whose', 'M_REL_WHOSE_WHO'], ['which it', 'M_REL_DOUBLE']], 'A river is a thing, so which or that.'),
];
// ---------------------------------------------------------------- indefinite pronouns
const IND = [
  I('I saw ___ standing at the gate.', 'somebody', [['anybody', 'M_IND_ANY_STATEMENT'], ['nobody', 'M_IND_ANY_STATEMENT'], ['noone', 'M_IND_NOONE']], 'In a plain positive sentence we use somebody.'),
  I('I did not meet ___ on the road.', 'anybody', [['nobody', 'M_IND_DOUBLE_NEG'], ['noone', 'M_IND_NOONE'], ['somebody', 'M_IND_ANY_STATEMENT']], 'After not use anybody. Not and nobody together make a double negative.'),
  I('Everyone ___ here for the meeting.', 'is', [['are', 'M_IND_PLURAL_VERB'], ['were', 'M_IND_PLURAL_VERB'], ['have', 'M_IND_PLURAL_VERB']], 'Everyone is singular, so it takes is.'),
  I('There was ___ in the hall, so we locked the door.', 'nobody', [['noone', 'M_IND_NOONE'], ['anybody', 'M_IND_DOUBLE_NEG'], ['somebody', 'M_IND_ANY_STATEMENT']], 'The one-word form is nobody. No one is written as two words, never noone.'),
  I('She did not say ___ about the missing money.', 'anything', [['nothing', 'M_IND_DOUBLE_NEG'], ['something', 'M_IND_ANY_STATEMENT'], ['everything', 'M_IND_ANY_STATEMENT']], 'After not use anything.'),
  I('Is there ___ in the box?', 'anything', [['nothing', 'M_IND_DOUBLE_NEG'], ['everything', 'M_IND_ANY_STATEMENT'], ['noone', 'M_IND_NOONE']], 'In a question we use anything.'),
  I('Nobody ___ the answer to the last question.', 'knew', [['know', 'M_IND_PLURAL_VERB'], ['knowing', 'M_IND_PLURAL_VERB'], ['were knowing', 'M_IND_PLURAL_VERB']], 'Nobody is singular. The past verb is knew.'),
  I('Everybody in Grade 6 ___ a book to read.', 'has', [['have', 'M_IND_PLURAL_VERB'], ['are having', 'M_IND_PLURAL_VERB'], ['having', 'M_IND_PLURAL_VERB']], 'Everybody is singular, so it takes has.'),
];
// ---------------------------------------------------------------- adjective degrees
const DEGR = [
  I('Kamau is as ___ as his brother.', 'tall', [['taller', 'M_DEGR_AS_COMPARATIVE'], ['tallest', 'M_DEGR_AS_COMPARATIVE'], ['more tall', 'M_DEGR_AS_COMPARATIVE']], 'Between as ... as use the plain adjective: as tall as.'),
  I('Wanjiru is the tallest girl ___ the class.', 'in', [['than', 'M_DEGR_SUPER_THAN'], ['from', 'M_DEGR_SUPER_THAN'], ['that', 'M_DEGR_SUPER_THAN']], 'After the tallest use in or of: the tallest in the class.'),
  I('Otieno is ___ fastest runner in Grade 6.', 'the', [['a', 'M_DEGR_THE_MISSING'], ['more', 'M_DEGR_THE_MISSING'], ['very', 'M_DEGR_THE_MISSING']], 'A superlative needs the: the fastest.'),
  I('Juma is taller ___ Peter.', 'than', [['from', 'M_DEGR_THAN_MISSING'], ['that', 'M_DEGR_THAN_MISSING'], ['then', 'M_DEGR_THAN_MISSING']], 'After a comparative use than.'),
  I('She is one of the tallest ___ in the school.', 'girls', [['girl', 'M_DEGR_ONE_OF_SINGULAR'], ['girl\'s', 'M_DEGR_ONE_OF_SINGULAR'], ['girling', 'M_DEGR_ONE_OF_SINGULAR']], 'One of the ... needs a plural noun: one of the tallest girls.'),
  I('This river is as ___ as the one near our home.', 'wide', [['wider', 'M_DEGR_AS_COMPARATIVE'], ['widest', 'M_DEGR_AS_COMPARATIVE'], ['more wide', 'M_DEGR_AS_COMPARATIVE']], 'Between as ... as use the plain form: as wide as.'),
  I('Mount Kenya is ___ than Mount Elgon.', 'higher', [['highest', 'M_DEGR_SUPER_THAN'], ['the highest', 'M_DEGR_SUPER_THAN'], ['high', 'M_DEGR_THAN_MISSING']], 'Than goes with a comparative: higher than.'),
  I('That was ___ most exciting match of the year.', 'the', [['a', 'M_DEGR_THE_MISSING'], ['an', 'M_DEGR_THE_MISSING'], ['more', 'M_DEGR_THE_MISSING']], 'A superlative needs the: the most exciting.'),
];
const DEGR_ID = [
  I('Which of these words is a superlative adjective.', 'smallest', [['smaller', 'M_DEGR_AS_COMPARATIVE'], ['small', 'M_DEGR_AS_COMPARATIVE'], ['more small', 'M_DEGR_AS_COMPARATIVE']], 'Smallest names the one with the least size of a group, so it is the superlative.'),
  I('Which of these words is a comparative adjective.', 'happier', [['happiest', 'M_DEGR_SUPER_THAN'], ['happy', 'M_DEGR_SUPER_THAN'], ['happily', 'M_DEGR_SUPER_THAN']], 'Happier compares two things, so it is the comparative.'),
  I('In the sentence "Amina is as kind as her sister", the adjective is in which form.', 'simple', [['comparative', 'M_DEGR_AS_COMPARATIVE'], ['superlative', 'M_DEGR_AS_COMPARATIVE'], ['adverb', 'M_DEGR_AS_COMPARATIVE']], 'In as ... as the plain, simple form is used.'),
  I('In the sentence "This is the most beautiful beach in Kenya", the adjective is in which form.', 'superlative', [['comparative', 'M_DEGR_SUPER_THAN'], ['simple', 'M_DEGR_SUPER_THAN'], ['adverb', 'M_DEGR_SUPER_THAN']], 'Most beautiful in Kenya picks one from a whole group: the superlative.'),
  I('Which sentence uses a comparative adjective.', 'Mombasa is hotter than Nakuru.', [['Mombasa is the hottest town in Kenya.', 'M_DEGR_SUPER_THAN'], ['Mombasa is as hot as Kisumu.', 'M_DEGR_AS_COMPARATIVE'], ['Mombasa is hot.', 'M_DEGR_THAN_MISSING']], 'Hotter than compares two places: that is a comparative.'),
];
// ---------------------------------------------------------------- phrasal quantifiers
const PQ = [
  I('A number of ___ were late for the assembly.', 'learners', [['water', 'M_PQ_NUMBER_UNCOUNT'], ['sugar', 'M_PQ_NUMBER_UNCOUNT'], ['advice', 'M_PQ_NUMBER_UNCOUNT']], 'A number of goes with things we can count: learners.'),
  I('We used a great deal of ___ to bake the cake.', 'flour', [['eggs', 'M_PQ_AMOUNT_COUNT'], ['bananas', 'M_PQ_AMOUNT_COUNT'], ['cups', 'M_PQ_AMOUNT_COUNT']], 'A great deal of goes with something we cannot count one by one: flour.'),
  I('The teacher gave me a piece of ___ before the exam.', 'advice', [['advices', 'M_PQ_PIECE_PLURAL'], ['advise', 'M_PQ_PIECE_PLURAL'], ['adviced', 'M_PQ_PIECE_PLURAL']], 'Advice has no plural. We count it with a piece of.'),
  I('Mama bought a loaf ___ bread at the shop.', 'of', [['for', 'M_PQ_OF_MISSING'], ['with', 'M_PQ_OF_MISSING'], ['in', 'M_PQ_OF_MISSING']], 'The pattern is a loaf OF bread.'),
  I('Please give me a bar of ___ for washing my hands.', 'soap', [['milk', 'M_PQ_WRONG_UNIT'], ['water', 'M_PQ_WRONG_UNIT'], ['rice', 'M_PQ_WRONG_UNIT']], 'A bar goes with soap or chocolate. Milk is measured in bottles or cups.'),
  I('There was a large amount of ___ in the tank.', 'water', [['boys', 'M_PQ_AMOUNT_COUNT'], ['tanks', 'M_PQ_AMOUNT_COUNT'], ['books', 'M_PQ_AMOUNT_COUNT']], 'An amount of goes with something we cannot count: water.'),
  I('A number of ___ visited the museum on Friday.', 'tourists', [['news', 'M_PQ_NUMBER_UNCOUNT'], ['rice', 'M_PQ_NUMBER_UNCOUNT'], ['furniture', 'M_PQ_NUMBER_UNCOUNT']], 'A number of goes with countable things: tourists.'),
  I('He gave us a useful piece of ___ about the journey.', 'information', [['informations', 'M_PQ_PIECE_PLURAL'], ['inform', 'M_PQ_PIECE_PLURAL'], ['informing', 'M_PQ_PIECE_PLURAL']], 'Information has no plural. We count it with a piece of.'),
];
// ---------------------------------------------------------------- future continuous
const FC = [
  I('This time tomorrow we ___ travelling to Kisumu.', 'will be', [['will', 'M_FC_NO_BE'], ['be', 'M_FC_PRESENT'], ['will been', 'M_FC_WILL_BEEN']], 'The future continuous is will be + verb-ing: will be travelling.'),
  I('At six o\'clock tonight I ___ cooking supper.', 'will be', [['will been', 'M_FC_WILL_BEEN'], ['will', 'M_FC_NO_BE'], ['be', 'M_FC_PRESENT']], 'At a stated time in the future: will be cooking.'),
  I('At noon tomorrow Mama ___ working in the shamba.', 'will be', [['be', 'M_FC_PRESENT'], ['will', 'M_FC_NO_BE'], ['will been', 'M_FC_WILL_BEEN']], 'The time is in the future, so will be working.'),
  I('Tomorrow at ten the pupils ___ writing a test.', 'will be', [['will write', 'M_FC_NO_ING'], ['will', 'M_FC_NO_BE'], ['be', 'M_FC_PRESENT']], 'The test will be going on at ten, so will be writing.'),
  I('Next Saturday morning the whole village ___ cleaning the market.', 'will be', [['will been', 'M_FC_WILL_BEEN'], ['be', 'M_FC_PRESENT'], ['will', 'M_FC_NO_BE']], 'An action going on at a future time: will be cleaning.'),
  I('This time next week, Atieno ___ sitting her final exam.', 'will be', [['will', 'M_FC_NO_BE'], ['be', 'M_FC_PRESENT'], ['will been', 'M_FC_WILL_BEEN']], 'This time next week is in the future: will be sitting.'),
  I('When you arrive, we ___ waiting for you at the gate.', 'will be', [['will been', 'M_FC_WILL_BEEN'], ['be', 'M_FC_PRESENT'], ['will', 'M_FC_NO_BE']], 'The waiting will already be going on when you arrive: will be waiting.'),
  I('By eight tomorrow morning the children ___ playing football.', 'will be', [['will play', 'M_FC_NO_ING'], ['be', 'M_FC_PRESENT'], ['will', 'M_FC_NO_BE']], 'An action going on at a stated future time: will be playing.'),
];
// ---------------------------------------------------------------- active and passive
const PASS = [
  I('The window ___ by the wind.', 'was broken', [['broken', 'M_PASS_NO_BE'], ['was break', 'M_PASS_PAST_FORM'], ['were broken', 'M_PASS_AGREEMENT']], 'A passive needs be + the past participle: was broken.'),
  I('The letter was ___ by Mary last night.', 'written', [['wrote', 'M_PASS_PAST_FORM'], ['write', 'M_PASS_PAST_FORM'], ['writing', 'M_PASS_PAST_FORM']], 'After was use the past participle: written.'),
  I('The books ___ returned to the library on Friday.', 'were', [['was', 'M_PASS_AGREEMENT'], ['is', 'M_PASS_AGREEMENT'], ['be', 'M_PASS_NO_BE']], 'The subject books is plural, so were.'),
  I('The food was ___ by the guests.', 'eaten', [['ate', 'M_PASS_PAST_FORM'], ['eat', 'M_PASS_PAST_FORM'], ['eating', 'M_PASS_PAST_FORM']], 'After was use the past participle: eaten.'),
  I('The match ___ by thousands of fans.', 'was watched', [['watched', 'M_PASS_NO_BE'], ['were watched', 'M_PASS_AGREEMENT'], ['was watch', 'M_PASS_PAST_FORM']], 'The match is singular, so was watched.'),
  I('The trees ___ planted by the Grade 6 learners.', 'were', [['was', 'M_PASS_AGREEMENT'], ['be being', 'M_PASS_AGREEMENT'], ['be', 'M_PASS_NO_BE']], 'The trees is plural and the planting is finished, so were planted.'),
  I('The thief was ___ by the police near the market.', 'caught', [['catch', 'M_PASS_PAST_FORM'], ['catched', 'M_PASS_PAST_FORM'], ['catching', 'M_PASS_PAST_FORM']], 'The past participle of catch is caught.'),
  I('The new bridge ___ opened by the governor.', 'was', [['were', 'M_PASS_AGREEMENT'], ['has', 'M_PASS_NO_BE'], ['did', 'M_PASS_NO_BE']], 'The bridge is singular, so was opened.'),
];
const PASS_ID = [
  I('Which sentence is in the passive voice.', 'The rice was cooked by Wanjiku.', [['Wanjiku cooked the rice.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['Wanjiku is cooking the rice.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['Wanjiku will cook the rice.', 'M_PASS_ACTIVE_AS_PASSIVE']], 'In the passive the rice (the thing acted on) is the subject.'),
  I('Which sentence is in the passive voice.', 'The ball was kicked over the fence.', [['Baraka kicked the ball over the fence.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['Baraka was kicking the ball.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['Baraka kicks the ball every day.', 'M_PASS_ACTIVE_AS_PASSIVE']], 'The ball receives the action, so it is the passive.'),
  I('Which sentence is in the active voice.', 'The farmer sold the cows.', [['The cows were sold by the farmer.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['The cows were sold.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['The cows had been sold.', 'M_PASS_ACTIVE_AS_PASSIVE']], 'The farmer does the action: that is the active voice.'),
  I('Which sentence is in the passive voice.', 'The classroom is cleaned every morning.', [['The learners clean the classroom every morning.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['The cleaner sweeps the classroom.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['Mama cleans the house.', 'M_PASS_ACTIVE_AS_PASSIVE']], 'The classroom receives the cleaning: passive.'),
  I('Which sentence is in the passive voice.', 'The song was sung by the choir.', [['The choir sang the song.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['The choir is singing.', 'M_PASS_ACTIVE_AS_PASSIVE'], ['The choir will sing the song.', 'M_PASS_ACTIVE_AS_PASSIVE']], 'The song receives the action: passive.'),
];
const PASS_CONV = [
  I('Which sentence is the passive form of "Wanjiku cooked the rice".', 'The rice was cooked by Wanjiku.', [['Wanjiku was cooked by the rice.', 'M_PASS_DOER_SUBJECT'], ['The rice cooked Wanjiku.', 'M_PASS_DOER_SUBJECT'], ['The rice is cooked by Wanjiku.', 'M_PASS_NO_BE']], 'The thing acted on (the rice) goes first and the verb is was cooked.'),
  I('Which sentence is the passive form of "Baraka kicked the ball".', 'The ball was kicked by Baraka.', [['Baraka was kicked by the ball.', 'M_PASS_DOER_SUBJECT'], ['The ball kicked Baraka.', 'M_PASS_DOER_SUBJECT'], ['The ball were kicked by Baraka.', 'M_PASS_AGREEMENT']], 'The ball receives the action and goes first: The ball was kicked by Baraka.'),
  I('Which sentence is the passive form of "The teacher praised the learners".', 'The learners were praised by the teacher.', [['The teacher was praised by the learners.', 'M_PASS_DOER_SUBJECT'], ['The learners was praised by the teacher.', 'M_PASS_AGREEMENT'], ['The learners praised the teacher.', 'M_PASS_DOER_SUBJECT']], 'The learners go first and the verb agrees with a plural subject: were praised.'),
  I('Which sentence is the passive form of "Mama baked the bread".', 'The bread was baked by Mama.', [['Mama was baked by the bread.', 'M_PASS_DOER_SUBJECT'], ['The bread baked Mama.', 'M_PASS_DOER_SUBJECT'], ['The bread was bake by Mama.', 'M_PASS_PAST_FORM']], 'The bread is acted on, so it goes first: The bread was baked by Mama.'),
  I('Which sentence is the passive form of "The farmer planted the trees".', 'The trees were planted by the farmer.', [['The farmer was planted by the trees.', 'M_PASS_DOER_SUBJECT'], ['The trees was planted by the farmer.', 'M_PASS_AGREEMENT'], ['The trees planted the farmer.', 'M_PASS_DOER_SUBJECT']], 'The trees go first and the verb is plural: were planted.'),
];
// ---------------------------------------------------------------- confused words
const CW = [
  I('The teacher ___ us a story about a clever hare.', 'told', [['said', 'M_CW_SAY_TELL'], ['says', 'M_CW_SAY_TELL'], ['speaked', 'M_CW_SAY_TELL']], 'Tell is followed by the person: told us.'),
  I('Please ___ me your pen for a minute.', 'lend', [['borrow', 'M_CW_BORROW_LEND'], ['borrowed', 'M_CW_BORROW_LEND'], ['lent', 'M_CW_BORROW_LEND']], 'You give someone a thing for a short time: lend. The other person borrows.'),
  I('May I ___ your pen for a minute?', 'borrow', [['lend', 'M_CW_BORROW_LEND'], ['lent', 'M_CW_BORROW_LEND'], ['give', 'M_CW_BORROW_LEND']], 'You take a thing for a short time: borrow.'),
  I('Please ___ this letter to the headteacher\'s office. I will stay here in the classroom.', 'take', [['bring', 'M_CW_BRING_TAKE'], ['brings', 'M_CW_BRING_TAKE'], ['brang', 'M_CW_BRING_TAKE']], 'The letter moves away from the speaker, so take.'),
  I('Mr Kimani will ___ us fractions this term.', 'teach', [['learn', 'M_CW_LEARN_TEACH'], ['learned', 'M_CW_LEARN_TEACH'], ['teached', 'M_CW_LEARN_TEACH']], 'The teacher teaches; the pupils learn.'),
  I('We ___ fractions from Mr Kimani every Monday.', 'learn', [['teach', 'M_CW_LEARN_TEACH'], ['taught', 'M_CW_LEARN_TEACH'], ['lerned', 'M_CW_LEARN_TEACH']], 'The pupils learn from the teacher.'),
  I('Please ___ carefully to the story.', 'listen', [['hear', 'M_CW_HEAR_LISTEN'], ['heard', 'M_CW_HEAR_LISTEN'], ['hearing', 'M_CW_HEAR_LISTEN']], 'You listen on purpose. Listen is followed by to.'),
  I('___ at the bird on the roof.', 'Look', [['See', 'M_CW_SEE_LOOK'], ['Seen', 'M_CW_SEE_LOOK'], ['Saw', 'M_CW_SEE_LOOK']], 'Look is on purpose and is followed by at.'),
  I('He ___ me to come early to school.', 'told', [['said', 'M_CW_SAY_TELL'], ['say', 'M_CW_SAY_TELL'], ['telled', 'M_CW_SAY_TELL']], 'Told is followed by the person: told me.'),
  I('Please ___ my greetings to your mother when you go home.', 'take', [['bring', 'M_CW_BRING_TAKE'], ['brought', 'M_CW_BRING_TAKE'], ['tooked', 'M_CW_BRING_TAKE']], 'The greetings go away from the speaker, so take.'),
];
// ---------------------------------------------------------------- adverbs
const ADV = [
  I('The boy runs very ___.', 'quickly', [['quick', 'M6_ADV_ADJ_FOR_ADV'], ['quicker', 'M6_ADV_ADJ_FOR_ADV'], ['quickness', 'M6_ADV_ADJ_FOR_ADV']], 'How does he run? An -ly word tells how: quickly.'),
  I('Wanjiru sings very ___.', 'well', [['good', 'M6_ADV_GOOD_WELL'], ['goodly', 'M6_ADV_GOOD_WELL'], ['better', 'M6_ADV_GOOD_WELL']], 'Good describes a noun. Well describes a verb: sings well.'),
  I('He worked ___ and passed the exam.', 'hard', [['hardly', 'M6_ADV_HARD_HARDLY'], ['harder', 'M6_ADV_HARD_HARDLY'], ['hardy', 'M6_ADV_HARD_HARDLY']], 'Hard means with great effort. Hardly means almost not.'),
  I('Juma ___ walks to school.', 'always', [['walks always', 'M6_ADV_POSITION'], ['all ways', 'M6_ADV_POSITION'], ['alway', 'M6_ADV_POSITION']], 'Always comes before the main verb.'),
  I('The old man spoke ___ so that everyone could hear.', 'loudly', [['loud', 'M6_ADV_ADJ_FOR_ADV'], ['loudest', 'M6_ADV_ADJ_FOR_ADV'], ['louder', 'M6_ADV_ADJ_FOR_ADV']], 'How did he speak? Loudly.'),
  I('She was ___ tired after the long walk.', 'very', [['well', 'M_ADV_KIND_MIXED'], ['hard', 'M_ADV_KIND_MIXED'], ['good', 'M_ADV_KIND_MIXED']], 'Very is an adverb of degree. It tells how much.'),
  I('The children ___ play in the compound after school.', 'often', [['play often', 'M6_ADV_POSITION'], ['oftenly', 'M6_ADV_POSITION'], ['soft', 'M6_ADV_POSITION']], 'Often comes before the main verb: they often play.'),
  I('He ___ slept last night because of the noise.', 'hardly', [['hard', 'M6_ADV_HARD_HARDLY'], ['hardy', 'M6_ADV_HARD_HARDLY'], ['harder', 'M6_ADV_HARD_HARDLY']], 'He slept very little: hardly.'),
];
const ADV_KIND = [
  I('What does the adverb "yesterday" tell us in "We visited Mombasa yesterday".', 'when', [['where', 'M_ADV_KIND_MIXED'], ['how', 'M_ADV_KIND_MIXED'], ['how often', 'M_ADV_KIND_MIXED']], 'Yesterday tells when: an adverb of time.'),
  I('What does the adverb "slowly" tell us in "The tortoise walked slowly".', 'how', [['when', 'M_ADV_KIND_MIXED'], ['where', 'M_ADV_KIND_MIXED'], ['how often', 'M_ADV_KIND_MIXED']], 'Slowly tells how the tortoise walked: an adverb of manner.'),
  I('What does the adverb "outside" tell us in "The children are playing outside".', 'where', [['when', 'M_ADV_KIND_MIXED'], ['how', 'M_ADV_KIND_MIXED'], ['how often', 'M_ADV_KIND_MIXED']], 'Outside tells where: an adverb of place.'),
  I('What does the adverb "always" tell us in "Otieno always arrives early".', 'how often', [['when', 'M_ADV_KIND_MIXED'], ['where', 'M_ADV_KIND_MIXED'], ['how', 'M_ADV_KIND_MIXED']], 'Always tells how often: an adverb of frequency.'),
  I('What does the adverb "very" tell us in "The soup is very hot".', 'how much', [['when', 'M_ADV_KIND_MIXED'], ['where', 'M_ADV_KIND_MIXED'], ['how often', 'M_ADV_KIND_MIXED']], 'Very tells how much: an adverb of degree.'),
];
// ---------------------------------------------------------------- conjunctions
const CJ = [
  I('___ it rained all day, we still played football.', 'Although', [['Because', 'M_CJ_ALTHOUGH_BUT'], ['Unless', 'M_CJ_ALTHOUGH_BUT'], ['Until', 'M_CJ_ALTHOUGH_BUT']], 'The two ideas go against each other, so although.'),
  I('You will not pass the exam ___ you study hard.', 'unless', [['unless not', 'M_CJ_UNLESS_NOT'], ['while', 'M_CJ_UNLESS_NOT'], ['although', 'M_CJ_UNLESS_NOT']], 'Unless means if not, so do not add not.'),
  I('Wait here ___ I come back from the shop.', 'until', [['while', 'M_CJ_WHILE_UNTIL'], ['although', 'M_CJ_WHILE_UNTIL'], ['unless', 'M_CJ_WHILE_UNTIL']], 'Until means up to the time that: wait up to the time I return.'),
  I('We left early ___ we could catch the bus.', 'so that', [['because', 'M_CJ_SO_THAT_MEANING'], ['although', 'M_CJ_SO_THAT_MEANING'], ['unless', 'M_CJ_SO_THAT_MEANING']], 'So that gives the purpose: the aim we want to reach.'),
  I('Kamau likes tea, ___ his sister prefers milk.', 'whereas', [['because', 'M_CJ_WHEREAS'], ['so that', 'M_CJ_WHEREAS'], ['unless', 'M_CJ_WHEREAS']], 'Two different tastes side by side: whereas.'),
  I('Mama sang ___ she cooked the supper.', 'while', [['until', 'M_CJ_WHILE_UNTIL'], ['unless', 'M_CJ_WHILE_UNTIL'], ['whereas', 'M_CJ_WHEREAS']], 'The two actions happened at the same time: while.'),
  I('He ran fast ___ he was tired.', 'although', [['because', 'M_CJ_ALTHOUGH_BUT'], ['so that', 'M_CJ_SO_THAT_MEANING'], ['unless', 'M_CJ_UNLESS_NOT']], 'Running fast and being tired go against each other, so although.'),
  I('We must plant trees ___ the soil is washed away.', 'unless', [['although', 'M_CJ_UNLESS_NOT'], ['whereas', 'M_CJ_UNLESS_NOT'], ['unless not', 'M_CJ_UNLESS_NOT']], 'Unless means if we do not: if we do not plant trees, the soil is washed away.'),
];
// ---------------------------------------------------------------- interrogatives
const INTERR = [
  I('___ bag is this? It is Wanjiru\'s.', 'Whose', [['Who', 'M_Q_WHO_WHOSE'], ['Whom', 'M_Q_WHO_WHOSE'], ['What', 'M_Q_WHO_WHOSE']], 'The answer names the owner, so whose.'),
  I('___ of these two books is yours?', 'Which', [['What', 'M_Q_WHAT_WHICH'], ['Who', 'M_Q_WHAT_WHICH'], ['Whose', 'M_Q_WHAT_WHICH']], 'The choice is between two books you can see, so which.'),
  I('How ___ eggs did you buy?', 'many', [['much', 'M_Q_HOWMUCH_MANY'], ['often', 'M_Q_HOWMUCH_MANY'], ['long', 'M_Q_HOWMUCH_MANY']], 'Eggs can be counted, so how many.'),
  I('How ___ milk is left in the jug?', 'much', [['many', 'M_Q_HOWMUCH_MANY'], ['often', 'M_Q_HOWMUCH_MANY'], ['long', 'M_Q_HOWMUCH_MANY']], 'Milk cannot be counted one by one, so how much.'),
  I('How ___ is it from Nakuru to Naivasha? About sixty kilometres.', 'far', [['long', 'M_Q_HOWLONG_HOWFAR'], ['often', 'M_Q_HOWLONG_HOWFAR'], ['many', 'M_Q_HOWLONG_HOWFAR']], 'The answer is a distance, so how far.'),
  I('How ___ did the journey take? Three hours.', 'long', [['far', 'M_Q_HOWLONG_HOWFAR'], ['often', 'M_Q_HOWLONG_HOWFAR'], ['many', 'M_Q_HOWLONG_HOWFAR']], 'The answer is a length of time, so how long.'),
  I('How ___ do you go to the library? Twice a week.', 'often', [['long', 'M_Q_WHEN_HOWOFTEN'], ['far', 'M_Q_WHEN_HOWOFTEN'], ['much', 'M_Q_WHEN_HOWOFTEN']], 'Twice a week is how many times, so how often.'),
  I('___ do you go to the library? On Fridays.', 'When', [['How often', 'M_Q_WHEN_HOWOFTEN'], ['How long', 'M_Q_WHEN_HOWOFTEN'], ['How far', 'M_Q_HOWLONG_HOWFAR']], 'On Fridays is a time, so when.'),
];
// ---------------------------------------------------------------- question tags
const TAGS = [
  I('Wafula is a good singer, ___?', 'isn\'t he', [['is he', 'M_TAGS_SAME_SIGN'], ['isn\'t it', 'M_TAGS_ALWAYS_ISNTIT'], ['isn\'t Wafula', 'M_TAGS_NO_PRONOUN']], 'A positive statement takes a negative tag with the same helper verb and a pronoun: isn\'t he.'),
  I('You can swim, ___?', 'can\'t you', [['isn\'t it', 'M_TAGS_ALWAYS_ISNTIT'], ['can you', 'M_TAGS_SAME_SIGN'], ['don\'t you', 'M_TAGS_DO_FORM']], 'The helper verb is can, so the tag is can\'t you.'),
  I('Otieno plays football, ___?', 'doesn\'t he', [['isn\'t he', 'M_TAGS_ALWAYS_ISNTIT'], ['does he', 'M_TAGS_SAME_SIGN'], ['doesn\'t Otieno', 'M_TAGS_NO_PRONOUN']], 'There is no helper verb, so the tag uses does: doesn\'t he.'),
  I('I am late, ___?', 'aren\'t I', [['amn\'t I', 'M_TAGS_AM'], ['am not I', 'M_TAGS_AM'], ['am I', 'M_TAGS_SAME_SIGN']], 'After I am the tag is aren\'t I.'),
  I('The girls are ready, ___?', 'aren\'t they', [['aren\'t the girls', 'M_TAGS_NO_PRONOUN'], ['are they', 'M_TAGS_SAME_SIGN'], ['isn\'t it', 'M_TAGS_ALWAYS_ISNTIT']], 'The tag uses a pronoun for the girls: they.'),
  I('You do not like beans, ___?', 'do you', [['don\'t you', 'M_TAGS_NEG_NEG'], ['aren\'t you', 'M_TAGS_NEG_NEG'], ['isn\'t it', 'M_TAGS_ALWAYS_ISNTIT']], 'A negative statement takes a positive tag: do you.'),
  I('They have finished the work, ___?', 'haven\'t they', [['have they', 'M_TAGS_SAME_SIGN'], ['don\'t they', 'M_TAGS_DO_FORM'], ['isn\'t it', 'M_TAGS_ALWAYS_ISNTIT']], 'The helper verb is have, so the tag is haven\'t they.'),
  I('Mama will come tomorrow, ___?', 'won\'t she', [['will she', 'M_TAGS_SAME_SIGN'], ['isn\'t she', 'M_TAGS_ALWAYS_ISNTIT'], ['won\'t Mama', 'M_TAGS_NO_PRONOUN']], 'The helper verb is will, so the tag is won\'t she.'),
];
// ---------------------------------------------------------------- prepositions
const PREP = [
  I('The sweets were shared ___ the five children.', 'among', [['between', 'M_PREP_BETWEEN_AMONG'], ['with', 'M_PREP_BETWEEN_AMONG'], ['by', 'M_PREP_BETWEEN_AMONG']], 'There are five children, more than two, so among.'),
  I('The ball rolled ___ the two trees.', 'between', [['among', 'M_PREP_BETWEEN_AMONG'], ['with', 'M_PREP_BETWEEN_AMONG'], ['by', 'M_PREP_BETWEEN_AMONG']], 'There are two trees, so between.'),
  I('We have lived in Nakuru ___ 2019.', 'since', [['for', 'M_PREP_SINCE_FOR'], ['during', 'M_PREP_SINCE_FOR'], ['from', 'M_PREP_SINCE_FOR']], '2019 is the time it began, so since.'),
  I('We have lived in Nakuru ___ five years.', 'for', [['since', 'M_PREP_SINCE_FOR'], ['during', 'M_PREP_SINCE_FOR'], ['from', 'M_PREP_SINCE_FOR']], 'Five years is how long, so for.'),
  I('Otieno is interested ___ football.', 'in', [['on', 'M_PREP_DEPENDENT'], ['at', 'M_PREP_DEPENDENT'], ['for', 'M_PREP_DEPENDENT']], 'The word pair is interested in.'),
  I('The meat was cut ___ a sharp knife.', 'with', [['by', 'M_PREP_BY_WITH'], ['from', 'M_PREP_BY_WITH'], ['of', 'M_PREP_BY_WITH']], 'A knife is the tool, so with.'),
  I('The picture was drawn ___ Achieng.', 'by', [['with', 'M_PREP_BY_WITH'], ['from', 'M_PREP_BY_WITH'], ['for', 'M_PREP_BY_WITH']], 'Achieng is the doer, so by.'),
  I('It rained heavily ___ the night.', 'during', [['for', 'M_PREP_DURING_FOR'], ['since', 'M_PREP_DURING_FOR'], ['between', 'M_PREP_DURING_FOR']], 'The night is a period of time when something happened: during.'),
  I('The little boy is afraid ___ dogs.', 'of', [['from', 'M_PREP_DEPENDENT'], ['at', 'M_PREP_DEPENDENT'], ['with', 'M_PREP_DEPENDENT']], 'The word pair is afraid of.'),
  I('Your answer is different ___ mine.', 'from', [['than', 'M_PREP_DEPENDENT'], ['of', 'M_PREP_DEPENDENT'], ['with', 'M_PREP_DEPENDENT']], 'The word pair is different from.'),
];

export const FAMILIES = [
  ...P('det', 'LANGUA.T1.DETERMINERS', DET, { topic: 'with the words that tell how many', hints: ['Think about the noun that comes next and the verb that follows.', 'Each is one at a time. A lot of is many or much.'] }),
  eng({ id: 'english6.noun.abstract', kind: 'choose-kind', cs: 'LANGUA.T2.CONCRETE_ABSTRACT', oc: 'a', form: 'direct', rung: 1, gen: choose(CA_ID, { stem: 'Which noun fits.', hints: ['Ask: can I see it or touch it? If yes it is concrete.', 'Ideas, feelings and qualities are abstract.'] }) }),
  eng({ id: 'english6.noun.gap', cs: 'LANGUA.T2.CONCRETE_ABSTRACT', oc: 'b', form: 'direct', rung: 2, gen: gap(CA, { stem: 'Type the noun that completes the sentence: {what}.', hints: GH }) }),
  eng({ id: 'english6.noun.spot', cs: 'LANGUA.T2.CONCRETE_ABSTRACT', oc: 'b', form: 'spot', rung: 3, gen: spot(CA, { topic: 'with abstract nouns', hints: ['An abstract noun names an idea or a quality.', 'After her, his or great a noun is needed, not an adjective.'] }) }),
  ...P('corr', 'LANGUA.T3.CORRELATIVE', CORR, { stem: 'Choose the word that completes the pair.', topic: 'with both ... and, either ... or and neither ... nor', hints: ['Look at the first half: both, either, neither or not only.', 'Each first half has its own partner.'] }),
  ...D('show', 'LANGUA.T3.SHOW_PATTERN', SHOW, { topic: 'with show me or tell me', hints: ['After the question word, keep the order of a statement: subject then verb.', 'Do not add do, does or did, and do not turn the verb round.'], oc: ['c', 'd'] }),
  ...P('rel', 'LANGUA.T4.RELATIVE_PRONOUNS', REL, { topic: 'with who, whom, whose and which', hints: ['Is the word about a person, a thing or belonging?', 'Who is for people, which is for things, whose is for belonging.'] }),
  ...P('indef', 'LANGUA.T4.INDEFINITE_PRONOUNS', IND, { topic: 'with someone, anybody, nobody and everything', hints: ['Is the sentence plain, a question or a negative?', 'Use a singular verb after every- and no-.'] }),
  ...P('degree', 'LANGUA.T5.ADJECTIVE_DEGREES', DEGR, { topic: 'with as ... as, than and the', hints: ['As ... as takes the plain adjective. Than takes a comparative. The takes a superlative.', 'Say the whole phrase aloud.'] }),
  eng({ id: 'english6.degree.form', kind: 'choose-form', cs: 'LANGUA.T5.ADJECTIVE_DEGREES', oc: 'a', form: 'word', rung: 1, gen: choose(DEGR_ID, { stem: 'Which one is right.', hints: ['Simple: one thing. Comparative: two things (-er, than). Superlative: the most of a group (-est, the).', 'Look for than or the.'] }) }),
  ...P('pquant', 'LANGUA.T6.PHRASAL_QUANTIFIERS', PQ, { topic: 'with a number of, a great deal of and a piece of', hints: ['Can the noun be counted one by one?', 'A number of is for counted things; a great deal of is for things that are not counted.'] }),
  ...P('futcont', 'LANGUA.T7.FUTURE_CONTINUOUS', FC, { stem: 'Choose the words that complete the sentence.', topic: 'with the future continuous', hints: ['The pattern is will be + verb-ing.', 'A time in the future needs will, not is or are.'] }),
  ...P('passive', 'LANGUA.T8.ACTIVE_PASSIVE', PASS, { stem: 'Choose the words that complete the sentence.', topic: 'in the passive voice', hints: ['A passive sentence is be + the past participle.', 'Match was or were to the subject.'], rungs: [2, 2, 3], oc: ['c', 'd', 'd'] }),
  eng({ id: 'english6.passive.identify', kind: 'choose-passive', cs: 'LANGUA.T8.ACTIVE_PASSIVE', oc: 'a', form: 'direct', rung: 1, gen: choose(PASS_ID, { stem: 'Choose.', hints: ['In the passive the subject RECEIVES the action.', 'Active: who does it comes first. Passive: what it is done to comes first.'] }) }),
  eng({ id: 'english6.passive.convert', kind: 'choose-passive-form', cs: 'LANGUA.T8.ACTIVE_PASSIVE', oc: 'c', form: 'direct', rung: 3, gen: choose(PASS_CONV, { stem: 'Choose.', hints: ['Move the thing that is acted on to the front.', 'Use was or were, then the past participle, then by.'] }) }),
  ...P('confuse', 'LANGUA.T8.CONFUSED_WORDS', CW, { topic: 'with say and tell, borrow and lend, bring and take, learn and teach', hints: ['Ask who gives and who receives, or which way the thing moves.', 'Tell is followed by a person; lend and teach are for the giver.'], oc: ['b', 'b', 'b'] }),
  ...P('adv', 'LANGUA.T9.ADVERBS_USE', ADV, { topic: 'with adverbs', hints: ['An adverb tells how, when, where, how often or how much.', 'Frequency adverbs come before the main verb.'] }),
  eng({ id: 'english6.adv.kind', kind: 'choose-kind', cs: 'LANGUA.T9.ADVERBS_USE', oc: 'a', form: 'word', rung: 1, gen: choose(ADV_KIND, { stem: 'Choose.', hints: ['Ask the question: how, when, where, how often or how much?', 'Manner: how. Time: when. Place: where. Frequency: how often. Degree: how much.'] }) }),
  ...P('conj', 'LANGUA.T10.CONJUNCTIONS_USE', CJ, { stem: 'Choose the word that joins the ideas.', topic: 'with although, unless, while and until', hints: ['What is the link between the two ideas: contrast, condition, purpose or time?', 'Use one joining word only.'] }),
  ...P('interr', 'LANGUA.T11.INTERROGATIVES_USE', INTERR, { stem: 'Choose the question word.', topic: 'with question words', hints: ['Read the answer. What kind of answer is it: an owner, a choice, a number, a distance, a time?', 'Match the question word to the answer.'] }),
  ...P('tag', 'LANGUA.T12.QUESTION_TAGS_USE', TAGS, { stem: 'Choose the question tag.', topic: 'with question tags', hints: ['Use the helper verb of the statement, the opposite sign and a pronoun.', 'No helper verb? Use do, does or did.'] }),
  ...P('prep', 'LANGUA.T13.PREPOSITIONS_USE', PREP, { topic: 'with prepositions', hints: ['Think about the meaning: two or many, a start or a length, a doer or a tool.', 'Some words take a fixed preposition: interested in, afraid of.'] }),
];
