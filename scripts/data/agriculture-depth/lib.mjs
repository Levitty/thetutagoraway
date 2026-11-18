// Shorthand for the Agriculture depth data (scripts/data/agriculture-depth/g<N>.mjs), read by scripts/agriculture-depth.mjs.
// pk: one teaching pack entry. floor = [prerequisite, question, answer]; board = [[beat, do, say?], ...] with a child's turn
// (pause, predict, count or child_draws) before any reveal; checks = exactly two [question, answer, what it shows]. The pack's
// misconception lines (listen-for, ask, repair) come from the library unless given in mis.
export const pk = (key_step, floor, reps, steps, contexts, board, checks, mis) => ({ key_step, floor, reps, steps, contexts, board, checks, ...(mis ? { mis } : {}) });
// Codes used across the grades.
export const S4 = 'SCIE.G4.', S5 = 'SCIE.G5.', S6 = 'SCIE.G6.', I7 = 'INTE.G7.', I8 = 'INTE.G8.', I9 = 'INTE.G9.';
export const E1 = 'ENVI.G1.', E2 = 'ENVI.G2.', E3 = 'ENVI.G3.';
export const A4 = 'AGRI.G4.', A5 = 'AGRI.G5.', A6 = 'AGRI.G6.', A7 = 'AGRI.G7.', A8 = 'AGRI.G8.';
