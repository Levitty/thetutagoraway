// ============================================================================
// WRITING — prompt bank + rubric.
//
// Two languages (English composition, Kiswahili insha), three grade bands.
// Each prompt is the kind of thing a Kenyan learner actually meets: CBC
// creative-writing tasks in upper primary and junior school, and KCSE Paper 3
// / Insha-style tasks in senior school. The rubric is four bands × 5 marks
// (= /20) so a mark reads the same way across the bank.
// ============================================================================

export const LANGUAGES = {
  en: { id: 'en', name: 'English', pieceName: 'composition' },
  sw: { id: 'sw', name: 'Kiswahili', pieceName: 'insha' },
};

// Grade → band. Word targets are what a marker expects at that level, not caps.
export const BANDS = {
  upper:  { id: 'upper',  label: { en: 'Grade 4–6', sw: 'Gredi 4–6' },     grades: [4, 5, 6],    words: [120, 220] },
  junior: { id: 'junior', label: { en: 'Grade 7–9', sw: 'Gredi 7–9' },     grades: [7, 8, 9],    words: [200, 350] },
  senior: { id: 'senior', label: { en: 'Grade 10–12', sw: 'Gredi 10–12' }, grades: [10, 11, 12], words: [350, 500] },
};
export const bandForGrade = (g) => {
  const n = Number(g);
  if (!Number.isFinite(n)) return BANDS.junior;
  if (n <= 6) return BANDS.upper;
  if (n <= 9) return BANDS.junior;
  return BANDS.senior;
};
export const GRADES = [4, 5, 6, 7, 8, 9, 10, 11, 12];

// Composition types. `sw` carries the insha name so the picker reads right in
// either language.
export const TYPES = {
  narrative:     { id: 'narrative',     en: 'Story',              sw: 'Masimulizi',       hint: { en: 'Tell what happened, in order, with a beginning, a turning point and an ending.', sw: 'Simulia kilichotokea kwa mpangilio: mwanzo, kilele na hitimisho.' } },
  descriptive:   { id: 'descriptive',   en: 'Description',        sw: 'Maelezo',          hint: { en: 'Paint the picture — what you saw, heard, smelt, felt.', sw: 'Chora picha kwa maneno — ulichoona, kusikia, kunusa, kuhisi.' } },
  argumentative: { id: 'argumentative', en: 'Argument',           sw: 'Mjadala',          hint: { en: 'Take a side, give reasons, answer the other side, conclude.', sw: 'Chukua msimamo, toa hoja, jibu upande wa pili, hitimisha.' } },
  letter:        { id: 'letter',        en: 'Letter',             sw: 'Barua',            hint: { en: 'Right layout for the kind of letter, clear purpose, proper close.', sw: 'Muundo sahihi wa barua, lengo wazi, hitimisho mwafaka.' } },
  ending:        { id: 'ending',        en: 'Story with a given line', sw: 'Insha ya kumalizia', hint: { en: 'Your story must build naturally to the sentence you are given.', sw: 'Hadithi yako lazima ifikie kwa asili sentensi uliyopewa.' } },
  proverb:       { id: 'proverb',       en: 'Saying',             sw: 'Methali',          hint: { en: 'Show the meaning of the saying through what happens in the story.', sw: 'Onyesha maana ya methali kupitia matukio ya hadithi.' } },
  own:           { id: 'own',           en: 'My own topic',       sw: 'Mada yangu',       hint: { en: 'Type the topic your teacher gave you.', sw: 'Andika mada uliyopewa na mwalimu.' } },
};

// The bank. `p` is the task exactly as the learner should see it.
const P = (id, lang, band, type, p) => ({ id, lang, band, type, p });
export const PROMPTS = [
  // ---- English · Grade 4–6 ----
  P('en-u-1', 'en', 'upper', 'narrative',   'Write a story about a day you will never forget.'),
  P('en-u-2', 'en', 'upper', 'narrative',   'Write a story that begins: "The gate was open, and the dog was gone."'),
  P('en-u-3', 'en', 'upper', 'descriptive', 'Describe your school on a Monday morning.'),
  P('en-u-4', 'en', 'upper', 'descriptive', 'Describe the market near your home. What do you see, hear and smell?'),
  P('en-u-5', 'en', 'upper', 'letter',      'Write a letter to a friend who moved to another town, telling them what has happened since they left.'),
  P('en-u-6', 'en', 'upper', 'argumentative', 'Should pupils be given homework every day? Give your reasons.'),
  P('en-u-7', 'en', 'upper', 'ending',      'Write a story that ends with the words: "...and that is how I learned to always tell the truth."'),
  P('en-u-8', 'en', 'upper', 'proverb',     'Write a story that shows the meaning of the saying "A friend in need is a friend indeed."'),

  // ---- English · Grade 7–9 ----
  P('en-j-1', 'en', 'junior', 'narrative',   'Write a story about a time you had to make a difficult choice.'),
  P('en-j-2', 'en', 'junior', 'narrative',   'Write a story that begins: "I knew the moment I saw her face that something had gone terribly wrong."'),
  P('en-j-3', 'en', 'junior', 'descriptive', 'Describe a place that is beautiful in the morning and frightening at night.'),
  P('en-j-4', 'en', 'junior', 'argumentative', 'Mobile phones should be allowed in secondary schools. Do you agree? Support your position.'),
  P('en-j-5', 'en', 'junior', 'argumentative', 'Is it better to grow up in a town or in the countryside? Argue your case.'),
  P('en-j-6', 'en', 'junior', 'letter',      'Write a letter to the principal of your school suggesting one change that would improve the school, and why.'),
  P('en-j-7', 'en', 'junior', 'letter',      'Write a letter to your county governor about the state of the road near your home.'),
  P('en-j-8', 'en', 'junior', 'ending',      'Write a story that ends with the words: "...I had never felt so proud in my life."'),
  P('en-j-9', 'en', 'junior', 'proverb',     'Write a story that illustrates the saying "Pride comes before a fall."'),
  P('en-j-10', 'en', 'junior', 'descriptive', 'Describe a person in your community whom everyone respects. Show, don\'t just tell, why.'),

  // ---- English · Grade 10–12 (KCSE Paper 3 style) ----
  P('en-s-1', 'en', 'senior', 'narrative',   'Write a story beginning: "Nobody believed me when I told them what I had seen."'),
  P('en-s-2', 'en', 'senior', 'ending',      'Write a story ending with the words: "...that was the last time I ever took anything for granted."'),
  P('en-s-3', 'en', 'senior', 'argumentative', 'The youth are the solution to Kenya\'s problems, not the cause. Discuss.'),
  P('en-s-4', 'en', 'senior', 'argumentative', '"Technology has done more harm than good to the family." Write a composition supporting or opposing this statement.'),
  P('en-s-5', 'en', 'senior', 'descriptive', 'Write a composition entitled "The Long Wait."'),
  P('en-s-6', 'en', 'senior', 'proverb',     'Write a composition to illustrate the saying "Cut your coat according to your cloth."'),
  P('en-s-7', 'en', 'senior', 'letter',      'Write a letter to the editor of a national newspaper about a problem in your community and what should be done about it.'),
  P('en-s-8', 'en', 'senior', 'narrative',   'Write a story about a journey that changed the way you see your family.'),

  // ---- Kiswahili · Gredi 4–6 ----
  P('sw-u-1', 'sw', 'upper', 'narrative',   'Andika insha kuhusu siku ambayo hutaisahau kamwe.'),
  P('sw-u-2', 'sw', 'upper', 'narrative',   'Andika hadithi inayoanza kwa maneno: "Nilipofungua mlango, sikuamini macho yangu."'),
  P('sw-u-3', 'sw', 'upper', 'descriptive', 'Eleza shule yako asubuhi ya Jumatatu.'),
  P('sw-u-4', 'sw', 'upper', 'descriptive', 'Eleza soko lililo karibu na nyumbani kwenu.'),
  P('sw-u-5', 'sw', 'upper', 'letter',      'Andika barua kwa rafiki yako uliyesoma naye, ukimweleza yaliyotokea tangu alipohama.'),
  P('sw-u-6', 'sw', 'upper', 'ending',      'Andika insha itakayomalizika kwa maneno: "...tangu siku hiyo sikusema uongo tena."'),
  P('sw-u-7', 'sw', 'upper', 'proverb',     'Andika hadithi inayodhihirisha maana ya methali "Haraka haraka haina baraka."'),

  // ---- Kiswahili · Gredi 7–9 ----
  P('sw-j-1', 'sw', 'junior', 'narrative',   'Andika insha kuhusu wakati ulipolazimika kufanya uamuzi mgumu.'),
  P('sw-j-2', 'sw', 'junior', 'descriptive', 'Eleza mahali ambapo ni pazuri asubuhi lakini pa kutisha usiku.'),
  P('sw-j-3', 'sw', 'junior', 'argumentative', 'Simu za mkononi ziruhusiwe shuleni. Jadili.'),
  P('sw-j-4', 'sw', 'junior', 'letter',      'Andika barua rasmi kwa mwalimu mkuu ukipendekeza mabadiliko moja yatakayoboresha shule yenu.'),
  P('sw-j-5', 'sw', 'junior', 'letter',      'Andika barua ya kirafiki kwa nyanya yako ukimweleza jinsi masomo yanavyoendelea.'),
  P('sw-j-6', 'sw', 'junior', 'ending',      'Andika insha itakayomalizika kwa maneno: "...sikuwahi kujivunia kiasi hicho maishani mwangu."'),
  P('sw-j-7', 'sw', 'junior', 'proverb',     'Andika insha inayodhihirisha maana ya methali "Mchelea mwana kulia hulia yeye."'),
  P('sw-j-8', 'sw', 'junior', 'proverb',     'Andika insha inayodhihirisha maana ya methali "Asiyesikia la mkuu huvunjika guu."'),
  P('sw-j-9', 'sw', 'junior', 'argumentative', 'Ni bora kukua mjini kuliko mashambani. Jadili.'),

  // ---- Kiswahili · Gredi 10–12 (KCSE Insha style) ----
  P('sw-s-1', 'sw', 'senior', 'narrative',   'Andika insha inayoanza kwa maneno: "Hakuna aliyeniamini nilipowaeleza nilichokiona."'),
  P('sw-s-2', 'sw', 'senior', 'ending',      'Andika insha itakayomalizika kwa maneno: "...hiyo ndiyo ilikuwa mara ya mwisho kudharau ushauri wa wazazi wangu."'),
  P('sw-s-3', 'sw', 'senior', 'argumentative', 'Vijana ndio suluhisho la matatizo ya Kenya, si chanzo chake. Jadili.'),
  P('sw-s-4', 'sw', 'senior', 'argumentative', '"Teknolojia imeleta madhara zaidi kuliko manufaa katika familia." Jadili.'),
  P('sw-s-5', 'sw', 'senior', 'proverb',     'Andika insha inayodhihirisha maana ya methali "Mgaagaa na upwa hali wali mkavu."'),
  P('sw-s-6', 'sw', 'senior', 'proverb',     'Andika insha inayodhihirisha maana ya methali "Mtaka cha mvunguni sharti ainame."'),
  P('sw-s-7', 'sw', 'senior', 'letter',      'Andika barua kwa mhariri wa gazeti la kitaifa kuhusu tatizo katika eneo lenu na hatua zinazofaa kuchukuliwa.'),
  P('sw-s-8', 'sw', 'senior', 'descriptive', 'Andika insha yenye anwani "Subira."'),
];

export const promptsFor = (lang, bandId, type) =>
  PROMPTS.filter(p => p.lang === lang && p.band === bandId && (!type || p.type === type));

// The rubric. Names in both languages so the feedback screen reads in the
// language the piece was written in. The marker (edge function) is told the
// same four bands, so what the learner sees is what was marked.
export const RUBRIC = [
  { id: 'content',      en: 'Ideas & relevance',      sw: 'Maudhui na uhusiano na mada', desc: { en: 'Answers the task; ideas are developed, not just listed.', sw: 'Inajibu mada; mawazo yamekuzwa, si orodha tu.' } },
  { id: 'organisation', en: 'Organisation',           sw: 'Mpangilio',                   desc: { en: 'Clear beginning, middle and end; paragraphs each do one job.', sw: 'Mwanzo, kati na mwisho wazi; kila aya ina kazi moja.' } },
  { id: 'language',     en: 'Language & vocabulary',  sw: 'Lugha na msamiati',           desc: { en: 'Sentence variety, precise words, the right register.', sw: 'Aina mbalimbali za sentensi, maneno sahihi, lugha inayofaa.' } },
  { id: 'mechanics',    en: 'Grammar & punctuation',  sw: 'Sarufi na alama za uakifishaji', desc: { en: 'Tense, agreement, spelling, punctuation.', sw: 'Nyakati, upatanisho, tahajia, uakifishaji.' } },
];
export const MAX_MARK = 20;

// A mark → a short verdict, in the KCSE bands people already know.
export const verdict = (score, lang = 'en') => {
  const s = Number(score) || 0;
  if (lang === 'sw') return s >= 16 ? 'Bora sana' : s >= 11 ? 'Vizuri' : s >= 6 ? 'Wastani' : 'Inahitaji kazi';
  return s >= 16 ? 'Excellent' : s >= 11 ? 'Good' : s >= 6 ? 'Fair' : 'Needs work';
};

export const wordCount = (text) => (text || '').trim().split(/\s+/).filter(Boolean).length;
