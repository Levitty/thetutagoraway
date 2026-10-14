// ============================================================================
// EVERY PICTURE THE CONTENT ASKS FOR MUST BE DRAWABLE
//
// Authored content carries `model: { type, data }` — a fraction bar, a number
// line jump, a column sum with its carries. For two months this branch had no
// component to draw any of it, so the field was inert and nobody noticed: the
// questions still worked as text.
//
// That is the failure this test exists for. A model type the renderer does not
// know fails silently — the picture simply does not appear, and the learner
// gets a question that was written assuming they could see one.
//
// TeachingVisual.jsx is JSX, which node:test cannot import, so the renderer's
// list of types is read from the source. The export it reads is the same one
// the component dispatches on, so the two cannot disagree.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const src = readFileSync(new URL('../src/ai-tutor/TeachingVisual.jsx', import.meta.url), 'utf8');
const mapBody = src.slice(src.indexOf('const MODELS = {'), src.indexOf('export const TEACHING_MODEL_TYPES'));
const DRAWABLE = new Set([...mapBody.matchAll(/^\s*'?([a-z][a-z-]*)'?\s*:/gm)].map(m => m[1]));

// Walk a problem and collect every model type it asks for: the problem's own,
// and any attached to a worked-example step.
const modelTypesIn = (p) => {
  const out = [];
  const visit = (o) => {
    if (!o || typeof o !== 'object') return;
    if (o.model?.type) out.push(o.model.type);
    if (Array.isArray(o)) o.forEach(visit);
    else for (const v of Object.values(o)) if (v && typeof v === 'object') visit(v);
  };
  visit(p);
  return out;
};

test('the renderer knows at least the models the content uses', () => {
  assert.ok(DRAWABLE.size >= 10, `expected a full model map, parsed ${DRAWABLE.size}`);
  for (const t of ['bar-model', 'numberline-jump', 'column-op', 'place-value']) {
    assert.ok(DRAWABLE.has(t), `${t} is used by the content but the renderer has no case for it`);
  }
});

test('no authored skill asks for a picture that cannot be drawn', () => {
  const missing = new Map();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < 6; i++) {
      let p;
      try { p = generateProblem(id); } catch { break; }
      if (!p) break;
      for (const t of modelTypesIn(p)) {
        if (!DRAWABLE.has(t)) {
          if (!missing.has(t)) missing.set(t, new Set());
          missing.get(t).add(id);
        }
      }
    }
  }
  const report = [...missing.entries()].map(([t, ids]) => `${t} (asked for by ${[...ids].slice(0, 4).join(', ')})`);
  assert.deepEqual(report, [], `model types with no renderer:\n  ${report.join('\n  ')}`);
});

// Fields without which the component draws NOTHING — an empty bordered box.
//
// These were not read off the source and guessed at: each model type was
// rendered with react-dom/server once intact and then once per field with that
// field removed, and a field is listed here only if removing it collapsed the
// picture to the bare wrapper. The remaining types (numberline-jump,
// formula-triangle, numberline-interval) have defaults for everything and still
// draw, so they are deliberately absent rather than forgotten.
//
// This is the check that the "empty data" test below cannot make: a model can
// carry plenty of data and still draw nothing, if the data is the WRONG SHAPE.
const REQUIRED_FIELDS = {
  'bar-model': ['bars'],
  'column-op': ['a', 'b'],
  'place-value': ['numbers'],
  'shape': ['kind'],
  'fraction-grid': ['rows', 'cols'],
};

test('every model carries the fields its picture is actually drawn from', () => {
  const bad = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < 6; i++) {
      let p;
      try { p = generateProblem(id); } catch { break; }
      if (!p) break;
      const visit = (o) => {
        if (!o || typeof o !== 'object') return;
        const m = o.model;
        if (m?.type && REQUIRED_FIELDS[m.type]) {
          for (const f of REQUIRED_FIELDS[m.type]) {
            const v = m.data?.[f];
            if (v == null || (Array.isArray(v) && v.length === 0)) {
              bad.add(`${id}: ${m.type} is missing "${f}" — it would draw an empty box`);
            }
          }
        }
        if (Array.isArray(o)) o.forEach(visit);
        else for (const v of Object.values(o)) if (v && typeof v === 'object') visit(v);
      };
      visit(p);
    }
  }
  assert.deepEqual([...bad], [], `\n  ${[...bad].join('\n  ')}\n`);
});

test('the required-field map only names models the renderer has', () => {
  // So a type renamed in TeachingVisual.jsx cannot leave a rule here guarding
  // a model that no longer exists.
  const stale = Object.keys(REQUIRED_FIELDS).filter(t => !DRAWABLE.has(t));
  assert.deepEqual(stale, [], `no renderer for: ${stale.join(', ')}`);
});

test('a model always carries the data its picture needs', () => {
  // A model with no data draws an empty box, which is worse than no picture at
  // all: it reads as a missing image rather than as text that stands alone.
  const empty = [];
  for (const id of Object.keys(SKILLS)) {
    let p;
    try { p = generateProblem(id); } catch { continue; }
    if (!p) continue;
    const visit = (o) => {
      if (!o || typeof o !== 'object') return;
      if (o.model?.type && (o.model.data == null || Object.keys(o.model.data).length === 0)) empty.push(`${id}: ${o.model.type}`);
      if (Array.isArray(o)) o.forEach(visit);
      else for (const v of Object.values(o)) if (v && typeof v === 'object') visit(v);
    };
    visit(p);
  }
  assert.deepEqual([...new Set(empty)], [], 'these models would draw an empty box');
});
