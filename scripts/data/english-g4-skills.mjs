// ============================================================================
// ENGLISH GRADE 4: skills, prerequisites and the misconception library (authoring source).
// Written offline by Claude (12 Nov 2026), no model call. Everything here is DRAFT until a
// Kenyan English teacher reviews it (docs/qa/english-g4-2026-11-12.md lists what to check).
// scripts/build-english-g4.mjs merges it into curriculum/english/g4.json (HOREB owns that file)
// and then builds the in-app map. Keys: 'LANGUA.T1' = the sub-strand ENGL.G4.LANGUA.T1_*.
// Prerequisites: 'LANGUA.T4.PERSONAL_PRONOUNS' = a Grade 4 skill; 'G3:LANGUA.T5.a' = a Grade 3 English outcome.
// leads_to: Grade 5 English skills, 'GRAMMA.T4.POSSESSIVES' = ENGL.G5.GRAMMA.T4_*.POSSESSIVES.
// ============================================================================
export const TO_CONFIRM = 'common learner error; to confirm by a Kenyan English teacher';
export const KISWAHILI = 'Kiswahili influence (to confirm by a Kenyan English teacher)';
const FORMS3 = ['choose the correct word', 'fill the gap', 'spot the mistake'];
const FORMSS = ['choose the correct sentence', 'spot the mistake'];

// S(sub, id, name, outcomes, what the child does, forms, prerequisites, thinking, leads_to)
const S = (sub, id, name, outcomes, what, forms = FORMS3, pre = [], thinking = ['recall'], leads = []) => ({ sub, id, name, outcomes, mastery: `${what}, in 8 of 10 new items.`, forms, pre, thinking, leads });

export const SKILLS = [
  // ---------------------------------------------------------------- Language use
  S('LANGUA.T1', 'ARTICLES', 'Use a, an and the', ['a', 'b'], 'Chooses or writes a, an or the (a before a consonant sound, an before a vowel sound, the for a known or named thing, no article for things in general) and finds the one wrong article in a short note', FORMS3, ['G3:LANGUA.T5.a'], ['recall', 'rule'], ['GRAMMA.T1.DEMONSTRATIVES']),
  S('LANGUA.T2', 'PLURALS_REGULAR', 'Make regular plurals', ['a', 'b'], 'Forms the plural of regular nouns (-s, -es after s, x, ch, sh, -ies after a consonant and y, -ves for knife and leaf) and does not add -s to a number-plus-noun that is already plural', FORMS3, ['G3:LANGUA.T5.a'], ['recall', 'rule'], ['GRAMMA.T12.SAME_SINGULAR_PLURAL']),
  S('LANGUA.T2', 'PLURALS_IRREGULAR', 'Make irregular plurals', ['a', 'b'], 'Writes the plural of man, woman, child, foot, tooth, mouse, person, sheep and fish and does not add -s or a second plural ending', FORMS3, ['LANGUA.T2.PLURALS_REGULAR', 'G3:LANGUA.T5.b'], ['recall'], ['GRAMMA.T12.SAME_SINGULAR_PLURAL']),
  S('LANGUA.T3', 'POLITE_PATTERN', 'Use May I, Could you and Would you like', ['a', 'b'], 'Builds and recognises polite requests and offers (May I go out, please? Could you help me? Would you like some tea?) with the plain verb after May I and Could you, in whole sentences', FORMSS, ['G3:LANGUA.T13.b'], ['rule'], ['GRAMMA.T3.MUST_SHOULD_ADVERB']),
  S('LANGUA.T4', 'PERSONAL_PRONOUNS', 'Use I, me, he, him, we, us, they and them', ['a', 'b'], 'Chooses the subject form before the verb and the object form after the verb or a small word, and does not repeat a noun with a pronoun (Wanjiru she is tall)', FORMS3, ['G3:LANGUA.T4.a'], ['recall', 'rule'], ['GRAMMA.T4.POSSESSIVES']),
  S('LANGUA.T4', 'POSSESSIVE_PRONOUNS', 'Use mine, yours, hers, ours and theirs', ['a', 'b'], 'Writes mine, yours, his, hers, ours or theirs when no noun follows, my, your, her, our or their before a noun, and never writes your\'s, her\'s or our\'s', FORMS3, ['LANGUA.T4.PERSONAL_PRONOUNS', 'G3:LANGUA.T12.b'], ['recall', 'rule'], ['GRAMMA.T4.POSSESSIVES']),
  S('LANGUA.T5', 'ADJECTIVES', 'Find adjectives in a sentence', ['a', 'c'], 'Names the describing word that tells more about a noun (tall girl, red bus) and does not pick the noun, the verb or an adverb', FORMS3, ['G3:LANGUA.T11.a'], ['recall'], ['GRAMMA.T5.COMPARATIVE_SUPERLATIVE']),
  S('LANGUA.T5', 'ADJECTIVE_ORDER', 'Put adjectives of size and shape in order', ['b'], 'Puts size before shape before the noun (a big round ball) and never puts the adjective after the noun as in Kiswahili', FORMS3, ['LANGUA.T5.ADJECTIVES'], ['rule'], ['GRAMMA.T5.ADJECTIVE_ORDER']),
  S('LANGUA.T6', 'COUNT_UNCOUNT', 'Use many, much, few and little', ['a', 'b'], 'Uses many and few with things you can count and much and little with things you cannot count, in statements and questions', FORMS3, ['G3:LANGUA.T8.b'], ['recall', 'rule'], ['GRAMMA.T6.FEW_LITTLE']),
  S('LANGUA.T6', 'SOME_ANY', 'Use some, any, a lot of and enough', ['a', 'b', 'c'], 'Uses some in positive sentences, any in questions and negatives, a lot of and enough before the noun, and does not put enough after the noun', FORMS3, ['LANGUA.T6.COUNT_UNCOUNT'], ['rule'], ['GRAMMA.T6.QUANTIFIERS_OTHER']),
  S('LANGUA.T7', 'PRESENT_PROGRESSIVE', 'Use am, is and are with -ing', ['a', 'b'], 'Writes am, is or are plus the -ing verb for an action happening now, with the right form of be and the right spelling of -ing', FORMS3, ['G3:LANGUA.T1.b'], ['rule']),
  S('LANGUA.T7', 'PAST_PROGRESSIVE', 'Use was and were with -ing', ['a', 'b'], 'Writes was or were plus the -ing verb for an action that was going on at a time in the past, and does not use is or are, a past form or a bare verb', FORMS3, ['LANGUA.T7.PRESENT_PROGRESSIVE'], ['rule']),
  S('LANGUA.T8', 'CONTRACTIONS', 'Write short forms of verbs', ['a'], 'Writes the short form (don\'t, isn\'t, can\'t, I\'m, she\'s, we\'ll) with the apostrophe where the letter is missing, and tells it\'s (it is) from its (belonging to it)', FORMS3, ['G3:LANGUA.T1.b'], ['recall'], ['WRITIN.T9.APOSTROPHE']),
  S('LANGUA.T8', 'NEGATIVE_STATEMENTS', 'Turn a positive statement into a negative one', ['b', 'c'], 'Makes a negative with do not, does not, did not, is not or cannot, keeps the verb plain after does and did, and does not use two negatives together', FORMS3, ['LANGUA.T8.CONTRACTIONS', 'G3:LANGUA.T2.b'], ['rule'], ['GRAMMA.T8.QUESTION_TAGS']),
  S('LANGUA.T9', 'ADVERBS', 'Use adverbs of manner, time and place', ['a', 'b'], 'Says whether an adverb tells how, when or where, uses the adverb form (quickly, well) after the verb, and does not use an adjective where the adverb belongs', FORMS3, ['G3:LANGUA.T14.b'], ['recall', 'rule'], ['GRAMMA.T9.ADVERBS']),
  S('LANGUA.T10', 'CONJUNCTIONS', 'Join ideas with and, but, because, so and or', ['a', 'c'], 'Chooses the joining word that matches the meaning of the two parts (addition, contrast, reason, result, choice) and uses one joining word between two ideas', FORMS3, ['G3:LANGUA.T7.b'], ['rule'], ['GRAMMA.T10.CONJUNCTIONS']),
  S('LANGUA.T11', 'INTERROGATIVES', 'Ask questions with who, what, where, when, why, how and whose', ['a', 'b', 'c'], 'Chooses the question word that fits the answer given, puts the helping verb before the subject, and does not write who\'s for whose', FORMS3, ['G3:LANGUA.T13.b'], ['rule'], ['GRAMMA.T11.INTERROGATIVES']),
  S('LANGUA.T12', 'PRESENT_PERFECT', 'Use have and has with the past participle', ['a', 'b'], 'Writes have or has plus the past participle (have eaten, has gone) for an action that has just finished or still matters, and does not use it with yesterday or last week', FORMS3, ['LANGUA.T7.PRESENT_PROGRESSIVE', 'LISTEN.T7.SIMPLE_PAST', 'G3:LANGUA.T3.b'], ['rule']),
  S('LANGUA.T12', 'PAST_PERFECT', 'Use had with the past participle', ['a', 'b'], 'Writes had plus the past participle for the action that happened first when two past actions are told, and keeps the order of the two events right', FORMS3, ['LANGUA.T12.PRESENT_PERFECT'], ['rule']),
  S('LANGUA.T13', 'PREP_POSITION', 'Use in, on, under, behind, between and next to', ['a', 'b'], 'Chooses the preposition that says where a thing is (in, on, under, behind, in front of, between, next to) from the picture in words, in 8 of 10 new sentences', FORMS3, ['G3:LANGUA.T10.b'], ['recall'], ['GRAMMA.T13.PREPOSITIONS_TIME_PLACE']),
  S('LANGUA.T13', 'PREP_DIRECTION', 'Use to, into, out of, across, through and along', ['a', 'b'], 'Chooses the preposition that says where something moves (into the room, out of the house, across the road, through the gate), and does not write to home or go at school', FORMS3, ['LANGUA.T13.PREP_POSITION'], ['recall'], ['GRAMMA.T13.PREPOSITIONS_DIRECTION']),
  S('LISTEN.T7', 'SIMPLE_PAST', 'Use the past tense in a dialogue', ['c'], 'Uses the regular (-ed) and irregular (went, ate, saw) past forms when the time is past, and uses the present forms for habits and facts, in short dialogues', FORMS3, ['G3:LANGUA.T2.b'], ['recall', 'rule'], ['GRAMMA.T7.FUTURE_WILL_SHALL']),
  // ---------------------------------------------------------------- Writing: mechanics and structure
  S('WRITIN.T7', 'CAPITALS_FULL_STOPS', 'Use capital letters and full stops', ['a', 'b'], 'Starts a sentence and every name with a capital letter, writes I as a capital, and ends a statement with a full stop', FORMSS, ['G3:WRITIN.T10.b'], ['rule'], ['WRITIN.T7.COMMAS']),
  S('WRITIN.T9', 'COMMAS', 'Use commas in a list', ['a', 'b'], 'Puts a comma between the items of a list (with and before the last), not after the last item and not between a person and what the person does', FORMSS, ['WRITIN.T7.CAPITALS_FULL_STOPS', 'G3:WRITIN.T9.b'], ['rule'], ['WRITIN.T7.COMMAS']),
  S('WRITIN.T9', 'QUESTION_MARKS', 'Use the question mark', ['a', 'b'], 'Ends an asking sentence with a question mark, and a telling sentence with a full stop, even when the sentence has a question word in it', FORMSS, ['WRITIN.T7.CAPITALS_FULL_STOPS', 'G3:LANGUA.T13.b'], ['rule'], ['WRITIN.T9.EXCLAMATION_MARK']),
  S('WRITIN.T11', 'MISSPELT_WORDS', 'Spell commonly misspelt words', ['a', 'b'], 'Spells words like because, friend, beautiful, believe, library, Wednesday and tomorrow correctly, from the first letters to the last', FORMS3, ['G3:WRITIN.T7.a'], ['recall'], ['WRITIN.T11.HOMOPHONES']),
  S('WRITIN.T13', 'DOUBLE_CONSONANTS', 'Spell words with double consonants', ['a', 'b'], 'Spells words with a double consonant (summer, coffee, address, rabbit, letter) and does not double a letter that has only one', FORMS3, ['G3:WRITIN.T8.a'], ['recall'], ['WRITIN.T13.DOUBLE_LETTERS']),
  S('WRITIN.T1', 'FORM_INFORMATION', 'Know what goes in each part of a form', ['a'], 'Says which piece of information belongs in a box of a school, clinic or library form (name, date of birth, class, address, parent contact)', ['choose the correct entry', 'spot the mistake'], [], ['recall']),
  S('WRITIN.T4', 'LETTER_PARTS', 'Know the parts of a friendly letter', ['a'], 'Names and orders the parts of a friendly letter (address, date, greeting, body, closing, name) and the punctuation of the greeting and closing', ['choose the correct part', 'choose the correct order'], ['G3:WRITIN.T13.b'], ['recall']),
  S('WRITIN.T5', 'NARRATIVE_PARTS', 'Know the parts of a narrative composition', ['a'], 'Says what the title, beginning, middle and end of a narrative tell (characters and setting, the problem, what happens, how it ends)', ['choose the correct part', 'spot the mistake'], ['G3:WRITIN.T14.a'], ['recall']),
  S('WRITIN.T5', 'PARAGRAPH_ORDER', 'Put sentences in order to make a paragraph', ['b'], 'Finds the topic sentence and puts four jumbled sentences in the order that makes a clear paragraph', ['choose the order', 'choose the topic sentence'], ['G3:WRITIN.T12.a'], ['rule']),
  S('WRITIN.T10', 'DESCRIPTIVE_PARTS', 'Know the parts of a descriptive composition', ['a'], 'Says what the introduction, the description (using the senses) and the conclusion of a descriptive composition do, and tells a description from a story', ['choose the correct part', 'spot the mistake'], ['LANGUA.T5.ADJECTIVES'], ['recall']),
  S('WRITIN.T12', 'DIARY_PARTS', 'Know the parts of a diary entry', ['a'], 'Says what a diary entry has (date, a greeting to the diary, what happened and how the writer felt, in the first person and the past tense) and what it does not have', ['choose the correct part', 'spot the mistake'], ['G3:WRITIN.T14.a'], ['recall']),
  S('WRITIN.T6', 'PICTURE_SEQUENCE', 'Put the pictures of a story in order', ['a'], 'Orders four pictures, given in words, so that the story makes sense, and picks the sentence that tells one picture in the past tense', ['choose the order', 'choose the sentence'], ['G3:WRITIN.T11.a'], ['rule']),
  // ---------------------------------------------------------------- Reading
  S('READIN.T1', 'DICTIONARY_USE', 'Use a dictionary: order, guide words and meaning', ['a'], 'Puts words in alphabetical order (using the second and third letters when the first match), uses guide words to find the page, and picks the right meaning of a word from its entry', ['alphabetical order', 'guide words', 'choose the meaning'], ['G3:READIN.T1_FLUENCY.a'], ['rule'], ['READIN.T1.REFERENCE_MATERIALS']),
  S('READIN.T1', 'REFERENCE_MATERIALS', 'Choose the right reference book', ['b', 'c'], 'Chooses the dictionary, junior encyclopaedia, atlas, newspaper or timetable for what the child needs to find out', FORMS3, ['READIN.T1.DICTIONARY_USE'], ['recall'], ['READIN.T1.REFERENCE_MATERIALS']),
  S('READIN.T2', 'FACTUAL_QUESTIONS', 'Answer direct questions from a text', ['b'], 'Finds an answer that is written in the text (who, what, where, when) and says whether a statement is true, false or not stated', ['choose the answer', 'type a short answer', 'true, false or not stated'], ['G3:READIN.T1_COMPREHENSION.d'], ['recall'], ['READIN.T2.FACTUAL_QUESTIONS']),
  S('READIN.T2', 'INFERENCE_QUESTIONS', 'Answer indirect questions from a text', ['b'], 'Works out what is not written but is shown by clues (why a person felt or did something) and does not copy a sentence, go against the text or go too far', ['choose the answer', 'choose what can be worked out'], ['READIN.T2.FACTUAL_QUESTIONS', 'G3:READIN.T2_COMPREHENSION.d'], ['inference'], ['READIN.T2.INFERENCE_QUESTIONS']),
  S('READIN.T2', 'CONTEXT_CLUES', 'Use clues in the text to find a word\'s meaning', ['b'], 'Picks the meaning of a new word from the sentences around it, and the words that give the clue', ['choose the meaning', 'choose the clue'], ['G3:READIN.T1_COMPREHENSION.c'], ['inference'], ['READIN.T2.CONTEXT_CLUES']),
  S('READIN.T4', 'VISUALS', 'Read a notice, timetable or chart', ['a', 'b'], 'Finds a detail in a notice, table or timetable written in words and numbers, and says what the visual is for', ['choose the answer', 'type a short answer'], ['G3:READIN.T6_COMPREHENSION.c'], ['recall'], ['READIN.T5.SCAN_SKIM']),
  S('READIN.T5', 'SCAN_FOR_DETAIL', 'Scan a text for a detail', ['c'], 'Finds a number, time, price or name by looking for the key word in the question, not by reading every word', ['choose the answer', 'type a short answer'], ['READIN.T2.FACTUAL_QUESTIONS'], ['recall'], ['READIN.T5.SCAN_SKIM']),
  S('READIN.T12', 'PROVERBS', 'Know proverbs and what they teach', ['a', 'c'], 'Says the lesson of a common proverb and finishes a proverb with its right word, and does not read it as only about the animals or things in it', ['choose the meaning', 'finish the proverb'], ['G3:READIN.T12_COMPREHENSION.d'], ['recall'], ['LISTEN.T8.PROVERBS']),
  // ---------------------------------------------------------------- The words of the themes
  S('LISTEN.T3', 'POLITE_WORDS', 'Choose polite words and phrases', ['b', 'd'], 'Picks the polite word or phrase for a situation (asking, thanking, apologising, refusing) and does not choose a command or a rude answer', ['choose the polite words', 'spot the mistake'], ['G3:LISTEN.T3.c'], ['recall'], ['LISTEN.T3.POLITE_EXPRESSIONS']),
  S('LISTEN.T4', 'FIRST_AID_WORDS', 'Use first aid words', ['c'], 'Uses the words of first aid (bandage, wound, bruise, sprain, ambulance, first aid kit) in the right sentence', FORMS3, ['G3:LISTEN.T4.c'], ['recall'], ['LISTEN.T4.ROAD_SAFETY_WORDS']),
  S('LISTEN.T5', 'NUTRITION_WORDS', 'Use words about food and a balanced diet', ['b'], 'Uses the words of nutrition (protein, vitamins, carbohydrates, balanced diet, fibre, nutrients) in the right sentence', FORMS3, ['G3:LISTEN.T12.c'], ['recall'], ['LISTEN.T1.THEME_WORDS']),
  S('LISTEN.T6', 'INTERNET_WORDS', 'Use words about the internet, email and safety online', ['c'], 'Uses email, inbox, attachment, subject, password, website, search and download in the right sentence, and tells safe online habits from unsafe ones', FORMS3, ['G3:LISTEN.T6.c'], ['recall'], ['LISTEN.T1.THEME_WORDS'], ),
  S('LISTEN.T8', 'FARM_WORDS', 'Use words about the farm', ['c'], 'Uses the words of the farm (harvest, seedlings, fertiliser, livestock, plough, weeding) in the right sentence', FORMS3, ['G3:LISTEN.T8.c'], ['recall'], ['LISTEN.T1.THEME_WORDS']),
  S('LISTEN.T10', 'HYGIENE_WORDS', 'Use words about hygiene and sanitation', ['d'], 'Uses the words of hygiene (germs, sanitiser, latrine, rubbish, disinfect, drainage) in the right sentence', FORMS3, ['G3:LISTEN.T12.c'], ['recall'], ['LISTEN.T1.THEME_WORDS']),
  S('LISTEN.T13', 'MONEY_WORDS', 'Use words about money', ['d'], 'Uses the words of money (savings, budget, price, change, loan, borrow, earn) in the right sentence and does not swap earn with save or borrow with lend', FORMS3, ['G3:LISTEN.T13.c'], ['recall'], ['LISTEN.T1.THEME_WORDS']),
  S('LISTEN.T11', 'SPORTS_WORDS', 'Use words about sports and games', ['b'], 'Uses the words of sport (referee, goalkeeper, tournament, trophy, opponent, whistle) in the right sentence', FORMS3, ['G3:LISTEN.T11.c'], ['recall'], ['LISTEN.T1.THEME_WORDS']),
  S('LISTEN.T12', 'ENVIRONMENT_WORDS', 'Use words about a clean environment', ['c'], 'Uses the words of the environment (pollution, recycle, litter, compost, conserve, habitat) in the right sentence', FORMS3, ['G3:LISTEN.T15.b'], ['recall'], ['LISTEN.T1.THEME_WORDS']),
  S('LISTEN.T13', 'SILENT_LETTERS', 'Find the silent letter in a word', ['b'], 'Names the silent letter in words like knife, write, lamb, listen, hour and walk, and does not pick the letter beside it', ['choose the letter', 'type the letter', 'spot the mistake'], ['G3:LISTEN.T13.a'], ['recall'], ['WRITIN.T13.DOUBLE_LETTERS']),
];

// The design repeats some outcomes in later themes (read a text for factual and inferential information, vocabulary, spelling).
// The same skill serves them: 'SUB.letter' of another sub-strand.
export const ALSO = {
  'READIN.T2.FACTUAL_QUESTIONS': ['READIN.T3.a', 'READIN.T3.b', 'READIN.T6.a', 'READIN.T6.b', 'READIN.T9.a', 'READIN.T9.b', 'READIN.T10.a', 'READIN.T10.b', 'READIN.T11.a', 'READIN.T11.b', 'READIN.T2.a'],
  'READIN.T2.INFERENCE_QUESTIONS': ['READIN.T3.b', 'READIN.T6.b', 'READIN.T9.b', 'READIN.T10.b', 'READIN.T11.b'],
  'READIN.T2.CONTEXT_CLUES': ['READIN.T3.b'],
  'READIN.T5.SCAN_FOR_DETAIL': ['READIN.T13.a', 'READIN.T13.b'],
  'READIN.T1.REFERENCE_MATERIALS': ['READIN.T1.a'],
  'WRITIN.T5.NARRATIVE_PARTS': ['WRITIN.T8.a'],
  'WRITIN.T5.PARAGRAPH_ORDER': ['WRITIN.T8.b', 'WRITIN.T10.b'],
  'WRITIN.T13.DOUBLE_CONSONANTS': ['WRITIN.T3.b', 'WRITIN.T3.c', 'WRITIN.T11.c', 'WRITIN.T13.c'],
  'WRITIN.T11.MISSPELT_WORDS': ['WRITIN.T11.c'],
  'WRITIN.T7.CAPITALS_FULL_STOPS': ['WRITIN.T7.c'],
  'WRITIN.T9.COMMAS': ['WRITIN.T9.c'],
  'LISTEN.T3.POLITE_WORDS': ['LISTEN.T3.e'],
  'LISTEN.T6.INTERNET_WORDS': ['LISTEN.T7.b'],
  'LANGUA.T4.PERSONAL_PRONOUNS': ['LANGUA.T4.c'],
  'LANGUA.T1.ARTICLES': ['LANGUA.T1.c'],
};

// A skill with no testable form here has a reason, kept for the review document.
export const NOT_BUILT = [
  ['LISTEN.T13.c / LISTEN.T5.c', 'The language patterns "very ... but ..." and the Theme 5 oral pattern', 'The pattern is said aloud in a dialogue and the design does not give a written form to test. A teacher listens, or a voice tool checks it. No family is written until a teacher says which sentences the pattern covers.'],
  ['LANGUA.T6 or T9', 'Present progressive with state verbs (I am knowing)', 'A real error, but the list of verbs that do not take -ing needs a teacher decision first.'],
];

// ---------------------------------------------------------------- the misconception library
// R(code, error, question, wrong, right, cause, feedback, source?, help?) : one row; reveals and help are written from the row unless given.
const R = (code, error, q, wrong, right, cause, feedback, source = TO_CONFIRM, help = null) => ({ code, error, q, wrong, right, cause, feedback, source, help });
const K = KISWAHILI;
const LIB = {
  'LANGUA.T1.ARTICLES': [
    R('M_ART_A_BEFORE_VOWEL', 'Writes a before a word that starts with a vowel sound.', 'She ate ___ orange.', 'a', 'an', 'Learns "a" as the only small word and does not listen to the first sound of the next word.', 'Before a vowel sound (a, e, i, o, u) use "an": an orange, an egg.'),
    R('M_ART_AN_BEFORE_CONSONANT', 'Writes an before a word that starts with a consonant sound.', 'I bought ___ book.', 'an', 'a', 'Over-corrects after learning that "an" goes before vowels.', 'Before a consonant sound use "a": a book, a pen.'),
    R('M_ART_SOUND_NOT_LETTER', 'Chooses a or an by the first letter, not the first sound.', 'We waited for ___ hour.', 'a', 'an', 'Looks at the letter h (or u) instead of listening to the sound.', 'Listen to the sound, not the letter. "Hour" starts with the sound "ow", so it takes "an". "Uniform" starts with the sound "yoo", so it takes "a".'),
    R('M_ART_THE_FIRST_MENTION', 'Uses the for something that has not been mentioned before.', 'Mama gave me ___ apple.', 'the', 'an', 'Thinks the is the main article.', 'Use a or an the first time you speak about a thing. Use the when both people already know which one.'),
    R('M_ART_A_FOR_KNOWN', 'Uses a or an for something that is known or the only one.', 'We feel the heat of ___ sun.', 'a', 'the', 'Does not see that there is only one of it.', 'Use the for something that is the only one (the sun, the moon) or that both people know about.'),
    R('M_ART_OMITTED', 'Leaves out the article before a singular noun.', 'Kamau has ___ new bicycle.', 'no article', 'a', 'Kiswahili has no articles, so the small word is not heard as needed.', 'A singular thing you can count needs a, an or the before it: a new bicycle.', K),
    R('M_ART_THE_GENERAL', 'Uses the for things in general, or uses a with a plural.', '___ lions are strong animals.', 'The', 'no article (Lions are strong animals.)', 'Believes "the" is needed before every noun.', 'When you speak about a kind of thing in general, use no article: Lions are strong animals. Use "the" for one particular thing both people know.'),
  ],
  'LANGUA.T2.PLURALS_REGULAR': [
    R('M_PLR_NO_ES', 'Adds only -s to a word that ends in s, x, ch or sh.', 'two ___ (box)', 'boxs', 'boxes', 'Uses the plain -s rule for every word.', 'After s, x, ch and sh we add -es so that the word can be said: box, boxes; church, churches.'),
    R('M_PLR_Y_TO_S', 'Adds -s to a word that ends in a consonant and y.', 'three ___ (baby)', 'babys', 'babies', 'Does not change y to i before the ending.', 'When a word ends in a consonant and y, change the y to i and add -es: baby, babies.'),
    R('M_PLR_VOWEL_Y_IES', 'Changes y to -ies after a vowel.', 'two ___ (monkey)', 'monkies', 'monkeys', 'Over-corrects after learning baby, babies.', 'When a vowel comes before the y, just add -s: monkey, monkeys; day, days.'),
    R('M_PLR_F_NO_VES', 'Adds -s to knife, leaf, wife and loaf.', 'two ___ (leaf)', 'leafs', 'leaves', 'Does not know the f to v change.', 'Some words ending in f or fe change to -ves: leaf, leaves; knife, knives; wife, wives.'),
    R('M_PLR_SINGULAR_AFTER_NUMBER', 'Keeps the noun singular after a number.', 'I have four ___.', 'book', 'books', 'Kiswahili does not change the noun after a number in the same way.', 'After two, three, four or any number above one, the noun must be plural: four books.', K),
  ],
  'LANGUA.T2.PLURALS_IRREGULAR': [
    R('M_PLI_ADD_S', 'Adds -s to an irregular noun.', 'three ___ (child)', 'childs', 'children', 'Uses the regular rule for every noun.', 'A few nouns change in their own way. The plural of child is children, and of man is men.'),
    R('M_PLI_DOUBLE_PLURAL', 'Adds -s to a plural that is already plural.', 'Many ___ were playing. (child)', 'childrens', 'children', 'Knows the word changes but adds -s from habit.', 'Children, men and women are already plural. Do not add -s.'),
    R('M_PLI_FOOT_TOOTH', 'Writes tooths, mouses or gooses.', 'two ___ (tooth)', 'tooths', 'teeth', 'Does not know the vowel change.', 'Some plurals change the vowels inside the word: tooth, teeth; mouse, mice; goose, geese.'),
    R('M_PLI_SAME_FORM_S', 'Adds -s to sheep or fish.', 'ten ___ (sheep)', 'sheeps', 'sheep', 'Treats every animal word as regular.', 'Sheep stays sheep. We say one sheep and ten sheep. Fish is the same.'),
  ],
  'LANGUA.T3.POLITE_PATTERN': [
    R('M_PAT_VERB_FORM', 'Puts to, -s or -ing after May I or Could you.', 'May I ___ in?', 'to come', 'come', 'Thinks every verb needs "to" before it.', 'After May I and Could you the verb stays plain: May I come in? Could you help me?', K),
    R('M_PAT_NO_PLEASE', 'Makes a request as a command.', 'Which is polite? Give me water.', 'Give me water.', 'Could you give me some water, please?', 'Uses the command that is quick and short.', 'A polite request uses May I or Could you, and the word please.'),
    R('M_PAT_WOULD_LIKE_FORM', 'Writes Would you like with -ing or a wrong verb form.', '___ you like some tea?', 'Do', 'Would', 'Mixes Would you like with Do you want.', 'To offer something politely we say: Would you like some tea? The verb after like is to + the plain verb, or a noun.'),
    R('M_PAT_ORDER', 'Puts the words of the request in the wrong order.', 'Could ___ help me?', 'help you', 'you help', 'Does not move the helping word before the subject.', 'In a request the helping word comes first: Could you help me? May I borrow your pen?'),
  ],
  'LANGUA.T4.PERSONAL_PRONOUNS': [
    R('M_PRO_SUBJECT_AS_OBJECT', 'Uses I, he, we or they after a verb or a small word.', 'Mum gave the book to ___.', 'I', 'me', 'Hears "Him and I" in speech and over-corrects.', 'After a verb or a small word like to, for or with, use me, him, her, us or them.'),
    R('M_PRO_OBJECT_AS_SUBJECT', 'Uses me, him, us or them before the verb.', '___ went to the market.', 'Me and Wanjiru', 'Wanjiru and I', 'Uses the object form in a pair of names.', 'Before a verb, who does the action? Use I, he, she, we or they: Wanjiru and I went to the market.'),
    R('M_PRO_NOUN_AND_PRONOUN', 'Says the noun and then repeats it with a pronoun.', 'Wanjiru ___ is tall.', 'she', 'no pronoun', 'Copies the pattern of speech where the name is said and then repeated.', 'Do not say the name and the pronoun together. Wanjiru is tall, or She is tall.'),
    R('M_PRO_GENDER', 'Says he for a girl, or she for a boy.', 'Akinyi is my sister. ___ is nine.', 'He', 'She', 'Kiswahili has one word (yeye) for he and she.', 'Use he for a boy or man and she for a girl or woman.', K),
  ],
  'LANGUA.T4.POSSESSIVE_PRONOUNS': [
    R('M_POS_DETERMINER_FOR_PRONOUN', 'Writes my, your or her when no noun follows.', 'That bag is ___.', 'my', 'mine', 'Does not tell the two sets apart.', 'When no noun comes after, use mine, yours, hers, ours or theirs: That bag is mine.'),
    R('M_POS_PRONOUN_BEFORE_NOUN', 'Writes mine, yours or hers before a noun.', 'This is ___ pencil.', 'mine', 'my', 'Over-uses the form that stands alone.', 'Before a noun use my, your, her, our or their: my pencil.'),
    R('M_POS_APOSTROPHE', 'Writes your\'s, her\'s or our\'s.', 'The blue pen is ___.', 'your\'s', 'yours', 'Thinks a belonging word needs an apostrophe, as in a name.', 'Words like yours, hers, ours and theirs never have an apostrophe.'),
    R('M_POS_WRONG_PERSON', 'Uses the possessive of another person.', 'Wafula, this book is not mine. It is ___.', 'his', 'yours', 'Does not follow who is speaking and who is spoken to.', 'Ask who owns it. The person spoken to is you, so the word is yours.'),
  ],
  'LANGUA.T5.ADJECTIVES': [
    R('M_ADJ_NOUN_AS_ADJ', 'Picks the noun as the describing word.', 'The red bus stopped.', 'bus', 'red', 'Does not tell what the word does in the sentence.', 'An adjective describes a noun. Ask which word tells more about the bus: red.'),
    R('M_ADJ_VERB_AS_ADJ', 'Picks the verb as the describing word.', 'The tall girl ran home.', 'ran', 'tall', 'Takes any word that adds meaning as a describing word.', 'A verb tells what someone does. An adjective tells what someone or something is like.'),
    R('M_ADJ_ADVERB_AS_ADJ', 'Picks an adverb as the adjective.', 'The small boy walked slowly.', 'slowly', 'small', 'Does not separate describing a noun from describing a verb.', 'Slowly tells how the boy walked, so it is an adverb. Small tells what the boy is like, so it is the adjective.'),
    R('M_ADJ_ARTICLE_AS_ADJ', 'Picks a, an or the as the adjective.', 'Mama bought a sweet mango.', 'a', 'sweet', 'Thinks any small word before a noun describes it.', 'A, an and the point to a noun but do not describe it. Sweet describes the mango.'),
  ],
  'LANGUA.T5.ADJECTIVE_ORDER': [
    R('M_ADO_SHAPE_BEFORE_SIZE', 'Puts the shape before the size.', 'She sat on a ___ stool.', 'round big', 'big round', 'No fixed order is known.', 'Size comes first, then shape: a big round stool.'),
    R('M_ADO_AFTER_NOUN', 'Puts the adjective after the noun.', 'Amina has a ___.', 'ball big', 'big ball', 'Kiswahili puts the adjective after the noun.', 'In English the describing word comes before the noun: a big ball.', K),
    R('M_ADO_NO_AND', 'Joins two adjectives with and or a comma.', 'a ___ table', 'big and round', 'big round', 'Copies the way two things are joined in speech.', 'Two describing words before a noun need no and and no comma: a big round table.'),
  ],
  'LANGUA.T6.COUNT_UNCOUNT': [
    R('M_QUA_MUCH_COUNT', 'Uses much with things that can be counted.', 'There are not ___ chairs.', 'much', 'many', 'Treats many and much as the same word.', 'Use many with things you can count (chairs, books). Use much with things you cannot count (water, sugar).'),
    R('M_QUA_MANY_UNCOUNT', 'Uses many with things that cannot be counted.', 'There is not ___ water.', 'many', 'much', 'Over-corrects after learning many.', 'You cannot count water one by one, so use much, not many.'),
    R('M_QUA_FEW_UNCOUNT', 'Uses few with something uncountable, or little with something countable.', 'We have ___ sugar left.', 'few', 'little', 'Does not link few and little to what is counted.', 'Few goes with things you can count: few eggs. Little goes with things you cannot count: little sugar.'),
    R('M_QUA_MUCH_IN_STATEMENT', 'Uses much in a plain positive statement.', 'She has ___ friends.', 'much', 'many (or a lot of)', 'Does not know that much is mostly kept for questions and negatives.', 'In a positive sentence we usually say a lot of or many: She has many friends.'),
  ],
  'LANGUA.T6.SOME_ANY': [
    R('M_QSA_ANY_STATEMENT', 'Uses any in a positive sentence.', 'I have ___ sugar.', 'any', 'some', 'Does not tell positive from negative sentences.', 'Use some in a positive sentence: I have some sugar. Use any in a question or after not: I do not have any sugar.'),
    R('M_QSA_SOME_NEGATIVE', 'Uses some after not.', 'I do not have ___ money.', 'some', 'any', 'Keeps one word for all sentences.', 'After not or in a question, use any: I do not have any money. Do you have any money?'),
    R('M_QSA_ENOUGH_AFTER', 'Puts enough after the noun.', 'We have ___ for everyone.', 'food enough', 'enough food', 'Kiswahili puts "enough" (tosha) after the noun.', 'In English enough comes before the noun: enough food.', K),
    R('M_QSA_A_LOT_NOUN', 'Writes a lot before the noun without of.', 'There are ___ mangoes.', 'a lot mangoes', 'a lot of mangoes', 'Leaves out the small word of.', 'A lot needs of before the noun: a lot of mangoes.', K),
  ],
  'LANGUA.T7.PRESENT_PROGRESSIVE': [
    R('M_PRP_NO_BE', 'Leaves out am, is or are.', 'She ___ reading now.', 'reading', 'is reading', 'Kiswahili says "anasoma" with no separate helping word.', 'An action happening now needs am, is or are before the -ing word: She is reading.', K),
    R('M_PRP_WRONG_BE', 'Uses the wrong form of be.', 'The children ___ playing.', 'is', 'are', 'Does not match the helping word to the subject.', 'Use am with I, is with one person or thing, and are with you, we, they and plural nouns.'),
    R('M_PRP_NO_ING', 'Writes the plain verb after is or are.', 'He is ___ now.', 'play', 'playing', 'Forgets that the verb takes -ing after the helping word.', 'After am, is or are, the verb ends in -ing: He is playing.'),
    R('M_PRP_ING_SPELLING', 'Spells the -ing form wrongly.', 'She is ___ a cake.', 'makeing', 'making', 'Does not drop the silent e or double the last consonant.', 'Drop the silent e before -ing (make, making). For short words with one vowel, double the last letter (run, running).'),
  ],
  'LANGUA.T7.PAST_PROGRESSIVE': [
    R('M_PAP_PRESENT_FOR_PAST', 'Uses is or are for an action that was going on in the past.', 'When I arrived, Mum ___ cooking.', 'is', 'was', 'Does not follow the time words of the sentence.', 'For something that was going on in the past, use was or were: Mum was cooking.'),
    R('M_PAP_WAS_WERE', 'Mixes up was and were.', 'The boys ___ running.', 'was', 'were', 'Does not match the helping word to the subject.', 'Use was with I and one person or thing. Use were with you, we, they and plural nouns.'),
    R('M_PAP_PAST_FORM', 'Writes was or were with the past form of the verb.', 'He was ___ his lunch.', 'ate', 'eating', 'Thinks the verb must also show the past.', 'After was or were, the verb ends in -ing: He was eating his lunch.'),
    R('M_PAP_NO_ING', 'Writes the plain verb after was or were.', 'They were ___ football.', 'play', 'playing', 'Forgets the -ing ending.', 'After was or were, the main verb takes -ing: They were playing football.'),
  ],
  'LANGUA.T8.CONTRACTIONS': [
    R('M_CON_NO_APOSTROPHE', 'Leaves out the apostrophe.', 'I ___ like fish. (do not)', 'dont', 'don\'t', 'Does not know the apostrophe marks the missing letter.', 'The apostrophe takes the place of the missing letter: do not becomes don\'t.'),
    R('M_CON_WRONG_PLACE', 'Puts the apostrophe in the wrong place.', 'She ___ at home. (is not)', 'is\'nt', 'isn\'t', 'Puts it between the two words instead of where the letter is missing.', 'The apostrophe goes where the letter was left out: is not becomes isn\'t, with the mark in place of the o.'),
    R('M_CON_ITS', 'Writes its for it is, or it\'s for belonging to it.', '___ raining today. (it is)', 'Its', 'It\'s', 'Mixes up the two words that sound the same.', 'It\'s means it is. Its (no apostrophe) means belonging to it: The cat licked its paw.'),
    R('M_CON_WRONG_FORM', 'Makes a short form that does not exist.', 'We ___ go. (will not)', 'willn\'t', 'won\'t', 'Adds n\'t to every helping word.', 'A few short forms change: will not is won\'t, can not is can\'t.'),
  ],
  'LANGUA.T8.NEGATIVE_STATEMENTS': [
    R('M_NEG_DOUBLE', 'Uses two negative words together.', 'I do not have ___ pen.', 'no', 'a', 'Copies speech where two negatives add emphasis.', 'In English one negative is enough: I do not have a pen, or I have no pen.'),
    R('M_NEG_NO_DO', 'Writes not before the verb with no helping word.', 'She ___ like milk.', 'not', 'does not', 'Kiswahili puts a negative in the verb itself (hapendi).', 'In English use do not or does not before the verb: She does not like milk.', K),
    R('M_NEG_VERB_S', 'Keeps -s or -ed on the verb after does not or did not.', 'He does not ___ meat.', 'eats', 'eat', 'Marks the verb twice.', 'After does not and did not, the verb stays plain: He does not eat meat.'),
    R('M_NEG_DO_WITH_BE', 'Uses do not with am, is or are.', 'I ___ tired.', 'do not', 'am not', 'Uses do not for every negative.', 'With am, is and are, put not after the helping word: I am not tired.'),
  ],
  'LANGUA.T9.ADVERBS': [
    R('M_ADV_ADJ_FOR_ADV', 'Uses an adjective after the verb where an adverb is needed.', 'She sings ___.', 'beautiful', 'beautifully', 'Kiswahili uses the same word for both in many sentences.', 'A word that tells how someone does something is an adverb. Many adverbs end in -ly: sings beautifully.', K),
    R('M_ADV_KIND_MIX', 'Gives the wrong kind to an adverb of time, place or manner.', 'Which kind of adverb is "yesterday"?', 'manner', 'time', 'Does not ask the question the adverb answers.', 'Manner answers how, time answers when, place answers where. Yesterday tells when.'),
    R('M_ADV_GOOD_WELL', 'Uses good where well is needed.', 'He plays football ___.', 'good', 'well', 'Does not know that good is an adjective.', 'Good describes a noun (a good player). Well tells how something is done (plays well).'),
    R('M_ADV_FASTLY', 'Adds -ly to fast, hard or late.', 'The bus goes ___.', 'fastly', 'fast', 'Over-uses the -ly rule.', 'Fast, hard and late are adverbs already. We say runs fast and works hard.'),
  ],
  'LANGUA.T10.CONJUNCTIONS': [
    R('M_CNJ_BUT_FOR_AND', 'Uses but where the two parts agree.', 'Ali likes tea ___ coffee.', 'but', 'and', 'Thinks every joining word is but.', 'Use and to add one idea to another. Use but when the two ideas go against each other.'),
    R('M_CNJ_BECAUSE_SO', 'Swaps because and so.', 'It was raining, ___ we stayed inside.', 'because', 'so', 'Mixes up a reason with a result.', 'Because gives the reason. So gives the result. The rain is the reason; staying inside is the result.'),
    R('M_CNJ_AND_FOR_BUT', 'Uses and where the two ideas go against each other.', 'I wanted to play, ___ I was tired.', 'and', 'but', 'Uses and as the all-purpose joining word.', 'When the second idea goes against the first, use but, not and.'),
    R('M_CNJ_AND_FOR_OR', 'Uses and where there is a choice.', 'Would you like tea ___ juice?', 'and', 'or', 'Does not hear the choice.', 'To offer a choice use or. And joins two things that are both there.'),
    R('M_CNJ_OR_FOR_AND', 'Uses or where both things happen.', 'Mama bought rice ___ beans.', 'or', 'and', 'Does not hear the choice in or.', 'Or shows a choice between two things. And joins two things that are both there.'),
    R('M_CNJ_DOUBLE', 'Uses two joining words for one link.', 'Although it was late, ___ we went on.', 'but', 'no joining word', 'Copies the two-word pattern of speech.', 'One joining word is enough between two ideas. Use although or but, not both.'),
  ],
  'LANGUA.T11.INTERROGATIVES': [
    R('M_INT_WHO_FOR_WHAT', 'Uses who for a thing and what for a person.', '___ is your teacher?', 'What', 'Who', 'Does not link the question word to the kind of answer.', 'Who asks about a person. What asks about a thing.'),
    R('M_INT_WHERE_FOR_WHEN', 'Uses where for a time and when for a place.', '___ do we start? At nine o\'clock.', 'Where', 'When', 'Does not listen to the answer.', 'When asks about time. Where asks about a place. Why asks for a reason.'),
    R('M_INT_NO_INVERSION', 'Keeps the statement order in a question.', 'Where ___ going?', 'you are', 'are you', 'Kiswahili questions keep the same order with a question word.', 'In a question the helping word goes before the subject: Where are you going?', K),
    R('M_INT_DO_EXTRA', 'Adds do to a question that already has is, are or can.', 'How ___ you?', 'do are', 'are', 'Adds do to every question.', 'Use only one helping word. How are you? Where do you live?'),
    R('M_INT_WHOSE_WHOS', 'Writes who\'s for whose.', '___ bag is this?', 'Who\'s', 'Whose', 'Mixes up two words that sound the same.', 'Whose asks who owns something. Who\'s means who is.'),
  ],
  'LANGUA.T12.PRESENT_PERFECT': [
    R('M_PPF_PAST_FORM', 'Uses the simple past form after have or has.', 'I have ___ my lunch.', 'ate', 'eaten', 'Does not know the past participle of irregular verbs.', 'After have or has use the past participle: have eaten, has gone, have seen.'),
    R('M_PPF_HAS_HAVE', 'Mixes have and has.', 'She ___ finished her work.', 'have', 'has', 'Does not match the helping word to the subject.', 'Use has with he, she, it and one person or thing. Use have with I, you, we, they and plural nouns.'),
    R('M_PPF_BASE_VERB', 'Uses the plain verb after have or has.', 'They have ___ home.', 'go', 'gone', 'Leaves out the past participle ending.', 'After have or has the verb needs its past participle: gone, taken, written.'),
    R('M_PPF_WITH_PAST_TIME', 'Uses have or has with yesterday, last week or an exact past time.', 'I ___ him yesterday.', 'have seen', 'saw', 'Thinks have or has is simply a past marker.', 'When the time is named (yesterday, last week), use the simple past: I saw him yesterday.'),
  ],
  'LANGUA.T12.PAST_PERFECT': [
    R('M_PAF_HAD_MISSING', 'Uses the simple past for both events.', 'The bus ___ left before I arrived.', 'was', 'had', 'Does not mark which event came first.', 'The earlier of two past events takes had + participle: The bus had left before I arrived.'),
    R('M_PAF_HAVE_FOR_HAD', 'Uses have or has where had is needed.', 'When I got home, Mum ___ cooked.', 'has', 'had', 'Does not move the helping word into the past.', 'In a story about the past, use had, not have or has.'),
    R('M_PAF_BASE_VERB', 'Uses the plain verb after had.', 'She had ___ her homework.', 'finish', 'finished', 'Forgets the past participle.', 'After had the verb is a participle: had finished, had gone.'),
    R('M_PAF_WRONG_ORDER', 'Puts had on the event that happened second.', 'Which happened first? Wanjiru had left when I arrived.', 'I arrived', 'Wanjiru left', 'Does not see that had marks the earlier event.', 'The event with had happened first. Wanjiru had left, then I arrived.'),
  ],
  'LANGUA.T13.PREP_POSITION': [
    R('M_PRE_IN_ON', 'Mixes up in and on.', 'The cup is ___ the table.', 'in', 'on', 'Does not picture the position.', 'On means touching the top of something. In means inside it.'),
    R('M_PRE_BETWEEN_AMONG', 'Uses between for three or more things, or among for two.', 'The ball is ___ the two boys.', 'among', 'between', 'Does not count the things.', 'Use between for two things and among for more than two.'),
    R('M_PRE_UNDER_OVER', 'Picks the opposite preposition.', 'The cat is ___ the bed (hiding below it).', 'on', 'under', 'Does not picture where the thing is.', 'Under means below something. Behind means at the back of it.'),
    R('M_PRE_FRONT_BEHIND', 'Mixes up in front of and behind.', 'Juma stood ___ Achieng at the end of the line.', 'in front of', 'behind', 'Does not picture the line.', 'In front of means before it. Behind means after it, at the back.'),
  ],
  'LANGUA.T13.PREP_DIRECTION': [
    R('M_PRD_TO_INTO', 'Uses to where into (going inside) is needed.', 'He ran ___ the room.', 'to', 'into', 'Does not feel the idea of going inside.', 'Into shows going from outside to inside a place. To shows going towards it.'),
    R('M_PRD_AT_FOR_TO', 'Uses at after go.', 'We go ___ school every day.', 'at', 'to', 'Mixes the place and the movement words.', 'After go use to: go to school. At tells where something is.', K),
    R('M_PRD_TO_HOME', 'Writes to before home.', 'I went ___ after school.', 'to home', 'home', 'Copies the pattern "go to school".', 'Home needs no word before it after go: I went home.'),
    R('M_PRD_THROUGH_ACROSS', 'Mixes through and across.', 'The goat ran ___ the road to the other side.', 'through', 'across', 'Does not picture the movement.', 'Across means from one side of a flat place to the other. Through means passing in at one side and out at the other.'),
  ],
  'LISTEN.T7.SIMPLE_PAST': [
    R('M_SPA_BASE_FOR_PAST', 'Uses the plain verb for something that happened already.', 'Yesterday I ___ to the market.', 'go', 'went', 'Kiswahili shows the past in the verb start (nilienda), so the time word seems enough.', 'When the time is past, the verb must show it: Yesterday I went to the market.', K),
    R('M_SPA_ED_ON_IRREGULAR', 'Adds -ed to an irregular verb.', 'She ___ rice for lunch. (eat)', 'eated', 'ate', 'Uses the regular rule for every verb.', 'Some verbs change inside: go, went; eat, ate; see, saw. They do not take -ed.'),
    R('M_SPA_DID_PLUS_PAST', 'Uses did with a past form.', 'Did you ___ the film?', 'saw', 'see', 'Marks the past twice.', 'After did the verb stays plain: Did you see the film?'),
    R('M_SPA_PAST_FOR_HABIT', 'Uses the past form for a fact or a habit.', 'The sun ___ in the east.', 'rose', 'rises', 'Thinks a story always needs the past.', 'For a fact or something that always happens, use the present: The sun rises in the east.'),
  ],
  'WRITIN.T7.CAPITALS_FULL_STOPS': [
    R('M_PUN_NO_CAPITAL_START', 'Does not start a sentence with a capital letter.', 'Which is right? we went to the lake.', 'we went to the lake.', 'We went to the lake.', 'Writes the way a message is typed quickly.', 'Every sentence starts with a capital letter.'),
    R('M_PUN_NO_FULL_STOP', 'Leaves out the full stop at the end of a statement.', 'Which is right? Mum is at work', 'Mum is at work', 'Mum is at work.', 'Does not see where a sentence ends.', 'A telling sentence ends with a full stop.'),
    R('M_PUN_CAPITAL_MID', 'Writes a capital letter in the middle of a sentence for an ordinary word.', 'Which is right? My Mother went to the Market.', 'My Mother went to the Market.', 'My mother went to the market.', 'Thinks important words need capitals.', 'Only the first word of a sentence, names and I take a capital. Mother and market are ordinary words.'),
    R('M_PUN_NAME_LOWER', 'Writes the name of a person or place with a small letter.', 'Which is right? we live in nairobi.', 'We live in nairobi.', 'We live in Nairobi.', 'Does not see a name as special.', 'Names of people, places and days begin with a capital letter: Nairobi, Wanjiru, Monday.'),
    R('M_PUN_I_LOWER', 'Writes I as a small letter.', 'Which is right? Today i played football.', 'Today i played football.', 'Today I played football.', 'Types i in a phone message.', 'The word I always takes a capital letter.'),
  ],
  'WRITIN.T9.COMMAS': [
    R('M_COM_NO_COMMA_LIST', 'Leaves out the commas in a list.', 'Which is right? Mama bought rice beans and maize.', 'Mama bought rice beans and maize.', 'Mama bought rice, beans and maize.', 'Reads the list as one run of words.', 'In a list, put a comma between the items. Use and before the last one.'),
    R('M_COM_AFTER_LAST', 'Puts a comma after the last item.', 'Which is right? I like mangoes, oranges, and bananas,', 'I like mangoes, oranges, bananas,', 'I like mangoes, oranges and bananas.', 'Thinks every item needs a comma after it.', 'The last item has no comma after it. Put and before it and end with a full stop.'),
    R('M_COM_SPLIT_SENTENCE', 'Puts a comma between who and what they do.', 'Which is right? Wafula, kicked the ball.', 'Wafula, kicked the ball.', 'Wafula kicked the ball.', 'Uses a comma as a breathing mark.', 'Do not put a comma between a person and what the person did. A comma is not a pause mark.'),
    R('M_COM_FULL_STOP_LIST', 'Uses full stops between the items of a list.', 'Which is right? We saw lions. zebras. and giraffes.', 'We saw lions. zebras. and giraffes.', 'We saw lions, zebras and giraffes.', 'Does not know the comma has its own job in lists.', 'A full stop ends a whole sentence. Items in one list are separated by commas.'),
  ],
  'WRITIN.T9.QUESTION_MARKS': [
    R('M_QMK_FULL_STOP', 'Ends a question with a full stop.', 'Which is right? Where is the book.', 'Where is the book.', 'Where is the book?', 'Reads the question aloud with a rising voice but writes the usual end mark.', 'A question ends with a question mark.'),
    R('M_QMK_STATEMENT', 'Ends a statement with a question mark because it has a question word in it.', 'Which is right? I do not know where he lives?', 'I do not know where he lives?', 'I do not know where he lives.', 'Sees the word where and thinks a question mark is needed.', 'A sentence that tells something ends with a full stop, even if it has a word like where in it.'),
    R('M_QMK_COMMA', 'Ends a question with a comma.', 'Which is right? Are you hungry,', 'Are you hungry,', 'Are you hungry?', 'Does not know a comma cannot end a sentence.', 'A comma never ends a sentence. A question ends with a question mark.'),
    R('M_QMK_NO_MARK', 'Leaves the end mark out.', 'Which is right? What is your name', 'What is your name', 'What is your name?', 'Forgets the mark in quick writing.', 'Every sentence needs an end mark. A question needs a question mark.'),
  ],
  'WRITIN.T11.MISSPELT_WORDS': [
    R('M_SPL_VOWEL_ORDER', 'Swaps the vowels in ie and ei words.', 'Wanjiru is my best ___.', 'freind', 'friend', 'Does not remember which vowel comes first.', 'Check the word. Friend has ie, as in "a friend to the end". Learn it as a whole word.'),
    R('M_SPL_PHONETIC', 'Spells the word as it sounds.', 'We stayed home ___ it rained.', 'becos', 'because', 'Writes what the ear hears.', 'Many words are not spelt the way they sound. Learn the shape: because (be-cau-se).'),
    R('M_SPL_DROPPED_LETTER', 'Leaves out a letter that is not heard.', 'We have a ___ at school.', 'libary', 'library', 'Does not say the middle letter.', 'Say the word slowly in parts: li-brar-y. Do not leave out the r.'),
    R('M_SPL_EXTRA_LETTER', 'Leaves out or changes letters in a long vowel group.', 'The flowers are ___.', 'beutiful', 'beautiful', 'Mixes up the vowel group.', 'Beautiful starts with beau, as in "beautiful". Look at the word again and copy its shape.'),
  ],
  'WRITIN.T13.DOUBLE_CONSONANTS': [
    R('M_DBL_SINGLE', 'Writes one consonant where there are two.', 'Mama drinks ___ every morning.', 'cofee', 'coffee', 'Does not hear the two letters.', 'Some words have two of the same letter together: coffee, summer, letter.'),
    R('M_DBL_PHONETIC', 'Spells the word as it sounds.', 'The ___ ran into its hole.', 'rabbet', 'rabbit', 'Writes what the ear hears and picks a wrong vowel.', 'Say the word slowly and then check it. Rabbit has bb in the middle.'),
    R('M_DBL_EXTRA', 'Doubles a letter that is single.', 'I wrote a ___ to my aunt.', 'lettter', 'letter', 'Over-corrects after learning double letters.', 'Only some letters are doubled. Check each word: letter has tt but not three t.'),
  ],
  'WRITIN.T1.FORM_INFORMATION': [
    R('M_FRM_DETAIL_MIX', 'Writes the wrong detail in a box.', 'Date of birth: ', 'Nairobi', '14th March 2016', 'Does not read what the box asks for.', 'Read the name of the box first, then write only what it asks for.'),
    R('M_FRM_AGE_FOR_DOB', 'Writes the age in the date of birth box.', 'Date of birth: ', '9 years', '14th March 2016', 'Confuses age with date of birth.', 'Date of birth needs the day, month and year you were born. Age is a number.'),
    R('M_FRM_CONTACT_FOR_ADDRESS', 'Writes a phone number in the address box.', 'Home address: ', '0712 345 678', 'P.O. Box 12, Kisumu', 'Does not tell address from contact.', 'An address says where you live or get letters. A phone number goes in the contact box.'),
    R('M_FRM_NAME_PART', 'Writes only one name in the full names box.', 'Full names: ', 'Wanjiru', 'Wanjiru Kamau Njeri', 'Thinks the first name is enough.', 'Full names means all of your names, in the order the form asks for.'),
  ],
  'WRITIN.T4.LETTER_PARTS': [
    R('M_LTR_PART_MIX', 'Mixes up the parts of a letter.', 'Which part says "Dear Amina,"?', 'closing', 'greeting', 'Does not know the names of the parts.', 'The greeting comes first and starts with Dear. The closing comes at the end, for example Yours lovingly.'),
    R('M_LTR_ORDER', 'Puts the parts of the letter in the wrong order.', 'Which comes first in a friendly letter?', 'the closing', 'your address and the date', 'Does not know the usual order.', 'A friendly letter goes: your address, the date, the greeting, the body, the closing, your name.'),
    R('M_LTR_NO_COMMA', 'Leaves the comma out after the greeting or the closing.', 'Which is correct?', 'Dear Amina', 'Dear Amina,', 'Writes the greeting as a plain word group.', 'A comma follows the greeting (Dear Amina,) and the closing (Yours lovingly,).'),
    R('M_LTR_RECEIVER_ADDRESS', 'Writes the receiver\'s address at the top of a friendly letter.', 'Whose address goes at the top?', 'the person getting the letter', 'the writer', 'Copies the pattern of a formal letter.', 'In a friendly letter, write your own address at the top. Do not write the receiver\'s address there.'),
  ],
  'WRITIN.T5.NARRATIVE_PARTS': [
    R('M_NAR_PART_MIX', 'Puts the end of the story at the beginning.', 'Which part tells how the story ends?', 'the beginning', 'the end', 'Does not know what each part does.', 'The beginning introduces people and place, the middle tells what happens, and the end tells how it finishes.'),
    R('M_NAR_SETTING_CHARACTER', 'Mixes up setting and characters.', 'Which tells where and when a story happens?', 'the characters', 'the setting', 'Uses the two words as if they meant the same.', 'Characters are the people or animals in the story. The setting is where and when it happens.'),
    R('M_NAR_PROBLEM_END', 'Places the problem at the end instead of the middle.', 'Where does the problem of a story usually come?', 'at the end', 'in the middle', 'Thinks a story needs the problem last.', 'The problem usually starts in the middle. The end tells how it was solved.'),
    R('M_NAR_TITLE', 'Thinks the title tells the whole story.', 'What does a title do?', 'tells the whole story', 'gives a short name to the story', 'Does not know the purpose of a title.', 'A title is a short name that hints at the story. It does not tell all of it.'),
  ],
  'WRITIN.T5.PARAGRAPH_ORDER': [
    R('M_PAR_ORDER_REVERSED', 'Puts the sentences in the reverse order.', 'Put the four sentences in order.', 'D C B A', 'A B C D', 'Starts from the sentence that sounds like an ending.', 'Start with the sentence that introduces the topic and read forward.'),
    R('M_PAR_ORDER_SWAPPED', 'Swaps two neighbouring sentences.', 'Put the four sentences in order.', 'A C B D', 'A B C D', 'Does not check the sequence words (first, then, next).', 'Look at words like first, then, next and finally to see the order.'),
    R('M_PAR_TOPIC_DETAIL', 'Chooses a detail as the topic sentence.', 'Which is the topic sentence?', 'a detail', 'the sentence that tells what the paragraph is about', 'Picks the first sentence the eye meets.', 'The topic sentence names what the whole paragraph is about. The other sentences give details.'),
  ],
  'WRITIN.T10.DESCRIPTIVE_PARTS': [
    R('M_DES_TELLS_STORY', 'Writes what happened instead of what the thing is like.', 'Which sentence is part of a description of a market?', 'Yesterday I went to the market and bought a hat.', 'The market is noisy and smells of fresh fruit.', 'Confuses a description with a story.', 'A description tells what something looks, sounds, smells, feels or tastes like. A story tells what happened.'),
    R('M_DES_ONE_SENSE', 'Uses only what can be seen.', 'Which sentence uses a sense other than sight?', 'The market is big.', 'The market smells of fresh fruit.', 'Thinks describing means describing how it looks.', 'Use all the senses: sight, hearing, smell, touch and taste.'),
    R('M_DES_PART_MIX', 'Mixes up the introduction and the conclusion.', 'Which part names what you will describe?', 'the conclusion', 'the introduction', 'Does not know the parts.', 'The introduction says what you are going to describe. The conclusion ends with a feeling or a last thought.'),
  ],
  'WRITIN.T12.DIARY_PARTS': [
    R('M_DIA_NO_DATE', 'Leaves the date out.', 'What does every diary entry start with?', 'a title', 'the date', 'Thinks the diary is only for reading by the writer.', 'A diary entry begins with the date, so you know when it happened.'),
    R('M_DIA_LETTER_FORMAT', 'Writes the diary as a letter to a person.', 'Which is the best start of a diary entry?', 'Dear Mum, how are you?', 'Monday, 4th March. Dear Diary,', 'Mixes up the friendly letter and the diary.', 'A diary is written to yourself. Begin with the date and Dear Diary, not Dear Mum.'),
    R('M_DIA_THIRD_PERSON', 'Writes about himself or herself as he or she.', 'Which sentence is in the right voice?', 'Wanjiru woke up early.', 'I woke up early.', 'Writes as in a story told by someone else.', 'A diary is about you, so write in the first person: I woke up early.'),
    R('M_DIA_NO_FEELINGS', 'Writes only a list of events, with no feelings.', 'What else does a diary entry have besides what happened?', 'a list of names', 'how the writer felt', 'Thinks a diary is a record only.', 'A diary also tells how you felt: I was happy when we won.'),
  ],
  'WRITIN.T6.PICTURE_SEQUENCE': [
    R('M_PIC_ORDER_REVERSED', 'Gives the pictures in reverse.', 'Which order tells the story?', 'D, C, B, A', 'A, B, C, D', 'Starts from the last event seen.', 'Find the picture that starts the story and then follow what happens next.'),
    R('M_PIC_ORDER_SWAPPED', 'Swaps two neighbouring pictures.', 'Which order tells the story?', 'A, C, B, D', 'A, B, C, D', 'Does not check what must happen before what.', 'Ask what has to happen first for the next picture to make sense.'),
    R('M_PIC_TENSE', 'Tells the picture in the present tense when the story is in the past.', 'Which sentence tells the picture?', 'Wafula picks a mango.', 'Wafula picked a mango.', 'Writes what he sees now.', 'A story written after the event uses the past tense: Wafula picked a mango.'),
    R('M_PIC_MISMATCH', 'Picks a sentence that does not match the picture.', 'Which sentence tells the picture?', 'She sold the fruit.', 'She picked the fruit.', 'Describes a different picture.', 'Look at what the person is doing in the picture and pick the sentence that says exactly that.'),
  ],
  'READIN.T1.DICTIONARY_USE': [
    R('M_DIC_ALPHA_FIRST_LETTER', 'Orders words by the first letter only.', 'Order: bat, bag, ball', 'bat, bag, ball', 'bag, ball, bat', 'Stops comparing after the first letter.', 'When the first letters match, look at the second letter, then the third.'),
    R('M_DIC_GUIDE_WORDS', 'Does not use the guide words to find the page.', 'Guide words "cat" and "cow": is "cup" on this page?', 'Yes', 'No', 'Does not know guide words are the first and last words on the page.', 'Guide words show the first and last words on a page. A word is on the page only if it comes between them in alphabetical order.'),
    R('M_DIC_WRONG_MEANING', 'Picks a meaning that fits another sense of the word.', 'sprint', 'a long walk', 'a very fast run for a short distance', 'Chooses the first meaning that sounds familiar.', 'Read all the meanings, then try each in the sentence to see which one fits.'),
  ],
  'READIN.T1.REFERENCE_MATERIALS': [
    R('M_REF_DICTIONARY_FOR_FACTS', 'Uses a dictionary to find facts about a topic.', 'You want facts about elephants.', 'a dictionary', 'a junior encyclopaedia', 'Thinks every reference book does the same job.', 'A dictionary tells the meaning and spelling of words. A junior encyclopaedia gives facts about topics.'),
    R('M_REF_ATLAS_FOR_WORDS', 'Uses an atlas to find the meaning of a word.', 'You want to find a map of Kenya.', 'a dictionary', 'an atlas', 'Does not link the book to what it holds.', 'An atlas is a book of maps. Use it to find places and countries.'),
    R('M_REF_STORY_FOR_FACTS', 'Uses a story book to look up information.', 'You want to know a bus time.', 'a story book', 'a timetable', 'Thinks a book is good for any need.', 'A timetable lists times. A story book tells an invented story and is not for looking things up.'),
    R('M_REF_NEWSPAPER_OLD', 'Uses a newspaper for facts that do not change.', 'You want today\'s news.', 'a dictionary', 'a newspaper', 'Does not think about when the information is needed.', 'A newspaper gives news of today. A dictionary or encyclopaedia gives facts that stay the same.'),
  ],
  'READIN.T2.FACTUAL_QUESTIONS': [
    R('M_FACT_NEARBY_DETAIL', 'Picks a detail that sits near the answer in the text.', 'What was tied inside the bag?', 'sand', 'rags', 'Reads fast and picks a nearby word.', 'Find the sentence that answers the question and check that the words match what is asked.'),
    R('M_FACT_OUTSIDE_KNOWLEDGE', 'Answers from what he or she already knows.', 'How did they travel?', 'by bus', 'by boda boda', 'Does not go back to the text.', 'Answer from the text, not from what you think is likely. Go back to the sentence.'),
    R('M_FACT_MISSES_STATED', 'Says not stated when the text does say it.', 'True, false or not stated: Achieng set tomatoes in heaps.', 'Not stated', 'True', 'Does not find the sentence.', 'Look again. When the text says it clearly, the answer is true.'),
    R('M_FACT_FALSE_AS_TRUE', 'Says true when the text says something different.', 'The market was in Nakuru.', 'True', 'False', 'Reads for the topic, not the exact detail.', 'The text says something different from the statement, so the statement is false.'),
    R('M_FACT_FALSE_AS_NOT_STATED', 'Says not stated when the text says something different.', 'The market was in Nakuru.', 'Not stated', 'False', 'Does not tell going against the text from saying nothing.', 'If the text says the opposite, the answer is false. Not stated means the text says nothing about it.'),
    R('M_FACT_NOT_STATED_AS_TRUE', 'Says true or false when the text does not say.', 'Kamau scored a goal.', 'True', 'Not stated', 'Fills in what seems likely.', 'The text does not mention it, so the answer is not stated. Do not guess from what is likely.'),
    R('M_FACT_WRONG_WHO', 'Picks the wrong person or place for who or where.', 'Who helped Kamau?', 'his teacher', 'his grandmother', 'Picks the first name seen.', 'Find the sentence about the helper and check who it names.'),
  ],
  'READIN.T2.INFERENCE_QUESTIONS': [
    R('M_INFER_REPEATS_TEXT', 'Copies a sentence from the text as the answer.', 'Why did Mother nod proudly?', 'The woman wore a green dress.', 'Achieng counted carefully and gave the right change.', 'Does not see that the answer is not written.', 'An inference is worked out from clues. A sentence copied from the text is not working anything out.'),
    R('M_INFER_CONTRADICTS', 'Picks an answer that goes against the text.', 'Why was Kamau sad?', 'The school was closed.', 'He loved football and the ball burst.', 'Does not check the answer against the text.', 'A good inference agrees with every clue in the text.'),
    R('M_INFER_OVERREACH', 'Picks an answer that goes too far.', 'What can you tell about the grandmother?', 'She is the richest woman in town.', 'She is kind and clever.', 'Adds facts that the text does not support.', 'An inference is a small step from the clues. If the text gives no clue for it, it goes too far.'),
  ],
  'READIN.T2.CONTEXT_CLUES': [
    R('M_CTX_LOOKS_LIKE', 'Picks a meaning that looks like the word.', 'burst', 'rolled away', 'broke open', 'Guesses from the look of the word.', 'Read the sentences around the word to find its meaning.'),
    R('M_CTX_COMMON_MEANING', 'Picks a common meaning that does not fit.', 'heaps', 'big baskets', 'small piles', 'Uses a known meaning without testing it.', 'Try the meaning in the sentence. If it does not fit, it is not the right one.'),
    R('M_CTX_OPPOSITE', 'Picks the opposite meaning.', 'ancient', 'very new', 'very old', 'Does not read the clue.', 'Read for clue words. They tell you if the word means the same as or the opposite of something.'),
    R('M_CTX_WRONG_CLUE', 'Picks a group of words that does not explain the word.', 'Which words help you?', 'in Nyeri', 'the school had no money for a new one', 'Picks any phrase near the word.', 'A clue is a group of words that tells more about the hard word, not just words near it.'),
  ],
  'READIN.T4.VISUALS': [
    R('M_VIS_WRONG_ROW', 'Reads the wrong row or column of a table.', 'What time does the bus to Kisumu leave?', '10:30 am', '8:00 am', 'Looks at the nearest number instead of the row for Kisumu.', 'Find the row for what you need, then read across to the right column.'),
    R('M_VIS_NEARBY_DETAIL', 'Picks a nearby detail on the notice.', 'Which day is the clinic closed?', 'Saturday', 'Sunday', 'Picks the line next to the answer.', 'Go back to the line that answers the question and check the words.'),
    R('M_VIS_PURPOSE', 'Says the wrong purpose for a visual.', 'What is the notice for?', 'to sell shoes', 'to tell people the time of the meeting', 'Reads one word and guesses.', 'Look at the title and the first line. They say what the notice is for.'),
  ],
  'READIN.T5.SCAN_FOR_DETAIL': [
    R('M_SCAN_NEAR_NUMBER', 'Picks another number from the text.', 'How much is a ticket?', '60 shillings', '50 shillings', 'Does not look for the key word.', 'Scan for the key word in the question (ticket) and read only that line.'),
    R('M_SCAN_WRONG_KEYWORD', 'Looks for the wrong key word.', 'When does the show start?', 'at 6 pm', 'at 4 pm', 'Uses a word that is not the key word.', 'Choose the key word that matches the question, then read the line.'),
    R('M_SCAN_TOO_LONG', 'Reads the whole text to find one detail.', 'What is the name of the guide?', 'a long answer from the whole text', 'Mr Otieno', 'Does not scan.', 'Look for a capital letter or a number. Skip the rest.'),
  ],
  'READIN.T12.PROVERBS': [
    R('M_PRV_LITERAL', 'Reads a proverb as only about its animals or things.', 'Haste makes waste means:', 'people who hurry waste water', 'doing a thing too fast can spoil it', 'Takes the words at face value.', 'A proverb is a short saying with a lesson. Ask what it teaches people.'),
    R('M_PRV_OPPOSITE', 'Gives the opposite lesson.', 'Slow and steady wins the race means:', 'be fast to win', 'keep going carefully and you will succeed', 'Does not read the whole proverb.', 'Check the lesson against the proverb. The lesson of this one is patience.'),
    R('M_PRV_UNRELATED', 'Picks a lesson that has nothing to do with the proverb.', 'A stitch in time saves nine means:', 'sewing is hard', 'fix a small problem early to avoid a big one', 'Guesses from one word.', 'The lesson must fit the idea of the whole proverb.'),
    R('M_PRV_WRONG_WORD', 'Finishes a proverb with a word that sounds right but is not.', 'Easy come, easy ___.', 'stay', 'go', 'Remembers the idea and not the exact words.', 'A proverb always has the same words. Say the whole saying aloud.'),
  ],
  'LISTEN.T3.POLITE_WORDS': [
    R('M_POL_DEMAND', 'Makes a request as a demand.', 'You want to borrow a pen. What do you say?', 'Give me your pen.', 'May I please borrow your pen?', 'Says the shortest thing that gets the pen.', 'A polite request starts with May I or Could you, and says please.'),
    R('M_POL_NO_THANKS', 'Does not say thank you.', 'Your friend helps you. What do you say?', 'Okay.', 'Thank you for helping me.', 'Does not see thanks as needed.', 'When someone helps you, say thank you.'),
    R('M_POL_RUDE_REFUSAL', 'Refuses in a rude way.', 'You cannot lend your book. What do you say?', 'No. Go away.', 'I am sorry, I cannot lend it today.', 'Does not know how to say no politely.', 'You can say no in a polite way: begin with I am sorry.'),
    R('M_POL_NO_SORRY', 'Does not say sorry after a mistake.', 'You step on someone\'s foot. What do you say?', 'Move.', 'Sorry, I did not see you.', 'Does not see that sorry is needed.', 'When you hurt or bother someone, say sorry.'),
  ],
  'LISTEN.T4.FIRST_AID_WORDS': [
    R('M_FA_NEAR_MEANING', 'Picks a first aid word that is near in meaning but wrong.', 'A ___ is a cloth wrapped round a cut.', 'bruise', 'bandage', 'Mixes up words in the same topic.', 'Read the whole sentence and say what the gap must mean before choosing.'),
    R('M_FA_WOUND_BRUISE', 'Mixes up wound and bruise.', 'A ___ is a dark mark on the skin where you were hit.', 'wound', 'bruise', 'Treats the two words as the same.', 'A wound is a cut or a break in the skin. A bruise is a dark mark under the skin.'),
    R('M_FA_SPRAIN_BREAK', 'Mixes up sprain and break.', 'When you twist your ankle, it may be a ___.', 'ambulance', 'sprain', 'Does not know the words.', 'A sprain is a twisted joint. An ambulance is a vehicle that takes people to hospital.'),
  ],
  'LISTEN.T5.NUTRITION_WORDS': [
    R('M_NUT_NEAR_MEANING', 'Picks a food word that is near in meaning but wrong.', 'Beans and meat give us ___.', 'carbohydrates', 'protein', 'Mixes up the food groups.', 'Protein builds the body (beans, meat, eggs). Carbohydrates give energy (ugali, rice, bread).'),
    R('M_NUT_VITAMIN_FIBRE', 'Mixes up vitamins and fibre.', '___ help us stay healthy and are found in fruits.', 'Fibre', 'Vitamins', 'Treats all nutrients as one.', 'Vitamins keep the body healthy. Fibre helps food move through the body.'),
    R('M_NUT_BALANCED', 'Thinks a balanced diet is one food in a large amount.', 'A balanced diet has ___.', 'only ugali', 'all the food groups in the right amounts', 'Does not know the meaning of balanced.', 'A balanced diet has food from all the food groups in the right amounts.'),
  ],
  'LISTEN.T6.INTERNET_WORDS': [
    R('M_NET_NEAR_MEANING', 'Picks an internet word that is near in meaning but wrong.', 'The messages you receive are kept in your ___.', 'attachment', 'inbox', 'Mixes up the parts of an email.', 'The inbox is where received emails are kept. An attachment is a file sent with an email.'),
    R('M_NET_PASSWORD_SHARED', 'Thinks a password can be shared with friends.', 'A password should be shared with ___.', 'friends', 'no one except a trusted adult', 'Does not know why a password is secret.', 'A password is secret. Share it with no one, except a trusted adult such as a parent.'),
    R('M_NET_STRANGER', 'Replies to or trusts a stranger online.', 'A stranger online asks where you live. You should ___.', 'tell him', 'not answer and tell an adult', 'Believes a friendly message is safe.', 'Never give personal information to a stranger online. Tell a trusted adult.'),
  ],
  'LISTEN.T8.FARM_WORDS': [
    R('M_FRM_NEAR_MEANING', 'Picks a farm word that is near in meaning but wrong.', 'We ___ the maize when it is ripe.', 'plant', 'harvest', 'Mixes up the steps of farming.', 'Planting comes first. Harvesting is gathering the crop when it is ripe.'),
    R('M_FRM_LIVESTOCK_CROPS', 'Mixes up livestock and crops.', 'Cows, goats and sheep are ___.', 'crops', 'livestock', 'Treats all farm things as one group.', 'Livestock are farm animals. Crops are plants grown for food.'),
    R('M_FRM_FERTILISER', 'Thinks fertiliser is a pest killer.', '___ makes the soil richer so that crops grow well.', 'Pesticide', 'Fertiliser', 'Does not know the two products.', 'Fertiliser feeds the soil. Pesticide kills pests.'),
  ],
  'LISTEN.T10.HYGIENE_WORDS': [
    R('M_HYG_NEAR_MEANING', 'Picks a hygiene word that is near in meaning but wrong.', 'Washing your hands kills ___ that cause diseases.', 'rubbish', 'germs', 'Mixes up words in the same topic.', 'Germs are tiny living things that can cause disease. Rubbish is waste.'),
    R('M_HYG_DISINFECT', 'Thinks disinfect means to make something smell nice.', 'We ___ the toilet with a strong cleaner to kill germs.', 'perfume', 'disinfect', 'Does not know the meaning.', 'To disinfect is to kill germs on a surface.'),
    R('M_HYG_LATRINE', 'Mixes up latrine and drainage.', 'A ___ is a place to dispose of human waste.', 'drainage', 'latrine', 'Does not know the words.', 'A latrine is for human waste. Drainage carries away dirty water.'),
  ],
  'LISTEN.T13.MONEY_WORDS': [
    R('M_MON_EARN_SAVE', 'Swaps earn and save.', 'Mama ___ money every month to buy a cow later.', 'earns', 'saves', 'Does not tell getting money from keeping it.', 'To earn is to get money for work. To save is to keep money for later.'),
    R('M_MON_BORROW_LEND', 'Swaps borrow and lend.', 'Can I ___ your pen? I will return it.', 'lend', 'borrow', 'Does not tell who takes and who gives.', 'You borrow when you take for a short time. You lend when you give for a short time.'),
    R('M_MON_NEAR_MEANING', 'Picks a money word that is near in meaning but wrong.', 'A ___ helps a family plan how to spend its money.', 'price', 'budget', 'Mixes up words in the same topic.', 'Read the whole sentence and say what the gap must mean before you choose.'),
    R('M_MON_PRICE_CHANGE', 'Mixes up price and change.', 'The ___ of the book is 80 shillings.', 'change', 'price', 'Treats the money words as the same.', 'The price is what something costs. Change is the money given back.'),
  ],
  'LISTEN.T11.SPORTS_WORDS': [
    R('M_SPT_NEAR_MEANING', 'Picks a sports word that is near in meaning but wrong.', 'The ___ blows the whistle to start the match.', 'goalkeeper', 'referee', 'Mixes up the people in a game.', 'The referee controls the game. The goalkeeper guards the goal.'),
    R('M_SPT_TROPHY_TOURNAMENT', 'Mixes up trophy and tournament.', 'Our team won the ___ at the end of the tournament.', 'tournament', 'trophy', 'Does not know the two words.', 'A tournament is a series of games. A trophy is the prize.'),
    R('M_SPT_OPPONENT_TEAMMATE', 'Mixes up opponent and teammate.', 'The player on the other team is my ___.', 'teammate', 'opponent', 'Does not know the words.', 'An opponent plays against you. A teammate plays with you.'),
  ],
  'LISTEN.T12.ENVIRONMENT_WORDS': [
    R('M_ENV_NEAR_MEANING', 'Picks an environment word that is near in meaning but wrong.', 'To ___ plastic is to make it into something new.', 'litter', 'recycle', 'Mixes up words in the same topic.', 'To recycle is to make waste into something new. Litter is rubbish dropped in a public place.'),
    R('M_ENV_POLLUTION', 'Thinks pollution is a kind of plant.', '___ is the dirt that harms air, water or soil.', 'Compost', 'Pollution', 'Does not know the word.', 'Pollution is dirt or poison that harms the air, water or soil.'),
    R('M_ENV_CONSERVE', 'Thinks conserve means to use up.', 'We should ___ water, not waste it.', 'pollute', 'conserve', 'Does not know the word.', 'To conserve is to look after and use carefully.'),
  ],
  'LISTEN.T13.SILENT_LETTERS': [
    R('M_SIL_NEIGHBOUR', 'Picks the letter beside the silent one.', 'Which letter is silent in "knife"?', 'n', 'k', 'Does not say the word slowly.', 'Say the word aloud. In knife you hear n, but not k.'),
    R('M_SIL_NONE', 'Thinks every letter is sounded.', 'Which letter is silent in "write"?', 'none', 'w', 'Does not know silent letters.', 'Some letters are written but not said. In write, the w is silent.'),
    R('M_SIL_END_E', 'Thinks the silent letter is always the last letter.', 'Which letter is silent in "lamb"?', 'm', 'b', 'Has learnt silent e at the end.', 'A silent letter can be anywhere. In lamb the b is silent.'),
  ],
};

// A row becomes a full library entry.
export const MIS = Object.entries(LIB).flatMap(([skill, rows]) => rows.map(r => ({
  skill, code: r.code, error: r.error,
  example: { question: r.q, wrong_answer: r.wrong, correct_answer: r.right },
  cause: r.cause,
  reveals: `A question like "${r.q}" with "${r.wrong}" among the options.`,
  help: r.help || `Have the child say both forms aloud and say why one fits: "${r.right}", not "${r.wrong}".`,
  feedback: r.feedback, source: r.source,
})));
