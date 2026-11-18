// ============================================================================
// SCIENCE DEPTH PASS (owner, 18 Nov 2026: every subject to the Grade 5 Maths standard; Tuta Workspace/HOREB_MAPPING_PLAN.md).
// Science and Technology Grades 4-6 and Integrated Science Grades 7-9 are first built by their own scripts
// (scripts/build-science-g4.mjs ... scripts/build-integratedscience-g9.mjs). Each then calls applyDepth() with
// scripts/data/science-depth/g<N>-*.mjs, which adds on top of what exists:
//   pre    { SKILL: [[ref, reason, strength?], ...] }  more prerequisites. ref is a full code (a skill of any Science,
//          Integrated Science or Mathematics grade, or a Grade 1-3 Environmental Activities outcome) or a skill key of this grade
//   mis    [[skill, short, error, question, wrong, right, cause, help, feedback, source?], ...]  more misconceptions
//   fix    { SHORT: [cause, help] }  a real cause and repair for an older misconception that had a stock line
//   (review marks in scripts/data/science-depth/reviews.json are put back on their misconceptions every build)
//   pack   { SKILL: { key_step, floor, reps, steps, contexts, board, mis, checks } }  the teaching pack entry, written to
//          curriculum/<dir>/teaching/g<N>/<number>-<name>.json with the Maths rules (scripts/maths-teaching-pack-file.mjs)
// A sub-strand's entry: { key, packNotes, pre, mis, fix, pack }. Everything stays proposed or draft until a teacher reviews it.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { packEntries, packFileText } from './maths-teaching-pack-file.mjs';

const ROOT = new URL('../', import.meta.url);
const J = (f) => JSON.parse(readFileSync(new URL(`curriculum/${f}.json`, ROOT), 'utf8'));
const fail = (m) => { throw new Error(m); };
const FILES = ['science/g4', 'science/g5', 'science/g6', 'integrated_science/g7', 'integrated_science/g8', 'integrated_science/g9',
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `mathematics/g${n}`), 'environmental_activities/g1', 'environmental_activities/g2', 'environmental_activities/g3'];

function knownCodes() {
  const skills = new Set(), outcomes = new Set();
  for (const f of FILES) {
    let d; try { d = J(f); } catch { continue; }
    for (const s of d.sub_strands) { for (const k of s.skills || []) skills.add(k.code); for (const o of s.outcomes) outcomes.add(o.code); }
  }
  return { skills, outcomes };
}

// Review marks from the blind reviews of 13 Nov 2026 (Science G4 and G6, Integrated Science G7), kept by misconception code so a
// rebuild never drops them; scripts/build-subject-map.mjs carries them into engine/data/curriculum/<subject>.g<N>.misconceptions.json.
const REVIEWS = JSON.parse(readFileSync(new URL('scripts/data/science-depth/reviews.json', ROOT), 'utf8'));
const SUBJECT = { science: 'Science and Technology', integrated_science: 'Integrated Science' };

// g: the grade's JSON after its own build; depth: the sub-strand entries; dir: 'science' | 'integrated_science'.
export function applyDepth(g, depth, { dir, grade, prefix }) {
  const reviewer = `a CBC ${SUBJECT[dir]} teacher`;
  const TC = `To confirm by ${reviewer}: a common classroom error, not traced to a study by the author.`;
  const { skills: KNOWN, outcomes: OUTS } = knownCodes();
  for (const s of g.sub_strands) for (const k of s.skills || []) KNOWN.add(k.code);
  const byKey = new Map();
  for (const s of g.sub_strands) for (const k of s.skills || []) {
    const key = k.code.slice(s.code.length + 1);
    if (byKey.has(key)) fail(`two skills share the key ${key}`);
    byKey.set(key, { s, k });
  }
  const shorts = new Set(g.sub_strands.flatMap(s => (s.misconceptions || []).map(m => m.code.slice(m.skill.length + 1))));
  const entries = new Map(depth.map(d => [d.key, d]));
  for (const k of entries.keys()) if (!g.sub_strands.some(s => s.code === `${prefix}${k}`)) fail(`depth for unknown sub-strand ${k}`);
  const packDir = new URL(`curriculum/${dir}/teaching/g${grade}/`, ROOT);
  mkdirSync(packDir, { recursive: true });
  const written = new Set();
  let added = { pre: 0, mis: 0, fix: 0, pack: 0 };
  let lastNumber = '0.0';
  for (const s of g.sub_strands) {
    const number = s.number || `${lastNumber}b`; lastNumber = s.number || lastNumber;
    const d = entries.get(s.code.slice(prefix.length));
    if (!d) continue;
    const mine = new Map((s.skills || []).map(k => [k.code.slice(s.code.length + 1), k]));
    for (const [key, list] of Object.entries(d.pre || {})) {
      const k = mine.get(key) || fail(`${s.code}: prerequisites for unknown skill ${key}`);
      for (const [ref, reason, strength] of list) {
        const requires = ref.includes('.') ? ref : (byKey.get(ref)?.k.code || fail(`${k.code}: unknown skill key ${ref}`));
        const kind = KNOWN.has(requires) ? 'skill' : OUTS.has(requires) ? 'outcome' : fail(`${k.code}: unknown prerequisite ${requires}`);
        if (requires === k.code) fail(`${k.code}: requires itself`);
        if (k.prerequisites.some(p => p.requires === requires)) fail(`${k.code}: prerequisite ${requires} twice`);
        if (!reason || reason.length < 15) fail(`${k.code}: give a reason for ${requires}`);
        k.prerequisites.push({ requires, kind, strength: strength || 'essential', reason: `${reason} Proposed, to confirm by ${reviewer}.`, status: 'proposed' });
        added.pre++;
      }
    }
    for (const [short, [cause, help]] of Object.entries(d.fix || {})) {
      const m = s.misconceptions.find(x => x.code.endsWith(`.${short}`)) || fail(`${s.code}: fix for unknown misconception ${short}`);
      m.cause = cause; m.help = help; added.fix++;
    }
    for (const [key, short, error, question, wrong, right, cause, help, feedback, source] of d.mis || []) {
      const k = mine.get(key) || fail(`${s.code}: misconception ${short} for unknown skill ${key}`);
      if (shorts.has(short)) fail(`duplicate misconception ${short}`);
      if (wrong === right) fail(`${short}: the wrong answer is the right one`);
      if (/—/.test(feedback)) fail(`${short}: em dash in what a child reads`);
      shorts.add(short);
      s.misconceptions.push({ code: `${k.code}.${short}`, skill: k.code, error, example: { question, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || TC, status: 'draft' });
      added.mis++;
    }
    if (d.pack) {
      const suffixes = [...mine.keys()];
      const pack = Object.fromEntries(Object.entries(d.pack).map(([key, p]) => [key, { ...p, mis: p.mis }]));
      for (const key of Object.keys(pack)) if (!mine.has(key)) fail(`${s.code}: teaching pack for unknown skill ${key}`);
      const file = `${number}-${s.sub_strand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`;
      const status = `draft: written 18 Nov 2026 offline for Grade ${grade} ${SUBJECT[dir]}; not yet checked by ${reviewer}; not loaded by the live tutor`;
      writeFileSync(new URL(file, packDir), packFileText(s, packEntries(s, suffixes, pack), status, d.packNotes));
      written.add(file); added.pack += suffixes.length;
    }
  }
  for (const s of g.sub_strands) for (const m of s.misconceptions || []) if (REVIEWS[m.code]) m.review = REVIEWS[m.code];
  for (const f of readdirSync(packDir)) if (f.endsWith('.json') && !written.has(f)) unlinkSync(new URL(f, packDir));
  const all = g.sub_strands.flatMap(s => s.skills || []);
  g.totals = { ...g.totals, skills: all.length, prerequisites: all.reduce((n, k) => n + k.prerequisites.length, 0), misconceptions: g.sub_strands.reduce((n, s) => n + (s.misconceptions || []).length, 0) };
  return { ...added, subs: entries.size, of: g.sub_strands.length };
}
