// ============================================================================
// ONE GRADE OF ANY SUBJECT TO THE GRADE 5 MATHS STANDARD (owner, 18 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md).
// The depth layer of scripts/build-kiswahili-grade.mjs, written once without the Kiswahili parts so another subject can call it
// (CRE first, 18 Nov 2026: scripts/build-cre-grade.mjs). Kiswahili keeps its own copy for now; it could move here.
// On top of a grade's first-pass JSON (its own build script has merged the skills and misconception codes the families use):
//   NEW    [{ sub, id, name, outcomes, mastery, forms, thinking, ...depth }]  new skills, for testable outcomes that had none
//   DEPTH  { ID: { pre, also, mis, fix, pack } }                             for every first-pass skill, by its last code segment
//     pre   [[ref, reason, strength?]]  ref: 'ID' a skill of this grade, 'G4:ID' a skill of a grade below,
//                                       'G3o:SUB.KEY.a' an official outcome of a grade below (code without the subject prefix)
//     also  ['c', 'OTHER.SUB.c']        more official outcomes for the skill (the code's last segment, e.g. 'a_')
//     mis   [[short, error, question, wrong, right, cause, help, feedback, source?]]  more misconceptions
//     fix   { SHORT: [cause, help] | { error?, cause?, help?, feedback? } }  a real cause and repair for a first-pass misconception
//     pack  { key_step, floor, reps, steps, contexts, board, checks }  the teaching pack entry; each misconception's listen-for,
//           ask and repair are the library's own wrong answer, example question and help (scripts/maths-teaching-pack-file.mjs rules)
//   NOTES  { 'SUB.KEY': text }          the teaching pack file's notes for a sub-strand
// Checks the standard: every sub-strand has a skill, every testable outcome a skill, every skill 2+ prerequisites and 4+
// misconceptions, every misconception an example, cause and repair. Official outcomes are never touched.
// ============================================================================
import { packSlug, packEntries, packFileText } from '../maths-teaching-pack-file.mjs';

// cur: the grade JSON; data: { NEW, DEPTH, NOTES }; o: the subject's rules (see scripts/build-cre-grade.mjs)
//   o.grade, o.subPrefix ('CRE.G4.'), o.skillPrefix ('CRES.G4.'), o.lower(g) -> the JSON of grade g below (or null),
//   o.outcomePrefix(g), o.lowerSkillPrefix(g), o.misPrefix ('M_C4_'), o.taken (short codes used by the subject's other grades),
//   o.notTested (outcomes seen in class, not asked), o.reviewer ('a CRE teacher'), o.masteryRule (a RegExp new skills must match),
//   o.source (the source line of a new misconception without its own)
export function deepenGrade(cur, data, o) {
  const fail = (m) => { throw new Error(`${o.label}: ${m}`); };
  const { NEW = [], DEPTH = {} } = data;
  const subOf = (key) => cur.sub_strands.find(s => s.code === `${o.subPrefix}${key}`) || fail(`no sub-strand ${key}`);
  const subOfSkill = (k) => cur.sub_strands.find(s => s.skills.includes(k));
  const byId = new Map();
  for (const s of cur.sub_strands) for (const k of s.skills) {
    const id = k.code.split('.').pop();
    if (byId.has(id)) fail(`two skills end ${id}`);
    byId.set(id, { k, s });
  }
  const below = {};
  for (let g = 1; g < o.grade; g++) {
    const j = o.lower(g); if (!j) continue;
    below[g] = { skills: new Map(j.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.split('.').pop(), k.code]))), outcomes: new Set(j.sub_strands.flatMap(s => s.outcomes.map(x => x.code))) };
  }
  const shorts = new Set(cur.sub_strands.flatMap(s => s.misconceptions.map(m => m.code.slice(m.skill.length + 1))));
  const outcomeOf = (s, ref) => {
    const i = ref.lastIndexOf('.');
    const sub = i < 0 ? s : subOf(ref.slice(0, i)), tail = i < 0 ? ref : ref.slice(i + 1);
    return (sub.outcomes.find(x => x.code.endsWith(`.${tail}`)) || fail(`no outcome ${ref} for ${s.code}`)).code;
  };

  const work = [];
  for (const n of NEW) {
    const s = subOf(n.sub);
    if (byId.has(n.id)) fail(`new skill ${n.id} already exists`);
    if (!o.masteryRule.test(n.mastery) || n.mastery.length < 60) fail(`${n.id}: the mastery rule must be full and name the evidence rule`);
    const k = { code: `${o.skillPrefix}${n.sub}.${n.id}`, name: n.name, outcomes: n.outcomes.map(x => outcomeOf(s, x)), mastery: n.mastery, question_forms: n.forms, thinking: n.thinking || ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites: [], status: 'proposed' };
    s.skills.push(k); byId.set(n.id, { k, s }); work.push({ k, s, d: n });
  }
  for (const [id, d] of Object.entries(DEPTH)) {
    const hit = byId.get(id) || fail(`depth for unknown skill ${id}`);
    if (work.some(w => w.k === hit.k)) fail(`${id} deepened twice`);
    for (const x of d.also || []) { const c = outcomeOf(hit.s, x); if (!hit.k.outcomes.includes(c)) hit.k.outcomes.push(c); }
    work.push({ ...hit, d });
  }
  for (const s of cur.sub_strands) for (const k of s.skills) if (!work.some(w => w.k === k)) fail(`${k.code} has no depth entry (prerequisites, misconceptions, teaching pack)`);

  const resolve = (r) => {
    const m = /^G(\d)(o?):(.+)$/.exec(r);
    if (m) {
      const g = Number(m[1]), b = below[g] || fail(`prerequisite ${r}: Grade ${g} is not below or has no file`);
      if (m[2]) { const code = `${o.outcomePrefix(g)}${m[3]}`; if (!b.outcomes.has(code)) fail(`unknown Grade ${g} outcome ${code}`); return [code, 'outcome']; }
      return [b.skills.get(m[3]) || fail(`unknown Grade ${g} skill ${m[3]}`), 'skill'];
    }
    return [(byId.get(r) || fail(`unknown Grade ${o.grade} skill ${r}`)).k.code, 'skill'];
  };
  const packs = new Map();   // sub-strand code -> { suffix: pack }
  const added = { pre: 0, mis: 0, fix: 0 };
  for (const { k, s, d } of work) {
    for (const [r, reason, strength] of d.pre || []) {
      const [requires, kind] = resolve(r);
      if (requires === k.code) fail(`${k.code} requires itself`);
      if (!reason || reason.length < 15) fail(`${k.code}: prerequisite ${r} needs a reason`);
      const row = { requires, kind, strength: strength || 'essential', reason: `${reason} Proposed, to confirm by ${o.reviewer}.`, status: 'proposed' };
      const old = k.prerequisites.findIndex(x => x.requires === requires);
      if (old >= 0 && k.prerequisites[old].deepened) fail(`${k.code}: prerequisite ${requires} twice`);
      if (old >= 0) { k.prerequisites[old] = row; added.reasoned = (added.reasoned || 0) + 1; }   // a first-pass prerequisite: its stock reason is replaced
      else { k.prerequisites.push(row); added.pre++; }
      Object.defineProperty(row, 'deepened', { value: true, enumerable: false });
    }
    for (const [short, f] of Object.entries(d.fix || {})) {
      const m = s.misconceptions.find(x => x.code === `${k.code}.${short}`) || fail(`${k.code}: fix for unknown misconception ${short}`);
      const { error, cause, help, feedback } = Array.isArray(f) ? { cause: f[0], help: f[1] } : f;
      if (error) m.error = error; if (cause) m.cause = cause; if (help) m.help = help; if (feedback) m.feedback = feedback;
      added.fix++;
    }
    for (const [short, error, question, wrong, right, cause, help, feedback, source] of d.mis || []) {
      if (shorts.has(short) || o.taken.has(short)) fail(`misconception code ${short} is used twice`);
      if (!short.startsWith(o.misPrefix)) fail(`${short}: new codes start ${o.misPrefix} so the joined maps never clash`);
      if (wrong === right) fail(`${short}: the wrong answer is the right one`);
      for (const [n, v] of Object.entries({ error, question, wrong, right, cause, help, feedback })) if (!v || String(v).length < 2) fail(`${short}: ${n} missing`);
      if (/—/.test(feedback + help + error)) fail(`${short}: em dash`);
      shorts.add(short);
      s.misconceptions.push({ code: `${k.code}.${short}`, skill: k.code, error, example: { question, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" beside "${right}" and ask the child to choose.`, help, feedback, source: source || o.source, status: 'draft' });
      added.mis++;
    }
    if (!d.pack) fail(`${k.code}: no teaching pack entry`);
    const suffix = k.code.split('.').pop(), mis = {};
    for (const mm of s.misconceptions.filter(y => y.skill === k.code)) mis[mm.code.slice(k.code.length + 1)] = [[String(mm.example.wrong_answer).slice(0, 80)], mm.example.question, mm.help];
    (packs.get(s.code) || packs.set(s.code, {}).get(s.code))[suffix] = { ...d.pack, mis };
  }

  // ---- the standard
  const covered = new Set(cur.sub_strands.flatMap(s => s.skills.flatMap(k => k.outcomes)));
  for (const s of cur.sub_strands) {
    if (!s.skills.length) fail(`${s.code} has no skill`);
    const left = s.outcomes.filter(x => !covered.has(x.code) && !o.notTested.test(x.text.trim())).map(x => x.code.split('.').pop());
    if (left.length) fail(`${s.code}: testable outcomes with no skill: ${left.join(', ')}`);
    for (const k of s.skills) {
      if (k.prerequisites.length < 2) fail(`${k.code}: only ${k.prerequisites.length} prerequisites`);
      const n = s.misconceptions.filter(y => y.skill === k.code).length;
      if (n < 4) fail(`${k.code}: only ${n} misconceptions`);
    }
  }
  const all = cur.sub_strands;
  cur.totals = { ...cur.totals, skills: all.reduce((n, s) => n + s.skills.length, 0), prerequisites: all.reduce((n, s) => n + s.skills.reduce((m, k) => m + k.prerequisites.length, 0), 0), misconceptions: all.reduce((n, s) => n + s.misconceptions.length, 0) };
  return { packs, added, newSkills: NEW.length };
}

// The teaching pack files of a deepened grade: { slug: text }. A subject whose skill codes carry another prefix than its
// sub-strand codes (CRE: CRES.G4. skills under CRE.G4. sub-strands) passes skillPrefix so the shared pack rules find the skills.
export function packFiles(cur, packs, { subPrefix, skillPrefix, status, notes = {} }) {
  const out = {};
  for (const s of cur.sub_strands) {
    const slug = packSlug(s);
    if (out[slug]) throw new Error(`two sub-strands write ${slug}`);
    const asSkills = { ...s, code: s.code.replace(subPrefix, skillPrefix) };
    out[slug] = packFileText(s, packEntries(asSkills, s.skills.map(k => k.code.split('.').pop()), packs.get(s.code) || {}), status, notes[s.code.slice(subPrefix.length)] || '');
  }
  return out;
}
