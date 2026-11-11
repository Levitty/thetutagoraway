// ============================================================================
// VOICE TOKENS (milestones 3 and 3b): the voice-tutor-token edge function.
//
// The browser talks to Cartesia directly, for listening (Ink) and speaking
// (Sonic), to save a relay and its delay, but only with one short-lived token
// minted here with both grants. The API key (CARTESIA_API_KEY) never leaves
// the server. A token is refused unless all of these hold, in this order:
//   the switch is on; the caller is signed in and on the allowlist stub (adult
//   test accounts until consent, milestone 5); the session id is sane; the
//   session and the child's day are under their caps; not too many tokens a
//   minute; the key is set.
// Each token minted is logged (cost 0) so the rate limit has something to count.
//
//   POST { session_id, child_id? }  ->  { token, expires_in, version, url, model, voice, sample_rate }
// Pure: database, fetch and keys passed in. Tested in tests/voice-tutor-voice.test.mjs.
// ============================================================================
import { capCheck } from './session.js';
export const TOKEN_TTL_S = 600;     // a stretch of the lesson; the page asks again before it runs out
export const TOKENS_PER_MINUTE = 20;
export const CARTESIA_WS = 'wss://api.cartesia.ai/tts/websocket';
export const CARTESIA_VERSION = '2026-08-14';

const reply = (status, body) => ({ status, body });
export const dayStartIso = (now) => { const d = new Date(now); d.setUTCHours(0, 0, 0, 0); return d.toISOString(); };

/**
 * @param {object} a
 * @param {{id:string,email?:string}} a.user
 * @param {{session_id:string, child_id?:string}} a.body
 * @param {object} a.db        spend({ sessionId, childKey, since }), countTokens({ userId, since }), recordUsage(row), getChild(id)
 * @param {object} a.settings  settingsFrom(env)
 * @param {{ cartesia?:string }} a.keys
 * @param {Function} a.fetch
 */
export async function mintToken({ user, body, db, settings, keys = {}, fetch: f, now = Date.now() }) {
  if (!user?.id) return reply(401, { error: 'Sign in first.' });
  if (!settings?.enabled) return reply(403, { error: 'The live tutor is switched off.' });
  const email = String(user.email || '').toLowerCase();
  if (!email || !settings.allowlist.includes(email)) return reply(403, { error: 'Voice is for adult test accounts only until parent consent is built (milestone 5).' });
  const sid = String(body?.session_id || '');
  if (!/^[A-Za-z0-9-]{8,64}$/.test(sid)) return reply(400, { error: 'No session.' });
  let childKey = user.id;
  if (body?.child_id) {
    const child = await db.getChild(String(body.child_id));
    if (!child || child.parent_id !== user.id) return reply(403, { error: 'That child is not on this account.' });
    childKey = `${user.id}_c${child.id}`;
  }
  let spent;
  try { spent = await db.spend({ sessionId: sid, childKey, since: dayStartIso(now) }); } catch {
    return reply(503, { error: 'Voice cannot check its spending (has the voice_tutor_usage migration been run?).' });
  }
  const cap = capCheck({ sessionUsd: spent.session, dayUsd: spent.day }, settings);
  if (!cap.ok) return reply(402, { error: 'This lesson has used its allowance for today.', reason: cap.reason });
  const recent = await db.countTokens({ userId: user.id, since: new Date(now - 60000).toISOString() });
  if (recent >= TOKENS_PER_MINUTE) return reply(429, { error: 'Too many voice requests. Wait a moment.' });

  const key = keys.cartesia;
  if (!key) return reply(503, { error: 'Voice is not set up (CARTESIA_API_KEY is missing).' });

  let out;
  try {
    // Cartesia access token (docs, read 11 Nov 2026): POST /access-token, Bearer key, Cartesia-Version.
    const r = await f('https://api.cartesia.ai/access-token', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Cartesia-Version': CARTESIA_VERSION, 'Content-Type': 'application/json' },
      body: JSON.stringify({ grants: { tts: true, stt: true }, expires_in: TOKEN_TTL_S }),
    });
    if (!r.ok) throw new Error(`cartesia ${r.status}`);
    const j = await r.json();
    if (!j?.token) throw new Error('cartesia gave no token');
    out = { token: j.token, expires_in: TOKEN_TTL_S, version: CARTESIA_VERSION, url: CARTESIA_WS, model: settings.ttsModel, voice: settings.ttsVoice, sample_rate: settings.ttsSampleRate };
  } catch (e) {
    console.error('voice token', String(e?.message || e).slice(0, 200));
    return reply(502, { error: 'The voice service did not answer. Please type for now.' });
  }
  await db.recordUsage({ user_id: user.id, child_key: childKey, session_id: sid, model: 'cartesia', cost_usd: 0, guard: ['token-voice'], dropped_steps: 0 });
  return reply(200, out);
}

export default { mintToken };
