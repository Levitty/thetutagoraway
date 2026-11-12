// The Messages API by plain fetch, the key read from ~/.tutagora/anthropic.key (never printed, logged or written),
// and a spend ledger with a HARD CAP shared by every run (evals/runs/ledger.json).
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname } from 'node:path';
import { costOf } from '../../src/rocket/guide.js';

export const RUNS_DIR = '/Users/mutualevity/Desktop/Tutagora/Build/voice-tutor/evals/runs';
const LEDGER = `${RUNS_DIR}/ledger.json`;
const KEY = readFileSync(`${homedir()}/.tutagora/anthropic.key`, 'utf8').trim();
const scrub = (s) => String(s ?? '').split(KEY).join('[key]');

export class CapReached extends Error { constructor(m) { super(m); this.name = 'CapReached'; } }

/** Spend tracking. The cap is the total across ALL runs (the ledger file), not per run. */
export class Budget {
  constructor(capUsd) {
    this.cap = capUsd;
    mkdirSync(dirname(LEDGER), { recursive: true });
    this.prior = existsSync(LEDGER) ? Number(JSON.parse(readFileSync(LEDGER, 'utf8')).spent_usd) || 0 : 0;
    this.run = 0; this.byKind = {}; this.max = {}; this.calls = 0;
  }
  get spent() { return this.prior + this.run; }
  get remaining() { return this.cap - this.spent; }
  // A call is refused unless its likely worst cost still fits under the cap.
  gate(kind, floor = 0.03) {
    const need = Math.max(floor, 1.6 * (this.max[kind] || 0));
    if (this.spent + need > this.cap) throw new CapReached(`cap US$${this.cap} reached (spent ${this.spent.toFixed(3)}, next ${kind} call could cost ${need.toFixed(3)})`);
  }
  add(kind, usd) {
    this.run += usd; this.calls += 1;
    this.byKind[kind] = (this.byKind[kind] || 0) + usd;
    this.max[kind] = Math.max(this.max[kind] || 0, usd);
    writeFileSync(LEDGER, JSON.stringify({ spent_usd: Math.round(this.spent * 1e6) / 1e6, updated: new Date().toISOString() }));
  }
}

const HEADERS = { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failure = async (res) => {
  const text = await res.text().catch(() => '');
  let why = ''; try { why = JSON.parse(text)?.error?.message || ''; } catch { why = text; }
  const e = new Error(`model ${res.status}: ${scrub(why).slice(0, 200)}`); e.status = res.status; return e;
};

/** The tutor's callModel(request, { onText }): streamed, exactly as the edge function does it, metered against the budget. */
export const tutorModel = (budget) => async (request, { onText }) => {
  budget.gate('tutor', 0.04);
  for (let attempt = 0; ; attempt += 1) {
    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: HEADERS, body: JSON.stringify({ ...request, stream: true }) });
    if (!res.ok || !res.body) {
      const e = await failure(res);
      if ([429, 500, 502, 503, 529].includes(e.status) && attempt < 4) { await sleep(2000 * (attempt + 1)); continue; }
      throw e;
    }
    const usage = {}; let stop_reason = null;
    if (process.env.EVAL_RAW) appendFileSync(process.env.EVAL_RAW, '\n=====\n');
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, cut); buf = buf.slice(cut + 2);
          const line = block.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;
          let ev; try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
          if (ev.type === 'message_start') Object.assign(usage, ev.message?.usage || {});
          else if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') { if (process.env.EVAL_RAW) appendFileSync(process.env.EVAL_RAW, ev.delta.text); onText(ev.delta.text); }
          else if (ev.type === 'message_delta') { Object.assign(usage, ev.usage || {}); stop_reason = ev.delta?.stop_reason ?? stop_reason; }
          else if (ev.type === 'error') throw new Error(scrub(ev.error?.message || 'model stream error'));
        }
      }
    } finally { budget.add('tutor', costOf(request.model, usage)); }
    return { usage, stop_reason };
  }
};

/** A plain (not streamed) call: the pretend child and the judge. Returns { text, usage, cost }. */
export async function ask(budget, kind, { model, system, user, maxTokens = 300, effort = 'low' }) {
  budget.gate(kind, kind === 'judge' ? 0.12 : 0.01);
  for (let attempt = 0; ; attempt += 1) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ model, max_tokens: maxTokens, output_config: { effort }, system, messages: [{ role: 'user', content: user }] }),
    });
    if (!res.ok) {
      const e = await failure(res);
      if ([429, 500, 502, 503, 529].includes(e.status) && attempt < 4) { await sleep(2000 * (attempt + 1)); continue; }
      throw e;
    }
    const j = await res.json();
    const cost = costOf(model, j.usage || {});
    budget.add(kind, cost);
    return { text: (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim(), usage: j.usage, cost, stop_reason: j.stop_reason };
  }
}
