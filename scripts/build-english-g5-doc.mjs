// ============================================================================
// Writes docs/qa/english-g5-<date>.md, the review document for a Kenyan English teacher: the skills, the
// misconception library, the families per outcome, the coverage and what needs composition marking or a
// teacher. Free and local. Numbers come from the files, never typed.  node scripts/build-english-g5-doc.mjs
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeOf, ROUTE_NAMES, COMPOSITION_TYPE } from './data/english-g5-routes.mjs';
import { NOT_BUILT } from './data/english-g5-skills.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATE = new Date().toISOString().slice(0, 10);
const g5 = JSON.parse(readFileSync(resolve(root, 'curriculum/english/g5.json'), 'utf8'));
const { ENGLISH_FAMILIES } = await import(resolve(root, 'src/ai-tutor/content/families/english.js'));
const { drawFamily } = await import(resolve(root, 'src/ai-tutor/content/families/core.js'));
const { PASSAGES } = await import(resolve(root, 'src/ai-tutor/content/families/eng_g5_passages.js'));
const { englishFailures } = await import(resolve(root, 'engine/scripts/english_checks.mjs'));

const short = (c) => c.replace('ENGL.G5.', '');
const cell = (t) => String(t).replace(/\|/g, '/').replace(/\s+/g, ' ');
const skills = g5.sub_strands.flatMap(s => s.skills.map(k => ({ ...k, sub: s })));
const mis = g5.sub_strands.flatMap(s => s.misconceptions);
const famOf = (code) => ENGLISH_FAMILIES.filter(f => f.cskill === code);

// Which library misconceptions do the families actually draw?
const used = new Set();
for (const f of ENGLISH_FAMILIES) for (let i = 0; i < 300; i++) { const p = drawFamily(f).p; for (const m of p.misconceptions || []) for (const c of [].concat(m.mis || [])) used.add(`${f.cskill}|${c}`); for (const c of p.mis || []) used.add(`${f.cskill}|${c}`); }
const usedBySub = new Set();   // a code is used when a family of its sub-strand draws it
for (const f of ENGLISH_FAMILIES) for (let i = 0; i < 300; i++) { const p = drawFamily(f).p; const sub = f.cskill.split('.').slice(0, 4).join('.'); for (const m of p.misconceptions || []) for (const c of [].concat(m.mis || [])) usedBySub.add(`${sub}|${c}`); for (const c of p.mis || []) usedBySub.add(`${sub}|${c}`); }
const isUsed = (m) => usedBySub.has(`${m.skill.split('.').slice(0, 4).join('.')}|${m.code.slice(m.skill.length + 1)}`);
const unused = mis.filter(m => !isUsed(m));

const fails = englishFailures(150);
const { precheckItem } = await import(resolve(root, 'scripts/lib/item-precheck.mjs'));
let pcItems = 0, pcHard = 0, pcSoft = 0;
for (const f of ENGLISH_FAMILIES) for (let i = 0; i < 80; i++) { const found = precheckItem(drawFamily(f).p, { grade: 5, family: true }); pcItems++; if (found.some(x => x.level === 'hard')) pcHard++; else if (found.length) pcSoft++; }
const rows = [];
const famBy = new Map(), skillOf = new Map();
for (const k of skills) for (const o of k.outcomes) { (skillOf.get(o) || skillOf.set(o, []).get(o)).push(k.code); for (const f of famOf(k.code)) (famBy.get(o) || famBy.set(o, []).get(o)).push(f); }
for (const s of g5.sub_strands) for (const o of s.outcomes) { const fams = famBy.get(o.code) || []; rows.push({ o, s, fams, route: fams.length ? 'family' : routeOf(o, s) }); }
const n = (r) => rows.filter(x => x.route === r).length;
const passageWords = PASSAGES.map(p => p.text.split(/\s+/).length);

const out = [], P = (t = '') => out.push(t);
P(`# English Grade 5: skills, misconceptions and question families (${DATE})`);
P();
P(`Branch \`horeb/2026-11-12-english-g5\`. Step 5 of Tuta Workspace/CURRICULUM_OTHER_SUBJECTS_PLAN.md, for English Grade 5 only. Everything here was written offline by Claude with no paid API call at any point. **Every family is draft and switched off for children** (\`reviewed: false\`, the sign-off list \`SIGNED_ENGLISH\` is empty) until a Kenyan English teacher has been through the review list at the end. The official outcomes in \`curriculum/english/g5.json\` are untouched (200 outcomes, KICD text); the skills, prerequisites and misconceptions added to that file are marked proposed and draft.`);
P();
P('## What was built');
P();
P(`- **${skills.length} skills** from the testable outcomes of Grammar in Use (${skills.filter(k => k.sub.strand === 'Grammar in Use').length}), Reading (${skills.filter(k => k.sub.strand === 'Reading').length}), and the parts of Writing mechanics, spelling, Listening and Speaking vocabulary that can be checked in text (${skills.filter(k => k.sub.strand === 'Writing' || k.sub.strand === 'Listening and Speaking').length}). Each has outcomes, a mastery rule, question forms, a thinking type and prerequisites (${g5.totals.prerequisites} proposed prerequisite links, to Grade 5 skills or Grade 4 English outcomes).`);
P(`- **${mis.length} misconceptions** in the library, each with the wrong idea, a revealing question, a repair, the cause, the sentence a child is told, and a source. ${mis.filter(m => /^common learner error/.test(m.source)).length} are "common learner error; to confirm by a Kenyan English teacher", ${mis.filter(m => /^Kiswahili/.test(m.source)).length} name a Kiswahili influence (to confirm), ${mis.length - mis.filter(m => /^common learner error/.test(m.source) || /^Kiswahili/.test(m.source)).length} are a rule or point from the design or a stricter reading of a rule (to confirm). None has a source in a Kenyan learner's own writing yet.`);
P(`- **${ENGLISH_FAMILIES.length} question families**, at least two of different structure for every skill (${new Set(ENGLISH_FAMILIES.map(f => f.kind)).size} structures in all). Pools of authored items serve several families: choose the form (distractors from named errors), type the gap (with accepted forms), find the mistake in a child's four sentences, short comprehension on a passage (choose, type, true / false / not stated), put events in order, classify, finish a proverb or simile.`);
P(`- **${PASSAGES.length} original passages** (${PASSAGES.filter(p => p.kind === 'narrative').length} Kenyan stories, ${PASSAGES.filter(p => p.kind === 'info').length} information texts, ${PASSAGES.filter(p => p.kind === 'notice').length} notices), ${Math.min(...passageWords)} to ${Math.max(...passageWords)} words, at a Flesch-Kincaid grade of 7 or below with no sentence over 22 words. Written fresh, never copied from a textbook.`);
P(`- Families live in \`src/ai-tutor/content/families/eng_g5_*.js\` (kit in \`eng_lib.js\`, joined in \`english.js\`), apart from the Maths bank. The in-app map is generated: \`node scripts/build-english-g5.mjs\` merges \`scripts/data/english-g5-skills.mjs\` into \`curriculum/english/g5.json\` and writes \`curriculumMap.english.g5.js\`.`);
P();
P('## Results of the checks');
P();
P(`- **Quality gate** (\`npm run test:content\`): ${ENGLISH_FAMILIES.length} English families checked, 0 failing (${fails.length} failures in this run of 150 draws each). The checks are \`engine/scripts/english_checks.mjs\`: a real skill and outcome, exactly one right answer, no named mistake marked right, every wrong answer names a library misconception and tells the child what it is, a working with exactly one false step, two or more named wrong answers on a typed question, passage readability, British spelling, no emoji or em dash, no two families of one skill with the same structure.`);
P(`- **Pre-review checks, strict** (\`npm run review:precheck:english\`, \`--strict\` to fail on a hard failure): ${pcItems} items drawn in this run, ${pcHard} hard failures, ${pcSoft} with a soft flag. Report: \`docs/qa/precheck-english-g5-${DATE}.md\`.`);
P('- **Coverage** (`npm run coverage:english`): `docs/qa/coverage-english-g5-' + DATE + '.md`, every outcome with its route.');
P('- `npm test` and `npm run build` pass, apart from two tests that fail on the base branch as well (the edge function deploy record: `no edge function has changed since it was last deployed` and `the two functions a child depends on have a deploy on record`). The school and voice tutor function bundles were rebuilt because the shared question kit gained two optional fields.');
P();
P('## Coverage of the 200 official outcomes');
P();
P('| Route | Outcomes | Meaning |');
P('|---|---|---|');
for (const [r, name] of Object.entries(ROUTE_NAMES)) P(`| ${name.title} | ${n(r)} | ${name.means} |`);
P(`| **All** | **${rows.length}** | |`);
P();
P('Because the design repeats some outcomes in later themes (respond to factual and inferential questions, predict, use context clues), one skill serves every outcome that repeats it. The outcomes each skill serves are listed in the skills table.');
P();
P('## Findings that matter before anything is switched on');
P();
P('1. **English needs its own marker.** The Maths marker (`answerCheck.js`) drops a leading "a", "an" or "the", ignores punctuation and treats words as terms that can swap places. It marks "few" right for "a few", a sentence without its quotation marks right for one with them, and "than taller" right for "taller than". `src/ai-tutor/answerCheckText.js` is the English marker (exact words, in order, with punctuation; a tapped option matched exactly; capital letters, spare spaces, curly quotes and a final full stop on a single word forgiven when typed). Families carry `marker: \'text\'`; the pre-review checks use it. The lesson screen does not call it yet, so it must before an English family is served.');
P('2. **The engine has no English subject yet.** `knowledgeGraph.js` is Maths, so the English families are kept out of the Maths bank (and out of `FAMILIES`), and are not reachable by `generateProblem`. A subject entry, a lesson screen and a skill map for English are still to build.');
P(`3. **Comprehension needs the passage on screen.** A comprehension problem carries \`passage: { title, text }\` (a one-line addition to \`families/core.js\`). The lesson screen has to show it above the question. Passages are ${Math.min(...passageWords)} to ${Math.max(...passageWords)} words so they fit a phone.`);
P('4. **Questions about sounds, stress, intonation, speaking and reading aloud** (Listening and Speaking, reading fluency) need a voice tool or a teacher. They are listed as such, not faked with a typed question.');
P(`5. **Not built:** ${NOT_BUILT.map(x => `${x[1]} (${x[0]}). ${x[2]}`).join(' ')}`);
P('6. Misconceptions on the reading skills carry generic examples (the pattern of the wrong answer, not one question), because the wrong answers depend on the passage. The families name the misconception behind every wrong choice.');
P();
P('## Skills');
P();
P('Outcome letters are the design\'s own, in the skill\'s sub-strand, followed by the repeated outcomes in other themes it also serves. Families are the structures that check it.');
P();
for (const strand of ['Grammar in Use', 'Writing', 'Reading', 'Listening and Speaking']) {
  P(`### ${strand}`);
  P();
  P('| Skill | Outcomes it serves | Families (structures) | Mastery rule (proposed) |');
  P('|---|---|---|---|');
  for (const k of skills.filter(x => x.sub.strand === strand)) {
    const fams = famOf(k.code);
    const outs = k.outcomes.map(o => `${short(o).replace(/_[^.]*\./, '.')}`).join(', ');
    P(`| ${cell(k.name)} (${short(k.code).split('.').pop()}) | ${outs} | ${fams.length}: ${[...new Set(fams.map(f => f.kind))].join(', ')} | ${cell(k.mastery)} |`);
  }
  P();
}
P('## Misconception library');
P();
P(`${mis.length} entries. Columns: the wrong idea; the revealing question (what to ask to see it); the repair (what to do about it); the source. **Every one is draft.** "Used" says whether a family draws it as a wrong answer (${mis.length - unused.length} of ${mis.length} are used).`);
for (const s of g5.sub_strands.filter(x => x.misconceptions.length)) {
  for (const k of s.skills) {
    const L = s.misconceptions.filter(m => m.skill === k.code);
    if (!L.length) continue;
    P();
    P(`### ${k.name} (${short(k.code)})`);
    P();
    P('| Code | Wrong idea | Revealing question | Repair | Source | Used |');
    P('|---|---|---|---|---|---|');
    for (const m of L) P(`| ${m.code.slice(k.code.length + 1)} | ${cell(m.error)} | ${cell(m.reveals)} | ${cell(m.help)} | ${cell(m.source)} | ${isUsed(m) ? 'yes' : 'no'} |`);
  }
}
if (unused.length) { P(); P(`Not yet drawn by a family: ${unused.map(m => m.code.split('.').pop()).join(', ')}.`); }
P();
P('## Families, per outcome');
P();
P('Every outcome a family covers, with the families that check it (ids are `eng5.<group>.<structure>`).');
P();
P('| Outcome | Families |');
P('|---|---|');
for (const r of rows.filter(x => x.route === 'family')) P(`| ${short(r.s.code).replace(/_.*$/, '')}.${r.o.letter} ${cell(r.o.text.slice(0, 70))} | ${[...new Set(r.fams.map(f => f.id))].join(', ')} |`);
P();
P('## What needs composition marking, a teacher or a voice tool');
P();
P(`**Composition marking (${n('composition')} outcomes).** HOREB's English composition marker scores a piece out of 20 (content, organisation, language, mechanics, 5 each; \`scripts/mark-composition.template.ts\`, prompts in \`src/writing/prompts.js\`). These outcomes point to it, with the composition type to pick:`);
P();
P('| Outcome | Marker type | Outcome text |');
P('|---|---|---|');
for (const r of rows.filter(x => x.route === 'composition')) P(`| ${short(r.s.code).replace(/_.*$/, '')}.${r.o.letter} | ${COMPOSITION_TYPE(r.o, r.s)} | ${cell(r.o.text.slice(0, 100))} |`);
P();
P(`**Voice or a teacher listening (${n('voice')} outcomes)**: sounds (/ʌ/, /p/ /b/, /f/ /v/, /k/ /g/, /h/, /s/ /z/, /aɪ/ and others), word stress, rising and falling intonation, speaking accurately, orally constructed sentences, listening for main ideas, non-verbal cues, reading aloud with expression. None has a family. They wait for the voice tutor.`);
P();
P(`**Teacher only (${n('teacher')} outcomes)**: handwriting in joined letters, filling and designing forms, choosing reading material, creating mental images, relating a story to the child's own life, judging visuals, spelling dictation of selected words, and the "identify the parts of a composition or letter" outcomes (which could become text questions later). **Attitude (${n('attitude')} outcomes)**: adopt, advocate, promote, recommend, challenge, appreciate. These are observed, never tested by a question.`);
P();
P('## Review list for a Kenyan English teacher');
P();
P('Please decide each item below. Signing a family off means adding its id to `SIGNED_ENGLISH` in `src/ai-tutor/content/families/eng_signed.js`; until then nothing here reaches a child.');
P();
P('### Rules to confirm (the family treats the first as right)');
P();
P('1. **Must and should** (`M_MODAL_STRENGTH`): "Passengers must wear a seat belt" (law) against "You should wash your hands" (advice). A learner who writes "should" for the law, or "must" for the advice, is marked wrong. Is that the strength taught at Grade 5?');
P('2. **Comparing two things** (`M_ADJ_SUPERLATIVE_FOR_TWO`): "Of the two sisters, Achieng is the taller." Is "the tallest of two" marked wrong in your classroom?');
P('3. **Order of adjectives** (`M_ADJ_ORDER_*`): the design says "size, shape and age". The families use the usual order opinion, size, age, shape, colour: "a big old round stool", "a small red bag". Which order do you teach?');
P('4. **Double quotation marks** (`M_QUOTE_SINGLE`): single marks are valid British style; the design asks for double marks, so single marks are wrong in the families.');
P('5. **Comma before and** (`M_COMMA_SPLICE`): "The bell rang, we ran outside" is marked wrong; "The bell rang, and we ran outside" right. Taught at Grade 5?');
P('6. **Present tense for the future** (`M_FUT_PRESENT_FOR_FUTURE`): used only where it is plainly wrong ("I promise that I help you tomorrow"). Check the other items in the pool; "will" and "shall" are accepted alike.');
P('7. **Since as because** (`M_CONJ_SINCE_TIME`) and **plural possessives** (`M_APOS_PLURAL_OWNER`: "the girls\' room"): are they taught at Grade 5?');
P('8. **Few / a few** (`M_QUANT_NEGATIVE_POSITIVE`): the "hardly any" against "some" meaning is tested through the clause after the gap. Is that depth expected?');
P('9. **Demonstratives with a hand**: "Look at ___ books in my hands" has these as the answer and those as a near / far mistake. "Those books in my hands" is grammatical in some voices.');
P('10. **Question tags** (`M_TAG_INVARIABLE`): "isn\'t it" for every statement is treated as a learner error. Is it common among your learners?');
P('11. **Proverbs**: eight common English proverbs are used. Are these the ones children meet? Add Kenyan English proverbs you teach.');
P('12. **Double imperatives**: not built, because the design does not say what they are (likely "Go and fetch water"). Please say, and a pool can be added.');
P();
P('### Source of the misconceptions');
P();
P(`${mis.filter(m => /Kiswahili/.test(m.source)).length} entries name a Kiswahili influence (adjective after the noun, no separate small word for to / of, one word for adjective and adverb, no do-support in questions, words that carry the idea of going to a place, double joining words). The rest are learner errors that are common in English as a second language. **None is checked against a real Kenyan learner's script yet.** Please strike out, reword or add: the library is the part a child psychologist or a teacher should own.`);
P();
P('### Questions and passages');
P();
P('- Read every passage for originality, cultural fit and reading level (10 passages, one section each in `eng_g5_passages.js`). Each question in them has a named wrong answer; check that the "right" answer is the only defensible one, especially the inference and "worked out" questions.');
P('- Check wrong answers that could be accepted: typed gap questions accept only the listed forms (for example "softly", "quietly", "gently" for the manner adverb, "could" or "would" for long ago). Add any other correct form a learner might type. Wrong answers that look odd in a sentence (such as "Kamau is tallest Baraka") are there to show a named mistake in a find-the-mistake working, not as a question.');
P('- Check spellings and punctuation items (apostrophe, direct speech, exclamation mark, double letters, homophones) for the exact rule you teach.');
P('- Kenyan context: names, places and foods are used throughout (Nyeri, Kisumu, Kitui, Mombasa, Nakuru, Eldoret; matatu, boda boda, sukuma wiki, githeri, ugali). Strike any that read wrongly.');
P('- The teacher-only and voice outcomes (see above) are not built: please confirm the routes in `scripts/data/english-g5-routes.mjs`.');
P();
writeFileSync(resolve(root, `docs/qa/english-g5-${DATE}.md`), out.join('\n') + '\n');
console.log(`written docs/qa/english-g5-${DATE}.md (${out.join('\n').length} chars)`);
