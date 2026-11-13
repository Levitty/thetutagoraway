// ============================================================================
// ENGLISH GRADE 7, LANGUAGE: nouns, verbs, tenses, adjectives, adverbs, pronouns, prepositions, conjunctions, articles,
// sentences (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g7.json). Off for children (reviewed:false) until a
// Kenyan English teacher signs them off. See docs/qa/english-g7-review-2026-11-13.md.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './english_g7_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
const GH = ['Read the sentence slowly, one word at a time.', 'Check your word by reading the sentence aloud.'];
// An item: [text, right, [wrong, 'M_CODE']..., because]. w('CODE', a, b, c) makes the wrong answers of one misconception.
const w = (code, ...xs) => xs.map(x => [x, code]);
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english7.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english7.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english7.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
// A choose family of its own structure (kind) from a pool of questions or whole sentences.
const C = (key, kind, cs, pool, { stem = 'Choose.', hints, oc, form = 'direct', rung = 1 }) =>
  eng({ id: `english7.${key}`, kind, cs, oc: oc || outcomeLetters(cs, 1)[0], form, rung, gen: choose(pool, { stem, hints }) });
// A spot family of its own (whole-sentence pools).
const SP = (key, cs, pool, { topic, hints, oc, rung = 3 }) =>
  eng({ id: `english7.${key}.spot`, cs, oc: oc || outcomeLetters(cs, 1)[0], form: 'spot', rung, gen: spot(pool, { topic, hints }) });

// ---------------------------------------------------------------- nouns: collective
const COLL = [
  I('A ___ of bees settled on the old tree.', 'swarm|colony', w('M7_NT_COLLECTIVE_WRONG', 'herd', 'flock', 'pride'), 'Bees fly in a swarm: a swarm of bees.'),
  I('A ___ of birds flew over the school.', 'flock', [['flocks', 'M7_NT_COLLECTIVE_PLURAL'], ...w('M7_NT_COLLECTIVE_WRONG', 'herd', 'pride')], 'One group of birds is a flock. A collective noun names the group as one thing.'),
  I('The farmer drove his ___ of cattle to the river.', 'herd', w('M7_NT_COLLECTIVE_WRONG', 'swarm', 'pride', 'bunch'), 'Cattle go in a herd.'),
  I('A ___ of lions rested under the acacia tree.', 'pride', w('M7_NT_COLLECTIVE_WRONG', 'swarm', 'flock', 'herd'), 'Lions live in a pride.'),
  I('A ___ of bananas hung in the shop.', 'bunch|hand', w('M7_NT_COLLECTIVE_WRONG', 'swarm', 'pride', 'herd'), 'Bananas grow and are sold in a bunch.'),
  I('We saw a ___ of wolves in the film.', 'pack', w('M7_NT_COLLECTIVE_WRONG', 'swarm', 'herd', 'pride'), 'Wolves hunt in a pack.'),
  I('A ___ of fish swam under the boat.', 'school|shoal', w('M7_NT_COLLECTIVE_WRONG', 'pride', 'herd', 'bunch'), 'Fish swim in a school or a shoal.'),
  I('A ___ of locusts darkened the sky over the farm.', 'swarm|plague', [['swarms', 'M7_NT_COLLECTIVE_PLURAL'], ...w('M7_NT_COLLECTIVE_WRONG', 'pride', 'bunch')], 'Locusts fly in a swarm. We say a swarm, one group.'),
];
const NT_ID = [
  I('Which of these is a proper noun.', 'Mombasa', w('M7_NT_COMMON_PROPER', 'city', 'town', 'harbour'), 'Mombasa is the name of one particular place, so it is a proper noun.'),
  I('Which of these is a collective noun.', 'herd', w('M7_NT_COLLECTIVE_SINGLE', 'cow', 'farmer', 'pasture'), 'A herd is a group of animals named as one. A cow is one animal.'),
  I('Which of these is an abstract noun.', 'courage', w('M7_NT_ABSTRACT_COMMON', 'bridge', 'teacher', 'drum'), 'Courage is an idea. You cannot touch it.'),
  I('Which of these is a common noun.', 'river', w('M7_NT_COMMON_PROPER', 'Nile', 'Africa', 'Wanjiru'), 'River is the word for every river. The Nile is one particular river.'),
  I('Which of these is a collective noun.', 'team', w('M7_NT_COLLECTIVE_SINGLE', 'player', 'ball', 'referee'), 'A team is a group of players named as one.'),
  I('Which of these is a proper noun.', 'Wednesday', w('M7_NT_COMMON_PROPER', 'week', 'day', 'weekend'), 'Wednesday is the name of one particular day.'),
  I('Which of these is an abstract noun.', 'friendship', w('M7_NT_ABSTRACT_COMMON', 'friend', 'school', 'gift'), 'Friendship is a feeling between people. You cannot touch it.'),
  I('Which of these is a proper noun.', 'Mount Kenya', w('M7_NT_COMMON_PROPER', 'mountain', 'hill', 'valley'), 'Mount Kenya is the name of one particular mountain.'),
];
const NT_CAP = [
  I('', 'On Friday we travelled to Mombasa.', [['on friday we travelled to Mombasa.', 'M7_NT_PROPER_SMALL'], ['On Friday we travelled to mombasa.', 'M7_NT_PROPER_SMALL'], ['On Friday we Travelled to Mombasa.', 'M7_NT_PROPER_SMALL']], 'Friday and Mombasa are proper nouns and need capitals. Travelled is not.'),
  I('', 'My cousin Achieng lives near Lake Victoria.', [['My cousin achieng lives near Lake Victoria.', 'M7_NT_PROPER_SMALL'], ['My cousin Achieng lives near lake victoria.', 'M7_NT_PROPER_SMALL'], ['My Cousin Achieng lives near Lake Victoria.', 'M7_NT_PROPER_SMALL']], 'Achieng and Lake Victoria are names and need capitals. Cousin is a common noun here.'),
  I('', 'The headteacher of Moi Primary School spoke to us.', [['The headteacher of moi primary school spoke to us.', 'M7_NT_PROPER_SMALL'], ['The headteacher of Moi primary school spoke to us.', 'M7_NT_PROPER_SMALL']], 'The name of the school needs capitals. Headteacher is a common noun here.'),
  I('', 'In December the Mara River is full.', [['In december the Mara River is full.', 'M7_NT_PROPER_SMALL'], ['In December the mara river is full.', 'M7_NT_PROPER_SMALL']], 'December and Mara River are proper nouns.'),
  I('', 'The Nile flows north through Egypt.', [['The nile flows north through egypt.', 'M7_NT_PROPER_SMALL'], ['The Nile flows North through Egypt.', 'M7_NT_PROPER_SMALL']], 'Nile and Egypt are proper nouns. A direction such as north is a common noun.'),
  I('', 'Mr Otieno teaches English on Mondays.', [['mr otieno teaches English on Mondays.', 'M7_NT_PROPER_SMALL'], ['Mr Otieno teaches english on mondays.', 'M7_NT_PROPER_SMALL']], 'A title with a name, a language and the days of the week all take capitals.'),
  I('', 'We buy fresh fruit at Gikomba Market.', [['We buy fresh fruit at gikomba market.', 'M7_NT_PROPER_SMALL'], ['We Buy Fresh Fruit at Gikomba Market.', 'M7_NT_PROPER_SMALL']], 'Only the name of the market needs capitals.'),
  I('', 'Our teacher lives in Eldoret, a town in Kenya.', [['Our Teacher lives in Eldoret, a Town in Kenya.', 'M7_NT_PROPER_SMALL'], ['Our teacher lives in eldoret, a town in kenya.', 'M7_NT_PROPER_SMALL']], 'Eldoret and Kenya are names. Teacher and town are common nouns.'),
];
// ---------------------------------------------------------------- count and non-count nouns
const CN = [
  I('There were too ___ people at the gate.', 'many|few', w('M7_CN_MUCH_MANY', 'much', 'a little', 'little'), 'People can be counted, so many.'),
  I('Please add a ___ sugar to my tea.', 'little', [...w('M7_CN_FEW_LITTLE', 'few'), ...w('M7_CN_MUCH_MANY', 'many', 'much')], 'Sugar cannot be counted, so a little.'),
  I('Wanjiru gave me some good ___ about my homework.', 'advice|guidance|feedback', [['advices', 'M7_CN_PLURAL_NONCOUNT'], ['an advice', 'M7_CN_A_NONCOUNT'], ['advises', 'M7_CN_PLURAL_NONCOUNT']], 'Advice is not counted and has no plural.'),
  I('We bought new ___ for the classroom.', 'furniture|equipment', [['furnitures', 'M7_CN_PLURAL_NONCOUNT'], ['a furniture', 'M7_CN_A_NONCOUNT'], ['furnishes', 'M7_CN_PLURAL_NONCOUNT']], 'Furniture is not counted and has no plural. We say a piece of furniture.'),
  I('How ___ water do you drink each day?', 'much', [...w('M7_CN_MUCH_MANY', 'many'), ...w('M7_CN_FEW_LITTLE', 'few', 'several')], 'Water cannot be counted, so how much.'),
  I('Only a ___ learners passed the quiz.', 'few', [...w('M7_CN_FEW_LITTLE', 'little'), ...w('M7_CN_MUCH_MANY', 'much', 'less')], 'Learners can be counted, so a few.'),
  I('The passengers carried heavy ___ onto the bus. (bags and suitcases)', 'luggage|baggage', w('M7_CN_PLURAL_NONCOUNT', 'luggages', 'baggages', 'lugages'), 'Luggage is not counted and has no plural.'),
  I('She asked the shopkeeper for some ___.', 'rice|sugar|flour|salt|maize|milk', [['a rice', 'M7_CN_A_NONCOUNT'], ['one rice', 'M7_CN_A_NONCOUNT'], ['rices', 'M7_CN_PLURAL_NONCOUNT']], 'Rice is not counted grain by grain. We say some rice or a bag of rice.'),
  I('The boys ate a ___ mandazis at break.', 'few', [...w('M7_CN_FEW_LITTLE', 'little'), ...w('M7_CN_MUCH_MANY', 'much', 'less')], 'Mandazis can be counted, so a few.'),
];
const CN_ID = [
  I('Which of these is a non-count noun.', 'water', w('M7_CN_COUNT_KIND', 'chair', 'book', 'goat'), 'We cannot say one water, two waters. We can say one chair.'),
  I('Which of these is a count noun.', 'mango', w('M7_CN_COUNT_KIND', 'milk', 'sugar', 'rice'), 'We can count mangoes: one mango, two mangoes. We cannot count milk.'),
  I('Which of these is a non-count noun.', 'information', w('M7_CN_COUNT_KIND', 'letter', 'pencil', 'teacher'), 'Information is not counted. We say a piece of information.'),
  I('Which of these is a count noun.', 'bottle', w('M7_CN_COUNT_KIND', 'water', 'advice', 'furniture'), 'We can count bottles: one bottle, two bottles.'),
  I('Which of these is a non-count noun.', 'luggage', w('M7_CN_COUNT_KIND', 'suitcase', 'bag', 'box'), 'Luggage is not counted. We count suitcases and bags.'),
  I('Which of these is a non-count noun.', 'flour', w('M7_CN_COUNT_KIND', 'cup', 'spoon', 'packet'), 'Flour is not counted. A cup, a spoon or a packet of flour can be counted.'),
];
// ---------------------------------------------------------------- plurals
const PL = [
  I('The ___ are playing football. (child)', 'children', w('M7_PL_ADD_S_IRREGULAR', 'childs', 'childrens', 'childes'), 'The plural of child is children.'),
  I('The nurse looked after three ___. (baby)', 'babies', w('M7_PL_Y_IES', 'babys', 'babyes', 'babis'), 'After a consonant, y changes to ies: baby, babies.'),
  I('We cut the meat with two sharp ___. (knife)', 'knives', w('M7_PL_F_VES', 'knifes', 'knifs', 'knifves'), 'The plural of knife is knives.'),
  I('One sheep ran away, so now only nineteen ___ are left.', 'sheep', w('M7_PL_SAME_FORM', 'sheeps', 'sheepes', 'sheepies'), 'Sheep has the same form in the singular and the plural.'),
  I('Mother washed all the ___. (dish)', 'dishes', w('M7_PL_ES', 'dishs', 'dishies', 'dishis'), 'After sh add -es: dish, dishes.'),
  I('The dentist looked at my ___. (tooth)', 'teeth', w('M7_PL_ADD_S_IRREGULAR', 'tooths', 'teeths', 'toothes'), 'The plural of tooth is teeth.'),
  I('Eight ___ were waiting at the gate. (man)', 'men', w('M7_PL_ADD_S_IRREGULAR', 'mans', 'mens', 'manes'), 'The plural of man is men.'),
  I('The ___ fell from the tree in the dry season. (leaf)', 'leaves', w('M7_PL_F_VES', 'leafs', 'leafes', 'leavs'), 'The plural of leaf is leaves.'),
];
const PL_KIND = [
  I('Which of these words is a plural noun.', 'children', w('M7_PL_SINGULAR_KIND', 'child', 'tooth', 'foot'), 'Children is the plural of child.'),
  I('Which of these words is a plural noun.', 'teeth', w('M7_PL_SINGULAR_KIND', 'tooth', 'child', 'woman'), 'Teeth is the plural of tooth.'),
  I('Which of these words is a singular noun.', 'woman', w('M7_PL_SINGULAR_KIND', 'women', 'men', 'geese'), 'Woman is one person. Women is more than one.'),
  I('Which of these words is a plural noun.', 'mice', w('M7_PL_SINGULAR_KIND', 'mouse', 'man', 'goose'), 'Mice is the plural of mouse.'),
  I('Which of these words is a singular noun.', 'goose', w('M7_PL_SINGULAR_KIND', 'geese', 'teeth', 'mice'), 'Goose is one bird. Geese is more than one.'),
  I('Which of these words is a plural noun.', 'men', w('M7_PL_SINGULAR_KIND', 'man', 'woman', 'child'), 'Men is the plural of man.'),
];
// ---------------------------------------------------------------- regular and irregular verbs
const IV = [
  I('Yesterday we ___ to the lake. (go)', 'went', [['goed', 'M7_IV_ED_ON_IRREGULAR'], ['gone', 'M7_IV_PAST_PARTICIPLE'], ['goes', 'M7_IV_PAST_PARTICIPLE']], 'The past of go is went.'),
  I('I ___ the lion yesterday. (see)', 'saw', [['seen', 'M7_IV_PAST_PARTICIPLE'], ['seed', 'M7_IV_ED_ON_IRREGULAR'], ['sawed', 'M7_IV_ED_ON_IRREGULAR']], 'Without has or have the past of see is saw.'),
  I('The bell has already ___. (ring)', 'rung', [['rang', 'M7_IV_PARTICIPLE_PAST'], ['ringed', 'M7_IV_ED_ON_IRREGULAR'], ['ringing', 'M7_IV_PARTICIPLE_PAST']], 'After has the past participle is used: has rung.'),
  I('Our teacher ___ us a story last week. (tell)', 'told', [['telled', 'M7_IV_REGULAR_IRREGULAR'], ['tell', 'M7_IV_REGULAR_IRREGULAR'], ['telling', 'M7_IV_REGULAR_IRREGULAR']], 'The past of tell is told.'),
  I('She has ___ all the mangoes. (eat)', 'eaten', [['ate', 'M7_IV_PARTICIPLE_PAST'], ['eated', 'M7_IV_ED_ON_IRREGULAR'], ['eating', 'M7_IV_PARTICIPLE_PAST']], 'After has the past participle is used: has eaten.'),
  I('The thief had ___ away before the police came. (run)', 'run', [['ran', 'M7_IV_PARTICIPLE_PAST'], ['runned', 'M7_IV_ED_ON_IRREGULAR'], ['running', 'M7_IV_PARTICIPLE_PAST']], 'After had the past participle is used: had run.'),
  I('Atieno ___ a new dress at the market. (buy)', 'bought', [['buyed', 'M7_IV_ED_ON_IRREGULAR'], ['buy', 'M7_IV_REGULAR_IRREGULAR'], ['buying', 'M7_IV_REGULAR_IRREGULAR']], 'The past of buy is bought.'),
  I('They have ___ the match twice this year. (win)', 'won', [['win', 'M7_IV_PARTICIPLE_PAST'], ['winned', 'M7_IV_ED_ON_IRREGULAR'], ['winning', 'M7_IV_PARTICIPLE_PAST']], 'After have the past participle is used: have won.'),
  I('We ___ our lunch at one o\'clock yesterday. (eat)', 'ate', [['eated', 'M7_IV_ED_ON_IRREGULAR'], ['eaten', 'M7_IV_PAST_PARTICIPLE'], ['eat', 'M7_IV_REGULAR_IRREGULAR']], 'Used alone the past of eat is ate.'),
  I('He has ___ a letter to his uncle. (write)', 'written', [['wrote', 'M7_IV_PARTICIPLE_PAST'], ['writed', 'M7_IV_ED_ON_IRREGULAR'], ['writing', 'M7_IV_PARTICIPLE_PAST']], 'After has the past participle is used: has written.'),
];
const IV_ID = [
  I('Which of these verbs is irregular.', 'swim', w('M7_IV_REGULAR_IRREGULAR', 'walk', 'cook', 'jump'), 'The past of swim is swam. It does not take -ed.'),
  I('Which of these verbs is regular.', 'cook', w('M7_IV_REGULAR_IRREGULAR', 'go', 'eat', 'run'), 'Cook takes -ed: cooked. Go, eat and run have their own past forms.'),
  I('Which of these verbs is irregular.', 'bring', w('M7_IV_REGULAR_IRREGULAR', 'wash', 'clean', 'paint'), 'The past of bring is brought.'),
  I('Which of these verbs is regular.', 'harvest', w('M7_IV_REGULAR_IRREGULAR', 'buy', 'write', 'know'), 'Harvest takes -ed: harvested.'),
  I('Which of these verbs is irregular.', 'teach', w('M7_IV_REGULAR_IRREGULAR', 'help', 'start', 'play'), 'The past of teach is taught.'),
  I('Which of these verbs is regular.', 'plant', w('M7_IV_REGULAR_IRREGULAR', 'see', 'take', 'give'), 'Plant takes -ed: planted.'),
];
// ---------------------------------------------------------------- choosing the tense
const TC = [
  I('Nowadays, Mama ___ to church every Sunday. (go)', 'goes', [['is going', 'M7_TC_HABIT_PRESENT_CONT'], ['went', 'M7_TC_WRONG_TIME'], ['gone', 'M7_TC_WRONG_TIME']], 'Nowadays and every Sunday show a habit in the present, so the simple present: goes.'),
  I('Yesterday, Atieno ___ to the market. (go)', 'went', [...w('M7_TC_PRESENT_FOR_PAST', 'goes', 'go'), ['going', 'M7_TC_WRONG_TIME']], 'Yesterday is past time, so the verb is in the past: went.'),
  I('Tomorrow we ___ to Mombasa. (go)', 'will go', [['went', 'M7_TC_PAST_FOR_FUTURE'], ['have gone', 'M7_TC_PAST_FOR_FUTURE'], ['will went', 'M7_TC_WILL_PAST']], 'Tomorrow has not happened yet, so will + the plain verb: will go.'),
  I('These days my father ___ to work by matatu every morning. (go)', 'goes', w('M7_TC_WRONG_TIME', 'went', 'will go', 'gone'), 'These days and every morning show a habit in the present, so the simple present: goes.'),
  I('Next week our class ___ a trip. (take)', 'will take', [['will took', 'M7_TC_WILL_PAST'], ['took', 'M7_TC_PAST_FOR_FUTURE'], ['taking', 'M7_TC_WRONG_TIME']], 'Next week is future, so will + the plain verb: will take.'),
  I('Last Saturday we ___ the maize. (harvest)', 'harvested', [['harvest', 'M7_TC_PRESENT_FOR_PAST'], ['will harvest', 'M7_TC_WRONG_TIME'], ['harvesting', 'M7_TC_WRONG_TIME']], 'Last Saturday is past, so the simple past: harvested.'),
  I('The sun ___ in the east every day. (rise)', 'rises', w('M7_TC_WRONG_TIME', 'rose', 'rising', 'risen'), 'A fact that is always true uses the simple present: rises.'),
  I('In 2020, my sister ___ in Grade 4. (be)', 'was', [['is', 'M7_TC_PRESENT_FOR_PAST'], ['will be', 'M7_TC_WRONG_TIME'], ['be', 'M7_TC_WRONG_TIME']], 'In 2020 is past time, so was.'),
  I('This time next year, Wanjiru ___ in Grade 8. (be)', 'will be', [['was', 'M7_TC_PAST_FOR_FUTURE'], ['is', 'M7_TC_WRONG_TIME'], ['be', 'M7_TC_WRONG_TIME']], 'Next year is future, so will be.'),
];
// ---------------------------------------------------------------- simple present
const SPR = [
  I('Wanjiru ___ to school every day. (walk)', 'walks', [['walk', 'M7_SP_NO_S'], ['walkes', 'M7_SP_ES'], ['walking', 'M7_SP_WRONG_FORM']], 'After one name the simple present verb ends in -s: walks.'),
  I('The boys ___ football every afternoon. (play)', 'play', [['plays', 'M7_SP_S_PLURAL'], ['playing', 'M7_SP_WRONG_FORM'], ['is play', 'M7_SP_WRONG_FORM']], 'The boys is more than one, so the verb has no -s.'),
  I('My brother does not ___ coffee. (drink)', 'drink', [['drinks', 'M7_SP_DOES_S'], ['drank', 'M7_SP_WRONG_FORM'], ['drinking', 'M7_SP_WRONG_FORM']], 'After does not use the plain verb: does not drink.'),
  I('Our neighbour ___ not own a car. (do)', 'does', [['do', 'M7_SP_DO_THIRD'], ['done', 'M7_SP_WRONG_FORM'], ['doing', 'M7_SP_WRONG_FORM']], 'One person takes does: our neighbour does not.'),
  I('The cook ___ the dishes after supper. (wash)', 'washes', [['washs', 'M7_SP_ES'], ['wash', 'M7_SP_NO_S'], ['washing', 'M7_SP_WRONG_FORM']], 'After sh the ending is -es: washes.'),
  I('My sister ___ to music while she studies. (listen)', 'listens', [['listen', 'M7_SP_NO_S'], ['listenes', 'M7_SP_ES'], ['listening', 'M7_SP_WRONG_FORM']], 'One person takes -s: she listens.'),
  I('The cows ___ grass in the morning. (eat)', 'eat', [['eats', 'M7_SP_S_PLURAL'], ['eating', 'M7_SP_WRONG_FORM'], ['eated', 'M7_SP_WRONG_FORM']], 'The cows is more than one, so the plain verb: eat.'),
  I('Mr Kamau ___ not teach on Saturdays. (do)', 'does', [['do', 'M7_SP_DO_THIRD'], ['done', 'M7_SP_WRONG_FORM'], ['doing', 'M7_SP_WRONG_FORM']], 'One person takes does: Mr Kamau does not teach.'),
  I('A baby ___ milk many times a day. (drink)', 'drinks', [['drink', 'M7_SP_NO_S'], ['drinkes', 'M7_SP_ES'], ['drinking', 'M7_SP_WRONG_FORM']], 'A baby is one person, so the verb ends in -s: drinks.'),
];
// ---------------------------------------------------------------- simple past
const SPA = [
  I('Did you ___ the match yesterday? (watch)', 'watch', [['watched', 'M7_SPA_DID_PAST'], ['watching', 'M7_SPA_DID_PAST'], ['watches', 'M7_SPA_DID_PAST']], 'After did use the plain verb: did you watch.'),
  I('Last Saturday we ___ the maize. (harvest)', 'harvested', [['harvest', 'M7_SPA_NO_ED'], ['harvesting', 'M7_SPA_NO_ED'], ['harvests', 'M7_SPA_NO_ED']], 'Last Saturday is past. A regular verb adds -ed.'),
  I('The driver ___ at the junction. (stop)', 'stopped', [['stoped', 'M7_SPA_SPELL_ED'], ['stop', 'M7_SPA_NO_ED'], ['stopping', 'M7_SPA_NO_ED']], 'Double the p before -ed: stopped.'),
  I('The children ___ happy to see the visitors. (be)', 'were', [['was', 'M7_SPA_WAS_WERE'], ['is', 'M7_SPA_WAS_WERE'], ['be', 'M7_SPA_WAS_WERE']], 'The children is more than one, so were.'),
  I('She did not ___ her homework. (finish)', 'finish', [['finished', 'M7_SPA_DID_PAST'], ['finishes', 'M7_SPA_DID_PAST'], ['finishing', 'M7_SPA_DID_PAST']], 'After did not use the plain verb: did not finish.'),
  I('We ___ our lessons before supper. (study)', 'studied', [['studyed', 'M7_SPA_SPELL_ED'], ['study', 'M7_SPA_NO_ED'], ['studing', 'M7_SPA_SPELL_ED']], 'After a consonant, y changes to i before -ed: studied.'),
  I('Atieno ___ to the river with her mother yesterday. (walk)', 'walked', [['walk', 'M7_SPA_NO_ED'], ['walkd', 'M7_SPA_SPELL_ED'], ['walking', 'M7_SPA_NO_ED']], 'Yesterday is past. Walk adds -ed: walked.'),
  I('Wanjiru ___ late for school yesterday. (be)', 'was', [['were', 'M7_SPA_WAS_WERE'], ['is', 'M7_SPA_WAS_WERE'], ['be', 'M7_SPA_WAS_WERE']], 'One person in the past takes was.'),
  I('They ___ the ball over the fence. (kick)', 'kicked', [['kick', 'M7_SPA_NO_ED'], ['kicks', 'M7_SPA_NO_ED'], ['kicking', 'M7_SPA_NO_ED']], 'The action is finished, so the past: kicked.'),
  I('The teacher ___ us if we had finished. (ask)', 'asked', [['ask', 'M7_SPA_NO_ED'], ['askd', 'M7_SPA_SPELL_ED'], ['asks', 'M7_SPA_NO_ED']], 'Had finished shows the story is in the past, so asked.'),
];
// ---------------------------------------------------------------- comparative and superlative adjectives
const DEG = [
  I('Kamau is ___ than his brother. (tall)', 'taller', [['more taller', 'M7_AD_MORE_ER'], ['tallest', 'M7_AD_THAN_THE'], ['tall', 'M7_AD_PLAIN_FORM']], 'A short adjective takes -er with than: taller than.'),
  I('This dress is ___ than that one.', 'more beautiful', [['beautifuler', 'M7_AD_LONG_ER'], ['most beautiful', 'M7_AD_THAN_THE'], ['beautiful', 'M7_AD_PLAIN_FORM']], 'A long adjective takes more with than: more beautiful than.'),
  I('Her marks are ___ than mine. (good)', 'better', [['gooder', 'M7_AD_IRREGULAR'], ['more good', 'M7_AD_IRREGULAR'], ['best', 'M7_AD_THAN_THE']], 'The comparative of good is better.'),
  I('Mount Kenya is the ___ mountain in Kenya. (high)', 'highest', [['higher', 'M7_AD_THAN_THE'], ['most high', 'M7_AD_MORE_ER'], ['high', 'M7_AD_PLAIN_FORM']], 'The picks one of many: the highest.'),
  I('Today is ___ than yesterday. (hot)', 'hotter', [['hoter', 'M7_AD_SPELL_ER'], ['more hot', 'M7_AD_MORE_ER'], ['hottest', 'M7_AD_THAN_THE']], 'Double the t before -er: hotter.'),
  I('This is the ___ film I have ever seen. (interesting)', 'most interesting', [['interestingest', 'M7_AD_LONG_ER'], ['more interesting', 'M7_AD_THAN_THE'], ['interesting', 'M7_AD_PLAIN_FORM']], 'A long adjective takes most in the superlative: the most interesting.'),
  I('Her handwriting is ___ than mine. (neat)', 'neater', [['more neater', 'M7_AD_MORE_ER'], ['neatest', 'M7_AD_THAN_THE'], ['neat', 'M7_AD_PLAIN_FORM']], 'Neat takes -er: neater than.'),
  I('He is the ___ boy in the class. (bad)', 'worst', [['baddest', 'M7_AD_IRREGULAR'], ['worse', 'M7_AD_THAN_THE'], ['most bad', 'M7_AD_IRREGULAR']], 'The superlative of bad is worst.'),
  I('That was the ___ day of the year. (happy)', 'happiest', [['happyest', 'M7_AD_SPELL_ER'], ['happier', 'M7_AD_THAN_THE'], ['happy', 'M7_AD_PLAIN_FORM']], 'Y changes to i before -est: happiest.'),
  I('The river is ___ in the rainy season than in the dry season. (wide)', 'wider', [['more wider', 'M7_AD_MORE_ER'], ['widest', 'M7_AD_THAN_THE'], ['wide', 'M7_AD_PLAIN_FORM']], 'Wide takes -er with than: wider than.'),
];
const DEG_ID = [
  I('Which of these words is a superlative adjective.', 'smallest', [['smaller', 'M7_AD_THAN_THE'], ['small', 'M7_AD_PLAIN_FORM'], ['more small', 'M7_AD_MORE_ER']], 'Smallest picks out the one that is least in size from a group, so it is the superlative.'),
  I('Which of these words is a comparative adjective.', 'happier', [['happiest', 'M7_AD_THAN_THE'], ['happy', 'M7_AD_PLAIN_FORM'], ['happily', 'M7_AD_PLAIN_FORM']], 'Happier compares two things, so it is the comparative.'),
  I('In "Amina is as kind as her sister", the adjective kind is in which form.', 'simple', [['comparative', 'M7_AD_THAN_THE'], ['superlative', 'M7_AD_THAN_THE'], ['adverb', 'M7_AD_PLAIN_FORM']], 'In as ... as the plain, simple form is used.'),
  I('In "This is the most beautiful beach in Kenya", the adjective is in which form.', 'superlative', [['comparative', 'M7_AD_THAN_THE'], ['simple', 'M7_AD_PLAIN_FORM'], ['adverb', 'M7_AD_PLAIN_FORM']], 'Most beautiful in Kenya picks one from many, so it is the superlative.'),
  I('Which sentence uses a comparative adjective.', 'Mombasa is hotter than Nakuru.', [['Mombasa is the hottest town in Kenya.', 'M7_AD_THAN_THE'], ['Mombasa is as hot as Kisumu.', 'M7_AD_PLAIN_FORM'], ['Mombasa is hot.', 'M7_AD_PLAIN_FORM']], 'Hotter than compares two places, so it is the comparative.'),
  I('Which sentence uses a superlative adjective.', 'Lake Victoria is the largest lake in Africa.', [['Lake Victoria is larger than Lake Naivasha.', 'M7_AD_THAN_THE'], ['Lake Victoria is as big as a sea.', 'M7_AD_PLAIN_FORM'], ['Lake Victoria is large.', 'M7_AD_PLAIN_FORM']], 'The largest in Africa picks one from all, so it is the superlative.'),
];
// ---------------------------------------------------------------- adverbs
const AK_KIND = [
  I('In "She arrived yesterday", what does yesterday tell us.', 'when', w('M7_AK_TIME_MANNER', 'how', 'where', 'why'), 'Yesterday tells when she arrived, so it is an adverb of time.'),
  I('In "The children played outside", what does outside tell us.', 'where', [['when', 'M7_AK_PLACE_TIME'], ['how', 'M7_AK_PLACE_TIME'], ['why', 'M7_AK_PLACE_TIME']], 'Outside tells where they played, so it is an adverb of place.'),
  I('In "He answered politely", what does politely tell us.', 'how', [['where', 'M7_AK_MANNER_PLACE'], ['when', 'M7_AK_MANNER_PLACE'], ['why', 'M7_AK_MANNER_PLACE']], 'Politely tells how he answered, so it is an adverb of manner.'),
  I('In "The bus will leave soon", what does soon tell us.', 'when', w('M7_AK_TIME_MANNER', 'how', 'where', 'why'), 'Soon tells when the bus will leave, so it is an adverb of time.'),
  I('In "Please sit here", what does here tell us.', 'where', [['when', 'M7_AK_PLACE_TIME'], ['how', 'M7_AK_PLACE_TIME'], ['why', 'M7_AK_PLACE_TIME']], 'Here tells where to sit, so it is an adverb of place.'),
  I('In "The nurse worked carefully", what does carefully tell us.', 'how', [['where', 'M7_AK_MANNER_PLACE'], ['when', 'M7_AK_MANNER_PLACE'], ['why', 'M7_AK_MANNER_PLACE']], 'Carefully tells how the nurse worked, so it is an adverb of manner.'),
  I('In "We looked everywhere", what does everywhere tell us.', 'where', [['when', 'M7_AK_PLACE_TIME'], ['how', 'M7_AK_PLACE_TIME'], ['why', 'M7_AK_PLACE_TIME']], 'Everywhere tells where we looked, so it is an adverb of place.'),
  I('In "He ran quickly", what does quickly tell us.', 'how', [['where', 'M7_AK_MANNER_PLACE'], ['when', 'M7_AK_MANNER_PLACE'], ['why', 'M7_AK_MANNER_PLACE']], 'Quickly tells how he ran, so it is an adverb of manner.'),
];
const AK_FIND = [
  I('Find the adverb in this sentence: "The old man walked slowly."', 'slowly', w('M7_AK_ADJECTIVE_ADVERB', 'old', 'man', 'walked'), 'Slowly tells how the man walked, so it is the adverb.'),
  I('Find the adverb of time: "We will visit our grandmother tomorrow."', 'tomorrow', w('M7_AK_ADJECTIVE_ADVERB', 'visit', 'grandmother', 'our'), 'Tomorrow tells when we will visit.'),
  I('Find the adverb of place: "The children are playing outside."', 'outside', w('M7_AK_ADJECTIVE_ADVERB', 'children', 'playing', 'are'), 'Outside tells where the children are playing.'),
  I('Find the adverb of manner: "She carefully carried the water."', 'carefully', w('M7_AK_ADJECTIVE_ADVERB', 'carried', 'water', 'She'), 'Carefully tells how she carried the water.'),
  I('Find the adverb: "He spoke loudly."', 'loudly', w('M7_AK_ADJECTIVE_ADVERB', 'He', 'spoke'), 'Loudly tells how he spoke.'),
  I('Find the adverb of time: "Our guests arrived early."', 'early', w('M7_AK_ADJECTIVE_ADVERB', 'guests', 'arrived', 'Our'), 'Early tells when the guests arrived.'),
  I('Find the adverb of place: "Put the books there."', 'there', w('M7_AK_ADJECTIVE_ADVERB', 'Put', 'books', 'the'), 'There tells where to put the books.'),
];
const AF = [
  I('Achieng sings very ___. (good)', 'well', [['good', 'M7_AF_GOOD_WELL'], ['goodly', 'M7_AF_GOOD_WELL'], ['best', 'M7_AF_GOOD_WELL']], 'Well is the adverb. Good is an adjective.'),
  I('The matatu was going very ___. (not slowly)', 'fast|quickly', [['fastly', 'M7_AF_FASTLY'], ['fastily', 'M7_AF_FASTLY'], ['quick', 'M7_AF_ADJECTIVE_AFTER_VERB']], 'Fast is both an adjective and an adverb. It does not take -ly.'),
  I('Njoroge studied ___ for the examination. (with great effort)', 'hard', [['hardly', 'M7_AF_HARDLY'], ['hardy', 'M7_AF_HARDLY'], ['hardness', 'M7_AF_HARDLY']], 'Hard means with great effort. Hardly means almost not.'),
  I('The teacher spoke ___ to the class. (quiet)', 'quietly', [['quiet', 'M7_AF_ADJECTIVE_AFTER_VERB'], ['quietness', 'M7_AF_ADJECTIVE_AFTER_VERB'], ['quieting', 'M7_AF_ADJECTIVE_AFTER_VERB']], 'An action verb is described by an adverb: quietly.'),
  I('The boy answered the question ___. (easy)', 'easily', [['easyly', 'M7_AF_SPELL_LY'], ['easy', 'M7_AF_ADJECTIVE_AFTER_VERB'], ['easyer', 'M7_AF_SPELL_LY']], 'Y changes to i before -ly: easily.'),
  I('The train arrived ___ so we missed the start of the film. (not early)', 'late', [['lately', 'M7_AF_FASTLY'], ['latly', 'M7_AF_FASTLY'], ['lateness', 'M7_AF_FASTLY']], 'Late is an adverb on its own. Lately means recently.'),
  I('She ___ finished her homework and went to play. (quick)', 'quickly', [['quick', 'M7_AF_ADJECTIVE_AFTER_VERB'], ['quickily', 'M7_AF_SPELL_LY'], ['quickness', 'M7_AF_ADJECTIVE_AFTER_VERB']], 'An adverb tells how she finished: quickly.'),
  I('The children ran ___ down the hill. (happy)', 'happily', [['happyly', 'M7_AF_SPELL_LY'], ['happy', 'M7_AF_ADJECTIVE_AFTER_VERB'], ['happier', 'M7_AF_ADJECTIVE_AFTER_VERB']], 'Y changes to i before -ly: happily.'),
];
// ---------------------------------------------------------------- personal pronouns
const PP = [
  I('___ and Juma went to the river. (I)', 'I', w('M7_PP_OBJECT_SUBJECT', 'Me', 'Mine', 'My'), 'Before the verb the subject form is used: I went.'),
  I('The teacher gave the prize to Atieno and ___. (I)', 'me', [['I', 'M7_PP_SUBJECT_OBJECT'], ['my', 'M7_PP_SUBJECT_OBJECT'], ['mine', 'M7_PP_SUBJECT_OBJECT']], 'After to the object form is used: to Atieno and me.'),
  I('The headteacher thanked ___ for the clean compound. (we)', 'us', [['we', 'M7_PP_US_WE'], ['our', 'M7_PP_US_WE'], ['ours', 'M7_PP_US_WE']], 'Thanked needs an object: us.'),
  I('Wanjiru has a younger brother. ___ is in Grade 3. (the brother)', 'He', [['She', 'M7_PP_NUMBER'], ['It', 'M7_PP_NUMBER'], ['They', 'M7_PP_NUMBER']], 'The brother is a boy, so he.'),
  I('___ are going to the market after lessons. (we)', 'We', w('M7_PP_OBJECT_SUBJECT', 'Us', 'Our', 'Ours'), 'The subject form is used before the verb: we are going.'),
  I('Mama called Peter and Mary. She told ___ to wash first. (Peter and Mary)', 'them', [['they', 'M7_PP_SUBJECT_OBJECT'], ['their', 'M7_PP_SUBJECT_OBJECT'], ['theirs', 'M7_PP_SUBJECT_OBJECT']], 'After told the object form is used: told them.'),
  I('Between you and ___, I think the film is boring. (I)', 'me', [['I', 'M7_PP_SUBJECT_OBJECT'], ['my', 'M7_PP_SUBJECT_OBJECT'], ['mine', 'M7_PP_SUBJECT_OBJECT']], 'After between the object form is used: between you and me.'),
  I('Otieno saw the thirsty goat. ___ gave it some water. (Otieno)', 'he', [['him', 'M7_PP_OBJECT_SUBJECT'], ['his', 'M7_PP_OBJECT_SUBJECT'], ['himself', 'M7_PP_OBJECT_SUBJECT']], 'The subject form is used before the verb: he gave.'),
  I('The river was full, so ___ flooded the road. (the river)', 'it', [['they', 'M7_PP_NUMBER'], ['them', 'M7_PP_OBJECT_SUBJECT'], ['its', 'M7_PP_NUMBER']], 'The river is one thing, so it.'),
  I('My cousins live in Kisii. I visit ___ every holiday. (my cousins)', 'them', [['they', 'M7_PP_SUBJECT_OBJECT'], ['their', 'M7_PP_SUBJECT_OBJECT'], ['theirs', 'M7_PP_SUBJECT_OBJECT']], 'After visit the object form is used: visit them.'),
];
const PP_SENT = [
  I('', 'Juma and I went to the lake.', [['Juma and me went to the lake.', 'M7_PP_OBJECT_SUBJECT'], ['Me and Juma went to the lake.', 'M7_PP_OBJECT_SUBJECT'], ['Juma he and I went to the lake.', 'M7_PP_DOUBLE_SUBJECT']], 'Juma and I are the subject of went, so the subject form I is used.'),
  I('', 'My teacher gave the books to Akinyi and me.', [['My teacher gave the books to Akinyi and I.', 'M7_PP_SUBJECT_OBJECT'], ['My teacher she gave the books to Akinyi and me.', 'M7_PP_DOUBLE_SUBJECT']], 'After to the object form me is used. The teacher is named once.'),
  I('', 'My mother is a nurse.', [['My mother she is a nurse.', 'M7_PP_DOUBLE_SUBJECT'], ['Me mother is a nurse.', 'M7_PP_OBJECT_SUBJECT']], 'The noun is the subject, so no pronoun is added after it.'),
  I('', 'They invited us to the party.', [['Them invited us to the party.', 'M7_PP_OBJECT_SUBJECT'], ['They invited we to the party.', 'M7_PP_US_WE'], ['They they invited us to the party.', 'M7_PP_DOUBLE_SUBJECT']], 'They is the subject and us is the object.'),
  I('', 'Our teacher told Baraka and him to stay.', [['Our teacher told Baraka and he to stay.', 'M7_PP_SUBJECT_OBJECT'], ['Our teacher he told Baraka and him to stay.', 'M7_PP_DOUBLE_SUBJECT']], 'After told the object form him is used.'),
  I('', 'The girls say they like the new library.', [['The girls they say they like the new library.', 'M7_PP_DOUBLE_SUBJECT'], ['The girls say them like the new library.', 'M7_PP_OBJECT_SUBJECT']], 'The girls is named once. They is the subject of like.'),
];
// ---------------------------------------------------------------- possessives
const POS = [
  I('The dog wagged ___ tail. (the dog)', 'its', [['it\'s', 'M7_PO_ITS_ITS'], ['its\'', 'M7_PO_ITS_ITS'], ['it', 'M7_PO_SUBJECT_FOR_POSSESSIVE']], 'Belonging has no apostrophe: its tail. It\'s means it is.'),
  I('This book belongs to her. This book is ___.', 'hers', [['her\'s', 'M7_PO_APOSTROPHE_PRONOUN'], ['her', 'M7_PO_MINE_MY'], ['she', 'M7_PO_SUBJECT_FOR_POSSESSIVE']], 'A possessive pronoun that stands alone never takes an apostrophe: hers.'),
  I('Is this your pencil? Yes, it is ___.', 'mine', [['my', 'M7_PO_MINE_MY'], ['me', 'M7_PO_SUBJECT_FOR_POSSESSIVE'], ['I', 'M7_PO_SUBJECT_FOR_POSSESSIVE']], 'When no noun follows, use mine.'),
  I('The boys left ___ bags in the classroom.', 'their', [['they', 'M7_PO_SUBJECT_FOR_POSSESSIVE'], ['there', 'M7_PO_THEIR_THERE'], ['theirs', 'M7_PO_MINE_MY']], 'Their shows belonging before a noun.'),
  I('The girls took ___ lunch to the field.', 'their', [['there', 'M7_PO_THEIR_THERE'], ['they\'re', 'M7_PO_THEIR_THERE'], ['theirs', 'M7_PO_MINE_MY']], 'Their shows that the lunch belongs to them.'),
  I('Those shoes belong to you. They are ___.', 'yours', [['your\'s', 'M7_PO_APOSTROPHE_PRONOUN'], ['your', 'M7_PO_MINE_MY'], ['you', 'M7_PO_SUBJECT_FOR_POSSESSIVE']], 'Yours stands alone and never takes an apostrophe.'),
  I('We cleaned ___ classroom on Friday. (we)', 'our', [['ours', 'M7_PO_MINE_MY'], ['we', 'M7_PO_SUBJECT_FOR_POSSESSIVE'], ['us', 'M7_PO_SUBJECT_FOR_POSSESSIVE']], 'Our comes before a noun.'),
  I('The teachers said ___ going to be late.', 'they\'re', [['their', 'M7_PO_THEIR_THERE'], ['there', 'M7_PO_THEIR_THERE'], ['theirs', 'M7_PO_THEIR_THERE']], 'They\'re is short for they are: they are going to be late.'),
  I('Our classroom is blue. The one next door is ___. (they)', 'theirs', [['their\'s', 'M7_PO_APOSTROPHE_PRONOUN'], ['their', 'M7_PO_MINE_MY'], ['they', 'M7_PO_SUBJECT_FOR_POSSESSIVE']], 'Theirs stands alone and never takes an apostrophe.'),
];
// ---------------------------------------------------------------- prepositions
const PRE = [
  I('The meeting starts ___ Monday.', 'on', [['at', 'M7_PR_AT_ON_IN_TIME'], ['in', 'M7_PR_AT_ON_IN_TIME'], ['to', 'M7_PR_AT_ON_IN_TIME']], 'Use on with days: on Monday.'),
  I('We are going ___ the market.', 'to|towards', [['in', 'M7_PR_TO_IN_PLACE'], ['at', 'M7_PR_TO_IN_PLACE'], ['on', 'M7_PR_TO_IN_PLACE']], 'To shows the direction of a movement: going to the market.'),
  I('We walked ___ the bridge to reach the other side.', 'across|over', [['at', 'M7_PR_TO_IN_PLACE'], ['among', 'M7_PR_TO_IN_PLACE'], ['since', 'M7_PR_TO_IN_PLACE']], 'Across shows a movement from one side to the other.'),
  I('Please wait for me ___ the bus stop.', 'at|near|by', [['on', 'M7_PR_ON_AT_PLACE'], ['in', 'M7_PR_ON_AT_PLACE'], ['to', 'M7_PR_ON_AT_PLACE']], 'At shows a point where we wait: at the bus stop.'),
  I('The school opens ___ eight o\'clock.', 'at', [['on', 'M7_PR_AT_ON_IN_TIME'], ['in', 'M7_PR_AT_ON_IN_TIME'], ['to', 'M7_PR_AT_ON_IN_TIME']], 'Use at with clock times: at eight o\'clock.'),
  I('Our class goes to the library ___ the afternoon.', 'in', [['on', 'M7_PR_AT_ON_IN_TIME'], ['at', 'M7_PR_AT_ON_IN_TIME'], ['to', 'M7_PR_AT_ON_IN_TIME']], 'Use in with parts of the day: in the afternoon.'),
  I('My birthday is ___ March.', 'in', [['on', 'M7_PR_AT_ON_IN_TIME'], ['at', 'M7_PR_AT_ON_IN_TIME'], ['to', 'M7_PR_AT_ON_IN_TIME']], 'Use in with months: in March.'),
  I('The bird flew ___ the open window.', 'through|past|into', [['among', 'M7_PR_TO_IN_PLACE'], ['on', 'M7_PR_TO_IN_PLACE'], ['since', 'M7_PR_TO_IN_PLACE']], 'Through shows a movement from one side of the window to the other.'),
];
const PRE_KIND = [
  I('In "The cat is under the table", what does under show.', 'place', [['time', 'M7_PR_KIND'], ['direction', 'M7_PR_KIND'], ['reason', 'M7_PR_KIND']], 'Under shows where the cat is, so it is a preposition of place.'),
  I('In "We eat lunch at one o\'clock", what does at show.', 'time', [['place', 'M7_PR_KIND'], ['direction', 'M7_PR_KIND'], ['reason', 'M7_PR_KIND']], 'At one o\'clock tells when, so at is a preposition of time.'),
  I('In "The bird flew across the river", what does across show.', 'direction', [['time', 'M7_PR_KIND'], ['place', 'M7_PR_KIND'], ['reason', 'M7_PR_KIND']], 'Across shows the way the bird moved, so it is a preposition of direction.'),
  I('In "Our school is near the market", what does near show.', 'place', [['time', 'M7_PR_KIND'], ['direction', 'M7_PR_KIND'], ['reason', 'M7_PR_KIND']], 'Near shows where the school is.'),
  I('In "She was born in March", what does in show.', 'time', [['place', 'M7_PR_KIND'], ['direction', 'M7_PR_KIND'], ['reason', 'M7_PR_KIND']], 'In March tells when, so in is a preposition of time.'),
  I('In "He ran into the house", what does into show.', 'direction', [['time', 'M7_PR_KIND'], ['place', 'M7_PR_KIND'], ['reason', 'M7_PR_KIND']], 'Into shows the way he moved.'),
];
// ---------------------------------------------------------------- and, but, or
const CB = [
  I('I wanted to buy a book, ___ I had no money.', 'but', [['and', 'M7_CB_AND_BUT'], ['or', 'M7_CB_OR_AND'], ['so', 'M7_CB_AND_BUT']], 'The two ideas pull against each other, so but.'),
  I('Do you want to travel by bus ___ by train?', 'or', [['and', 'M7_CB_OR_AND'], ['but', 'M7_CB_OR_AND'], ['so', 'M7_CB_OR_AND']], 'A choice between two things is joined by or.'),
  I('Atieno washed the plates ___ dried them.', 'and', [['but', 'M7_CB_AND_BUT'], ['or', 'M7_CB_OR_AND'], ['nor', 'M7_CB_OR_AND']], 'Two actions that go together are joined by and.'),
  I('She is poor ___ she is honest.', 'but', [['but and', 'M7_CB_BUT_AND_DOUBLE'], ['and but', 'M7_CB_BUT_AND_DOUBLE'], ['or', 'M7_CB_OR_AND']], 'One joining word is enough. But shows the contrast between poor and honest.'),
  I('You must choose one: red ___ blue.', 'or', [['and', 'M7_CB_OR_AND'], ['but', 'M7_CB_OR_AND'], ['so', 'M7_CB_OR_AND']], 'Choose one of two things: or.'),
  I('Ouma likes football ___ his brother likes it too.', 'and', [['but', 'M7_CB_AND_BUT'], ['or', 'M7_CB_OR_AND'], ['nor', 'M7_CB_OR_AND']], 'Both like football, so the ideas are added with and.'),
  I('The soup was cold, ___ Wanjiru was very hungry, so she drank it.', 'but', [['but and', 'M7_CB_BUT_AND_DOUBLE'], ['and but', 'M7_CB_BUT_AND_DOUBLE'], ['or', 'M7_CB_OR_AND']], 'Use only one joining word. But shows the contrast between cold and hungry.'),
  I('He tried hard, ___ he did not win the race.', 'but|yet', [['and', 'M7_CB_AND_BUT'], ['or', 'M7_CB_OR_AND'], ['so', 'M7_CB_AND_BUT']], 'Trying hard and not winning pull against each other, so but.'),
];
const CB_SENT = [
  I('', 'It was late, so we went home.', [['It was late, we went home.', 'M7_CB_COMMA_JOIN'], ['It was late so and we went home.', 'M7_CB_BUT_AND_DOUBLE']], 'Two complete sentences need a joining word, not a comma alone.'),
  I('', 'She was tired, but she kept working.', [['She was tired, she kept working.', 'M7_CB_COMMA_JOIN'], ['She was tired, but and she kept working.', 'M7_CB_BUT_AND_DOUBLE']], 'But joins the two ideas. A comma alone cannot join them.'),
  I('', 'Otieno plays football, and Achieng plays netball.', [['Otieno plays football, Achieng plays netball.', 'M7_CB_COMMA_JOIN'], ['Otieno plays football, and but Achieng plays netball.', 'M7_CB_BUT_AND_DOUBLE']], 'And joins the two sentences.'),
  I('', 'We waited for an hour, but the bus did not come.', [['We waited for an hour, the bus did not come.', 'M7_CB_COMMA_JOIN'], ['We waited for an hour, and but the bus did not come.', 'M7_CB_BUT_AND_DOUBLE']], 'But joins the two ideas that pull against each other.'),
  I('', 'The rain stopped, and we went outside.', [['The rain stopped, we went outside.', 'M7_CB_COMMA_JOIN'], ['The rain stopped, and so but we went outside.', 'M7_CB_BUT_AND_DOUBLE']], 'And joins the two actions. A comma alone is not enough.'),
  I('', 'I like mangoes, but my sister likes oranges.', [['I like mangoes, my sister likes oranges.', 'M7_CB_COMMA_JOIN'], ['I like mangoes, but and my sister likes oranges.', 'M7_CB_BUT_AND_DOUBLE']], 'But shows the difference between the two sisters\' likes.'),
];
// ---------------------------------------------------------------- articles
const ART = [
  I('There was ___ egg on the table.', 'an', [['a', 'M7_AR_A_BEFORE_VOWEL'], ['many', 'M7_AR_WRONG_WORD'], ['these', 'M7_AR_WRONG_WORD']], 'Egg starts with a vowel sound, so an.'),
  I('Our teacher stayed for ___ hour after school.', 'an', [['a', 'M7_AR_A_AN_SOUND'], ['these', 'M7_AR_WRONG_WORD'], ['many', 'M7_AR_WRONG_WORD']], 'Hour starts with a vowel sound (the h is silent), so an.'),
  I('My aunt is ___ nurse at the hospital.', 'a', [['an', 'M7_AR_A_AN_SOUND'], ['nothing', 'M7_AR_NO_ARTICLE'], ['many', 'M7_AR_WRONG_WORD']], 'Nurse starts with a consonant sound, so a.'),
  I('The sun rises in ___ east.', 'the', [['a', 'M7_AR_THE_GENERAL'], ['an', 'M7_AR_THE_GENERAL'], ['these', 'M7_AR_WRONG_WORD']], 'There is only one east, so the.'),
  I('A boy found a purse. ___ boy gave it to the teacher.', 'The', [['A', 'M7_AR_FIRST_MENTION'], ['An', 'M7_AR_A_AN_SOUND'], ['Many', 'M7_AR_WRONG_WORD']], 'The boy is the one already mentioned, so the.'),
  I('Kamau wants to be ___ engineer.', 'an', [['a', 'M7_AR_A_AN_SOUND'], ['nothing', 'M7_AR_NO_ARTICLE'], ['many', 'M7_AR_WRONG_WORD']], 'Engineer starts with a vowel sound, so an.'),
  I('She bought ___ umbrella because it was raining.', 'an', [['a', 'M7_AR_A_BEFORE_VOWEL'], ['many', 'M7_AR_WRONG_WORD'], ['these', 'M7_AR_WRONG_WORD']], 'Umbrella starts with a vowel sound, so an.'),
  I('We went to ___ university in Nairobi.', 'a', [['an', 'M7_AR_A_AN_SOUND'], ['these', 'M7_AR_WRONG_WORD'], ['many', 'M7_AR_WRONG_WORD']], 'University starts with a y sound, a consonant sound, so a.'),
  I('He gave me ___ useful book.', 'a', [['an', 'M7_AR_A_AN_SOUND'], ['these', 'M7_AR_WRONG_WORD'], ['many', 'M7_AR_WRONG_WORD']], 'Useful starts with a y sound, a consonant sound, so a.'),
];
// ---------------------------------------------------------------- forming adjectives
const AFM = [
  I('It is a ___ road at night. (danger)', 'dangerous', [['danger', 'M7_AF2_NOUN_FOR_ADJ'], ['dangerly', 'M7_AF2_WRONG_SUFFIX'], ['dangeful', 'M7_AF2_WRONG_SUFFIX']], 'The adjective of danger is dangerous.'),
  I('The nurse was very ___ with the baby. (care)', 'careful', [['carely', 'M7_AF2_WRONG_SUFFIX'], ['carous', 'M7_AF2_WRONG_SUFFIX'], ['care', 'M7_AF2_NOUN_FOR_ADJ']], 'Careful means full of care.'),
  I('The young girl was very ___. (beauty)', 'beautiful', [['beautyful', 'M7_AF2_SPELL_CHANGE'], ['beautyfull', 'M7_AF2_SPELL_CHANGE'], ['beauty', 'M7_AF2_NOUN_FOR_ADJ']], 'Y changes to i before -ful: beautiful.'),
  I('The old knife is ___ because it cannot cut. (use)', 'useless', [['useful', 'M7_AF2_FUL_LESS'], ['usely', 'M7_AF2_WRONG_SUFFIX'], ['use', 'M7_AF2_NOUN_FOR_ADJ']], 'It cannot cut, so it is without use: useless.'),
  I('The ___ boy rolled in the mud. (mud)', 'muddy', [['mudy', 'M7_AF2_SPELL_CHANGE'], ['mudly', 'M7_AF2_WRONG_SUFFIX'], ['mud', 'M7_AF2_NOUN_FOR_ADJ']], 'Double the d and add y: muddy.'),
  I('The ___ girl won the singing contest. (fame)', 'famous', [['fameous', 'M7_AF2_SPELL_CHANGE'], ['famy', 'M7_AF2_WRONG_SUFFIX'], ['fame', 'M7_AF2_NOUN_FOR_ADJ']], 'The e of fame drops before -ous: famous.'),
  I('A ___ nurse brought us medicine. (help)', 'helpful', [['helpness', 'M7_AF2_WRONG_SUFFIX'], ['helply', 'M7_AF2_WRONG_SUFFIX'], ['help', 'M7_AF2_NOUN_FOR_ADJ']], 'Helpful means full of help.'),
  I('We were ___ when the dark clouds gathered. (hope)', 'hopeful', [['hopey', 'M7_AF2_WRONG_SUFFIX'], ['hopeous', 'M7_AF2_WRONG_SUFFIX'], ['hope', 'M7_AF2_NOUN_FOR_ADJ']], 'Hopeful means full of hope.'),
  I('The ___ weather ruined our picnic. (rain)', 'rainy', [['rainful', 'M7_AF2_WRONG_SUFFIX'], ['rainous', 'M7_AF2_WRONG_SUFFIX'], ['rain', 'M7_AF2_NOUN_FOR_ADJ']], 'The adjective of rain is rainy.'),
];
// ---------------------------------------------------------------- phrasal verbs with put, come, give
const PCG = [
  I('The firefighters ___ the fire in the market.', 'put out', [['put off', 'M7_PV_PUT_OFF_OUT'], ['put on', 'M7_PV_PUT_OFF_OUT'], ['put up', 'M7_PV_PUT_OFF_OUT']], 'Put out means to stop a fire burning.'),
  I('It was cold, so Baraka ___ his jacket.', 'put on|wore', [['put out', 'M7_PV_LITERAL_PUT'], ['put off', 'M7_PV_LITERAL_PUT'], ['gave away', 'M7_PV_GIVE_UP_IN']], 'Put on means to wear.'),
  I('The team was losing, but they refused to ___.', 'give up|quit', [['give away', 'M7_PV_GIVE_UP_IN'], ['put off', 'M7_PV_PUT_OFF_OUT'], ['come across', 'M7_PV_COME_ACROSS']], 'Give up means to stop trying.'),
  I('While cleaning, Ouma ___ an old photograph.', 'came across|found', [['came out', 'M7_PV_COME_ACROSS'], ['came up', 'M7_PV_COME_ACROSS'], ['came over', 'M7_PV_COME_ACROSS']], 'Came across means found by chance.'),
  I('The class tried to ___ a good name for the club.', 'come up with|think of', [['come out', 'M7_PV_WRONG_PARTICLE'], ['come in for', 'M7_PV_WRONG_PARTICLE'], ['come off with', 'M7_PV_WRONG_PARTICLE']], 'Come up with a name means to think of one.'),
  I('Our father asked us to ___ the football match until Sunday. (delay it)', 'put off|postpone', [['put out', 'M7_PV_PUT_OFF_OUT'], ['put on', 'M7_PV_PUT_OFF_OUT'], ['put in', 'M7_PV_PUT_OFF_OUT']], 'Put off means to delay.'),
  I('The child kept asking, so his mother finally ___ and bought the sweets.', 'gave in|agreed', [['gave away', 'M7_PV_GIVE_UP_IN'], ['gave out', 'M7_PV_GIVE_UP_IN'], ['gave off', 'M7_PV_GIVE_UP_IN']], 'Gave in means agreed after refusing for a while.'),
  I('The rich man decided to ___ his old clothes to the poor.', 'give away|donate', [['give up', 'M7_PV_GIVE_UP_IN'], ['give in', 'M7_PV_GIVE_UP_IN'], ['give off', 'M7_PV_GIVE_UP_IN']], 'Give away means to give for nothing.'),
  I('She was so tired that she had to ___ the race.', 'give up|quit', [['give out', 'M7_PV_GIVE_UP_IN'], ['give off', 'M7_PV_GIVE_UP_IN'], ['put off', 'M7_PV_PUT_OFF_OUT']], 'Give up the race means to stop running it.'),
  I('Wanjiru ___ a brilliant idea for the school play.', 'came up with|thought of', [['came up', 'M7_PV_WRONG_PARTICLE'], ['came off with', 'M7_PV_WRONG_PARTICLE'], ['came in with', 'M7_PV_WRONG_PARTICLE']], 'Came up with an idea means thought of one.'),
];
const PCG_MEAN = [
  I('In "The firefighters put out the fire", what does put out mean.', 'stopped it burning', [['delayed it', 'M7_PV_PUT_OFF_OUT'], ['wore it', 'M7_PV_LITERAL_PUT'], ['lit it', 'M7_PV_PUT_OFF_OUT']], 'Put out means to stop a fire.'),
  I('In "She put off the meeting until Friday", what does put off mean.', 'delayed', [['attended', 'M7_PV_PUT_OFF_OUT'], ['switched on', 'M7_PV_PUT_OFF_OUT'], ['held early', 'M7_PV_PUT_OFF_OUT']], 'Put off means to delay.'),
  I('In "He gave up smoking", what does gave up mean.', 'stopped', [['started', 'M7_PV_GIVE_UP_IN'], ['gave it to others', 'M7_PV_GIVE_UP_IN'], ['agreed to', 'M7_PV_GIVE_UP_IN']], 'Give up means to stop doing something.'),
  I('In "They gave in after a long argument", what does gave in mean.', 'agreed after refusing', [['stopped trying', 'M7_PV_GIVE_UP_IN'], ['gave things away', 'M7_PV_GIVE_UP_IN'], ['went inside', 'M7_PV_GIVE_UP_IN']], 'Give in means to agree after refusing for a while.'),
  I('In "I came across an old letter", what does came across mean.', 'found by chance', [['wrote', 'M7_PV_COME_ACROSS'], ['crossed', 'M7_PV_COME_ACROSS'], ['threw away', 'M7_PV_COME_ACROSS']], 'Come across means to find or meet by chance.'),
  I('In "Atieno came up with a plan", what does came up with mean.', 'thought of', [['climbed up', 'M7_PV_COME_ACROSS'], ['found by chance', 'M7_PV_COME_ACROSS'], ['gave away', 'M7_PV_GIVE_UP_IN']], 'Come up with means to think of an idea or a plan.'),
];
// ---------------------------------------------------------------- simple sentences
const SSC = [
  I('', 'The tall girl comes from Kisumu.', [['The tall girl from Kisumu.', 'M7_SS_FRAGMENT'], ['The tall girl runs fast, but she lost the race.', 'M7_SS_COMPOUND'], ['Comes from Kisumu.', 'M7_SS_NOT_SENTENCE']], 'A simple sentence has one subject and one verb: the girl comes.'),
  I('', 'Our school won the cup.', [['Our school and the cup.', 'M7_SS_NOT_SENTENCE'], ['Our school won the cup, and we cheered.', 'M7_SS_COMPOUND'], ['Because our school won.', 'M7_SS_FRAGMENT']], 'One subject (our school) and one verb (won) make a simple sentence.'),
  I('', 'The farmer sells vegetables at the market.', [['The farmer at the market with vegetables.', 'M7_SS_FRAGMENT'], ['The farmer sells vegetables, and his wife sells fruit.', 'M7_SS_COMPOUND'], ['Selling vegetables at the market.', 'M7_SS_NOT_SENTENCE']], 'One subject (the farmer) and one verb (sells).'),
  I('', 'The two tired children walked slowly home in the evening.', [['The two tired children walked home, but they were happy.', 'M7_SS_COMPOUND'], ['The two tired children in the evening.', 'M7_SS_FRAGMENT'], ['Walking slowly home in the evening.', 'M7_SS_NOT_SENTENCE']], 'A simple sentence can be long. It still has one subject and one verb.'),
  I('', 'Mama cooked ugali for supper.', [['Mama cooked ugali, and Baba bought fish.', 'M7_SS_COMPOUND'], ['Ugali for supper.', 'M7_SS_NOT_SENTENCE'], ['Mama and ugali for supper.', 'M7_SS_FRAGMENT']], 'One subject (Mama) and one verb (cooked).'),
  I('', 'It rained all night.', [['It rained all night, so the road was muddy.', 'M7_SS_COMPOUND'], ['All night.', 'M7_SS_NOT_SENTENCE'], ['When it rained all night.', 'M7_SS_FRAGMENT']], 'One subject (it) and one verb (rained).'),
  I('', 'The bus stopped at the gate.', [['The bus at the gate.', 'M7_SS_FRAGMENT'], ['The bus stopped, and the children got off.', 'M7_SS_COMPOUND'], ['At the gate.', 'M7_SS_NOT_SENTENCE']], 'One subject (the bus) and one verb (stopped).'),
];
const SSR = [
  I('', 'We arrived. It was dark.', [['We arrived it was dark.', 'M7_SS_RUN_ON'], ['We arrived, it was dark.', 'M7_SS_RUN_ON']], 'Two complete thoughts need a full stop or a joining word between them.'),
  I('', 'Baraka finished his homework. Then he went to play.', [['Baraka finished his homework then he went to play.', 'M7_SS_RUN_ON'], ['Baraka finished his homework, then he went to play.', 'M7_SS_RUN_ON']], 'Each complete thought needs its own sentence.'),
  I('', 'The bell rang. The learners went inside.', [['The bell rang the learners went inside.', 'M7_SS_RUN_ON'], ['The bell rang, the learners went inside.', 'M7_SS_RUN_ON']], 'Two complete thoughts need a full stop or a joining word.'),
  I('', 'Mama called us. We came at once.', [['Mama called us we came at once.', 'M7_SS_RUN_ON'], ['Mama called us, we came at once.', 'M7_SS_RUN_ON']], 'A full stop separates the two thoughts.'),
  I('', 'It was hot. We sat under the tree.', [['It was hot we sat under the tree.', 'M7_SS_RUN_ON'], ['It was hot, we sat under the tree.', 'M7_SS_RUN_ON']], 'Two sentences should not be run together.'),
  I('', 'The goat ran away. Njeri chased it.', [['The goat ran away Njeri chased it.', 'M7_SS_RUN_ON'], ['The goat ran away, Njeri chased it.', 'M7_SS_RUN_ON']], 'Use a full stop between two complete thoughts.'),
];
// ---------------------------------------------------------------- subject-verb agreement
const SVA = [
  I('The basket of mangoes ___ heavy.', 'is', [['are', 'M7_SVA_NEAR_NOUN'], ['were', 'M7_SVA_NEAR_NOUN'], ['am', 'M7_SVA_NEAR_NOUN']], 'The subject is the basket, one thing, so is.'),
  I('The boys ___ in the field.', 'play', [['plays', 'M7_SVA_PLURAL'], ['playing', 'M7_SVA_PLURAL'], ['is play', 'M7_SVA_PLURAL']], 'The boys is plural, so the verb is plural: play.'),
  I('My sister ___ music.', 'likes', [['like', 'M7_SVA_SINGULAR'], ['liking', 'M7_SVA_SINGULAR'], ['are like', 'M7_SVA_SINGULAR']], 'My sister is one person, so likes.'),
  I('Juma and Otieno ___ good friends.', 'are', [['is', 'M7_SVA_AND_SUBJECT'], ['am', 'M7_SVA_AND_SUBJECT'], ['was', 'M7_SVA_AND_SUBJECT']], 'Two people joined by and are plural, so are.'),
  I('Everyone ___ ready for the trip.', 'is', [['are', 'M7_SVA_EVERYONE'], ['were', 'M7_SVA_EVERYONE'], ['am', 'M7_SVA_EVERYONE']], 'Everyone takes a singular verb: everyone is.'),
  I('There ___ four chairs in the room.', 'are', [['is', 'M7_SVA_THERE_IS'], ['was', 'M7_SVA_THERE_IS'], ['am', 'M7_SVA_THERE_IS']], 'The verb agrees with four chairs, which is plural: there are.'),
  I('The teacher with her learners ___ to the museum every year. (go)', 'goes', [['go', 'M7_SVA_NEAR_NOUN'], ['going', 'M7_SVA_NEAR_NOUN'], ['gone', 'M7_SVA_NEAR_NOUN']], 'The subject is the teacher, one person, so goes.'),
  I('Each of the girls ___ a bottle of water.', 'has', [['have', 'M7_SVA_EVERYONE'], ['are having', 'M7_SVA_EVERYONE'], ['having', 'M7_SVA_EVERYONE']], 'Each is singular, so has.'),
  I('The children in the hall ___ singing.', 'are', [['is', 'M7_SVA_NEAR_NOUN'], ['was', 'M7_SVA_NEAR_NOUN'], ['am', 'M7_SVA_NEAR_NOUN']], 'The subject is the children, which is plural, so are.'),
  I('The price of the tomatoes ___ high this week.', 'is', [['are', 'M7_SVA_NEAR_NOUN'], ['were', 'M7_SVA_NEAR_NOUN'], ['am', 'M7_SVA_NEAR_NOUN']], 'The subject is the price, one thing, so is.'),
];
const SVF = [
  I('Which word is the subject of "The farmer sells vegetables".', 'farmer', w('M7_SVA_FIND_SUBJECT', 'sells', 'vegetables', 'the'), 'The subject is who does the action: the farmer.'),
  I('Which word is the subject of "In the evening, the children play football".', 'children', w('M7_SVA_FIND_SUBJECT', 'evening', 'play', 'football'), 'The children are the ones who play, so they are the subject.'),
  I('Which word is the subject of "Mama baked a cake".', 'Mama', w('M7_SVA_FIND_SUBJECT', 'baked', 'cake', 'a'), 'Mama did the baking, so she is the subject.'),
  I('Which word is the subject of "The tall boy from Kisii won the race".', 'boy', w('M7_SVA_FIND_SUBJECT', 'race', 'won', 'Kisii'), 'The boy did the winning, so boy is the subject.'),
  I('Which word is the subject of "After lunch, our class went to the library".', 'class', w('M7_SVA_FIND_SUBJECT', 'lunch', 'library', 'went'), 'The class did the going, so class is the subject.'),
  I('Which word is the verb of "The old woman sells mandazi near the gate".', 'sells', w('M7_SVA_FIND_SUBJECT', 'woman', 'mandazi', 'gate'), 'The verb is the action: sells.'),
];
// ---------------------------------------------------------------- affirmative and negative sentences
const NGP = [
  I('I do not have ___ pen.', 'a|any', [['no', 'M7_NG_DOUBLE'], ['none', 'M7_NG_DOUBLE'], ['nothing', 'M7_NG_DOUBLE']], 'Do not already says no. Say I do not have a pen.'),
  I('She ___ like beans.', 'doesn\'t|does not', [['don\'t', 'M7_NG_DONT_THIRD'], ['aren\'t', 'M7_NG_DONT_THIRD'], ['isn\'t', 'M7_NG_DONT_THIRD']], 'One person takes does not: she does not like beans.'),
  I('He did not ___ to school yesterday. (go)', 'go', [['went', 'M7_NG_DID_PAST'], ['goes', 'M7_NG_DID_PAST'], ['going', 'M7_NG_DID_PAST']], 'After did not use the plain verb: did not go.'),
  I('I am ___ tired.', 'not', [['no', 'M7_NG_NO_NOT'], ['none', 'M7_NG_NO_NOT'], ['nor', 'M7_NG_NO_NOT']], 'Not goes with am and with an adjective: I am not tired.'),
  I('We have ___ time to waste.', 'no', [['not', 'M7_NG_NO_NOT'], ['none', 'M7_NG_NO_NOT'], ['nothing', 'M7_NG_NO_NOT']], 'No goes before a noun: no time.'),
  I('My brother did not ___ his lunch. (eat)', 'eat', [['ate', 'M7_NG_DID_PAST'], ['eaten', 'M7_NG_DID_PAST'], ['eating', 'M7_NG_DID_PAST']], 'After did not use the plain verb: did not eat.'),
  I('Peter ___ play football on Sundays.', 'doesn\'t|does not', [['don\'t', 'M7_NG_DONT_THIRD'], ['isn\'t', 'M7_NG_DONT_THIRD'], ['aren\'t', 'M7_NG_DONT_THIRD']], 'One person takes does not.'),
  I('Our mother ___ drink tea.', 'doesn\'t|does not', [['don\'t', 'M7_NG_DONT_THIRD'], ['isn\'t', 'M7_NG_DONT_THIRD'], ['hasn\'t', 'M7_NG_DONT_THIRD']], 'One person takes does not: our mother does not drink tea.'),
];
const NGW = [
  I('Which sentence puts not in the right place.', 'She is not here.', [['She not is here.', 'M7_NG_NOT_PLACE'], ['She is here not.', 'M7_NG_NOT_PLACE'], ['Not she is here.', 'M7_NG_NOT_PLACE']], 'Not comes after is, are, was, were, can or will.'),
  I('Which sentence puts not in the right place.', 'They were not late.', [['They not were late.', 'M7_NG_NOT_PLACE'], ['They were late not.', 'M7_NG_NOT_PLACE'], ['Not they were late.', 'M7_NG_NOT_PLACE']], 'Not comes after was or were.'),
  I('Which sentence puts not in the right place.', 'We will not go to the match.', [['We not will go to the match.', 'M7_NG_NOT_PLACE'], ['We will go not to the match.', 'M7_NG_NOT_PLACE'], ['Not we will go to the match.', 'M7_NG_NOT_PLACE']], 'Not comes after will.'),
  I('Which sentence puts not in the right place.', 'The boys are not playing.', [['The boys not are playing.', 'M7_NG_NOT_PLACE'], ['The boys are playing not.', 'M7_NG_NOT_PLACE'], ['Not the boys are playing.', 'M7_NG_NOT_PLACE']], 'Not comes after are.'),
  I('Which sentence puts not in the right place.', 'It was not raining.', [['It not was raining.', 'M7_NG_NOT_PLACE'], ['It was raining not.', 'M7_NG_NOT_PLACE'], ['Not it was raining.', 'M7_NG_NOT_PLACE']], 'Not comes after was.'),
];
const NGS = [
  I('Which sentence is negative.', 'Nobody came to the meeting.', [['Everybody came to the meeting.', 'M7_NG_KIND'], ['Somebody came to the meeting.', 'M7_NG_KIND'], ['All of us came to the meeting.', 'M7_NG_KIND']], 'Nobody means not anybody, so the sentence is negative.'),
  I('Which sentence is negative.', 'We never go to the lake alone.', [['We often go to the lake alone.', 'M7_NG_KIND'], ['We always go to the lake alone.', 'M7_NG_KIND'], ['We sometimes go to the lake alone.', 'M7_NG_KIND']], 'Never means not ever, so the sentence is negative.'),
  I('Which sentence is negative.', 'There is nothing in the box.', [['There is something in the box.', 'M7_NG_KIND'], ['There is a book in the box.', 'M7_NG_KIND'], ['The box is full.', 'M7_NG_KIND']], 'Nothing means not anything, so the sentence is negative.'),
  I('Which sentence is negative.', 'She cannot swim.', [['She can swim.', 'M7_NG_KIND'], ['She will swim.', 'M7_NG_KIND'], ['She swims well.', 'M7_NG_KIND']], 'Cannot means can not, so the sentence is negative.'),
  I('Which sentence is negative.', 'None of the learners were late.', [['All of the learners were late.', 'M7_NG_KIND'], ['Some of the learners were late.', 'M7_NG_KIND'], ['Most of the learners were late.', 'M7_NG_KIND']], 'None means not one, so the sentence is negative.'),
  I('Which sentence is negative.', 'He has not finished his homework.', [['He has finished his homework.', 'M7_NG_KIND'], ['He is finishing his homework.', 'M7_NG_KIND'], ['He finished his homework.', 'M7_NG_KIND']], 'Has not says that it is not done, so the sentence is negative.'),
];

const H = (a, b) => [a, b];
export const FAMILIES = [
  // nouns
  ...P('coll', 'GRAMMA.T1.NOUN_TYPES', COLL, { hints: H('Each kind of group has its own word.', 'Think of how you say it: a swarm of bees, a herd of cattle.'), topic: 'about groups', oc: ['b', 'b', 'a'], rungs: [1, 2, 3] }),
  C('nountype.kind', 'choose-kind', 'GRAMMA.T1.NOUN_TYPES', NT_ID, { hints: H('A proper noun names one particular person, place or day.', 'You cannot touch an abstract noun. A collective noun names a group.'), oc: 'a' }),
  C('nountype.capital', 'choose-capital', 'GRAMMA.T1.NOUN_TYPES', NT_CAP, { stem: SENT, hints: H('Names of particular people, places, days and months take a capital letter.', 'A common noun takes a capital only at the start of a sentence.'), oc: 'a', rung: 2 }),
  ...P('count', 'GRAMMA.T2.COUNT_NONCOUNT', CN, { hints: H('Can you count it: one, two, three? Many and a few go with things we count.', 'Much and a little go with things we cannot count, such as water and sugar.'), topic: 'about amounts', oc: ['a', 'b', 'b'] }),
  C('count.kind', 'choose-count-kind', 'GRAMMA.T2.COUNT_NONCOUNT', CN_ID, { hints: H('Try putting a number before the noun: three chairs. Does it work?', 'We do not say two waters or three advices.'), oc: 'a' }),
  ...P('plural', 'GRAMMA.T2.PLURALS', PL, { hints: H('Say the plural aloud and listen to the ending.', 'Some plurals are irregular and have to be learnt.'), topic: 'with plurals', oc: ['a', 'b', 'b'] }),
  // verbs
  C('plural.kind', 'choose-singular-or-plural', 'GRAMMA.T2.PLURALS', PL_KIND, { hints: H('Plural means more than one.', 'Some plurals change inside the word: tooth, teeth.'), oc: 'a' }),
  ...P('irreg', 'GRAMMA.T3.IRREGULAR_VERBS', IV, { hints: H('Look at the word before the gap: has, have or had need the past participle.', 'Without has, have or had, use the simple past form.'), topic: 'with irregular verbs', oc: ['a', 'b', 'b'] }),
  C('irreg.kind', 'choose-regular', 'GRAMMA.T3.IRREGULAR_VERBS', IV_ID, { hints: H('A regular verb makes the past with -ed.', 'An irregular verb has its own past form, such as swim, swam.'), oc: 'a' }),
  ...P('tense', 'GRAMMA.T3.TENSE_CHOICE', TC, { hints: H('Find the time word: yesterday, every day or tomorrow.', 'Past time uses the past form, a habit uses the simple present, the future uses will + the plain verb.'), topic: 'with times', oc: ['b', 'b', 'b'] }),
  ...P('present', 'GRAMMA.T4.SIMPLE_PRESENT', SPR, { hints: H('One person (he, she, it, one name) takes -s or -es in the simple present.', 'After do not and does not use the plain verb.'), topic: 'in the simple present', oc: ['a', 'b', 'b'] }),
  ...P('past', 'GRAMMA.T4.SIMPLE_PAST', SPA, { hints: H('Past time: regular verbs take -ed, and did or did not is followed by the plain verb.', 'Check the spelling before -ed: stop becomes stopped, study becomes studied.'), topic: 'in the simple past', oc: ['a', 'c', 'c'] }),
  // adjectives and adverbs
  ...P('degree', 'GRAMMA.T5.ADJECTIVE_DEGREES', DEG, { hints: H('Than goes with the comparative. The goes with the superlative.', 'Short adjectives take -er and -est. Long adjectives take more and most.'), topic: 'with adjectives', oc: ['a', 'b', 'b'] }),
  C('degree.form', 'choose-form', 'GRAMMA.T5.ADJECTIVE_DEGREES', DEG_ID, { hints: H('The simple form describes one thing. The comparative compares two. The superlative picks one from many.', 'Look for as ... as, than or the most.'), oc: 'a' }),
  C('adverb.kind', 'choose-adverb-kind', 'GRAMMA.T6.ADVERB_KINDS', AK_KIND, { hints: H('Ask: does the word tell when, where or how?', 'An adverb of time tells when, of place tells where and of manner tells how.'), oc: 'a' }),
  C('adverb.find', 'find-adverb', 'GRAMMA.T6.ADVERB_KINDS', AK_FIND, { hints: H('An adverb tells more about a verb.', 'An adjective describes a noun. An adverb describes the action.'), oc: 'a', rung: 2 }),
  ...P('adverbform', 'GRAMMA.T6.ADVERB_FORM', AF, { hints: H('An action verb is described by an adverb, not an adjective.', 'Good is an adjective. Well is the adverb. Fast and hard keep their form as adverbs.'), topic: 'with adverbs', oc: ['b', 'b', 'b'] }),
  // pronouns
  ...P('pronoun', 'GRAMMA.T7.PERSONAL_PRONOUNS', PP, { hints: H('Before the verb use I, he, she, we, they. After a verb or a preposition use me, him, her, us, them.', 'Say the sentence with only that pronoun to check it.'), topic: 'with pronouns', oc: ['a', 'b', 'b'] }),
  C('pronoun.sentence', 'choose-sentence', 'GRAMMA.T7.PERSONAL_PRONOUNS', PP_SENT, { stem: SENT, hints: H('Name the person once, then use the right form of the pronoun.', 'Try each pronoun alone: Juma and I went. Went with Juma and me sounds wrong.'), oc: 'b', rung: 2 }),
  ...P('possessive', 'GRAMMA.T7.POSSESSIVES', POS, { hints: H('My, our, their come before a noun. Mine, ours, theirs stand alone.', 'Its never has an apostrophe when it shows belonging. It\'s means it is.'), topic: 'with possessives', oc: ['a', 'b', 'b'] }),
  // prepositions, conjunctions, articles
  ...P('prep', 'GRAMMA.T8.PREPOSITIONS', PRE, { hints: H('On goes with days, at with clock times and in with months and parts of the day.', 'To shows a movement towards a place.'), topic: 'with prepositions', oc: ['b', 'b', 'b'] }),
  C('prep.kind', 'choose-kind', 'GRAMMA.T8.PREPOSITIONS', PRE_KIND, { hints: H('Ask: does it tell when, where or in which direction?', 'Preposition of time: at, on, in. Place: under, near. Direction: across, into.'), oc: 'a' }),
  ...P('and', 'GRAMMA.T9.CONJUNCTIONS_BASIC', CB, { hints: H('And adds. But shows a difference. Or gives a choice.', 'Use only one joining word between the two parts.'), topic: 'with joining words', oc: ['a', 'b', 'b'] }),
  C('and.sentence', 'choose-sentence', 'GRAMMA.T9.CONJUNCTIONS_BASIC', CB_SENT, { stem: SENT, hints: H('A comma alone cannot join two sentences.', 'Use one joining word: and, but or so.'), oc: 'b', rung: 2 }),
  ...P('article', 'GRAMMA.T10.ARTICLES', ART, { hints: H('Say the word after the gap. Does it start with a vowel sound or a consonant sound?', 'Use a before a consonant sound, an before a vowel sound, and the for a thing already known.'), topic: 'with a, an and the', oc: ['a', 'b', 'b'] }),
  ...P('adjform', 'GRAMMA.T11.ADJECTIVE_FORMATION', AFM, { hints: H('The word in brackets is the noun or verb. The gap needs an adjective.', 'Look at the endings: -ful (full of), -less (without), -y, -ous.'), topic: 'with adjectives made from other words', oc: ['a', 'b', 'b'] }),
  ...P('phrasal', 'GRAMMA.T12.PHRASAL_PCG', PCG, { hints: H('The little word after the verb changes the meaning.', 'Think about the meaning of the sentence, not the words one by one.'), topic: 'with phrasal verbs', oc: ['b', 'b', 'b'], thinOk: true }),
  C('phrasal.meaning', 'choose-meaning', 'GRAMMA.T12.PHRASAL_PCG', PCG_MEAN, { hints: H('A phrasal verb often means something different from its words.', 'Read the sentence again and ask what happens.'), oc: 'a' }),
  // sentences
  C('simple.choose', 'choose-simple', 'GRAMMA.T13.SIMPLE_SENTENCE', SSC, { stem: 'Which is a complete simple sentence.', hints: H('A simple sentence has one subject and one verb and tells a complete thought.', 'A group of words with no verb is a fragment. A sentence with and, but or so has two parts.'), oc: 'a' }),
  SP('simple.choose', 'GRAMMA.T13.SIMPLE_SENTENCE', SSC, { topic: 'that should be simple sentences', hints: H('A simple sentence has one subject and one verb.', 'Look for a verb. Look for a joining word such as and, but or so.'), oc: 'b' }),
  C('simple.runon', 'choose-complete', 'GRAMMA.T13.SIMPLE_SENTENCE', SSR, { stem: SENT, hints: H('Two complete thoughts need a full stop between them.', 'A comma alone cannot join two sentences.'), oc: 'b', rung: 2 }),
  ...P('agree', 'GRAMMA.T14.SV_AGREEMENT', SVA, { hints: H('Find the subject. It is who or what does the action.', 'A singular subject takes a singular verb. A plural subject takes a plural verb.'), topic: 'with subjects and verbs', oc: ['b', 'b', 'b'] }),
  C('agree.subject', 'find-subject', 'GRAMMA.T14.SV_AGREEMENT', SVF, { hints: H('The subject is who or what does the action.', 'The verb is the action word.'), oc: 'a' }),
  ...P('negative', 'GRAMMA.T15.NEGATIVES', NGP, { hints: H('Use only one negative word in a sentence.', 'After do not, does not and did not use the plain verb.'), topic: 'with negatives', oc: ['b', 'b', 'b'] }),
  C('negative.place', 'choose-where-not-goes', 'GRAMMA.T15.NEGATIVES', NGW, { hints: H('Not comes after the helping verb: is, are, was, were, will, can.', 'Not does not come first or last.'), oc: 'b', rung: 2 }),
  C('negative.kind', 'choose-negative', 'GRAMMA.T15.NEGATIVES', NGS, { hints: H('A negative sentence says that something is not so, or did not happen.', 'Not, never, nobody, nothing, none and cannot make a sentence negative.'), oc: 'a' }),
];
