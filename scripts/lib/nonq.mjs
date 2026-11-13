// ============================================================================
// SHARED HELPER for the "non-question outcomes" note of a subject-grade (written 13 Nov 2026).
// A subject-grade script (scripts/build-<subject>-g<N>-nonq.mjs) passes: the curriculum file, the registry entry, a
// classify(outcomeText, subCode, outcomeCode) that returns Q, W, O, P or A, and what each kind needs. This writes
// docs/qa/<subject>-g<N>-non-question-outcomes-<date>.md and prints the counts.
//   Q  a question can test it      W  writing: composition marking      O  speaking or oral check: a teacher listening
//   P  a practical task, product or portfolio      A  attitude: teacher observation (PLAN_OBSERVATION_RUBRICS.md)
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';

export const writeNonQ = async ({ subject, grade, title, curriculumFile, entryFile, classify, needs, notes = [], prefix }) => {
  const cur = JSON.parse(readFileSync(new URL(`../../${curriculumFile}`, import.meta.url), 'utf8'));
  const entry = (await import(`../../${entryFile}`)).default;
  const withFamily = new Set(entry.families.map(f => f.outcome));
  const rows = [], n = { Q: 0, W: 0, O: 0, P: 0, A: 0 };
  const cell = (t) => String(t).replace(/\|/g, '/').replace(/\s+/g, ' ');
  for (const s of cur.sub_strands) for (const o of s.outcomes) {
    const k = classify(o.text, s.code, o.code);
    n[k]++;
    const has = withFamily.has(o.code);
    rows.push({ code: o.code, k, has, text: o.text, line: `| ${o.code.slice(prefix.length)} | ${k} | ${has ? (k === 'Q' ? 'yes' : 'yes (knowledge half)') : (k === 'Q' ? 'NO' : 'no')} | ${cell(o.text)} | ${k === 'Q' ? 'Question families.' : needs[k]} |` });
  }
  const total = rows.length, withFam = rows.filter(r => r.has).length, qNo = rows.filter(r => r.k === 'Q' && !r.has);
  const date = '2026-11-13';
  const md = `# ${title}: outcomes a question cannot fully test (13 Nov 2026)

Built from \`${curriculumFile}\` and the registry entry. Outcome text is KICD's, word for word. **Q** means a question can test it, **W** writing (composition marking), **O** speaking or an oral check (a teacher listening), **P** a practical task, product or portfolio, **A** an attitude (teacher observation).

- Outcomes: ${total}. By what tests them best: Q ${n.Q}, W ${n.W}, O ${n.O}, P ${n.P}, A ${n.A}.
- Outcomes with at least one question family: ${withFam}. Q outcomes with a family: ${rows.filter(r => r.k === 'Q' && r.has).length} of ${n.Q}. Q outcomes with no family: ${qNo.length}.
- A non-Q outcome that has a family: the family tests the recognition half and the rest still needs the teacher or the task named below.
${notes.map(x => `- ${x}`).join('\n')}

| Outcome | Kind | Has a family | Outcome text | What it needs |
|---|---|---|---|---|
${rows.map(r => r.line).join('\n')}
`;
  const out = `docs/qa/${subject}-g${grade}-non-question-outcomes-${date}.md`;
  writeFileSync(new URL(`../../${out}`, import.meta.url), md);
  console.log(`non-question doc ${out}: ${total} outcomes, Q ${n.Q} W ${n.W} O ${n.O} P ${n.P} A ${n.A}; with a family ${withFam}; Q covered ${rows.filter(r => r.k === 'Q' && r.has).length}, Q without a family ${qNo.length}`);
  return { n, qNo };
};
