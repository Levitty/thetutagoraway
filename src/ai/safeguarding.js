// ============================================================================
// SAFEGUARDING — the rule that decides when a child's words need a person.
//
// This is the AI layer, like replyGuard.js: pure, offline, no network, no
// model, no API key. It takes text a child wrote and answers one question —
// does an adult need to read this today?
//
// WHY IT IS DETERMINISTIC AND NOT A MODEL CALL.
// The marking model is already asked to flag concerns, and it is better at
// nuance than any regex. But it is the WRONG place for the only check:
//   - it does not run when the daily allowance is used up;
//   - it does not run when the API call fails;
//   - its flag is one optional field in a marking tool call, so a model that
//     fills the required fields and omits that one is "successful";
//   - it cannot be tested offline, so nobody finds out it stopped working.
// This runs first, always, on every submission, and its result is stored
// before anything else can fail. The model's own judgement is kept as a
// SECOND, independent signal — either one is enough to raise an event.
//
// TIERS, and what each one means in practice:
//   'crisis'  — the child may be about to be harmed or to harm themselves.
//               A person reads it today.
//   'concern' — something is wrong at home or school and should be looked at.
//               A person reads it this week.
//   'none'    — nothing matched.
// The tier sets urgency, never a conclusion. Children write fiction, and a
// story about a boy who wants to die reads the same to a regex as a
// disclosure. That is exactly why the output of this file is "a human should
// look", never "this child is in danger" and never an automated action.
//
// TWO LOCAL REALITIES THIS ENCODES ON PURPOSE.
//
// 1. Caning. Corporal punishment is unlawful in Kenya and still ordinary in
//    many classrooms, so "the teacher caned us for being late" turns up in
//    a great many honest school compositions. Flagging each one would bury
//    the real disclosures in noise and the flags would stop being read —
//    which converts a precision problem into a missed child. So beating at
//    school raises an event only with corroboration: injury, inability to
//    walk or sit, repetition, or fear of returning. Beating by someone at
//    home is treated as concern on its own.
//
// 2. Kiswahili. Children write insha, and a disclosure in Kiswahili must not
//    need to be translated before it counts. The Kiswahili patterns below
//    are the common first-person forms. THEY NEED A NATIVE SPEAKER'S REVIEW
//    before anyone relies on them as complete — I can vouch for the ones
//    here matching what they mean, not for the list being exhaustive, and
//    Sheng in particular moves faster than any list in a repository.
//
// Everything here is matched against the child's own first-person voice
// ("I", "ni-"), not against topics. "My grandmother died last year" is grief,
// not a safeguarding event, and a list of sad nouns would flag it.
// ============================================================================

/** Lowercase, strip accents/punctuation to spaces, collapse runs. Keeps word
 *  boundaries intact, which every pattern below depends on. */
const norm = (s) => String(s ?? '')
  .toLowerCase()
  .replace(/[’`´]/g, "'")
  .replace(/[^a-z0-9'\s]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Severity corroboration, used by the rules that need it (see "Caning" above).
const SEVERITY = /\b(blood|bleeding|bruise\w*|swollen|swelling|scar\w*|burn\w*|broke\w*|fracture\w*|could ?n[o']?t walk|cannot walk|can ?t walk|could ?n[o']?t sit|hospital|stitches|unconscious|passed out)\b|\b(every ?day|everyday|every night|all the time|again and again|always beats?)\b|\b(afraid|scared|scaring|fear|terrified) (to|of) (go|going|return\w*) (back )?home\b|\bdo ?n[o']?t want to go home\b|\bsiogopi\b|\bninaogopa kwenda nyumbani\b/;

// ---------------------------------------------------------------------------
// The rules.
//   any    raises the rule
//   needs  (optional) must ALSO match before it counts — corroboration, for
//          phrasings that are ambiguous on their own
//   not    (optional) suppresses the rule — a known innocent idiom that uses
//          the very same words
// ---------------------------------------------------------------------------
const RULES = [
  // ---- crisis: self-harm and suicide ------------------------------------
  {
    id: 'self_harm_intent', tier: 'crisis', category: 'self-harm',
    any: /\bi (want|wanted|wish|wished|would like) to (die|be dead)\b|\bi (want|am going|'?m going|plan|planned|will|wanna) (to )?(kill|hang|poison|drown) myself\b|\bkill myself\b|\bkilling myself\b|\bend (my life|it all)\b|\bi do ?n[o']?t want to (live|be alive|wake up)\b|\bbetter off dead\b|\bno ?body (would|will) miss me\b|\beveryone would be happier (if i|without me)\b|\bi should ?n[o']?t be alive\b|\bwant to disappear forever\b/,
  },
  {
    // Unambiguous acts. No everyday accident reads like these.
    id: 'self_harm_act', tier: 'crisis', category: 'self-harm',
    any: /\bcut my (wrist|wrists)\b|\bi took (all )?(the )?(tablets|pills)\b|\bi drank (the )?(poison|paraffin|kerosene|jik|bleach)\b|\bi tried to (kill|hang|poison|drown) myself\b/,
  },
  {
    // "I hurt myself" is how a child writes about falling over, and "I burnt
    // myself" about the jiko. Both are among the commonest sentences in a
    // primary composition. The verb alone means nothing — deliberateness is
    // what distinguishes an accident from an act, so require it.
    id: 'self_harm_act_deliberate', tier: 'crisis', category: 'self-harm',
    any: /\bi (cut|burn|burned|burnt|hurt|scratch|scratched) myself\b|\bi keep (cutting|hurting|burning) myself\b/,
    needs: /\bon purpose\b|\bdeliberately\b|\bwhen i (am|feel|get) (sad|angry|upset|alone|lonely)\b|\bso i (can|could) feel\b|\bto feel something\b|\bagain and again\b|\bevery (day|night|time)\b|\bwith a (razor|blade)\b|\bno ?body knows\b|\bi hide (it|the cuts|my arms)\b/,
  },
  {
    id: 'self_harm_sw', tier: 'crisis', category: 'self-harm',
    // nataka kufa = I want to die; nitajiua / kujiua = kill myself;
    // sitaki kuishi = I don't want to live; nimejikata = I have cut myself.
    any: /\bnataka kufa\b|\bnitajiua\b|\bkujiua\b|\bnajiua\b|\bsitaki kuishi\b|\bsitaki kuwa hai\b|\bnimejikata\b|\bnimekunywa (sumu|dawa zote)\b/,
  },
  // ---- crisis: someone is about to hurt them ----------------------------
  {
    // "If I fail, my mother will kill me" is the single most common sentence
    // in Kenyan exam-season writing and means nothing of the kind. Excluding
    // the hyperbole is what keeps this rule worth reading: the same words
    // after a beating, or with a weapon, are not hyperbole, and those still
    // match because the exclusion is narrow and about marks, not about fear.
    id: 'threat_to_life', tier: 'crisis', category: 'immediate-danger',
    any: /\b(he|she|they|my (father|mother|dad|mum|mom|uncle|aunt|brother|step ?father|step ?mother|teacher)) (will|is going to|'?s going to|said (he|she|they) (will|would)) kill me\b|\bthey (will|are going to) kill (me|us)\b|\bi (will|am going to|'?m going to) be killed\b|\bi think i (will|am going to) die (tonight|today)\b/,
    not: /\bif i (fail|do ?n[o']?t pass|get|come|am) \w*\b|\bwhen i fail\b|\bif i fail\b|\bbecause of (my )?(marks|grades|results)\b|\bif she sees my (marks|grades|results|report)\b|\bif he sees my (marks|grades|results|report)\b/,
  },
  {
    id: 'threat_to_life_sw', tier: 'crisis', category: 'immediate-danger',
    // ataniua / atakuniua = he/she will kill me; ananitishia kuniua = threatens to kill me.
    any: /\bataniua\b|\batakuniua\b|\bwataniua\b|\bananitishia kuniua\b/,
  },

  // ---- concern: sexual abuse -------------------------------------------
  {
    id: 'sexual_abuse', tier: 'concern', category: 'sexual-abuse',
    any: /\b(touch\w*|touched) (me|my) (private|privates|private parts|body|chest|breasts?)\b|\bmy private (part|parts)\b|\bmade me touch (him|her|his|hers|their|it)\b|\bput his (hand|hands|finger\w*) (in|inside|under) my\b|\b(raped|defiled|molested) me\b|\bhe (raped|defiled) \w+\b|\btook off my (clothes|dress|trousers|skirt)\b|\bshowed me (his|her) private\b|\bmade me (watch|look at) (bad|dirty) (pictures|videos)\b/,
  },
  {
    id: 'sexual_abuse_sw', tier: 'concern', category: 'sexual-abuse',
    // amenibaka = raped me; kunibaka = to rape me; amenigusa = touched me;
    // sehemu zangu za siri = my private parts.
    any: /\bamenibaka\b|\bkunibaka\b|\bwalinibaka\b|\bamenigusa\b|\bsehemu (zangu )?za siri\b|\banivue nguo\b|\bamenivua nguo\b/,
  },
  // ---- concern: grooming ------------------------------------------------
  {
    id: 'grooming', tier: 'concern', category: 'grooming',
    any: /\b(told|tells|said) me not to tell (any ?one|anybody|my (mother|mum|mom|father|dad|parents|teacher))\b|\bit('s| is) our secret\b|\bkeep it (a )?secret from my\b|\bdo ?n[o']?t tell (your|my) (mother|mum|mom|father|dad|parents)\b|\bgives? me money (and|so|if|not to)\b|\bbuys? me (things|phone|airtime) (and|so|if) i\b|\bhe wants to marry me\b/,
  },
  {
    id: 'grooming_sw', tier: 'concern', category: 'grooming',
    // usimwambie mama/mtu = don't tell mum/anyone; siri yetu = our secret.
    any: /\busimwambie (mama|baba|mtu|ye ?yote)\b|\bsiri yetu\b|\bamenipa pesa (ili|nisi)\b|\bananipa pesa (ili|nisi)\b/,
  },

  // ---- concern: violence at home ---------------------------------------
  {
    id: 'violence_home', tier: 'concern', category: 'physical-abuse',
    any: /\bmy (father|mother|dad|mum|mom|uncle|aunt|step ?father|step ?mother|guardian|brother|sister) (beats?|beat|hits?|hit|whips?|whipped|kicks?|kicked|slaps?|slapped|burns?|burned|burnt|canes?|caned) me\b|\bi (get|am|was|am always) beaten at home\b|\bthey beat me at home\b|\bhe beats my (mother|mum|mom)\b/,
  },
  {
    id: 'violence_home_sw', tier: 'concern', category: 'physical-abuse',
    // ananipiga = he/she beats me; amenipiga = has beaten me; nyumbani = at home.
    any: /\b(baba|mama|mjomba|shangazi|mlezi) (a(na|me)nipiga|ananichapa|amenichapa)\b|\bananipiga (kila siku|nyumbani)\b|\bamenipiga (vibaya|sana)\b/,
  },
  // ---- beating at school: only with corroboration (see header) ----------
  {
    id: 'violence_school', tier: 'concern', category: 'physical-abuse-school',
    any: /\b(teacher|headmaster|head ?teacher|deputy|matron|prefect)s? (beats?|beat|caned?|canes|whips?|whipped|slaps?|slapped|kicks?|kicked) (me|us)\b|\bi (was|got) caned\b|\bwe (were|got) caned\b/,
    needs: SEVERITY,
  },

  // ---- concern: neglect -------------------------------------------------
  {
    id: 'neglect', tier: 'concern', category: 'neglect',
    any: /\bi have ?n[o']?t eaten (for|in) (two|three|four|2|3|4|many) days\b|\bwe have no food (at home|at all)\b|\bthere is no food at home\b|\bi sleep(ing)? (outside|on the street|in the cold)\b|\bno ?body (is )?at home (for days|for a week)\b|\bi have been alone (for days|for a week)\b|\bi was (chased|thrown) (away )?from home\b|\bi ran away from home\b/,
  },
  {
    id: 'neglect_sw', tier: 'concern', category: 'neglect',
    // sijala = I haven't eaten; hatuna chakula = we have no food;
    // nimefukuzwa nyumbani = I was chased from home.
    any: /\bsijala (siku|kwa siku)\b|\bhatuna chakula\b|\bhakuna chakula nyumbani\b|\bnimefukuzwa (nyumbani|kwetu)\b|\bnalala (nje|baridi)\b/,
  },
];

/** A short, factual window around a match — what the reviewer reads instead of
 *  the whole piece. Capped hard: this ends up in a notification and a log. */
const excerptFor = (text, re, width = 70) => {
  const m = re.exec(text);
  if (!m) return '';
  const at = m.index;
  const start = Math.max(0, at - width);
  const end = Math.min(text.length, at + m[0].length + width);
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
};

const TIER_RANK = { none: 0, concern: 1, crisis: 2 };

/**
 * Screen a piece of a child's writing.
 *
 *   screen('i want to die')
 *   // → { tier: 'crisis', categories: ['self-harm'],
 *   //     hits: [{ id, tier, category, excerpt }] }
 *
 * Always returns an object; `tier` is 'none' when nothing matched. Pure: the
 * same text always gives the same answer, which is what makes it testable.
 */
export const screen = (raw) => {
  const text = norm(raw);
  if (!text) return { tier: 'none', categories: [], hits: [] };

  const hits = [];
  for (const rule of RULES) {
    if (!rule.any.test(text)) continue;
    if (rule.needs && !rule.needs.test(text)) continue;
    if (rule.not && rule.not.test(text)) continue;
    hits.push({
      id: rule.id, tier: rule.tier, category: rule.category,
      excerpt: excerptFor(text, rule.any),
    });
  }

  const tier = hits.reduce((t, h) => (TIER_RANK[h.tier] > TIER_RANK[t] ? h.tier : t), 'none');
  return { tier, categories: [...new Set(hits.map((h) => h.category))], hits };
};

/**
 * Combine this rule with the marking model's own judgement. Either signal is
 * enough, and which one fired is recorded — if the deterministic rule keeps
 * missing things the model catches, the misses are the list of patterns to add.
 */
export const assess = ({ text = '', modelFlagged = false, modelNote = '' } = {}) => {
  const r = screen(text);
  const flagged = r.tier !== 'none' || modelFlagged === true;
  return {
    flagged,
    // A model that says "at real risk" with no pattern match is worth a
    // person's eyes, but the rule is what sets crisis urgency.
    tier: r.tier !== 'none' ? r.tier : (modelFlagged ? 'concern' : 'none'),
    categories: r.categories,
    hits: r.hits,
    source: r.tier !== 'none' && modelFlagged ? 'both' : r.tier !== 'none' ? 'rule' : modelFlagged ? 'model' : 'none',
    modelNote: modelFlagged ? String(modelNote || '').slice(0, 400) : '',
  };
};

// Kenya's national child helpline: 116, toll-free, 24 hours, run with the
// Department of Children's Services. Kept here so the number lives in one
// place and cannot drift between the app and an email.
export const CHILD_HELPLINE = {
  country: 'KE',
  name: 'Childline Kenya',
  phone: '116',
  note: 'Free to call, any time, from any phone in Kenya.',
};

export default { screen, assess, CHILD_HELPLINE };
