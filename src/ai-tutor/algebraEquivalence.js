// ============================================================================
// ALGEBRAIC EQUIVALENCE — is what the child typed the same expression as the
// key, whatever order, notation or bracketing they used?
//
// Feedback F2/F3 (21 Oct 2026): "3 + 5x" was marked wrong against "5x + 3",
// and "x^9" against "x⁹". Matching spellings can never cover every way a child
// writes the same thing (x·5, 2(3 + x), yx, b²a³, (x+2)(x+1) ...), so algebra is
// judged by VALUE: both expressions are parsed and evaluated at several fixed
// points for every letter, and must agree at all of them.
//
// Equal value is not always enough. "Expand 2(x + 3)" answered "2(x + 3)" is
// equal and wrong, so is "Simplify 3x + 2x" answered "3x + 2x". formOk() asks
// for the same SHAPE as the key on top of equal value:
//   - a key with no brackets (expanded) needs an answer with no brackets;
//   - a key that is a product (factorised) needs an answer that is a product;
//   - the answer may not have more terms than the key (simplified fully), and
//     may not repeat a like term the key collects.
// The question's own verb (Expand / Factorise / Simplify) tightens this the
// same way, so a key written loosely still asks for the form the skill wants.
//
// Kept conservative on purpose: anything that is not plainly algebra (words,
// units, coordinates, times, remainders like "5r2") is left to the other
// matchers in answerCheck.js, which stay unchanged.
// ============================================================================

// Turn the common notations into one spelling. Shown back to the child as
// "Read as ..." so they can see how their typing was understood.
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function canonicalise(raw) {
  let s = String(raw ?? '').trim().toLowerCase();
  s = s.replace(/[−–—]/g, '-');
  s = s.replace(/⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + (m[0] === '⁻' ? '-' : '') + [...m.replace('⁻', '')].map((c) => SUP.indexOf(c)).join(''));
  s = s.replace(/\*\*/g, '^');
  s = s.replace(/[×·∙⋅]/g, '*').replace(/÷/g, '/');
  s = s.replace(/(squareroot(of)?|sqrt)/g, '√').replace(/\bpi\b|(?<=\d)pi\b/g, 'π');
  s = s.replace(/\s+/g, '');
  return s;
}

// ---- parser: + - * / ^, brackets, implicit multiplication, √, π ----
// Grammar (usual precedence; implicit product binds like *, so 1/2x = x/2):
//   sum := term (('+'|'-') term)*
//   term := unary (('*'|'/'|<implicit>) unary)*
//   unary := '-' unary | power
//   power := atom ('^' unary)?
//   atom := number | letter | 'π' | '√' atom | '(' sum ')'
function parse(src) {
  let i = 0;
  const peek = () => src[i];
  const fail = () => { throw new Error('parse'); };
  function sum() {
    const terms = [{ sign: 1, e: term() }];
    while (peek() === '+' || peek() === '-') {
      const sign = src[i++] === '-' ? -1 : 1;
      terms.push({ sign, e: term() });
    }
    return terms.length === 1 && terms[0].sign === 1 ? terms[0].e : { t: 'sum', terms };
  }
  function term() {
    const fs = [{ op: '*', e: unary() }];
    for (;;) {
      const c = peek();
      if (c === '*' || c === '/') { i++; fs.push({ op: c, e: unary() }); continue; }
      if (c != null && /[a-z(π√]/.test(c)) { fs.push({ op: '*', e: unary() }); continue; }
      // A digit straight after a letter or bracket ("x5", "(x+1)2") is not
      // a notation children are taught; "5r2" is a remainder. Refuse it.
      if (c != null && /[\d.]/.test(c)) fail();
      break;
    }
    return fs.length === 1 ? fs[0].e : { t: 'prod', fs };
  }
  function unary() {
    if (peek() === '-') { i++; return { t: 'neg', e: unary() }; }
    if (peek() === '+') { i++; return unary(); }
    return power();
  }
  function power() {
    const base = atom();
    if (peek() === '^') { i++; return { t: 'pow', a: base, n: unary() }; }
    return base;
  }
  function atom() {
    const c = peek();
    if (c == null) fail();
    if (/[\d.]/.test(c)) {
      const m = src.slice(i).match(/^\d*\.?\d+/);
      if (!m) fail();
      i += m[0].length;
      return { t: 'num', k: parseFloat(m[0]) };
    }
    if (c === 'π') { i++; return { t: 'num', k: Math.PI }; }
    if (c === '√') { i++; return { t: 'sqrt', e: atom() }; }
    if (/[a-z]/.test(c)) { i++; return { t: 'var', name: c }; }
    if (c === '(') {
      i++;
      const e = sum();
      if (peek() !== ')') fail();
      i++;
      return { t: 'br', e };
    }
    return fail();
  }
  const tree = sum();
  if (i !== src.length) fail();
  return tree;
}

function evaluate(e, env) {
  switch (e.t) {
    case 'num': return e.k;
    case 'var': return env[e.name];
    case 'br': return evaluate(e.e, env);
    case 'neg': return -evaluate(e.e, env);
    case 'sqrt': return Math.sqrt(evaluate(e.e, env));
    case 'pow': return Math.pow(evaluate(e.a, env), evaluate(e.n, env));
    case 'sum': return e.terms.reduce((s, t) => s + t.sign * evaluate(t.e, env), 0);
    case 'prod': return e.fs.reduce((p, f) => (f.op === '/' ? p / evaluate(f.e, env) : p * evaluate(f.e, env)), 1);
    default: return NaN;
  }
}

const varsOf = (e, out = new Set()) => {
  if (!e || typeof e !== 'object') return out;
  if (e.t === 'var') out.add(e.name);
  for (const v of Object.values(e)) {
    if (Array.isArray(v)) v.forEach((x) => varsOf(x.e ?? x, out));
    else if (v && typeof v === 'object') varsOf(v, out);
  }
  return out;
};

// Is this string plainly algebra we are willing to judge by value?
// Letters, but no word (four letters in a row), and nothing a unit, time,
// coordinate or list matcher should see instead.
const ALGEBRA_CHARS = /^[a-z0-9.+\-*/^()√π]+$/;
export function parseAlgebra(raw) {
  const s = canonicalise(raw);
  if (!s || !ALGEBRA_CHARS.test(s) || !/[a-z]/.test(s)) return null;
  if (/[a-z]{4,}/.test(s)) return null;
  // A bare run of three letters is a word ("odd", "yes", "tan"), not a product.
  if (/^[a-z]{3}$/.test(s)) return null;
  try { return parse(s); } catch { return null; }
}

// Fixed, awkward sample values (no 0, 1 or 2, so x² and 2x cannot agree by
// luck). Positive, so roots and fractional powers stay real.
const SAMPLES = [1.37, 2.71, 0.53, 3.19, 1.91, 4.43, 0.87];
function sameValue(a, b) {
  const names = [...new Set([...varsOf(a), ...varsOf(b)])].sort();
  let compared = 0;
  for (let k = 0; k < SAMPLES.length; k++) {
    const env = {};
    names.forEach((n, j) => { env[n] = SAMPLES[(k + 3 * j) % SAMPLES.length] + j * 0.11; });
    const x = evaluate(a, env), y = evaluate(b, env);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))) return false;
    compared++;
  }
  return compared >= 4;
}

// ---- form: what shape the key (and the question's verb) asks for ----
const strip = (e) => (e.t === 'br' ? strip(e.e) : e);
const hasBrackets = (s) => /[()]/.test(s);
const topTerms = (e) => { e = strip(e); return e.t === 'sum' ? e.terms.length : 1; };
const isProduct = (e) => {
  e = strip(e);
  if (e.t === 'neg') return isProduct(e.e);
  return e.t === 'prod' && e.fs.some((f) => strip(f.e).t === 'sum' || (f.e.t === 'br'))
    || (e.t === 'pow' && strip(e.a).t === 'sum');
};
// A term's letters and powers, ignoring its number: "3x²y" and "-x²y" share one.
const likeKey = (t) => {
  const pows = {};
  const walk = (e, p) => {
    e = strip(e);
    if (e.t === 'var') pows[e.name] = (pows[e.name] || 0) + p;
    else if (e.t === 'neg') walk(e.e, p);
    else if (e.t === 'prod') e.fs.forEach((f) => walk(f.e, f.op === '/' ? -p : p));
    else if (e.t === 'pow' && strip(e.n).t === 'num') walk(e.a, p * strip(e.n).k);
    else if (e.t !== 'num') pows['?' + JSON.stringify(e)] = 1;
  };
  walk(t, 1);
  return Object.keys(pows).filter((n) => pows[n]).sort().map((n) => n + pows[n]).join('');
};
const repeatsLikeTerm = (e) => {
  e = strip(e);
  if (e.t !== 'sum') return false;
  const keys = e.terms.map((t) => likeKey(t.e));
  return new Set(keys).size < keys.length;
};

// A product that is not collected: two numbers multiplied ("2·3x"), or the
// same letter twice ("x²·x³", "x·x"). Copying an index-law question back is
// equal in value but is not the answer.
const uncollected = (e) => {
  e = strip(e);
  if (e.t === 'prod') {
    const bases = e.fs.map((f) => { const g = strip(f.e); return g.t === 'pow' ? strip(g.a) : g; });
    if (bases.filter((b) => b.t === 'num').length > 1) return true;
    const names = bases.filter((b) => b.t === 'var').map((b) => b.name);
    if (new Set(names).size < names.length) return true;
  }
  for (const v of Object.values(e)) {
    if (Array.isArray(v) && v.some((x) => uncollected(x.e ?? x))) return true;
    if (v && typeof v === 'object' && !Array.isArray(v) && v.t && uncollected(v)) return true;
  }
  return false;
};
// Size of the tree, so an answer cannot be much longer than the key it equals.
const size = (e) => {
  if (!e || typeof e !== 'object') return 0;
  let n = e.t ? 1 : 0;
  for (const v of Object.values(e)) {
    if (Array.isArray(v)) v.forEach((x) => { n += size(x.e ?? x); });
    else if (v && typeof v === 'object') n += size(v);
  }
  return n;
};

export function wantedForm(question) {
  const q = String(question ?? '').toLowerCase();
  if (/\bexpand\b|\bremove the brackets\b|\bmultiply out\b/.test(q)) return 'expanded';
  if (/\bfactori[sz]e\b|\bfactor\b/.test(q)) return 'factorised';
  if (/\bsimplify\b|\bsimplest\b|\bcollect\b/.test(q)) return 'simplified';
  return null;
}

function formOk(userRaw, user, keyRaw, key, wanted) {
  const u = canonicalise(userRaw), k = canonicalise(keyRaw);
  if (topTerms(user) > topTerms(key)) return false;
  if (repeatsLikeTerm(user) && !repeatsLikeTerm(key)) return false;
  if (uncollected(user) && !uncollected(key)) return false;
  if (size(user) > size(key) + 1) return false;
  if (!hasBrackets(k) && hasBrackets(u)) return false;
  if (isProduct(key) && !isProduct(user)) return false;
  if (wanted === 'expanded' && hasBrackets(u)) return false;
  if (wanted === 'factorised' && !isProduct(user)) return false;
  if (wanted === 'simplified' && repeatsLikeTerm(user)) return false;
  return true;
}

// Expressions on each side of "=" are compared side by side ("y = 2x + 3"
// accepts "y = 3 + 2x"; the sides are not swapped).
export function algebraicallyEqual(userRaw, keyRaw, question) {
  const us = String(userRaw ?? '').split('='), ks = String(keyRaw ?? '').split('=');
  if (us.length !== ks.length || us.length > 2) return false;
  const wanted = wantedForm(question);
  return us.every((u, i) => {
    const kRaw = ks[i];
    const key = parseAlgebra(kRaw);
    if (!key) {
      // A plain side ("y", "8") that is written the same is fine; otherwise no.
      return us.length > 1 && canonicalise(u) === canonicalise(kRaw);
    }
    const user = parseAlgebra(u);
    if (!user) return false;
    return sameValue(user, key) && formOk(u, user, kRaw, key, wanted);
  });
}

// What the child's typing was read as, in the notation the questions use
// (x^9 shows as x⁹, 5*x as 5x). Null when there is nothing worth showing.
export function readAs(raw) {
  const s = String(raw ?? '');
  if (!/[\^*×·÷]|\*\*|sqrt|squareroot/i.test(s)) return null;
  if (!parseAlgebra(s)) return null;
  const out = canonicalise(s)
    .replace(/\^(-?)(\d+)/g, (_, m, d) => (m ? '⁻' : '') + [...d].map((c) => SUP[+c]).join(''))
    .replace(/(\d)\*(?=[a-z(√π])/g, '$1')
    .replace(/([a-z)])\*(?=[a-z(√π])/g, '$1')
    .replace(/\*/g, ' × ').replace(/\//g, ' / ')
    .replace(/(?<=[^\s(^])([+-])/g, ' $1 ');
  return out === s.trim() ? null : out;
}
