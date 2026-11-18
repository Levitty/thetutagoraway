// The old command for the Grade 4 Maths map (first pass, 12 Nov 2026). Since 18 Nov 2026 the data is in scripts/data/maths-g4/
// (one file per sub-strand, with the teaching pack) and Grade 4 is built by the one grade builder:
//   node scripts/build-maths-grade.mjs 4     then:  node scripts/build-curriculum-map-grade.mjs 4  and  node scripts/build-teaching-pack.mjs
process.argv[2] = '4';
await import('./build-maths-grade.mjs');
