// Probe: fair forms the classroom did not yet try (thousands separators,
// KSh, units, %, degrees, leading zero, mixed numbers), and wrong-unit misses.
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';
const ids = Object.keys(SKILLS).filter(id => { const s = SKILLS[id]; const g = gradeOf(s, 'cbc'); return s.curricula?.cbc && s.curricula.cbc.inScope !== false && g >= 4 && g <= 9; });
const res = {}; const ex = {};
const note = (lab, ok, id, p, f) => { const r = (res[lab] ||= { pass: 0, fail: 0, skills: new Set() }); ok ? r.pass++ : (r.fail++, r.skills.add(id)); if (!ok) ((ex[lab] ||= []).length < 6) && ex[lab].push(`${id}: "${f}" for key ${p.answer} | ${String(p.question).slice(0, 110)}`); };
const UNIT = /\b(cm²|cm³|m²|m³|km²|cm|mm|km|kg|ml|m|g|l|litres?|hours?|minutes?|seconds?)\b/;
for (const id of ids) for (let k = 0; k < 25; k++) {
  let p; try { p = generateProblem(id, 2 + (k % 3)); } catch { continue; } if (!p) continue;
  const a = String(p.answer).trim(); const q = `${p.instruction || ''} ${p.question || ''}`;
  const num = /^-?\d+(\.\d+)?$/.test(a);
  const fair = []; const wrong = [];
  if (num && Math.abs(Number(a)) >= 1000) {
    const [i, d] = a.split('.'); const c = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
    fair.push(['thousands comma', c]); fair.push(['thousands space', c.replace(/,/g, ' ')]);
  }
  if (num && /KSh|Ksh|shillings|Sh\b/.test(q)) { fair.push(['KSh prefix', `KSh ${a}`]); fair.push(['sh suffix', `${a} shillings`]); }
  if (num && /%|per ?cent/i.test(q) && /percent|percentage|%/i.test(p.instruction || '') ) fair.push(['percent sign', `${a}%`]);
  if (num && /angle|°|degrees?/i.test(q) && !/radian/i.test(q)) { fair.push(['degree sign', `${a}°`]); fair.push(['degrees word', `${a} degrees`]); }
  if (num && /^-?0\.\d+$/.test(a)) fair.push(['no leading zero', a.replace('0.', '.')]);
  const um = q.match(/\b(?:in|to the nearest)\s+(cm²|cm³|m²|m³|cm|mm|km|kg|ml|m|g|litres)\b/);
  const um2 = !um && String(p.question).match(/\((cm²|cm³|m²|m³|cm|km|kg|m|g)\)/);
  const unit = um?.[1] || um2?.[1];
  if (num && unit) { fair.push(['with unit', `${a} ${unit}`]); fair.push(['unit no space', `${a}${unit}`]);
    const other = { cm: 'm', m: 'cm', km: 'm', kg: 'g', g: 'kg', mm: 'cm', ml: 'l', litres: 'ml', 'cm²': 'm²', 'm²': 'cm²', 'cm³': 'm³', 'm³': 'cm³' }[unit];
    if (other) wrong.push(['wrong unit', `${a} ${other}`]); }
  const mx = a.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mx && !/mixed/i.test(q)) fair.push(['improper fraction', `${Number(mx[1]) * Number(mx[3]) + Number(mx[2])}/${mx[3]}`]);
  const fr = a.match(/^(\d+)\/(\d+)$/);
  if (fr && Number(fr[1]) > Number(fr[2]) && !/improper|simplest|fraction/i.test(q)) { const w = Math.floor(fr[1] / fr[2]), r = fr[1] % fr[2]; if (r) fair.push(['mixed number', `${w} ${r}/${fr[2]}`]); }
  if (num && /^-\d/.test(a)) fair.push(['negative in brackets', `(${a})`]);
  for (const [lab, f] of fair) { let ok = false; try { ok = checkAnswerMatch(f, p); } catch {} note(lab, ok, id, p, f); }
  for (const [lab, f] of wrong) { let bad = false; try { bad = checkAnswerMatch(f, p); } catch {} note(lab, !bad, id, p, f); }
}
for (const [lab, r] of Object.entries(res)) console.log(`${lab.padEnd(22)} ${(100 * r.pass / (r.pass + r.fail)).toFixed(1)}%  fail ${r.fail}/${r.pass + r.fail}  skills ${[...r.skills].slice(0, 12).join(' ')}${r.skills.size > 12 ? ' …(' + r.skills.size + ')' : ''}`);
for (const [lab, e] of Object.entries(ex)) { console.log(`\n${lab}`); e.forEach(x => console.log('  ' + x)); }
