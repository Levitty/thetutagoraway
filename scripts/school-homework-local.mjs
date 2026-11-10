#!/usr/bin/env node
// School homework on this computer only, for trying it end to end with a local Tuta (10 Nov 2026).
// Runs the same handlers as the two edge functions (src/school/homeworkDoor.js, homeworkLearner.js), with the
// storage in memory (kept in a JSON file so a restart keeps the sittings), and serves the child's page.
//   HW_DOOR_CODE=WSL HW_DOOR_SECRET=<40+ chars> HW_RESULTS_URL=http://localhost:8096/api/horeb/homework-results \
//     node scripts/school-homework-local.mjs [port]
//   Tuta's door URL is then http://localhost:<port>/door ; the child's link http://localhost:<port>/hw/?c=CODE
// Unreviewed families are offered as they are in the edge function: only a teacher's approval lets one in.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyCall, signCall } from '../src/school/schoolDoor.js';
import { doorHomework, makeCodeFrom } from '../src/school/homeworkDoor.js';
import { learnerHomework } from '../src/school/homeworkLearner.js';
import { memoryStore } from '../src/school/homeworkStore.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 8097);
const door = { id: 'local-door', code: process.env.HW_DOOR_CODE || 'WSL', secret: process.env.HW_DOOR_SECRET || '', active: true, results_url: process.env.HW_RESULTS_URL || null };
if (door.secret.length < 40) { console.error('HW_DOOR_SECRET (40+ characters) is needed'); process.exit(1); }
const file = process.env.HW_STATE || resolve(root, '.school-homework-local.json');
const store = memoryStore([door]);
if (existsSync(file)) { const s = JSON.parse(readFileSync(file, 'utf8')); store.homework.push(...s.homework); store.sittings.push(...s.sittings); }
const keep = () => writeFileSync(file, JSON.stringify({ homework: store.homework, sittings: store.sittings }));

const push = async (d, body) => {
  const text = JSON.stringify(body); const time = String(Math.floor(Date.now() / 1000));
  const r = await fetch(d.results_url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-door-code': d.code, 'x-door-time': time, 'x-door-sign': await signCall(d.secret, time, text) }, body: text });
  const ok = r.ok && (await r.json().catch(() => ({}))).success === true;
  console.log(`push ${ok ? 'taken' : 'refused'} by Tuta (${r.status})`);
  return ok;
};
const deps = { store, now: () => Date.now(), makeCode: makeCodeFrom(randomBytes), linkFor: (c) => `http://localhost:${port}/hw/?c=${c}`, push };

const read = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => { b += c; }); req.on('end', () => ok(b)); });
const send = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (req.method === 'GET' && (url.pathname === '/hw/' || url.pathname === '/hw')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(readFileSync(resolve(root, 'public/hw/index.html'))); return;
  }
  if (req.method !== 'POST') { send(res, 404, { success: false }); return; }
  const body = await read(req);
  let p; try { p = JSON.parse(body); } catch { send(res, 400, { success: false, error: 'Not JSON' }); return; }
  if (url.pathname === '/door') {
    if ((req.headers['x-door-code'] || '').toUpperCase() !== door.code) { send(res, 401, { success: false, error: 'Not allowed' }); return; }
    const v = await verifyCall(door.secret, req.headers['x-door-time'], body, req.headers['x-door-sign'], Math.floor(Date.now() / 1000));
    if (!v.ok) { send(res, 401, { success: false, error: 'Not allowed' }); return; }
    const r = await doorHomework(door, p, deps);
    keep(); console.log(`door ${p.action}: ${r ? r.status : 400}`);
    send(res, r ? r.status : 400, r ? r.body : { success: false, error: 'Unknown action' }); return;
  }
  if (url.pathname === '/hw/api') {
    const r = await learnerHomework(p, deps); keep();
    console.log(`learner ${p.action}: ${r.status}`);
    send(res, r.status, r.body); return;
  }
  send(res, 404, { success: false });
}).listen(port, () => console.log(`School homework, local: door http://localhost:${port}/door, child http://localhost:${port}/hw/?c=CODE`));
