// ============================================================================
// send-push — deliver a push notification to a user's devices via APNs.
//
// Called server-side (service role) when something happens the learner needs
// to know about while the app is closed — above all: "your lesson is starting".
//
// Secrets required (Supabase → Edge Functions → Secrets):
//   APNS_KEY_ID     the 10-char Key ID of an APNs Auth Key (.p8)
//   APNS_TEAM_ID    your 10-char Apple Developer Team ID
//   APNS_BUNDLE_ID  com.tutagora.app
//   APNS_KEY_P8     the FULL contents of the .p8 file, newlines included
//   APNS_ENV        "sandbox" for development builds, "production" for TestFlight/App Store
//
// Body: { user_id, title, body, route? }
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** Sign the short-lived JWT APNs expects (ES256 over the .p8 key). */
async function apnsToken() {
  const keyId = Deno.env.get('APNS_KEY_ID')!;
  const teamId = Deno.env.get('APNS_TEAM_ID')!;
  const p8 = Deno.env.get('APNS_KEY_P8')!;

  const pem = p8.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', der, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'],
  );

  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'ES256', kid: keyId })));
  const claims = b64url(new TextEncoder().encode(JSON.stringify({
    iss: teamId, iat: Math.floor(Date.now() / 1000),
  })));
  const sig = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(`${header}.${claims}`),
  ));
  return `${header}.${claims}.${b64url(sig)}`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { user_id, title, body, route } = await req.json();
    if (!user_id || !title) {
      return new Response(JSON.stringify({ error: 'user_id and title are required' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: devices } = await supabase
      .from('device_tokens').select('token, platform').eq('user_id', user_id);

    if (!devices?.length) {
      return new Response(JSON.stringify({ sent: 0, reason: 'no registered devices' }), { status: 200 });
    }

    const jwt = await apnsToken();
    const host = (Deno.env.get('APNS_ENV') || 'sandbox') === 'production'
      ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com';
    const bundle = Deno.env.get('APNS_BUNDLE_ID') || 'com.tutagora.app';

    const payload = JSON.stringify({
      aps: { alert: { title, body: body || '' }, sound: 'default', badge: 1 },
      ...(route ? { route } : {}),
    });

    let sent = 0;
    const dead: string[] = [];
    for (const d of devices) {
      const res = await fetch(`${host}/3/device/${d.token}`, {
        method: 'POST',
        headers: {
          authorization: `bearer ${jwt}`,
          'apns-topic': bundle,
          'apns-push-type': 'alert',
          'apns-priority': '10',
        },
        body: payload,
      });
      if (res.ok) sent++;
      // 410 Gone / 400 BadDeviceToken: the app was uninstalled — stop writing to it.
      else if (res.status === 410 || res.status === 400) dead.push(d.token);
    }
    if (dead.length) await supabase.from('device_tokens').delete().in('token', dead);

    return new Response(JSON.stringify({ sent, pruned: dead.length }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
