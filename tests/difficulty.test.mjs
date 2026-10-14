// ============================================================================
// DIFFICULTY MUST MATCH THE LABEL
//
// The fault this pins down: G5_MULTIPLICATION was named
// "Multiplication (3-digit × 2-digit)" and generated `44 × 5`; G5_DIVISION was
// named "Division (3-digit by 2-digit)" and generated `80 ÷ 8` — easier than
// Grade 4's own `477 ÷ 9`. Nothing failed. A learner answered a Grade 3
// question, was credited with the Grade 5 skill, and was placed too high, so
// the diagnostic measured the wrong thing in the direction that hurts most.
//
// Two properties are asserted, and the second is the one that would have
// caught it without anybody noticing the label:
//
//   1. A skill whose NAME promises a digit band must generate that band, and
//      must not exceed it. The claim is read off SKILLS[id].name, so renaming
//      a skill moves the goalposts with it and the test cannot rot.
//   2. Per operation, difficulty must not go backwards up the grades: each
//      grade's hardest question is strictly harder than the grade below's
//      hardest, and its easiest is no easier than the grade below's easiest.
//
// Both read the `band` descriptor that every arithmetic builder attaches
// ({ op, a, b, q? } — the operands actually rendered). A third check guards
// `band` itself against drifting away from the question the child is shown.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const DRAWS = 400;        // KP ladders cycle, so every rung has to be sampled

const digits = (n) => String(Math.abs(n)).length;

// How much work one problem is. Digit counts alone are too coarse at the
// bottom of the school (×10 would read as "harder" than ×7), so magnitude is
// used: the biggest number handled for add/sub, the product for
// multiplication, and dividend × divisor for division — which is what makes
// a 2-digit divisor count for more than a 1-digit one.
const weight = (band) => {
  const { op, a, b } = band;
  if (op === 'mul') return Math.abs(a * b);
  if (op === 'div') return Math.abs(a * b);
  return Math.max(Math.abs(a), Math.abs(b));
};

// ---- sample every skill that declares a band ------------------------------
const sampled = new Map();   // id -> { grade, name, op, bands[] }
for (const id of Object.keys(SKILLS)) {
  const bands = [];
  for (let i = 0; i < DRAWS; i++) {
    let p;
    try { p = generateProblem(id); } catch { continue; }
    if (!p || p.placeholder || !p.band) continue;
    bands.push({ ...p.band, question: p.question });
  }
  if (bands.length) {
    sampled.set(id, { grade: SKILLS[id].grade, name: SKILLS[id].name, op: bands[0].op, bands });
  }
}

test('the arithmetic skills still report a difficulty band', () => {
  // Guards against the whole suite quietly passing because `band` was dropped
  // from the builders — every assertion below is vacuous without it.
  const missing = ['G4_ADD', 'G4_SUB', 'G4_MULTIPLY', 'G4_DIVIDE',
                   'G5_ADDITION', 'G5_SUBTRACTION', 'G5_MULTIPLICATION', 'G5_DIVISION']
    .filter(id => !sampled.has(id));
  assert.deepEqual(missing, [], `these skills generated no \`band\` descriptor: ${missing.join(', ')}`);
});

// ---- 1. the name's promise ------------------------------------------------
// "3-digit × 2-digit" / "3-digit by 2-digit"  → both sides claimed
// "up to 6 digits"                            → one side, a ceiling to reach
// "(2-digit)"                                 → one side, exactly that band
const claimOf = (name) => {
  const two = name.match(/(\d)-digit\s*(?:×|x|by)\s*(\d)-digit/i);
  if (two) return { kind: 'pair', big: +two[1], small: +two[2] };
  const upTo = name.match(/up to (\d+)\s*digits?/i);
  if (upTo) return { kind: 'max', big: +upTo[1] };
  const one = name.match(/\((\d)-digit\)/i);
  if (one) return { kind: 'max', big: +one[1] };
  return null;
};

test('a skill that promises a digit band in its name generates that band', () => {
  const claimed = [...sampled].filter(([, s]) => claimOf(s.name));
  // If the names stop claiming digits this test has nothing left to check,
  // which is a silent pass worth failing on.
  assert.ok(claimed.length >= 8, `only ${claimed.length} skill names declare a digit band — did the names change?`);

  const faults = [];
  for (const [id, s] of claimed) {
    const claim = claimOf(s.name);
    // Division is directional (a 3-digit dividend over a 2-digit divisor is
    // not the same question the other way round); for + − × the two operands
    // are interchangeable, so the larger one carries the claim.
    const sides = s.bands.map(b => s.op === 'div'
      ? [digits(b.a), digits(b.b)]
      : [Math.max(digits(b.a), digits(b.b)), Math.min(digits(b.a), digits(b.b))]);

    const over = sides.filter(([big, small]) =>
      big > claim.big || (claim.kind === 'pair' && small > claim.small));
    if (over.length) {
      faults.push(`${id} "${s.name}" exceeds its own label: generated ${over[0][0]}-digit by ${over[0][1]}-digit (${over.length}/${sides.length} draws)`);
    }

    const reaches = claim.kind === 'pair'
      ? sides.some(([big, small]) => big === claim.big && small === claim.small)
      : sides.some(([big]) => big === claim.big);
    if (!reaches) {
      const best = sides.reduce((m, x) => (x[0] > m[0] ? x : m), [0, 0]);
      faults.push(`${id} "${s.name}" never reaches its own label: hardest of ${sides.length} draws was ${best[0]}-digit by ${best[1]}-digit`);
    }
  }
  assert.deepEqual(faults, [], `\n  ${faults.join('\n  ')}\n`);
});

// ---- 2. a grade is never easier than the grade below ----------------------
test('arithmetic difficulty does not go backwards up the grades', () => {
  // op -> grade -> { min, max, ids }
  const byOp = new Map();
  for (const [id, s] of sampled) {
    if (!Number.isFinite(s.grade)) continue;
    const grades = byOp.get(s.op) || byOp.set(s.op, new Map()).get(s.op);
    const cur = grades.get(s.grade) || { min: Infinity, max: 0, ids: new Set() };
    for (const b of s.bands) {
      cur.min = Math.min(cur.min, weight(b));
      cur.max = Math.max(cur.max, weight(b));
    }
    cur.ids.add(id);
    grades.set(s.grade, cur);
  }

  const faults = [];
  for (const [op, grades] of byOp) {
    const ordered = [...grades.keys()].sort((a, b) => a - b);
    for (let i = 1; i < ordered.length; i++) {
      const lo = grades.get(ordered[i - 1]), hi = grades.get(ordered[i]);
      const where = `${op}: Grade ${ordered[i]} (${[...hi.ids].join(', ')}) vs Grade ${ordered[i - 1]} (${[...lo.ids].join(', ')})`;
      // The ceiling must rise: the harder grade must offer work the easier one
      // never does. A tie here is what "3-digit × 2-digit" generating `44 × 5`
      // looked like from the outside.
      if (!(hi.max > lo.max)) {
        faults.push(`${where} — hardest question is no harder (${hi.max} vs ${lo.max})`);
      }
      // And the floor must not drop: the easiest question at the higher grade
      // must not be easier than the easiest at the lower one.
      if (!(hi.min >= lo.min)) {
        faults.push(`${where} — easiest question is EASIER (${hi.min} vs ${lo.min})`);
      }
    }
  }
  assert.deepEqual(faults, [], `\n  ${faults.join('\n  ')}\n`);
});

// ---- 3. the band must describe the question the child actually sees -------
test('the declared band matches the operands in the question', () => {
  const faults = [];
  for (const [id, s] of sampled) {
    for (const b of s.bands) {
      // Only the bare "a op b = ?" form can be checked this way; the Kenyan
      // word problems carry the same numbers in prose.
      const m = String(b.question).match(/^(\d+)\s*([+−–\-×x÷\/])\s*(\d+)\s*=\s*\?$/);
      if (!m) continue;
      const [, lhs, sign, rhs] = m;
      // A multiplication taught as repeated addition renders as "5 + 5 = ?"
      // while its band correctly reads 5 × 2 — the shapes simply differ, so
      // only matching operators can be cross-checked.
      const shown = { '+': 'add', '−': 'sub', '–': 'sub', '-': 'sub',
                      '×': 'mul', 'x': 'mul', '÷': 'div', '/': 'div' }[sign];
      if (shown !== b.op) continue;
      if (+lhs !== b.a || +rhs !== b.b) {
        faults.push(`${id}: question "${b.question}" but band says ${b.a} / ${b.b}`);
      }
    }
  }
  assert.deepEqual(faults.slice(0, 5), [], `\n  ${faults.join('\n  ')}\n`);
});
