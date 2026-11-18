// Kiswahili Grade 5, the depth layer (18 Nov 2026): every strand. scripts/build-kiswahili-grade.mjs 5 merges it.
import * as kusiki from './kusiki.mjs';
import * as kusoma from './kusoma.mjs';
import * as kuandi from './kuandi.mjs';
import * as sarufi from './sarufi.mjs';
const parts = [kusiki, kusoma, kuandi, sarufi];
export const NEW = parts.flatMap(x => x.NEW);
export const ADD = parts.flatMap(x => x.ADD);
export const NOTES = {};
