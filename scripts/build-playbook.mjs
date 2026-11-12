// Writes src/voice-tutor/playbook.js from docs/tutor-training (the tutor's teaching moves and example lessons).
// The round 2 drafts (PLAYBOOK_ROUND2_DRAFT.md, EXEMPLARS_ROUND2_DRAFT.md) are written too, but the prompt loads them only
// when ROUND2_ON is true in src/voice-tutor/prompt.js (PLAN_TO_FOUR.md step 5: after Ruth has reviewed them).
import { readFileSync, writeFileSync } from 'node:fs';
const clean = (t) => t.replace(/^Sources:.*\n/gm, '').replace(/^Sources are numbered.*\n/gm, '').trim();
// A draft's title says it is not loaded anywhere; loaded, it is round 2 of the playbook.
const draft = (t) => clean(t).replace(/ \(DRAFT, not loaded anywhere\)/, '').replace(/\n---\s*$/, '').trim();
const pb = clean(readFileSync('docs/tutor-training/PLAYBOOK.md', 'utf8'));
const ex = clean(readFileSync('docs/tutor-training/EXEMPLARS.md', 'utf8'));
const pb2 = draft(readFileSync('docs/tutor-training/PLAYBOOK_ROUND2_DRAFT.md', 'utf8'));
const ex2 = draft(readFileSync('docs/tutor-training/EXEMPLARS_ROUND2_DRAFT.md', 'utf8'));
writeFileSync('src/voice-tutor/playbook.js', `// GENERATED from docs/tutor-training/PLAYBOOK.md and EXEMPLARS.md (owner, 12 Nov 2026: "the tutor seems to know
// nothing about being a tutor"), and the round 2 drafts. Edit the docs, then: node scripts/build-playbook.mjs
export const PLAYBOOK = ${JSON.stringify(pb)};
export const EXEMPLARS = ${JSON.stringify(ex)};
// Round 2 (PLAYBOOK_ROUND2_DRAFT.md, EXEMPLARS_ROUND2_DRAFT.md): loaded only when prompt.js ROUND2_ON is true.
export const PLAYBOOK_ROUND2 = ${JSON.stringify(pb2)};
export const EXEMPLARS_ROUND2 = ${JSON.stringify(ex2)};
export default { PLAYBOOK, EXEMPLARS, PLAYBOOK_ROUND2, EXEMPLARS_ROUND2 };
`);
console.log('playbook.js written');
