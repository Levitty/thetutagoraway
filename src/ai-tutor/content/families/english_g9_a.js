// ============================================================================
// ENGLISH GRADE 9, A (11 skills): gender-neutral language, quantifiers, quotation marks and brackets, modal auxiliaries, poem features,
// paragraphs, perfect aspect, adjective order, letter of application, adverb degrees, spelling. Written offline from the KICD design through
// the curriculum map. Every wrong answer names the library misconception it reveals. All stay reviewed:false until a Kenyan English
// teacher signs them off. Only the knowledge outcomes are asked; writing is marked by the teacher.
// ============================================================================
import { S } from './english_g9_lib.js';
const G1 = 'GRAMMA.T1_GENDER_NEUTRAL_LANGU.', G2 = 'GRAMMA.T2_NOUNS_AND_QUANTIFIER.', W2 = 'WRITIN.T2_MECHANICS_OF_WRITING.', G3 = 'GRAMMA.T3_MODAL_AUXILIARIES.';
const R3 = 'READIN.T3_POEMS_STRUCTURE.', W3 = 'WRITIN.T3_STRUCTURE_OF_A_PARAG.', G4 = 'GRAMMA.T4_PRESENT_AND_PAST_PER.', G5 = 'GRAMMA.T5_ORDER_OF_ADJECTIVES.', W5 = 'WRITIN.T5_LETTER_OF_APPLICATIO.';
const G6 = 'GRAMMA.T6_COMPARISON_OF_ADVERB.', W6 = 'WRITIN.T6_MECHANICS_OF_WRITING.';

export const FAMILIES = [
  ...S('gn', G1, 'GENDER_NEUTRAL', ['GN_CHAIRMAN', 'GN_POLICE', 'GN_MANKIND'], ['Pick the word that fits a man or a woman.', 'Job words should not assume the sex of the worker.'], [
    ['Which word for the leader of a meeting is gender-neutral?', 'chairperson', 'chairman', 'chairwoman', 'chairlady'],
    ['Which word for an officer who keeps the peace is gender-neutral?', 'police officer', 'policeman', 'policewoman', 'policemen'],
    ['Which word for all people together is gender-neutral?', 'humankind', 'mankind', 'manpower', 'gentlemen'],
    ['Which word for a person who puts out fires is gender-neutral?', 'firefighter', 'fireman', 'firewoman', 'fire lady'],
    ['Which word for a person who serves food is gender-neutral?', 'server', 'waiter', 'waitress', 'barmaid'],
  ], [
    ['A meeting needs a leader of any sex. Which word fits?', 'chairperson', 'chairman', 'chairwoman', 'chairlady'],
    ['A school wants a word for the person who keeps order. Which fits both sexes?', 'police officer', 'policeman', 'policewoman', 'constable man'],
    ['A speech talks about all people. Which word fits?', 'humankind', 'mankind', 'manpower', 'brotherhood'],
    ['An advert wants a firefighter of any sex. Which word fits?', 'firefighter', 'fireman', 'fire guy', 'fire lady'],
    ['A notice asks for a person who serves food. Which word fits both sexes?', 'server', 'waiter', 'waitress', 'barmaid'],
  ], [
    ['Which step is the mistake?', 'Step 1: Some words name a job.', 'Step 2: A job can be done by any person.', 'Step 3: So chairman is the best word for every chair.', 'Chairperson fits any person.', 0],
    ['Which step is the mistake?', 'Step 1: Women and men serve as police.', 'Step 2: The word should include both.', 'Step 3: So policeman is the neutral word.', 'Police officer is neutral.', 1],
    ['Which step is the mistake?', 'Step 1: Humankind means all people.', 'Step 2: Mankind sounds like men only.', 'Step 3: So mankind is the neutral word.', 'Humankind is neutral.', 2],
    ['Which step is the mistake?', 'Step 1: Firefighters can be men or women.', 'Step 2: Fireman names only men.', 'Step 3: So fireman is the neutral word.', 'Firefighter is neutral.', 1],
    ['Which step is the mistake?', 'Step 1: A server can be any person.', 'Step 2: Waitress names only women.', 'Step 3: So waitress is the neutral word.', 'Server is neutral.', 2],
  ], ['a', 'b']),
  ...S('qt', G2, 'QUANTIFIERS', ['QT_MUCH', 'QT_MANY', 'QT_FEW'], ['Many goes with count nouns, much with non-count nouns.', 'Little goes with non-count nouns, few with count nouns.'], [
    ['Which is correct? There are ___ chairs in the room.', 'many', 'much', 'little', 'less'],
    ['Which is correct? There is not ___ water in the jug.', 'much', 'many', 'few', 'several'],
    ['Which is correct? There is a ___ of milk in the cup.', 'little', 'few', 'many', 'couple'],
    ['Which is correct? There are only a ___ pens left.', 'few', 'little', 'much', 'less'],
    ['Which noun is non-count?', 'advice', 'chair', 'book', 'pen'],
  ], [
    ['Achieng has ten books. Which fits? She has ___ books.', 'many', 'much', 'little', 'less'],
    ['The tank has plenty of water. Which fits? It has ___ water.', 'much', 'many', 'few', 'several'],
    ['Wekesa put a small amount of sugar in his tea. Which fits? He used a ___ sugar.', 'little', 'few', 'many', 'couple of'],
    ['There are three eggs in the basket. Which fits? There are a ___ eggs.', 'few', 'little', 'much', 'less'],
    ['Which of these cannot be counted?', 'rice', 'cup', 'bag', 'plate'],
  ], [
    ['Which step is the mistake?', 'Step 1: Chairs can be counted.', 'Step 2: Count nouns take many.', 'Step 3: So we say "much chairs".', 'We say "many chairs".', 2],
    ['Which step is the mistake?', 'Step 1: Water cannot be counted.', 'Step 2: Non-count nouns take much.', 'Step 3: So we say "many water".', 'We say "much water".', 2],
    ['Which step is the mistake?', 'Step 1: Milk is a non-count noun.', 'Step 2: Little goes with it.', 'Step 3: So we say "a few milk".', 'We say "a little milk".', 2],
    ['Which step is the mistake?', 'Step 1: Pens can be counted.', 'Step 2: Few goes with count nouns.', 'Step 3: So we say "a little pens".', 'We say "a few pens".', 2],
    ['Which step is the mistake?', 'Step 1: Advice is a non-count noun.', 'Step 2: We cannot say "an advice".', 'Step 3: So we say "many advices".', 'We say "much advice".', 2],
  ], ['a', 'b']),
  ...S('wq', W2, 'QUOTES_BRACKETS', ['QB_BRACKET', 'QB_EXTRA', 'QB_END'], ['Quotation marks hold exact words; brackets hold extra information.', 'The full stop goes inside the closing quotation marks.'], [
    ['What goes inside double quotation marks?', 'The exact words spoken', 'Extra explanations', 'The title of a book only', 'The date only'],
    ['What goes inside brackets?', 'Extra information', 'The exact words spoken', 'The first word', 'The last word'],
    ['Which is punctuated correctly?', 'She said, "I am ready."', 'She said, "I am ready".', 'She said "I am ready."', 'She said, I am ready.'],
    ['Which sentence uses brackets correctly?', 'Nairobi (the capital) is large.', 'Nairobi "the capital" is large.', 'Nairobi, the capital, is large (.)', 'Nairobi (the capital is large.'],
    ['Which shows speech correctly?', 'He asked, "Where are you?"', 'He asked (Where are you?)', 'He asked, Where are you?', 'He asked "Where are you"?'],
  ], [
    ['Wanjiru writes the exact words her teacher said. What does she use?', 'Double quotation marks', 'Brackets', 'A colon', 'A dash'],
    ['A writer adds a short explanation in the middle of a sentence. What does she use?', 'Brackets', 'Quotation marks', 'A question mark', 'A hyphen'],
    ['Which is correct?', '"Come here," said Mama.', '(Come here) said Mama.', 'Come here, said "Mama".', '"Come here" said Mama,'],
    ['A learner writes: Kenya (a country in East Africa) is beautiful. What do the brackets hold?', 'Extra information', 'Speech', 'A title', 'A question'],
    ['A reporter writes what the minister said word for word. What does she use?', 'Quotation marks', 'Brackets', 'Italics only', 'A colon'],
  ], [
    ['Which step is the mistake?', 'Step 1: Speech needs marking.', 'Step 2: The exact words are marked.', 'Step 3: So we put the exact words in brackets.', 'We put them in quotation marks.', 0],
    ['Which step is the mistake?', 'Step 1: Brackets hold extra information.', 'Step 2: The sentence still makes sense without it.', 'Step 3: So brackets hold the speech.', 'Quotation marks hold speech.', 2],
    ['Which step is the mistake?', 'Step 1: A sentence of speech ends with a stop.', 'Step 2: The stop belongs to the speech.', 'Step 3: So it goes outside the quotation marks.', 'It goes inside.', 2],
    ['Which step is the mistake?', 'Step 1: Quotation marks come in pairs.', 'Step 2: One opens and one closes.', 'Step 3: So one is enough.', 'Both are needed.', 2],
    ['Which step is the mistake?', 'Step 1: Brackets also come in pairs.', 'Step 2: One opens and one closes.', 'Step 3: So we open and never close.', 'Both are needed.', 2],
  ], ['a', 'b']),
  ...S('md', G3, 'MODALS', ['MD_ABILITY', 'MD_DUTY', 'MD_BASE'], ['Can shows ability; must shows duty.', 'A modal is followed by the base verb.'], [
    ['Which modal shows ability?', 'can', 'must', 'should', 'ought'],
    ['Which modal shows duty?', 'must', 'can', 'may', 'might'],
    ['Which sentence is correct?', 'She can swim.', 'She can to swim.', 'She can swims.', 'She can swimming.'],
    ['Which modal shows permission?', 'may', 'must', 'will', 'shall'],
    ['Which modal gives advice?', 'should', 'can', 'will', 'may'],
  ], [
    ['Achieng swims well. Which fits? She ___ swim.', 'can', 'must', 'should', 'might'],
    ['A rule says all learners wear uniform. Which fits? Learners ___ wear uniform.', 'must', 'can', 'may', 'could'],
    ['Which is correct?', 'He should study harder.', 'He should to study harder.', 'He should studies harder.', 'He should studying harder.'],
    ['A learner asks the teacher to leave the room. Which fits? ___ I go out?', 'May', 'Must', 'Does', 'Is'],
    ['A doctor tells a patient to rest. Which fits? You ___ rest.', 'should', 'can', 'will', 'would'],
  ], [
    ['Which step is the mistake?', 'Step 1: Can shows ability.', 'Step 2: Must shows duty.', 'Step 3: So can shows duty.', 'Can shows ability.', 2],
    ['Which step is the mistake?', 'Step 1: A modal comes before a verb.', 'Step 2: The verb is in its base form.', 'Step 3: So we say "She can to swim".', 'We say "She can swim".', 2],
    ['Which step is the mistake?', 'Step 1: May asks for permission.', 'Step 2: It is polite.', 'Step 3: So may shows duty.', 'May shows permission or possibility.', 2],
    ['Which step is the mistake?', 'Step 1: Should gives advice.', 'Step 2: Must is stronger.', 'Step 3: So should is stronger than must.', 'Must is stronger than should.', 2],
    ['Which step is the mistake?', 'Step 1: Might shows a small possibility.', 'Step 2: It is followed by a base verb.', 'Step 3: So we say "It might rains".', 'We say "It might rain".', 2],
  ], ['a', 'b']),
  ...S('pf', R3, 'POEM_FEATURES', ['PF_STANZA', 'PF_RHYME', 'PF_PERSON'], ['A stanza is a group of lines.', 'Personification gives human actions to things.'], [
    ['What is a stanza?', 'A group of lines', 'One line of a poem', 'The title of a poem', 'The writer of a poem'],
    ['What is rhyme?', 'Repeated end sounds', 'The same beginning sound', 'The number of lines', 'The title'],
    ['Which is personification?', 'The wind whispered', 'as brave as a lion', 'The wind blew', 'The wind was strong'],
    ['What is a line of a poem?', 'One row of words', 'A group of stanzas', 'The poet', 'The title'],
    ['Which words rhyme?', 'cake and bake', 'cake and cook', 'bake and book', 'make and mug'],
  ], [
    ['A poem has four groups of lines. What are the groups called?', 'Stanzas', 'Titles', 'Rhymes', 'Poets'],
    ['A poet writes "moon" and "soon" at the ends of two lines. What is this?', 'Rhyme', 'Personification', 'A stanza', 'A title'],
    ['The poem says "The sun smiled at the farmers". What is this?', 'Personification', 'Rhyme', 'A stanza', 'A line'],
    ['A poem has 12 lines in three stanzas. How many lines are in each stanza if equal?', 'four', 'three', 'twelve', 'six'],
    ['Which phrase uses personification?', 'The trees danced in the wind', 'The trees were tall', 'The trees were green', 'The trees were many'],
  ], [
    ['Which step is the mistake?', 'Step 1: A poem has lines.', 'Step 2: Lines are grouped.', 'Step 3: So a stanza is a single line.', 'A stanza is a group of lines.', 2],
    ['Which step is the mistake?', 'Step 1: Words can rhyme.', 'Step 2: They sound alike at the end.', 'Step 3: So rhyme is the same beginning sound.', 'Rhyme is the same end sound.', 2],
    ['Which step is the mistake?', 'Step 1: Personification is a figure of speech.', 'Step 2: It treats things as people.', 'Step 3: So "as brave as a lion" is personification.', 'That is a simile.', 2],
    ['Which step is the mistake?', 'Step 1: A line is a row of words.', 'Step 2: Several lines make a stanza.', 'Step 3: So a stanza is a word.', 'A stanza is a group of lines.', 2],
    ['Which step is the mistake?', 'Step 1: "The moon looked down" gives the moon a human act.', 'Step 2: This is personification.', 'Step 3: So it is a simile.', 'It is personification.', 2],
  ], ['a', 'b']),
  ...S('pa', W3, 'PARAGRAPH', ['PA_TOPIC', 'PA_UNITY', 'PA_COHERENCE'], ['A paragraph has one main idea stated in a topic sentence.', 'Coherence is ideas in order joined by linking words.'], [
    ['Which sentence states the main idea?', 'The topic sentence', 'The supporting sentence', 'The last word', 'The title'],
    ['What is unity in a paragraph?', 'One main idea', 'Many different ideas', 'A very long text', 'No main idea'],
    ['What is coherence?', 'Ideas in order, joined by linking words', 'A very long paragraph', 'Ideas in any order', 'A list of facts'],
    ['What do supporting sentences do?', 'Give details about the main idea', 'Change the topic', 'Repeat the title', 'Close the text'],
    ['Which word helps ideas flow?', 'however', 'banana', 'purple', 'chair'],
  ], [
    ['A paragraph begins: "Exercise keeps us healthy." What is this sentence?', 'The topic sentence', 'A supporting detail', 'A title', 'A closing line'],
    ['A paragraph jumps from football to farming to music. What does it lack?', 'Unity', 'Length', 'Colour', 'A title'],
    ['A writer uses first, next and finally. What does this add?', 'Coherence', 'Length', 'A topic', 'A title'],
    ['A sentence gives an example of the main idea. What is it?', 'A supporting sentence', 'The topic sentence', 'The title', 'The end'],
    ['A paragraph ends by restating the main idea. What is this?', 'A closing sentence', 'A topic sentence', 'A title', 'A list'],
  ], [
    ['Which step is the mistake?', 'Step 1: A paragraph has a main idea.', 'Step 2: One sentence states it.', 'Step 3: So the supporting sentence states it.', 'The topic sentence states it.', 2],
    ['Which step is the mistake?', 'Step 1: Unity needs one idea.', 'Step 2: All sentences support it.', 'Step 3: So unity means many ideas.', 'Unity means one main idea.', 2],
    ['Which step is the mistake?', 'Step 1: Linking words join ideas.', 'Step 2: They help the text flow.', 'Step 3: So coherence means length.', 'Coherence means flow.', 2],
    ['Which step is the mistake?', 'Step 1: Supporting sentences add detail.', 'Step 2: They stay on the topic.', 'Step 3: So they change the topic.', 'They stay on the topic.', 2],
    ['Which step is the mistake?', 'Step 1: A closing sentence ends the paragraph.', 'Step 2: It restates the idea.', 'Step 3: So it begins a new topic.', 'It restates the main idea.', 2],
  ], ['a', 'a']),
  ...S('pe', G4, 'PERFECT', ['PE_PRESENT', 'PE_PAST', 'PE_PARTICIPLE'], ['Present perfect: have or has plus past participle.', 'Past perfect: had plus past participle.'], [
    ['Which sentence is in the present perfect?', 'She has finished.', 'She had finished.', 'She finished.', 'She is finishing.'],
    ['Which sentence is in the past perfect?', 'She had finished before I came.', 'She has finished before I came.', 'She finishes before I came.', 'She was finishing before I came.'],
    ['Which sentence about going home is correct?', 'She has gone home.', 'She has went home.', 'She has go home.', 'She has going home.'],
    ['Which sentence about eating is correct?', 'They have eaten.', 'They have ate.', 'They have eat.', 'They have eating.'],
    ['Which sentence about leaving is correct?', 'He had left when I arrived.', 'He has left when I arrived.', 'He leaves when I arrived.', 'He leaving when I arrived.'],
  ], [
    ['Achieng finished her work a moment ago and it is still done now. Which fits? She ___ her work.', 'has finished', 'had finished', 'will finish', 'was finishing'],
    ['The bus left before Juma reached the stage. Which fits? The bus ___ before he reached it.', 'had left', 'has left', 'leaves', 'is leaving'],
    ['Which is correct?', 'Wanjiru has written a letter.', 'Wanjiru has wrote a letter.', 'Wanjiru has write a letter.', 'Wanjiru has writing a letter.'],
    ['The teacher had marked the books before the lesson began. Which tense is "had marked"?', 'past perfect', 'present perfect', 'simple past', 'future'],
    ['They have lived here for years. Which tense is "have lived"?', 'present perfect', 'past perfect', 'simple past', 'future'],
  ], [
    ['Which step is the mistake?', 'Step 1: Present perfect uses have or has.', 'Step 2: It adds a past participle.', 'Step 3: So "She had finished" is present perfect.', '"She has finished" is present perfect.', 2],
    ['Which step is the mistake?', 'Step 1: Past perfect uses had.', 'Step 2: It adds a past participle.', 'Step 3: So "She has finished before I came" is past perfect.', '"She had finished" is past perfect.', 2],
    ['Which step is the mistake?', 'Step 1: Go becomes went in the simple past.', 'Step 2: After has, we need the past participle.', 'Step 3: So we say "She has went".', 'We say "She has gone".', 2],
    ['Which step is the mistake?', 'Step 1: Eat has the participle eaten.', 'Step 2: Perfect tenses use participles.', 'Step 3: So we say "They have ate".', 'We say "They have eaten".', 2],
    ['Which step is the mistake?', 'Step 1: Past perfect shows an earlier past.', 'Step 2: It uses had.', 'Step 3: So it uses will.', 'It uses had.', 2],
  ], ['a', 'b']),
  ...S('ao', G5, 'ADJ_ORDER', ['AO_COLOUR', 'AO_OPINION', 'AO_AGE'], ['Order: opinion, size, age, colour, origin, material.', 'Size comes before colour.'], [
    ['Which order is correct for a ball?', 'a big red ball', 'a red big ball', 'a ball big red', 'a ball red big'],
    ['Which order is correct for a box?', 'a lovely wooden box', 'a wooden lovely box', 'a box lovely wooden', 'a box wooden lovely'],
    ['Which order is correct for a dog?', 'an old brown dog', 'a brown old dog', 'a dog brown old', 'a dog old brown'],
    ['Which order is correct for a house?', 'a beautiful small house', 'a small beautiful house', 'a house small beautiful', 'a house beautiful small'],
    ['Which order is correct for a man?', 'a tall young man', 'a young tall man', 'a man young tall', 'a man tall young'],
  ], [
    ['Which phrase is right for a ball that is large and red?', 'a large red ball', 'a red large ball', 'a ball red large', 'a ball large red'],
    ['Which phrase is right for a box that is nice and made of wood?', 'a nice wooden box', 'a wooden nice box', 'a box wooden nice', 'a box nice wooden'],
    ['Which phrase is right for a dog that is old and brown?', 'an old brown dog', 'a brown old dog', 'a dog brown old', 'a dog old brown'],
    ['Which phrase is right for a small, lovely cotton dress?', 'a lovely small cotton dress', 'a cotton lovely small dress', 'a small lovely cotton dress', 'a dress cotton small lovely'],
    ['Which phrase is right for a young, tall teacher?', 'a tall young teacher', 'a young tall teacher', 'a teacher tall young', 'a teacher young tall'],
  ], [
    ['Which step is the mistake?', 'Step 1: Adjectives have an order.', 'Step 2: Size comes before colour.', 'Step 3: So we say "a red big ball".', 'We say "a big red ball".', 2],
    ['Which step is the mistake?', 'Step 1: Opinion comes first.', 'Step 2: Material comes last.', 'Step 3: So we say "a wooden lovely box".', 'We say "a lovely wooden box".', 2],
    ['Which step is the mistake?', 'Step 1: Age comes before colour.', 'Step 2: Colour comes before material.', 'Step 3: So we say "a brown old dog".', 'We say "an old brown dog".', 2],
    ['Which step is the mistake?', 'Step 1: Opinion comes before size.', 'Step 2: Size comes before colour.', 'Step 3: So we say "a small beautiful house".', 'We say "a beautiful small house".', 2],
    ['Which step is the mistake?', 'Step 1: Size comes before age.', 'Step 2: So tall comes before young.', 'Step 3: So we say "a young tall man".', 'We say "a tall young man".', 2],
  ], ['a', 'b']),
  ...S('la', W5, 'LETTER_APPLICATION', ['LA_CLOSE', 'LA_SUBJECT', 'LA_ADDRESS'], ['Yours faithfully goes with Dear Sir or Madam.', 'The writer\'s address goes at the top.'], [
    ['Which closing goes with Dear Sir or Madam?', 'Yours faithfully', 'Yours sincerely', 'Your friend', 'Love from'],
    ['Which part states what the letter is about?', 'The subject line', 'The signature', 'The date', 'The closing'],
    ['Where does the writer\'s address go?', 'At the top', 'At the bottom', 'After the signature', 'In the middle'],
    ['Which greeting suits a formal application?', 'Dear Sir or Madam', 'Hey there', 'Dear buddy', 'Hi friend'],
    ['What is written below the closing?', 'The signature', 'The address', 'The subject line', 'The date'],
  ], [
    ['Achieng starts with "Dear Sir". How should she close?', 'Yours faithfully', 'Yours sincerely', 'Your friend', 'Best pal'],
    ['A letter of application needs a short heading about the job. What is this?', 'The subject line', 'The signature', 'The closing', 'The date'],
    ['Where does Wekesa write his own address in the letter?', 'At the top', 'At the bottom', 'Next to the signature', 'On the back'],
    ['Which greeting is correct when you do not know the name?', 'Dear Sir or Madam', 'Dear friend', 'Hello you', 'Hi there'],
    ['Where does Juma sign the letter?', 'After the closing', 'Before the greeting', 'Beside the address', 'At the top'],
  ], [
    ['Which step is the mistake?', 'Step 1: The greeting is Dear Sir or Madam.', 'Step 2: A formal ending is needed.', 'Step 3: So we close with Yours sincerely.', 'We close with Yours faithfully.', 2],
    ['Which step is the mistake?', 'Step 1: A formal letter has a subject line.', 'Step 2: It states the purpose.', 'Step 3: So we leave it out.', 'We include it.', 2],
    ['Which step is the mistake?', 'Step 1: The writer\'s address helps the reply.', 'Step 2: It is written at the top.', 'Step 3: So we write it at the bottom.', 'It goes at the top.', 2],
    ['Which step is the mistake?', 'Step 1: A formal letter is polite.', 'Step 2: It avoids slang.', 'Step 3: So we write "Hey there".', 'We write Dear Sir or Madam.', 2],
    ['Which step is the mistake?', 'Step 1: The closing comes first.', 'Step 2: Then the signature.', 'Step 3: So the signature comes before the body.', 'The signature comes at the end.', 0],
  ], ['a', 'a']),
  ...S('ad', G6, 'ADVERB_DEGREES', ['AD_MORE', 'AD_SUPER', 'AD_THAN'], ['Long adverbs take more and most.', 'Use the superlative for three or more.'], [
    ['Which is correct?', 'more carefully', 'carefullier', 'most carefuller', 'carefuler'],
    ['Who ran ___ of all the boys?', 'fastest', 'faster', 'more fast', 'fast'],
    ['Which is correct?', 'She sings better than I do.', 'She sings well than I do.', 'She sings gooder than I do.', 'She sings best than I do.'],
    ['What is the comparative of hard?', 'harder', 'hardest', 'more hardest', 'hardly'],
    ['What is the superlative of carefully?', 'most carefully', 'more carefully', 'carefullest', 'carefuller'],
  ], [
    ['Wanjiru writes carefully, but Amina writes even more so. Which fits? Amina writes ___ than Wanjiru.', 'more carefully', 'carefullier', 'most carefully', 'carefuler'],
    ['Of the four girls, Njeri ran the quickest. Which fits? Njeri ran ___.', 'fastest', 'faster', 'more fast', 'fastly'],
    ['Which is correct?', 'He works harder than me.', 'He works hard than me.', 'He works hardest than me.', 'He works more hardest than me.'],
    ['Which is the superlative?', 'earliest', 'earlier', 'more early', 'earlyer'],
    ['Which is the positive degree?', 'slowly', 'more slowly', 'most slowly', 'slowlier'],
  ], [
    ['Which step is the mistake?', 'Step 1: Carefully is a long adverb.', 'Step 2: Long adverbs use more.', 'Step 3: So we say "carefullier".', 'We say "more carefully".', 2],
    ['Which step is the mistake?', 'Step 1: We compare four runners.', 'Step 2: We need the superlative.', 'Step 3: So we say "faster".', 'We say "fastest".', 2],
    ['Which step is the mistake?', 'Step 1: We compare two people.', 'Step 2: We need the comparative.', 'Step 3: So we say "hardest".', 'We say "harder".', 2],
    ['Which step is the mistake?', 'Step 1: The positive is the basic form.', 'Step 2: The comparative adds -er or more.', 'Step 3: So "most slowly" is the comparative.', '"More slowly" is the comparative.', 2],
    ['Which step is the mistake?', 'Step 1: Well is an adverb.', 'Step 2: Its comparative is better.', 'Step 3: So we say "gooder".', 'We say "better".', 2],
  ], ['a', 'b']),
  ...S('sg', W6, 'SPELLING', ['SG_HOMOPHONE', 'SG_SEPARATE', 'SG_COMMITTEE'], ['Homophones sound alike but differ in spelling.', 'Check double letters in words like committee.'], [
    ['Which sentence uses the right word? ___ books are on the table.', 'Their', 'There', 'They\'re', 'Thair'],
    ['Which spelling of the word meaning apart is correct?', 'separate', 'seperate', 'seprate', 'separat'],
    ['Which spelling of the word for a group is correct?', 'committee', 'comitee', 'committe', 'commitee'],
    ['Which spelling of the word meaning needed is correct?', 'necessary', 'neccessary', 'necesary', 'neccesary'],
    ['Which word is a homophone of "write"?', 'right', 'wrote', 'writing', 'writer'],
  ], [
    ['Achieng wrote about her friends. Which fits? ___ are kind.', 'They\'re', 'Their', 'There', 'Thare'],
    ['Wekesa spells the word for "apart". Which spelling is right?', 'separate', 'seperate', 'seprate', 'separat'],
    ['A school has a group that makes decisions. Which spelling is right?', 'committee', 'comitee', 'committe', 'commitee'],
    ['A teacher says water is ___ for life. Which spelling is right?', 'necessary', 'neccessary', 'necesary', 'neccesary'],
    ['Which pair are homophones?', 'sun and son', 'cat and dog', 'big and small', 'run and ran'],
  ], [
    ['Which step is the mistake?', 'Step 1: Their shows belonging.', 'Step 2: There shows place.', 'Step 3: So we say "There books".', 'We say "Their books".', 2],
    ['Which step is the mistake?', 'Step 1: Separate has "par" in the middle.', 'Step 2: It does not have "per".', 'Step 3: So we spell it "seperate".', 'We spell it "separate".', 2],
    ['Which step is the mistake?', 'Step 1: Committee has double m.', 'Step 2: It also has double t and double e.', 'Step 3: So we spell it "comitee".', 'We spell it "committee".', 2],
    ['Which step is the mistake?', 'Step 1: Necessary has one c and two s.', 'Step 2: It begins with "nec".', 'Step 3: So we spell it "neccessary".', 'We spell it "necessary".', 2],
    ['Which step is the mistake?', 'Step 1: Homophones sound alike.', 'Step 2: Their spellings differ.', 'Step 3: So they have the same spelling.', 'Their spellings differ.', 2],
  ], ['a', 'b']),
];
