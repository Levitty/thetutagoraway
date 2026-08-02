// ============================================================================
// PUSH NOTIFICATIONS (native only)
//
// The moment that matters is "your lesson is starting" — and that is exactly
// when the parent is NOT looking at the app. An in-app banner cannot reach a
// locked phone; only a real push can.
//
// This module owns the device side: ask permission, register with APNs/FCM,
// and store the token against the signed-in user so the server can reach them.
// Delivery is sent by the `send-push` edge function.
//
// Everything here is a no-op on the web build, and every failure is swallowed:
// a learner must never be blocked from using the app because push is unhappy.
// ============================================================================

import { supabase } from './supabase';

const isNative = () =>
  typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.();

let registered = false;

async function loadPlugin() {
  try {
    const mod = await import('@capacitor/push-notifications');
    return mod.PushNotifications;
  } catch {
    return null; // plugin not installed in this build
  }
}

async function wireAndRegister(PushNotifications, userId) {
  // Token arrives asynchronously after register().
  await PushNotifications.removeAllListeners();

    PushNotifications.addListener('registration', async ({ value }) => {
      if (!value) return;
      try {
        await supabase.from('device_tokens').upsert({
          user_id: userId,
          token: value,
          platform: window.Capacitor?.getPlatform?.() || 'ios',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'token' });
      } catch { /* offline — we'll re-register next launch */ }
    });

    PushNotifications.addListener('registrationError', () => { /* silent */ });

    // Tapping a notification should land the learner where it points.
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const route = action?.notification?.data?.route;
      if (route) {
        try { window.history.pushState({}, '', '/' + route); } catch { /* ignore */ }
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });

  await PushNotifications.register();
  registered = true;
}

/**
 * On launch: register silently ONLY if the learner has already granted push.
 * Never prompts — a cold "Allow notifications?" on the home screen means a
 * confused Don't Allow (permanent on iOS) before push even matters.
 */
export async function initPush(userId) {
  if (!isNative() || !userId || registered) return;
  const PushNotifications = await loadPlugin();
  if (!PushNotifications) return;
  try {
    const perm = await PushNotifications.checkPermissions();
    if (perm.receive === 'granted') await wireAndRegister(PushNotifications, userId);
  } catch { /* push is an enhancement, never a dependency */ }
}

/**
 * Ask for permission at a moment the value is obvious — e.g. just after
 * booking a lesson ("we'll tell you the moment it starts"). Safe to call more
 * than once; iOS only shows the system prompt the first time.
 */
export async function requestPush(userId) {
  if (!isNative() || !userId) return false;
  const PushNotifications = await loadPlugin();
  if (!PushNotifications) return false;
  try {
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === 'prompt' || perm.receive === 'prompt-with-rationale') {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive !== 'granted') return false;
    if (!registered) await wireAndRegister(PushNotifications, userId);
    return true;
  } catch {
    return false;
  }
}

/** Forget this device on sign-out so a shared phone doesn't leak lessons. */
export async function clearPush(userId) {
  if (!isNative() || !userId) return;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    await PushNotifications.removeAllListeners();
    await supabase.from('device_tokens').delete().eq('user_id', userId);
    registered = false;
  } catch { /* ignore */ }
}

export default { initPush, requestPush, clearPush };
