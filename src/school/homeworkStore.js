// The homework doors' storage: Supabase tables (migration 20261110_school_homework.sql), service role only,
// and the same shape in memory for the local test server and the tests. See homeworkDoor.js for the calls.
const SITTING_COLS = ['id', 'homework_id', 'learner_ref', 'code', 'seed', 'version', 'items', 'answers', 'status', 'started_at', 'finished_at',
  'locked_at', 'lock_reason', 'lock_question', 'reopen_count', 'pushed_at'];
const pickCols = (s) => Object.fromEntries(SITTING_COLS.filter(k => s[k] !== undefined).map(k => [k, s[k]]));

export function supabaseStore(admin) {
  return {
    async getHomework(doorId, ref) {
      const { data } = await admin.from('school_homework').select('*').eq('door_id', doorId).eq('homework_ref', ref).maybeSingle();
      return data || null;
    },
    async saveHomework(row) {
      const { data, error } = await admin.from('school_homework').insert(row).select('*').single();
      if (error) throw new Error('Not saved');
      return data;
    },
    async sittingsOf(homeworkId) {
      const { data } = await admin.from('school_homework_sittings').select('*').eq('homework_id', homeworkId).order('learner_ref').limit(2000);
      return data || [];
    },
    async saveSittings(rows) {
      for (let i = 0; i < rows.length; i += 100) {
        const { error } = await admin.from('school_homework_sittings').insert(rows.slice(i, i + 100).map(pickCols));
        if (error) throw new Error('Not saved');
      }
    },
    async sittingByCode(code) {
      const { data } = await admin.from('school_homework_sittings').select('*, school_homework(*, school_doors(id, code, secret, active, results_url))').eq('code', code).maybeSingle();
      if (!data || !data.school_homework?.school_doors?.active) return null;
      const { school_homework: hw, ...sitting } = data;
      const { school_doors: door, ...homework } = hw;
      return { sitting, homework, door };
    },
    async saveSitting(s) {
      const { id, ...rest } = pickCols(s);
      await admin.from('school_homework_sittings').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    },
    // One evidence row for the learner's log (response_events, migration 20261111_learner_evidence.sql). A duplicate
    // (the unique index on source, item_ref and learner) is the row already being there, which is what the log wants.
    async saveEvidence(row) {
      const { error } = await admin.from('response_events').insert(row);
      if (error && error.code !== '23505') throw new Error('Not saved');
    },
    // School exam evidence (evidenceDoor.js): what is already in the log for these items, new rows in batches, a corrected mark in place.
    async examEvidence(doorId, itemRefs) {
      const out = [];
      for (let i = 0; i < itemRefs.length; i += 100) {
        const { data, error } = await admin.from('response_events').select('id, item_ref, learner_ref, marks, max_marks, outcome_code, substrand_code')
          .eq('source', 'school_exam').eq('door_id', doorId).in('item_ref', itemRefs.slice(i, i + 100)).limit(20000);
        if (error) throw new Error('Not read');
        out.push(...(data || []));
      }
      return out;
    },
    async insertEvidence(rows) {
      for (let i = 0; i < rows.length; i += 200) {
        const { error } = await admin.from('response_events').insert(rows.slice(i, i + 200));
        // A parallel call may have written one of them first (the unique index): the batch is then written row by row.
        if (error && error.code === '23505') {
          for (const r of rows.slice(i, i + 200)) { const e = (await admin.from('response_events').insert(r)).error; if (e && e.code !== '23505') throw new Error('Not saved'); }
        } else if (error) throw new Error('Not saved');
      }
    },
    async updateEvidence(id, patch) {
      const { error } = await admin.from('response_events').update(patch).eq('id', id).eq('source', 'school_exam');
      if (error) throw new Error('Not saved');
    },
    // The learner home (learnerHome.js, migration 20261111_learner_home.sql).
    async homeDoor(code) {
      const { data } = await admin.from('school_doors').select('id, code, name, secret, active').eq('code', code).maybeSingle();
      return data && data.active ? data : null;
    },
    async homeSittings(doorId, ref) {
      const { data } = await admin.from('school_homework_sittings')
        .select('code, status, items, answers, started_at, finished_at, locked_at, lock_question, school_homework!inner(door_id, title, mode, due_on, created_at)')
        .eq('learner_ref', ref).eq('school_homework.door_id', doorId).order('updated_at', { ascending: false }).limit(60);
      return (data || []).map(({ school_homework: homework, ...sitting }) => ({ sitting, homework }));
    },
    async homeTries(key, sinceIso) {
      const { count } = await admin.from('school_home_attempts').select('id', { count: 'exact', head: true }).eq('try_key', key).eq('ok', false).gte('at', sinceIso);
      return count || 0;
    },
    async homeTry(key, ok) {
      await admin.from('school_home_attempts').insert({ try_key: key, ok });
      await admin.from('school_home_attempts').delete().eq('try_key', key).lt('at', new Date(Date.now() - 86400000).toISOString());
    },
    async childLink(userId, childId) {
      const { data } = await admin.from('school_learner_links').select('learner_ref, linked_at, school_doors(id, code, name, active)')
        .eq('parent_id', userId).eq('child_id', childId).order('linked_at', { ascending: false }).limit(5);
      const l = (data || []).find(x => x.school_doors?.active);
      return l ? { door: { id: l.school_doors.id, code: l.school_doors.code, name: l.school_doors.name }, learner_ref: l.learner_ref } : null;
    },
  };
}

export function memoryStore(doors = [], links = []) {
  const homework = []; const sittings = []; const tries = []; const evidence = [];
  let n = 0;
  const id = () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`;
  return {
    homework, sittings, tries, links,
    async getHomework(doorId, ref) { return homework.find(h => h.door_id === doorId && h.homework_ref === ref) || null; },
    async saveHomework(row) { const h = { id: id(), ...row }; homework.push(h); return h; },
    async sittingsOf(homeworkId) { return sittings.filter(s => s.homework_id === homeworkId).map(s => ({ ...s })).sort((a, b) => a.learner_ref.localeCompare(b.learner_ref)); },
    async saveSittings(rows) { for (const r of rows) sittings.push({ id: id(), reopen_count: 0, ...pickCols(r) }); },
    async sittingByCode(code) {
      const s = sittings.find(x => x.code === code); if (!s) return null;
      const h = homework.find(x => x.id === s.homework_id); const d = doors.find(x => x.id === h.door_id);
      return d?.active === false ? null : { sitting: { ...s }, homework: h, door: d };
    },
    async saveSitting(s) { const i = sittings.findIndex(x => x.id === s.id); if (i >= 0) sittings[i] = { ...sittings[i], ...pickCols(s) }; },
    // The evidence log in memory: the same once-only rule as the unique index.
    evidence,
    async saveEvidence(row) {
      if (evidence.some(e => e.source === row.source && e.item_ref === row.item_ref && (e.student_id || `${e.door_id}:${e.learner_ref}`) === (row.student_id || `${row.door_id}:${row.learner_ref}`))) return;
      evidence.push(row);
    },
    async examEvidence(doorId, itemRefs) { return evidence.filter(e => e.source === 'school_exam' && e.door_id === doorId && itemRefs.includes(e.item_ref)); },
    async insertEvidence(rows) { let k = 0; for (const r of rows) evidence.push({ id: `ev-${evidence.length + (++k)}`, ...r }); },
    async updateEvidence(evId, patch) { const e = evidence.find(x => x.id === evId); if (e) Object.assign(e, patch); },
    async homeDoor(code) { const d = doors.find(x => x.code === code); return d && d.active !== false ? d : null; },
    async homeSittings(doorId, ref) {
      return sittings.filter(s => s.learner_ref === ref).map(s => ({ sitting: { ...s }, homework: homework.find(h => h.id === s.homework_id) }))
        .filter(x => x.homework && x.homework.door_id === doorId);
    },
    async homeTries(key, sinceIso) { return tries.filter(t => t.try_key === key && !t.ok && t.at >= sinceIso).length; },
    async homeTry(key, ok, atIso) { tries.push({ try_key: key, ok, at: atIso || new Date().toISOString() }); },
    async childLink(userId, childId) {
      const l = links.find(x => x.parent_id === userId && x.child_id === childId); const d = l && doors.find(x => x.id === l.door_id && x.active !== false);
      return d ? { door: { id: d.id, code: d.code, name: d.name }, learner_ref: l.learner_ref } : null;
    },
  };
}
