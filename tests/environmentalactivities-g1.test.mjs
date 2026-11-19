// Environmental Activities Grade 1 against the curriculum map HOREB owns (curriculum/environmental_activities/g1.json), mapped on
// 19 Nov 2026 from the KICD outcomes to the Grade 5 Maths standard: two or more prerequisites per skill, below Grade 1 naming the
// pre-primary readiness skills HOREB defines in g1.json (readiness, ENVI.PP2.READINESS.*, for a teacher to confirm against the
// PP1-PP2 design), four misconceptions per skill, a teaching pack for every sub-strand, practical outcomes marked by the teacher
// with the KICD rubric. No question families exist yet: no subject entry, every skill in the awaiting list.
// Build with: node scripts/build-environmental-grade.mjs 1.
import { environmentalDepthTests } from './helpers/environmentalDepth.mjs';

await environmentalDepthTests({ grade: 1, outcomes: 44, totals: [16, 33, 64] });
