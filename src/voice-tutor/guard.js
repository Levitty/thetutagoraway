// ============================================================================
// THE LIVE TUTOR'S GUARDS, the same pair as the Rocket guide's.
//
//   screenChild(text)    BEFORE the model: a child sharing personal details,
//                        or words trying to change the tutor's rules, never
//                        reach the model; an authored line answers instead.
//                        (Safeguarding, src/ai/safeguarding.js, runs before
//                        this on every message and flags for a person.)
//   checkTurnText(steps, hidden)   AFTER the model: every word the child would
//                        hear or see (say, write_text, write_math, the ask's
//                        prompt and choices) is checked against the hidden
//                        answers with src/ai/replyGuard.js leaksAnswer. A turn
//                        that gives the answer away is not shown.
//
// Names are scrubbed and the child's words fenced with the Rocket guide's own
// scrubNames / fenceTeamText (src/rocket/guard.js). Pure and offline.
// ============================================================================
import { leaksAnswer } from '../ai/replyGuard.js';
import { asksForAnswer } from '../rocket/guard.js';
import { parseMath, mathToText } from './mathExpr.js';
import { readAnswer, canonAnswer } from './spokenAnswer.js';

export { scrubNames, fenceTeamText } from '../rocket/guard.js';

export const MAX_CHILD_CHARS = 300;

const norm = (s) => String(s ?? '').toLowerCase().replace(/[’`´]/g, "'").replace(/[^a-z0-9'@.\s]+/g, ' ').replace(/\s+/g, ' ').trim();

const PERSONAL = /\b(my|our) (phone|phone number|number is|mobile|address|house is|home is|estate is|school is called|password|pin|mpesa pin|email)\b|\bi live (in|at|near)\b|\bmy (mum|mom|dad|mother|father)'?s? (phone|number|name is)\b|\b[\w.]+@[\w-]+\.\w+\b/;
const PHONE = /(?:\+?254|\b0)[\s-]?[17]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/;
const INJECTION = /\b(ignore|forget|disregard) (all |your |the |previous |these )*(rules|instructions|prompt|system)\b|\b(act as|pretend to be|pretend you are|from now on you are|you are now) (a |an |my )?(?!tutor\b|maths tutor\b)\w+|\bsystem prompt\b|\bdeveloper mode\b|\bjailbreak\b/;

export const PERSONAL_REPLY = 'Thank you. You do not need to tell me things like that, so let us keep them private. Let us go back to our fractions.';
export const RULES_REPLY = 'I am your maths tutor, and I keep to the same rules all the time. Let us carry on with our fractions.';
export const ANSWER_REPLY = 'I will not tell you the answer, because you can work it out. Let us take one small step together.';

/**
 * @returns {{ ok:boolean, kind:'personal'|'rules'|null, reply:string, wantsAnswer:boolean }}
 */
export function screenChild(raw) {
  const t = norm(raw);
  const wantsAnswer = asksForAnswer(raw) || /\b(what is|whats|what's|tell me) the answer\b/.test(t);
  if (PERSONAL.test(t) || PHONE.test(String(raw))) return { ok: false, kind: 'personal', reply: PERSONAL_REPLY, wantsAnswer };
  if (INJECTION.test(t)) return { ok: false, kind: 'rules', reply: RULES_REPLY, wantsAnswer };
  return { ok: true, kind: null, reply: '', wantsAnswer };
}

/** Every string the child would hear or see in a turn, with where it came from. */
export const visibleText = (steps) => steps.flatMap((s, i) => {
  if (s.cmd === 'say' || s.cmd === 'write_text') return [{ i, cmd: s.cmd, text: s.text }];
  if (s.cmd === 'write_math') { const p = parseMath(s.expr); return [{ i, cmd: s.cmd, text: p.ok ? mathToText(p.tree) : s.expr }]; }
  if (s.cmd === 'ask') return [{ i, cmd: s.cmd, text: s.prompt }];
  return [];
});

// A count said before the question that asks for it: "into four equal pieces. How many pieces are there now?"
// (12 Nov 2026: the shared guard skips one-character answers, so "4" was never caught.)
const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const NUM = `(?:\\d+|${NUM_WORDS.join('|')})`;
const HOW_MANY = /\bhow many\s+(?:(?:equal|small|smaller|big|bigger|little|more|shaded|white|coloured|colored|whole|new)\s+)*([a-z]+)/i;
const nounRe = (noun) => {
  const n = noun.toLowerCase();
  if (/^(half|halves)$/.test(n)) return 'half|halves';
  return `${n.replace(/s$/, '')}s?`;
};
const numValue = (w) => (/^\d+$/.test(w) ? Number(w) : NUM_WORDS.indexOf(w.toLowerCase()));
const sentencesOf = (t) => String(t || '').split(/(?<=[.!?])\s+/).filter(Boolean);

/**
 * A "how many <things>?" question whose count is said earlier in the same turn ("four equal pieces"). Counts the child
 * has already found (`found`, as digits) or said this turn (`child`) are theirs to hear back, not a leak.
 * `answers`: the sealed answers of the questions open now (the open one, and any asked in this turn), in any form
 * ("4", "four", "4 pieces"). Only a count equal to one of them is a give-away (12 Nov 2026, run 2: "twelve equal
 * pieces" stopped a question whose answer was 6, "two equal pieces" one whose answer was 4). With no sealed answers
 * nothing is. `answers: null` keeps the old reading (any count), for a caller that cannot know the answer.
 * @returns {string|null} the reason
 */
export function answerInQuestion(text, { found = [], child = '', answers = null } = {}) {
  const sealed = answers == null ? null : new Set(answers.map((a) => countOf(a)).filter((n) => n != null));
  if (sealed && !sealed.size) return null;
  const sents = sentencesOf(text);
  const theirs = new Set([...found.filter((f) => /^\d+$/.test(f)).map(Number), ...(String(child).toLowerCase().match(new RegExp(`\\b${NUM}\\b`, 'g')) || []).map(numValue)]);
  for (let i = 0; i < sents.length; i += 1) {
    if (!/\?\s*$/.test(sents[i])) continue;
    const m = HOW_MANY.exec(sents[i]);
    if (!m) continue;
    // A question with its own numbers ("How many halves are in two wholes?") asks for something worked out, not a count.
    if (new RegExp(`\\b${NUM}\\b`, 'i').test(sents[i].slice(m.index + m[0].length))) continue;
    const before = `${sents.slice(0, i).join(' ')} ${sents[i].slice(0, m.index)}`;
    const re = new RegExp(`\\b(${NUM})\\s+(?:[a-z]+\\s+){0,2}?(?:${nounRe(m[1])})\\b`, 'gi');
    for (const hit of before.matchAll(re)) {
      if (theirs.has(numValue(hit[1]))) continue;
      if (sealed && !sealed.has(numValue(hit[1]))) continue;
      return `"${hit[0]}" is said before "${sents[i].trim()}"`;
    }
  }
  return null;
}

/** A sealed answer as a whole count ("4", "four", "4 pieces"), or null (a fraction, a word answer). */
const countOf = (a) => {
  const t = String(a ?? '').trim().toLowerCase();
  const m = /^(\d+|[a-z]+)(\s+[a-z]+)?$/.exec(t);
  if (!m) return null;
  const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM_WORDS.indexOf(m[1]);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

/** A small whole-number answer (2 to 16) said as a count of the thing its question asks about ("four pieces" for "How many pieces?"). */
const smallCount = (h, text) => {
  const n = Number(String(h.answer).trim());
  if (!Number.isInteger(n) || n < 0 || n > 16) return null;
  const m = HOW_MANY.exec(String(h.question || ''));
  if (!m) return null;
  const re = new RegExp(`\\b(${n}|${NUM_WORDS[n]})\\s+(?:[a-z]+\\s+){0,2}?(?:${nounRe(m[1])})\\b`, 'i');
  const hit = re.exec(String(text || ''));
  return hit ? `says the count (${hit[0]})` : null;
};

/** A fraction answer said in words ("one half", "two quarters"; not a bare "half"), which the shared guard cannot see. */
const spokenFraction = (h, text, question) => {
  const want = canonAnswer(h.answer);
  if (!/^\d+\/\d+$/.test(want)) return null;
  if (readAnswer(question).found.some((f) => f.kind === 'fraction' && f.value === want)) return null;
  const hit = readAnswer(text).found.find((f) => f.kind === 'fraction' && f.value === want && !f.negated && f.words.split(' ').length >= 2);
  return hit ? `says the answer in words (${hit.words})` : null;
};

/**
 * `hidden` is [{ answer, accepts, question }]: the answers the child has not
 * found yet (the open question, and any asked in this turn). A question in the
 * turn that offers the answer as one of its choices ("more, less, or the same?")
 * is not a leak: the choices are the question.
 * @returns {{ ok:boolean, reasons:string[] }}
 */
export function checkTurnText(steps, hidden = []) {
  const reasons = [];
  const texts = visibleText(steps);
  const choices = texts.flatMap((v) => sentencesOf(v.text)).filter((x) => /\?\s*$/.test(x) && /\bor\b/i.test(x)).join(' ');
  for (const h of hidden) {
    if (!h || h.answer == null || String(h.answer).trim() === '') continue;
    for (const v of texts) {
      const question = `${h.question || ''} ${choices}`.trim();
      const why = leaksAnswer({ answer: String(h.answer), accepts: h.accepts || [], question, reply: v.text }) || smallCount(h, v.text) || spokenFraction(h, v.text, question);
      if (why) reasons.push(`step ${v.i} (${v.cmd}) ${why}`);
    }
  }
  return { ok: reasons.length === 0, reasons };
}


// ---------------------------------------------------------------------------
// WELFARE: what the shared safeguarding rules (src/ai/safeguarding.js) do not cover for a live
// conversation with a child: bullying, sexual content, wishes to hurt someone or a weapon,
// being in danger now, and more ways of saying "I do not want to live", in Kenyan English and
// Kiswahili. They run beside the shared rules on everything the child types (11 Nov 2026) and
// give the same answer shape: { tier, categories, hits }. They flag for a PERSON; they decide
// nothing about the child. The Kiswahili patterns need a native speaker's review, like the shared ones.
// ---------------------------------------------------------------------------
const CORROBORATE = /\bat night\b|\bprivate\b|\bsecret\b|\bwhen (we are|i am|i'm) alone\b|\bunder my\b|\bin my (bed|room)\b|\bi do ?n[o']?t like\b|\bit hurts\b|\bdo ?n[o']?t tell\b|\bscared\b|\bafraid\b|\bagain\b|\bevery (day|night)\b/;
export const WELFARE_RULES = [
  { id: 'wf_self_harm', tier: 'crisis', category: 'self-harm',
    any: /\blife is not worth (living|it)\b|\b(life|living) (is|has) no (meaning|point|worth)\b|\bi am tired of (living|life|this life)\b|\bi have nothing to live for\b|\bi wish i (was|were) (never born|dead)\b|\bi want to sleep forever\b|\bi want to (go away|disappear) and not come back\b|\bi have decided to end my life\b|\bi will end it (all )?(today|tonight)\b|\bi want to (drink|take) (the )?(poison|pills)\b/ },
  { id: 'wf_self_harm_sw', tier: 'crisis', category: 'self-harm',
    any: /\bnimechoka na maisha\b|\bmaisha hayana maana\b|\bnatamani nife\b|\bnataka nife\b|\bnaomba nife\b|\bsitaki kuishi tena\b|\bnitajinyonga\b|\bnataka kujinyonga\b|\bnitakunywa sumu\b/ },
  { id: 'wf_danger', tier: 'crisis', category: 'immediate-danger',
    any: /\bi am in danger\b|\bi am not safe\b|\bi do ?n[o']?t feel safe\b|\bsomeone is (following|chasing) me\b|\b(a|the) (man|stranger|boy|boys|men) (is|are) (following|chasing) me\b|\bsomeone is (hurting|beating) me (now|right now)\b|\bthere is a fire\b|\bthe house is (on fire|burning)\b|\bsomeone has broken into\b|\bi am locked (in|inside)\b|\bi was kidnapped\b|\bthey want to take me\b/ },
  { id: 'wf_danger_sw', tier: 'crisis', category: 'immediate-danger',
    any: /\bniko hatarini\b|\bsipo salama\b|\bkuna mtu ananifuata\b|\bnimefungiwa (ndani|chumbani)\b|\bnimetekwa\b|\bwanataka kunichukua\b/ },
  { id: 'wf_weapon', tier: 'crisis', category: 'violence',
    any: /\b(i|we) (have|got|will bring|am going to bring|brought|carry|am carrying) (a |the )?(knife|gun|panga|machete|razor|blade|weapon|pistol)s? (to|at|in|into|with) (school|class|me)\b|\bbring(ing)? (a )?(knife|gun|panga|machete|weapon) to school\b|\bi will (burn|set fire to) (the )?(school|dormitory|class)\b|\bi will (stab|shoot) (him|her|them|you|my \w+|the \w+)\b/ },
  { id: 'wf_weapon_sw', tier: 'crisis', category: 'violence',
    any: /\bnina (kisu|bunduki|panga) (shuleni|mfukoni|nami)\b|\bnitamdunga kisu\b|\bnitachoma (shule|bweni)\b|\bnitampiga risasi\b/ },
  { id: 'wf_violence', tier: 'concern', category: 'violence',
    any: /\bi (want|plan|wanna|am going|'?m going|will|shall) (to )?(kill|stab|shoot|hurt|harm|beat up) (him|her|them|someone|somebody|my \w+|that \w+|the \w+|you)\b/ },
  { id: 'wf_violence_sw', tier: 'concern', category: 'violence',
    any: /\bnataka kumuua\b|\bnitamuua\b|\bnitamuumiza\b/ },
  { id: 'wf_bullying', tier: 'concern', category: 'bullying',
    any: /\b(they|he|she|the (boys|girls|kids|class|older boys|older girls)) (bully|bullies|bullied|are bullying|is bullying) me\b|\bi am (being )?bullied\b|\bi (get|was|am always|am being) (bullied|teased|laughed at)\b|\bbullied (me )?(at|in) school\b|\bno ?body wants to (play|sit|be) with me\b|\bthey (call|are calling) me names\b|\bthey (laugh|laughed) at me (every ?day|all the time)\b|\bi am (scared|afraid) (to go|of going) to school\b|\b(older|big) (boys|girls|kids) (beat|hit|push|pushed|kick|kicked) me\b|\bthey are (troubling|harassing|disturbing) me\b|\bthey (took|steal|steals|stole) my (money|lunch|food) (every|always)\b/ },
  { id: 'wf_bullying_sw', tier: 'concern', category: 'bullying',
    any: /\bwananionea\b|\bananionea\b|\bninaonewa\b|\bwananidhulumu\b|\bwananicheka (kila siku|sana)\b|\bnaogopa kwenda shule\b|\bwananipiga shuleni\b/ },
  { id: 'wf_sexual', tier: 'concern', category: 'sexual-content',
    any: /\b(sex|sexy|porn\w*|nude|nudes|naked|erotic)\b|\bsend (me )?(nudes|naked)\b|\bshow me your (body|private)\b|\bkiss me\b|\bare you (naked|my girlfriend|my boyfriend)\b/ },
  { id: 'wf_sexual_sw', tier: 'concern', category: 'sexual-content',
    any: /\bngono\b|\bpicha za uchi\b|\buchi\b|\bkufanya mapenzi\b|\bkulala nawe\b/ },
  { id: 'wf_touch', tier: 'concern', category: 'sexual-abuse',
    any: /\b(uncle|aunt|teacher|neighbour|neighbor|cousin|driver|pastor|my (father|stepfather|step ?father|brother)|he|she|someone|a man|a boy) (touch|touches|touched|kisses|kissed) me\b|\bsomeone is touching me\b|\b(he|she) (comes|came) to my (bed|room)\b/, needs: CORROBORATE },
  { id: 'wf_touch2', tier: 'concern', category: 'sexual-abuse',
    any: /\bwants me to sleep with (him|her)\b|\bsleeps? with me\b|\b(he|she) comes to my bed at night\b/ },
  { id: 'wf_hurt', tier: 'concern', category: 'physical-abuse',
    any: /\bsomeone (hurts|hurt|is hurting|is beating) me\b|\b(he|she|they) (hurts|is hurting|are hurting) me\b|\bi am (afraid|scared) of (him|her|them|my (father|mother|uncle|aunt|teacher|stepfather|stepmother|brother))\b|\bhurting me at home\b/ },
  { id: 'wf_abuse_sw', tier: 'concern', category: 'sexual-abuse',
    any: /\bananigusa (usiku|vibaya|sehemu)\b|\banalala nami\b|\bananilazimisha\b|\bnilibakwa\b|\banataka nilale naye\b/ },
  { id: 'wf_hurt_sw', tier: 'concern', category: 'physical-abuse',
    any: /\bananiumiza\b|\bninamwogopa (baba|mama|mjomba|shangazi|mwalimu)\b|\bninaogopa baba\b/ },
];
const RANK = { none: 0, concern: 1, crisis: 2 };

/** The welfare rules on a child's words. @returns {{ tier:string, categories:string[], hits:object[] }} */
export function screenWelfare(raw) {
  const text = norm(raw);
  const hits = [];
  if (text) for (const r of WELFARE_RULES) {
    const m = r.any.exec(text);
    if (!m) continue;
    if (r.needs && !r.needs.test(text)) continue;
    hits.push({ id: r.id, tier: r.tier, category: r.category, excerpt: text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60) });
  }
  const tier = hits.reduce((t, h) => (RANK[h.tier] > RANK[t] ? h.tier : t), 'none');
  return { tier, categories: [...new Set(hits.map((h) => h.category))], hits };
}

/** The shared rules and the welfare rules together: one answer. `shared` is src/ai/safeguarding.js screen (or null). */
export function screenAll(raw, shared = null) {
  const a = shared ? shared(raw) : { tier: 'none', categories: [], hits: [] };
  const b = screenWelfare(raw);
  const hits = [...(a.hits || []), ...b.hits];
  const tier = RANK[a.tier] >= RANK[b.tier] ? a.tier : b.tier;
  return { tier, categories: [...new Set([...(a.categories || []), ...b.categories])], hits };
}

// What the child hears when a message needs a person. Care first, a trusted adult, Childline Kenya (116, free);
// never questions about the details, never the child's words repeated. A crisis ends the lesson;
// a concern pauses it, and the child decides whether to carry on.
const CHILDLINE = 'You can also call Childline Kenya on 116. It is free, from any phone.';
const CARE = {
  crisis: [
    'Thank you for telling me. I am glad you did, and I care about you.',
    'Please tell a grown-up you trust right now, like a parent, a teacher or a relative.',
    CHILDLINE,
    'Our lesson stops here. Please go and find a grown-up now.',
  ],
  'immediate-danger': [
    'Thank you for telling me. Your safety matters most.',
    'Please go to a grown-up you trust or to a safe place with other people, right now.',
    CHILDLINE,
    'Our lesson stops here. Please go and find a grown-up now.',
  ],
  bullying: [
    'I am sorry that is happening. Nobody should be treated that way, and it is not your fault.',
    'Please tell a teacher or a grown-up you trust. Childline Kenya on 116 will listen too, and it is free.',
    'Say when you want to carry on with our fractions. We can rest first.',
  ],
  'sexual-content': [
    'That is not something we talk about in our maths lesson.',
    'If anyone has made you feel uncomfortable, please tell a grown-up you trust, or call Childline Kenya on 116.',
    'We can carry on with our fractions when you are ready.',
  ],
  violence: [
    'It sounds like you feel very angry. It is okay to feel angry, but hurting people is never okay.',
    'Please talk to a grown-up you trust about how you feel. Childline Kenya on 116 will listen too, and it is free.',
    'We can rest now. Say when you want to carry on.',
  ],
  default: [
    'Thank you for telling me. You did the right thing, and it is not your fault.',
    'Please tell a grown-up you trust, like a teacher or a relative. You can also call Childline Kenya on 116, free.',
    'We can stop any time. Say when you want to carry on.',
  ],
};
const PRIORITY = ['self-harm', 'immediate-danger', 'violence', 'sexual-abuse', 'grooming', 'physical-abuse', 'physical-abuse-school', 'neglect', 'bullying', 'sexual-content'];

/**
 * The authored turn for a flagged message: { steps, ends, kind }. Steps are plain commands
 * (say, then pause_for_child, or end_session for a crisis).
 */
export function careTurn(hit) {
  const cats = hit?.categories || [];
  const top = PRIORITY.find((c) => cats.includes(c)) || cats[0] || null;
  const crisis = hit?.tier === 'crisis';
  const key = crisis ? (top === 'immediate-danger' ? 'immediate-danger' : 'crisis') : (CARE[top] ? top : 'default');
  const says = (CARE[key] || CARE.default).map((text) => ({ cmd: 'say', text }));
  const end = crisis ? { cmd: 'end_session', summary: 'The lesson stopped early.' } : { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 60 };
  return { steps: [...says, end], ends: crisis, kind: key };
}

export default { screenChild, screenWelfare, screenAll, careTurn, checkTurnText, answerInQuestion, visibleText, PERSONAL_REPLY, RULES_REPLY, ANSWER_REPLY };
