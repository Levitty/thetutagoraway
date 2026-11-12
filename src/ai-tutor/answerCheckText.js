// ============================================================================
// ANSWER CHECKING FOR WORDS (English). Marks a typed or tapped answer against the key.
//
// The Maths marker (answerCheck.js) reads an answer as a number or an algebraic expression: it drops a
// leading "a", "an" and "the", ignores punctuation and reads words as terms that commute. That is right
// for "2x + 3" and wrong for English: it marks "few" right for "a few", "taller than" right for
// "than taller" and a sentence with its quotation marks missing right for one with them. English answers
// are marked here: exact words, in order, with the punctuation, apart from capital letters, spare spaces,
// curly quotes (a phone keyboard types them) and a full stop the child adds after a single word. A tapped
// option (problem.choices) is matched exactly, capital letters and punctuation included.
// A problem marked this way carries marker: 'text' (families/eng_lib.js sets it).
// ============================================================================
const fold = (s) => String(s ?? '').trim().toLowerCase()
  .replace(/[‘’ʼ´`]/g, "'").replace(/[“”]/g, '"')
  .replace(/[–—]/g, '-').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1');

const tidy = (s) => String(s ?? '').trim().replace(/[\u2018\u2019\u02bc\u00b4`]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, ' ');

export const checkTextAnswer = (userAnswer, problem) => {
  // A tapped option is the option itself: capital letters and punctuation are the point of many English questions.
  if (problem.choices) return tidy(userAnswer) === tidy(problem.answer);
  const u = fold(userAnswer);
  if (!u) return false;
  const keys = (problem.accepts?.length ? problem.accepts : [problem.answer]).map(fold);
  if (keys.includes(u)) return true;
  // A child may end a single word or short phrase with a full stop; a key that is a whole sentence already has its own.
  const bare = u.replace(/\.$/, '');
  return !/[.!?"]$/.test(keys[0] || '') && keys.includes(bare);
};
export default checkTextAnswer;
