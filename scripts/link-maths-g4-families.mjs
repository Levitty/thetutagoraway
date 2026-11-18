// The old command for filing the Grade 4 families of g4.js and labelFixes.js (12 Nov 2026, family level). Since 18 Nov 2026 the links
// live in scripts/data/maths-g4/<sub>.mjs (`links`) and the one linker applies them, retagging wrong answers one by one where it can:
//   node scripts/link-maths-families.mjs 4
process.argv[2] = '4';
await import('./link-maths-families.mjs');
