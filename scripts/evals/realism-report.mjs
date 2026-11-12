#!/usr/bin/env node
// Offline realism report for the pretend child (step 6 of PLAN_TO_FOUR.md). NO network, NO API key, US$0.
// Plays child.mjs against a fixed set of tutor turns with a FAKE model that behaves like a capable but tidy model
// (it obeys the decision, but is sometimes wordy and sometimes writes full sentences), then checks that what comes
// out matches the targets: error rate, length, messy share, tidy sentences, mishearing, script leaks.
//   node scripts/evals/realism-report.mjs [--seed 7] [--lessons 40] [--json]
import { createChild, wordsOf, leaksScript, rngFrom, CHILD_MODEL, CHILD_FALLBACK } from './child.mjs';
import { SCENARIOS } from './scenarios.mjs';
import { costOf } from '../../src/rocket/guide.js';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const SEED = Number(opt('seed', 7)); const LESSONS = Number(opt('lessons', 80));

// ---- a fixed set of tutor turns (the same every run): a question with a sealed answer, or an explanation
const TURNS = [
  { say: 'Look at the bar. It is cut into 8 equal parts and 3 are shaded. What fraction is shaded?', answer: 'three eighths', doing: 'answer', steps: [{ cmd: 'fraction_bar' }] },
  { say: 'Good. Now which is more, one quarter or one eighth of the same loaf?', answer: 'one quarter', doing: 'answer', steps: [] },
  { say: 'Let me show you both on one picture.', answer: null, doing: null, steps: [{ cmd: 'fraction_bar' }, { cmd: 'number_line' }] },
  { say: 'What do you notice about the pieces?', answer: null, doing: 'answer', steps: [] },
  { say: 'If we add one half and one quarter, how much is it altogether?', answer: 'three quarters', doing: 'answer', steps: [] },
  { say: 'Is two quarters the same as one half?', answer: 'yes', doing: 'answer', steps: [] },
  { say: 'Say how many eighths make one whole.', answer: 'eight', doing: 'answer', steps: [{ cmd: 'shape', kind: 'circle' }] },
  { say: 'Imagine a chapati cut in four. You eat one piece.', answer: null, doing: null, steps: [{ cmd: 'say', text: 'Imagine a chapati cut in four' }] },
  { say: 'How much of the chapati is left?', answer: 'three quarters', doing: 'answer', steps: [] },
  { say: 'Which is bigger, five twelfths or two thirds?', answer: 'two thirds', doing: 'answer', steps: [] },
  { say: 'Write the fraction for 2 of 6 parts shaded.', answer: 'two sixths', doing: 'answer', steps: [] },
  { say: 'So what is the rule you found?', answer: null, doing: 'answer', steps: [] },
];
// scenarios used: the typical child (30), and a spread of the others (behaviour scenarios included)
const SPREAD = [30, 1, 2, 3, 9, 10, 11, 12, 13, 16, 17, 22, 23, 27];

// ---- the fake model: a tidy, wordy, capable model that follows the decision it is given
const toNum = { 'three eighths': ['three eighths', 'two eighths'], 'one quarter': ['one quarter', 'one eighth'], 'three quarters': ['three quarters', 'four quarters'], yes: ['yes', 'no'], eight: ['eight', 'four'], 'two thirds': ['two thirds', 'five twelfths'], 'two sixths': ['two sixths', 'six over two'] };
export function fakeModel(rng) {
  return async ({ user }) => {
    const wrong = /You get this one WRONG/.test(user);
    const right = /You get this one RIGHT/.test(user);
    const ans = /"([^"]+)"/.exec(user)?.[1];
    let t;
    if (wrong || right) {
      const pair = toNum[ans] || [ans || 'one half', 'two thirds'];
      const say = wrong ? (/Use your wrong idea/.test(user) ? 'two sixths' : pair[1] || 'seven') : pair[0];
      t = rng() < 0.45 ? `I think the answer is ${say}, because that is how we learned it in class.` : rng() < 0.5 ? say : `It is ${say}.`;
    } else if (/DIFFERENT question/.test(user)) t = 'I can see four parts on the bar.';
    else if (/did not really listen/.test(user)) t = 'My pencil is broken, can I get another one please.';
    else if (/do not know/.test(user)) t = 'I am not sure, I do not remember how to do this one.';
    else t = rng() < 0.5 ? 'ok' : 'I see, so the pieces are the same size, which makes sense to me now.';
    return { text: t, cost: 0 };
  };
}

// ---- run
const rows = [];
let leakProbe = 0; let tidy = 0;
const chars = { sys: 0, user: 0, out: 0 };
for (let i = 0; i < LESSONS; i += 1) {
  const sc = SCENARIOS.find((s) => s.n === SPREAD[i % SPREAD.length]);
  const rng = rngFrom(SEED * 7919 + i);
  const calls = [];
  const fm = fakeModel(rngFrom(SEED * 31 + i));
  const child = createChild({ sc, seed: SEED + i, callModel: async (r) => { calls.push(r); chars.sys += r.system.length; chars.user += r.user.length; const o = await fm(r); chars.out += o.text.length; return o; } });
  for (let t = 0; t < 12; t += 1) {
    const T = TURNS[(t + i) % TURNS.length];
    const c = await child.act({ dialogue: '(lesson)', boardText: 'a bar split into 8 parts', tutorText: T.say, steps: T.steps, answer: T.answer, doing: T.doing, note: '' });
    const sent = child.heard(c.speech, { always: sc.n === 27 });
    rows.push({ sc: sc.n, meta: c.meta, speech: c.speech, sent, words: wordsOf(c.speech).length, answer: T.answer });
    // the leak probe: what the model is sent never contains the scenario's expectation or limit
    for (const r of calls) { if ((sc.expect && (r.system + r.user).includes(sc.expect)) || (sc.limit && (r.system + r.user).includes(sc.limit))) leakProbe += 1; }
    calls.length = 0;
  }
}

const spoken = rows.filter((r) => r.speech);
const claims = rows.filter((r) => r.meta.claim);
const typical = rows.filter((r) => r.sc === 30);
const pct = (a, b) => (b ? Math.round((1000 * a) / b) / 10 : 0);
const lenBuckets = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7-9': 0, '10+': 0 };
for (const r of spoken) lenBuckets[r.words <= 6 ? String(Math.max(1, r.words)) : r.words <= 9 ? '7-9' : '10+'] += 1;
const messy = (r) => /\.\.\.$|…$/.test(r.speech) || /^(umm?|ehh?|hmm|uh)\b/i.test(r.speech) || ['idk', 'ignore', 'different'].includes(r.meta.kind) || /don't know|dunno|sijui|not sure|forgot/i.test(r.speech);
const tidyS = (r) => r.words >= 8;
const heardChanged = rows.filter((r) => r.speech && r.sent !== r.speech);
const garbleable = rows.filter((r) => r.speech && /\b(two|four|one|half|eighths?|three|thirds|sixths|fourths|quarters)\b/i.test(r.speech));
// the answer actually said matches the decision (right = the sealed answer's words, wrong = something else)
const withAns = claims.filter((r) => r.answer && r.answer !== 'yes');
const has = (r) => new RegExp(`\\b${r.answer}\\b`, 'i').test(r.speech);
const saidRight = withAns.filter(has);
const decidedWrong = withAns.filter((r) => r.meta.wrong);
const matchPlumbing = withAns.filter((r) => (!r.meta.wrong) === has(r)).length;
const leaky = rows.filter((r) => leaksScript(r.speech, SCENARIOS.find((s) => s.n === r.sc))).length;
const typClaims = typical.filter((r) => r.meta.claim);
const plainSc = new Set([1, 2, 3, 12, 17, 30]); // scenarios whose target is the default 0.27 (17 is 0.22)
const plainClaims = claims.filter((r) => [1, 2, 3, 30].includes(r.sc));

const checks_extra = [];
const out = {
  turns: rows.length, spoken: spoken.length, claims: claims.length,
  error_rate_decided: pct(claims.filter((r) => r.meta.wrong).length, claims.length),
  error_rate_default_target_scenarios: pct(plainClaims.filter((r) => r.meta.wrong).length, plainClaims.length),
  error_rate_typical_child: pct(typClaims.filter((r) => r.meta.wrong).length, typClaims.length),
  error_rate_said: pct(withAns.length - saidRight.length, withAns.length),
  decision_matches_speech: pct(matchPlumbing, withAns.length),
  short_1_to_6: pct(spoken.filter((r) => r.words <= 6).length, spoken.length),
  over_12_words: spoken.filter((r) => r.words > 12).length,
  mean_words: Math.round((10 * spoken.reduce((a, r) => a + r.words, 0)) / spoken.length) / 10,
  length_distribution: lenBuckets,
  messy_share: pct(spoken.filter(messy).length, spoken.length),
  tidy_sentences_8plus: pct(spoken.filter(tidyS).length, spoken.length),
  mishearing_of_turns: pct(heardChanged.length, spoken.length),
  mishearing_where_a_word_could_change: pct(heardChanged.filter((r) => r.sc !== 27).length, garbleable.filter((r) => r.sc !== 27).length),
  script_leaks: leaky, expectation_sent_to_model: leakProbe,
  by_kind: rows.reduce((a, r) => ({ ...a, [r.meta.kind]: (a[r.meta.kind] || 0) + 1 }), {}),
};
// ---- the leak guard: a model that parrots its brief (scenario 22's script text leaked in the first run) is caught
{
  const sc22 = SCENARIOS.find((s) => s.n === 22);
  const parrot = ['and then you press Check my work', 'When HOREB gives you a question you write your answer', 'WRITE: 3/8', 'as my behaviour says I stay quiet', 'I wrote 2/3 on the board'];
  let caught = 0;
  for (const text of parrot) { const ch = createChild({ sc: sc22, seed: 3, callModel: async () => ({ text, cost: 0 }) }); const c = await ch.act({ dialogue: '', boardText: 'nothing', tutorText: 'what is it', steps: [], answer: '3/8', doing: 'answer' }); if (!/check my work|behaviour|when horeb gives/i.test(c.speech)) caught += 1; }
  out.leak_guard_caught = `${caught} of ${parrot.length}`;
  checks_extra.push(['leak guard strips parroted brief text (scenario 22)', caught >= 4]);
}
// ---- checks against the targets
const checks = [
  ['error rate 22-32% across scenarios with the default target (1, 2, 3, 30)', out.error_rate_default_target_scenarios >= 22 && out.error_rate_default_target_scenarios <= 32],
  ['typical child (scenario 30) error rate 20-34%', out.error_rate_typical_child >= 20 && out.error_rate_typical_child <= 34],
  ['what the child says matches the decision >= 95%', out.decision_matches_speech >= 95],
  ['1 to 6 words on at least 85% of turns', out.short_1_to_6 >= 85],
  ['no turn over 12 words', out.over_12_words === 0],
  ['tidy sentences (8+ words) at most 5%', out.tidy_sentences_8plus <= 5],
  ['messy turns 30-50%', out.messy_share >= 30 && out.messy_share <= 50],
  ['mishearing on 5-16% of turns (excluding scenario 27)', out.mishearing_of_turns >= 5 && out.mishearing_of_turns <= 16],
  ['no script leaks, and the expectation never sent to the model', out.script_leaks === 0 && out.expectation_sent_to_model === 0],
];
checks.push(...checks_extra);
const rows27 = rows.filter((r) => r.sc === 27).length;
if (argv.includes('--json')) { console.log(JSON.stringify({ out, checks }, null, 2)); process.exit(checks.every((c) => c[1]) ? 0 : 1); }

// cost per turn on a typical prompt, from the measured prompt sizes (4 characters a token), against the old Sonnet child
const n = rows.length; const modelCalls = rows.filter((r) => !['idk', 'ack'].includes(r.meta.kind) || true).length;
console.log(`Pretend child realism (offline, fake model, seed ${SEED}, ${LESSONS} lessons x 12 turns = ${n} turns, ${rows27} of them scenario 27)\n`);
console.log(`Error rate on checkable claims: ${out.error_rate_default_target_scenarios}% in the default-target scenarios (1, 2, 3, 30; target 25-30%), ${out.error_rate_decided}% over all ${out.claims} claims in the mixed set (it includes scenarios set higher on purpose: 9-11, 13, 22, 23, or lower: 16); typical child (scenario 30) ${out.error_rate_typical_child}%; what is actually said agrees with the decision ${out.decision_matches_speech}%`);
console.log(`Length: ${out.short_1_to_6}% of spoken turns are 1-6 words (mean ${out.mean_words}); over 12 words: ${out.over_12_words}`);
console.log(`  words: ${Object.entries(out.length_distribution).map(([k, v]) => `${k}:${pct(v, spoken.length)}%`).join('  ')}`);
console.log(`Messy turns (trail off, filler, idk, ignores, other question): ${out.messy_share}%   tidy sentences (8+ words): ${out.tidy_sentences_8plus}%`);
console.log(`Moves: ${Object.entries(out.by_kind).map(([k, v]) => `${k} ${pct(v, n)}%`).join(', ')}`);
console.log(`Mishearing: ${out.mishearing_of_turns}% of spoken turns changed (${out.mishearing_where_a_word_could_change}% of those with a number or fraction word, outside scenario 27)`);
console.log(`Script leaks: ${out.script_leaks}; scenario expectation or limit found in a prompt sent to the model: ${out.expectation_sent_to_model}`);
const old = { in: Math.round(chars.sys / n / 4 * 0 + 520 + chars.user / n / 4), out: 25 };
const perNewIn = Math.round(chars.sys / n / 4 + chars.user / n / 4);
const callShare = rows.filter((r) => !['idk', 'ack'].includes(r.meta.kind)).length / n;
console.log(`\nCost per child turn (from prompt sizes): about ${perNewIn} input tokens, 25 output.`);
console.log(`  old child (Sonnet, ~${old.in} input tokens): US$${(costOf(CHILD_FALLBACK, { input_tokens: old.in, output_tokens: old.out })).toFixed(5)}`);
console.log(`  new child (${CHILD_MODEL}, ${(callShare * 100).toFixed(0)}% of turns call the model): US$${(callShare * costOf(CHILD_MODEL, { input_tokens: perNewIn, output_tokens: 15 })).toFixed(5)}`);
console.log('\nChecks:'); for (const [name, ok] of checks) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
if (!process.env.SHOW_MISMATCH) process.exit(checks.every((c) => c[1]) ? 0 : 1);
if (process.env.SHOW_MISMATCH) for (const r of withAns.filter((r) => (!r.meta.wrong) !== has(r))) console.error(r.sc, r.meta.wrong, r.meta.via, JSON.stringify(r.speech), r.answer);
