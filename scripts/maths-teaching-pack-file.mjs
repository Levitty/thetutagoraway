// One sub-strand's teaching pack file (curriculum/mathematics/teaching/g<grade>/<number>-<name>.json), shared by the
// Grade 6 and Grade 7 Maths builders (scripts/build-maths-g6.mjs, scripts/build-maths-g7.mjs) so there is one set of rules.
//   s      the sub-strand as written to g<grade>.json (skills and misconceptions already merged)
//   pack   { SKILL_SUFFIX: pk entry }  (scripts/data/maths-g7/lib.mjs or maths-g6-lib.mjs: pk)
// Every skill needs an entry, every library misconception of the skill a reveal question and a repair, exactly two checks,
// a board that gives the child a turn before anything is revealed.
const BEATS = new Set(['draw', 'point', 'count', 'predict', 'pause', 'child_draws', 'reveal', 'write']);
const CHILD = new Set(['pause', 'child_draws', 'count', 'predict']);
const fail = (m) => { throw new Error(m); };

export const packSlug = (s) => `${s.number}-${s.sub_strand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`;

export function packEntries(s, skillSuffixes, pack) {
  const key = s.code.replace(/^MATH\.G\d\./, '');
  return skillSuffixes.map(suffix => {
    const p = pack[suffix]; if (!p) fail(`${key}: no teaching pack entry for ${suffix}`);
    const code = `${s.code}.${suffix}`;
    const need = s.misconceptions.filter(m => m.skill === code).map(m => m.code.slice(code.length + 1));
    for (const n of need) if (!p.mis[n]) fail(`${code}: teaching pack has no entry for misconception ${n}`);
    for (const n of Object.keys(p.mis)) if (!need.includes(n)) fail(`${code}: teaching pack names ${n}, which is not in the library`);
    if (p.checks.length !== 2) fail(`${code}: exactly two checks`);
    if (!p.board.some(b => CHILD.has(b[0]))) fail(`${code}: board never gives the child a turn`);
    const bi = p.board.findIndex(b => CHILD.has(b[0])), ri = p.board.findIndex(b => b[0] === 'reveal');
    if (ri >= 0 && ri < bi) fail(`${code}: reveal before the child's turn`);
    for (const b of p.board) if (!BEATS.has(b[0])) fail(`${code}: unknown beat ${b[0]}`);
    return {
      skill: code, key_step: p.key_step,
      floor: { prerequisite: p.floor[0], question: p.floor[1], answer: p.floor[2] },
      representations: p.reps, steps: p.steps, contexts: p.contexts,
      board: p.board.map(([beat, doIt, say]) => ({ beat, do: doIt, ...(say ? { say } : {}) })),
      misconceptions: need.map(n => ({ code: `${code}.${n}`, listen_for: p.mis[n][0], ask: p.mis[n][1], repair: p.mis[n][2] })),
      checks: p.checks.map(([question, answer, shows]) => ({ question, answer, shows })),
    };
  });
}

export const packFileText = (s, entries, status, notes) => JSON.stringify({ sub_strand: s.code, title: s.sub_strand, status, sources: [], notes: notes || '', skills: entries }, null, 1) + '\n';
