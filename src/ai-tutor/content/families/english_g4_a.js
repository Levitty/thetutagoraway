// ============================================================================
// ENGLISH GRADE 4, THE QUESTION SKILLS THE DEPTH PASS LEFT WITHOUT A FAMILY (19 Nov 2026, the questions wave,
// Tuta Workspace/HOREB_QUESTIONS_PLAN.md): family words, a short SMS, "I like ... but I do not like ...", choosing a book,
// interrupting politely, gestures and faces, and "very ... but ...". DRAFT families.
// Written offline, no model call. Original sentences, Kenyan names and places, short words for a Grade 4 reader.
// Every wrong answer carries the library misconception behind it (curriculum/english/g4.json). Off for children
// (reviewed:false) until a Kenyan English teacher signs them off. Saying the patterns aloud and using gestures in a talk are
// still heard by a teacher (docs/qa/english-g4-review-2026-11-12.md lists the speaking routes); these test the words.
// ============================================================================
import { eng, choose, spot } from './english_g4_lib.js';

const K = (c) => `M4_${c}`;
const x = (t, c) => [t, K(c)];
const w = (c, ...xs) => xs.map(t => x(t, c));
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const L = (label, it) => Object.assign(it, { label });
const H = (a, b) => [a, b];
const C = (key, kind, cs, pool, { stem = 'Choose.', hints, oc, rung = 1 }) =>
  eng({ id: `english4.${key}`, kind, cs, oc, form: 'direct', rung, gen: choose(pool, { stem, hints }) });
const SP = (key, cs, pool, { topic, hints, oc, rung = 3 }) =>
  eng({ id: `english4.${key}.spot`, kind: 'spot', cs, oc, form: 'spot', rung, gen: spot(pool, { topic, hints }) });

// ---------------------------------------------------------------- family words
const FV_CS = 'LISTEN.T1.FAMILY_VOCAB';
const FV = [
  I('My father\'s sister is my ___.', 'aunt', [x('uncle', 'FV_AUNT_UNCLE'), x('cousin', 'FV_COUSIN_BROTHER'), x('niece', 'FV_NIECE_NEPHEW')], 'A sister of your father or your mother is your aunt.'),
  I('My mother\'s brother is my ___.', 'uncle', [x('aunt', 'FV_AUNT_UNCLE'), x('nephew', 'FV_NIECE_NEPHEW'), x('brother', 'FV_COUSIN_BROTHER')], 'A brother of your mother or your father is your uncle.'),
  I('My uncle\'s son is my ___.', 'cousin', [x('brother', 'FV_COUSIN_BROTHER'), x('nephew', 'FV_NIECE_NEPHEW'), x('uncle', 'FV_AUNT_UNCLE')], 'The child of your uncle or aunt is your cousin.'),
  I('My sister\'s daughter is my ___.', 'niece', [x('nephew', 'FV_NIECE_NEPHEW'), x('cousin', 'FV_COUSIN_BROTHER'), x('aunt', 'FV_AUNT_UNCLE')], 'Your sister\'s or brother\'s daughter is your niece.'),
  I('My brother\'s son is my ___.', 'nephew', [x('niece', 'FV_NIECE_NEPHEW'), x('cousin', 'FV_COUSIN_BROTHER'), x('uncle', 'FV_AUNT_UNCLE')], 'Your brother\'s or sister\'s son is your nephew.'),
  I('Juma was born after me. He is my ___ brother.', 'younger', [x('small', 'FV_SMALL_BROTHER'), x('tiny', 'FV_SMALL_BROTHER'), x('short', 'FV_SMALL_BROTHER')], 'We say younger brother for a brother born after us.'),
  I('Achieng was born before me. She is my ___ sister.', 'older|elder', [x('big', 'FV_SMALL_BROTHER'), x('large', 'FV_SMALL_BROTHER'), x('tall', 'FV_SMALL_BROTHER')], 'We say older sister for a sister born before us.'),
  I('My aunt\'s daughter, Wanjiru, is my ___.', 'cousin', [x('sister', 'FV_COUSIN_BROTHER'), x('niece', 'FV_NIECE_NEPHEW'), x('aunt', 'FV_AUNT_UNCLE')], 'The daughter of your aunt is your cousin, not your sister.'),
];
// ---------------------------------------------------------------- SMS
const SM_CS = 'WRITIN.T4.SMS_MESSAGE';
const SM = [
  L('To the teacher', I('Amina is sick and cannot go to school. Which SMS to her teacher is best.', 'Good morning, Teacher. This is Amina of Grade 4. I am sick and will not come today.', [x('I am sick. I will not come today.', 'SM_NO_NAME'), x('Gud mrng tcha. Am sik, wont cum 2day. Amina', 'SM_TEXTSPEAK'), x('P.O. Box 12, Kitale. Dear Teacher, I am sick today. Yours faithfully, Amina', 'SM_LETTER_FORMAT')], 'A good SMS says who it is from and what the reader needs to know, in clear words.')),
  L('To Mum', I('Otieno has reached school safely. Which SMS to his mother is best.', 'Mum, I have reached school safely. Otieno', [x('P.O. Box 40, Kisumu. Dear Mum, I have reached school safely. Your son, Otieno', 'SM_LETTER_FORMAT'), x('Mum, I hv rchd skul sfly. O', 'SM_TEXTSPEAK'), x('I have reached.', 'SM_NO_NAME')], 'An SMS is short, clear and says who it is from. It has no addresses.')),
  L('About a meeting', I('Mr Kamau must tell parents that the meeting has moved. Which SMS is best.', 'Dear parents, the meeting is now on Friday at 2 pm. Mr Kamau', [x('Dear parents, the meeting has moved to another day. Mr Kamau', 'SM_MISSING_DETAIL'), x('Meetin moved 2 fri 2pm', 'SM_TEXTSPEAK'), x('The meeting is on Friday at 2 pm.', 'SM_NO_NAME')], 'The parents need the new day, time and place, and who the SMS is from.')),
  L('To a friend', I('Baraka wants his friend Kibet to bring his ball tomorrow. Which SMS is best.', 'Hi Kibet, please bring your ball to school tomorrow. Baraka', [x('Hi Kibet, please bring it with you when you come. Baraka', 'SM_MISSING_DETAIL'), x('Kibet, bring ur bal 2mrw', 'SM_TEXTSPEAK'), x('Please bring your ball tomorrow.', 'SM_NO_NAME')], 'Say what to bring and when, and who you are.')),
  L('To Grandmother', I('Wanjiru wants to thank her grandmother for a gift. Which SMS is best.', 'Thank you for the new dress, Grandma. I love it! Wanjiru', [x('Thanks 4 the dres gma! Wanjiru', 'SM_TEXTSPEAK'), x('Thank you for it. I love it!', 'SM_NO_NAME'), x('P.O. Box 7, Nyeri. Dear Grandma, thank you for the dress. Yours sincerely, Wanjiru', 'SM_LETTER_FORMAT')], 'A thank-you SMS names the gift and who it is from.')),
  L('About a bus', I('Mama must tell Juma what time the school bus will come. Which SMS is best.', 'Juma, the bus will pick you up at 4 pm at the gate. Mama', [x('Juma, the school bus will come to pick you up. Mama', 'SM_MISSING_DETAIL'), x('Juma, bus @ 4 gate. M', 'SM_TEXTSPEAK'), x('The bus will come at 4 pm.', 'SM_NO_NAME')], 'Juma needs the time and the place, and to know who sent it.')),
];
// ---------------------------------------------------------------- I like ... but I do not like ...
const LB_CS = 'LISTEN.T5.LIKE_BUT_PATTERN';
const LB = [
  I('I like beans ___ I do not like cabbage.', 'but', [x('and', 'LB_AND_FOR_BUT'), x('so', 'LB_AND_FOR_BUT'), x('also', 'LB_AND_FOR_BUT')], 'But joins a like and a dislike.'),
  I('I like mangoes but I do not ___ pawpaws.', 'like', [x('likes', 'LB_DO_NOT_S'), x('liked', 'LB_DO_NOT_S'), x('liking', 'LB_DO_NOT_S')], 'After do not, the verb stays plain: like.'),
  I('I like rice but I ___ like ugali.', 'do not|don\'t', [x('not', 'LB_NOT_LIKE'), x('no', 'LB_NOT_LIKE'), x('am not', 'LB_NOT_LIKE')], 'We say I do not like, with do.'),
  I('I like ___ chapati but I do not like eating rice.', 'eating', [x('to eating', 'LB_LIKE_ING_TO'), x('to eats', 'LB_LIKE_ING_TO'), x('eats', 'LB_LIKE_ING_TO')], 'We say I like eating, with no to before eating.'),
  I('Wekesa likes milk ___ he does not like tea.', 'but', [x('and', 'LB_AND_FOR_BUT'), x('so', 'LB_AND_FOR_BUT'), x('because', 'LB_AND_FOR_BUT')], 'But joins a like and a dislike.'),
  I('I like oranges but I do not ___ bananas.', 'like', [x('likes', 'LB_DO_NOT_S'), x('liked', 'LB_DO_NOT_S'), x('to likes', 'LB_DO_NOT_S')], 'After do not, use like, with no -s.'),
  I('I like fish but I ___ like meat.', 'do not|don\'t', [x('not', 'LB_NOT_LIKE'), x('no', 'LB_NOT_LIKE'), x('does not', 'LB_DO_NOT_S')], 'With I, we say do not like.'),
];
// ---------------------------------------------------------------- choosing a book
const SR_CS = 'READIN.T5.SELECT_READING';
const SR = [
  L('To cook pilau', I('Neema wants to learn how to cook pilau. Which book should she choose.', 'a recipe book', [x('a poem book about food', 'SR_WRONG_TYPE'), x('the storybook with the nicest cover', 'SR_COVER'), x('the thickest book in the library', 'SR_THICKNESS')], 'A recipe book tells you how to cook.')),
  L('To practise reading', I('Kioko is in Grade 4 and wants to practise reading. Which book is best for him.', 'a Grade 4 graded reader', [x('a thick book for Grade 8', 'SR_TOO_HARD'), x('a book with a lion on the cover', 'SR_COVER'), x('a big dictionary', 'SR_WRONG_TYPE')], 'A graded reader at your level helps you practise.')),
  L('To learn about camels', I('Halima wants facts about camels for a class project. Which book should she choose.', 'a children\'s encyclopaedia of animals', [x('a storybook with a camel on the cover', 'SR_COVER'), x('the thickest novel on the shelf', 'SR_THICKNESS'), x('a song book', 'SR_WRONG_TYPE')], 'An encyclopaedia gives facts.')),
  L('To find a word meaning', I('Musa does not know what "harvest" means. Which book should he use.', 'a dictionary', [x('a storybook about a farm', 'SR_WRONG_TYPE'), x('the book with the most pages', 'SR_THICKNESS'), x('a book with a farm on the cover', 'SR_COVER')], 'A dictionary gives the meaning of words.')),
  L('For fun at home', I('Akinyi wants a story to enjoy at home. She is in Grade 4. Which book is best.', 'a Grade 4 storybook about a clever hare', [x('a science book for secondary school', 'SR_TOO_HARD'), x('a recipe book', 'SR_WRONG_TYPE'), x('the thickest book, because it has more', 'SR_THICKNESS')], 'Choose a story at your level that you will enjoy.')),
  L('To learn about rain', I('Kipchoge wants to know why it rains. Which book should he choose.', 'a simple science book about weather', [x('a storybook with rain on the cover', 'SR_COVER'), x('a book of poems about the sky', 'SR_WRONG_TYPE'), x('a thick science book for university', 'SR_TOO_HARD')], 'A science book at your level explains why it rains.')),
];
// ---------------------------------------------------------------- interrupting politely
const IP_CS = 'LISTEN.T10.INTERRUPT_POLITELY';
const IP = [
  L('To the teacher', I('The teacher is talking. Halima feels sick and must go to the clinic. What should she say.', 'Excuse me, Teacher, may I go to the clinic?', [x('Hey, wait! I want to go!', 'IP_HEY'), x('Sorry. I am going.', 'IP_SORRY_ONLY'), x('Excuse me. Let me go to the clinic now.', 'IP_COMMAND')], 'Say Excuse me and ask with may I.')),
  L('To Mama', I('Mama is talking on the phone. Juma needs the key. When she stops, what should he say.', 'Excuse me, Mama, may I have the key, please?', [x('Give me the key now, Mama. I need it.', 'IP_COMMAND'), x('Hey, Mama! Hey! The key! The key!', 'IP_HEY'), x('Sorry. The key.', 'IP_SORRY_ONLY')], 'Wait for a pause, then ask politely.')),
  L('To a friend', I('Your friend is telling a long story. You must go home. What should you say.', 'Sorry to interrupt, but I have to go home now.', [x('Wait! Stop your story now! I am going home!', 'IP_HEY'), x('Sorry. Bye.', 'IP_SORRY_ONLY'), x('Stop talking now and let me go home.', 'IP_COMMAND')], 'Sorry to interrupt, but ... is polite.')),
  L('At assembly', I('The headteacher stops speaking and asks for questions. Otieno has one. What should he say.', 'Excuse me, sir, may I ask a question?', [x('Hey! Hey! I have a question for you!', 'IP_HEY'), x('Answer my question now, sir.', 'IP_COMMAND'), x('Sorry. Question.', 'IP_SORRY_ONLY')], 'Excuse me, may I ... is the polite way to ask.')),
  L('To a shopkeeper', I('The shopkeeper is talking to another customer. Wanjiru needs bread. What should she say.', 'Excuse me, may I have a loaf of bread, please?', [x('Hey, you! I want bread! Hey!', 'IP_HEY'), x('Excuse me. Give me a loaf of bread now.', 'IP_COMMAND'), x('Sorry. Bread.', 'IP_SORRY_ONLY')], 'Excuse me, may I ... please? is polite.')),
  L('To the class', I('Your group is talking. You want to add an idea. What should you say.', 'Sorry to interrupt, but may I add something?', [x('Wait! All of you, listen to me now!', 'IP_HEY'), x('Sorry. My idea is better than yours.', 'IP_SORRY_ONLY'), x('Stop talking and listen to my idea.', 'IP_COMMAND')], 'Ask politely to add your idea.')),
];
// ---------------------------------------------------------------- gestures, faces and tone of voice
const NC_CS = 'LISTEN.T11.NONVERBAL_CUES';
const NC_READ = [
  I('Your teacher nods while you answer a question. What does the nod mean.', 'You are right; go on.', [x('You are wrong.', 'NC_NOD'), x('Stop talking.', 'NC_NOD'), x('Sit down now.', 'NC_NOD')], 'A nod means yes, or go on.'),
  I('Your friend frowns when you explain the game. How is your friend feeling.', 'confused or unhappy', [x('happy', 'NC_FROWN'), x('excited', 'NC_FROWN'), x('nothing at all', 'NC_FROWN')], 'A frown shows a person is confused or unhappy.'),
  I('Baraka says "That is great" in a cross, angry voice. How does he really feel.', 'annoyed', [x('happy', 'NC_TONE_WORDS'), x('pleased', 'NC_TONE_WORDS'), x('proud', 'NC_TONE_WORDS')], 'The tone of voice shows the real feeling, not only the words.'),
  I('Mama shakes her head when you ask to go out to play. What does she mean.', 'No.', [x('Yes.', 'NC_NOD'), x('Go now.', 'NC_NOD'), x('Maybe later.', 'NC_NOD')], 'Shaking the head means no.'),
  I('The teacher frowns at the noisy class. What does the frown show.', 'She is not happy with the noise.', [x('She is happy with the class.', 'NC_FROWN'), x('She is laughing.', 'NC_FROWN'), x('It shows nothing.', 'NC_FROWN')], 'A frown shows the teacher is unhappy.'),
  I('Akinyi says "I am fine" in a sad, quiet voice. How does she really feel.', 'sad', [x('fine', 'NC_TONE_WORDS'), x('happy', 'NC_TONE_WORDS'), x('excited', 'NC_TONE_WORDS')], 'Her voice shows she is sad, even though her words say fine.'),
];
const NC_USE = [
  I('You are telling your class about the headteacher, who is standing near. How should you show him.', 'with an open hand', [x('by pointing at him with one finger', 'NC_POINTING'), x('by pointing at him with a pen', 'NC_POINTING'), x('by pointing at him with your foot', 'NC_POINTING')], 'Show an older person with an open hand. Pointing with a finger is rude.'),
  I('Your friend says, "You will come to my party, won\'t you?" You agree. What can you do with your head.', 'nod', [x('shake it', 'NC_NOD'), x('turn it away', 'NC_NOD'), x('look down at the floor', 'NC_NOD')], 'A nod says yes.'),
  I('You want the class to be quiet. Which gesture fits.', 'put a finger on your lips', [x('point at each learner with one finger', 'NC_POINTING'), x('frown and smile at the same time', 'NC_FROWN'), x('shake your head and nod', 'NC_NOD')], 'A finger on the lips asks for quiet.'),
  I('Grandfather is telling a sad story. Which face fits as you listen.', 'a serious, caring face', [x('a big smile and a laugh', 'NC_FROWN'), x('a face that shows nothing', 'NC_FROWN'), x('a cross frown', 'NC_FROWN')], 'Your face should fit the story: serious and caring.'),
  I('You are telling the class which way the river is. An elder is standing beside you. How should you show the way.', 'with an open hand towards the river', [x('by pointing one finger at the elder', 'NC_POINTING'), x('by shaking your head', 'NC_NOD'), x('by frowning at the class', 'NC_FROWN')], 'An open hand is polite. Do not point at people.'),
];
// ---------------------------------------------------------------- very ... but ...
const VB_CS = 'LISTEN.T13.VERY_BUT';
const VB = [
  I('The shoes are very ___ but they are expensive.', 'nice', [x('nicer', 'VB_VERY_COMPARATIVE'), x('nicest', 'VB_VERY_COMPARATIVE'), x('much nice', 'VB_VERY_MUCH')], 'Very goes before a plain adjective: very nice.'),
  I('The bag is ___ strong but it is heavy.', 'very', [x('too', 'VB_TOO_FOR_VERY'), x('very much', 'VB_VERY_MUCH'), x('more', 'VB_VERY_COMPARATIVE')], 'Very strong praises the bag; but brings in the problem.'),
  I('The phone is very cheap ___ it breaks easily.', 'but', [x('and', 'VB_NO_CONTRAST'), x('so', 'VB_NO_CONTRAST'), x('because', 'VB_NO_CONTRAST')], 'But joins two ideas that pull different ways.'),
  I('The road is very short ___ it is very rough.', 'but', [x('and', 'VB_NO_CONTRAST'), x('so', 'VB_NO_CONTRAST'), x('because', 'VB_NO_CONTRAST')], 'A short road is good, a rough road is a problem: but joins them.'),
  I('The market is very ___ but it is far.', 'cheap', [x('cheaper', 'VB_VERY_COMPARATIVE'), x('cheapest', 'VB_VERY_COMPARATIVE'), x('much cheap', 'VB_VERY_MUCH')], 'Very goes before the plain adjective cheap.'),
  I('The matatu is ___ fast but it is crowded.', 'very', [x('too', 'VB_TOO_FOR_VERY'), x('very much', 'VB_VERY_MUCH'), x('more', 'VB_VERY_COMPARATIVE')], 'Very fast praises the matatu; but brings in a problem.'),
  I('The dress is very pretty ___ it is too small for me.', 'but', [x('and', 'VB_NO_CONTRAST'), x('so', 'VB_NO_CONTRAST'), x('also', 'VB_NO_CONTRAST')], 'But joins a good point and a problem.'),
];

export const FAMILIES = [
  C('family.choose', 'choose', FV_CS, FV, { stem: 'Choose the word that completes the sentence.', hints: H('Think: is the person a man or a woman, and older or younger?', 'Is the person your parent\'s brother or sister, or their child?') }),
  SP('family', FV_CS, FV, { topic: 'about family members', hints: H('Check each family word: who is the person?', 'Say "younger" or "older" for brothers and sisters, not "small" or "big".') }),
  C('sms.choose', 'choose-sms', SM_CS, SM, { hints: H('A good SMS says who it is from and what the reader must know or do.', 'Use clear words and no addresses.') }),
  SP('sms', SM_CS, SM, { topic: 'as four text messages', hints: H('Which message has no name, strange short forms, addresses or a missing detail?', 'An SMS is short, clear and complete.') }),
  C('likebut.choose', 'choose', LB_CS, LB, { stem: 'Choose the word that completes the sentence.', hints: H('Join a like and a dislike with but.', 'After do not, the verb stays plain.') }),
  SP('likebut', LB_CS, LB, { topic: 'about food', hints: H('Check the joining word and the verb after do not.', 'I like ... but I do not like ...') }),
  C('book.choose', 'choose-book', SR_CS, SR, { hints: H('Ask what the book is for: to cook, to learn facts, to enjoy, or to find a word.', 'Choose a book at your level, not by the cover or the size.') }),
  SP('book', SR_CS, SR, { topic: 'about which book to choose', hints: H('Which choice is made by the cover, the size or the wrong kind of book?', 'The right book fits the reader and the purpose.') }),
  C('interrupt.choose', 'choose-polite', IP_CS, IP, { hints: H('Wait for a pause, then say Excuse me or Sorry to interrupt.', 'Ask with may I and please; do not give an order.') }),
  SP('interrupt', IP_CS, IP, { topic: 'about interrupting people', hints: H('Which one shouts, gives an order or does not wait?', 'A polite interruption waits, says Excuse me and asks.') }),
  C('cues.read', 'read-the-cue', NC_CS, NC_READ, { hints: H('Look at the face, the head and the voice, not only the words.', 'A nod is yes; a frown is unhappy or confused.'), oc: 'd' }),
  C('cues.use', 'choose-the-cue', NC_CS, NC_USE, { hints: H('Choose a gesture that fits what you say.', 'Show people with an open hand; do not point.'), oc: 'b', rung: 2 }),
  C('verybut.choose', 'choose', VB_CS, VB, { stem: 'Choose the word that completes the sentence.', hints: H('Very goes before a plain adjective.', 'But joins two ideas that pull different ways.') }),
  SP('verybut', VB_CS, VB, { topic: 'about things at the market', hints: H('Check the word after very, and the idea after but.', 'The thing is very good in one way but has a problem.') }),
];
