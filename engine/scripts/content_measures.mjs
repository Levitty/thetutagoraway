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
const modelText = (m) => {
  if (!m) return '';
  if (m.type === 'table') return ['table', ...(m.data?.headers || []), ...((m.data?.rows || []).flat())].join(' ');
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
