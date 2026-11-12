// ============================================================================
// THE BOARD COMMAND LIST (HOREB live tutor, milestone 1, approved 10 Nov 2026).
//
// The model never writes code, HTML or coordinates. Each turn it fills in one
// fixed form: an ordered list of at most MAX_STEPS steps, each one of the 21
// commands below. This file is the rule every step must clear before it is
// drawn, on the server (before the reply leaves) and again in the browser
// (before anything is rendered). A step that fails is dropped and logged,
// never executed, and never "repaired" into something the model did not say.
// The one exception is the step's SHAPE, where the model's meaning is plain
// (12 Nov 2026: 70 sentences were lost to {"cmd":"say","say":"..."}):
// repairStep() reads an obvious field alias as the field (say, sentence, words
// for text; a step with no cmd that is only a say), and notes it. Nothing a
// child hears or sees is changed.
//
// A full board makes room (12 Nov 2026: 19 drawings were dropped for "no free
// slot" while the tutor's words pointed at them): the oldest items this turn
// has not used are erased first, starting with whatever holds the slot asked
// for, and the erase goes out as a step before the drawing.
//
//   validateTurn(raw, { board, allowedMis, hidden })  -> { steps, dropped, notes }
//   TURN_SCHEMA                                        the JSON schema the model fills
//
// The JSON schema the API enforces cannot carry number ranges or string lengths
// (structured outputs do not support them), so every limit lives here.
// Pure: no network, no clock, no React. Tested in tests/voice-tutor-commands.test.mjs.
// ============================================================================
import { parseMath } from './mathExpr.js';
import { validateFigure, figureParts, FIGURE_TYPES, FIGURE_CONTROLS } from '../draw/figures.js';

export const MAX_STEPS = 12;
export const MAX_BOARD_ITEMS = 30;
export const PHASES = ['warmup', 'teach', 'guided', 'independent', 'wrapup'];
export const COLOURS = ['ink', 'blue', 'red', 'green', 'orange', 'purple'];
// What each colour name draws as. The child's ink (ink.js CHILD_INK) is kept apart from all of these.
export const PALETTE = { ink: '#1D1D27', blue: '#3557D6', red: '#D2383A', green: '#1F7A47', orange: '#E08200', purple: '#6D3FD6' };
export const SIZES = ['s', 'm', 'l'];
export const ASK_FORMS = ['number', 'fraction', 'word', 'choice', 'draw'];
export const EXPECTS = ['typed', 'spoken', 'drawn', 'any'];
export const CONFIDENCE = ['low', 'med', 'high'];
export const NEXT = ['probe', 'reteach', 'move_on'];
// What helped a child learn (note_what_helped). A fixed list: the child never writes it, the model only picks.
export const MOVES = ['drawing it', 'counting together', 'a real-life example', 'smaller steps', 'saying it aloud', 'writing it down', 'a picture on the board', 'a story', 'repeating it', 'a quick game'];
// What the child is doing once HOREB hands over (pause_for_child `doing`, 12 Nov 2026): silence is handled by it (silence.js).
//   answer  answering a question    task  doing something on the board (shade, draw, write, place)    talk  free talk, an opinion
export const DOINGS = ['answer', 'task', 'talk'];
// How the child's answer is judged (the silent `assess`, step 3 of the conversation engine). Only 'understood' counts as
// independent evidence; right_unexplained waits for a reason (the orchestrator asks for it first).
export const ANSWER_CLASSES = ['understood', 'right_unexplained', 'partly_right', 'misconception', 'missing_prerequisite', 'guess_or_no_attempt'];
// The sixteen teaching moves of docs/tutor-training/PLAYBOOK.md, by name. A say carries one as `move`; the orchestrator
// (orchestrator.js) says which are allowed each turn.
export const PLAYBOOK_MOVES = ['Open the lesson', 'Show then hand over', 'Predict then show', 'Count with the child', 'Wait and nudge', 'Smaller-question hint', 'Revoice and build', 'Press for reasoning', 'Name what was right', 'Diagnose the wrong answer', 'Check for understanding', 'Celebrate the strategy', 'Stretch the quick child', 'Recover a lost child', 'Bring back an off-topic child', 'Close the lesson'];
export const HIGHLIGHT_STYLES = ['circle', 'box', 'glow'];
export const SHAPE_KINDS = ['circle', 'rectangle', 'square', 'triangle'];

// The board is a 2 x 3 grid. A full-width slot takes both halves of its row.
export const SLOTS = ['top', 'middle', 'bottom', 'top_left', 'top_right', 'middle_left', 'middle_right', 'bottom_left', 'bottom_right'];
export const ROWS = ['top', 'middle', 'bottom'];
export const cellsOf = (slot) => (ROWS.includes(slot) ? [`${slot}_left`, `${slot}_right`] : [slot]);

// Items that take a slot on the board, and the marks that point at them.
// figure (rendering engine phase 2): a Grade 5 maths figure by type and settings (src/draw/figures.js), which the
// child may handle where the tutor allows it (controls), with a goal the app marks itself.
export const DRAWN = ['write_text', 'write_math', 'fraction_bar', 'number_line', 'shape', 'plot_points', 'figure'];
export const MARKS = ['highlight', 'underline', 'point'];
// Steps that are never seen or heard: applied when the turn arrives, never
// dropped by an interruption.
export const SILENT = ['set_phase', 'record_diagnosis', 'note_interest', 'note_what_helped', 'assess'];
export const COMMANDS = ['say', ...DRAWN, ...MARKS, 'erase', 'clear', 'ask', 'set_phase', 'record_diagnosis', 'note_interest', 'note_what_helped', 'assess', 'pause_for_child', 'end_session'];
// Steps that may carry a word anchor (`on`) and a delay.
export const TIMED = [...DRAWN, ...MARKS, 'erase', 'clear'];
// A drawn step may be drawn slowly (`pace: 'slow'`, about 1.6 times slower): for the key idea of a lesson.
export const PACES = ['slow'];

const FIELDS = {
  say: ['text', 'move'],
  write_text: ['id', 'text', 'slot', 'size', 'colour'],
  write_math: ['id', 'expr', 'slot', 'size', 'colour'],
  fraction_bar: ['id', 'parts', 'shaded', 'second_bar', 'label', 'slot', 'colour'],
  number_line: ['id', 'from', 'to', 'divisions', 'marks', 'jumps', 'slot'],
  shape: ['id', 'kind', 'parts', 'shaded', 'label', 'slot', 'colour'],
  plot_points: ['id', 'x_axis', 'y_axis', 'points', 'connect', 'slot'],
  figure: ['id', 'type', 'params', 'controls', 'goal', 'slot', 'colour'],
  highlight: ['target', 'part', 'bar', 'style'],
  underline: ['target', 'range'],
  point: ['target', 'part', 'bar'],
  erase: ['targets'],
  clear: ['scope'],
  ask: ['id', 'prompt', 'form', 'choices', 'expected', 'accepts', 'wrong', 'skill', 'bank'],
  set_phase: ['phase'],
  record_diagnosis: ['skill', 'misconception', 'confidence', 'evidence', 'next', 'snapshot'],
  pause_for_child: ['expect', 'max_wait_s', 'doing'],
  assess: ['class', 'misconception', 'evidence', 'ask'],
  note_interest: ['interest'], note_what_helped: ['move', 'helped'],
  end_session: ['summary'],
};
const REQUIRED = {
  say: ['text'], write_text: ['id', 'text', 'slot'], write_math: ['id', 'expr', 'slot'],
  fraction_bar: ['id', 'parts', 'shaded', 'slot'], number_line: ['id', 'from', 'to', 'divisions', 'slot'],
  shape: ['id', 'kind', 'parts', 'shaded', 'slot'], plot_points: ['id', 'x_axis', 'y_axis', 'points', 'slot'],
  figure: ['id', 'type', 'slot'],
  highlight: ['target'], underline: ['target'], point: ['target'], erase: ['targets'], clear: [],
  ask: ['id', 'prompt', 'form'], set_phase: ['phase'],
  record_diagnosis: ['skill', 'misconception', 'confidence', 'evidence', 'next'],
  note_interest: ['interest'], note_what_helped: ['move', 'helped'], assess: ['class', 'evidence'],
  pause_for_child: ['expect', 'max_wait_s'], end_session: ['summary'],
};
export const LIMITS = {
  say: 220, write_text: 60, write_math: 80, ask_prompt: 140, choice: 40, expected: 40,
  evidence: 240, assess: 160, summary: 300, interest: 24, label: 12, axis_name: 16, anchor: 40,
  parts: [1, 12], shape_parts: [1, 12], line: [0, 12], divisions: [1, 12], marks: 8, jumps: 4,
  axis_steps: 20, points: 12, choices: 4, wrong: 6, accepts: 8, delay: [-300, 1500], wait: [5, 60], targets: 8,
};

// ---------------------------------------------------------------- strings
// Markup is taken out first, then anything outside the whitelist. Plain
// letters, digits, the maths signs the board draws, and ordinary punctuation.
const ALLOWED = /[A-Za-z0-9 .,;:!?'"()\-+=<>/%×÷−_]/;
export const cleanText = (raw) => {
  const s = String(raw ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[‘’`´]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, ', ')
    .replace(/\s+/g, ' ').trim();
  let removed = 0;
  const out = [...s].filter((c) => (ALLOWED.test(c) ? true : (removed++, false))).join('').replace(/\s+/g, ' ').trim();
  return { text: out, removed };
};
const ID_RE = /^[a-z][a-z0-9_]{0,23}$/;

const isInt = (v) => Number.isInteger(v);
const inRange = (v, [lo, hi]) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
const isBool = (v) => typeof v === 'boolean';

class Bad extends Error {}
const bad = (reason) => { throw new Bad(reason); };
const need = (cond, reason) => { if (!cond) bad(reason); };

const str = (v, max, name, notes) => {
  need(typeof v === 'string', `${name}: not text`);
  const { text, removed } = cleanText(v);
  need(text.length > 0, `${name}: empty`);
  need(text.length <= max, `${name}: longer than ${max}`);
  if (removed) notes.push(`${name}: ${removed} character(s) removed`);
  return text;
};

// Silent text (never heard or seen by the child): too long is cut at a sentence or a word, and noted.
const clip = (v, max, name, notes) => {
  need(typeof v === 'string', `${name}: not text`);
  const { text, removed } = cleanText(v);
  need(text.length > 0, `${name}: empty`);
  if (removed) notes.push(`${name}: ${removed} character(s) removed`);
  if (text.length <= max) return text;
  notes.push(`${name}: longer than ${max}, cut`);
  const head = text.slice(0, max);
  const stop = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (stop > max / 2) return head.slice(0, stop + 1);
  const sp = head.lastIndexOf(' ');
  return (sp > max / 2 ? head.slice(0, sp) : head).replace(/[,;:\s]+$/, '');
};
const readsAsNumber = (v) => /^\s*\d+(\s*\/\s*\d+)?\s*$/.test(String(v));

// A shaded value is a count (0..parts) or a list of distinct part numbers (1..parts).
const shadedOf = (v, parts) => {
  if (isInt(v)) { need(v >= 0 && v <= parts, 'shaded: count out of range'); return v; }
  need(Array.isArray(v) && v.length <= parts, 'shaded: not a count or a list');
  need(v.every((p) => isInt(p) && p >= 1 && p <= parts), 'shaded: part out of range');
  need(new Set(v).size === v.length, 'shaded: a part is listed twice');
  return [...v];
};

// ---------------------------------------------------------------- the shape, repaired
/** The fields a command may carry. */
const fieldsOf = (cmd) => new Set(['cmd', ...FIELDS[cmd], ...(TIMED.includes(cmd) ? ['on', 'delay_ms'] : []), ...(DRAWN.includes(cmd) ? ['pace'] : [])]);
// Extra fields that change nothing a child hears or sees when left out (12 Nov 2026, run 2: "assess: extra field say",
// a say with an "id" or an "on"). Only where the command does not have the field itself.
export const HARMLESS = ['say', 'sentence', 'words', 'speech', 'line', 'content', 'move', 'note', 'notes', 'comment', 'reason', 'why', 'thought', 'thinking', 'tone', 'emotion', 'explanation', 'id', 'on', 'delay_ms', 'pace', 'text'];
// Timing on a say is harmless (a say is timed by its words); on a drawing command it is checked as before.
const SAY_ONLY = ['on', 'delay_ms', 'pace'];
// The names the model reaches for instead of a field, where the meaning is not in doubt.
const ALIASES = {
  say: { text: ['say', 'sentence', 'words', 'speech', 'line', 'content'] },
  ask: { prompt: ['question', 'text'], expected: ['answer'] },
  assess: { class: ['assess', 'judgement', 'judgment', 'answer_class'] },
};
/**
 * A step with an obvious slip in its shape, mended: an alias read as its field (only when the field is missing,
 * or the alias says the same), a step with no cmd that is plainly a say, a hand-back with its defaults left out.
 * Anything else is returned as it was, for checkStep to judge. Notes say what was mended.
 */
export function repairStep(s, notes = []) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return s;
  let x = s;
  if (x.cmd == null) {
    const keys = Object.keys(x);
    if (typeof x.say === 'string' && keys.every((k) => ['say', 'move'].includes(k))) { x = { cmd: 'say', text: x.say, ...(x.move != null ? { move: x.move } : {}) }; notes.push('a step with no cmd read as a say'); }
    else if (typeof x.text === 'string' && keys.every((k) => ['text', 'move'].includes(k))) { x = { cmd: 'say', ...x }; notes.push('a step with no cmd read as a say'); }
    else return s;
  }
  const al = ALIASES[x.cmd];
  if (al) {
    for (const [field, names] of Object.entries(al)) {
      for (const n of names) {
        if (!(n in x) || n === field) continue;
        if (n === 'text' && x.cmd === 'ask' && x.prompt != null) continue;
        if (x[field] == null) { const { [n]: v, ...rest } = x; x = { ...rest, [field]: v }; notes.push(`${x.cmd}: field "${n}" read as ${field}`); }
        else if (x[n] === x[field] || x[n] == null || (typeof x[n] === 'string' && x[n].trim() === '')) { const { [n]: _v, ...rest } = x; x = rest; notes.push(`${x.cmd}: field "${n}" repeated ${field}, left out`); }
        // Both, saying different things (12 Nov 2026, run 2: 42 says dropped as "extra field say"): the field wins.
        else if (n !== 'text' || x.cmd === 'say') { const { [n]: _v, ...rest } = x; x = rest; notes.push(`${x.cmd}: field "${n}" beside ${field} said something else; ${field} kept`); }
      }
    }
    if (x.cmd === 'assess' && x.class != null && !ANSWER_CLASSES.includes(x.class)) return s;
  }
  // Harmless extra fields the model adds (its own words for a silent step, a note to itself, a timing on a say): left out
  // and noted, never a reason to lose the step. Anything else extra still drops it.
  if (COMMANDS.includes(x.cmd)) {
    const allowed = fieldsOf(x.cmd);
    const extra = Object.keys(x).filter((k) => !allowed.has(k) && HARMLESS.includes(k) && (x.cmd === 'say' || !SAY_ONLY.includes(k)));
    if (extra.length) {
      x = Object.fromEntries(Object.entries(x).filter(([k]) => !extra.includes(k)));
      notes.push(`${x.cmd}: harmless extra field${extra.length === 1 ? '' : 's'} ${extra.join(', ')} left out`);
    }
  }
  if (x.cmd === 'pause_for_child') {
    if (x.expect == null) { x = { ...x, expect: 'any' }; notes.push('pause_for_child: expect not given, read as any'); }
    if (x.max_wait_s == null) { x = { ...x, max_wait_s: 30 }; notes.push('pause_for_child: max_wait_s not given, read as 30'); }
  }
  return x;
}

// ---------------------------------------------------------------- one step
function checkStep(s0, ctx, notes) {
  const s = repairStep(s0, notes);
  need(s && typeof s === 'object' && !Array.isArray(s), 'not an object');
  const cmd = s.cmd;
  need(COMMANDS.includes(cmd), `unknown command ${String(cmd).slice(0, 30)}`);
  const allowed = fieldsOf(cmd);
  for (const k of Object.keys(s)) need(allowed.has(k), `${cmd}: extra field ${k.slice(0, 30)}`);
  for (const k of REQUIRED[cmd]) need(s[k] !== undefined && s[k] !== null, `${cmd}: missing ${k}`);
  const out = { cmd };

  if (TIMED.includes(cmd)) {
    if (s.on !== undefined && s.on !== null) out.on = str(s.on, LIMITS.anchor, 'on', notes);
    if (s.delay_ms !== undefined && s.delay_ms !== null) {
      need(isInt(s.delay_ms) && inRange(s.delay_ms, LIMITS.delay), 'delay_ms out of range');
      out.delay_ms = s.delay_ms;
    }
  }
  if (DRAWN.includes(cmd) && s.pace !== undefined && s.pace !== null) {
    need(PACES.includes(s.pace), `${cmd}: pace must be ${PACES.join('/')}`);
    out.pace = s.pace;
  }
  const newId = () => {
    need(typeof s.id === 'string' && ID_RE.test(s.id), `${cmd}: bad id`);
    need(!ctx.ids.has(s.id), `${cmd}: id ${s.id} is already on the board`);
    return s.id;
  };
  const target = (t) => {
    need(typeof t === 'string' && ID_RE.test(t), `${cmd}: bad target`);
    need(ctx.ids.has(t), `${cmd}: target ${t} is not on the board`);
    return t;
  };
  const optEnum = (k, list, dflt) => {
    if (s[k] === undefined || s[k] === null) return dflt;
    need(list.includes(s[k]), `${cmd}: ${k} must be one of ${list.join('/')}`);
    return s[k];
  };
  const optBool = (k, dflt) => {
    if (s[k] === undefined || s[k] === null) return dflt;
    need(isBool(s[k]), `${cmd}: ${k} must be true or false`);
    return s[k];
  };

  switch (cmd) {
    case 'say':
      out.text = str(s.text, LIMITS.say, 'say', notes);
      // The teaching move this sentence makes (docs/tutor-training/PLAYBOOK.md), for the tester view; never spoken.
      if (s.move != null) out.move = String(s.move).replace(/[^A-Za-z -]/g, '').slice(0, 40);
      // Short turns are held by the turn's word limit (MAX_SPOKEN_WORDS, tutorTurn.js), not by counting sentences here:
      // "One. Two. Three. Four." is four sentences and six words (12 Nov 2026: 61 sentences were lost to this rule).
      { const n = out.text.split(/(?<=[.!?])\s+/).filter(Boolean).length; if (n > 3) notes.push(`say: ${n} sentences (more than three)`); }
      break;
    case 'write_text':
      out.id = newId(); out.text = str(s.text, LIMITS.write_text, 'write_text', notes);
      out.slot = optEnum('slot', SLOTS); out.size = optEnum('size', SIZES, 'm'); out.colour = optEnum('colour', COLOURS, 'ink');
      break;
    case 'write_math': {
      out.id = newId();
      need(typeof s.expr === 'string' && s.expr.length <= LIMITS.write_math, 'write_math: expr too long');
      need(!/\\/.test(s.expr), 'write_math: LaTeX is not accepted');
      const p = parseMath(s.expr);
      need(p.ok, `write_math: ${p.error}`);
      out.expr = s.expr.trim();
      out.slot = optEnum('slot', SLOTS); out.size = optEnum('size', SIZES, 'm'); out.colour = optEnum('colour', COLOURS, 'ink');
      break;
    }
    case 'fraction_bar':
      out.id = newId();
      need(isInt(s.parts) && inRange(s.parts, LIMITS.parts), 'fraction_bar: parts must be 1 to 12');
      out.parts = s.parts; out.shaded = shadedOf(s.shaded, s.parts);
      if (s.second_bar !== undefined && s.second_bar !== null) {
        const b = s.second_bar;
        need(b && typeof b === 'object' && !Array.isArray(b), 'second_bar: not an object');
        for (const k of Object.keys(b)) need(['parts', 'shaded'].includes(k), `second_bar: extra field ${k.slice(0, 20)}`);
        need(isInt(b.parts) && inRange(b.parts, LIMITS.parts), 'second_bar: parts must be 1 to 12');
        out.second_bar = { parts: b.parts, shaded: shadedOf(b.shaded ?? 0, b.parts) };
      }
      out.label = optBool('label', true); out.slot = optEnum('slot', SLOTS); out.colour = optEnum('colour', COLOURS, 'blue');
      break;
    case 'number_line': {
      out.id = newId();
      need(isInt(s.from) && isInt(s.to) && inRange(s.from, LIMITS.line) && inRange(s.to, LIMITS.line) && s.from < s.to, 'number_line: from and to must be whole numbers 0 to 12, from < to');
      need(isInt(s.divisions) && inRange(s.divisions, LIMITS.divisions), 'number_line: divisions must be 1 to 12');
      need((s.to - s.from) * s.divisions <= 48, 'number_line: too many ticks');
      out.from = s.from; out.to = s.to; out.divisions = s.divisions;
      const onLine = (v) => typeof v === 'number' && Number.isFinite(v) && v >= s.from && v <= s.to;
      const marks = s.marks ?? [];
      need(Array.isArray(marks) && marks.length <= LIMITS.marks, 'number_line: at most 8 marks');
      out.marks = marks.map((m) => {
        need(m && typeof m === 'object', 'mark: not an object');
        for (const k of Object.keys(m)) need(['value', 'label', 'style'].includes(k), `mark: extra field ${k.slice(0, 20)}`);
        need(onLine(m.value), 'mark: value off the line');
        return { value: m.value, label: m.label == null ? '' : str(m.label, LIMITS.label, 'mark label', notes), style: m.style === 'arrow' ? 'arrow' : (m.style == null || m.style === 'dot' ? 'dot' : bad('mark: style must be dot or arrow')) };
      });
      const jumps = s.jumps ?? [];
      need(Array.isArray(jumps) && jumps.length <= LIMITS.jumps, 'number_line: at most 4 jumps');
      out.jumps = jumps.map((j) => {
        need(j && typeof j === 'object', 'jump: not an object');
        for (const k of Object.keys(j)) need(['from', 'to'].includes(k), `jump: extra field ${k.slice(0, 20)}`);
        need(onLine(j.from) && onLine(j.to) && j.from !== j.to, 'jump: off the line');
        return { from: j.from, to: j.to };
      });
      out.slot = optEnum('slot', SLOTS);
      break;
    }
    case 'shape':
      out.id = newId(); out.kind = optEnum('kind', SHAPE_KINDS);
      // A whole (one part) is a shape too: "here is one chapati" (12 Nov 2026, run 2: 11 shapes dropped for parts 1).
      need(isInt(s.parts) && inRange(s.parts, LIMITS.shape_parts), 'shape: parts must be 1 to 12');
      out.parts = s.parts; out.shaded = shadedOf(s.shaded, s.parts);
      out.label = optBool('label', true); out.slot = optEnum('slot', SLOTS); out.colour = optEnum('colour', COLOURS, 'orange');
      break;
    case 'plot_points': {
      out.id = newId();
      const axis = (a, n) => {
        need(a && typeof a === 'object', `${n}: not an object`);
        for (const k of Object.keys(a)) need(['from', 'to', 'name'].includes(k), `${n}: extra field ${k.slice(0, 20)}`);
        need(isInt(a.from) && isInt(a.to) && a.from < a.to && a.to - a.from <= LIMITS.axis_steps && Math.abs(a.from) <= 100 && Math.abs(a.to) <= 100, `${n}: at most 20 whole steps`);
        return { from: a.from, to: a.to, name: a.name == null ? '' : str(a.name, LIMITS.axis_name, `${n} name`, notes) };
      };
      out.x_axis = axis(s.x_axis, 'x_axis'); out.y_axis = axis(s.y_axis, 'y_axis');
      need(Array.isArray(s.points) && s.points.length >= 1 && s.points.length <= LIMITS.points, 'plot_points: 1 to 12 points');
      out.points = s.points.map((p) => {
        need(p && typeof p === 'object', 'point: not an object');
        for (const k of Object.keys(p)) need(['x', 'y', 'label'].includes(k), `point: extra field ${k.slice(0, 20)}`);
        need(inRange(p.x, [out.x_axis.from, out.x_axis.to]) && inRange(p.y, [out.y_axis.from, out.y_axis.to]), 'point: off the axes');
        return { x: p.x, y: p.y, label: p.label == null ? '' : str(p.label, LIMITS.label, 'point label', notes) };
      });
      out.connect = optBool('connect', false); out.slot = optEnum('slot', SLOTS);
      break;
    }
    case 'figure': {
      // The figure's own rules, whole: type, settings, what the child may do, the goal. Never repaired.
      out.id = newId();
      const r = validateFigure({ type: s.type, params: s.params, controls: s.controls, goal: s.goal });
      need(r.ok, `figure: ${r.ok ? '' : r.error}`);
      Object.assign(out, r.figure);
      out.slot = optEnum('slot', SLOTS); out.colour = optEnum('colour', COLOURS, 'blue');
      break;
    }
    case 'highlight': case 'point': {
      out.target = target(s.target);
      const item = ctx.items.get(out.target);
      if (s.bar !== undefined && s.bar !== null) {
        need(s.bar === 1 || (s.bar === 2 && (item?.second_bar || (item?.cmd === 'figure' && item.params?.second))), `${cmd}: bar must be 1, or 2 on a bar with a second bar`);
        out.bar = s.bar;
      }
      if (s.part !== undefined && s.part !== null) {
        const n = partsOf(item, out.bar);
        need(n > 0, `${cmd}: ${out.target} has no parts`);
        need(isInt(s.part) && s.part >= 1 && s.part <= n, `${cmd}: part out of range`);
        out.part = s.part;
      }
      if (cmd === 'highlight') out.style = optEnum('style', HIGHLIGHT_STYLES, 'circle');
      break;
    }
    case 'underline': {
      out.target = target(s.target);
      const item = ctx.items.get(out.target);
      need(item && (item.cmd === 'write_text' || item.cmd === 'write_math'), 'underline: only text or maths can be underlined');
      if (s.range !== undefined && s.range !== null) {
        const len = (item.text || item.expr || '').length;
        need(Array.isArray(s.range) && s.range.length === 2 && s.range.every(isInt) && s.range[0] >= 0 && s.range[0] < s.range[1] && s.range[1] <= len, 'underline: range out of bounds');
        out.range = [...s.range];
      }
      break;
    }
    case 'erase':
      need(Array.isArray(s.targets) && s.targets.length >= 1 && s.targets.length <= LIMITS.targets, 'erase: 1 to 8 targets');
      out.targets = [...new Set(s.targets.map(target))];
      break;
    case 'clear':
      // Tutor ink only. The child's ink has no id here and no command reaches it.
      need(s.scope === undefined || s.scope === null || s.scope === 'tutor', 'clear: scope can only be tutor');
      out.scope = 'tutor';
      break;
    case 'ask': {
      need(typeof s.id === 'string' && ID_RE.test(s.id), 'ask: bad id');
      out.id = s.id;
      out.prompt = str(s.prompt, LIMITS.ask_prompt, 'ask prompt', notes);
      out.form = optEnum('form', ASK_FORMS);
      // A choice question with too few or too many choices but its answer given is asked as a word answer: the seal
      // still knows the answer (12 Nov 2026, run 2: a question lost for "a choice needs 2 to 4 choices").
      if (out.form === 'choice' && !(Array.isArray(s.choices) && s.choices.length >= 2 && s.choices.length <= LIMITS.choices) && s.expected != null && String(s.expected).trim()) {
        out.form = readsAsNumber(s.expected) ? (/\//.test(String(s.expected)) ? 'fraction' : 'number') : 'word';
        notes.push(`ask: a choice with ${Array.isArray(s.choices) ? s.choices.length : 'no'} choices asked as ${out.form}`);
      }
      if (out.form === 'choice') {
        need(Array.isArray(s.choices) && s.choices.length >= 2 && s.choices.length <= LIMITS.choices, 'ask: a choice needs 2 to 4 choices');
        out.choices = s.choices.map((c) => str(c, LIMITS.choice, 'choice', notes));
      } else if (s.choices != null && s.form !== 'choice') bad('ask: choices only on a choice question');
      if (s.bank !== undefined && s.bank !== null) {
        need(typeof s.bank === 'string' && /^p[0-9]{1,2}$/.test(s.bank), 'ask: bad bank id');
        out.bank = s.bank;
      }
      // The hidden half. Kept on the server, sealed, never sent to the browser.
      if (s.expected !== undefined && s.expected !== null) out.expected = str(String(s.expected), LIMITS.expected, 'expected', notes);
      // The browser checks the public half (the server sealed the answer away).
      if (out.form !== 'draw' && !ctx.publicAsk) need(out.expected || out.bank, 'ask: expected answer missing');
      if (out.form === 'choice' && out.expected) need(out.choices.some((c) => c.toLowerCase() === out.expected.toLowerCase()), 'ask: the expected answer is not one of the choices');
      if (s.accepts != null) {
        // More ways of saying the answer only help the marking: the first LIMITS.accepts are kept (12 Nov 2026, run 2).
        need(Array.isArray(s.accepts), 'ask: accepts is not a list');
        if (s.accepts.length > LIMITS.accepts) notes.push(`ask: ${s.accepts.length} accepts, the first ${LIMITS.accepts} kept`);
        out.accepts = s.accepts.slice(0, LIMITS.accepts).map((a) => str(String(a), LIMITS.expected, 'accepts', notes));
      }
      if (s.wrong != null) {
        need(Array.isArray(s.wrong), 'ask: wrong is not a list');
        if (s.wrong.length > LIMITS.wrong) notes.push(`ask: ${s.wrong.length} wrong answers, the first ${LIMITS.wrong} kept`);
        out.wrong = s.wrong.slice(0, LIMITS.wrong).map((w) => {
          need(w && typeof w === 'object', 'wrong: not an object');
          for (const k of Object.keys(w)) need(['answer', 'misconception'].includes(k), `wrong: extra field ${k.slice(0, 20)}`);
          const mis = misOf(w.misconception, ctx, 'wrong');
          return { answer: str(String(w.answer), LIMITS.expected, 'wrong answer', notes), misconception: mis };
        });
      }
      if (s.skill != null) out.skill = skillOf(s.skill, ctx);
      break;
    }
    case 'set_phase':
      out.phase = optEnum('phase', PHASES);
      break;
    case 'record_diagnosis':
      out.skill = skillOf(s.skill, ctx);
      out.misconception = misOf(s.misconception, ctx, 'record_diagnosis', out.skill);
      out.confidence = optEnum('confidence', CONFIDENCE);
      out.evidence = clip(s.evidence, LIMITS.evidence, 'evidence', notes);
      out.next = optEnum('next', NEXT);
      // The picture of the child's work this diagnosis rests on (milestone 2): one the
      // page really took this session (ctx.snapshots is how many), never one made up.
      if (s.snapshot !== undefined && s.snapshot !== null) {
        need(typeof s.snapshot === 'string' && /^snap-[0-9]{1,3}$/.test(s.snapshot), 'record_diagnosis: bad snapshot id');
        need(Number(s.snapshot.slice(5)) >= 1 && Number(s.snapshot.slice(5)) <= (ctx.snapshots || 0), `record_diagnosis: no picture ${s.snapshot} was taken`);
        out.snapshot = s.snapshot;
      }
      break;
    case 'note_interest':
      out.interest = interestOf(s.interest);
      break;
    case 'note_what_helped':
      out.move = optEnum('move', MOVES);
      need(typeof s.helped === 'boolean', 'note_what_helped: helped must be true or false');
      out.helped = s.helped;
      break;
    case 'pause_for_child':
      out.expect = optEnum('expect', EXPECTS);
      need(isInt(s.max_wait_s) && inRange(s.max_wait_s, LIMITS.wait), 'pause_for_child: max_wait_s must be 5 to 60');
      out.max_wait_s = s.max_wait_s;
      // What the child is now doing; left out, validateTurn reads it from the turn (doingOf).
      if (s.doing != null) out.doing = optEnum('doing', DOINGS);
      break;
    case 'assess':
      // The tutor's judgement of the child's answer: silent, never sent to the child (tutorTurn.js keeps it).
      out.class = optEnum('class', ANSWER_CLASSES);
      if (out.class === 'misconception') {
        need(s.misconception != null, 'assess: a misconception needs its code');
        out.misconception = misOf(s.misconception, ctx, 'assess');
      } else need(s.misconception == null, 'assess: a misconception code only with class misconception');
      out.evidence = clip(s.evidence, LIMITS.assess, 'assess evidence', notes);
      if (s.ask != null) { need(typeof s.ask === 'string' && ID_RE.test(s.ask), 'assess: bad ask id'); out.ask = s.ask; }
      break;
    case 'end_session':
      // A long summary is cut, never the end of the lesson (12 Nov 2026, run 2: 12 end_session steps were dropped for
      // "longer than 300" and the lesson never ended).
      out.summary = clip(s.summary, LIMITS.summary, 'summary', notes);
      break;
    default: bad('unknown command');
  }
  return out;
}

/**
 * An interest the child mentioned: one or two plain words (football, chapati, a pet),
 * lowercase letters only, never a number, a name or a personal detail. The server also drops a
 * word that is the child's own name. Shared by the tutor's command and the profile (src/learner/profile.js).
 */
export const INTEREST_RE = /^[a-z]{2,16}( [a-z]{2,16})?$/;
const NOT_AN_INTEREST = /^(school|home|house|mum|mom|dad|mother|father|teacher|name|phone|address|password|nairobi|mombasa|kisumu|nakuru|kibera|kenya|yes|no|nothing|maths|math|fractions|fraction|it|that|this|none|secret|sex|kill|die)$/;
export const interestOf = (v) => {
  need(typeof v === 'string', 'interest: not text');
  const t = cleanText(v).text.toLowerCase().trim();
  need(t.length > 0 && t.length <= LIMITS.interest, `interest: 1 to ${LIMITS.interest} characters`);
  need(INTEREST_RE.test(t), 'interest: one or two plain words, letters only');
  need(!t.split(' ').some((w) => NOT_AN_INTEREST.test(w)), 'interest: not a hobby or favourite thing');
  return t;
};

const skillOf = (v, ctx) => {
  need(typeof v === 'string', 'skill: not text');
  need(!ctx.skills || ctx.skills.has(v), `skill ${v.slice(0, 60)} is not a lesson skill`);
  return v;
};
// A misconception must be on the library's list for the lesson's skills, or "other".
const misOf = (v, ctx, where, skill = null) => {
  need(typeof v === 'string', `${where}: misconception not text`);
  if (v === 'other') return v;
  const list = ctx.allowedMis;
  if (!list) return v;
  need(list.has(v), `${where}: misconception ${v.slice(0, 80)} is not on the allowed list`);
  if (skill) need(v.startsWith(`${skill}.`), `${where}: misconception ${v.slice(0, 80)} is not one of ${skill}'s`);
  return v;
};

/** How many parts an item has, for highlight/point `part`. */
export const partsOf = (item, bar) => {
  if (!item) return 0;
  if (item.cmd === 'fraction_bar') return bar === 2 ? (item.second_bar?.parts || 0) : item.parts;
  if (item.cmd === 'shape') return item.parts;
  if (item.cmd === 'number_line') return (item.marks || []).length;
  if (item.cmd === 'plot_points') return (item.points || []).length;
  if (item.cmd === 'figure') return figureParts(item, bar);
  return 0;
};

// ---------------------------------------------------------------- slots
/**
 * Where an item goes: the slot asked for if free, else the first free slot of
 * the same width in reading order, else any free half. null when full.
 * `used` is a Set of cells (top_left, ...) already taken.
 */
export const resolveSlot = (used, wanted, soft = null) => {
  // `soft`: cells where the child has written. Kept clear while any other cell
  // is free, so the tutor never draws over the child's work if it can help it.
  if (soft && soft.size) {
    const both = new Set([...used, ...soft]);
    const s = resolveSlot(both, wanted);
    if (s) return s;
  }
  const free = (slot) => cellsOf(slot).every((c) => !used.has(c));
  if (free(wanted)) return wanted;
  const full = ROWS.includes(wanted);
  const same = full ? ROWS : SLOTS.filter((x) => !ROWS.includes(x));
  for (const x of same) if (free(x)) return x;
  if (full) for (const x of SLOTS.filter((y) => !ROWS.includes(y))) if (free(x)) return x;
  return null;
};

// ---------------------------------------------------------------- one turn
/**
 * Check a whole turn. `board` is what is on the board now: [{ id, cmd, slot,
 * ...fields }] (tutor items only). Steps are checked in order against the
 * board as the turn would leave it, so an id must exist before it is pointed
 * at, a slot must be free, and the board never holds more than 30 items.
 *
 * `inkCells`: cells where the child has written (tutor items avoid them when they can).
 * `snapshots`: how many pictures of the child's work this session has taken.
 * `publicAsk`: the browser's check, where an ask has no hidden answer (it is
 * sealed on the server) and `seal` is not a command field.
 * Returns { steps, dropped: [{ index, cmd, reason }], notes }.
 */
export function validateTurn(raw, { board = [], allowedMis = null, skills = null, publicAsk = false, snapshots = 0, inkCells = [] } = {}) {
  const dropped = [];
  const notes = [];
  const list = Array.isArray(raw?.steps) ? raw.steps : null;
  if (!list) return { steps: [], dropped: [{ index: -1, cmd: null, reason: 'the turn has no list of steps' }], notes };
  const items = new Map(board.map((b) => [b.id, b]));
  const used = new Set(board.flatMap((b) => (b.slot ? cellsOf(b.slot) : [])));
  const ctx = { ids: new Set(items.keys()), items, allowedMis: allowedMis ? new Set(allowedMis) : null, skills: skills ? new Set(skills) : null, publicAsk, snapshots };
  const soft = new Set((Array.isArray(inkCells) ? inkCells : []).filter((c) => SLOTS.includes(c) && !ROWS.includes(c)));
  const steps = [];
  const touched = new Set(); // ids this turn drew or pointed at: never erased to make room
  let closed = false;
  // Room for a new drawing on a full board: the items holding the wanted slot first (if this turn has not used
  // them), then the oldest. Returns the ids erased, or null if no room can be made.
  const makeRoom = (wanted) => {
    const free = () => items.size < MAX_BOARD_ITEMS && resolveSlot(used, wanted, soft);
    const gone = [];
    const drop = (id) => { const it = items.get(id); if (it?.slot) for (const c of cellsOf(it.slot)) used.delete(c); items.delete(id); ctx.ids.delete(id); gone.push(id); };
    const want = new Set(cellsOf(wanted));
    const holders = [...items.values()].filter((it) => it.slot && cellsOf(it.slot).some((c) => want.has(c)));
    if (holders.length && holders.every((it) => !touched.has(it.id))) for (const it of holders) drop(it.id);
    for (const it of [...items.values()]) { if (free()) break; if (!touched.has(it.id)) drop(it.id); }
    return free() ? gone : null;
  };
  list.forEach((s, index) => {
    const cmd = s && typeof s === 'object' ? String(s.cmd ?? '').slice(0, 30) : null;
    if (index >= MAX_STEPS) { dropped.push({ index, cmd, reason: `more than ${MAX_STEPS} steps` }); return; }
    if (closed) { dropped.push({ index, cmd, reason: 'after the turn was handed to the child' }); return; }
    try {
      const out = checkStep(s, ctx, notes);
      if (DRAWN.includes(out.cmd)) {
        let slot = items.size < MAX_BOARD_ITEMS ? resolveSlot(used, out.slot, soft) : null;
        if (!slot) {
          const keep = { items: new Map(items), used: new Set(used), ids: new Set(ctx.ids) };
          const gone = makeRoom(out.slot);
          if (!gone) {
            items.clear(); for (const [k, v] of keep.items) items.set(k, v);
            used.clear(); for (const c of keep.used) used.add(c);
            ctx.ids.clear(); for (const k of keep.ids) ctx.ids.add(k);
            bad('no free slot on the board: everything on it is in use this turn; erase or clear first');
          }
          slot = resolveSlot(used, out.slot, soft);
          if (gone.length) {
            steps.push({ cmd: 'erase', targets: gone, ...(out.on ? { on: out.on } : {}), ...(out.delay_ms != null ? { delay_ms: out.delay_ms } : {}) });
            notes.push(`${out.id}: the board was full, so ${gone.join(', ')} ${gone.length === 1 ? 'was' : 'were'} erased to make room`);
          }
        }
        if (slot !== out.slot) notes.push(`${out.id}: moved from ${out.slot} to ${slot}`);
        out.slot = slot;
        for (const c of cellsOf(slot)) used.add(c);
        items.set(out.id, out); ctx.ids.add(out.id); touched.add(out.id);
      }
      if (MARKS.includes(out.cmd)) touched.add(out.target);
      if (out.cmd === 'erase') for (const t of out.targets) { const it = items.get(t); if (it?.slot) for (const c of cellsOf(it.slot)) used.delete(c); items.delete(t); ctx.ids.delete(t); }
      if (out.cmd === 'clear') { items.clear(); used.clear(); ctx.ids.clear(); }
      if (out.cmd === 'ask' && steps.some((x) => x.cmd === 'ask')) bad('one question a turn');
      if (out.cmd === 'assess' && steps.some((x) => x.cmd === 'assess')) bad('one assessment a turn');
      if (out.cmd === 'pause_for_child' && !out.doing) { out.doing = doingOf(steps); notes.push(`pause_for_child: doing not given, read as ${out.doing}`); }
      if (out.cmd === 'pause_for_child' || out.cmd === 'end_session') closed = true;
      steps.push(out);
    } catch (e) {
      if (!(e instanceof Bad)) throw e;
      dropped.push({ index, cmd, reason: e.message });
    }
  });
  return { steps, dropped, notes };
}

// ---------------------------------------------------------------- the board, in words
const shadedText = (shaded, parts) => {
  const n = Array.isArray(shaded) ? shaded.length : Number(shaded) || 0;
  if (!n) return 'none shaded';
  if (Array.isArray(shaded)) return `${n} shaded (part${n === 1 ? '' : 's'} ${shaded.join(', ')})`;
  return n === parts ? 'all shaded' : `${n} shaded`;
};
/** What one board item really shows, for the tutor's context (12 Nov 2026: it asked about shaded parts when none were shaded). */
export function describeItem(b) {
  const at = b.slot ? ` at ${b.slot}` : '';
  switch (b.cmd) {
    case 'write_text': return `${b.id}: the words "${b.text}"${at}`;
    case 'write_math': return `${b.id}: the maths ${b.expr}${at}`;
    case 'fraction_bar': return `${b.id}: a bar${at}, ${b.parts} equal part${b.parts === 1 ? '' : 's'}, ${shadedText(b.shaded, b.parts)}${b.second_bar ? `; under it a second bar, ${b.second_bar.parts} parts, ${shadedText(b.second_bar.shaded, b.second_bar.parts)}` : ''}`;
    case 'shape': return `${b.id}: a ${b.kind || 'shape'}${at}, ${b.parts} equal parts, ${shadedText(b.shaded, b.parts)}`;
    case 'number_line': return `${b.id}: a number line${at} from ${b.from} to ${b.to}, ${b.divisions} step${b.divisions === 1 ? '' : 's'} to each whole${(b.marks || []).length ? `, marks at ${b.marks.map((m) => m.label || m.value).join(', ')}` : ''}`;
    case 'plot_points': return `${b.id}: a graph${at} with ${(b.points || []).length} points`;
    case 'figure': {
      const p = b.params || {};
      const ctl = b.controls?.length ? ` (the child may: ${b.controls.join(', ')})` : '';
      if (b.type === 'fraction') {
        const n = p.shape === 'grid' ? (p.rows || 0) * (p.cols || 0) : p.parts;
        const sec = p.second ? `; a second ${p.shape || 'bar'} beside it, ${p.second.parts ?? (p.second.rows || 0) * (p.second.cols || 0)} parts, ${shadedText(p.second.shaded, p.second.parts)}` : '';
        return `${b.id}: a fraction ${p.shape || 'bar'}${at}, ${n} equal parts, ${shadedText(p.shaded, n)}${sec}${ctl}`;
      }
      if (b.type === 'numberline') return `${b.id}: a number line${at} from ${p.from} to ${p.to}, ${p.divisions} steps${p.marker != null ? `, marker at ${p.marker}` : ''}${ctl}`;
      return `${b.id}: a ${b.type} figure${at}${ctl}`;
    }
    default: return `${b.id}: ${b.cmd}${at}`;
  }
}
/** The slots nothing is in yet: a whole row by its name when both halves are free, else the free half. */
export function freeSlots(board = [], inkCells = []) {
  const used = new Set(board.flatMap((b) => (b.slot ? cellsOf(b.slot) : [])));
  const ink = new Set(inkCells);
  const out = [];
  for (const r of ROWS) {
    const halves = cellsOf(r).filter((c) => !used.has(c) && !ink.has(c));
    if (halves.length === 2) out.push(r); else out.push(...halves);
  }
  return out;
}
/** The board for the tutor's context: what each item shows, the child's writing, and the free slots. */
export function boardLines(board = [], inkCells = []) {
  const ink = (Array.isArray(inkCells) ? inkCells : []).filter((c) => SLOTS.includes(c));
  const free = freeSlots(board, ink);
  return [
    `Board now (what the child sees): ${board.length ? board.map(describeItem).join('; ') : 'empty'}.`,
    ...(ink.length ? [`The child has written in: ${ink.join(', ')} (keep clear).`] : []),
    free.length ? `Free slots: ${free.join(', ')}.` : 'Free slots: none. A new drawing erases the oldest items you have not used this turn (whatever is in the slot you ask for first); erase or clear first to choose.',
  ];
}

/**
 * What the child is doing after a turn that did not say: a figure they may handle, or a question to draw, is a task;
 * a question (an ask, or a sentence ending in a question mark) is answering; anything else is talk.
 */
export function doingOf(steps = []) {
  if (steps.some((x) => (x.cmd === 'figure' && x.controls?.length) || (x.cmd === 'ask' && x.form === 'draw'))) return 'task';
  if (steps.some((x) => x.cmd === 'ask')) return 'answer';
  const says = steps.filter((x) => x.cmd === 'say');
  return says.length && /\?\s*$/.test(says[says.length - 1].text) ? 'answer' : 'talk';
}

/**
 * A turn is usable when it says something and hands back to the child (or ends).
 * `maxWords`: the most the tutor may say in one turn (the server uses MAX_SPOKEN_WORDS).
 * `nod`: after a picture taken because the child paused, the tutor may only nod
 * (a turn that is just pause_for_child) and let them carry on.
 */
export const MAX_SPOKEN_WORDS = 30;   // a turn is short: say a little, then wait for the child (owner, 11 Nov; 12 Nov: "verbal slop and a lot of it"; 45 -> 30 on 12 Nov after the yardstick: the child spoke 23-26% of the words)
export const LATE_SPOKEN_WORDS = 25;  // after tutor turn 10 the turns get no longer (habits rose from 37-39% of turns 1-10 to 50-59% of turns 11-20)
export const LATE_AFTER_TUTOR_TURN = 10;
/** The word limit of one normal turn: 30, and 25 after tutor turn 10 (turnIndex counts from 0, so turn 11 is index 10). */
export const wordCap = (turnIndex = 0) => (Number(turnIndex) >= LATE_AFTER_TUTOR_TURN ? LATE_SPOKEN_WORDS : MAX_SPOKEN_WORDS);
export const spokenWords = (steps) => steps.filter((s) => s.cmd === 'say').reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0);
export const turnProblems = (steps, { nod = false, maxWords = null } = {}) => {
  const out = [];
  if (maxWords && spokenWords(steps) > maxWords) out.push(`the turn says ${spokenWords(steps)} words: say at most ${maxWords}, then wait for the child`);
  const isNod = nod && steps.length >= 1 && steps.every((s) => s.cmd === 'pause_for_child' || SILENT.includes(s.cmd));
  if (!isNod && !steps.some((s) => s.cmd === 'say')) out.push('the turn says nothing');
  const last = steps[steps.length - 1];
  if (!last || !['pause_for_child', 'end_session'].includes(last.cmd)) out.push('the turn does not end with pause_for_child or end_session');
  return out;
};

// ---------------------------------------------------------------- the schema the model fills
// Structured outputs: the API guarantees this shape (types, enums, required
// fields). Ranges and lengths are not expressible there; validateTurn holds them.
const S = (props, required) => ({ type: 'object', properties: props, required, additionalProperties: false });
const T = { type: 'string' };
const I = { type: 'integer' };
const N = { type: 'number' };
const B = { type: 'boolean' };
const E = (list) => ({ type: 'string', enum: list });
const timing = { on: T, delay_ms: I };
const drawn = { ...timing, pace: E(PACES) };
const shadedSchema = { anyOf: [I, { type: 'array', items: I }] };
const C = (cmd, props, required) => S({ cmd: { type: 'string', const: cmd }, ...props }, ['cmd', ...required]);
export const STEP_SCHEMAS = [
  C('say', { text: T, move: T }, ['text']),
  C('write_text', { id: T, text: T, slot: E(SLOTS), size: E(SIZES), colour: E(COLOURS), ...drawn }, ['id', 'text', 'slot']),
  C('write_math', { id: T, expr: T, slot: E(SLOTS), size: E(SIZES), colour: E(COLOURS), ...drawn }, ['id', 'expr', 'slot']),
  C('fraction_bar', { id: T, parts: I, shaded: shadedSchema, second_bar: S({ parts: I, shaded: shadedSchema }, ['parts', 'shaded']), label: B, slot: E(SLOTS), colour: E(COLOURS), ...drawn }, ['id', 'parts', 'shaded', 'slot']),
  C('number_line', { id: T, from: I, to: I, divisions: I, marks: { type: 'array', items: S({ value: N, label: T, style: E(['dot', 'arrow']) }, ['value']) }, jumps: { type: 'array', items: S({ from: N, to: N }, ['from', 'to']) }, slot: E(SLOTS), ...drawn }, ['id', 'from', 'to', 'divisions', 'slot']),
  C('shape', { id: T, kind: E(SHAPE_KINDS), parts: I, shaded: shadedSchema, label: B, slot: E(SLOTS), colour: E(COLOURS), ...drawn }, ['id', 'kind', 'parts', 'shaded', 'slot']),
  C('plot_points', { id: T, x_axis: S({ from: I, to: I, name: T }, ['from', 'to']), y_axis: S({ from: I, to: I, name: T }, ['from', 'to']), points: { type: 'array', items: S({ x: N, y: N, label: T }, ['x', 'y']) }, connect: B, slot: E(SLOTS), ...drawn }, ['id', 'x_axis', 'y_axis', 'points', 'slot']),
  // params and goal are JSON text (each figure type has its own settings; validateTurn checks them against figures.js).
  C('figure', { id: T, type: E(FIGURE_TYPES), params: T, controls: { type: 'array', items: E(FIGURE_CONTROLS) }, goal: T, slot: E(SLOTS), colour: E(COLOURS), ...drawn }, ['id', 'type', 'params', 'slot']),
  C('highlight', { target: T, part: I, bar: I, style: E(HIGHLIGHT_STYLES), ...timing }, ['target']),
  C('underline', { target: T, range: { type: 'array', items: I }, ...timing }, ['target']),
  C('point', { target: T, part: I, bar: I, ...timing }, ['target']),
  C('erase', { targets: { type: 'array', items: T }, ...timing }, ['targets']),
  C('clear', { scope: E(['tutor']), ...timing }, []),
  C('ask', { id: T, prompt: T, form: E(ASK_FORMS), choices: { type: 'array', items: T }, expected: T, accepts: { type: 'array', items: T }, wrong: { type: 'array', items: S({ answer: T, misconception: T }, ['answer', 'misconception']) }, skill: T, bank: T }, ['id', 'prompt', 'form']),
  C('set_phase', { phase: E(PHASES) }, ['phase']),
  C('record_diagnosis', { skill: T, misconception: T, confidence: E(CONFIDENCE), evidence: T, next: E(NEXT), snapshot: T }, ['skill', 'misconception', 'confidence', 'evidence', 'next']),
  C('note_interest', { interest: T }, ['interest']),
  C('note_what_helped', { move: E(MOVES), helped: B }, ['move', 'helped']),
  C('assess', { class: E(ANSWER_CLASSES), misconception: T, evidence: T, ask: T }, ['class', 'evidence']),
  C('pause_for_child', { expect: E(EXPECTS), max_wait_s: I, doing: E(DOINGS) }, ['expect', 'max_wait_s']),
  C('end_session', { summary: T }, ['summary']),
];
export const TURN_SCHEMA = S({ steps: { type: 'array', items: { anyOf: STEP_SCHEMAS } } }, ['steps']);

export default { validateTurn, turnProblems, resolveSlot, repairStep, boardLines, describeItem, freeSlots, cleanText, partsOf, TURN_SCHEMA, COMMANDS, LIMITS };
