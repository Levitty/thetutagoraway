#!/usr/bin/env node
// ============================================================================
// HAS AN EDGE FUNCTION CHANGED SINCE IT WAS LAST DEPLOYED?
//
// The paywall outage of 22 Oct 2026 was not caused by either of the two bugs
// in it. It was caused by the shape of this project: the website deploys
// automatically on every push, and the edge functions deploy only when a
// person remembers to run a workflow. On 29 September the client was changed
// to send { reference, plan }; the function that reads it was not. The web
// half moved forward seven weeks and the server half stayed on 3 August, and
// nothing noticed, because the two only disagree at the moment a real person
// pays.
//
// So: every function's source is hashed, and the hash of the copy that was
// last deployed is recorded in DEPLOYED.json by the deploy workflow. When they
// differ, the function in the repository is not the function that is running.
//
// This cannot be perfect — it trusts the record, and a deploy done by hand
// from a laptop will not update it. That is the point: a hand deploy now shows
// up as drift until it is done through the workflow, which is the behaviour
// worth having.
// ============================================================================
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'supabase/functions';
const RECORD = join(DIR, 'DEPLOYED.json');

export const functionNames = () => readdirSync(DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(DIR, d.name, 'index.ts')))
  .map(d => d.name)
  .sort();

export const hashOf = (name) =>
  createHash('sha256').update(readFileSync(join(DIR, name, 'index.ts'))).digest('hex').slice(0, 16);

export const deployedRecord = () => {
  try { return JSON.parse(readFileSync(RECORD, 'utf8')); } catch { return {}; }
};

/**
 * Functions whose source differs from the copy last deployed.
 * `neverDeployed` is the worse case: it is running nothing at all, or
 * something nobody has a record of.
 */
export const drifted = () => {
  const rec = deployedRecord();
  const changed = [], neverDeployed = [];
  for (const name of functionNames()) {
    const here = hashOf(name);
    const there = rec[name]?.sha;
    if (!there) neverDeployed.push(name);
    else if (there !== here) changed.push({ name, deployed: there, here, at: rec[name].at });
  }
  return { changed, neverDeployed };
};

/** Write one function's current hash into the record (used by the workflow). */
export const recordDeploy = (name) => {
  const rec = deployedRecord();
  rec[name] = { sha: hashOf(name), at: new Date().toISOString() };
  writeFileSync(RECORD, JSON.stringify(Object.fromEntries(Object.keys(rec).sort().map(k => [k, rec[k]])), null, 2) + '\n');
  return rec[name];
};

if (process.argv[1] && process.argv[1].endsWith('function-drift.mjs')) {
  const mark = process.argv[2] === '--record' && process.argv[3];
  if (mark) {
    const r = recordDeploy(mark);
    console.log(`Recorded ${mark} as deployed at ${r.at} (${r.sha}).`);
    process.exit(0);
  }
  const { changed, neverDeployed } = drifted();
  if (!changed.length && !neverDeployed.length) {
    console.log(`All ${functionNames().length} edge functions match the copy last deployed.`);
    process.exit(0);
  }
  for (const d of changed) {
    console.log(`\n  CHANGED SINCE DEPLOY  ${d.name}`);
    console.log(`    deployed ${d.at?.slice(0, 10) ?? 'unknown'} as ${d.deployed}, repository now ${d.here}`);
    console.log(`    The running copy is not this code. Actions -> Deploy edge function -> ${d.name}`);
  }
  if (neverDeployed.length) {
    console.log(`\n  NO DEPLOY ON RECORD   ${neverDeployed.join(', ')}`);
    console.log('    Deploy through the workflow once to start the record.');
  }
  console.log('');
  process.exit(changed.length ? 1 : 0);
}
