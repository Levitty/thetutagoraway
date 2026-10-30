// The only server this app talks to. One function, three actions.
//
// There is no supabase-js client here on purpose: the page reads no table
// directly, so it needs no database client and no anon policy to make that
// work. The anon key is still sent, because Supabase's gateway requires it to
// route to the function — it grants nothing, which is the point.

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function callWaterPay(action, payload = {}) {
  if (!URL || !ANON) throw new Error('App is not configured');
  const res = await fetch(`${URL}/functions/v1/water-pay`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const body = await res.json().catch(() => null);
  // A 429 or a 503 still carries a usable body; the caller decides what a
  // given error means, because "could not reach the server" and "that payment
  // failed" must never be collapsed into one.
  if (body) return body;
  throw new Error(`Server error ${res.status}`);
}
