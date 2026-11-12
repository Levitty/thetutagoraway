// ============================================================================
// THE CHECKS EVERY QUESTION FAMILY MUST PASS, reviewed or not.
// Used by the quality gate and tests/families.test.mjs. Failures are specific:
// "g9.speed.x: option B and C both right on draw 14", not a score.
// ============================================================================
import { drawFamily, toProblem, FORMS } from '../../src/ai-tutor/content/families/core.js';
import { FAMILIES, REPLACED_SKILLS } from '../../src/ai-tutor/content/families/index.js';
import { OUTCOMES } from '../../src/ai-tutor/curriculum/outcomes.js';
import { SKILL_TAGS } from '../../src/ai-tutor/curriculum/skillTags.js';
import { SKILLS } from '../../src/ai-tutor/knowledgeGraph.js';
import { checkAnswerMatch } from '../../src/ai-tutor/answerCheck.js';
import { tidyProblem, generateProblem } from '../../src/ai-tutor/problemGenerators.js';
import { buildChoices } from '../../src/ai-tutor/choices.js';
import { SKILLS_G5, SUBSTRANDS, OUTCOMES_G5, horebOf } from '../../src/ai-tutor/content/curriculumMap.g5.js';
import { entryOfFamily, entryOfCskill } from '../../src/ai-tutor/content/subjects/registry.js';   // every subject beyond Maths: its map, outcomes and name come from its registry entry
import { readFileSync } from 'node:fs';
import { textOf, formText, senseFlags, clusterForms, sameForm } from './content_measures.mjs';

export const FAMILY_DRAWS = 200;

// The curriculum map's misconception library: full code -> entry. A wrong answer in a
// family that carries `cskill` names one by its short code (no skill prefix); the code
// must be one of its own skill's, or of another skill in the same sub-strand.
const MIS = JSON.parse(readFileSync(new URL('../data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8'));
const misCodesFor = (cskill) => {
  const map = entryOfCskill(cskill)?.map.skills[cskill] ? entryOfCskill(cskill).map.skills : SKILLS_G5;   // another subject's skills have their own map (registry)
  const sub = map[cskill]?.sub;
  const own = new Set((map[cskill]?.mis || []));
  const near = new Set(Object.entries(map).filter(([, k]) => k.sub === sub).flatMap(([c, k]) => k.mis));
  return { own, near };
};
export const misTally = { wrong: 0, tied: 0 };

const AMERICAN = /\b(color|colour?ed-|meter|meters|liter|liters|center|centers|favorite|gray|neighbor|neighbors|odor|harbor|labor|traveled|traveling|customize|realize|organize|program fee)\b/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const FLOAT = /\d\.\d*?(0{6,}|9{6,})\d?/;
const hasAnswerAlone = (answer, text, question) => {
  const a = String(answer);
  if (!/^-?\d[\d.]*$/.test(a) || a.replace('-', '').length < 2 || String(question).includes(a)) return false;
  return new RegExp(`(^|[^\\d.,])${a.replace('.', '\\.')}([^\\d.,]|$)`).test(text);
};

export function checkFamily(def, draws = FAMILY_DRAWS) {
  const out = [];
  const fail = (msg) => { if (out.length < 8) out.push(`${def.id}: ${msg}`); };
  // A family of a registry subject (Science, ...): `science` below means "a subject beyond Maths", whatever its name.
  const science = !!def.subject && def.subject !== 'math';
  const entry = science ? entryOfFamily(def) : null;
  const label = entry ? `Grade ${entry.grade} ${entry.name}` : `${def.subject}`;
  if (science && !entry) fail(`no subject registry entry for ${def.subject} (cskill ${def.cskill})`);
  const official = science ? entry?.map.outcomes[def.outcome] : OUTCOMES_G5[def.outcome];
  const ck = science ? entry?.map.skills[def.cskill] : SKILLS_G5[def.cskill];
  let o = science ? null : OUTCOMES[def.outcome];
  if (science) {
    // Another subject (registry entry): the skill is the cskill (these skills are not in the practice engine's SKILLS yet),
    // and the outcome must be one of the skill's official outcomes. No regex signal, as for Grade 5 Maths.
    o = { id: def.outcome, grade: entry?.grade ?? 5, text: official?.letter, signal: /[\s\S]*/, hands: false };
    if (!official) fail(`outcome ${def.outcome} is not a ${label} outcome`);
    if (!ck) fail(`cskill ${def.cskill} is not in the ${label} map`);
    else {
      if (!ck.outcomes.includes(def.outcome)) fail(`outcome ${def.outcome} is not an outcome of ${def.cskill}`);
      if (def.skill !== def.cskill) fail(`a ${def.subject} family's skill must be its cskill, not ${def.skill}`);
    }
  } else if (official) {
    // The design's own outcome code, with the curriculum skill it belongs to.
    // No regex signal here: HOREB's old signals were written for its own outcome list and miss honest
    // word problems (a ribbon-cutting question never says HCF). The cskill-to-outcome-to-skill chain
    // below is the tag, and the teacher's review is the judge of the content.
    o = { id: def.outcome, grade: 5, text: official.letter, signal: /[\s\S]*/, hands: false };
    if (!ck) fail(`cskill ${def.cskill} is not in the Grade 5 curriculum map`);
    else {
      if (!ck.outcomes.includes(def.outcome)) fail(`outcome ${def.outcome} is not an outcome of ${def.cskill}`);
      if (!horebOf(def.cskill).includes(def.skill)) fail(`HOREB skill ${def.skill} is not mapped to ${def.cskill}`);
    }
  } else if (def.cskill) fail(`cskill ${def.cskill} needs the official outcome code, not ${def.outcome}`);
  if (!science && !SKILLS[def.skill]) fail(`unknown skill ${def.skill}`);
  if (!o) fail(`unknown outcome ${def.outcome}`);
  if (o?.hands) fail(`outcome ${def.outcome} is hands-on: a typed or tapped answer cannot test it`);
  const tag = science ? null : SKILL_TAGS[def.skill];
  if (o && tag && o.grade !== tag.grade) fail(`outcome is Grade ${o.grade}, the skill is CBC Grade ${tag.grade}`);
  // Every wrong answer names the library misconception it reveals.
  // misMapped: false marks an older family retagged to a curriculum skill whose wrong answers carry
  // their own reasons but are not yet tied to library misconceptions (counted in misTally.unmapped).
  const mapped = !!ck && def.misMapped !== false;
  const codes = mapped ? misCodesFor(def.cskill) : null;
  const misFail = (list, where) => {
    for (const m of list) {
      misTally.wrong++;
      const ms = [].concat(m.mis || []);
      if (!ms.length) { fail(`${where}: wrong answer "${m.when}" names no misconception (mis)`); continue; }
      misTally.tied++;
      for (const c of ms) if (!codes.near.has(c)) fail(`${where}: "${c}" is not a misconception of ${def.cskill} or its sub-strand`);
    }
  };
  if (![1, 2, 3].includes(def.rung)) fail(`rung must be 1, 2 or 3, not ${def.rung}`);
  if (!FORMS.includes(def.form)) fail(`form must be one of ${FORMS.join(', ')}`);
  if (def.core !== true && def.reviewed !== true && def.reviewed !== false) fail('reviewed must be true or false');
  if (typeof def.draw !== 'function' || typeof def.make !== 'function') { fail('needs draw() and make()'); return out; }

  const seen = new Set(); let thinWrong = 0, n = 0, placeOnly = 0, weakOption = 0, longestRight = 0;
  for (let i = 0; i < draws; i++) {
    let got;
    try { got = drawFamily(def); } catch (e) { fail(`threw: ${e.message}`); return out; }
    n++;
    const { d, p: raw } = got;
    const p = tidyProblem({ ...raw, misconceptions: raw.misconceptions ? [...raw.misconceptions] : raw.misconceptions }, def.skill);
    const text = textOf(p);
    seen.add(p.question + JSON.stringify(p.model || '') + JSON.stringify(p.shownSteps || ''));
    if (o && !o.signal.test(text)) fail(`does not match its outcome ${def.outcome} (${o.text}): "${p.question.slice(0, 80)}"`);
    for (const f of senseFlags(p)) fail(`sense: ${f}: "${p.question.slice(0, 80)}"`);
    const sentenceText = [p.question, ...(p.hints || []), ...(p.solutionSteps || []), p.explain, ...(p.choices || []), ...(p.parts || []).flatMap(q => [q.prompt, q.hint])].filter(Boolean).join(' ');
    if (/—/.test(sentenceText)) fail('em dash in child-facing text');
    if (EMOJI.test(sentenceText)) fail('emoji in child-facing text');
    if (AMERICAN.test(sentenceText)) fail(`American spelling: "${sentenceText.match(AMERICAN)[0]}"`);
    if (FLOAT.test(sentenceText)) fail(`float noise: "${sentenceText.match(FLOAT)[0]}"`);
    if (!def.allowNegative && /(^|[\s(])[-−]\d[\d,.]* [a-z]{3,}/.test(String(p.question))) fail(`a negative amount in a story: "${p.question.slice(0, 80)}"`);
    if (String(p.question).length > 420) fail('question is too long for a child to read on a phone');
    if ((p.hints || []).length < 2 && !p.parts && def.form !== 'spot') fail('needs at least 2 hints');
    if ((p.solutionSteps || []).length < 2 && def.form !== 'spot') fail('needs at least 2 solution steps');

    if (p.parts) {
      if (p.parts.length < 2 || p.parts.length > 5) fail(`${p.parts.length} parts: need 2 to 5`);
      const vals = p.parts.map(q => Number(q.answer));
      if (vals.some(v => !Number.isFinite(v))) fail(`a part has no number answer: ${vals}`);
      if (typeof def.check !== 'function') fail('needs check(d, partAnswers)');
      else if (!def.check(d, vals)) fail(`check failed on parts ${vals}: "${p.question.slice(0, 80)}"`);
      if (mapped) for (const q of p.parts) misFail(q.mistakes || [], `part "${String(q.prompt).slice(0, 30)}"`);
      for (const q of p.parts) {
        if (!checkAnswerMatch(q.answer, q)) fail(`part key does not mark itself right: ${q.prompt}`);
        for (const m of q.mistakes || []) if (checkAnswerMatch(m.when, q)) fail(`a part's mistake marks right: ${q.prompt} / ${m.when}`);
        if (!q.prompt) fail('part with no prompt');
      }
      continue;
    }
    if (def.form === 'spot' || p.shownSteps) {
      const bad = (p.workingTruth || []).filter(ok => !ok).length;
      if (bad !== 1) fail(`working has ${bad} false steps, must have exactly 1: ${p.shownSteps?.join(' / ')}`);
      if ((p.shownSteps || []).length < 3) fail('a working needs at least 3 steps');
      if (mapped) { if (!(p.mis || []).length) fail('a working names no misconception (mis)'); else for (const c of p.mis) if (!codes.near.has(c)) fail(`"${c}" is not a misconception of ${def.cskill} or its sub-strand`); }
      if (!p.explain) fail('a working needs fix: what went wrong');
      continue;
    }
    if (p.choices) {
      const right = p.optionTruth.filter(Boolean).length;
      if (right !== 1) fail(`${right} options right, must be exactly 1: ${p.choices.join(' | ')} :: "${p.question.slice(0, 70)}"`);
      if (new Set(p.choices).size !== p.choices.length) fail(`options repeat: ${p.choices.join(' | ')}`);
      if (p.choices.length < 2 || p.choices.length > 4) fail(`${p.choices.length} options: need 2 to 4`);
      if (p.choices.length === 2 && def.form !== 'why' && !/true|false|yes|no/i.test(p.choices.join(' '))) fail('two options are only for yes/no or true/false');
      const lens = p.choices.map(c => c.length), rightLen = lens[p.optionTruth.indexOf(true)];
      if (p.choices.length >= 3 && rightLen > 25 && rightLen === Math.max(...lens) && rightLen > 1.2 * [...lens].sort((a, b) => b - a)[1]) longestRight++;
      const marked = p.choices.filter(c => checkAnswerMatch(c, p));
      if (marked.length !== 1) fail(`marker accepts ${marked.length} options: ${p.choices.join(' | ')}`);
      if (mapped) misFail((raw.misconceptions || []).filter(m => m.when != null), 'option');
      if (p.choices.filter((_, j) => !p.optionTruth[j]).some(c => !(raw.misconceptions || []).some(m => m.when === c))) weakOption++;
      continue;
    }
    // typed
    if (raw.answerValue != null) {
      if (!Number.isFinite(raw.answerValue)) fail('answer is not a finite number');
      if (raw.answerValue < 0 && !def.allowNegative) fail(`negative answer ${raw.answerValue}: set allowNegative if that is meant`);
      if (/\.\d{4,}$/.test(String(raw.answerValue))) fail(`answer ${raw.answerValue} has too many decimals for a child to type`);
      if (typeof def.check !== 'function') fail('needs check(d, answer): a second relation the answer must satisfy');
      else if (!def.check(d, raw.answerValue)) fail(`check failed: answer ${raw.answerValue} on "${p.question.slice(0, 90)}"`);
    } else if (typeof def.check === 'function' && !def.check(d, raw.answer)) fail(`check failed: answer ${raw.answer} on "${p.question.slice(0, 90)}"`);
    if (!checkAnswerMatch(String(p.answer), p)) fail(`key does not mark itself right: ${p.answer}`);
    const authored = (raw.misconceptions || []).filter(m => m.when != null);
    for (const m of authored) {
      if (checkAnswerMatch(String(m.when), raw)) { if (String(m.when) !== String(p.answer)) fail(`a listed mistake ${m.when} marks right: "${p.question.slice(0, 70)}"`); }
      if (!m.feedback) fail(`mistake ${m.when} has no feedback`);
      if (hasAnswerAlone(p.answer, m.feedback, p.question)) fail(`feedback gives the answer away: ${m.feedback}`);
    }
    for (const h of p.hints || []) if (hasAnswerAlone(p.answer, h, p.question)) fail(`hint gives the answer away: ${h}`);
    if (mapped) misFail(authored.filter(m => String(m.when) !== String(p.answer)), 'wrong answer');
    const live = new Set(authored.map(m => String(m.when)).filter(w => w !== String(p.answer)));
    if (live.size < 2) fail(`only ${live.size} named wrong answer on "${p.question.slice(0, 70)}"`);
    if (live.size < 3) thinWrong++;
    const v = Number(p.answer);
    if (Number.isFinite(v) && v !== 0 && authored.length && authored.every(m => { const w = Number(m.when); return Number.isFinite(w) && (Math.abs(w / v - 10) < 1e-9 || Math.abs(w / v - 0.1) < 1e-9); })) placeOnly++;
  }
  if (thinWrong > n * 0.3 && !def.young) fail(`fewer than 3 named wrong answers on ${thinWrong} of ${n} draws: wrong options must come from real mistakes`);
  if (placeOnly) fail('every wrong option is just ten times or a tenth of the answer');
  if (weakOption > n * 0.1) fail(`${weakOption} of ${n} draws have a wrong option with no "why" feedback`);
  if (longestRight > n * 0.5) fail('the right option is clearly the longest, which gives it away');
  if (seen.size < 4) fail(`only ${seen.size} different questions in ${n} draws`);
  return out;
}

// What a skill asks without any family: what a new family must not repeat.
export function baseFormsOf(ids) {
  const out = {};
  for (const id of ids) {
    if (!SKILLS[id]) continue;   // a science skill has no generator of its own: nothing to repeat
    const seen = new Set();
    for (let i = 0; i < 40; i++) { const p = generateProblem(id, { noFamilies: true, kp: i % 4 }); if (p && !p.placeholder) seen.add(p.question); }
    out[id] = [...seen];
  }
  return out;
}

// A family must add a form its skill does not have.
export function checkForms(baseForms = {}) {
  const out = [];
  // Families that carry a curriculum skill are compared within that skill (adding and subtracting
  // distances are different skills even when HOREB files both under one skill); the rest, as before,
  // within their HOREB skill. What a skill's own generator already asks is still compared per HOREB skill.
  const bySkill = new Map();
  for (const f of FAMILIES) { const k = f.cskill || f.skill; if (!bySkill.has(k)) bySkill.set(k, []); bySkill.get(k).push(f); }
  const ids = new Set();
  for (const f of FAMILIES) { if (ids.has(f.id)) out.push(`${f.id}: duplicate id`); ids.add(f.id); }
  for (const [skill, fams] of bySkill) {
    const reps = fams.map(f => ({ f, t: formText(drawFamily(f).p) }));
    reps.forEach((a, i) => {
      for (let j = i + 1; j < reps.length; j++) {
        if (sameForm(a.t, reps[j].t)) out.push(`${a.f.id}: same form as ${reps[j].f.id}: "${a.t.slice(0, 80)}"`);
      }
      for (const b of baseForms[a.f.skill] || []) {
        if (sameForm(a.t, b)) { out.push(`${a.f.id}: repeats a form ${a.f.skill} already has: "${b.slice(0, 80)}"`); break; }
      }
    });
  }
  return out;
}

export { FAMILIES, REPLACED_SKILLS, clusterForms };
