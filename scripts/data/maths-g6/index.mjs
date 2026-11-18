// The Grade 6 Maths depth pass (18 Nov 2026), one file per sub-strand: more prerequisites, more misconceptions and the
// teaching pack, merged by scripts/build-maths-g6.mjs on top of scripts/data/maths-g6-*.mjs. Add a file here when a sub-strand is done.
// Each file exports { key, pre, mis, pack, packNotes }:
//   pre    { SKILL: [[ref, strength, reason], ...] }  extra prerequisites ('G5:SUB.SKILL' or 'G6:SUB.SKILL')
//   mis    more misconceptions (mi from ../maths-g6-lib.mjs)
//   pack   { SKILL: pk(...) }  the teaching pack entry, covering every misconception of the skill
import * as whole from './whole-numbers.mjs';
import * as mult from './multiplication.mjs';
import * as div from './division.mjs';
import * as ineq from './inequalities.mjs';
import * as frac from './fractions.mjs';
import * as dec from './decimals.mjs';
import * as length from './length.mjs';
import * as area from './area.mjs';
import * as cap from './capacity.mjs';
import * as mass from './mass.mjs';
import * as time from './time.mjs';
export const DEPTH = [whole, mult, div, ineq, frac, dec, length, area, cap, mass, time];
