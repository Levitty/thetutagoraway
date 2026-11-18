// CRE depth pass (owner, 18 Nov 2026: every subject to the Grade 5 Maths standard). Shared rules and short helpers for
// scripts/data/cre-depth/g<N>.mjs, read by scripts/build-cre-grade.mjs and tests/helpers/creDepth.mjs.
// Everything is a draft until a CRE teacher reviews it. Bible facts are those stated in the passages the KICD design names;
// nothing denominational is asked (how baptism or Communion is done, numbering of the commandments). Islamic and Hindu RE are
// not loaded. Lines a teacher of the school's own tradition should confirm carry FAITH (in the source line).

// Outcomes that are faith, values, attitudes, habits or practical work: seen and scored in class with the KICD rubric, never by a
// tapped answer (as the CRE non-question lists of 13 Nov 2026 already sort them). Every other outcome must have a skill.
export const CRE_NOT_TESTED = new RegExp('^(' + [
  // faith, values and attitudes
  'appreciate', 'desire', 'acknowledge', 'respect', 'value', 'emulate', 'portray', 'acquire', 'have faith', 'exercise', 'trust',
  'depend', 'stand firm', 'live', 'model', 'exemplify', 'embrace', 'uphold',
  // habits and practice
  'practi[sc]e', 'ractice', 'participate', 'take part', 'take care', 'pray', 'say a prayer', 'serve', 'utili[sz]e', 'handle', 'obey',
  'read the bible', 'read the scriptures', 'reach out', 'share resources', 'help those', 'avoid', 'use social media', 'make (right|wise)',
  'choose', 'conserve', 'demonstrate', 'apply', 'express', 'resist', 'originate',
  // spoken or made in class
  'recite', 'role play', 'draw', 'mention his or her name',
  // personal reflection
  'identify their', 'identify the challenges they',
].join('|') + ')', 'i');

export const REVIEWER = 'a CRE teacher';
export const TC = 'To confirm by a CRE teacher: a common classroom error, not traced to a study by the author.';
export const FAITH = 'To confirm by a CRE teacher of the school\'s own tradition (FAITH: the wording touches belief or practice): a common classroom error, not traced to a study by the author.';
export const RULE = ' Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.';

// A teaching pack entry, short form:
//   P(key_step, [prerequisite, floor question, answer], reps[], steps[], contexts[], board, [[question, answer, shows] x2])
// board: B(write, point, ask, wait, end) gives the four beats every CRE entry uses: write the passage or picture, point and ask,
// pause for the child, then reveal; or a full beat list [[beat, do, say?], ...].
export const B = (write, point, ask, wait, end) => [['write', write], ['point', point, ask], ['pause', wait], ['reveal', end]];
export const P = (key_step, floor, reps, steps, contexts, board, checks) => ({ key_step, floor, reps, steps, contexts, board, checks });
