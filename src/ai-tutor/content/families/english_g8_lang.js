// ============================================================================
// ENGLISH GRADE 8, LANGUAGE: nouns, auxiliary verbs, tenses, adjectives, adverbs, pronouns, prepositions, conjunctions,
// demonstratives and quantifiers, phrasal verbs, sentences, voice and question tags (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g8.json). Off for children (reviewed:false) until a
// Kenyan English teacher signs them off. See docs/qa/english-g8-review-2026-11-13.md.
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
const D = (code) => (xs) => xs.map(x => [x, code]);

const COMPOUND = [
  I('My two ___ came to the party.', 'mothers-in-law', w('M8_CPN_PLURAL_LAST', 'mother-in-laws', 'mothers-in-laws', 'mother-in-lawss'), 'The main noun is mother, so it takes the plural: mothers-in-law.'),
  I('Wanjiru bought a new ___ at the shop.', 'toothbrush', w('M8_CPN_SPLIT', 'tooth brush', 'tooth-brush', 'tooth_brush'), 'Toothbrush is written as one word.'),
  I('The ___ in this town sell stamps and stationery.', 'post offices', w('M8_CPN_SINGULAR', 'post office', 'post-office', 'post officess'), 'There are many, so the main noun takes the plural: post offices.'),
  I('Three ___ stopped to watch the match.', 'passers-by', w('M8_CPN_PLURAL_LAST', 'passer-bys', 'passerbys', 'passers-bys'), 'Passers-by: the main word is passer.'),
  I('The pupils walked into the ___ quietly.', 'classroom', w('M8_CPN_SPLIT', 'class room', 'class-room', 'class_room'), 'Classroom is written as one word.'),
  I('Otieno has two ___ in Kisumu.', 'brothers-in-law', w('M8_CPN_PLURAL_LAST', 'brother-in-laws', 'brothers-in-laws', 'brother-in-lawss'), 'The main noun is brother, so it takes the plural: brothers-in-law.'),
  I('Mama put the cups in the ___.', 'cupboard', w('M8_CPN_SPLIT', 'cup board', 'cup-board', 'cup_board'), 'Cupboard is written as one word.'),
];
const COLLECTIVE = [
  I('A ___ of lions rested under the acacia tree.', 'pride', w('M8_CLN_WRONG_GROUP', 'swarm', 'herd', 'fleet'), 'Lions live in a pride: a pride of lions.'),
  I('A ___ of fish swam past the boat.', 'school', w('M8_CLN_WRONG_GROUP', 'flock', 'herd', 'pride'), 'Fish swim in a school.'),
  I('A ___ of ships waited in the port of Mombasa.', 'fleet', w('M8_CLN_WRONG_GROUP', 'pack', 'herd', 'swarm'), 'Ships sail in a fleet.'),
  I('A ___ of monkeys jumped from tree to tree.', 'troop', w('M8_CLN_WRONG_GROUP', 'flock', 'pride', 'fleet'), 'Monkeys move in a troop.'),
  I('A ___ of sailors boarded the ship.', 'crew', w('M8_CLN_PLURAL', 'crews', 'a crews') .slice(0, 1).concat(w('M8_CLN_WRONG_GROUP', 'herd', 'swarm')), 'A crew is one group of sailors, so write a crew of sailors.'),
  I('A swarm ___ bees settled on the roof.', 'of', w('M8_CLN_NO_OF', 'with', 'and', 'in'), 'Say a swarm of bees.'),
  I('A ___ of cattle grazed near the river.', 'herd', w('M8_CLN_WRONG_GROUP', 'swarm', 'pride', 'fleet'), 'Cattle graze in a herd.'),
  I('A ___ of bananas hung in the shop.', 'bunch', w('M8_CLN_WRONG_GROUP', 'herd', 'school', 'fleet'), 'Bananas grow in a bunch.'),
];
const AUX = [
  I('She ___ just finished her homework.', 'has', w('M8_AUX_AGREE', 'have', 'do', 'are'), 'She takes has: she has finished.'),
  I('The boys ___ playing football now.', 'are', w('M8_AUX_BE_FORM', 'is', 'was', 'be'), 'The boys is many, so are.'),
  I('I ___ ready for the test.', 'am', w('M8_AUX_BE_FORM', 'is', 'are', 'be'), 'I takes am.'),
  I('The children ___ singing when the teacher came in.', 'were', w('M8_AUX_BE_FORM', 'was', 'is', 'am'), 'The children are many and the time is past, so were.'),
  I('They ___ been waiting for an hour.', 'have', w('M8_AUX_AGREE', 'has', 'is', 'does'), 'They takes have: they have been waiting.'),
  I('My father ___ not like loud music.', 'does', w('M8_AUX_AGREE', 'do', 'have', 'are'), 'My father is one person, so does.'),
  I('Otieno did not ___ to school yesterday.', 'go', w('M8_AUX_DID_PAST', 'went', 'goes', 'going'), 'After did the main verb stays plain: did not go.'),
  I('Does she ___ the answer?', 'know', w('M8_AUX_DID_PAST', 'knows', 'knew', 'known'), 'After does the main verb stays plain: does she know.'),
];
const TENSE = [
  I('Achieng ___ to school every day.', 'walks', w('M8_TN_S_MISSING', 'walk', 'walking', 'walked'), 'One name takes -s in the simple present: Achieng walks.'),
  I('My mother ___ tea every morning.', 'makes', w('M8_TN_S_MISSING', 'make', 'making', 'made'), 'My mother is she, so makes.'),
  I('The sun ___ in the east.', 'rises', w('M8_TN_S_MISSING', 'rise', 'rising', 'rose'), 'The sun is one thing, so rises.'),
  I('Baraka did not ___ the answer.', 'know', w('M8_TN_DID_PAST', 'knew', 'knows', 'known'), 'After did the verb stays plain: did not know.'),
  I('Did you ___ the film last night?', 'see', w('M8_TN_DID_PAST', 'saw', 'seen', 'sees'), 'After did the verb stays plain: did you see.'),
  I('Yesterday we ___ to the market.', 'went', w('M8_TN_WRONG_PAST', 'goed', 'gone', 'go'), 'The past of go is went.'),
  I('Last week Wanjiru ___ a new dress.', 'bought', w('M8_TN_WRONG_PAST', 'buyed', 'buy', 'bough'), 'The past of buy is bought.'),
  I('She ___ her homework before supper yesterday.', 'did', w('M8_TN_WRONG_PAST', 'doed', 'done', 'do'), 'The past of do is did.'),
];
const GRADABLE = [
  I('The soup is ___ perfect.', 'absolutely', w('M8_GR_VERY_ABSOLUTE', 'very', 'more', 'extremely'), 'Perfect cannot be more or less, so use absolutely or completely.'),
  I('The boy is ___ tall for his age.', 'very', w('M8_GR_ABSOLUTELY_GRADABLE', 'absolutely', 'completely', 'totally'), 'Tall can be more or less, so very goes with it.'),
  I('The bottle is ___ empty.', 'completely', w('M8_GR_VERY_ABSOLUTE', 'very', 'more', 'quite'), 'Empty cannot be more or less, so use completely.'),
  I('The water was ___ cold this morning.', 'very', w('M8_GR_ABSOLUTELY_GRADABLE', 'completely', 'absolutely', 'totally'), 'Cold can be more or less, so very goes with it.'),
  I('This painting is ___.', 'unique', w('M8_GR_MORE_UNIQUE', 'more unique', 'very unique', 'most unique'), 'Unique means one of a kind, so it has no degrees.'),
  I('The answer is ___ impossible.', 'absolutely', w('M8_GR_VERY_ABSOLUTE', 'very', 'more', 'rather'), 'Impossible cannot be more or less, so use absolutely.'),
  I('Juma is ___ clever for his age.', 'very', w('M8_GR_ABSOLUTELY_GRADABLE', 'absolutely', 'completely', 'totally'), 'Clever can be more or less, so very goes with it.'),
];
const FD_GAP = [
  I('The mandazi were ___ tasty, so we ate them all.', 'very', w('M8_FD_TOO_VERY', 'too', 'enough', 'much'), 'Very is a strong degree. Too means more than is wanted.'),
  I('The tea was ___ hot to drink, so I waited.', 'too', w('M8_FD_TOO_VERY', 'very', 'quite', 'almost'), 'Too means more than is good, so I waited.'),
  I('She ___ comes late. She is always on time.', 'never', w('M8_FD_NEVER_NOT', 'does not never', 'not never', 'never not'), 'Never already means not ever.'),
  I('The road was ___ narrow for the lorry to pass.', 'too', w('M8_FD_TOO_VERY', 'very', 'quite', 'almost'), 'Too means more than is possible for the lorry.'),
  I('Juma is ___ late. The teacher has never marked him late.', 'never', w('M8_FD_NEVER_NOT', 'not never', 'does not never', 'never not'), 'Never already means not ever.'),
  I('It is ___ cold to swim today, so we stay out.', 'too', w('M8_FD_TOO_VERY', 'very', 'quite', 'almost'), 'Too means more cold than we can bear.'),
];
const FD_SENT = [
  ['', 'She always arrives on time.', ['She arrives always on time.', 'M8_FD_PLACE'], ['She arrives on time always.', 'M8_FD_PLACE'], ['She arrives on always time.', 'M8_FD_PLACE'], 'A frequency adverb goes before the main verb: she always arrives.'],
  ['', 'He is never late for school.', ['He never is late for school.', 'M8_FD_PLACE'], ['He is late never for school.', 'M8_FD_PLACE'], ['He is late for school never.', 'M8_FD_PLACE'], 'A frequency adverb goes after be: he is never late.'],
  ['', 'We usually eat lunch at one o\'clock.', ['We eat usually lunch at one o\'clock.', 'M8_FD_PLACE'], ['We eat lunch usually at one o\'clock.', 'M8_FD_PLACE'], ['We eat lunch at usually one o\'clock.', 'M8_FD_PLACE'], 'Usually goes before the main verb: we usually eat.'],
  ['', 'Mama often visits her sister.', ['Mama visits often her sister.', 'M8_FD_PLACE'], ['Mama visits her often sister.', 'M8_FD_PLACE'], ['Mama visits her sister often the.', 'M8_FD_PLACE'], 'Often goes before the main verb: Mama often visits.'],
  ['', 'The boys are sometimes noisy.', ['The boys sometimes are noisy.', 'M8_FD_PLACE'], ['The boys are noisy sometimes the.', 'M8_FD_PLACE'], ['The are boys sometimes noisy.', 'M8_FD_PLACE'], 'Sometimes goes after are: the boys are sometimes noisy.'],
  ['', 'I always do my homework after school.', ['I do always my homework after school.', 'M8_FD_PLACE'], ['I do my always homework after school.', 'M8_FD_PLACE'], ['I do my homework always after school.', 'M8_FD_PLACE'], 'Always goes before the main verb: I always do.'],
];
const REFLEX = [
  I('The boys taught ___ to swim.', 'themselves', w('M8_IR_HISSELF', 'theirselves', 'themself', 'theirself'), 'Many boys: themselves.'),
  I('Wanjiru looked at ___ in the mirror.', 'herself', w('M8_IR_HISSELF', 'hisself', 'herselves', 'hersef'), 'One girl: herself.'),
  I('We made the cake ___.', 'ourselves', w('M8_IR_OURSELF', 'ourself', 'ourselfs', 'ourselve'), 'We is many, so -selves.'),
  I('You must dress ___ before breakfast, children.', 'yourselves', w('M8_IR_OURSELF', 'yourself', 'yourselfs', 'yourselve'), 'Children are many, so yourselves.'),
  I('Everyone ___ ready for the trip.', 'is', w('M8_IR_EVERYONE_PLURAL', 'are', 'were', 'be'), 'Everyone is singular: everyone is ready.'),
  I('Nobody ___ hurt in the match.', 'was', w('M8_IR_EVERYONE_PLURAL', 'were', 'are', 'be'), 'Nobody is singular: nobody was hurt.'),
  I('Otieno hurt ___ while playing.', 'himself', w('M8_IR_HISSELF', 'hisself', 'himselves', 'hisselfs'), 'One boy: himself.'),
  I('Someone ___ left a bag at the gate.', 'has', w('M8_IR_EVERYONE_PLURAL', 'have', 'are', 'were'), 'Someone is singular: someone has left.'),
];
const PREP = [
  I('The sports day is ___ Friday.', 'on', w('M8_PP_AT_ON_IN', 'in', 'at', 'by'), 'Use on with days: on Friday.'),
  I('We wake up ___ 6 o\'clock.', 'at', w('M8_PP_AT_ON_IN', 'on', 'in', 'by'), 'Use at with clock times: at 6 o\'clock.'),
  I('My birthday is ___ June.', 'in', w('M8_PP_AT_ON_IN', 'on', 'at', 'by'), 'Use in with months: in June.'),
  I('The ball is ___ the two goal posts.', 'between', w('M8_PP_BETWEEN_AMONG', 'beside', 'behind', 'above'), 'Between is for two things.'),
  I('Otieno waited ___ the school gate.', 'at', w('M8_PP_IN_PLACE', 'in', 'on', 'into'), 'Use at for a point: at the gate.'),
  I('The books are ___ the table.', 'on', w('M8_PP_IN_PLACE', 'in', 'at', 'into'), 'Use on for a surface: on the table.'),
  I('We eat lunch ___ noon.', 'at', w('M8_PP_AT_ON_IN', 'in', 'on', 'by'), 'Use at with noon, night and clock times.', ),
  I('The cat is ___ the box, so we cannot see it.', 'in', w('M8_PP_IN_PLACE', 'at', 'on', 'beside'), 'In is for inside a space.'),
];
const CONJ = [
  I('___ it was raining, we played football.', 'Although', w('M8_CJ_ALTHOUGH_BUT', 'Although but', 'But although').concat(w('M8_CJ_WRONG', 'Because')), 'Although shows a contrast, and it is used alone.'),
  I('You will fail ___ you study.', 'unless', w('M8_CJ_UNLESS_NEG', 'unless you do not').slice(0, 1).concat(w('M8_CJ_WRONG', 'because', 'although')), 'Unless means if not.'),
  I('We stayed indoors ___ it was raining.', 'because', w('M8_CJ_BECAUSE_SO', 'because so').concat(w('M8_CJ_WRONG', 'although', 'unless')), 'Because gives the reason.'),
  I('Wait here ___ I come back.', 'until', w('M8_CJ_WRONG', 'because', 'although', 'so'), 'Until gives the limit in time.'),
  I('Mama cooked ___ Baba washed the clothes.', 'while', w('M8_CJ_WRONG', 'unless', 'because', 'although'), 'While shows two things happening at the same time.'),
  I('It was getting dark, ___ we hurried home.', 'so', w('M8_CJ_BECAUSE_SO', 'because so').concat(w('M8_CJ_WRONG', 'although', 'unless')), 'So gives the result.'),
  I('You cannot sit the test ___ you bring your pen.', 'unless', w('M8_CJ_UNLESS_NEG', 'unless not').concat(w('M8_CJ_WRONG', 'although', 'because')), 'Unless means if not.'),
];
const DEMO = [
  I('___ books on my desk are mine.', 'These', w('M8_DQ_THIS_THESE', 'This', 'That', 'There'), 'Many books take these.'),
  I('___ chair here is broken.', 'This', w('M8_DQ_THIS_THESE', 'These', 'Those', 'There'), 'One chair takes this.'),
  I('Look at ___ bird far away on the roof.', 'that', w('M8_DQ_NEAR_FAR', 'this', 'these', 'here'), 'That points to a thing far away.'),
  I('I am holding ___ pen in my hand.', 'this', w('M8_DQ_NEAR_FAR', 'that', 'those', 'there'), 'This points to a thing near me.'),
  I('There are too ___ cars on the road.', 'many', w('M8_DQ_MUCH_MANY', 'much', 'little', 'a little'), 'Cars can be counted, so many.'),
  I('There is too ___ noise in the room.', 'much', w('M8_DQ_MUCH_MANY', 'many', 'few', 'a few'), 'Noise cannot be counted, so much.'),
  I('We have only a ___ sugar left.', 'little', w('M8_DQ_MUCH_MANY', 'few', 'many', 'a few'), 'Sugar cannot be counted, so a little.'),
  I('She has a ___ friends in Mombasa.', 'few', w('M8_DQ_MUCH_MANY', 'little', 'much', 'a little'), 'Friends can be counted, so a few.'),
];
const ADVF = [
  I('Wanjiru sings very ___.', 'well', w('M8_AF_GOOD_WELL', 'good', 'goodly', 'nice'), 'The adverb of good is well.'),
  I('The baby smiled ___.', 'happily', w('M8_AF_SPELL', 'happyly', 'happyily').concat(w('M8_AF_GOOD_WELL', 'happy')), 'Change y to i before -ly: happily.'),
  I('The old man walked ___ across the road.', 'slowly', w('M8_AF_GOOD_WELL', 'slow', 'slowish').slice(0, 1).concat(w('M8_AF_SPELL', 'slowy', 'slowlly')), 'The adverb of slow is slowly.'),
  I('He opened the door ___.', 'gently', w('M8_AF_SPELL', 'gentlely', 'gentley').concat(w('M8_AF_GOOD_WELL', 'gentle')), 'Change -le to -ly: gently.'),
  I('He ___ believed the story.', 'truly', w('M8_AF_SPELL', 'truely', 'trulie').concat(w('M8_AF_GOOD_WELL', 'true')), 'True becomes truly.'),
  I('Otieno studied ___ for the test.', 'hard', w('M8_AF_HARDLY', 'hardly', 'hardy', 'hardily'), 'Hard is also the adverb: studied hard. Hardly means almost not.'),
  I('We arrived ___ at the station.', 'late', w('M8_AF_HARDLY', 'lately', 'latly', 'latey'), 'Late is also the adverb: arrived late. Lately means recently.'),
  I('Achieng ran ___ and won the race.', 'fast', w('M8_AF_SPELL', 'fastly', 'fastely', 'fastlly'), 'Fast is also the adverb: ran fast.'),
  I('The driver drove ___ on the wet road.', 'carefully', w('M8_AF_SPELL', 'carefuly', 'carefully'.slice(0, 0) + 'carefullly', 'carefulley').concat(w('M8_AF_GOOD_WELL', 'careful')), 'Careful + ly is carefully.'),
];
const PV_GAP = [
  I('Please ___ the light when you leave.', 'turn off', w('M8_PV_PARTICLE', 'turn on', 'turn in', 'turn up'), 'Turn off stops a light.'),
  I('Mama will ___ the baby while I am at school.', 'look after', w('M8_PV_PARTICLE', 'look at', 'look for', 'look up'), 'Look after means take care of.'),
  I('I cannot find my pen. I am ___ it everywhere.', 'looking for', w('M8_PV_PARTICLE', 'looking after', 'looking at', 'looking into'), 'Look for means try to find.'),
  I('The bus ___ near Nakuru, so we walked.', 'broke down', w('M8_PV_PARTICLE', 'broke up', 'broke in', 'broke off'), 'Break down means stop working.'),
  I('We must ___ early to reach the lake by noon.', 'set off', w('M8_PV_PARTICLE', 'set up', 'set in', 'set down'), 'Set off means begin a journey.'),
  I('The shop ran ___ sugar by midday.', 'out of', w('M8_PV_PARTICLE', 'into', 'away from', 'up'), 'Run out of means have no more.'),
  I('Do not ___; keep trying until you succeed.', 'give up', w('M8_PV_PARTICLE', 'give away', 'give off', 'give back'), 'Give up means stop trying.'),
  I('After the break the teacher asked us to ___ with the lesson.', 'carry on', w('M8_PV_PARTICLE', 'carry out', 'carry off', 'carry away'), 'Carry on means continue.'),
];
const PV_MEAN = [
  ['The man gave up smoking. What did he do?', 'He stopped', ['He gave it to someone', 'M8_PV_MEANING'], ['He started again', 'M8_PV_MEANING'], ['He sold it', 'M8_PV_MEANING'], 'Give up means stop.'],
  ['Mama looks after her grandmother. What does she do?', 'She takes care of her', ['She looks at her photographs', 'M8_PV_MEANING'], ['She looks for her', 'M8_PV_MEANING'], ['She follows her', 'M8_PV_MEANING'], 'Look after means take care of.'],
  ['The shop ran out of milk. What happened?', 'There was no milk left', ['The milk ran away', 'M8_PV_LITERAL'], ['The shop ran outside', 'M8_PV_LITERAL'], ['The milk was spilt', 'M8_PV_LITERAL'], 'Run out of means have no more.'],
  ['The bus broke down near Nakuru. What happened?', 'It stopped working', ['It was broken into pieces', 'M8_PV_LITERAL'], ['It fell down', 'M8_PV_LITERAL'], ['It went faster', 'M8_PV_LITERAL'], 'Break down means stop working.'],
  ['We set off at dawn. What did we do?', 'We began our journey', ['We took off our shoes', 'M8_PV_MEANING'], ['We stopped for the day', 'M8_PV_MEANING'], ['We turned the lights on', 'M8_PV_MEANING'], 'Set off means begin a journey.'],
  ['Wanjiru is looking for her keys. What is she doing?', 'Trying to find them', ['Taking care of them', 'M8_PV_MEANING'], ['Looking at them', 'M8_PV_MEANING'], ['Giving them away', 'M8_PV_MEANING'], 'Look for means try to find.'],
  ['Juma will carry on studying. What will he do?', 'Continue studying', ['Stop studying', 'M8_PV_MEANING'], ['Carry the books', 'M8_PV_LITERAL'], ['Start again', 'M8_PV_MEANING'], 'Carry on means continue.'],
];
const CS_GAP = [
  I('It was raining, ___ we stayed indoors.', 'so', w('M8_CS_WRONG_CONJ', 'but', 'yet', 'nor'), 'So gives the result.'),
  I('She ran fast, ___ she lost the race.', 'but', w('M8_CS_WRONG_CONJ', 'so', 'for', 'nor'), 'But shows a contrast.'),
  I('You can walk, ___ you can take the bus.', 'or', w('M8_CS_WRONG_CONJ', 'but', 'so', 'nor'), 'Or gives a choice.'),
  I('Achieng did not like tea, ___ did she like coffee.', 'nor', w('M8_CS_WRONG_CONJ', 'but', 'so', 'and'), 'Nor adds another negative.'),
  I('We were late, ___ we missed the start.', 'so', w('M8_CS_WRONG_CONJ', 'but', 'yet', 'or'), 'So gives the result.'),
  I('Mama cooked rice, ___ Baba cut the vegetables.', 'and', w('M8_CS_WRONG_CONJ', 'so', 'nor', 'yet'), 'And adds one thing to another.'),
];
const CS_SENT = [
  ['', 'I was tired, so I went to bed.', ['I was tired, I went to bed.', 'M8_CS_COMMA_SPLICE'], ['I was tired so I went to bed.', 'M8_CS_NO_COMMA'], 'Two sentences need a conjunction and a comma: I was tired, so I went to bed.'],
  ['', 'She ran fast, but she lost the race.', ['She ran fast, she lost the race.', 'M8_CS_COMMA_SPLICE'], ['She ran fast but she lost the race.', 'M8_CS_NO_COMMA'], 'A comma goes before but.'],
  ['', 'You can walk, or you can take a bus.', ['You can walk, you can take a bus.', 'M8_CS_COMMA_SPLICE'], ['You can walk or you can take a bus.', 'M8_CS_NO_COMMA'], 'A comma goes before or when it joins two sentences.'],
  ['', 'We stayed home, for it was raining.', ['We stayed home, it was raining.', 'M8_CS_COMMA_SPLICE'], ['We stayed home for it was raining.', 'M8_CS_NO_COMMA'], 'A comma goes before for when it joins two sentences.'],
  ['', 'Achieng sang, and Juma danced.', ['Achieng sang, Juma danced.', 'M8_CS_COMMA_SPLICE'], ['Achieng sang and Juma danced.', 'M8_CS_NO_COMMA'], 'A comma goes before and when it joins two sentences.'],
  ['', 'The shop was closed, so we went home.', ['The shop was closed, we went home.', 'M8_CS_COMMA_SPLICE'], ['The shop was closed so we went home.', 'M8_CS_NO_COMMA'], 'Two sentences need a conjunction and a comma.'],
];
const AP_GAP = [
  I('The boy was ___ by the dog.', 'bitten', w('M8_AP_WRONG_PARTICIPLE', 'bite', 'bit', 'biting'), 'The passive uses be and the past participle: was bitten.'),
  I('The letter was ___ by Wanjiru.', 'written', w('M8_AP_WRONG_PARTICIPLE', 'wrote', 'write', 'writing'), 'The past participle of write is written.'),
  I('The window ___ broken by the wind.', 'was', w('M8_AP_NO_BE', 'been', 'being', 'be'), 'The passive needs a form of be: was broken.'),
  I('The cake was ___ by my mother.', 'baked', w('M8_AP_WRONG_PARTICIPLE', 'bake', 'baking', 'bakes'), 'The passive uses the past participle: was baked.'),
  I('The thief ___ caught by the police.', 'was', w('M8_AP_NO_BE', 'been', 'being', 'be'), 'The passive needs a form of be: was caught.'),
  I('The match was ___ by the whole school.', 'watched', w('M8_AP_WRONG_PARTICIPLE', 'watch', 'watching', 'watches'), 'The passive uses the past participle: was watched.'),
  I('The books were ___ by the teacher.', 'collected', w('M8_AP_WRONG_PARTICIPLE', 'collect', 'collecting', 'collects'), 'The passive uses the past participle: were collected.'),
];
const AP_ID = [
  ['Which sentence is in the active voice?', 'Wanjiru cooked the rice.', ['The rice was cooked by Wanjiru.', 'M8_AP_VOICE_MIX'], ['The rice is cooked by Wanjiru.', 'M8_AP_VOICE_MIX'], ['The rice has been cooked by Wanjiru.', 'M8_AP_VOICE_MIX'], 'The subject Wanjiru does the action.'],
  ['Which sentence is in the passive voice?', 'The window was broken by the wind.', ['The wind broke the window.', 'M8_AP_VOICE_MIX'], ['The wind is breaking the window.', 'M8_AP_VOICE_MIX'], ['The wind will break the window.', 'M8_AP_VOICE_MIX'], 'The subject the window receives the action.'],
  ['Which sentence is the passive of "Juma kicked the ball"?', 'The ball was kicked by Juma.', ['The ball kicked Juma.', 'M8_AP_VOICE_MIX'], ['The ball is kicked by Juma.', 'M8_AP_VOICE_MIX'], ['Juma was kicked by the ball.', 'M8_AP_VOICE_MIX'], 'Keep the same tense: kicked becomes was kicked.'],
  ['Which sentence is the active of "The cake was baked by Mama"?', 'Mama baked the cake.', ['The cake baked Mama.', 'M8_AP_VOICE_MIX'], ['Mama bakes the cake.', 'M8_AP_VOICE_MIX'], ['The cake was baking Mama.', 'M8_AP_VOICE_MIX'], 'Mama does the action in the active voice.'],
  ['Which sentence is in the passive voice?', 'The books were collected by the teacher.', ['The teacher collected the books.', 'M8_AP_VOICE_MIX'], ['The teacher will collect the books.', 'M8_AP_VOICE_MIX'], ['The teacher is collecting the books.', 'M8_AP_VOICE_MIX'], 'The books receive the action.'],
  ['Which sentence is in the active voice?', 'The farmer planted the maize.', ['The maize was planted by the farmer.', 'M8_AP_VOICE_MIX'], ['The maize is planted by the farmer.', 'M8_AP_VOICE_MIX'], ['The maize had been planted by the farmer.', 'M8_AP_VOICE_MIX'], 'The farmer does the action.'],
];
const TAGS = [
  I('You are coming, ___?', 'aren\'t you', w('M8_QT_SAME_SIGN', 'are you').concat(w('M8_QT_ISNT_IT', 'isn\'t it'), w('M8_QT_WRONG_AUX', 'don\'t you')), 'A positive sentence takes a negative tag with the same helping verb.'),
  I('They are late, ___?', 'aren\'t they', w('M8_QT_ISNT_IT', 'isn\'t it').concat(w('M8_QT_SAME_SIGN', 'are they'), w('M8_QT_WRONG_AUX', 'don\'t they')), 'The tag repeats are and they.'),
  I('She likes tea, ___?', 'doesn\'t she', w('M8_QT_WRONG_AUX', 'isn\'t she').concat(w('M8_QT_SAME_SIGN', 'does she'), w('M8_QT_ISNT_IT', 'isn\'t it')), 'Likes needs does in the tag.'),
  I('You do not know him, ___?', 'do you', w('M8_QT_SAME_SIGN', 'don\'t you').concat(w('M8_QT_ISNT_IT', 'isn\'t it'), w('M8_QT_WRONG_AUX', 'aren\'t you')), 'A negative sentence takes a positive tag.'),
  I('Otieno plays football, ___?', 'doesn\'t he', w('M8_QT_WRONG_AUX', 'isn\'t he').concat(w('M8_QT_SAME_SIGN', 'does he'), w('M8_QT_ISNT_IT', 'isn\'t it')), 'Plays needs does in the tag.'),
  I('We have finished, ___?', 'haven\'t we', w('M8_QT_SAME_SIGN', 'have we').concat(w('M8_QT_ISNT_IT', 'isn\'t it'), w('M8_QT_WRONG_AUX', 'don\'t we')), 'The tag repeats have.'),
  I('He can swim, ___?', 'can\'t he', w('M8_QT_SAME_SIGN', 'can he').concat(w('M8_QT_ISNT_IT', 'isn\'t it'), w('M8_QT_WRONG_AUX', 'doesn\'t he')), 'The tag repeats can.'),
];

export const FAMILIES = [
  ...P('compound', 'GRAMMA.T1.COMPOUND_NOUNS', COMPOUND, { hints: ['Is it one word, two words or a hyphenated word?', 'For a plural, the main noun takes the -s.'], topic: 'with compound nouns' }),
  ...P('collective', 'GRAMMA.T2.COLLECTIVE_NOUNS', COLLECTIVE, { hints: ['Each kind of group has its own word.', 'A collective noun is one word, followed by of.'], topic: 'with collective nouns' }),
  ...P('auxiliary', 'GRAMMA.T3.AUXILIARY_VERBS', AUX, { hints: ['Check who or what the subject is.', 'After do, does or did the main verb stays plain.'], topic: 'with helping verbs' }),
  ...P('tense', 'GRAMMA.T4.PRESENT_PAST_TENSE', TENSE, { hints: ['Is it a habit or something finished?', 'He, she, it and one name take -s in the present.'], topic: 'in the simple present and past' }),
  ...P('gradable', 'GRAMMA.T5.GRADABLE_ADJECTIVES', GRADABLE, { hints: ['Can the adjective be more or less?', 'Very goes with gradable adjectives; absolutely goes with non-gradable ones.'], topic: 'with adjectives' }),
  ...P('fd.degree', 'GRAMMA.T6.FREQUENCY_DEGREE', FD_GAP, { oc: ['b', 'b', 'b'], hints: ['Think: very means a lot; too means more than is wanted.', 'Never already means not ever.'], topic: 'with adverbs of degree and frequency' }),
  C('fd.place', 'choose-sentence', 'GRAMMA.T6.FREQUENCY_DEGREE', FD_SENT, { stem: SENT, oc: 'a', form: 'direct', hints: ['Before the main verb, after be.', 'Read the sentence aloud.'] }),
  ...P('reflexive', 'GRAMMA.T7.INDEFINITE_REFLEXIVE', REFLEX, { hints: ['Does the pronoun point back to the subject?', 'Plural reflexives end in -selves. Everyone and nobody are singular.'], topic: 'with reflexive and indefinite pronouns' }),
  ...P('prep', 'GRAMMA.T8.PREPOSITIONS_PLACE_TIME', PREP, { hints: ['At for a point or a clock time, on for a day or a surface, in for a month or inside.', 'Between is for two things.'], topic: 'with prepositions' }),
  ...P('conj', 'GRAMMA.T9.CONJUNCTIONS_LISTED', CONJ, { hints: ['What do the two parts say to each other: a reason, a contrast, a condition, a limit in time?', 'Use one joining word, not two.'], topic: 'with conjunctions' }),
  ...P('demo', 'GRAMMA.T10.DEMONSTRATIVES_QUANTIFIERS', DEMO, { hints: ['One or many? Near or far? Can it be counted?', 'This and that are one; these and those are many.'], topic: 'with demonstratives and quantifiers' }),
  ...P('advform', 'GRAMMA.T11.ADVERB_FORMATION', ADVF, { stem: 'Choose the correct adverb.', hints: ['The adverb describes the verb.', 'Change y to i before -ly; fast, hard and late stay the same.'], topic: 'with adverbs formed from adjectives' }),
  ...P('phrasal', 'GRAMMA.T12.PHRASAL_VERBS', PV_GAP, { stem: 'Choose the phrasal verb that fits.', hints: ['The particle changes the meaning.', 'Read the whole sentence before you choose.'], topic: 'with phrasal verbs' }),
  C('phrasal.mean', 'choose-meaning', 'GRAMMA.T12.PHRASAL_VERBS', PV_MEAN, { stem: 'Choose the meaning.', oc: 'a', form: 'word', rung: 2, hints: ['A phrasal verb has its own meaning.', 'Do not read it word by word.'] }),
  ...P('cs.conj', 'GRAMMA.T13.COMPOUND_SENTENCES', CS_GAP, { stem: 'Choose the conjunction that joins the sentences.', hints: ['So gives a result, but a contrast, and an addition, or a choice, nor another negative.', 'Both parts must be complete sentences.'], topic: 'with joined sentences', oc: ['b', 'b', 'b'] }),
  C('cs.comma', 'choose-sentence', 'GRAMMA.T13.COMPOUND_SENTENCES', CS_SENT, { stem: SENT, oc: 'a', hints: ['Two sentences need a conjunction and a comma.', 'A comma alone is not enough.'] }),
  ...P('passive', 'GRAMMA.T14.ACTIVE_PASSIVE', AP_GAP, { stem: 'Choose the word that completes the passive sentence.', hints: ['The passive uses be and the past participle.', 'The subject receives the action.'], topic: 'in the passive voice', oc: ['b', 'b', 'c'] }),
  C('passive.voice', 'choose-voice', 'GRAMMA.T14.ACTIVE_PASSIVE', AP_ID, { stem: 'Choose the correct sentence.', oc: 'a', hints: ['Who or what does the action?', 'In the passive the subject receives the action.'] }),
  ...P('tag', 'GRAMMA.T15.QUESTION_TAGS', TAGS, { stem: 'Choose the correct question tag.', hints: ['A positive sentence takes a negative tag and a negative sentence takes a positive tag.', 'Repeat the helping verb of the sentence.'], topic: 'with question tags' }),
];
