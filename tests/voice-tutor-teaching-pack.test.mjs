// ============================================================================
// THE TUTOR'S TEACHING PACK IS DATA THE CURRICULUM MAP CAN VOUCH FOR
//
// Research round 3 (13 Nov 2026) turned the Grade 5 maths teaching knowledge into
// structured data per skill (curriculum/mathematics/teaching/g5/*.json). These
// free, offline tests lock what makes it safe to load later:
//   - every entry has the shape the loader and the doc expect;
//   - every skill and misconception it names exists in the curriculum map, under
//     the right sub-strand and skill (no invented codes);
//   - fractions, the first strand, cover every skill and every library
//     misconception;
//   - each board drawing gives the child a turn and reveals only after it;
//   - the generated data file is up to date with the JSON;
//   - the example lessons (docs/tutor-training/EXEMPLARS*.md) contain no answer
//     giveaways by a simple check: no tutor line says the fraction the child is
//     about to give, no "the answer is", no verdict words, no long turns, no
//     funnel of more than three closed questions in a row.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { buildPack, loadLibrary, loadSources, renderData } from '../scripts/build-teaching-pack.mjs';
import { teachingFor, briefFor, packCoverage, misconceptionFor } from '../src/voice-tutor/teachingPack.js';

const { skills, misconceptions, lib } = loadLibrary();
const sources = loadSources();
const built = buildPack();
const BEATS = new Set(['draw', 'point', 'count', 'predict', 'pause', 'child_draws', 'reveal', 'write']);
const CHILD_BEATS = new Set(['pause', 'child_draws', 'count', 'predict']);

const entries = sources.flatMap((s) => s.skills.map((e) => ({ ...e, file: s.file, sub: s.sub_strand })));

test('every pack file names a real sub-strand and every entry has the full shape', () => {
  const subCodes = new Set(lib.sub_strands.map((s) => s.code));
  for (const src of sources) {
    assert.ok(subCodes.has(src.sub_strand), `${src.file}: unknown sub-strand ${src.sub_strand}`);
    assert.equal(typeof src.title, 'string');
    assert.match(src.status, /draft/i, `${src.file}: status must say draft until a teacher checks it`);
  }
  for (const e of entries) {
    const at = `${e.file} ${e.skill}`;
    assert.equal(typeof e.key_step, 'string', `${at}: key_step`);
    assert.ok(e.key_step.length > 20, `${at}: key_step too short`);
    assert.ok(e.floor && e.floor.prerequisite && e.floor.question && e.floor.answer, `${at}: floor check`);
    assert.ok(Array.isArray(e.steps) && e.steps.length >= 3, `${at}: at least 3 teaching steps`);
    assert.ok(Array.isArray(e.contexts) && e.contexts.length >= 2, `${at}: at least 2 Kenyan contexts`);
    assert.ok(Array.isArray(e.representations) && e.representations.length >= 2, `${at}: at least 2 representations`);
    assert.ok(Array.isArray(e.board) && e.board.length >= 3, `${at}: board beats`);
    for (const b of e.board) {
      assert.ok(BEATS.has(b.beat), `${at}: unknown beat ${b.beat}`);
      assert.equal(typeof b.do, 'string', `${at}: beat needs "do"`);
    }
    assert.ok(Array.isArray(e.misconceptions) && e.misconceptions.length >= 1, `${at}: at least one misconception`);
    for (const m of e.misconceptions) {
      assert.equal(typeof m.ask, 'string', `${at} ${m.code}: ask`);
      assert.equal(typeof m.repair, 'string', `${at} ${m.code}: repair`);
      assert.ok(Array.isArray(m.listen_for) && m.listen_for.length >= 1, `${at} ${m.code}: listen_for`);
    }
    assert.equal(e.checks.length, 2, `${at}: exactly two check questions`);
    for (const c of e.checks) assert.ok(c.question && c.answer && c.shows, `${at}: check needs question, answer, shows`);
  }
});

test('every skill and misconception the pack names exists in the curriculum map, in the right place', () => {
  const seen = new Set();
  for (const e of entries) {
    const s = skills.get(e.skill);
    assert.ok(s, `${e.file}: skill ${e.skill} is not in curriculum/mathematics/g5.json`);
    assert.equal(s.sub_strand, e.sub, `${e.skill} is filed under the wrong sub-strand`);
    assert.ok(!seen.has(e.skill), `${e.skill} appears twice`);
    seen.add(e.skill);
    for (const m of e.misconceptions) {
      const lm = misconceptions.get(m.code);
      assert.ok(lm, `${e.skill}: misconception ${m.code} is not in the library`);
      assert.equal(lm.skill, e.skill, `${m.code} belongs to ${lm.skill}, not ${e.skill}`);
    }
  }
});

test('every Grade 5 maths skill in the curriculum map has a pack entry', () => {
  for (const code of skills.keys()) if (code.startsWith('MATH.G5.')) assert.ok(teachingFor(code), `no pack entry for ${code}`);
});

test('fractions cover every skill and every library misconception', () => {
  const frac = lib.sub_strands.find((s) => s.code === 'MATH.G5.NUMBER.FRACTIONS');
  for (const s of frac.skills) assert.ok(teachingFor(s.code), `no pack entry for ${s.code}`);
  const packed = new Set(entries.flatMap((e) => e.misconceptions.map((m) => m.code)));
  for (const m of frac.misconceptions) assert.ok(packed.has(m.code), `fraction misconception ${m.code} has no reveal question and repair`);
});

test('each board drawing gives the child a turn, and any reveal comes after it', () => {
  for (const e of entries) {
    const firstChild = e.board.findIndex((b) => CHILD_BEATS.has(b.beat));
    assert.ok(firstChild >= 0, `${e.skill}: the board never hands a turn to the child`);
    const reveal = e.board.findIndex((b) => b.beat === 'reveal');
    if (reveal >= 0) assert.ok(reveal > firstChild, `${e.skill}: reveal comes before the child's turn`);
  }
});

test('the check answers are never spoken by the board', () => {
  for (const e of entries) {
    const said = e.board.map((b) => (b.say || '').toLowerCase()).join(' ');
    for (const c of e.checks) {
      const a = c.answer.split(/[;(]/)[0].trim().toLowerCase();
      if (a.length >= 3) assert.ok(!said.includes(a), `${e.skill}: board says the check answer "${a}"`);
    }
  }
});

test('the generated data file matches the JSON (run node scripts/build-teaching-pack.mjs)', () => {
  const onDisk = readFileSync(new URL('../src/voice-tutor/teachingPackData.js', import.meta.url), 'utf8');
  assert.equal(onDisk, renderData(built), 'teachingPackData.js is stale');
});

test('the loader returns entries enriched from the library, and briefs seal the answers', () => {
  const code = 'MATH.G5.NUMBER.FRACTIONS.COMPARE_LIKE_FRACTIONS';
  const e = teachingFor(code);
  assert.equal(e.name, skills.get(code).name);
  const m = misconceptionFor(code, `${code}.M_COMPARE_BIGGER_DENOMINATOR`);
  assert.equal(m.error, misconceptions.get(m.code).error);
  const brief = briefFor(code, { stage: 'check' });
  assert.match(brief, /Key step/);
  assert.match(brief, /SEALED answer/);
  assert.equal(teachingFor('MATH.G5.NOT.A.SKILL'), null);
  assert.equal(briefFor('MATH.G5.NOT.A.SKILL'), '');
  const cov = packCoverage();
  assert.ok(cov.skills >= 9 && cov.misconceptions >= 23);
});

// ---------------------------------------------------------------------------
// The example lessons: a simple, free giveaway check.
// ---------------------------------------------------------------------------
const WORD = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const DEN = { half: 2, halves: 2, third: 3, thirds: 3, quarter: 4, quarters: 4, fourth: 4, fourths: 4, fifth: 5, fifths: 5, sixth: 6, sixths: 6, seventh: 7, sevenths: 7, eighth: 8, eighths: 8, ninth: 9, ninths: 9, tenth: 10, tenths: 10, twelfth: 12, twelfths: 12 };

// Fractions said in a line, normalised to "a/b": "3/4", "three quarters", "a half", "one eighth".
export function fractionsIn(line) {
  const out = new Set();
  for (const m of line.matchAll(/\b(\d{1,2})\s*\/\s*(\d{1,2})\b/g)) out.add(`${+m[1]}/${+m[2]}`);
  const words = line.toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/[\s-]+/);
  for (let i = 0; i < words.length; i += 1) {
    const d = DEN[words[i]];
    if (!d) continue;
    const prev = words[i - 1];
    if (WORD[prev]) out.add(`${WORD[prev]}/${d}`);
    else if (prev === 'a' || prev === 'one') out.add(`1/${d}`);
  }
  return out;
}

const CLOSED = /^(is|are|do|does|did|can|could|will|was|were|has|have)\b/i;
const VERDICT = /\b(wrong|not quite|almost|incorrect)\b/i;
const TELLS = /\b(the answer is|the correct answer|it'?s actually|the right answer is)\b/i;

export function checkStretch(lines) {
  const problems = [];
  let sinceChild = [];
  let closedRun = 0;
  for (const raw of lines) {
    const tutor = raw.match(/^Tutor:\s*(.*)$/);
    const child = raw.match(/^Child(?:\s*\([^)]*\))?:\s*(.*)$/);
    if (tutor) {
      const spoken = tutor[1].replace(/\([^)]*\)/g, ' ').replace(/\[[^\]]*\]/g, ' ').trim();
      const words = spoken.split(/\s+/).filter(Boolean).length;
      if (words > 40) problems.push(`tutor turn over 40 words: "${spoken.slice(0, 60)}..."`);
      if (VERDICT.test(spoken)) problems.push(`verdict word: "${spoken}"`);
      if (TELLS.test(spoken)) problems.push(`tells the answer: "${spoken}"`);
      const qs = spoken.split(/(?<=[.?!])\s+/).filter((s) => s.endsWith('?'));
      for (const q of qs) closedRun = CLOSED.test(q) ? closedRun + 1 : 0;
      if (closedRun > 3) problems.push(`funnel: more than three closed questions in a row at "${spoken}"`);
      // A choice the tutor offers ("1/4 or 1/8?") is not a giveaway: the child still decides.
      sinceChild.push(spoken.split(/(?<=[.?!])\s+/).filter((s) => !(s.endsWith('?') && /\bor\b/i.test(s) && fractionsIn(s).size >= 2)).join(' '));
    } else if (child) {
      const said = fractionsIn(child[1]);
      const before = new Set(sinceChild.flatMap((t) => [...fractionsIn(t)]));
      for (const f of said) if (before.has(f)) problems.push(`tutor said ${f} just before the child gave it: "${sinceChild.join(' | ')}"`);
      sinceChild = [];
    }
  }
  return problems;
}

function stretchesOf(md) {
  return md.split(/^## /m).slice(1).map((s) => ({ title: s.split('\n')[0], lines: s.split('\n').map((l) => l.trim()) }));
}

test('the giveaway check catches what it should (self-test)', () => {
  assert.deepEqual([...fractionsIn('Is it three quarters or 2/4? A half.')].sort(), ['1/2', '2/4', '3/4']);
  assert.equal(checkStretch(['Tutor: Is it 3/4?', 'Child: 3/4.']).length, 1);
  assert.equal(checkStretch(['Tutor: What fraction is shaded?', 'Child: Three quarters.']).length, 0);
  assert.equal(checkStretch(['Tutor: Which is more, 1/4 or 1/8?', 'Child: One quarter.']).length, 0);
  assert.equal(checkStretch(['Tutor: Two out of four makes two quarters. Say it.', 'Child: Two quarters.']).length, 1);
  assert.equal(checkStretch(['Tutor: No, that is wrong.']).length, 1);
  assert.equal(checkStretch(['Tutor: The answer is five.']).length, 1);
  assert.equal(checkStretch(['Tutor: Is it red? Is it big? Is it round? Is it flat?']).length, 1);
});

test('the example lessons contain no giveaways by the simple check', () => {
  const dir = new URL('../docs/tutor-training/', import.meta.url);
  const files = readdirSync(dir).filter((f) => /^EXEMPLARS.*\.md$/.test(f));
  assert.ok(files.length >= 1);
  const round3 = 'EXEMPLARS_ROUND3_DRAFT.md';
  assert.ok(existsSync(new URL(round3, dir)), 'round 3 exemplars are in docs/tutor-training');
  const all = [];
  for (const f of files) {
    for (const s of stretchesOf(readFileSync(new URL(f, dir), 'utf8'))) {
      for (const p of checkStretch(s.lines)) all.push(`${f} / ${s.title}: ${p}`);
    }
  }
  // Round 3 must be clean. Older files are reported so the next round can fix them, but do not fail the build.
  const r3 = all.filter((p) => p.startsWith(round3));
  assert.deepEqual(r3, [], r3.join('\n'));
  if (all.length) console.log(`older exemplars, flagged for the next round (${all.length}):\n${all.join('\n')}`);
});

// ---------------------------------------------------------------------------
// Round 3 test situations (written, not run): every code they name is real.
// ---------------------------------------------------------------------------
test('round 3 scenarios name real skills, real misconceptions of that skill, and real round 3 moves', async () => {
  const { SCENARIOS_ROUND3, PRIORITY_ROUND3 } = await import('../scripts/evals/scenarios-round3.mjs');
  const playbook = readFileSync(new URL('../docs/tutor-training/PLAYBOOK_ROUND3_DRAFT.md', import.meta.url), 'utf8');
  const ns = SCENARIOS_ROUND3.map((s) => s.n);
  assert.deepEqual(ns, Array.from({ length: ns.length }, (_, i) => 42 + i), 'numbered 42 upwards with no gaps');
  for (const s of SCENARIOS_ROUND3) {
    assert.ok(skills.has(s.skill), `${s.n}: unknown skill ${s.skill}`);
    if (s.misconception) {
      const m = misconceptions.get(s.misconception);
      assert.ok(m, `${s.n}: unknown misconception ${s.misconception}`);
      assert.equal(m.skill, s.skill, `${s.n}: misconception belongs to another skill`);
    }
    for (const mv of s.moves) assert.ok(playbook.includes(`### ${mv}.`), `${s.n}: move ${mv} is not in the round 3 playbook`);
    assert.ok(['scaffold', 'rigour', 'both'].includes(s.tag), `${s.n}: tag`);
    assert.ok(s.expect.length > 40 && s.child.length > 40, `${s.n}: expect and child are written out`);
    if (!s.skill.startsWith('MATH.G5.NUMBER.FRACTIONS.')) assert.ok(s.waits, `${s.n}: non-fraction situations wait for the tutor to open other skills`);
  }
  for (const n of PRIORITY_ROUND3) assert.ok(ns.includes(n), `priority ${n} exists`);
});
