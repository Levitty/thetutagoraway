// ============================================================================
// ENGLISH GRADE 4, THE WORDS OF THE THEMES, POLITENESS, SILENT LETTERS, PROVERBS and REFERENCE SKILLS (checked in text): DRAFT families.
// Written offline, no model call. Original sentences with Kenyan names and places (the proverbs are the common sayings of
// East Africa and England, not copied text). Every wrong answer carries the library misconception behind it
// (curriculum/english/g4.json). The alphabetical-order and guide-word families compute their key from the draw.
// Off for children (reviewed:false) until a Kenyan English teacher signs them off. See docs/qa/english-g4-2026-11-12.md.
// ============================================================================
import { eng, choose, gap, spot, mc, feedbackOf, shuffle, pick, randInt, outcomeLetters } from './english_g4_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
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
const THEME_HINTS = ['Read the whole sentence and say what the gap must mean.', 'Think about the topic of the sentence. Which word fits it best?'];

// ---------------------------------------------------------------- the words of the themes
const FIRSTAID = [
  ['A ___ is a cloth wrapped round a cut.', 'bandage', ['bruise', 'M_FA_NEAR_MEANING'], ['ambulance', 'M_FA_NEAR_MEANING'], ['sprain', 'M_FA_NEAR_MEANING'], 'A bandage is a cloth wrapped round an injury.'],
  ['A ___ is a dark mark on the skin where you were hit.', 'bruise', ['wound', 'M_FA_WOUND_BRUISE'], ['bandage', 'M_FA_NEAR_MEANING'], ['sprain', 'M_FA_NEAR_MEANING'], 'A bruise is a dark mark under the skin.'],
  ['When you twist your ankle, you may have a ___.', 'sprain', ['ambulance', 'M_FA_SPRAIN_BREAK'], ['bandage', 'M_FA_NEAR_MEANING'], ['wound', 'M_FA_NEAR_MEANING'], 'A sprain is a twisted joint.'],
  ['An ___ takes a sick person to hospital.', 'ambulance', ['bandage', 'M_FA_NEAR_MEANING'], ['bruise', 'M_FA_NEAR_MEANING'], ['sprain', 'M_FA_NEAR_MEANING'], 'An ambulance is a vehicle that takes sick people to hospital.'],
  ['A ___ is a cut in the skin that may bleed.', 'wound', ['bruise', 'M_FA_WOUND_BRUISE'], ['sprain', 'M_FA_SPRAIN_BREAK'], ['ambulance', 'M_FA_NEAR_MEANING'], 'A wound is a cut or break in the skin.'],
  ['We keep plasters and bandages in the first aid ___.', 'kit', ['wound', 'M_FA_NEAR_MEANING'], ['bruise', 'M_FA_NEAR_MEANING'], ['sprain', 'M_FA_NEAR_MEANING'], 'A first aid kit is a box of things to treat injuries.'],
  ['Wash a small cut with clean water and cover it with a ___.', 'plaster', ['sprain', 'M_FA_SPRAIN_BREAK'], ['ambulance', 'M_FA_NEAR_MEANING'], ['bruise', 'M_FA_WOUND_BRUISE'], 'A plaster covers a small cut.'],
];
const NUTRITION = [
  ['Beans, eggs and meat give us ___.', 'protein', ['carbohydrates', 'M_NUT_NEAR_MEANING'], ['fibre', 'M_NUT_NEAR_MEANING'], ['vitamins', 'M_NUT_NEAR_MEANING'], 'Protein builds the body.'],
  ['Ugali, rice and bread give us energy because they have ___.', 'carbohydrates', ['protein', 'M_NUT_NEAR_MEANING'], ['vitamins', 'M_NUT_NEAR_MEANING'], ['fibre', 'M_NUT_NEAR_MEANING'], 'Carbohydrates give energy.'],
  ['Fruits and vegetables have ___ that keep us healthy.', 'vitamins', ['salt', 'M_NUT_VITAMIN_FIBRE'], ['protein', 'M_NUT_NEAR_MEANING'], ['carbohydrates', 'M_NUT_NEAR_MEANING'], 'Vitamins keep the body healthy.'],
  ['A ___ diet has food from all the food groups.', 'balanced', ['heavy', 'M_NUT_BALANCED'], ['sweet', 'M_NUT_BALANCED'], ['cheap', 'M_NUT_BALANCED'], 'A balanced diet has all the food groups in the right amounts.'],
  ['___ in vegetables helps food move through the body.', 'Fibre', ['Vitamins', 'M_NUT_VITAMIN_FIBRE'], ['Protein', 'M_NUT_NEAR_MEANING'], ['Sugar', 'M_NUT_NEAR_MEANING'], 'Fibre helps food move through the body.'],
  ['Eating only ugali every day is not a ___ diet.', 'balanced', ['heavy', 'M_NUT_BALANCED'], ['cheap', 'M_NUT_BALANCED'], ['sweet', 'M_NUT_BALANCED'], 'One food alone does not give everything the body needs.'],
];
const INTERNET = [
  ['Messages you receive are kept in your ___.', 'inbox', ['attachment', 'M_NET_NEAR_MEANING'], ['password', 'M_NET_NEAR_MEANING'], ['subject', 'M_NET_NEAR_MEANING'], 'The inbox holds the emails you receive.'],
  ['A photo sent with an email is an ___.', 'attachment', ['inbox', 'M_NET_NEAR_MEANING'], ['password', 'M_NET_NEAR_MEANING'], ['subject', 'M_NET_NEAR_MEANING'], 'An attachment is a file sent with an email.'],
  ['A ___ should be kept secret, even from friends.', 'password', ['subject', 'M_NET_NEAR_MEANING'], ['website', 'M_NET_NEAR_MEANING'], ['inbox', 'M_NET_NEAR_MEANING'], 'A password is secret.'],
  ['If a stranger online asks where you live, you should ___.', 'tell a trusted adult', ['tell him your address', 'M_NET_STRANGER'], ['send him a photo', 'M_NET_STRANGER'], ['reply to him', 'M_NET_STRANGER'], 'Never give personal information to a stranger online.'],
  ['Do not share your ___ with anyone except a trusted adult.', 'password', ['inbox', 'M_NET_NEAR_MEANING'], ['subject', 'M_NET_NEAR_MEANING'], ['website', 'M_NET_NEAR_MEANING'], 'A password is secret.'],
  ['A friend asks for your password. You should ___.', 'say no politely', ['tell him', 'M_NET_PASSWORD_SHARED'], ['write it down for him', 'M_NET_PASSWORD_SHARED'], ['send it by SMS', 'M_NET_PASSWORD_SHARED'], 'A password is secret, even from friends.'],
  ['The short line that tells what an email is about is the ___.', 'subject', ['inbox', 'M_NET_NEAR_MEANING'], ['attachment', 'M_NET_NEAR_MEANING'], ['password', 'M_NET_NEAR_MEANING'], 'The subject says what the email is about.'],
  ['We type words in a ___ box to find information on the internet.', 'search', ['inbox', 'M_NET_NEAR_MEANING'], ['password', 'M_NET_NEAR_MEANING'], ['subject', 'M_NET_NEAR_MEANING'], 'A search box helps us find information.'],
];
const FARM = [
  ['We ___ the maize when it is ripe.', 'harvest', ['plant', 'M_FRM_NEAR_MEANING'], ['plough', 'M_FRM_NEAR_MEANING'], ['weed', 'M_FRM_NEAR_MEANING'], 'To harvest is to gather the crop when it is ripe.'],
  ['Cows, goats and sheep are ___.', 'livestock', ['crops', 'M_FRM_LIVESTOCK_CROPS'], ['seedlings', 'M_FRM_NEAR_MEANING'], ['fertiliser', 'M_FRM_NEAR_MEANING'], 'Livestock are farm animals.'],
  ['___ makes the soil richer so that crops grow well.', 'Fertiliser', ['Pesticide', 'M_FRM_FERTILISER'], ['Livestock', 'M_FRM_NEAR_MEANING'], ['Harvest', 'M_FRM_NEAR_MEANING'], 'Fertiliser feeds the soil.'],
  ['Before planting, the farmer uses oxen or a tractor to ___ the land.', 'plough', ['harvest', 'M_FRM_NEAR_MEANING'], ['weed', 'M_FRM_NEAR_MEANING'], ['fertiliser', 'M_FRM_NEAR_MEANING'], 'To plough is to turn over the soil before planting.'],
  ['Young plants that grow from seeds are called ___.', 'seedlings', ['harvest', 'M_FRM_NEAR_MEANING'], ['fertiliser', 'M_FRM_NEAR_MEANING'], ['livestock', 'M_FRM_LIVESTOCK_CROPS'], 'Seedlings are young plants.'],
  ['We ___ to remove unwanted plants between the rows.', 'weed', ['harvest', 'M_FRM_NEAR_MEANING'], ['plough', 'M_FRM_NEAR_MEANING'], ['plant', 'M_FRM_NEAR_MEANING'], 'To weed is to remove unwanted plants.'],
];
const HYGIENE = [
  ['Washing hands kills ___ that cause diseases.', 'germs', ['rubbish', 'M_HYG_NEAR_MEANING'], ['latrine', 'M_HYG_NEAR_MEANING'], ['drainage', 'M_HYG_NEAR_MEANING'], 'Germs are tiny living things that can cause disease.'],
  ['We ___ the toilet with a strong cleaner to kill germs.', 'disinfect', ['perfume', 'M_HYG_DISINFECT'], ['paint', 'M_HYG_DISINFECT'], ['decorate', 'M_HYG_DISINFECT'], 'To disinfect is to kill germs on a surface.'],
  ['A ___ is a place to dispose of human waste.', 'latrine', ['drainage', 'M_HYG_LATRINE'], ['rubbish', 'M_HYG_NEAR_MEANING'], ['sanitiser', 'M_HYG_NEAR_MEANING'], 'A latrine is for human waste.'],
  ['___ carries dirty water away from the compound.', 'Drainage', ['Latrine', 'M_HYG_LATRINE'], ['Sanitiser', 'M_HYG_NEAR_MEANING'], ['Germs', 'M_HYG_NEAR_MEANING'], 'Drainage carries away dirty water.'],
  ['We put ___ into the bin, not on the ground.', 'rubbish', ['germs', 'M_HYG_NEAR_MEANING'], ['drainage', 'M_HYG_NEAR_MEANING'], ['sanitiser', 'M_HYG_NEAR_MEANING'], 'Rubbish is waste that goes in the bin.'],
  ['Hand ___ is used when there is no water to wash hands.', 'sanitiser', ['rubbish', 'M_HYG_NEAR_MEANING'], ['drainage', 'M_HYG_NEAR_MEANING'], ['latrine', 'M_HYG_NEAR_MEANING'], 'Sanitiser cleans hands without water.'],
];
const MONEY = [
  ['Mama ___ money every month to buy a cow later.', 'saves', ['earns', 'M_MON_EARN_SAVE'], ['spends', 'M_MON_NEAR_MEANING'], ['lends', 'M_MON_NEAR_MEANING'], 'To save is to keep money for later.'],
  ['My father ___ money at the shop where he works.', 'earns', ['saves', 'M_MON_EARN_SAVE'], ['borrows', 'M_MON_NEAR_MEANING'], ['lends', 'M_MON_NEAR_MEANING'], 'To earn is to get money for work.'],
  ['Can I ___ your pen? I will return it.', 'borrow', ['lend', 'M_MON_BORROW_LEND'], ['save', 'M_MON_NEAR_MEANING'], ['earn', 'M_MON_NEAR_MEANING'], 'To borrow is to take something for a short time.'],
  ['I will ___ you my ruler for a day.', 'lend', ['borrow', 'M_MON_BORROW_LEND'], ['earn', 'M_MON_NEAR_MEANING'], ['save', 'M_MON_NEAR_MEANING'], 'To lend is to give something for a short time.'],
  ['The ___ of the book is 80 shillings.', 'price', ['change', 'M_MON_PRICE_CHANGE'], ['budget', 'M_MON_NEAR_MEANING'], ['savings', 'M_MON_NEAR_MEANING'], 'The price is what something costs.'],
  ['I gave 100 shillings and got 20 shillings ___.', 'change', ['price', 'M_MON_PRICE_CHANGE'], ['budget', 'M_MON_NEAR_MEANING'], ['savings', 'M_MON_NEAR_MEANING'], 'Change is the money given back.'],
  ['A ___ helps a family plan how to spend its money.', 'budget', ['change', 'M_MON_NEAR_MEANING'], ['price', 'M_MON_NEAR_MEANING'], ['loan', 'M_MON_NEAR_MEANING'], 'A budget is a plan for spending money.'],
];
const SPORTS = [
  ['The ___ blows the whistle to start the match.', 'referee', ['goalkeeper', 'M_SPT_NEAR_MEANING'], ['opponent', 'M_SPT_NEAR_MEANING'], ['trophy', 'M_SPT_NEAR_MEANING'], 'The referee controls the game.'],
  ['At the end, the captain lifted the shining silver ___.', 'trophy', ['tournament', 'M_SPT_TROPHY_TOURNAMENT'], ['referee', 'M_SPT_NEAR_MEANING'], ['whistle', 'M_SPT_NEAR_MEANING'], 'A trophy is the prize.'],
  ['A ___ is a series of games where teams compete.', 'tournament', ['trophy', 'M_SPT_TROPHY_TOURNAMENT'], ['whistle', 'M_SPT_NEAR_MEANING'], ['goalkeeper', 'M_SPT_NEAR_MEANING'], 'A tournament is a series of games.'],
  ['The player on the other team is my ___.', 'opponent', ['teammate', 'M_SPT_OPPONENT_TEAMMATE'], ['referee', 'M_SPT_NEAR_MEANING'], ['goalkeeper', 'M_SPT_NEAR_MEANING'], 'An opponent plays against you.'],
  ['My ___ passed me the ball, so we scored.', 'teammate', ['opponent', 'M_SPT_OPPONENT_TEAMMATE'], ['referee', 'M_SPT_NEAR_MEANING'], ['trophy', 'M_SPT_NEAR_MEANING'], 'A teammate plays on your side.'],
  ['The ___ stopped the ball from going into the net.', 'goalkeeper', ['referee', 'M_SPT_NEAR_MEANING'], ['trophy', 'M_SPT_NEAR_MEANING'], ['opponent', 'M_SPT_NEAR_MEANING'], 'The goalkeeper guards the goal.'],
];
const ENVIRONMENT = [
  ['To ___ plastic is to make it into something new.', 'recycle', ['litter', 'M_ENV_NEAR_MEANING'], ['conserve', 'M_ENV_NEAR_MEANING'], ['pollute', 'M_ENV_NEAR_MEANING'], 'To recycle is to make waste into something new.'],
  ['___ is dirt or poison that harms air, water or soil.', 'Pollution', ['Compost', 'M_ENV_POLLUTION'], ['Habitat', 'M_ENV_NEAR_MEANING'], ['Litter', 'M_ENV_NEAR_MEANING'], 'Pollution harms the air, water or soil.'],
  ['We should ___ water and not waste it.', 'conserve', ['pollute', 'M_ENV_CONSERVE'], ['litter', 'M_ENV_NEAR_MEANING'], ['recycle', 'M_ENV_NEAR_MEANING'], 'To conserve is to look after and use carefully.'],
  ['Rubbish dropped in a public place is called ___.', 'litter', ['compost', 'M_ENV_NEAR_MEANING'], ['habitat', 'M_ENV_NEAR_MEANING'], ['pollution', 'M_ENV_POLLUTION'], 'Litter is rubbish dropped in a public place.'],
  ['Dead leaves and peelings can be turned into ___ to feed the garden.', 'compost', ['pollution', 'M_ENV_POLLUTION'], ['litter', 'M_ENV_NEAR_MEANING'], ['habitat', 'M_ENV_NEAR_MEANING'], 'Compost is rotted plant waste that feeds the soil.'],
  ['A forest is the ___ of many animals.', 'habitat', ['litter', 'M_ENV_NEAR_MEANING'], ['compost', 'M_ENV_NEAR_MEANING'], ['pollution', 'M_ENV_POLLUTION'], 'A habitat is the natural home of animals or plants.'],
];
// ---------------------------------------------------------------- politeness
const POLITE = [
  L('Asking for water', ['You are thirsty at a friend\'s house. What do you say.', 'May I please have some water?', ['Give me water.', 'M_POL_DEMAND'], ['Water!', 'M_POL_DEMAND'], ['I want water now.', 'M_POL_DEMAND'], 'A polite request starts with May I and says please.']),
  L('Thanking a friend', ['Your friend lends you a ruler. What do you say.', 'Thank you for lending me your ruler.', ['Okay.', 'M_POL_NO_THANKS'], ['Fine.', 'M_POL_NO_THANKS'], ['Give it here.', 'M_POL_DEMAND'], 'When someone helps you, say thank you.']),
  L('Saying no kindly', ['A friend asks to copy your homework. You do not want to. What do you say.', 'I am sorry, I would rather you did your own.', ['No. Go away.', 'M_POL_RUDE_REFUSAL'], ['Never!', 'M_POL_RUDE_REFUSAL'], ['You are lazy.', 'M_POL_RUDE_REFUSAL'], 'You can say no politely: begin with I am sorry.']),
  L('Saying sorry', ['You bump into a girl in the corridor. What do you say.', 'Sorry, I did not see you.', ['Move.', 'M_POL_NO_SORRY'], ['Watch out.', 'M_POL_NO_SORRY'], ['It was your fault.', 'M_POL_NO_SORRY'], 'When you bother someone, say sorry.']),
  L('Asking the way', ['You need to find the library. What do you say to a teacher.', 'Excuse me, could you tell me the way to the library, please?', ['Where is the library?', 'M_POL_DEMAND'], ['Tell me the library.', 'M_POL_DEMAND'], ['Library, where?', 'M_POL_DEMAND'], 'A polite request starts with Excuse me and Could you, and says please.']),
  L('Asking a question in class', ['The teacher is speaking and you have a question. What do you say.', 'Excuse me, may I ask a question?', ['Stop. I have a question.', 'M_POL_DEMAND'], ['Teacher, listen.', 'M_POL_DEMAND'], ['Answer me.', 'M_POL_DEMAND'], 'Excuse me and may I show respect.']),
  L('Receiving a gift', ['Your aunt gives you a book as a gift. What do you say.', 'Thank you very much, I like it.', ['Is that all?', 'M_POL_NO_THANKS'], ['I wanted a bigger one.', 'M_POL_NO_THANKS'], ['Give me another.', 'M_POL_DEMAND'], 'A gift deserves thanks.']),
  L('Hurting someone by mistake', ['You step on a boy\'s foot by mistake. What do you say.', 'I am sorry, are you hurt?', ['Move your foot.', 'M_POL_NO_SORRY'], ['It was nothing.', 'M_POL_NO_SORRY'], ['Why was your foot there?', 'M_POL_NO_SORRY'], 'Say sorry and show you care.']),
];
// ---------------------------------------------------------------- silent letters
const SILENT = [
  ['In the word "knife", the silent letter is ___.', 'k', ['n', 'M_SIL_NEIGHBOUR'], ['none', 'M_SIL_NONE'], ['f', 'M_SIL_NEIGHBOUR'], 'You say "nife": the k is silent.'],
  ['In the word "write", the silent letter is ___.', 'w', ['r', 'M_SIL_NEIGHBOUR'], ['none', 'M_SIL_NONE'], ['i', 'M_SIL_NEIGHBOUR'], 'You say "rite": the w is silent.'],
  ['In the word "lamb", the silent letter is ___.', 'b', ['m', 'M_SIL_NEIGHBOUR'], ['none', 'M_SIL_NONE'], ['l', 'M_SIL_NEIGHBOUR'], 'You say "lam": the b is silent.'],
  ['In the word "listen", the silent letter is ___.', 't', ['s', 'M_SIL_NEIGHBOUR'], ['n', 'M_SIL_END_E'], ['none', 'M_SIL_NONE'], 'You say "lisen": the t is silent.'],
  ['In the word "hour", the silent letter is ___.', 'h', ['o', 'M_SIL_NEIGHBOUR'], ['none', 'M_SIL_NONE'], ['r', 'M_SIL_END_E'], 'You say "our": the h is silent.'],
  ['In the word "walk", the silent letter is ___.', 'l', ['a', 'M_SIL_NEIGHBOUR'], ['k', 'M_SIL_END_E'], ['none', 'M_SIL_NONE'], 'You say "wawk": the l is silent.'],
  ['In the word "island", the silent letter is ___.', 's', ['l', 'M_SIL_NEIGHBOUR'], ['none', 'M_SIL_NONE'], ['d', 'M_SIL_END_E'], 'You say "iland": the s is silent.'],
  ['In the word "knee", the silent letter is ___.', 'k', ['n', 'M_SIL_NEIGHBOUR'], ['e', 'M_SIL_END_E'], ['none', 'M_SIL_NONE'], 'You say "nee": the k is silent.'],
  ['In the word "climb", the silent letter is ___.', 'b', ['m', 'M_SIL_NEIGHBOUR'], ['none', 'M_SIL_NONE'], ['c', 'M_SIL_NEIGHBOUR'], 'You say "clime": the b is silent.'],
];
// ---------------------------------------------------------------- proverbs
const PROV_MEANING = [
  L('Haste makes waste', ['What does the proverb "Haste makes waste" teach.', 'Doing a thing too fast can spoil it.', ['People who hurry waste water.', 'M_PRV_LITERAL'], ['Always be the first to finish.', 'M_PRV_OPPOSITE'], ['Work should be done only at night.', 'M_PRV_UNRELATED'], 'Haste is hurry, and hurrying can spoil the work.']),
  L('Slow and steady wins the race', ['What does the proverb "Slow and steady wins the race" teach.', 'Keep going carefully and you will succeed.', ['Only fast runners win.', 'M_PRV_OPPOSITE'], ['Races should always be slow.', 'M_PRV_LITERAL'], ['Rest is better than work.', 'M_PRV_UNRELATED'], 'Patience and steady work bring success.']),
  L('A stitch in time saves nine', ['What does the proverb "A stitch in time saves nine" teach.', 'Mend a small problem early so it does not grow.', ['Sewing is hard work.', 'M_PRV_LITERAL'], ['Nine stitches are better than one.', 'M_PRV_LITERAL'], ['Wait until a problem is big.', 'M_PRV_OPPOSITE'], 'A small repair now saves a lot of work later.']),
  L('Unity is strength', ['What does the proverb "Unity is strength" teach.', 'People who work together are stronger.', ['One strong person is enough.', 'M_PRV_OPPOSITE'], ['Strength is only for the big.', 'M_PRV_UNRELATED'], ['A team needs no leader.', 'M_PRV_UNRELATED'], 'Unity means being together, and together we are strong.']),
  L('Practice makes perfect', ['What does the proverb "Practice makes perfect" teach.', 'The more you practise, the better you become.', ['Perfect people never practise.', 'M_PRV_OPPOSITE'], ['Practice is a kind of game.', 'M_PRV_UNRELATED'], ['Never try something new.', 'M_PRV_UNRELATED'], 'Doing something again and again makes you better at it.']),
  L('A bird in the hand is worth two in the bush', ['What does the proverb "A bird in the hand is worth two in the bush" teach.', 'Be happy with what you have.', ['Birds are better in the bush.', 'M_PRV_LITERAL'], ['Catch as many birds as you can.', 'M_PRV_LITERAL'], ['Never keep a bird.', 'M_PRV_OPPOSITE'], 'What you have for certain is worth more than what you might get.']),
  L('Where there is a will, there is a way', ['What does the proverb "Where there is a will, there is a way" teach.', 'If you really want something, you will find a means.', ['A will is a paper written by a lawyer.', 'M_PRV_LITERAL'], ['Roads lead everywhere.', 'M_PRV_LITERAL'], ['Wanting is not enough.', 'M_PRV_OPPOSITE'], 'A strong wish to succeed helps you find a way.']),
];
const PROV_FINISH = [
  ['Haste makes ___.', 'waste', ['water', 'M_PRV_WRONG_WORD'], ['wasted', 'M_PRV_WRONG_WORD'], ['work', 'M_PRV_WRONG_WORD'], 'The proverb is "Haste makes waste".'],
  ['Easy come, easy ___.', 'go', ['stay', 'M_PRV_WRONG_WORD'], ['leave', 'M_PRV_WRONG_WORD'], ['run', 'M_PRV_WRONG_WORD'], 'The proverb is "Easy come, easy go".'],
  ['Slow and steady wins the ___.', 'race', ['game', 'M_PRV_WRONG_WORD'], ['match', 'M_PRV_WRONG_WORD'], ['prize', 'M_PRV_WRONG_WORD'], 'The proverb is "Slow and steady wins the race".'],
  ['Unity is ___.', 'strength', ['power', 'M_PRV_WRONG_WORD'], ['wealth', 'M_PRV_WRONG_WORD'], ['peace', 'M_PRV_WRONG_WORD'], 'The proverb is "Unity is strength".'],
  ['Practice makes ___.', 'perfect', ['better', 'M_PRV_WRONG_WORD'], ['good', 'M_PRV_WRONG_WORD'], ['easy', 'M_PRV_WRONG_WORD'], 'The proverb is "Practice makes perfect".'],
  ['A stitch in time saves ___.', 'nine', ['ten', 'M_PRV_WRONG_WORD'], ['one', 'M_PRV_WRONG_WORD'], ['all', 'M_PRV_WRONG_WORD'], 'The proverb is "A stitch in time saves nine".'],
  ['Where there is a will, there is a ___.', 'way', ['road', 'M_PRV_WRONG_WORD'], ['door', 'M_PRV_WRONG_WORD'], ['path', 'M_PRV_WRONG_WORD'], 'The proverb is "Where there is a will, there is a way".'],
  ['A bird in the hand is worth two in the ___.', 'bush', ['tree', 'M_PRV_WRONG_WORD'], ['sky', 'M_PRV_WRONG_WORD'], ['nest', 'M_PRV_WRONG_WORD'], 'The proverb is "A bird in the hand is worth two in the bush".'],
];
// ---------------------------------------------------------------- reference books
const REF = [
  ['You use ___ to look up the meaning of a word.', 'a dictionary|dictionary', ['an atlas', 'M_REF_ATLAS_FOR_WORDS'], ['a story book', 'M_REF_STORY_FOR_FACTS'], ['a timetable', 'M_REF_STORY_FOR_FACTS'], 'A dictionary tells the meaning and spelling of words.'],
  ['To find facts about elephants, look in ___.', 'a junior encyclopaedia|an encyclopaedia|encyclopaedia', ['a dictionary', 'M_REF_DICTIONARY_FOR_FACTS'], ['a story book', 'M_REF_STORY_FOR_FACTS'], ['a timetable', 'M_REF_STORY_FOR_FACTS'], 'A junior encyclopaedia gives facts about topics.'],
  ['To find a map of Kenya, look in ___.', 'an atlas|atlas', ['a dictionary', 'M_REF_ATLAS_FOR_WORDS'], ['a story book', 'M_REF_STORY_FOR_FACTS'], ['a newspaper', 'M_REF_NEWSPAPER_OLD'], 'An atlas is a book of maps.'],
  ['To find out when the next bus leaves, look at ___.', 'a timetable|timetable', ['a story book', 'M_REF_STORY_FOR_FACTS'], ['a dictionary', 'M_REF_DICTIONARY_FOR_FACTS'], ['an atlas', 'M_REF_ATLAS_FOR_WORDS'], 'A timetable lists times.'],
  ['To read today\'s news, you read ___.', 'a newspaper|newspaper', ['a dictionary', 'M_REF_NEWSPAPER_OLD'], ['an atlas', 'M_REF_NEWSPAPER_OLD'], ['a story book', 'M_REF_STORY_FOR_FACTS'], 'A newspaper gives the news of the day.'],
  ['To check the spelling of "library", use ___.', 'a dictionary|dictionary', ['an atlas', 'M_REF_ATLAS_FOR_WORDS'], ['a newspaper', 'M_REF_NEWSPAPER_OLD'], ['a story book', 'M_REF_STORY_FOR_FACTS'], 'A dictionary shows how words are spelt.'],
  ['To learn facts about the human heart, look in ___.', 'a junior encyclopaedia|an encyclopaedia|encyclopaedia', ['a dictionary', 'M_REF_DICTIONARY_FOR_FACTS'], ['a timetable', 'M_REF_STORY_FOR_FACTS'], ['a story book', 'M_REF_STORY_FOR_FACTS'], 'A junior encyclopaedia has facts on many topics.'],
];
const ALPHA = [['bat', 'bag', 'ball', 'bad'], ['cap', 'can', 'cat', 'car'], ['dot', 'dog', 'door', 'dove'], ['fan', 'farm', 'fast', 'fat'], ['hand', 'happy', 'hard', 'hat'], ['sand', 'save', 'sat', 'say'], ['map', 'mat', 'mask', 'may'], ['pan', 'park', 'past', 'pat'], ['tap', 'tag', 'tall', 'tab']];
const GUIDE_WORDS = ['maize', 'mango', 'map', 'market', 'mat', 'meal', 'meat', 'melon', 'mend', 'milk', 'mind', 'mouse'];
const alphaGen = (cskill) => {
  const words = pick(ALPHA), show = shuffle(words);
  const right = [...words].sort().join(', ');
  const firstOnly = show.join(', ');
  const reversed = [...words].sort().reverse().join(', ');
  const swapped = (() => { const w = [...words].sort(), i = randInt(0, 2); [w[i], w[i + 1]] = [w[i + 1], w[i]]; return w.join(', '); })();
  const fb = feedbackOf(cskill, 'M_DIC_ALPHA_FIRST_LETTER');
  const options = mc(right, [[firstOnly, fb, 'M_DIC_ALPHA_FIRST_LETTER'], [reversed, fb, 'M_DIC_ALPHA_FIRST_LETTER'], [swapped, fb, 'M_DIC_ALPHA_FIRST_LETTER']]);
  if (!options || firstOnly === right) return null;
  return { question: `Which list puts the words ${show.join(', ')} in alphabetical order.`, options, instruction: 'Choose the best answer.', hints: ['Look at the first letter of each word. They are the same, so look at the second letter, then the third.', 'Compare two words at a time, letter by letter, until they differ.'], steps: ['When the first letters match, compare the next letters.', `The alphabetical order is: ${right}.`] };
};
const guideGen = (cskill) => {
  const w = [...GUIDE_WORDS].sort();
  const i = randInt(0, w.length - 5), j = randInt(i + 3, w.length - 1), g1 = w[i], g2 = w[j];
  const test = pick(w.filter(x => x !== g1 && x !== g2));
  const inside = g1 < test && test < g2;
  const fb = feedbackOf(cskill, 'M_DIC_GUIDE_WORDS');
  return { question: `A dictionary page has the guide words "${g1}" and "${g2}". Would the word "${test}" be on this page.`, options: mc(inside ? 'Yes' : 'No', [[inside ? 'No' : 'Yes', fb, 'M_DIC_GUIDE_WORDS']]), instruction: 'Choose the best answer.',
    hints: ['The guide words are the first and last words on the page.', 'Put the three words in alphabetical order. Is the word in the middle?'], steps: [`In alphabetical order: ${[g1, test, g2].sort().join(', ')}.`, inside ? `"${test}" comes between the guide words, so it is on this page.` : `"${test}" does not come between the guide words, so it is not on this page.`], chk: () => inside === (g1 < test && test < g2) };
};
const MEANING = [
  ['Dictionary: bank 1. a place where people keep money. 2. the land at the side of a river. In "We fished from the bank of the river", what does bank mean.', 'the land at the side of a river', ['a place where people keep money', 'M_DIC_WRONG_MEANING'], ['a kind of fish', 'M_DIC_WRONG_MEANING'], ['a boat for fishing', 'M_DIC_WRONG_MEANING'], 'The sentence is about fishing at a river, so the second meaning fits.'],
  ['Dictionary: match 1. a game between teams. 2. a small stick that makes fire. In "Kamau struck a match to light the lamp", what does match mean.', 'a small stick that makes fire', ['a game between teams', 'M_DIC_WRONG_MEANING'], ['a pair of shoes', 'M_DIC_WRONG_MEANING'], ['a kind of lamp', 'M_DIC_WRONG_MEANING'], 'He lit a lamp, so the second meaning fits.'],
  ['Dictionary: fair 1. not favouring anyone. 2. a place with games and stalls. In "The referee was fair to both teams", what does fair mean.', 'not favouring anyone', ['a place with games and stalls', 'M_DIC_WRONG_MEANING'], ['very fast', 'M_DIC_WRONG_MEANING'], ['quite tall', 'M_DIC_WRONG_MEANING'], 'The referee treated both teams the same, so the first meaning fits.'],
  ['Dictionary: sprint (verb) to run very fast for a short distance. In "The boys sprint to the gate", what does sprint mean.', 'run very fast for a short distance', ['go for a long walk', 'M_DIC_WRONG_MEANING'], ['rest in the shade', 'M_DIC_WRONG_MEANING'], ['jump over a fence', 'M_DIC_WRONG_MEANING'], 'The dictionary says it is a very fast run.'],
  ['Dictionary: light 1. not heavy. 2. brightness that lets us see. In "The bag is light, so I can carry it", what does light mean.', 'not heavy', ['brightness that lets us see', 'M_DIC_WRONG_MEANING'], ['very old', 'M_DIC_WRONG_MEANING'], ['very large', 'M_DIC_WRONG_MEANING'], 'Carrying it is easy, so the first meaning fits.'],
  ['Dictionary: bat 1. an animal that flies at night. 2. a stick for hitting a ball. In "A bat flew out of the cave at dusk", what does bat mean.', 'an animal that flies at night', ['a stick for hitting a ball', 'M_DIC_WRONG_MEANING'], ['a kind of bird nest', 'M_DIC_WRONG_MEANING'], ['a small cave', 'M_DIC_WRONG_MEANING'], 'It flew out of a cave at dusk, so it is the animal.'],
];

export const FAMILIES = [
  ...trio('firstaid', 'LISTEN.T4.FIRST_AID_WORDS', FIRSTAID, { topic: 'about first aid', hints: ['Read the whole sentence and say what the gap must mean.', 'Think about the injury or the help it needs.'] }),
  ...trio('nutrition', 'LISTEN.T5.NUTRITION_WORDS', NUTRITION, { topic: 'about food and nutrition', hints: THEME_HINTS }),
  ...trio('internet', 'LISTEN.T6.INTERNET_WORDS', INTERNET, { topic: 'about the internet and email', hints: ['Read the whole sentence and say what the gap must mean.', 'Think about safe habits online and the parts of an email.'] }),
  ...trio('farm', 'LISTEN.T8.FARM_WORDS', FARM, { topic: 'about the farm', hints: ['Read the whole sentence and say what the gap must mean.', 'Think about the steps of farming: plough, plant, weed, harvest.'] }),
  ...trio('hygiene', 'LISTEN.T10.HYGIENE_WORDS', HYGIENE, { topic: 'about hygiene and sanitation', hints: THEME_HINTS }),
  ...trio('money', 'LISTEN.T13.MONEY_WORDS', MONEY, { topic: 'about money', hints: ['Read the whole sentence and say what the gap must mean.', 'Earn and save are not the same. Borrow and lend are opposites.'] }),
  ...trio('sports', 'LISTEN.T11.SPORTS_WORDS', SPORTS, { topic: 'about sports and games', hints: THEME_HINTS }),
  ...trio('environment', 'LISTEN.T12.ENVIRONMENT_WORDS', ENVIRONMENT, { topic: 'about the environment', hints: THEME_HINTS }),
  eng({ id: id('polite', 'choose'), cs: 'LISTEN.T3.POLITE_WORDS', oc: 'b', form: 'direct', rung: 1, gen: choose(POLITE, { stem: '', hints: ['Think about how you would like to be spoken to.', 'A polite request starts with May I or Could you, and says please.'] }) }),
  eng({ id: id('polite', 'spot'), cs: 'LISTEN.T3.POLITE_WORDS', oc: 'd', form: 'spot', rung: 3, gen: spot(POLITE, { topic: 'about what to say in four different situations', hints: ['Read what each situation needs: a request, thanks, sorry or a reply.', 'A command or a short grunt is not polite.'] }) }),
  eng({ id: id('silent', 'choose'), cs: 'LISTEN.T13.SILENT_LETTERS', oc: 'b', form: 'direct', rung: 1, gen: choose(SILENT, { stem: 'Choose the letter that completes the sentence.', hints: ['Say the word aloud and listen for each letter.', 'The silent letter is written but not said.'] }) }),
  eng({ id: id('silent', 'spot'), cs: 'LISTEN.T13.SILENT_LETTERS', oc: 'b', form: 'spot', rung: 3, gen: spot(SILENT, { topic: 'about silent letters in four words', hints: ['Say each word aloud and listen for the letter you cannot hear.', 'The silent letter is not always next to the sounded one.'] }) }),
  eng({ id: id('proverb', 'meaning'), kind: 'choose-meaning', cs: 'READIN.T12.PROVERBS', oc: 'c', form: 'direct', rung: 2, gen: choose(PROV_MEANING, { stem: '', hints: ['A proverb has a lesson hidden in it. Ask what it teaches people.', 'The lesson is not about the animals or objects in the words.'] }) }),
  eng({ id: id('proverb', 'finish'), kind: 'type-word', cs: 'READIN.T12.PROVERBS', oc: 'a', form: 'direct', rung: 2, gen: gap(PROV_FINISH, { stem: 'Type the word that finishes the proverb.', hints: ['Say the whole proverb aloud, as you heard it.', 'A proverb always has the same words.'] }) }),
  eng({ id: id('proverb', 'finish-choose'), kind: 'choose-word', cs: 'READIN.T12.PROVERBS', oc: 'a', form: 'direct', rung: 1, gen: choose(PROV_FINISH, { stem: 'Choose the word that finishes the proverb.', hints: ['Say the whole proverb aloud, as you heard it.', 'A proverb always has the same words.'] }) }),
  ...trio('ref', 'READIN.T1.REFERENCE_MATERIALS', REF, { stem: 'Choose the words that complete the sentence correctly.', topic: 'about which book to use', thinOk: false, hints: ['A dictionary gives meanings and spellings. An atlas gives maps. An encyclopaedia gives facts.', 'Ask what the person needs to find out.'] }),
  eng({ id: id('dict', 'alpha'), kind: 'alphabetical-order', cs: 'READIN.T1.DICTIONARY_USE', oc: 'a', form: 'direct', rung: 2, gen: alphaGen }),
  eng({ id: id('dict', 'guide'), kind: 'guide-words', cs: 'READIN.T1.DICTIONARY_USE', oc: 'a', form: 'direct', rung: 3, gen: guideGen }),
  eng({ id: id('dict', 'meaning'), kind: 'choose-meaning', cs: 'READIN.T1.DICTIONARY_USE', oc: 'a', form: 'direct', rung: 2, gen: choose(MEANING, { stem: '', hints: ['Read all the meanings in the entry.', 'Try each meaning in the sentence and see which one fits.'] }) }),
];
