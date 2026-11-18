// The old command for the Grade 4 Maths curriculum map (12 Nov 2026). Since 18 Nov 2026 Grade 4 is built by the one map builder:
//   node scripts/build-curriculum-map-grade.mjs 4
process.argv[2] = '4';
await import('./build-curriculum-map-grade.mjs');
