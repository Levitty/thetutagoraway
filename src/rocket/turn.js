// ============================================================================
// ONE TURN OF THE ROCKET CHAT, from a team's message to HOREB's reply.
//
// This is the whole server-side decision, written as plain JavaScript with
// its database and model passed in, so tests/rocket-turn.test.mjs runs it end
// to end with a fake database and a fake model, and the rocket-guide edge
// function runs the same code with Supabase and the Messages API.
//
// ORDER MATTERS (same reasoning as mark-composition):
//   1. who is asking, and is this their team;
//   2. SAFEGUARDING screen on the raw words, recorded before anything that
//      can return early;
//   3. is the level open, and is the earlier test logged (the gate);
//   4. the SAFETY guard: an unsafe request is answered from the authored
//      replies and never reaches the model;
//   5. the team's allowance (messages a day, and US$ for the challenge);
//   6. the model, with names scrubbed and the prefix cached;
//   7. the reply guard: anything unsafe or that solves it is replaced by the
//      step's authored hint;
//   8. store both sides, so the teacher and the parents read exactly this.
//
// When there is no API key, or the allowance is spent, or the model fails,
// HOREB still answers: from the step's authored questions and hints.
// ============================================================================
import { stepOf } from './levels.js';
import { screenMessage, checkReply, asksForAnswer, tidyReply, ANSWER_REPLY } from './guard.js';
import { teamProgress, mayHelp } from './progress.js';
import { buildRequest, turnContext, offlineReply, costOf, DEFAULT_MODEL, LOG_FIRST_REPLY, BUDGET_REPLY } from './guide.js';

export const MAX_MESSAGE_CHARS = 1200;

const reply = (status, body) => ({ status, body });

/**
 * @param {object} a
 * @param {{id:string}} a.user                     the signed-in account
 * @param {object} a.body                          { team_id, level, step, message, kind: 'ask'|'stuck', author: 'A'|'B' }
 * @param {object} a.db                            see the fake in tests/rocket-turn.test.mjs
 * @param {(req:object)=>Promise<object>} [a.callModel]  null when no API key is set
 * @param {(text:string)=>{tier:string,categories:string[],hits:any[]}} [a.safeguard]
 * @param {string} [a.model]
 */
export async function runTurn({ user, body, db, callModel = null, safeguard = null, model = DEFAULT_MODEL }) {
  if (!user?.id) return reply(401, { error: 'Sign in first.' });
  const teamId = String(body?.team_id || '');
  const level = Number(body?.level) || 1;
  const kind = body?.kind === 'stuck' ? 'stuck' : 'ask';
  const message = String(body?.message ?? '').trim().slice(0, MAX_MESSAGE_CHARS)
    || (kind === 'stuck' ? 'We are stuck.' : '');
  if (!message) return reply(400, { error: 'Write a message first.' });

  // 1. Whose team.
  const found = await db.getTeam(teamId);
  if (!found) return reply(404, { error: 'No such team.' });
  const { team, members, challenge } = found;
  const mine = members.filter((m) => m.account_id === user.id);
  if (!mine.length) return reply(403, { error: 'Only the team can talk to HOREB. Teachers and parents can read everything.' });
  if (members.some((m) => !m.consent_at)) return reply(403, { error: 'A parent must agree before the team starts.' });
  const author = mine.some((m) => m.label === body?.author) ? body.author : mine[0].label;

  // 2. Safeguarding, before anything that can return early.
  if (safeguard) {
    const hit = safeguard(message);
    if (hit && hit.tier !== 'none') {
      await db.recordConcern({
        source: 'rocket_chat', source_id: team.id, user_id: user.id,
        learner_id: mine.find((m) => m.label === author)?.child_id || null,
        grade: mine.find((m) => m.label === author)?.grade || null,
        tier: hit.tier, categories: hit.categories, detected_by: 'rule',
        rule_ids: (hit.hits || []).map((h) => h.id),
        excerpt: (hit.hits || []).map((h) => h.excerpt).join(' | ').slice(0, 1000),
      });
    }
  }

  // 3. The gate.
  const entries = await db.getLog(team.id);
  const progress = teamProgress(entries, { openedLevel: team.opened_level });
  const step = Number(body?.step) || (level === progress.level ? progress.step : 1) || 1;
  if (!stepOf(level, step)) return reply(400, { error: 'No such step.' });
  const gate = mayHelp(progress, level, step);
  if (!gate.ok && gate.reason === 'closed') {
    return reply(403, { error: 'This level opens when every step of the level before it has a logged test.' });
  }

  const history = await db.getMessages(team.id, level);
  const save = (row) => db.insertMessage({ team_id: team.id, level, step, created_by: user.id, ...row });
  await save({ role: 'team', kind, author_label: author, body: message });
  const answer = async (row) => {
    const saved = await save({ role: 'horeb', ...row });
    return reply(200, { reply: row.body, kind: row.kind, guard: row.guard || [], id: saved?.id ?? null, progress });
  };

  if (!gate.ok && gate.reason === 'log-first') {
    return answer({ kind: 'log-first', body: LOG_FIRST_REPLY, guard: ['log-first'] });
  }

  // 4. Safety. Never reaches the model.
  const safety = screenMessage(message);
  if (safety.unsafe) return answer({ kind: 'safety', body: safety.reply, guard: safety.ids });

  // Where this team is on this step.
  const onStep = history.filter((h) => Number(h.step) === step);
  const hintRung = onStep.filter((h) => h.role === 'team' && h.kind === 'stuck').length + (kind === 'stuck' ? 1 : 0);
  const horebTurns = onStep.filter((h) => h.role === 'horeb').length;
  const authored = (guard) => ({
    kind: kind === 'stuck' ? 'hint' : 'fallback',
    body: offlineReply({ level, step, hintRung, stuck: kind === 'stuck', message, turn: horebTurns }),
    guard,
  });

  // 5. Allowance.
  const cap = Number(challenge.budget_usd_per_learner ?? 10) * Math.max(1, members.length);
  const spent = await db.spend(team.id);
  const today = await db.countToday(team.id);
  const perDay = Number(challenge.daily_messages_per_team ?? 60);
  if (spent >= cap || today > perDay) {
    const a = authored([spent >= cap ? 'budget' : 'daily-cap']);
    return answer({ ...a, kind: 'budget', body: kind === 'stuck' ? a.body : `${BUDGET_REPLY} ${stepOf(level, step).opening}` });
  }

  if (!callModel) return answer(authored(['offline']));

  // 6. The model. Names out: first names become Learner A / B, the team and
  //    school names become "the team" / "the school".
  const names = [
    ...members.map((m) => ({ name: m.first_name, as: `Learner ${m.label}` })),
    { name: team.name, as: 'the team' },
    ...(found.school?.name ? [{ name: found.school.name, as: 'the school' }] : []),
  ];
  const latest = [...entries].filter((e) => Number(e.level) === level)
    .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || ''))).pop() || null;
  const context = turnContext({
    level, step, hintRung, stuck: kind === 'stuck', wantsAnswer: asksForAnswer(message), latestTest: latest,
    stepsLogged: [...new Set(entries.filter((e) => Number(e.level) === level).map((e) => `${level}.${e.step}`))].sort(),
  });
  const request = buildRequest({
    model,
    history: history.map((h) => ({ role: h.role, author: h.author_label, body: h.body })),
    message, author, context, names,
  });

  let out;
  try {
    out = await callModel(request);
  } catch (e) {
    return answer(authored(['model-error']));
  }
  const usage = out?.usage || {};
  const cost = costOf(model, usage);
  const meter = {
    model, cost_usd: cost,
    input_tokens: usage.input_tokens ?? null, output_tokens: usage.output_tokens ?? null,
    cache_read_tokens: usage.cache_read_input_tokens ?? null, cache_write_tokens: usage.cache_creation_input_tokens ?? null,
  };
  if (out?.stop_reason === 'refusal') return answer({ ...authored(['refusal']), ...meter });
  const text = tidyReply((out?.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n'));
  if (!text) return answer({ ...authored(['empty']), ...meter });

  // 7. The reply guard.
  const verdict = checkReply(text);
  if (!verdict.ok) {
    const a = authored(verdict.reasons);
    // A team that asked for the answer gets the plain "I will not" first.
    if (kind !== 'stuck' && asksForAnswer(message)) a.body = `${ANSWER_REPLY}`;
    return answer({ ...a, ...meter });
  }
  // 8. Stored by answer().
  return answer({ kind: kind === 'stuck' ? 'hint' : 'reply', body: text, guard: [], ...meter });
}

export default { runTurn, MAX_MESSAGE_CHARS };
