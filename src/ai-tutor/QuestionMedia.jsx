// ============================================================================
// THE PICTURE AND THE BUTTONS A QUESTION CAME WITH
//
// Three screens ask the learner a question: the diagnostic ("Finding your
// start"), the lesson, and the timed review ("Memory check"). Only the lesson
// ever drew the picture, and none of the three drew the tap buttons for a
// question that ships its own options. So a real Grade 5 learner met this, in
// the memory check, with nothing on screen but a text box:
//
//     "What fraction of the sheet of paper is coloured?"
//     "Is this slice of bread cut into eight equal parts?"
//
// Both questions are about a picture that was never drawn, and both expect a
// tap on "½ ¼ ⅛" or "yes / no" — neither of which a child can type on a phone.
// The questions were not wrong; the screens simply dropped half of them.
//
// This module is the one place that renders a question's media and its own
// options, so a screen cannot silently forget either again.
// ============================================================================
import React from 'react';
import { YoungPicture } from './YoungPicture.jsx';
import { TeachingVisual } from './TeachingVisual.jsx';
import { checkAnswerMatch } from './answerCheck.js';
import { LETTERS } from './choices.js';

/**
 * Everything the learner must SEE to answer: the picture the question refers to
 * ("look at the picture") and the teaching drawing that scaffolds it.
 *
 * An interactive visual IS the answer widget, so a teaching model never appears
 * beside one — that would be two pictures competing for the same question.
 */
export function QuestionMedia({ problem, className = '' }) {
  if (!problem) return null;
  const hasPicture = !!problem.picture;
  const hasModel = !!problem.model && !problem.visual;
  if (!hasPicture && !hasModel) return null;
  return (
    <div className={className}>
      {hasPicture && <YoungPicture picture={problem.picture} />}
      {hasModel && <TeachingVisual model={problem.model} className="mb-4" />}
    </div>
  );
}

/**
 * The options a question carries, as buttons.
 *
 * `onPick` only selects — the learner still presses Check — so this behaves
 * exactly like the lesson's existing choice grid and needs no change to any
 * answer handler.
 */
export function ChoiceGrid({ problem, answer, onPick, disabled = false, struck = [], showAnswer = false }) {
  const opts = problem?.mc;
  if (!Array.isArray(opts) || opts.length === 0) return null;
  // Short options sit two to a row; anything wordy gets its own line so it
  // never truncates on a narrow phone.
  const twoUp = opts.length === 4 && opts.every(o => String(o).length <= 12);
  return (
    <div className={`grid gap-2.5 ${twoUp ? 'grid-cols-2' : 'grid-cols-1'}`} role="radiogroup" aria-label="Choose an answer">
      {opts.map((opt, i) => {
        const isStruck = struck.includes(opt);
        const chosen = answer === opt;
        const right = showAnswer && checkAnswerMatch(opt, problem);
        return (
          <button key={`${opt}-${i}`} type="button" role="radio" aria-checked={chosen}
            disabled={disabled || isStruck}
            onClick={() => onPick(opt)}
            className={`text-left flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-lg font-bold transition-colors ${
              right ? 'bg-[#eef4e7] border-[#4f7233] text-slate-900'
              : isStruck ? 'bg-[#fdf2ef] border-[#f2cdc2] text-slate-400 line-through'
              : chosen ? 'bg-amber-300 border-[#121117] text-slate-900 ring-4 ring-[#ff7aac]/40'
              : 'bg-amber-400 border-[#121117] text-slate-900 hover:bg-amber-300'}`}>
            {String(opt) !== LETTERS[i] && <span className="text-xs font-bold opacity-60 w-4">{LETTERS[i]}</span>}
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
