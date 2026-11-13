// Writes docs/qa/kiswahili-g6-non-question-outcomes-2026-11-13.md. node scripts/build-kiswahili-g6-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(kuchangamkia|kufurahia|kuthamini|kuonea fahari|ufurahia|kuonea)/i;
const classify = (t, sub) => {
  if (A.test(t)) return 'A';
  const strand = sub.split('.')[2];
  if (strand === 'KUANDI') return /^(kuandika|kutunga)/i.test(t) ? 'W' : /^(kujadili|kueleza|kubainisha)/i.test(t) ? 'O' : /tarakilishi|kutambua/i.test(t) ? 'Q' : 'W';
  if (strand === 'KUSIKI') return /^(kutambua|kueleza maana|kutambua)/i.test(t) ? 'Q' : 'O';
  if (strand === 'KUSOMA') return /^(kusoma kifungu|kusoma mashairi|kusoma mchezo|kusoma makala|kusoma matini|kusakura|kutumia vifaa|kutambua na kufungua faili|kuchagua matini|kutambua matini|kutambua makala|kutumia kamusi)/i.test(t) ? 'P' : /^kujadili/i.test(t) ? 'O' : 'Q';
  return /^kutunga/i.test(t) ? 'W' : 'Q';
};
await writeNonQ({
  subject: 'kiswahili', grade: 6, title: 'Kiswahili Grade 6', prefix: 'KISW.G6.',
  curriculumFile: 'curriculum/kiswahili/g6.json', entryFile: 'src/ai-tutor/content/subjects/kiswahili_g6.js', classify,
  needs: {
    W: 'Composition marking: HOREB\'s insha marker for Grade 4 up (it needs a native Kiswahili reviewer) or the teacher marking with the KICD rubric indicator.',
    O: 'A speaking or oral check: the teacher listens and scores with the observation rubric (PLAN_OBSERVATION_RUBRICS.md); a tapped answer cannot show how a child speaks, recites or discusses.',
    P: 'A reading-aloud or practical task: the teacher listens to a passage read aloud, or watches the child search a safe site, use the dictionary or choose a library text; a portfolio entry holds the evidence.',
    A: 'Teacher observation over the term or a portfolio entry; the KICD rubric indicator for the strand. A tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the verb of the outcome (kuandika is W, kukariri and kutamka are O, kusoma kifungu is a reading-aloud task, kuchangamkia and kufurahia are attitudes). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Not built for lack of a surer source: the ji- nouns of ukubwa na udogo (the second T11 sub-strand), kuandika kwa tarakilishi, the dictionary labels (nomino, kitenzi), and mizani and vina in the shairi (taught at Grade 5).'],
});
