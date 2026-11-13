// ============================================================================
// ENGLISH GRADE 9, B (11 skills): relative and interrogative pronouns, complex prepositions, correlative conjunctions, narrative elements,
// numerals and ordinals as determiners, nouns formed from other words, abbreviations and acronyms, phrasal verbs, subordinating
// conjunctions, direct and indirect speech, imperative and exclamatory sentences. Written offline. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a Kenyan English teacher signs them off.
// ============================================================================
import { S } from './english_g9_lib.js';
const G7 = 'GRAMMA.T7_RELATIVE_PRONOUNS_IN.', G8 = 'GRAMMA.T8_COMPLEX_PREPOSITIONS.', G9 = 'GRAMMA.T9_CONJUNCTIONS_CORRELA.', W9 = 'WRITIN.T9_NARRATIVE_COMPOSITIO.';
const G10 = 'GRAMMA.T10_DETERMINERS_NUMERALS.', G11 = 'GRAMMA.T11_WORD_CLASSES_NOUNS.', W11 = 'WRITIN.T11_MECHANICS_OF_WRITING.', G12 = 'GRAMMA.T12_PHRASAL_VERBS.';
const G13 = 'GRAMMA.T13_SENTENCES_COMPLEX_SE.', G14 = 'GRAMMA.T14_SENTENCES_DIRECT_AND.', G15 = 'GRAMMA.T15_SENTENCES_1_IMPERATI.';

export const FAMILIES = [
  ...S('rp', G7, 'RELATIVE_PRONOUNS', ['RP_WHICH', 'RP_WHOSE', 'RP_WHO'], ['Who is for people, which for things, whose for belonging.', 'That can be used for people or things.'], [
    ['The book ___ I read was long.', 'which', 'who', 'whose', 'whom'],
    ['The girl ___ bag was lost cried.', 'whose', 'who', 'which', 'what'],
    ['The man ___ helped us is kind.', 'who', 'which', 'whose', 'what'],
    ['The boy to ___ I spoke is my cousin.', 'whom', 'which', 'whose', 'what'],
    ['Which word starts a question about a person?', 'Who', 'Which', 'Whose', 'Where'],
  ], [
    ['Wanjiru lost a pen. She says: The pen ___ I lost was red.', 'which', 'who', 'whose', 'whom'],
    ['A teacher praised a girl whose work was neat. Which fits? She praised the girl ___ work was neat.', 'whose', 'who', 'which', 'what'],
    ['A farmer thanked the man. Which fits? He thanked the man ___ repaired his fence.', 'who', 'which', 'whose', 'what'],
    ['Which question asks about belonging?', 'Whose bag is this?', 'Who bag is this?', 'Which bag is this person?', 'What bag is whom?'],
    ['Which sentence is correct?', 'The dog that barked ran away.', 'The dog whose barked ran away.', 'The dog whom barked ran away.', 'The dog who barked ran away.'],
  ], [
    ['Which step is the mistake?', 'Step 1: Books are things.', 'Step 2: Which is used for things.', 'Step 3: So we say "The book who I read".', 'We say "The book which I read".', 2],
    ['Which step is the mistake?', 'Step 1: Whose shows belonging.', 'Step 2: It joins a person to what they own.', 'Step 3: So we say "The girl who bag".', 'We say "The girl whose bag".', 2],
    ['Which step is the mistake?', 'Step 1: A man is a person.', 'Step 2: Who is used for people.', 'Step 3: So we say "The man which helped us".', 'We say "The man who helped us".', 2],
    ['Which step is the mistake?', 'Step 1: Interrogative pronouns start questions.', 'Step 2: Who asks about people.', 'Step 3: So "Which" asks about people only.', 'Who asks about people.', 2],
    ['Which step is the mistake?', 'Step 1: That can replace who or which.', 'Step 2: It is used in many sentences.', 'Step 3: So that can replace whose.', 'That cannot replace whose.', 2],
  ], ['a', 'b']),
  ...S('cp', G8, 'COMPLEX_PREPS', ['CP_BECAUSE', 'CP_INSTEAD', 'CP_ACCORDING'], ['Complex prepositions are two or three words long.', 'Because of, instead of and according to are used before a noun.'], [
    ['We stayed in ___ the rain.', 'because of', 'because', 'instead', 'according'],
    ['She took tea ___ coffee.', 'instead of', 'instead', 'because of', 'in front'],
    ['It happened ___ the report.', 'according to', 'according from', 'according', 'because'],
    ['He stood ___ the class and spoke.', 'in front of', 'in front', 'instead of', 'in spite'],
    ['They played ___ the heavy rain.', 'in spite of', 'in spite', 'instead of', 'because'],
  ], [
    ['The match was cancelled ___ the storm. Which fits?', 'because of', 'because', 'instead', 'in front'],
    ['Wekesa chose rice ___ ugali. Which fits?', 'instead of', 'instead', 'because of', 'according'],
    ['The newspaper said it happened ___ police. Which fits?', 'according to', 'according', 'according at', 'because'],
    ['The teacher stood ___ the board. Which fits?', 'in front of', 'in front', 'instead of', 'in spite'],
    ['Amina went to school ___ being ill. Which fits?', 'in spite of', 'in spite', 'because of', 'instead'],
  ], [
    ['Which step is the mistake?', 'Step 1: The rain stopped us.', 'Step 2: A noun follows the phrase.', 'Step 3: So we say "because the rain".', 'We say "because of the rain".', 2],
    ['Which step is the mistake?', 'Step 1: She took tea, not coffee.', 'Step 2: A noun follows.', 'Step 3: So we say "instead coffee".', 'We say "instead of coffee".', 2],
    ['Which step is the mistake?', 'Step 1: The report is the source.', 'Step 2: The phrase is two words long.', 'Step 3: So we say "according from the report".', 'We say "according to the report".', 2],
    ['Which step is the mistake?', 'Step 1: He stood before the class.', 'Step 2: The phrase has three words.', 'Step 3: So we say "in front the class".', 'We say "in front of the class".', 2],
    ['Which step is the mistake?', 'Step 1: The rain was heavy.', 'Step 2: They played anyway.', 'Step 3: So we say "in spite the rain".', 'We say "in spite of the rain".', 2],
  ], ['a', 'b']),
  ...S('co', G9, 'CORRELATIVE', ['CO_EITHER', 'CO_NEITHER', 'CO_NOTONLY'], ['Either goes with or; neither with nor.', 'Not only goes with but also.'], [
    ['Either you ___ I will go.', 'or', 'nor', 'and', 'but'],
    ['Neither tea ___ coffee is ready.', 'nor', 'or', 'and', 'but'],
    ['Not only tall ___ also strong.', 'but', 'and', 'or', 'nor'],
    ['Both Achieng ___ Amina passed.', 'and', 'or', 'nor', 'but'],
    ['I wonder ___ he will come or not.', 'whether', 'either', 'neither', 'both'],
  ], [
    ['Wekesa says: You can have tea or coffee. Which fits? Either tea ___ coffee is fine.', 'or', 'nor', 'and', 'but'],
    ['The tea and the coffee were both finished. Which fits? Neither tea ___ coffee was left.', 'nor', 'or', 'and', 'but'],
    ['Njeri is kind and clever. Which fits? She is not only kind ___ also clever.', 'but', 'and', 'or', 'nor'],
    ['Achieng and Amina both passed. Which fits? Both Achieng ___ Amina passed.', 'and', 'or', 'nor', 'but'],
    ['A teacher is unsure if it will rain. Which fits? I wonder ___ it will rain or not.', 'whether', 'either', 'neither', 'both'],
  ], [
    ['Which step is the mistake?', 'Step 1: Either shows a choice.', 'Step 2: Its partner is or.', 'Step 3: So we say "either you nor I".', 'We say "either you or I".', 2],
    ['Which step is the mistake?', 'Step 1: Neither shows two negatives.', 'Step 2: Its partner is nor.', 'Step 3: So we say "neither tea or coffee".', 'We say "neither tea nor coffee".', 2],
    ['Which step is the mistake?', 'Step 1: Not only adds a point.', 'Step 2: Its partner is but also.', 'Step 3: So we say "not only tall and also strong".', 'We say "not only tall but also strong".', 2],
    ['Which step is the mistake?', 'Step 1: Both joins two things.', 'Step 2: Its partner is and.', 'Step 3: So we say "both Achieng or Amina".', 'We say "both Achieng and Amina".', 2],
    ['Which step is the mistake?', 'Step 1: Whether shows doubt.', 'Step 2: Its partner is or.', 'Step 3: So we say "whether he will come and not".', 'We say "whether he will come or not".', 2],
  ], ['a', 'b']),
  ...S('ne', W9, 'NARRATIVE_ELEMENTS', ['NE_SETTING', 'NE_PLOT', 'NE_CLIMAX'], ['Setting is time and place; plot is the order of events.', 'The climax is the most exciting point.'], [
    ['What is the setting of a story?', 'The time and place', 'The people in the story', 'The title', 'The lesson'],
    ['What is the plot?', 'The order of events', 'The title of the story', 'The place only', 'The writer\'s name'],
    ['What is the climax?', 'The most exciting point', 'The last line', 'The first line', 'The title'],
    ['Who are the characters?', 'The people or animals in the story', 'The place of the story', 'The order of events', 'The title'],
    ['What is the resolution?', 'How the problem is solved', 'How the story starts', 'Where it happens', 'Who writes it'],
  ], [
    ['A story takes place in a village at dawn. What is this?', 'The setting', 'The plot', 'The climax', 'The theme'],
    ['A story tells a problem, a struggle and a solution in order. What is this?', 'The plot', 'The setting', 'The title', 'The theme'],
    ['The hero faces the lion at the most tense moment. What is this?', 'The climax', 'The beginning', 'The setting', 'The title'],
    ['Njeri and a hare are in a tale. What are they?', 'Characters', 'Settings', 'Plots', 'Themes'],
    ['At the end the lost child is found. What is this?', 'The resolution', 'The setting', 'The climax', 'The title'],
  ], [
    ['Which step is the mistake?', 'Step 1: A narrative has elements.', 'Step 2: Setting is one.', 'Step 3: So setting is the people.', 'Setting is time and place.', 2],
    ['Which step is the mistake?', 'Step 1: A plot has events.', 'Step 2: They follow an order.', 'Step 3: So the plot is the title.', 'The plot is the order of events.', 2],
    ['Which step is the mistake?', 'Step 1: Tension builds in a story.', 'Step 2: It peaks at one point.', 'Step 3: So the climax is the last line.', 'The climax is the most exciting point.', 2],
    ['Which step is the mistake?', 'Step 1: Characters act in a story.', 'Step 2: They can be people or animals.', 'Step 3: So characters are the place.', 'Characters are the people or animals.', 2],
    ['Which step is the mistake?', 'Step 1: Background information gives setting.', 'Step 2: It makes a story believable.', 'Step 3: So background is not needed.', 'Background makes a story believable.', 2],
  ], ['a', 'a']),
  ...S('dn', G10, 'DETERMINERS_NUM', ['DN_ORDINAL', 'DN_CARDINAL', 'DN_ORDER'], ['Cardinals say how many; ordinals say which position.', 'A determiner comes before the noun.'], [
    ['Which shows position?', 'fifth', 'five', 'fifty', 'fives'],
    ['Which shows how many?', 'five', 'fifth', 'fifths', 'fifteenth'],
    ['Which is correct?', 'three books', 'books three', 'book three many', 'books threes'],
    ['Which is an ordinal number?', 'second', 'two', 'twice', 'twenty'],
    ['Which is a cardinal number?', 'ten', 'tenth', 'tenths', 'tenfold'],
  ], [
    ['Wekesa finished in position five. Which fits? He came ___.', 'fifth', 'five', 'fifty', 'fives'],
    ['A bag holds five oranges. Which fits? The bag has ___ oranges.', 'five', 'fifth', 'fifths', 'fifteenth'],
    ['Which phrase is correct?', 'the second chapter', 'the chapter second', 'the two chapter', 'chapter the twice'],
    ['Amina is first in the queue. Which word is the ordinal?', 'first', 'queue', 'is', 'the'],
    ['A teacher counts twelve desks. Which word is the cardinal?', 'twelve', 'twelfth', 'desks', 'counts'],
  ], [
    ['Which step is the mistake?', 'Step 1: Ordinals show position.', 'Step 2: Fifth is an ordinal.', 'Step 3: So fifth shows how many.', 'Five shows how many.', 2],
    ['Which step is the mistake?', 'Step 1: Cardinals show number.', 'Step 2: Five is a cardinal.', 'Step 3: So five shows position.', 'Fifth shows position.', 2],
    ['Which step is the mistake?', 'Step 1: A determiner introduces a noun.', 'Step 2: It comes first.', 'Step 3: So we say "books three".', 'We say "three books".', 2],
    ['Which step is the mistake?', 'Step 1: First, second, third are ordinals.', 'Step 2: They give position.', 'Step 3: So they say how many.', 'They give position.', 2],
    ['Which step is the mistake?', 'Step 1: One, two, three are cardinals.', 'Step 2: They count.', 'Step 3: So they give position.', 'They say how many.', 2],
  ], ['a', 'b']),
  ...S('nf', G11, 'NOUNS_FORMED', ['NF_DECIDE', 'NF_FRIEND', 'NF_CHILD'], ['Add -ion, -er, -ment to verbs; -hood, -ship to nouns.', 'Decide gives decision; friend gives friendship.'], [
    ['The noun from decide is...', 'decision', 'decider', 'deciding', 'decided'],
    ['The noun formed from friend is...', 'friendship', 'friendly', 'friending', 'friended'],
    ['The noun formed from child is...', 'childhood', 'childish', 'childly', 'children'],
    ['The noun from teach is...', 'teacher', 'teaching', 'taught', 'teachable'],
    ['The noun from move is...', 'movement', 'moving', 'moved', 'movable'],
  ], [
    ['The school made a ___ about uniforms. (decide)', 'decision', 'decider', 'deciding', 'decided'],
    ['Njeri and Wekesa have a strong ___. (friend)', 'friendship', 'friendly', 'friending', 'friended'],
    ['Her ___ was spent in a village. (child)', 'childhood', 'childish', 'childly', 'childing'],
    ['The ___ marked the books. (teach)', 'teacher', 'teaching', 'taught', 'teachable'],
    ['There was a sudden ___ in the room. (move)', 'movement', 'moving', 'moved', 'movable'],
  ], [
    ['Which step is the mistake?', 'Step 1: Decide is a verb.', 'Step 2: The suffix -ion makes a noun.', 'Step 3: So the noun is "decider".', 'The noun is "decision".', 2],
    ['Which step is the mistake?', 'Step 1: Friend is a noun.', 'Step 2: The suffix -ship makes another noun.', 'Step 3: So the noun is "friendly".', 'The noun is "friendship".', 2],
    ['Which step is the mistake?', 'Step 1: Child is a noun.', 'Step 2: The suffix -hood makes a noun.', 'Step 3: So the noun is "childish".', 'The noun is "childhood".', 2],
    ['Which step is the mistake?', 'Step 1: Teach is a verb.', 'Step 2: The suffix -er names the doer.', 'Step 3: So the doer is "teaching".', 'The doer is "teacher".', 2],
    ['Which step is the mistake?', 'Step 1: Move is a verb.', 'Step 2: The suffix -ment makes a noun.', 'Step 3: So the noun is "moving".', 'The noun is "movement".', 2],
  ], ['a', 'b']),
  ...S('ab', W11, 'ABBREVIATIONS', ['AB_EG', 'AB_ETC', 'AB_UN'], ['e.g. means for example; etc. means and so on.', 'UN is United Nations.'], [
    ['What does e.g. mean?', 'for example', 'that is', 'and so on', 'in all'],
    ['Which meaning goes with the abbreviation that ends a list?', 'and so on', 'for example', 'that is', 'only'],
    ['What does UN stand for?', 'United Nations', 'Universal Nations', 'United Names', 'Unity Nations'],
    ['What does i.e. mean?', 'that is', 'for example', 'and so on', 'in addition'],
    ['What does ICT stand for?', 'information and communication technology', 'internet and computer tools', 'information and computer tests', 'internal communication tools'],
  ], [
    ['A note says "fruits, e.g. mangoes". What does e.g. introduce?', 'an example', 'a reason', 'an ending', 'a question'],
    ['A list ends with an abbreviation meaning "and so on". What does it show?', 'the list goes on', 'the list stops', 'a question', 'a name'],
    ['A newspaper mentions the UN. Which organisation is this?', 'United Nations', 'Universal Nations', 'United Names', 'Unity Nations'],
    ['A teacher writes i.e. before an explanation. What does she mean?', 'that is', 'for example', 'and so on', 'maybe'],
    ['A school has an ICT room. What kind of room is it?', 'a computer room', 'a music room', 'a sports store', 'a library of maps'],
  ], [
    ['Which step is the mistake?', 'Step 1: e.g. comes from Latin.', 'Step 2: It introduces examples.', 'Step 3: So e.g. means that is.', 'e.g. means for example.', 2],
    ['Which step is the mistake?', 'Step 1: The abbreviation for et cetera ends a list.', 'Step 2: It shows more items follow.', 'Step 3: So it means for example.', 'It means and so on.', 2],
    ['Which step is the mistake?', 'Step 1: UN is an acronym.', 'Step 2: Each letter stands for a word.', 'Step 3: So UN is Universal Nations.', 'UN is United Nations.', 2],
    ['Which step is the mistake?', 'Step 1: i.e. introduces an explanation.', 'Step 2: It means that is.', 'Step 3: So i.e. means for example.', 'i.e. means that is.', 2],
    ['Which step is the mistake?', 'Step 1: WHO is an acronym.', 'Step 2: It is the World Health Organisation.', 'Step 3: So WHO is a question.', 'WHO is an organisation.', 2],
  ], ['b', 'b']),
  ...S('pv', G12, 'PHRASAL_VERBS', ['PV_BREAKDOWN', 'PV_RUNOUT', 'PV_TURNUP'], ['A phrasal verb has a special meaning.', 'Break down means stop working; run out of means have no more.'], [
    ['The car broke down. It...', 'stopped working', 'was smashed', 'was sold', 'was painted'],
    ['We ran out of sugar. We...', 'had no more sugar', 'ran away from sugar', 'bought sugar', 'sold sugar'],
    ['He turned up late. He...', 'arrived', 'turned around', 'went home', 'got lost'],
    ['What does hang on mean?', 'wait', 'jump', 'run', 'fall'],
    ['What does turn down mean?', 'refuse', 'accept', 'arrive', 'repair'],
  ], [
    ['The bus broke down on the way. What happened?', 'It stopped working', 'It was smashed', 'It was sold', 'It was painted'],
    ['Mama says the flour has run out. What does she mean?', 'There is no more flour', 'The flour is running', 'The flour is new', 'The flour is sold'],
    ['Wekesa turned up at noon. What did he do?', 'He arrived', 'He turned around', 'He stayed home', 'He got lost'],
    ['"Hang on," said Achieng. What does she want?', 'Someone to wait', 'Someone to jump', 'Someone to run', 'Someone to fall'],
    ['The manager turned down the offer. What did he do?', 'He refused it', 'He accepted it', 'He repaired it', 'He wrote it'],
  ], [
    ['Which step is the mistake?', 'Step 1: Break down is a phrasal verb.', 'Step 2: Its meaning is not literal.', 'Step 3: So a car that breaks down is smashed.', 'It means it stopped working.', 2],
    ['Which step is the mistake?', 'Step 1: Run out of is a phrasal verb.', 'Step 2: It means to have no more.', 'Step 3: So it means to run away.', 'It means have no more.', 2],
    ['Which step is the mistake?', 'Step 1: Turn up is a phrasal verb.', 'Step 2: It can mean arrive.', 'Step 3: So it means turn around.', 'It means arrive.', 2],
    ['Which step is the mistake?', 'Step 1: Hang on is a phrasal verb.', 'Step 2: It is said to a person.', 'Step 3: So it means jump.', 'It means wait.', 2],
    ['Which step is the mistake?', 'Step 1: Turn down is a phrasal verb.', 'Step 2: It is used for offers.', 'Step 3: So it means accept.', 'It means refuse.', 2],
  ], ['a', 'b']),
  ...S('sc', G13, 'SUBORDINATING', ['SC_ALTHOUGH', 'SC_BECAUSE', 'SC_UNLESS'], ['Although shows contrast; because shows reason; unless means if not.', 'A complex sentence has a main clause and a subordinate clause.'], [
    ['We played ___ it rained.', 'although', 'because', 'unless', 'so'],
    ['He was late ___ he missed the bus.', 'because', 'although', 'unless', 'but'],
    ['___ you study, you will fail.', 'Unless', 'If', 'Because', 'Although'],
    ['I will go ___ it does not rain.', 'if', 'because', 'although', 'but'],
    ['She sang ___ she cooked.', 'while', 'unless', 'although', 'because'],
  ], [
    ['The match went on in the rain. Which fits? The match went on ___ it rained.', 'although', 'because', 'unless', 'so'],
    ['Juma missed the bus, so he was late. Which fits? He was late ___ he missed the bus.', 'because', 'although', 'unless', 'but'],
    ['If you do not study, you will fail. Which fits? ___ you study, you will fail.', 'Unless', 'If', 'Because', 'Although'],
    ['The picnic is on if the weather is good. Which fits? We will go ___ the weather is good.', 'if', 'because', 'although', 'but'],
    ['Wanjiru listened to music during her work. Which fits? She listened to music ___ she worked.', 'while', 'unless', 'although', 'because'],
  ], [
    ['Which step is the mistake?', 'Step 1: Although shows contrast.', 'Step 2: The match went on in rain.', 'Step 3: So we use because.', 'We use although.', 2],
    ['Which step is the mistake?', 'Step 1: Because shows a reason.', 'Step 2: Missing the bus is the reason.', 'Step 3: So we use although.', 'We use because.', 2],
    ['Which step is the mistake?', 'Step 1: Unless means if not.', 'Step 2: "If you do not study" means unless.', 'Step 3: So we say "If you study, you will fail".', 'We say "Unless you study".', 2],
    ['Which step is the mistake?', 'Step 1: If shows a condition.', 'Step 2: "If it does not rain" is a condition.', 'Step 3: So we use because.', 'We use if.', 2],
    ['Which step is the mistake?', 'Step 1: While shows two things at once.', 'Step 2: Singing and cooking at once.', 'Step 3: So we use unless.', 'We use while.', 2],
  ], ['a', 'b', 'c']),
  ...S('di', G14, 'DIRECT_INDIRECT', ['DI_QUOTE', 'DI_TENSE', 'DI_PRONOUN'], ['Indirect speech has no quotation marks and changes tense and pronouns.', 'Am becomes was; I becomes he or she.'], [
    ['Which is indirect speech?', 'She said that she was ill.', 'She said, "I am ill."', 'She said: "I am ill."', '"I am ill," she said.'],
    ['She said, "I am ill." In indirect speech:', 'She said that she was ill.', 'She said that she is ill.', 'She said that I was ill.', 'She said that I am ill.'],
    ['He said, "I like tea." In indirect speech:', 'He said that he liked tea.', 'He said that I liked tea.', 'He said that he likes tea.', 'He said I like tea.'],
    ['Which is direct speech?', 'He said, "I am tired."', 'He said that he was tired.', 'He said he was tired.', 'He told us he was tired.'],
    ['Which punctuation marks direct speech?', 'quotation marks', 'brackets', 'dashes', 'colons'],
  ], [
    ['Amina said, "I am hungry." Which is the reported sentence?', 'Amina said that she was hungry.', 'Amina said that she is hungry.', 'Amina said that I was hungry.', 'Amina said, "she was hungry."'],
    ['Juma said, "We are late." Which is the reported sentence?', 'Juma said that they were late.', 'Juma said that we were late.', 'Juma said that they are late.', 'Juma said, "they were late."'],
    ['The teacher said, "I will help." Which is the reported sentence?', 'The teacher said that she would help.', 'The teacher said that I will help.', 'The teacher said that she will help.', 'The teacher said, "she would help."'],
    ['Which sentence is punctuated correctly?', 'She said, "I am ready."', 'She said "I am ready".', 'She said, I am ready.', 'She said (I am ready).'],
    ['Which sentence is in indirect speech?', 'Mama said that she was tired.', 'Mama said, "I am tired."', '"I am tired," Mama said.', 'Mama: "I am tired."'],
  ], [
    ['Which step is the mistake?', 'Step 1: Indirect speech reports words.', 'Step 2: It has no quotation marks.', 'Step 3: So we keep the quotation marks.', 'We remove the quotation marks.', 2],
    ['Which step is the mistake?', 'Step 1: Reporting moves words into the past.', 'Step 2: Am becomes was.', 'Step 3: So we keep am.', 'We change am to was.', 2],
    ['Which step is the mistake?', 'Step 1: The speaker says "I".', 'Step 2: The reporter is a different person.', 'Step 3: So we keep "I".', 'We change I to he or she.', 2],
    ['Which step is the mistake?', 'Step 1: Direct speech gives exact words.', 'Step 2: They go in quotation marks.', 'Step 3: So direct speech has no quotation marks.', 'Direct speech has quotation marks.', 2],
    ['Which step is the mistake?', 'Step 1: Will becomes would in reported speech.', 'Step 2: Now becomes then.', 'Step 3: So will stays will.', 'Will becomes would.', 2],
  ], ['a', 'b', 'c']),
  ...S('ei', G15, 'EXCLAM_IMPERATIVE', ['EI_MARK', 'EI_COMMAND', 'EI_STOP'], ['An exclamation ends with !; a command ends with . or !.', 'An imperative gives a command.'], [
    ['Which is punctuated correctly?', 'What a lovely day!', 'What a lovely day?', 'What a lovely day,', 'What a lovely day:'],
    ['Which is an imperative?', 'Close the door.', 'Are you coming?', 'What a nice day!', 'He closed the door.'],
    ['Which is punctuated correctly?', 'Sit down.', 'Sit down?', 'Sit down,', 'Sit down:'],
    ['Which sentence is exclamatory?', 'How beautiful it is!', 'Is it beautiful?', 'It is beautiful.', 'Make it beautiful.'],
    ['Which is an imperative sentence?', 'Please bring your book.', 'Do you have a book?', 'What a big book!', 'He has a book.'],
  ], [
    ['Achieng sees a rainbow and is amazed. Which fits? What a beautiful rainbow___', '!', '?', ',', ';'],
    ['Wekesa tells a friend to close the window. Which sentence does he say?', 'Close the window.', 'Is the window closed?', 'What a window!', 'The window closed.'],
    ['A teacher tells the class to be quiet. Which punctuation is right? Be quiet___', '.', '?', ',', ':'],
    ['A girl is thrilled by news. Which is the best sentence?', 'How exciting this is!', 'Is this exciting?', 'This is exciting.', 'Make it exciting.'],
    ['Which is a polite request?', 'Please pass the salt.', 'Do you pass the salt?', 'What a salt!', 'He passes the salt.'],
  ], [
    ['Which step is the mistake?', 'Step 1: An exclamation shows strong feeling.', 'Step 2: It ends with an exclamation mark.', 'Step 3: So "What a lovely day?" is correct.', '"What a lovely day!" is correct.', 2],
    ['Which step is the mistake?', 'Step 1: An imperative gives a command.', 'Step 2: It often starts with a verb.', 'Step 3: So "Are you coming?" is an imperative.', '"Come here." is an imperative.', 2],
    ['Which step is the mistake?', 'Step 1: A command ends with a full stop or !.', 'Step 2: It is not a question.', 'Step 3: So "Sit down?" is correct.', '"Sit down." is correct.', 2],
    ['Which step is the mistake?', 'Step 1: Exclamatory sentences show feeling.', 'Step 2: "How exciting!" shows feeling.', 'Step 3: So it ends with a question mark.', 'It ends with an exclamation mark.', 2],
    ['Which step is the mistake?', 'Step 1: A request can be polite.', 'Step 2: "Please" makes it polite.', 'Step 3: So "Please pass the salt" is a question.', 'It is an imperative.', 2],
  ], ['a', 'a']),
];
