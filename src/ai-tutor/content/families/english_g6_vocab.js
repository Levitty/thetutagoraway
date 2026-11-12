// ============================================================================
// ENGLISH GRADE 6, WORDS AND EXPRESSIONS: proverbs, riddles, idioms, similes, phrasal verbs, theme words, sounds,
// polite talk, fact and opinion, reference books and choosing a text (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g6.json). Off for children (reviewed:false) until a
// Kenyan English teacher signs them off. Sound questions depend on the accent a class is taught in: the
// reviewer must confirm them. Speaking itself (pronunciation, stress, intonation) is a teacher's speaking check.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './english_g6_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const GH = ['Read the sentence slowly, one word at a time.', 'Check your word by reading the sentence aloud.'];
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english6.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english6.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english6.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
const ask = (q) => (q);

// ---------------------------------------------------------------- proverbs
const PRV_MEAN = [
  I('What does the proverb "A stitch in time saves nine" mean.', 'Fix a small problem early so that it does not grow.', [['Sewing is a useful skill.', 'M6_PRV_LITERAL'], ['Nine stitches are better than one.', 'M6_PRV_LITERAL'], ['Take your time to finish a task.', 'M6_PRV_OPPOSITE']], 'A small repair now saves a big repair later.'),
  I('What does the proverb "Haste makes waste" mean.', 'Hurrying leads to mistakes and loss.', [['Hurry and you will finish sooner.', 'M6_PRV_OPPOSITE'], ['Waste is made in a hurry at home only.', 'M6_PRV_LITERAL'], ['Do not throw away food.', 'M_PRV_MIXED']], 'Haste is hurry, and it makes waste: mistakes and loss.'),
  I('What does the proverb "A bird in the hand is worth two in the bush" mean.', 'Keep what you have rather than risk it for more.', [['Birds are best kept in the hand.', 'M6_PRV_LITERAL'], ['Two birds are better than one.', 'M6_PRV_OPPOSITE'], ['Too many people spoil the work.', 'M_PRV_MIXED']], 'What you hold is sure. What you hope to get may be lost.'),
  I('What does the proverb "Too many cooks spoil the broth" mean.', 'When too many people lead one job, it goes wrong.', [['Cooks should taste the broth.', 'M6_PRV_LITERAL'], ['Many hands make light work.', 'M_PRV_MIXED'], ['Broth needs more salt.', 'M6_PRV_LITERAL']], 'Too many people in charge of one job spoil it.'),
  I('What does the proverb "Where there is a will, there is a way" mean.', 'If you really want something, you will find a means to get it.', [['Wills are made by lawyers.', 'M6_PRV_LITERAL'], ['Some things cannot be done.', 'M6_PRV_OPPOSITE'], ['Roads are made by people.', 'M6_PRV_LITERAL']], 'A strong wish helps a person find a way.'),
  I('What does the proverb "Slow and steady wins the race" mean.', 'Patient, steady effort leads to success.', [['The slowest runner always wins.', 'M6_PRV_LITERAL'], ['Speed is the only thing that matters.', 'M6_PRV_OPPOSITE'], ['Races should be run on steady ground.', 'M6_PRV_LITERAL']], 'Steady work, not speed, wins in the end.'),
  I('What does the proverb "Actions speak louder than words" mean.', 'What people do shows more than what they say.', [['Noisy people do the most work.', 'M6_PRV_LITERAL'], ['Words are more important than deeds.', 'M6_PRV_OPPOSITE'], ['You should speak loudly when you act.', 'M6_PRV_LITERAL']], 'Deeds prove more than promises.'),
  I('What does the proverb "Do not count your chickens before they hatch" mean.', 'Do not rely on something good before it has happened.', [['Keep chickens in a warm place.', 'M6_PRV_LITERAL'], ['Always count what you have.', 'M6_PRV_OPPOSITE'], ['Eggs should be sold early.', 'M6_PRV_LITERAL']], 'The chickens have not hatched yet, so you cannot be sure of them.'),
];
const PRV_FIN = [
  I('A stitch in time saves ___.', 'nine', [['ten', 'M_PRV_WORD'], ['one', 'M_PRV_WORD'], ['time', 'M_PRV_WORD']], 'The proverb is fixed: a stitch in time saves nine.'),
  I('Haste makes ___.', 'waste', [['speed', 'M_PRV_WORD'], ['money', 'M_PRV_WORD'], ['time', 'M_PRV_WORD']], 'The proverb is fixed: haste makes waste.'),
  I('Where there is a will, there is a ___.', 'way', [['door', 'M_PRV_WORD'], ['road', 'M_PRV_WORD'], ['key', 'M_PRV_WORD']], 'The proverb is fixed: where there is a will, there is a way.'),
  I('Too many cooks spoil the ___.', 'broth', [['soup', 'M_PRV_WORD'], ['tea', 'M_PRV_WORD'], ['stew', 'M_PRV_WORD']], 'The proverb is fixed: too many cooks spoil the broth.'),
  I('A friend in need is a friend ___.', 'indeed', [['always', 'M_PRV_WORD'], ['forever', 'M_PRV_WORD'], ['enough', 'M_PRV_WORD']], 'The proverb is fixed: a friend in need is a friend indeed.'),
  I('Slow and steady wins the ___.', 'race', [['match', 'M_PRV_WORD'], ['prize', 'M_PRV_WORD'], ['game', 'M_PRV_WORD']], 'The proverb is fixed: slow and steady wins the race.'),
  I('Actions speak louder than ___.', 'words', [['voices', 'M_PRV_WORD'], ['drums', 'M_PRV_WORD'], ['songs', 'M_PRV_WORD']], 'The proverb is fixed: actions speak louder than words.'),
  I('Do not count your chickens before they ___.', 'hatch', [['grow', 'M_PRV_WORD'], ['run', 'M_PRV_WORD'], ['fly', 'M_PRV_WORD']], 'The proverb is fixed: do not count your chickens before they hatch.'),
];
const PRV_SIT = [
  I('Juma hurried through his sums and made many mistakes. Which proverb fits.', 'Haste makes waste.', [['A stitch in time saves nine.', 'M_PRV_MIXED'], ['Slow and steady wins the race.', 'M_PRV_MIXED'], ['Too many cooks spoil the broth.', 'M_PRV_MIXED']], 'Juma hurried and made mistakes: haste makes waste.'),
  I('Five learners each tried to lead the project and nothing was finished. Which proverb fits.', 'Too many cooks spoil the broth.', [['Haste makes waste.', 'M_PRV_MIXED'], ['Actions speak louder than words.', 'M_PRV_MIXED'], ['A bird in the hand is worth two in the bush.', 'M_PRV_MIXED']], 'Too many leaders spoilt the work.'),
  I('Wanjiru studied a little every day and finally topped the class. Which proverb fits.', 'Slow and steady wins the race.', [['Haste makes waste.', 'M_PRV_MIXED'], ['Too many cooks spoil the broth.', 'M_PRV_MIXED'], ['Do not count your chickens before they hatch.', 'M_PRV_MIXED']], 'Steady effort brought success.'),
  I('Peter promised to help but never came. His brother came without promising and worked all day. Which proverb fits.', 'Actions speak louder than words.', [['Slow and steady wins the race.', 'M_PRV_MIXED'], ['A stitch in time saves nine.', 'M_PRV_MIXED'], ['Haste makes waste.', 'M_PRV_MIXED']], 'What the brother did showed more than what Peter said.'),
  I('Mr Kimani sold his sure harvest to buy a lottery ticket and lost everything. Which proverb fits.', 'A bird in the hand is worth two in the bush.', [['Haste makes waste.', 'M_PRV_MIXED'], ['Actions speak louder than words.', 'M_PRV_MIXED'], ['Too many cooks spoil the broth.', 'M_PRV_MIXED']], 'He gave up what he had for something uncertain.'),
  I('Njeri bought goats with money she had not yet received from selling her crop. The sale fell through. Which proverb fits.', 'Do not count your chickens before they hatch.', [['A stitch in time saves nine.', 'M_PRV_MIXED'], ['Slow and steady wins the race.', 'M_PRV_MIXED'], ['Actions speak louder than words.', 'M_PRV_MIXED']], 'She spent money she did not have yet.'),
];
// ---------------------------------------------------------------- riddles
const RID_KIND = [
  I('Which of these is a riddle.', 'What has a neck but no head.', [['Slow and steady wins the race.', 'M_RID_PROVERB_AS_RIDDLE'], ['Haste makes waste.', 'M_RID_PROVERB_AS_RIDDLE'], ['Actions speak louder than words.', 'M_RID_PROVERB_AS_RIDDLE']], 'A riddle asks a puzzle with an answer to find.'),
  I('Which of these is a proverb.', 'Honesty is the best policy.', [['What runs but never walks.', 'M_RID_RIDDLE_AS_PROVERB'], ['What has hands but cannot clap.', 'M_RID_RIDDLE_AS_PROVERB'], ['What has teeth but cannot bite.', 'M_RID_RIDDLE_AS_PROVERB']], 'A proverb gives advice or a truth. It has no hidden answer.'),
  I('Which of these is a riddle.', 'What has hands but cannot clap.', [['A friend in need is a friend indeed.', 'M_RID_PROVERB_AS_RIDDLE'], ['Where there is a will, there is a way.', 'M_RID_PROVERB_AS_RIDDLE'], ['Too many cooks spoil the broth.', 'M_RID_PROVERB_AS_RIDDLE']], 'It is a puzzle to answer, so it is a riddle.'),
  I('Which of these is a proverb.', 'A stitch in time saves nine.', [['What has teeth but cannot bite.', 'M_RID_RIDDLE_AS_PROVERB'], ['What has a neck but no head.', 'M_RID_RIDDLE_AS_PROVERB'], ['What runs but never walks.', 'M_RID_RIDDLE_AS_PROVERB']], 'It gives advice, so it is a proverb.'),
  I('What is special about a riddle.', 'It has a hidden answer for the listener to guess.', [['It teaches a lesson about life.', 'M_RID_NO_ANSWER'], ['It tells a long story.', 'M_RID_NO_ANSWER'], ['It always has a rhyme.', 'M_RID_NO_ANSWER']], 'A riddle is a puzzle: the listener finds the answer.'),
  I('What is special about a proverb.', 'It gives advice or a truth in a few words.', [['It has a hidden answer for the listener to guess.', 'M_RID_RIDDLE_AS_PROVERB'], ['It is always a question.', 'M_RID_RIDDLE_AS_PROVERB'], ['It is only said by children.', 'M_RID_RIDDLE_AS_PROVERB']], 'A proverb is a short saying that gives advice or states a truth.'),
];
const RID_ANS = [
  I('I have a neck but no head. What am I.', 'a bottle', [['a giraffe', 'M_RID_LITERAL'], ['a person', 'M_RID_LITERAL'], ['a tree', 'M_RID_LITERAL']], 'A bottle has a neck but no head. A giraffe has both.'),
  I('I have teeth but I cannot bite. What am I.', 'a comb', [['a lion', 'M_RID_LITERAL'], ['a crocodile', 'M_RID_LITERAL'], ['a shark', 'M_RID_LITERAL']], 'A comb has teeth that do not bite.'),
  I('I have hands but I cannot clap. What am I.', 'a clock', [['a baby', 'M_RID_LITERAL'], ['a monkey', 'M_RID_LITERAL'], ['a gorilla', 'M_RID_LITERAL']], 'A clock has hands that point to the time and cannot clap.'),
  I('I run all day but I never walk. What am I.', 'a river', [['a cheetah', 'M_RID_LITERAL'], ['a runner', 'M_RID_LITERAL'], ['a car', 'M_RID_LITERAL']], 'A river runs but has no legs to walk.'),
  I('The more you take from me, the more I leave behind. What am I.', 'footsteps', [['money', 'M_RID_LITERAL'], ['water', 'M_RID_LITERAL'], ['food', 'M_RID_LITERAL']], 'The more steps you take, the more footsteps you leave behind.'),
  I('I have a mouth that cannot eat, and a bed that cannot sleep. What am I.', 'a river', [['a baby', 'M_RID_LITERAL'], ['a lion', 'M_RID_LITERAL'], ['a house', 'M_RID_LITERAL']], 'A river has a mouth where it meets the sea and a bed, the ground it flows over.'),
];
// ---------------------------------------------------------------- idioms
const IDM_MEAN = [
  I('What does the idiom "dog tired" mean.', 'extremely tired', [['tired like a dog', 'M_IDM_LITERAL'], ['not tired at all', 'M_IDM_OPPOSITE'], ['sleepy in the morning', 'M_IDM_WRONG_SITUATION']], 'Dog tired means so tired that you can hardly move.'),
  I('What does the idiom "a piece of cake" mean.', 'very easy', [['a slice of food', 'M_IDM_LITERAL'], ['very difficult', 'M_IDM_OPPOSITE'], ['very sweet', 'M_IDM_LITERAL']], 'A piece of cake is easy to eat, so it means something very easy.'),
  I('What does the idiom "burst into tears" mean.', 'suddenly start to cry', [['break something with water', 'M_IDM_LITERAL'], ['laugh loudly', 'M_IDM_OPPOSITE'], ['tear a piece of paper', 'M_IDM_LITERAL']], 'To burst into tears is to begin to cry suddenly.'),
  I('What does the idiom "work like a dog" mean.', 'work very hard', [['work for a dog', 'M_IDM_LITERAL'], ['work very slowly', 'M_IDM_OPPOSITE'], ['work only at night', 'M_IDM_WRONG_SITUATION']], 'To work like a dog is to work very hard.'),
  I('What does the idiom "under the weather" mean.', 'feeling a little ill', [['standing in the rain', 'M_IDM_LITERAL'], ['feeling very happy', 'M_IDM_OPPOSITE'], ['enjoying the sunshine', 'M_IDM_LITERAL']], 'A person who is under the weather does not feel well.'),
  I('What does the idiom "break the ice" mean.', 'start a friendly talk with people you do not know', [['break a block of ice', 'M_IDM_LITERAL'], ['end a friendship', 'M_IDM_OPPOSITE'], ['feel very cold', 'M_IDM_LITERAL']], 'To break the ice is to make strangers feel comfortable and begin talking.'),
  I('What does the idiom "work for peanuts" mean.', 'work for very little pay', [['sell groundnuts', 'M_IDM_LITERAL'], ['work for a lot of money', 'M_IDM_OPPOSITE'], ['work on a groundnut farm', 'M_IDM_LITERAL']], 'To work for peanuts is to be paid very little.'),
  I('What does the idiom "spill the beans" mean.', 'tell a secret', [['drop some food', 'M_IDM_LITERAL'], ['cook for many people', 'M_IDM_LITERAL'], ['keep a secret', 'M_IDM_OPPOSITE']], 'To spill the beans is to let a secret out.'),
];
const IDM_GAP = [
  I('After the long walk, the children were dog ___.', 'tired', [['sleepy', 'M_IDM_WORD_CHANGED'], ['weak', 'M_IDM_WORD_CHANGED'], ['sick', 'M_IDM_WORD_CHANGED']], 'The idiom is dog tired.'),
  I('He had to work like a ___ all day to finish the job.', 'dog', [['cat', 'M_IDM_WORD_CHANGED'], ['goat', 'M_IDM_WORD_CHANGED'], ['bird', 'M_IDM_WORD_CHANGED']], 'The idiom is work like a dog.'),
  I('When she heard the sad news, she burst into ___.', 'tears', [['water', 'M_IDM_WORD_CHANGED'], ['laughter', 'M_IDM_WORD_CHANGED'], ['rain', 'M_IDM_WORD_CHANGED']], 'The idiom is burst into tears.'),
  I('The test was a piece of ___.', 'cake', [['bread', 'M_IDM_WORD_CHANGED'], ['food', 'M_IDM_WORD_CHANGED'], ['meat', 'M_IDM_WORD_CHANGED']], 'The idiom is a piece of cake.'),
  I('I feel a little under the ___ today.', 'weather', [['rain', 'M_IDM_WORD_CHANGED'], ['sun', 'M_IDM_WORD_CHANGED'], ['cloud', 'M_IDM_WORD_CHANGED']], 'The idiom is under the weather.'),
  I('Wafula told a joke to break the ___ at the party.', 'ice', [['water', 'M_IDM_WORD_CHANGED'], ['glass', 'M_IDM_WORD_CHANGED'], ['silence', 'M_IDM_WORD_CHANGED']], 'The idiom is break the ice.'),
  I('Please do not spill the ___ about the surprise party.', 'beans', [['rice', 'M_IDM_WORD_CHANGED'], ['maize', 'M_IDM_WORD_CHANGED'], ['news', 'M_IDM_WORD_CHANGED']], 'The idiom is spill the beans.'),
  I('Many farm workers work for ___, with very low pay.', 'peanuts', [['sweets', 'M_IDM_WORD_CHANGED'], ['maize', 'M_IDM_WORD_CHANGED'], ['mangoes', 'M_IDM_WORD_CHANGED']], 'The idiom is work for peanuts.'),
];
// ---------------------------------------------------------------- similes and metaphors
const SIM_KIND = [
  I('Which sentence has a metaphor.', 'The thief was a hyena.', [['He ran like the wind.', 'M_SIM_METAPHOR_AS_SIMILE'], ['The boy is tall.', 'M_SIM_PLAIN'], ['She sang as sweetly as a bird.', 'M_SIM_METAPHOR_AS_SIMILE']], 'A metaphor says one thing is another with no like or as.'),
  I('Which sentence has a simile.', 'My dog is as big as a calf.', [['My dog is a lion.', 'M_SIM_METAPHOR_AS_SIMILE'], ['My dog is big.', 'M_SIM_PLAIN'], ['My dog is a mountain.', 'M_SIM_METAPHOR_AS_SIMILE']], 'A simile compares with as ... as or like.'),
  I('Which sentence has a simile.', 'The baby slept like a log.', [['The baby was an angel.', 'M_SIM_METAPHOR_AS_SIMILE'], ['The baby slept well.', 'M_SIM_PLAIN'], ['The baby is a sunbeam.', 'M_SIM_METAPHOR_AS_SIMILE']], 'Like a log makes a comparison, so it is a simile.'),
  I('Which sentence has a metaphor.', 'Time is a thief.', [['Time passes like water.', 'M_SIM_METAPHOR_AS_SIMILE'], ['Time passes quickly.', 'M_SIM_PLAIN'], ['Time flies as fast as an arrow.', 'M_SIM_METAPHOR_AS_SIMILE']], 'It says time is a thief with no like or as.'),
  I('Which sentence has a metaphor.', 'The classroom was a zoo.', [['The classroom was as noisy as a zoo.', 'M_SIM_METAPHOR_AS_SIMILE'], ['The classroom was noisy.', 'M_SIM_PLAIN'], ['The classroom was like a market.', 'M_SIM_METAPHOR_AS_SIMILE']], 'It says the classroom was a zoo, so it is a metaphor.'),
  I('Which sentence has a simile.', 'Her voice was as sweet as honey.', [['Her voice was honey.', 'M_SIM_METAPHOR_AS_SIMILE'], ['Her voice was sweet.', 'M_SIM_PLAIN'], ['Her voice is music.', 'M_SIM_METAPHOR_AS_SIMILE']], 'As sweet as honey compares with as ... as, so it is a simile.'),
];
const SIM_GAP = [
  I('He was as hungry ___ a wolf.', 'as', [['like', 'M_SIM_AS_LIKE'], ['than', 'M_SIM_AS_LIKE'], ['with', 'M_SIM_AS_LIKE']], 'The pattern is as ... as: as hungry as a wolf.'),
  I('The boy was as greedy as a ___.', 'hyena', [['giraffe', 'M_SIM_WRONG_ANIMAL'], ['cow', 'M_SIM_WRONG_ANIMAL'], ['bird', 'M_SIM_WRONG_ANIMAL']], 'The usual simile is as greedy as a hyena.'),
  I('The soldier was as brave as a ___.', 'lion', [['mouse', 'M_SIM_WRONG_ANIMAL'], ['hare', 'M_SIM_WRONG_ANIMAL'], ['goat', 'M_SIM_WRONG_ANIMAL']], 'The usual simile is as brave as a lion.'),
  I('The tortoise was as slow as a ___.', 'snail', [['leopard', 'M_SIM_WRONG_ANIMAL'], ['cheetah', 'M_SIM_WRONG_ANIMAL'], ['hare', 'M_SIM_WRONG_ANIMAL']], 'The usual simile is as slow as a snail.'),
  I('Mama was as busy as a ___ all morning.', 'bee', [['sloth', 'M_SIM_WRONG_ANIMAL'], ['stone', 'M_SIM_WRONG_ANIMAL'], ['log', 'M_SIM_WRONG_ANIMAL']], 'The usual simile is as busy as a bee.'),
  I('The children were as quiet as a ___ during the test.', 'mouse', [['drum', 'M_SIM_WRONG_ANIMAL'], ['lion', 'M_SIM_WRONG_ANIMAL'], ['bell', 'M_SIM_WRONG_ANIMAL']], 'The usual simile is as quiet as a mouse.'),
  I('The bag was as light as a ___.', 'feather', [['stone', 'M_SIM_WRONG_ANIMAL'], ['rock', 'M_SIM_WRONG_ANIMAL'], ['brick', 'M_SIM_WRONG_ANIMAL']], 'The usual simile is as light as a feather.'),
  I('The thief ran as fast ___ the wind.', 'as', [['like', 'M_SIM_AS_LIKE'], ['than', 'M_SIM_AS_LIKE'], ['so', 'M_SIM_AS_LIKE']], 'The pattern is as ... as: as fast as the wind.'),
];
// ---------------------------------------------------------------- phrasal verbs
const PV_MEAN = [
  I('What does the phrasal verb "put up with" mean.', 'bear patiently', [['put something on top', 'M_PV_LITERAL'], ['refuse to accept', 'M_PV_SAME_MEANING'], ['build a house', 'M_PV_LITERAL']], 'To put up with something is to bear it patiently.'),
  I('What does the phrasal verb "cope with" mean.', 'manage a difficult situation', [['put a rope round something', 'M_PV_LITERAL'], ['run away from it', 'M_PV_SAME_MEANING'], ['ask for help', 'M_PV_SAME_MEANING']], 'To cope with something is to manage it.'),
  I('What does the phrasal verb "give up" mean.', 'stop trying', [['give a present to someone', 'M_PV_LITERAL'], ['agree after refusing', 'M_PV_SAME_MEANING'], ['try harder', 'M_PV_SAME_MEANING']], 'To give up is to stop trying.'),
  I('What does the phrasal verb "look after" mean.', 'take care of', [['look at something behind you', 'M_PV_LITERAL'], ['search for something', 'M_PV_SAME_MEANING'], ['look up a word', 'M_PV_SAME_MEANING']], 'To look after someone is to take care of them.'),
  I('What does the phrasal verb "set off" mean.', 'begin a journey', [['put something down', 'M_PV_LITERAL'], ['arrive at a place', 'M_PV_SAME_MEANING'], ['stay at home', 'M_PV_SAME_MEANING']], 'To set off is to begin a journey.'),
  I('What does the phrasal verb "run out of" mean.', 'have none left', [['run away from a place', 'M_PV_LITERAL'], ['collect more', 'M_PV_SAME_MEANING'], ['run very fast', 'M_PV_LITERAL']], 'To run out of something is to use all of it.'),
  I('What does the phrasal verb "break down" mean when a matatu does it.', 'stop working', [['break into pieces', 'M_PV_LITERAL'], ['start to move', 'M_PV_SAME_MEANING'], ['go very fast', 'M_PV_SAME_MEANING']], 'A vehicle that breaks down stops working.'),
  I('What does the phrasal verb "agree with" mean.', 'have the same opinion as', [['argue with', 'M_PV_SAME_MEANING'], ['walk beside', 'M_PV_LITERAL'], ['say goodbye to', 'M_PV_SAME_MEANING']], 'To agree with someone is to share their opinion.'),
];
const PV_GAP = [
  I('He did not ___ trying until he passed.', 'give up', [['give in', 'M_PV_PARTICLE'], ['give out', 'M_PV_PARTICLE'], ['give away', 'M_PV_PARTICLE']], 'Give up means stop trying.'),
  I('I agree ___ you about the date.', 'with', [['to', 'M_PV_PREP'], ['in', 'M_PV_PREP'], ['on', 'M_PV_PREP']], 'We agree with a person.'),
  I('The old matatu ___ on the way to Nairobi.', 'broke down', [['broke up', 'M_PV_SAME_MEANING'], ['broke in', 'M_PV_SAME_MEANING'], ['broke out', 'M_PV_SAME_MEANING']], 'Broke down means stopped working.'),
  I('We must ___ early to reach Mombasa by noon.', 'set off', [['set up', 'M_PV_PARTICLE'], ['set in', 'M_PV_PARTICLE'], ['set down', 'M_PV_PARTICLE']], 'Set off means begin a journey.'),
  I('Please ___ your little brother while I am out.', 'look after', [['look for', 'M_PV_PARTICLE'], ['look at', 'M_PV_PARTICLE'], ['look up', 'M_PV_PARTICLE']], 'Look after means take care of.'),
  I('We have ___ sugar, so we cannot bake today.', 'run out of', [['run out', 'M_PV_PREP'], ['run out from', 'M_PV_PREP'], ['run out off', 'M_PV_PREP']], 'Run out of means have none left.'),
  I('Wafula could not ___ the noise in the hall.', 'put up with', [['put up to', 'M_PV_PREP'], ['put on with', 'M_PV_PARTICLE'], ['put off with', 'M_PV_PARTICLE']], 'Put up with means bear patiently.'),
  I('How do people ___ the heat in the dry season.', 'cope with', [['cope in', 'M_PV_PREP'], ['cope to', 'M_PV_PREP'], ['cope at', 'M_PV_PREP']], 'We cope with a problem.'),
];
// ---------------------------------------------------------------- theme words
const CL = [
  I('It is against the law to ___ young children to work.', 'employ', [['employer', 'M_CL_PERSON_ACTION'], ['employee', 'M_CL_PERSON_ACTION'], ['employment', 'M_CL_PERSON_ACTION']], 'Employ is the action. The employer is the person who does it.'),
  I('The law is there to ___ children from harm.', 'protect', [['exploit', 'M_CL_EXPLOIT_HELP'], ['abuse', 'M_CL_EXPLOIT_HELP'], ['harm', 'M_CL_EXPLOIT_HELP']], 'To protect is to keep safe.'),
  I('The boy was paid very low ___ for a full day of hard work.', 'wages', [['fees', 'M_CL_WAGES_FEES'], ['fares', 'M_CL_WAGES_FEES'], ['taxes', 'M_CL_WAGES_FEES']], 'Wages are money paid for work.'),
  I('Some bad bosses ___ children by making them work long hours for little money.', 'exploit', [['protect', 'M_CL_EXPLOIT_HELP'], ['rescue', 'M_CL_EXPLOIT_HELP'], ['reward', 'M_CL_EXPLOIT_HELP']], 'To exploit is to use someone unfairly.'),
  I('The person who gives people work and pays them is called the ___.', 'employer', [['employee', 'M_CL_PERSON_ACTION'], ['employment', 'M_CL_PERSON_ACTION'], ['employ', 'M_CL_PERSON_ACTION']], 'The employer is the one who gives the work and pays.'),
  I('A person who works for an employer is an ___.', 'employee', [['employer', 'M_CL_PERSON_ACTION'], ['employ', 'M_CL_PERSON_ACTION'], ['employed', 'M_CL_PERSON_ACTION']], 'The employee is the one who works for the employer.'),
  I('Parents pay school ___ every term so that their children can learn.', 'fees', [['wages', 'M_CL_WAGES_FEES'], ['salary', 'M_CL_WAGES_FEES'], ['fines', 'M_CL_WAGES_FEES']], 'Fees are money paid for a service such as school.'),
  I('Children have the right to go to school and to be ___ from dangerous work.', 'protected', [['exploited', 'M_CL_EXPLOIT_HELP'], ['harmed', 'M_CL_EXPLOIT_HELP'], ['employed', 'M_CL_PERSON_ACTION']], 'Protected means kept safe.'),
];
const RES = [
  I('The ___ gave first aid to the injured man.', 'paramedic', [['ambulance', 'M_RES_VEHICLE_PERSON'], ['siren', 'M_RES_VEHICLE_PERSON'], ['stretcher', 'M_RES_VEHICLE_PERSON']], 'A paramedic is the trained person who gives first aid.'),
  I('Everyone had to ___ the building when the alarm rang.', 'evacuate', [['rescue', 'M_RES_EVACUATE'], ['extinguish', 'M_RES_EVACUATE'], ['enter', 'M_RES_EVACUATE']], 'To evacuate is to leave a dangerous place.'),
  I('We heard the ___ of the fire engine from far away.', 'siren', [['alarm', 'M_RES_SIREN_ALARM'], ['whistle', 'M_RES_SIREN_ALARM'], ['radio', 'M_RES_SIREN_ALARM']], 'A siren is the loud sound of an emergency vehicle.'),
  I('The patient was driven to the hospital in an ___.', 'ambulance', [['paramedic', 'M_RES_VEHICLE_PERSON'], ['firefighter', 'M_RES_VEHICLE_PERSON'], ['stretcher', 'M_RES_VEHICLE_PERSON']], 'An ambulance is the vehicle that carries the sick.'),
  I('The ___ put out the fire in the market.', 'firefighters', [['ambulance', 'M_RES_VEHICLE_PERSON'], ['siren', 'M_RES_SIREN_ALARM'], ['alarm', 'M_RES_SIREN_ALARM']], 'Firefighters are the people who put out fires.'),
  I('The lifeguard managed to ___ the child from the water.', 'rescue', [['evacuate', 'M_RES_EVACUATE'], ['escape', 'M_RES_EVACUATE'], ['ignore', 'M_RES_EVACUATE']], 'To rescue is to save someone from danger.'),
  I('The smoke ___ in the school rang loudly and the learners left the classrooms.', 'alarm', [['siren', 'M_RES_SIREN_ALARM'], ['whistle', 'M_RES_SIREN_ALARM'], ['rescue', 'M_RES_EVACUATE']], 'An alarm warns people inside a building.'),
  I('The ___ is the vehicle that takes sick people to hospital.', 'ambulance', [['paramedic', 'M_RES_VEHICLE_PERSON'], ['firefighter', 'M_RES_VEHICLE_PERSON'], ['siren', 'M_RES_SIREN_ALARM']], 'The ambulance is the vehicle. The paramedic is the person.'),
];
const MON = [
  I('Wanjiku sold the tomatoes for less than she paid. She made a ___.', 'loss', [['profit', 'M_MON_PROFIT_LOSS'], ['gain', 'M_MON_PROFIT_LOSS'], ['saving', 'M_MON_PROFIT_LOSS']], 'Selling for less than you paid is a loss.'),
  I('Kenya sends tea to other countries. Tea is an ___.', 'export', [['import', 'M_MON_IMPORT_EXPORT'], ['imported', 'M_MON_IMPORT_EXPORT'], ['exporter', 'M_MON_IMPORT_EXPORT']], 'Goods sent out of a country are exports.'),
  I('A ___ sells goods in small amounts to shoppers.', 'retailer', [['wholesaler', 'M_MON_RETAIL_WHOLESALE'], ['importer', 'M_MON_RETAIL_WHOLESALE'], ['exporter', 'M_MON_RETAIL_WHOLESALE']], 'A retailer sells small amounts to shoppers.'),
  I('A shop buys sugar in large sacks from a ___ and sells it in small packets.', 'wholesaler', [['retailer', 'M_MON_RETAIL_WHOLESALE'], ['customer', 'M_MON_RETAIL_WHOLESALE'], ['exporter', 'M_MON_IMPORT_EXPORT']], 'A wholesaler sells large amounts to shops.'),
  I('Kamau sold the maize for more than he paid, so he made a ___.', 'profit', [['loss', 'M_MON_PROFIT_LOSS'], ['debt', 'M_MON_PROFIT_LOSS'], ['tax', 'M_MON_PROFIT_LOSS']], 'Selling for more than you paid is a profit.'),
  I('Kenya buys oil from other countries. Oil is an ___.', 'import', [['export', 'M_MON_IMPORT_EXPORT'], ['exporter', 'M_MON_IMPORT_EXPORT'], ['imports', 'M_MON_IMPORT_EXPORT']], 'Goods brought into a country are imports.'),
  I('A person who buys goods from a shop is a ___.', 'customer', [['retailer', 'M_MON_RETAIL_WHOLESALE'], ['wholesaler', 'M_MON_RETAIL_WHOLESALE'], ['seller', 'M_MON_RETAIL_WHOLESALE']], 'The customer is the one who buys.'),
  I('Before the month began, Amina made a ___ to plan how to spend her money.', 'budget', [['profit', 'M_MON_PROFIT_LOSS'], ['loss', 'M_MON_PROFIT_LOSS'], ['import', 'M_MON_IMPORT_EXPORT']], 'A budget is a plan for spending money.'),
];
// ---------------------------------------------------------------- sounds
const SND_SAME = [
  I('Which word has the same vowel sound as "near".', 'beer', [['bear', 'M_SND_SPELL_NOT_SOUND'], ['bare', 'M_SND_SPELL_NOT_SOUND'], ['chair', 'M_SND_SPELL_NOT_SOUND']], 'Near and beer share the sound /ɪə/. Bear has a different sound.'),
  I('Which word has the same vowel sound as "clear".', 'deer', [['dare', 'M_SND_SPELL_NOT_SOUND'], ['hair', 'M_SND_SPELL_NOT_SOUND'], ['pear', 'M_SND_SPELL_NOT_SOUND']], 'Clear and deer share the sound /ɪə/.'),
  I('Which word has the same vowel sound as "tour".', 'poor', [['more', 'M_SND_TOUR_MORE'], ['door', 'M_SND_TOUR_MORE'], ['floor', 'M_SND_TOUR_MORE']], 'Tour and poor share the sound /ʊə/. More, door and floor share another sound.'),
  I('Which word has the same vowel sound as "cure".', 'pure', [['core', 'M_SND_TOUR_MORE'], ['more', 'M_SND_TOUR_MORE'], ['four', 'M_SND_TOUR_MORE']], 'Cure and pure share the sound /ʊə/.'),
  I('Which word has the same vowel sound as "go".', 'boat', [['not', 'M_SND_SPELL_NOT_SOUND'], ['cut', 'M_SND_SPELL_NOT_SOUND'], ['hat', 'M_SND_SPELL_NOT_SOUND']], 'Go and boat share the sound /əʊ/.'),
  I('Which word starts with the sound /v/.', 'van', [['fan', 'M_SND_F_V'], ['fat', 'M_SND_F_V'], ['ban', 'M_SND_F_V']], 'Van starts with /v/, where the voice hums.'),
  I('Which word starts with the sound /f/.', 'fish', [['vine', 'M_SND_F_V'], ['wine', 'M_SND_F_V'], ['pine', 'M_SND_F_V']], 'Fish starts with /f/, with only air.'),
  I('Which word does NOT start with the sound /h/.', 'hour', [['house', 'M_SND_SILENT_H'], ['hand', 'M_SND_SILENT_H'], ['horse', 'M_SND_SILENT_H']], 'In hour the h is silent, so it starts with a vowel sound.'),
  I('Which word does NOT start with the sound /h/.', 'honest', [['hungry', 'M_SND_SILENT_H'], ['hotel', 'M_SND_SILENT_H'], ['hello', 'M_SND_SILENT_H']], 'In honest the h is silent.'),
];
const SND_ODD = [
  I('Which word has a different vowel sound from the others: near, beer, deer, bear.', 'bear', [['near', 'M_SND_SPELL_NOT_SOUND'], ['beer', 'M_SND_SPELL_NOT_SOUND'], ['deer', 'M_SND_SPELL_NOT_SOUND']], 'Near, beer and deer share /ɪə/. Bear has a different sound.'),
  I('Which word has a different vowel sound from the others: boat, go, toe, cot.', 'cot', [['boat', 'M_SND_SPELL_NOT_SOUND'], ['go', 'M_SND_SPELL_NOT_SOUND'], ['toe', 'M_SND_SPELL_NOT_SOUND']], 'Boat, go and toe share /əʊ/. Cot has a short o.'),
  I('Which word has a different vowel sound from the others: tour, poor, pure, door.', 'door', [['tour', 'M_SND_TOUR_MORE'], ['poor', 'M_SND_TOUR_MORE'], ['pure', 'M_SND_TOUR_MORE']], 'Tour, poor and pure share /ʊə/. Door has a different sound.'),
  I('Which word does not start with the sound /f/: fan, fish, van, fun.', 'van', [['fan', 'M_SND_F_V'], ['fish', 'M_SND_F_V'], ['fun', 'M_SND_F_V']], 'Fan, fish and fun start with /f/. Van starts with /v/.'),
  I('Which word does not start with the sound /h/: hand, hour, hat, hill.', 'hour', [['hand', 'M_SND_SILENT_H'], ['hat', 'M_SND_SILENT_H'], ['hill', 'M_SND_SILENT_H']], 'The h in hour is silent.'),
];
// ---------------------------------------------------------------- polite talk
const POL_SCEN = [
  I('Your friend is speaking and you want to add something. What do you say.', 'Excuse me, may I add something?', [['Stop! Now it is my turn.', 'M_POL_BLUNT'], ['You are wrong.', 'M_POL_BLUNT'], ['Be quiet for a minute.', 'M_POL_BLUNT']], 'A polite interruption begins with Excuse me and asks permission.'),
  I('You answer your home telephone. What is the best way to begin.', 'Hello, this is Amina speaking. How may I help you?', [['Who is this?', 'M_POL_PHONE_START'], ['Yes? What do you want?', 'M_POL_PHONE_START'], ['Speak.', 'M_POL_PHONE_START']], 'Greet, say who is speaking and offer help.'),
  I('You did not hear what the teacher said. What do you say.', 'I beg your pardon. Could you say that again, please?', [['What? Say it again.', 'M_POL_CLARIFY'], ['Huh?', 'M_POL_CLARIFY'], ['I did not hear you.', 'M_POL_CLARIFY']], 'To ask someone to repeat, say Pardon or Could you say that again, please.'),
  I('The caller asks for your mother, who is out. What is the polite reply.', 'She is out at the moment. May I take a message?', [['She is not here. Bye.', 'M_POL_MESSAGE'], ['Call later.', 'M_POL_MESSAGE'], ['I do not know where she is.', 'M_POL_MESSAGE']], 'If the person is out, say so and offer to take a message.'),
  I('You must leave a conversation to go to class. What do you say.', 'Excuse me, I must go to class now. Thank you for talking with me.', [['I am leaving. Bye.', 'M_POL_BLUNT'], ['This is boring.', 'M_POL_BLUNT'], ['Stop talking.', 'M_POL_BLUNT']], 'Excuse yourself politely and say thank you.'),
  I('You did not understand the teacher\'s example. What do you say.', 'Could you explain that once more, please?', [['That makes no sense.', 'M_POL_CLARIFY'], ['Explain again.', 'M_POL_CLARIFY'], ['What are you saying?', 'M_POL_CLARIFY']], 'Ask politely for an explanation with Could you ... please.'),
];
const POL_GAP = [
  I('Excuse me, ___ I add something to what you said?', 'may', [['must', 'M_POL_BLUNT'], ['will', 'M_POL_BLUNT'], ['do', 'M_POL_BLUNT']], 'May I asks permission politely.'),
  I('Could you say that ___, please?', 'again', [['now', 'M_POL_CLARIFY'], ['yes', 'M_POL_CLARIFY'], ['fast', 'M_POL_CLARIFY']], 'Could you say that again, please asks for repetition politely.'),
  I('I beg your ___?', 'pardon', [['sorry', 'M_POL_CLARIFY'], ['thanks', 'M_POL_CLARIFY'], ['help', 'M_POL_CLARIFY']], 'I beg your pardon is a polite way to ask for something to be repeated.'),
  I('Hello, this is Amina ___. How may I help you?', 'speaking', [['talking', 'M_POL_PHONE_START'], ['saying', 'M_POL_PHONE_START'], ['calling', 'M_POL_PHONE_START']], 'On the telephone we say this is ... speaking.'),
  I('She is out at the moment. May I take a ___?', 'message', [['talk', 'M_POL_MESSAGE'], ['call', 'M_POL_MESSAGE'], ['letter', 'M_POL_MESSAGE']], 'We offer to take a message for someone who is out.'),
  I('Thank you for ___. Goodbye.', 'calling', [['call', 'M_POL_PHONE_START'], ['called', 'M_POL_PHONE_START'], ['to call', 'M_POL_PHONE_START']], 'After thank you for we use the -ing form: calling.'),
];
// ---------------------------------------------------------------- fact and opinion
const FO_FACT = [
  I('Which of these is a fact.', 'Githeri is made from maize and beans.', [['Githeri is the best food in Kenya.', 'M_FO_OPINION_AS_FACT'], ['Githeri tastes better than ugali.', 'M_FO_OPINION_AS_FACT'], ['Everyone should eat githeri every day.', 'M_FO_OPINION_AS_FACT']], 'We can check what githeri is made from. The other sentences say what someone thinks.'),
  I('Which of these is a fact.', 'Nairobi is the capital city of Kenya.', [['Nairobi is the most exciting city.', 'M_FO_OPINION_AS_FACT'], ['Nairobi is too crowded.', 'M_FO_OPINION_AS_FACT'], ['Nobody should live in Nairobi.', 'M_FO_OPINION_AS_FACT']], 'We can check which city is the capital.'),
  I('Which of these is a fact.', 'A week has seven days.', [['Mondays are the worst day.', 'M_FO_OPINION_AS_FACT'], ['Weekends are too short.', 'M_FO_OPINION_AS_FACT'], ['Sundays are the best.', 'M_FO_OPINION_AS_FACT']], 'We can check how many days are in a week.'),
  I('Which of these is a fact.', 'Mount Kenya is the highest mountain in Kenya.', [['Mount Kenya is the most beautiful mountain.', 'M_FO_OPINION_AS_FACT'], ['Everyone should climb Mount Kenya.', 'M_FO_OPINION_AS_FACT'], ['Climbing is boring.', 'M_FO_OPINION_AS_FACT']], 'We can measure mountains, so the height is a fact.'),
  I('Which of these is a fact.', 'Lake Victoria is shared by Kenya, Uganda and Tanzania.', [['Lake Victoria is the nicest lake.', 'M_FO_OPINION_AS_FACT'], ['Lake Victoria is far too big.', 'M_FO_OPINION_AS_FACT'], ['Visitors will love Lake Victoria.', 'M_FO_OPINION_AS_FACT']], 'We can check which countries share the lake.'),
  I('Which of these is a fact.', 'Water boils at 100 degrees Celsius.', [['Boiled water tastes bad.', 'M_FO_OPINION_AS_FACT'], ['Everyone must drink boiled water.', 'M_FO_OPINION_AS_FACT'], ['Hot water is the best.', 'M_FO_OPINION_AS_FACT']], 'We can test the temperature at which water boils.'),
];
const FO_OPIN = [
  I('Which of these is an opinion.', 'Githeri is the best food in Kenya.', [['Githeri is made from maize and beans.', 'M_FO_FACT_AS_OPINION'], ['Githeri is cooked in water.', 'M_FO_FACT_AS_OPINION'], ['Githeri can be eaten at lunch.', 'M_FO_FACT_AS_OPINION']], 'Best shows what someone thinks. It cannot be checked.'),
  I('Which of these is an opinion.', 'Nairobi is the most exciting city.', [['Nairobi is the capital city of Kenya.', 'M_FO_FACT_AS_OPINION'], ['Nairobi is in Kenya.', 'M_FO_FACT_AS_OPINION'], ['Nairobi has a national park.', 'M_FO_FACT_AS_OPINION']], 'Most exciting is a feeling. Different people feel differently.'),
  I('Which of these is an opinion.', 'Mondays are the worst day of the week.', [['A week has seven days.', 'M_FO_FACT_AS_OPINION'], ['Monday comes after Sunday.', 'M_FO_FACT_AS_OPINION'], ['Schools open on Mondays.', 'M_FO_FACT_AS_OPINION']], 'Worst shows what someone feels. It is an opinion.'),
  I('Which of these is an opinion.', 'Mount Kenya is the most beautiful mountain.', [['Mount Kenya is the highest mountain in Kenya.', 'M_FO_FACT_AS_OPINION'], ['Mount Kenya has snow on its peak.', 'M_FO_FACT_AS_OPINION'], ['Mount Kenya is in Kenya.', 'M_FO_FACT_AS_OPINION']], 'Most beautiful is a feeling. It cannot be checked.'),
  I('Which of these is an opinion.', 'Everyone should read every day.', [['The library opens at eight.', 'M_FO_FACT_AS_OPINION'], ['Books are kept in the library.', 'M_FO_FACT_AS_OPINION'], ['Some books have pictures.', 'M_FO_FACT_AS_OPINION']], 'Should shows what the writer believes. It is an opinion.'),
];
const FO_KIND = [
  I('Read the text: "Once there was a hare who wanted to cross the river. He asked the crocodile to carry him." What kind of text is it.', 'a made-up story', [['an information text', 'M_FO_STORY_INFO'], ['a news report', 'M_FO_STORY_INFO'], ['a notice', 'M_FO_STORY_INFO']], 'It has made-up characters and events, so it is a story.'),
  I('Read the text: "The heart pumps blood round the body. It has four parts." What kind of text is it.', 'an information text', [['a made-up story', 'M_FO_STORY_INFO'], ['a poem', 'M_FO_STORY_INFO'], ['a riddle', 'M_FO_STORY_INFO']], 'It gives facts about the heart, so it is an information text.'),
  I('Read the text: "Atieno found a golden key under a baobab tree. It could open any door." What kind of text is it.', 'a made-up story', [['an information text', 'M_FO_STORY_INFO'], ['a news report', 'M_FO_STORY_INFO'], ['a school timetable', 'M_FO_STORY_INFO']], 'A golden key that opens any door is imagined, so it is a story.'),
  I('Read the text: "Kenya has forty-seven counties. Each county has a governor." What kind of text is it.', 'an information text', [['a made-up story', 'M_FO_STORY_INFO'], ['a poem', 'M_FO_STORY_INFO'], ['a riddle', 'M_FO_STORY_INFO']], 'It gives facts about Kenya, so it is an information text.'),
  I('Read the text: "The elephant said to the ant, You are too small to help me." What kind of text is it.', 'a made-up story', [['an information text', 'M_FO_STORY_INFO'], ['a news report', 'M_FO_STORY_INFO'], ['a set of instructions', 'M_FO_STORY_INFO']], 'Animals that speak are imagined, so it is a story.'),
];
// ---------------------------------------------------------------- reference books
const REF_BOOK = [
  I('Which book helps you find a country on a map.', 'an atlas', [['a dictionary', 'M_REF_WRONG_BOOK'], ['a thesaurus', 'M_REF_WRONG_BOOK'], ['a storybook', 'M_REF_WRONG_BOOK']], 'An atlas is a book of maps.'),
  I('Which book helps you find the meaning of a word.', 'a dictionary', [['an atlas', 'M_REF_WRONG_BOOK'], ['a storybook', 'M_REF_WRONG_BOOK'], ['a timetable', 'M_REF_WRONG_BOOK']], 'A dictionary gives the meaning and spelling of words.'),
  I('Which book gives facts on many topics such as animals, countries and inventions.', 'an encyclopaedia', [['a storybook', 'M_REF_WRONG_BOOK'], ['a diary', 'M_REF_WRONG_BOOK'], ['a hymn book', 'M_REF_WRONG_BOOK']], 'An encyclopaedia gives facts on many topics.'),
  I('Which part at the back of a book lists small topics from A to Z with page numbers.', 'the index', [['the contents page', 'M_REF_INDEX_CONTENTS'], ['the cover', 'M_REF_INDEX_CONTENTS'], ['the title page', 'M_REF_INDEX_CONTENTS']], 'The index lists topics in alphabetical order with page numbers.'),
  I('Which part at the front of a book lists the chapters in the order they come.', 'the contents page', [['the index', 'M_REF_INDEX_CONTENTS'], ['the glossary', 'M_REF_INDEX_CONTENTS'], ['the cover', 'M_REF_INDEX_CONTENTS']], 'The contents page lists the chapters in order.'),
  I('Where in a book do you find short meanings of the hard words used in that book.', 'the glossary', [['the index', 'M_REF_INDEX_CONTENTS'], ['the contents page', 'M_REF_INDEX_CONTENTS'], ['the cover', 'M_REF_INDEX_CONTENTS']], 'A glossary explains the hard words of the book.'),
];
const REF_ALPHA = [
  I('Which list is in alphabetical order.', 'brave, bread, brick', [['bread, brave, brick', 'M_REF_ALPHA_FIRST'], ['brick, bread, brave', 'M_REF_ALPHA_FIRST'], ['brave, brick, bread', 'M_REF_ALPHA_FIRST']], 'The first two letters are the same, so look at the third: a, e, i.'),
  I('Which list is in alphabetical order.', 'plan, plank, plant', [['plan, plant, plank', 'M_REF_ALPHA_FIRST'], ['plank, plan, plant', 'M_REF_ALPHA_FIRST'], ['plant, plank, plan', 'M_REF_ALPHA_FIRST']], 'A shorter word comes first, then k comes before t.'),
  I('Which list is in alphabetical order.', 'can, car, cat', [['cat, car, can', 'M_REF_ALPHA_FIRST'], ['car, can, cat', 'M_REF_ALPHA_FIRST'], ['can, cat, car', 'M_REF_ALPHA_FIRST']], 'Look at the third letter: n, r, t.'),
  I('Which list is in alphabetical order.', 'stone, store, stove', [['store, stone, stove', 'M_REF_ALPHA_FIRST'], ['stove, store, stone', 'M_REF_ALPHA_FIRST'], ['stone, stove, store', 'M_REF_ALPHA_FIRST']], 'Look at the fourth letter: n, r, v.'),
  I('Which list is in alphabetical order.', 'light, lime, lion', [['lime, light, lion', 'M_REF_ALPHA_FIRST'], ['lion, lime, light', 'M_REF_ALPHA_FIRST'], ['light, lion, lime', 'M_REF_ALPHA_FIRST']], 'Look at the third letter: g, m, o.'),
];
const REF_GUIDE = [
  I('The guide words on a dictionary page are "farm" and "feast". Which word is on that page.', 'fast', [['fair', 'M6_REF_GUIDE_WORDS'], ['fence', 'M6_REF_GUIDE_WORDS'], ['fish', 'M6_REF_GUIDE_WORDS']], 'Fast comes after farm and before feast. Fair comes before farm; fence and fish come after feast.'),
  I('The guide words on a dictionary page are "mango" and "market". Which word is on that page.', 'many', [['magic', 'M6_REF_GUIDE_WORDS'], ['mask', 'M6_REF_GUIDE_WORDS'], ['meat', 'M6_REF_GUIDE_WORDS']], 'Many comes after mango and before market.'),
  I('The guide words on a dictionary page are "bridge" and "brown". Which word is on that page.', 'bright', [['bread', 'M6_REF_GUIDE_WORDS'], ['bush', 'M6_REF_GUIDE_WORDS'], ['brush', 'M6_REF_GUIDE_WORDS']], 'Bright comes after bridge and before brown.'),
  I('The guide words on a dictionary page are "cabbage" and "cattle". Which word is on that page.', 'camel', [['bag', 'M6_REF_GUIDE_WORDS'], ['coat', 'M6_REF_GUIDE_WORDS'], ['chair', 'M6_REF_GUIDE_WORDS']], 'Camel comes after cabbage and before cattle.'),
  I('The guide words on a dictionary page are "dance" and "dish". Which word is on that page.', 'dark', [['cook', 'M6_REF_GUIDE_WORDS'], ['dog', 'M6_REF_GUIDE_WORDS'], ['duck', 'M6_REF_GUIDE_WORDS']], 'Dark comes after dance and before dish.'),
];
// ---------------------------------------------------------------- suitable text
const TXT_PURPOSE = [
  I('Which book would help you learn how bees make honey.', 'an information book about bees', [['a story about a bee called Buzz', 'M_TXT_WRONG_GENRE'], ['a book of riddles', 'M_TXT_WRONG_GENRE'], ['a picture book about trucks', 'M_TXT_OFF_TOPIC']], 'An information book gives facts.'),
  I('Which book would you pick to read for enjoyment on a rainy afternoon.', 'a story about a clever hare', [['a dictionary', 'M_TXT_WRONG_GENRE'], ['a book of maps', 'M_TXT_WRONG_GENRE'], ['a school timetable', 'M_TXT_WRONG_GENRE']], 'A story is made for enjoyment.'),
  I('Which is the best way to judge if a book suits you.', 'read the blurb and a page', [['look at the cover only', 'M_TXT_COVER_ONLY'], ['pick the thickest book', 'M_TXT_COVER_ONLY'], ['pick the book with the most pictures', 'M_TXT_COVER_ONLY']], 'The blurb and a page show the topic and the level.'),
  I('Which text is right for a Grade 6 learner to read alone.', 'a text with a few new words that I can work out', [['a text with new words on every line', 'M_TXT_TOO_HARD'], ['a text written for Grade 1 learners', 'M_TXT_TOO_HARD'], ['a text in a language I do not know', 'M_TXT_TOO_HARD']], 'A good text has only a few new words you can work out.'),
  I('Wanjiku wants to find out how to keep a chicken healthy. Which book is best.', 'a guide to keeping poultry', [['a story about a chicken that could talk', 'M_TXT_WRONG_GENRE'], ['a book of poems about the moon', 'M_TXT_WRONG_GENRE'], ['a comic about a lion', 'M_TXT_OFF_TOPIC']], 'A guide gives practical facts on the topic.'),
];
const TXT_RELEVANT = [
  I('You are doing a project on Lake Victoria. Which text is relevant.', 'a short article about fishing on Lake Victoria', [['an article about the Sahara desert', 'M_TXT_OFF_TOPIC'], ['a story about a lion', 'M_TXT_OFF_TOPIC'], ['a poem about the moon', 'M_TXT_OFF_TOPIC']], 'It is about the topic of the project.'),
  I('You want to find the opening times of the town library. Which text helps.', 'the notice on the library door', [['a novel about a library', 'M_TXT_WRONG_GENRE'], ['a poem about books', 'M_TXT_WRONG_GENRE'], ['a map of Africa', 'M_TXT_OFF_TOPIC']], 'The notice gives the times.'),
  I('Njeri wants to learn how to plant kale. Which text is most useful.', 'a farming guide on growing vegetables', [['a story about a farmer', 'M_TXT_WRONG_GENRE'], ['a book about football', 'M_TXT_OFF_TOPIC'], ['a book of poems', 'M_TXT_WRONG_GENRE']], 'A guide gives the steps for growing vegetables.'),
  I('A Grade 6 class is studying road safety. Which text suits the topic.', 'a leaflet on road safety rules', [['a leaflet on how to bake cakes', 'M_TXT_OFF_TOPIC'], ['a story about space', 'M_TXT_OFF_TOPIC'], ['a comic about a talking dog', 'M_TXT_WRONG_GENRE']], 'The leaflet is about road safety.'),
  I('You are writing about the history of the railway in Kenya. Which text is relevant.', 'a history book chapter on the Kenya-Uganda railway', [['a recipe for pilau', 'M_TXT_OFF_TOPIC'], ['a football match report', 'M_TXT_OFF_TOPIC'], ['a story about a magic train', 'M_TXT_WRONG_GENRE']], 'It is a factual text on the same topic.'),
];

export const FAMILIES = [
  eng({ id: 'english6.proverb.meaning', kind: 'choose-meaning', cs: 'LISTEN.T2.PROVERBS_USE', oc: 'a', form: 'word', rung: 1, gen: choose(PRV_MEAN, { stem: 'Choose.', hints: ['A proverb teaches a lesson by a picture. Ask: what is the lesson?', 'Do not read the words one by one.'] }) }),
  eng({ id: 'english6.proverb.gap', cs: 'LISTEN.T2.PROVERBS_USE', oc: 'c', form: 'direct', rung: 2, gen: gap(PRV_FIN, { stem: 'Type the missing {what} to finish the proverb.', hints: GH }) }),
  eng({ id: 'english6.proverb.spot', cs: 'LISTEN.T2.PROVERBS_USE', oc: 'c', form: 'spot', rung: 3, gen: spot(PRV_FIN, { topic: 'from memory', hints: ['A proverb cannot be changed.', 'Say each one in full and check the last word.'] }) }),
  eng({ id: 'english6.proverb.situation', kind: 'choose-situation', cs: 'LISTEN.T2.PROVERBS_USE', oc: 'c', form: 'why', rung: 3, gen: choose(PRV_SIT, { stem: 'Choose.', hints: ['Find the lesson in the little story.', 'Match the lesson, not just one word.'] }) }),
  eng({ id: 'english6.riddle.kind', kind: 'riddle-or-proverb', cs: 'LISTEN.T8.RIDDLES_PROVERBS', oc: 'a', form: 'word', rung: 1, gen: choose(RID_KIND, { stem: 'Choose.', hints: ['A riddle is a puzzle with a hidden answer.', 'A proverb gives advice or a truth.'] }) }),
  eng({ id: 'english6.riddle.answer', kind: 'answer-riddle', cs: 'LISTEN.T8.RIDDLES_PROVERBS', oc: 'd', form: 'why', rung: 2, gen: choose(RID_ANS, { stem: 'Choose.', hints: ['Match every clue in the riddle, not just the first one.', 'Think of an object that fits all the clues.'] }) }),
  eng({ id: 'english6.idiom.choose', kind: 'choose-meaning', cs: 'LISTEN.T1.IDIOMS_FIXED', oc: 'c', form: 'word', rung: 1, gen: choose(IDM_MEAN, { stem: 'Choose.', hints: ['An idiom does not mean what its words say.', 'Ask what picture the idiom paints and what it really tells us.'] }) }),
  eng({ id: 'english6.idiom.gap', cs: 'LISTEN.T1.IDIOMS_FIXED', oc: 'c', form: 'direct', rung: 2, gen: gap(IDM_GAP, { stem: 'Type the missing {what} to complete the idiom.', hints: GH }) }),
  eng({ id: 'english6.idiom.spot', cs: 'LISTEN.T1.IDIOMS_FIXED', oc: 'c', form: 'spot', rung: 3, gen: spot(IDM_GAP, { topic: 'with idioms', hints: ['An idiom is fixed. One word changed is a mistake.', 'Say each idiom in full and check it.'] }) }),
  eng({ id: 'english6.simile.kind', kind: 'simile-or-metaphor', cs: 'LISTEN.T2.SIMILE_METAPHOR', oc: 'c', form: 'word', rung: 1, gen: choose(SIM_KIND, { stem: 'Choose.', hints: ['A simile compares with like or as. A metaphor says one thing is another.', 'Look for the words like and as.'] }) }),
  eng({ id: 'english6.simile.choose', cs: 'LISTEN.T2.SIMILE_METAPHOR', oc: 'c', form: 'direct', rung: 2, gen: choose(SIM_GAP, { stem: WORD, hints: ['Similes are fixed: brave as a lion, greedy as a hyena.', 'The pattern is as ... as.'] }) }),
  eng({ id: 'english6.simile.gap', cs: 'LISTEN.T2.SIMILE_METAPHOR', oc: 'c', form: 'direct', rung: 2, gen: gap(SIM_GAP, { stem: 'Type the missing {what} to complete the simile.', hints: GH }) }),
  eng({ id: 'english6.simile.spot', cs: 'LISTEN.T2.SIMILE_METAPHOR', oc: 'c', form: 'spot', rung: 3, gen: spot(SIM_GAP, { topic: 'with similes', hints: ['A simile has a fixed pattern.', 'Check the as ... as pattern and the animal.'] }) }),
  eng({ id: 'english6.phrasal.meaning', kind: 'choose-meaning', cs: 'LISTEN.T8.PHRASAL_VERBS_USE', oc: 'c', form: 'word', rung: 1, gen: choose(PV_MEAN, { stem: 'Choose.', hints: ['The little word after the verb changes its meaning.', 'Try each meaning in a sentence.'] }) }),
  eng({ id: 'english6.phrasal.gap', cs: 'LISTEN.T8.PHRASAL_VERBS_USE', oc: 'c', form: 'direct', rung: 2, gen: gap(PV_GAP, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: 'english6.phrasal.choose', cs: 'LISTEN.T8.PHRASAL_VERBS_USE', oc: 'c', form: 'direct', rung: 2, gen: choose(PV_GAP, { stem: WORD, hints: ['Think about the meaning: which phrasal verb fits?', 'Some phrasal verbs go with a fixed preposition: agree with, cope with.'] }) }),
  eng({ id: 'english6.phrasal.spot', cs: 'LISTEN.T8.PHRASAL_VERBS_USE', oc: 'c', form: 'spot', rung: 3, gen: spot(PV_GAP, { topic: 'with phrasal verbs', hints: ['Check each phrasal verb for its meaning and its little word.', 'Give up and give in are different.'] }) }),
  ...P('childlab', 'LISTEN.T1.CHILD_LABOUR_WORDS', CL, { topic: 'about child labour', hints: ['Decide whether the sentence needs a person or an action.', 'Wages are for work. Fees are for a service.'], oc: ['b', 'b', 'b'] }),
  ...P('rescue', 'LISTEN.T4.RESCUE_WORDS', RES, { topic: 'about emergency services', hints: ['Is a person, a vehicle, a sound or an action needed?', 'A paramedic is a person. An ambulance is a vehicle.'], oc: ['b', 'b', 'b'] }),
  ...P('money', 'LISTEN.T13.MONEY_TRADE_WORDS', MON, { topic: 'about money and trade', hints: ['Think about who is buying and who is selling, and which way the goods go.', 'Profit is gain. Loss is the opposite.'], oc: ['a', 'a', 'a'] }),
  eng({ id: 'english6.sound.same', kind: 'choose-same-sound', cs: 'LISTEN.T6.SOUNDS', oc: 'a', form: 'word', rung: 1, gen: choose(SND_SAME, { stem: 'Choose.', hints: ['Say each word aloud. Listen to the sound, not to the spelling.', 'Words can look alike and sound different.'] }) }),
  eng({ id: 'english6.sound.odd', kind: 'choose-odd-sound', cs: 'LISTEN.T6.SOUNDS', oc: 'a', form: 'word', rung: 2, gen: choose(SND_ODD, { stem: 'Choose.', hints: ['Say all the words aloud and listen to the sound.', 'Three words share a sound. One does not.'] }) }),
  eng({ id: 'english6.polite.choose', kind: 'choose-polite', cs: 'LISTEN.T3.POLITE_TALK', oc: 'b', form: 'direct', rung: 1, gen: choose(POL_SCEN, { stem: 'Choose.', hints: ['Polite words: excuse me, please, could you, may I, pardon.', 'Greet, say who you are and offer to help.'] }) }),
  eng({ id: 'english6.polite.gap', cs: 'LISTEN.T3.POLITE_TALK', oc: 'b', form: 'direct', rung: 2, gen: gap(POL_GAP, { stem: 'Type the missing {what} in the polite sentence.', hints: GH }) }),
  eng({ id: 'english6.polite.spot', cs: 'LISTEN.T3.POLITE_TALK', oc: 'd', form: 'spot', rung: 3, gen: spot(POL_GAP, { topic: 'in a polite conversation', hints: ['Check each polite expression for the right word.', 'May I and Could you ... please are polite.'] }) }),
  eng({ id: 'english6.factop.fact', kind: 'choose-fact', cs: 'READIN.T9.FACT_OPINION', oc: 'c', form: 'word', rung: 1, gen: choose(FO_FACT, { stem: 'Choose.', hints: ['A fact can be checked. Can you find out if it is true?', 'Words such as best, worst and should show an opinion.'] }) }),
  eng({ id: 'english6.factop.opinion', kind: 'choose-opinion', cs: 'READIN.T9.FACT_OPINION', oc: 'c', form: 'word', rung: 2, gen: choose(FO_OPIN, { stem: 'Choose.', hints: ['An opinion says what someone thinks or feels.', 'Words such as best, most beautiful and should show an opinion.'] }) }),
  eng({ id: 'english6.factop.kind', kind: 'story-or-information', cs: 'READIN.T9.FACT_OPINION', oc: 'c', form: 'why', rung: 2, gen: choose(FO_KIND, { stem: 'Choose.', hints: ['A story has made-up characters and events.', 'An information text gives facts that can be checked.'] }) }),
  eng({ id: 'english6.reference.book', kind: 'choose-book', cs: 'READIN.T1.REFERENCE_MATERIALS', oc: 'c', form: 'direct', rung: 1, gen: choose(REF_BOOK, { stem: 'Choose.', hints: ['A dictionary has words, an atlas has maps, an encyclopaedia has facts.', 'The contents is at the front, the index at the back.'] }) }),
  eng({ id: 'english6.reference.alphabet', kind: 'alphabetical-order', cs: 'READIN.T1.REFERENCE_MATERIALS', oc: 'c', form: 'steps', rung: 2, gen: choose(REF_ALPHA, { stem: 'Choose.', hints: ['If the first letters are the same, look at the next letter.', 'Keep going until the words differ.'] }) }),
  eng({ id: 'english6.reference.guide', kind: 'guide-words', cs: 'READIN.T1.REFERENCE_MATERIALS', oc: 'c', form: 'steps', rung: 3, gen: choose(REF_GUIDE, { stem: 'Choose.', hints: ['A word is on the page if it comes after the first guide word and before the last.', 'Put the three words in alphabetical order.'] }) }),
  eng({ id: 'english6.text.purpose', kind: 'choose-for-purpose', cs: 'READIN.T1.SUITABLE_TEXT', oc: 'a', form: 'why', rung: 1, gen: choose(TXT_PURPOSE, { stem: 'Choose.', hints: ['Ask: what do I want to do with this book, learn or enjoy?', 'The blurb and one page tell you the topic and the level.'] }) }),
  eng({ id: 'english6.text.relevant', kind: 'judge-relevance', cs: 'READIN.T1.SUITABLE_TEXT', oc: 'd', form: 'why', rung: 2, gen: choose(TXT_RELEVANT, { stem: 'Choose.', hints: ['Ask: is it about my topic, and is it the right kind of text?', 'Facts need an information text. Enjoyment needs a story.'] }) }),
];
