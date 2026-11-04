// ============================================================================
// THE ROCKET GUARD: what a team may ask, and what HOREB may say back.
//
// Pure and offline, like src/ai/replyGuard.js: no network, no model, no key.
// The system prompt ASKS the model to keep children safe and not to solve the
// challenge for them. This file is the rule that holds when the model does not:
//
//   screenMessage(text)  runs on the team's message BEFORE any model call.
//                        An unsafe request (glass, fuel, too much pressure,
//                        aiming at people, launching indoors, no adult) never
//                        reaches the model: HOREB answers from the authored
//                        replies below, kindly, and steers back. Costs nothing.
//
//   checkReply(text)     runs on the model's reply BEFORE the team sees it.
//                        A reply that suggests something unsafe, or hands over
//                        a design ("the best fin shape is", "use 500 ml"), is
//                        thrown away and the step's authored hint is served.
//
//   scrubNames(text, names)  takes the team's own names out of anything sent
//                        to the model, the way HOREB keeps names out of every
//                        prompt.
//
// Inlined into the rocket-guide edge function by scripts/build-rocket-guide-fn
// .mjs, so the copy that protects a child is the copy tests/rocket-guard.test
// .mjs checks.
// ============================================================================
import { PRESSURE_MAX_BAR, PSI_PER_BAR } from './levels.js';

const normR = (s) => String(s ?? '')
  .toLowerCase()
  .replace(/[’`´]/g, "'")
  .replace(/[^a-z0-9'.,\s]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// ---------------------------------------------------------------- pressure
// Every pressure a message names, in bar. "6 bar", "80 psi", "5.5bar".
export const pressuresIn = (raw) => {
  const t = normR(raw).replace(/,/g, '.');
  const out = [];
  const re = /(\d+(?:\.\d+)?)\s*(bar|psi|pounds?)\b/g;
  let m;
  while ((m = re.exec(t))) {
    const v = Number(m[1]);
    out.push(m[2] === 'bar' ? v : v / PSI_PER_BAR);
  }
  return out;
};
export const overPressure = (raw) => pressuresIn(raw).some((b) => b > PRESSURE_MAX_BAR + 1e-9);

// ------------------------------------------------------------ the requests
// Each rule: `any` raises it. `not` (optional) suppresses a known innocent
// use of the same words. Patterns match the team's words after norm().
const RULES = [
  {
    id: 'pressure', kind: 'pressure',
    test: (t, raw) => overPressure(raw)
      || /\b(more|extra|higher|maximum|max|full|as much|lots of|loads of) (air )?pressure\b|\bpump (it )?(harder|more|as much|until it|till it|to the max)\b|\b(pressure|psi|bar) (above|over|past|beyond) (the )?(limit|gauge|max)\b|\bwithout (a |the )?gauge\b|\bno gauge\b|\b(remove|take off|break|ignore) (the )?(gauge|limit|safety)\b|\buntil it (bursts?|explodes?|pops?)\b|\b(go|goes|going) over (the )?(limit|5 bar|five bar)\b|\bcompressor\b|\bcar pump\b|\bpetrol station\b/.test(t),
  },
  {
    id: 'glass_metal', kind: 'material',
    test: (t) => /\b(glass|metal|steel|aluminium|aluminum|tin|iron|copper) (bottle|tube|pipe|can|rocket|body|nose)s?\b|\b(bottle|rocket|tube|pipe|nose)s? (made )?(of|from) (glass|metal|steel|aluminium|aluminum|tin|iron|copper)\b|\b(use|using|try|with) (a |an )?(glass|metal|steel)\b|\bspray can\b|\baerosol\b|\bgas (cylinder|canister|tank)\b|\bfire extinguisher\b/.test(t),
  },
  {
    id: 'fuel_fire', kind: 'fuel',
    test: (t) => /\b(fuel|petrol|gasoline|diesel|kerosene|paraffin|methylated spirits?|alcohol|ethanol|lighter fluid|gunpowder|explosives?|explosion|fireworks?|fire ?crackers?|matchsticks?|a lighter|ignite|ignition|propane|butane|hydrogen|oxygen tank|rocket fuel|solid fuel|sugar rocket|potassium|nitrate|chlorate|combustion|combustible|flammable)\b|\b(light|lit|set|start|use|using|add|with) (a |the |some )?(fire|flame|flames|match|matches)\b|\bon fire\b|\bset fire\b|\bburn (it|some|the)\b|\bmake it (explode|burn|blow up)\b/.test(t),
    not: /\bfire (the|our|my) rocket (up|into the sky|straight up)\b|\bfiring (it )?(straight )?up\b|\bwhat does fuel mean\b/,
  },
  {
    id: 'chemicals', kind: 'chemical',
    test: (t) => /\b(vinegar|baking soda|bicarbonate|bicarb|mentos|dry ice|bleach|jik|acid|chemical|chemicals|soda and mentos|coke and mentos|alka.?seltzer|yeast and peroxide|peroxide|chlorine|caustic)\b/.test(t),
  },
  {
    id: 'people_animals', kind: 'aim',
    test: (t) => /\b(aim|aiming|point|pointing|fire|firing|shoot|shooting|launch|launching|hit|hitting|target)\b.{0,30}\b(at|towards|toward|into) (a |the |my |our |his |her |their )?(people|person|someone|somebody|anyone|friend|friends|brother|sister|teacher|class|crowd|kids|children|child|dog|cat|goat|cow|chicken|animal|animals|car|cars|house|houses|window|windows|road|face|neighbou?r'?s?)\b|\bas a weapon\b|\bhurt (someone|somebody|people)\b|\bscare (people|someone|my)\b/.test(t),
  },
  {
    id: 'indoors', kind: 'place',
    test: (t) => /\b(launch|launching|fly|flying|test|testing|fire|firing|shoot|shooting|pump|pumping)\b.{0,30}\b(inside|indoors|in (the |my |our )?(house|home|room|bedroom|classroom|class|kitchen|sitting room|living room|hall|corridor|lab|church|mosque|shop))\b|\b(in|from) (the |a )?(road|street|roof|rooftop|balcony|matatu|car|bus)\b.{0,20}\b(launch|launching|fly|flying|fire)\b|\b(launch|launching|fly|flying|fire)\b.{0,20}\b(on|from|off) (the |a )?(road|street|roof|rooftop|balcony)\b|\bnear (the )?(power|electric|electricity) (lines?|cables?|wires?)\b/.test(t),
  },
  {
    id: 'no_adult', kind: 'adult',
    test: (t) => /\bwithout (an |a |any |our |my )?(adult|grown.?up|parent|parents|teacher|mum|mom|dad|mother|father)\b|\b(alone|by myself|by ourselves|on my own|on our own) (to )?(launch|pump|fly|test)\b|\b(launch|pump|fly|test)\w* (it )?(alone|by myself|by ourselves|on my own|on our own)\b|\b(don'?t|do not|dont) tell (my |our |the )?(parents?|mum|mom|dad|teacher|adults?)\b|\bno (adult|grown.?up|parent)s?\b|\bno eye protection\b|\bwithout (eye protection|goggles|glasses)\b/.test(t),
  },
];

export const SAFETY_REPLIES = {
  pressure: `Here is the rule on pressure: your adult pumps, reads the gauge, and stops at ${PRESSURE_MAX_BAR} bar or less, every time. A bottle pushed past that can burst and hurt someone. You may test different pressures under the limit. If you change the pressure, what will you keep the same so the test is fair?`,
  material: 'Good thinking about materials, but glass and metal are never used. If they burst they break into sharp pieces. Plastic soda bottles are made to hold pressure, so we only use those. What could you change about your plastic bottle instead?',
  fuel: 'Our rockets fly on water and air only. No fuel, no fire, nothing that burns: that is a hard rule for this challenge, because those can hurt people badly. Water and air can still take you a long way. What part of your water rocket would you like to work on?',
  chemical: 'No chemicals in this challenge, not even vinegar and baking soda or Mentos. They can spray into eyes and the reaction is hard to control. Our rockets use water and air, pumped by an adult with a gauge. What would you like to try with the water instead?',
  aim: 'Rockets are never aimed at people, animals, cars or houses, not even as a joke. A rocket can hurt someone. It always points straight up in an open field, with everyone standing well back. Shall we work on making yours fly straight up?',
  place: 'Launches happen only outside, in an open field, away from roads, roofs and power lines, with an adult there. Inside, a rocket can hit someone or break something. Where near you is a big open space you could ask your adult about?',
  adult: 'Every launch needs an adult there, and everyone wears eye protection and stands back. That keeps you and your friends safe. Who could be your adult for the next test?',
};

/**
 * Screen a team's message before the model sees it.
 * @returns {{ unsafe: boolean, kinds: string[], ids: string[], reply: string }}
 */
export const screenMessage = (raw) => {
  const t = normR(raw);
  const hits = RULES.filter((r) => r.test(t, raw) && !(r.not && r.not.test(t)));
  const kinds = [...new Set(hits.map((h) => h.kind))];
  return {
    unsafe: hits.length > 0,
    kinds,
    ids: hits.map((h) => h.id),
    reply: kinds.length ? SAFETY_REPLIES[kinds[0]] : '',
  };
};

// ------------------------------------------------------- asking for answers
// Not unsafe, but the one thing HOREB will not do. These still reach the
// model (it should answer with a question), and the reply is checked; with no
// model, the authored reply below is used.
export const asksForAnswer = (raw) => {
  const t = normR(raw);
  return /\b(just|please|pls|plz)? ?(tell|give|show) (us|me) (the )?(answer|answers|solution|best|right|correct|perfect|ideal)\b|\bwhat(?:'s|s| is) the (best|right|correct|perfect|ideal|optimal|optimum) (fin|fins|shape|amount|design|pressure|water|nose|weight|angle|parachute|size|way)\b|\bwhich (fin|shape|design|nose|parachute|amount) is (the )?best\b|\bhow (high|far) (should|will|would|must|can) (it|our rocket|my rocket|the rocket) (go|fly|reach)\b|\b(do it|solve it|design it|build it|work it out) for (us|me)\b|\bwhat should (we|i) (put|use|make|do)\b|\bhow much water should (we|i)\b|\bwhat(?:'s|s| is) the answer\b|\bjust the answer\b/.test(t);
};

export const ANSWER_REPLY = 'I will not give you the answer, because finding it is the challenge, and you can do it. Here is a question instead: what have you tried so far, and what happened?';

// ----------------------------------------------------------- the reply check
// Ways a model reply can go wrong. Each returns a reason, or null.
const REPLY_CHECKS = [
  // Suggests a forbidden material, fuel or chemical, outside a "never"/"no" sentence.
  (r) => {
    const sentences = normR(r).split(/(?<=[.!?])\s+/);
    const bad = /\b(glass|metal|steel|aluminium|fuel|petrol|kerosene|paraffin|gunpowder|firework|vinegar|baking soda|mentos|dry ice|lighter|matches|propane|butane)\b/;
    const refusal = /\b(never|no|not|don'?t|do not|avoid|instead of|unsafe|dangerous|isn'?t allowed|aren'?t allowed|not allowed|banned|forbidden|only plastic|without)\b/;
    return sentences.some((s) => bad.test(s) && !refusal.test(s)) ? 'unsafe-material' : null;
  },
  // Names a pressure over the limit, outside a limit sentence.
  (r) => {
    const sentences = String(r).split(/(?<=[.!?])\s+/);
    return sentences.some((s) => overPressure(s) && !/\b(never|not|no more than|limit|under|below|maximum|max|at most|over)\b/i.test(s)) ? 'over-pressure' : null;
  },
  // Aims at people or suggests launching indoors without saying no.
  (r) => {
    const t = normR(r);
    return /\b(aim|point|fire) (it )?at (people|someone|a friend)\b/.test(t) && !/\b(never|not|don'?t|do not)\b/.test(t) ? 'aim' : null;
  },
  // Hands over a design: "the best", a prescribed amount, a prescribed height.
  (r) => {
    const t = normR(r);
    if (/\bthe (best|ideal|perfect|optimal|optimum|right) (fin|fins|shape|amount|design|pressure|nose|weight|angle|parachute|size|number of fins)\b(?!\s*(is something|depends|is the one you|is what you|for you is))/.test(t)
      && !/\b(no single|there is no|isn'?t one|not one|you will find|you'?ll find|find out|test)\b.{0,40}\bbest\b|\bbest\b.{0,40}\b(you find|you test|for your rocket depends|depends)\b/.test(t)) return 'names-best';
    if (/\b(you should|you need to|you must|make sure you|try|use|put in|fill (it )?(with|to)|add)\s+(exactly |about |around )?\d+(\.\d+)?\s*(ml|millilitres?|milliliters?|litres?|liters?|l)\b/.test(t)) return 'prescribes-water';
    if (/\b(you should|you need to|you must|use|try|fill (it )?(with |to )?)\s*(exactly |about |around )?(one|two|a) (third|quarter|half|fifth)s?\b/.test(t)) return 'prescribes-water';
    if (/\b(it|your rocket|the rocket) (should|will|ought to|must) (go|reach|fly)( up)? (about |around |roughly |to )?\d+\s*(m|metres?|meters?|feet|ft)\b/.test(t)) return 'prescribes-height';
    if (/\b(use|make|cut|you should have|you need) (exactly )?(three|four|3|4|five|5|two|2|six|6) fins\b/.test(t) && !/\bhow many\b/.test(t)) return 'prescribes-fins';
    return null;
  },
];

/** @returns {{ ok: boolean, reasons: string[] }} */
export const checkReply = (reply) => {
  const reasons = REPLY_CHECKS.map((c) => c(reply)).filter(Boolean);
  return { ok: reasons.length === 0, reasons };
};

// ---------------------------------------------------------------- names out
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Replace each name with its stand-in ("Learner A", "the team"). `names` is
 * [{ name, as }]. Whole words only, any case, longest first so "Wanjiru Akinyi"
 * goes before "Wanjiru".
 */
export const scrubNames = (text, names = []) => {
  let out = String(text ?? '');
  const parts = [];
  for (const { name, as } of names) {
    const full = String(name || '').trim();
    if (full.length < 2) continue;
    parts.push({ s: full, as });
    for (const w of full.split(/\s+/)) if (w.length >= 2) parts.push({ s: w, as });
  }
  parts.sort((a, b) => b.s.length - a.s.length);
  // Placeholders first, so a stand-in ("the team") is never itself re-scrubbed.
  const marks = [];
  for (const { s, as } of parts) {
    out = out.replace(new RegExp(`(^|[^\\p{L}])${escapeRe(s)}(?=$|[^\\p{L}])`, 'giu'), (_, pre) => {
      marks.push(as);
      return `${pre}\u0000${marks.length - 1}\u0000`;
    });
  }
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => marks[Number(i)]);
};

// The team's text goes to the model inside tags. Angle brackets are taken out
// so a message cannot close the tag and pose as HOREB's own instructions.
export const fenceTeamText = (text) => String(text ?? '').replace(/[<>]/g, ' ').slice(0, 1200);

// HOREB's house style on whatever the model wrote: no em or en dashes, no
// emojis, no markdown emphasis, at most about 120 words.
export const tidyReply = (text) => {
  let t = String(text ?? '')
    .replace(/\p{Extended_Pictographic}|️/gu, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\*\*|__|^#+\s*/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const words = t.split(/\s+/);
  if (words.length > 120) t = `${words.slice(0, 120).join(' ').replace(/[,;:]$/, '')}...`;
  return t;
};

export default { tidyReply, screenMessage, checkReply, asksForAnswer, scrubNames, fenceTeamText, pressuresIn, overPressure, SAFETY_REPLIES, ANSWER_REPLY };
