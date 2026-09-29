// ============================================================================
// FAMILY — parent → child messages and weekly goals (see
// supabase/migrations/20260930_family_messages_goals.sql).
//
// A goal is "practise N days this week → reward". It restarts every Monday on
// its own: progress is counted from the child's HOREB practice log
// (progress.practiceDays), so nothing is ever reset.
// ============================================================================

import { supabase } from '../supabase';
import { loadLocalProgress } from '../ai-tutor/progressStore.js';

export const MESSAGE_PRESETS = {
  young: ['Proud of you!', 'Keep going, you are doing great.', 'I saw your practice today. Well done.', 'One more lesson today?'],
  older: ['Proud of the effort this week.', 'Keep it going.', 'Good work today.', "Don't forget your practice today."],
};
export const REWARD_PRESETS = {
  young: ['Trip to the park', "Choose Friday's supper", 'Extra screen time', 'A new storybook'],
  older: ['KSh 100 data bundle', 'Day out with friends', 'Choose Sunday lunch', 'New scientific calculator'],
};
export const SIGN_OFFS = ['Mum', 'Dad', 'Guardian'];

// The tables arrive with a migration; until it runs, say so instead of failing.
export const isMissingTable = (err) => !!err && (err.code === '42P01' || err.code === 'PGRST205' || /does not exist|schema cache/i.test(err.message || ''));

const SIGN_KEY = 'tg_family_sign_off';
export const getSignOff = () => { try { return localStorage.getItem(SIGN_KEY) || 'Mum'; } catch { return 'Mum'; } };
export const setSignOff = (v) => { try { localStorage.setItem(SIGN_KEY, v); } catch { /* private mode */ } };

// ---- messages --------------------------------------------------------------

export const sendMessage = async (parentId, learnerId, fromLabel, body) => {
  const text = body.trim().slice(0, 200);
  if (!text) throw new Error('Write a message first.');
  const { data, error } = await supabase.from('family_messages')
    .insert({ parent_id: parentId, learner_id: learnerId, from_label: (fromLabel || 'Your parent').slice(0, 40), body: text })
    .select('id, from_label, body, created_at, seen_at').single();
  if (error) throw error;
  return data;
};

// The newest message for this child, if any.
export const lastMessage = async (parentId, learnerId) => {
  const { data, error } = await supabase.from('family_messages')
    .select('id, from_label, body, created_at, seen_at')
    .eq('parent_id', parentId).eq('learner_id', learnerId)
    .order('created_at', { ascending: false }).limit(1);
  if (error) throw error;
  return data?.[0] || null;
};

// Awaited on purpose: a Supabase query is only sent once it is awaited.
export const markSeen = async (id) => {
  const { error } = await supabase.from('family_messages').update({ seen_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};

// ---- goals -----------------------------------------------------------------

export const getGoal = async (learnerId) => {
  const { data, error } = await supabase.from('learner_goals')
    .select('learner_id, target_days, reward, updated_at').eq('learner_id', learnerId).maybeSingle();
  if (error) throw error;
  return data || null;
};

export const saveGoal = async (parentId, learnerId, targetDays, reward) => {
  const text = reward.trim().slice(0, 120);
  if (!text) throw new Error('Choose a reward.');
  const { data, error } = await supabase.from('learner_goals')
    .upsert({ learner_id: learnerId, parent_id: parentId, target_days: targetDays, reward: text, updated_at: new Date().toISOString() }, { onConflict: 'learner_id' })
    .select('learner_id, target_days, reward, updated_at').single();
  if (error) throw error;
  return data;
};

export const removeGoal = async (learnerId) => {
  const { error } = await supabase.from('learner_goals').delete().eq('learner_id', learnerId);
  if (error) throw error;
};

// ---- practice days ---------------------------------------------------------

// The child's HOREB practice log. The device's own copy is instant; the cloud
// row is what a parent's other device sees. Use whichever knows more days.
export const learnerPracticeDays = async (parentId, learnerId) => {
  const key = `${parentId}_c${learnerId}`;
  const local = loadLocalProgress(key)?.practiceDays || [];
  try {
    const { data } = await supabase.from('ai_tutor_progress').select('progress').eq('profile_key', key).maybeSingle();
    const cloud = data?.progress?.practiceDays || [];
    return [...new Set([...local, ...cloud])].sort();
  } catch {
    return local;
  }
};
