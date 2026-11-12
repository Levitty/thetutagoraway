# Adding a subject-grade to HOREB

Written 12 Nov 2026. Several builders can add subject-grades in parallel: **you add files, you never edit a shared one.**
Everything that has to know about subjects (practice engine, homework door, family bank, quality gate, family checks,
pre-review, coverage, phone-bundle stripping, the signed lists) reads the **subject registry**,
`src/ai-tutor/content/subjects/registry.js`. A subject-grade is one **entry file** in that folder.

Today the registry holds two entries: `science_g5.js` and `english_g5.js`. Maths is not an entry (its graph is the knowledge
graph and its bank is the grade files).

## The files you own (and only these)

| File | What it is |
|---|---|
| `curriculum/<dir>/g<N>.json` | the design file HOREB owns: official outcomes, plus your skills, prerequisites, misconceptions |
| `src/ai-tutor/content/curriculumMap.<subject>.g<N>.js` | generated map (skills, outcomes, `MIS_FEEDBACK`) |
| `engine/data/curriculum/<subject>.g<N>.misconceptions.json` and `.detail.json` | generated library and detail |
| `src/ai-tutor/content/subjects/<subject>_g<N>.js` | **the registry entry**: the one wiring file |
| `src/ai-tutor/content/families/<subject>_g<N>_lib.js` | the family kit (`sfam`, `choose`, `typed`, `spot`) |
| `src/ai-tutor/content/families/<subject>_g<N>_<theme>.js` | your question families, one file per theme (`_a`, `_b`, or a name) |
| `src/ai-tutor/content/families/<subject>_g<N>_signed.js` | the signed list, empty: `export const SIGNED = [];` |
| `docs/qa/<subject>-g<N>-review-<date>.md` | the review pack, generated |
| `tests/<subject>-g<N>.test.mjs` (optional) | tests specific to your content |

Naming: `<subject>` is lower case letters and digits with **no underscore** (`kiswahili`, `socialstudies`, `cre`);
`<N>` is the grade; `<PREFIX>` is the four capitals the curriculum codes start with (`KISW.G5....`). Family ids start with
`<subject><N>.` (for example `kiswahili5.sarufi.nomino`).

**Never edit:** `families/bank.js`, `families/index.js`, `families/core.js`, `subjects/registry.js`, `subjectPractice.js`,
`school/homework.js`, `quality_gate.mjs`, `family_checks.mjs`, `review-precheck.mjs`, `coverage-outcomes.mjs`,
`vite.config.js`, `package.json`, `curriculum/README.md`. Nothing in this list needs a line for your subject.
The three generated joins (`subjects/index.generated.js`, `subjects/strip.generated.js`, `learner/subjects.generated.js`)
are written by `npm run registry`; do not hand-edit them. They carry one line per subject-grade and merge with `merge=union`.

## The steps

1. **Worktree and branch** (own worktree, never the main checkout):
   `git worktree add ../tutagora-app-<name> -b horeb/<date>-<subject>-g<N> origin/main`, symlink `node_modules`.
2. **Skills and misconceptions into the design file.** `curriculum/<dir>/g<N>.json` already holds the official outcomes.
   Add, under each sub-strand, `skills[]` (`code`, `name`, `outcomes[]` letters or codes, `prerequisites[]` of
   `{ requires, kind }`, `question_forms`, `mastery`) and `misconceptions[]` (`code`, `skill`, `error`, `example`, `cause`,
   `reveals`, `help`, `feedback`, `source`, `status: 'draft'`). Science G5 was authored directly in its JSON; English G5 merged
   an authored data file into it with its own script (`scripts/build-english-g5.mjs`), which you may copy if that suits.
3. **Build the map:**
   `npm run subject:map -- <subject> <N> --dir <dir> --title "<Display name>"`
   (writes the map file and the two engine data files). The map exports `SKILLS`, `SUBSTRANDS`, `OUTCOMES`, `MIS_FEEDBACK`.
4. **Scaffold the rest:**
   `npm run subject:new -- <subject> <N> --prefix <PREFIX> --name "<Display name>" --dir <dir> [--marker text]`
   creates the entry, the signed list, the kit and an empty first family file, and runs `npm run registry`.
   Use `--marker text` when the answers are words marked by `answerCheckText.js` (English-like); then also set `checks: 'text'`
   in the entry and use English's kit (`eng_lib.js`) as your model.
5. **Write the families** in `families/<subject>_g<N>_<theme>.js`:
   `import { sfam, choose, typed, spot } from './<subject>_g<N>_lib.js'; export const FAMILIES = [ sfam({ id, cs, form, rung, kind, gen }) ];`
   See `families/subject_kit.js` for the three ways to write a `gen()` and `families/sci_g5_living.js` for a worked file.
   Rules the gate enforces: every skill has at least two families of different structure; at least five cases per family;
   every wrong answer names a library misconception; British spelling, no emoji, no em dash; a spot-the-mistake working has
   exactly one false step. Add each new file to the entry: one `import` and the name in `families: [...]` and
   `familyFiles: [...]`.
6. **Checks to run** (all free, all local):
   - `npm run registry -- --check` (the generated joins are fresh)
   - `npm test` (includes `tests/registry.test.mjs`: every family is in its entry, belongs to its skill, none is signed)
   - `npm run test:content` (the quality gate runs your entry's family checks and the per-skill structure checks)
   - `npm run review:precheck -- --subject <subject> --draws 60 --strict` (pre-review of every drawn item; writes
     `docs/qa/precheck-<subject>-g<N>-<date>.md`)
   - `node scripts/coverage-outcomes.mjs` (adds your subject's section to `docs/qa/coverage-<date>.md`; English-like subjects that
     have their own routes script name it in `coverageScript` and run that instead)
   - `npm run build` (the phone bundle drops your family files while the signed list is empty)
7. **Review pack:** `npm run subject:review -- <subject> <N>` writes `docs/qa/<subject>-g<N>-review-<date>.md`
   (checks verdict, skills and families, misconception library with which are revealed, one drawn example per family,
   how to sign). Hand it to the reviewer.
8. **Function bundles** (only if your branch changed anything the edge functions bundle, which a new subject-grade does,
   because the school door reads the registry): `npm run build:school-fn`, `npm run build:voice-tutor-fn`
   (and `build:report-fn`, `build:marking-fn` if their sources changed). Regenerate again after merging.
9. **Commit named files** (never `git add -A`; the `node_modules` symlink must not be added), message ending
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, branch work only, no deploy.

## Rules that do not change

- **A family a person has not signed off is never served to a child.** Every new family is `reviewed: false`; the signed list
  stays empty (`export const SIGNED = [];`). A teacher signs by adding ids to the list; the kit reads it. Builders never sign.
- A family never types its answer: the key is computed and `check` is a second relation (Maths families), or the options carry
  `right` flags and the marker agrees (words).
- No children's data, no paid API call, no deploy, no agent starts another agent.

## The entry file, field by field

```js
export default {
  subject: 'kiswahili', grade: 5, prefix: 'KISW', order: 3,     // order: picker position (default 100)
  name, shortName, icon, description,
  map: { skills, substrands, outcomes, misFeedback },            // from the generated map file
  families: [...A, ...B],                                        // every family of the subject-grade
  familyFiles: ['kiswahili_g5_a.js', 'kiswahili_g5_b.js'],       // the same, by file name (phone-bundle stripping)
  signed: SIGNED, signedFile: 'kiswahili_g5_signed.js',          // the one switch
  checks: 'family',                                              // 'family' | 'text'
  idPrefix: 'kiswahili5.',                                       // optional: ids must start with it
  marker: null,                                                  // 'text' for words marked by answerCheckText.js
  bank: false,                                                   // true only for Science G5 (listed in the shared FAMILIES)
  curriculumDir: 'kiswahili',                                    // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/kiswahili.g5.misconceptions.json',
  reviewDoc: 'docs/qa/kiswahili-g5-review-<date>.md',            // the pack the teacher reads
  precheckLabel: 'Kiswahili 5',                                  // row label in the pre-review table (bank subjects only)
  coverageScript: 'scripts/coverage-english.mjs',                // only when the subject has its own coverage report
};
```

## What reads the registry

| Reader | What it takes |
|---|---|
| `subjectPractice.js` | the subject's maps (all grades joined) and families: the practice graph and `generate`, signed families only |
| `school/homework.js` | the maps (skill names, topics, accepted skills) and the families outside the bank |
| `families/bank.js` | families of entries with `bank: true` |
| `quality_gate.mjs` | per entry: family checks and per-skill structure (`checks: 'family'`), or word checks (`checks: 'text'`) |
| `family_checks.mjs`, `english_checks.mjs` | the entry's map, outcomes, subject, grade, id prefix |
| `review-precheck.mjs` | `--subject <id>` takes that subject's families |
| `coverage-outcomes.mjs` | one section per subject beyond Maths |
| `vite.config.js` | `strip.generated.js`: family files to drop while their signed list is empty |
| `learner/subject.js`, `evidence.js`, `homework.js` | the ids and prefixes in `learner/subjects.generated.js` |

## After a merge

Two builders' entries merge without a conflict (one new file each, one line each in the generated joins).
Then: `npm run registry`, `npm test`, `npm run test:content`, `npm run build`, and regenerate the function bundles
(`npm run build:school-fn`, `npm run build:voice-tutor-fn`). The known failures in `tests/function-drift.test.mjs` are noted, not fixed, by a merge.
