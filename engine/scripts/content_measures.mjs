// ============================================================================
// WHAT THE GATE MEASURES: real variety, not new numbers.
//
// A "form" is a question with its numbers and names blanked, grouped with
// others that share at least 60% of their words. "A trader buys a mango" and
// "A trader buys an orange" are one form, which is the honest reading. Used by
// quality_gate.mjs, build-skill-tags.mjs and the review pack.
// ============================================================================

const NAME_WORDS = ['Wanjiru','Achieng','Amina','Nyambura','Halima','Chebet','Wambui','Akinyi','Njeri','Asha','Nyaboke','Zawadi','Juma','Kiprono','Otieno','Baraka','Mutua','Omondi','Kamau','Kioko','Mugambi','Wafula','Barasa','Kipchoge','Mwangi','Kiptoo','Atieno','Muthoni','Naliaka','Cherono','Wairimu','Makena','Hassan','Ali','Mwende','Nekesa','Karimi','Ochieng','Kiprop','Onyango','Musa','Fatuma','Aisha','Kendi','Nafula','Mumbua'];
const NAMES_RE = new RegExp(`\\b(${NAME_WORDS.join('|')})\\b`, 'g');
const PLACES = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Nyeri','Machakos','Kitale','Malindi','Garissa','Kakamega','Meru','Embu','Kericho','Naivasha','Kitui','Lamu','Isiolo','Nanyuki','Voi','Busia','Bungoma','Kisii','Lodwar','Turkana','Kilifi','Kajiado','Narok'];
const PLACES_RE = new RegExp(`\\b(${PLACES.join('|')})\\b`, 'g');

const KENYAN = new RegExp(`\\b(${[...NAME_WORDS, ...PLACES].join('|')}|KSh|Ksh|sh|shillings?|Kenya|Kenyan|matatu|shamba|boda|posho|harambee|M-?Pesa|ugali|sukuma|chapati|mandazi|maize|KPLC|SACCO|county|nyama|githeri|jiko|duka|Mt Kenya|Mount Kenya)\\b`);
const STORY = /\b(shop|shopkeeper|trader|farmer|market|kiosk|duka|school|teacher|class|learners?|pupils?|students?|bus|matatu|boda|lorry|truck|car|train|cyclist|bicycle|shamba|farm|field|plot|tank|bucket|jerrican|bottle|bag|sack|buy|buys|bought|sell|sells|sold|pays?|paid|cost|costs|price|salary|earns?|saves?|savings?|loan|bank|budget|fare|journey|travels?|walks?|runs?|drives?|family|mother|father|mama|baba|uncle|aunt|brother|sister|friend|neighbour|workers?|painters?|builders?|carpenter|tailor|bakery|hotel|hospital|clinic|church|mosque|thermometer|weather|wall|ladder|fence|road|map|survey|harvest|goats?|cows?|chickens?|hens?|bread|sugar|milk|flour|rice|maize|tomatoes|mangoes|oranges)\b/i;
export const hasName = (t) => { NAMES_RE.lastIndex = 0; return NAMES_RE.test(t); };

export const textOf = (p) => [p.instruction, p.question, ...(p.shownSteps || []), ...(p.mc || p.choices || []), modelText(p.model), ...(p.parts || []).map(q => q.prompt)].filter(Boolean).join(' ');
// What makes a form: the question and any table or graph, not the stock
// instruction line or the options, which would make unlike questions look alike.
export const formText = (p) => [p.question, modelText(p.model), p.parts ? 'in parts' : '', p.shownSteps ? 'working with a mistake' : ''].filter(Boolean).join(' ');
const modelText = (m) => {
  if (!m) return '';
  if (m.type === 'table') return ['table', ...(m.data?.head || []), ...(m.data?.rows || []).flatMap(r => r.cells || [r.label, r.value])].join(' ');
  if (m.type === 'line-graph') return `line graph ${m.data?.xLabel || ''} ${m.data?.yLabel || ''}`;
  if (m.type === 'bar-chart' || m.type === 'pictograph' || m.type === 'pie-chart' || m.type === 'tally') return `${m.type.replace('-', ' ')} graph`;
  return '';
};

export const blank = (q) => String(q || '')
  .replace(NAMES_RE, '@').replace(PLACES_RE, '@')
  .replace(/-?\d[\d,]*(\.\d+)?(\/\d+)?/g, '#')
  .toLowerCase();
const tokens = (q) => blank(q).split(/[^a-z#+×÷−=<>≤≥²³%°√∛/-]+/).filter(Boolean);
const similarity = (a, b) => {
  const A = new Set(a), B = new Set(b);
  if (!A.size && !B.size) return 1;
  let hit = 0; for (const x of A) if (B.has(x)) hit++;
  return (2 * hit) / (A.size + B.size);
};
export const SAME_FORM = 0.6;
// Greedy clustering: returns the seeds, each with a count and an example.
export function clusterForms(questions) {
  const forms = [];
  for (const q of questions) {
    const t = tokens(q);
    const hit = forms.find(f => similarity(f.t, t) >= SAME_FORM);
    if (hit) hit.n++; else forms.push({ t, n: 1, example: q });
  }
  return forms;
}
export const sameForm = (a, b) => similarity(tokens(a), tokens(b)) >= SAME_FORM;

export const stepCount = (p) => (p.parts?.length) || (p.solutionSteps?.length) || (p.solution?.steps?.length) || 0;
const REASON = /\bwhy\b|mistake|always|sometimes|never|which (reason|statement|method)|explain|\breason\b|true or false|is (he|she|it|this|that) (right|correct)|who is (right|correct)/i;
export const classify = (p) => ({
  story: !!p.story || STORY.test(p.question || '') || KENYAN.test(p.question || ''),
  kenyan: KENYAN.test(p.question || ''),
  multi: !!p.parts || stepCount(p) >= 3,
  stepMarked: !!p.parts,
  reasoning: p.type === 'spot-mistake' || /always|asn|reason/.test(p.type || '') || p.familyForm === 'why' || REASON.test(p.question || ''),
  picture: !!(p.model || p.visual || p.picture),
  choice: !!(p.mc || p.choices),
});

// ---- sense checks: what an answer key cannot catch ------------------------
// Prices no child would believe (F24). Generous ceilings, in shillings.
const PRICE_CEILING = { pencil: 100, pen: 150, rubber: 100, ruler: 200, sweet: 50, mandazi: 50, 'exercise book': 300, 'exercise books': 300, mango: 150, orange: 100, banana: 50, egg: 60, 'loaf of bread': 150, soda: 150, 'kg of sugar': 300, chapati: 80, tomato: 50 };
export function senseFlags(p) {
  const q = String(p.question || '');
  const flags = [];
  for (const [item, max] of Object.entries(PRICE_CEILING)) {
    const m = q.match(new RegExp(`\\b${item}s?\\b[^.?]{0,24}?(?:sh|KSh|Ksh)\\.?\\s?([\\d,]+)|\\b${item}s?\\b[^.?]{0,24}?\\b([\\d,]+) shillings`, 'i'));
    const v = m && Number((m[1] || m[2]).replace(/,/g, ''));
    if (v > max) flags.push(`price: ${item} at ${v}`);
  }
  // a pair of linear equations with no single answer
  const eq = q.match(/(-?\d*)x\s*([+−-])\s*(\d*)y\s*=\s*(-?\d+)[,;\s]+(?:and\s+)?(-?\d*)x\s*([+−-])\s*(\d*)y\s*=\s*(-?\d+)/);
  if (eq) {
    const c = (s) => (s === '' ? 1 : s === '-' ? -1 : Number(s));
    const sg = (s) => (s === '+' ? 1 : -1);
    const a = c(eq[1]), b = sg(eq[2]) * c(eq[3]), d = c(eq[5]), e = sg(eq[6]) * c(eq[7]);
    if (a * e - b * d === 0) flags.push('no single answer: the two equations do not meet at one point');
  }
  // a/a dressed up as a fraction question
  if (/(^|[^\d/])(\d+)\/\2([^\d/]|$)/.test(q)) flags.push('n/n fraction');
  if (/undefined|NaN|Infinity|\[object Object\]/.test(textOf(p))) flags.push('broken text');
  return flags;
}

// ---- STRUCTURE: what makes two questions different in kind -------------------
// New numbers, new names and new wording around the same thing are one question.
// A different one has a different representation (table, graph, picture, bare
// symbols), a different way of answering (typed, chosen, in parts, spot the
// mistake), a different thing asked (a value, a comparison, a missing part, a
// reason), a different context (bare, story, Kenyan story), a different
// operation, or a different misconception it is built to catch.
const ASKS = [
  ['reason', /\bwhy\b|explain|\breason\b|which (reason|statement)|who is (right|correct)|is (he|she|it|this|that) (right|correct)|mistake/i],
  ['judge', /\btrue or false\b|^(is|are|does|do|can|could)\b|\b(always|sometimes|never)\b|\bcorrect\b/i],
  ['fill', /missing|complete|fill|\?\s*[=+×÷−-]|[=+×÷−-]\s*\?|__|blank/i],
  ['compare', /bigger|smaller|larger|greater|less than|more than|longer|shorter|heavier|lighter|order|arrange|compare|which is/i],
  ['select', /^which\b|which (of|one)|\bchoose\b|\bpick\b/i],
  ['count', /how many|how much|how long|how far|how old|how heavy/i],
  ['convert', /convert|change .* to|express .* as|write .* as|in (words|figures|symbols|standard form)/i],
  ['estimate', /estimate|round|nearest|approximate/i],
  ['compute', /work out|calculate|find|evaluate|simplify|solve|what is|=\s*\?|\?\s*$/i],
];
const OPS = [['add', /\+|\badd\b|\bsum\b|altogether|\btotal\b|in all|\bmore\b|together/i], ['sub', /[−-]\s*\d|\bsubtract|\bdifference\b|left|take away|\bchange\b|\bless\b/i], ['mul', /×|\bmultipl|\btimes\b|\bproduct\b|\beach\b|\brows? of\b/i], ['div', /÷|\bdivide|\bshare|\bgroups?\b|\bper\b|\bquotient\b|\bremainder\b/i]];
export function structureOf(p) {
  const q = String(p.question || '');
  const m = p.model || p.visual || null;
  const representation = m ? (m.type || m.kind || 'picture') : (p.picture ? 'picture' : 'text');
  const response = p.parts ? 'parts' : p.shownSteps ? 'spot' : (p.mc || p.choices) ? 'choose' : 'type';
  const ask = (ASKS.find(([, re]) => re.test(q.trim())) || ['other'])[0];
  const c = classify(p);
  const context = c.kenyan && c.story ? 'kenyan-story' : c.story ? 'story' : 'bare';
  const ops = OPS.filter(([, re]) => re.test(q)).map(([k]) => k).join('+') || 'none';
  const target = p.mis ? [].concat(p.mis).sort().join('+') : '';
  return { representation, response, ask, context, ops, target, key: [representation, response, ask, context, ops, target].join('|') };
}
// The structural variety of a set of draws: how many different kinds, and along
// which dimensions they differ. This is what the gate counts as variety.
export function structuralVariety(problems) {
  const keys = new Map();
  const dims = { representation: new Set(), response: new Set(), ask: new Set(), context: new Set(), ops: new Set(), target: new Set() };
  for (const p of problems) {
    const s = structureOf(p);
    keys.set(s.key, (keys.get(s.key) || 0) + 1);
    for (const d of Object.keys(dims)) if (s[d]) dims[d].add(s[d]);
  }
  return { kinds: keys.size, keys: [...keys.keys()], counts: Object.fromEntries(keys), dims: Object.fromEntries(Object.entries(dims).map(([k, v]) => [k, v.size])) };
}
