// ============================================================================
// The review pack for a person. Writes, into the folder given (default
// ~/Desktop/Tutagora/Build/question-review):
//   index.html                       start here: what to do and every page
//   00-already-live-label-fixes.html the 18 skills fixed: these are on for children
//   G9-Measurements.html and so on   one printable page per grade and strand
//   sign-off.xlsx                    one row per family: OK, Change or Drop
// Run again after content changes:  node scripts/build-question-review.mjs [dir]
// ============================================================================
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { drawFamily } from '../src/ai-tutor/content/families/core.js';
import { OUTCOMES } from '../src/ai-tutor/curriculum/outcomes.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { writeXlsx } from './lib/xlsx.mjs';

const dir = process.argv[2] || join(homedir(), 'Desktop/Tutagora/Build/question-review');
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
const drawHtml = (p, i) => `<div class="d"><b>Draw ${i + 1}.</b> ${e(p.question)}${modelHtml(p.model)}${p.shownSteps ? `<ol>${p.shownSteps.map(s => `<li>${e(s)}</li>`).join('')}</ol>` : ''}${p.parts ? `<ol>${p.parts.map(q => `<li>${e(q.prompt)} <i>Answer: ${e(q.answer)}${q.unit ? ` ${e(q.unit)}` : ''}</i></li>`).join('')}</ol>` : ''}${p.choices ? `<ul>${p.choices.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : ''}${p.parts ? '' : `<div class="a">Answer: ${e(p.answer)}</div>`}${p.explain ? `<div class="a">What went wrong: ${e(p.explain)}</div>` : ''}</div>`;

const CSS = `body{font:13px/1.45 Georgia,serif;color:#000;margin:18mm 14mm;max-width:190mm}h1{font:bold 20px Arial,sans-serif;margin:0 0 4px}h2{font:bold 14px Arial,sans-serif;margin:18px 0 6px;border-bottom:1.5px solid #000;padding-bottom:2px}p.n{margin:0 0 10px;color:#333}.f{border:1px solid #000;padding:8px 10px;margin:0 0 10px;break-inside:avoid}.h{font:bold 11px Arial,sans-serif;margin-bottom:4px}.o{font:11px Arial,sans-serif;color:#333;margin-bottom:6px}.d{margin:0 0 7px}.a{font-style:italic}.m{font:11px Arial,sans-serif;margin:3px 0}table.t{border-collapse:collapse;margin:4px 0;font:11px Arial,sans-serif}table.t td,table.t th{border:1px solid #666;padding:2px 7px;text-align:left}ol,ul{margin:3px 0 3px 18px;padding:0}.tick{font:12px Arial,sans-serif;margin-top:6px}.line{display:inline-block;border-bottom:1px solid #000;width:58%;height:12px}a{color:#000}@media print{body{margin:10mm}a{text-decoration:none}}`;
const page = (title, intro, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><style>${CSS}</style></head><body><h1>${e(title)}</h1><p class="n">${intro}</p>${body}</body></html>`;

const entries = FAMILIES.map(f => {
  const o = OUTCOMES[f.outcome];
  const draws = [0, 1, 2].map(() => drawFamily(f).p);
  return { f, o, draws, grade: o.grade, strand: STRAND(o.strand), sub: o.substrand };
});
const card = ({ f, o, draws }) => `<div class="f"><div class="h">${e(f.id)} &middot; ${e(FORM_WORDS[f.form])} &middot; ${RUNG[f.rung]} rung &middot; skill: ${e(SKILLS[f.skill]?.name)}</div><div class="o">CBC: ${e(o.strand)} &gt; ${e(o.substrand)}: ${e(o.text)}${o.status !== 'read' ? ' (outcome not checked against a design)' : ''}</div>${draws.map(drawHtml).join('')}<div class="tick">&#9744; OK &nbsp; &#9744; Change &nbsp; &#9744; Drop &nbsp; Comment: <span class="line"></span></div></div>`;

const pages = new Map();
for (const x of entries.filter(x => !x.f.core)) {
  const k = `G${x.grade}-${x.strand.replace(/\W+/g, '-')}`;
  if (!pages.has(k)) pages.set(k, { grade: x.grade, strand: x.strand, list: [] });
  pages.get(k).list.push(x);
}
const links = [];
const core = entries.filter(x => x.f.core);
writeFileSync(join(dir, '00-already-live-label-fixes.html'), page('Read first: the 18 skills that were fixed', `These ${core.length} questions replace ones that did not teach their label, such as "10 + 1" under Temperature. Unlike the rest, they reach children as soon as this branch is released. Please read them before it is.`, core.map(card).join('')));
const sorted = [...pages.entries()].sort(([, a], [, b]) => b.grade - a.grade || a.strand.localeCompare(b.strand));
for (const [k, p] of sorted) {
  p.list.sort((a, b) => a.sub.localeCompare(b.sub) || a.f.rung - b.f.rung);
  let body = '', last = '';
  for (const x of p.list) { if (x.sub !== last) { body += `<h2>${e(x.sub)}</h2>`; last = x.sub; } body += card(x); }
  writeFileSync(join(dir, `${k}.html`), page(`Grade ${p.grade}, ${p.strand}: ${p.list.length} question families`, 'Each box is one way of asking, shown with 3 sets of numbers. Is the maths right? Is it fair for this grade? Would you read it aloud? Is the answer the only right one? Tick one box. Answers were worked out by code, so look hardest at sense and wording.', body));
  links.push(`<li><a href="${k}.html">Grade ${p.grade}, ${e(p.strand)}</a>: ${p.list.length}</li>`);
}
const minutes = Math.round((FAMILIES.length * 5) / 60);
writeFileSync(join(dir, 'index.html'), page('HOREB question review', `${FAMILIES.length} new question families, written in advance. None reaches a child until a person marks it OK, except the ${core.length} label fixes. Allow about 5 minutes a family, about ${minutes} hours in all. Batches are fine: do one grade and strand at a time.`, `<h2>How to do it</h2><ol><li>Read <a href="00-already-live-label-fixes.html">the label fixes</a> first.</li><li>Print a page, or read it on a screen, and tick each box.</li><li>Copy your ticks into <b>sign-off.xlsx</b>: OK, Change or Drop, with a comment. Each row has the family's name.</li><li>Send the sheet back. <code>node scripts/apply-question-review.mjs sign-off.xlsx</code> switches on every family marked OK and lists the rest.</li></ol><h2>Pages, hardest gaps first</h2><ul>${links.join('')}</ul>`));

const rows = [['Family', 'Grade', 'Strand', 'Sub-strand', 'CBC outcome', 'Form', 'Rung', 'Already live?', 'Sample question', 'Sample answer', 'Decision', 'Comment', 'Reviewer', 'Date']];
for (const x of [...entries].sort((a, b) => (b.f.core ? 1 : 0) - (a.f.core ? 1 : 0) || b.grade - a.grade || a.strand.localeCompare(b.strand) || a.sub.localeCompare(b.sub))) {
  const p = x.draws[0];
  rows.push([x.f.id, `Grade ${x.grade}`, x.strand, x.sub, x.o.text, FORM_WORDS[x.f.form], RUNG[x.f.rung], x.f.core ? 'Yes' : 'No', p.question, String(p.answer), x.f.reviewed === true ? 'OK' : '', '', '', '']);
}
writeFileSync(join(dir, 'sign-off.xlsx'), writeXlsx(rows, { lists: { 10: ['OK', 'Change', 'Drop'] }, widths: [30, 9, 14, 22, 34, 14, 8, 8, 70, 18, 10, 30, 12, 11] }));
console.log(`${FAMILIES.length} families, ${pages.size + 1} pages, sign-off.xlsx, about ${minutes} hours to review. Written to ${dir}`);
