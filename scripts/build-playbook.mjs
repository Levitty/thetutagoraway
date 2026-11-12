// Writes src/voice-tutor/playbook.js from docs/tutor-training (the tutor's teaching moves and example lessons).
import { readFileSync, writeFileSync } from 'node:fs';
const clean = (t) => t.replace(/^Sources:.*\n/gm, '').replace(/^Sources are numbered.*\n/gm, '').trim();
const pb = clean(readFileSync('docs/tutor-training/PLAYBOOK.md', 'utf8'));
const ex = clean(readFileSync('docs/tutor-training/EXEMPLARS.md', 'utf8'));
writeFileSync('src/voice-tutor/playbook.js', `// GENERATED from docs/tutor-training/PLAYBOOK.md and EXEMPLARS.md (owner, 12 Nov 2026: "the tutor seems to know
// nothing about being a tutor"). Edit the docs, then: node scripts/build-playbook.mjs
export const PLAYBOOK = ${JSON.stringify(pb)};
export const EXEMPLARS = ${JSON.stringify(ex)};
export default { PLAYBOOK, EXEMPLARS };
`);
console.log('playbook.js written');
