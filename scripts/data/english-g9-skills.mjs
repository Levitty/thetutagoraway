// ============================================================================
// ENGLISH GRADE 9: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/english/g9.json by scripts/build-english-g9.mjs. KICD's outcomes and rubrics are never touched.
// Built: the grammar sub-strands and the mechanics, paragraph, letter, narrative and poetry knowledge a tapped question can test.
// Not built here: listening, speaking, reading comprehension on passages and plays, and composition (they need passages, recordings or marking).
// Everything is draft until a Kenyan English teacher reviews it.
// A skill: [sub-strand key after 'ENGL.G9.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const G1 = 'GRAMMA.T1_GENDER_NEUTRAL_LANGU', G2 = 'GRAMMA.T2_NOUNS_AND_QUANTIFIER', W2 = 'WRITIN.T2_MECHANICS_OF_WRITING', G3 = 'GRAMMA.T3_MODAL_AUXILIARIES';
const R3 = 'READIN.T3_POEMS_STRUCTURE', W3 = 'WRITIN.T3_STRUCTURE_OF_A_PARAG', G4 = 'GRAMMA.T4_PRESENT_AND_PAST_PER', G5 = 'GRAMMA.T5_ORDER_OF_ADJECTIVES', W5 = 'WRITIN.T5_LETTER_OF_APPLICATIO';
const G6 = 'GRAMMA.T6_COMPARISON_OF_ADVERB', W6 = 'WRITIN.T6_MECHANICS_OF_WRITING', G7 = 'GRAMMA.T7_RELATIVE_PRONOUNS_IN', G8 = 'GRAMMA.T8_COMPLEX_PREPOSITIONS', G9 = 'GRAMMA.T9_CONJUNCTIONS_CORRELA';
const W9 = 'WRITIN.T9_NARRATIVE_COMPOSITIO', G10 = 'GRAMMA.T10_DETERMINERS_NUMERALS', G11 = 'GRAMMA.T11_WORD_CLASSES_NOUNS', W11 = 'WRITIN.T11_MECHANICS_OF_WRITING';
const G12 = 'GRAMMA.T12_PHRASAL_VERBS', G13 = 'GRAMMA.T13_SENTENCES_COMPLEX_SE', G14 = 'GRAMMA.T14_SENTENCES_DIRECT_AND', G15 = 'GRAMMA.T15_SENTENCES_1_IMPERATI';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [G1, 'GENDER_NEUTRAL', 'Replace gender-biased words with gender-neutral ones', ['a', 'b'], [], FM, 'The child spots gender-biased words (chairman, policeman, fireman, waitress, mankind) and picks neutral ones (chairperson, police officer, firefighter, server, humankind), and says a job word should not assume the sex of the worker.'],
  [G2, 'QUANTIFIERS', 'Use quantifiers with count and non-count nouns', ['a', 'b'], [], FM, 'The child uses many, few and a number of with count nouns, much and little with non-count nouns, and some, a lot of and plenty of with both; he sorts nouns (books, chairs: count; water, advice: non-count).'],
  [W2, 'QUOTES_BRACKETS', 'Use double quotation marks and brackets', ['a', 'b'], [], FM, 'The child puts the exact words spoken inside double quotation marks, and puts extra information or an explanation inside brackets, and does not use brackets for speech.'],
  [G3, 'MODALS', 'Use modal auxiliaries to show ability, permission, possibility and duty', ['a', 'b'], [], FM, 'The child says can and could show ability, may and might permission or possibility, must and should duty or advice, and that a modal is followed by the base verb.'],
  [R3, 'POEM_FEATURES', 'Describe the structure of a poem and personification', ['a', 'b'], [], FM, 'The child says a poem is made of lines grouped in stanzas, that rhyme is repeated end sounds, and that personification gives human actions or feelings to a thing, as in "the wind whispered".'],
  [W3, 'PARAGRAPH', 'Name the characteristics of a well-formed paragraph', ['a'], [], FM, 'The child says a good paragraph has a topic sentence, supporting sentences, unity (one idea), coherence (ideas in order, joined by linking words) and a closing sentence.'],
  [G4, 'PERFECT', 'Tell the present perfect from the past perfect', ['a', 'b'], [], FM, 'The child says the present perfect is have or has plus the past participle (She has finished) and the past perfect is had plus the past participle (She had finished before I came).'],
  [G5, 'ADJ_ORDER', 'Put adjectives in the correct order', ['a', 'b'], [], FM, 'The child says adjectives go in the order opinion, size, age, colour, origin, material, so we say "a lovely small old brown wooden box".'],
  [W5, 'LETTER_APPLICATION', 'Name the parts of a letter of application', ['a'], [], FM, 'The child names the writer\'s address, date, receiver\'s address, salutation (Dear Sir or Madam), subject line, body, subscription (Yours faithfully) and signature, and says Yours faithfully goes with Dear Sir or Madam.'],
  [G6, 'ADVERB_DEGREES', 'Use the degrees of comparison of adverbs', ['a', 'b'], [], FM, 'The child says the positive (fast), comparative (faster, more carefully) and superlative (fastest, most carefully) and that long adverbs take more and most.'],
  [W6, 'SPELLING', 'Tell homophones and homonyms and spell commonly misspelt words', ['a', 'b'], [], FM, 'The child says homophones sound alike but differ in spelling and meaning (their and there), homonyms share spelling and sound (bank), and spells words such as separate, necessary, beginning and committee.'],
  [G7, 'RELATIVE_PRONOUNS', 'Use relative and interrogative pronouns', ['a', 'b'], [], FM, 'The child says who and whom refer to people, which to things and animals, whose to belonging, that to people or things, and that who, what, which and whose also start questions.'],
  [G8, 'COMPLEX_PREPS', 'Use complex prepositions', ['a', 'b'], [], FM, 'The child names complex prepositions of two or three words (because of, in front of, instead of, in spite of, according to, on behalf of) and uses them correctly.'],
  [G9, 'CORRELATIVE', 'Use correlative conjunctions in pairs', ['a', 'b'], [], FM, 'The child pairs either with or, neither with nor, both with and, not only with but also, and whether with or.'],
  [W9, 'NARRATIVE_ELEMENTS', 'Name the elements of a narrative composition', ['a'], [], FM, 'The child names characters, setting, plot (beginning, complication, climax, resolution) and theme, and says background information makes a story believable.'],
  [G10, 'DETERMINERS_NUM', 'Use numerals and ordinals as determiners', ['a', 'b'], [], FM, 'The child says cardinal numbers (two, ten) count and ordinal numbers (second, tenth) give position, and both come before the noun.'],
  [G11, 'NOUNS_FORMED', 'Form nouns from verbs and from other nouns', ['a', 'b'], [], FM, 'The child forms nouns from verbs (decide to decision, teach to teacher, move to movement) and from other nouns (child to childhood, friend to friendship).'],
  [W11, 'ABBREVIATIONS', 'Write common abbreviations and acronyms in full', ['b'], [], FM, 'The child gives the full form of common abbreviations and acronyms such as e.g. (for example), i.e. (that is), etc. (and so on), UN (United Nations), WHO (World Health Organisation) and ICT (information and communication technology).'],
  [G12, 'PHRASAL_VERBS', 'Know phrasal verbs of break, hang, run and turn', ['a', 'b'], [], FM, 'The child knows break down (stop working), break out (start suddenly), hang on (wait), hang up (end a call), run out of (have no more), run into (meet by chance), turn up (arrive), turn down (refuse).'],
  [G13, 'SUBORDINATING', 'Use subordinating conjunctions in complex sentences', ['a', 'b', 'c'], [], FM, 'The child picks because (reason), although (contrast), if and unless (condition), when and while (time) and since, and says a complex sentence has a main clause and a subordinate clause.'],
  [G14, 'DIRECT_INDIRECT', 'Change direct speech into indirect speech', ['a', 'b', 'c'], ['QUOTES_BRACKETS'], FM, 'The child says direct speech gives the exact words in quotation marks and indirect speech reports them without quotation marks, with tense and pronouns changed (am becomes was, now becomes then).'],
  [G15, 'EXCLAM_IMPERATIVE', 'Punctuate imperative and exclamatory sentences', ['a', 'b'], [], FM, 'The child says an imperative gives a command or request and ends with a full stop or exclamation mark, and an exclamatory sentence shows strong feeling and ends with an exclamation mark.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_EN9_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('GENDER_NEUTRAL', 'GN_CHAIRMAN', 'Keeps chairman for any chair.', 'Which is gender-neutral?', 'chairman', 'chairperson', 'Chairperson does not assume the sex of the chair.'),
  m('GENDER_NEUTRAL', 'GN_POLICE', 'Keeps policeman for any officer.', 'Which is gender-neutral?', 'policeman', 'police officer', 'Police officer fits a man or a woman.'),
  m('GENDER_NEUTRAL', 'GN_MANKIND', 'Keeps mankind.', 'Which is gender-neutral?', 'mankind', 'humankind', 'Humankind includes everyone.'),
  m('QUANTIFIERS', 'QT_MUCH', 'Uses much with count nouns.', 'Which is correct: ___ chairs?', 'much', 'many', 'Use many with count nouns such as chairs.'),
  m('QUANTIFIERS', 'QT_MANY', 'Uses many with non-count nouns.', 'Which is correct: ___ water?', 'many', 'much', 'Use much with non-count nouns such as water.'),
  m('QUANTIFIERS', 'QT_FEW', 'Mixes few and little.', 'Which is correct: a ___ of milk?', 'few', 'little', 'Use little with non-count nouns such as milk.'),
  m('QUOTES_BRACKETS', 'QB_BRACKET', 'Uses brackets for speech.', 'What goes in double quotation marks?', 'Extra explanations', 'The exact words spoken', 'Quotation marks hold the exact words spoken.'),
  m('QUOTES_BRACKETS', 'QB_EXTRA', 'Uses quotation marks for extra information.', 'What goes in brackets?', 'The exact words spoken', 'Extra information', 'Brackets hold extra information.'),
  m('QUOTES_BRACKETS', 'QB_END', 'Puts the full stop outside the speech.', 'Which is punctuated correctly?', 'She said, "I am ready".', 'She said, "I am ready."', 'The full stop goes inside the closing quotation marks.'),
  m('MODALS', 'MD_ABILITY', 'Uses must for ability.', 'Which shows ability?', 'must', 'can', 'Can shows ability.'),
  m('MODALS', 'MD_DUTY', 'Uses can for duty.', 'Which shows duty?', 'can', 'must', 'Must shows duty.'),
  m('MODALS', 'MD_BASE', 'Uses a modal with to plus verb.', 'Which is correct?', 'She can to swim.', 'She can swim.', 'A modal is followed by the base verb with no to.'),
  m('POEM_FEATURES', 'PF_STANZA', 'Calls a stanza a line.', 'What is a stanza?', 'One line of a poem', 'A group of lines', 'A stanza is a group of lines.'),
  m('POEM_FEATURES', 'PF_RHYME', 'Says rhyme is the same first sound.', 'What is rhyme?', 'Same beginning sound', 'Repeated end sounds', 'Rhyme is repeated end sounds.'),
  m('POEM_FEATURES', 'PF_PERSON', 'Confuses personification with simile.', 'Which is personification?', 'as brave as a lion', 'the wind whispered', 'Personification gives human actions to a thing.'),
  m('PARAGRAPH', 'PA_TOPIC', 'Puts the topic sentence anywhere.', 'Which sentence states the main idea?', 'The supporting sentence', 'The topic sentence', 'The topic sentence states the main idea.'),
  m('PARAGRAPH', 'PA_UNITY', 'Mixes many ideas.', 'What is unity in a paragraph?', 'Many different ideas', 'One main idea', 'Unity means one main idea.'),
  m('PARAGRAPH', 'PA_COHERENCE', 'Thinks coherence is length.', 'What is coherence?', 'A very long paragraph', 'Ideas in order joined by linking words', 'Coherence means ideas flow in order.'),
  m('PERFECT', 'PE_PRESENT', 'Uses had for the present perfect.', 'Which is present perfect?', 'She had finished.', 'She has finished.', 'Present perfect uses have or has.'),
  m('PERFECT', 'PE_PAST', 'Uses has for the past perfect.', 'Which is past perfect?', 'She has finished before I came.', 'She had finished before I came.', 'Past perfect uses had.'),
  m('PERFECT', 'PE_PARTICIPLE', 'Uses the simple past after has.', 'Which is correct?', 'She has went home.', 'She has gone home.', 'Use the past participle after has.'),
  m('ADJ_ORDER', 'AO_COLOUR', 'Puts colour before size.', 'Which order is correct?', 'a red big ball', 'a big red ball', 'Size comes before colour.'),
  m('ADJ_ORDER', 'AO_OPINION', 'Puts opinion last.', 'Which order is correct?', 'a wooden lovely box', 'a lovely wooden box', 'Opinion comes before material.'),
  m('ADJ_ORDER', 'AO_AGE', 'Puts age after colour.', 'Which order is correct?', 'a brown old dog', 'an old brown dog', 'Age comes before colour.'),
  m('LETTER_APPLICATION', 'LA_CLOSE', 'Uses Yours sincerely with Sir or Madam.', 'Which closing goes with Dear Sir or Madam?', 'Yours sincerely', 'Yours faithfully', 'Yours faithfully goes with Dear Sir or Madam.'),
  m('LETTER_APPLICATION', 'LA_SUBJECT', 'Leaves out the subject line.', 'Which part states what the letter is about?', 'The signature', 'The subject line', 'The subject line states what the letter is about.'),
  m('LETTER_APPLICATION', 'LA_ADDRESS', 'Puts the sender\'s address at the bottom.', 'Where does the writer\'s address go?', 'At the bottom', 'At the top', 'The writer\'s address goes at the top.'),
  m('ADVERB_DEGREES', 'AD_MORE', 'Uses -er with long adverbs.', 'Which is correct?', 'carefullier', 'more carefully', 'Long adverbs take more and most.'),
  m('ADVERB_DEGREES', 'AD_SUPER', 'Uses the comparative for the superlative.', 'Who ran ___ of all?', 'faster', 'fastest', 'Use the superlative when comparing three or more.'),
  m('ADVERB_DEGREES', 'AD_THAN', 'Uses the positive with than.', 'Which is correct?', 'She sings well than I do.', 'She sings better than I do.', 'Use the comparative with than.'),
  m('SPELLING', 'SG_HOMOPHONE', 'Mixes their and there.', 'Which is correct: ___ books are on the table.', 'There', 'Their', 'Their shows belonging.'),
  m('SPELLING', 'SG_SEPARATE', 'Misspells separate.', 'Which is spelt correctly?', 'seperate', 'separate', 'Separate has "par" in the middle.'),
  m('SPELLING', 'SG_COMMITTEE', 'Misspells committee.', 'Which is spelt correctly?', 'comitee', 'committee', 'Committee has double m, double t and double e.'),
  m('RELATIVE_PRONOUNS', 'RP_WHICH', 'Uses who for things.', 'The book ___ I read was long.', 'who', 'which', 'Use which for things.'),
  m('RELATIVE_PRONOUNS', 'RP_WHOSE', 'Uses who for belonging.', 'The girl ___ bag was lost cried.', 'who', 'whose', 'Whose shows belonging.'),
  m('RELATIVE_PRONOUNS', 'RP_WHO', 'Uses which for people.', 'The man ___ helped us is kind.', 'which', 'who', 'Use who for people.'),
  m('COMPLEX_PREPS', 'CP_BECAUSE', 'Uses because without of before a noun.', 'We stayed in ___ the rain.', 'because', 'because of', 'Because of is followed by a noun.'),
  m('COMPLEX_PREPS', 'CP_INSTEAD', 'Uses instead without of.', 'She took tea ___ coffee.', 'instead', 'instead of', 'Instead of is followed by a noun.'),
  m('COMPLEX_PREPS', 'CP_ACCORDING', 'Uses according with from.', 'It happened ___ the report.', 'according from', 'according to', 'Use according to.'),
  m('CORRELATIVE', 'CO_EITHER', 'Pairs either with nor.', 'Either you ___ I will go.', 'nor', 'or', 'Either goes with or.'),
  m('CORRELATIVE', 'CO_NEITHER', 'Pairs neither with or.', 'Neither tea ___ coffee is ready.', 'or', 'nor', 'Neither goes with nor.'),
  m('CORRELATIVE', 'CO_NOTONLY', 'Pairs not only with and.', 'Not only tall ___ also strong.', 'and', 'but', 'Not only goes with but also.'),
  m('NARRATIVE_ELEMENTS', 'NE_SETTING', 'Says setting is the people.', 'What is the setting?', 'The people in the story', 'The time and place', 'Setting is time and place.'),
  m('NARRATIVE_ELEMENTS', 'NE_PLOT', 'Says plot is the title.', 'What is the plot?', 'The title of the story', 'The order of events', 'The plot is the order of events.'),
  m('NARRATIVE_ELEMENTS', 'NE_CLIMAX', 'Says climax is the ending.', 'What is the climax?', 'The last line', 'The most exciting point', 'The climax is the most exciting point.'),
  m('DETERMINERS_NUM', 'DN_ORDINAL', 'Uses a cardinal for position.', 'Which shows position?', 'five', 'fifth', 'Ordinals show position.'),
  m('DETERMINERS_NUM', 'DN_CARDINAL', 'Uses an ordinal for counting.', 'Which shows how many?', 'fifth', 'five', 'Cardinals show how many.'),
  m('DETERMINERS_NUM', 'DN_ORDER', 'Puts the determiner after the noun.', 'Which is correct?', 'books three', 'three books', 'A determiner comes before the noun.'),
  m('NOUNS_FORMED', 'NF_DECIDE', 'Gives the wrong noun for decide.', 'The noun from decide is...', 'decider', 'decision', 'The noun from decide is decision.'),
  m('NOUNS_FORMED', 'NF_FRIEND', 'Gives the wrong noun for friend.', 'The noun formed from friend is...', 'friendly', 'friendship', 'Friendship is the noun formed from friend.'),
  m('NOUNS_FORMED', 'NF_CHILD', 'Gives the wrong noun for child.', 'The noun formed from child is...', 'childish', 'childhood', 'Childhood is the noun formed from child.'),
  m('ABBREVIATIONS', 'AB_EG', 'Mixes e.g. and i.e.', 'What does e.g. mean?', 'that is', 'for example', 'e.g. means for example.'),
  m('ABBREVIATIONS', 'AB_ETC', 'Gives the wrong meaning of etc.', 'What does etc. mean?', 'for example', 'and so on', 'etc. means and so on.'),
  m('ABBREVIATIONS', 'AB_UN', 'Gives the wrong full form of UN.', 'What does UN stand for?', 'Universal Nations', 'United Nations', 'UN stands for United Nations.'),
  m('PHRASAL_VERBS', 'PV_BREAKDOWN', 'Takes break down literally.', 'The car broke down. It...', 'was smashed', 'stopped working', 'Break down means stop working.'),
  m('PHRASAL_VERBS', 'PV_RUNOUT', 'Takes run out of literally.', 'We ran out of sugar. We...', 'ran away from sugar', 'had no more sugar', 'Run out of means have no more.'),
  m('PHRASAL_VERBS', 'PV_TURNUP', 'Takes turn up literally.', 'He turned up late. He...', 'turned around', 'arrived', 'Turn up means arrive.'),
  m('SUBORDINATING', 'SC_ALTHOUGH', 'Uses because for contrast.', 'We played ___ it rained.', 'because', 'although', 'Although shows contrast.'),
  m('SUBORDINATING', 'SC_BECAUSE', 'Uses although for reason.', 'He was late ___ he missed the bus.', 'although', 'because', 'Because shows a reason.'),
  m('SUBORDINATING', 'SC_UNLESS', 'Uses if for unless.', '___ you study, you will fail.', 'If', 'Unless', 'Unless means if not.'),
  m('DIRECT_INDIRECT', 'DI_QUOTE', 'Keeps quotation marks in indirect speech.', 'Which is indirect speech?', 'She said, "I am ill."', 'She said that she was ill.', 'Indirect speech has no quotation marks.'),
  m('DIRECT_INDIRECT', 'DI_TENSE', 'Does not change the tense.', 'She said, "I am ill." In indirect speech:', 'She said that she is ill.', 'She said that she was ill.', 'Am becomes was.'),
  m('DIRECT_INDIRECT', 'DI_PRONOUN', 'Does not change the pronoun.', 'He said, "I like tea." In indirect speech:', 'He said that I liked tea.', 'He said that he liked tea.', 'I becomes he.'),
  m('EXCLAM_IMPERATIVE', 'EI_MARK', 'Ends an exclamation with a question mark.', 'Which is punctuated correctly?', 'What a lovely day?', 'What a lovely day!', 'An exclamation ends with an exclamation mark.'),
  m('EXCLAM_IMPERATIVE', 'EI_COMMAND', 'Calls a command a question.', 'Which is an imperative?', 'Are you coming?', 'Close the door.', 'An imperative gives a command.'),
  m('EXCLAM_IMPERATIVE', 'EI_STOP', 'Ends a command with a question mark.', 'Which is punctuated correctly?', 'Sit down?', 'Sit down.', 'A command ends with a full stop or exclamation mark.'),
];
