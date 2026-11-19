// ============================================================================
// ENGLISH GRADE 6, THE QUESTION SKILLS THE DEPTH PASS LEFT WITHOUT A FAMILY (19 Nov 2026, the questions wave,
// Tuta Workspace/HOREB_QUESTIONS_PLAN.md): planning a composition, predicting from visuals and judging them, words about work,
// describing words, and non-verbal cues. DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places. Every wrong answer carries the library
// misconception behind it (curriculum/english/g6.json). Off for children (reviewed:false) until a Kenyan English teacher
// signs them off. Writing the composition and using gestures in a talk are still marked by a teacher
// (docs/qa/english-g6-non-question-outcomes-2026-11-12.md); these test the planning and the knowledge under them.
// ============================================================================
import { eng, choose, spot, mc, feedbackOf, shuffle, pick, randInt } from './english_g6_lib.js';

const K = (c) => `M6_${c}`;
const x = (t, c) => [t, K(c)];
const w = (c, ...xs) => xs.map(t => x(t, c));
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const L = (label, it) => Object.assign(it, { label });
const H = (a, b) => [a, b];
const C = (key, kind, cs, pool, { stem = 'Choose.', hints, oc = 'a', rung = 1 }) =>
  eng({ id: `english6.${key}`, kind, cs, oc, form: 'direct', rung, gen: choose(pool, { stem, hints }) });
const SP = (key, cs, pool, { topic, hints, oc = 'a', rung = 3 }) =>
  eng({ id: `english6.${key}.spot`, kind: 'spot', cs, oc, form: 'spot', rung, gen: spot(pool, { topic, hints }) });

// Put four plan lines in order: options are lists of letters (as english_g7_write.js).
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

// ---------------------------------------------------------------- planning a composition
const PC_CS = 'WRITIN.T2.PLAN_COMPOSITION';
const PC_IDEA = [
  I('Juma is planning a composition on "Our Eid celebration". Which idea does not belong in his plan.', 'My father bought a new car last year.', w('PC_OFF_TOPIC', 'We went to the mosque early for prayers.', 'Mama cooked pilau for our neighbours.', 'We visited our grandparents in the afternoon.'), 'The plan is about Eid. The car is about something else.'),
  I('Achieng is planning a composition on "A visit to Lake Nakuru". Which idea does not belong in her plan.', 'My cousin is very good at football.', w('PC_OFF_TOPIC', 'We saw thousands of pink flamingos.', 'Our bus left school at six in the morning.', 'A guide told us about the rhinos.'), 'The plan is about the lake visit. Football is about something else.'),
  I('Kibet is planning a composition on "The day it rained heavily". Which idea does not belong in his plan.', 'Our school won the music festival in 2024.', w('PC_OFF_TOPIC', 'The river burst its banks by noon.', 'We waited in the classroom until four.', 'Father came to fetch us with an umbrella.'), 'The plan is about the heavy rain. The music festival is about something else.'),
  I('Which topic is best for a short composition of one page.', 'Our Eid celebration last year', [x('Everything about Kenya', 'PC_TOPIC_TOO_WIDE'), x('All the animals in Africa', 'PC_TOPIC_TOO_WIDE'), x('The history of the whole world', 'PC_TOPIC_TOO_WIDE')], 'A narrow topic can be written about well in one page.'),
  I('Which topic is best for a short composition of one page.', 'The day I lost my school bag', [x('All the schools in Kenya', 'PC_TOPIC_TOO_WIDE'), x('Everything about learning', 'PC_TOPIC_TOO_WIDE'), x('Every sport in the world', 'PC_TOPIC_TOO_WIDE')], 'One day and one event make a topic you can cover well.'),
  I('What does a good composition plan look like.', 'short notes under the headings introduction, body and conclusion', [x('the whole composition written out in full paragraphs', 'PC_PLAN_TOO_LONG'), x('a list of ideas in any order', 'PC_NO_ORDER'), x('every idea you can think of, on any topic', 'PC_OFF_TOPIC')], 'A plan is short notes in order, not the composition itself.'),
];
const PC_ORDER = [
  ['Introduction: we arrived at the mosque early', 'Body: we joined the prayers', 'Body: we shared pilau with our neighbours', 'Conclusion: we went home tired but happy'],
  ['Introduction: our class left for Lake Nakuru at dawn', 'Body: we saw flamingos on the shore', 'Body: a guide showed us the rhinos', 'Conclusion: we got back to school at sunset'],
  ['Introduction: the sky grew dark after lunch', 'Body: heavy rain flooded the road', 'Body: we waited in the classroom', 'Conclusion: Father fetched us and we got home safely'],
];
// ---------------------------------------------------------------- predicting from visuals and judging them
const RV_CS = 'READIN.T4.READ_VISUALS';
const RV_PREDICT = [
  I('A picture shows a flooded village. People stand on roofs while a boat comes towards them. A boy holds a football. What will the text most likely be about.', 'People will be rescued from the flood.', [x('There will be a football match.', 'RV_PREDICT_ONE_DETAIL'), x('The boy will buy a new ball at the shop.', 'RV_PREDICT_ONE_DETAIL'), x('The people are going fishing.', 'RV_CAPTION_IGNORED')], 'The main picture is the flood and the boat coming to help.'),
  I('A picture shows a crowded school field with flags, a running track and parents in the stands. A dog sits by the gate. What will the text most likely be about.', 'a school sports day', [x('a lost dog', 'RV_PREDICT_ONE_DETAIL'), x('a flag-making lesson', 'RV_PREDICT_ONE_DETAIL'), x('a quiet day at home', 'RV_PREDICT_ONE_DETAIL')], 'The track, the flags and the crowd show a sports day.'),
  I('A picture has the caption "Nairobi, 1963: crowds celebrate independence". What does the caption help you to predict.', 'It is about independence day in Nairobi in 1963.', [x('Nothing; captions do not matter.', 'RV_CAPTION_IGNORED'), x('It is about a big football match in a stadium today.', 'RV_CAPTION_IGNORED'), x('The text is about a market in Mombasa.', 'RV_CAPTION_IGNORED')], 'A caption tells where and when the picture was taken.'),
  I('A diagram shows four boxes joined by arrows: seed, seedling, young plant, maize cob. Where does the process start.', 'at the seed, where the first arrow starts', [x('at the maize cob, because it is the last and biggest box', 'RV_DIAGRAM_ORDER'), x('at the young plant in the middle', 'RV_DIAGRAM_ORDER'), x('at any box you like', 'RV_DIAGRAM_ORDER')], 'Follow the arrows from the box the first arrow starts from.'),
  I('A picture shows a girl in a hospital bed. A nurse stands beside her and flowers are on the table. What will the story most likely be about.', 'a girl who is ill in hospital', [x('a girl who sells flowers', 'RV_PREDICT_ONE_DETAIL'), x('a flower show at school', 'RV_PREDICT_ONE_DETAIL'), x('a nurse who is going on a long holiday', 'RV_PREDICT_ONE_DETAIL')], 'The bed and the nurse are the main picture; the flowers are a small detail.'),
];
const RV_JUDGE = [
  I('A text explains how to wash hands well. It has a beautiful photograph of a sunset. Does the photograph help the text.', 'No, it does not show anything about washing hands.', [x('Yes, because it is beautiful.', 'RV_DECORATION'), x('Yes, because pictures always help a text, whatever they show.', 'RV_DECORATION'), x('Yes, because it is in colour.', 'RV_DECORATION')], 'A visual is relevant only when it helps the reader to understand the text.'),
  I('A text explains how to plant a tree. Which visual would help it most.', 'pictures of digging, planting and watering', [x('a colourful drawing of a bird', 'RV_DECORATION'), x('a lovely photograph of a big city at night', 'RV_DECORATION'), x('a pretty border of flowers', 'RV_DECORATION')], 'Pictures of the steps help the reader to follow the text.'),
  I('A news report on a fire at Gikomba market has a photograph. The caption says "Firefighters at Gikomba, Monday morning". Why is the caption useful.', 'It tells the reader where and when the photograph was taken.', [x('It is not useful; a reader can skip every caption.', 'RV_CAPTION_IGNORED'), x('It makes the page look nicer.', 'RV_DECORATION'), x('It tells the reader the name of the person who wrote the report.', 'RV_CAPTION_IGNORED')], 'A caption links the picture to the facts in the text.'),
  I('A text explains how water is made safe to drink. Which visual would help it most.', 'a diagram with arrows from dirty to clean water', [x('a picture of a smiling child', 'RV_DECORATION'), x('a bright drawing of a rainbow over a lake', 'RV_DECORATION'), x('a photograph of a football team', 'RV_DECORATION')], 'A diagram with arrows shows the order of the steps in the text.'),
  I('A text tells the story of a lost goat. Next to it is a drawing of a goat on a hill, looking down at a village. Does the drawing help the text.', 'Yes, it shows the goat and where it may be.', [x('No, because drawings are only for young children.', 'RV_DECORATION'), x('No, because it is not coloured.', 'RV_DECORATION'), x('Yes, but only because it looks nice.', 'RV_DECORATION')], 'The drawing shows what the text is about, so it helps the reader.'),
];
// ---------------------------------------------------------------- words about work
const WE_CS = 'LISTEN.T6.WORK_ETHICS_WORDS';
const WE = [
  I('Mr Odhiambo always arrives at work at exactly eight o\'clock. He is ___.', 'punctual', [x('regular', 'WE_PUNCTUAL_REGULAR'), x('intelligent', 'WE_INTEGRITY_INTELLIGENT'), x('delighted', 'WE_DILIGENT_DELIGHT')], 'Punctual means on time.'),
  I('Nurse Wanjiku works hard and carefully all day. She is ___.', 'diligent', [x('delighted', 'WE_DILIGENT_DELIGHT'), x('punctual', 'WE_PUNCTUAL_REGULAR'), x('intelligent', 'WE_INTEGRITY_INTELLIGENT')], 'Diligent means hard-working and careful.'),
  I('The cashier returned the extra money a customer had given her by mistake. She is a woman of ___.', 'integrity', [x('intelligence', 'WE_INTEGRITY_INTELLIGENT'), x('diligence', 'WE_DILIGENT_DELIGHT'), x('punctuality', 'WE_PUNCTUAL_REGULAR')], 'Integrity means being honest and doing what is right.'),
  I('The teacher is paid every month. Her monthly pay is called a ___.', 'salary', [x('wage', 'WE_SALARY_WAGE'), x('wages', 'WE_SALARY_WAGE'), x('daily pay', 'WE_SALARY_WAGE')], 'A salary is fixed pay given every month.'),
  I('Kamau is paid at the end of each day he digs on the farm. His daily pay is called a ___.', 'wage', [x('salary', 'WE_SALARY_WAGE'), x('monthly salary', 'WE_SALARY_WAGE'), x('promotion', 'WE_SALARY_WAGE')], 'A wage is pay for each day or hour of work.'),
  I('A worker who is never late for her shift is ___.', 'punctual', [x('regular', 'WE_PUNCTUAL_REGULAR'), x('delighted', 'WE_DILIGENT_DELIGHT'), x('intelligent', 'WE_INTEGRITY_INTELLIGENT')], 'Punctual means on time; regular means often or every day.'),
  I('The judge refused a bribe. She showed great ___.', 'integrity', [x('intelligence', 'WE_INTEGRITY_INTELLIGENT'), x('delight', 'WE_DILIGENT_DELIGHT'), x('salary', 'WE_SALARY_WAGE')], 'Refusing a bribe is honesty, which is integrity.'),
];
// ---------------------------------------------------------------- describing words
const DW_CS = 'WRITIN.T10.DESCRIBING_WORDS';
const DW = [
  I('Which describes the beach at Diani best.', 'a sandy, sunny beach', [x('a nice beach', 'DW_VAGUE'), x('a good beach', 'DW_VAGUE'), x('a beach that looks very nicely', 'DW_ADVERB')], 'Exact adjectives (sandy, sunny, clear, blue) give a picture; nice and good do not.'),
  I('Which is in the right order.', 'a small old woven basket', [x('a woven old small basket', 'DW_ORDER'), x('an old woven small basket', 'DW_ORDER'), x('a small woven old basket', 'DW_ORDER')], 'Size comes before age, and the material comes last before the noun.'),
  I('Which word completes "The library was very ___."', 'quiet', [x('quietly', 'DW_ADVERB'), x('colourful', 'DW_WRONG_SENSE'), x('nice', 'DW_VAGUE')], 'After was we need an adjective: quiet.'),
  I('Which describes the old jacaranda tree best.', 'a towering, purple jacaranda', [x('a big tree', 'DW_VAGUE'), x('a nice tree', 'DW_VAGUE'), x('a loudly tree', 'DW_ADVERB')], 'Towering and purple are exact words that help the reader see the tree.'),
  I('Which is in the right order.', 'a beautiful big red bus', [x('a red big beautiful bus', 'DW_ORDER'), x('a big red beautiful bus', 'DW_ORDER'), x('a red beautiful big bus', 'DW_ORDER')], 'Opinion comes first, then size, then colour.'),
  I('Which adjective fits "Grandmother has a ___ smile that makes everyone happy."', 'cheerful', [x('colourful', 'DW_WRONG_SENSE'), x('cheerfully', 'DW_ADVERB'), x('good', 'DW_VAGUE')], 'Cheerful describes a smile. Colourful describes things with many colours.'),
  I('Which describes the market best.', 'a busy, noisy market smelling of mangoes', [x('a nice market', 'DW_VAGUE'), x('a good market', 'DW_VAGUE'), x('a market where people shout busily and noisily', 'DW_ADVERB')], 'Busy, noisy and ripe tell how the market looks, sounds and smells.'),
];
// ---------------------------------------------------------------- non-verbal cues in speech
const NC_CS = 'LISTEN.T12.NONVERBAL_CUES';
const NC_USE = [
  I('You are giving a speech at assembly. Where should you look.', 'at the audience, round the room', [x('at the floor', 'NC_NO_EYE_CONTACT'), x('only at your paper, all the time', 'NC_NO_EYE_CONTACT'), x('at the ceiling', 'NC_NO_EYE_CONTACT')], 'Eye contact with the audience keeps them listening.'),
  I('You say "The fish was this big" in a story. Which gesture fits.', 'holding your hands apart', [x('folding your arms', 'NC_GESTURE_MISMATCH'), x('pointing at the door', 'NC_GESTURE_MISMATCH'), x('scratching your head slowly', 'NC_GESTURE_MISMATCH')], 'The gesture should show what the words say.'),
  I('While Baraka speaks, he plays with his pen and shifts from foot to foot. What effect does this have.', 'It distracts the audience from what he says.', [x('none; it does not matter', 'NC_FIDGET'), x('It makes the speech more interesting.', 'NC_FIDGET'), x('It shows he is confident.', 'NC_FIDGET')], 'Fidgeting draws the audience away from the message.'),
  I('You are telling your class that a friend\'s grandmother has died. Which face fits.', 'a serious, sad face', [x('a big smile', 'NC_FACE_WORDS'), x('a cheeky wink', 'NC_FACE_WORDS'), x('a loud laugh', 'NC_FACE_WORDS')], 'Your face should match sad news.'),
  I('You say "Please, everyone, come closer." Which gesture fits.', 'waving your hand towards yourself', [x('pushing your palms away from you', 'NC_GESTURE_MISMATCH'), x('shaking your head', 'NC_GESTURE_MISMATCH'), x('putting a finger on your lips', 'NC_GESTURE_MISMATCH')], 'Waving the hand towards you means come closer.'),
];
const NC_JUDGE = [
  I('In a video, a news reader smiles widely while reporting a bus accident. Are the cues right.', 'No, a smile does not fit sad news.', [x('Yes, smiling is always polite.', 'NC_FACE_WORDS'), x('Yes, it makes the news less sad.', 'NC_FACE_WORDS'), x('Yes, the face does not matter.', 'NC_FACE_WORDS')], 'The face should match the message.'),
  I('A speaker says "No, I do not agree" while nodding again and again. Is the cue right.', 'No, a nod means yes, not no.', [x('Yes, any gesture is fine.', 'NC_GESTURE_MISMATCH'), x('Yes, nodding again and again shows he is strong.', 'NC_GESTURE_MISMATCH'), x('Yes, because he is speaking.', 'NC_GESTURE_MISMATCH')], 'A gesture must fit the words.'),
  I('In a class debate, Neema looks at the audience, uses her hands to count her points and keeps still. Are her cues right.', 'Yes, they support what she says.', [x('No, she should look at the floor.', 'NC_NO_EYE_CONTACT'), x('No, she should look only at her notes.', 'NC_NO_EYE_CONTACT'), x('No, she should keep moving about.', 'NC_FIDGET')], 'Eye contact, fitting gestures and keeping still all help a speaker.'),
  I('In a recorded speech, the speaker keeps tapping the table and looking at his watch. Is this right.', 'No, it distracts the listeners.', [x('Yes, it does not matter.', 'NC_FIDGET'), x('Yes, it keeps the time.', 'NC_FIDGET'), x('Yes, it makes him look like a busy, important man.', 'NC_FIDGET')], 'Fidgeting takes attention away from the message.'),
  I('A girl reads a poem about joy with a sad, tired face and her eyes on the paper. Are her cues right.', 'No, her face does not fit a poem about joy.', [x('Yes, the face does not matter in a poem.', 'NC_FACE_WORDS'), x('Yes, looking at the paper is best.', 'NC_NO_EYE_CONTACT'), x('Yes, a sad face fits every poem.', 'NC_FACE_WORDS')], 'A joyful poem needs a bright face and eye contact.'),
];

export const FAMILIES = [
  C('plan.idea', 'choose-idea', PC_CS, PC_IDEA, { hints: H('Keep only ideas that are about the topic.', 'A plan is short notes, in order, on a topic you can cover well.') }),
  eng({ id: 'english6.plan.order', kind: 'order-plan', cs: PC_CS, oc: 'WRITIN.T6_CREATIVE_WRITING.a', form: 'direct', rung: 2,
    gen: orderGen(PC_ORDER, { intro: 'Put these lines of a composition plan in the right order.', codes: ['M6_PC_NO_ORDER', 'M6_PC_NO_ORDER'], hints: H('Which line introduces the event?', 'The conclusion tells how it all ended.') }) }),
  C('visual.predict', 'predict-from-visual', RV_CS, RV_PREDICT, { hints: H('Look at the main picture first, then the caption.', 'Small details do not tell you what the whole text is about.') }),
  C('visual.judge', 'judge-relevance', RV_CS, RV_JUDGE, { hints: H('Ask: does this visual help the reader to understand the text?', 'A pretty picture is not always a useful one.'), oc: 'd', rung: 2 }),
  C('work.choose', 'choose', WE_CS, WE, { stem: 'Choose the word that completes the sentence.', hints: H('Think about what the worker does.', 'Read the whole sentence with your word in the gap.'), oc: 'b' }),
  SP('work', WE_CS, WE, { topic: 'about people at work', hints: H('Check each work word: on time, hard-working, honest, paid monthly or daily?', 'Punctual is on time; integrity is honesty.'), oc: 'b' }),
  C('describe.choose', 'choose', DW_CS, DW, { hints: H('Exact adjectives help the reader to see, hear or smell the thing.', 'Opinion, size, age, colour, then material: that is the usual order.') }),
  SP('describe', DW_CS, DW, { topic: 'describing people, things and places', hints: H('Which description is vague, in the wrong order or uses the wrong word?', 'An adjective describes a noun; an adverb describes a verb.') }),
  C('cues.use', 'choose-cue', NC_CS, NC_USE, { hints: H('Choose cues that support what you say.', 'Look at the audience, keep still and let your face fit the message.'), oc: 'c' }),
  C('cues.judge', 'judge-cue', NC_CS, NC_JUDGE, { hints: H('Ask: do the face, the eyes and the hands fit the words?', 'Fidgeting and a mismatched face distract the listener.'), oc: 'd', rung: 2 }),
];
