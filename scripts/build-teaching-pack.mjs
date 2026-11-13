// Builds the tutor's Grade 5 maths teaching pack (research round 3, 13 Nov 2026).
//
//   Source:    curriculum/mathematics/teaching/g5/*.json   (hand-written, one file per sub-strand)
//   Library:   curriculum/mathematics/g5.json              (skills and the misconception library)
//   Writes:    src/voice-tutor/teachingPackData.js         (one object the tutor can load per skill)
//   Optional:  --doc <path>  also writes the readable pack (TEACHING_PACK_G5.md) for teachers and the owner
//
// The pack adds teaching knowledge on top of the curriculum map; it never repeats what the map already holds.
// The skill name and each misconception's error and example come from the library at build time, so the
// library stays the single source for those.
//
// Not loaded by the live tutor yet: wiring it into the turn brief is a separate, approved change.
//
//   node scripts/build-teaching-pack.mjs [--doc ../Tutagora/Build/voice-tutor/training/TEACHING_PACK_G5.md]
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACK_DIR = join(ROOT, 'curriculum/mathematics/teaching/g5');
const LIBRARY = join(ROOT, 'curriculum/mathematics/g5.json');
const OUT = join(ROOT, 'src/voice-tutor/teachingPackData.js');

export function loadSources() {
  const files = readdirSync(PACK_DIR).filter((f) => f.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  return files.map((f) => ({ file: f, ...JSON.parse(readFileSync(join(PACK_DIR, f), 'utf8')) }));
}

export function loadLibrary() {
  const lib = JSON.parse(readFileSync(LIBRARY, 'utf8'));
  const skills = new Map();
  const misconceptions = new Map();
  for (const ss of lib.sub_strands) {
    for (const s of ss.skills) skills.set(s.code, { ...s, sub_strand: ss.code, sub_strand_name: ss.sub_strand, number: ss.number });
    for (const m of ss.misconceptions) misconceptions.set(m.code, m);
  }
  return { lib, skills, misconceptions };
}

// One entry per skill, enriched from the library.
export function buildPack() {
  const sources = loadSources();
  const { skills, misconceptions } = loadLibrary();
  const pack = {};
  for (const src of sources) {
    for (const e of src.skills) {
      const s = skills.get(e.skill);
      pack[e.skill] = {
        ...e,
        name: s ? s.name : null,
        sub_strand: src.sub_strand,
        sub_strand_name: src.title,
        status: e.status || src.status,
        misconceptions: (e.misconceptions || []).map((m) => {
          const lm = misconceptions.get(m.code);
          return { ...m, error: lm ? lm.error : null, example: lm ? lm.example : null };
        }),
      };
    }
  }
  return { sources, pack };
}

const BEAT_WORDS = { draw: 'Draw', point: 'Point', count: 'Count with the child', predict: 'Predict', pause: 'Pause and wait', child_draws: 'Child draws', reveal: 'Reveal after the answer', write: 'Write' };

export function renderDoc({ sources, pack }) {
  const { skills } = loadLibrary();
  const out = [];
  const total = [...skills.keys()].length;
  const covered = Object.keys(pack).length;
  out.push('# HOREB teaching pack: Grade 5 mathematics (DRAFT)');
  out.push('');
  out.push('GENERATED from the HOREB repo (`curriculum/mathematics/teaching/g5/*.json`) by `node scripts/build-teaching-pack.mjs --doc <this file>`. Edit the JSON, not this page.');
  out.push('');
  out.push(`Research round 3, 13 Nov 2026 night. ${covered} of the ${total} Grade 5 skills in the curriculum map have an entry. Fractions come first and are written in full; the other strands are shorter. Nothing here has been checked by a Kenyan maths teacher yet, and the live tutor does not load it.`);
  out.push('');
  out.push('How to read an entry:');
  out.push('- **Key step**: the step the child must say or draw. The tutor never says it first (playbook round 3, R3-3).');
  out.push('- **Floor check**: one question on the skill underneath, asked first when the learner record has no evidence (R3-8).');
  out.push('- **Pictures, in order**: real thing, then a picture, then numbers (concreteness fading, source 52).');
  out.push('- **Teaching steps**: the order to teach it in.');
  out.push('- **Board**: the drawing as choreographed beats. "Pause and wait" and "Child draws" are the child\'s turns; "Reveal" happens only after the child answers.');
  out.push('- **Misconceptions**: from the curriculum map\'s library. For each: what the child might say, the question that reveals it, and the repair.');
  out.push('- **Checks**: two questions to use at the end, the last one with no help (R3-5).');
  out.push('');
  out.push('Source numbers refer to `Tutagora/Build/voice-tutor/training/SOURCES.md`.');
  out.push('');
  // Fractions first (the tutor's first strand), then the rest in curriculum order.
  const ordered = [...sources.filter((s) => s.sub_strand.endsWith('.FRACTIONS')), ...sources.filter((s) => !s.sub_strand.endsWith('.FRACTIONS'))];
  for (const src of ordered) {
    out.push(`## ${src.title}`);
    out.push('');
    if (src.notes) { out.push(src.notes); out.push(''); }
    if (src.sources && src.sources.length) { out.push(`Sources: ${src.sources.join(', ')}.`); out.push(''); }
    for (const e of src.skills) {
      const p = pack[e.skill];
      out.push(`### ${p.name || e.skill}`);
      out.push('');
      out.push(`\`${e.skill}\``);
      out.push('');
      out.push(`**Key step.** ${e.key_step}`);
      out.push('');
      if (e.floor) out.push(`**Floor check.** ${e.floor.prerequisite} Ask: "${e.floor.question}" (${e.floor.answer}).`);
      out.push('');
      if (e.representations) { out.push(`**Pictures, in order.** ${e.representations.join('; then ')}.`); out.push(''); }
      out.push('**Teaching steps.**');
      e.steps.forEach((s, i) => out.push(`${i + 1}. ${s}`));
      out.push('');
      out.push(`**Kenyan contexts.** ${e.contexts.join('; ')}.`);
      out.push('');
      out.push('**Board.**');
      e.board.forEach((b, i) => out.push(`${i + 1}. *${BEAT_WORDS[b.beat] || b.beat}.* ${b.do}${b.say ? ` Say: "${b.say}"` : ''}`));
      out.push('');
      out.push('**Misconceptions.**');
      for (const m of p.misconceptions) {
        const ex = m.example && m.example.question ? ` (e.g. ${m.example.question} gives ${m.example.wrong_answer})` : '';
        out.push(`- **${m.error || m.code}**${ex}`);
        if (m.listen_for && m.listen_for.length) out.push(`  - Listen for: ${m.listen_for.map((w) => `"${w}"`).join(', ')}.`);
        if (m.ask) out.push(`  - Ask: "${m.ask}"`);
        if (m.repair) out.push(`  - Repair: ${m.repair}`);
      }
      out.push('');
      out.push('**Checks.**');
      e.checks.forEach((c, i) => out.push(`${i + 1}. ${c.question} *Answer: ${c.answer}.* (${c.shows})`));
      out.push('');
    }
  }
  return out.join('\n');
}

export function renderData({ pack }) {
  return `// GENERATED by scripts/build-teaching-pack.mjs from curriculum/mathematics/teaching/g5/*.json and the
// misconception library in curriculum/mathematics/g5.json. Edit the JSON, then: node scripts/build-teaching-pack.mjs
// Research round 3 (13 Nov 2026). DRAFT: not checked by a Kenyan maths teacher, not loaded by the live tutor.
export const TEACHING_PACK_G5 = ${JSON.stringify(pack, null, 1)};
export default TEACHING_PACK_G5;
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const built = buildPack();
  writeFileSync(OUT, renderData(built));
  console.log(`teachingPackData.js written: ${Object.keys(built.pack).length} skills`);
  const i = process.argv.indexOf('--doc');
  if (i > 0 && process.argv[i + 1]) {
    writeFileSync(process.argv[i + 1], renderDoc(built) + '\n');
    console.log(`doc written: ${process.argv[i + 1]}`);
  }
}
