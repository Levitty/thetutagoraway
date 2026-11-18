// Kept so the old command still works: the Grade 7 and Grade 8 Maths maps now come from one builder, scripts/build-maths-grade.mjs.
//   node scripts/build-maths-g7.mjs     is     node scripts/build-maths-grade.mjs 7
process.argv[2] = '7';
await import('./build-maths-grade.mjs');
