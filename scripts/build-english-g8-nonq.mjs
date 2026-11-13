// Writes docs/qa/english-g8-non-question-outcomes-2026-11-13.md. node scripts/build-english-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(acknowledge|appreciate|advocate|value|emphasise|recogni[sz]e the (role|value)|show interest|desire)/i;
const classify = (t, sub, code) => {
  const text = t.trim(); const strand = sub.split('.')[2];
  if (A.test(text)) return 'A';
  if (strand === 'GRAMMA') return 'Q';
  if (strand === 'LISTEN') return /silent consonant letters/i.test(text) && /^identify/i.test(text) ? 'Q' : 'O';
  if (strand === 'READIN') return /^(read|perform|dramatise|present)\b/i.test(text) ? 'O' : 'Q';
  if (strand === 'WRITIN') return /^(identify|classify|list|outline|recognise|recognize|explain|spell|use (a|an|prefixes|conjunctions)|punctuate)/i.test(text) ? 'Q' : 'W';
  return 'Q';
};
await writeNonQ({
  subject: 'english', grade: 8, title: 'English Grade 8', prefix: 'ENGL.G8.',
  curriculumFile: 'curriculum/english/g8.json', entryFile: 'src/ai-tutor/content/subjects/english_g8.js', classify,
  needs: {
    W: 'Composition marking: HOREB\'s composition marker (it flags that it wants a native-speaker review) or the teacher marking with the KICD rubric indicator.',
    O: 'A speaking, listening or reading-aloud check: the teacher listens and scores with the observation rubric (PLAN_OBSERVATION_RUBRICS.md); a tapped answer cannot show how a child speaks, pronounces or reads aloud.',
    P: 'A practical task scored by the teacher.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the strand and the verb of the outcome (grammar outcomes are Q because choosing or typing the right word tests identifying and using the form; most listening outcomes are O; reading outcomes that ask a question about a text are Q but need a passage). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Built this round: 22 skills on grammar (compound and collective nouns, auxiliary verbs, tenses, gradable adjectives, adverbs, reflexive and indefinite pronouns, prepositions, conjunctions, demonstratives and quantifiers, phrasal verbs, compound sentences, active and passive voice, question tags), punctuation, spelling, prefixes and suffixes, similes and metaphors, personification and flashback, the parts of a poem and silent letters.',
    'Not built: every Q reading outcome that needs a passage (the Grade 7 passage machinery in english_g7_passages.js and english_g7_reading.js exists and is the next step; Grade 8 passages must be written first), the pronunciation and oral outcomes, and all writing tasks.'],
});
