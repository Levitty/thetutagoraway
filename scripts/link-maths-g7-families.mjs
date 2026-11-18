// Kept so the old command still works: Grade 7 and Grade 8 families are linked by one tool, scripts/link-maths-families.mjs.
//   node scripts/link-maths-g7-families.mjs [sub-strand key]     is     node scripts/link-maths-families.mjs 7 [sub-strand key]
process.argv.splice(2, 0, '7');
await import('./link-maths-families.mjs');
