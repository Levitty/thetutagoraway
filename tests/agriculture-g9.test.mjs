// Agriculture Grade 9 mapped to the Grade 5 Maths standard (18 Nov 2026, Tuta Workspace/HOREB_MAPPING_PLAN.md): the file had KICD
// outcomes only; now a skill for every testable outcome, two or more prerequisites and four real misconceptions per skill,
// practical outcomes marked by the teacher with the KICD rubric, a teaching pack for every sub-strand, SQL current. Families since
// 19 Nov 2026 (agriculture_g9_a.js, agriculture_g9_b.js); the awaiting list is empty. All draft.
import { agricultureDepthTests } from './helpers/agricultureDepth.mjs';
await agricultureDepthTests({ grade: 9, outcomes: 33, minDown: 0.4 });
