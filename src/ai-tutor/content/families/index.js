// ============================================================================
// THE FAMILY BANK: one list, read by generateRaw in problemGenerators.js.
//
// familyDraw(skillId, opts) returns a problem, or null to say "use the skill's
// own generator". With no family switched on for a skill it returns null
// without touching Math.random, so existing questions come out exactly as
// before (tests/question-snapshot.test.mjs proves it, skill by skill).
//
// A family marked `core` is part of a skill's own content, on for everybody:
// these are the 18 mislabelled skills, whose old questions asked the wrong
// thing. Every other family waits for `reviewed: true`.
// ============================================================================
import { isOn, serveFamily } from './core.js';
import { CORE_FAMILIES, REPLACED_SKILLS } from './labelFixes.js';
import { GRADE_FAMILIES } from './bank.js';

export const FAMILIES = [...CORE_FAMILIES, ...GRADE_FAMILIES];
const BY_SKILL = new Map();
for (const f of FAMILIES) {
  if (!BY_SKILL.has(f.skill)) BY_SKILL.set(f.skill, []);
  BY_SKILL.get(f.skill).push(f);
}
export const familiesFor = (skillId) => BY_SKILL.get(skillId) || [];
export const FAMILY_SKILLS = () => [...BY_SKILL.keys()];
export { REPLACED_SKILLS };

// Half of a skill's own practice, so the skill's plain drill is not lost.
export const FAMILY_SHARE = 0.5;

// Reasoning waits until the child has answered this skill right twice: see the
// right method first, then judge a wrong one (Booth 2013; specialItems.js).
// Harder rungs open as the child gets more right. Screens other than the
// lesson (diagnostic, memory check) draw no working or step-marked questions,
// because only the lesson screen can show them.
const eligible = (f, opts) => {
  const lesson = opts.lesson === true;
  const right = opts.correctSoFar ?? 0;
  const form = f.form;
  if ((form === 'spot' || form === 'steps') && !lesson) return false;
  if ((form === 'spot' || form === 'why') && right < 2) return false;
  const cap = opts.correctSoFar == null ? 2 : 1 + Math.floor(right / 2);
  return f.rung <= cap;
};

const decks = new Map();   // skill -> shuffled queue, so forms take turns
const next = (skillId, pool) => {
  let deck = decks.get(skillId);
  if (!deck || !deck.length || deck.some(f => !pool.includes(f))) {
    deck = [...pool];
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    decks.set(skillId, deck);
  }
  return deck.pop();
};

export function familyDraw(skillId, opts = {}) {
  const all = BY_SKILL.get(skillId);
  if (!all || opts.noFamilies) return null;
  const on = all.filter(isOn);
  if (!on.length) return null;
  const replaced = REPLACED_SKILLS.has(skillId);
  if (!replaced && Math.random() >= FAMILY_SHARE) return null;
  let pool = on.filter(f => eligible(f, opts));
  if (!pool.length && !replaced) return null;
  // A replaced skill has nothing else to fall back on: its easiest usable rung.
  if (!pool.length) {
    const usable = on.filter(f => f.form !== 'spot' && f.form !== 'steps');
    const low = Math.min(...usable.map(f => f.rung));
    pool = usable.filter(f => f.rung === low);
  }
  return serveFamily(next(skillId, pool));
}
