// ============================================================================
// THE PROBE BANK: questions the tutor can ask that the app marks itself.
//
// Drawn from HOREB's Grade 5 fraction families, the same way school homework
// draws them (src/school/homework.js: familiesForSkill, toItem, withSeed), so
// every wrong answer already names the misconception it reveals. When a child
// is wrong, the tutor picks a follow-up from here whose wrong answers separate
// the misconceptions it suspects, and the server marks the reply: the model is
// never trusted to mark.
//
// Server-side only (the family bank is large); the browser never sees answers.
// ============================================================================
import { familiesForSkill, toItem, withSeed, markItem } from '../school/homework.js';
import { drawFamily } from '../ai-tutor/content/families/core.js';

export { markItem };

const isReviewed = (f) => f.core === true || f.reviewed === true;
const fitsBoard = (it) => !it.table && !it.steps_shown && (it.kind === 'typed' || (it.kind === 'choice' && it.options.length <= 4));

/**
 * Up to `max` items for these skills (the target first), one per family,
 * reviewed families first. Seeded, so the same session turn always draws the
 * same questions. Each item: { bank:'p1', cskill, kind, question, answer,
 * accepts, wrong:[{value,mis}] | options:[{key,text,right,mis}] }.
 */
export function probeBank(skills, seed, { max = 8, perSkill = 3 } = {}) {
  const out = [];
  for (const c of skills) {
    const fams = [...familiesForSkill(c)].sort((a, b) => Number(isReviewed(b)) - Number(isReviewed(a)));
    let taken = 0;
    for (const f of fams) {
      if (out.length >= max || taken >= perSkill) break;
      let it;
      try { it = toItem(withSeed(`${seed}:${f.id}`, () => drawFamily(f).p), out.length + 1); } catch { continue; }
      if (!fitsBoard(it) || String(it.question).length > 220) continue;
      out.push({ ...it, bank: `p${out.length + 1}`, reviewed: isReviewed(f) });
      taken += 1;
    }
  }
  return out;
}

/** One line per item for the model. */
export const bankLines = (bank) => bank.map((it) => {
  const mis = it.kind === 'choice'
    ? it.options.map((o) => `${o.key}) ${o.text}${o.right ? ' [right]' : o.mis ? ` -> ${o.mis.split('.').pop()}` : ''}`).join('; ')
    : `answer ${it.answer}; wrong: ${(it.wrong || []).filter((w) => w.mis).map((w) => `${w.value} -> ${w.mis.split('.').pop()}`).join(', ') || 'none tagged'}`;
  return `${it.bank} [${it.cskill.split('.').pop()}, ${it.kind}] ${it.question} | ${mis}`;
});

export default { probeBank, bankLines, markItem };
