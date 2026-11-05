// ============================================================================
// RANGE, PER SKILL AND PER GRADE: what the gate prints and the review pack quotes.
// measureAll draws each skill the way the lesson serves it, including special
// questions. Grades are CBC grades. Only Grades 4 to 9 are held to the bar;
// the others are measured and shown.
// ============================================================================
import { SKILLS } from '../../src/ai-tutor/knowledgeGraph.js';
import { generateProblem, kpCount } from '../../src/ai-tutor/problemGenerators.js';
import { specialItemFor } from '../../src/ai-tutor/specialItems.js';
import { checkAnswerMatch } from '../../src/ai-tutor/answerCheck.js';
import { buildChoices } from '../../src/ai-tutor/choices.js';
import { SKILL_TAGS } from '../../src/ai-tutor/curriculum/skillTags.js';
import { OUTCOMES, TESTABLE_OUTCOMES } from '../../src/ai-tutor/curriculum/outcomes.js';
import { textOf, classify, clusterForms, senseFlags } from './content_measures.mjs';

// Fault fixed on another branch: reported, not failed, until that branch merges.
export const KNOWN_FAULTS = { G8_SIMULTANEOUS_INTRO: 'F30, being fixed on horeb/2026-11-05-simultaneous' };

const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

export function measureSkill(id, draws = 60) {
  const tag = SKILL_TAGS[id] || {};
  const young = (SKILLS[id].grade || 99) <= 3;
  const outcomes = (tag.outcomes || []).map(o => OUTCOMES[o]).filter(Boolean);
  const kps = kpCount(id);
  const m = { id, grade: tag.grade ?? SKILLS[id].grade, n: 0, questions: [], story: 0, kenyan: 0, multi: 0, stepMarked: 0, reasoning: 0, picture: 0, choice: 0, offTopic: 0, offTopicExample: null, keyFails: [], choiceFails: [], flags: {}, optionTotal: 0, optionPlace: 0, promisedHit: {} };
  const warn = console.warn; console.warn = () => {};
  for (let i = 0; i < draws; i++) {
    let p;
    try {
      const special = young ? null : specialItemFor(id, { correctSoFar: 3 });
      p = special || generateProblem(id, { kp: i % kps, lesson: true, correctSoFar: 6 });
    } catch (e) { m.keyFails.push(`threw: ${e.message}`); continue; }
    if (!p) continue;
    m.n++;
    const t = textOf(p);
    m.questions.push(t);
    const c = classify(p);
    for (const k of ['story', 'kenyan', 'multi', 'stepMarked', 'reasoning', 'picture', 'choice']) if (c[k]) m[k]++;
    if (outcomes.length) {
      if (!outcomes.some(o => o.signal.test(t))) { m.offTopic++; m.offTopicExample ||= String(p.question).slice(0, 90); }
      for (const o of outcomes) if (o.signal.test(t)) m.promisedHit[o.id] = (m.promisedHit[o.id] || 0) + 1;
    }
    if (!p.parts && !p.shownSteps && !checkAnswerMatch(String(p.answer), p)) m.keyFails.push(`key marks wrong: ${p.answer} on "${String(p.question).slice(0, 70)}"`);
    const opts = p.mc || p.choices || buildChoices(p);
    if (opts && !p.shownSteps) {
      const right = opts.filter(o => checkAnswerMatch(String(o), p)).length;
      if (right !== 1) m.choiceFails.push(`${right} options right: ${opts.join(' | ')} on "${String(p.question).slice(0, 60)}"`);
      const v = Number(p.answer);
      for (const o of opts) {
        if (checkAnswerMatch(String(o), p)) continue;
        m.optionTotal++;
        const w = Number(String(o).replace(/,/g, ''));
        if (Number.isFinite(v) && Number.isFinite(w) && v !== 0 && (Math.abs(w / v - 10) < 1e-9 || Math.abs(w / v - 0.1) < 1e-9)) m.optionPlace++;
      }
    }
    for (const f of senseFlags(p)) m.flags[f.split(':')[0]] = (m.flags[f.split(':')[0]] || 0) + 1;
  }
  console.warn = warn;
  const forms = clusterForms(m.questions);
  m.forms = forms.length;
  m.formExamples = forms.map(f => f.example);
  m.distinct = new Set(m.questions).size;
  m.outcomes = tag.outcomes || [];
  m.status = tag.status;
  m.inBar = m.grade >= 4 && m.grade <= 9 && tag.status === 'read';
  return m;
}
export const measureAll = (draws = 60) => Object.fromEntries(Object.keys(SKILLS).map(id => [id, measureSkill(id, draws)]));

export function coverage(view) {
  const byGrade = {};
  for (const o of TESTABLE_OUTCOMES) {
    const qs = [];
    for (const m of Object.values(view)) if (m.grade === o.grade && m.status === 'read' && m.outcomes.some(x => x.startsWith(`G${o.grade}.${o.substrandKey}.`))) qs.push(...m.questions.filter(q => o.signal.test(q)));
    const n = clusterForms(qs).length;
    const g = (byGrade[o.grade] ||= { covered: 0, thin: 0, none: 0, list: [] });
    if (n >= 3) g.covered++; else if (n >= 1) g.thin++; else g.none++;
    g.list.push({ id: o.id, text: o.text, forms: n });
  }
  return byGrade;
}

export function summarise(view) {
  const cov = coverage(view);
  const out = {};
  for (let g = 1; g <= 12; g++) {
    const ms = Object.values(view).filter(m => m.grade === g);
    if (!ms.length) continue;
    const total = ms.reduce((s, m) => s + m.n, 0) || 1;
    const share = (k) => Math.round(1000 * ms.reduce((s, m) => s + m[k], 0) / total) / 10;
    const c = cov[g];
    out[g] = { skills: ms.length, medianForms: median(ms.map(m => m.forms)), oneForm: ms.filter(m => m.forms === 1).length, threePlus: ms.filter(m => m.forms >= 3).length,
      covered: c?.covered ?? null, thin: c?.thin ?? null, none: c?.none ?? null,
      story: share('story'), kenyan: share('kenyan'), multi: share('multi'), stepMarked: share('stepMarked'), reasoning: share('reasoning'), picture: share('picture'), choice: share('choice'),
      offTopicSkills: ms.filter(m => m.n && m.outcomes.length && m.offTopic / m.n > 0.2).length };
  }
  return out;
}

export function gradeTable(s) {
  const head = 'Grade  skills  median forms  1 form  3+ forms  outcomes cov/thin/none  story%  Kenyan%  multi%  reasoning%  off-topic skills';
  const rows = Object.entries(s).map(([g, r]) => `${g.padStart(5)}  ${String(r.skills).padStart(6)}  ${String(r.medianForms).padStart(12)}  ${String(r.oneForm).padStart(6)}  ${String(r.threePlus).padStart(8)}  ${(r.covered == null ? '-' : `${r.covered}/${r.thin}/${r.none}`).padStart(22)}  ${String(r.story).padStart(6)}  ${String(r.kenyan).padStart(7)}  ${String(r.multi).padStart(6)}  ${String(r.reasoning).padStart(10)}  ${String(r.offTopicSkills).padStart(16)}`);
  return [head, ...rows].join('\n');
}

// Hard failures stop a release. Soft ones are reported every run and fall as
// content improves; turning one hard is a one-line change here.
export function rangeFailures(view, { formsMin, onTopicMin }) {
  const hard = [], soft = [];
  for (const m of Object.values(view)) {
    const known = KNOWN_FAULTS[m.id];
    for (const k of m.keyFails.slice(0, 2)) hard.push(`${m.id}: ${k}`);
    for (const k of m.choiceFails.slice(0, 2)) hard.push(`${m.id}: ${k}`);
    if (m.flags['no single answer']) (known ? soft : hard).push(`${m.id}: ${m.flags['no single answer']} of ${m.n} draws have no single answer${known ? ` (${known})` : ''}`);
    if (m.flags['broken text']) hard.push(`${m.id}: broken text on ${m.flags['broken text']} draws`);
    if (m.flags.price) soft.push(`${m.id}: ${m.flags.price} of ${m.n} draws have a price no child would believe`);
    if (m.flags['n/n fraction']) soft.push(`${m.id}: ${m.flags['n/n fraction']} of ${m.n} draws use a fraction like 3/3`);
    if (m.optionTotal > 20 && m.optionPlace / m.optionTotal > 0.25) soft.push(`${m.id}: ${Math.round(100 * m.optionPlace / m.optionTotal)}% of wrong options are just ten times or a tenth of the answer`);
    if (!m.inBar || !m.n) continue;
    const onTopic = 1 - m.offTopic / m.n;
    if (onTopic < onTopicMin) hard.push(`${m.id}: only ${Math.round(onTopic * 100)}% of draws teach ${m.outcomes.join(', ')} (e.g. "${m.offTopicExample}")`);
    if (formsMin && m.forms < formsMin) hard.push(`${m.id}: ${m.forms} question form(s), needs ${formsMin}: "${String(m.formExamples[0]).slice(0, 70)}"`);
    if (!formsMin && m.forms === 1) soft.push(`${m.id}: 1 question form: "${String(m.formExamples[0]).slice(0, 70)}"`);
    for (const o of PROMISED_FOR(m.id)) if (!m.promisedHit[o]) hard.push(`${m.id}: its name promises ${o} (${OUTCOMES[o]?.text}) and no draw asks it`);
  }
  return { hard, soft };
}
import { PROMISED } from '../../src/ai-tutor/curriculum/skillTags.js';
const PROMISED_FOR = (id) => PROMISED[id] || [];
