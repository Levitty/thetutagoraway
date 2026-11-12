// ============================================================================
// THE CHECKS EVERY WORD-ANSWER QUESTION FAMILY MUST PASS, reviewed or not (registry entries with checks: 'text': English Grade 5 today).
// Used by the quality gate (engine/scripts/quality_gate.mjs) and tests/english-g5.test.mjs. The subject, grade, map and id prefix
// of a family come from its subject registry entry (content/subjects/), so a new word-answer subject-grade is checked with no edit here.
// The Maths checks (family_checks.mjs) are about numbers; these are about words:
//   - the family is tagged to a real Grade 5 English skill and one of its official outcomes
//   - exactly one answer is right, the marker agrees, and no named mistake is marked right
//   - every wrong answer names a library misconception of its skill (or its sub-strand) and tells
//     the child what the mistake is
//   - a working has exactly one false step; two or more named wrong answers on a typed question
//   - a passage is readable by a ten-year-old (Flesch-Kincaid 7 or less, no sentence over 22 words)
//   - British spelling, no emoji, no em dash, nothing too long for a phone
//   - within a skill, no two families have the same structure, and there are at least two
//   - the pre-review hard checks (scripts/lib/item-precheck.mjs) pass
// A family stays off for children (reviewed: false) until a teacher signs it off.
// ============================================================================
import { drawFamily, FORMS } from '../../src/ai-tutor/content/families/core.js';
import { SUBJECT_GRADES, entryOfFamily } from '../../src/ai-tutor/content/subjects/registry.js';
import { checkTextAnswer as marks } from '../../src/ai-tutor/answerCheckText.js';
import { tidyProblem } from '../../src/ai-tutor/problemGenerators.js';
import { precheckItem, readingStats } from '../../scripts/lib/item-precheck.mjs';

const TEXT_ENTRIES = SUBJECT_GRADES.filter(e => e.checks === 'text');
/** Every family of the word-answer subject-grades. */
export const TEXT_FAMILIES = TEXT_ENTRIES.flatMap(e => e.families);
export const ENGLISH_FAMILIES = TEXT_ENTRIES.filter(e => e.subject === 'english').flatMap(e => e.families);
export const ENGLISH_DRAWS = 120;
const AMERICAN = /\b(color|colorful|meter|meters|liter|center|centers|favorite|gray|neighbor|neighbors|traveled|traveling|realize|organize|recognize|practice (the|a)\b|mom)\b/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const FK_CAP = 7;
const NO_FK_SUBJECTS = new Set(['kiswahili']);   // subjects whose words the English reading-level formula cannot read

const codesNear = (cskill, skills) => {
  const sub = skills[cskill]?.sub;
  return new Set(Object.values(skills).filter(k => k.sub === sub).flatMap(k => k.mis));
};

export function checkEnglishFamily(def, draws = ENGLISH_DRAWS) {
  const out = [];
  const fail = (msg) => { if (out.length < 8) out.push(`${def.id}: ${msg}`); };
  const entry = entryOfFamily(def);
  if (!entry) { fail(`cskill ${def.cskill} is in no subject registry entry`); return out; }
  const SKILLS = entry.map.skills, OUTCOMES = entry.map.outcomes;
  const ck = SKILLS[def.cskill];
  if (!ck) { fail(`cskill ${def.cskill} is not in the ${entry.name} Grade ${entry.grade} map`); return out; }
  if (!OUTCOMES[def.outcome]) fail(`unknown outcome ${def.outcome}`);
  else if (!ck.outcomes.includes(def.outcome)) fail(`outcome ${def.outcome} is not an outcome of ${def.cskill}`);
  if (def.subject !== entry.subject || def.grade !== entry.grade) fail(`needs subject ${entry.subject}, grade ${entry.grade}`);
  if (entry.idPrefix && !String(def.id).startsWith(entry.idPrefix)) fail(`id must start with ${entry.idPrefix}`);
  if (def.reviewed !== false && def.reviewed !== true) fail('reviewed must be true or false');
  if (![1, 2, 3].includes(def.rung)) fail(`rung must be 1, 2 or 3, not ${def.rung}`);
  if (!FORMS.includes(def.form)) fail(`form must be one of ${FORMS.join(', ')}`);
  if (!def.kind) fail('needs a kind (its structure)');
  const near = codesNear(def.cskill, SKILLS);
  const checkMis = (list, where) => {
    for (const m of list) {
      const ms = [].concat(m.mis || []);
      if (!ms.length) { fail(`${where}: wrong answer "${m.when}" names no misconception (mis)`); continue; }
      for (const c of ms) if (!near.has(c)) fail(`${where}: "${c}" is not a misconception of ${def.cskill} or its sub-strand`);
      if (!m.feedback || String(m.feedback).trim().length < 12) fail(`${where}: wrong answer "${m.when}" has no real feedback`);
    }
  };

  const seen = new Set(); let thin = 0, n = 0;
  for (let i = 0; i < draws; i++) {
    let got;
    try { got = drawFamily(def); } catch (e) { fail(`threw: ${e.message}`); return out; }
    n++;
    const raw = got.p;
    const p = tidyProblem({ ...raw, misconceptions: raw.misconceptions ? [...raw.misconceptions] : raw.misconceptions }, def.cskill);
    const q = String(p.question);
    const all = [q, ...(p.hints || []), ...(p.solutionSteps || []), p.explain, ...(p.choices || []), ...(p.shownSteps || []), p.passage?.text, p.passage?.title].filter(Boolean).join(' ');
    if (/—/.test(all)) fail('em dash in child-facing text');
    if (EMOJI.test(all)) fail('emoji in child-facing text');
    if (AMERICAN.test(all)) fail(`American spelling: "${all.match(AMERICAN)[0]}"`);
    if (q.length > 420) fail('question too long for a phone');
    if ((p.hints || []).length < 2 && def.form !== 'spot') fail('needs at least 2 hints');
    if ((p.solutionSteps || []).length < 2 && def.form !== 'spot') fail('needs at least 2 solution steps');
    seen.add(`${q}|${(p.choices || []).slice().sort().join('/')}|${(p.shownSteps || []).join('/')}|${p.passage?.title || ''}`);
    if (p.passage) {
      const s = readingStats(p.passage.text);
      // Flesch-Kincaid counts English syllables, so it means nothing for Kiswahili: sentence length and passage length still apply, a native speaker judges the level.
      if (!NO_FK_SUBJECTS.has(entry.subject) && s.fk > FK_CAP) fail(`passage "${p.passage.title}" reads at grade ${s.fk.toFixed(1)}, above ${FK_CAP}`);
      if (s.longest > 22) fail(`passage "${p.passage.title}" has a sentence of ${s.longest} words`);
      if (p.passage.text.length > 1100) fail(`passage "${p.passage.title}" is too long for a phone`);
    }
    for (const f of precheckItem(p, { grade: entry.grade, family: true })) if (f.level === 'hard') fail(`precheck (${f.id}): ${f.message}`);

    if (p.shownSteps) {
      const bad = (p.workingTruth || []).filter(ok => !ok).length;
      if (bad !== 1) fail(`working has ${bad} false steps, must have exactly 1`);
      if ((p.shownSteps || []).length < 3) fail('a working needs at least 3 steps');
      if (!(p.mis || []).length) fail('a working names no misconception (mis)');
      else for (const c of p.mis) if (!near.has(c)) fail(`"${c}" is not a misconception of ${def.cskill} or its sub-strand`);
      if (!p.explain || p.explain.length < 20) fail('a working needs fix: what went wrong');
      if (new Set(p.shownSteps).size !== p.shownSteps.length) fail('two steps are the same sentence');
      continue;
    }
    if (p.choices) {
      const right = p.optionTruth.filter(Boolean).length;
      if (right !== 1) fail(`${right} options right, must be exactly 1: ${p.choices.join(' | ')}`);
      if (new Set(p.choices).size !== p.choices.length) fail(`options repeat: ${p.choices.join(' | ')}`);
      if (p.choices.length < 2 || p.choices.length > 4) fail(`${p.choices.length} options: need 2 to 4`);
      if (p.choices.length === 2 && !/^(yes|no)$/i.test(p.choices.join('|').split('|')[0])) fail('two options are only for yes/no');
      const marked = p.choices.filter(c => marks(c, p));
      if (marked.length !== 1) fail(`marker accepts ${marked.length} options: ${p.choices.join(' | ')}`);
      checkMis((raw.misconceptions || []).filter(m => m.when != null), 'option');
      const unnamed = p.choices.filter((c, j) => !p.optionTruth[j] && !(raw.misconceptions || []).some(m => m.when === c));
      if (unnamed.length) fail(`wrong option(s) with no named mistake: ${unnamed.join(' | ')}`);
      continue;
    }
    // typed
    if (!marks(String(p.answer), p)) fail(`key does not mark itself right: ${p.answer}`);
    for (const a of raw.accepts || []) if (!marks(String(a), p)) fail(`an accepted form is not marked right: ${a}`);
    const authored = (raw.misconceptions || []).filter(m => m.when != null);
    for (const m of authored) if (marks(String(m.when), raw) && String(m.when) !== String(p.answer)) fail(`a listed mistake "${m.when}" is marked right: "${q.slice(0, 70)}"`);
    const named = authored.filter(m => String(m.when) !== String(p.answer));
    checkMis(named, 'wrong answer');
    const live = new Set(named.map(m => String(m.when)));
    if (live.size < 2) fail(`only ${live.size} named wrong answer on "${q.slice(0, 70)}"`);
    if (live.size < 3) thin++;
    for (const h of p.hints || []) if (String(p.answer).length >= 3 && new RegExp(`(^|[^A-Za-z])${String(p.answer).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`, 'i').test(h) && !q.toLowerCase().includes(String(p.answer).toLowerCase())) fail(`hint gives the answer away: ${h}`);
  }
  if (!def.thinOk && thin > n * 0.3) fail(`fewer than 3 named wrong answers on ${thin} of ${n} draws`);
  if (seen.size < 4) fail(`only ${seen.size} different questions in ${n} draws`);
  return out;
}

// Within a skill: every family has its own structure (kind), and there are at least two.
export function checkTextForms(families = ENGLISH_FAMILIES, skills = null) {
  const out = [], ids = new Set(), by = new Map();
  for (const f of families) {
    if (ids.has(f.id)) out.push(`${f.id}: duplicate id`);
    ids.add(f.id);
    (by.get(f.cskill) || by.set(f.cskill, []).get(f.cskill)).push(f);
  }
  for (const [skill, fams] of by) {
    const kinds = fams.map(f => f.kind);
    for (const k of new Set(kinds.filter((x, i) => kinds.indexOf(x) !== i))) out.push(`${skill}: two families share the structure "${k}"`);
    if (new Set(kinds).size < 2) out.push(`${skill}: needs at least two families of different structure`);
  }
  for (const c of Object.keys(skills || {})) if (!by.has(c)) out.push(`${c}: a skill with no family`);
  return out;
}
export const checkEnglishForms = (families = ENGLISH_FAMILIES) => checkTextForms(families, TEXT_ENTRIES.find(e => e.subject === 'english')?.map.skills);

/** Every failure of every word-answer subject-grade in the registry. */
export const textFailures = (draws = ENGLISH_DRAWS) => TEXT_ENTRIES.flatMap(e => [...checkTextForms(e.families, e.map.skills), ...e.families.flatMap(f => checkEnglishFamily(f, draws))]);
export const englishFailures = textFailures;
