// ============================================================================
// ENGLISH DEPTH PASS (18 Nov 2026): brings an English grade to the Grade 5 Maths standard
// (Tuta Workspace/HOREB_MAPPING_PLAN.md). Each per-grade builder (scripts/build-english-g<N>.mjs) merges its first-pass
// skills and misconceptions as before, then calls applyDepth(N, doc) before it writes curriculum/english/g<N>.json:
//   - new skills for every sub-strand and every official outcome the first pass left without one (attitude outcomes excepted)
//   - extra outcomes, prerequisites and misconceptions for the first-pass skills
//   - the teaching pack, one file per sub-strand: curriculum/english/teaching/g<N>/<number>-<slug>.json
//   - assessed_by on every skill (questions, voice, composition or teacher) and no_family on a skill no question family names yet
// The depth data is authored offline in scripts/data/english-depth/g<N>-*.mjs (no model call at run time). Each file may export
//   NEW  [[sub, id, name, letters, assess, forms, mastery], ...]           sub is the sub-strand key after ENGL.G<N>. (prefix match)
//   OUT  { ID: ['b', 'LANGUA.T3.c'] }                                       more official outcomes for a skill (own sub-strand letter, or SUB.letter)
//   PRE  { ID: ['OTHER_ID', 'G4:ID', 'G3o:LISTEN.T1.a', ['G5:ID', 'reason']] }   prerequisites added to a skill
//   MIS  [[ID, SHORT, error, question, wrong, right, cause, help], ...]      misconceptions added to a skill; SHORT starts M<N>_
//   PACK { ID: [key_step, [floor_prerequisite, floor_question, floor_answer], steps, contexts, board, checks, { SHORT: [ask, repair] }] }
//        board [[beat, do, say?]] with beats draw, point, count, predict, pause, child_draws, reveal, write; checks [[q, a, shows] x 2]
// The standard (checked here, and again by depthFailures in the per-grade tests): every sub-strand has a skill; every outcome that is
// not an attitude is covered; every skill has at least two different prerequisites and four misconceptions; every skill has a pack
// entry with two checks and a board that gives the child a turn before anything is revealed; every misconception has an ask and a repair.
// Set ENGLISH_DEPTH_LOOSE=1 to list the gaps instead of stopping (while a grade is being written).
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = join(ROOT, 'scripts/data/english-depth');
export const packDir = (g) => join(ROOT, `curriculum/english/teaching/g${g}`);
const load = (g) => JSON.parse(readFileSync(join(ROOT, `curriculum/english/g${g}.json`), 'utf8'));

// Outcomes about feelings, values and habits: observed over a term, never a skill of their own (as Maths leaves out IT and attitude).
export const ATTITUDE = /^(appreciate|acknowledge|realise|realize|promote|adopt|value|recommend|advocate|show (interest|concern|respect|empathy)|desire|enjoy|embrace|take pride|emphasi[sz]e|recogni[sz]e the (importance|role|value|need|significance|essence|use)|recogni[sz]e (the )?importance|develop (a )?(love|interest|positive|appreciation)|have fun|support|cherish|celebrate|respect|demonstrate (interest|respect|appreciation)|create awareness|uphold|observe etiquette)/i;
export const isAttitude = (text) => ATTITUDE.test(String(text).trim());

const EVIDENCE = {
  questions: 'Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.',
  voice: 'Evidence rule: the teacher hears it done right on two different days, scored with the observation rubric (PLAN_OBSERVATION_RUBRICS.md); a tapped answer cannot show it.',
  composition: 'Evidence rule: two pieces of the learner\'s own writing marked Meeting Expectations or above on the KICD rubric indicator.',
  teacher: 'Evidence rule: the teacher sees it in two pieces of the learner\'s own work, scored with the KICD rubric indicator.',
};
const THINKING = { questions: ['recall', 'reasoning'], voice: ['performance'], composition: ['creation', 'organisation'], teacher: ['performance'] };
const BEATS = new Set(['draw', 'point', 'count', 'predict', 'pause', 'child_draws', 'reveal', 'write']);
const CHILD = new Set(['pause', 'child_draws', 'count', 'predict']);
const SOURCE = 'to confirm by a Kenyan English teacher: a common classroom error of Kenyan learners of English, written offline (18 Nov 2026), not traced to a study';
const PACK_STATUS = (g) => `draft: written 18 Nov 2026 offline for Grade ${g} English; not yet checked by a Kenyan English teacher; not loaded by the live tutor`;

export async function loadDepth(g) {
  const out = { NEW: [], OUT: {}, PRE: {}, MIS: [], PACK: {}, NOTES: {} };
  if (!existsSync(DATA)) return null;
  const files = readdirSync(DATA).filter(f => f.startsWith(`g${g}-`) && f.endsWith('.mjs')).sort();
  if (!files.length) return null;
  for (const f of files) {
    const m = await import(pathToFileURL(join(DATA, f)).href);
    out.NEW.push(...(m.NEW || []));
    out.MIS.push(...(m.MIS || []));
    for (const k of ['OUT', 'PRE', 'PACK', 'NOTES']) for (const [id, v] of Object.entries(m[k] || {})) {
      if (k === 'PRE' || k === 'OUT') out[k][id] = [...(out[k][id] || []), ...v];
      else { if (out[k][id]) throw new Error(`g${g} depth: ${k} ${id} written twice (${f})`); out[k][id] = v; }
    }
  }
  return out;
}

// outcome code -> the skills (any sub-strand of the grade) that cover it
export const coverage = (doc) => { const m = new Map(); for (const s of doc.sub_strands) for (const k of s.skills || []) for (const o of k.outcomes) (m.get(o) || m.set(o, []).get(o)).push(k.code); return m; };
export const packSlug = (s) => `${s.number}-${s.sub_strand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '')}.json`;

// Mutates doc (curriculum/english/g<grade>.json, first pass already merged). Returns counts. Writes the teaching pack files.
export async function applyDepth(grade, doc, { families = null } = {}) {
  const D = await loadDepth(grade);
  if (!D) return null;
  const loose = !!process.env.ENGLISH_DEPTH_LOOSE;
  const gaps = [];
  const fail = (m) => { if (loose) gaps.push(m); else throw new Error(`english g${grade} depth: ${m}`); };
  const P = `ENGL.G${grade}.`;
  const subOf = (key) => {
    const hit = doc.sub_strands.filter(s => s.code.startsWith(`${P}${key}`));
    const exact = hit.filter(s => s.code === `${P}${key}`), under = hit.filter(s => s.code.startsWith(`${P}${key}_`));
    const one = exact.length === 1 ? exact : under.length === 1 ? under : hit;
    if (one.length !== 1) throw new Error(`english g${grade} depth: sub-strand key ${key} matches ${one.length}`);
    return one[0];
  };
  // ---- new skills
  for (const [sub, id, name, letters, assess, forms, mastery] of D.NEW) {
    const s = subOf(sub);
    if (!EVIDENCE[assess]) throw new Error(`${id}: assess must be questions, voice, composition or teacher`);
    if (doc.sub_strands.some(x => (x.skills || []).some(k => k.code.endsWith(`.${id}`)))) throw new Error(`${id}: skill id already used in Grade ${grade}`);
    const outcomes = letters.map(l => { const o = s.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${id}: no outcome ${l} in ${s.code}`); return o.code; });
    s.skills.push({ code: `${s.code}.${id}`, name, outcomes, mastery: `${mastery} ${EVIDENCE[assess]}`, question_forms: forms, thinking: THINKING[assess], horeb_skill_ids: [], prerequisites: [], leads_to: [], status: 'proposed', assessed_by: assess });
  }
  const skills = doc.sub_strands.flatMap(s => (s.skills || []).map(k => [k, s]));
  const byId = new Map(skills.map(([k, s]) => [k.code.split('.').pop(), [k, s]]));
  if (byId.size !== skills.length) throw new Error(`english g${grade} depth: two skills share an id`);
  for (const [k] of skills) k.assessed_by ||= 'questions';
  const get = (id, what) => { const hit = byId.get(id); if (!hit) throw new Error(`english g${grade} depth: ${what} names unknown skill ${id}`); return hit; };
  // ---- more outcomes
  for (const [id, refs] of Object.entries(D.OUT)) {
    const [k, s] = get(id, 'OUT');
    for (const r of refs) {
      const parts = r.split('.'); const letter = parts.pop();
      const os = parts.length ? subOf(parts.join('.')) : s;
      const o = os.outcomes.find(x => x.letter === letter); if (!o) throw new Error(`${id}: no outcome ${r}`);
      if (!k.outcomes.includes(o.code)) k.outcomes.push(o.code);
    }
  }
  // ---- prerequisites
  const lower = {};
  const lowerSkills = (g) => (lower[g] ||= load(g).sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
  const lowerOutcomes = (g) => (lower[`o${g}`] ||= load(g).sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
  const resolve = (ref) => {
    const m = /^G(\d)(o?):(.+)$/.exec(ref);
    if (!m) { const [k] = get(ref, 'PRE'); return [k.code, 'skill', 'This skill builds on it. Proposed, to confirm by a Kenyan English teacher.']; }
    const g = Number(m[1]);
    if (m[2] === 'o') {
      const parts = m[3].split('.'); const letter = parts.pop(); const pre = `ENGL.G${g}.${parts.join('.')}`;
      const hit = lowerOutcomes(g).filter(c => c.startsWith(pre) && c.endsWith(`.${letter}`) && c.split('.').length === 5);
      if (hit.length !== 1) throw new Error(`english g${grade} depth: outcome ${ref} matches ${hit.length}`);
      return [hit[0], 'outcome', `Grade ${g} English set this outcome first. Proposed, to confirm by a Kenyan English teacher.`];
    }
    const hit = lowerSkills(g).filter(c => c.endsWith(`.${m[3]}`) || c === `ENGL.G${g}.${m[3]}`);
    if (hit.length !== 1) throw new Error(`english g${grade} depth: skill ${ref} matches ${hit.length}`);
    return [hit[0], 'skill', `Grade ${g} English taught it first. Proposed, to confirm by a Kenyan English teacher.`];
  };
  for (const [id, refs] of Object.entries(D.PRE)) {
    const [k] = get(id, 'PRE');
    for (const r of refs) {
      const [ref, reason] = Array.isArray(r) ? r : [r, null];
      const [requires, kind, why] = resolve(ref);
      if (requires === k.code) throw new Error(`${id}: requires itself`);
      if (k.prerequisites.some(p => p.requires === requires)) continue;
      k.prerequisites.push({ requires, kind, strength: 'essential', reason: reason ? `${reason} Proposed, to confirm by a Kenyan English teacher.` : why, status: 'proposed' });
    }
  }
  // ---- misconceptions
  const allShort = new Set();
  for (let g = 4; g <= 9; g++) if (g !== grade) for (const s of load(g).sub_strands) for (const m of s.misconceptions || []) allShort.add(m.code.split('.').pop());
  for (const s of doc.sub_strands) for (const m of s.misconceptions || []) allShort.add(m.code.split('.').pop());
  for (const [id, short, error, question, wrong, right, cause, help] of D.MIS) {
    const [k, s] = get(id, 'MIS');
    if (!short.startsWith(`M${grade}_`)) throw new Error(`${short}: a new Grade ${grade} code starts M${grade}_`);
    if (allShort.has(short)) throw new Error(`${short}: code already used in English`);
    allShort.add(short);
    if (wrong === right) throw new Error(`${short}: the wrong answer is the right one`);
    for (const [f, v] of Object.entries({ error, question, wrong, right, cause, help })) if (!v || String(v).length < 2) throw new Error(`${short}: ${f} empty`);
    s.misconceptions.push({ code: `${k.code}.${short}`, skill: k.code, error, example: { question, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" beside "${right}" in a fresh sentence or text and ask again; picking it again shows the error is still there.`, help, feedback: help, source: SOURCE, status: 'draft' });
  }
  // ---- families and the no_family mark
  const withFamily = new Set((families || []).map(f => f.cskill));
  for (const [k] of skills) { if (families && !withFamily.has(k.code)) k.no_family = true; else delete k.no_family; }
  // ---- the standard
  // An outcome may be covered by a skill filed under another sub-strand (the first pass files one reading skill under several themes);
  // a sub-strand with no skill of its own is mapped when all its testable outcomes are covered elsewhere, and its pack file names those skills.
  const coveredBy = coverage(doc);
  for (const s of doc.sub_strands) {
    const testable = s.outcomes.filter(o => !isAttitude(o.text));
    if (!s.skills.length && !testable.length) fail(`${s.code}: no skill and no testable outcome`);
    for (const o of testable) if (!coveredBy.has(o.code)) fail(`${o.code}: outcome with no skill ("${o.text.slice(0, 60)}")`);
  }
  for (const [k, s] of skills) {
    if (new Set(k.prerequisites.map(p => p.requires)).size < 2) fail(`${k.code}: fewer than two prerequisites`);
    const ms = s.misconceptions.filter(m => m.skill === k.code);
    if (ms.length < 4) fail(`${k.code}: only ${ms.length} misconceptions`);
  }
  // ---- teaching pack
  const dir = packDir(grade);
  mkdirSync(dir, { recursive: true });
  const written = new Set();
  let nPack = 0;
  for (const s of doc.sub_strands) {
    const entries = [];
    for (const k of s.skills) {
      const id = k.code.split('.').pop();
      const p = D.PACK[id];
      if (!p) { fail(`${k.code}: no teaching pack entry`); continue; }
      const [key_step, floor, steps, contexts, board, checks, mis] = p;
      const need = s.misconceptions.filter(m => m.skill === k.code);
      for (const m of need) if (!mis[m.code.split('.').pop()]) fail(`${m.code}: no ask and repair in the pack`);
      for (const n of Object.keys(mis)) if (!need.some(m => m.code.endsWith(`.${n}`))) fail(`${k.code}: pack names ${n}, which is not in the library`);
      if (!Array.isArray(checks) || checks.length !== 2) fail(`${k.code}: exactly two checks`);
      if (!board.some(b => CHILD.has(b[0]))) fail(`${k.code}: board never gives the child a turn`);
      const bi = board.findIndex(b => CHILD.has(b[0])), ri = board.findIndex(b => b[0] === 'reveal');
      if (ri >= 0 && ri < bi) fail(`${k.code}: reveal before the child's turn`);
      for (const b of board) if (!BEATS.has(b[0])) fail(`${k.code}: unknown beat ${b[0]}`);
      if (!Array.isArray(floor) || floor.length !== 3 || steps.length < 2 || !contexts.length) fail(`${k.code}: pack entry incomplete`);
      entries.push({
        skill: k.code, assessed_by: k.assessed_by, key_step,
        floor: { prerequisite: floor[0], question: floor[1], answer: floor[2] },
        steps, contexts,
        board: board.map(([beat, doIt, say]) => ({ beat, do: doIt, ...(say ? { say } : {}) })),
        misconceptions: need.filter(m => mis[m.code.split('.').pop()]).map(m => { const [ask, repair] = mis[m.code.split('.').pop()]; return { code: m.code, listen_for: [m.example.wrong_answer], ask, repair }; }),
        checks: checks.map(([question, answer, shows]) => ({ question, answer, shows })),
      });
      nPack++;
    }
    const also = [...new Set(s.outcomes.flatMap(o => coveredBy.get(o.code) || []))].filter(c => !c.startsWith(`${s.code}.`));
    const slug = packSlug(s);
    writeFileSync(join(dir, slug), JSON.stringify({ sub_strand: s.code, title: s.sub_strand, status: PACK_STATUS(grade), notes: D.NOTES[s.code.slice(P.length)] || '', skills: entries, ...(also.length ? { also_taught_by: also } : {}) }, null, 1) + '\n');
    written.add(slug);
  }
  for (const f of readdirSync(dir)) if (f.endsWith('.json') && !written.has(f)) unlinkSync(join(dir, f));
  const all = doc.sub_strands;
  const counts = { skills: all.reduce((n, s) => n + s.skills.length, 0), prerequisites: all.reduce((n, s) => n + s.skills.reduce((m, k) => m + k.prerequisites.length, 0), 0), misconceptions: all.reduce((n, s) => n + s.misconceptions.length, 0), pack: nPack, no_family: skills.filter(([k]) => k.no_family).length };
  doc.totals = { ...doc.totals, skills: counts.skills, prerequisites: counts.prerequisites, misconceptions: counts.misconceptions };
  doc.status = `outcomes from KICD's text, word for word; skills and prerequisites proposed, misconceptions draft, teaching pack draft (depth pass 18 Nov 2026, to the Grade 5 Maths standard), written offline by Claude, awaiting a Kenyan English teacher's review`;
  if (gaps.length) { console.log(`english g${grade} depth: ${gaps.length} gaps\n  ${gaps.slice(0, 80).join('\n  ')}`); }
  console.log(`english g${grade} depth: ${counts.skills} skills, ${counts.prerequisites} prerequisites, ${counts.misconceptions} misconceptions, ${counts.pack} pack entries, ${counts.no_family} skills with no family yet`);
  return counts;
}

// The same standard, read back from the files on disk (for the per-grade tests).
export function depthFailures(grade) {
  const doc = load(grade); const out = [];
  const dir = packDir(grade);
  const packs = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(join(dir, f), 'utf8'))) : [];
  const entry = new Map(packs.flatMap(p => p.skills.map(e => [e.skill, e])));
  const coveredBy = coverage(doc);
  for (const s of doc.sub_strands) {
    for (const o of s.outcomes) if (!coveredBy.has(o.code) && !isAttitude(o.text)) out.push(`${o.code}: outcome with no skill`);
    const p = packs.find(x => x.sub_strand === s.code);
    if (!p) out.push(`${s.code}: no teaching pack file`);
    else if (!p.skills.length && !(p.also_taught_by || []).length) out.push(`${s.code}: teaching pack file names no skill`);
    for (const k of s.skills) {
      if (new Set(k.prerequisites.map(p => p.requires)).size < 2) out.push(`${k.code}: fewer than two prerequisites`);
      if (k.prerequisites.some(p => p.status !== 'proposed' || !p.reason || p.reason.length < 10)) out.push(`${k.code}: a prerequisite without a reason`);
      if (!['questions', 'voice', 'composition', 'teacher'].includes(k.assessed_by)) out.push(`${k.code}: assessed_by missing`);
      const ms = s.misconceptions.filter(m => m.skill === k.code);
      if (ms.length < 4) out.push(`${k.code}: only ${ms.length} misconceptions`);
      const e = entry.get(k.code);
      if (!e) { out.push(`${k.code}: no teaching pack entry`); continue; }
      if (e.checks.length !== 2 || !e.key_step || !e.steps.length || !e.board.some(b => CHILD.has(b.beat))) out.push(`${k.code}: pack entry incomplete`);
      for (const m of ms) { const pm = e.misconceptions.find(x => x.code === m.code); if (!pm || !pm.ask || !pm.repair) out.push(`${m.code}: no ask and repair in the pack`); }
    }
    for (const m of s.misconceptions) {
      if (m.status !== 'draft' || !m.example || !m.example.question || !m.example.wrong_answer || !m.example.correct_answer) out.push(`${m.code}: example or status`);
      else if (m.example.wrong_answer === m.example.correct_answer) out.push(`${m.code}: the wrong answer is the right one`);
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) if (!m[f] || String(m[f]).length < 6) out.push(`${m.code}: ${f} missing`);
      if (/—/.test(JSON.stringify(m))) out.push(`${m.code}: em dash`);
    }
  }
  const t = doc.totals, all = doc.sub_strands;
  if (t.skills !== all.reduce((n, s) => n + s.skills.length, 0) || t.misconceptions !== all.reduce((n, s) => n + s.misconceptions.length, 0) || t.prerequisites !== all.reduce((n, s) => n + s.skills.reduce((m, k) => m + k.prerequisites.length, 0), 0)) out.push('totals do not match the file');
  return out;
}
