// ============================================================================
// SCHOOL HOMEWORK, the two doors (10 Nov 2026). One handler each, with the
// storage passed in, so the edge functions (Supabase) and the local test
// server (memory) run the same code:
//
//   doorHomework(door, p, deps)   Tuta's server, signed with the school's door
//                                 secret (checked before this is called):
//     homework_preview  { cskills }                  two samples per family
//     homework_set      { title, cskills, count, mode, versions, due_on,
//                         approved: [{family_id, by, at}], homework: [{homework_ref, learner_refs}] }
//                       -> { homework: { [ref]: { learners: { [learner_ref]: { code, link, version, items } } } } }
//     homework_status   { homework_refs }            the results, as pushed
//     homework_reopen   { homework_ref, learner_ref } a locked sitting opens again
//
//   learnerHomework(p, deps)      the child's phone, keyed by the code alone
//     open | start | answer {n, response} | leave
//     When a sitting is handed in or locks, its results are pushed to Tuta.
//
// deps: { store, now: () => ms, makeCode: () => string, linkFor: (code) => url, push: async (door, body) => bool }
// store: getHomework(doorId, ref), saveHomework(row) -> row, sittingsOf(homeworkId), saveSittings(rows),
//        sittingByCode(code) -> { sitting, homework, door }, saveSitting(row)
// ============================================================================
import { cleanHomeworkSet, sittingsFor, samplesFor, keyItem, isCurriculumSkill, HW_MAX_SKILLS } from './homework.js';
import { step, resultsFor } from './homeworkSitting.js';
export { learnerHomework, resultsBody, CODE } from './homeworkLearner.js';

const UUID = /^[a-f0-9-]{36}$/;
const REF = /^[A-Z2-9]{8}$/;

const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error, more = {}) => ({ status, body: { success: false, error, ...more } });

export async function doorHomework(door, p, deps) {
  const { store } = deps;
  if (p.action === 'homework_preview') {
    const cskills = [...new Set((Array.isArray(p.cskills) ? p.cskills : []).map(String).filter(isCurriculumSkill))].slice(0, HW_MAX_SKILLS);
    if (!cskills.length) return no(400, 'No curriculum skills given');
    return ok({ families: samplesFor(cskills, 2) });
  }

  if (p.action === 'homework_set') {
    const c = cleanHomeworkSet(p);
    if (!c.ok) return no(400, c.error, c.missing ? { missing: c.missing } : {});
    const out = {};
    for (const h of c.hw.homework) {
      // The same homework again (Tuta retrying) gets the sittings it already has: nothing is drawn twice.
      let hw = await store.getHomework(door.id, h.homework_ref);
      let sittings;
      if (hw) sittings = await store.sittingsOf(hw.id);
      else {
        hw = await store.saveHomework({ door_id: door.id, homework_ref: h.homework_ref, title: c.hw.title, mode: c.hw.mode, cskills: c.hw.cskills,
          count: c.hw.count, versions: c.hw.versions, due_on: c.hw.due_on, approved: c.hw.approved });
        sittings = sittingsFor(c.hw, h.homework_ref, h.learner_refs, c.families, deps.makeCode).map(s => ({ ...s, homework_id: hw.id }));
        await store.saveSittings(sittings);
      }
      const learners = {};
      for (const s of sittings) learners[s.learner_ref] = { code: s.code, link: hw.mode === 'online' ? deps.linkFor(s.code) : null, version: s.version, items: s.items.map(keyItem) };
      out[h.homework_ref] = { mode: hw.mode, learners };
    }
    return ok({ homework: out });
  }

  if (p.action === 'homework_status') {
    const refs = (Array.isArray(p.homework_refs) ? p.homework_refs : []).map(String).filter(r => UUID.test(r)).slice(0, 20);
    const out = {};
    for (const ref of refs) {
      const hw = await store.getHomework(door.id, ref);
      if (hw) out[ref] = resultsFor(await store.sittingsOf(hw.id));
    }
    return ok({ results: out });
  }

  if (p.action === 'homework_reopen') {
    if (!UUID.test(String(p.homework_ref || '')) || !REF.test(String(p.learner_ref || ''))) return no(400, 'Which homework and learner?');
    const hw = await store.getHomework(door.id, p.homework_ref);
    const s = hw && (await store.sittingsOf(hw.id)).find(x => x.learner_ref === p.learner_ref);
    if (!s) return no(404, 'Not found');
    const r = step({ ...s, mode: hw.mode }, { type: 'reopen' }, deps.now());
    if (!r.ok) return no(409, r.error);
    await store.saveSitting(r.s);
    return ok({ status: r.s.status });
  }
  return null;   // not a homework action
}

/** A sitting's code: ten characters, no 0, O, 1, I or L, from a random source passed in. */
export const makeCodeFrom = (randomBytes) => () => {
  const CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from(randomBytes(10)).map(b => CH[b % 31]).join('');
};
