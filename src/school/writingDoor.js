// ============================================================================
// SCHOOL WRITING, the door action `mark_writing` (12 Nov 2026, package P12).
//
// A teacher in Tuta sets a composition (English) or an insha (Kiswahili), the learners write it, and the TEACHER marks it with the
// KICD writing rubric. This action is the optional second pair of eyes: Tuta asks for a SUGGESTED mark for one piece, and shows it
// beside the teacher's own grid. The teacher decides; HOREB stores nothing.
//
//   POST school-practice (signed like every door call, see schoolDoor.js)
//   { action: "mark_writing", learner_ref, language: "en"|"sw", grade: 4..12, type?, prompt, title?, text }
//   -> { success: true, mock, model, suggestion: { off_task, total, level, bands: { content|organisation|language|mechanics:
//          { mark, level, note } }, strengths, next_step, summary }, attention?: { tier, categories } }
//
// What must hold:
//   MOCK unless the function was told to go live (deps.marker); the answer then says `mock: true` and every note starts "MOCK"
//   no name, phone or admission number crosses: only the learner's made-up reference, which is checked and never echoed into the text
//   the piece is screened for safeguarding BEFORE any marker is asked, on the deterministic rules (src/ai/safeguarding.js); a hit
//     comes back as `attention` ({ tier, categories }, no excerpt) so the teacher reads that piece first; nothing is stored here
//   the learner's text is only something to mark: the live prompt tells the marker not to follow it (compositionMarker.js)
//   a marker that is busy, or gives no marks, is an error for the teacher to see, never a made-up mark (and still carries `attention`)
//
// Pure: the marker is passed in (deps.marker(request) -> the tool call's input, or throws), so the edge function and the tests run
// the same code. With no deps.marker the action is the mock.
// ============================================================================
import { screen } from '../ai/safeguarding.js';
import { buildMarkRequest, cleanMark, MOCK_MARK, MIN_WORDS_SCHOOL, MAX_WORDS } from '../ai/compositionMarker.js';

const REF = /^[A-Z2-9]{8}$/;
const TYPES = ['narrative', 'descriptive', 'argumentative', 'letter', 'ending', 'proverb', 'own'];
const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error) => ({ status, body: { success: false, error } });

/** The `mark_writing` action. Returns null when the action is not this one. */
export async function doorMarkWriting(door, p, deps = {}) {
  if (p.action !== 'mark_writing') return null;
  if (!REF.test(String(p.learner_ref || ''))) return no(400, 'learner_ref');
  const language = p.language === 'sw' ? 'sw' : p.language === 'en' ? 'en' : null;
  if (!language) return no(400, 'language');
  const grade = Math.floor(Number(p.grade));
  if (!(grade >= 4 && grade <= 12)) return no(400, 'grade');
  const type = TYPES.includes(p.type) ? p.type : 'own';
  const prompt = String(p.prompt || '').trim().slice(0, 600);
  if (!prompt) return no(400, 'No task given');
  const text = String(p.text || '').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < MIN_WORDS_SCHOOL) return no(400, `At least ${MIN_WORDS_SCHOOL} words to mark`);
  if (words > MAX_WORDS) return no(400, `${MAX_WORDS} words at most`);

  // A child's words reach a person before they reach a model, and whatever the model says.
  const s = screen(text);
  const attention = s.tier !== 'none' ? { attention: { tier: s.tier, categories: s.categories } } : {};

  // A failed marking still tells the teacher to read this piece first: that is the part that matters.
  const fail = (error) => ({ status: 502, body: { success: false, error, ...attention } });
  if (typeof deps.marker !== 'function') {
    return ok({ mock: true, model: 'mock', suggestion: MOCK_MARK, ...attention });
  }
  let fb;
  try { fb = await deps.marker(buildMarkRequest({ model: deps.model, language, grade, type, prompt, title: String(p.title || '').slice(0, 120), text })); }
  catch { return fail('The marker is busy. Mark it yourself, or try again in a moment.'); }
  const suggestion = cleanMark(fb);
  if (!suggestion) return fail('The marker gave no marks. Mark it yourself, or try again.');
  return ok({ mock: false, model: String(deps.model || ''), suggestion, ...attention });
}
