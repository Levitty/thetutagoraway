// ============================================================================
// THE SCRIPTED TUTOR: a whole Grade 5 lesson on equivalent fractions with no
// model and no cost, so the board and its timing can be tried for free.
//
// It speaks the same command list as the model and goes through the same
// validator (commands.js) and the same marking (markSpoken, the spoken-answer
// reading over the homework marker), so what is tried here is what the real tutor drives. It follows the
// approved session shape: it says it is an AI, warm-up on the prerequisite,
// teach, guided practice, independent problem, wrap-up. It uses the teaching
// moves the board supports (phase 1 of the rendering engine): it counts parts
// with the child, draws an answer only after the child has given one, and
// draws the key idea slowly (pace 'slow'). When the child is
// wrong it diagnoses first: a follow-up whose wrong answers separate the
// suspected misconceptions, then record_diagnosis with the evidence.
//
// The hidden answers stay inside this closure, as the server keeps them sealed.
//
// Pictures (milestone 2): the scripted tutor cannot read handwriting. stubVision
// gives a canned "what I see" for the prepared example drawings (examples.js)
// and, for anything else, says honestly that it cannot read it. A clear
// reading of a written answer counts as the answer, and the diagnosis names
// the picture as its evidence, as the real tutor does.
// ============================================================================
import { validateTurn } from './commands.js';
import { markSpoken } from './spokenAnswer.js';
import { EXAMPLES } from './examples.js';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const ADD = `${EQ}.M_EQUIV_ADDITIVE`;
const ONE = `${EQ}.M_EQUIV_ONE_TERM_ONLY`;
const say = (text) => ({ cmd: 'say', text });
const pause = (s = 40) => ({ cmd: 'pause_for_child', expect: 'typed', max_wait_s: s });
const typed = (answer, wrong = [], accepts = []) => ({ kind: 'typed', cskill: EQ, answer, accepts: [answer, ...accepts], wrong: wrong.map(([value, mis]) => ({ value, mis })) });

// Each beat: the steps, and the hidden question (if it asks one).
const BEATS = {
  // Count together (owner, 11 Nov 2026: count the parts with the child): HOREB counts the
  // first eaten pieces aloud, one ring per spoken number, and the child carries on and
  // says how many. It never counts them all before the child has had a go.
  open: () => ({
    steps: [
      { cmd: 'set_phase', phase: 'warmup' },
      say('Hello. I am HOREB, an AI tutor, a computer program, not a person. Today we look at fractions that look different but are the same amount.'),
      say('Here is a chapati, cut into four equal pieces. Some of the pieces were eaten.'),
      // Shaded in ink, so the counting rings (the scene's one colour, orange) stand out on it.
      { cmd: 'shape', id: 'eaten', kind: 'circle', parts: 4, shaded: 3, label: false, slot: 'top_left', colour: 'ink', on: 'chapati' },
      say('Count the eaten pieces with me. One. Two.'),
      { cmd: 'highlight', target: 'eaten', part: 1, style: 'circle', on: 'One' },
      { cmd: 'highlight', target: 'eaten', part: 2, style: 'circle', on: 'Two' },
      say('Now you carry on counting. What fraction of the chapati was eaten?'),
      { cmd: 'ask', id: 'w1', prompt: 'What fraction of the chapati was eaten?', form: 'fraction', expected: '3/4' },
      pause(),
    ],
    hidden: { w1: typed('3/4', [['1/4', 'other'], ['4/3', 'other']]) },
  }),
  // The answer is drawn only now, after the child has answered: the last ring, and 3/4.
  // The key idea (cutting each half in two) is drawn slowly.
  teach: (right) => ({
    steps: [
      say(right ? 'Yes. Three of the four equal pieces. That is three quarters.' : 'Let us finish the count. Three pieces of four. That is three quarters.'),
      { cmd: 'highlight', target: 'eaten', part: 3, style: 'circle', on: 'Three' },
      { cmd: 'write_math', id: 'w1a', expr: 'frac(3,4)', slot: 'top_right', size: 'l', on: 'three quarters' },
      { cmd: 'set_phase', phase: 'teach' },
      say('Now look at this bar. One half of it is shaded. Watch closely: I cut each half into two pieces.'),
      { cmd: 'clear', on: 'Now', delay_ms: -250 },
      { cmd: 'fraction_bar', id: 'half', parts: 2, shaded: 1, label: true, slot: 'top', colour: 'orange', on: 'bar' },
      { cmd: 'fraction_bar', id: 'quarters', parts: 4, shaded: 2, label: true, slot: 'middle', colour: 'orange', pace: 'slow', on: 'cut' },
      say('The shaded part is the same size. One half is the same as two quarters.'),
      { cmd: 'write_math', id: 'eq1', expr: 'frac(1,2) = frac(2,4)', slot: 'bottom_left', size: 'l' },
    ],
    hidden: {},
    tail: [say('What happened to the top number and the bottom number?'), pause()],
  }),
  guided: (noticed) => ({
    steps: [
      say(noticed ? 'Yes. Both numbers were multiplied by two. One times two is two, and two times two is four.' : 'Look again. The bottom went from two to four. The top went from one to two.'),
      { cmd: 'write_math', id: 'rule', expr: 'frac(1×2,2×2) = frac(2,4)', slot: 'bottom_right', colour: 'orange', on: noticed ? 'multiplied' : 'bottom' },
      { cmd: 'set_phase', phase: 'guided' },
      say('Your turn. Here is one third.'),
      { cmd: 'clear', on: 'Your turn', delay_ms: -200 },
      // A figure the child handles (rendering engine phase 2): one third, and under it the same bar
      // in sixths for the child to shade. The app marks when the shading matches; HOREB never shades it.
      { cmd: 'figure', id: 'match', type: 'fraction', params: JSON.stringify({ shape: 'bar', parts: 3, shaded: 1, second: { parts: 6, shaded: 0 }, label: true }), controls: ['shade_second'], goal: JSON.stringify({ kind: 'match' }), slot: 'middle', colour: 'orange', on: 'one third' },
      say('Under it, the same bar is cut into six equal pieces. Tap the sixths to shade the same amount.'),
      say('One third is how many sixths?'),
      { cmd: 'write_math', id: 'g1m', expr: 'frac(1,3) = frac(?,6)', slot: 'bottom', size: 'l', on: 'how many' },
      { cmd: 'ask', id: 'g1', prompt: 'One third is how many sixths?', form: 'number', expected: '2' },
      pause(),
    ],
    hidden: { g1: typed('2', [['4', ADD], ['1', ONE], ['6', ONE]]) },
  }),
  probe: ({ answer, seen }) => ({
    // Diagnose first: 4 for 1/3 = ?/6 could be adding 3 to both, or a slip.
    // In 2/4 = ?/8, adding gives 6 and changing only the bottom gives 2.
    steps: [
      say(seen ? `I see you wrote ${seen}. Let us try one more before we check.` : `You wrote ${answer}. Let us try one more before we check.`),
      { cmd: 'clear', on: 'one more', delay_ms: -200 },
      say('Two quarters is how many eighths? Look at the top and the bottom.'),
      { cmd: 'write_math', id: 'p1m', expr: 'frac(2,4) = frac(?,8)', slot: 'top_left', size: 'l', on: 'Two quarters' },
      { cmd: 'underline', target: 'p1m', on: 'bottom' },
      { cmd: 'ask', id: 'p1', prompt: 'Two quarters is how many eighths?', form: 'number', expected: '4' },
      pause(),
    ],
    hidden: { p1: typed('4', [['6', ADD], ['2', ONE], ['8', ONE]]) },
  }),
  reteach: ({ evidence, snapshot, seen }) => ({
    steps: [
      { cmd: 'record_diagnosis', skill: EQ, misconception: ADD, confidence: 'high', evidence, next: 'reteach', ...(snapshot ? { snapshot } : {}) },
      say(seen ? `Thank you. In ${seen} you added the same number to the top and the bottom.` : 'Thank you. I think you added the same number to the top and the bottom.'),
      say('Adding changes the amount. Look at two thirds.'),
      { cmd: 'clear', on: 'Look', delay_ms: -200 },
      // Both bars shaded in the scene's one colour: the same colour means the same kind of thing (an
      // amount of the same whole), so the eye compares the two shaded lengths directly and sees
      // five sixths reach further. Hatching one in ink would read as a different kind of thing.
      { cmd: 'fraction_bar', id: 'thirds', parts: 3, shaded: 2, label: true, slot: 'top', colour: 'orange', on: 'Look', delay_ms: 300 },
      say('Two of the three equal pieces are shaded. Under it, five sixths.'),
      { cmd: 'fraction_bar', id: 'sixths5', parts: 6, shaded: 5, label: true, slot: 'middle', colour: 'orange', on: 'five sixths' },
      say('Five of the six pieces are shaded. Five sixths is more than two thirds. So we multiply both numbers by the same number.'),
      { cmd: 'write_math', id: 'r1', expr: 'frac(2×2,3×2) = frac(4,6)', slot: 'bottom', size: 'l', on: 'multiply' },
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
      say('Mama cuts a cake into twelve equal pieces. Three quarters of the cake is how many twelfths?'),
      { cmd: 'write_text', id: 'task', text: 'Mama cuts a cake into 12 equal pieces.', slot: 'top', size: 'm', on: 'Mama' },
      { cmd: 'write_math', id: 'i1m', expr: 'frac(3,4) = frac(?,12)', slot: 'middle', size: 'l', on: 'twelfths' },
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
      { cmd: 'clear', on: 'Today', delay_ms: -200 },
      // A figure that is only shown: three quarters on the number line, three jumps of one quarter.
      say('Look at the number line. We start at nought and make jumps of one quarter. One jump, two jumps, three jumps land on three quarters.'),
      { cmd: 'figure', id: 'line34', type: 'numberline', params: JSON.stringify({ from: 0, to: 1, divisions: 4, label_as: 'fraction', jumps: [{ from: 0, to: 0.25 }, { from: 0.25, to: 0.5 }, { from: 0.5, to: 0.75 }], jump_label: false }), slot: 'middle', colour: 'orange', on: 'number line' },
      say('Three quarters is the same place as nine twelfths. To find it, multiply the top and the bottom by the same number.'),
      { cmd: 'write_text', id: 'learned', text: 'Multiply the top and bottom by the same number.', slot: 'bottom', size: 's', colour: 'orange', on: 'multiply' },
      say('Thank you for working with me. Goodbye for now.'),
      { cmd: 'end_session', summary: right ? 'Equivalent fractions: added to top and bottom at first, then multiplied correctly after reteaching, and solved 3/4 = 9/12 alone.' : 'Equivalent fractions: added to top and bottom; reteaching started, needs another session.' },
    ],
    hidden: {},
  }),
};

const NOTICED = /\b(2|two|times|multipl\w*|double\w*)\b/i;

// About how fast a model writes the turn's JSON (some 75 tokens a second) and how long
// before its first step: the scripted tutor streams at this pace.
export const STREAM_CHARS_PER_S = 300;
export const FIRST_STEP_MS = 60;
const IN_PAGE = typeof window !== 'undefined';   // node tests run it without the pauses

// What the scripted tutor says when the child is silent (the live tutor writes its own, for the moment).
const PROBE_SAY = {
  answer_nudge: 'Take your time. Have a look at the board.',
  answer_smaller: 'Let us make it smaller. Look at the first part only. What do you see?',
  task_checkin: 'Tell me when you are done, or ask me for a hint.',
  talk_nudge: 'What do you think? Any idea is fine.',
  talk_again: 'Is it more or less than a half? Just tell me.',
};

/**
 * A scripted tutor with the same shape as the remote one: turn(request, onEvent) ->
 * { steps, dropped, notes, marked, target, prerequisite, cost_usd, spent }.
 */
export function createMockTutor() {
  let beat = 'open';
  let hidden = {};
  const evidence = [];
  let last = null; // the beat last played, to go back over it when interrupted
  let snapshots = 0;
  let inkAt = [];
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
    const v = validateTurn({ steps }, { board, snapshots, inkCells: inkAt });
    // Public half only, as the server sends it: the answer stays here.
    const pub = v.steps.map((s) => (s.cmd === 'ask' ? (({ expected, accepts, wrong, ...p }) => ({ ...p, seal: `mock:${s.id}`, skill: EQ }))(s) : s));
    return { steps: pub, dropped: v.dropped, notes: v.notes };
  };
  const mark = (answer, pic = null) => {
    if (!answer?.seal) return null;
    const id = String(answer.seal).replace(/^mock:/, '');
    const it = hidden[id];
    if (!it) return null;
    const r = markSpoken(it, answer.response);
    if (!r.attempt) return null; // a question back or "umm": not an answer, so not marked (as the server does)
    const m = { ask: id, skill: EQ, correct: r.correct, misconception: r.mis && r.mis !== 'other' ? r.mis : null, answer: String(answer.response ?? ''), ...(pic ? { snapshot: pic.id, seen: pic.seen } : {}) };
    evidence.push(m);
    return m;
  };
  const compose = async ({ message = '', answer = null, board = [], heard = null, snapshot = null, snapshots_taken: taken = 0, ink_cells: cells = [], figures = [], probe = null } = {}) => {
      inkAt = cells;
      snapshots = Math.max(snapshots, Number(taken) || 0);
      const meta = { target: EQ, prerequisite: null, cost_usd: 0, spent: { session: 0, day: 0 } };
      // The child has been silent (silence.js): a short scripted nudge; the lesson does not move on.
      if (probe && !message && !snapshot) {
        const line = PROBE_SAY[probe.kind] || PROBE_SAY.answer_nudge;
        const v = validateTurn({ steps: [say(line), { ...pause(), doing: probe.kind === 'task_checkin' ? 'task' : probe.kind.startsWith('talk') ? 'talk' : 'answer' }] }, { board, snapshots });
        return { steps: v.steps, dropped: v.dropped, notes: v.notes, marked: null, ...meta, guard: ['scripted', 'probe'] };
      }
      // Spoken over (typed over, in milestone 1): go back over the same beat; the lesson does not move on.
      if (heard != null && last) return { ...respond(last.key, last.arg, board, true), marked: null, ...meta, guard: ['scripted', 'interrupted'] };
      // A picture of the child's work: what the stub "sees".
      let pic = null;
      if (snapshot) {
        const seen = stubVision(snapshot);
        const picture = { id: snapshot.id, used: true, reason: snapshot.reason };
        const open = Object.keys(hidden)[0];
        if (!seen.clear) {
          // Never claim to see what cannot be read: say so, ask again; the lesson waits.
          const v = validateTurn({ steps: seen.blank
            ? [say('I cannot see any writing of yours on the board yet.'), say('Write your working, then press Check my work.'), pause()]
            : seen.freehand
              ? [say('I can see you wrote something, but in this practice mode I can only read the example drawings.'), say('Please type your answer for me too.'), pause()]
              : [say('I can see some writing, but I cannot read it clearly.'), say('Please write it again, bigger, or type your answer.'), pause()] }, { board, snapshots });
          return { steps: v.steps, dropped: v.dropped, notes: v.notes, marked: null, ...meta, picture, guard: ['scripted', 'unclear'] };
        }
        if (!open) {
          const v = validateTurn({ steps: [say(`I see you wrote ${seen.text}.`), say('Tell me about it when you are ready.'), pause()] }, { board, snapshots });
          return { steps: v.steps, dropped: v.dropped, notes: v.notes, marked: null, ...meta, picture, guard: ['scripted'] };
        }
        pic = { id: snapshot.id, seen: seen.text };
        answer = { seal: `mock:${open}`, response: seen.answer };
        message = seen.answer;
      }
      const marked = mark(answer, pic);
      // What the child did with the sixths (the page's own note, src/draw/observe.js): said first, in words.
      const played = (figures || []).find((f) => f.id === 'match' && board.some((b) => b.id === 'match'));
      const lead = played && !/not touched/.test(played.note)
        ? say(/done/.test(played.note) && !/undone/.test(played.note) ? 'I saw you shade the sixths until they matched one third.' : 'I saw you shade some sixths. They do not match one third yet.')
        : null;
      let out;
      switch (beat) {
        case 'open': out = respond('open', null, board); beat = 'teach'; break;
        case 'teach': out = respond('teach', marked?.correct, board); beat = 'guided'; break;
        case 'guided': out = respond('guided', NOTICED.test(message), board); beat = 'g1'; break;
        case 'g1':
          if (marked && !marked.correct) { out = respond('probe', { answer: marked.answer, seen: marked.seen }, board); beat = 'p1'; } else { out = respond('independent', true, board); beat = 'i1'; }
          break;
        case 'p1': {
          const first = evidence.find((e) => e.ask === 'g1');
          const how = (e) => (e?.snapshot ? ` (on the board, picture ${e.snapshot})` : '');
          const ev = `Wrote ${first?.answer} for 1/3 = ?/6${how(first)} and ${marked?.answer} for 2/4 = ?/8${how(marked)}${marked?.misconception === ADD ? ': added the same number to top and bottom both times.' : '.'}`;
          const snap = marked?.snapshot || first?.snapshot || null;
          if (marked && !marked.correct) { out = respond('reteach', { evidence: ev, snapshot: snap, seen: marked.seen || null }, board); beat = 'g2'; } else { out = respond('independent', true, board); beat = 'i1'; }
          break;
        }
        case 'g2': out = respond('independent', !!marked?.correct, board); beat = 'i1'; break;
        case 'i1': out = respond('wrapup', !!marked?.correct, board); beat = 'done'; break;
        default: out = { steps: [say('Our lesson is finished. Well done.'), { cmd: 'end_session', summary: 'Finished.' }], dropped: [], notes: [] };
      }
      if (lead && beat !== 'g1' && out.steps.length) out = { ...out, steps: [lead, ...out.steps] };
      return { ...out, marked, ...meta, ...(snapshot ? { picture: { id: snapshot.id, used: true, reason: snapshot.reason } } : {}), guard: ['scripted'] };
  };
  return {
    name: 'scripted',
    /**
     * The same stream as the live tutor: meta, then each step, then end. Steps come at
     * about a model's writing speed (STREAM_CHARS_PER_S), so the free mode plays the
     * same streaming path: a sentence is spoken while the next is still being written.
     */
    async turn(request = {}, onEvent = () => {}, { charsPerS = IN_PAGE ? STREAM_CHARS_PER_S : 0, firstMs = IN_PAGE ? FIRST_STEP_MS : 0 } = {}) {
      const r = await compose(request);
      const { steps, dropped, notes, guard, cost_usd, spent, ...rest } = r;
      onEvent({ type: 'meta', ...rest });
      let wait = firstMs;
      for (const st of steps) {
        if (wait > 0) await new Promise((res) => setTimeout(res, wait));
        onEvent({ type: 'step', step: st });
        wait = charsPerS ? (JSON.stringify(st).length / charsPerS) * 1000 : 0;
      }
      const end = { type: 'end', dropped, notes, guard, cost_usd, spent };
      onEvent(end);
      return { ...r, ...end };
    },
  };
}

/**
 * The stub's "what I see". `snapshot.example` names a prepared drawing
 * (examples.js) when the board shows exactly one; `strokes` is how many
 * strokes of the child's are on the board.
 */
export function stubVision(snapshot) {
  if (!snapshot?.strokes) return { clear: false, blank: true };
  const e = EXAMPLES[snapshot.example];
  if (!e) return { clear: false, freehand: true };
  if (!e.clear) return { clear: false };
  return { clear: true, text: e.text, read: e.read, answer: e.answer };
}

// What the demo child types, in order, when the page runs itself (?demo=auto).
export const DEMO_ANSWERS = ['3/4', 'The bottom doubled and the top doubled', '4', '6', '3', '9'];

// The demo child. Each entry is one turn of the child's:
//   { type: 'speak', text }                      says it (Talk; the scripted mode "speaks" typed words)
//   { type: 'speak', text, during: 'speaking', after }   says it over HOREB, `after` ms into its turn
//   { type: 'text', text }                       types it
//   { type: 'draw', example, then: 'check'|'wait', clearFirst }   writes a prepared example, then
//                                                 presses Check my work, or stops and waits (the idle picture)
export const DEMO_SCRIPT = [
  { type: 'speak', text: '3/4' },
  // Talks over HOREB 4 s into its next turn: the voice and the strokes stop at once (barge-in).
  { type: 'speak', text: 'Wait, can you show me again', during: 'speaking', after: 4000 },
  { type: 'speak', text: 'The bottom doubled and the top doubled' },
  { type: 'draw', example: 'scribble', then: 'check' },
  { type: 'draw', example: 'adds', then: 'wait', clearFirst: true },
  { type: 'draw', example: 'probe', then: 'check', clearFirst: true },
  { type: 'speak', text: '3' },
  { type: 'text', text: '9' },
];

export default { createMockTutor, stubVision, DEMO_ANSWERS, DEMO_SCRIPT };
