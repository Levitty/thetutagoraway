// ============================================================================
// START A SUBJECT-GRADE: writes the files a builder owns, wires nothing shared.
//   node scripts/new-subject.mjs <subject> <grade> --prefix <4 letters> --name "Display name" [--short Name] [--icon book]
//                                [--dir <curriculum dir>] [--marker text]
//   e.g. node scripts/new-subject.mjs kiswahili 5 --prefix KISW --name Kiswahili --dir kiswahili --marker text
//
// Run it AFTER the curriculum JSON has skills and misconceptions and the map is built:
//   node scripts/build-subject-map.mjs <subject> <grade> --dir <dir> --title "<name>"
// It creates (never overwrites):
//   src/ai-tutor/content/subjects/<subject>_g<N>.js          the registry entry (the ONE file that wires the subject-grade)
//   src/ai-tutor/content/families/<subject>_g<N>_signed.js   the signed list, empty
//   src/ai-tutor/content/families/<subject>_g<N>_lib.js      the family kit for this subject-grade (sfam, choose, typed, spot)
//   src/ai-tutor/content/families/<subject>_g<N>_a.js        the first family file, empty: copy it for more (_b, _c ...)
// and runs `npm run registry`. docs/adding-a-subject.md says what to do next.
// ============================================================================
import { existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d = null) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const [subject, gradeArg] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const grade = Number(gradeArg);
const prefix = flag('--prefix'), name = flag('--name');
if (!/^[a-z][a-z0-9]*$/.test(subject || '') || !Number.isInteger(grade) || !/^[A-Z]{4}$/.test(prefix || '') || !name) {
  console.error('usage: node scripts/new-subject.mjs <subject> <grade> --prefix ABCD --name "Display name" [--short Name] [--icon book] [--dir <curriculum dir>] [--marker text]');
  console.error('       <subject> is lower case letters and digits, no underscore (kiswahili, socialstudies); the prefix is the 4 capitals the curriculum codes start with');
  process.exit(1);
}
const short = flag('--short', name), icon = flag('--icon', 'book'), dir = flag('--dir', subject), marker = flag('--marker');
const tag = `${subject}_g${grade}`;
const mapFile = `curriculumMap.${subject}.g${grade}.js`;
const files = {
  [`src/ai-tutor/content/subjects/${tag}.js`]: `// ============================================================================
// SUBJECT-GRADE ENTRY: ${name}, Grade ${grade}. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../${mapFile}';
import { FAMILIES as A } from '../families/${tag}_a.js';
import { SIGNED } from '../families/${tag}_signed.js';

export default {
  subject: '${subject}', grade: ${grade}, prefix: '${prefix}',
  name: '${name}', shortName: '${short}', icon: '${icon}',
  description: 'Grade ${grade} ${name} from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A],                          // add each family file you write: [...A, ...B]
  familyFiles: ['${tag}_a.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: '${tag}_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: '${subject}${grade}.',          // every family id starts with this
  marker: ${marker ? `'${marker}'` : 'null'},                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: '${dir}',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/${subject}.g${grade}.misconceptions.json',
  reviewDoc: 'docs/qa/${subject}-g${grade}-review-${new Date().toISOString().slice(0, 10)}.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: '${short} ${grade}',
};
`,
  [`src/ai-tutor/content/families/${tag}_signed.js`]: `// Ids of ${name} Grade ${grade} families a teacher has signed off. Empty: every family is a draft and switched OFF for children.
// Adding an id here is the one switch. The rule is the same for every subject: a family that is not signed off is never served to a child.
export const SIGNED = [];
`,
  [`src/ai-tutor/content/families/${tag}_lib.js`]: `// The family kit for ${name} Grade ${grade} (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without '${prefix}.G${grade}.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../${mapFile}';
import { SIGNED } from './${tag}_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: '${subject}', grade: ${grade}, prefix: '${prefix}', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});
`,
  [`src/ai-tutor/content/families/${tag}_a.js`]: `// ${name} Grade ${grade}, first family file. Written offline from the curriculum map; every wrong answer names the library
// misconception it reveals. Every family stays reviewed:false until a teacher signs it off (${tag}_signed.js).
// import { sfam, choose, typed, spot } from './${tag}_lib.js';
//
// export const FAMILIES = [
//   sfam({ id: '${subject}${grade}.<topic>.<name>', cs: 'STRAND.SUBSTRAND.SKILL', form: 'direct', rung: 1, kind: '<structure>',
//     gen: choose([ /* [question, right, [[wrong, 'M_CODE'], ...], why] x at least 5 */ ], { h: ['hint 1', 'hint 2'] }) }),
// ];
export const FAMILIES = [];
`,
};
let made = 0;
for (const [rel, text] of Object.entries(files)) {
  const p = resolve(root, rel);
  if (existsSync(p)) { console.log(`exists, left alone: ${rel}`); continue; }
  writeFileSync(p, text); made++; console.log(`created ${rel}`);
}
if (!existsSync(resolve(root, `src/ai-tutor/content/${mapFile}`))) console.warn(`NOTE: ${mapFile} does not exist yet. Run: node scripts/build-subject-map.mjs ${subject} ${grade} --dir ${dir} --title "${name}"`);
else spawnSync('node', [resolve(root, 'scripts/build-subject-registry.mjs')], { stdio: 'inherit' });
console.log(`${made} file(s) made. Next: docs/adding-a-subject.md step 5.`);
