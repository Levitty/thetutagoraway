// Environmental Activities Grade 3 against the curriculum map HOREB owns (curriculum/environmental_activities/g3.json), mapped on
// 19 Nov 2026 from the KICD outcomes to the Grade 5 Maths standard: two or more prerequisites per skill reaching Grade 2, four
// misconceptions per skill, a teaching pack for every sub-strand, practical outcomes marked by the teacher with the KICD rubric.
// No question families exist yet, so there is no subject entry and every skill is in the awaiting list.
// Build with: node scripts/build-environmental-grade.mjs 3.
import { environmentalDepthTests } from './helpers/environmentalDepth.mjs';

await environmentalDepthTests({ grade: 3, outcomes: 46, totals: [15, 34, 60] });
