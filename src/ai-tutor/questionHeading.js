// A bare sum ("7 × 8 = ?", "What is 7 × 8?") is set large, as on a board. An
// instruction is a sentence and stays at reading size, however short it is:
// "Shade the grid to show 0.54" is 27 characters and was drawn at twice the
// size of every other question.
export const isBareSum = (question) => {
  const text = String(question || '');
  return text.length <= 28 && (text.match(/[A-Za-z]{3,}/g) || []).length < 3;
};

export const questionHeadingClass = (question) => (isBareSum(question)
  ? 'text-[36px] font-extrabold leading-tight'
  : 'text-[22px] font-bold leading-snug');
