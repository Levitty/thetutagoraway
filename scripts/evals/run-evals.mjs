#!/usr/bin/env node
// The tutor test set (step 4 of CONVERSATION_ENGINE_PLAN.md): 30 situations played through the real tutor code
// with the real model, a pretend child and a judge. Spends real money against a HARD CAP shared by all runs.
//   npm run eval:tutor -- --scenarios 30 --max-turns 12
//   npm run eval:tutor -- --scenarios all --cap 10
// Options: --scenarios all | 1,2,3   --max-turns N (default 12; scenario 30 gets 24)   --cap USD (total across all runs, default 10)
//          --concurrency N (default 3)   --judge MODEL   --no-judge   --no-patterns
import { mkdirSync, writeFileSync } from 'node:fs';
import { Budget, tutorModel, RUNS_DIR, CapReached } from './api.mjs';
import { SCENARIOS, ALL_ORDER } from './scenarios.mjs';
import { playLesson } from './sim.mjs';
import { transcriptOf, judge, patterns, summaryOf, JUDGE_MODEL, JUDGE_FALLBACK } from './report.mjs';
import { settingsFrom } from '../../src/voice-tutor/session.js';

const argv = process.argv.slice(2);
const opt = (name, d) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true) : d; };
const cap = Number(opt('cap', 10));
const concurrency = Math.max(1, Number(opt('concurrency', 3)));
const maxOpt = opt('max-turns', null);
const which = String(opt('scenarios', 'all'));
const list = which === 'all' ? ALL_ORDER : which.split(',').map(Number).filter((n) => SCENARIOS.some((s) => s.n === n));
const judgeModel = String(opt('judge', JUDGE_MODEL));
const maxTurnsFor = (sc) => (maxOpt ? Number(maxOpt) : sc.n === 30 ? 24 : 12);

const d = new Date(); const p2 = (n) => String(n).padStart(2, '0');
const runName = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}`;
const dir = `${RUNS_DIR}/${runName}`;
mkdirSync(dir, { recursive: true });

const budget = new Budget(cap);
const st = settingsFrom(() => undefined);
console.log(`run ${runName}: scenarios ${list.join(',')}; cap US$${cap}, already spent US$${budget.prior.toFixed(3)}; tutor ${st.model} at ${st.effort} effort`);
if (budget.remaining <= 0.1) { console.error('cap already reached'); process.exit(1); }
const callModel = tutorModel(budget);
const rows = []; const notes = [];
let stopAll = false;
const round = (v) => Math.round(v * 1e5) / 1e5;

// A scenario is only started when the remaining budget probably covers it (the average so far, with margin).
const estimateScenario = () => {
  const k = rows.filter((r) => r.result.cost > 0);
  return k.length ? (1.25 * k.reduce((a, r) => a + r.result.cost + r.childCost + (r.score?.cost || 0.05), 0)) / k.length : 0.5;
};

const writeScores = () => writeFileSync(`${dir}/scores.json`, JSON.stringify(rows.slice().sort((a, b) => a.sc.n - b.sc.n).map((x) => ({
  scenario: x.sc.n, title: x.sc.title, score: x.score, turns: x.result.turns.length, ended: x.result.ended, stop: x.result.stopReason,
  tutor_cost: round(x.result.cost), child_cost: round(x.childCost), judge_cost: round(x.score?.cost || 0), sim_seconds: x.result.simSeconds, wall_seconds: Math.round(x.result.wallMs / 1000),
  probes: x.result.turns.filter((t) => t.kind === 'probe').map((t) => ({ turn: t.n, kind: t.probe.kind, silent_s: t.probe.silent_s, at_clock_s: t.clockS })),
  guards: x.result.turns.flatMap((t) => t.guard.map((g) => ({ turn: t.n, guard: g }))), concerns: x.result.concerns, model_calls: x.result.modelCalls,
})), null, 2));

async function runOne(n) {
  const sc = SCENARIOS.find((s) => s.n === n);
  if (stopAll) return;
  if (budget.remaining < estimateScenario() + 0.1) { notes.push(`Scenario ${n} not run: the remaining budget (US$${budget.remaining.toFixed(2)}) would not cover it.`); stopAll = true; return; }
  const t = Date.now();
  let result;
  try { result = await playLesson({ sc, maxTurns: maxTurnsFor(sc), budget, callModel, onLog: (m) => console.log(`  [${n}] ${m}`) }); } catch (e) {
    console.error(`  [${n}] FAILED: ${String(e.message).slice(0, 300)}`);
    notes.push(`Scenario ${n} crashed in the harness or the tutor code: ${String(e.stack || e.message).slice(0, 500).replace(/\n/g, ' | ')}`);
    if (e instanceof CapReached) stopAll = true;
    return;
  }
  if (result.stopReason === 'cap') { stopAll = true; notes.push(`Scenario ${n} stopped by the cost cap after ${result.turns.length} turns.`); }
  const row = { sc, result, childCost: result.childCost || 0, score: null };
  rows.push(row);
  mkdirSync(`${dir}/results`, { recursive: true });
  writeFileSync(`${dir}/results/${String(n).padStart(2, '0')}.json`, JSON.stringify(result));
  writeFileSync(`${dir}/${String(n).padStart(2, '0')}-${sc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.md`, transcriptOf(sc, result));
  if (!opt('no-judge', false) && result.turns.length >= 2) {
    try { row.score = await judge(budget, sc, result, judgeModel); if (row.score.model !== judgeModel) notes.push(`Judge fell back to ${row.score.model}.`); } catch (e) {
      row.score = { error: String(e.message).slice(0, 200) };
      if (e instanceof CapReached) stopAll = true;
    }
  }
  const s = row.score;
  console.log(`scenario ${n} done in ${Math.round((Date.now() - t) / 1000)}s: ${result.turns.length} turns, ${s && !s.error ? `${s.pass ? 'PASS' : 'FAIL'} avg ${s.avg}` : 'not judged'}; spent so far US$${budget.spent.toFixed(3)} of ${cap}`);
  writeScores();
}

// A small worker pool: scenarios run `concurrency` at a time, in the priority order.
const queue = [...list];
await Promise.all(Array.from({ length: concurrency }, async () => { while (queue.length && !stopAll) await runOne(queue.shift()); }));
if (queue.length) notes.push(`Not run (cap): scenarios ${queue.join(', ')}.`);

let patternsText = '';
if (!opt('no-patterns', false) && rows.filter((r) => r.score && !r.score.error).length >= 3) {
  try { patternsText = await patterns(budget, rows, rows.some((r) => r.score?.model === JUDGE_FALLBACK) ? JUDGE_FALLBACK : judgeModel); } catch (e) { notes.push(`Patterns not written: ${String(e.message).slice(0, 120)}`); }
}
writeScores();
writeFileSync(`${dir}/SUMMARY.md`, summaryOf({ runName, rows, budget, extra: notes, patternsText, args: { maxTurnsLabel: maxOpt || '12 (scenario 30: 24)' } }));
console.log(`\nspent this run US$${budget.run.toFixed(3)}; all runs US$${budget.spent.toFixed(3)} of cap US$${cap}\nresults: ${dir}`);
