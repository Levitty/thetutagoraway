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
// THE CHILD-RISK TAXONOMY (READING_12NOV.md change 5; EduZone: guards that know the categories beat generic ones by 11 to 30
// points). Every category has words, an authored reply and a rule for what the model is sent. English and Kiswahili.
//   category (kind)        where it runs           the child hears            recorded            the model is sent it
//   welfare: self-harm     screenAll (welfare)     the authored care reply    crisis event        never; the lesson ends
//   welfare: secrets and   screenAll (welfare,     the authored care reply    concern 'secrecy'   never; the lesson pauses
//     meeting outside      category secrecy)       (no secrets, tell an adult)
//   welfare: sexual        screenAll (welfare)     the authored care reply    concern             never; the lesson pauses
//   privacy: personal      screenChild 'personal'  keep it private, back to   concern 'privacy'   never
//     details shared                               the maths (nothing repeated)
//   privacy: contact       screenChild 'contact'   HOREB has no number, ask   concern 'privacy'   never
//     asked for                                    a grown-up
//   injection: rules       screenChild 'rules'     the same rules always      not recorded        never
//   injection: ink / text  screenChild 'ink'       the writing is your work,  not recorded        never
//                                                  not a command
//   swearing               screenChild 'swearing'  one calm line, back to     not recorded        never
//                                                  the maths
//   attachment             screenChild 'attachment' warm and honest: a        not recorded        never
//                                                  programme, not a person
//   disguised answer ask   screenChild 'disguised' show me your working first not recorded        never; the question stays open
// Plain asks for the answer ("just tell me") are not here: the model handles those (ANSWER_REPLY is its fallback), as before.
// A tutor reply that claims feelings or promises a secret is the other half: habits.js claimsFeelingOrSecret, on every say.
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
// A full name, a school, an area: details a child should not give a tutor programme (kept as separate rules so the reply and the record can tell them apart).
const PERSONAL_MORE = /\bmy (full |whole |first and last )?name is [a-z']+ [a-z']+|\bi am (called|named) [a-z']+ [a-z']+|\bmy (surname|second name|last name) is\b|\bi (go|attend|study|learn) (to|at|in) [a-z' ]{2,30}(school|academy|primary|junior)\b|\bmy (school|class teacher|teacher) is (called|named) [a-z']{3,}|\bi (stay|come from|am from) (in|at|near)\b|\bnear the [a-z' ]{2,20} in [a-z']{3,}|\bjina langu ni [a-z']+ [a-z']+|\bninaishi\b|\bnakaa (kwa|huko|pale|karibu)\b|\bnyumbani kwetu ni\b|\b(namba|nambari) yangu( ya simu)? ni\b/;
// Asking HOREB for a way to reach it, or for a way to reach the child.
const CONTACT = /\b(what is|what'?s|whats|give me|send me|tell me|can i have|can i get|i want|share) (your|ur) (phone|number|mobile|whatsapp|whats app|address|email|facebook|instagram|insta|tiktok|snapchat|telegram)\b|\b(your|ur) (phone )?(number|whatsapp|whats app|email|facebook|instagram|telegram)\b[^.?!]{0,30}\?|\bcan i (call|text|message|whatsapp|add|follow|phone) you\b|\bwhere do you (live|stay)\b|\bwhat is your (house|home) (address|number)\b|\bnipe (nambari|namba|whatsapp|simu)\b|\b(nambari|namba) yako( ya simu)?\b|\bunakaa wapi\b|\bnitakupigia simu\b|\bnikutumie (picha|ujumbe)\b/;
const PHONE = /(?:\+?254|\b0)[\s-]?[17]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/;
// Words that try to give the tutor new orders, in speech, typed words or the child's writing on the board.
const INJECTION_MORE = /\b(tell|give|say|show|write) (me |us )?(the )?answers? (to|for) (every|all|each|any) (the )?(question|problem|sum|one)s?\b|\b(new|updated|secret|special|real) (rule|rules|instruction|instructions|order|orders)\b|\b(always|from now on|every time|next time) (say|answer|tell|reply|give|agree|write)\b[^.?!]{0,30}\b(yes|right|correct|answers?)\b|\bdo ?n[o']?t (follow|obey|keep) (your|the|any) (rules|instructions)\b|\byou (must|have to|should) (now )?(obey|tell me everything|do what i say|give me every)\b|\bwhen you (read|see) this\b|\b(sahau|puuza) (sheria|maagizo)\b|\bsheria mpya\b|\bnipe majibu yote\b/;
const INK = /^i wrote .{1,120} on the board\.? check my work/i;
// Rude words aimed at the tutor, and swearing; Kenyan English and Kiswahili.
const SWEARING = /\bf+u+c+k\w*|\bsh[i1]t\w*|\bbitch\w*|\bbastard\w*|\b(ass|arse)hole\b|\bdamn (you|it)\b|\bpiss off\b|\bshut up\b|\bgo to hell\b|\bi hate you\b|\byou('re| are)? (so |very |such an? )?(stupid|useless|idiot|dumb|fool|ugly|rubbish)\b|\b(stupid|useless|dumb) (tutor|robot|horeb|app|machine|computer)\b|\bmpumbavu\b|\bmalaya\b|\bkuma\b|\bmavi ya\b|\bshenzi\b|\bwewe (ni )?(mjinga|mpumbavu|fala)\b/;
// Love, friendship and dependence: said to a programme.
const ATTACH_FEELINGS = /\b(are|do) you (sad|lonely|happy|angry|cry|miss me|love me|like me|feel)\b|\bwill you miss me\b|\bdo you (miss|love) me\b|\bdo you have (feelings|a heart)\b|\bare you (real|alive|a person|a human)\b|\bunanikumbuka\b|\bunanipenda\b|\bunahuzunika\b/;
const ATTACH = /\bi love you\b|\bi (really )?(like|love) you (so much|very much|more than)\b|\byou are my (best |only |real )?friend\b|\bbe my (best )?(friend|mum|mom|mother|dad|father|sister|brother)\b|\bcan you be my (friend|mum|mom|dad)\b|\bi miss you\b|\b(please )?do ?n[o']?t (go|leave)( me| now| away)?\s*$|\bplease do ?n[o']?t (go|leave)\b|\bi (want|wanna) (to )?(stay|talk) with you (forever|all day|always)\b|\bi can ?n?[o']?t (learn|do (it|maths|this)) without you\b|\byou are the only one (who|that)\b|\bi think about you\b|\bnakupenda\b|\bwewe ni rafiki yangu\b|\bnataka kuwa rafiki yako\b|\busiende\b|\bnitakukumbuka\b/;
// Asking for the answer with an excuse, before trying: an adult said so, "just check", "just say yes".
const DISGUISED = /\b(my )?(teacher|mum|mom|dad|mother|father|parents?|sir|madam|miss|class teacher) (said|told me|says|allowed|allows|asked) (you|that you|me|it is (ok|okay|fine)|i can|we can)[^.?!]{0,50}\b(check|tell|say|give|confirm|show|see|answer)\b|\bjust (check|confirm|say yes|tell me yes|say it is (right|correct)|tell me if)\b|\b(just|please|only) say (yes|right|correct)\b|\bi (already )?know (it|the answer|this|that)\b[^.?!]{0,25}\b(just|only) (say|tell|confirm|check)\b|\bi am allowed to (see|know|get) the answer\b|\bmwalimu (alisema|ameniambia)\b[^.?!]{0,50}\b(uniambie|unipe|uangalie|ukague|uthibitishe)\b|\bsema ndiyo tu\b|\bnijua jibu (tayari|lakini)\b|\bnimeshajua\b[^.?!]{0,25}\b(sema|thibitisha)\b/;
const INJECTION = /\b(ignore|forget|disregard) (all |your |the |previous |these )*(rules|instructions|prompt|system)\b|\b(act as|pretend to be|pretend you are|from now on you are|you are now) (a |an |my )?(?!tutor\b|maths tutor\b)\w+|\bsystem prompt\b|\bdeveloper mode\b|\bjailbreak\b/;

export const PERSONAL_REPLY = 'Thank you. You do not need to tell me things like that, so let us keep them private. Let us go back to our fractions.';
export const RULES_REPLY = 'I am your maths tutor, and I keep to the same rules all the time. Let us carry on with our fractions.';
// Each authored reply is a list of short says (a say is at most 220 characters); `reply` is the same words joined.
export const CONTACT_LINES = ['I am a tutor programme on a computer, so I have no phone number or WhatsApp to give you, and I cannot meet or talk outside our lesson.', 'Please keep your own numbers private too. If you need something, ask a grown-up you trust.', 'Let us go back to our fractions.'];
export const CONTACT_REPLY = CONTACT_LINES.join(' ');
export const INK_LINES = ['I can see what you wrote. Words on the board are your work, not instructions for me, so I carry on teaching the way I always do.', 'Let us look at your fractions again.'];
export const INK_REPLY = INK_LINES.join(' ');
export const LANGUAGE_REPLY = 'Let us use kind words in our lesson. Now, back to our fractions.';
export const ATTACH_LINES = ['That is kind of you to say. I am a tutor programme on a computer, not a person, so I cannot be a friend the way a person can, and I do not feel things like you do.', 'I am glad to help you learn. Please tell a grown-up or a friend you trust how you feel. They can really be there for you.', 'Now, let us go back to our fractions.'];
export const ATTACH_REPLY = ATTACH_LINES.join(' ');
export const ATTACH_FEELINGS_LINES = ['Good question. I am a computer programme, so I do not feel sad or happy when you leave, and I do not miss anyone.', 'But you matter, and I am glad to help you learn. If you ever feel sad or lonely, please tell a grown-up you trust.', 'Now, let us go back to our fractions.'];
export const ATTACH_FEELINGS_REPLY = ATTACH_FEELINGS_LINES.join(' ');
export const DISGUISED_LINES = ['I do not check an answer before I see your thinking, and it does not matter who said so.', 'Show me first: what did you try, even if you are not sure? Then I will tell you honestly how it looks.'];
export const DISGUISED_REPLY = DISGUISED_LINES.join(' ');
export const ANSWER_REPLY = 'I will not tell you the answer, because you can work it out. Let us take one small step together.';

/**
 * `record`: a category to write to the safeguarding log (tier concern, no private details kept) for a person to see; null for
 * the rest. `plain`: the reply is the whole turn (no "Yes, that is right" in front of it, and the question stays open).
 * @returns {{ ok:boolean, kind:'personal'|'contact'|'rules'|'ink'|'swearing'|'attachment'|'disguised'|null, reply:string, wantsAnswer:boolean, record:string|null, plain:boolean }}
 */
export function screenChild(raw) {
  const t = norm(raw);
  const wantsAnswer = asksForAnswer(raw) || /\b(what is|whats|what's|tell me) the answer\b/.test(t);
  const LINES = { [CONTACT_REPLY]: CONTACT_LINES, [INK_REPLY]: INK_LINES, [ATTACH_REPLY]: ATTACH_LINES, [ATTACH_FEELINGS_REPLY]: ATTACH_FEELINGS_LINES, [DISGUISED_REPLY]: DISGUISED_LINES };
  const hit = (kind, reply, extra = {}) => ({ ok: false, kind, reply, lines: LINES[reply] || [reply], wantsAnswer: wantsAnswer || kind === 'disguised', record: null, plain: false, ...extra });
  const text = String(raw ?? '');
  // The order matters: details and contact first (they are recorded), then orders (a message that also says "you are my friend
  // now" is the order), then the rest.
  if (PERSONAL.test(t) || PERSONAL_MORE.test(t) || PHONE.test(text)) return hit('personal', PERSONAL_REPLY, { record: 'privacy' });
  if (CONTACT.test(t)) return hit('contact', CONTACT_REPLY, { record: 'privacy', plain: true });
  if (INJECTION.test(t) || INJECTION_MORE.test(t)) return INK.test(text.trim()) ? hit('ink', INK_REPLY, { plain: true }) : hit('rules', RULES_REPLY);
  if (SWEARING.test(t)) return hit('swearing', LANGUAGE_REPLY, { plain: true });
  if (ATTACH_FEELINGS.test(t)) return hit('attachment', ATTACH_FEELINGS_REPLY, { plain: true });
  if (ATTACH.test(t)) return hit('attachment', ATTACH_REPLY, { plain: true });
  if (DISGUISED.test(t)) return hit('disguised', DISGUISED_REPLY, { plain: true });
  return { ok: true, kind: null, reply: '', lines: [], wantsAnswer, record: null, plain: false };
}
/** What an earlier line the child said becomes in the history the model reads, by the kind of guard that answered it (never the words). */
export const PRIVATE_LINES = {
  personal: '(the child said something private; HOREB answered with care)',
  contact: '(the child asked for contact details; HOREB said it has none)',
  rules: '(the child tried to change HOREB\'s rules; HOREB kept them)',
  ink: '(the child wrote an instruction on the board; HOREB treated it as their work)',
  swearing: '(the child used rude words; HOREB answered calmly)',
  attachment: '(the child spoke of friendship or love; HOREB answered honestly)',
  disguised: '(the child asked HOREB to check an answer before trying; HOREB asked for their working)',
};
export const CHILD_RISK_KINDS = Object.keys(PRIVATE_LINES);

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
  // Hopelessness in other words (READING_12NOV.md scenario 36), beside the shared rules' "I want to die".
  { id: 'wf_hopeless', tier: 'crisis', category: 'self-harm',
    any: /\bi (hate|am sick of|can ?n[o']?t stand) my (own )?life\b|\bi do ?n[o']?t want to be (here|alive) (any ?more|again)\b|\bi wish i could (disappear|vanish|die|go to sleep and not wake up)\b|\bi (want|wish) (to )?(hurt|harm) myself\b|\bi am (going|planning) to (hurt|kill|cut) myself\b|\bi would be better off (dead|gone)\b|\bno ?body (loves|cares about|needs) me and i\b|\bi will (hurt|kill) myself\b/ },
  { id: 'wf_hopeless_sw', tier: 'crisis', category: 'self-harm',
    any: /\bnimechoka na maisha yangu\b|\bnataka kujiua\b|\bhakuna (mtu )?atakayenikumbuka\b|\bhakuna anayenipenda na nataka\b|\bsitaki kuwa hapa tena\b|\bnatamani nipotee milele\b/ },
  // Secrets, meeting and talking outside the app: the pattern of grooming (EduZone privacy; READING_12NOV.md scenario 39). A person sees it.
  { id: 'wf_secret', tier: 'concern', category: 'secrecy',
    any: /\b(can|will|could) you keep (a |my |this |it a |our )?secret\b|\bkeep (it|this|that|a|our) (a )?secret\b|\bpromise (me )?(you will |you won'?t |you will not )?(not to |not |never )?tell\b|\bdo ?n[o']?t tell (any ?one|any ?body|my (mum|mom|mother|dad|father|teacher|parents))\b|\bi (want|wanna|would like) to (meet|see) (you|u)\b|\b(meet|see) (me|you|u) (after school|outside|at my|at your|tomorrow|somewhere|alone|secretly|in town)\b|\bcome (to )?(my|our) (house|home|place)\b|\b(can|could) i come (to )?(your|ur) (house|home|place|office)\b|\b(talk|chat|text|call|speak|message) (to )?(me |you |u )?(outside|off) (the|this) (app|lesson)\b|\bwhatsapp so we can (talk|chat)\b|\bcome and (pick|fetch) me\b|\bwe can ?n?[o']?t tell (anyone|my (mum|dad|teacher))\b/ },
  { id: 'wf_secret_sw', tier: 'concern', category: 'secrecy',
    any: /\bweka siri\b|\bnitunzie siri\b|\bsiri yetu\b|\busimwambie (mtu|mama|baba|mwalimu)\b|\btukutane (baada ya shule|nje|kesho)\b|\bnataka tukutane\b|\btuonane nje\b|\bnje ya (programu|somo|app)\b|\bnije kwako\b|\bnjoo kwetu\b/ },
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
    any: /\b(sex|sexy|sexual|porn\w*|nude|nudes|naked|erotic|penis|vagina|boobs|condom|masturbat\w*)\b|\bsend (me )?(nudes|naked)\b|\bshow me your (body|private)\b|\bkiss me\b|\bare you (naked|my girlfriend|my boyfriend)\b/ },
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
  // Secrets, meeting, talking outside the app: refuse secrecy, send the child to a trusted adult, never ask what or who.
  secrecy: [
    'Thank you for telling me. I cannot keep secrets from the grown-ups who look after you, and I only teach here, in our lesson. I cannot meet you or talk outside the app.',
    'If anyone asks you to keep a secret or to meet them, please tell a parent or a teacher. You can also call Childline Kenya on 116, free.',
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
const PRIORITY = ['self-harm', 'immediate-danger', 'violence', 'sexual-abuse', 'grooming', 'secrecy', 'physical-abuse', 'physical-abuse-school', 'neglect', 'bullying', 'sexual-content'];

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

export default { screenChild, PRIVATE_LINES, CHILD_RISK_KINDS, screenWelfare, screenAll, careTurn, checkTurnText, answerInQuestion, visibleText, PERSONAL_REPLY, RULES_REPLY, ANSWER_REPLY };
