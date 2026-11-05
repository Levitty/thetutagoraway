// Seeded fingerprints of what every skill puts in front of a child, so a test
// can prove that nothing changed without anyone meaning it to. One hash per
// skill: 40 draws of the skill's own questions and 12 of its special ones,
// reseeded per skill so a change in one cannot ripple into the next.
import { createHash } from 'node:crypto';
import { SKILLS } from '../../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../../src/ai-tutor/problemGenerators.js';
import { specialItemFor } from '../../src/ai-tutor/specialItems.js';

const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const seedOf = (id) => [...id].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
const plain = (p) => JSON.stringify(p, (k, v) => (typeof v === 'function' ? undefined : k === 'verify' ? undefined : v));

export function snapshotSkill(id) {
  const real = Math.random;
  Math.random = mulberry32(seedOf(id));
  const warn = console.warn; console.warn = () => {};
  const h = createHash('sha1');
  try {
    for (let i = 0; i < 40; i++) {
      h.update(plain(generateProblem(id, { kp: i % 4, level: i % 7 === 0 ? 'concrete' : 'abstract' })) || '');
    }
    for (let i = 0; i < 12; i++) {
      h.update(plain(specialItemFor(id, { correctSoFar: 3, random: () => (i % 12) / 18 })) || '');
    }
  } finally { Math.random = real; console.warn = warn; }
  return h.digest('hex').slice(0, 12);
}
export const snapshotAll = () => Object.fromEntries(Object.keys(SKILLS).map(id => [id, snapshotSkill(id)]));
