// ============================================================================
// ENGLISH GRADE 4: how each official outcome is assessed, when no question family covers it.
// Rules, in order, on the outcome's own words and its sub-strand (curriculum/english/g4.json):
//   attitude     the outcome is about caring, advocating, recommending, challenging or collaborating
//   composition  the learner writes a piece: HOREB's composition marker (four bands, 5 marks each, out of 20)
//   voice        speaking, listening, sounds, stress, intonation and reading aloud: needs a voice tool later
//   teacher      everything else a typed answer cannot test: handwriting, forms, choosing books, mental images
// A teacher can change a route here; the coverage report and the review document follow.
// ============================================================================
export const ROUTE_NAMES = {
  family: { title: 'Question family', means: 'A typed or tapped question can check it. Draft families exist, off for children until a teacher signs them off.' },
  composition: { title: 'Composition marking', means: "The learner writes a piece, which HOREB's composition marker scores out of 20 (content, organisation, language, mechanics)." },
  voice: { title: 'Voice or a teacher', means: 'Speaking, listening, sounds, stress, intonation or reading aloud. Needs the voice tool or a teacher listening.' },
  teacher: { title: 'Teacher only', means: 'Handwriting, filling forms, choosing books, mental images, opinions. A teacher observes or judges.' },
  attitude: { title: 'Attitude', means: 'About caring, advocating, recommending or collaborating. Observed, never tested by a question.' },
};
const ATTITUDE = /^(adopt|advocate|promote|appreciate|acknowledge|realise|recommend|challenge|encourage|collaborate|acknowledge)\b/i;
const VOICE = /\b(at the right speed|with expression|pronounc|sounds?\b|speak|orally|oral\b|intonation|stress|display|interrupt|interpret a speaker|listen|respond to information|moods in a narrative|read a text accurately|fluency|unfamiliar words)|^(list words|sort statements)/i;

// 'narrative', 'descriptive', 'letter', 'own' (open-ended, pictorial, diary): the composition types the marker knows (src/writing/prompts.js)
export const COMPOSITION_TYPE = (o, sub) => {
  const n = `${sub.sub_strand} ${o.text}`.toLowerCase();
  if (n.includes('friendly letter')) return 'letter';
  if (n.includes('descriptive')) return 'descriptive';
  if (n.includes('narrative')) return 'narrative';
  if (n.includes('open ended') || n.includes('open-ended') || n.includes('pictorial') || n.includes('diary')) return 'own';
  return 'own';
};

export const routeOf = (o, sub) => {
  const text = o.text.trim(), n = sub.sub_strand.toLowerCase();
  if (ATTITUDE.test(text)) return 'attitude';
  if (sub.strand === 'Writing') {
    if (n.includes('handwriting') || n.includes('filling forms')) return 'teacher';
    if ((n.includes('creative writing') || n.includes('functional writing') || n.includes('guided composition')) && /^(write|create|describe|select relevant points)/i.test(text) && !/^design/i.test(text)) return 'composition';
    return 'teacher';
  }
  if (sub.strand === 'Listening and Speaking') return /^(judge|use similes)/i.test(text) ? 'teacher' : 'voice';
  if (VOICE.test(text)) return 'voice';
  return 'teacher';
};
