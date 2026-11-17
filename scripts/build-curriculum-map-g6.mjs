// Kept so the old command still works: the Grade 6 and Grade 7 maps now come from one script, scripts/build-curriculum-map-grade.mjs.
//   node scripts/build-curriculum-map-g6.mjs     is     node scripts/build-curriculum-map-grade.mjs 6
process.argv[2] = '6';
await import('./build-curriculum-map-grade.mjs');
