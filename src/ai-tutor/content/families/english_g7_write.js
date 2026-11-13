// ============================================================================
// ENGLISH GRADE 7, WRITING: punctuation, paragraphs, letters, spelling, the writing process, narrative and descriptive features,
// lists, synonyms, numbers, dialogue, idioms, notices (checked in text): DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the
// library misconception behind it (curriculum/english/g7.json). Off for children (reviewed:false) until a
// Kenyan English teacher signs them off. Composing a paragraph, a letter, a dialogue or a description is marked by a
// teacher with the composition rubric (see the non-question outcomes list); these families test the knowledge.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters, mc, feedbackOf, shuffle, pick, randInt } from './english_g7_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const SENT = 'Which sentence is correct.';
const GH = ['Read the sentence slowly, one word at a time.', 'Check your word by reading the sentence aloud.'];
const w = (code, ...xs) => xs.map(x => [x, code]);
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const L = (label, it) => Object.assign(it, { label });   // a label for the spot family ("Letter to a cousin")
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english7.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english7.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english7.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
const C = (key, kind, cs, pool, { stem = 'Choose.', hints, oc, form = 'direct', rung = 1 }) =>
  eng({ id: `english7.${key}`, kind, cs, oc: oc || outcomeLetters(cs, 1)[0], form, rung, gen: choose(pool, { stem, hints }) });
const SP = (key, cs, pool, { topic, hints, oc, rung = 3 }) =>
  eng({ id: `english7.${key}.spot`, cs, oc: oc || outcomeLetters(cs, 1)[0], form: 'spot', rung, gen: spot(pool, { topic, hints }) });

// Put four sentences or steps in order: options are lists of letters (the same shape as the Grade 6 order question).
const orderGen = (sets, { intro, codes, hints }) => (cskill) => {
  const ev = pick(sets);
  let show; do { show = shuffle(ev.map((t, i) => i)); } while (show.every((v, i) => v === i));
  const letter = (idx) => 'ABCD'[show.indexOf(idx)];
  const seq = (arr) => arr.map(letter).join(', ');
  const base = [0, 1, 2, 3], right = seq(base), i = randInt(0, 2), sw = [...base]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const options = mc(right, [[seq([...base].reverse()), feedbackOf(cskill, codes[0]), codes[0]], [seq(sw), feedbackOf(cskill, codes[1]), codes[1]], [seq([3, 0, 1, 2]), feedbackOf(cskill, codes[0]), codes[0]]]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { question: `${intro} ${list}`, options, fixedOrder: false, instruction: 'Choose the best answer.', hints, steps: [`The right order is: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Written as letters this is ${right}.`], chk: () => true };
};

// ---------------------------------------------------------------- end marks
const EM = [
  I('', 'Where is the market?', [['Where is the market.', 'M7_EM_FULLSTOP_QUESTION'], ['where is the market?', 'M7_EM_NO_CAPITAL']], 'This is a question, so it ends with a question mark and starts with a capital.'),
  I('', 'She asked me where I was going.', [['She asked me where I was going?', 'M7_EM_QMARK_STATEMENT'], ['she asked me where I was going.', 'M7_EM_NO_CAPITAL']], 'The sentence tells what she asked, so it ends with a full stop.'),
  I('', 'Watch out!', [['Watch out.', 'M7_EM_NO_EXCLAMATION'], ['watch out!', 'M7_EM_NO_CAPITAL']], 'A sudden warning ends with an exclamation mark.'),
  I('', 'Do you know the answer?', [['Do you know the answer.', 'M7_EM_FULLSTOP_QUESTION'], ['do you know the answer?', 'M7_EM_NO_CAPITAL']], 'A question ends with a question mark.'),
  I('', 'We arrived late. It was dark.', [['We arrived late. it was dark.', 'M7_EM_NO_CAPITAL'], ['We arrived late! it was dark.', 'M7_EM_NO_CAPITAL']], 'A new sentence after a full stop begins with a capital letter.'),
  I('', 'He wondered whether she had come.', [['He wondered whether she had come?', 'M7_EM_QMARK_STATEMENT'], ['he wondered whether she had come.', 'M7_EM_NO_CAPITAL']], 'The sentence tells what he wondered, so it ends with a full stop.'),
  I('', 'What a beautiful morning!', [['What a beautiful morning.', 'M7_EM_NO_EXCLAMATION'], ['what a beautiful morning!', 'M7_EM_NO_CAPITAL']], 'A strong feeling ends with an exclamation mark.'),
  I('', 'Stop thief!', [['Stop thief!!!', 'M7_EM_MANY_MARKS'], ['Stop thief.', 'M7_EM_NO_EXCLAMATION']], 'One exclamation mark is enough for a shout.'),
  I('', 'How many goats do you have?', [['How many goats do you have.', 'M7_EM_FULLSTOP_QUESTION'], ['How many goats do you have???', 'M7_EM_MANY_MARKS']], 'A question ends with one question mark.'),
];
const EM_MARK = [
  I('Which mark ends this sentence: "Where do you live"', 'question mark', [['full stop', 'M7_EM_FULLSTOP_QUESTION'], ['exclamation mark', 'M7_EM_FULLSTOP_QUESTION'], ['comma', 'M7_EM_FULLSTOP_QUESTION']], 'It asks something, so it ends with a question mark.'),
  I('Which mark ends this sentence: "What a great goal"', 'exclamation mark', [['full stop', 'M7_EM_NO_EXCLAMATION'], ['question mark', 'M7_EM_NO_EXCLAMATION'], ['comma', 'M7_EM_NO_EXCLAMATION']], 'It shows a strong feeling, so it ends with an exclamation mark.'),
  I('Which mark ends this sentence: "The bus left at six"', 'full stop', [['question mark', 'M7_EM_QMARK_STATEMENT'], ['exclamation mark', 'M7_EM_NO_EXCLAMATION'], ['comma', 'M7_EM_QMARK_STATEMENT']], 'It tells a fact, so it ends with a full stop.'),
  I('Which mark ends this sentence: "She asked where I live"', 'full stop', [['question mark', 'M7_EM_QMARK_STATEMENT'], ['exclamation mark', 'M7_EM_QMARK_STATEMENT'], ['comma', 'M7_EM_QMARK_STATEMENT']], 'It reports a question. It does not ask one, so it ends with a full stop.'),
  I('Which mark ends this sentence: "Look out, the glass is falling"', 'exclamation mark', [['full stop', 'M7_EM_NO_EXCLAMATION'], ['question mark', 'M7_EM_NO_EXCLAMATION'], ['comma', 'M7_EM_NO_EXCLAMATION']], 'It is a sudden warning, so it ends with an exclamation mark.'),
  I('Which mark ends this sentence: "Can you help me carry the water"', 'question mark', [['full stop', 'M7_EM_FULLSTOP_QUESTION'], ['exclamation mark', 'M7_EM_FULLSTOP_QUESTION'], ['comma', 'M7_EM_FULLSTOP_QUESTION']], 'It asks something, so it ends with a question mark.'),
];
// ---------------------------------------------------------------- narrative paragraph
const NP_OPEN = [
  I('Which sentence best opens a narrative paragraph about a school trip.', 'On Friday morning our class set off for Nakuru.', [['Suddenly the bus broke down.', 'M7_NP_OPENING_EVENT'], ['We were tired but happy when we got home.', 'M7_NP_ORDER'], ['My uncle sells shoes in Eldoret.', 'M7_NP_OFF_TOPIC']], 'The opening sets the scene: who, where and when.'),
  I('Which sentence best opens a narrative paragraph about a market day.', 'Early on Saturday, Mama and I walked to Gikomba Market.', [['In the end we carried the heavy bags home.', 'M7_NP_ORDER'], ['A goat suddenly ran past us.', 'M7_NP_OPENING_EVENT'], ['Football is my favourite game.', 'M7_NP_OFF_TOPIC']], 'The opening says who went where and when.'),
  I('Which sentence best opens a narrative paragraph about a lost phone.', 'Last Monday I lost my father\'s phone on the way to school.', [['I thanked the stranger and went home smiling.', 'M7_NP_ORDER'], ['Then a kind woman handed it to me.', 'M7_NP_OPENING_EVENT'], ['The moon goes round the earth.', 'M7_NP_OFF_TOPIC']], 'The opening sets the scene: what happened, to whom and when.'),
  I('Which sentence best opens a narrative paragraph about a football match.', 'Our school played Kisii Primary in the final on Saturday.', [['Finally the whistle blew and we had won.', 'M7_NP_ORDER'], ['In the second half Otieno scored.', 'M7_NP_OPENING_EVENT'], ['My sister likes reading.', 'M7_NP_OFF_TOPIC']], 'The opening tells who played, against whom and when.'),
  I('Which sentence best opens a narrative paragraph about a rainy day.', 'It started to rain heavily just as we left school.', [['At last we reached home, wet but laughing.', 'M7_NP_ORDER'], ['Halfway home the road turned into a river.', 'M7_NP_OPENING_EVENT'], ['Maize grows well in Kitale.', 'M7_NP_OFF_TOPIC']], 'The opening sets the scene for what follows.'),
  I('Which sentence best opens a narrative paragraph about a visit to a grandmother.', 'During the April holiday, I visited my grandmother in Kakamega.', [['I promised to visit her again soon.', 'M7_NP_ORDER'], ['She gave me a basket of eggs.', 'M7_NP_OPENING_EVENT'], ['Rice is sold in the shop.', 'M7_NP_OFF_TOPIC']], 'The opening says who visited whom, where and when.'),
];
const NP_CLOSE = [
  I('Which sentence best closes a narrative paragraph about a school trip.', 'We were tired but happy when we got home.', [['On Friday morning our class set off for Nakuru.', 'M7_NP_ORDER'], ['Halfway there the bus stopped for lunch.', 'M7_NP_NO_CLOSING'], ['Nakuru is a big town.', 'M7_NP_OFF_TOPIC']], 'The closing tells how it all ended.'),
  I('Which sentence best closes a narrative paragraph about a lost phone.', 'I thanked the stranger and went home smiling.', [['Last Monday I lost my father\'s phone.', 'M7_NP_ORDER'], ['Then a kind woman found it on the road.', 'M7_NP_NO_CLOSING'], ['Phones are expensive.', 'M7_NP_OFF_TOPIC']], 'The closing tells how the story ended.'),
  I('Which sentence best closes a narrative paragraph about a football match.', 'Finally the whistle blew and we had won the cup.', [['Our school played Kisii Primary on Saturday.', 'M7_NP_ORDER'], ['In the second half Otieno scored.', 'M7_NP_NO_CLOSING'], ['Football is played with a ball.', 'M7_NP_OFF_TOPIC']], 'The closing tells the end of the match.'),
  I('Which sentence best closes a narrative paragraph about a rainy day.', 'At last we reached home, wet but laughing.', [['It started to rain as we left school.', 'M7_NP_ORDER'], ['Halfway home the road turned into a river.', 'M7_NP_NO_CLOSING'], ['Rain falls from clouds.', 'M7_NP_OFF_TOPIC']], 'The closing tells how the journey ended.'),
  I('Which sentence best closes a narrative paragraph about a visit to a grandmother.', 'I promised to visit her again soon.', [['During the holiday I visited my grandmother.', 'M7_NP_ORDER'], ['She gave me a basket of eggs.', 'M7_NP_NO_CLOSING'], ['Grandmothers are old.', 'M7_NP_OFF_TOPIC']], 'The closing tells how the visit ended.'),
];
const NP_ORDER = [
  ['On Friday our class went to the zoo.', 'First we saw the lions.', 'Then we ate lunch under a tree.', 'At last we returned to school, tired but happy.'],
  ['Last Saturday Mama sent me to the shop.', 'I bought bread and sugar.', 'On the way back I dropped the sugar.', 'In the end a neighbour helped me to pick it up.'],
  ['Early one morning Baraka set out for the river.', 'He filled his jerrycan with water.', 'Next he met his friend and they chatted.', 'Finally he carried the water home.'],
];
// ---------------------------------------------------------------- paragraph examples and the sentence that does not belong
const PE = [
  I('The topic sentence is: "Our school keeps the compound clean." Which sentence gives a good example.', 'Every Friday each class sweeps its own corner.', [['Our school has a big football field.', 'M7_PE_EXAMPLE_OFF'], ['Our school is very clean.', 'M7_PE_REPEAT'], ['The headteacher is tall.', 'M7_PE_EXAMPLE_OFF']], 'This shows what the school does to keep the compound clean.'),
  I('The topic sentence is: "Kenya has many tourist attractions." Which sentence gives a good example.', 'Thousands of visitors come each year to see the animals of the Maasai Mara.', [['Kenya has lots of places for tourists to visit.', 'M7_PE_REPEAT'], ['Nairobi is a big city.', 'M7_PE_EXAMPLE_OFF'], ['Kenya is in East Africa.', 'M7_PE_EXAMPLE_OFF']], 'The Maasai Mara is one real tourist attraction.'),
  I('The topic sentence is: "Wanjiru is a helpful girl." Which sentence gives a good example.', 'Yesterday she carried an old woman\'s basket to the market.', [['Wanjiru likes to help people.', 'M7_PE_REPEAT'], ['Wanjiru has long hair.', 'M7_PE_EXAMPLE_OFF'], ['Wanjiru lives in Kisii.', 'M7_PE_EXAMPLE_OFF']], 'This tells one real thing she did to help.'),
  I('The topic sentence is: "Exercise keeps the body healthy." Which sentence gives a good example.', 'Children who run and play every day are less likely to fall sick.', [['Exercise is good for you.', 'M7_PE_REPEAT'], ['The gym opens at six.', 'M7_PE_EXAMPLE_OFF'], ['Some people like swimming.', 'M7_PE_EXAMPLE_OFF']], 'This shows how exercise helps the body.'),
  I('The topic sentence is: "Rainwater is useful at home." Which sentence gives a good example.', 'Our family stores it in a tank and uses it for washing clothes.', [['Rainwater is helpful in many ways.', 'M7_PE_REPEAT'], ['It rained last week.', 'M7_PE_EXAMPLE_OFF'], ['Clouds are grey.', 'M7_PE_EXAMPLE_OFF']], 'This shows one real use of rainwater at home.'),
  I('The topic sentence is: "Reading improves your English." Which sentence gives a good example.', 'After reading a story each night, Peter began to use new words in class.', [['Reading is a good habit.', 'M7_PE_REPEAT'], ['Books are on the shelf.', 'M7_PE_EXAMPLE_OFF'], ['The library closes at five.', 'M7_PE_EXAMPLE_OFF']], 'This shows one real case where reading improved a learner\'s English.'),
];
const PE_INC = [
  I('Which sentence tells an incident, one thing that happened at one time.', 'Yesterday a boy found a purse and took it to the teacher.', [['Children like to play.', 'M7_PE_INCIDENT_GENERAL'], ['Boys and girls enjoy school.', 'M7_PE_INCIDENT_GENERAL'], ['Teachers work hard.', 'M7_PE_INCIDENT_GENERAL']], 'An incident is one event that happened at a time and place.'),
  I('Which sentence tells an incident that shows that Kamau is brave.', 'Last Friday Kamau pulled a small child out of the river.', [['Kamau is a brave boy.', 'M7_PE_REPEAT'], ['Boys can be brave.', 'M7_PE_INCIDENT_GENERAL'], ['Rivers are deep.', 'M7_PE_EXAMPLE_OFF']], 'An incident tells one real thing that happened and shows the point.'),
  I('Which sentence tells an incident that shows that the market is busy.', 'On Saturday we waited forty minutes to buy tomatoes because of the queue.', [['Markets are busy places.', 'M7_PE_INCIDENT_GENERAL'], ['Many people shop at markets.', 'M7_PE_INCIDENT_GENERAL'], ['Tomatoes are red.', 'M7_PE_EXAMPLE_OFF']], 'It tells one thing that happened at one time and shows that the market is busy.'),
  I('Which sentence tells an incident that shows that Mercy works hard.', 'Last term she walked to the river twice every day to fetch water.', [['Mercy is a hard worker.', 'M7_PE_REPEAT'], ['Girls often work hard.', 'M7_PE_INCIDENT_GENERAL'], ['Water is useful.', 'M7_PE_EXAMPLE_OFF']], 'It tells what Mercy did at one time, so it is an incident.'),
  I('Which sentence tells an incident that shows that our school is friendly.', 'On the first day, three learners shared their lunch with the new girl.', [['Our school is a friendly place.', 'M7_PE_REPEAT'], ['Schools have teachers and learners.', 'M7_PE_INCIDENT_GENERAL'], ['Lunch is at one o\'clock.', 'M7_PE_EXAMPLE_OFF']], 'It tells one thing that happened on one day.'),
];
const PEC = [
  I('Complete the sentence: "Many animals live in the park, ___ lions, zebras and giraffes."', 'such as', w('M7_PE_CONNECTOR', 'however', 'because', 'finally'), 'Such as brings in examples of the animals.'),
  I('Complete the text: "Some fruits are rich in vitamins. ___, oranges and pawpaws help us to stay healthy."', 'For example', w('M7_PE_CONNECTOR', 'However', 'Finally', 'Therefore'), 'For example brings in examples of the fruits.'),
  I('Complete the text: "Kenya exports many crops. ___, tea and coffee bring the country large sums of money."', 'For instance', w('M7_PE_CONNECTOR', 'Instead', 'Meanwhile', 'Otherwise'), 'For instance brings in an example.'),
  I('Complete the sentence: "Our school has four clubs, ___ the drama club and the science club."', 'including', w('M7_PE_CONNECTOR', 'because', 'although', 'unless'), 'Including brings in examples from the group.'),
  I('Complete the text: "Some birds cannot fly. ___, the ostrich runs very fast."', 'For example', w('M7_PE_CONNECTOR', 'However', 'Finally', 'Because'), 'For example brings in an example of a bird that cannot fly.'),
  I('Complete the text: "There are many ways to save water. ___, we can close the tap while brushing our teeth."', 'For example', w('M7_PE_CONNECTOR', 'Therefore', 'Because', 'Although'), 'For example brings in one way of saving water.'),
];
const PODD = [
  I('Which sentence does not belong in this paragraph. "Achieng went to the river at dawn. She filled her jerrycan with water. Her uncle sells shoes in Eldoret. Then she carried it home."', 'Her uncle sells shoes in Eldoret.', w('M7_PE_KEEPS_OFF_TOPIC', 'Achieng went to the river at dawn.', 'She filled her jerrycan with water.', 'Then she carried it home.'), 'The paragraph is about Achieng fetching water. The uncle\'s shoes are about something else.'),
  I('Which sentence does not belong in this paragraph. "The match began at three. Our striker scored twice. Maize grows best in warm places. We won by two goals."', 'Maize grows best in warm places.', w('M7_PE_KEEPS_OFF_TOPIC', 'The match began at three.', 'Our striker scored twice.', 'We won by two goals.'), 'The paragraph is about a match. Maize is about something else.'),
  I('Which sentence does not belong in this paragraph. "Baraka woke up early. He packed his bag and ate breakfast. The Atlantic Ocean is very deep. Then he ran to catch the bus."', 'The Atlantic Ocean is very deep.', w('M7_PE_KEEPS_OFF_TOPIC', 'Baraka woke up early.', 'He packed his bag and ate breakfast.', 'Then he ran to catch the bus.'), 'The paragraph is about Baraka\'s morning. The ocean is about something else.'),
  I('Which sentence does not belong in this paragraph. "Mama baked a cake for my birthday. I helped her to mix the flour. A lion is a big cat. We shared the cake with our neighbours."', 'A lion is a big cat.', w('M7_PE_KEEPS_OFF_TOPIC', 'Mama baked a cake for my birthday.', 'I helped her to mix the flour.', 'We shared the cake with our neighbours.'), 'The paragraph is about the birthday cake. Lions are about something else.'),
  I('Which sentence does not belong in this paragraph. "The storm began after lunch. Strong winds shook the trees. My teacher drives a blue car. By evening the sky was clear again."', 'My teacher drives a blue car.', w('M7_PE_KEEPS_OFF_TOPIC', 'The storm began after lunch.', 'Strong winds shook the trees.', 'By evening the sky was clear again.'), 'The paragraph is about a storm. The teacher\'s car is about something else.'),
];
// ---------------------------------------------------------------- friendly letter
const FL_CLOSE = [
  L('Letter to a cousin', I('Which closing suits a friendly letter to your cousin.', 'Your loving cousin,', w('M7_FL_WRONG_CLOSING', 'Yours faithfully,', 'Yours sincerely,', 'Yours obediently,'), 'A friendly letter ends warmly: Your loving cousin.')),
  L('Letter to a friend', I('Which closing suits a friendly letter to your friend.', 'Your friend,', w('M7_FL_WRONG_CLOSING', 'Yours faithfully,', 'Yours sincerely,', 'Yours obediently,'), 'A friendly letter ends warmly: Your friend.')),
  L('Letter to a grandmother', I('Which closing suits a friendly letter to your grandmother.', 'With love from your granddaughter,', w('M7_FL_WRONG_CLOSING', 'Yours faithfully,', 'Yours sincerely,', 'Yours obediently,'), 'A letter to a relative ends with love: With love from your granddaughter.')),
  L('Letter to a brother', I('Which closing suits a friendly letter to your older brother.', 'Your brother,', w('M7_FL_WRONG_CLOSING', 'Yours faithfully,', 'Yours sincerely,', 'Yours obediently,'), 'A letter to a brother ends with: Your brother.')),
  L('Letter to a pen friend', I('Which closing suits a friendly letter to a pen friend.', 'Your friend always,', w('M7_FL_WRONG_CLOSING', 'Yours faithfully,', 'Yours sincerely,', 'Yours obediently,'), 'A friendly letter ends with a warm closing such as Your friend always.')),
  L('Letter to an aunt', I('Which closing suits a friendly letter to your aunt.', 'With love, your niece,', w('M7_FL_WRONG_CLOSING', 'Yours faithfully,', 'Yours sincerely,', 'Yours obediently,'), 'A friendly letter ends with warm words.')),
];
const FL_PART = [
  I('Which address goes at the top right of a friendly letter.', 'your own address', [['the address of the person you are writing to', 'M7_FL_RECEIVER_ADDRESS'], ['the address of your school only', 'M7_FL_RECEIVER_ADDRESS'], ['no address at all', 'M7_FL_RECEIVER_ADDRESS']], 'The writer\'s address goes at the top right so the friend can reply.'),
  I('Which part is NOT needed in a friendly letter.', 'a subject line in capitals', [['a greeting', 'M7_FL_SUBJECT_LINE'], ['the date', 'M7_FL_SUBJECT_LINE'], ['a closing', 'M7_FL_SUBJECT_LINE']], 'A subject line belongs to a formal letter. A friendly letter needs the others.'),
  I('Which greeting suits a letter to your friend Achieng.', 'Dear Achieng,', [['Dear Sir,', 'M7_FL_GREETING'], ['Dear Madam,', 'M7_FL_GREETING'], ['To whom it may concern,', 'M7_FL_GREETING']], 'A friendly letter begins with the name of the friend.'),
  I('Which part comes last in a friendly letter.', 'the writer\'s name', [['the closing', 'M7_FL_ORDER'], ['the date', 'M7_FL_ORDER'], ['the greeting', 'M7_FL_ORDER']], 'The order is address and date, greeting, body, closing and then the name.'),
  I('Where does the date go in a friendly letter.', 'under the writer\'s address, at the top right', [['at the bottom left', 'M7_FL_ORDER'], ['after the writer\'s name', 'M7_FL_ORDER'], ['in the greeting', 'M7_FL_ORDER']], 'The writer\'s address and the date go together at the top right.'),
  I('Which greeting suits a letter to your grandmother.', 'Dear Grandma,', [['Dear Madam,', 'M7_FL_GREETING'], ['Dear Sir or Madam,', 'M7_FL_GREETING'], ['To the manager,', 'M7_FL_GREETING']], 'A friendly letter uses the word you use for the person: Dear Grandma.'),
];
// ---------------------------------------------------------------- commonly misspelt words
const MS = [
  I('My best ___ lives in Kisii.', 'friend', [['freind', 'M7_MS_IE_EI'], ['frend', 'M7_MS_SOUND_SPELL'], ['freend', 'M7_MS_SOUND_SPELL']], 'Friend is fri + end.'),
  I('Write your home ___ on the form.', 'address', [['adress', 'M7_MS_DOUBLE_LETTER'], ['addres', 'M7_MS_DOUBLE_LETTER'], ['adres', 'M7_MS_DOUBLE_LETTER']], 'Address has two d and two s.'),
  I('The shortest month of the year is ___.', 'February', [['Febuary', 'M7_MS_SILENT_LETTER'], ['Feburary', 'M7_MS_SILENT_LETTER'], ['Febrary', 'M7_MS_SILENT_LETTER']], 'February has an r after the b: Feb-ru-ary.'),
  I('I stayed home ___ I was sick.', 'because|since|as', [['becuase', 'M7_MS_SOUND_SPELL'], ['becouse', 'M7_MS_SOUND_SPELL'], ['becaus', 'M7_MS_SOUND_SPELL']], 'Because is be + cause.'),
  I('The day after Tuesday is ___.', 'Wednesday', [['Wensday', 'M7_MS_HOMOPHONE_FORM'], ['Wendsday', 'M7_MS_HOMOPHONE_FORM'], ['Wedensday', 'M7_MS_HOMOPHONE_FORM']], 'Wednesday has a d that is not said: Wed-nes-day.'),
  I('It is ___ to wash your hands before eating.', 'necessary|important|essential', [['neccessary', 'M7_MS_DOUBLE_LETTER'], ['necesary', 'M7_MS_DOUBLE_LETTER'], ['necessery', 'M7_MS_DOUBLE_LETTER']], 'Necessary has one c and two s.'),
  I('I ___ that you will pass the examination.', 'believe|think|hope|know', [['beleive', 'M7_MS_IE_EI'], ['belive', 'M7_MS_SOUND_SPELL'], ['beleve', 'M7_MS_SOUND_SPELL']], 'Believe is be + lie + ve.'),
  I('The ___ of Kenya meets in Nairobi.', 'government|parliament', [['goverment', 'M7_MS_SILENT_LETTER'], ['govenment', 'M7_MS_SILENT_LETTER'], ['govrment', 'M7_MS_SILENT_LETTER']], 'Government has an n before ment: govern + ment.'),
  I('We borrowed a book from the school ___.', 'library', [['libary', 'M7_MS_SILENT_LETTER'], ['liberry', 'M7_MS_SOUND_SPELL'], ['librery', 'M7_MS_SOUND_SPELL']], 'Library has two r: li-brar-y.'),
  I('The ___ shows the days and the months.', 'calendar', [['calender', 'M7_MS_SOUND_SPELL'], ['calandar', 'M7_MS_SOUND_SPELL'], ['calander', 'M7_MS_SOUND_SPELL']], 'Calendar ends in -dar.'),
];
// ---------------------------------------------------------------- the writing process
const WP = [
  I('What do you do first when you write a composition.', 'plan it', [['edit it', 'M7_WP_EDIT_FIRST'], ['publish it', 'M7_WP_PUBLISH_FIRST'], ['revise it', 'M7_WP_EDIT_FIRST']], 'Planning comes first, because you need ideas before you can write.'),
  I('At which step do you check spelling and punctuation.', 'editing', [['revising', 'M7_WP_REVISE_EDIT'], ['planning', 'M7_WP_REVISE_EDIT'], ['drafting', 'M7_WP_REVISE_EDIT']], 'Editing corrects spelling, punctuation and grammar.'),
  I('At which step do you improve the ideas and the order of the sentences.', 'revising', [['editing', 'M7_WP_REVISE_EDIT'], ['publishing', 'M7_WP_PUBLISH_FIRST'], ['planning', 'M7_WP_REVISE_EDIT']], 'Revising improves the ideas, the order and the words.'),
  I('What is a first draft.', 'a first try that will be improved', [['the final clean copy', 'M7_WP_DRAFT_FINAL'], ['a plan of ideas', 'M7_WP_DRAFT_FINAL'], ['a list of mistakes', 'M7_WP_DRAFT_FINAL']], 'A first draft is a rough first version, written to get the ideas down.'),
  I('Which step comes last in the writing process.', 'publishing', [['planning', 'M7_WP_PUBLISH_FIRST'], ['drafting', 'M7_WP_PUBLISH_FIRST'], ['revising', 'M7_WP_PUBLISH_FIRST']], 'Publishing, sharing the finished piece, comes last.'),
  I('At which step do you write your ideas as sentences for the first time.', 'drafting', [['planning', 'M7_WP_EDIT_FIRST'], ['editing', 'M7_WP_EDIT_FIRST'], ['publishing', 'M7_WP_PUBLISH_FIRST']], 'Drafting is writing the first version in sentences.'),
  I('At which step do you list ideas and decide their order before you write.', 'planning', [['drafting', 'M7_WP_EDIT_FIRST'], ['revising', 'M7_WP_EDIT_FIRST'], ['publishing', 'M7_WP_PUBLISH_FIRST']], 'Planning means listing ideas and choosing an order before writing.'),
];
const WP_ORDER = [
  ['Plan the ideas.', 'Write a first draft.', 'Revise the draft.', 'Edit and copy it neatly.'],
  ['Choose a topic and list ideas.', 'Write the ideas as sentences.', 'Change ideas and words to improve them.', 'Correct the spelling and punctuation.'],
  ['Think about who will read it.', 'Write the first version.', 'Read it again and improve the ideas.', 'Check the spelling and share it.'],
];
// ---------------------------------------------------------------- narrative features
const NF = [
  I('What is the setting of a story.', 'the time and place where it happens', [['the people in the story', 'M7_NF_SETTING_CHARACTER'], ['what goes wrong', 'M7_NF_SETTING_CHARACTER'], ['the lesson of the story', 'M7_NF_SETTING_CHARACTER']], 'The setting is when and where the story happens.'),
  I('Who are the characters of a story.', 'the people or animals in it', [['the place where it happens', 'M7_NF_SETTING_CHARACTER'], ['the events in order', 'M7_NF_SETTING_CHARACTER'], ['the title', 'M7_NF_SETTING_CHARACTER']], 'Characters are the people or animals that act in the story.'),
  I('Which feature of a narrative tells what goes wrong.', 'the problem or conflict', [['the title', 'M7_NF_MISSING_PART'], ['the setting', 'M7_NF_MISSING_PART'], ['the characters', 'M7_NF_MISSING_PART']], 'The problem or conflict is what goes wrong and has to be solved.'),
  I('Which part of a narrative tells how the problem is solved.', 'the ending', [['the title', 'M7_NF_MISSING_PART'], ['the setting', 'M7_NF_MISSING_PART'], ['the opening', 'M7_NF_MISSING_PART']], 'The ending tells how the problem is solved and how the story closes.'),
  I('A story has a setting and a problem but no characters. What is missing.', 'people or animals to act', [['a title only', 'M7_NF_MISSING_PART'], ['a picture', 'M7_NF_MISSING_PART'], ['a date', 'M7_NF_MISSING_PART']], 'A story needs characters who act and speak.'),
  I('Which tense is a story about things that happened usually told in.', 'the past tense', [['the present tense', 'M7_NF_PERSON'], ['the future tense', 'M7_NF_PERSON'], ['the command form', 'M7_NF_PERSON']], 'A narrative of past events is told in the past tense.'),
  I('Which opening is a narrative told in the past.', 'I walked to the river early in the morning.', [['I am walking to the river.', 'M7_NF_PERSON'], ['I will walk to the river.', 'M7_NF_PERSON'], ['Walk to the river.', 'M7_NF_PERSON']], 'A story about what happened is told in the past tense.'),
];
const NF_KIND = [
  I('Which text is a narrative.', 'On Saturday Achieng lost her purse in the market and had to find it.', [['The market is wide, noisy and full of colour.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Dear Achieng, I hope you are well.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['NOTICE: The market will close at five.', 'M7_NF_NARRATIVE_DESCRIPTION']], 'A narrative tells what happened to people, with events one after another.'),
  I('Which text is a narrative.', 'Juma woke late, missed the bus and ran all the way to school.', [['The classroom has a green door and twenty desks.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Please bring a pen and a ruler on Monday.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Dear Juma, thank you for the book.', 'M7_NF_NARRATIVE_DESCRIPTION']], 'It tells a series of events that happened to Juma.'),
  I('Which text is a narrative.', 'When the rains failed, the old farmer walked to the river and found a spring.', [['Rain is water that falls from the clouds.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Dear Uncle, thank you for the gift.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['The river is wide and brown.', 'M7_NF_NARRATIVE_DESCRIPTION']], 'It tells what the farmer did and found.'),
  I('Which text is a narrative.', 'Baraka was afraid of the dark, but one night he saved his little sister from a fire.', [['Fire is hot and bright.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Fire safety: keep matches away from children.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['The kitchen is small and smoky.', 'M7_NF_NARRATIVE_DESCRIPTION']], 'It tells a problem and what a character did about it.'),
  I('Which text is a narrative.', 'The hare tricked the lion and escaped across the river.', [['The river is wide and brown.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Visit the river on Sunday at ten.', 'M7_NF_NARRATIVE_DESCRIPTION'], ['Rivers flow into the sea.', 'M7_NF_NARRATIVE_DESCRIPTION']], 'It tells what the hare did and what happened.'),
];
// ---------------------------------------------------------------- packing and shopping lists
const LG_HEAD = [
  I('Which item belongs under "Food" in a packing list for a school trip.', 'bread', w('M7_LG_WRONG_GROUP', 'torch', 'jacket', 'rope'), 'Bread is food, so it goes under Food.'),
  I('Which item belongs under "Clothes" in a packing list for a school trip.', 'jacket', w('M7_LG_WRONG_GROUP', 'bread', 'soap', 'notebook'), 'A jacket is something to wear, so it goes under Clothes.'),
  I('Which item belongs under "Tools" in a packing list for a farm visit.', 'panga', w('M7_LG_WRONG_GROUP', 'milk', 'socks', 'pencil'), 'A panga is a tool, so it goes under Tools.'),
  I('Which item belongs under "Stationery" in a school list.', 'ruler', w('M7_LG_WRONG_GROUP', 'soap', 'bread', 'shoes'), 'A ruler is stationery.'),
  I('Which item belongs under "Washing things" in a packing list.', 'soap', w('M7_LG_WRONG_GROUP', 'pencil', 'rice', 'torch'), 'Soap is used for washing.'),
  I('Which item belongs under "Bedding" in a packing list for a camp.', 'blanket', w('M7_LG_WRONG_GROUP', 'sugar', 'ruler', 'spade'), 'A blanket is used for sleeping.'),
];
const LG_ODD = [
  I('Which item does not belong with the others: pen, ruler, pencil, soap.', 'soap', w('M7_LG_ODD_ITEM', 'pen', 'ruler', 'pencil'), 'Pen, ruler and pencil are stationery. Soap is for washing.'),
  I('Which item does not belong with the others: bread, milk, rice, jacket.', 'jacket', w('M7_LG_ODD_ITEM', 'bread', 'milk', 'rice'), 'Bread, milk and rice are food. A jacket is clothing.'),
  I('Which item does not belong with the others: shirt, trousers, socks, sugar.', 'sugar', w('M7_LG_ODD_ITEM', 'shirt', 'trousers', 'socks'), 'Shirt, trousers and socks are clothes. Sugar is food.'),
  I('Which item does not belong with the others: hammer, panga, spade, shirt.', 'shirt', w('M7_LG_ODD_ITEM', 'hammer', 'panga', 'spade'), 'Hammer, panga and spade are tools. A shirt is clothing.'),
  I('Which item does not belong with the others: torch, matches, batteries, bread.', 'bread', w('M7_LG_ODD_ITEM', 'torch', 'matches', 'batteries'), 'Torch, matches and batteries are for light. Bread is food.'),
  I('Which item does not belong with the others: tomatoes, onions, kale, blanket.', 'blanket', w('M7_LG_ODD_ITEM', 'tomatoes', 'onions', 'kale'), 'Tomatoes, onions and kale are vegetables. A blanket is bedding.'),
];
const LG_EVENT = [
  I('Which list fits a day at the beach.', 'swimming costume, towel, sunscreen', [['school bag, books, ruler', 'M7_LG_EVENT_FIT'], ['gumboots, spade, seeds', 'M7_LG_EVENT_FIT'], ['hammer, nails, saw', 'M7_LG_EVENT_FIT']], 'A day at the beach needs things for swimming and the sun.'),
  I('Which list fits a day of planting trees.', 'spade, seedlings, watering can', [['swimming costume, towel, sunscreen', 'M7_LG_EVENT_FIT'], ['school bag, books, ruler', 'M7_LG_EVENT_FIT'], ['plates, cups, spoons', 'M7_LG_EVENT_FIT']], 'Planting trees needs a spade, seedlings and water.'),
  I('Which list fits a school party.', 'plates, cups, juice, balloons', [['spade, seedlings, gumboots', 'M7_LG_EVENT_FIT'], ['hammer, nails, saw', 'M7_LG_EVENT_FIT'], ['ruler, protractor, compass', 'M7_LG_EVENT_FIT']], 'A party needs things for eating, drinking and decoration.'),
  I('Which list fits a Maths lesson.', 'ruler, protractor, compass', [['plates, cups, juice', 'M7_LG_EVENT_FIT'], ['spade, seedlings, gumboots', 'M7_LG_EVENT_FIT'], ['swimming costume, towel', 'M7_LG_EVENT_FIT']], 'A Maths lesson needs instruments for drawing and measuring.'),
  I('Which shopping list entry is the most useful.', '2 kg of sugar', [['sugar', 'M7_LG_QUANTITY'], ['something sweet', 'M7_LG_QUANTITY'], ['sugar maybe', 'M7_LG_QUANTITY']], 'A shopping list says what to buy and how much.'),
];
// ---------------------------------------------------------------- synonyms and antonyms
const SYN = [
  I('A word that means the same as "start" is ___.', 'begin|commence', [['finish', 'M7_SY_ANT_SYN'], ['stop', 'M7_SY_ANT_SYN'], ['continue', 'M7_SY_RELATED_NOT_SAME']], 'Begin has the same meaning as start.'),
  I('A word that means the same as "clever" is ___.', 'intelligent|smart|bright', [['stupid', 'M7_SY_ANT_SYN'], ['lazy', 'M7_SY_RELATED_NOT_SAME'], ['quick', 'M7_SY_RELATED_NOT_SAME']], 'Intelligent has the same meaning as clever.'),
  I('A word that means the same as "huge" is ___.', 'enormous|giant|vast', [['tiny', 'M7_SY_ANT_SYN'], ['heavy', 'M7_SY_RELATED_NOT_SAME'], ['tall', 'M7_SY_RELATED_NOT_SAME']], 'Enormous has the same meaning as huge.'),
  I('The opposite of "ancient" is ___.', 'modern', [['old', 'M7_SY_ANT_SYN'], ['antique', 'M7_SY_ANT_SYN'], ['dusty', 'M7_SY_RELATED_NOT_SAME']], 'Ancient means very old. Its opposite is modern.'),
  I('The opposite of "generous" is ___.', 'selfish|mean|stingy', [['kind', 'M7_SY_ANT_SYN'], ['rich', 'M7_SY_RELATED_NOT_SAME'], ['honest', 'M7_SY_RELATED_NOT_SAME']], 'A generous person gives freely. The opposite is selfish.'),
  I('The opposite of "difficult" is ___.', 'easy|simple', [['hard', 'M7_SY_ANT_SYN'], ['tough', 'M7_SY_ANT_SYN'], ['long', 'M7_SY_RELATED_NOT_SAME']], 'Difficult and hard mean the same. The opposite is easy.'),
  I('A word that means the same as "quick" is ___.', 'fast|swift|rapid', [['slow', 'M7_SY_ANT_SYN'], ['quiet', 'M7_SY_RELATED_NOT_SAME'], ['late', 'M7_SY_RELATED_NOT_SAME']], 'Fast has the same meaning as quick.'),
  I('A word that means the same as "bright" in "She is a bright pupil" is ___.', 'clever|intelligent|smart', [['shiny', 'M7_SY_CONTEXT'], ['light', 'M7_SY_CONTEXT'], ['dull', 'M7_SY_ANT_SYN']], 'Here bright means clever. Shiny is a meaning of bright, but not in this sentence.'),
];
const SYN_PREFIX = [
  I('The opposite of "honest" is ___.', 'dishonest', w('M7_SY_PREFIX_ANT', 'unhonest', 'inhonest', 'nonhonest'), 'The opposite of honest is dishonest. We do not add un- to every word.'),
  I('The opposite of "polite" is ___.', 'rude|impolite', w('M7_SY_PREFIX_ANT', 'unpolite', 'dispolite', 'mispolite'), 'The opposite of polite is rude or impolite.'),
  I('The opposite of "careful" is ___.', 'careless', w('M7_SY_PREFIX_ANT', 'uncareful', 'discareful', 'nocareful'), 'The opposite of careful is careless.'),
  I('The opposite of "possible" is ___.', 'impossible', w('M7_SY_PREFIX_ANT', 'unpossible', 'dispossible', 'nonpossible'), 'The opposite of possible is impossible.'),
  I('The opposite of "kind" is ___.', 'unkind|cruel', w('M7_SY_PREFIX_ANT', 'dikind', 'inkind', 'nonkind'), 'The opposite of kind is unkind or cruel.'),
];
const SYN_KIND = [
  I('Are "big" and "huge" synonyms or antonyms.', 'synonyms', [['antonyms', 'M7_SY_ANT_SYN'], ['the same word', 'M7_SY_RELATED_NOT_SAME'], ['neither', 'M7_SY_RELATED_NOT_SAME']], 'Big and huge have almost the same meaning, so they are synonyms.'),
  I('Are "hot" and "cold" synonyms or antonyms.', 'antonyms', [['synonyms', 'M7_SY_ANT_SYN'], ['the same word', 'M7_SY_RELATED_NOT_SAME'], ['neither', 'M7_SY_RELATED_NOT_SAME']], 'Hot and cold have opposite meanings, so they are antonyms.'),
  I('Are "brave" and "cowardly" synonyms or antonyms.', 'antonyms', [['synonyms', 'M7_SY_ANT_SYN'], ['the same word', 'M7_SY_RELATED_NOT_SAME'], ['neither', 'M7_SY_RELATED_NOT_SAME']], 'Brave and cowardly have opposite meanings.'),
  I('Are "begin" and "start" synonyms or antonyms.', 'synonyms', [['antonyms', 'M7_SY_ANT_SYN'], ['the same word', 'M7_SY_RELATED_NOT_SAME'], ['neither', 'M7_SY_RELATED_NOT_SAME']], 'Begin and start mean the same.'),
  I('Are "silent" and "quiet" synonyms or antonyms.', 'synonyms', [['antonyms', 'M7_SY_ANT_SYN'], ['the same word', 'M7_SY_RELATED_NOT_SAME'], ['neither', 'M7_SY_RELATED_NOT_SAME']], 'Silent and quiet have almost the same meaning.'),
  I('Are "rich" and "poor" synonyms or antonyms.', 'antonyms', [['synonyms', 'M7_SY_ANT_SYN'], ['the same word', 'M7_SY_RELATED_NOT_SAME'], ['neither', 'M7_SY_RELATED_NOT_SAME']], 'Rich and poor have opposite meanings.'),
];
// ---------------------------------------------------------------- numbers in words
const NW = [
  I('Write 40 in words: ___.', 'forty', w('M7_NW_FORTY', 'fourty', 'forthy', 'fortty'), 'Forty has no u, although four and fourteen have.'),
  I('Write 14 in words: ___.', 'fourteen', w('M7_NW_FORTY', 'forteen', 'fourten', 'fourtene'), 'Fourteen is four + teen, and it has a u.'),
  I('Write 90 in words: ___.', 'ninety', w('M7_NW_SPELL_NUMBER', 'ninty', 'nintey', 'ninetty'), 'Ninety is nine + ty, and the e stays.'),
  I('Our sports day is on the 22___ of May. (the ending)', 'nd', w('M7_NW_ORDINAL', 'th', 'st', 'rd'), 'Ordinals ending in 2 take nd: 22nd.'),
  I('Write 45 in words: ___.', 'forty-five', [['forty five', 'M7_NW_HYPHEN'], ['fourty-five', 'M7_NW_FORTY'], ['fortyfive', 'M7_NW_HYPHEN']], 'Numbers from 21 to 99 are written with a hyphen: forty-five.'),
  I('Wanjiru finished in ___ place. (8th)', 'eighth', w('M7_NW_EIGHTH', 'eigth', 'eightth', 'eight'), 'Eighth is eight + th, with one t joined.'),
  I('Write 21st in words: ___.', 'twenty-first', [['twenty first', 'M7_NW_HYPHEN'], ['twentyfirst', 'M7_NW_HYPHEN'], ['twenty-oneth', 'M7_NW_ORDINAL']], 'The ordinal of 21 is twenty-first, with a hyphen.'),
  I('My sister is in her ___ year at school. (9th)', 'ninth', w('M7_NW_EIGHTH', 'nineth', 'ninnth', 'nine'), 'Ninth has no e: nine loses its e.'),
];
const NW_SENT = [
  I('', 'Forty learners came to the meeting.', [['40 learners came to the meeting.', 'M7_NW_START_FIGURE'], ['Fourty learners came to the meeting.', 'M7_NW_FORTY']], 'A sentence must not begin with a figure, and forty has no u.'),
  I('', 'Thirty-two children sat the test.', [['32 children sat the test.', 'M7_NW_START_FIGURE'], ['Thirty two children sat the test.', 'M7_NW_HYPHEN']], 'Begin with the number in words, and use a hyphen in thirty-two.'),
  I('', 'Ninety pupils took part in the race.', [['90 pupils took part in the race.', 'M7_NW_START_FIGURE'], ['Ninty pupils took part in the race.', 'M7_NW_SPELL_NUMBER']], 'Write the number in words at the start of a sentence: ninety.'),
  I('', 'Fourteen goats grazed near the river.', [['14 goats grazed near the river.', 'M7_NW_START_FIGURE'], ['Forteen goats grazed near the river.', 'M7_NW_FORTY']], 'Write the number in words at the start of a sentence: fourteen.'),
  I('', 'She came 3rd in the race.', [['She came 3th in the race.', 'M7_NW_ORDINAL'], ['She came 3d in the race.', 'M7_NW_ORDINAL']], 'The ordinal of 3 is 3rd.'),
  I('', 'Our school was built on the 21st of June.', [['Our school was built on the 21th of June.', 'M7_NW_ORDINAL'], ['Our school was built on the 21nd of June.', 'M7_NW_ORDINAL']], 'The ordinal of 21 is 21st.'),
];
// ---------------------------------------------------------------- dialogue format
const DF = [
  I('Which is the correct way to start a play-style dialogue between Atieno and Juma.', 'Atieno: Good morning, Juma.', [['"Atieno: Good morning, Juma."', 'M7_DF_QUOTES_EVERY_LINE'], ['Atieno Good morning, Juma.', 'M7_DF_NO_NAME'], ['Good morning, Juma. Atieno', 'M7_DF_NO_NAME']], 'Each line begins with the name and a colon. No quotation marks are used round the whole line.'),
  I('How should each speaker\'s turn be written in a dialogue.', 'on a new line', [['on the same line as the last speaker', 'M7_DF_SAME_LINE'], ['in one long paragraph', 'M7_DF_SAME_LINE'], ['at the end of the page', 'M7_DF_SAME_LINE']], 'Each turn starts on a new line so that the reader can see who speaks.'),
  I('How are actions such as smiling shown in a play-style dialogue.', 'in brackets after the speaker\'s name', [['in quotation marks', 'M7_DF_ACTIONS'], ['in capital letters', 'M7_DF_ACTIONS'], ['after a comma only', 'M7_DF_ACTIONS']], 'Actions are put in brackets so they are not read as spoken words.'),
  I('What does each line of a play-style dialogue begin with.', 'the speaker\'s name and a colon', [['the words spoken', 'M7_DF_NO_NAME'], ['a quotation mark', 'M7_DF_QUOTES_EVERY_LINE'], ['a number', 'M7_DF_NO_NAME']], 'The name and a colon tell the reader who is speaking.'),
  I('Which statement about a play-style dialogue is true.', 'The speaker\'s name and a colon begin each line.', [['Every line is put in quotation marks.', 'M7_DF_QUOTES_EVERY_LINE'], ['Several speakers share one line.', 'M7_DF_SAME_LINE'], ['The speaker\'s name is never written.', 'M7_DF_NO_NAME']], 'A script shows the speaker\'s name and a colon, with each turn on a new line.'),
];
const DF_LINE = [
  I('Which line is written correctly.', 'Mama (smiling): Welcome home, my child.', [['"Mama (smiling): Welcome home, my child."', 'M7_DF_QUOTES_EVERY_LINE'], ['Mama - smiling - Welcome home, my child.', 'M7_DF_ACTIONS'], ['Welcome home, my child. Mama (smiling)', 'M7_DF_NO_NAME']], 'The name comes first, then the action in brackets, a colon and the words.'),
  I('Which line is written correctly.', 'Atieno (surprised): Is it really you?', [['"Atieno (surprised): Is it really you?"', 'M7_DF_QUOTES_EVERY_LINE'], ['Atieno surprised is it really you', 'M7_DF_ACTIONS'], ['Is it really you? Atieno (surprised)', 'M7_DF_NO_NAME']], 'The name and the action come before the words spoken.'),
  I('Which line is written correctly.', 'Teacher: Please open your books.', [['"Teacher: Please open your books."', 'M7_DF_QUOTES_EVERY_LINE'], ['Please open your books. Teacher', 'M7_DF_NO_NAME'], ['Teacher Please open your books.', 'M7_DF_NO_NAME']], 'The speaker\'s name and a colon begin the line.'),
  I('Which line is written correctly.', 'Juma (laughing): That was funny!', [['"Juma (laughing): That was funny!"', 'M7_DF_QUOTES_EVERY_LINE'], ['Juma - laughing - That was funny!', 'M7_DF_ACTIONS'], ['That was funny! Juma (laughing)', 'M7_DF_NO_NAME']], 'The action goes in brackets after the name.'),
  I('Which line is written correctly.', 'Doctor: How do you feel today?', [['"Doctor: How do you feel today?"', 'M7_DF_QUOTES_EVERY_LINE'], ['How do you feel today? Doctor', 'M7_DF_NO_NAME'], ['Doctor How do you feel today?', 'M7_DF_NO_NAME']], 'The speaker\'s name and a colon begin the line.'),
];
// ---------------------------------------------------------------- idioms
const ID_MEAN = [
  I('What does "it is raining cats and dogs" mean.', 'it is raining very hard', [['animals are falling from the sky', 'M7_ID_LITERAL'], ['it is not raining', 'M7_ID_WRONG_MEANING'], ['it is raining a little', 'M7_ID_WRONG_MEANING']], 'The idiom means heavy rain.'),
  I('What does "spill the beans" mean.', 'to tell a secret', [['to cook a meal', 'M7_ID_WRONG_MEANING'], ['to drop food', 'M7_ID_LITERAL'], ['to waste food', 'M7_ID_WRONG_MEANING']], 'Spill the beans means to tell a secret.'),
  I('What does "a piece of cake" mean.', 'something very easy', [['a slice of birthday cake', 'M7_ID_LITERAL'], ['something sweet', 'M7_ID_WRONG_MEANING'], ['a gift', 'M7_ID_WRONG_MEANING']], 'A piece of cake means something that is very easy to do.'),
  I('What does "hit the nail on the head" mean.', 'to say exactly the right thing', [['to hurt a nail', 'M7_ID_LITERAL'], ['to be angry', 'M7_ID_WRONG_MEANING'], ['to build a house', 'M7_ID_WRONG_MEANING']], 'Hit the nail on the head means to be exactly right.'),
  I('What does "under the weather" mean.', 'feeling a little ill', [['standing in the rain', 'M7_ID_LITERAL'], ['very happy', 'M7_ID_WRONG_MEANING'], ['lost', 'M7_ID_WRONG_MEANING']], 'Under the weather means feeling a little ill.'),
  I('What does "once in a blue moon" mean.', 'very rarely', [['every month', 'M7_ID_WRONG_MEANING'], ['at night', 'M7_ID_WRONG_MEANING'], ['when the moon is blue', 'M7_ID_LITERAL']], 'Once in a blue moon means very rarely.'),
  I('What does "break the ice" mean.', 'to start a friendly conversation', [['to smash frozen water', 'M7_ID_LITERAL'], ['to make someone cold', 'M7_ID_WRONG_MEANING'], ['to end a meeting', 'M7_ID_WRONG_MEANING']], 'Break the ice means to make people feel at ease at the start.'),
  I('What does "keep your fingers crossed" mean.', 'to hope for good luck', [['to hold your fingers in a cross', 'M7_ID_LITERAL'], ['to be angry', 'M7_ID_WRONG_MEANING'], ['to cross the road', 'M7_ID_WRONG_MEANING']], 'Keep your fingers crossed means to hope for good luck.'),
];
const ID_SIT = [
  I('Wanjiru said exactly what the problem was. She hit the ___ on the head.', 'nail', [['ball', 'M7_ID_CHANGED_WORD'], ['door', 'M7_ID_CHANGED_WORD'], ['table', 'M7_ID_CHANGED_WORD']], 'The idiom is hit the nail on the head.'),
  I('The test was very easy. It was a piece of ___.', 'cake', [['pie', 'M7_ID_CHANGED_WORD'], ['bread', 'M7_ID_CHANGED_WORD'], ['sugar', 'M7_ID_CHANGED_WORD']], 'The idiom is a piece of cake.'),
  I('Do not tell her about the party. Do not spill the ___.', 'beans', [['rice', 'M7_ID_CHANGED_WORD'], ['maize', 'M7_ID_CHANGED_WORD'], ['milk', 'M7_ID_CHANGED_WORD']], 'The idiom is spill the beans.'),
  I('It is raining ___ and dogs.', 'cats', [['rabbits', 'M7_ID_CHANGED_WORD'], ['goats', 'M7_ID_CHANGED_WORD'], ['birds', 'M7_ID_CHANGED_WORD']], 'The idiom is raining cats and dogs.'),
  I('He felt a little ill, so he stayed home. He was under the ___.', 'weather', [['rain', 'M7_ID_CHANGED_WORD'], ['sun', 'M7_ID_CHANGED_WORD'], ['clouds', 'M7_ID_CHANGED_WORD']], 'The idiom is under the weather.'),
  I('We only see my uncle once in a blue ___.', 'moon', [['sun', 'M7_ID_CHANGED_WORD'], ['star', 'M7_ID_CHANGED_WORD'], ['sky', 'M7_ID_CHANGED_WORD']], 'The idiom is once in a blue moon.'),
  I('Let us play a game to break the ___ at the party.', 'ice', [['wall', 'M7_ID_CHANGED_WORD'], ['glass', 'M7_ID_CHANGED_WORD'], ['rule', 'M7_ID_CHANGED_WORD']], 'The idiom is break the ice.'),
  I('Good luck in the race! I am keeping my fingers ___.', 'crossed', [['folded', 'M7_ID_CHANGED_WORD'], ['closed', 'M7_ID_CHANGED_WORD'], ['tied', 'M7_ID_CHANGED_WORD']], 'The idiom is keep your fingers crossed.'),
];
// ---------------------------------------------------------------- descriptive writing
const DW_KIND = [
  I('Which text is descriptive writing.', 'The lake was calm and silver, and the air smelled of wet grass.', [['We walked to the lake and then swam.', 'M7_DW_NARRATIVE_DESC'], ['The lake is twenty kilometres long.', 'M7_DW_FACTS_ONLY'], ['Please do not swim in the lake.', 'M7_DW_FACTS_ONLY']], 'It shows how the lake looks and smells. It uses the senses.'),
  I('Which text is descriptive writing.', 'The market buzzed with colour: red tomatoes, green kale and the loud voices of sellers.', [['We went to the market and bought kale.', 'M7_DW_NARRATIVE_DESC'], ['The market opens at six o\'clock.', 'M7_DW_FACTS_ONLY'], ['Markets are held every week.', 'M7_DW_FACTS_ONLY']], 'It paints a picture of what you see and hear in the market.'),
  I('Which text is descriptive writing.', 'Our classroom is bright and noisy, with a green door and rows of scratched wooden desks.', [['Our teacher came in and we stood up.', 'M7_DW_NARRATIVE_DESC'], ['There are forty desks in the room.', 'M7_DW_FACTS_ONLY'], ['The class starts at eight.', 'M7_DW_FACTS_ONLY']], 'It describes what the classroom looks and sounds like.'),
  I('Which text is descriptive writing.', 'My grandmother has silver hair, kind eyes and a voice as warm as tea.', [['My grandmother cooked and then we ate.', 'M7_DW_NARRATIVE_DESC'], ['My grandmother is seventy years old.', 'M7_DW_FACTS_ONLY'], ['Grandmothers live in villages.', 'M7_DW_FACTS_ONLY']], 'It describes how the grandmother looks and sounds.'),
  I('Which text is descriptive writing.', 'Dark clouds hung low over the hills, and the first cold drops tapped on the roof.', [['The rain started and we ran inside.', 'M7_DW_NARRATIVE_DESC'], ['It rains in April and May.', 'M7_DW_FACTS_ONLY'], ['Take an umbrella to school.', 'M7_DW_FACTS_ONLY']], 'It shows the scene with sights and sounds.'),
];
const DW_BEST = [
  I('Which sentence has the best detail.', 'The ugali was hot and soft, with a smoky smell.', [['The food was nice.', 'M7_DW_VAGUE_WORDS'], ['We ate food.', 'M7_DW_VAGUE_WORDS'], ['Food is important.', 'M7_DW_FACTS_ONLY']], 'It uses exact words for the taste, feel and smell.'),
  I('Which sentence has the best detail.', 'The old woman had a bent back and a warm, rough voice.', [['She was a nice person.', 'M7_DW_VAGUE_WORDS'], ['She was old.', 'M7_DW_VAGUE_WORDS'], ['Old women live in villages.', 'M7_DW_FACTS_ONLY']], 'It shows exactly how she looked and sounded.'),
  I('Which sentence has the best detail.', 'Dark clouds rolled over the hills and thunder rumbled like drums.', [['The weather was bad.', 'M7_DW_VAGUE_WORDS'], ['There was a storm.', 'M7_DW_VAGUE_WORDS'], ['Storms happen in April.', 'M7_DW_FACTS_ONLY']], 'It uses sights and sounds to show the storm.'),
  I('Which sentence has the best detail.', 'The market bursts with the smell of fresh bread and the shouts of sellers.', [['The market is big and nice.', 'M7_DW_VAGUE_WORDS'], ['The market opens at six.', 'M7_DW_FACTS_ONLY'], ['It is a good place.', 'M7_DW_VAGUE_WORDS']], 'It uses smell and sound to show the market.'),
  I('Which sentence has the best detail.', 'Her new red dress swished softly as she danced.', [['Her dress was good.', 'M7_DW_VAGUE_WORDS'], ['She wore a dress.', 'M7_DW_VAGUE_WORDS'], ['Dresses are made of cloth.', 'M7_DW_FACTS_ONLY']], 'It uses colour and sound to show the dress.'),
];
const DW_ORDER = [
  I('Which order describes a tree clearly from the ground upwards.', 'roots, trunk, branches, leaves', [['leaves, roots, branches, trunk', 'M7_DW_ORDER'], ['branches, roots, leaves, trunk', 'M7_DW_ORDER'], ['trunk, leaves, roots, branches', 'M7_DW_ORDER']], 'From the ground upwards: roots, trunk, branches and then leaves.'),
  I('Which order describes a person clearly from head to toe.', 'hair, face, shirt, shoes', [['shoes, hair, shirt, face', 'M7_DW_ORDER'], ['shirt, shoes, hair, face', 'M7_DW_ORDER'], ['face, shoes, hair, shirt', 'M7_DW_ORDER']], 'From head to toe: hair, face, shirt and then shoes.'),
  I('Which order describes a house clearly as you walk in from the road.', 'gate, garden, front door, kitchen', [['kitchen, gate, front door, garden', 'M7_DW_ORDER'], ['front door, kitchen, gate, garden', 'M7_DW_ORDER'], ['garden, kitchen, gate, front door', 'M7_DW_ORDER']], 'In walking order: gate, garden, front door and then the kitchen.'),
  I('Which order describes a day clearly in time order.', 'dawn, midday, afternoon, night', [['night, dawn, afternoon, midday', 'M7_DW_ORDER'], ['midday, night, dawn, afternoon', 'M7_DW_ORDER'], ['afternoon, dawn, night, midday', 'M7_DW_ORDER']], 'In time order: dawn, midday, afternoon and then night.'),
  I('Which order describes a mountain clearly from the bottom to the top.', 'foot, slopes, forest, peak', [['peak, foot, forest, slopes', 'M7_DW_ORDER'], ['slopes, peak, foot, forest', 'M7_DW_ORDER'], ['forest, peak, slopes, foot', 'M7_DW_ORDER']], 'From the bottom to the top: foot, slopes, forest and then the peak.'),
];
// ---------------------------------------------------------------- notices and posters
const NO_PART = [
  I('Which parts does a notice need.', 'a heading, what, when and where, who to see, and the writer\'s name and date', [['a greeting, a closing and a signature only', 'M7_NO_NOTICE_POSTER'], ['a big picture and a slogan only', 'M7_NO_NOTICE_POSTER'], ['a long story about the event', 'M7_NO_POSTER_LONG']], 'A notice gives the key facts briefly: heading, what, when, where, who to see, and who wrote it.'),
  I('Who signs a school notice.', 'the person who wrote it, with the date', [['nobody', 'M7_NO_SIGNED'], ['every learner in the school', 'M7_NO_SIGNED'], ['the person who will read it', 'M7_NO_SIGNED']], 'A reader must know who wrote the notice and when.'),
  I('Which is best for a poster.', 'a big heading and a few short lines', [['a long paragraph with every detail', 'M7_NO_POSTER_LONG'], ['small writing with no picture', 'M7_NO_POSTER_LONG'], ['a story in five paragraphs', 'M7_NO_POSTER_LONG']], 'A poster must be read at a glance.'),
  I('Where does the heading of a notice go.', 'at the top, in capital letters', [['at the bottom, in small letters', 'M7_NO_MISSING_WHEN'], ['in the middle of a paragraph', 'M7_NO_MISSING_WHEN'], ['nowhere, a notice has no heading', 'M7_NO_MISSING_WHEN']], 'The heading goes at the top so the reader sees at once what the notice is about.'),
  I('Which line is the best heading for a notice about a clean-up on Saturday.', 'SCHOOL CLEAN-UP DAY', [['Dear Parents,', 'M7_NO_NOTICE_POSTER'], ['I hope you are well', 'M7_NO_NOTICE_POSTER'], ['Yours faithfully', 'M7_NO_NOTICE_POSTER']], 'A notice has a short heading that names the event, not a greeting.'),
];
const NO_MISSING = [
  I('This notice has a heading, the place and the writer. What is missing. "SPORTS DAY. At the school field. Games Master."', 'the date and time', [['a picture', 'M7_NO_NOTICE_POSTER'], ['a greeting', 'M7_NO_NOTICE_POSTER'], ['a closing like Yours faithfully', 'M7_NO_NOTICE_POSTER']], 'A notice must say when the event is.'),
  I('This notice has a heading, the date and the writer. What is missing. "LOST: A BLUE BAG. 3 March. Prefect."', 'where it was lost or who to see', [['a long story', 'M7_NO_POSTER_LONG'], ['a greeting', 'M7_NO_NOTICE_POSTER'], ['a picture', 'M7_NO_NOTICE_POSTER']], 'A notice about a lost bag must tell the reader where to report or who to see.'),
  I('This notice has what, where and when. What is missing. "SCIENCE FAIR. Hall. Friday, 2 pm."', 'the writer\'s name', [['a greeting', 'M7_NO_NOTICE_POSTER'], ['a closing', 'M7_NO_NOTICE_POSTER'], ['a long story', 'M7_NO_POSTER_LONG']], 'A notice ends with the name of the writer.'),
  I('This notice has a heading, the date and the place. What is missing. "TREE PLANTING. Saturday, 9 am. School gate."', 'who to see, and who wrote it', [['a closing', 'M7_NO_NOTICE_POSTER'], ['a greeting', 'M7_NO_NOTICE_POSTER'], ['a picture', 'M7_NO_NOTICE_POSTER']], 'A notice names who to see and who wrote it.'),
  I('This poster has a heading and a picture. What is missing. "HEALTHY EATING WEEK [picture of fruit]"', 'when and where it takes place', [['a long story', 'M7_NO_POSTER_LONG'], ['a greeting', 'M7_NO_NOTICE_POSTER'], ['a signature', 'M7_NO_NOTICE_POSTER']], 'A poster must still say when and where.'),
];
const NO_KIND = [
  I('Which one usually has a big picture and short, bold words to catch the eye.', 'a poster', [['a notice', 'M7_NO_NOTICE_POSTER'], ['a letter', 'M7_NO_NOTICE_POSTER'], ['a diary', 'M7_NO_NOTICE_POSTER']], 'A poster uses a picture and big letters to attract people.'),
  I('Which one gives the details briefly in words on a notice board, with the writer\'s name.', 'a notice', [['a poster', 'M7_NO_NOTICE_POSTER'], ['a story', 'M7_NO_NOTICE_POSTER'], ['a poem', 'M7_NO_NOTICE_POSTER']], 'A notice gives the key details briefly and names the writer.'),
  I('Which is more likely to be a poster.', 'BE A STAR: JOIN THE DRAMA CLUB! [picture of a mask]', [['NOTICE: Drama Club meets on Tuesday in Room 4. Mr Kamau.', 'M7_NO_NOTICE_POSTER'], ['Dear Mr Kamau, may I join the Drama Club?', 'M7_NO_NOTICE_POSTER'], ['I went to the Drama Club on Tuesday.', 'M7_NO_NOTICE_POSTER']], 'A poster has a catchy line and a picture.'),
  I('Which is more likely to be a notice.', 'NOTICE: Sports Day will be on Friday, 5 May, at the school field. Games Master.', [['BE A STAR: JOIN US! [picture of a trophy]', 'M7_NO_NOTICE_POSTER'], ['Dear Parents, I write to invite you.', 'M7_NO_NOTICE_POSTER'], ['Yesterday we practised for sports day.', 'M7_NO_NOTICE_POSTER']], 'A notice gives what, when and where briefly, with the writer\'s name.'),
];

// ---------------------------------------------------------------- handwriting
const HW_FEAT = [
  I('Which is a feature of neat handwriting.', 'letters of an even size that sit on the line', [['letters of different sizes', 'M7_HW_UNEVEN'], ['words with no spaces between them', 'M7_HW_CROWDED'], ['letters with loops and decorations', 'M7_HW_DECORATE']], 'Neat handwriting has letters of an even size that sit on the line.'),
  I('What should there be between words in neat handwriting.', 'a clear space', [['no space', 'M7_HW_CROWDED'], ['a long dash', 'M7_HW_CROWDED'], ['a big decoration', 'M7_HW_DECORATE']], 'A clear space shows where one word ends and the next begins.'),
  I('Which handwriting is easiest to read.', 'plain, even letters on the line', [['big letters that float above the line', 'M7_HW_UNEVEN'], ['letters with loops and decorations', 'M7_HW_DECORATE'], ['very small letters crowded together', 'M7_HW_CROWDED']], 'Plain, even letters on the line are easiest to read.'),
  I('Why does legible handwriting matter.', 'so that the reader can understand what you wrote', [['so that you can write faster', 'M7_HW_FAST'], ['so that the page looks full', 'M7_HW_CROWDED'], ['so that it looks like a picture', 'M7_HW_DECORATE']], 'The reader must be able to read what you wrote.'),
  I('Which habit helps handwriting stay neat.', 'sitting upright and holding the pen lightly', [['writing as quickly as possible', 'M7_HW_FAST'], ['pressing as hard as you can', 'M7_HW_FAST'], ['adding loops to every letter', 'M7_HW_DECORATE']], 'A good sitting position and a light, steady grip help neat writing.'),
  I('Which of these letters are tall letters.', 'b, d, h and l', [['a, c, e and o', 'M7_HW_UNEVEN'], ['m, n, r and u', 'M7_HW_UNEVEN'], ['s, v, w and z', 'M7_HW_UNEVEN']], 'The letters b, d, h and l are tall. The others are short.'),
];
const HW_FIND = [
  I('Peter\'s handwriting has letters of different sizes, no spaces between words and lines that slope. What should he work on first.', 'keep the letters even and leave spaces between words', [['write faster', 'M7_HW_FAST'], ['press harder', 'M7_HW_FAST'], ['use colourful ink', 'M7_HW_DECORATE']], 'Even letters and clear spaces make handwriting easy to read.'),
  I('Wanjiru writes with many loops and curls. Her teacher says it is hard to read. What should she do.', 'write plain, simple letters', [['add more curls', 'M7_HW_DECORATE'], ['write smaller', 'M7_HW_CROWDED'], ['write faster', 'M7_HW_FAST']], 'Plain letters are easiest to read.'),
  I('Otieno squeezes all his words together to save space. What should he do.', 'leave a clear space between words', [['write bigger letters only', 'M7_HW_UNEVEN'], ['write faster', 'M7_HW_FAST'], ['use more decorations', 'M7_HW_DECORATE']], 'A clear space between words helps the reader.'),
  I('Achieng\'s tall letters and short letters look the same size. What should she work on.', 'making tall letters taller than short letters', [['pressing harder', 'M7_HW_FAST'], ['writing faster', 'M7_HW_FAST'], ['adding loops', 'M7_HW_DECORATE']], 'Tall letters (b, d, h, l) should be taller than short letters.'),
];
// ---------------------------------------------------------------- assessing a narrative
const AN_PART = [
  I('Which part of a narrative do you check to see that it sets the scene.', 'the introduction', w('M7_AN_PART_MIX', 'the body', 'the conclusion', 'the title only'), 'The introduction tells who, where and when.'),
  I('Which part of a narrative do you check to see that the events are in order.', 'the body', w('M7_AN_PART_MIX', 'the introduction', 'the conclusion', 'the title only'), 'The body tells the events one after another.'),
  I('Which part of a narrative do you check to see that the problem is solved and the story is closed.', 'the conclusion', w('M7_AN_PART_MIX', 'the introduction', 'the body', 'the title only'), 'The conclusion ends the story.'),
  I('What is the first step when you assess your own composition.', 'read it again slowly', [['count the words only', 'M7_AN_SPELLING_ONLY'], ['hand it in at once', 'M7_AN_SKIP_READ'], ['copy it out again', 'M7_AN_SKIP_READ']], 'Assessing starts by reading your work again with care.'),
  I('Which question helps you to assess the introduction.', 'Does it tell who, where and when?', w('M7_AN_PART_MIX', 'Is the writing long?', 'Does it have a picture?', 'Does it end the story?'), 'The introduction should set the scene.'),
  I('Which question helps you to assess the conclusion.', 'Does it end the story in a way that fits the events?', w('M7_AN_PART_MIX', 'Does it start a new story?', 'Does it repeat the title?', 'Is it only one word?'), 'The conclusion should close the story in a way that fits.'),
];
const AN_FIND = [
  I('A narrative begins: "Then he ran away." It does not say who he is, or where or when. Which part needs work.', 'the introduction', w('M7_AN_PART_MIX', 'the conclusion', 'the title', 'the spelling only'), 'The introduction must say who, where and when.'),
  I('A narrative has a good beginning, but it stops suddenly in the middle of the action. Which part needs work.', 'the conclusion', w('M7_AN_PART_MIX', 'the introduction', 'the title', 'the handwriting only'), 'The conclusion must close the story.'),
  I('A narrative has a clear start and end, but the events jump from one time to another. Which part needs work.', 'the body', w('M7_AN_PART_MIX', 'the introduction', 'the conclusion', 'the title'), 'The body must tell the events in order.'),
  I('A learner reads her narrative again and finds that she wrote "He go to school" in the body. What kind of check found it.', 'checking the language and spelling', w('M7_AN_SPELLING_ONLY', 'checking the title', 'checking the picture', 'handing it in'), 'Rereading to check grammar and spelling found it.'),
];
const H = (a, b) => [a, b];
export const FAMILIES = [
  C('endmark.sentence', 'choose-sentence', 'WRITIN.T2.END_MARKS', EM, { stem: SENT, hints: H('A question ends with a question mark, a statement with a full stop, a strong feeling with an exclamation mark.', 'A new sentence starts with a capital letter.'), oc: 'a' }),
  SP('endmark.sentence', 'WRITIN.T2.END_MARKS', EM, { topic: 'with end marks', hints: H('Look at the last mark and the first letter of each sentence.', 'A reported question ends with a full stop.'), oc: 'b' }),
  C('endmark.mark', 'choose-mark', 'WRITIN.T2.END_MARKS', EM_MARK, { hints: H('Does the sentence ask, tell or show a strong feeling?', 'Ask: question mark. Tell: full stop. Strong feeling: exclamation mark.'), oc: 'a', rung: 2 }),
  C('narrpara.open', 'choose-opening', 'WRITIN.T3.NARRATIVE_PARAGRAPH', NP_OPEN, { hints: H('The opening sets the scene: who, where and when.', 'A sentence about an event in the middle or the end is not an opening.'), oc: 'a' }),
  C('narrpara.close', 'choose-closing', 'WRITIN.T3.NARRATIVE_PARAGRAPH', NP_CLOSE, { hints: H('The closing tells how the story ended or what the person felt.', 'An opening sentence cannot close a paragraph.'), oc: 'a', rung: 2 }),
  eng({ id: 'english7.narrpara.order', kind: 'order-sentences', cs: 'WRITIN.T3.NARRATIVE_PARAGRAPH', oc: 'a', form: 'steps', rung: 2, gen: orderGen(NP_ORDER, { intro: 'These four sentences of a narrative paragraph are mixed up. Which list shows the order in which they should be read.', codes: ['M7_NP_ORDER', 'M7_NP_ORDER'], hints: ['The opening sets the scene. The closing ends the story.', 'Look for time words such as first, then, next, finally and at last.'] }) }),
  C('example.incident', 'choose-incident', 'WRITIN.T4.PARAGRAPH_EXAMPLES', PE_INC, { hints: H('An incident is one event that happened at one time and place.', 'A general statement is not an incident.'), oc: 'a', rung: 2 }),
  C('example.choose', 'choose-example', 'WRITIN.T4.PARAGRAPH_EXAMPLES', PE, { hints: H('An example is one real case that shows the topic sentence is true.', 'Saying the same idea again in other words is not an example.'), oc: 'a' }),
  C('example.connector', 'choose-connector', 'WRITIN.T4.PARAGRAPH_EXAMPLES', PEC, { hints: H('Words that bring in an example: for example, for instance, such as, including.', 'However shows a contrast, therefore a result, finally the last step.'), oc: 'a', rung: 2 }),
  C('example.odd', 'find-odd-sentence', 'WRITIN.T4.PARAGRAPH_EXAMPLES', PODD, { hints: H('Find the topic of the paragraph first.', 'The sentence that does not belong is about something else.'), oc: 'a', rung: 2 }),
  C('flet.closing', 'choose-closing', 'WRITIN.T5.FRIENDLY_LETTER', FL_CLOSE, { hints: H('A friendly letter ends warmly.', 'Yours faithfully and Yours sincerely are for formal letters.'), oc: 'a' }),
  SP('flet.closing', 'WRITIN.T5.FRIENDLY_LETTER', FL_CLOSE, { topic: 'in the closings of four friendly letters', hints: H('A friendly closing is warm: Your friend, Your loving cousin.', 'Yours faithfully and Yours sincerely are formal.'), oc: 'a' }),
  C('flet.part', 'choose-part', 'WRITIN.T5.FRIENDLY_LETTER', FL_PART, { hints: H('Order of a friendly letter: address and date, greeting, body, closing, name.', 'A friendly letter has no subject line and no receiver\'s address at the top.'), oc: 'a', rung: 2 }),
  ...P('misspelt', 'WRITIN.T6.MISSPELT_WORDS', MS, { hints: H('Break the word into parts and say each part.', 'Check the double letters, the ie or ei and the silent letters.'), topic: 'with spelling', oc: ['a', 'b', 'b'], thinOk: true }),
  C('process.step', 'choose-step', 'WRITIN.T7.WRITING_PROCESS', WP, { hints: H('The steps are planning, drafting, revising, editing and publishing.', 'Revising is about ideas; editing is about spelling and punctuation.'), oc: 'a' }),
  eng({ id: 'english7.process.order', kind: 'order-steps', cs: 'WRITIN.T7.WRITING_PROCESS', oc: 'a', form: 'steps', rung: 2, gen: orderGen(WP_ORDER, { intro: 'These four steps of the writing process are mixed up. Which list shows the right order.', codes: ['M7_WP_EDIT_FIRST', 'M7_WP_REVISE_EDIT'], hints: ['Plan first, then draft, then improve, then correct and share.', 'You cannot edit what you have not written yet.'] }) }),
  C('narrfeat.feature', 'choose-feature', 'WRITIN.T9.NARRATIVE_FEATURES', NF, { hints: H('A narrative has a title, characters, a setting, a problem, events in order and an ending.', 'Setting means where and when. Characters are the people.'), oc: 'a' }),
  C('narrfeat.kind', 'narrative-or-other', 'WRITIN.T9.NARRATIVE_FEATURES', NF_KIND, { hints: H('A narrative tells what happened, one event after another.', 'A description shows what something is like. A letter has a greeting and a closing.'), oc: 'a', rung: 2 }),
  C('lists.heading', 'choose-heading', 'WRITIN.T10.LIST_GROUPING', LG_HEAD, { hints: H('Ask: what is this item used for?', 'Group items of the same kind: food, clothes, tools, stationery.'), oc: 'a' }),
  C('lists.odd', 'find-odd-item', 'WRITIN.T10.LIST_GROUPING', LG_ODD, { hints: H('Find what three of the items have in common.', 'The odd one is of a different kind.'), oc: 'a', rung: 2 }),
  C('lists.event', 'choose-list', 'WRITIN.T10.LIST_GROUPING', LG_EVENT, { hints: H('Think about what the event needs.', 'A shopping list says what to buy and how much.'), oc: 'a', rung: 2 }),
  ...P('synonym', 'WRITIN.T11.SYNONYMS_ANTONYMS', SYN, { hints: H('A synonym means the same. An antonym means the opposite.', 'Check which one the question asks for, and what the word means in the sentence.'), topic: 'with synonyms and antonyms', oc: ['a', 'b', 'b'], thinOk: true }),
  C('antonym.prefix', 'choose-opposite', 'WRITIN.T11.SYNONYMS_ANTONYMS', SYN_PREFIX, { stem: 'Choose the word that completes the sentence correctly.', hints: H('Many opposites are made with a prefix, but the prefix must fit the word.', 'Say the word aloud. Does it sound like a real word?'), oc: 'b', rung: 2 }),
  C('synonym.kind', 'synonym-or-antonym', 'WRITIN.T11.SYNONYMS_ANTONYMS', SYN_KIND, { hints: H('Synonyms mean the same. Antonyms mean the opposite.', 'Say both words and ask: can one replace the other?'), oc: 'a' }),
  ...P('numword', 'WRITIN.T11.NUMBER_WORDS', NW, { hints: H('Say the number slowly and spell each part.', 'Numbers from 21 to 99 take a hyphen. Ordinals: 1st, 2nd, 3rd, then th.'), topic: 'with numbers', oc: ['a', 'b', 'b'], thinOk: true }),
  C('numword.sentence', 'choose-sentence', 'WRITIN.T11.NUMBER_WORDS', NW_SENT, { stem: SENT, hints: H('Never begin a sentence with a figure.', 'Check the spelling of the number and the ending of the ordinal.'), oc: 'a', rung: 2 }),
  C('dialogue.format', 'choose-format', 'WRITIN.T12.DIALOGUE_FORMAT', DF, { hints: H('In a play-style dialogue each line begins with the speaker\'s name and a colon.', 'Actions go in brackets. Each turn is on a new line.'), oc: 'a' }),
  C('dialogue.line', 'choose-line', 'WRITIN.T12.DIALOGUE_FORMAT', DF_LINE, { hints: H('The name comes first, then any action in brackets, then a colon and the words.', 'Quotation marks are not put round a whole line of a script.'), oc: 'a', rung: 2 }),
  C('idiom.meaning', 'choose-meaning', 'WRITIN.T13.IDIOMS', ID_MEAN, { hints: H('An idiom does not mean what its words say.', 'Think of the situation where the idiom is used.'), oc: 'a' }),
  ...P('idiom', 'WRITIN.T13.IDIOMS', ID_SIT, { hints: H('The words of an idiom are fixed.', 'Say the whole idiom and check each word.'), topic: 'with idioms', oc: ['a', 'a', 'a'], thinOk: true }),
  C('descr.kind', 'description-or-narrative', 'WRITIN.T14.DESCRIPTIVE_FEATURES', DW_KIND, { stem: 'Choose.', hints: H('A description shows what something is like, using the senses.', 'A narrative tells events. A fact or a rule is not a description.'), oc: 'a' }),
  C('descr.detail', 'choose-detail', 'WRITIN.T14.DESCRIPTIVE_FEATURES', DW_BEST, { hints: H('Exact words let the reader see, hear and smell.', 'Words such as nice, good and bad are too vague.'), oc: 'a', rung: 2 }),
  C('descr.order', 'choose-order', 'WRITIN.T14.DESCRIPTIVE_FEATURES', DW_ORDER, { hints: H('A description follows a clear order: top to bottom, near to far, or in time.', 'Picture yourself moving in the order of the description.'), oc: 'a', rung: 2 }),
  C('notice.part', 'choose-part', 'WRITIN.T15.NOTICE_POSTER', NO_PART, { hints: H('A notice gives the key facts briefly: what, when, where, who to see and who wrote it.', 'A poster uses a big heading, a few words and a picture.'), oc: 'a' }),
  C('notice.missing', 'find-missing', 'WRITIN.T15.NOTICE_POSTER', NO_MISSING, { hints: H('Check the notice for what, when, where, who to see and who wrote it.', 'Find the one thing a reader needs that is not there.'), oc: 'a', rung: 2 }),
  C('notice.kind', 'notice-or-poster', 'WRITIN.T15.NOTICE_POSTER', NO_KIND, { hints: H('A poster catches the eye with a picture and big words.', 'A notice gives the details briefly and names the writer.'), oc: 'a', rung: 2 }),
  C('hand.feature', 'choose-feature', 'WRITIN.T1.HANDWRITING', HW_FEAT, { hints: H('Neat handwriting is plain, even and easy to read.', 'Look at the size of the letters and the spaces between words.'), oc: 'a' }),
  C('hand.work', 'choose-what-to-work-on', 'WRITIN.T1.HANDWRITING', HW_FIND, { hints: H('Find what makes the writing hard to read.', 'Fast, pressed or decorated writing is not neat.'), oc: 'a', rung: 2 }),
  C('assess.part', 'choose-part-to-check', 'WRITIN.T8.ASSESS_NARRATIVE', AN_PART, { hints: H('The introduction sets the scene, the body tells the events, the conclusion ends the story.', 'Start an assessment by reading the work again.'), oc: 'a' }),
  C('assess.find', 'find-what-needs-work', 'WRITIN.T8.ASSESS_NARRATIVE', AN_FIND, { hints: H('Ask which part does not do its job.', 'Introduction: who, where, when. Body: events in order. Conclusion: how it ends.'), oc: 'a', rung: 2 }),
];
