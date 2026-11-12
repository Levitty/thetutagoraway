// ============================================================================
// ENGLISH GRADE 5, GRAMMAR IN USE and MECHANICS OF WRITING (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer
// carries the library misconception behind it (curriculum/english/g5.json). Off for children
// (reviewed:false) until a Kenyan English teacher signs them off. See docs/qa/english-g5-2026-11-12.md.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './eng_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
// Three families from one pool: choose, type the gap, find the mistake in a child's four sentences.
// Identify = choose the right form; use = write it; judge = find the mistake. The skill's outcomes are spread over the three in that order.
const trio = (key, cs, pool, { stem = WORD, hints, topic, rungs = [1, 2, 3], thinOk = false, oc = outcomeLetters(cs, 3) }) => [
  eng({ id: `eng5.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `eng5.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints }) }),
  eng({ id: `eng5.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
// Whole-sentence pools (punctuation): choose and find the mistake only.
const duo = (key, cs, pool, { stem = SENT, hints, topic, oc = outcomeLetters(cs, 2) }) => [
  eng({ id: `eng5.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
  eng({ id: `eng5.${key}.spot`, cs, oc: oc[1], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
];

// ---------------------------------------------------------------- demonstratives
const DEM = [
  ['Look at ___ books in my hands.', 'these', ['this', 'M_DEM_THIS_PLURAL'], ['those', 'M_DEM_NEAR_FAR'], ['them', 'M_DEM_THEM'], 'Books is plural and they are in my hands, so they are near: these.'],
  ['___ mango in my hand is ripe.', 'This', ['These', 'M_DEM_THESE_SINGULAR'], ['That', 'M_DEM_NEAR_FAR'], ['Them', 'M_DEM_THEM'], 'One mango, and it is in my hand, so it is near: this.'],
  ['Do you see ___ cows across the river?', 'those', ['these', 'M_DEM_NEAR_FAR'], ['that', 'M_DEM_THIS_PLURAL'], ['them', 'M_DEM_THEM'], 'Cows is plural and they are across the river, far away: those.'],
  ['Look at ___ bird on the roof of the house across the road.', 'that', ['this', 'M_DEM_NEAR_FAR'], ['those', 'M_DEM_THESE_SINGULAR'], ['these', 'M_DEM_THESE_SINGULAR'], 'One bird, and it is far away: that.'],
  ['I like ___ shoes I am wearing.', 'these', ['this', 'M_DEM_THIS_PLURAL'], ['those', 'M_DEM_NEAR_FAR'], ['them', 'M_DEM_THEM'], 'Shoes is plural and I am wearing them, so they are near: these.'],
  ['"Who owns ___ umbrella over there by the gate?" asked the teacher.', 'that', ['this', 'M_DEM_NEAR_FAR'], ['those', 'M_DEM_THESE_SINGULAR'], ['these', 'M_DEM_THESE_SINGULAR'], 'One umbrella, over there by the gate, so it is far: that.'],
  ['Taste ___ sweet potatoes in my bowl, Achieng.', 'these', ['this', 'M_DEM_THIS_PLURAL'], ['that', 'M_DEM_THIS_PLURAL'], ['those', 'M_DEM_NEAR_FAR'], 'Potatoes is plural and they are in my bowl, so they are near: these.'],
  ['I cannot reach ___ shelf at the top of the wall.', 'that', ['this', 'M_DEM_NEAR_FAR'], ['these', 'M_DEM_THESE_SINGULAR'], ['those', 'M_DEM_THESE_SINGULAR'], 'One shelf, high up and far from me: that.'],
];
// ---------------------------------------------------------------- collective nouns
const COLL = [
  ['A ___ of cattle was crossing the road.', 'herd', ['flock', 'M_COLL_WRONG_ANIMAL'], ['swarm', 'M_COLL_WRONG_ANIMAL'], ['bunch', 'M_COLL_THING_MIX'], 'A group of cattle is a herd.'],
  ['A ___ of bees flew out of the hive.', 'swarm', ['herd', 'M_COLL_WRONG_ANIMAL'], ['flock', 'M_COLL_WRONG_ANIMAL'], ['bunch', 'M_COLL_THING_MIX'], 'A group of bees is a swarm.'],
  ['A ___ of birds sat on the fence.', 'flock', ['herd', 'M_COLL_WRONG_ANIMAL'], ['swarm', 'M_COLL_WRONG_ANIMAL'], ['bunch', 'M_COLL_THING_MIX'], 'A group of birds is a flock.'],
  ['Wambui carried a ___ of bananas home.', 'bunch', ['herd', 'M_COLL_THING_MIX'], ['flock', 'M_COLL_THING_MIX'], ['swarm', 'M_COLL_THING_MIX'], 'Bananas that grow together are called a bunch.'],
  ['The fisherman saw a ___ of fish near the rocks.', 'school|shoal', ['herd', 'M_COLL_WRONG_ANIMAL'], ['flock', 'M_COLL_WRONG_ANIMAL'], ['swarm', 'M_COLL_WRONG_ANIMAL'], 'A group of fish is a school (or a shoal).'],
  ['A ___ of lions rested under the acacia tree.', 'pride', ['herd', 'M_COLL_WRONG_ANIMAL'], ['flock', 'M_COLL_WRONG_ANIMAL'], ['swarm', 'M_COLL_WRONG_ANIMAL'], 'A group of lions is a pride.'],
  ['Njeri lost a ___ of keys on the way to school.', 'bunch', ['herd', 'M_COLL_THING_MIX'], ['flock', 'M_COLL_THING_MIX'], ['swarm', 'M_COLL_THING_MIX'], 'Keys that hang together are a bunch of keys.'],
  ['We saw a ___ of elephants at Tsavo.', 'herd', ['pride', 'M_COLL_WRONG_ANIMAL'], ['flock', 'M_COLL_WRONG_ANIMAL'], ['swarm', 'M_COLL_WRONG_ANIMAL'], 'A group of elephants is a herd.'],
  ['We saw a ___ birds on the roof.', 'flock of', ['flock', 'M_COLL_OF_MISSING'], ['herd of', 'M_COLL_WRONG_ANIMAL'], ['swarm of', 'M_COLL_WRONG_ANIMAL'], 'Say the whole pattern: a flock of birds. The little word of joins the group word to the things.'],
  ['Three ___ of sheep were on the hill.', 'flocks', ['flock', 'M_COLL_PLURAL_S'], ['swarms', 'M_COLL_WRONG_ANIMAL'], ['bunches', 'M_COLL_THING_MIX'], 'Three groups need the plural group word: flocks.'],
];
// ---------------------------------------------------------------- reflexive pronouns
const REFL = [
  ['I cut ___ with the knife while peeling potatoes.', 'myself', ['me', 'M_REFL_OBJECT_PRONOUN'], ['myselves', 'M_REFL_SINGULAR_PLURAL'], ['himself', 'M_REFL_WRONG_PERSON'], 'I did it to me, so the word is myself.'],
  ['You must be proud of ___, Wanjiru.', 'yourself', ['you', 'M_REFL_OBJECT_PRONOUN'], ['yourselves', 'M_REFL_SINGULAR_PLURAL'], ['herself', 'M_REFL_WRONG_PERSON'], 'One person is spoken to, so the word is yourself.'],
  ['Juma made the kite all by ___.', 'himself', ['hisself', 'M_REFL_HISSELF'], ['him', 'M_REFL_OBJECT_PRONOUN'], ['herself', 'M_REFL_WRONG_PERSON'], 'Juma is a boy, so himself.'],
  ['The children taught ___ to swim without any help.', 'themselves', ['theirselves', 'M_REFL_HISSELF'], ['themself', 'M_REFL_SINGULAR_PLURAL'], ['ourselves', 'M_REFL_WRONG_PERSON'], 'Many children did it, so themselves.'],
  ['We should be proud of ___ for winning.', 'ourselves', ['ourself', 'M_REFL_SINGULAR_PLURAL'], ['us', 'M_REFL_OBJECT_PRONOUN'], ['themselves', 'M_REFL_WRONG_PERSON'], 'We are more than one person, so ourselves.'],
  ['Achieng baked the cake all by ___.', 'herself', ['her', 'M_REFL_OBJECT_PRONOUN'], ['himself', 'M_REFL_WRONG_PERSON'], ['herselves', 'M_REFL_SINGULAR_PLURAL'], 'Achieng is a girl, so herself.'],
  ['The cat washed ___ in the sun.', 'itself', ['itselves', 'M_REFL_SINGULAR_PLURAL'], ['themselves', 'M_REFL_WRONG_PERSON'], ['myself', 'M_REFL_WRONG_PERSON'], 'One cat did it, so itself.'],
  ['Be careful, boys. Do not hurt ___ on the rocks.', 'yourselves', ['yourself', 'M_REFL_SINGULAR_PLURAL'], ['you', 'M_REFL_OBJECT_PRONOUN'], ['themselves', 'M_REFL_WRONG_PERSON'], 'You is said to many boys, so yourselves.'],
];
// ---------------------------------------------------------------- too ... to
const TOO = [
  ['The soup was ___ drink.', 'too hot to', ['too hot for to', 'M_TOO_FOR_TO'], ['too hot', 'M_TOO_MISSING_TO'], ['too hot that we', 'M_TOO_THAT'], 'Too + adjective + to + verb: too hot to drink.'],
  ['The box was ___ me to lift.', 'too heavy for', ['too heavy to', 'M_TOO_FOR_VERB'], ['too heavy that', 'M_TOO_THAT'], ['too heavy for to', 'M_TOO_FOR_TO'], 'Before a person use for: too heavy for me.'],
  ['Otieno was ___ stay awake.', 'too tired to', ['too tired that', 'M_TOO_THAT'], ['too tired for to', 'M_TOO_FOR_TO'], ['too tired', 'M_TOO_MISSING_TO'], 'Before a verb use to: too tired to stay awake.'],
  ['The river is ___ the children to cross.', 'too deep for', ['too deep to', 'M_TOO_FOR_VERB'], ['too deep that', 'M_TOO_THAT'], ['too deep for to', 'M_TOO_FOR_TO'], 'Before the children use for: too deep for the children.'],
  ['This tea is ___ drink.', 'too sweet to', ['too sweet for to', 'M_TOO_FOR_TO'], ['too sweet', 'M_TOO_MISSING_TO'], ['too sweet that', 'M_TOO_THAT'], 'Too + adjective + to + verb: too sweet to drink.'],
  ['The gate was ___ Baraka to climb.', 'too high for', ['too high to', 'M_TOO_FOR_VERB'], ['too high that', 'M_TOO_THAT'], ['too high for to', 'M_TOO_FOR_TO'], 'Before a person use for: too high for Baraka.'],
  ['It was ___ go outside, so we stayed in.', 'too cold to', ['too cold for to', 'M_TOO_FOR_TO'], ['too cold that', 'M_TOO_THAT'], ['too cold', 'M_TOO_MISSING_TO'], 'Before a verb use to: too cold to go outside.'],
  ['The stone was ___ the little boy to move.', 'too big for', ['too big to', 'M_TOO_FOR_VERB'], ['too big that', 'M_TOO_THAT'], ['too big for to', 'M_TOO_FOR_TO'], 'Before the little boy use for: too big for the little boy.'],
];
// ---------------------------------------------------------------- must / should with an adverb
const MUST = [
  ['You should ___ to elders.', 'speak politely', ['speak polite', 'M_MODAL_ADJECTIVE'], ['to speak politely', 'M_MODAL_TO'], ['speaking politely', 'M_MODAL_VERB_FORM'], 'Should + plain verb + adverb: speak politely.'],
  ['Children must ___ across the road.', 'walk carefully', ['walk careful', 'M_MODAL_ADJECTIVE'], ['to walk carefully', 'M_MODAL_TO'], ['walks carefully', 'M_MODAL_VERB_FORM'], 'Must + plain verb + adverb: walk carefully.'],
  ['At the table you should ___ your food.', 'eat slowly', ['eat slow', 'M_MODAL_ADJECTIVE'], ['eats slowly', 'M_MODAL_VERB_FORM'], ['to eat slowly', 'M_MODAL_TO'], 'Should + plain verb + adverb: eat slowly.'],
  ['Passengers ___ a seat belt. It is the law.', 'must wear', ['should wear', 'M_MODAL_STRENGTH'], ['must to wear', 'M_MODAL_TO'], ['must wearing', 'M_MODAL_VERB_FORM'], 'A law is a strong rule, so must.'],
  ['You ___ wash your hands before eating. It is good advice.', 'should wash', ['must wash', 'M_MODAL_STRENGTH'], ['should to wash', 'M_MODAL_TO'], ['should washing', 'M_MODAL_VERB_FORM'], 'Advice is gentle, so should.'],
  ['The learners must ___ when the teacher speaks.', 'listen carefully', ['listen careful', 'M_MODAL_ADJECTIVE'], ['to listen carefully', 'M_MODAL_TO'], ['listening carefully', 'M_MODAL_VERB_FORM'], 'Must + plain verb + adverb: listen carefully.'],
  ['You must ___ in the library.', 'speak quietly', ['speak quiet', 'M_MODAL_ADJECTIVE'], ['speaks quietly', 'M_MODAL_VERB_FORM'], ['to speak quietly', 'M_MODAL_TO'], 'Must + plain verb + adverb: speak quietly.'],
  ['Drivers must ___ near a school.', 'drive slowly', ['drive slow', 'M_MODAL_ADJECTIVE'], ['drives slowly', 'M_MODAL_VERB_FORM'], ['to drive slowly', 'M_MODAL_TO'], 'Must + plain verb + adverb: drive slowly.'],
];
// ---------------------------------------------------------------- possessive pronouns
const POSS = [
  ['That cup is ___.', 'mine', ['my', 'M_POSS_DET_FOR_PRONOUN'], ['yours', 'M_POSS_WRONG_PERSON'], ['hers', 'M_POSS_WRONG_PERSON'], 'Nothing follows the gap, so the word that stands alone: mine.'],
  ['Is this ___ book, Wafula?', 'your', ['yours', 'M_POSS_PRONOUN_BEFORE_NOUN'], ['my', 'M_POSS_WRONG_PERSON'], ['her', 'M_POSS_WRONG_PERSON'], 'A noun (book) follows the gap, so your.'],
  ['Amina lost a pen. The blue pen is ___.', 'hers', ['her', 'M_POSS_DET_FOR_PRONOUN'], ["her's", 'M_POSS_APOSTROPHE'], ['his', 'M_POSS_WRONG_PERSON'], 'Nothing follows the gap and the owner is Amina: hers.'],
  ['These seats belong to the visitors. They are ___.', 'theirs', ['their', 'M_POSS_DET_FOR_PRONOUN'], ["their's", 'M_POSS_APOSTROPHE'], ['ours', 'M_POSS_WRONG_PERSON'], 'Nothing follows the gap and the owners are the visitors: theirs.'],
  ['Mama lost ___ keys.', 'her', ['hers', 'M_POSS_PRONOUN_BEFORE_NOUN'], ['his', 'M_POSS_WRONG_PERSON'], ['their', 'M_POSS_WRONG_PERSON'], 'A noun (keys) follows the gap and Mama is a woman: her.'],
  ['The house on the hill belongs to us. It is ___.', 'ours', ['our', 'M_POSS_DET_FOR_PRONOUN'], ["our's", 'M_POSS_APOSTROPHE'], ['theirs', 'M_POSS_WRONG_PERSON'], 'Nothing follows the gap and the owners are us: ours.'],
  ['We left ___ bags at the gate.', 'our', ['ours', 'M_POSS_PRONOUN_BEFORE_NOUN'], ['my', 'M_POSS_WRONG_PERSON'], ['their', 'M_POSS_WRONG_PERSON'], 'A noun (bags) follows the gap and we are the owners: our.'],
  ['You were first, so the prize is ___.', 'yours', ['your', 'M_POSS_DET_FOR_PRONOUN'], ["your's", 'M_POSS_APOSTROPHE'], ['mine', 'M_POSS_WRONG_PERSON'], 'Nothing follows the gap and the owner is you: yours.'],
];
// ---------------------------------------------------------------- comparative and superlative
const COMP = [
  ['Kamau is ___ Baraka.', 'taller than', ['taller then', 'M_ADJ_THAN'], ['more taller than', 'M_ADJ_DOUBLE_COMPARATIVE'], ['tallest', 'M_ADJ_SUPERLATIVE_FOR_TWO'], 'Two people are compared: taller than.'],
  ['This is the ___ story I have read.', 'most interesting', ['interestingest', 'M_ADJ_LONG_ER'], ['more interesting', 'M_ADJ_SUPERLATIVE_FOR_TWO'], ['most interestingest', 'M_ADJ_DOUBLE_COMPARATIVE'], 'Interesting is a long word, and many stories are compared: most interesting.'],
  ['This mango is ___ than that one.', 'better', ['gooder', 'M_ADJ_IRREGULAR'], ['more better', 'M_ADJ_DOUBLE_COMPARATIVE'], ['best', 'M_ADJ_SUPERLATIVE_FOR_TWO'], 'Good is special: good, better, best. Two mangoes: better.'],
  ['Of the two sisters, Achieng is the ___.', 'taller', ['tallest', 'M_ADJ_SUPERLATIVE_FOR_TWO'], ['more taller', 'M_ADJ_DOUBLE_COMPARATIVE'], ['most taller', 'M_ADJ_DOUBLE_COMPARATIVE'], 'Two sisters are compared: taller.'],
  ['Today is ___ yesterday.', 'hotter than', ['hoter than', 'M_ADJ_SPELLING'], ['more hotter than', 'M_ADJ_DOUBLE_COMPARATIVE'], ['hottest', 'M_ADJ_SUPERLATIVE_FOR_TWO'], 'Hot doubles its last letter: hotter than.'],
  ['Nyambura is the ___ runner in the class of forty.', 'fastest', ['faster', 'M_ADJ_SUPERLATIVE_FOR_TWO'], ['more fastest', 'M_ADJ_DOUBLE_COMPARATIVE'], ['fastiest', 'M_ADJ_SPELLING'], 'Forty runners are compared: fastest.'],
  ['Her cough is ___ today than it was yesterday.', 'worse', ['worser', 'M_ADJ_IRREGULAR'], ['badder', 'M_ADJ_IRREGULAR'], ['more worse', 'M_ADJ_DOUBLE_COMPARATIVE'], 'Bad is special: bad, worse, worst.'],
  ['This road is ___ the old road.', 'safer than', ['more safer than', 'M_ADJ_DOUBLE_COMPARATIVE'], ['safest', 'M_ADJ_SUPERLATIVE_FOR_TWO'], ['safer then', 'M_ADJ_THAN'], 'Two roads are compared: safer than.'],
  ['My little brother is ___ me.', 'happier than', ['happyer than', 'M_ADJ_SPELLING'], ['more happier than', 'M_ADJ_DOUBLE_COMPARATIVE'], ['happiest', 'M_ADJ_SUPERLATIVE_FOR_TWO'], 'Happy changes y to i: happier than.'],
];
// ---------------------------------------------------------------- adjective order
const ORDER = [
  ['Grandmother sat on ___.', 'a big old stool', ['an old big stool', 'M_ADJ_ORDER_AGE'], ['a stool big old', 'M_ADJ_AFTER_NOUN'], ['a big stool old', 'M_ADJ_AFTER_NOUN'], 'Size comes before age, and both come before the noun.'],
  ['Wanjiru bought ___.', 'a small red bag', ['a red small bag', 'M_ADJ_ORDER_SHAPE_FIRST'], ['a bag small red', 'M_ADJ_AFTER_NOUN'], ['a small bag red', 'M_ADJ_AFTER_NOUN'], 'Size comes before colour, and both come before the noun.'],
  ['He wore ___.', 'a big round hat', ['a round big hat', 'M_ADJ_ORDER_SHAPE_FIRST'], ['a hat big round', 'M_ADJ_AFTER_NOUN'], ['a big hat round', 'M_ADJ_AFTER_NOUN'], 'Size comes before shape, and both come before the noun.'],
  ['Mama cooked in ___.', 'a large black pot', ['a black large pot', 'M_ADJ_ORDER_SHAPE_FIRST'], ['a pot large black', 'M_ADJ_AFTER_NOUN'], ['a large pot black', 'M_ADJ_AFTER_NOUN'], 'Size comes before colour, and both come before the noun.'],
  ['The shop sells ___.', 'small round baskets', ['round small baskets', 'M_ADJ_ORDER_SHAPE_FIRST'], ['baskets small round', 'M_ADJ_AFTER_NOUN'], ['small baskets round', 'M_ADJ_AFTER_NOUN'], 'Size comes before shape, and both come before the noun: small round baskets.'],
  ['Kamau found ___ on the path.', 'a small old round coin', ['an old small round coin', 'M_ADJ_ORDER_AGE'], ['a round small old coin', 'M_ADJ_ORDER_SHAPE_FIRST'], ['a coin small old round', 'M_ADJ_AFTER_NOUN'], 'Size, then age, then shape, then the noun.'],
  ['My teacher drives ___.', 'a new blue car', ['a blue new car', 'M_ADJ_ORDER_SHAPE_FIRST'], ['a car new blue', 'M_ADJ_AFTER_NOUN'], ['a new car blue', 'M_ADJ_AFTER_NOUN'], 'Age comes before colour, and both come before the noun.'],
  ['Wafula carried ___ to school.', 'a large green bag', ['a green large bag', 'M_ADJ_ORDER_SHAPE_FIRST'], ['a bag large green', 'M_ADJ_AFTER_NOUN'], ['a large bag green', 'M_ADJ_AFTER_NOUN'], 'Size comes before colour, and both come before the noun.'],
];
// ---------------------------------------------------------------- few, a few, little, a little
const FEW = [
  ['There is ___ water in the jug, so we must fetch more.', 'little', ['few', 'M_QUANT_FEW_UNCOUNTABLE'], ['a few', 'M_QUANT_FEW_UNCOUNTABLE'], ['a little', 'M_QUANT_NEGATIVE_POSITIVE'], 'Water cannot be counted, so little. We must fetch more, so hardly any: little.'],
  ['We have ___ chairs left, so some learners must stand.', 'few', ['little', 'M_QUANT_LITTLE_COUNTABLE'], ['a little', 'M_QUANT_LITTLE_COUNTABLE'], ['a few', 'M_QUANT_NEGATIVE_POSITIVE'], 'Chairs can be counted, so few. Some must stand, so hardly any: few.'],
  ['We have ___ eggs, so I can bake a small cake.', 'a few', ['a little', 'M_QUANT_LITTLE_COUNTABLE'], ['little', 'M_QUANT_LITTLE_COUNTABLE'], ['few', 'M_QUANT_NEGATIVE_POSITIVE'], 'Eggs can be counted, so a few. I can bake, so there are some: a few.'],
  ['There is ___ milk in the cup, enough for my tea.', 'a little', ['a few', 'M_QUANT_FEW_UNCOUNTABLE'], ['few', 'M_QUANT_FEW_UNCOUNTABLE'], ['little', 'M_QUANT_NEGATIVE_POSITIVE'], 'Milk cannot be counted, so a little. There is enough, so some: a little.'],
  ['We do not have ___ time left.', 'much', ['many', 'M_QUANT_MUCH_MANY'], ['few', 'M_QUANT_FEW_UNCOUNTABLE'], ['a few', 'M_QUANT_FEW_UNCOUNTABLE'], 'Time cannot be counted, so much.'],
  ['How ___ goats does your uncle keep?', 'many', ['much', 'M_QUANT_MUCH_MANY'], ['little', 'M_QUANT_LITTLE_COUNTABLE'], ['a little', 'M_QUANT_LITTLE_COUNTABLE'], 'Goats can be counted, so many.'],
  ['Mama added ___ sugar to the porridge, just a spoonful.', 'a little', ['a few', 'M_QUANT_FEW_UNCOUNTABLE'], ['few', 'M_QUANT_FEW_UNCOUNTABLE'], ['many', 'M_QUANT_MUCH_MANY'], 'Sugar cannot be counted, so a little.'],
  ['Only ___ children came to school on the rainy day.', 'a few', ['a little', 'M_QUANT_LITTLE_COUNTABLE'], ['little', 'M_QUANT_LITTLE_COUNTABLE'], ['much', 'M_QUANT_MUCH_MANY'], 'Children can be counted, so a few.'],
  ['There is ___ hope that the rains will come, since the sky is clear.', 'little', ['few', 'M_QUANT_FEW_UNCOUNTABLE'], ['a few', 'M_QUANT_FEW_UNCOUNTABLE'], ['a little', 'M_QUANT_NEGATIVE_POSITIVE'], 'Hope cannot be counted, so little. The sky is clear, so hardly any hope: little.'],
];
// ---------------------------------------------------------------- a lot of, each, all, enough, most, least
const QUANT = [
  ['Each of the girls ___ a bag.', 'has', ['have', 'M_QUANT_EACH_PLURAL'], ['are', 'M_QUANT_EACH_PLURAL'], ['were', 'M_QUANT_EACH_PLURAL'], 'Each means one at a time, so the verb is singular: has.'],
  ['All the ___ were clapping.', 'learners', ['learner', 'M_QUANT_ALL_SINGULAR'], ['a learner', 'M_QUANT_ALL_SINGULAR'], ['each learner', 'M_QUANT_ALL_SINGULAR'], 'All talks about many, so the noun is plural: learners.'],
  ['We do not have ___ for everyone to eat.', 'enough food', ['food enough', 'M_QUANT_ENOUGH_POSITION'], ['foods enough', 'M_QUANT_ENOUGH_POSITION'], ['enough of food', 'M_QUANT_ENOUGH_POSITION'], 'Enough goes before the noun: enough food.'],
  ['___ learners in our class walk to school.', 'Most of the', ['Most of', 'M_QUANT_OF_THE_MISSING'], ['The most of', 'M_QUANT_OF_THE_MISSING'], ['Most the', 'M_QUANT_OF_THE_MISSING'], 'After most of, add the: most of the learners.'],
  ['Of all the shops in town, this one sells the ___ sugar.', 'least', ['less', 'M_QUANT_LEAST_LESS'], ['lesser', 'M_QUANT_LEAST_LESS'], ['littlest', 'M_QUANT_LEAST_LESS'], 'Many shops are compared, so least.'],
  ['This shop sells ___ sugar than that shop.', 'less', ['least', 'M_QUANT_LEAST_LESS'], ['lesser', 'M_QUANT_LEAST_LESS'], ['littler', 'M_QUANT_LEAST_LESS'], 'Two shops are compared, so less.'],
  ['There are ___ mangoes on the tree this year.', 'a lot of', ['a lots of', 'M_QUANT_LEAST_LESS'], ['lot of', 'M_QUANT_LEAST_LESS'], ['lots', 'M_QUANT_LEAST_LESS'], 'Write a lot of or lots of, never a lots of.'],
  ['Each learner in Grade 5 ___ a desk.', 'has', ['have', 'M_QUANT_EACH_PLURAL'], ['are having', 'M_QUANT_EACH_PLURAL'], ['were', 'M_QUANT_EACH_PLURAL'], 'Each learner means one at a time, so has.'],
];
// ---------------------------------------------------------------- will and shall
const FUT = [
  ['Tomorrow we will ___ to Nakuru.', 'go', ['went', 'M_FUT_WILL_PAST'], ['going', 'M_FUT_WILL_ING'], ['goes', 'M_FUT_WILL_S'], 'After will, the plain verb: will go.'],
  ['My mother will ___ us a story tonight.', 'tell', ['told', 'M_FUT_WILL_PAST'], ['tells', 'M_FUT_WILL_S'], ['telling', 'M_FUT_WILL_ING'], 'After will, the plain verb: will tell.'],
  ['Next week the school will ___ a match.', 'play', ['played', 'M_FUT_WILL_PAST'], ['plays', 'M_FUT_WILL_S'], ['playing', 'M_FUT_WILL_ING'], 'After will, the plain verb: will play.'],
  ['I promise that I ___ you tomorrow.', 'will help|shall help', ['help', 'M_FUT_PRESENT_FOR_FUTURE'], ['will helps', 'M_FUT_WILL_S'], ['will helped', 'M_FUT_WILL_PAST'], 'A promise about tomorrow needs will or shall.'],
  ['We ___ Grandmother next Saturday.', 'shall visit|will visit', ['visiting', 'M_FUT_WILL_ING'], ['will shall visit', 'M_FUT_DOUBLE_MODAL'], ['shall visited', 'M_FUT_WILL_PAST'], 'One helper verb, then the plain verb: shall visit.'],
  ['It ___ soon, because the clouds are dark.', 'will rain', ['rain', 'M_FUT_PRESENT_FOR_FUTURE'], ['will rains', 'M_FUT_WILL_S'], ['will raining', 'M_FUT_WILL_ING'], 'Dark clouds point to the future: will rain.'],
  ['I am sure Mwende ___ the race next week.', 'will win', ['win', 'M_FUT_PRESENT_FOR_FUTURE'], ['will won', 'M_FUT_WILL_PAST'], ['will winning', 'M_FUT_WILL_ING'], 'A sure guess about next week: will win.'],
  ['My uncle ___ us a goat for Christmas.', 'will give|shall give', ['give', 'M_FUT_PRESENT_FOR_FUTURE'], ['will gives', 'M_FUT_WILL_S'], ['will gave', 'M_FUT_WILL_PAST'], 'Christmas has not come yet: will give.'],
];
// ---------------------------------------------------------------- question tags
const TAG = [
  ['You are coming to the party, ___?', "aren't you", ["isn't it", 'M_TAG_INVARIABLE'], ['are you', 'M_TAG_SAME_SIGN'], ["don't you", 'M_TAG_WRONG_HELPER'], 'The statement has are and you: aren\'t you.'],
  ['Mwangi plays well, ___?', "doesn't he", ['does he', 'M_TAG_SAME_SIGN'], ["isn't he", 'M_TAG_WRONG_HELPER'], ["isn't it", 'M_TAG_INVARIABLE'], 'Plays goes with does, and the statement is positive: doesn\'t he.'],
  ['She likes tea, ___?', "doesn't she", ["isn't she", 'M_TAG_WRONG_HELPER'], ['does she', 'M_TAG_SAME_SIGN'], ["isn't it", 'M_TAG_INVARIABLE'], 'Likes goes with does, and the statement is positive: doesn\'t she.'],
  ['Baraka is a good footballer, ___?', "isn't he", ["isn't Baraka", 'M_TAG_NOUN_FOR_PRONOUN'], ['is he', 'M_TAG_SAME_SIGN'], ["doesn't he", 'M_TAG_WRONG_HELPER'], 'The tag uses a pronoun and the opposite sign: isn\'t he.'],
  ['The bus is late, ___?', "isn't it", ['is not it', 'M_TAG_FULL_FORM'], ['is it', 'M_TAG_SAME_SIGN'], ["doesn't it", 'M_TAG_WRONG_HELPER'], 'The statement has is: isn\'t it.'],
  ['They can swim, ___?', "can't they", ["isn't it", 'M_TAG_INVARIABLE'], ['can they', 'M_TAG_SAME_SIGN'], ["don't they", 'M_TAG_WRONG_HELPER'], 'The statement has can: can\'t they.'],
  ['We have finished, ___?', "haven't we", ["isn't it", 'M_TAG_INVARIABLE'], ['have we', 'M_TAG_SAME_SIGN'], ["don't we", 'M_TAG_WRONG_HELPER'], 'The statement has have: haven\'t we.'],
  ['Achieng did not come, ___?', 'did she', ["didn't she", 'M_TAG_SAME_SIGN'], ["isn't it", 'M_TAG_INVARIABLE'], ['does she', 'M_TAG_WRONG_HELPER'], 'The statement is negative, so the tag is positive: did she.'],
];
// ---------------------------------------------------------------- adverbs
const ADV = [
  ['Wambui spoke ___ so the baby would not wake.', 'softly|quietly|gently', ['soft', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['quiet', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['gentle', 'M_ADV_ADJECTIVE_FOR_ADVERB'], 'The word tells how she spoke, so the adverb: softly.'],
  ['Akinyi sings very ___.', 'well', ['good', 'M_ADV_GOOD_WELL'], ['goodly', 'M_ADV_GOOD_WELL'], ['nice', 'M_ADV_ADJECTIVE_FOR_ADVERB'], 'After a verb, well.'],
  ['The farmers work ___ in the shamba.', 'hard', ['hardly', 'M_ADV_HARD_HARDLY'], ['hardily', 'M_ADV_HARD_HARDLY'], ['heavy', 'M_ADV_ADJECTIVE_FOR_ADVERB'], 'The adverb of hard is hard.'],
  ['Juma ___ to school on foot.', 'always walks', ['walks always', 'M_ADV_POSITION'], ['frequent walks', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['walks frequent', 'M_ADV_ADJECTIVE_FOR_ADVERB'], 'A frequency adverb goes before the main verb: always walks.'],
  ['The old man walked ___ with his stick.', 'slowly', ['slow', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['slower', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['slowness', 'M_ADV_ADJECTIVE_FOR_ADVERB'], 'The word tells how he walked, so the adverb: slowly.'],
  ['Wanjiru ___ late for assembly.', 'is never', ['never is', 'M_ADV_POSITION'], ['never', 'M_ADV_POSITION'], 'A frequency adverb goes after is: is never.'],
  ['The goalkeeper jumped ___ and caught the ball.', 'bravely', ['brave', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['braver', 'M_ADV_ADJECTIVE_FOR_ADVERB'], ['bravest', 'M_ADV_ADJECTIVE_FOR_ADVERB'], 'The word tells how he jumped, so the adverb: bravely.'],
];
const ADV_KIND = [
  ['In "She often visits her aunt", the adverb often tells us ___.', 'how often', ['when', 'M_ADV_TYPE_CONFUSION'], ['where', 'M_ADV_TYPE_CONFUSION'], ['how', 'M_ADV_TYPE_CONFUSION'], 'Often says how many times: it is an adverb of frequency.'],
  ['In "The children play outside", the adverb outside tells us ___.', 'where', ['when', 'M_ADV_TYPE_CONFUSION'], ['how', 'M_ADV_TYPE_CONFUSION'], ['how often', 'M_ADV_TYPE_CONFUSION'], 'Outside says the place: it is an adverb of place.'],
  ['In "Wafula walked slowly", the adverb slowly tells us ___.', 'how', ['when', 'M_ADV_TYPE_CONFUSION'], ['where', 'M_ADV_TYPE_CONFUSION'], ['how often', 'M_ADV_TYPE_CONFUSION'], 'Slowly says the way he walked: it is an adverb of manner.'],
  ['In "We will leave tomorrow", the adverb tomorrow tells us ___.', 'when', ['where', 'M_ADV_TYPE_CONFUSION'], ['how', 'M_ADV_TYPE_CONFUSION'], ['how often', 'M_ADV_TYPE_CONFUSION'], 'Tomorrow says the time: it is an adverb of time.'],
  ['In "He seldom eats fish", the adverb seldom tells us ___.', 'how often', ['when', 'M_ADV_TYPE_CONFUSION'], ['where', 'M_ADV_TYPE_CONFUSION'], ['how', 'M_ADV_TYPE_CONFUSION'], 'Seldom says how often: it is an adverb of frequency.'],
  ['In "Come here", the adverb here tells us ___.', 'where', ['when', 'M_ADV_TYPE_CONFUSION'], ['how', 'M_ADV_TYPE_CONFUSION'], ['how often', 'M_ADV_TYPE_CONFUSION'], 'Here says the place: it is an adverb of place.'],
  ['In "She answered politely", the adverb politely tells us ___.', 'how', ['when', 'M_ADV_TYPE_CONFUSION'], ['where', 'M_ADV_TYPE_CONFUSION'], ['how often', 'M_ADV_TYPE_CONFUSION'], 'Politely says the way she answered: it is an adverb of manner.'],
  ['In "I will see you later", the adverb later tells us ___.', 'when', ['where', 'M_ADV_TYPE_CONFUSION'], ['how', 'M_ADV_TYPE_CONFUSION'], ['how often', 'M_ADV_TYPE_CONFUSION'], 'Later says the time: it is an adverb of time.'],
];
// ---------------------------------------------------------------- could and would
const COULD = [
  ['When I was five, I ___ climb trees.', 'could', ['can', 'M_MOD_CAN_FOR_COULD'], ['cans', 'M_MOD_CAN_FOR_COULD'], ['can to', 'M_MOD_CAN_FOR_COULD'], 'The time is in the past, so could.'],
  ['If I had a bicycle, I ___ ride to school.', 'would', ['will', 'M_MOD_WILL_FOR_WOULD'], ['can', 'M_MOD_WILL_FOR_WOULD'], ['shall', 'M_MOD_WILL_FOR_WOULD'], 'The if-part is in the past tense, so the result uses would.'],
  ['Long ago, my grandfather ___ walk ten kilometres a day.', 'could|would', ['can', 'M_MOD_CAN_FOR_COULD'], ['will', 'M_MOD_WILL_FOR_WOULD'], ['can to', 'M_MOD_CAN_FOR_COULD'], 'Long ago is in the past: could (he was able to) or would (he used to).'],
  ['He said he could ___ us.', 'help', ['helped', 'M_MOD_PAST_AFTER_MODAL'], ['helps', 'M_MOD_PAST_AFTER_MODAL'], ['helping', 'M_MOD_PAST_AFTER_MODAL'], 'After could, the plain verb: could help.'],
  ['She would ___ if she had time.', 'come', ['came', 'M_MOD_PAST_AFTER_MODAL'], ['comes', 'M_MOD_PAST_AFTER_MODAL'], ['coming', 'M_MOD_PAST_AFTER_MODAL'], 'After would, the plain verb: would come.'],
  ['___ eggs could you carry in one basket?', 'How many', ['How could many', 'M_MOD_HOW_MANY_ORDER'], ['How many could', 'M_MOD_HOW_MANY_ORDER'], ['How could', 'M_MOD_HOW_MANY_ORDER'], 'Keep how many together at the start: How many eggs could you carry.'],
  ['Could you please ___ the window?', 'open', ['opened', 'M_MOD_PAST_AFTER_MODAL'], ['opens', 'M_MOD_PAST_AFTER_MODAL'], ['opening', 'M_MOD_PAST_AFTER_MODAL'], 'After could, the plain verb: could open.'],
  ['If it rained, we ___ stay at home.', 'would', ['will', 'M_MOD_WILL_FOR_WOULD'], ['can', 'M_MOD_WILL_FOR_WOULD'], ['shall', 'M_MOD_WILL_FOR_WOULD'], 'The if-part is in the past tense, so the result uses would.'],
];
// ---------------------------------------------------------------- conjunctions
const CONJ = [
  ['Ali is small, ___ he runs very fast.', 'but|yet', ['because', 'M_CONJ_BECAUSE_FOR_BUT'], ['or', 'M_CONJ_WRONG_MEANING'], ['since', 'M_CONJ_BECAUSE_FOR_BUT'], 'Being small and running fast is a surprise: but or yet.'],
  ['Would you like tea ___ milk?', 'or', ['and', 'M_CONJ_OR_AND'], ['but', 'M_CONJ_OR_AND'], ['also', 'M_CONJ_ALSO_JOINING'], 'You choose one of two: or.'],
  ['We stayed indoors ___ it was raining.', 'because|since', ['but', 'M_CONJ_BECAUSE_FOR_BUT'], ['or', 'M_CONJ_WRONG_MEANING'], ['yet', 'M_CONJ_BECAUSE_FOR_BUT'], 'The rain is the reason: because or since.'],
  ['We bought sugar ___ rice.', 'and', ['also', 'M_CONJ_ALSO_JOINING'], ['because', 'M_CONJ_WRONG_MEANING'], ['but', 'M_CONJ_WRONG_MEANING'], 'Two things were bought: and.'],
  ['___ it was raining, we stayed at home.', 'Because|Since', ['But', 'M_CONJ_BECAUSE_FOR_BUT'], ['Or', 'M_CONJ_WRONG_MEANING'], ['Yet', 'M_CONJ_BECAUSE_FOR_BUT'], 'The rain is the reason: because or since.'],
  ['Kamau studied hard, ___ he did not pass the test.', 'but|yet', ['because', 'M_CONJ_BECAUSE_FOR_BUT'], ['or', 'M_CONJ_WRONG_MEANING'], ['since', 'M_CONJ_BECAUSE_FOR_BUT'], 'Studying hard and not passing is a surprise: but or yet.'],
  ['You may take only one sweet, a red one ___ a green one.', 'or', ['and', 'M_CONJ_OR_AND'], ['because', 'M_CONJ_WRONG_MEANING'], ['yet', 'M_CONJ_WRONG_MEANING'], 'You choose one of the two: or.'],
  ['Mama was happy ___ her children had passed.', 'because|since', ['but', 'M_CONJ_BECAUSE_FOR_BUT'], ['or', 'M_CONJ_WRONG_MEANING'], ['yet', 'M_CONJ_BECAUSE_FOR_BUT'], 'The children passing is the reason: because.'],
];
const CONJ_SENT = [
  ['', 'Because it was raining, we stayed at home.', ['Because it was raining, so we stayed at home.', 'M_CONJ_DOUBLE'], ['It was raining, but we stayed at home.', 'M_CONJ_BECAUSE_FOR_BUT', 'The two parts do not contrast: the rain is the reason, so but does not fit.'], ['We stayed at home, or it was raining.', 'M_CONJ_WRONG_MEANING'], 'Use one joining word for two ideas.'],
  ['', 'Wanjiru is clever, yet she is humble.', ['Wanjiru is clever, yet but she is humble.', 'M_CONJ_DOUBLE'], ['Wanjiru is clever because she is humble.', 'M_CONJ_WRONG_MEANING'], ['Wanjiru is clever or she is humble.', 'M_CONJ_WRONG_MEANING'], 'Yet joins two ideas that are a surprise together.'],
  ['', 'You can have rice or ugali, but not both.', ['You can have rice and ugali, but not both.', 'M_CONJ_OR_AND', 'This says both, and then says not both. When you choose one of two things, use or.'], ['You can have rice, because ugali, but not both.', 'M_CONJ_WRONG_MEANING'], ['You can have rice also ugali, but not both.', 'M_CONJ_ALSO_JOINING'], 'A choice between two things uses or.'],
  ['', 'We were late because the bus broke down.', ['Because the bus broke down, so we were late.', 'M_CONJ_DOUBLE'], ['We were late but the bus broke down.', 'M_CONJ_BECAUSE_FOR_BUT'], ['We were late or the bus broke down.', 'M_CONJ_WRONG_MEANING'], 'The breakdown is the reason: because.'],
  ['', 'Otieno is tall, but his brother is short.', ['Otieno is tall, because his brother is short.', 'M_CONJ_BECAUSE_FOR_BUT'], ['Otieno is tall, or his brother is short.', 'M_CONJ_WRONG_MEANING'], ['Otieno is tall also his brother is short.', 'M_CONJ_ALSO_JOINING'], 'Tall and short are a contrast: but.'],
  ['', 'I cannot come since I am ill.', ['I cannot come since, so I am ill.', 'M_CONJ_DOUBLE'], ['I cannot come but I am ill.', 'M_CONJ_BECAUSE_FOR_BUT'], ['I cannot come or I am ill.', 'M_CONJ_WRONG_MEANING'], 'Being ill is the reason: since.'],
];
// ---------------------------------------------------------------- interrogatives
const INTER = [
  ['___ is your class teacher?', 'Who', ['What', 'M_INT_WHO_WHAT'], ['When', 'M_INT_WHEN_WHERE_WHY'], ['Why', 'M_INT_WHEN_WHERE_WHY'], 'The answer is a person: who.'],
  ['___ did you arrive late? Because the bus broke down.', 'Why', ['When', 'M_INT_WHEN_WHERE_WHY'], ['Who', 'M_INT_WHO_WHAT'], ['What', 'M_INT_WHO_WHAT'], 'The answer gives a reason, so the question word is why.'],
  ['___ did the match start? At four o\'clock.', 'When', ['Why', 'M_INT_WHEN_WHERE_WHY'], ['Where', 'M_INT_WHEN_WHERE_WHY'], ['Who', 'M_INT_WHO_WHAT'], 'The answer gives a time, so the question word is when.'],
  ['___ are you doing? I am washing my uniform.', 'What', ['Who', 'M_INT_WHO_WHAT'], ['When', 'M_INT_WHEN_WHERE_WHY'], ['Why', 'M_INT_WHEN_WHERE_WHY'], 'The answer tells what she is doing: what.'],
  ['What ___ doing with my pen?', 'are you', ['you are', 'M_INT_WORD_ORDER'], ['you', 'M_INT_DO_MISSING'], ['do you', 'M_INT_DO_MISSING'], 'In a question the helper verb comes before the subject: are you.'],
  ['Why ___ late?', 'did you come', ['you came', 'M_INT_DO_MISSING'], ['you come', 'M_INT_DO_MISSING'], ['you did come', 'M_INT_WORD_ORDER'], 'A question about the past needs did, and then the plain verb: did you come.'],
  ['Who ___ came to the party?', 'else', ['other else', 'M_INT_ELSE_POSITION'], ['else other', 'M_INT_ELSE_POSITION'], ['more else', 'M_INT_ELSE_POSITION'], 'Else on its own already means in addition: who else.'],
  ['How ___ more rice do we need?', 'much', ['many', 'M_INT_HOW_MUCH_MANY'], ['more', 'M_INT_HOW_MUCH_MANY'], 'Rice cannot be counted one by one: how much.'],
  ['How ___ goats does he have?', 'many', ['much', 'M_INT_HOW_MUCH_MANY'], ['more', 'M_INT_HOW_MUCH_MANY'], 'Goats can be counted: how many.'],
];
// ---------------------------------------------------------------- same in singular and plural
const SAME = [
  ['The farmer keeps twenty ___.', 'sheep', ['sheeps', 'M_NOUN_SHEEPS'], ['sheepes', 'M_NOUN_SHEEPS'], ['sheepen', 'M_NOUN_SHEEPS'], 'Sheep is the same in singular and plural.'],
  ['Many ___ were playing outside.', 'children', ['childs', 'M_NOUN_OVERREGULAR'], ['childrens', 'M_NOUN_OVERREGULAR'], ['childes', 'M_NOUN_OVERREGULAR'], 'The plural of child is children.'],
  ['Fifty sheep ___ on the hill.', 'are', ['is', 'M_NOUN_VERB_AGREEMENT'], ['was', 'M_NOUN_VERB_AGREEMENT'], ['does', 'M_NOUN_VERB_AGREEMENT'], 'Fifty is many, so the verb is plural: are.'],
  ['I saw ___ in the river.', 'a fish', ['a fishes', 'M_NOUN_A_BEFORE_PLURAL'], ['a fishs', 'M_NOUN_A_BEFORE_PLURAL'], ['an fishes', 'M_NOUN_A_BEFORE_PLURAL'], 'A means one, so the singular: a fish.'],
  ['We saw two ___ near the forest.', 'deer', ['deers', 'M_NOUN_SHEEPS'], ['deeres', 'M_NOUN_SHEEPS'], ["deer's", 'M_NOUN_SHEEPS'], 'Deer is the same in singular and plural.'],
  ['Five ___ landed at the airport this morning.', 'aircraft', ['aircrafts', 'M_NOUN_SHEEPS'], ['aircraftes', 'M_NOUN_SHEEPS'], 'Aircraft is the same in singular and plural.'],
  ['The dentist checked my ___.', 'teeth', ['tooths', 'M_NOUN_OVERREGULAR'], ['teeths', 'M_NOUN_OVERREGULAR'], ['toothes', 'M_NOUN_OVERREGULAR'], 'The plural of tooth is teeth.'],
  ['Six ___ stood at the gate.', 'men', ['mans', 'M_NOUN_OVERREGULAR'], ['mens', 'M_NOUN_OVERREGULAR'], ['man', 'M_NOUN_OVERREGULAR'], 'The plural of man is men.'],
];
// ---------------------------------------------------------------- in, on, at
const TIME = [
  ['We have a test ___ Monday.', 'on', ['in', 'M_PREP_DAY_IN'], ['at', 'M_PREP_DAY_IN'], 'Days take on.'],
  ['The bus leaves ___ 8 o\'clock.', 'at', ['in', 'M_PREP_CLOCK_IN'], ['on', 'M_PREP_CLOCK_IN'], 'Exact clock times take at.'],
  ['I wake up early ___ the morning.', 'in', ['at', 'M_PREP_PART_OF_DAY'], ['on', 'M_PREP_PART_OF_DAY'], 'The morning takes in.'],
  ['The cup is ___ the table.', 'on', ['in', 'M_PREP_PLACE'], ['inside', 'M_PREP_PLACE'], 'It rests on the top of the table: on.'],
  ['My birthday is ___ June.', 'in', ['on', 'M_PREP_PART_OF_DAY'], ['at', 'M_PREP_PART_OF_DAY'], 'Months take in.'],
  ['We wait for the matatu ___ the gate.', 'at', ['in', 'M_PREP_PLACE'], ['on', 'M_PREP_PLACE'], 'A point such as the gate takes at.'],
  ['The children are ___ the classroom now.', 'in', ['on', 'M_PREP_PLACE'], ['at', 'M_PREP_PLACE'], 'Inside the classroom: in.'],
  ['The owl hunts ___ night.', 'at', ['in', 'M_PREP_PART_OF_DAY'], ['on', 'M_PREP_PART_OF_DAY'], 'Night takes at.'],
];
const DIR = [
  ['After school I went ___.', 'home', ['to home', 'M_PREP_TO_HOME'], ['at home', 'M_PREP_TO_HOME'], ['into home', 'M_PREP_TO_HOME'], 'Home needs no to: went home.'],
  ['The teacher ___ the classroom.', 'entered', ['entered into', 'M_PREP_ENTER_INTO'], ['entered in', 'M_PREP_ENTER_INTO'], ['entered to', 'M_PREP_ENTER_INTO'], 'Enter already means go into: entered the classroom.'],
  ['The goats ran ___ the river.', 'towards', ['towards to', 'M_PREP_TOWARDS_TO'], ['toward to', 'M_PREP_TOWARDS_TO'], ['to towards', 'M_PREP_TOWARDS_TO'], 'Towards is complete on its own.'],
  ['The train went ___ a tunnel and came out the other side.', 'through', ['into', 'M_PREP_THROUGH_INTO'], ['towards', 'M_PREP_THROUGH_INTO'], ['to', 'M_PREP_THROUGH_INTO'], 'It came out the other side, so it went through.'],
  ['The boy jumped ___ the water and swam.', 'into', ['through', 'M_PREP_THROUGH_INTO'], ['towards', 'M_PREP_THROUGH_INTO'], ['to', 'M_PREP_THROUGH_INTO'], 'He went inside the water: into.'],
  ['The thief ran ___ the window and escaped.', 'through', ['into', 'M_PREP_THROUGH_INTO'], ['towards', 'M_PREP_THROUGH_INTO'], ['to', 'M_PREP_THROUGH_INTO'], 'He went in one side and out the other: through.'],
];
// ---------------------------------------------------------------- the comma, direct speech, the apostrophe, the exclamation mark
const COMMA = [
  ['', 'Mama bought maize flour, sugar and tea.', ['Mama bought maize flour sugar and tea.', 'M_COMMA_LIST_MISSING'], ['Mama bought, maize flour, sugar, and, tea.', 'M_COMMA_EVERYWHERE'], ['Mama, bought maize flour sugar and tea.', 'M_COMMA_EVERYWHERE'], 'Put commas between the items in a list.'],
  ['', 'Yes, I will come.', ['Yes I will come.', 'M_COMMA_AFTER_OPENING'], ['Yes I, will come.', 'M_COMMA_EVERYWHERE'], ['Yes I will, come.', 'M_COMMA_EVERYWHERE'], 'A comma follows an opening word such as yes.'],
  ['', 'In the morning, we went to the farm.', ['In the morning we went to the farm.', 'M_COMMA_AFTER_OPENING'], ['In the morning we, went to the farm.', 'M_COMMA_EVERYWHERE'], ['In, the morning we went to the farm.', 'M_COMMA_EVERYWHERE'], 'A comma follows an opening phrase.'],
  ['', 'Juma packed a book, a pencil, a ruler and a rubber.', ['Juma packed a book a pencil a ruler and a rubber.', 'M_COMMA_LIST_MISSING'], ['Juma packed a book a pencil, a ruler and a rubber.', 'M_COMMA_LIST_MISSING'], ['Juma, packed a book, a pencil, a ruler and a rubber.', 'M_COMMA_EVERYWHERE'], 'Put commas between the items in a list.'],
  ['', 'The bell rang, and we ran outside.', ['The bell rang, we ran outside.', 'M_COMMA_SPLICE'], ['The bell rang and, we ran outside.', 'M_COMMA_EVERYWHERE'], ['The bell, rang and we ran outside.', 'M_COMMA_EVERYWHERE'], 'A comma cannot join two whole sentences on its own: add and.'],
  ['', 'We saw cows, goats and sheep at the market.', ['We saw cows goats and sheep at the market.', 'M_COMMA_LIST_MISSING'], ['We saw, cows, goats and sheep at the market.', 'M_COMMA_EVERYWHERE'], ['We, saw cows, goats and sheep at the market.', 'M_COMMA_EVERYWHERE'], 'Put commas between the items in a list.'],
  ['', 'Well, we must start now.', ['Well we must start now.', 'M_COMMA_AFTER_OPENING'], ['Well we must, start now.', 'M_COMMA_EVERYWHERE'], ['Well we, must start now.', 'M_COMMA_EVERYWHERE'], 'A comma follows an opening word such as well.'],
  ['', 'Achieng sells tomatoes, onions and kale.', ['Achieng sells tomatoes onions and kale.', 'M_COMMA_LIST_MISSING'], ['Achieng, sells tomatoes, onions and kale.', 'M_COMMA_EVERYWHERE'], ['Achieng sells tomatoes, onions, and, kale.', 'M_COMMA_EVERYWHERE'], 'Put commas between the items in a list.'],
];
const SPEECH = [
  ['', 'Mother said, "Come and eat."', ['Mother said Come and eat.', 'M_QUOTE_MISSING'], ['Mother said, "Come and eat".', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ["Mother said, 'Come and eat.'", 'M_QUOTE_SINGLE'], 'Double quotation marks go round the spoken words, and the full stop goes inside.'],
  ['', '"Where are you going?" asked Baba.', ['"Where are you going", asked Baba.', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ['"Where are you going?", asked Baba.', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ['"Where are you going? asked Baba."', 'M_QUOTE_TOO_MUCH'], 'The question mark goes inside the quotation marks, and only the spoken words are inside.'],
  ['', 'Juma said, "We are late."', ['Juma said, "we are late."', 'M_QUOTE_NO_CAPITAL'], ['Juma said "We are late".', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ['Juma said, We are late.', 'M_QUOTE_MISSING'], 'The spoken words start with a capital letter, and the full stop goes inside.'],
  ['', '"Come and eat," said Mother.', ['"Come and eat, said Mother."', 'M_QUOTE_TOO_MUCH'], ['"Come and eat" said Mother.', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ['Come and eat, said Mother.', 'M_QUOTE_MISSING'], 'Only the spoken words are inside the marks, and the comma goes inside.'],
  ['', 'Amina said, "Thank you."', ["Amina said, 'Thank you.'", 'M_QUOTE_SINGLE'], ['Amina said, "thank you."', 'M_QUOTE_NO_CAPITAL'], ['Amina said "Thank you."', 'M_COMMA_AFTER_OPENING'], 'Double quotation marks, a comma before them, and a capital letter to start.'],
  ['', '"I am ready," said Otieno.', ['"I am ready." said Otieno.', 'M_QUOTE_FULL_STOP_BEFORE_SAID'], ['"I am ready", said Otieno.', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ['I am ready, said Otieno.', 'M_QUOTE_MISSING'], 'When said and the name follow, the speech ends with a comma inside the marks.'],
  ['', 'The teacher asked, "Who has my book?"', ['The teacher asked, "Who has my book"?', 'M_QUOTE_PUNCTUATION_OUTSIDE'], ['The teacher asked "Who has my book?"', 'M_COMMA_AFTER_OPENING'], ['The teacher asked, who has my book?', 'M_QUOTE_MISSING'], 'The question mark goes inside the closing quotation marks.'],
  ['', '"Please sit down," said the teacher.', ['Please sit down, said the teacher.', 'M_QUOTE_MISSING'], ['"please sit down," said the teacher.', 'M_QUOTE_NO_CAPITAL'], ['"Please sit down, said the teacher."', 'M_QUOTE_TOO_MUCH'], 'Quotation marks round the spoken words only, a capital to start, a comma inside.'],
];
const APOS = [
  ['This is ___ bag.', "Juma's", ['Jumas', 'M_APOS_MISSING_OWNER'], ["Jumas'", 'M_APOS_PLURAL_OWNER'], ["Jum'as", 'M_APOS_MISSING_OWNER'], 'The bag belongs to Juma, so Juma\'s.'],
  ['We ___ have school on Saturday.', "don't", ['dont', 'M_APOS_CONTRACTION'], ["do'nt", 'M_APOS_CONTRACTION'], ["dont'", 'M_APOS_CONTRACTION'], 'Do not becomes don\'t: the apostrophe sits where the o is missing.'],
  ['The dog wagged ___ tail.', 'its', ["it's", 'M_APOS_ITS'], ["its'", 'M_APOS_ITS'], ["its's", 'M_APOS_ITS'], 'It is does not fit the sentence, so its (belonging) has no apostrophe.'],
  ['Fresh ___ for sale.', 'bananas', ["banana's", 'M_APOS_PLURAL'], ["bananas'", 'M_APOS_PLURAL'], ["banana'", 'M_APOS_PLURAL'], 'More than one banana is just bananas: no apostrophe.'],
  ['Many ___ were sold at the market.', 'mangoes', ["mango's", 'M_APOS_PLURAL'], ["mangoes'", 'M_APOS_PLURAL'], ["mango'es", 'M_APOS_PLURAL'], 'More than one mango is just mangoes: no apostrophe.'],
  ['___ a sunny day today.', "It's", ['Its', 'M_APOS_ITS'], ["Its'", 'M_APOS_ITS'], ["It'is", 'M_APOS_CONTRACTION'], 'It is a sunny day, so it\'s.'],
  ['We ___ see the board from here.', "can't", ['cant', 'M_APOS_CONTRACTION'], ["ca'nt", 'M_APOS_CONTRACTION'], ["cann't", 'M_APOS_CONTRACTION'], 'Cannot becomes can\'t.'],
  ['Those are ___ shoes.', "Achieng's", ['Achiengs', 'M_APOS_MISSING_OWNER'], ["Achiengs'", 'M_APOS_PLURAL_OWNER'], ["Achien'gs", 'M_APOS_MISSING_OWNER'], 'The shoes belong to Achieng, so Achieng\'s.'],
  ['The ___ room is next to ours. Many girls share it.', "girls'", ["girl's", 'M_APOS_PLURAL_OWNER'], ['girls', 'M_APOS_MISSING_OWNER'], ["girls's", 'M_APOS_PLURAL_OWNER'], 'Many girls own the room, so the apostrophe comes after the s.'],
];
const EXCL = [
  ['', 'Look out for the car!', ['Look out for the car.', 'M_EXCL_FULL_STOP'], ['Look out for the car!!!', 'M_EXCL_MANY'], ['Look out for the car', 'M_EXCL_FULL_STOP'], 'A warning needs one exclamation mark.'],
  ['', 'We went to the market.', ['We went to the market!', 'M_EXCL_OVERUSE'], ['We went to the market!!!', 'M_EXCL_MANY'], ['We went to the market!!', 'M_EXCL_MANY'], 'A calm statement ends with a full stop.'],
  ['', 'Where is my pen?', ['Where is my pen!', 'M_EXCL_QUESTION'], ['Where is my pen!!', 'M_EXCL_QUESTION'], ['Where is my pen!?!', 'M_EXCL_MANY'], 'A question that asks for an answer ends with a question mark.'],
  ['', 'What a goal!', ['What a goal.', 'M_EXCL_FULL_STOP'], ['What a goal!!!', 'M_EXCL_MANY'], ['What a goal!!', 'M_EXCL_MANY'], 'A cry of surprise needs one exclamation mark.'],
  ['', 'Stop! The road is not safe.', ['Stop. The road is not safe.', 'M_EXCL_FULL_STOP'], ['Stop!!! The road is not safe.', 'M_EXCL_MANY'], 'Stop is a shout, so Stop! The second sentence is calm: a full stop.'],
  ['', 'My mother is a nurse.', ['My mother is a nurse!', 'M_EXCL_OVERUSE'], ['My mother is a nurse!!', 'M_EXCL_MANY'], ['My mother is a nurse!!!', 'M_EXCL_MANY'], 'A calm statement ends with a full stop.'],
  ['', 'Wow! What a big fish!', ['Wow. What a big fish.', 'M_EXCL_FULL_STOP'], ['Wow!!! What a big fish!!!', 'M_EXCL_MANY'], 'Both are cries of surprise, so each needs an exclamation mark.'],
  ['', 'Help! The house is on fire!', ['Help. The house is on fire.', 'M_EXCL_FULL_STOP'], ['Help!!! The house is on fire!!!', 'M_EXCL_MANY'], 'A cry for help and a warning each need an exclamation mark.'],
  ['', 'What time does the bus leave?', ['What time does the bus leave!', 'M_EXCL_QUESTION'], ['What time does the bus leave!!', 'M_EXCL_QUESTION'], ['What time does the bus leave!?', 'M_EXCL_QUESTION'], 'A question that asks for an answer ends with a question mark.'],
];
// ---------------------------------------------------------------- homophones, double letters
const HOMO = [
  ['The children left ___ bags in the classroom.', 'their', ['there', 'M_HOMO_THERE_THEIR'], ["they're", 'M_HOMO_THERE_THEIR'], ['thare', 'M_HOMO_SOUND_ONLY'], 'The bags belong to the children: their.'],
  ['Wanjiru has ___ brothers.', 'two', ['to', 'M_HOMO_TO_TOO_TWO'], ['too', 'M_HOMO_TO_TOO_TWO'], ['tu', 'M_HOMO_SOUND_ONLY'], 'The number 2 is spelt two.'],
  ['We ate a ___ of bread.', 'piece', ['peace', 'M_HOMO_SOUND_ONLY'], ['peas', 'M_HOMO_SOUND_ONLY'], ['pece', 'M_HOMO_SOUND_ONLY'], 'A part of the bread is a piece. Peace means calm.'],
  ['Come ___ and sit beside me.', 'here', ['hear', 'M_HOMO_HEAR_HERE'], ['heer', 'M_HOMO_SOUND_ONLY'], ['hair', 'M_HOMO_SOUND_ONLY'], 'Here means in this place.'],
  ['Please ___ your name at the top.', 'write', ['right', 'M_HOMO_HEAR_HERE'], ['rite', 'M_HOMO_SOUND_ONLY'], ['wright', 'M_HOMO_SOUND_ONLY'], 'To put words on paper is to write.'],
  ['I can ___ the birds singing.', 'hear', ['here', 'M_HOMO_HEAR_HERE'], ['heer', 'M_HOMO_SOUND_ONLY'], ['hare', 'M_HOMO_SOUND_ONLY'], 'You hear with your ears.'],
  ['The baby is ___ small to walk.', 'too', ['to', 'M_HOMO_TO_TOO_TWO'], ['two', 'M_HOMO_TO_TOO_TWO'], ['tooo', 'M_HOMO_SOUND_ONLY'], 'Too means more than enough: too small.'],
  ['___ going to the market.', "They're", ['Their', 'M_HOMO_THERE_THEIR'], ['There', 'M_HOMO_THERE_THEIR'], ['Thare', 'M_HOMO_SOUND_ONLY'], "They're is they are: They are going to the market."],
  ['I will ___ you at the gate.', 'meet', ['meat', 'M_HOMO_SOUND_ONLY'], ['mete', 'M_HOMO_SOUND_ONLY'], ['meit', 'M_HOMO_SOUND_ONLY'], 'To come together with someone is to meet. Meat is food.'],
  ['We watched the ships on the ___.', 'sea', ['see', 'M_HOMO_HEAR_HERE'], ['seee', 'M_HOMO_SOUND_ONLY'], ['si', 'M_HOMO_SOUND_ONLY'], 'The big salty water is the sea.'],
];
const DOUBLE = [
  ['In ___ the days are hot.', 'summer', ['sumer', 'M_SPELL_SINGLE_CONSONANT'], ['sommer', 'M_SPELL_PHONETIC'], ['summar', 'M_SPELL_PHONETIC'], 'Summer has a double m.'],
  ['Mama drinks ___ every morning.', 'coffee', ['cofee', 'M_SPELL_PHONETIC'], ['coffe', 'M_SPELL_PHONETIC'], ['cofe', 'M_SPELL_SINGLE_CONSONANT'], 'Coffee has a double f and a double e.'],
  ['Please write your ___ on the form.', 'address', ['adress', 'M_SPELL_SINGLE_CONSONANT'], ['addres', 'M_SPELL_SINGLE_CONSONANT'], ['adres', 'M_SPELL_PHONETIC'], 'Address has a double d and a double s.'],
  ['We eat ___ every day.', 'food', ['fod', 'M_SPELL_SINGLE_VOWEL'], ['foud', 'M_SPELL_PHONETIC'], ['fud', 'M_SPELL_PHONETIC'], 'Food has a double o.'],
  ['I posted a ___ to my cousin.', 'letter', ['leter', 'M_SPELL_SINGLE_CONSONANT'], ['lettar', 'M_SPELL_PHONETIC'], ['leta', 'M_SPELL_PHONETIC'], 'Letter has a double t.'],
  ['There are fifty-two ___ in a year.', 'weeks', ['weks', 'M_SPELL_SINGLE_VOWEL'], ['wekes', 'M_SPELL_PHONETIC'], ['weaks', 'M_SPELL_PHONETIC'], 'Weeks has a double e.'],
  ['The ___ sat on the throne.', 'queen', ['quen', 'M_SPELL_SINGLE_VOWEL'], ['quean', 'M_SPELL_PHONETIC'], ['queene', 'M_SPELL_EXTRA_DOUBLE'], 'Queen has a double e.'],
  ['I am very ___ today.', 'happy', ['hapy', 'M_SPELL_SINGLE_CONSONANT'], ['happey', 'M_SPELL_PHONETIC'], ['hapi', 'M_SPELL_PHONETIC'], 'Happy has a double p.'],
  ['He has not ___ his letter yet.', 'written', ['writen', 'M_SPELL_SINGLE_CONSONANT'], ['writtin', 'M_SPELL_PHONETIC'], ['ritten', 'M_SPELL_PHONETIC'], 'Written has a double t.'],
  ['The ___ jumped into its hole.', 'rabbit', ['rabit', 'M_SPELL_SINGLE_CONSONANT'], ['rabbitt', 'M_SPELL_EXTRA_DOUBLE'], ['rabbet', 'M_SPELL_PHONETIC'], 'Rabbit has a double b.'],
  ['Our school play was a great ___.', 'success', ['sucess', 'M_SPELL_SINGLE_CONSONANT'], ['succes', 'M_SPELL_SINGLE_CONSONANT'], ['sucses', 'M_SPELL_PHONETIC'], 'Success has a double c and a double s.'],
];

export const FAMILIES = [
  ...trio('dem', 'GRAMMA.T1.DEMONSTRATIVES', DEM, { topic: 'using this, these, that and those', hints: ['Count the things. One thing, or more than one?', 'Is the thing near the speaker, or far away?'] }),
  ...trio('coll', 'GRAMMA.T2.COLLECTIVE_NOUNS', COLL, { topic: 'about groups of animals and things', hints: ['Ask what is in the group: animals, fish, fruit or keys?', 'Each kind of animal has its own group word. Say the pair aloud: a ___ of cattle.'] }),
  ...trio('refl', 'GRAMMA.T2.REFLEXIVE_PRONOUNS', REFL, { topic: 'using myself, yourself, himself, herself, itself, ourselves and themselves', hints: ['Ask who did the action and who received it. Are they the same person?', 'The word ends in -self for one person and -selves for more than one.'] }),
  ...trio('too', 'GRAMMA.T3.TOO_TO', TOO, { stem: 'Choose the words that complete the sentence correctly.', topic: 'using too ... to and too ... for', hints: ['After too and an adjective, ask: is a person or a verb next?', 'A person after the gap needs for. A verb after the gap needs to.'] }),
  ...trio('must', 'GRAMMA.T3.MUST_SHOULD_ADVERB', MUST, { stem: 'Choose the words that complete the sentence correctly.', topic: 'using must and should', hints: ['After must or should, the verb stays plain: no to, no -s, no -ing.', 'The word that tells how an action is done is an adverb and often ends in -ly.'] }),
  ...trio('poss', 'GRAMMA.T4.POSSESSIVES', POSS, { topic: 'using words that show who owns something', hints: ['Look at what comes after the gap. Is there a noun, or nothing?', 'A possessive word that comes before a noun is not the same as one that stands alone.'] }),
  ...trio('comp', 'GRAMMA.T5.COMPARATIVE_SUPERLATIVE', COMP, { stem: 'Choose the words that complete the sentence correctly.', topic: 'comparing things', hints: ['Count the things being compared. Two things, or three or more?', 'Short words take -er and -est. Long words take more and most. Never use both.'] }),
  ...trio('aorder', 'GRAMMA.T5.ADJECTIVE_ORDER', ORDER, { stem: 'Choose the words that complete the sentence correctly.', topic: 'with describing words before a noun', hints: ['In English the describing words come before the noun.', 'Size comes first, then age, then shape or colour.'] }),
  ...trio('few', 'GRAMMA.T6.FEW_LITTLE', FEW, { topic: 'about how much or how many', hints: ['Can you count the thing one by one? Things you can count and things you cannot need different words.', 'Does the rest of the sentence say there is enough, or hardly any? Read it carefully.'] }),
  ...trio('quant', 'GRAMMA.T6.QUANTIFIERS_OTHER', QUANT, { stem: 'Choose the words that complete the sentence correctly.', topic: 'using each, all, enough, most and least', hints: ['Each means one at a time. All means many.', 'Say the whole sentence aloud and listen for what sounds wrong.'] }),
  ...trio('fut', 'GRAMMA.T7.FUTURE_WILL_SHALL', FUT, { topic: 'about the future', hints: ['Is the event still to come? Then use will or shall.', 'After will or shall, the verb stays plain: no -s, no -ed, no -ing.'] }),
  ...trio('tag', 'GRAMMA.T8.QUESTION_TAGS', TAG, { stem: 'Choose the tag that completes the sentence correctly.', topic: 'with question tags at the end', hints: ['Find the helper verb in the statement (is, are, does, can, have).', 'The tag turns the sign round and uses a pronoun: a positive statement gets a negative tag, and a negative statement gets a positive tag.'] }),
  ...trio('adv', 'GRAMMA.T9.ADVERBS', ADV, { topic: 'using adverbs', hints: ['Ask: does the word tell how, when, where or how often?', 'A word that describes a verb is an adverb. Many end in -ly, but not all of them do.'] }),
  eng({ id: 'eng5.advkind.choose', kind: 'classify', cs: 'GRAMMA.T9.ADVERBS', oc: 'a', form: 'direct', rung: 1, gen: choose(ADV_KIND, { stem: 'Complete the sentence.', hints: ['Ask: does the word say how, when, where or how often?', 'How often: always, never, often, sometimes. When: today, soon, later. Where: here, there, outside.'] }) }),
  ...trio('could', 'GRAMMA.T9.COULD_WOULD', COULD, { topic: 'using could and would', hints: ['Is the sentence about the past, or about an imagined result?', 'After the helper verb, the main verb stays plain.'] }),
  ...trio('conj', 'GRAMMA.T10.CONJUNCTIONS', CONJ, { topic: 'joining ideas', hints: ['Say the two parts. Is the second a reason, a surprise, an addition or a choice?', 'Each kind of link needs its own joining word: one for a reason, one for a surprise, one for a choice.'] }),
  eng({ id: 'eng5.conjs.choose', kind: 'choose-sentence', cs: 'GRAMMA.T10.CONJUNCTIONS', oc: 'c', form: 'direct', rung: 2, gen: choose(CONJ_SENT, { stem: SENT, hints: ['Check the meaning of the two parts, then the joining word.', 'Use only one joining word between two ideas.'] }) }),
  ...trio('int', 'GRAMMA.T11.INTERROGATIVES', INTER, { stem: 'Choose the words that complete the question correctly.', topic: 'asking questions', hints: ['Look at the answer given. Does it name a person, a time, a reason or a thing?', 'In a question the helper verb comes before the subject.'] }),
  ...trio('same', 'GRAMMA.T12.SAME_SINGULAR_PLURAL', SAME, { topic: 'about animals and people', hints: ['A few nouns do not change in the plural, and some change inside the word.', 'Look for a number or the word many: it shows whether there is one or more than one.'] }),
  ...trio('ptime', 'GRAMMA.T13.PREPOSITIONS_TIME_PLACE', TIME, { thinOk: true, topic: 'about time and place', hints: ['At is for a clock time or a point. On is for days and for a surface. In is for months, parts of the day and inside.', 'Say the whole sentence aloud and listen for what sounds right.'] }),
  ...trio('pdir', 'GRAMMA.T13.PREPOSITIONS_DIRECTION', DIR, { topic: 'about going to places', hints: ['Some words already carry the idea of going to a place.', 'Does the movement go in at one side and out at the other, or does it stay inside?'] }),
  ...duo('comma', 'WRITIN.T7.COMMAS', COMMA, { topic: 'with commas', hints: ['Look for a list or an opening word: commas go there.', 'A comma is not a breath mark: never split who from what they did.'] }),
  ...duo('speech', 'WRITIN.T7.DIRECT_SPEECH', SPEECH, { topic: 'with someone speaking', hints: ['Double quotation marks go round the spoken words only.', 'The comma or question mark that ends the speech goes inside the closing marks, and the speech starts with a capital.'] }),
  ...trio('apos', 'WRITIN.T9.APOSTROPHE', APOS, { stem: 'Choose the word that completes the sentence correctly.', topic: 'with apostrophes', hints: ['An apostrophe shows that something belongs to someone, or that a letter is missing.', 'A plain plural has no apostrophe, and the word that means belonging to it has none either.'] }),
  ...duo('excl', 'WRITIN.T9.EXCLAMATION_MARK', EXCL, { topic: 'with the exclamation mark', hints: ['Is it a shout, a warning or a cry of surprise? Then one exclamation mark.', 'Calm statements end with a full stop and questions end with a question mark.'] }),
  ...trio('homo', 'WRITIN.T11.HOMOPHONES', HOMO, { topic: 'with words that sound the same', hints: ['The words sound the same, so think about the meaning of the sentence.', 'Say what the word means in your own words, then match it to the spelling.'] }),
  ...trio('dbl', 'WRITIN.T13.DOUBLE_LETTERS', DOUBLE, { stem: 'Choose the correct spelling to complete the sentence.', topic: 'with words that have double letters', hints: ['Say the word slowly in parts and listen for a sound that needs two letters.', 'Think of other words you know that have double letters.'] }),
];
