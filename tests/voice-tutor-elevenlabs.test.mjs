// ElevenLabs as the second live voice (owner, 16 Nov 2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pcm16FromBase64, elevenWords, elevenRequest } from '../src/voice-tutor/providers/elevenlabs.js';
import { mintToken } from '../src/voice-tutor/tokens.js';
import { settingsFrom } from '../src/voice-tutor/session.js';

test('16-bit PCM becomes samples between -1 and 1', () => {
  const b = Buffer.from([0x00, 0x00, 0xff, 0x7f, 0x00, 0x80]).toString('base64');
  const s = pcm16FromBase64(b);
  assert.equal(s.length, 3);
  assert.equal(s[0], 0);
  assert.ok(Math.abs(s[1] - 0.99997) < 1e-4);
  assert.equal(s[2], -1);
});

test('character times become words, placed after the audio already heard', () => {
  const a = { chars: ['H', 'i', ' ', 'y', 'o', 'u', '.'], charStartTimesMs: [0, 50, 100, 150, 200, 250, 300], charDurationsMs: [50, 50, 50, 50, 50, 50, 50] };
  assert.deepEqual(elevenWords(a), [{ word: 'Hi', start: 0, end: 100 }, { word: 'you.', start: 150, end: 350 }]);
  assert.equal(elevenWords(a, 1000)[1].start, 1150);
  assert.deepEqual(elevenWords(null), []);
});

test('a sentence is its own context: text, flush, close; speed kept to the allowed range', () => {
  const m = elevenRequest({ text: 'Shade three.', id: 'c1', speed: 2 });
  assert.equal(m.length, 3);
  assert.equal(m[0].text, 'Shade three. ');
  assert.equal(m[0].voice_settings.speed, 1.2);
  assert.deepEqual(m[1], { context_id: 'c1', flush: true });
  assert.deepEqual(m[2], { context_id: 'c1', close_context: true });
  assert.equal('speed' in elevenRequest({ text: 'x', id: 'c' })[0].voice_settings, false);
});

const world = () => {
  const usage = [];
  return { usage, getChild: async () => null, spend: async () => ({ session: 0, day: 0 }), countTokens: async () => 0, recordUsage: async (r) => usage.push(r) };
};
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' })[k]);
const USER = { id: 'u1', email: 'tester@example.com' };

test('an ElevenLabs token: same rules, its own key, single-use token from the server only', async () => {
  const calls = [];
  const f = async (url, o) => { calls.push({ url, o }); return { ok: true, json: async () => ({ token: 'sutkn_abc' }) }; };
  const db = world();
  const r = await mintToken({ user: USER, body: { session_id: 'sess-12345678', tts: 'elevenlabs' }, db, settings, keys: { elevenlabs: ' "sk_el" ' }, fetch: f });
  assert.equal(r.status, 200);
  assert.equal(r.body.provider, 'elevenlabs');
  assert.equal(r.body.token, 'sutkn_abc');
  assert.equal(r.body.model, 'eleven_flash_v2_5');
  assert.equal(calls[0].url, 'https://api.elevenlabs.io/v1/single-use-token/tts_websocket');
  assert.equal(calls[0].o.headers['xi-api-key'], 'sk_el');
  assert.ok(!JSON.stringify(r.body).includes('sk_el'), 'the key never goes to the page');
  assert.equal(db.usage[0].model, 'elevenlabs');
  const none = await mintToken({ user: USER, body: { session_id: 'sess-12345678', tts: 'elevenlabs' }, db: world(), settings, keys: { cartesia: 'x' }, fetch: f });
  assert.equal(none.status, 503);
  const off = await mintToken({ user: { id: 'u2', email: 'other@example.com' }, body: { session_id: 'sess-12345678', tts: 'elevenlabs' }, db: world(), settings, keys: { elevenlabs: 'k' }, fetch: f });
  assert.equal(off.status, 403);
});
