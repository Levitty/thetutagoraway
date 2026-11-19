// Environmental Activities Grade 2 against the curriculum map HOREB owns (curriculum/environmental_activities/g2.json), mapped on
// 19 Nov 2026 from the KICD outcomes to the Grade 5 Maths standard: two or more prerequisites per skill reaching Grade 1, four
// misconceptions per skill, a teaching pack for every sub-strand, practical outcomes marked by the teacher with the KICD rubric.
// No question families exist yet, so there is no subject entry and every skill is in the awaiting list.
// Build with: node scripts/build-environmental-grade.mjs 2.
import { environmentalDepthTests } from './helpers/environmentalDepth.mjs';

await environmentalDepthTests({ grade: 2, outcomes: 47, totals: [16, 32, 64] });
