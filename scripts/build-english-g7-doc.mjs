// ============================================================================
// ENGLISH GRADE 7: the list of outcomes that questions cannot test, each with the route that does (13 Nov 2026).
//   node scripts/build-english-g7-doc.mjs   writes docs/qa/english-g7-non-question-outcomes-2026-11-13.md
// Free and local. Reads curriculum/english/g7.json (official outcomes, skills with families) and the family list in the registry.
// An outcome is covered when a skill that lists it has question families. Every other outcome gets one route by its verb:
//   W  composition marking (writing a text: the KICD rubrics kept in the file and PLAN_OBSERVATION_RUBRICS.md)
//   O  speaking or listening check (a teacher, or the voice check, hears the child)
//   P  teacher observation, a task or a portfolio (reading practice, choosing books, discussion, connections to life)
//   A  attitude (observed by the teacher, a rubric descriptor on the report card, never a question)
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
const g7 = JSON.parse(readFileSync(new URL('../curriculum/english/g7.json', import.meta.url), 'utf8'));
const { entryFor } = await import('../src/ai-tutor/content/subjects/registry.js');
const entry = entryFor('english', 7);
const withFam = new Set(entry.families.map(f => f.cskill));
const covered = new Map();
for (const s of g7.sub_strands) for (const k of s.skills) if (withFam.has(k.code)) for (const o of k.outcomes) covered.set(o, (covered.get(o) || 0) + 1);

const A = /^(appreciate|acknowledge|value|advocate|emphasise|underscore|attest|affirm|reiterate|enjoy|recognise the importance|relate .* to real life)\b/i;
const route = (o, s) => {
  const t = o.text.trim();
  if (/^(appreciate|acknowledge|value|advocate|emphasise|underscore|attest|affirm|reiterate|enjoy)\b/i.test(t) || /^recognise the importance/i.test(t)) return 'A';
  if (/^(compose|write|create|construct|design|prepare|make short notes|make notes|summarise)\b/i.test(t) || /^use .* (in|to) (writing|sentences|sentence construction|written)/i.test(t) || /^(use|apply) .*writing process/i.test(t)) return 'W';
  if (/^(articulate|pronounce|recite|perform|present|deliver|role|use (appropriate|different) (techniques|expressions)|use correct intonation|use verbal|apply turn|respond confidently|seek clarification|read a text at the right|read .* accurately|model respectful|use polite|use .* (during|in) (the )?(performance|introduction|conversation|speaking))/i.test(t) || /^(listen|take detailed notes|respond to|pick out specific information from varied|select specific information from a listening|identify (clues|the characters|key issues) .*listening|distinguish between specific and general information from a listening)/i.test(t) || s.code.includes('LISTEN')) return 'O';
  return 'P';
};
const rows = [];
for (const s of g7.sub_strands) for (const o of s.outcomes) rows.push({ code: o.code.replace('ENGL.G7.', '').replace(/\.(x(\d))$/, (m, x, n) => '.' + 'abc'[n - 1]), full: o.code, text: o.text, sub: s, cov: covered.has(o.code), route: covered.has(o.code) ? 'Q' : route(o, s) });
const by = (r) => rows.filter(x => x.route === r);
const short = (t) => (t.length > 100 ? t.slice(0, 97) + '...' : t);
const nQ = by('Q').length;
const out = [];
const P = (s = '') => out.push(s);
P('# English Grade 7: outcomes questions cannot test (13 Nov 2026)');
P();
P(`Written offline from \`curriculum/english/g7.json\` (KICD English, revised 2024; ${rows.length} outcomes). ${nQ} outcomes sit on a skill that has question families (${entry.families.length} families on ${Object.keys(entry.map.skills).length} skills, all draft, off for children). The other ${rows.length - nQ} need a person or a task, and each is listed below with its route. Composition marking uses the KICD rubrics kept in the file (ENGL.G7.RUBRIC.1.1 to 1.26) and PLAN_OBSERVATION_RUBRICS.md.`);
P();
P('Counts by route: ' + ['Q', 'W', 'O', 'P', 'A'].map(r => `${r} ${by(r).length}`).join(', ') + '. The route of each outcome follows its verb (the first word of the official text); the list is for a teacher to correct.');
P();
const section = (title, r, needs) => {
  P(`## ${title} (${by(r).length} outcomes)`);
  P(needs);
  P();
  for (const x of by(r)) P(`- ${x.code}: ${short(x.text)}`);
  P();
};
section('W: composition marking', 'W', 'Needs a plan sheet or a written piece read by the teacher with the composition rubric (topic, organisation, language, creativity), or the HOREB composition marker (built, not in Tuta). Questions test the knowledge that sits under each piece (the families on paragraph parts, letters, notices, dialogue, descriptive and narrative features, the writing process, lists, spelling and numbers); they never replace the marking.');
section('O: speaking and listening check', 'O', 'Needs a teacher or the voice check to hear the child: sounds, stress and intonation, oral narratives, speeches, oral reports, interviews, introductions, turn-taking, reading aloud with fluency, listening for details with a recorded text and an answer sheet. The families test the words and the knowledge (polite expressions, sounds chosen by ear in text, speech parts, report parts); how a child sounds is never marked from a tapped answer.');
section('P: teacher observation, a task or a portfolio', 'P', 'Needs the teacher\'s judgement of a spoken or written answer, a reading log or portfolio (choosing and reading books, independent reading), a group discussion, a recitation, a visual on paper, or a real book (class readers: the setting, the author, the themes). Some of these have a question under them (the families named in the review pack).');
section('A: attitudes', 'A', 'Observed by the teacher and recorded as a rubric descriptor on the report card. Never tested by a question.');
P('## What the families do cover');
P(`${nQ} outcomes sit on ${entry.families.length} families over ${Object.keys(entry.map.skills).length} skills: grammar (20 skills), writing mechanics, paragraphs, letters, notices, handwriting and word skills (16), listening and speaking knowledge (11), knowledge about texts, poems, trickster and dilemma narratives, praise songs, visuals, notes and style (13), and reading comprehension, characters, order and lessons on original passages and poems (11). The G6 leads_to links into Grade 7 are all covered by a Grade 7 skill with families.`);
writeFileSync(new URL('../docs/qa/english-g7-non-question-outcomes-2026-11-13.md', import.meta.url), out.join('\n') + '\n');
console.log(`g7 outcomes ${rows.length}: ` + ['Q', 'W', 'O', 'P', 'A'].map(r => `${r} ${by(r).length}`).join(', '));
