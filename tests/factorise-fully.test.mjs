// ============================================================================
// "FACTORISE FULLY" MEANS NOTHING COMMON IS LEFT IN THE BRACKET (feedback F6)
//
// About a third of G8_FACTORIZE_COMMON keys were not fully factorised:
// "-24x - 12" expected 6(-4x - 2), the right -12(2x + 1) was marked wrong, and
// the worked example said the HCF of -18 and 36 is 6. The quality gate's
// identity check only proves the two sides are equal, so it never saw it.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';

const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));

test('every factorise-fully key has a coprime bracket and is accepted', () => {
  for (let i = 0; i < 400; i++) {
    const p = generateProblem('G8_FACTORIZE_COMMON');
    const m = p.answer.replace(/\s+/g, '').match(/^(-?\d+)\((-?\d*)x([+-]\d+)\)$/);
    assert.ok(m, `unexpected key ${p.answer}`);
    const b = m[2] === '' ? 1 : m[2] === '-' ? -1 : Number(m[2]);
    assert.equal(gcd(b, Number(m[3])), 1, `${p.question} -> ${p.answer} leaves a common factor`);
    assert.ok(checkAnswerMatch(p.answer, p));
    // The HCF the help states is the real one.
    const A = Number(p.question.replace(/\s+/g, '').match(/^Factorise:(-?\d*)x/)[1] || 1);
    const C = Number(p.question.replace(/\s+/g, '').match(/x([+-]\d+)$/)[1]);
    assert.match(p.solution.steps[0].text, new RegExp(`is ${gcd(A, C)}\\b`));
  }
});

test('the factor with the minus inside the bracket is accepted too', () => {
  for (let i = 0; i < 100; i++) {
    const p = generateProblem('G8_FACTORIZE_COMMON');
    const m = p.answer.replace(/\s+/g, '').match(/^-(\d+)\((\d*)x([+-]\d+)\)$/);
    if (!m) continue;
    const inside = `${m[1]}(-${m[2]}x${m[3].startsWith('-') ? '+' + m[3].slice(1) : '-' + m[3].slice(1)})`;
    assert.ok(checkAnswerMatch(inside, p), `${inside} for ${p.answer}`);
  }
});
