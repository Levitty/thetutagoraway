// ============================================================================
// ENGLISH GRADE 7, LISTENING AND SPEAKING, WORDS AND TEXTS: the knowledge that sits under the speaking tasks, theme words, sounds,
// and what to know about books, poems, trickster narratives, praise songs, dilemma narratives, visuals, notes and style
// (checked in text): DRAFT families. Written offline, no model call. Original sentences, Kenyan names and places.
// Every wrong answer carries the library misconception behind it (curriculum/english/g7.json). Off for children
// (reviewed:false) until a Kenyan English teacher signs them off. A question never replaces the speaking check: how a child
// sounds, stands and looks is judged by a teacher (see the non-question outcomes list).
// Sound items depend on the accent a class is taught in; each is for a Kenyan English teacher to confirm.
// ============================================================================
import { eng, choose, gap, spot, outcomeLetters } from './english_g7_lib.js';

const WORD = 'Choose the word that completes the sentence correctly.';
const GH = ['Read the sentence slowly, one word at a time.', 'Check your word by reading the sentence aloud.'];
const w = (code, ...xs) => xs.map(x => [x, code]);
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const L = (label, it) => Object.assign(it, { label });
const P = (key, cs, pool, { stem = WORD, hints, topic, oc = outcomeLetters(cs, 3), rungs = [1, 2, 3], thinOk = false }) => [
  eng({ id: `english7.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], gen: choose(pool, { stem, hints }) }),
  eng({ id: `english7.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, gen: gap(pool, { stem: 'Type the missing {what} in the sentence.', hints: GH }) }),
  eng({ id: `english7.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], gen: spot(pool, { topic, hints }) }),
];
const C = (key, kind, cs, pool, { stem = 'Choose.', hints, oc, form = 'direct', rung = 1 }) =>
  eng({ id: `english7.${key}`, kind, cs, oc: oc || outcomeLetters(cs, 1)[0], form, rung, gen: choose(pool, { stem, hints }) });
const SP = (key, cs, pool, { topic, hints, oc, rung = 3 }) =>
  eng({ id: `english7.${key}.spot`, cs, oc: oc || outcomeLetters(cs, 1)[0], form: 'spot', rung, gen: spot(pool, { topic, hints }) });

// ---------------------------------------------------------------- polite introductions
const IP = [
  L('To the headteacher', I('Which is the polite way to introduce your friend to the headteacher.', 'Madam, may I introduce my friend, Juma?', w('M7_IP_BLUNT', 'This is my friend. He is Juma.', 'Juma, headteacher.', 'Madam, here is Juma, he wants to see you.'), 'A polite introduction asks permission and uses a title.')),
  L('To a visitor', I('You meet a visitor at school. Which is the polite way to introduce yourself.', 'Good morning, sir. My name is Otieno, and I am in Grade 7.', w('M7_IP_SELF', 'Me, I am Otieno.', 'Hello. Otieno.', 'You, I am Otieno from Grade 7.'), 'Greet the person, say your name and add one useful detail.')),
  L('To the class', I('Which is the best way to introduce a new learner to the class.', 'Class, this is Atieno. She has just joined us from Kisumu.', w('M7_IP_BLUNT', 'Class, there is a girl here.', 'This one is new.', 'Look, Atieno, new.'), 'A polite introduction names the person and says something welcoming.')),
  L('To a teacher', I('Which opening is best when you introduce your grandmother to your teacher.', 'Mr Kamau, I would like you to meet my grandmother, Mrs Wambui.', w('M7_IP_BLUNT', 'Teacher, this old woman is my grandmother.', 'Meet this person.', 'Grandmother, teacher.'), 'Use a title and the person\'s name, and say it politely.')),
  L('To the headteacher, with a classmate', I('Whom do you name first when introducing your classmate to the headteacher.', 'the headteacher', w('M7_IP_ORDER', 'your classmate', 'yourself', 'the person nearest to you'), 'We name the senior person first and then introduce the younger one to the senior person.')),
  L('To a guest of honour', I('Which is the polite way to introduce the guest of honour to the school.', 'Fellow learners, it is my pleasure to introduce our guest of honour, Dr Njeri.', w('M7_IP_BLUNT', 'This is Dr Njeri, she is here.', 'Learners, look at the doctor.', 'The guest, Njeri.'), 'A polite introduction uses respectful words and a title.')),
];
const IP_REPLY = [
  I('A visitor says: "Good afternoon, I am Mrs Njeri, the new librarian." Which reply is polite.', 'Good afternoon, Mrs Njeri. Welcome to our school.', w('M7_IP_REPLY', 'So?', 'Okay, bye.', 'Do you have the key?'), 'A polite reply greets the person and shows you are glad to meet them.'),
  I('Your teacher says: "This is my brother, Peter." Which reply is polite.', 'Pleased to meet you, Peter.', w('M7_IP_REPLY', 'Hmm.', 'Who is he?', 'I did not ask.'), 'Pleased to meet you is the polite reply to an introduction.'),
  I('A new boy says: "Hello, I am Baraka. I have just joined this class." Which reply is polite.', 'Hello, Baraka. Welcome. I am Wanjiru.', w('M7_IP_REPLY', 'Oh.', 'Sit there.', 'Why here?'), 'A polite reply greets the person and gives your own name.'),
  I('The headteacher says: "Meet Dr Otieno, our guest of honour." Which reply is polite.', 'Good morning, Dr Otieno. It is an honour to meet you.', w('M7_IP_REPLY', 'Hi.', 'Okay.', 'Who?'), 'A polite reply uses the title and shows respect.'),
  I('Your friend says: "This is my cousin, Achieng." Which reply is polite.', 'Nice to meet you, Achieng.', w('M7_IP_REPLY', 'Hmm, bye.', 'So what?', 'Okay.'), 'Nice to meet you is a polite reply.'),
];
// ---------------------------------------------------------------- oral narrative techniques
const OT = [
  I('Which helps a storyteller most when the lion roars.', 'a loud, deep voice', w('M7_OT_MONOTONE', 'a flat, even voice', 'a tiny whisper', 'a giggle'), 'The voice should fit the character: a roar is loud and deep.'),
  I('What should a storyteller do just before the surprise.', 'pause for a moment', [['speak faster', 'M7_OT_NO_PAUSE'], ['look at the floor', 'M7_OT_NO_EYE'], ['sit down', 'M7_OT_NO_PAUSE'], ['speak in a flat voice', 'M7_OT_MONOTONE']].slice(0, 3), 'A short pause makes the listeners wait and wonder.'),
  I('Where should a storyteller look.', 'at the listeners', w('M7_OT_NO_EYE', 'at the floor', 'at the ceiling', 'at the window'), 'Eye contact keeps the audience with you.'),
  I('Which technique brings the audience into the story.', 'asking them to repeat the chorus', w('M7_OT_NO_PARTICIPATION', 'reading from a paper', 'speaking without stopping', 'telling the story in a whisper'), 'Audience participation, such as a chorus, makes the listeners part of the story.'),
  I('How can a storyteller show that a character is afraid.', 'step back and make a scared face', w('M7_OT_GESTURE', 'stand still with no expression', 'smile widely', 'sit down'), 'A face and the body show feelings: a scared face, a step back.'),
  I('A giant is walking slowly through the forest. How should the storyteller\'s voice sound.', 'slow and deep', w('M7_OT_MONOTONE', 'fast and high', 'flat and even', 'quick and light'), 'A slow, deep voice suits a big, slow giant.'),
];
const OT_PART = [
  I('How would you tell this part: "The hyena crept up softly."', 'in a slow, soft voice', [['in a loud, fast voice', 'M7_OT_MONOTONE'], ['in a flat voice with no change', 'M7_OT_MONOTONE'], ['while looking at the floor', 'M7_OT_NO_EYE']], 'A soft, slow voice shows creeping.'),
  I('How would you tell this part: "Suddenly the elephant trumpeted!"', 'in a loud voice with a sudden gesture', [['in a whisper with no gesture', 'M7_OT_GESTURE'], ['in a flat voice', 'M7_OT_MONOTONE'], ['while looking at the floor', 'M7_OT_NO_EYE']], 'A loud voice and a sudden gesture show a sudden sound.'),
  I('How would you tell this part: "The old man was very tired."', 'in a slow, weary voice', [['in a bright, fast voice', 'M7_OT_MONOTONE'], ['by shouting', 'M7_OT_MONOTONE'], ['by laughing', 'M7_OT_MONOTONE']], 'A slow, weary voice shows tiredness.'),
  I('How would you tell this part: "The hare ran as fast as he could."', 'in a quick, excited voice', [['in a slow, sleepy voice', 'M7_OT_MONOTONE'], ['in a flat voice', 'M7_OT_MONOTONE'], ['with a long pause after each word', 'M7_OT_NO_PAUSE']], 'A quick voice shows speed.'),
  I('The story has a song with a chorus. What does a good storyteller do.', 'invite the listeners to sing the chorus', [['sing it alone with the eyes closed', 'M7_OT_NO_PARTICIPATION'], ['skip the song', 'M7_OT_NO_PARTICIPATION'], ['read the words from a paper', 'M7_OT_NO_PARTICIPATION']], 'The listeners join in the chorus.'),
  I('How would you tell this part: "Nobody knew what was inside the box."', 'slowly, with a pause before the next line', [['quickly, without stopping', 'M7_OT_NO_PAUSE'], ['in a flat voice', 'M7_OT_MONOTONE'], ['with your back to the listeners', 'M7_OT_NO_EYE']], 'A slow voice and a pause build suspense.'),
];
// ---------------------------------------------------------------- general or specific; specific detail
const SG_KIND = [
  I('Which question asks for the general idea of a talk about Lake Victoria.', 'What is the talk mostly about?', w('M7_SG_GENERAL_SPECIFIC', 'How deep is the lake at its deepest point?', 'In which year was the bridge built?', 'Who was the first fisherman mentioned?'), 'A general question asks what the whole text is about.'),
  I('Which question asks for a specific detail from a talk about a school trip.', 'At what time did the bus leave?', w('M7_SG_SPECIFIC_GENERAL', 'What is the talk mostly about?', 'What is the main idea of the talk?', 'What do you think about the talk?'), 'A specific question asks for a time, a name, a number or a place.'),
  I('Which question asks for the general idea of a radio news item about a flood.', 'What is the news item mostly about?', w('M7_SG_GENERAL_SPECIFIC', 'How many houses were destroyed?', 'On which day did it rain?', 'What is the name of the river?'), 'A general question asks about the whole item.'),
  I('Which question asks for a specific detail from a radio news item about a flood.', 'How many families lost their homes?', w('M7_SG_SPECIFIC_GENERAL', 'What is the news item mostly about?', 'What is the main message?', 'What did the reporter want to say overall?'), 'A specific question has a short, exact answer such as a number.'),
  I('Which question asks for the general idea of a talk on healthy food.', 'What is the speaker\'s main message?', w('M7_SG_GENERAL_SPECIFIC', 'How many fruits did the speaker name?', 'What is the name of the clinic?', 'At what time does the talk end?'), 'A general question asks about the whole talk.'),
  I('Which question asks for a specific detail from an announcement about a sports day.', 'Where will the sports day be held?', w('M7_SG_SPECIFIC_GENERAL', 'What is the announcement mostly about?', 'What is the main idea?', 'What was the point of the announcement?'), 'A specific question asks for a place, a time or a name.'),
];
const SG_DETAIL = [
  I('Listen: "The match started at two and ended at four. Our team scored three goals." At what time did the match end.', 'four o\'clock', [['two o\'clock', 'M7_SG_NEAR_DETAIL'], ['three o\'clock', 'M7_SG_NUMBER_SLIP'], ['five o\'clock', 'M7_SG_NEAR_DETAIL']], 'The match ended at four. Two was the start and three was the goals.'),
  I('Listen: "Forty learners and five teachers went to Nakuru by bus." How many teachers went.', 'five', [['forty', 'M7_SG_NUMBER_SLIP'], ['forty-five', 'M7_SG_NUMBER_SLIP'], ['nine', 'M7_SG_NUMBER_SLIP']], 'Five goes with teachers. Forty goes with learners.'),
  I('Listen: "The festival begins on Friday at the Kisumu Museum and ends on Sunday at the lake." Where does the festival begin.', 'at the Kisumu Museum', [['at the lake', 'M7_SG_NEAR_DETAIL'], ['on Friday', 'M7_SG_NEAR_DETAIL'], ['on Sunday', 'M7_SG_NEAR_DETAIL']], 'The festival begins at the museum. The lake is where it ends.'),
  I('Listen: "Mama bought two kilograms of rice and one kilogram of sugar for 480 shillings." How much sugar did Mama buy.', 'one kilogram', [['two kilograms', 'M7_SG_NUMBER_SLIP'], ['480 shillings', 'M7_SG_NEAR_DETAIL'], ['three kilograms', 'M7_SG_NUMBER_SLIP']], 'One kilogram goes with sugar. Two kilograms goes with rice.'),
  I('Listen: "Mr Otieno will talk about safe water on Monday, and Mrs Wanjiru will talk about hygiene on Tuesday." Who will talk on Tuesday.', 'Mrs Wanjiru', [['Mr Otieno', 'M7_SG_NEAR_DETAIL'], ['a doctor', 'M7_SG_NEAR_DETAIL'], ['the headteacher', 'M7_SG_NEAR_DETAIL']], 'Mrs Wanjiru talks on Tuesday. Mr Otieno talks on Monday.'),
  I('Listen: "The bus leaves at 6 am from the Nakuru stage and reaches Eldoret at noon." Where does the bus leave from.', 'the Nakuru stage', [['Eldoret', 'M7_SG_NEAR_DETAIL'], ['6 am', 'M7_SG_NEAR_DETAIL'], ['noon', 'M7_SG_NEAR_DETAIL']], 'The bus leaves from the Nakuru stage. Eldoret is where it arrives.'),
];
// ---------------------------------------------------------------- polite interruptions
const PI = [
  I('Which is a polite way to interrupt a speaker.', 'Excuse me, may I say something?', w('M7_PI_RUDE', 'Stop! Let me talk now.', 'Be quiet, you are wrong.', 'Move, it is my turn.'), 'Interrupt politely with Excuse me and ask permission.'),
  I('Which is a polite way to ask for a turn in a group talk.', 'May I add a point, please?', w('M7_PI_RUDE', 'Now I talk.', 'You have talked enough.', 'Stop talking.'), 'Ask politely for a turn: May I add a point, please?'),
  I('Someone is in the middle of a sentence. When is the best time to speak.', 'when the speaker pauses', w('M7_PI_NO_WAIT', 'right away', 'while she is still talking', 'when she starts a new sentence'), 'Wait for a pause, then ask for a turn.'),
  I('You must leave the room while a friend is talking. What do you say.', 'Sorry to interrupt, may I be excused?', w('M7_PI_RUDE', 'I am going.', 'Bye.', 'Do not stop for me.'), 'Excuse yourself politely: Sorry to interrupt, may I be excused?'),
  I('After giving your point in a group talk, what do you do.', 'invite the next person to speak', w('M7_PI_TURN_TAKING', 'keep talking', 'ask everyone to be quiet', 'leave the group'), 'Turn taking means each person speaks in turn.'),
  I('The teacher is explaining and you did not understand. What is polite.', 'Please, could you repeat that?', w('M7_PI_RUDE', 'What? Again!', 'You are not clear.', 'I will ask somebody else.'), 'Ask politely: Please, could you repeat that?'),
];
const PI_KIND = [
  I('Is raising a hand slightly to ask for a turn a verbal or a non-verbal cue.', 'non-verbal', [['verbal', 'M7_PI_NON_VERBAL'], ['both', 'M7_PI_NON_VERBAL'], ['neither', 'M7_PI_NON_VERBAL']], 'It is made without words, so it is non-verbal.'),
  I('Is saying "Excuse me" a verbal or a non-verbal cue.', 'verbal', [['non-verbal', 'M7_PI_NON_VERBAL'], ['both', 'M7_PI_NON_VERBAL'], ['neither', 'M7_PI_NON_VERBAL']], 'It is spoken, so it is verbal.'),
  I('Is nodding to show you wish to speak a verbal or a non-verbal cue.', 'non-verbal', [['verbal', 'M7_PI_NON_VERBAL'], ['both', 'M7_PI_NON_VERBAL'], ['neither', 'M7_PI_NON_VERBAL']], 'A nod has no words, so it is non-verbal.'),
  I('Is asking "May I say something?" a verbal or a non-verbal cue.', 'verbal', [['non-verbal', 'M7_PI_NON_VERBAL'], ['both', 'M7_PI_NON_VERBAL'], ['neither', 'M7_PI_NON_VERBAL']], 'It is spoken, so it is verbal.'),
  I('Is leaning forward a little to show you wish to speak a verbal or a non-verbal cue.', 'non-verbal', [['verbal', 'M7_PI_NON_VERBAL'], ['both', 'M7_PI_NON_VERBAL'], ['neither', 'M7_PI_NON_VERBAL']], 'Leaning forward is a body signal with no words.'),
  I('Is saying "Pardon me" a verbal or a non-verbal cue.', 'verbal', [['non-verbal', 'M7_PI_NON_VERBAL'], ['both', 'M7_PI_NON_VERBAL'], ['neither', 'M7_PI_NON_VERBAL']], 'Pardon me is spoken, so it is verbal.'),
];
// ---------------------------------------------------------------- vowel and consonant sounds (to confirm for the accent taught)
const SV_SAME = [
  I('Which word has the same vowel sound as "put".', 'look', w('M7_SV_SPELLING_SAME', 'food', 'moon', 'fruit'), 'Put and look have the short /ʊ/ sound. Food, moon and fruit have the long /uː/.'),
  I('Which word has the same vowel sound as "pool".', 'room', w('M7_SV_SHORT_LONG', 'pull', 'good', 'foot'), 'Pool and room have the long /uː/. Pull, good and foot have the short /ʊ/.'),
  I('Which word has the same vowel sound as "book".', 'good', w('M7_SV_SPELLING_SAME', 'soon', 'spoon', 'tooth'), 'Book and good have the short /ʊ/. Soon, spoon and tooth have the long /uː/.'),
  I('Which word has the same vowel sound as "food".', 'fruit', w('M7_SV_SHORT_LONG', 'foot', 'wood', 'full'), 'Food and fruit have the long /uː/. Foot, wood and full have the short /ʊ/.'),
  I('Which word has the same vowel sound as "pull".', 'wolf', w('M7_SV_SHORT_LONG', 'pool', 'blue', 'rule'), 'Pull and wolf have the short /ʊ/. Pool, blue and rule have the long /uː/.'),
  I('Which word has the same vowel sound as "moon".', 'blue', w('M7_SV_SHORT_LONG', 'wood', 'push', 'cook'), 'Moon and blue have the long /uː/. Wood, push and cook have the short /ʊ/.'),
];
const SV_ODD = [
  I('Which word has a different vowel sound: book, good, moon, foot.', 'moon', w('M7_SV_ODD_ONE', 'book', 'good', 'foot'), 'Book, good and foot have the short /ʊ/. Moon has the long /uː/.'),
  I('Which word has a different vowel sound: cool, school, pull, spoon.', 'pull', w('M7_SV_ODD_ONE', 'cool', 'school', 'spoon'), 'Cool, school and spoon have the long /uː/. Pull has the short /ʊ/.'),
  I('Which word has a different vowel sound: put, wood, cook, food.', 'food', w('M7_SV_ODD_ONE', 'put', 'wood', 'cook'), 'Put, wood and cook have the short /ʊ/. Food has the long /uː/.'),
  I('Which word has a different vowel sound: fruit, blue, true, full.', 'full', w('M7_SV_ODD_ONE', 'fruit', 'blue', 'true'), 'Fruit, blue and true have the long /uː/. Full has the short /ʊ/.'),
  I('Which word has a different vowel sound: push, pool, pull, bull.', 'pool', w('M7_SV_ODD_ONE', 'push', 'pull', 'bull'), 'Push, pull and bull have the short /ʊ/. Pool has the long /uː/.'),
];
const SC_START = [
  I('Which word starts with the sound /v/.', 'van', w('M7_SC_F_V', 'fan', 'fat', 'fish'), 'Van starts with /v/. Fan, fat and fish start with /f/.'),
  I('Which word starts with the sound /f/.', 'five', w('M7_SC_F_V', 'vine', 'van', 'vase'), 'Five starts with /f/. Vine, van and vase start with /v/.'),
  I('Which word ends with the sound /ŋ/.', 'sing', w('M7_SC_N_NG', 'sin', 'win', 'ran'), 'Sing ends with /ŋ/. Sin, win and ran end with /n/.'),
  I('Which word ends with the sound /n/.', 'sun', w('M7_SC_N_NG', 'sung', 'song', 'sang'), 'Sun ends with /n/. Sung, song and sang end with /ŋ/.'),
  I('Which word starts with the sound /r/.', 'right', w('M7_SC_L_R', 'light', 'lamp', 'long'), 'Right starts with /r/. Light, lamp and long start with /l/.'),
  I('Which word starts with the sound /l/.', 'light', w('M7_SC_L_R', 'right', 'run', 'road'), 'Light starts with /l/. Right, run and road start with /r/.'),
  I('Which word starts with the sound /d/.', 'dig', w('M7_SC_T_D', 'tip', 'tin', 'ten'), 'Dig starts with /d/. Tip, tin and ten start with /t/.'),
  I('Which word starts with the sound /t/.', 'ten', w('M7_SC_T_D', 'den', 'dig', 'dust'), 'Ten starts with /t/. Den, dig and dust start with /d/.'),
];
const SC_TRICKY = [
  I('Which word ends with the sound /f/.', 'laugh', w('M7_SC_SPELLING', 'of', 'have', 'move'), 'Laugh ends with /f/. Of, have and move end with /v/.'),
  I('Which word does NOT start with the sound /f/: fish, phone, fan, van.', 'van', w('M7_SC_SPELLING', 'fish', 'phone', 'fan'), 'Fish, phone and fan start with /f/. Van starts with /v/. Ph can say /f/.'),
  I('Which word has the sound /ŋ/.', 'sing', w('M7_SC_N_NG', 'sin', 'sun', 'son'), 'Sing has the sound /ŋ/. There is no separate g sound.'),
  I('Which word ends with the same sound as "tough".', 'enough', w('M7_SC_SPELLING', 'though', 'through', 'thought'), 'Tough and enough end with /f/. The other words end differently.'),
  I('Which word starts with the same sound as "knee".', 'nose', w('M7_SC_SPELLING', 'kite', 'king', 'keep'), 'Knee starts with /n/ because the k is silent. Nose starts with /n/.'),
  I('Which word starts with the sound /f/ even though it is spelt with ph.', 'phone', w('M7_SC_SPELLING', 'pan', 'pen', 'pin'), 'Ph in phone says /f/.'),
];
// ---------------------------------------------------------------- speeches
const SF_OCC = [
  I('At which of these would a speech most likely be given.', 'a school prize-giving day', w('M7_SF_OCCASION', 'a private chat with a friend', 'a game of football', 'a quiet walk home'), 'A speech is given to an audience at an occasion such as a prize-giving.'),
  I('At which of these would a speech most likely be given to welcome a visitor.', 'the school assembly', w('M7_SF_OCCASION', 'the dining hall at lunch', 'a quiet corner of the library', 'the school bus'), 'A speech of welcome is given at an assembly or a gathering.'),
  I('Which of these is an occasion for a speech.', 'a wedding', w('M7_SF_OCCASION', 'buying bread', 'doing homework alone', 'brushing teeth'), 'People give speeches at weddings.'),
  I('Which of these is an occasion for a speech.', 'a funeral', w('M7_SF_OCCASION', 'a lunch break', 'a quiet game', 'a walk in the field'), 'People give speeches at funerals to remember the person.'),
  I('Which of these is an occasion for a speech.', 'a graduation ceremony', w('M7_SF_OCCASION', 'a bus ride alone', 'a nap', 'a trip to the shop'), 'People give speeches at graduations.'),
];
const SF_PART = [
  I('Which part of a speech comes first.', 'the greeting', w('M7_SF_PART_ORDER', 'the thanks', 'the conclusion', 'the body'), 'A speech begins with a greeting.'),
  I('Which part of a speech comes last.', 'the thanks', w('M7_SF_PART_ORDER', 'the greeting', 'the introduction', 'the body'), 'A speech ends with thanks to the audience.'),
  I('Which part of a speech gives the main points.', 'the body', w('M7_SF_PART_ORDER', 'the greeting', 'the thanks', 'the conclusion'), 'The body gives the main points, one by one.'),
  I('Which part of a speech tells the audience what the speech is about.', 'the introduction', w('M7_SF_PART_ORDER', 'the thanks', 'the body', 'the conclusion'), 'The introduction says what the speech is about.'),
  I('Which part of a speech sums up and leaves a final thought.', 'the conclusion', w('M7_SF_PART_ORDER', 'the greeting', 'the introduction', 'the body'), 'The conclusion sums up the speech.'),
  I('Which is the correct order of a speech.', 'greeting, introduction, body, conclusion, thanks', w('M7_SF_PART_ORDER', 'thanks, greeting, introduction, body, conclusion', 'introduction, greeting, body, thanks, conclusion', 'body, greeting, conclusion, introduction, thanks'), 'A speech goes: greeting, introduction, body, conclusion, thanks.'),
];
const SF_DELIV = [
  I('Which is good delivery of a speech.', 'looking at the audience and speaking clearly', w('M7_SF_READING', 'reading it with your eyes on the paper', 'speaking very softly and fast', 'turning your back to the audience'), 'Good delivery means a clear voice and eye contact with the audience.'),
  I('Which tone fits a funeral speech.', 'respectful and calm', w('M7_SF_TONE', 'joking and loud', 'excited and fast', 'angry and sharp'), 'The tone must fit the occasion: respectful at a funeral.'),
  I('Which tone fits a speech at a wedding.', 'warm and cheerful', w('M7_SF_TONE', 'sad and slow', 'angry and sharp', 'bored and flat'), 'The tone must fit the occasion: warm and cheerful at a wedding.'),
  I('How loud should a speech be in a hall.', 'loud enough for the last row to hear', w('M7_SF_READING', 'so soft that only the front row hears', 'a whisper', 'a shout from start to end'), 'Everyone in the hall, even in the last row, must hear.'),
  I('Which helps the audience follow your speech.', 'a steady pace with short pauses', w('M7_SF_READING', 'speaking as fast as possible', 'speaking with no pause at all', 'speaking in a very low voice'), 'A steady pace and short pauses let the audience follow.'),
];
// ---------------------------------------------------------------- interviews
const IN_REASON = [
  I('Why might a learner sit an interview for a scholarship.', 'to be chosen for the scholarship', w('M7_IN_REASON', 'to watch a film', 'to buy books', 'to play a game'), 'An interview helps the panel to choose the learner.'),
  I('Why is an interview held before a school place is given.', 'to find out whether the learner is suited to the school', w('M7_IN_REASON', 'to give the learner a holiday', 'to sell the learner a uniform', 'to teach the learner to swim'), 'The panel finds out about the learner.'),
  I('Why might a person sit an interview for a job.', 'to be chosen for the job', w('M7_IN_REASON', 'to be given a free meal', 'to practise football', 'to watch the panel'), 'An interview helps the employer to choose.'),
  I('Who asks the questions in an interview.', 'the panel', w('M7_IN_REASON', 'the learner', 'the audience', 'the guards'), 'The panel asks, and the candidate answers.'),
  I('What does a candidate do in an interview.', 'answers the questions clearly and politely', w('M7_IN_REASON', 'asks the panel to answer first', 'sits and says nothing', 'reads a newspaper'), 'The candidate answers the panel\'s questions.'),
];
const IN_ANSWER = [
  I('The panel asks: "Why do you want to join this school?" Which answer is best.', 'I want to join because the school has a good library and I love reading.', w('M7_IN_SHORT_ANSWER', 'Because.', 'I do not know.', 'My mother sent me.'), 'Give a reason in a full sentence.'),
  I('The panel asks: "Tell us about yourself." Which answer is best.', 'My name is Atieno. I am twelve and I like Maths and football.', w('M7_IN_SHORT_ANSWER', 'Atieno.', 'Nothing much.', 'What do you want to know?'), 'A good answer gives your name and some details in full sentences.'),
  I('The panel asks: "What are your strengths?" Which answer is best.', 'I work hard and I am ready to learn.', w('M7_IN_CONFIDENT', 'I am the best, nobody is better than me.', 'I have none.', 'I am better than everybody.'), 'A confident answer is modest and honest.'),
  I('The panel asks: "What do you like doing after school?" Which answer is best.', 'I like reading storybooks and helping my mother at home.', w('M7_IN_SHORT_ANSWER', 'Yes.', 'Nothing.', 'Sleeping.'), 'Give a full answer with a reason or detail.'),
  I('The panel asks: "Why should we give you this place?" Which answer is best.', 'I will study hard, follow the rules and make the school proud.', w('M7_IN_SHORT_ANSWER', 'Because I want it.', 'Because you must.', 'I do not know why.'), 'Give reasons that show what you will do.'),
  I('You enter the room for the interview. Which greeting is best.', 'Good morning. Thank you for seeing me.', w('M7_IN_CONFIDENT', 'Hi.', 'Let us start.', 'Be quick.'), 'Greet the panel politely.'),
];
const IN_CLARIFY = [
  I('You did not hear a question. What is the polite thing to say.', 'Could you please repeat the question?', w('M7_IN_CLARIFY', 'What?', 'Say it again.', 'Speak up.'), 'Ask politely for the question to be repeated.'),
  I('You do not understand the word "ambition". What do you say.', 'Excuse me, could you explain the word "ambition"?', w('M7_IN_CLARIFY', 'What is that?', 'I do not know that word.', 'Never heard of it.'), 'Ask politely for an explanation.'),
  I('The panel speaks too fast. What is polite.', 'I beg your pardon, could you speak a little more slowly, please?', w('M7_IN_CLARIFY', 'Slow down.', 'You talk too fast.', 'Ha, what?'), 'Ask politely for a slower pace.'),
  I('You need a moment to think. What is polite.', 'May I have a moment to think about that, please?', w('M7_IN_CLARIFY', 'Wait.', 'I cannot think.', 'Do not hurry me.'), 'Ask politely for a moment.'),
  I('You are not sure which question comes first. What is polite.', 'Sorry, do you mean the first question or the second?', w('M7_IN_CLARIFY', 'Which one?', 'Make up your mind.', 'You asked two.'), 'Ask politely for clarification.'),
];
// ---------------------------------------------------------------- views and opinions
const OP_GAP = [
  I('In my ___, football is the best game.', 'opinion|view', w('M7_OP_PHRASE', 'fact', 'rule', 'answer'), 'In my opinion shows that it is a view, not a fact.'),
  I('As I ___ it, the exam was fair.', 'see', w('M7_OP_PHRASE', 'sees', 'seen', 'seeing'), 'As I see it is an expression that shows a view.'),
  I('I ___ that school uniform is a good idea.', 'believe|think|feel', w('M7_OP_PHRASE', 'am believe', 'believes', 'believing'), 'I believe that shows a view.'),
  I('I see your point, ___ I think differently.', 'but|yet', w('M7_OP_PHRASE', 'because', 'so', 'or'), 'But shows that you disagree politely.'),
  I('I ___ with you because the road is unsafe.', 'agree', w('M7_OP_PHRASE', 'agreeing', 'agrees', 'am agree'), 'I agree with you shows that you share the view.'),
  I('I am sorry, but I ___ with that idea.', 'disagree', w('M7_OP_PHRASE', 'disagreeing', 'disagrees', 'am disagree'), 'I disagree with shows a polite difference of view.'),
];
const OP_FACT = [
  I('Which sentence gives an opinion.', 'In my opinion, football is the best sport.', w('M7_OP_FACT', 'Kenya has 47 counties.', 'Nairobi is the capital of Kenya.', 'Water boils at 100 degrees Celsius.'), 'In my opinion shows a view. The others are facts that can be checked.'),
  I('Which sentence gives a view.', 'I believe that every child should learn to swim.', w('M7_OP_FACT', 'The lake is 20 kilometres wide.', 'The school has 600 learners.', 'Mombasa is on the coast.'), 'I believe that shows a view.'),
  I('Which sentence is a fact.', 'The Nile is the longest river in Africa.', w('M7_OP_FACT', 'I feel that rivers are beautiful.', 'In my view, the Nile is lovely.', 'As I see it, rivers are the best thing in Africa.'), 'A fact can be checked. The others show what someone feels or thinks.'),
  I('Which sentence gives an opinion.', 'As I see it, English is the most useful subject.', w('M7_OP_FACT', 'English is taught in all Kenyan schools.', 'There are eight subjects at our school.', 'The English lesson is at ten.'), 'As I see it shows a view.'),
  I('Which sentence is a fact.', 'Kisumu is on the shore of Lake Victoria.', w('M7_OP_FACT', 'I think Kisumu is the nicest town.', 'In my opinion, Kisumu is the best place to live.', 'I feel that Kisumu is lovely.'), 'It can be checked on a map.'),
  I('Which sentence gives a view.', 'I feel that homework helps us to learn.', w('M7_OP_FACT', 'Homework is given on weekdays.', 'The teacher sets homework at four.', 'Homework is in the bag.'), 'I feel that shows a view.'),
];
const OP_POLITE = [
  I('Which is a polite way to disagree.', 'I see your point, but I think differently.', w('M7_OP_RUDE_DISAGREE', 'That is nonsense.', 'You know nothing.', 'You are wrong, stop talking.'), 'Show respect while you disagree.'),
  I('Your friend says homework is useless. Which reply disagrees politely.', 'I understand why you say that, but I think homework helps us to learn.', w('M7_OP_RUDE_DISAGREE', 'That is silly.', 'You always say foolish things.', 'No, no, no!'), 'Respect the person and give your own view.'),
  I('Which gives a view with a reason.', 'I think school uniform is good because it makes all learners look equal.', w('M7_OP_NO_REASON', 'I think school uniform is bad.', 'School uniform is just so.', 'I do not like uniform.'), 'A good view has a reason after because.'),
  I('Which gives a view with a reason.', 'I believe we should plant more trees because they give us shade and clean air.', w('M7_OP_NO_REASON', 'I believe we should plant trees.', 'Trees are good.', 'Plant trees now.'), 'A good view has a reason after because.'),
  I('Someone shares a view you do not agree with. Which reply is polite.', 'That is an interesting view, but I see it differently.', w('M7_OP_RUDE_DISAGREE', 'What a foolish idea.', 'Nobody agrees with you.', 'Be quiet.'), 'Disagree without insulting the other person.'),
];
// ---------------------------------------------------------------- oral reports
const OR_PART = [
  I('Which part of an oral report comes first.', 'a greeting and what the report is about', [['the end of the event', 'M7_OR_ORDER'], ['thanks for listening', 'M7_OR_ORDER'], ['your opinion of the event', 'M7_OR_OPINION']], 'A report starts with a greeting and says what it is about.'),
  I('Which part comes last in an oral report.', 'a closing and thanks', [['the greeting', 'M7_OR_ORDER'], ['what the report is about', 'M7_OR_ORDER'], ['the first event', 'M7_OR_ORDER']], 'A report ends with a closing and thanks.'),
  I('What does the middle of an oral report tell.', 'what happened, who was there, when and where', [['only your own feelings', 'M7_OR_OPINION'], ['a story that is made up', 'M7_OR_OPINION'], ['a song about the event', 'M7_OR_OPINION']], 'The middle gives the facts of the event.'),
  I('Which questions does an oral report on an event answer.', 'What happened, who was there, when and where?', [['Why do I like it?', 'M7_OR_OPINION'], ['What will happen tomorrow?', 'M7_OR_OPINION'], ['Who is the best?', 'M7_OR_OPINION']], 'An oral report gives the facts about an event that has happened.'),
  I('Which sentence belongs in an oral report on a fire drill.', 'The drill began at ten o\'clock and the whole school reached the field in four minutes.', [['The drill was so boring.', 'M7_OR_OPINION'], ['I hate fire drills.', 'M7_OR_OPINION'], ['Fire is dangerous and I am afraid.', 'M7_OR_OPINION']], 'A report gives the facts, not personal opinions.'),
];
const OR_OPEN = [
  I('Which sentence best opens an oral report on the sports day.', 'Good morning, everyone. I will report on our school sports day, held on Friday.', [['And then the bell rang.', 'M7_OR_CLOSING'], ['That is my report. Thank you.', 'M7_OR_ORDER'], ['Sports day was boring.', 'M7_OR_OPINION']], 'An opening greets the audience and says what the report is about.'),
  I('Which sentence best closes an oral report.', 'That is the end of my report. Thank you for listening.', [['And then the bell rang and', 'M7_OR_CLOSING'], ['Good morning, everyone.', 'M7_OR_ORDER'], ['I will begin now.', 'M7_OR_ORDER']], 'A closing says the report is complete and thanks the audience.'),
  I('Which sentence best opens an oral report on a visit by the Governor.', 'Good afternoon. My report is about the Governor\'s visit to our school on Tuesday.', [['It was a fine day, I think.', 'M7_OR_OPINION'], ['Thank you for listening.', 'M7_OR_ORDER'], ['After that, they left.', 'M7_OR_CLOSING']], 'An opening says what the report is about and when it happened.'),
  I('Which sentence best closes an oral report on a school clean-up.', 'In all, forty learners took part. Thank you for listening.', [['Good afternoon, my report is about a clean-up.', 'M7_OR_ORDER'], ['And then we', 'M7_OR_CLOSING'], ['It was boring.', 'M7_OR_OPINION']], 'A closing gives the end of the report and thanks the listeners.'),
  I('Which sentence best opens an oral report on a class debate.', 'Good morning, classmates. I am going to report on yesterday\'s debate.', [['The debate ended at four.', 'M7_OR_ORDER'], ['I did not like the debate.', 'M7_OR_OPINION'], ['That is all, thank you.', 'M7_OR_ORDER']], 'An opening greets the listeners and says what the report is about.'),
];
const OR_TENSE = [
  I('', 'The principal opened the new library on Monday.', [['The principal open the new library on Monday.', 'M7_OR_TENSE'], ['The principal opening the new library on Monday.', 'M7_OR_TENSE']], 'A report on an event that has finished uses the past tense: opened.'),
  I('', 'Our team won the match by two goals.', [['Our team win the match by two goals.', 'M7_OR_TENSE'], ['Our team winning the match by two goals.', 'M7_OR_TENSE']], 'A finished event is reported in the past tense: won.'),
  I('', 'Forty learners planted trees on Saturday.', [['Forty learners plant trees on Saturday.', 'M7_OR_TENSE'], ['Forty learners planting trees on Saturday.', 'M7_OR_TENSE']], 'The planting has finished, so the past tense: planted.'),
  I('', 'The visitors arrived at nine o\'clock.', [['The visitors arrive at nine o\'clock.', 'M7_OR_TENSE'], ['The visitors arriving at nine o\'clock.', 'M7_OR_TENSE']], 'The arrival has finished, so the past tense: arrived.'),
  I('', 'The learners sang the school song at the end.', [['The learners sing the school song at the end.', 'M7_OR_TENSE'], ['The learners singing the school song at the end.', 'M7_OR_TENSE']], 'The singing has finished, so the past tense: sang.'),
];
// ---------------------------------------------------------------- land travel words
const TRAVEL = [
  I('The matatu ___ collected the fares.', 'conductor|driver', w('M7_TW_PERSON_PLACE', 'terminus', 'timetable', 'luggage'), 'A conductor is the person who collects fares.'),
  I('The ___ from Nakuru to Eldoret is 400 shillings.', 'fare|price|cost', w('M7_TW_FARE_FEE', 'salary', 'wage', 'tax'), 'A fare is the money paid for a journey.'),
  I('Kisumu is our final ___.', 'destination|stop|stage', w('M7_TW_JOURNEY_TRIP', 'route', 'journey', 'timetable'), 'The place you are going to is the destination.'),
  I('The passengers put their ___ on the roof of the bus.', 'luggage|bags|baggage', w('M7_TW_LUGGAGE', 'luggages', 'baggages', 'lugages'), 'Luggage is not counted and has no plural.'),
  I('The bus ___ shows when each bus leaves.', 'timetable|schedule', w('M7_TW_TIMETABLE', 'ticket', 'fare', 'terminus'), 'A timetable lists the times of buses.'),
  I('The long ___ from Mombasa to Nairobi took seven hours.', 'journey|trip|drive|ride', w('M7_TW_JOURNEY_TRIP', 'destination', 'junction', 'terminus'), 'The journey is the travelling from one place to another.'),
  I('At the ___ the road to Kisii turns left.', 'junction|corner|roundabout', w('M7_TW_JOURNEY_TRIP', 'destination', 'journey', 'timetable'), 'A junction is where roads meet.'),
  I('Every ___ must buy a ticket before the train leaves.', 'passenger|traveller', w('M7_TW_PERSON_PLACE', 'conductor', 'terminus', 'timetable'), 'A passenger is a person who travels.'),
  I('This is the quickest ___ to the coast.', 'route|way|road', w('M7_TW_JOURNEY_TRIP', 'destination', 'junction', 'terminus'), 'A route is the way taken to get somewhere.'),
];
// ---------------------------------------------------------------- choosing a text
const ST_PURPOSE = [
  I('You need facts about Kenyan birds. Which book do you choose.', 'A Guide to the Birds of Kenya', [['the book with the nicest cover', 'M7_SX_BY_COVER'], ['the longest novel in the library', 'M7_SX_BY_COVER'], ['a poem called Song of the Sparrow', 'M7_SX_PURPOSE']], 'A guide to the birds of Kenya gives facts on the topic.'),
  I('You want to find out how a pump works. Which is the best text.', 'an illustrated science book on pumps', [['a poem about water', 'M7_SX_PURPOSE'], ['a story about a thirsty hare', 'M7_SX_PURPOSE'], ['a book with a beautiful cover', 'M7_SX_BY_COVER']], 'An illustrated science book gives information on pumps.'),
  I('You want a funny story to read for fun on Saturday. Which do you choose.', 'a short collection of funny stories', [['a dictionary', 'M7_SX_PURPOSE'], ['a map of Africa', 'M7_SX_PURPOSE'], ['a textbook on soil', 'M7_SX_PURPOSE']], 'Stories are read for fun.'),
  I('You must find the meaning of a hard word. Which do you choose.', 'a dictionary', [['an atlas', 'M7_SX_PURPOSE'], ['a storybook', 'M7_SX_PURPOSE'], ['a newspaper', 'M7_SX_PURPOSE']], 'A dictionary gives the meanings of words.'),
  I('You are preparing a talk about the mountains of Kenya. Which is the best source.', 'a non-fiction book about the mountains of Kenya', [['a novel about a girl in Nairobi', 'M7_SX_PURPOSE'], ['a book chosen because it is thick', 'M7_SX_BY_COVER'], ['a recipe book', 'M7_SX_PURPOSE']], 'A non-fiction book on the topic gives the facts for a talk.'),
  I('A Grade 7 learner wants an adventure novel for the weekend. Which suits best.', 'a short adventure novel for young teenagers', [['a picture book for a Grade 1 child', 'M7_SX_LEVEL'], ['a university law book', 'M7_SX_LEVEL'], ['a book of tax tables', 'M7_SX_PURPOSE']], 'The book must suit the reader\'s age and interest.'),
];
const ST_KIND = [
  I('Which of these is a non-fiction text.', 'a book about how rain forms', [['a story about a talking hare', 'M7_SX_FICTION_NON'], ['a poem about a river', 'M7_SX_FICTION_NON'], ['a play about a king', 'M7_SX_FICTION_NON']], 'Non-fiction gives facts about real things.'),
  I('Which of these is fiction.', 'a story about a boy who finds a magic drum', [['a biography of Wangari Maathai', 'M7_SX_FICTION_NON'], ['a news report about a flood', 'M7_SX_FICTION_NON'], ['a science book on the heart', 'M7_SX_FICTION_NON']], 'Fiction is made up.'),
  I('Which of these is a non-fiction text.', 'a news report about the national football team', [['a tale about a hare and a lion', 'M7_SX_FICTION_NON'], ['a novel about a girl who flies', 'M7_SX_FICTION_NON'], ['a story about a magic tree', 'M7_SX_FICTION_NON']], 'A news report gives facts about real events.'),
  I('Which of these is fiction.', 'a short novel about a family of five children', [['a guide to first aid', 'M7_SX_FICTION_NON'], ['an atlas of Africa', 'M7_SX_FICTION_NON'], ['a dictionary', 'M7_SX_FICTION_NON']], 'A novel tells a made-up story.'),
  I('Which of these is a non-fiction text.', 'a magazine article on how to keep bees', [['a folk tale about a clever spider', 'M7_SX_FICTION_NON'], ['a poem about the moon', 'M7_SX_FICTION_NON'], ['a story about talking trees', 'M7_SX_FICTION_NON']], 'An article on keeping bees gives facts.'),
  I('Which of these is fiction.', 'a legend about a brave warrior', [['a textbook on weather', 'M7_SX_FICTION_NON'], ['a diary of a real journey', 'M7_SX_FICTION_NON'], ['a school timetable', 'M7_SX_FICTION_NON']], 'A legend is a made-up or traditional story.'),
];
const ST_RELEVANT = [
  I('You are writing about the dangers of smoking. Which text is most relevant.', 'a health leaflet on how smoking harms the lungs', [['a story about a wedding', 'M7_SX_PURPOSE'], ['a book of riddles', 'M7_SX_PURPOSE'], ['a poem about the moon', 'M7_SX_PURPOSE']], 'The leaflet is about the topic.'),
  I('You are writing about Kenya\'s wildlife. Which text is most relevant.', 'a magazine article on the animals of the Maasai Mara', [['a recipe for ugali', 'M7_SX_PURPOSE'], ['a school timetable', 'M7_SX_PURPOSE'], ['a story about a tailor', 'M7_SX_PURPOSE']], 'The article is about wildlife.'),
  I('You want to learn how to grow kale. Which text is most relevant.', 'a farming guide on growing vegetables', [['a long novel about a king', 'M7_SX_BY_COVER'], ['a book of poems about love', 'M7_SX_PURPOSE'], ['a football magazine', 'M7_SX_PURPOSE']], 'The farming guide covers the topic.'),
  I('You are preparing a talk about the history of Kenya\'s railway. Which is the most relevant.', 'a history book chapter on the building of the railway', [['a book of riddles', 'M7_SX_PURPOSE'], ['a cookery book', 'M7_SX_PURPOSE'], ['a book with a bright cover about animals', 'M7_SX_BY_COVER']], 'The history chapter is on the topic.'),
];
// ---------------------------------------------------------------- trickster narratives
const TK_WHO = [
  I('In a story, Hare fools Lion so that Lion does not eat him. Who is the trickster.', 'Hare', w('M7_TK_HERO', 'Lion', 'the other animals', 'nobody'), 'Hare plays the trick, so Hare is the trickster.'),
  I('In a story, Spider tricks Hyena into giving away all his food. Who is the trickster.', 'Spider', w('M7_TK_HERO', 'Hyena', 'the food', 'the forest'), 'Spider plays the trick, so Spider is the trickster.'),
  I('In a story, a small tortoise tricks a greedy leopard into a pit. Who is fooled.', 'the leopard', w('M7_TK_HERO', 'the tortoise', 'the pit', 'the forest'), 'The leopard is fooled. The tortoise plays the trick.'),
  I('Which character is the trickster in most stories.', 'a clever hare', w('M7_TK_TRICK_FORCE', 'a strong elephant', 'a brave lion', 'a tall giraffe'), 'A trickster wins by being clever, not strong.'),
  I('Who plays the trick in a trickster story.', 'the clever, small character', w('M7_TK_TRICK_FORCE', 'the strongest character', 'the oldest character', 'the character who is fooled'), 'The trickster wins by cleverness.'),
];
const TK_LESSON = [
  I('A greedy hyena is tricked and loses his food. What does the story teach.', 'Greed can lead to trouble.', w('M7_TK_LESSON', 'Cheating is always good.', 'Hyenas are bad.', 'Food is expensive.'), 'The fooled character\'s fault, greed, is the lesson.'),
  I('A proud lion is fooled by a hare because he does not think. What does the story teach.', 'Pride can make us foolish.', w('M7_TK_LESSON', 'Hares are better than lions.', 'Tricks always work.', 'Lions cannot run.'), 'The lion\'s pride made him foolish.'),
  I('Spider tricks his friends to get the biggest share, and in the end nobody trusts him. What does the story teach.', 'Cheating makes people lose trust.', w('M7_TK_LESSON', 'Cheating gets what you want.', 'Spiders are clever.', 'Friends are bad.'), 'Nobody trusts a cheat, which is the lesson.'),
  I('A lazy hare tricks others to do his work, but he is found out. What does the story teach.', 'Laziness and deceit are found out in the end.', w('M7_TK_LESSON', 'Tricks always work.', 'Hard work is foolish.', 'Hares are lazy.'), 'The trick failed in the end, which is the lesson.'),
  I('A tortoise uses wit instead of strength to escape. What does the story teach.', 'Wits can beat strength.', w('M7_TK_LESSON', 'Strength is never needed.', 'Tortoises are fast.', 'Always run away.'), 'The weak tortoise won by using his wits.'),
];
const TK_TRAIT = [
  I('Which words describe a trickster.', 'clever and cunning', w('M7_TK_TRAIT', 'honest and slow', 'strong and silent', 'shy and sleepy'), 'A trickster is quick-witted and cunning.'),
  I('Which animal is often the trickster in East African stories.', 'the hare', w('M7_TK_HERO', 'the elephant', 'the buffalo', 'the lion'), 'Hare is a well-known trickster.'),
  I('How does a trickster usually win.', 'by being clever and using a trick', w('M7_TK_TRICK_FORCE', 'by being the strongest', 'by fighting', 'by being the biggest'), 'A trickster uses wits, not strength.'),
  I('What is a trickster story usually about.', 'a clever character who fools another character', w('M7_TK_HERO', 'a king who wins a war', 'a farmer who plants maize', 'a child who goes to school'), 'A trickster story is about a trick.'),
];
// ---------------------------------------------------------------- parts of a book
const BP_NEED = [
  I('Which part of a book gives a short note, usually on the back cover, about what the book is about.', 'the blurb', w('M7_BP_BLURB', 'the contents page', 'the index', 'the glossary'), 'The blurb is a short note about the book.'),
  I('Where do you find the list of chapters and their page numbers.', 'the contents page', w('M7_BP_CONTENTS_INDEX', 'the index', 'the glossary', 'the blurb'), 'The contents page, at the front, lists the chapters.'),
  I('Which part tells the author\'s name and the publisher.', 'the title page', w('M7_BP_TITLE_PAGE', 'the glossary', 'the index', 'the blurb'), 'The title page gives the title, the author and the publisher.'),
  I('Where would you find the meaning of a hard word used in the book.', 'the glossary', w('M7_BP_GLOSSARY', 'the contents page', 'the title page', 'the blurb'), 'A glossary explains hard words.'),
  I('Where would you look to find all the pages on which a topic is mentioned.', 'the index', w('M7_BP_CONTENTS_INDEX', 'the contents page', 'the blurb', 'the title page'), 'The index, at the back, lists topics and their pages.'),
  I('You want to decide quickly whether a book looks interesting. Which part do you read first.', 'the blurb', w('M7_BP_BLURB', 'the index', 'the glossary', 'the title page'), 'The blurb tells you in a few lines what the book is about.'),
];
const BP_TELLS = [
  I('The contents page tells you ...', 'which chapters the book has and where they start', w('M7_BP_CONTENTS_INDEX', 'what hard words mean', 'who published the book', 'what the book is about in three lines'), 'The contents page lists the chapters and the pages.'),
  I('The index, at the back of a book, tells you ...', 'on which pages a topic is mentioned', w('M7_BP_CONTENTS_INDEX', 'the chapters in order', 'the author\'s name', 'what the book is about'), 'The index lists topics and their pages in alphabetical order.'),
  I('The glossary tells you ...', 'what hard or special words mean', w('M7_BP_GLOSSARY', 'where each chapter starts', 'who wrote the book', 'on which page a topic is found'), 'The glossary explains hard words.'),
  I('The blurb tells you ...', 'in a few lines what the book is about', w('M7_BP_BLURB', 'where each topic is found', 'what hard words mean', 'who published it'), 'The blurb is a short summary.'),
  I('The title page tells you ...', 'the title, the author and often the publisher', w('M7_BP_TITLE_PAGE', 'what hard words mean', 'the list of chapters', 'a short summary'), 'The title page names the book and the people who made it.'),
];
// ---------------------------------------------------------------- reading for information or meaning
const IO_KIND = [
  I('You read a bus timetable to find when the next bus leaves. Which kind of reading is this.', 'reading for information', w('M7_IO_MIXED', 'reading for meaning', 'reading for fun only', 'reading aloud'), 'You look for a fact, so it is reading for information.'),
  I('You read a short story to enjoy it and understand the characters. Which kind of reading is this.', 'reading for meaning', w('M7_IO_STORY_INFO', 'reading for information', 'scanning a list', 'copying out'), 'A story is read for meaning and enjoyment.'),
  I('You read a notice to find the date of the sports day. Which kind of reading is this.', 'reading for information', w('M7_IO_MIXED', 'reading for meaning', 'reading for fun only', 'reading a poem'), 'You look for a fact, so it is reading for information.'),
  I('You read a poem slowly to feel what the poet means. Which kind of reading is this.', 'reading for meaning', w('M7_IO_STORY_INFO', 'reading for information', 'scanning a table', 'checking a date'), 'A poem is read for meaning.'),
  I('You look at a map to find the road to Nakuru. Which kind of reading is this.', 'reading for information', w('M7_IO_MIXED', 'reading for meaning', 'reading for fun only', 'reading a story'), 'You look for a fact, so it is reading for information.'),
  I('You read a novel because you love adventure stories. Which kind of reading is this.', 'reading for meaning and enjoyment', w('M7_IO_STORY_INFO', 'reading for information only', 'scanning a list', 'checking the price'), 'A novel is read for meaning and enjoyment.'),
];
const IO_TASK = [
  I('You need the date on a poster. What is the quickest way to read.', 'look quickly for the date', w('M7_IO_SKIM', 'read every word slowly', 'read it aloud twice', 'read the poster backwards'), 'To find one fact, look quickly for it.'),
  I('You must find the price of a book in a shop list. What do you do.', 'run your eye down the list for the book and its price', w('M7_IO_SKIM', 'read the whole list slowly from the top', 'ask a friend to read it all', 'read only the last line'), 'To find a fact, scan for the key word.'),
  I('You want to understand what a poet is saying. What do you do.', 'read slowly and think about the words', w('M7_IO_MIXED', 'run your eye over it quickly', 'look only for numbers', 'read only the title'), 'To understand meaning, read slowly and think.'),
  I('You want the time a bus leaves from a long timetable. Which way is best.', 'scan for the town name and the time', w('M7_IO_SKIM', 'read the whole timetable like a story', 'read the last page first', 'ask for a summary'), 'To find a fact, scan for the key word.'),
  I('You read a story for enjoyment. What do you do.', 'read it all, following the events and the characters', w('M7_IO_MIXED', 'scan it for one fact', 'read only the first line', 'look only at the pictures'), 'A story is read from beginning to end.'),
];
// ---------------------------------------------------------------- style: dialogue, similes and metaphors
const STY_KIND = [
  I('Which sentence is a metaphor.', 'Time is a thief.', w('M7_ST_SIMILE_METAPHOR', 'He ran like the wind.', 'She is as quiet as a mouse.', 'The tea was as hot as fire.'), 'A metaphor says one thing is another. The others use like or as.'),
  I('Which sentence is a simile.', 'She is as quiet as a mouse.', w('M7_ST_SIMILE_METAPHOR', 'She is a mouse.', 'The mouse is quiet.', 'Her silence is a blanket.'), 'A simile compares with like or as.'),
  I('Which sentence is dialogue.', '"Come here," said Mama.', w('M7_ST_DIALOGUE', 'The sun rose over the hill.', 'Mama called the children.', 'It was a warm evening.'), 'Dialogue is the words that characters say, in quotation marks.'),
  I('Which sentence is a metaphor.', 'The classroom was a zoo.', w('M7_ST_SIMILE_METAPHOR', 'The classroom was as noisy as a zoo.', 'The classroom was noisy.', 'The zoo was big.'), 'A metaphor says the classroom is a zoo.'),
  I('Which sentence is a simile.', 'Her smile was like sunshine.', w('M7_ST_SIMILE_METAPHOR', 'Her smile was sunshine.', 'She smiled.', 'She said, "Hello."'), 'A simile compares with like or as.'),
  I('Which sentence is dialogue.', '"I am coming," shouted Otieno.', w('M7_ST_DIALOGUE', 'Otieno was running to the gate.', 'The gate was open.', 'It was early in the morning.'), 'The words Otieno shouts are dialogue.'),
];
const STY_GAP = [
  I('The boy was as strong ___ an ox.', 'as', w('M7_ST_SIMILE_AS_LIKE', 'like', 'than', 'that'), 'The simile pattern is as strong as.'),
  I('She ran ___ the wind.', 'like', w('M7_ST_SIMILE_AS_LIKE', 'as', 'than', 'then'), 'The simile is ran like the wind.'),
  I('He is as slow ___ a tortoise.', 'as', w('M7_ST_SIMILE_AS_LIKE', 'like', 'than', 'so'), 'The simile pattern is as slow as.'),
  I('Her voice was ___ honey: sweet and smooth.', 'like', w('M7_ST_SIMILE_AS_LIKE', 'such', 'than', 'so'), 'The simile is her voice was like honey.'),
  I('The old man is as wise ___ an owl.', 'as', w('M7_ST_SIMILE_AS_LIKE', 'like', 'than', 'that'), 'The simile pattern is as wise as.'),
  I('The stars were ___ diamonds in the sky.', 'like', w('M7_ST_SIMILE_AS_LIKE', 'such', 'than', 'so'), 'The simile is the stars were like diamonds.'),
];
const STY_MEAN = [
  I('In "the classroom was a zoo", what does the writer mean.', 'the class was noisy and wild', w('M7_ST_LITERAL_METAPHOR', 'there were animals in it', 'the school was closed', 'the class was empty'), 'A metaphor shows what something is like: noisy and wild.'),
  I('In "life is a journey", what does the writer mean.', 'life has a beginning, a path and an end', w('M7_ST_LITERAL_METAPHOR', 'life is a long walk by road', 'life is a trip by bus', 'life is a holiday'), 'A metaphor compares life to a journey.'),
  I('In "the moon is a silver coin", what does the writer mean.', 'the moon is round and shiny', w('M7_ST_LITERAL_METAPHOR', 'the moon is made of money', 'the moon can be spent', 'the moon is cold'), 'The moon is compared to a coin to show it is round and shiny.'),
  I('In "Kamau is a lion on the field", what does the writer mean.', 'Kamau is brave and strong in the game', w('M7_ST_LITERAL_METAPHOR', 'Kamau is an animal', 'Kamau is hungry', 'Kamau is lost'), 'Kamau is compared to a lion to show he is brave and strong.'),
  I('In "her words were daggers", what does the writer mean.', 'her words hurt', w('M7_ST_LITERAL_METAPHOR', 'she carried knives', 'she spoke very softly', 'she was afraid'), 'The words are compared to daggers because they hurt.'),
];
// ---------------------------------------------------------------- visuals (small tables written out in the question)
const T1 = 'Mangoes sold: Achieng: Monday 12, Tuesday 15, Wednesday 9. Otieno: Monday 8, Tuesday 20, Wednesday 11.';
const T2 = 'Learners in each grade: Grade 5: 38. Grade 6: 42. Grade 7: 45. Grade 8: 40.';
const V_NEED = [
  I('Which visual best compares the number of learners in four classes.', 'a bar graph', w('M7_VI_WRONG_VISUAL', 'a map', 'a timeline', 'a diagram of a flower'), 'A bar graph compares amounts.'),
  I('Which visual best shows how a plant takes in water.', 'a diagram', w('M7_VI_WRONG_VISUAL', 'a bar graph', 'a timetable', 'a map'), 'A diagram shows how something works.'),
  I('Which visual best shows the way from the school to the market.', 'a map', w('M7_VI_WRONG_VISUAL', 'a pie chart', 'a bar graph', 'a timeline'), 'A map shows places and routes.'),
  I('Which visual best shows the main events of a person\'s life in the order they happened.', 'a timeline', w('M7_VI_WRONG_VISUAL', 'a map', 'a pie chart', 'a diagram'), 'A timeline shows events in order of time.'),
  I('Which visual best shows what share of a family\'s money goes to food, rent and school fees.', 'a pie chart', w('M7_VI_WRONG_VISUAL', 'a timeline', 'a map', 'a diagram of a flower'), 'A pie chart shows parts of a whole.'),
  I('Which visual best lists the prices of different items in rows and columns.', 'a table', w('M7_VI_WRONG_VISUAL', 'a map', 'a pie chart', 'a timeline'), 'A table lists facts in rows and columns.'),
];
const V_KEY = [
  I('What should you read first when you look at a chart.', 'the title and the headings', w('M7_VI_KEY_TITLE', 'the smallest number', 'the last row', 'the biggest bar only'), 'The title and the headings tell what the figures mean.'),
  I('A bar graph has a key that shows blue for girls and green for boys. Why read the key.', 'to know what each colour stands for', w('M7_VI_KEY_TITLE', 'to find the biggest bar', 'to count the bars', 'to find the title'), 'The key tells what the colours or signs mean.'),
  I('What does the title of a table tell you.', 'what the table is about', w('M7_VI_KEY_TITLE', 'who made the table', 'which number is biggest', 'how many rows it has'), 'The title says what the table is about.'),
  I('What do the headings of the columns in a table tell you.', 'what each column of figures is about', w('M7_VI_KEY_TITLE', 'which figure is largest', 'who wrote the table', 'how old the table is'), 'The headings tell you what each column shows.'),
  I('A pie chart has a key: red is rent, blue is food, green is school fees. What does the key help you do.', 'know which slice is which', w('M7_VI_KEY_TITLE', 'find the biggest number', 'count the slices only', 'choose the title'), 'The key tells what each colour stands for.'),
];
const V_TABLE = [
  I(`Read the table. ${T1} How many mangoes did Achieng sell on Tuesday.`, '15', [['12', 'M7_VI_ROW_COLUMN'], ['20', 'M7_VI_ROW_COLUMN'], ['9', 'M7_VI_ROW_COLUMN']], 'Achieng\'s Tuesday figure is 15.'),
  I(`Read the table. ${T1} How many mangoes did Otieno sell on Wednesday.`, '11', [['9', 'M7_VI_ROW_COLUMN'], ['8', 'M7_VI_ROW_COLUMN'], ['20', 'M7_VI_ROW_COLUMN']], 'Otieno\'s Wednesday figure is 11.'),
  I(`Read the table. ${T1} How many mangoes did Achieng sell in all.`, '36', [['15', 'M7_VI_TOTAL_PART'], ['12', 'M7_VI_TOTAL_PART'], ['39', 'M7_VI_ROW_COLUMN']], '12 + 15 + 9 = 36. The total needs all three days.'),
  I(`Read the table. ${T1} How many mangoes did Otieno sell in all.`, '39', [['20', 'M7_VI_TOTAL_PART'], ['8', 'M7_VI_TOTAL_PART'], ['36', 'M7_VI_ROW_COLUMN']], '8 + 20 + 11 = 39. The total needs all three days.'),
  I(`Read the table. ${T1} On which day did Otieno sell the most mangoes.`, 'Tuesday', [['Monday', 'M7_VI_ROW_COLUMN'], ['Wednesday', 'M7_VI_ROW_COLUMN'], ['Achieng', 'M7_VI_ROW_COLUMN']], 'Otieno sold 20 on Tuesday, more than on the other days.'),
  I(`Read the table. ${T2} Which grade has the most learners.`, 'Grade 7', [['Grade 5', 'M7_VI_ROW_COLUMN'], ['Grade 6', 'M7_VI_ROW_COLUMN'], ['Grade 8', 'M7_VI_ROW_COLUMN']], 'Grade 7 has 45, the highest figure.'),
  I(`Read the table. ${T2} How many learners are in Grade 6.`, '42', [['38', 'M7_VI_ROW_COLUMN'], ['45', 'M7_VI_ROW_COLUMN'], ['40', 'M7_VI_ROW_COLUMN']], 'Grade 6 has 42 learners.'),
  I(`Read the table. ${T2} How many learners are there in the four grades altogether.`, '165', [['45', 'M7_VI_TOTAL_PART'], ['38', 'M7_VI_TOTAL_PART'], ['42', 'M7_VI_TOTAL_PART']], '38 + 42 + 45 + 40 = 165.'),
];
// ---------------------------------------------------------------- making notes
const NM_MAIN = [
  I('A text says: "Recycling saves resources and cuts waste. A plastic bottle can take 450 years to break down." Which is the main point.', 'Recycling saves resources and cuts waste.', [['A plastic bottle takes 450 years to break down.', 'M7_NM_DETAIL_MAIN'], ['Bottles are made of plastic.', 'M7_NM_DETAIL_MAIN'], ['Years pass slowly.', 'M7_NM_DETAIL_MAIN']], 'The main point covers the whole text. The bottle is a detail that supports it.'),
  I('A text says: "Regular exercise keeps the body fit. Running, football and swimming are good examples." Which is the main point.', 'Regular exercise keeps the body fit.', [['Swimming is a good example.', 'M7_NM_DETAIL_MAIN'], ['Football is played with a ball.', 'M7_NM_DETAIL_MAIN'], ['Running is fast.', 'M7_NM_DETAIL_MAIN']], 'The main point is that exercise keeps the body fit. The sports are examples.'),
  I('A text says: "Trees are important. They give shade, clean the air and hold the soil." Which is the main point.', 'Trees are important.', [['Trees give shade.', 'M7_NM_DETAIL_MAIN'], ['Soil can be held.', 'M7_NM_DETAIL_MAIN'], ['The air can be cleaned.', 'M7_NM_DETAIL_MAIN']], 'The main point is that trees are important. The three uses support it.'),
  I('A text says: "Reading helps us in many ways. It builds our vocabulary and it improves our spelling." Which is a supporting point.', 'It builds our vocabulary.', [['Reading helps us in many ways.', 'M7_NM_DETAIL_MAIN'], ['Reading is a hobby.', 'M7_NM_DETAIL_MAIN'], ['Books are in the library.', 'M7_NM_DETAIL_MAIN']], 'The main point is that reading helps in many ways. Vocabulary is a supporting point.'),
  I('A text says: "Rainwater harvesting is useful. It saves money and it gives water in the dry season." Which is a supporting point.', 'It gives water in the dry season.', [['Rainwater harvesting is useful.', 'M7_NM_DETAIL_MAIN'], ['Rain falls in April.', 'M7_NM_DETAIL_MAIN'], ['Water is wet.', 'M7_NM_DETAIL_MAIN']], 'Water in the dry season is a supporting point of the main point that harvesting is useful.'),
];
const NM_BEST = [
  I('A text says: "Malaria is spread by mosquitoes. People can protect themselves by sleeping under nets and by clearing stagnant water." Which notes are best.', 'Malaria: spread by mosquitoes. Protect: nets, clear stagnant water.', [['Malaria is spread by mosquitoes and people can protect themselves by sleeping under nets and by clearing stagnant water.', 'M7_NM_COPY'], ['Malaria: mosquitoes.', 'M7_NM_MISS_MAIN'], ['Malaria is a sickness that kills many people in Africa every year.', 'M7_NM_ADDS']], 'Good notes keep all the main points in a few words.'),
  I('A text says: "The railway linked Mombasa and Kisumu. It carried goods and passengers and helped towns to grow." Which notes are best.', 'Railway: Mombasa to Kisumu. Carried goods, passengers. Towns grew.', [['The railway linked Mombasa and Kisumu. It carried goods and passengers and helped towns to grow.', 'M7_NM_COPY'], ['Railway: Mombasa.', 'M7_NM_MISS_MAIN'], ['The railway was built by clever engineers who worked very hard.', 'M7_NM_ADDS']], 'Good notes keep the main points and use key words.'),
  I('A text says: "Kale is cheap and healthy. It grows quickly and can be picked all year." Which notes are best.', 'Kale: cheap, healthy. Grows quickly, picked all year.', [['Kale is cheap and healthy and it grows quickly and can be picked all year.', 'M7_NM_COPY'], ['Kale: cheap.', 'M7_NM_MISS_MAIN'], ['Kale is the best vegetable in the world.', 'M7_NM_ADDS']], 'Good notes keep all the main points in short form.'),
  I('A text says: "The school library opens at eight. Learners may borrow two books for one week. Late books cost ten shillings a day." Which notes are best.', 'Library: opens 8. Borrow 2 books, 1 week. Late: 10 shillings a day.', [['The school library opens at eight and learners may borrow two books for one week and late books cost ten shillings a day.', 'M7_NM_COPY'], ['Library: 8.', 'M7_NM_MISS_MAIN'], ['The library is a lovely quiet place with many shelves.', 'M7_NM_ADDS']], 'Good notes keep the times and numbers that matter in a few words.'),
];

// ---------------------------------------------------------------- dilemma narratives
const DL_CLOSE = [
  I('Which is a closing formula of a dilemma narrative.', 'Who do you think was right?', [['What time is it?', 'M7_DL_CLOSING_FORMULA'], ['And they lived happily ever after.', 'M7_DL_LESSON_ENDING'], ['This story teaches us to be honest.', 'M7_DL_LESSON_ENDING']], 'The closing formula puts the hard choice to the listeners.'),
  I('How does a dilemma narrative end.', 'with a hard question put to the listeners', [['with the narrator telling the lesson', 'M7_DL_LESSON_ENDING'], ['with a joke', 'M7_DL_CLOSING_FORMULA'], ['with a song about the weather', 'M7_DL_CLOSING_FORMULA']], 'A dilemma narrative ends by asking the listeners to decide.'),
  I('A dilemma narrative ends: "Whom would you choose, the one who saved the child or the one who paid for the school?" What is this part called.', 'the closing formula', [['the title', 'M7_DL_CLOSING_FORMULA'], ['the opening', 'M7_DL_CLOSING_FORMULA'], ['the moral', 'M7_DL_LESSON_ENDING']], 'It is the question that closes the story and puts the dilemma to the listeners.'),
  I('Which question could end a dilemma narrative.', 'What would you have done?', [['How tall is the hill?', 'M7_DL_CLOSING_FORMULA'], ['Where is the river?', 'M7_DL_CLOSING_FORMULA'], ['Who wrote this?', 'M7_DL_CLOSING_FORMULA']], 'A closing formula asks the listeners what they would do or who was right.'),
  I('In a dilemma narrative, who gives the final answer.', 'the listeners decide', [['the narrator gives the answer', 'M7_DL_LESSON_ENDING'], ['the king gives the answer', 'M7_DL_LESSON_ENDING'], ['nobody ever answers', 'M7_DL_CLOSING_FORMULA']], 'The dilemma is left to the listeners to discuss and decide.'),
];
const DL_KIND = [
  I('Which story is a dilemma narrative.', 'Two brothers each had a good reason to claim the same field, and the listeners are asked who should have it.', [['A hare tricked a lion and escaped.', 'M7_DL_NO_DILEMMA'], ['A girl found a purse and returned it, and was rewarded.', 'M7_DL_NO_DILEMMA'], ['The sun rose over the village.', 'M7_DL_NO_DILEMMA']], 'A dilemma narrative puts a hard choice to the listeners where both sides have good reasons.'),
  I('Which story is a dilemma narrative.', 'A man could save only one of two people, his friend or a stranger who had once saved his life, and the listeners are asked whom he should save.', [['A boy cleaned a well and the village was happy.', 'M7_DL_NO_DILEMMA'], ['A spider fooled a hyena and ate his food.', 'M7_DL_NO_DILEMMA'], ['Rain fell, and the maize grew tall.', 'M7_DL_NO_DILEMMA']], 'The man has two hard choices, and the listeners must decide.'),
  I('Which story is a dilemma narrative.', 'A mother had one loaf of bread for her two hungry children, and the listeners are asked how she should divide it.', [['A fisherman caught a big fish and sold it.', 'M7_DL_NO_DILEMMA'], ['The moon rose over the lake.', 'M7_DL_NO_DILEMMA'], ['A girl sang to a river and saved her village.', 'M7_DL_NO_DILEMMA']], 'The mother has a hard choice, and the listeners decide.'),
  I('Which story is NOT a dilemma narrative.', 'A clever tortoise tricked a leopard and the leopard was punished.', [['A chief could give a prize to only one of two brave warriors, and the listeners are asked to choose.', 'M7_DL_NO_DILEMMA'], ['A judge had to decide between two honest traders, and the listeners are asked who was right.', 'M7_DL_NO_DILEMMA'], ['A child had to choose between telling the truth and saving a friend, and the listeners are asked what to do.', 'M7_DL_NO_DILEMMA']], 'The tortoise story has a clear ending. The others leave a hard choice to the listeners.'),
];
// ---------------------------------------------------------------- praise songs
const PR_PURPOSE = [
  I('What is the main purpose of a praise song.', 'to honour a person for what he or she has done', w('M7_PRS_PURPOSE', 'to insult a person', 'to teach arithmetic', 'to sell goods'), 'A praise song honours a person.'),
  I('At which occasion is a praise song most likely sung.', 'at a wedding or a victory celebration', w('M7_PRS_OCCASION', 'at a quarrel', 'in a quiet library', 'while doing homework'), 'Praise songs are sung at ceremonies and celebrations.'),
  I('Why does a praise song say the runner is faster than the wind.', 'to show great admiration', w('M7_PRS_EXAGGERATION', 'because it is exactly true', 'to confuse the listeners', 'to give directions'), 'Praise songs use exaggeration to show admiration.'),
  I('Which feature is common in praise songs.', 'praise names and exaggeration', w('M7_PRS_PURPOSE', 'a list of facts and figures', 'instructions for a recipe', 'a dialogue between two buyers'), 'Praise songs use praise names and exaggeration.'),
  I('Which person is most likely to be honoured with a praise song.', 'a champion runner who has won a race for the village', w('M7_PRS_PURPOSE', 'a thief caught stealing', 'a stranger nobody knows', 'a broken bicycle'), 'A praise song honours someone who has done something admirable.'),
];
const PR_WHO = [
  I('A poet sings a praise song for Chief Wambua. Who is the singer.', 'the poet', w('M7_PRS_WHO', 'Chief Wambua', 'the audience', 'the village'), 'The poet sings. The chief is the one praised.'),
  I('A poet sings a praise song for the winner of a race. Who is praised.', 'the winner', w('M7_PRS_WHO', 'the poet', 'the runners who lost', 'the crowd'), 'The winner is praised. The poet is the singer.'),
  I('In a wedding praise song for the bride, who is the subject of the song.', 'the bride', w('M7_PRS_WHO', 'the singer', 'the guests', 'the cook'), 'The bride is honoured in the song.'),
  I('A young man sings a praise song for his grandmother. Who is honoured.', 'the grandmother', w('M7_PRS_WHO', 'the young man', 'the audience', 'the singer\'s friends'), 'The grandmother is the one honoured.'),
];
const PR_LINE = [
  I('Which line is from a praise song for a strong wrestler.', 'He is the mountain that no hand can move.', w('M7_PRS_PURPOSE', 'He eats breakfast at seven.', 'He sits quietly in the corner.', 'He is a wrestler.'), 'A praise song uses exaggeration and pictures to honour strength.'),
  I('Which of these is a praise name.', 'Lion of the Plains', w('M7_PRS_PURPOSE', 'Mr Otieno', 'the man next door', 'the tall one'), 'A praise name honours a person with a picture such as a lion.'),
  I('Which line praises a good teacher.', 'She pours knowledge like rain on dry land.', w('M7_PRS_PURPOSE', 'She arrives at eight every day.', 'She has a blue car.', 'She sits at a brown desk.'), 'A praise line honours what the person does for others.'),
  I('Which line praises a brave rescuer.', 'He ran into the flames and the flames feared him.', w('M7_PRS_PURPOSE', 'He wore a red shirt.', 'He lives near the market.', 'He likes tea.'), 'A praise line honours bravery with strong pictures.'),
];

// ---------------------------------------------------------------- reading strategies and fluency
const RS_USE = [
  I('You want to find one name quickly in a long text. Which strategy is best.', 'scanning', [['skimming', 'M7_RS_SKIM_SCAN'], ['reading every word aloud', 'M7_RS_WRONG'], ['guessing', 'M7_RS_WRONG']], 'Scanning means running your eyes over a text to find one name, number or fact.'),
  I('You want a quick idea of what a text is about. Which strategy is best.', 'skimming', [['scanning for one name', 'M7_RS_SKIM_SCAN'], ['reading every word slowly', 'M7_RS_WRONG'], ['reading only the last word', 'M7_RS_WRONG']], 'Skimming means reading quickly to get the general idea.'),
  I('Which strategy helps you to guess what happens next.', 'predicting from the title and the clues', [['skipping the story', 'M7_RS_WRONG'], ['scanning for a number', 'M7_RS_SKIM_SCAN'], ['reading the last page first', 'M7_RS_WRONG']], 'Predicting uses the title and the clues to guess what comes next.'),
  I('You do not understand a sentence. Which strategy helps.', 'reading it again with the words around it', [['skipping it', 'M7_RS_WRONG'], ['guessing wildly', 'M7_RS_WRONG'], ['stopping to read', 'M7_RS_WRONG']], 'Rereading and using the words around it often makes the sense clear.'),
  I('Which strategy helps you to remember what you read.', 'asking yourself questions and making notes', [['reading as fast as possible', 'M7_RS_WRONG'], ['reading with your eyes closed', 'M7_RS_WRONG'], ['reading the title only', 'M7_RS_WRONG']], 'Asking questions and making notes helps you to remember.'),
  I('You want the date of a school event in a long notice. Which strategy is best.', 'scanning for the date', [['skimming for the general idea', 'M7_RS_SKIM_SCAN'], ['reading every line aloud', 'M7_RS_WRONG'], ['guessing the date', 'M7_RS_WRONG']], 'To find one fact, scan the text for it.'),
];
const RS_NAME = [
  I('Reading the title, the pictures and the first lines to get the general idea is called what.', 'skimming', [['scanning', 'M7_RS_SKIM_SCAN'], ['memorising', 'M7_RS_WRONG'], ['copying', 'M7_RS_WRONG']], 'Skimming gives the general idea.'),
  I('Running your eyes down a page to find a particular word, name or number is called what.', 'scanning', [['skimming', 'M7_RS_SKIM_SCAN'], ['memorising', 'M7_RS_WRONG'], ['predicting', 'M7_RS_WRONG']], 'Scanning looks for one particular thing.'),
  I('Using the title and the clues to say what will happen next is called what.', 'predicting', [['scanning', 'M7_RS_SKIM_SCAN'], ['copying', 'M7_RS_WRONG'], ['skipping', 'M7_RS_WRONG']], 'Predicting is guessing what comes next from clues.'),
  I('Reading a hard sentence again is called what.', 'rereading', [['skimming', 'M7_RS_SKIM_SCAN'], ['skipping', 'M7_RS_WRONG'], ['scanning', 'M7_RS_SKIM_SCAN']], 'Rereading is reading something again to understand it better.'),
  I('Which reader is skimming.', 'Atieno reads the headings and the first lines to see what the text is about.', [['Juma looks down the page for a telephone number.', 'M7_RS_SKIM_SCAN'], ['Peter reads each word slowly three times.', 'M7_RS_WRONG'], ['Mary closes the book.', 'M7_RS_WRONG']], 'Reading headings and first lines to get the idea is skimming.'),
];
const FL_USE = [
  I('Which helps you to read with expression.', 'changing your voice to show feelings and pausing at full stops', [['reading every word in the same flat voice', 'M7_FL_FLAT'], ['reading as fast as you can', 'M7_FL_FAST'], ['whispering all the words', 'M7_FL_FLAT']], 'Expression means the voice shows the meaning.'),
  I('Which is a way to read more fluently.', 'reading the same short text several times', [['reading one word at a time', 'M7_FL_WORD'], ['stopping at every difficult word', 'M7_FL_WORD'], ['skipping every difficult word', 'M7_FL_FAST']], 'Reading a text again makes it smoother.'),
  I('What should you do at a comma when you read aloud.', 'make a short pause', [['stop for a long time', 'M7_FL_WORD'], ['speed up', 'M7_FL_FAST'], ['read louder', 'M7_FL_FLAT']], 'A comma is a short pause. A full stop is a longer one.'),
  I('You read the question "Are you coming?" aloud. What should your voice do at the end.', 'rise', [['fall', 'M7_FL_FLAT'], ['stay flat', 'M7_FL_FLAT'], ['go silent', 'M7_FL_FLAT']], 'A voice usually rises at the end of a yes or no question.'),
  I('Which is reading at the right speed.', 'not too fast and not too slow, so that the listener can follow', [['as fast as possible', 'M7_FL_FAST'], ['very slowly, one word at a time', 'M7_FL_WORD'], ['fast and slow in bursts', 'M7_FL_FAST']], 'The right speed lets the listener follow the meaning.'),
  I('Reading "in the morning" as one group of words rather than three separate words is a way to read ...', 'in phrases', [['one word at a time', 'M7_FL_WORD'], ['too fast', 'M7_FL_FAST'], ['in a flat voice', 'M7_FL_FLAT']], 'Reading words in groups, or phrases, makes reading smoother.'),
];
const FL_WHO = [
  I('Which reader reads with expression.', 'Amina changes her voice for each character and pauses at full stops.', [['Juma reads every word in a flat voice.', 'M7_FL_FLAT'], ['Peter reads so fast that nobody understands.', 'M7_FL_FAST'], ['Mary stops at every word.', 'M7_FL_WORD']], 'Changing the voice and pausing at full stops is expressive reading.'),
  I('Which reader reads at the right speed.', 'Kamau reads steadily so that the class can follow.', [['Njeri reads as fast as she can.', 'M7_FL_FAST'], ['Baraka reads one word at a time.', 'M7_FL_WORD'], ['Atieno reads without any feeling.', 'M7_FL_FLAT']], 'A steady speed lets the listeners follow.'),
  I('Which reader reads fluently.', 'Wanjiru reads in phrases and pauses at the commas.', [['Otieno stops at every hard word.', 'M7_FL_WORD'], ['Achieng reads so fast that she skips words.', 'M7_FL_FAST'], ['Juma reads in one flat voice.', 'M7_FL_FLAT']], 'Reading in phrases with pauses at commas is fluent.'),
  I('Which reader is NOT reading fluently.', 'Peter reads one word at a time and stops after each.', [['Amina reads in phrases with expression.', 'M7_FL_WORD'], ['Kamau reads steadily and clearly.', 'M7_FL_WORD'], ['Wanjiru pauses at the commas.', 'M7_FL_WORD']], 'Reading one word at a time with a stop after each word is not fluent.'),
];
const H = (a, b) => [a, b];
export const FAMILIES = [
  C('intro.polite', 'choose-polite', 'LISTEN.T1.INTRO_POLITE', IP, { hints: H('A polite introduction asks permission and uses a title for an older person.', 'Name the more senior person first.'), oc: 'a' }),
  SP('intro.polite', 'LISTEN.T1.INTRO_POLITE', IP, { topic: 'for four introductions', hints: H('Which introduction is blunt or has no polite words?', 'A polite introduction uses please, may I or a title.'), oc: 'a' }),
  C('intro.reply', 'choose-reply', 'LISTEN.T1.INTRO_POLITE', IP_REPLY, { hints: H('A polite reply greets the person and shows you are glad to meet them.', 'Pleased to meet you and Nice to meet you are polite replies.'), oc: 'a', rung: 2 }),
  C('oral.technique', 'choose-technique', 'LISTEN.T2.ORAL_TECHNIQUES', OT, { hints: H('A storyteller uses the voice, pauses, gestures and eye contact.', 'The voice should fit the character or the event.'), oc: 'a' }),
  C('oral.part', 'choose-best-way-to-tell', 'LISTEN.T2.ORAL_TECHNIQUES', OT_PART, { hints: H('Think what the part of the story feels like: soft, fast, loud, slow?', 'Choose the way of telling that fits the part.'), oc: 'a', rung: 2 }),
  C('listen.kind', 'general-or-specific', 'LISTEN.T4.SPECIFIC_GENERAL', SG_KIND, { hints: H('A general question asks what the whole text is about.', 'A specific question asks for a name, a number, a place or a time.'), oc: 'a' }),
  C('listen.detail', 'choose-detail', 'LISTEN.T4.SPECIFIC_GENERAL', SG_DETAIL, { hints: H('Match the question word: what time, how many, where, who.', 'The detail you want is joined to the noun in the question.'), oc: 'b', rung: 2 }),
  C('interrupt.polite', 'choose-polite-interruption', 'LISTEN.T6.POLITE_INTERRUPT', PI, { hints: H('Interrupt with Excuse me and ask for permission.', 'Wait for a pause and give others a turn.'), oc: 'a' }),
  C('interrupt.cue', 'verbal-or-nonverbal', 'LISTEN.T6.POLITE_INTERRUPT', PI_KIND, { hints: H('A verbal cue is said in words. A non-verbal cue is made without words.', 'A raised hand, a nod and leaning forward are non-verbal.'), oc: 'a', rung: 2 }),
  C('sound.vowel', 'pick-same-sound', 'LISTEN.T9.SOUNDS_VOWELS', SV_SAME, { hints: H('Say each word aloud and listen to the vowel, not the spelling.', 'The sound /ʊ/ is short (put). The sound /uː/ is long (food).'), oc: 'b' }),
  C('sound.vowelodd', 'find-odd-sound', 'LISTEN.T9.SOUNDS_VOWELS', SV_ODD, { hints: H('Say all four words aloud and listen to the vowel.', 'Three words have one sound and one word has another.'), oc: 'b', rung: 2 }),
  C('sound.start', 'pick-same-sound', 'LISTEN.T14.SOUNDS_CONSONANTS', SC_START, { hints: H('Say each word aloud and listen to the first or last sound.', 'Touch your throat: /v/ and /d/ make it shake; /f/ and /t/ do not.'), oc: 'a' }),
  C('sound.tricky', 'sound-or-spelling', 'LISTEN.T14.SOUNDS_CONSONANTS', SC_TRICKY, { hints: H('The sound is not always the same as the letter.', 'Say the words aloud and listen.'), oc: 'a', rung: 2 }),
  C('speech.occasion', 'choose-occasion', 'LISTEN.T10.SPEECH_FEATURES', SF_OCC, { hints: H('A speech is given to an audience at an occasion.', 'Think of a gathering with many listeners.'), oc: 'a' }),
  C('speech.part', 'choose-part-of-speech', 'LISTEN.T10.SPEECH_FEATURES', SF_PART, { hints: H('A speech goes: greeting, introduction, body, conclusion, thanks.', 'The body gives the main points.'), oc: 'a', rung: 2 }),
  C('speech.delivery', 'choose-delivery', 'LISTEN.T10.SPEECH_FEATURES', SF_DELIV, { hints: H('Look at the audience, speak clearly and let the tone fit the occasion.', 'Do not read with your eyes on the paper.'), oc: 'b', rung: 2 }),
  C('interview.reason', 'choose-reason', 'LISTEN.T11.INTERVIEW_KNOW', IN_REASON, { hints: H('An interview helps a panel to choose a person.', 'The panel asks, and the candidate answers.'), oc: 'a' }),
  C('interview.answer', 'choose-best-answer', 'LISTEN.T11.INTERVIEW_KNOW', IN_ANSWER, { hints: H('A good answer is a full sentence with a reason.', 'Be confident, but modest and polite.'), oc: 'a', rung: 2 }),
  C('interview.clarify', 'ask-for-clarification', 'LISTEN.T11.INTERVIEW_KNOW', IN_CLARIFY, { hints: H('Ask politely: Could you please ...? I beg your pardon ...', 'Do not say What? or tell the panel to hurry or slow down.'), oc: 'a', rung: 2 }),
  ...P('opinion', 'LISTEN.T12.OPINION_PHRASES', OP_GAP, { hints: H('Expressions that show a view: in my opinion, I believe that, as I see it.', 'I see your point, but ... disagrees politely.'), topic: 'with views and opinions', oc: ['a', 'b', 'b'], thinOk: true }),
  C('opinion.fact', 'view-or-fact', 'LISTEN.T12.OPINION_PHRASES', OP_FACT, { hints: H('A fact can be checked. A view says what someone thinks or feels.', 'Look for in my opinion, I believe, I feel, as I see it.'), oc: 'a' }),
  C('opinion.polite', 'disagree-politely', 'LISTEN.T12.OPINION_PHRASES', OP_POLITE, { hints: H('Show respect while you give your own view.', 'A good view has a reason after because.'), oc: 'b', rung: 2 }),
  C('report.part', 'choose-part', 'LISTEN.T15.ORAL_REPORT', OR_PART, { hints: H('A report begins with a greeting, gives the facts, and ends with a closing.', 'Facts, not opinions, belong in a report.'), oc: 'a' }),
  C('report.openclose', 'choose-opening-or-closing', 'LISTEN.T15.ORAL_REPORT', OR_OPEN, { hints: H('An opening greets and says what the report is about.', 'A closing says the report is complete and thanks the listeners.'), oc: 'a', rung: 2 }),
  C('report.tense', 'choose-sentence', 'LISTEN.T15.ORAL_REPORT', OR_TENSE, { stem: 'Which sentence is correct in an oral report on an event that has finished.', hints: H('An event that has finished is reported in the past tense.', 'Look at the verb: opened, won, planted.'), oc: 'a', rung: 2 }),
  ...P('travel', 'LISTEN.T13.TRAVEL_WORDS', TRAVEL, { hints: H('Is a person, a place, an amount or a thing needed?', 'A conductor is a person. A terminus is a place. A fare is an amount of money.'), topic: 'about land travel', oc: ['c', 'c', 'c'], thinOk: true }),
  C('text.purpose', 'choose-for-purpose', 'READIN.T1_EXT.SUITABLE_TEXT', ST_PURPOSE, { hints: H('Ask: what do I want to do with this text?', 'Choose by the topic and the purpose, not by the cover or the thickness.'), oc: 'a' }),
  C('text.kind', 'fiction-or-nonfiction', 'READIN.T1_EXT.SUITABLE_TEXT', ST_KIND, { hints: H('Fiction is made up. Non-fiction gives facts about real things.', 'A news report and an encyclopedia are non-fiction.'), oc: 'a', rung: 2 }),
  C('text.relevant', 'judge-relevance', 'READIN.T1_EXT.SUITABLE_TEXT', ST_RELEVANT, { hints: H('Is the text about my topic?', 'A text on a different topic is not relevant, however good it is.'), oc: 'a', rung: 2 }),
  C('trickster.who', 'choose-trickster', 'READIN.T1_INT.TRICKSTER', TK_WHO, { hints: H('The trickster is the one who plays the trick.', 'The one who is fooled is not the trickster.'), oc: 'a' }),
  C('trickster.lesson', 'choose-lesson', 'READIN.T1_INT.TRICKSTER', TK_LESSON, { hints: H('The lesson is usually about the fault of the one who is fooled.', 'Trickster stories do not teach that cheating is good.'), oc: 'b', rung: 2 }),
  C('trickster.trait', 'choose-trickster-feature', 'READIN.T1_INT.TRICKSTER', TK_TRAIT, { hints: H('A trickster is clever, quick and cunning.', 'A trickster wins by wits, not by strength.'), oc: 'a' }),
  C('book.need', 'choose-part', 'READIN.T2_INTENSIVE_READING_CL.BOOK_PARTS', BP_NEED, { hints: H('Contents is at the front, the index is at the back.', 'The blurb is on the back cover. The glossary explains hard words.'), oc: 'a' }),
  C('book.tells', 'choose-what-it-tells', 'READIN.T2_INTENSIVE_READING_CL.BOOK_PARTS', BP_TELLS, { hints: H('Each part of a book has its own job.', 'Contents lists chapters. Index lists topics. Glossary explains words.'), oc: 'a', rung: 2 }),
  C('info.kind', 'information-or-meaning', 'READIN.T3_READING.INFO_OR_MEANING', IO_KIND, { hints: H('Reading for information is looking for facts. Reading for meaning is understanding and enjoying.', 'A timetable gives information. A story gives meaning.'), oc: 'a' }),
  C('info.task', 'choose-way-to-read', 'READIN.T3_READING.INFO_OR_MEANING', IO_TASK, { hints: H('For one fact, scan quickly for it.', 'To understand, read slowly and think.'), oc: 'a', rung: 2 }),
  C('style.kind', 'simile-or-metaphor', 'READIN.T14_FEATURES.STYLE', STY_KIND, { hints: H('A simile uses like or as. A metaphor says one thing is another.', 'Dialogue is the words characters speak.'), oc: 'a' }),
  ...P('style', 'READIN.T14_FEATURES.STYLE', STY_GAP, { hints: H('A simile uses as ... as or like.', 'Say the whole simile aloud.'), topic: 'with similes', oc: ['b', 'b', 'b'] }),
  C('style.meaning', 'choose-meaning', 'READIN.T14_FEATURES.STYLE', STY_MEAN, { hints: H('A metaphor does not mean the words literally.', 'Ask what the two things have in common.'), oc: 'a', rung: 2 }),
  C('visual.need', 'choose-visual', 'READIN.T7_INDEPENDENT.VISUALS', V_NEED, { hints: H('A bar graph compares amounts, a pie chart shows parts of a whole, a map shows places.', 'A timeline shows events in order and a table lists facts in rows and columns.'), oc: 'a' }),
  C('visual.key', 'read-title-and-key', 'READIN.T7_INDEPENDENT.VISUALS', V_KEY, { hints: H('Read the title, the headings and the key before the figures.', 'They tell you what the figures mean.'), oc: 'a', rung: 2 }),
  C('visual.table', 'read-table', 'READIN.T7_INDEPENDENT.VISUALS', V_TABLE, { hints: H('Find the row for the person or the grade, then the column for the day.', 'For a total, add all the numbers in the row.'), oc: 'b', form: 'steps', rung: 2 }),
  C('notes.main', 'choose-main-point', 'READIN.T10_STUDY.NOTE_MAKING', NM_MAIN, { hints: H('The main point covers the whole text.', 'A supporting point is a detail or an example that backs it up.'), oc: 'a' }),
  C('notes.best', 'choose-best-notes', 'READIN.T10_STUDY.NOTE_MAKING', NM_BEST, { hints: H('Good notes use key words and short phrases.', 'Keep all the main points. Do not add your own ideas.'), oc: 'b', rung: 2 }),
  C('dilemma.closing', 'choose-closing-formula', 'READIN.T11_INTENSIVE.DILEMMA', DL_CLOSE, { hints: H('A dilemma narrative ends with a hard question to the listeners.', 'The narrator does not tell the lesson.'), oc: 'b' }),
  C('dilemma.kind', 'dilemma-or-other', 'READIN.T11_INTENSIVE.DILEMMA', DL_KIND, { hints: H('In a dilemma narrative every choice is hard and the listeners decide.', 'A story with a clear ending is not a dilemma.'), oc: 'a', rung: 2 }),
  C('praise.purpose', 'choose-purpose', 'READIN.T13_ORAL.PRAISE_SONG', PR_PURPOSE, { hints: H('A praise song honours a person on an occasion.', 'Praise songs use praise names and exaggeration.'), oc: 'a' }),
  C('praise.who', 'who-is-who', 'READIN.T13_ORAL.PRAISE_SONG', PR_WHO, { hints: H('The singer honours another person.', 'The one praised is the subject of the song.'), oc: 'b', rung: 2 }),
  C('praise.line', 'choose-praise-line', 'READIN.T13_ORAL.PRAISE_SONG', PR_LINE, { hints: H('A praise line honours what a person is or has done, with strong pictures.', 'A plain fact about the person is not praise.'), oc: 'a', rung: 2 }),
  C('strategy.use', 'choose-strategy-for-purpose', 'READIN.T4_INTENSIVE_READING.READING_STRATEGIES', RS_USE, { hints: H('Skimming gets the general idea. Scanning finds one fact.', 'Predicting and rereading also help a reader.'), oc: 'a' }),
  C('strategy.name', 'name-the-strategy', 'READIN.T4_INTENSIVE_READING.READING_STRATEGIES', RS_NAME, { hints: H('Skimming: the general idea. Scanning: one name or number.', 'Predicting: what comes next. Rereading: reading again.'), oc: 'a', rung: 2 }),
  C('fluency.use', 'choose-fluency-strategy', 'READIN.T15_READING.FLUENCY_STRATEGIES', FL_USE, { hints: H('A fluent reader reads at a steady speed with expression.', 'Pause at commas and full stops, and read words in groups.'), oc: 'a' }),
  C('fluency.reader', 'which-reader-is-fluent', 'READIN.T15_READING.FLUENCY_STRATEGIES', FL_WHO, { hints: H('Fluent reading is not flat, not too fast and not word by word.', 'Look at the speed, the voice and the pauses.'), oc: 'a', rung: 2 }),
];
