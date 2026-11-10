// ============================================================================
// THE SCRIPTED TUTOR: a whole Grade 5 lesson on equivalent fractions with no
// model and no cost, so the board and its timing can be tried for free.
//
// It speaks the same command list as the model and goes through the same
// validator (commands.js) and the same marking (markItem, the homework
// marker), so what is tried here is what the real tutor drives. It follows the
// approved session shape: it says it is an AI, warm-up on the prerequisite,
// teach, guided practice, independent problem, wrap-up. When the child is
// wrong it diagnoses first: a follow-up whose wrong answers separate the
// suspected misconceptions, then record_diagnosis with the evidence.
//
// The hidden answers stay inside this closure, as the server keeps them sealed.
// ============================================================================
import { validateTurn } from './commands.js';
import { markItem } from '../school/homeworkSitting.js';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const ADD = `${EQ}.M_EQUIV_ADDITIVE`;
const ONE = `${EQ}.M_EQUIV_ONE_TERM_ONLY`;
const say = (text) => ({ cmd: 'say', text });
const pause = (s = 40) => ({ cmd: 'pause_for_child', expect: 'typed', max_wait_s: s });
const typed = (answer, wrong = [], accepts = []) => ({ kind: 'typed', cskill: EQ, answer, accepts: [answer, ...accepts], wrong: wrong.map(([value, mis]) => ({ value, mis })) });

// Each beat: the steps, and the hidden question (if it asks one).
const BEATS = {
  open: () => ({
    steps: [
      { cmd: 'set_phase', phase: 'warmup' },
      say('Hello. I am HOREB, an AI tutor. I am a computer program, not a person.'),
      say('Today we will look at fractions that look different but are the same amount.'),
      say('First, here is a chapati cut into four equal pieces.'),
      { cmd: 'shape', id: 'chapati', kind: 'circle', parts: 4, shaded: 0, label: false, slot: 'top_left', on: 'chapati' },
      say('Three of the pieces are eaten.'),
      { cmd: 'shape', id: 'eaten', kind: 'circle', parts: 4, shaded: 3, label: false, slot: 'top_right', on: 'Three' },
      { cmd: 'point', target: 'eaten', part: 3, on: 'eaten' },
      { cmd: 'ask', id: 'w1', prompt: 'What fraction of the chapati is eaten?', form: 'fraction', expected: '3/4' },
      pause(),
    ],
    hidden: { w1: typed('3/4', [['1/4', 'other'], ['4/3', 'other']]) },
  }),
  teach: (right) => ({
    steps: [
      say(right ? 'Yes. Three of four equal pieces is three quarters.' : 'It is three quarters. Three pieces out of four equal pieces.'),
      { cmd: 'set_phase', phase: 'teach' },
      say('Now look at this bar. One half of it is shaded.'),
      { cmd: 'clear', on: 'Now', delay_ms: -250 },
      { cmd: 'fraction_bar', id: 'half', parts: 2, shaded: 1, label: true, slot: 'top', on: 'bar' },
      say('Let us cut each piece into two smaller pieces.'),
      { cmd: 'fraction_bar', id: 'quarters', parts: 4, shaded: 2, label: true, slot: 'middle', colour: 'green', on: 'cut' },
      say('The shaded part is the same size. One half is the same as two quarters.'),
      { cmd: 'highlight', target: 'quarters', part: 2, style: 'glow', on: 'same size' },
      { cmd: 'write_math', id: 'eq1', expr: 'frac(1,2) = frac(2,4)', slot: 'bottom_left', size: 'l', on: 'One half' },
    ],
    hidden: {},
    tail: [say('What happened to the top number and the bottom number?'), pause()],
  }),
  guided: (noticed) => ({
    steps: [
      say(noticed ? 'Yes. Both numbers were multiplied by two.' : 'Look again. The bottom went from two to four. The top went from one to two.'),
      { cmd: 'write_math', id: 'rule', expr: 'frac(1×2,2×2) = frac(2,4)', slot: 'bottom_right', colour: 'purple', on: noticed ? 'multiplied' : 'bottom' },
      { cmd: 'set_phase', phase: 'guided' },
      say('Your turn. Here is one third.'),
      { cmd: 'clear', on: 'Your turn', delay_ms: -200 },
      { cmd: 'fraction_bar', id: 'third', parts: 3, shaded: 1, label: true, slot: 'top', on: 'one third' },
      say('Cut it into sixths. How many sixths are shaded?'),
      { cmd: 'fraction_bar', id: 'sixths', parts: 6, shaded: 0, label: false, slot: 'middle', colour: 'green', on: 'sixths' },
      { cmd: 'write_math', id: 'g1m', expr: 'frac(1,3) = frac(?,6)', slot: 'bottom_left', size: 'l', on: 'How many' },
      { cmd: 'ask', id: 'g1', prompt: 'One third is how many sixths?', form: 'number', expected: '2' },
      pause(),
    ],
    hidden: { g1: typed('2', [['4', ADD], ['1', ONE], ['6', ONE]]) },
  }),
  probe: (answer) => ({
    // Diagnose first: 4 for 1/3 = ?/6 could be adding 3 to both, or a slip.
    // In 2/4 = ?/8, adding gives 6 and changing only the bottom gives 2.
    steps: [
      say(`You wrote ${answer}. Let us try one more before we check.`),
      { cmd: 'write_math', id: 'p1m', expr: 'frac(2,4) = frac(?,8)', slot: 'bottom_right', size: 'l', on: 'one more' },
      { cmd: 'underline', target: 'p1m', on: 'check' },
      { cmd: 'ask', id: 'p1', prompt: 'Two quarters is how many eighths?', form: 'number', expected: '4' },
      pause(),
    ],
    hidden: { p1: typed('4', [['6', ADD], ['2', ONE], ['8', ONE]]) },
  }),
  reteach: (evidence) => ({
    steps: [
      { cmd: 'record_diagnosis', skill: EQ, misconception: ADD, confidence: 'high', evidence, next: 'reteach' },
      say('Thank you. I think you added the same number to the top and the bottom.'),
      say('Adding changes the amount. Look at two thirds and five sixths.'),
      { cmd: 'clear', on: 'Look', delay_ms: -200 },
      { cmd: 'fraction_bar', id: 'cmp', parts: 3, shaded: 2, second_bar: { parts: 6, shaded: 5 }, label: true, slot: 'top', on: 'two thirds' },
      { cmd: 'highlight', target: 'cmp', bar: 2, part: 5, style: 'box', on: 'five sixths' },
      say('Five sixths is more. So we multiply both numbers by the same number.'),
      { cmd: 'write_math', id: 'r1', expr: 'frac(2×2,3×2) = frac(4,6)', slot: 'middle', size: 'l', on: 'multiply' },
      { cmd: 'set_phase', phase: 'guided' },
      { cmd: 'ask', id: 'g2', prompt: 'Now try: one half is how many sixths?', form: 'number', expected: '3' },
      pause(),
    ],
    hidden: { g2: typed('3', [['5', ADD], ['1', ONE]]) },
  }),
  independent: (right) => ({
    steps: [
      say(right ? 'Well done. You multiplied the top and the bottom by the same number.' : 'Close. Think: what times two makes six? Do the same to the top.'),
      { cmd: 'set_phase', phase: 'independent' },
      say('Here is one for you to do on your own.'),
      { cmd: 'clear', on: 'Here', delay_ms: -200 },
      { cmd: 'write_text', id: 'task', text: 'Mama cuts a cake into 12 equal pieces.', slot: 'top', size: 'm', on: 'one' },
      { cmd: 'write_math', id: 'i1m', expr: 'frac(3,4) = frac(?,12)', slot: 'middle', size: 'l', on: 'own' },
      { cmd: 'ask', id: 'i1', prompt: 'Three quarters is how many twelfths?', form: 'number', expected: '9' },
      pause(60),
    ],
    hidden: { i1: typed('9', [['11', ADD], ['3', ONE], ['12', ONE]]) },
  }),
  wrapup: (right) => ({
    steps: [
      say(right ? 'Yes, nine twelfths. You did that on your own.' : 'Let us look at that one again next time.'),
      { cmd: 'set_phase', phase: 'wrapup' },
      say('Today you learned that equivalent fractions are the same amount.'),
      { cmd: 'write_text', id: 'learned', text: 'Multiply the top and bottom by the same number.', slot: 'bottom', size: 's', colour: 'green', on: 'same amount' },
      say('Thank you for working with me. Goodbye for now.'),
      { cmd: 'end_session', summary: right ? 'Equivalent fractions: added to top and bottom at first, then multiplied correctly after reteaching, and solved 3/4 = 9/12 alone.' : 'Equivalent fractions: added to top and bottom; reteaching started, needs another session.' },
    ],
    hidden: {},
  }),
};

const NOTICED = /\b(2|two|times|multipl\w*|double\w*)\b/i;

/**
 * A scripted tutor with the same shape as the remote one: turn(request) ->
 * { steps, dropped, notes, marked, target, prerequisite, cost_usd, spent }.
 */
export function createMockTutor() {
  let beat = 'open';
  let hidden = {};
  const evidence = [];
  let last = null; // the beat last played, to go back over it when interrupted
  const respond = (key, arg, board, again = false) => {
    last = { key, arg };
    const b = BEATS[key](arg);
    hidden = { ...b.hidden };
    let steps = [...b.steps, ...(b.tail || [])];
    if (again) {
      // Interrupted: start the board for this beat again, and say so first.
      steps = [{ cmd: 'clear' }, ...steps.filter((s) => s.cmd !== 'set_phase')];
      const k = steps.findIndex((s) => s.cmd === 'say');
      steps[k] = say('Thank you for stopping me. Let me show that again, slowly.');
    }
    const v = validateTurn({ steps }, { board });
    // Public half only, as the server sends it: the answer stays here.
    const pub = v.steps.map((s) => (s.cmd === 'ask' ? (({ expected, accepts, wrong, ...p }) => ({ ...p, seal: `mock:${s.id}`, skill: EQ }))(s) : s));
    return { steps: pub, dropped: v.dropped, notes: v.notes };
  };
  const mark = (answer) => {
    if (!answer?.seal) return null;
    const id = String(answer.seal).replace(/^mock:/, '');
    const it = hidden[id];
    if (!it) return null;
    const r = markItem(it, answer.response);
    const m = { ask: id, skill: EQ, correct: r.correct, misconception: r.mis && r.mis !== 'other' ? r.mis : null, answer: String(answer.response ?? '') };
    evidence.push(m);
    return m;
  };
  return {
    name: 'scripted',
    async turn({ message = '', answer = null, board = [], heard = null } = {}) {
      // Spoken over (typed over, in milestone 1): go back over the same beat; the lesson does not move on.
      if (heard != null && last) return { ...respond(last.key, last.arg, board, true), marked: null, target: EQ, prerequisite: null, cost_usd: 0, spent: { session: 0, day: 0 }, guard: ['scripted', 'interrupted'] };
      const marked = mark(answer);
      let out;
      switch (beat) {
        case 'open': out = respond('open', null, board); beat = 'teach'; break;
        case 'teach': out = respond('teach', marked?.correct, board); beat = 'guided'; break;
        case 'guided': out = respond('guided', NOTICED.test(message), board); beat = 'g1'; break;
        case 'g1':
          if (marked && !marked.correct) { out = respond('probe', marked.answer, board); beat = 'p1'; } else { out = respond('independent', true, board); beat = 'i1'; }
          break;
        case 'p1': {
          const first = evidence.find((e) => e.ask === 'g1');
          const ev = `Wrote ${first?.answer} for 1/3 = ?/6 and ${marked?.answer} for 2/4 = ?/8${marked?.misconception === ADD ? ': added the same number to top and bottom both times.' : '.'}`;
          if (marked && !marked.correct) { out = respond('reteach', ev, board); beat = 'g2'; } else { out = respond('independent', true, board); beat = 'i1'; }
          break;
        }
        case 'g2': out = respond('independent', !!marked?.correct, board); beat = 'i1'; break;
        case 'i1': out = respond('wrapup', !!marked?.correct, board); beat = 'done'; break;
        default: out = { steps: [say('Our lesson is finished. Well done.'), { cmd: 'end_session', summary: 'Finished.' }], dropped: [], notes: [] };
      }
      return { ...out, marked, target: EQ, prerequisite: null, cost_usd: 0, spent: { session: 0, day: 0 }, guard: ['scripted'] };
    },
  };
}

// What the demo child types, in order, when the page runs itself (?demo=auto).
export const DEMO_ANSWERS = ['3/4', 'The bottom doubled and the top doubled', '4', '6', '3', '9'];

export default { createMockTutor, DEMO_ANSWERS };
