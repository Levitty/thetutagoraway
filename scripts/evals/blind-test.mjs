#!/usr/bin/env node
// The blind real-versus-pretend test (step 6 of PLAN_TO_FOUR.md): Ruth guesses which replies came from real pupils.
//   node scripts/evals/blind-test.mjs make  [--n 10] [--seed 1] [--fake | --live] [--in real-answers.csv] [--out DIR] [--match-labels]
//   node scripts/evals/blind-test.mjs score [--guesses FILE.csv] [--key FILE.json]
// Input: the review sheet's "Real pupil answers" tab exported as CSV
//   (/Users/mutualevity/Desktop/Tutagora/Build/voice-tutor/evals/review/real-answers.csv), columns:
//   No., Question the teacher asked, Pupil's exact words, Right/wrong/partly right, Notes
// `make` picks n real replies and writes n pretend replies to the SAME questions, mixes them in random order, and writes
//   blind-real-vs-pretend.csv  for Ruth (No., Question, Reply, "Real or pretend? (R or P)", "How sure? (1 to 3)")
//   blind-key.json             the answer key, kept apart (never given to Ruth)
// --live asks the pretend child (child.mjs, Haiku) for the pretend replies: about 10 short calls, under US$0.01, and only
//   when you say so. --fake uses an offline stand-in (for testing the script). Pretend replies are drawn with the child's
//   own error rate, or, with --match-labels, made right or wrong to match each real reply's label so correctness is not a tell.
// `score` reads Ruth's filled-in CSV and the key and prints her accuracy and what gave the pretend replies away.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createChild, rngFrom, wordsOf } from './child.mjs';
import { SCENARIOS } from './scenarios.mjs';

const REVIEW = '/Users/mutualevity/Desktop/Tutagora/Build/voice-tutor/evals/review';
const argv = process.argv.slice(2);
const mode = argv[0];
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true) : d; };
const OUT = String(opt('out', REVIEW));

// ---- CSV (quotes, commas and newlines inside quotes)
export function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  const t = String(text).replace(/^﻿/, '');
  for (let i = 0; i < t.length; i += 1) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i += 1; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i += 1; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => String(x).trim() !== ''));
}
export const toCsv = (rows) => rows.map((r) => r.map((x) => { const s = String(x ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n') + '\n';
const shuffle = (a, rng) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const labelOf = (s) => (/wrong|incorrect/i.test(s) ? 'wrong' : /part/i.test(s) ? 'partly' : /right|correct/i.test(s) ? 'right' : null);

/** Reads the exported real answers: [{ no, question, words, label, notes }] with a reply and a question. */
export function readReal(path) {
  const rows = parseCsv(readFileSync(path, 'utf8'));
  const head = rows[0].map((h) => h.toLowerCase());
  const col = (re) => head.findIndex((h) => re.test(h));
  const iQ = col(/question/); const iA = col(/exact words|pupil/); const iL = col(/right|wrong/); const iN = col(/notes/); const iNo = col(/^no/);
  if (iQ < 0 || iA < 0) throw new Error('real-answers.csv needs the columns "Question the teacher asked" and "Pupil\'s exact words"');
  return rows.slice(1).map((r, k) => ({ no: r[iNo] || String(k + 1), question: (r[iQ] || '').trim(), words: (r[iA] || '').trim(), label: iL >= 0 ? labelOf(r[iL] || '') : null, notes: iN >= 0 ? (r[iN] || '') : '' })).filter((r) => r.question && r.words);
}

// ---- the pretend replies
const fakeModel = async ({ user }) => ({ text: /WRONG/.test(user) ? 'two sixths' : /RIGHT/.test(user) ? 'three eighths' : 'ok', cost: 0 });
async function liveModel() {
  const { Budget, ask } = await import('./api.mjs');
  const budget = new Budget(Number(opt('cap', 10)));
  return async ({ model, system, user, maxTokens }) => ask(budget, 'child', { model, system, user, maxTokens, effort: model.includes('sonnet') ? 'low' : null });
}

async function make() {
  const n = Number(opt('n', 10)); const seed = Number(opt('seed', 1));
  const inPath = String(opt('in', `${REVIEW}/real-answers.csv`));
  if (!existsSync(inPath)) { console.error(`No real pupil answers yet: ${inPath} not found.\nExport the review sheet's "Real pupil answers" tab as CSV to that path, then run this again.`); process.exit(2); }
  const real = readReal(inPath);
  if (real.length < n) { console.error(`Only ${real.length} real answers with a question; need at least ${n}.`); process.exit(2); }
  const rng = rngFrom(seed * 7 + 3);
  const chosen = shuffle(real, rng).slice(0, n);
  const live = !!opt('live', false);
  if (!live && !opt('fake', false)) { console.error('Say --live (asks the pretend child, a few cents at most) or --fake (offline test stand-in).'); process.exit(2); }
  const callModel = live ? await liveModel() : fakeModel;
  const sc = SCENARIOS.find((s) => s.n === 30);          // the typical child
  const child = createChild({ sc, seed, callModel });
  const pretend = [];
  for (const r of chosen) {
    // the pretend child answers the SAME question, fresh (no lesson before it), as a claim
    if (opt('match-labels', false) && r.label) {
      const c = createChild({ sc, seed, callModel, errorRate: r.label === 'right' ? 0.0001 : 0.9999 });
      const a = await c.act({ dialogue: '', boardText: 'nothing yet', tutorText: r.question, steps: [], answer: null, doing: 'answer' });
      pretend.push({ question: r.question, words: a.speech || 'ehh', meta: a.meta });
    } else {
      const a = await child.act({ dialogue: '', boardText: 'nothing yet', tutorText: r.question, steps: [], answer: null, doing: 'answer' });
      pretend.push({ question: r.question, words: a.speech || 'ehh', meta: a.meta });
    }
  }
  // mishearing is a transcript effect the real replies do not have (they are typed from what the teacher heard): none here
  const items = shuffle([...chosen.map((r) => ({ source: 'real', question: r.question, words: r.words, label: r.label })), ...pretend.map((p) => ({ source: 'pretend', question: p.question, words: p.words, label: p.meta?.wrong == null ? null : p.meta.wrong ? 'wrong' : 'right' }))], rng);
  mkdirSync(OUT, { recursive: true });
  const sheet = [['No.', 'Question the teacher asked', 'Reply', 'Real or pretend? (R or P)', 'How sure? (1 unsure, 2 fairly, 3 certain)'], ...items.map((x, i) => [i + 1, x.question, x.words, '', ''])];
  writeFileSync(`${OUT}/blind-real-vs-pretend.csv`, toCsv(sheet));
  writeFileSync(`${OUT}/blind-key.json`, JSON.stringify({ made: new Date().toISOString(), seed, live, items: items.map((x, i) => ({ no: i + 1, ...x })) }, null, 2));
  console.log(`Wrote ${n} real and ${n} pretend replies, mixed, to:\n  ${OUT}/blind-real-vs-pretend.csv   (give this to Ruth)\n  ${OUT}/blind-key.json              (keep this; the scorer reads it)`);
}

// ---- the scorer
const binomP = (k, n) => { // two-sided exact test against chance (p = 0.5)
  const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i += 1) r = (r * (a - b + i)) / i; return r; };
  const pk = (x) => C(n, x) / 2 ** n; const base = pk(k);
  let p = 0; for (let x = 0; x <= n; x += 1) if (pk(x) <= base + 1e-12) p += pk(x);
  return Math.min(1, p);
};
export function scoreGuesses(key, guessRows) {
  const head = guessRows[0].map((h) => h.toLowerCase());
  const iNo = head.findIndex((h) => /^no/.test(h)); const iG = head.findIndex((h) => /real or pretend/.test(h)); const iS = head.findIndex((h) => /how sure/.test(h));
  const guess = new Map(guessRows.slice(1).map((r) => [Number(r[iNo]), { g: /^\s*r/i.test(r[iG] || '') ? 'real' : /^\s*p/i.test(r[iG] || '') ? 'pretend' : null, sure: Number(r[iS]) || null }]));
  const rows = key.items.map((it) => ({ ...it, guess: guess.get(it.no)?.g || null, sure: guess.get(it.no)?.sure || null }));
  const answered = rows.filter((r) => r.guess);
  const right = answered.filter((r) => r.guess === r.source);
  const of = (src) => answered.filter((r) => r.source === src);
  const acc = answered.length ? right.length / answered.length : 0;
  const verdict = acc > 0.7 ? 'TOO EASY to spot: the pretend child is not realistic enough yet (above 70%)' : acc >= 0.4 ? 'GOOD: about chance (40 to 70%); Ruth cannot reliably tell them apart' : 'BELOW chance: Ruth is reading the pretend replies as real more than the real ones; check the guesses were not reversed';
  return {
    answered: answered.length, of: rows.length, correct: right.length, accuracy: Math.round(acc * 1000) / 10, p_vs_chance: Math.round(binomP(right.length, answered.length || 1) * 1000) / 1000,
    real_called_real: `${of('real').filter((r) => r.guess === 'real').length} of ${of('real').length}`,
    pretend_called_pretend: `${of('pretend').filter((r) => r.guess === 'pretend').length} of ${of('pretend').length}`,
    confident_and_right: `${right.filter((r) => r.sure === 3).length} of ${answered.filter((r) => r.sure === 3).length} certain guesses`,
    verdict, rows,
    tells: of('pretend').filter((r) => r.guess === 'pretend').map((r) => ({ no: r.no, said: r.words, words: wordsOf(r.words).length, sure: r.sure })),
  };
}
function score() {
  const keyPath = String(opt('key', `${OUT}/blind-key.json`)); const gPath = String(opt('guesses', `${OUT}/blind-real-vs-pretend.csv`));
  const key = JSON.parse(readFileSync(keyPath, 'utf8')); const res = scoreGuesses(key, parseCsv(readFileSync(gPath, 'utf8')));
  if (!res.answered) { console.error('No guesses found: fill in the "Real or pretend?" column (R or P).'); process.exit(2); }
  console.log(`Ruth guessed ${res.answered} of ${res.of}: ${res.correct} right = ${res.accuracy}% (chance 50%; p vs chance ${res.p_vs_chance})`);
  console.log(`  real called real: ${res.real_called_real}; pretend called pretend: ${res.pretend_called_pretend}; ${res.confident_and_right}`);
  console.log(`  ${res.verdict}`);
  if (res.tells.length) { console.log('\nPretend replies she spotted (what to fix):'); for (const t of res.tells) console.log(`  #${t.no} (${t.words} words${t.sure ? `, sure ${t.sure}` : ''}): ${t.said}`); }
  const missed = res.rows.filter((r) => r.source === 'real' && r.guess === 'pretend');
  if (missed.length) { console.log('\nReal replies she took for pretend (the pretend child may be too messy there):'); for (const m of missed) console.log(`  #${m.no}: ${m.words}`); }
}

if (process.argv[1] && process.argv[1].endsWith('blind-test.mjs')) {
  if (mode === 'make') await make(); else if (mode === 'score') score();
  else { console.error('usage: blind-test.mjs make [--n 10] [--live|--fake] | score [--guesses FILE] [--key FILE]'); process.exit(1); }
}
