// After a parent signs up (or in) from "Save the plan", move the free check
// they took as a guest into their account: as a saved child when they gave a
// name, otherwise as their own progress. Runs once, then clears the guest copy.
import { supabase } from '../supabase.js';
import { forceSave, loadLocalProgress } from '../ai-tutor/progressStore.js';
import { getCheck, getGuestProgress, clearGuestCheck, SAVE_FLAG } from './Check.jsx';

export const wantsSave = () => { try { return localStorage.getItem(SAVE_FLAG) === '1'; } catch { return false; } };
export const markWantsSave = () => { try { localStorage.setItem(SAVE_FLAG, '1'); } catch { /* ignore */ } };

// Two tabs (e.g. the email confirmation link opening a second one) can both
// run the claim; the first takes a short lock so only one child is created.
const LOCK = 'tg_check_claiming';
const takeLock = () => {
  try {
    const t = Number(localStorage.getItem(LOCK) || 0);
    if (Date.now() - t < 30000) return false;
    localStorage.setItem(LOCK, String(Date.now()));
    return true;
  } catch { return true; }
};
const dropLock = () => { try { localStorage.removeItem(LOCK); } catch { /* ignore */ } };

export async function claimGuestCheck(userId) {
  if (!userId || !wantsSave()) return null;
  if (!takeLock()) return null;
  try { return await claim(userId); } finally { dropLock(); }
}

async function claim(userId) {
  const progress = getGuestProgress();
  const check = getCheck();
  if (!progress?.diagnosed) { clearGuestCheck(); return null; }

  let key = userId;
  let childId = null;
  const name = (check?.name || '').trim();
  if (name) {
    const grade = progress.declaredGrade || check?.grade;
    // Reuse a child with the same name rather than making a duplicate.
    const { data: existing } = await supabase.from('children').select('id, name')
      .eq('parent_id', userId).ilike('name', name).limit(1);
    let child = existing?.[0];
    if (!child) {
      const { data: created, error } = await supabase.from('children')
        .insert({ parent_id: userId, name, grade: grade ? `Grade ${grade}` : null })
        .select('id, name').single();
      if (error) throw error;
      child = created;
    }
    childId = child.id;
    key = `${userId}_c${childId}`;
  }

  // Never overwrite a finished check the account already has.
  const current = loadLocalProgress(key);
  let cloudDiagnosed = false;
  try {
    const { data } = await supabase.from('ai_tutor_progress').select('diagnosed').eq('profile_key', key).maybeSingle();
    cloudDiagnosed = !!data?.diagnosed;
  } catch { /* offline: local check below still protects */ }
  if (!current?.diagnosed && !cloudDiagnosed) {
    await forceSave(key, { ...progress, diagInProgress: null }, userId, childId);
  }
  clearGuestCheck();
  return { childId, name };
}
