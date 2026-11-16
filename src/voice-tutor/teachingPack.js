// ============================================================================
// THE TEACHING PACK, PER SKILL (research round 3, 13 Nov 2026)
//
// The tutor's teaching knowledge for one Grade 5 maths skill: the key step the
// child must say, a floor check on the skill underneath, the pictures in order,
// the teaching steps, the board drawing as choreographed beats, the misconceptions
// with what the child might say, the question that reveals each and the repair,
// and two check questions.
//
// Only the entry for today's skill is meant to reach the model, so the pack can
// be large without growing every prompt. NOT WIRED IN YET: prompt.js and
// tutorTurn.js do not call this. Loading it into the turn brief is a separate
// change that waits for the owner's yes and a paid run.
//
//   teachingFor(skillCode)            the entry, or null
//   misconceptionFor(skillCode, code) one misconception entry, or null
//   briefFor(skillCode, { stage })    a short plain-text block for a turn brief
//   packCoverage()                    { skills, misconceptions } counts
// ============================================================================
import { TEACHING_PACK_G5 } from './teachingPackData.js';

export function teachingFor(skillCode) {
  return TEACHING_PACK_G5[skillCode] || null;
}

export function misconceptionFor(skillCode, code) {
  const e = teachingFor(skillCode);
  return (e && e.misconceptions.find((m) => m.code === code)) || null;
}

// A brief for one turn. The answers to the check questions and the floor answer are
// kept out of anything that could be read aloud: they are marked SEALED so the
// existing answer seal can hold them (src/voice-tutor/seal.js).
export function briefFor(skillCode, { stage = 'teach', misconception = null } = {}) {
  const e = teachingFor(skillCode);
  if (!e) return '';
  const lines = [`TEACHING PACK: ${e.name || skillCode}`, `Key step (the child says it, never you): ${e.key_step}`];
  if (stage === 'open' && e.floor) lines.push(`Floor check first: "${e.floor.question}" (SEALED answer: ${e.floor.answer})`);
  if (stage === 'open' || stage === 'teach') {
    lines.push(`Pictures in order: ${(e.representations || []).join(' -> ')}`);
    lines.push(`Steps: ${e.steps.map((s, i) => `${i + 1}. ${s}`).join(' ')}`);
    lines.push(`Contexts: ${e.contexts.join('; ')}`);
  }
  const ms = misconception ? e.misconceptions.filter((m) => m.code === misconception) : e.misconceptions;
  for (const m of ms) {
    lines.push(`If the child says something like ${(m.listen_for || []).map((w) => `"${w}"`).join(' or ')}: ${m.error || ''} Ask: "${m.ask}" Repair: ${m.repair}`);
  }
  if (stage === 'check') e.checks.forEach((c) => lines.push(`Check: "${c.question}" (SEALED answer: ${c.answer})`));
  return lines.join('\n');
}

export function packCoverage() {
  const entries = Object.values(TEACHING_PACK_G5);
  return { skills: entries.length, misconceptions: entries.reduce((n, e) => n + e.misconceptions.length, 0) };
}

export default { teachingFor, misconceptionFor, briefFor, packCoverage };
