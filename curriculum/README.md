# HOREB curriculum

HOREB owns the curriculum. `mathematics/g5.json` is the canonical map: KICD 2024 Grade 5 Mathematics, 19 sub-strands, 122 official outcomes (verified word for word), 167 skills, 422 prerequisites and 414 misconceptions. Outcomes are official; skills, prerequisites and misconceptions are proposed or draft until a teacher reviews them.

Outcomes only, so far (11 Nov 2026): 70 subject-grades, Grades 1 to 9, 1,851 sub-strands, 7,401 official outcomes, read from KICD's text with free local tools (no AI): Science & Technology G4-6, Integrated Science G7-9, Social Studies G4-9, Agriculture G4-9, Creative Arts G4-9, English G4-9, Kiswahili G4-9, CRE G4-8, Pre-Technical Studies G7-9 and Mathematics G2-4 and G6-9 (read from the PDFs in docs/curriculum-sources; the Grade 5 re-read matched all 122 verified outcomes; codes by the fixed rule in src/ai-tutor/curriculum/outcomes.js). `scripts/build-curriculum-outcomes.py` builds them from the reading folders (Tutagora/Build/curriculum-four-subjects-working/out and curriculum-more-subjects-working/out). English and Kiswahili are taught theme by theme, so their order is the theme's and the theme is named in the topic. Outcomes are `kicd_verified`, or `kicd_read` where a check left a question for a person (in the sub-strand's `design_notes`). Grades 1 to 3: English, Kiswahili, Indigenous Language, Mathematical Activities, Environmental Activities, Creative Activities and CRE. Not loaded on the owner's word (11 Nov 2026): Islamic and Hindu Religious Education. Not read: CRE G9 (Google Drive refuses the file). They have no skills, prerequisites or misconceptions yet; until they do, a sub-strand is taught by its outcomes. Plan: Tuta Workspace/CURRICULUM_OTHER_SUBJECTS_PLAN.md.

Tuta (the school system) connects to HOREB and keeps only a read copy. Its copy is generated from this file, never edited there.

Generated from this file:
- `node scripts/build-curriculum-map.mjs` writes `src/ai-tutor/content/curriculumMap.g5.js` and `engine/data/curriculum/g5.*.json`.
- `node scripts/build-curriculum-migration.mjs` writes `supabase/migrations/20261110_curriculum.sql` (loads the same file into the five `curriculum_*` reference tables; idempotent).

Question families carry `cskill` (a skill code here) and `outcome` (its official outcome code).

Science and Technology Grade 5 (12 Nov 2026) is the first subject after Maths with skills, prerequisites and misconceptions: `science/g5.json` (33 skills, 48 prerequisites, 104 misconceptions, all proposed or draft). `node scripts/build-curriculum-map-science.mjs` writes `src/ai-tutor/content/curriculumMap.science.g5.js` and `engine/data/curriculum/science.g5.*.json`. Its question families (`sci_g5_*.js`, 84, all `reviewed: false`) carry `subject: 'science'`, `cskill` and `outcome`; their `skill` is their `cskill`, because science skills are not in the practice engine yet. Review document: `docs/qa/science-g5-2026-11-12.md`.


Mathematics Grade 4 (12 Nov 2026) has the same depth as Grade 5: `mathematics/g4.json` carries 87 skills (each with a mastery rule, question forms, prerequisites to Grade 3 outcomes and to other Grade 4 skills) and 245 draft misconceptions, each with a `source` ("to confirm by a teacher", or widely reported in the research). `node scripts/build-maths-g4.mjs` merges `scripts/data/maths-g4-*.mjs` into the file (official outcomes are never touched); `node scripts/build-curriculum-map-g4.mjs` writes `src/ai-tutor/content/curriculumMap.g4.js` and `engine/data/curriculum/g4.*.json`. The Grade 4 families (`families/g4c_*.js`, kit in `g4c_lib.js`, plus the older `g4.js` ones linked by `scripts/link-maths-g4-families.mjs`) carry `cskill` and the official outcome code; all `reviewed: false`. `node scripts/maths-g4-structure.mjs` lists skills with fewer than two families or structures; `node scripts/maths-g4-review-doc.mjs` writes the review document `docs/qa/maths-g4-<date>.md`. HOREB's own Grade 4 outcome letters are reconciled with the official ones in `scripts/data/maths-g4-letters.mjs`.

## Adding a subject-grade

A new subject-grade is wired through the subject registry (`src/ai-tutor/content/subjects/`), by adding files only. See `docs/adding-a-subject.md`.
