#!/usr/bin/env node
// ============================================================================
// THE SAME SCENARIOS, TWO TUTOR MODELS (Round 2 of the free fixes, 13 Nov 2026; the owner: "yes do the free fixes, then
// run sonnet vs opus"). Plays one scenario list twice through run-evals.mjs, once with each tutor model, into two run
// folders, then writes COMPARE.md beside them (free: it reads the two scores.json files). One after the other, never at
// the same time, so the hard cap in the ledger is checked before every call of both runs.
//
//   node scripts/evals/compare-tutors.mjs --scenarios 1,3,6,14,17,30 --cap 26 --dry   # print the two commands, spend nothing
//   node scripts/evals/compare-tutors.mjs --scenarios 1,3,6,14,17,30 --cap 26         # PAID: both runs, then COMPARE.md
//
// Everything but the tutor model is the same in both runs: the scenarios, the turns, the pretend child (Haiku) and its seed
// (--seed, default 1311; scenario n plays with seed + n), the judge (Opus), the prompt, the gate and the effort.
// Options: --scenarios (required), --cap USD (required: the total cap across all runs, the ledger), --seed N,
// --models a,b (default claude-sonnet-5-5,claude-opus-5-5), --name STEM (default the date and time), --max-turns N, --dry.
// ============================================================================
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RUNS_DIR = '/Users/mutualevity/Desktop/Tutagora/Build/voice-tutor/evals/runs';
const MEASURES = [['teaching', 'Teach'], ['diagnosis', 'Diag'], ['naturalness', 'Natur'], ['adapting', 'Adapt'], ['curriculum', 'Curric']];
const short = (m) => (/opus/.test(m) ? 'opus' : /sonnet/.test(m) ? 'sonnet' : m.replace(/[^a-z0-9]+/g, '-'));

/** The two run-evals.mjs argument lists, one per model. */
export function compareCommands({ scenarios, cap, seed = 1311, models = ['claude-sonnet-5-5', 'claude-opus-5-5'], name, maxTurns = null } = {}) {
  if (!scenarios || !cap) throw new Error('--scenarios and --cap are both required');
  return models.map((m) => ({ model: m, run: `${name}-${short(m)}`, args: ['--scenarios', String(scenarios), '--cap', String(cap), '--tutor-model', m, '--run-name', `${name}-${short(m)}`, '--seed', String(seed), ...(maxTurns ? ['--max-turns', String(maxTurns)] : [])] }));
}

const scoreOf = (x) => (x?.score && !x.score.error ? x.score : null);
const avg = (xs) => (xs.length ? Math.round((100 * xs.reduce((a, b) => a + b, 0)) / xs.length) / 100 : null);
/** The side-by-side table of two runs' scores.json (arrays of { scenario, title, score, tutor_cost, ... }). */
export function compareTable(a, b, { names = ['A', 'B'] } = {}) {
  const ns = [...new Set([...a, ...b].map((x) => x.scenario))].sort((x, y) => x - y);
  const by = (rows, n) => rows.find((x) => x.scenario === n);
  const L = [`| # | Scenario | ${MEASURES.map(([, h]) => `${h} ${names[0]} / ${names[1]}`).join(' | ')} | Avg ${names[0]} / ${names[1]} | Pass ${names[0]} / ${names[1]} | Tutor US$ ${names[0]} / ${names[1]} |`, `|---|---|${MEASURES.map(() => '---').join('|')}|---|---|---|`];
  for (const n of ns) {
    const x = by(a, n); const y = by(b, n); const sx = scoreOf(x); const sy = scoreOf(y);
    const cell = (s, k) => (s ? s[k] ?? '-' : '-');
    L.push(`| ${n} | ${(x || y).title} | ${MEASURES.map(([k]) => `${cell(sx, k)} / ${cell(sy, k)}`).join(' | ')} | ${sx?.avg ?? '-'} / ${sy?.avg ?? '-'} | ${sx ? (sx.pass ? 'PASS' : 'FAIL') : '-'} / ${sy ? (sy.pass ? 'PASS' : 'FAIL') : '-'} | ${(x?.tutor_cost ?? 0).toFixed(3)} / ${(y?.tutor_cost ?? 0).toFixed(3)} |`);
  }
  const means = MEASURES.map(([k, h]) => `${h} ${avg(a.map(scoreOf).filter(Boolean).map((s) => s[k]).filter(Number.isFinite))} / ${avg(b.map(scoreOf).filter(Boolean).map((s) => s[k]).filter(Number.isFinite))}`);
  const passes = (rows) => rows.map(scoreOf).filter((s) => s?.pass).length;
  const cost = (rows) => rows.reduce((t, x) => t + (x.tutor_cost || 0) + (x.child_cost || 0) + (x.judge_cost || 0), 0);
  L.push('', `Averages (${names[0]} / ${names[1]}): ${means.join('; ')}.`, `Passed: ${passes(a)} of ${a.length} / ${passes(b)} of ${b.length}. Cost of the lessons (tutor, child, judge; patterns not included): US$${cost(a).toFixed(3)} / US$${cost(b).toFixed(3)}.`);
  return L.join('\n');
}

const opt = (argv, name, d) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true) : d; };

if (process.argv[1] && process.argv[1].endsWith('compare-tutors.mjs')) {
  const argv = process.argv.slice(2);
  const d = new Date(); const p2 = (n) => String(n).padStart(2, '0');
  const name = String(opt(argv, 'name', `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}`));
  const models = String(opt(argv, 'models', 'claude-sonnet-5-5,claude-opus-5-5')).split(',');
  const runs = compareCommands({ scenarios: opt(argv, 'scenarios', null), cap: opt(argv, 'cap', null), seed: Number(opt(argv, 'seed', 1311)), models, name, maxTurns: opt(argv, 'max-turns', null) });
  const runner = resolve(dirname(fileURLToPath(import.meta.url)), 'run-evals.mjs');
  for (const r of runs) console.log(`node scripts/evals/run-evals.mjs ${r.args.join(' ')}`);
  if (opt(argv, 'dry', false)) { console.log('(dry: nothing was run, nothing spent)'); process.exit(0); }
  for (const r of runs) {
    console.log(`\n=== ${r.model} -> ${r.run}`);
    const res = spawnSync(process.execPath, [runner, ...r.args], { stdio: 'inherit' });
    if (res.status !== 0) { console.error(`${r.run} stopped (exit ${res.status}); the other run is not started`); process.exit(res.status || 1); }
  }
  const read = (run) => (existsSync(`${RUNS_DIR}/${run}/scores.json`) ? JSON.parse(readFileSync(`${RUNS_DIR}/${run}/scores.json`, 'utf8')) : []);
  const [a, b] = runs.map((r) => read(r.run));
  const text = [`# ${models.join(' against ')}: runs ${runs.map((r) => r.run).join(' and ')}`, '', `Same scenarios (${opt(argv, 'scenarios')}), turns, pretend child and seed, judge, prompt and gate; only the tutor's model differs.`, '', compareTable(a, b, { names: runs.map((r) => short(r.model)) }), ''].join('\n');
  for (const r of runs) writeFileSync(`${RUNS_DIR}/${r.run}/COMPARE.md`, text);
  console.log(`\n${text}`);
}

export default { compareCommands, compareTable };
