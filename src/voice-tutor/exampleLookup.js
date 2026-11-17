// ============================================================================
// MATCHED GOOD-TURN EXAMPLES (PLAN_TO_FOUR.md step 5, owner's yes 12 Nov 2026).
//
// The example lessons (docs/tutor-training/EXEMPLARS.md, and the round 2 drafts once ROUND2_ON is true) are cut into
// single turns: the child's line and the tutor's reply, with its moves. Each turn is tagged by the situation it shows:
// the orchestrator rule it fits, the answer class, the child's state (a question, upset, unsure, silent, lost). Each turn,
// the lookup finds the one or two that best match this moment and they go in the turn's context, after the cache
// breakpoint. The evidence for this is thin (FINDINGS_TO_FOUR.md 2.5), so it is an A/B switch: settings.matchedExamples,
// off unless VOICE_TUTOR_MATCHED_EXAMPLES=1. With round 2 on, its bad-and-good pairs come with the matched habit.
// Pure. Tested in tests/voice-tutor-habits.test.mjs.
// ============================================================================
import { EXEMPLARS, EXEMPLARS_ROUND2 } from './playbook.js';
import { ROUND2_ON } from './prompt.js';
import { readChild } from './habits.js';
import { soundsLost } from './spokenAnswer.js';

export const MAX_MATCHED = 2;
// Which orchestrator rules a move fits.
const RULES_OF = {
  'Open the lesson': ['open'],
  'Show then hand over': ['stage', 'reteach', 'change', 'prerequisite'],
  'Predict then show': ['stage', 'reteach', 'change'],
  'Count with the child': ['stage', 'reteach', 'prerequisite', 'probe'],
  'Wait and nudge': ['probe', 'thinking'],
  'Smaller-question hint': ['probe', 'lost', 'change', 'prerequisite'],
  'Revoice and build': ['stage', 'question', 'tentative', 'reteach', 'care-return'],
  'Press for reasoning': ['press', 'reason', 'tentative'],
  'Name what was right': ['press', 'fresh-check', 'move-on', 'reason'],
  'Diagnose the wrong answer': ['diagnose'],
  'Check for understanding': ['fresh-check', 'move-on', 'reason'],
  'Celebrate the strategy': ['move-on', 'reason'],
  'Stretch the quick child': ['move-on'],
  'Recover a lost child': ['lost', 'change'],
  'Bring back an off-topic child': ['stage'],
  'Close the lesson': ['close', 'stop'],
  'Answer the child first, then hand back': ['question'],
  'Confirm what you heard': ['question', 'stage'],
  'Let the child draw': ['stage', 'probe'],
  'Silence: task': ['probe'],
};
const moveRules = (m) => {
  const name = Object.keys(RULES_OF).find((k) => m.toLowerCase().startsWith(k.toLowerCase()));
  return name ? RULES_OF[name] : [];
};
const stateOf = (text, { silent = false } = {}) => {
  if (silent) return 'silent';
  const c = readChild(text);
  if (c.distress) return 'upset';
  if (soundsLost(text)) return 'lost';
  if (c.asks || c.why) return 'question';
  if (c.answer && c.hedged) return 'unsure';
  if (c.answer) return 'answer';
  return 'talk';
};

/** The example turns: { child, tutor, moves, rules, cls, state, source }. */
export function exampleIndex({ round2 = ROUND2_ON } = {}) {
  const out = [];
  const texts = [['EXEMPLARS', EXEMPLARS], ...(round2 ? [['EXEMPLARS_ROUND2', EXEMPLARS_ROUND2]] : [])];
  for (const [source, text] of texts) {
    let lastChild = null; let silent = false; let title = '';
    for (const raw of String(text).split('\n')) {
      const l = raw.trim();
      let m;
      if ((m = /^## (.*)$/.exec(l))) { title = m[1]; lastChild = null; silent = false; continue; }
      if ((m = /^Child(?: \([^)]*\))?: (.*)$/.exec(l))) { lastChild = m[1].trim(); silent = false; continue; }
      if (/^\(.*\b(silent|quiet|says nothing|nothing is marked)\b.*\)$/i.test(l)) { silent = true; continue; }
      if ((m = /^Tutor: (.*?)\s*\[([^\]]+)\]\s*$/.exec(l))) {
        const tutor = m[1].trim();
        const moves = m[2].split(';').map((x) => x.trim()).filter(Boolean);
        if (lastChild == null && !silent) continue;
        const child = silent ? '(silent)' : lastChild;
        const state = stateOf(lastChild || '', { silent });
        const has = (x) => moves.some((mv) => mv.toLowerCase().startsWith(x.toLowerCase()));
        const reason = /\b(because|so|each|both|times|cut|same|bigger|smaller)\b/i.test(lastChild || '');
        const cls = has('Diagnose the wrong answer') ? 'misconception' : has('Press for reasoning') && !reason ? 'right_unexplained' : has('Recover a lost child') ? 'guess_or_no_attempt' : reason && has('Name what was right') ? 'understood' : null;
        out.push({ child, tutor, moves, rules: [...new Set(moves.flatMap(moveRules))], cls, state, source, title });
        lastChild = null; silent = false;
      }
    }
  }
  return out;
}

// The round 2 bad-and-good pairs, by the habit they fix.
export function contrastPairs({ round2 = ROUND2_ON } = {}) {
  if (!round2) return [];
  const out = [];
  const lines = String(EXEMPLARS_ROUND2).split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const b = /^\*\*Bad turn \(([^)]*)\):\*\*\s*(.*)$/.exec(lines[i].trim());
    if (!b) continue;
    const g = /^\*\*Good turn:\*\*\s*(.*)$/.exec(String(lines[i + 1] || '').trim());
    if (g) out.push({ habits: b[1].split(/[;,]/).map((x) => x.trim()), bad: b[2], good: g[1] });
  }
  return out;
}

let INDEX = null;
const HABIT_OF_STATE = { question: 'repeats', unsure: 'accepts', answer: 'stock praise', silent: 'gives away', lost: 'repeats', upset: 'repeats' };
/**
 * The example lines for this turn's context: the one or two example turns that best fit the rule, the answer class and
 * the child's state; [] when nothing fits well.
 */
export function exampleLines({ rule = null, cls = null, message = '', probe = null } = {}, { round2 = ROUND2_ON } = {}) {
  if (!rule || ['care', 'care-wait', 'care-return'].includes(rule)) return [];
  INDEX = INDEX && INDEX.round2 === round2 ? INDEX : { round2, list: exampleIndex({ round2 }) };
  const state = probe ? 'silent' : stateOf(message);
  const scored = INDEX.list.map((e) => ({ e, score: (e.rules.includes(rule) ? 3 : 0) + (cls && e.cls === cls ? 2 : 0) + (e.state === state ? 2 : 0) }))
    .filter((x) => x.score >= 4).sort((a, b) => b.score - a.score);
  const picked = [];
  for (const x of scored) { if (picked.length >= MAX_MATCHED) break; if (!picked.some((p) => p.title === x.e.title)) picked.push(x.e); }
  if (!picked.length) return [];
  const L = ['Matched examples (good turns from the example lessons for a moment like this one; the shape, never the words):'];
  for (const e of picked) L.push(`- Child: "${e.child.slice(0, 120)}" Tutor: "${e.tutor.slice(0, 200)}" [${e.moves.join('; ')}]`);
  const habit = HABIT_OF_STATE[state];
  const pair = contrastPairs({ round2 }).find((p) => p.habits.some((h) => h.toLowerCase().includes(habit)));
  if (pair) L.push(`- Bad: ${pair.bad.slice(0, 220)} Good: ${pair.good.slice(0, 220)}`);
  return L;
}

export default { exampleIndex, exampleLines, contrastPairs, MAX_MATCHED };
