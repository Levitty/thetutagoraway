// Integrated Science Grade 7 against the curriculum map HOREB owns (curriculum/integrated_science/g7.json), to the Grade 5 Maths
// standard (depth pass, 18 Nov 2026): prerequisites reach Grade 4-6 Science and Technology and Mathematics, four misconceptions per
// skill, a teaching pack for every sub-strand. All draft until a CBC Integrated Science teacher reviews it.
import { scienceDepthTests } from './helpers/scienceDepth.mjs';

scienceDepthTests({ dir: 'integrated_science', subject: 'integratedscience', grade: 7, outcomes: 38, minDown: 0.6 });
