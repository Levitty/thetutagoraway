// Kept so the old command still works: the Grade 6 and Grade 7 Maths SQL now come from one script, scripts/build-maths-sql-grade.mjs.
//   node scripts/build-maths-g7-sql.mjs     is     node scripts/build-maths-sql-grade.mjs 7
process.argv[2] = '7';
await import('./build-maths-sql-grade.mjs');
