// KISWAHILI GRADE 6: skills, prerequisites and the misconception library (authoring source), in six parts.
// Written offline by Claude (13 Nov 2026), no model call. Everything is DRAFT until a native Kiswahili speaker who teaches
// Kiswahili reviews it. scripts/build-kiswahili-g6.mjs merges it into curriculum/kiswahili/g6.json (HOREB owns that file).
import * as A from './kiswahili-g6-a.mjs';
import * as B from './kiswahili-g6-b.mjs';
import * as C from './kiswahili-g6-c.mjs';
import * as D from './kiswahili-g6-d.mjs';
import * as E from './kiswahili-g6-e.mjs';
import * as F from './kiswahili-g6-f.mjs';
const parts = [A, B, C, D, E, F];
export const SKILLS = parts.flatMap(p => p.SKILLS);
export const MIS = parts.flatMap(p => p.MIS);
export const ALSO = Object.assign({}, ...parts.map(p => p.ALSO));
