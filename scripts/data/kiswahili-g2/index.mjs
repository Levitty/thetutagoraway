// Kiswahili Grade 2 (18 Nov 2026): the file had KICD outcomes only; every skill comes from here. scripts/build-kiswahili-grade.mjs 2.
import * as kusiki from './kusiki.mjs';
import * as kusoma from './kusoma.mjs';
import * as kuandi from './kuandi.mjs';
import * as sarufi from './sarufi.mjs';
const parts = [kusiki, kusoma, kuandi, sarufi];
export const NEW = parts.flatMap(x => x.NEW);
export const ADD = parts.flatMap(x => x.ADD);
export const NOTES = {};
