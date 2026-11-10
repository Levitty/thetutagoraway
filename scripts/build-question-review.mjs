// ============================================================================
// The review pack for a person. Writes, into the folder given (default
// ~/Desktop/Tutagora/Build/question-review):
//   index.html                       start here: what to do and every page
//   00-already-live-label-fixes.html the 18 skills fixed: these are on for children
//   G9-Measurements.html and so on   one printable page per grade and strand
//   sign-off.xlsx                    one row per family: OK, Change or Drop
// Run again after content changes:  node scripts/build-question-review.mjs [dir]
//
// Grade 5 Mathematics, from the curriculum map (cskill on every family):
//   node scripts/build-question-review.mjs --g5 [dir]
// writes one page per sub-strand (3 sample draws per family with the answer, every wrong
// option with the misconception it reveals and why, and the steps), index.html, and
// families.csv with one row per family and an empty teacher verdict column. Default
// folder ~/Desktop/Tutagora/Build/question-review/g5-families. The sign-off.xlsx and
// apply-question-review.mjs work as before.
// ============================================================================
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { drawFamily } from '../src/ai-tutor/content/families/core.js';
import { OUTCOMES } from '../src/ai-tutor/curriculum/outcomes.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { writeXlsx } from './lib/xlsx.mjs';
import { readFileSync } from 'node:fs';
import { SKILLS_G5, SUBSTRANDS, OUTCOMES_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';

const G5 = process.argv.includes('--g5');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const dir = args[0] || join(homedir(), 'Desktop/Tutagora/Build/question-review', G5 ? 'g5-families' : '');
const DETAIL = G5 ? JSON.parse(readFileSync(new URL('../engine/data/curriculum/g5.detail.json', import.meta.url), 'utf8')) : null;
const MIS = G5 ? JSON.parse(readFileSync(new URL('../engine/data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8')) : null;
// A family's outcome: HOREB's own (older families) or the design's official code (curriculum families).
const outcomeOf = (f) => {
  const official = OUTCOMES_G5[f.outcome];
  if (!official) return OUTCOMES[f.outcome];
  const sub = SUBSTRANDS[official.sub];
  return { grade: 5, strand: sub.strand, substrand: sub.name, text: DETAIL?.outcomes[f.outcome] || official.letter, status: 'read', official: true, letter: official.letter };
};
const misName = (f, code) => { const full = `${f.cskill}.${code}`; const m = MIS?.[full] || Object.entries(MIS || {}).find(([k]) => k.endsWith(`.${code}`))?.[1]; return m ? m.error : code; };
mkdirSync(dir, { recursive: true });
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FORM_WORDS = { direct: 'plain question', word: 'story', steps: 'in parts', spot: 'find the mistake', why: 'choose the reason', table: 'read a table', graph: 'read a graph' };
const RUNG = { 1: 'first', 2: 'middle', 3: 'hardest' };
const STRAND = (s) => (/^Measurement/.test(s) ? 'Measurements' : /^Data/.test(s) ? 'Data' : s);

const modelHtml = (m) => {
  if (!m) return '';
  const d = m.data || {};
  if (m.type === 'table') {
    const head = (d.head || []).map(h => `<th>${e(h)}</th>`).join('');
    const rows = (d.rows || []).map(r => `<tr>${(r.cells || [r.label, r.value]).map(c => `<td>${e(c)}</td>`).join('')}</tr>`).join('');
    return `<table class="t"><tr>${head}</tr>${rows}</table>`;
  }
  if (m.type === 'line-graph') {
    const lines = d.lines || [d.points];
    return `<p class="m">[Line graph. ${e(d.yLabel)} against ${e(d.xLabel)}: ${lines.map(l => l.map(p => `(${p.x}, ${p.y})`).join(' ')).join(' and ')}]</p>`;
  }
  if (m.type === 'bar-chart') return `<p class="m">[Bar graph: ${(d.bars || []).map(b => `${e(b.label)} ${b.value}`).join(', ')}]</p>`;
  if (m.type === 'pie-chart') return `<p class="m">[Pie chart: ${JSON.stringify(d.slices || d.sectors || d).slice(0, 160).replace(/["{}[\]]/g, ' ')}]</p>`;
  return `<p class="m">[Picture: ${e(m.type)}]</p>`;
};
const wrongHtml = (f, p) => {
  const rows = [];
  for (const m of p.misconceptions || []) rows.push([m.when, m.feedback, m.mis]);
  for (const q of p.parts || []) for (const m of q.mistakes || []) rows.push([`${q.prompt.slice(0, 28)}: ${m.when}`, m.feedback, m.mis]);
  if (p.mis) rows.push(['(the false step)', p.explain, p.mis]);
  if (!rows.length) return '';
  return `<table class="t"><tr><th>Wrong answer</th><th>Reveals</th><th>Reason the child is shown</th></tr>${rows.map(([w, why, mis]) => `<tr><td>${e(w)}</td><td>${[].concat(mis || []).map(c => e(G5 ? misName(f, c) : c)).join('; ') || '&ndash;'}</td><td>${e(why)}</td></tr>`).join('')}</table>`;
};
const stepsHtml = (p) => ((p.solutionSteps || []).length ? `<div class="o">Steps: ${(p.solutionSteps || []).map(e).join(' ')}</div>` : '');
const drawHtml = (p, i, f) => `<div class="d"><b>Draw ${i + 1}.</b> ${e(p.question)}${modelHtml(p.model)}${p.shownSteps ? `<ol>${p.shownSteps.map(s => `<li>${e(s)}</li>`).join('')}</ol>` : ''}${p.parts ? `<ol>${p.parts.map(q => `<li>${e(q.prompt)} <i>Answer: ${e(q.answer)}${q.unit ? ` ${e(q.unit)}` : ''}</i></li>`).join('')}</ol>` : ''}${p.choices ? `<ul>${p.choices.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : ''}${p.parts ? '' : `<div class="a">Answer: ${e(p.answer)}</div>`}${p.explain ? `<div class="a">What went wrong: ${e(p.explain)}</div>` : ''}${G5 && f ? wrongHtml(f, p) + stepsHtml(p) : ''}</div>`;

const CSS = `body{font:13px/1.45 Georgia,serif;color:#000;margin:18mm 14mm;max-width:190mm}h1{font:bold 20px Arial,sans-serif;margin:0 0 4px}h2{font:bold 14px Arial,sans-serif;margin:18px 0 6px;border-bottom:1.5px solid #000;padding-bottom:2px}p.n{margin:0 0 10px;color:#333}.f{border:1px solid #000;padding:8px 10px;margin:0 0 10px;break-inside:avoid}.h{font:bold 11px Arial,sans-serif;margin-bottom:4px}.o{font:11px Arial,sans-serif;color:#333;margin-bottom:6px}.d{margin:0 0 7px}.a{font-style:italic}.m{font:11px Arial,sans-serif;margin:3px 0}table.t{border-collapse:collapse;margin:4px 0;font:11px Arial,sans-serif}table.t td,table.t th{border:1px solid #666;padding:2px 7px;text-align:left}ol,ul{margin:3px 0 3px 18px;padding:0}.tick{font:12px Arial,sans-serif;margin-top:6px}.line{display:inline-block;border-bottom:1px solid #000;width:58%;height:12px}a{color:#000}@media print{body{margin:10mm}a{text-decoration:none}}`;
const page = (title, intro, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><style>${CSS}</style></head><body><h1>${e(title)}</h1><p class="n">${intro}</p>${body}</body></html>`;

const entries = FAMILIES.filter(f => !G5 || (f.cskill && !f.core)).map(f => {
  const o = outcomeOf(f);
  const draws = [0, 1, 2].map(() => drawFamily(f).p);
  return { f, o, draws, grade: o.grade, strand: STRAND(o.strand), sub: o.substrand };
});
const card = ({ f, o, draws }) => `<div class="f"><div class="h">${e(f.id)} &middot; ${e(FORM_WORDS[f.form])} &middot; ${RUNG[f.rung]} rung &middot; ${f.cskill ? `curriculum skill: ${e(SKILLS_G5[f.cskill]?.name)} (${e(f.cskill.replace('MATH.G5.', ''))})` : `skill: ${e(SKILLS[f.skill]?.name)}`}</div><div class="o">${o.official ? `Official outcome ${e(o.letter)}` : 'CBC'}: ${e(o.strand)} &gt; ${e(o.substrand)}: ${e(o.text)}${o.status !== 'read' ? ' (outcome not checked against a design)' : ''}${f.misMapped === false ? ' &middot; wrong answers not yet tied to the misconception library' : ''}</div>${draws.map((p, i) => drawHtml(p, i, f)).join('')}<div class="tick">&#9744; OK &nbsp; &#9744; Change &nbsp; &#9744; Drop &nbsp; Comment: <span class="line"></span></div></div>`;

const pages = new Map();
for (const x of entries.filter(x => !x.f.core || G5)) {
  const k = G5 ? `G5-${String(Object.keys(SUBSTRANDS).indexOf(OUTCOMES_G5[x.f.outcome]?.sub) + 1).padStart(2, '0')}-${x.sub.replace(/\W+/g, '-')}` : `G${x.grade}-${x.strand.replace(/\W+/g, '-')}`;
  if (!pages.has(k)) pages.set(k, { grade: x.grade, strand: x.strand, list: [] });
  pages.get(k).list.push(x);
}
const links = [];
const core = entries.filter(x => x.f.core);
if (!G5) writeFileSync(join(dir, '00-already-live-label-fixes.html'), page('Read first: the 18 skills that were fixed', `These ${core.length} questions replace ones that did not teach their label, such as "10 + 1" under Temperature. Unlike the rest, they reach children as soon as this branch is released. Please read them before it is.`, core.map(card).join('')));
const sorted = G5 ? [...pages.entries()].sort(([a], [b]) => a.localeCompare(b)) : [...pages.entries()].sort(([, a], [, b]) => b.grade - a.grade || a.strand.localeCompare(b.strand));
for (const [k, p] of sorted) {
  p.list.sort((a, b) => (G5 ? Object.keys(SKILLS_G5).indexOf(a.f.cskill) - Object.keys(SKILLS_G5).indexOf(b.f.cskill) : a.sub.localeCompare(b.sub)) || a.f.rung - b.f.rung);
  let body = '', last = '';
  for (const x of p.list) { const head = G5 ? `${SKILLS_G5[x.f.cskill]?.name}` : x.sub; if (head !== last) { body += `<h2>${e(head)}</h2>`; last = head; } body += card(x); }
  writeFileSync(join(dir, `${k}.html`), page(G5 ? `Grade 5 Mathematics, ${p.list[0].sub}: ${p.list.length} question families` : `Grade ${p.grade}, ${p.strand}: ${p.list.length} question families`, 'Each box is one way of asking, shown with 3 sets of numbers. Is the maths right? Is it fair for this grade? Would you read it aloud? Is the answer the only right one? Tick one box. Answers were worked out by code, so look hardest at sense and wording.', body));
  links.push(`<li><a href="${k}.html">${G5 ? `Grade 5, ${e(p.list[0].sub)}` : `Grade ${p.grade}, ${e(p.strand)}`}</a>: ${p.list.length}</li>`);
}
const minutes = Math.round((FAMILIES.length * 5) / 60);
writeFileSync(join(dir, 'index.html'), page(G5 ? 'HOREB Grade 5 Mathematics question review' : 'HOREB question review', `${entries.length} ${G5 ? 'Grade 5 Mathematics' : 'new'} question families, written in advance. None reaches a child until a person marks it OK${G5 ? '' : `, except the ${core.length} label fixes`}. Allow about 5 minutes a family, about ${Math.round(entries.length * 5 / 60)} hours in all. Batches are fine: do one grade and strand at a time.`, `<h2>How to do it</h2><ol>${G5 ? '' : '<li>Read <a href="00-already-live-label-fixes.html">the label fixes</a> first.</li>'}<li>Print a page, or read it on a screen, and tick each box.</li><li>Copy your ticks into <b>${G5 ? 'families.csv or sign-off.xlsx' : 'sign-off.xlsx'}</b>: OK, Change or Drop, with a comment. Each row has the family's name.</li><li>Send the sheet back. <code>node scripts/apply-question-review.mjs sign-off.xlsx</code> switches on every family marked OK and lists the rest.</li></ol><h2>Pages, hardest gaps first</h2><ul>${links.join('')}</ul>`));

if (G5) {
  const csv = [['Curriculum skill', 'Official outcome', 'Family', 'Form', 'Rung', 'Sample question', 'Sample answer', 'Misconceptions revealed', 'Teacher verdict (OK, Change or Drop)', 'Comment']];
  const ORDER = Object.keys(SKILLS_G5);
  for (const x of entries.sort((a, b) => ORDER.indexOf(a.f.cskill) - ORDER.indexOf(b.f.cskill) || a.f.rung - b.f.rung)) {
    const p = x.draws[0], codes = [...new Set([...(p.misconceptions || []).flatMap(m => [].concat(m.mis || [])), ...(p.parts || []).flatMap(q => (q.mistakes || []).flatMap(m => [].concat(m.mis || []))), ...(p.mis || [])])];
    csv.push([x.f.cskill.replace('MATH.G5.', ''), x.f.outcome.replace('MATH.G5.', ''), x.f.id, FORM_WORDS[x.f.form], RUNG[x.f.rung], `${p.question}${p.choices ? ' [' + p.choices.join(' | ') + ']' : ''}${p.shownSteps ? ' [' + p.shownSteps.join(' / ') + ']' : ''}${p.parts ? ' [' + p.parts.map(q => q.prompt).join(' / ') + ']' : ''}`, p.parts ? p.parts.map(q => q.answer).join(' / ') : String(p.answer), codes.join(' '), x.f.reviewed === true ? 'OK' : '', '']);
  }
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  writeFileSync(join(dir, 'families.csv'), '\ufeff' + csv.map(r => r.map(q).join(',')).join('\r\n') + '\r\n');
}
const rows = [['Family', 'Grade', 'Strand', 'Sub-strand', 'CBC outcome', 'Form', 'Rung', 'Already live?', 'Sample question', 'Sample answer', 'Decision', 'Comment', 'Reviewer', 'Date']];
for (const x of [...entries].sort((a, b) => (b.f.core ? 1 : 0) - (a.f.core ? 1 : 0) || b.grade - a.grade || a.strand.localeCompare(b.strand) || a.sub.localeCompare(b.sub))) {
  const p = x.draws[0];
  rows.push([x.f.id, `Grade ${x.grade}`, x.strand, x.sub, x.o.text, FORM_WORDS[x.f.form], RUNG[x.f.rung], x.f.core ? 'Yes' : 'No', p.question, String(p.answer), x.f.reviewed === true ? 'OK' : '', '', '', '']);
}
writeFileSync(join(dir, 'sign-off.xlsx'), writeXlsx(rows, { lists: { 10: ['OK', 'Change', 'Drop'] }, widths: [30, 9, 14, 22, 34, 14, 8, 8, 70, 18, 10, 30, 12, 11] }));
console.log(`${entries.length} families, ${pages.size + (G5 ? 0 : 1)} pages, ${G5 ? 'families.csv, ' : ''}sign-off.xlsx, about ${Math.round(entries.length * 5 / 60)} hours to review. Written to ${dir}`);
