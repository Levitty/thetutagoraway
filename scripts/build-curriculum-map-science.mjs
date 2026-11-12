// Science Grade 5 map: now one call to the generic builder (scripts/build-subject-map.mjs). Kept so the old command works.
//   node scripts/build-curriculum-map-science.mjs [path to g5.json]
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const extra = process.argv[2] ? ['--source', process.argv[2]] : [];
const r = spawnSync('node', [fileURLToPath(new URL('./build-subject-map.mjs', import.meta.url)), 'science', '5', '--title', 'Science and Technology', ...extra], { stdio: 'inherit' });
process.exit(r.status ?? 1);
