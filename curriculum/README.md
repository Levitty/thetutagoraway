# HOREB curriculum

HOREB owns the curriculum. `mathematics/g5.json` is the canonical map: KICD 2024 Grade 5 Mathematics, 19 sub-strands, 122 official outcomes (verified word for word), 167 skills, 422 prerequisites and 414 misconceptions. Outcomes are official; skills, prerequisites and misconceptions are proposed or draft until a teacher reviews them.

Outcomes only, so far (11 Nov 2026): 44 subject-grades, 1,203 sub-strands, 4,706 official outcomes, read from KICD's text with free local tools (no AI): Science & Technology G4-6, Integrated Science G7-9, Social Studies G4-9, Agriculture G4-9, Creative Arts G4-9, English G4-9, Kiswahili G4-9, CRE G4-8 and Pre-Technical Studies G7-9. `scripts/build-curriculum-outcomes.py` builds them from the reading folders (Tutagora/Build/curriculum-four-subjects-working/out and curriculum-more-subjects-working/out). English and Kiswahili are taught theme by theme, so their order is the theme's and the theme is named in the topic. Outcomes are `kicd_verified`, or `kicd_read` where a check left a question for a person (in the sub-strand's `design_notes`). Not read: CRE G9 (Google Drive refuses the file). They have no skills, prerequisites or misconceptions yet; until they do, a sub-strand is taught by its outcomes. Plan: Tuta Workspace/CURRICULUM_OTHER_SUBJECTS_PLAN.md.

Tuta (the school system) connects to HOREB and keeps only a read copy. Its copy is generated from this file, never edited there.

Generated from this file:
- `node scripts/build-curriculum-map.mjs` writes `src/ai-tutor/content/curriculumMap.g5.js` and `engine/data/curriculum/g5.*.json`.
- `node scripts/build-curriculum-migration.mjs` writes `supabase/migrations/20261110_curriculum.sql` (loads the same file into the five `curriculum_*` reference tables; idempotent).

Question families carry `cskill` (a skill code here) and `outcome` (its official outcome code).
