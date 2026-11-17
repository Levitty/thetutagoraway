#!/usr/bin/env node
// Merge a re-run of some scenarios (for example ones the judge could not score) into a base run's folder, then rebuild
// that run's SUMMARY.md (and the patterns paragraph) from scores.json. Costs one patterns call (about US$0.1).
//   node scripts/evals/merge-runs.mjs <base run folder name> <re-run folder name> [--cap 10]
import { readFileSync, writeFileSync, readdirSync, copyFileSync } from 'node:fs';
import { Budget, RUNS_DIR } from './api.mjs';
import { SCENARIOS } from './scenarios.mjs';
import { summaryOf, patterns, JUDGE_MODEL } from './report.mjs';

const [base, extra] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const capI = process.argv.indexOf('--cap');
const budget = new Budget(capI >= 0 ? Number(process.argv[capI + 1]) : 10);
const A = `${RUNS_DIR}/${base}`; const B = `${RUNS_DIR}/${extra}`;
const a = JSON.parse(readFileSync(`${A}/scores.json`, 'utf8'));
const b = JSON.parse(readFileSync(`${B}/scores.json`, 'utf8'));
const byN = new Map(a.map((x) => [x.scenario, x]));
const replaced = [];
for (const x of b) if (x.score && !x.score.error) { byN.set(x.scenario, x); replaced.push(x.scenario); }

// The re-run's transcripts replace the base run's for those scenarios.
for (const n of replaced) {
  const pre = String(n).padStart(2, '0');
  const find = (dir) => readdirSync(dir).find((f) => f.startsWith(`${pre}-`) && f.endsWith('.md'));
  const fb = find(B); const fa = find(A);
  if (fb && fa) copyFileSync(`${B}/${fb}`, `${A}/${fa}`);
}

const merged = [...byN.values()].sort((x, y) => x.scenario - y.scenario);
writeFileSync(`${A}/scores.json`, JSON.stringify(merged, null, 2));
const rows = merged.map((x) => ({
  sc: SCENARIOS.find((s) => s.n === x.scenario), score: x.score,
  result: { cost: x.tutor_cost, turns: Array.from({ length: x.turns }, () => ({ latencyMs: 0, marked: null, guard: [] })), stopReason: x.stop },
  childCost: x.child_cost,
}));
let patternsText = '';
try { patternsText = await patterns(budget, rows, JUDGE_MODEL); } catch (e) { patternsText = `(patterns call failed: ${String(e.message).slice(0, 100)})`; }
let text = summaryOf({
  runName: `${base} (scenarios ${replaced.join(', ')} re-run in ${extra})`, rows, budget, patternsText, args: { maxTurnsLabel: '12 (scenario 30: 24)' },
  extra: [`Scenarios ${replaced.join(', ')} could not be scored in the first pass (the judge's reply was cut off); they were played again in run ${extra} and replace the first-pass transcripts here.`],
});

// App-side marks and spend come from the base summary and the re-run's results, not from the stubs above.
const old = readFileSync(`${A}/SUMMARY.md`, 'utf8');
const m = /App-side marks: (\d+) child answers marked wrong by the seal; (\d+) turns stopped/.exec(old);
let wrong = m ? Number(m[1]) : 0; let leaks = m ? Number(m[2]) : 0;
for (const n of replaced) {
  const r = JSON.parse(readFileSync(`${B}/results/${String(n).padStart(2, '0')}.json`, 'utf8'));
  wrong += r.turns.filter((t) => t.marked && !t.marked.correct).length;
  leaks += r.turns.filter((t) => t.guard.includes('answer-leak')).length;
}
text = text.replace(/App-side marks:.*\n/, `App-side marks (the re-run scenarios added to the first pass's count): ${wrong} child answers marked wrong by the seal; ${leaks} turns stopped by the answer-leak check ("Sorry, I lost my words").\n`);
text = text.replace(/This run: \$.*\n/, `Project total so far, from the ledger (all runs, dry checks and re-runs included), against the cap of US$${budget.cap}: US$${budget.spent.toFixed(3)}.\n`);
text = text.replace(/Tutor turn time.*\n\n?/, '');
writeFileSync(`${A}/SUMMARY.md`, text);
console.log(`merged ${replaced.join(', ')} into ${base}; ledger US$${budget.spent.toFixed(3)}`);
