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
  };
}

export function memoryStore(doors = []) {
  const homework = []; const sittings = [];
  let n = 0;
  const id = () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`;
  return {
    homework, sittings,
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
  };
}
