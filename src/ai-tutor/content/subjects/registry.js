// ============================================================================
// THE SUBJECT REGISTRY (12 Nov 2026): the one place a subject-grade is known.
//
// A subject-grade is one file in this folder, <subject>_g<N>.js, whose default export says what the subject-grade is,
// where its curriculum map is, which families it has, which list signs them off and how it is checked. Everything that
// has to know about subjects reads this file instead of naming Science or English:
//   the practice engine (subjectPractice.js), the homework door (school/homework.js), the family bank (families/bank.js),
//   the quality gate, family checks, review pre-check, coverage report, the phone-bundle stripping (vite.config.js),
//   and the light subject list (learner/subjects.generated.js).
// Maths is not an entry here: its graph is the knowledge graph and its bank is the grade files in families/.
//
// The list of entries is src/ai-tutor/content/subjects/index.generated.js, written by `npm run registry`.
// docs/adding-a-subject.md says what to add. THE ONE RULE is unchanged (families/core.js isSigned): a family a person
// has not signed off is never served to a child.
// ============================================================================
import { ENTRIES } from './index.generated.js';

const REQUIRED = ['subject', 'grade', 'prefix', 'name', 'shortName', 'icon', 'description', 'map', 'families', 'familyFiles', 'signed', 'signedFile', 'checks'];
for (const e of ENTRIES) {
  for (const k of REQUIRED) if (e[k] === undefined) throw new Error(`subject entry ${e.subject}_g${e.grade}: missing ${k}`);
  for (const k of ['skills', 'substrands', 'outcomes', 'misFeedback']) if (!e.map[k]) throw new Error(`subject entry ${e.subject}_g${e.grade}: map.${k} missing`);
  if (!['family', 'text'].includes(e.checks)) throw new Error(`subject entry ${e.subject}_g${e.grade}: checks must be 'family' or 'text'`);
}

/** Every subject-grade entry, in file-name order. */
export const SUBJECT_GRADES = ENTRIES;

/** The entry for a subject and grade, or undefined. */
export const entryFor = (subject, grade) => ENTRIES.find(e => e.subject === subject && e.grade === Number(grade));

/** The entry a curriculum skill code (SCIE.G5.LIVING...) or a family belongs to, or undefined. */
export const entryOfCskill = (code) => {
  const m = /^([A-Z]{4})\.G(\d+)\./.exec(String(code || ''));
  return m ? ENTRIES.find(e => e.prefix === m[1] && e.grade === Number(m[2])) : undefined;
};
export const entryOfFamily = (f) => entryOfCskill(f?.cskill) || (f?.subject ? entryFor(f.subject, f.grade) : undefined);

const orderOf = (e) => e.order ?? 100;
/** Subject ids in picker order. */
export const SUBJECT_ORDER = [...new Set(ENTRIES.map(e => e.subject))].sort((a, b) => orderOf(ENTRIES.find(e => e.subject === a)) - orderOf(ENTRIES.find(e => e.subject === b)) || a.localeCompare(b));

export const entriesOf = (subject) => ENTRIES.filter(e => e.subject === subject).sort((a, b) => a.grade - b.grade);

/** Every family of every entry (drafts included), in the order subjects and grades are listed. */
export const allFamilies = () => SUBJECT_ORDER.flatMap(s => entriesOf(s).flatMap(e => e.families));
/** The families of one subject (all its grades). */
export const familiesOf = (subject) => entriesOf(subject).flatMap(e => e.families);
/** Families that are also in the shared family bank (families/bank.js); the rest live only here. */
export const bankFamilies = () => ENTRIES.filter(e => e.bank).flatMap(e => e.families);
export const familiesOutsideBank = () => ENTRIES.filter(e => !e.bank).flatMap(e => e.families);

/** One subject across its grades, in the shape the engine reads: its name, and the maps of all its grades joined (codes carry the grade, so they never clash). */
export function subjectDef(subject) {
  const es = entriesOf(subject);
  if (!es.length) return undefined;
  const first = es[0];
  const join = (k) => Object.assign({}, ...es.map(e => e.map[k]));
  return {
    id: subject, name: first.name, shortName: first.shortName, icon: first.icon,
    description: es.length === 1 ? first.description : `${first.name} for Grades ${es.map(e => e.grade).join(', ')} from the CBC design`,
    map: join('skills'), substrands: join('substrands'), outcomes: join('outcomes'),
    families: () => es.flatMap(e => e.families),
  };
}
export const SUBJECT_DEFS_LIST = SUBJECT_ORDER.map(subjectDef);

/** The library misconception lines of one skill code's entry: short code -> feedback (a map or a skill-keyed map, as the entry has it). */
export const mapOfCskill = (code) => entryOfCskill(code)?.map.skills || {};
/** The curriculum skill map of a subject (all grades joined). */
export const skillMapOf = (subject) => subjectDef(subject)?.map || {};
export const substrandsOf = (subject) => subjectDef(subject)?.substrands || {};
