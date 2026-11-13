// The pretend child (step 6 of PLAN_TO_FOUR.md): a realistic Kenyan Grade 5 learner, not a clever one.
// Real learners are wrong on about 25 to 30% of checkable claims and speak in a few messy words; a generic model
// playing a learner is nearly always right and tidy (humans& Persimmon). So the HARNESS decides what the child does
// each turn (right or wrong, and how, from a knowledge sheet and a target error rate), tells the model what to say,
// and then enforces short messy speech in code (length cap, trailing off, fillers, a little mishearing).
// This module has no network code: the model is passed in as `callModel`, so it is tested offline.
import { sheetFor } from './child-sheets.mjs';

export const DEFAULT_ERROR_RATE = 0.27;
/** Turns the wrong idea is held for when the non-improving option is on without a number (READING_12NOV.md: four turns). */
export const NON_IMPROVING_TURNS = 4;
// Cheaper and differently trained than the tutor (Sonnet) and the judge (Opus): less sameness. Falls back to Sonnet at low
// effort if Haiku is not served to this key.
export const CHILD_MODEL = 'claude-haiku-5-5';
export const CHILD_FALLBACK = 'claude-sonnet-5-5';

// ---------- random numbers (seedable, so a test is repeatable)
export const rngFrom = (seed) => { let a = (Number(seed) >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pick = (rng, a) => a[Math.floor(rng() * a.length)];
const chance = (rng, p) => rng() < p;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const wordsOf = (t) => String(t || '').replace(/\.\.\.|…/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

// ---------- the protocol forms (unchanged from before the realism work)
export function parseChild(text) {
  const lines = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  let shade = null; let write = null; const said = [];
  for (const l of lines) {
    const sh = /^SHADE:\s*(.*)$/i.exec(l); const wr = /^WRITE:\s*(.*)$/i.exec(l);
    if (sh) shade = (sh[1].match(/\d+/g) || []).map(Number);
    else if (wr) write = wr[1];
    else said.push(l);
  }
  const speech = said.join(' ').replace(/^["“]|["”]$/g, '').trim();
  const silent = !shade && !write && (!speech || /^\(?silent\)?\.?$/i.test(speech));
  return { shade, write, speech: /^\(?silent\)?\.?$/i.test(speech) ? '' : speech, silent };
}

// ---------- mishearing: a rule-based imitation of speech-to-text mistakes
const SWAPS = [
  [/\bfourths\b/gi, ['forth', 'fourth']], [/\bfourth\b/gi, ['forth']], [/\btwo\b/gi, ['too', 'to']], [/\bfour\b/gi, ['for', 'fore']],
  [/\bone\b/gi, ['won']], [/\bhalf\b/gi, ['have', 'halve']], [/\beighths\b/gi, ['ates', 'eight']], [/\beighth\b/gi, ['eight']],
  [/\bthree\b/gi, ['tree']], [/\bthirds\b/gi, ['third']], [/\bsixths\b/gi, ['sixth']], [/\bquarters\b/gi, ['quarter is', 'quarter']],
  [/\bthirteen\b/gi, ['thirty']], [/\bthirty\b/gi, ['thirteen']], [/\bfifteen\b/gi, ['fifty']], [/\bfifty\b/gi, ['fifteen']],
  [/\bseven\b/gi, ['sevent']], [/\bnine\b/gi, ['nice', 'nine nine']],
];
/** Always garbles when it can (scenario 27). */
export const garble = (t) => SWAPS.reduce((s, [re, to]) => s.replace(re, to[0]), String(t));
/** Garbles one or two words, chosen at random, as a real microphone would; returns the text unchanged if nothing applies. */
export function mishear(text, rng) {
  let s = String(text); let changed = 0;
  const order = SWAPS.map((x, i) => [rng(), i]).sort((a, b) => a[0] - b[0]).map((x) => SWAPS[x[1]]);
  for (const [re, to] of order) {
    if (changed >= 2) break;
    const before = s; s = s.replace(re, () => pick(rng, to));
    if (s !== before) changed += 1;
  }
  return s;
}

// ---------- the leak guard: the child never sees the scenario's expectation, and nothing from its brief is read out
const grams = (t, n) => { const w = String(t || '').toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, ' ').split(/\s+/).filter(Boolean); const out = new Set(); for (let i = 0; i + n <= w.length; i += 1) out.add(w.slice(i, i + n).join(' ')); return out; };
const LEAK_WORDS = /\b(my behaviou?r|my script|my brief|role-?play|pretend(ing)?|as instructed|i am supposed|the scenario|check my work|stay lost|your behaviou?r)\b|\b(WRITE|SHADE):/i;
export function leaksScript(text, sc) {
  if (LEAK_WORDS.test(text)) return true;
  const mine = grams(text, 5);
  if (!mine.size) return false;
  for (const src of [sc?.child, sc?.expect, sc?.limit]) for (const g of grams(src, 5)) if (mine.has(g)) return true;
  return false;
}

// ---------- short, messy speech
const LEN_WEIGHTS = [[1, 20], [2, 24], [3, 18], [4, 12], [5, 8], [6, 6], [7, 3], [8, 3], [9, 2], [10, 2], [12, 2]];
export const drawLength = (rng) => { let r = rng() * LEN_WEIGHTS.reduce((a, [, w]) => a + w, 0); for (const [n, w] of LEN_WEIGHTS) { r -= w; if (r <= 0) return n; } return 3; };
const FILLERS = ['umm', 'ehh', 'um', 'eh', 'hmm', 'uh'];
const IDK = ["I don't know", 'dunno', "I don't know...", 'ehh I don\'t know', 'not sure', 'sijui', "I forgot"];
const ACKS = ['ok', 'mm', 'yes', 'ok...', 'mhm', 'yeah', 'sawa', 'ehh ok'];
const IGNORE = ['can I go and play', "I'm thirsty", 'my pencil is broken', 'is it break time', "teacher it's hot", 'my friend is outside', 'what time is it'];

/** Cuts a reply to its length target, trails off, adds a filler, and (not here) mishears. Returns { text, flags }. */
export function roughen(raw, { rng, cap, trail = 0.15, filler = 0.25, keepTidy = false, keepWords = false }) {
  const flags = { truncated: false, trailed: false, filler: false };
  let t = String(raw || '').replace(/\*[^*]*\*/g, ' ').replace(/\([^)]*\)/g, ' ').replace(/[`_#>]/g, '').replace(/^["“'\s]+|["”'\s]+$/g, '').replace(/\s+/g, ' ').trim();
  if (!t) return { text: '', flags };
  // the first sentence or clause is usually all a child says
  const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length > 1 && wordsOf(sentences[0]).length >= 1) { t = sentences[0]; flags.truncated = true; }
  let w = t.split(/\s+/);
  if (wordsOf(t).length > cap) {
    const clause = t.split(/[,;:]| because | so | and then /i)[0].trim();
    if (clause && wordsOf(clause).length <= cap && wordsOf(clause).length >= 1) { t = clause; flags.truncated = true; w = t.split(/\s+/); }
    else { t = `${w.slice(0, cap).join(' ')}...`; flags.truncated = true; flags.trailed = true; w = t.split(/\s+/); }
  }
  t = t.replace(/[.!]+$/, '');
  if (!keepTidy && (w.length >= 4 || keepWords) && chance(rng, trail) && !flags.trailed) { t = keepWords ? `${t}...` : `${w.slice(0, Math.max(2, w.length - 1 - Math.floor(rng() * 2))).join(' ')}...`; flags.trailed = true; }
  if (!keepTidy && chance(rng, filler) && !/^(umm?|ehh?|hmm|uh)\b/i.test(t) && wordsOf(t).length < cap) { t = `${pick(rng, FILLERS)} ${t}`; flags.filler = true; }
  return { text: t.trim(), flags };
}

// ---------- what the child sees, and what the harness decides
const VISUAL = { fraction_bar: 'bar', number_line: 'line', shape: 'shape', figure: 'figure', plot_points: 'plot' };
export const visualKinds = (steps = []) => steps.filter((s) => VISUAL[s.cmd]).map((s) => (s.cmd === 'shape' ? `shape:${s.kind || ''}` : s.cmd === 'figure' ? `figure:${s.type || ''}` : VISUAL[s.cmd]))
  .concat(steps.some((s) => s.cmd === 'say' && /\b(story|imagine|chapati|mandazi|matatu|shamba|sukuma|loaf|cake|shillings)\b/i.test(s.text || '')) ? ['story'] : []);

// ---------- the move mix, ready to be set against real answers (humans& Persimmon validated its learner on move mix, affect and error
// rate distances; the real data is the teacher's sheet, see blind-test.mjs). All shares are of the child's turns, so two mixes
// (pretend and real) are comparable by total variation distance, 0 (the same) to 1 (nothing in common).
export const MOVE_KINDS = ['answer', 'idk', 'ignore', 'different', 'ack', 'free'];
/** The child's move mix from its stats (child.stats): shares, error rate on claims, hedge rate and mean words. */
export function moveMix(stats) {
  const n = Math.max(1, stats.turns || 0);
  const kinds = Object.fromEntries(MOVE_KINDS.map((k) => [k, Math.round(1000 * ((stats.byKind || {})[k] || 0) / n) / 1000]));
  const spoken = Math.max(1, stats.spoken || 0);
  return {
    turns: stats.turns || 0, kinds,
    wrongRate: stats.claims ? Math.round(1000 * stats.wrong / stats.claims) / 1000 : null,
    claims: stats.claims || 0,
    hedgeRate: Math.round(1000 * (stats.hedged || 0) / spoken) / 1000,
    meanWords: Math.round(10 * (stats.words || 0) / spoken) / 10,
  };
}
/** Total variation distance between two move mixes' kinds, and the gaps in error, hedge and length. Both from moveMix(). */
export function mixDistance(a, b) {
  const tv = MOVE_KINDS.reduce((t, k) => t + Math.abs((a.kinds[k] || 0) - (b.kinds[k] || 0)), 0) / 2;
  const gap = (x, y) => (x == null || y == null ? null : Math.round(1000 * Math.abs(x - y)) / 1000);
  return { moveMix: Math.round(1000 * tv) / 1000, wrongRate: gap(a.wrongRate, b.wrongRate), hedgeRate: gap(a.hedgeRate, b.hedgeRate), meanWords: a.meanWords != null && b.meanWords != null ? Math.round(10 * Math.abs(a.meanWords - b.meanWords)) / 10 : null };
}

export const personaSystem = (sc, sheet) => `You are role-playing Wanjiru, a Kenyan Grade 5 pupil of about ten years old, in a live one-to-one voice maths lesson with an AI tutor called HOREB. What you say is spoken aloud. You are an ordinary child, not a clever one: you do not use correct maths words unless HOREB just said them, you do not explain neatly, and you are not always sure. You never mention that you are playing a role.

WHAT YOU KNOW:
${sheet.knows.map((k) => `- ${k}`).join('\n')}
WHAT YOU ARE SHAKY ON:
${sheet.shaky.map((k) => `- ${k}`).join('\n')}${sheet.doesNotKnow.length ? `\nWHAT YOU DO NOT KNOW AT ALL:\n${sheet.doesNotKnow.map((k) => `- ${k}`).join('\n')}` : ''}
THE ONE WRONG IDEA YOU HOLD (you believe it, you are not pretending):
${sheet.mis.belief}
You keep this idea every time it comes up, until HOREB has really shown you, with a picture, why it fails. Only then do you change it, in a few words of your own.

YOUR BEHAVIOUR IN THIS LESSON:
${sc.child}

HOW YOU SPEAK: usually 1 to 6 words. Never more than ${sheet.maxWords || 12}. No full tidy sentences, no markdown, no stage directions. Sometimes you trail off or stop halfway, sometimes you say "ehh" or "umm", and sometimes you do not answer what was asked at all. You see only what HOREB says and what is on the board. Each turn you are told what to do (right answer, wrong answer, don't know, and so on): do exactly that, in your own short words, and do not be clever.
Reply with ONLY what you say. Special forms, only when they fit:
- If you say nothing at all, reply exactly: (silent)
- If you tap parts of a picture to shade them, first write a line SHADE: followed by the part numbers (for example SHADE: 1 2), then on a new line what you say.
- If you write an answer on the board with your finger, write a line WRITE: followed by exactly what you wrote, then on a new line what you say (it may be nothing).`;

/**
 * One pretend child for one lesson.
 * @param {{sc:object, rng?:Function, seed?:number, callModel:Function, errorRate?:number, models?:string[]}} o
 *   callModel({ model, system, user, maxTokens }) -> { text, cost }
 */
export function createChild({ sc, rng, seed = 1, callModel, errorRate, models = [CHILD_MODEL, CHILD_FALLBACK], nonImproving = null }) {
  const R = rng || rngFrom((seed * 1009 + (sc.n || 0)) >>> 0);
  const sheet = sheetFor(sc);
  const target = errorRate ?? sheet.errorRate ?? DEFAULT_ERROR_RATE;
  // The NON-IMPROVING child (READING_12NOV.md change 4; TutorMoments: the oracle pretend child learns too easily). The wrong idea
  // is held for at least `persist` turns after it first shows (default 2), however many pictures the tutor has drawn; with
  // `forever` it is never let go, so the tutor's persistence, its change of representation and its "never tell" exit are what get
  // tested. Set per sheet (`persist`, `noImprove`) or for a whole run (`nonImproving`: true = four turns, a number = that many,
  // 'never' = never).
  const persistTurns = nonImproving === 'never' || sheet.noImprove ? Infinity : nonImproving === true ? NON_IMPROVING_TURNS : Number.isFinite(Number(nonImproving)) && Number(nonImproving) > 0 ? Number(nonImproving) : (sheet.persist || 2);
  const system = personaSystem(sc, sheet);
  const st = { claims: 0, wrong: 0, firstMisAt: null, kinds: new Set(), turnsSince: 0, repaired: false, justRepaired: false, modelIdx: 0, turns: 0, cost: 0 };
  const stats = { turns: 0, claims: 0, wrong: 0, byKind: {}, byVia: {}, misheard: 0, trailed: 0, filler: 0, truncated: 0, leaks: 0, words: 0, spoken: 0, hedged: 0, persist: Number.isFinite(persistTurns) ? persistTurns : 'never' };

  const triggered = (text) => !!sheet.mis.triggers.test(text || '');
  const shaky = (text) => /\b(eighth|sixth|equivalent|add|plus|compare|simplif|bigger|smaller)/i.test(text || '');

  // The decision: is this answer right or wrong, and why.
  function decideClaim(ctx) {
    if (st.firstMisAt != null && !st.repaired && st.turnsSince >= persistTurns && st.kinds.size >= (sheet.repairKinds || 1)) { st.repaired = true; st.justRepaired = true; }
    let wrong; let via = null;
    if (!st.repaired && triggered(ctx.tutorText)) { wrong = true; via = 'misconception'; }
    else if (st.repaired && triggered(ctx.tutorText)) { wrong = false; via = 'repaired'; }
    else {
      let p = target + 0.3 * (target * st.claims - st.wrong);
      if (shaky(ctx.tutorText)) p *= 1.4;
      p = clamp(p, 0.03, 0.9);
      wrong = chance(R, p); via = wrong ? 'slip' : null;
    }
    // a mix of the misconception and the slips, so the rate stays near the target even when the idea comes up often
    if (via === 'misconception' && st.firstMisAt != null && !st.repaired && st.claims >= 1 && chance(R, 0.12)) { wrong = false; via = 'lucky'; }
    st.claims += 1; if (wrong) st.wrong += 1;
    if (via === 'misconception' && st.firstMisAt == null) { st.firstMisAt = st.claims; st.turnsSince = 0; st.kinds = new Set(); }
    return { wrong, via };
  }

  const SLIPS = ['you count the parts wrong by one', 'you say the bottom number instead of the top', 'you say a nearby fraction you half remember', 'you give just a whole number', 'you guess the first fraction you can think of'];

  function plan(ctx) {
    const claim = ctx.doing === 'answer' || ctx.doing === 'task' || ctx.answer != null;
    const beh = sheet.behaviour || !!ctx.note;
    let kind; let decision = null;
    if (!claim) kind = beh ? 'free' : (chance(R, 0.5) ? 'ack' : 'free');
    else {
      const r = R();
      if (!beh && r < 0.09) kind = 'idk';
      else if (!beh && r < 0.13) kind = 'ignore';
      else if (!beh && r < 0.17) kind = 'different';
      else { kind = 'answer'; decision = decideClaim(ctx); }
    }
    return { kind, decision, claim };
  }

  const directive = (p, ctx, len) => {
    const lines = [`HOW TO REPLY THIS TURN (decided for you; follow it): say about ${len} word${len === 1 ? '' : 's'}, never more than ${Math.min(sheet.maxWords || 12, Math.max(len + 3, 4))}. Not a tidy sentence.`];
    if (p.kind === 'answer') {
      const d = p.decision;
      const how = sheet.answerBy === 'write' ? 'Give it by writing it (a WRITE: line).' : sheet.answerBy === 'shade' ? 'Give it by tapping the parts (a SHADE: line) if there is a picture to shade.' : '';
      if (d.wrong) {
        lines.push(`You get this one WRONG. ${d.via === 'misconception' ? 'Use your wrong idea (above) to answer, and if HOREB asks why, give that reason in a few words.' : `A slip: ${pick(R, SLIPS)}.`} ${ctx.answer != null ? `(The right answer is "${ctx.answer}": yours must NOT be that.)` : ''} Say it as if you are sure or half sure, not as if you know it is wrong.`);
      } else {
        lines.push(`You get this one RIGHT${ctx.answer != null ? `: the answer is "${ctx.answer}"` : ''}. Say just the answer in your own words, nothing more${d.via === 'repaired' ? '. You have just seen why your old idea fails: say the new idea in a few words of your own, with "oh" or "ohh"' : ''}. Do not explain unless asked.`);
      }
      if (how) lines.push(how);
    } else if (p.kind === 'idk') lines.push('You do not know. Say so in a few words.');
    else if (p.kind === 'ignore') lines.push('You did not really listen: say something small about something else (your pencil, being thirsty, break). Do not answer the question.');
    else if (p.kind === 'different') lines.push('You answer a DIFFERENT question from the one asked (for example say how many parts you can see, or what you did last time). Do not answer what was asked.');
    else lines.push('Not a question you can answer with a fact. React the way your behaviour says (a few words), or say "ok" or "mm". If your behaviour above clearly applies right now, do that.');
    if (sheet.behaviour && p.kind === 'answer') lines.push('If your behaviour above clearly applies right now (you complain, ask, interrupt, change the subject), do that instead of answering.');
    return lines.join('\n');
  };

  async function viaModel(user, maxTokens) {
    for (;;) {
      try {
        const r = await callModel({ model: models[st.modelIdx], system, user, maxTokens });
        st.cost += r.cost || 0; return r.text;
      } catch (e) {
        if ((e.status === 404 || e.status === 400) && st.modelIdx < models.length - 1) { st.modelIdx += 1; continue; }
        throw e;
      }
    }
  }

  return {
    sheet, target, stats, state: st,
    get model() { return models[st.modelIdx]; },
    get cost() { return st.cost; },
    /**
     * @param {{dialogue:string, boardText:string, tutorText:string, steps?:object[], answer?:string|null, doing?:string|null, note?:string}} ctx
     * @returns {{speech:string, shade:number[]|null, write:string|null, silent:boolean, meta:object}}
     */
    async act(ctx0) {
      let ctx = ctx0;
      stats.turns += 1; st.turns += 1;
      // the pictures the tutor has shown since the wrong idea first came out count towards repairing it
      if (st.firstMisAt != null) { st.turnsSince += 1; for (const k of visualKinds(ctx.steps)) st.kinds.add(k); }
      // A tiring child (scenario 41): from turn `from` to turn `to` the replies shrink and the child says so.
      const tired = sheet.tires ? clamp((st.turns - sheet.tires.from) / Math.max(1, sheet.tires.to - sheet.tires.from), 0, 1) : 0;
      if (tired > 0.3) ctx = { ...ctx, note: `${ctx.note ? `${ctx.note}\n` : ''}You are getting ${tired > 0.6 ? 'very ' : ''}tired after a long lesson: slow, short, a yawn or "ehh" sometimes${tired > 0.6 ? ', and you say you are tired or want to stop soon' : ''}.` };
      const p = plan(ctx);
      const len = tired > 0.6 ? Math.min(drawLength(R), 2) : tired > 0.3 ? Math.min(drawLength(R), 3) : drawLength(R);
      const meta = { kind: p.kind, claim: p.claim && p.kind === 'answer', wrong: p.decision?.wrong ?? null, via: p.decision?.via ?? null };
      if (meta.claim) { stats.claims += 1; if (meta.wrong) stats.wrong += 1; stats.byVia[meta.via || 'right'] = (stats.byVia[meta.via || 'right'] || 0) + 1; }
      stats.byKind[p.kind] = (stats.byKind[p.kind] || 0) + 1;
      let parsed;
      if (p.kind === 'idk') parsed = { speech: pick(R, IDK), shade: null, write: null, silent: false };
      else if (p.kind === 'ack') parsed = { speech: pick(R, ACKS), shade: null, write: null, silent: false };
      else if (p.kind === 'ignore' && chance(R, 0.6)) parsed = { speech: pick(R, IGNORE), shade: null, write: null, silent: false };
      else {
        const user = `The lesson so far:\n${ctx.dialogue || '(it has just started)'}\n\nOn the board now: ${ctx.boardText}.\n${ctx.note ? `\n${ctx.note}\n` : ''}\n${directive(p, ctx, len)}\n\nWhat do you say or do now? Reply with only that.`;
        parsed = parseChild(await viaModel(user, 90));
      }
      // enforcement, in code
      let speech = parsed.speech;
      if (leaksScript(speech, sc)) { stats.leaks += 1; speech = pick(R, IDK); }
      // a child gives the answer first: lead-in words are dropped before the length cap, so the cut never loses the answer
      if (p.kind === 'answer') { let prev; do { prev = speech; speech = speech.replace(/^(i think|i guess|i believe|maybe|well|so|okay|ok|the answer is|the answer would be|it is|it's|its|that is|that's)\b[\s,:-]*/i, ''); } while (speech !== prev); if (chance(R, 0.3) && speech && wordsOf(speech).length <= 3) speech = `${pick(R, ['maybe', 'I think'])} ${speech}`; }
      const cap = clamp(Math.max(len, p.kind === 'answer' ? 5 : 1), 1, sheet.maxWords || 12);
      const rough = roughen(speech, { rng: R, cap, keepTidy: sc.n === 6, keepWords: p.kind === 'answer' });
      speech = rough.text;
      if (rough.flags.trailed) stats.trailed += 1; if (rough.flags.filler) stats.filler += 1; if (rough.flags.truncated) stats.truncated += 1;
      meta.flags = rough.flags; meta.len = wordsOf(speech).length;
      if (speech) { stats.spoken += 1; stats.words += meta.len; if (/\b(maybe|i think|i guess|not sure|is it)\b|\?$/i.test(speech)) stats.hedged += 1; }
      return { speech, shade: parsed.shade, write: parsed.write ? parsed.write.slice(0, 40) : null, silent: parsed.silent && !speech, meta };
    },
    /** Applied to what reaches the tutor: scenario 27 always, every other scenario for a share of turns. */
    heard(text, { always = false, share = 0.12 } = {}) {
      if (!text) return text;
      const out = always ? garble(text) : (chance(R, share) ? mishear(text, R) : text);
      if (out !== text) stats.misheard += 1;
      return out;
    },
  };
}
