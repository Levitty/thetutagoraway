// ============================================================================
// ENGLISH GRADE 5, VOCABULARY, REFERENCE SKILLS, PROVERBS, SIMILES, POLITENESS, MOOD (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names. Off for children (reviewed:false)
// until a Kenyan English teacher signs them off. See docs/qa/english-g5-2026-11-12.md.
// The alphabetical-order and guide-word families compute their key from the draw.
// ============================================================================
import { eng, choose, gap, spot, mc, feedbackOf, shuffle, pick, randInt, outcomeLetters } from './eng_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const L = (label, arr) => { arr.label = label; return arr; };
const trio = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3) }) => [
  eng({ id: `eng5.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: 1, gen: choose(pool, { stem, hints }) }),
  eng({ id: `eng5.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: 2, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints }) }),
  eng({ id: `eng5.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: 3, gen: spot(pool, { topic, hints }) }),
];

// ---------------------------------------------------------------- the words of the theme (child rights)
const RIGHTS = [
  ['Every child has a ___ to go to school.', 'right', ['responsibility', 'M_VOC_RIGHT_RESPONSIBILITY'], ['protect', 'M_VOC_NEAR_MEANING'], ['rules', 'M_VOC_NEAR_MEANING'], 'Something every child is entitled to is a right.'],
  ['It is the ___ of every child to keep the classroom clean.', 'responsibility', ['right', 'M_VOC_RIGHT_RESPONSIBILITY'], ['protect', 'M_VOC_NEAR_MEANING'], ['health', 'M_VOC_NEAR_MEANING'], 'Something a child must do is a responsibility.'],
  ['Parents should ___ their children from harm.', 'protect', ['respect', 'M_VOC_NEAR_MEANING'], ['protection', 'M_VOC_NEAR_MEANING'], ['protected', 'M_VOC_NEAR_MEANING'], 'To keep someone safe from harm is to protect them.'],
  ['Every child needs a safe ___ to live in.', 'shelter', ['education', 'M_VOC_NEAR_MEANING'], ['health', 'M_VOC_NEAR_MEANING'], ['respect', 'M_VOC_NEAR_MEANING'], 'A place to live is shelter.'],
  ['We show ___ when we listen to others without interrupting.', 'respect', ['shelter', 'M_VOC_NEAR_MEANING'], ['education', 'M_VOC_NEAR_MEANING'], ['rights', 'M_VOC_NEAR_MEANING'], 'Listening politely shows respect.'],
  ['___ gives children the chance to read and learn.', 'Education', ['Shelter', 'M_VOC_NEAR_MEANING'], ['Respect', 'M_VOC_NEAR_MEANING'], ['Health', 'M_VOC_NEAR_MEANING'], 'Learning at school is education.'],
  ["The law says no child should be made to work. This protects a child's ___.", 'rights', ['responsibilities', 'M_VOC_RIGHT_RESPONSIBILITY'], ['shelters', 'M_VOC_NEAR_MEANING'], ['respect', 'M_VOC_NEAR_MEANING'], 'What the law gives every child are rights.'],
  ['It is our ___ to look after our school books.', 'responsibility', ['right', 'M_VOC_RIGHT_RESPONSIBILITY'], ['education', 'M_VOC_NEAR_MEANING'], ['shelter', 'M_VOC_NEAR_MEANING'], 'Looking after books is something we must do: a responsibility.'],
];
const ROAD = [
  ['A person who walks on the road is a ___.', 'pedestrian', ['passenger', 'M_VOC_ROAD_NEAR'], ['driver', 'M_VOC_ROAD_NEAR'], ['conductor', 'M_VOC_ROAD_NEAR'], 'A pedestrian walks. A passenger rides in a vehicle.'],
  ['Cross the road at the zebra ___.', 'crossing', ['crosswalk', 'M_VOC_ROAD_SOUND'], ['crossroad', 'M_VOC_ROAD_SOUND'], ['crosser', 'M_VOC_ROAD_SOUND'], 'In Kenya the place is called a zebra crossing.'],
  ['A ___ protects a rider\'s head.', 'helmet', ['seat belt', 'M_VOC_ROAD_NEAR'], ['signal', 'M_VOC_ROAD_NEAR'], ['pavement', 'M_VOC_ROAD_NEAR'], 'A helmet covers and protects the head.'],
  ['Passengers in a car must fasten the ___.', 'seat belt', ['helmet', 'M_VOC_ROAD_NEAR'], ['signal', 'M_VOC_ROAD_NEAR'], ['pavement', 'M_VOC_ROAD_NEAR'], 'A seat belt holds passengers in their seats.'],
  ['Walk on the ___ when there is one.', 'pavement', ['speed limit', 'M_VOC_ROAD_NEAR'], ['helmet', 'M_VOC_ROAD_NEAR'], ['signal', 'M_VOC_ROAD_NEAR'], 'The pavement is the path at the side of the road.'],
  ['The ___ says how fast a vehicle may go.', 'speed limit', ['zebra crossing', 'M_VOC_ROAD_NEAR'], ['pavement', 'M_VOC_ROAD_NEAR'], ['seat belt', 'M_VOC_ROAD_NEAR'], 'The speed limit is the fastest speed allowed.'],
  ['The driver put out his hand to give a ___ before he turned.', 'signal', ['pedestrian', 'M_VOC_ROAD_NEAR'], ['helmet', 'M_VOC_ROAD_NEAR'], ['pavement', 'M_VOC_ROAD_NEAR'], 'A signal tells other road users what you will do.'],
  ['A boda boda rider must wear a ___.', 'helmet', ['pavement', 'M_VOC_ROAD_NEAR'], ['speed limit', 'M_VOC_ROAD_NEAR'], ['zebra crossing', 'M_VOC_ROAD_NEAR'], 'A rider wears a helmet to protect the head.'],
];
// ---------------------------------------------------------------- polite words and expressions (a situation, what to say)
const POL = [
  L('At the table', ['At the table you want the salt. Choose the polite thing to say.', 'May I please have the salt?', ['Give me the salt.', 'M_POL_DEMAND'], ['Pass salt.', 'M_POL_DEMAND'], ['I want salt.', 'M_POL_DEMAND'], 'A polite request starts with may I and says please.']),
  L('After a drink', ['Someone gives you a drink. Choose the polite thing to say.', 'Thank you.', ['Give me more.', 'M_POL_DEMAND'], ['Sorry.', 'M_POL_WRONG_REPLY'], ['Fine.', 'M_POL_WRONG_REPLY'], 'When someone gives you something, say thank you.']),
  L('Replying to thanks', ['Someone says "Thank you" to you. Choose the polite reply.', 'You are welcome.', ['Sorry.', 'M_POL_WRONG_REPLY'], ['Please.', 'M_POL_WRONG_REPLY'], ['Fine.', 'M_POL_WRONG_REPLY'], 'The polite reply to thank you is You are welcome.']),
  L('Stepping on a foot', ["You step on a friend's foot by accident. Choose the polite thing to say.", 'I am sorry.', ['Excuse me.', 'M_POL_EXCUSE_SORRY'], ['Thank you.', 'M_POL_WRONG_REPLY'], ['Move.', 'M_POL_DEMAND'], 'When you have made a mistake, say sorry.']),
  L('Passing an adult', ['You want to pass in front of an adult. Choose the polite thing to say.', 'Excuse me, please.', ['Sorry.', 'M_POL_EXCUSE_SORRY'], ['Move.', 'M_POL_DEMAND'], ['Get out of the way.', 'M_POL_DEMAND'], 'To ask for room, say excuse me.']),
  L('Not hearing', ['You did not hear what your teacher said. Choose the polite thing to say.', 'Pardon, Teacher?', ['What?', 'M_POL_DEMAND'], ['Say again.', 'M_POL_DEMAND'], ['Huh?', 'M_POL_DEMAND'], 'Pardon is the polite way to ask someone to say it again.']),
  L('Borrowing a ruler', ["You need to borrow a friend's ruler. Choose the polite thing to say.", 'Could I please borrow your ruler?', ['Give me your ruler.', 'M_POL_DEMAND'], ['I am taking your ruler.', 'M_POL_DEMAND'], ['Ruler.', 'M_POL_DEMAND'], 'Could I please begins a polite request.']),
  L('Replying to sorry', ['Someone says "Sorry" because they bumped into you. Choose the polite reply.', 'That is all right.', ['You are welcome.', 'M_POL_WRONG_REPLY'], ['Thank you.', 'M_POL_WRONG_REPLY'], ['Move away.', 'M_POL_DEMAND'], 'The polite reply to sorry is That is all right.']),
];
// ---------------------------------------------------------------- proverbs
const PROV_MEANING = [
  ['What does the proverb "A bird in the hand is worth two in the bush" mean.', 'It is better to keep what you have than to chase more.', ['Birds are easy to catch.', 'M_PROV_LITERAL'], ['Never go into the bush.', 'M_PROV_LITERAL'], ['Two birds are better than one.', 'M_PROV_NEAR_MEANING'], 'A proverb teaches a lesson, not about birds: be happy with what you have.'],
  ['What does the proverb "A stitch in time saves nine" mean.', 'Mending a small problem early prevents a big one.', ['Sewing is hard work.', 'M_PROV_LITERAL'], ['Nine stitches are better than one.', 'M_PROV_LITERAL'], ['Always do things late.', 'M_PROV_NEAR_MEANING'], 'A small stitch now saves many later: act early.'],
  ['What does the proverb "Slow and steady wins the race" mean.', 'Keep going carefully and you will succeed.', ['Tortoises are the fastest.', 'M_PROV_LITERAL'], ['Never run.', 'M_PROV_LITERAL'], ['Do things in a hurry.', 'M_PROV_NEAR_MEANING'], 'Steady effort wins in the end.'],
  ['Which situation fits the proverb "Unity is strength".', 'The villagers worked together and built the bridge.', ['Wanjiru ran the race alone.', 'M_PROV_NEAR_MEANING'], ['Otieno lifted a heavy stone.', 'M_PROV_NEAR_MEANING'], ['The team lost the match.', 'M_PROV_NEAR_MEANING'], 'Unity means working together: the villagers worked together.'],
  ['What does the proverb "Honesty is the best policy" mean.', 'Telling the truth is always the wisest choice.', ['Policies are honest.', 'M_PROV_LITERAL'], ['Lying is sometimes best.', 'M_PROV_NEAR_MEANING'], ['Policemen are honest.', 'M_PROV_LITERAL'], 'Being honest is the best way to live.'],
  ['Which situation fits the proverb "Look before you leap".', 'Baraka checked the depth of the water before he jumped in.', ['Baraka jumped over the fence.', 'M_PROV_LITERAL'], ['Baraka ran very fast.', 'M_PROV_NEAR_MEANING'], ['Baraka closed his eyes and jumped.', 'M_PROV_NEAR_MEANING'], 'Look before you leap means think first: he checked the water.'],
  ['What does the proverb "Practice makes perfect" mean.', 'The more you practise, the better you become.', ['Perfect people never practise.', 'M_PROV_LITERAL'], ['Practice is not important.', 'M_PROV_NEAR_MEANING'], ['Perfect work needs no time.', 'M_PROV_NEAR_MEANING'], 'Practising again and again makes you better.'],
  ['What does the proverb "Do not count your chickens before they hatch" mean.', 'Do not plan on something that has not happened yet.', ['Chickens hatch in the night.', 'M_PROV_LITERAL'], ['Always count chickens.', 'M_PROV_LITERAL'], ['Chickens are hard to look after.', 'M_PROV_NEAR_MEANING'], 'Do not rely on something that has not happened yet.'],
];
const PROV_FINISH = [
  ['A stitch in time saves ___.', 'nine', ['ten', 'M_PROV_WORDS_MIXED'], ['six', 'M_PROV_WORDS_MIXED'], ['one', 'M_PROV_WORDS_MIXED'], 'The proverb is "A stitch in time saves nine".'],
  ['Unity is ___.', 'strength', ['power', 'M_PROV_WORDS_MIXED'], ['wealth', 'M_PROV_WORDS_MIXED'], ['peace', 'M_PROV_WORDS_MIXED'], 'The proverb is "Unity is strength".'],
  ['Slow and steady wins the ___.', 'race', ['game', 'M_PROV_WORDS_MIXED'], ['match', 'M_PROV_WORDS_MIXED'], ['day', 'M_PROV_WORDS_MIXED'], 'The proverb is "Slow and steady wins the race".'],
  ['Honesty is the best ___.', 'policy', ['rule', 'M_PROV_WORDS_MIXED'], ['way', 'M_PROV_WORDS_MIXED'], ['idea', 'M_PROV_WORDS_MIXED'], 'The proverb is "Honesty is the best policy".'],
  ['Practice makes ___.', 'perfect', ['better', 'M_PROV_WORDS_MIXED'], ['sure', 'M_PROV_WORDS_MIXED'], ['easy', 'M_PROV_WORDS_MIXED'], 'The proverb is "Practice makes perfect".'],
  ['Look before you ___.', 'leap', ['jump', 'M_PROV_WORDS_MIXED'], ['run', 'M_PROV_WORDS_MIXED'], ['cross', 'M_PROV_WORDS_MIXED'], 'The proverb is "Look before you leap".'],
  ['A bird in the hand is worth two in the ___.', 'bush', ['tree', 'M_PROV_WORDS_MIXED'], ['sky', 'M_PROV_WORDS_MIXED'], ['field', 'M_PROV_WORDS_MIXED'], 'The proverb is "A bird in the hand is worth two in the bush".'],
  ['Do not count your chickens before they ___.', 'hatch', ['grow', 'M_PROV_WORDS_MIXED'], ['run', 'M_PROV_WORDS_MIXED'], ['sleep', 'M_PROV_WORDS_MIXED'], 'The proverb is "Do not count your chickens before they hatch".'],
];
// ---------------------------------------------------------------- similes
const SIM_IDENT = [
  ['', 'He is as strong as an ox.', ['He is very strong.', 'M_SIM_STATEMENT'], ['He is an ox.', 'M_SIM_METAPHOR'], ['He lifted the heavy sack.', 'M_SIM_STATEMENT'], 'A simile compares two things using as ... as or like.'],
  ['', 'The baby slept like a log.', ['The baby slept very well.', 'M_SIM_STATEMENT'], ['The baby was a log.', 'M_SIM_METAPHOR'], ['The baby slept for hours.', 'M_SIM_STATEMENT'], 'Like a log compares the baby to a log: a simile.'],
  ['', 'Her voice is as sweet as honey.', ['Her voice is very sweet.', 'M_SIM_STATEMENT'], ['Her voice is honey.', 'M_SIM_METAPHOR'], ['She sings every day.', 'M_SIM_STATEMENT'], 'As sweet as honey compares her voice to honey: a simile.'],
  ['', 'The runner was as quick as lightning.', ['The runner was very quick.', 'M_SIM_STATEMENT'], ['The runner was lightning.', 'M_SIM_METAPHOR'], ['The runner won the race.', 'M_SIM_STATEMENT'], 'As quick as lightning is a simile.'],
  ['', 'The tomatoes were red like blood.', ['The tomatoes were very red.', 'M_SIM_STATEMENT'], ['The tomatoes were blood.', 'M_SIM_METAPHOR'], ['The tomatoes were ripe.', 'M_SIM_STATEMENT'], 'Like blood compares the tomatoes to blood: a simile.'],
  ['', 'Otieno is as brave as a lion.', ['Otieno is a lion.', 'M_SIM_METAPHOR'], ['Otieno is very brave.', 'M_SIM_STATEMENT'], ['Otieno is not afraid of anything.', 'M_SIM_STATEMENT'], 'As brave as a lion compares Otieno to a lion: a simile.'],
];
const SIM_FILL = [
  ['As busy as a ___.', 'bee', ['tortoise', 'M_SIM_WRONG_COMPARISON'], ['stone', 'M_SIM_WRONG_COMPARISON'], ['cloud', 'M_SIM_WRONG_COMPARISON'], 'A bee is always busy.'],
  ['As brave as a ___.', 'lion', ['mouse', 'M_SIM_WRONG_COMPARISON'], ['rabbit', 'M_SIM_WRONG_COMPARISON'], ['feather', 'M_SIM_WRONG_COMPARISON'], 'A lion is famous for its bravery.'],
  ['As slow as a ___.', 'tortoise', ['hare', 'M_SIM_WRONG_COMPARISON'], ['cheetah', 'M_SIM_WRONG_COMPARISON'], ['bird', 'M_SIM_WRONG_COMPARISON'], 'A tortoise walks very slowly.'],
  ['As white as ___.', 'snow', ['coal', 'M_SIM_WRONG_COMPARISON'], ['mud', 'M_SIM_WRONG_COMPARISON'], ['soil', 'M_SIM_WRONG_COMPARISON'], 'Snow is white.'],
  ['As cold as ___.', 'ice', ['fire', 'M_SIM_WRONG_COMPARISON'], ['sun', 'M_SIM_WRONG_COMPARISON'], ['tea', 'M_SIM_WRONG_COMPARISON'], 'Ice is very cold.'],
  ['As sweet as ___.', 'honey', ['salt', 'M_SIM_WRONG_COMPARISON'], ['chilli', 'M_SIM_WRONG_COMPARISON'], ['lemon', 'M_SIM_WRONG_COMPARISON'], 'Honey is very sweet.'],
  ['As light as a ___.', 'feather', ['stone', 'M_SIM_WRONG_COMPARISON'], ['rock', 'M_SIM_WRONG_COMPARISON'], ['brick', 'M_SIM_WRONG_COMPARISON'], 'A feather weighs almost nothing.'],
  ['As quick as ___.', 'lightning', ['a tortoise', 'M_SIM_WRONG_COMPARISON'], ['a snail', 'M_SIM_WRONG_COMPARISON'], ['mud', 'M_SIM_WRONG_COMPARISON'], 'Lightning is very quick.'],
];
// ---------------------------------------------------------------- homonyms
const HOMON_SENT = [
  ['Which sentence uses the word bank to mean the side of a river.', 'We sat on the bank of the river.', ['He saved money at the bank.', 'M_HOMON_FIRST_MEANING'], ['The bank opens at nine.', 'M_HOMON_FIRST_MEANING'], ['Mama went to the bank to pay fees.', 'M_HOMON_FIRST_MEANING'], 'Bank can mean the land beside a river.'],
  ['Which sentence uses the word bat to mean the animal that flies at night.', 'A bat flew out of the cave at dusk.', ['The batsman hit the ball with his bat.', 'M_HOMON_CONTEXT_IGNORED'], ['Juma bought a new cricket bat.', 'M_HOMON_CONTEXT_IGNORED'], ['The bat is made of wood.', 'M_HOMON_CONTEXT_IGNORED'], 'Cave and dusk are clues for the animal.'],
  ['Which sentence uses the word light to mean not heavy.', 'The bag is light, so I can carry it.', ['Switch on the light, please.', 'M_HOMON_FIRST_MEANING'], ['The light is too bright.', 'M_HOMON_FIRST_MEANING'], ['Light came through the window.', 'M_HOMON_FIRST_MEANING'], 'Carry it is the clue: light means not heavy.'],
  ['Which sentence uses the word bark to mean the outside of a tree.', 'The bark of the tree was rough.', ['The dog began to bark.', 'M_HOMON_FIRST_MEANING'], ['Did you hear the dog bark?', 'M_HOMON_FIRST_MEANING'], ['It will bark at strangers.', 'M_HOMON_FIRST_MEANING'], 'Of the tree is the clue: bark is the tree\'s covering.'],
  ['Which sentence uses the word match to mean a game between two teams.', 'We won the match on Saturday.', ['He struck a match to light the jiko.', 'M_HOMON_FIRST_MEANING'], ['Please put the match in the box.', 'M_HOMON_CONTEXT_IGNORED'], ['The two socks do not match.', 'M_HOMON_CONTEXT_IGNORED'], 'We won is the clue: match is a game.'],
  ['Which sentence uses the word fair to mean treating everyone equally.', 'The teacher is fair to every learner.', ['We went to the school fair.', 'M_HOMON_FIRST_MEANING'], ['The county fair was crowded.', 'M_HOMON_FIRST_MEANING'], ['She has fair hair.', 'M_HOMON_CONTEXT_IGNORED'], 'To every learner is the clue: fair means equal.'],
  ['Which sentence uses the word left to mean the opposite of right.', 'Turn left at the gate.', ['Juma left the school early.', 'M_HOMON_FIRST_MEANING'], ['Everyone left at five.', 'M_HOMON_FIRST_MEANING'], ['Only one mango was left.', 'M_HOMON_CONTEXT_IGNORED'], 'Turn and gate are clues: left is a direction.'],
  ['Which sentence uses the word ring to mean a circle worn on a finger.', 'She wore a gold ring.', ['Did you hear the bell ring?', 'M_HOMON_FIRST_MEANING'], ['Please ring me tonight.', 'M_HOMON_CONTEXT_IGNORED'], ['The phone began to ring.', 'M_HOMON_CONTEXT_IGNORED'], 'Wore and gold are clues: a ring is jewellery.'],
];
const HOMON_MEAN = [
  ['Say what the word bank means in "We sat on the bank of the river."', 'the land beside a river', ['a place for money', 'M_HOMON_FIRST_MEANING'], ['a long seat', 'M_HOMON_CONTEXT_IGNORED'], ['a kind of boat', 'M_HOMON_CONTEXT_IGNORED'], 'Of the river is the clue.'],
  ['Say what the word light means in "The suitcase is light."', 'not heavy', ['bright', 'M_HOMON_FIRST_MEANING'], ['pale', 'M_HOMON_CONTEXT_IGNORED'], ['a lamp', 'M_HOMON_FIRST_MEANING'], 'A suitcase can be heavy or light in weight.'],
  ['Say what the word bat means in "A bat hung upside down in the cave."', 'an animal that flies at night', ['a stick for hitting a ball', 'M_HOMON_FIRST_MEANING'], ['a kind of bird that sings', 'M_HOMON_CONTEXT_IGNORED'], ['a small ball', 'M_HOMON_CONTEXT_IGNORED'], 'Upside down in the cave is the clue.'],
  ['Say what the word match means in "He struck a match."', 'a small stick that makes fire', ['a game between teams', 'M_HOMON_FIRST_MEANING'], ['to go well together', 'M_HOMON_CONTEXT_IGNORED'], ['a prize', 'M_HOMON_CONTEXT_IGNORED'], 'Struck is the clue: you strike a match to make fire.'],
  ['Say what the word fair means in "It was a fair test."', 'treating everyone the same', ['a market with games', 'M_HOMON_FIRST_MEANING'], ['pale in colour', 'M_HOMON_CONTEXT_IGNORED'], ['sunny', 'M_HOMON_CONTEXT_IGNORED'], 'A test can be fair or unfair.'],
  ['Say what the word left means in "Only two mangoes were left."', 'still there', ['the opposite of right', 'M_HOMON_FIRST_MEANING'], ['went away', 'M_HOMON_CONTEXT_IGNORED'], ['lost', 'M_HOMON_CONTEXT_IGNORED'], 'Only two mangoes remained: left means still there.'],
];
// ---------------------------------------------------------------- reference books
const REF_SOURCE = [
  ['Which book tells Juma the meaning of the word "harvest".', 'a dictionary', ['an atlas', 'M_REF_WRONG_SOURCE'], ['a timetable', 'M_REF_WRONG_SOURCE'], ['a diary', 'M_REF_WRONG_SOURCE'], 'A dictionary gives the meaning of words.'],
  ['Which book shows Mercy where Lake Victoria is on a map.', 'an atlas', ['a dictionary', 'M_REF_WRONG_SOURCE'], ['a storybook', 'M_REF_WRONG_SOURCE'], ['a hymn book', 'M_REF_WRONG_SOURCE'], 'An atlas is a book of maps.'],
  ['Which book gives Baraka facts about elephants.', 'an encyclopaedia', ['a dictionary', 'M_REF_WRONG_SOURCE'], ['an atlas', 'M_REF_WRONG_SOURCE'], ['a hymn book', 'M_REF_WRONG_SOURCE'], 'An encyclopaedia gives facts on many subjects.'],
  ['Which book helps Njeri to check the spelling of "necessary".', 'a dictionary', ['an atlas', 'M_REF_WRONG_SOURCE'], ['a newspaper', 'M_REF_WRONG_SOURCE'], ['a calendar', 'M_REF_WRONG_SOURCE'], 'A dictionary shows how words are spelt.'],
  ['Which book shows Otieno the road from Nairobi to Mombasa on a map.', 'an atlas', ['a dictionary', 'M_REF_WRONG_SOURCE'], ['an encyclopaedia of insects', 'M_REF_WRONG_SOURCE'], ['a storybook', 'M_REF_WRONG_SOURCE'], 'An atlas shows roads and places on maps.'],
  ['Which book tells Wambui more about how volcanoes form.', 'an encyclopaedia', ['a dictionary', 'M_REF_WRONG_SOURCE'], ['an atlas', 'M_REF_WRONG_SOURCE'], ['a calendar', 'M_REF_WRONG_SOURCE'], 'An encyclopaedia explains subjects in detail.'],
  ['Which book tells Kiprono what the word "generous" means.', 'a dictionary', ['an atlas', 'M_REF_WRONG_SOURCE'], ['a timetable', 'M_REF_WRONG_SOURCE'], ['a newspaper', 'M_REF_WRONG_SOURCE'], 'A dictionary gives the meaning of words.'],
  ['Which book shows Hassan the countries next to Kenya.', 'an atlas', ['a dictionary', 'M_REF_WRONG_SOURCE'], ['a storybook', 'M_REF_WRONG_SOURCE'], ['a diary', 'M_REF_WRONG_SOURCE'], 'An atlas shows countries on maps.'],
];
const ALPHA = [['back', 'bag', 'ball', 'bat'], ['can', 'cap', 'car', 'cat'], ['dog', 'door', 'dot', 'dove'], ['fan', 'farm', 'fat', 'fast'], ['hand', 'happy', 'hard', 'hat'], ['sand', 'sat', 'say', 'save'], ['map', 'mat', 'may', 'mask'], ['pan', 'park', 'pat', 'past'], ['tab', 'tag', 'tall', 'tap']];
const GUIDE_WORDS = ['maize', 'mango', 'map', 'market', 'mat', 'meal', 'meat', 'melon', 'mend', 'milk', 'mind', 'mouse'];
const alphaGen = (cskill) => {
  const words = pick(ALPHA), show = shuffle(words);
  const right = [...words].sort().join(', ');
  const firstOnly = show.join(', ');           // sorted by the first letter only: nothing changes when every word starts alike
  const reversed = [...words].sort().reverse().join(', ');
  const swapped = (() => { const w = [...words].sort(), i = randInt(0, 2); [w[i], w[i + 1]] = [w[i + 1], w[i]]; return w.join(', '); })();
  const fb = feedbackOf(cskill, 'M_REF_ALPHA_FIRST_LETTER');
  const options = mc(right, [[firstOnly, fb, 'M_REF_ALPHA_FIRST_LETTER'], [reversed, fb, 'M_REF_ALPHA_FIRST_LETTER'], [swapped, fb, 'M_REF_ALPHA_FIRST_LETTER']]);
  if (!options || firstOnly === right) return null;
  const q = show.join(', ');
  return { question: `Which list puts the words ${q} in alphabetical order.`, options, instruction: 'Choose the best answer.', hints: ['Look at the first letter of each word. They are the same, so look at the second letter, then the third.', 'Compare two words at a time, letter by letter, until they differ.'], steps: ['When the first letters match, compare the next letters.', `The alphabetical order is: ${right}.`] };
};
const guideGen = (cskill) => {
  const w = [...GUIDE_WORDS].sort();
  const i = randInt(0, w.length - 5), j = randInt(i + 3, w.length - 1), g1 = w[i], g2 = w[j];
  const test = pick(w.filter(x => x !== g1 && x !== g2));
  const inside = g1 < test && test < g2;
  const fb = feedbackOf(cskill, 'M_REF_GUIDE_WORDS');
  return { question: `A dictionary page has the guide words "${g1}" and "${g2}". Would the word "${test}" be on this page.`, options: mc(inside ? 'Yes' : 'No', [[inside ? 'No' : 'Yes', fb, 'M_REF_GUIDE_WORDS']]), instruction: 'Choose the best answer.',
    hints: ['The guide words are the first and last words on the page.', 'Put the three words in alphabetical order. Is the word in the middle?'], steps: [`In alphabetical order: ${[g1, test, g2].sort().join(', ')}.`, inside ? `"${test}" comes between the guide words, so it is on this page.` : `"${test}" does not come between the guide words, so it is not on this page.`], chk: () => inside === (g1 < test && test < g2) };
};
// ---------------------------------------------------------------- mood in a narrative
const MOOD = [
  ['"Wafula laughed with the others, but his hands shook as the teacher called his name."', 'Wafula', 'nervous', ['happy', 'angry', 'bored'], 'his hands shook', ['laughed with the others', 'called his name'], 'His hands shook when his name was called: he was nervous, even though he laughed.'],
  ['"Mama kept looking at the road. She checked her watch again and again. The bus was one hour late."', 'Mama', 'worried', ['calm', 'sleepy', 'excited'], 'checked her watch again and again', ['kept looking at the road', 'one hour late'], 'Checking her watch again and again shows worry.'],
  ['"Achieng jumped up and down and hugged her friend. \'We won!\' she shouted."', 'Achieng', 'excited', ['sad', 'afraid', 'tired'], 'jumped up and down', ['hugged her friend', 'she shouted'], 'Jumping and shouting after a win show excitement.'],
  ['"Kamau put his head on his arms. His lunch stayed in the box, and he gave no reply to anyone."', 'Kamau', 'sad', ['cheerful', 'proud', 'curious'], 'His lunch stayed in the box', ['put his head on his arms', 'he gave no reply to anyone'], 'Leaving his lunch and saying nothing show sadness.'],
  ['"Njeri held her father\'s hand tightly as the dog barked and came closer."', 'Njeri', 'afraid', ['bored', 'proud', 'brave'], 'held her father\'s hand tightly', ['the dog barked', 'came closer'], 'Holding tightly to her father shows fear.'],
  ['"The teacher smiled and patted Baraka on the shoulder. \'Well done,\' she said softly."', 'the teacher', 'pleased', ['angry', 'frightened', 'bored'], 'smiled and patted Baraka', ['on the shoulder', 'she said softly'], 'A smile and a pat with Well done show she was pleased.'],
  ['"Otieno stamped his foot and slammed the door. \'It is not fair!\' he shouted."', 'Otieno', 'angry', ['delighted', 'sleepy', 'shy'], 'stamped his foot and slammed the door', ['he shouted', 'on the door'], 'Stamping, slamming and shouting show anger.'],
  ['"The village was quiet. Dark clouds sat low over the hills, and no bird sang."', 'the village', 'gloomy', ['cheerful', 'playful', 'busy'], 'Dark clouds sat low', ['over the hills', 'The village was quiet'], 'Dark clouds and no singing make the mood gloomy.'],
];
const moodFeel = (cskill) => {
  const [lines, who, right, wrongs, , , because] = pick(MOOD);
  const [w1, w2, w3] = shuffle(wrongs);
  const options = mc(right, [[w1, feedbackOf(cskill, 'M_MOOD_OPPOSITE'), 'M_MOOD_OPPOSITE'], [w2, feedbackOf(cskill, 'M_MOOD_NAMED_NOT_SHOWN'), 'M_MOOD_NAMED_NOT_SHOWN'], [w3, feedbackOf(cskill, 'M_MOOD_NAMED_NOT_SHOWN'), 'M_MOOD_NAMED_NOT_SHOWN']]);
  return { question: `Read the lines. ${lines} Choose the word that best shows how ${who} felt.`, options, instruction: 'Choose the best answer.', hints: ['Look at what the person does and says, not one word on its own.', 'Which feeling matches all the clues in the lines?'], steps: [because, `The feeling is "${right}".`] };
};
const moodEvidence = (cskill) => {
  const [lines, who, right, , clue, others, because] = pick(MOOD);
  const options = mc(clue, others.map(o => [o, feedbackOf(cskill, 'M_MOOD_NAMED_NOT_SHOWN'), 'M_MOOD_NAMED_NOT_SHOWN']));
  return { question: `Read the lines. ${lines} Which words best show that ${who} felt ${right}.`, options, instruction: 'Choose the best answer.', hints: ['Look for an action or a word that points to the feeling.', 'A detail that only tells you what happened does not show the feeling.'], steps: [because, `The words that show it are "${clue}".`] };
};

export const FAMILIES = [
  ...trio('rights', 'LISTEN.T1.THEME_WORDS', RIGHTS, { topic: 'about children\'s rights and responsibilities', hints: ['Read the whole sentence and say what the gap must mean.', 'One word is about what you are given and another is about what you must do.'] }),
  ...trio('road', 'LISTEN.T4.ROAD_SAFETY_WORDS', ROAD, { topic: 'about road safety', hints: ['Read the whole sentence and say what the gap must mean.', 'Think about who uses the road and what keeps them safe.'] }),
  eng({ id: 'eng5.polite.choose', cs: 'LISTEN.T3.POLITE_EXPRESSIONS', oc: 'a', form: 'direct', rung: 1, gen: choose(POL, { stem: '', hints: ['Think about how you would like to be spoken to.', 'A polite request starts with may I, could I or could you, and says please.'] }) }),
  eng({ id: 'eng5.polite.spot', cs: 'LISTEN.T3.POLITE_EXPRESSIONS', oc: 'd', form: 'spot', rung: 3, gen: spot(POL, { topic: 'about what to say in four different situations', hints: ['Read what each situation needs: a request, thanks, sorry or a reply.', 'A command or a short grunt is not polite.'] }) }),
  eng({ id: 'eng5.proverb.meaning', kind: 'choose-meaning', cs: 'LISTEN.T8.PROVERBS', oc: 'a', form: 'direct', rung: 2, gen: choose(PROV_MEANING, { stem: '', hints: ['A proverb has a lesson hidden in it. Ask what it teaches people.', 'The lesson is not about the animals or objects in the words.'] }) }),
  eng({ id: 'eng5.proverb.finish', kind: 'type-word', cs: 'LISTEN.T8.PROVERBS', oc: 'd', form: 'direct', rung: 2, gen: gap(PROV_FINISH, { stem: 'Type the word that finishes the proverb.', hints: ['Say the whole proverb aloud, as you heard it.', 'A proverb always has the same words.'] }) }),
  eng({ id: 'eng5.proverb.finish-choose', kind: 'choose-word', cs: 'LISTEN.T8.PROVERBS', oc: 'd', form: 'direct', rung: 1, gen: choose(PROV_FINISH, { stem: 'Choose the word that finishes the proverb.', hints: ['Say the whole proverb aloud, as you heard it.', 'A proverb always has the same words.'] }) }),
  eng({ id: 'eng5.simile.identify', kind: 'identify', cs: 'WRITIN.T8.SIMILES', oc: 'a', form: 'direct', rung: 1, gen: choose(SIM_IDENT, { stem: 'Which sentence is a simile.', hints: ['A simile compares two different things.', 'Look for the word like, or the pair as ... as.'] }) }),
  eng({ id: 'eng5.simile.complete', kind: 'type-word', cs: 'WRITIN.T8.SIMILES', oc: 'b', form: 'direct', rung: 2, gen: gap(SIM_FILL, { stem: 'Type the missing {what} to finish the simile.', hints: ['Think about the thing that is famous for this quality.', 'Say the whole comparison aloud.'] }) }),
  eng({ id: 'eng5.simile.complete-choose', kind: 'choose-word', cs: 'WRITIN.T8.SIMILES', oc: 'b', form: 'direct', rung: 1, gen: choose(SIM_FILL, { stem: 'Choose the word that finishes the simile.', hints: ['Think about the thing that is famous for this quality.', 'Say the whole comparison aloud.'] }) }),
  eng({ id: 'eng5.homonym.sentence', kind: 'choose-sentence', cs: 'WRITIN.T11.HOMONYMS', oc: 'b', form: 'direct', rung: 2, gen: choose(HOMON_SENT, { stem: '', hints: ['Read the whole sentence, not just the word.', 'Look for clue words that show which meaning is used.'] }) }),
  eng({ id: 'eng5.homonym.meaning', kind: 'choose-meaning', cs: 'WRITIN.T11.HOMONYMS', oc: 'b', form: 'direct', rung: 2, gen: choose(HOMON_MEAN, { stem: '', hints: ['Read the whole sentence, not just the word.', 'Try each meaning in place of the word and see which one fits.'] }) }),
  eng({ id: 'eng5.ref.source', kind: 'choose-source', cs: 'READIN.T1.REFERENCE_MATERIALS', oc: 'a', form: 'direct', rung: 1, gen: choose(REF_SOURCE, { stem: '', hints: ['A dictionary gives meanings and spellings. An atlas gives maps. An encyclopaedia gives facts.', 'Ask what the person needs to find out.'] }) }),
  eng({ id: 'eng5.ref.alpha', kind: 'alphabetical-order', cs: 'READIN.T1.REFERENCE_MATERIALS', oc: 'c', form: 'direct', rung: 2, gen: alphaGen }),
  eng({ id: 'eng5.ref.guide', kind: 'guide-words', cs: 'READIN.T1.REFERENCE_MATERIALS', oc: 'c', form: 'direct', rung: 3, gen: guideGen }),
  eng({ id: 'eng5.mood.feeling', kind: 'choose-feeling', cs: 'LISTEN.T10.MOOD_FEELINGS', oc: 'a', form: 'direct', rung: 1, gen: moodFeel }),
  eng({ id: 'eng5.mood.evidence', kind: 'choose-evidence', cs: 'LISTEN.T10.MOOD_FEELINGS', oc: 'a', form: 'why', rung: 2, gen: moodEvidence }),
];
