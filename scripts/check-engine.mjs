// ============================================================================
// IS THE PYTHON BRAIN RUNNING?
//
//   npm run check:engine                 # checks the URL in .env.production
//   npm run check:engine -- <url>        # or an explicit one
//
// Why this exists: the app degrades silently. If the engine is unreachable it
// falls back to the in-browser JS model and nothing breaks — which is good for
// students and terrible for operators, because "working" and "working on the
// cruder model" look identical from the outside.
//
// Render's free plan spins a service down after ~15 minutes idle and takes
// 30-60s to wake. The app's own health check gives up after 1500ms, so a
// sleeping engine reads as DEAD to the app even while it is booting. This
// script therefore reports BOTH facts: what the app would conclude right now,
// and what is actually true if you wait for a cold start.
// ============================================================================
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const APP_TIMEOUT_MS = 1500;    // must match engineClient.js isEngineAvailable
const COLD_BUDGET_MS = 90000;   // generous enough for a free-plan cold start

function envUrl() {
  try {
    const env = readFileSync(resolve(root, '.env.production'), 'utf8');
    const m = env.match(/^VITE_ENGINE_URL\s*=\s*(.+)$/m);
    if (m) return m[1].trim();
  } catch { /* no env file */ }
  return null;
}

async function ping(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(`${url}/health`, { signal: ctrl.signal });
    const body = await res.text().catch(() => '');
    return { ok: res.ok, status: res.status, ms: Date.now() - started, body: body.slice(0, 200) };
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? `no answer in ${timeoutMs}ms` : e.message, ms: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

const url = process.argv[2] || envUrl();
if (!url) {
  console.error('No engine URL. Set VITE_ENGINE_URL in .env.production or pass one as an argument.');
  process.exit(2);
}

console.log(`Engine: ${url}\n`);

// 1. What the APP would decide, right now, with its real 1.5s budget.
const fast = await ping(url, APP_TIMEOUT_MS);
if (fast.ok) {
  console.log(`✓ LIVE — answered in ${fast.ms}ms, inside the app's ${APP_TIMEOUT_MS}ms budget.`);
  console.log('  Students are getting the Bayesian engine.');
  if (fast.body) console.log(`  ${fast.body}`);
  process.exit(0);
}

console.log(`✗ The app would treat this as OFFLINE (${fast.error || `HTTP ${fast.status}`}).`);
console.log('  Right now students are on the in-browser fallback model.\n');

// 2. Is it dead, or merely asleep? Wait out a cold start.
console.log(`Waiting up to ${COLD_BUDGET_MS / 1000}s in case it is only asleep…`);
const slow = await ping(url, COLD_BUDGET_MS);

if (slow.ok) {
  console.log(`\n△ ASLEEP, NOT DEAD — it woke after ${(slow.ms / 1000).toFixed(1)}s.`);
  console.log('  The service is deployed and healthy, but on a plan that spins down when idle.');
  console.log('  Because the app gives up after 1.5s, a sleeping engine is never actually used:');
  console.log('  the request that would wake it is abandoned before it answers.');
  console.log('\n  Fixes, cheapest first:');
  console.log('   • Ping /health every 10 minutes from a free cron so it never sleeps.');
  console.log('   • Or move the service off the free plan so it stays warm.');
  process.exit(1);
}

console.log(`\n✗ DEAD — no answer within ${COLD_BUDGET_MS / 1000}s (${slow.error || `HTTP ${slow.status}`}).`);
console.log('  Either it was never deployed, the deploy failed, or the URL is wrong.');
console.log('  Check the Render dashboard for the horeb-engine service (render.yaml deploys it).');
process.exit(1);
