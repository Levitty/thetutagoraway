// Feedback F26, the class of fault: a question that asks how much MORE, how
// much change, the profit or the difference never has a key of zero or below.
// Hire purchase cheaper than cash and "pay 70 for a 70-shilling pencil" both
// came from numbers drawn without regard to each other.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const ASKS_A_GAP = /how (much|many) (more|less|fewer|longer|shorter|heavier|lighter|older|younger|further|farther|taller|extra|cheaper|dearer)|\bprofit\b|\bchange do you\b|\bdifference\b/i;
// Integer and temperature work asks for signed differences on purpose.
const SIGNED_ON_PURPOSE = /negative|temperature|integer|°|below zero/i;

test('comparison questions in every skill have a positive key', () => {
  let seen = 0;
  const bad = [];
  for (const id of Object.keys(SKILLS)) {
    for (let k = 0; k < 30; k++) {
      let p;
      try { p = generateProblem(id); } catch { continue; }
      const q = String(p.question || '');
      if (!ASKS_A_GAP.test(q) || SIGNED_ON_PURPOSE.test(q)) continue;
      const n = Number(String(p.answer).replace(/,/g, '').replace(/^KSh\s*/i, ''));
      if (!Number.isFinite(n)) continue;
      seen++;
      if (n <= 0) bad.push(`${id}: ${q} => ${p.answer}`);
    }
  }
  assert.ok(seen > 200, `only ${seen} comparison questions drawn`);
  assert.deepEqual(bad.slice(0, 5), []);
});
