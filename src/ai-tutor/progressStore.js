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

export const loadProgress = async (userId) => {
  if (!userId) return loadLocal(userId) || defaultProgress();

  try {
    const { data, error } = await supabase
      .from('ai_tutor_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase load error:', error);
      return loadLocal(userId) || defaultProgress();
    }

    if (data) {
      const progress = {
        ...defaultProgress(),
        ...data.progress,
        totalXP: data.total_xp || 0,
        currentStreak: data.current_streak || 0,
        longestStreak: data.longest_streak || 0,
        lastPracticeDate: data.last_practice_date,
        diagnosed: data.diagnosed || false,
      };
      // Also save locally as cache
      saveLocal(userId, progress);
      return progress;
    }

    // No cloud data — check localStorage for migration
    const local = loadLocal(userId);
    if (local && Object.keys(local.skills || {}).length > 0) {
      // Migrate local data to cloud
      await saveProgress(userId, local);
      return local;
    }

    return defaultProgress();
  } catch (e) {
    console.warn('Failed to load from Supabase:', e);
    return loadLocal(userId) || defaultProgress();
  }
};

export const saveProgress = async (userId, progress) => {
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
          user_id: userId,
          progress: {
            skills: progress.skills,
            diagnosticBalances: progress.diagnosticBalances,
          },
          diagnosed: progress.diagnosed,
          total_xp: progress.totalXP || 0,
          current_streak: progress.currentStreak || 0,
          longest_streak: progress.longestStreak || 0,
          last_practice_date: progress.lastPracticeDate,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.warn('Supabase save error:', error);
      }
    } catch (e) {
      console.warn('Failed to save to Supabase:', e);
    }
  }, DEBOUNCE_MS);
};

// Force immediate save (on unmount, lesson complete, etc.)
export const forceSave = async (userId, progress) => {
  saveLocal(userId, progress);
  if (!userId) return;

  if (saveTimeout) clearTimeout(saveTimeout);

  try {
    await supabase
      .from('ai_tutor_progress')
      .upsert({
        user_id: userId,
        progress: {
          skills: progress.skills,
          diagnosticBalances: progress.diagnosticBalances,
        },
        diagnosed: progress.diagnosed,
        total_xp: progress.totalXP || 0,
        current_streak: progress.currentStreak || 0,
        longest_streak: progress.longestStreak || 0,
        last_practice_date: progress.lastPracticeDate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
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
