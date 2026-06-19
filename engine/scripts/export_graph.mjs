// ============================================================================
// Export the JS knowledge graph(s) to JSON so the Python engine shares the
// EXACT same curriculum. Run: node engine/scripts/export_graph.mjs
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const outDir = resolve(__dirname, '..', 'data');
mkdirSync(outDir, { recursive: true });

// Each subject: its graph module + a label for the output file.
const subjects = [
  { id: 'math', module: '../../src/ai-tutor/knowledgeGraph.js', strandsKey: 'STRANDS', skillsKey: 'SKILLS' },
  { id: 'afm', module: '../../src/ai-tutor/afmKnowledgeGraph.js', strandsKey: 'AFM_STRANDS', skillsKey: 'AFM_SKILLS' },
  { id: 'apm', module: '../../src/ai-tutor/apmKnowledgeGraph.js', strandsKey: 'APM_STRANDS', skillsKey: 'APM_SKILLS' },
];

for (const subj of subjects) {
  let mod;
  try {
    mod = await import(resolve(__dirname, subj.module));
  } catch (e) {
    console.warn(`Skipping ${subj.id}: ${e.message}`);
    continue;
  }

  const SKILLS = mod[subj.skillsKey] || mod.default;
  const STRANDS = mod[subj.strandsKey] || [];
  if (!SKILLS) { console.warn(`No skills export for ${subj.id}`); continue; }

  const skills = Object.values(SKILLS).map(s => ({
    id: s.id,
    name: s.name,
    grade: s.grade,
    strand: s.strand,
    prerequisites: s.prerequisites || [],
    key_prerequisites: s.keyPrerequisites || s.prerequisites || [],
    encompassings: s.encompassings || [],
    weight: s.weight ?? 3,
    critical: !!s.critical,
    knowledge_points: s.knowledgePoints ?? 3,
    mastery_threshold: s.masteryThreshold ?? 0.85,
    min_problems: s.minProblems ?? 6,
    estimated_minutes: s.estimatedMinutes ?? 15,
    xp_value: s.xpValue ?? 15,
  }));

  const graph = {
    subject: subj.id,
    strands: STRANDS,
    grades: [...new Set(skills.map(s => s.grade))].sort((a, b) => a - b),
    skill_count: skills.length,
    skills,
  };

  const outPath = resolve(outDir, `${subj.id}_graph.json`);
  writeFileSync(outPath, JSON.stringify(graph, null, 2));
  console.log(`Wrote ${skills.length} skills -> ${outPath.replace(repoRoot + '/', '')}`);
}
