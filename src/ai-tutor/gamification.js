// ============================================================================
// GAMIFICATION — daily goals, achievements, and warm encouraging copy.
// Tone: encouraging & warm (growth mindset), for junior-secondary learners.
// Pure logic + data; the UI (AIMastery, dashboard card) renders these.
// ============================================================================

export const DAILY_GOAL_XP = 30;

const todayStr = () => new Date().toISOString().split('T')[0];

// Days kept in the practice log: enough for weekly goals and a parent's view.
const PRACTICE_DAYS_KEPT = 60;

// Add XP to progress, also tracking a per-day total that drives the daily goal,
// and a log of the days practised (what weekly goals count).
export const gainXP = (progress, delta) => {
  if (!delta) return progress;
  const today = todayStr();
  const sameDay = progress.dailyDate === today;
  const days = progress.practiceDays || [];
  return {
    ...progress,
    totalXP: (progress.totalXP || 0) + delta,
    dailyDate: today,
    dailyXP: (sameDay ? (progress.dailyXP || 0) : 0) + delta,
    practiceDays: days.includes(today) ? days : [...days, today].slice(-PRACTICE_DAYS_KEPT),
  };
};

// Days practised in the current week (Monday to Sunday), as 'YYYY-MM-DD'.
export const weekDates = (now = new Date()) => {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000);
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getTime() + i * 86400000).toISOString().slice(0, 10));
};
export const daysPractisedThisWeek = (progress, now = new Date()) => {
  const logged = new Set(progress?.practiceDays || []);
  return weekDates(now).filter(d => logged.has(d));
};

// XP earned today (0 if the stored day isn't today).
export const todaysXP = (progress) =>
  progress && progress.dailyDate === todayStr() ? (progress.dailyXP || 0) : 0;

export const dailyGoalPercent = (progress, goal = DAILY_GOAL_XP) =>
  Math.min(100, Math.round((todaysXP(progress) / goal) * 100));

export const dailyGoalMet = (progress, goal = DAILY_GOAL_XP) =>
  todaysXP(progress) >= goal;

// ---- Achievements ----------------------------------------------------------
// Each test receives a snapshot:
//   { progress, mastered, total, level, streak, strandsComplete }
export const ACHIEVEMENTS = [
  { id: 'first_lesson', icon: 'play', name: 'First Steps', desc: 'Complete your very first lesson', test: s => s.mastered >= 1 || (s.progress.sessionsCompleted || 0) >= 1 },
  { id: 'diagnosed', icon: 'map', name: 'Know Your Start', desc: 'Finish your diagnostic check-in', test: s => !!s.progress.diagnosed },
  { id: 'daily_goal', icon: 'target', name: 'Daily Win', desc: 'Reach your daily goal for the first time', test: s => dailyGoalMet(s.progress) },
  { id: 'streak_3', icon: 'flame', name: 'Building a Habit', desc: 'Practise 3 days in a row', test: s => (s.progress.longestStreak || 0) >= 3 },
  { id: 'streak_7', icon: 'flame', name: 'One Week Strong', desc: 'Practise 7 days in a row', test: s => (s.progress.longestStreak || 0) >= 7 },
  { id: 'master_5', icon: 'star', name: 'Five Skills', desc: 'Master 5 skills', test: s => s.mastered >= 5 },
  { id: 'master_25', icon: 'star', name: 'Twenty-Five Strong', desc: 'Master 25 skills', test: s => s.mastered >= 25 },
  { id: 'level_5', icon: 'trend', name: 'Level 5', desc: 'Reach Level 5', test: s => s.level >= 5 },
  { id: 'level_10', icon: 'trophy', name: 'Level 10', desc: 'Reach Level 10', test: s => s.level >= 10 },
  { id: 'strand_complete', icon: 'target', name: 'Strand Champion', desc: 'Fully master a whole strand', test: s => s.strandsComplete >= 1 },
];

export const getAchievement = (id) => ACHIEVEMENTS.find(a => a.id === id);

// Ids of all achievements currently satisfied by the snapshot.
export const evaluateAchievements = (snapshot) =>
  ACHIEVEMENTS.filter(a => { try { return a.test(snapshot); } catch (e) { return false; } }).map(a => a.id);

// ---- Encouraging copy (warm, growth-mindset) -------------------------------
const POOLS = {
  correct: ['Nice work!', 'You’ve got this.', 'Well done!', 'Keep it up!', 'That’s it!', 'Lovely — keep going.'],
  incorrect: ['Not quite — mistakes help you learn.', 'Almost! Let’s try once more.', 'Good effort — give it another go.', 'That’s how we learn. Try again.'],
  mastery: ['You truly understand this now.', 'Skill unlocked — brilliant!', 'That’s real progress.'],
  levelup: ['You’re growing fast!', 'Look how far you’ve come.', 'Onwards and upwards!'],
  dailygoal: ['You hit today’s goal — amazing!', 'Daily goal done. Proud of you!', 'Consistency pays off — well done!'],
  welcome: ['Every expert was once a beginner.', 'Small steps, big progress.', 'Let’s learn something today.'],
};

export const encourage = (kind) => {
  const pool = POOLS[kind] || POOLS.correct;
  return pool[Math.floor(Math.random() * pool.length)];
};

export default { gainXP, todaysXP, dailyGoalPercent, dailyGoalMet, ACHIEVEMENTS, evaluateAchievements, getAchievement, encourage, DAILY_GOAL_XP };
