// ============================================================================
// THE FIGURES' RULE BOOK (rendering engine phase 2, 12 Nov 2026). Rebuilt from
// the sketch branch (horeb/2026-11-11-render-engine, src/render/spec.js) onto
// the stroke engine.
//
// The model never writes code, markup or coordinates. It asks for a figure by
// TYPE and fills in that type's PARAMETERS, names which parts the child may
// handle (CONTROLS) and, if it wants, a GOAL the app marks itself. Every type
// declares its parameters with kinds and ranges; checkParams() is the only way
// parameters reach a drawing, on the server (before the reply leaves) and again
// in the browser (before anything is drawn). A request that fails is refused
// whole, never "repaired".
//
// Parameter kinds:
//   int  { min, max }            a whole number in range
//   num  { min, max, step? }     a number in range (rounded to step when given)
//   enum { values }              one of a fixed list
//   bool                         true or false
//   text { max }                 plain words (letters, digits, ordinary punctuation)
//   list { of, min?, max }       a list of one kind
//   obj  { fields, nullable? }   a small record of named kinds (null allowed when nullable)
// Every parameter has a `default`, used when the request leaves it out.
// Pure: no React, no DOM, no clock. Tested in tests/draw-figures.test.mjs.
// ============================================================================

const WORDS = /^[A-Za-z0-9 .,;:!?'"()\-+=<>/%×÷−_]*$/;

export class Refused extends Error {}
export const refuse = (msg) => { throw new Refused(msg); };

export const roundTo = (v, step) => Math.round(Math.round(v / step) * step * 1e6) / 1e6;
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

/** One value against one parameter's kind. Returns the clean value or throws Refused. */
export function checkValue(spec, v, name) {
  if (v === null && spec.nullable) return null;
  switch (spec.kind) {
    case 'int':
      if (!Number.isInteger(v)) refuse(`${name}: not a whole number`);
      if (v < spec.min || v > spec.max) refuse(`${name}: ${v} is outside ${spec.min} to ${spec.max}`);
      return v;
    case 'num': {
      if (typeof v !== 'number' || !Number.isFinite(v)) refuse(`${name}: not a number`);
      if (v < spec.min || v > spec.max) refuse(`${name}: ${v} is outside ${spec.min} to ${spec.max}`);
      return spec.step ? roundTo(v, spec.step) : roundTo(v, 1e-6);
    }
    case 'enum':
      if (!spec.values.includes(v)) refuse(`${name}: ${String(v).slice(0, 30)} is not one of ${spec.values.join(', ')}`);
      return v;
    case 'bool':
      if (typeof v !== 'boolean') refuse(`${name}: not true or false`);
      return v;
    case 'text': {
      if (typeof v !== 'string') refuse(`${name}: not text`);
      const t = v.replace(/\s+/g, ' ').trim();
      if (t.length > spec.max) refuse(`${name}: longer than ${spec.max}`);
      if (!WORDS.test(t)) refuse(`${name}: characters the board cannot write`);
      return t;
    }
    case 'list': {
      if (!Array.isArray(v)) refuse(`${name}: not a list`);
      if (v.length < (spec.min ?? 0) || v.length > spec.max) refuse(`${name}: ${v.length} items, allowed ${spec.min ?? 0} to ${spec.max}`);
      return v.map((x, i) => checkValue(spec.of, x, `${name}[${i}]`));
    }
    case 'obj': {
      if (!v || typeof v !== 'object' || Array.isArray(v)) refuse(`${name}: not a record`);
      for (const k of Object.keys(v)) if (!spec.fields[k]) refuse(`${name}: unknown field ${k.slice(0, 20)}`);
      const out = {};
      for (const [k, f] of Object.entries(spec.fields)) {
        if (v[k] === undefined || v[k] === null) {
          if (f.default === undefined) refuse(`${name}.${k}: missing`);
          out[k] = clone(f.default);
        } else out[k] = checkValue(f, v[k], `${name}.${k}`);
      }
      return out;
    }
    default: refuse(`${name}: unknown kind`);
  }
  return v;
}

/**
 * A type's parameters: every known one checked, unknown ones refused, missing ones defaulted.
 * Then the type's own rule across parameters (`rule(params)` returns a problem or null).
 */
export function checkParams(type, raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) refuse('params: not a record');
  for (const k of Object.keys(raw)) if (!type.params[k]) refuse(`unknown parameter ${k.slice(0, 30)}`);
  const out = {};
  for (const [k, spec] of Object.entries(type.params)) {
    out[k] = raw[k] === undefined || raw[k] === null ? clone(spec.default) : checkValue(spec, raw[k], k);
  }
  const problem = type.rule ? type.rule(out) : null;
  if (problem) refuse(problem);
  return out;
}

/** The parts a child may handle in this type, and the ones the request asked for (a subset, no repeats). */
export function checkControls(type, raw, params) {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) refuse('controls: not a list');
  const out = [];
  for (const c of raw) {
    if (!Object.keys(type.controls || {}).includes(c)) refuse(`controls: ${String(c).slice(0, 30)} is not something the child can do with ${type.type}`);
    const why = type.controls[c].needs?.(params);
    if (why) refuse(`controls: ${c}: ${why}`);
    if (!out.includes(c)) out.push(c);
  }
  return out;
}

/** A goal the app marks itself: one of the type's goal kinds with its own parameters. */
export function checkGoal(type, raw, params, controls) {
  if (raw === undefined || raw === null) return null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) refuse('goal: not a record');
  const g = (type.goals || {})[raw.kind];
  if (!g) refuse(`goal: ${String(raw.kind).slice(0, 30)} is not a goal of ${type.type}`);
  const may = [].concat(g.control || []);
  if (!may.some((c) => controls.includes(c))) refuse(`goal: ${raw.kind} needs the control ${may.join(' or ')}`);
  const { kind, ...rest } = raw;
  const clean = checkParams({ type: `${type.type} goal`, params: g.params, rule: g.rule ? (x) => g.rule(x, params) : null }, rest);
  return { kind, ...clean };
}

/** JSON text (as the model writes it) or a record (as a checked step carries it). */
export const recordOf = (v, name, max = 1500) => {
  if (v === undefined || v === null || v === '') return null;
  if (typeof v === 'string') {
    if (v.length > max) refuse(`${name}: too long`);
    try { return JSON.parse(v); } catch { refuse(`${name}: not valid JSON`); }
  }
  return v;
};

export default { checkParams, checkControls, checkGoal, checkValue, recordOf, Refused, roundTo };
