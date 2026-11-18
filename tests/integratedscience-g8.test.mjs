// Integrated Science Grade 8 against the curriculum map HOREB owns (curriculum/integrated_science/g8.json), to the Grade 5 Maths
// standard (depth pass, 18 Nov 2026): two new skills for the outcomes that had none (2.2 b and 2.3 b), a real cause for every
// misconception, prerequisites reaching Grades 5-7, four misconceptions per skill and a teaching pack for every sub-strand.
// All draft until a CBC Integrated Science teacher reviews it.
import { scienceDepthTests } from './helpers/scienceDepth.mjs';

scienceDepthTests({
  dir: 'integrated_science', subject: 'integratedscience', grade: 8, outcomes: 37, minDown: 0.6,
  noFamilies: ['INTE.G8.LIVING.MOVEMENT_OF_MATERIALS_IN.DIFFUSION_OSMOSIS_DEMO', 'INTE.G8.LIVING.REPRODUCTION_IN_HUMAN_BE.MENSTRUAL_MANAGE'],
});
