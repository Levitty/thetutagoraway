// ============================================================================
// PROGRESS STORE — Supabase cloud storage with localStorage fallback
// ============================================================================

import { supabase } from '../supabase.js';

const LOCAL_KEY_BASE = 'tutagora_ai_v2';
const DEBOUNCE_MS = 5000;

let saveTimeout = null;

// localStorage is namespaced per user+subject so that different subjects or
// different users on the same browser don't overwrite each other's cached
// progress (which previously all shared a single global key).
const localKey = (key) => (key ? `${LOCAL_KEY_BASE}_${key}` : LOCAL_KEY_BASE);

// Default progress state
export const defaultProgress = () => ({
  skills: {},
  diagnosed: false,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  sessionsCompleted: 0,
  diagnosticBalances: null,
  // Active syllabus view (curricula.js): 'native' | 'cbc' | 'cambridge'.
  curriculum: 'native',
  // Student-declared class/grade (set at onboarding) — anchors the diagnostic.
  declaredGrade: null,
  // Grade the diagnostic placed the student at — a STABLE level anchor so the
  // displayed level doesn't drop to the mastery-count estimate when the ability
  // engine is briefly unreachable.
  placementGrade: null,
  // Gamification (gamification.js): daily goal tracking + unlocked badges.
  dailyXP: 0,
  dailyDate: null,
  achievements: [],
});

// ==================== LOCAL STORAGE (FALLBACK) ====================

const saveLocal = (key, progress) => {
  try {
    localStorage.setItem(localKey(key), JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

const loadLocal = (key) => {
  try {
    const data = localStorage.getItem(localKey(key));
    if (data) return JSON.parse(data);
    // Legacy fallback: older builds stored everything under one global key.
    const legacy = localStorage.getItem(LOCAL_KEY_BASE);
    return legacy ? JSON.parse(legacy) : null;
  } catch (e) {
    return null;
  }
};

// ==================== SUPABASE STORAGE ====================

// Reconcile cloud vs local copies so progress is never lost and, critically, a
// completed diagnostic is never downgraded to "not diagnosed". We score each
// copy (diagnosed dominates, then skills, then XP) and keep the richer one.
const progressScore = (p) =>
  p ? (p.diagnosed ? 1e9 : 0) + Object.keys(p.skills || {}).length * 1000 + (p.totalXP || 0) : -1;

const reconcileProgress = (a, b) => {
  if (!a) return b || null;
  if (!b) return a;
  return progressScore(a) >= progressScore(b) ? a : b;
};

// `key` is the profile key (namespaces localStorage + the cloud row per learner
// and subject). `owner` is the real auth uid that OWNS the row (for the FK + RLS);
// it defaults to `key` for the account-holder case where the two are identical.
export const loadProgress = async (key, owner = key) => {
  const userId = key;
  const local = loadLocal(userId);
  if (!userId) return local || defaultProgress();

  let cloud = null;
  try {
    const { data, error } = await supabase
      .from('ai_tutor_progress')
      .select('*')
      .eq('profile_key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase load error:', error);
    }

    if (data) {
      cloud = {
        ...defaultProgress(),
        ...data.progress,
        totalXP: data.total_xp || 0,
        currentStreak: data.current_streak || 0,
        longestStreak: data.longest_streak || 0,
        lastPracticeDate: data.last_practice_date,
        diagnosed: data.diagnosed || false,
      };
    }
  } catch (e) {
    console.warn('Failed to load from Supabase:', e);
  }

  // Pick the more-complete copy; never lose a finished diagnostic to a stale
  // cloud row (the cause of the "redo the test" bug).
  const chosen = reconcileProgress(cloud, local);
  if (!chosen) return defaultProgress();

  saveLocal(userId, chosen);
  // If we trusted local over cloud (cloud missing or behind), push it back up
  // so the next device sees the finished state too.
  if (chosen !== cloud) saveProgress(key, chosen, owner);
  return chosen;
};

export const saveProgress = async (key, progress, owner = key, learnerId = null) => {
  const userId = key;
  // Always save locally first (instant)
  saveLocal(userId, progress);

  if (!userId) return;

  // Debounce cloud saves
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const { error } = await supabase
        .from('ai_tutor_progress')
        .upsert({
          user_id: owner,
          profile_key: key,
          learner_id: learnerId,
          progress: {
            skills: progress.skills,
            diagnosticBalances: progress.diagnosticBalances,
            curriculum: progress.curriculum,
            declaredGrade: progress.declaredGrade,
            placementGrade: progress.placementGrade,
            dailyXP: progress.dailyXP,
            dailyDate: progress.dailyDate,
            achievements: progress.achievements,
          },
          diagnosed: progress.diagnosed,
          total_xp: progress.totalXP || 0,
          current_streak: progress.currentStreak || 0,
          longest_streak: progress.longestStreak || 0,
          last_practice_date: progress.lastPracticeDate,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'profile_key' });

      if (error) {
        console.warn('Supabase save error:', error);
      }
    } catch (e) {
      console.warn('Failed to save to Supabase:', e);
    }
  }, DEBOUNCE_MS);
};

// Force immediate save (on unmount, lesson complete, etc.)
export const forceSave = async (key, progress, owner = key, learnerId = null) => {
  const userId = key;
  saveLocal(userId, progress);
  if (!userId) return;

  if (saveTimeout) clearTimeout(saveTimeout);

  try {
    await supabase
      .from('ai_tutor_progress')
      .upsert({
        user_id: owner,
        profile_key: key,
        learner_id: learnerId,
        progress: {
          skills: progress.skills,
          diagnosticBalances: progress.diagnosticBalances,
          curriculum: progress.curriculum,
          declaredGrade: progress.declaredGrade,
          placementGrade: progress.placementGrade,
          dailyXP: progress.dailyXP,
          dailyDate: progress.dailyDate,
          achievements: progress.achievements,
        },
        diagnosed: progress.diagnosed,
        total_xp: progress.totalXP || 0,
        current_streak: progress.currentStreak || 0,
        longest_streak: progress.longestStreak || 0,
        last_practice_date: progress.lastPracticeDate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'profile_key' });
  } catch (e) {
    console.warn('Force save failed:', e);
  }
};

// ==================== STREAK TRACKING ====================

export const updateStreak = (progress) => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = progress.lastPracticeDate;

  if (lastDate === today) {
    // Already practiced today, no change
    return progress;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = progress.currentStreak || 0;
  if (lastDate === yesterday) {
    newStreak++; // Consecutive day
  } else if (lastDate !== today) {
    newStreak = 1; // Streak broken, restart
  }

  return {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak || 0, newStreak),
    lastPracticeDate: today,
  };
};

export default {
  defaultProgress,
  loadProgress,
  saveProgress,
  forceSave,
  updateStreak,
};
