// ============================================================================
// THE BOARD'S MATHS: a tiny grammar, so the model never sends LaTeX or markup.
//
//   digits and decimals     3   12   0.5
//   a missing number        ?
//   signs                   + - − × ÷ = < > * / (x and * read as ×, / as ÷)
//   brackets                ( )
//   a power                 2^3
//   a fraction              frac(3,4)      frac(2×3, 4×3)
//   a mixed number          mixed(1,3,4)
//
// parseMath(expr) -> { ok, tree } | { ok:false, error }. layoutMath(tree)
// measures it for the SVG renderer in Board.jsx. Pure, tested in node.
// ============================================================================
const MAX_LEN = 80;
const MAX_DEPTH = 3;
const SIGN = { '+': '+', '-': '−', '−': '−', '×': '×', '*': '×', x: '×', '÷': '÷', '/': '÷', '=': '=', '<': '<', '>': '>' };

function tokens(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ') { i += 1; continue; }
    const num = /^\d+(\.\d+)?/.exec(src.slice(i));
    if (num) { out.push({ t: 'num', v: num[0] }); i += num[0].length; continue; }
    const fn = /^(frac|mixed)\(/.exec(src.slice(i));
    if (fn) { out.push({ t: 'fn', v: fn[1] }); i += fn[0].length; continue; }
    if (c === '?') { out.push({ t: 'gap' }); i += 1; continue; }
    if (SIGN[c]) { out.push({ t: 'op', v: SIGN[c] }); i += 1; continue; }
    if ('(),^'.includes(c)) { out.push({ t: c }); i += 1; continue; }
    return { error: `the character "${c}" is not allowed in maths` };
  }
  return { out };
}

/** @returns {{ok:true, tree:object}|{ok:false, error:string}} */
export function parseMath(expr) {
  const src = String(expr ?? '').trim();
  if (!src) return { ok: false, error: 'empty maths' };
  if (src.length > MAX_LEN) return { ok: false, error: `maths longer than ${MAX_LEN}` };
  const tk = tokens(src);
  if (tk.error) return { ok: false, error: tk.error };
  const t = tk.out;
  let p = 0;
  const fail = (e) => { throw new Error(e); };
  // seq := (atom | op)+ ; ends at ')' or ',' or end
  const seq = (depth) => {
    if (depth > MAX_DEPTH) fail('maths nested too deeply');
    const parts = [];
    while (p < t.length && t[p].t !== ')' && t[p].t !== ',') {
      if (t[p].t === 'op') { parts.push({ k: 'op', v: t[p].v }); p += 1; continue; }
      parts.push(power(depth));
    }
    if (!parts.length) fail('something is missing');
    return { k: 'seq', parts };
  };
  const power = (depth) => {
    const base = atom(depth);
    if (t[p]?.t === '^') { p += 1; return { k: 'pow', base, exp: atom(depth + 1) }; }
    return base;
  };
  const args = (n, depth) => {
    const out = [seq(depth + 1)];
    while (t[p]?.t === ',') { p += 1; out.push(seq(depth + 1)); }
    if (t[p]?.t !== ')') fail('a bracket is not closed');
    p += 1;
    if (out.length !== n) fail(`expected ${n} numbers in the brackets`);
    return out;
  };
  const atom = (depth) => {
    const x = t[p];
    if (!x) fail('the maths ends too early');
    if (x.t === 'num') { p += 1; return { k: 'num', v: x.v }; }
    if (x.t === 'gap') { p += 1; return { k: 'gap' }; }
    if (x.t === 'fn' && x.v === 'frac') { p += 1; const [a, b] = args(2, depth); return { k: 'frac', a, b }; }
    if (x.t === 'fn' && x.v === 'mixed') {
      p += 1; const [w, a, b] = args(3, depth);
      for (const s of [w, a, b]) if (s.parts.length !== 1 || !['num', 'gap'].includes(s.parts[0].k)) fail('a mixed number takes three plain numbers');
      return { k: 'mixed', w, a, b };
    }
    if (x.t === '(') {
      p += 1; const inner = seq(depth + 1);
      if (t[p]?.t !== ')') fail('a bracket is not closed');
      p += 1; return { k: 'br', inner };
    }
    return fail(`unexpected "${x.v || x.t}"`);
  };
  try {
    const tree = seq(0);
    if (p !== t.length) fail(t[p].t === ',' ? 'a comma outside a fraction' : 'a bracket closes without opening');
    return { ok: true, tree };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ---------------------------------------------------------------- layout
// Units are font-size multiples: w is width, a is height above the baseline,
// d is depth below it. Board.jsx scales by the item's size.
const CH = 0.6;   // a digit's width
const OPW = 1.0;  // a sign with its spaces
const textBox = (s) => ({ w: s.length * CH, a: 0.72, d: 0.2 });

export function layoutMath(node, scale = 1) {
  switch (node.k) {
    case 'num': return { ...node, box: mul(textBox(node.v), scale), scale };
    case 'gap': return { ...node, box: mul({ w: 0.9, a: 0.8, d: 0.2 }, scale), scale };
    case 'op': return { ...node, box: mul({ w: OPW, a: 0.72, d: 0.2 }, scale), scale };
    case 'seq': {
      const parts = node.parts.map((x) => layoutMath(x, scale));
      return { ...node, parts, box: { w: parts.reduce((s, x) => s + x.box.w, 0), a: Math.max(...parts.map((x) => x.box.a)), d: Math.max(...parts.map((x) => x.box.d)) }, scale };
    }
    case 'br': {
      const inner = layoutMath(node.inner, scale);
      return { ...node, inner, box: { w: inner.box.w + 0.8 * scale, a: Math.max(inner.box.a, 0.8 * scale), d: Math.max(inner.box.d, 0.25 * scale) }, scale };
    }
    case 'pow': {
      const base = layoutMath(node.base, scale);
      const exp = layoutMath(node.exp, scale * 0.6);
      return { ...node, base, exp, box: { w: base.box.w + exp.box.w, a: base.box.a + exp.box.a * 0.6, d: base.box.d }, scale };
    }
    case 'frac': {
      const s = scale * 0.85;
      const a = layoutMath(node.a, s);
      const b = layoutMath(node.b, s);
      const w = Math.max(a.box.w, b.box.w) + 0.4 * scale;
      // The bar sits at 0.3 above the baseline (the maths axis).
      return { ...node, a, b, box: { w, a: 0.3 * scale + 0.12 * scale + a.box.a + a.box.d, d: -0.3 * scale + 0.12 * scale + b.box.a + b.box.d }, scale };
    }
    case 'mixed': {
      const w = layoutMath(node.w, scale);
      const f = layoutMath({ k: 'frac', a: node.a, b: node.b }, scale);
      return { ...node, wl: w, fl: f, box: { w: w.box.w + 0.1 * scale + f.box.w, a: Math.max(w.box.a, f.box.a), d: Math.max(w.box.d, f.box.d) }, scale };
    }
    default: return { ...node, box: { w: 0, a: 0, d: 0 }, scale };
  }
}
const mul = (b, s) => ({ w: b.w * s, a: b.a * s, d: b.d * s });

/** Plain words for the transcript and the logs: frac(3,4) -> 3/4. */
export function mathToText(node) {
  if (!node) return '';
  switch (node.k) {
    case 'num': return node.v;
    case 'gap': return '?';
    case 'op': return ` ${node.v} `;
    case 'seq': return node.parts.map(mathToText).join('').replace(/\s+/g, ' ').trim();
    case 'br': return `(${mathToText(node.inner)})`;
    case 'pow': return `${mathToText(node.base)}^${mathToText(node.exp)}`;
    case 'frac': return `${mathToText(node.a)}/${mathToText(node.b)}`;
    case 'mixed': return `${mathToText(node.w)} ${mathToText(node.a)}/${mathToText(node.b)}`;
    default: return '';
  }
}

export default { parseMath, layoutMath, mathToText };
