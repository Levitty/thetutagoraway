// ============================================================================
// AGRICULTURE DEPTH PASS (owner, 18 Nov 2026: every subject to the Grade 5 Maths standard; Tuta Workspace/HOREB_MAPPING_PLAN.md).
// Agriculture Grades 4-8 are first built by their own scripts (scripts/build-agriculture-g<N>.mjs, data in
// scripts/data/agriculture-g<N>-skills.mjs): the skills and misconception codes the 12-13 Nov families already use. Grade 9 had
// outcomes only. This adds, on top, from scripts/data/agriculture-depth/g<N>.mjs, one entry per sub-strand:
//   add     [[KEY, name, letters, question_forms, mastery], ...]  new skills (an outcome with no skill, or the know-how half of a
//           practical outcome). They have no question family yet: no_family, listed in families/agriculture_g<N>_awaiting.js
//   extend  { KEY: [letters] }  more official outcomes for a first-pass skill
//   rubric  { KEY: 'the practical' }  the practical half of a skill is marked by the teacher with the KICD rubric indicator; the
//           app asks only the knowledge half (as Science and Kiswahili do for practical, oral and written outcomes)
//   fix     { SHORT: { error?, cause?, help?, example? } }  a real cause and repair (and, where the 13 Nov line was wrong, the
//           example) for a first-pass misconception
//   pre, mis, pack, packNotes  as scripts/science-depth.mjs (pack entries derive a misconception's listen-for, ask and repair
//           from the library unless written out)
// then calls applyDepth (scripts/science-depth.mjs). Everything stays proposed or draft until an Agriculture teacher reviews it.
// ============================================================================
import { applyDepth } from './science-depth.mjs';

const fail = (m) => { throw new Error(`agriculture depth: ${m}`); };
const EVIDENCE = ' Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.';

export function applyAgricultureDepth(g, SUBS, { grade }) {
  const P = `AGRI.G${grade}.`;
  for (const d of SUBS) {
    const s = g.sub_strands.find(x => x.code === `${P}${d.key}`) || fail(`no sub-strand ${d.key}`);
    s.skills ||= []; s.misconceptions ||= [];
    const letter = (l, key) => (s.outcomes.find(o => o.letter === l) || fail(`${s.code}.${key}: no outcome ${l}`)).code;
    for (const [key, name, letters, forms, mastery] of d.add || []) {
      const code = `${s.code}.${key}`;
      if (s.skills.some(k => k.code === code)) fail(`${code} exists`);
      if (!mastery || mastery.length < 60) fail(`${code}: mastery too thin`);
      s.skills.push({ code, name, outcomes: letters.map(l => letter(l, key)), mastery: mastery + EVIDENCE, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites: [], no_family: true, status: 'proposed' });
    }
    const skill = (key) => s.skills.find(k => k.code === `${s.code}.${key}`) || fail(`${s.code}: unknown skill ${key}`);
    for (const [key, letters] of Object.entries(d.extend || {})) {
      const k = skill(key);
      for (const l of letters) { const c = letter(l, key); if (k.outcomes.includes(c)) fail(`${k.code}: already has ${l}`); k.outcomes.push(c); }
    }
    for (const [key, what] of Object.entries(d.rubric || {})) {
      const k = skill(key);
      const line = ` The practical (${what}) is marked by the teacher with the KICD rubric indicator; the app asks only the knowledge half.`;
      k.mastery = k.mastery.includes(' Evidence rule:') ? k.mastery.replace(' Evidence rule:', `${line} Evidence rule:`) : k.mastery + line;
      k.assessed_by = 'teacher marks the practical with the KICD rubric';
    }
    for (const [short, f] of Object.entries(d.fix || {})) {
      const m = s.misconceptions.find(x => x.code.endsWith(`.${short}`)) || fail(`${s.code}: fix for unknown misconception ${short}`);
      for (const k of Object.keys(f)) if (!['error', 'cause', 'help', 'example', 'feedback'].includes(k)) fail(`${short}: unknown fix field ${k}`);
      if (f.example) m.example = { ...m.example, ...f.example };
      if (f.feedback) m.feedback = f.feedback;
      if (f.example?.wrong_answer) m.reveals = `Offer "${m.example.wrong_answer}" next to the right answer and ask the question again in a new situation.`;
    }
  }
  const depth = SUBS.map(d => ({ ...d, fix: Object.fromEntries(Object.entries(d.fix || {}).map(([k, f]) => [k, { error: f.error, cause: f.cause, help: f.help }])) }));
  const r = applyDepth(g, depth, { dir: 'agriculture', grade, prefix: P, derive: true });
  for (const s of g.sub_strands) for (const k of s.skills || []) if (!k.prerequisites.length) fail(`${k.code}: no prerequisites`);
  return r;
}
