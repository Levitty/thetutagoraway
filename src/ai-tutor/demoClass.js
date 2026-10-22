// ============================================================================
// A CLASS TO DEMONSTRATE WITH
//
// Not rows in the database. Fake children with real-looking names, sitting in
// production tables beside real ones, are a thing you can never fully take
// back — and on this project they would land in the one table that is
// currently readable by anyone. So the demo class lives here, is assembled in
// the browser, is never written anywhere, and disappears when the tab closes.
//
// What it is NOT is fake OUTPUT. Every number the demo shows — levels, gaps,
// the strand bars, what to teach next — is computed by the real engine from
// these answer histories, exactly as it would be for a real child. The data is
// invented; the reasoning on screen is the product.
//
// The class is built around the finding worth demonstrating: three children
// failing three DIFFERENT skills, for one shared reason. A roster cannot show
// that however long you stare at it.
// ============================================================================
import { SKILLS } from './knowledgeGraph.js';

// How a skill looks after a child has met it. `mastered` is what an assignment
// counts as done, and what the gap finder treats as solid ground.
const solid = (attempts = 5, correct = 5) => ({
  attempts, correct, mastered: true, repNum: 3, learningSpeed: 1,
  consecutiveFailures: 0, practisedHere: true,
  recent: Array.from({ length: attempts }, (_, i) => i < correct),
});
// Struggling: isStruggling() wants 3+ attempts under 60%, which is what makes
// a skill show up as a gap rather than as something merely unfinished.
const shaky = (attempts = 5, correct = 1) => ({
  attempts, correct, mastered: false, repNum: 1, learningSpeed: 0.8,
  consecutiveFailures: 2, practisedHere: true,
  recent: Array.from({ length: attempts }, (_, i) => i < correct),
});
// Met once in the diagnostic and failed it. One attempt, but a real verdict.
const failedCheck = () => ({
  attempts: 1, correct: 0, mastered: false, fromDiagnostic: true, passed: false,
  repNum: 1, learningSpeed: 1, consecutiveFailures: 1, recent: [false],
});

const G4_CORE = ['G4_PLACE_VALUE', 'G4_NUMBER_WORDS', 'G4_ORDER_ROUND', 'G4_ODD_EVEN', 'G4_ADD', 'G4_SUB', 'G4_MULTIPLY', 'G4_DIVIDE'];
const G5_CORE = ['G5_PLACE_VALUE', 'G5_ADDITION', 'G5_SUBTRACTION', 'G5_MULTIPLICATION', 'G5_DIVISION', 'G5_FRACTIONS_INTRO'];

// A real Grade 5 has years of work behind them, so a demo child with six
// mastered skills reads as "13% mastered" and the roster looks like a class in
// crisis. `through` fills in everything up to a grade they are genuinely past,
// which is what makes the percentages mean anything — and `except` keeps the
// specific skills a child is meant to be missing actually missing, so the gap
// the demo is built around survives.
const upTo = (grade, except = []) => {
  const skip = new Set(except);
  return Object.values(SKILLS)
    .filter(s => Number.isFinite(s.grade) && s.grade <= grade && !skip.has(s.id))
    .map(s => s.id);
};

const learner = (name, { through = 3, mastered = [], struggling = [], failed = [], grade = 5 }) => {
  const held = [...upTo(through, [...struggling, ...failed]), ...mastered];
  return {
    name,
    grade,
    skills: {
      ...Object.fromEntries(held.map(id => [id, solid()])),
      ...Object.fromEntries(struggling.map(id => [id, shaky()])),
      ...Object.fromEntries(failed.map(id => [id, failedCheck()])),
    },
  };
};

// Eight children, and a reason for each of them to be there.
const ROSTER = [
  // The three the demo is really about: three different failures, one cause.
  // They hold Grade 3 and below but never got place value, so the work above
  // it keeps collapsing — which is the finding on screen.
  learner('Amani Otieno', { through: 3, mastered: ['G4_ADD', 'G4_SUB'], struggling: ['G4_NUMBER_WORDS'] }),
  learner('Baraka Kimani', { through: 3, mastered: ['G4_ADD', 'G4_ODD_EVEN'], struggling: ['G4_ORDER_ROUND'] }),
  learner('Chipo Wanjiru', { through: 3, mastered: ['G4_SUB'], struggling: ['G4_ODD_EVEN'] }),
  // Two who have Grade 4 and are stuck on the grade they are actually in.
  learner('Dalila Mwangi', { through: 4, struggling: ['G5_ADDITION'] }),
  learner('Esha Njoroge', { through: 4, struggling: ['G5_ADDITION', 'G5_SUBTRACTION'] }),
  // Failed a check rather than ground to a halt — a different signal, and
  // worth having on screen so the two can be told apart.
  learner('Faraji Kiptoo', { through: 4, mastered: ['G5_PLACE_VALUE'], failed: ['G5_MULTIPLICATION'] }),
  // On track.
  learner('Grace Atieno', { through: 4, mastered: [...G5_CORE.slice(0, 5)] }),
  // Ahead, so the dashboard is not a wall of red.
  learner('Hamisi Juma', { through: 5, mastered: ['G6_PLACE_VALUE', 'G6_MULTIPLICATION', 'G6_FRACTIONS_ADD'] }),
];

const DEMO_CLASS_ID = 'demo-class-grade-5';
const idFor = (i) => `demo-student-${i + 1}`;

/** Students in the shape TeacherDashboard builds from a progress row. */
export const demoStudents = () => ROSTER.map((r, i) => ({
  userId: idFor(i),
  name: r.name,
  updatedAt: new Date(Date.now() - (i % 4) * 86400000).toISOString(),
  diagnosed: true,
  progress: {
    skills: r.skills,
    diagnosticBalances: null,
    diagnosed: true,
    declaredGrade: r.grade,
    placementGrade: r.grade,
    totalXP: 60 + i * 35,
    currentStreak: (i * 2) % 5,
    lastPracticeDate: new Date(Date.now() - (i % 4) * 86400000).toISOString().slice(0, 10),
  },
}));

export const demoClasses = () => [{ id: DEMO_CLASS_ID, name: 'Grade 5 Blue (demo)', join_code: 'DEMO01' }];
export const demoMembers = () => ROSTER.map((_, i) => ({ class_id: DEMO_CLASS_ID, student_id: idFor(i) }));

/** Work already set, so "Work set" has something to show and is partly done. */
export const demoAssignments = () => {
  const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  return [
    { id: 'demo-a1', class_id: DEMO_CLASS_ID, title: 'Place Value (to 10,000)', skill_ids: ['G4_PLACE_VALUE'], due_on: day(3) },
    { id: 'demo-a2', class_id: DEMO_CLASS_ID, title: 'Addition (up to 6 digits)', skill_ids: ['G5_ADDITION'], due_on: day(-1) },
  ];
};

/** On when the URL says ?demo=1, off on ?demo=0. Remembered for the session. */
const KEY = 'tg_demo_class';
export const demoMode = () => {
  try {
    const q = new URLSearchParams(window.location.search).get('demo');
    if (q === '1') sessionStorage.setItem(KEY, '1');
    if (q === '0') sessionStorage.removeItem(KEY);
    return sessionStorage.getItem(KEY) === '1';
  } catch { return false; }
};
