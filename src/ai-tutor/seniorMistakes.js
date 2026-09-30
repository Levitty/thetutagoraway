// ============================================================================
// GRADE 10-12 MISTAKES — the wrong answer each typical senior mistake gives,
// per skill, read from that skill's own question format.
//
// Senior mistakes are specific to the topic (log(a + b) for log a + log b,
// forgetting to bring the power down, adding both tails of a normal curve),
// so they are listed by skill rather than guessed from the wording.
// Feedback names the mistake without stating the answer.
// seniorMistakes(skillId, problem) -> [{ when, feedback, source: 'catalogue' }]
// ============================================================================

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };
const r = (x, dp) => String(Number(Number(x).toFixed(dp)));
const fx = (x, dp) => Number(x).toFixed(dp);
const num = (s) => Number(String(s).replace(/[−–]/g, '-'));
const C = (n, k) => { let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return c; };
const D = Math.PI / 180;

const RULES = {
  G10_LOGARITHMS_INTRO: (q) => {
    let m;
    if ((m = q.match(/^log₍(\d+)₎\((\d+)\) = \?/))) return [[num(m[2]) / num(m[1]), `A logarithm asks for a power: ${m[1]} to what power gives ${m[2]}? It is not ${m[2]} ÷ ${m[1]}.`]];
    if ((m = q.match(/^log₍(\d+)₎\(x\) = (\d+)/))) return [[num(m[1]) * num(m[2]), `x is ${m[1]} to the power ${m[2]}, not ${m[1]} × ${m[2]}.`]];
    if ((m = q.match(/^Solve (\d+)\^x = (\d+)/))) return [[num(m[2]) / num(m[1]), `x is how many ${m[1]}s multiply together, not ${m[2]} ÷ ${m[1]}.`]];
    if ((m = q.match(/^log₍(\d+)₎\(1\/(\d+)\)/))) { const e = Math.round(Math.log(num(m[2])) / Math.log(num(m[1]))); return [[e, 'One over a power is a NEGATIVE power.']]; }
    if (/\+ log₍\d+₎\(1\)/.test(q)) return [['2', 'The log of 1 is 0 in every base, because anything to the power 0 is 1.']];
    return [];
  },
  G10_LOG_LAWS: (q) => {
    let m;
    if ((m = q.match(/log\((\d+)\) \+ log\((\d+)\)/))) return [[`log(${num(m[1]) + num(m[2])})`, 'Adding logs MULTIPLIES the numbers inside: log a + log b = log(ab).']];
    if ((m = q.match(/log\((\d+)\) - log\((\d+)\)/))) return [[`log(${num(m[1]) - num(m[2])})`, 'Subtracting logs DIVIDES the numbers inside: log a − log b = log(a/b).']];
    if ((m = q.match(/Simplify: (\d+)log\((\d+)\)/))) return [[`log(${num(m[1]) * num(m[2])})`, 'The number in front becomes a POWER: n log a = log(aⁿ).']];
    return [];
  },
  G10_SURDS_ADV: (q) => {
    const m = q.match(/(\d+)\/√(\d+)/); if (!m) return [];
    return [[`${m[1] === '1' ? '' : m[1]}√${m[2]}`, `Multiplying the top by √${m[2]} means multiplying the bottom by √${m[2]} too: the bottom becomes ${m[2]}.`]];
  },
  G10_POLYNOMIALS: (q) => {
    const m = q.match(/1x² \+ (\d+)x \+ (\d+) by \(x \+ (\d+)\)/); if (!m) return [];
    const [b, c, d] = [num(m[1]), num(m[2]), num(m[3])], qq = b + d;
    return [[`x + ${qq} remainder ${c + d * qq}`, `Dividing by (x + ${d}): at each step you SUBTRACT ${d} times the quotient term.`]];
  },
  G10_REMAINDER_THEOREM: (q) => {
    const m = q.match(/x² ([+-]) (\d+)x ([+-]) (\d+)\. Find f\((-?\d+)\)/); if (!m) return [];
    const b = (m[1] === '-' ? -1 : 1) * num(m[2]), c = (m[3] === '-' ? -1 : 1) * num(m[4]), v = num(m[5]);
    const out = [[v * v - b * v + c === v * v + b * v + c ? null : (v * v) + b * (-v) + c, `Put x = ${v} in exactly, with its sign.`]];
    if (v < 0) out.push([-(v * v) + b * v + c, `(${v})² is positive: a negative number squared is positive.`]);
    return out;
  },
  G10_PARTIAL_FRACTIONS: (q, p) => {
    const m = String(p.answer).match(/A=(-?\d+), B=(-?\d+)/); if (!m || m[1] === m[2]) return [];
    return [[`A=${m[2]}, B=${m[1]}`, 'A and B are swapped. A goes with the first bracket: put x = (minus its number) to find A.']];
  },
  G10_BINOMIAL_THEOREM: (q) => {
    const m = q.match(/x\^(\d+) in \(1 \+ (\d*)x\)\^(\d+)/); if (!m) return [];
    const r0 = num(m[1]), k = num(m[2] || 1), n = num(m[3]);
    return k > 1 ? [[C(n, r0), `The ${k} is inside the bracket, so it is raised to the power ${r0} too.`], [C(n, r0) * k, `Raise the ${k} to the power ${r0}, don't just multiply by it once.`]]
      : [[n, `Use the binomial coefficient ${n}C${r0}, not just ${n}.`]];
  },
  G10_FUNCTIONS_ADV: (q) => {
    const m = q.match(/f\(x\) = (\d+)x \+ (\d+)\. Find f⁻¹\((\d+)\)/); if (!m) return [];
    const [a, b, y] = [num(m[1]), num(m[2]), num(m[3])];
    return [[a * y + b, `That is f(${y}). The inverse undoes f: which x gives ${y}?`], [r((y + b) / a, 4), `To undo "+ ${b}", subtract ${b}, then divide.`]];
  },
  G10_EXPONENTIAL_GRAPHS: (q) => {
    let m;
    if ((m = q.match(/y = (\d+)\^x, what is y when x = −1/))) return [[`-${m[1]}`, 'A negative power does not make the answer negative: it means one over.']];
    if ((m = q.match(/y = (\d+)\^x, what is y when x = (\d+)/))) return [[num(m[1]) * num(m[2]), `${m[1]}^${m[2]} means ${m[1]} multiplied by itself ${m[2]} times, not ${m[1]} × ${m[2]}.`]];
    if ((m = q.match(/y = (\d+) × (\d+)\^x cross the y-axis/))) return [[num(m[1]) * num(m[2]), 'On the y-axis x = 0, and anything to the power 0 is 1.']];
    return [];
  },
  G10_CIRCLE_THEOREMS_ADV: (q) => {
    const m = q.match(/circumference is (\d+)°/); if (!m) return [];
    return [[180 - num(m[1]), 'The angle in a semicircle is 90°, so the other two angles of the triangle add up to 90°, not 180°.']];
  },
  G10_TRIG_IDENTITIES: (q) => {
    const m = q.match(/(sin|cos|tan)\(θ\) = (\d+)\/(\d+)\. Find (sin|cos|tan)/); if (!m) return [];
    const [g, a, c, want] = [m[1], num(m[2]), num(m[3]), m[4]];
    const out = [];
    if (g !== 'tan' && want !== 'tan') out.push([frac(c - a, c), 'sin²θ + cos²θ = 1 uses the SQUARES: you cannot just take the fraction away from 1.']);
    out.push([frac(c, a), 'You turned the fraction upside down. Draw the right-angled triangle and label its sides.']);
    return out;
  },
  G10_TRIG_EQUATIONS: (q, p) => {
    const sols = (String(p.answer).match(/\d+/g) || []).map(Number); if (sols.length !== 2) return [];
    const fn = (q.match(/(sin|cos|tan)\(θ\)/) || [])[1], neg = /= −|= −/.test(q) || /\) = −/.test(q);
    const out = sols.map(s => [`${s}°`, 'There are two answers between 0° and 360°. Use the quadrants (CAST) to find the other one.']);
    if (neg) {
      const ref = Math.min(...sols.map(s => Math.min(s % 180, 180 - (s % 180))));
      const pos = { sin: [ref, 180 - ref], cos: [ref, 360 - ref], tan: [ref, 180 + ref] }[fn];
      if (pos) out.push([`${pos[0]}° and ${pos[1]}°`, `Those angles give a positive value. ${fn} is negative in the other two quadrants.`]);
    }
    return out;
  },
  G10_SINE_COSINE_RULE: (q) => {
    const m = q.match(/a=(\d+), b=(\d+), C=(\d+)°/); if (!m) return [];
    const [a, b, Cd] = m.slice(1).map(Number), t = 2 * a * b * Math.cos(Cd * D);
    return [[fx(a * a + b * b, 1), 'That is Pythagoras. The cosine rule takes away 2ab cos C.'], [fx(a * a + b * b + t, 1), 'The sign of 2ab cos C is minus: c² = a² + b² − 2ab cos C.']];
  },
  G10_3D_TRIG: (q) => {
    const m = q.match(/(\d+)×(\d+)×(\d+)/); if (!m) return [];
    const [l, w, h] = m.slice(1).map(Number);
    return [[l + w + h, 'The diagonal is not the three lengths added. Use Pythagoras in 3D: √(l² + w² + h²).'], [l * l + w * w + h * h, 'That is the diagonal squared. Take the square root.'], [fx(Math.sqrt(l * l + w * w), 2), 'That is the diagonal of the base only. Include the height.']];
  },
  G10_VECTORS_INTRO: (q) => {
    const m = q.match(/\((-?\d+), (-?\d+)\)/); if (!m) return [];
    const [x, y] = [num(m[1]), num(m[2])];
    return [[Math.abs(x) + Math.abs(y), 'The length is not the parts added: use Pythagoras, √(x² + y²).'], [x * x + y * y, 'That is the length squared. Take the square root.']];
  },
  G10_VECTORS_OPS: (q) => {
    const m = q.match(/\((-?\d+), (-?\d+)\) \+ \((-?\d+), (-?\d+)\)/); if (!m) return [];
    const [a, b, c, d] = m.slice(1).map(Number);
    return [[`(${a + b}, ${c + d})`, 'Add x to x and y to y: first numbers together, second numbers together.']];
  },
  G10_PROBABILITY_DISTRIBUTIONS: (q) => {
    let m;
    if ((m = q.match(/B\((\d+), ([\d.]+)\)\. Find the variance/))) return [[r(num(m[1]) * num(m[2]), 4), 'That is the mean (np). The variance is np(1 − p).']];
    if ((m = q.match(/B\((\d+), ([\d.]+)\)\. Find the mean/))) return [[r(num(m[1]) * num(m[2]) * (1 - num(m[2])), 4), 'That is the variance. The mean is just n × p.']];
    if (/Find E\(X\)/.test(q)) return [['1.5', 'That is the average of 0, 1, 2 and 3. E(X) weights each value by its probability.'], ['1', 'That is the total probability. E(X) = Σ x × P(X = x).']];
    return [];
  },
  G11_MATRICES_INTRO: (q) => {
    const m = q.match(/\[(\d+) (\d+); (\d+) (\d+)\]/); if (!m || m[2] === m[3]) return [];
    return [[m[3], 'a₁₂ means row 1, column 2: along the top row, second number.']];
  },
  G11_MATRICES_OPS: (q) => {
    const m = q.match(/\[(\d+) (\d+); (\d+) (\d+)\] \+ \[(\d+) (\d+); (\d+) (\d+)\]/); if (!m) return [];
    const v = m.slice(1).map(Number);
    return [[`[${v[0] * v[4]} ${v[1] * v[5]}; ${v[2] * v[6]} ${v[3] * v[7]}]`, 'Adding matrices adds matching positions; it does not multiply them.']];
  },
  G11_MATRICES_INVERSE: (q) => {
    const m = q.match(/\[(\d+) (\d+); (\d+) (\d+)\]/); if (!m) return [];
    const [a, b, c, d] = m.slice(1).map(Number);
    return [[a * d + b * c, 'det = ad − bc: SUBTRACT the second diagonal.'], [a * b - c * d, 'Multiply along the diagonals (top-left × bottom-right), not along the rows.']];
  },
  G11_LINEAR_PROGRAMMING: (q) => {
    const m = q.match(/P = (\d+)x \+ (\d+)y subject to x \+ y ≤ (\d+)/); if (!m) return [];
    const [a, b, k] = m.slice(1).map(Number);
    return /maximum value/.test(q) ? [[Math.min(a, b) * k, 'Check the value of P at EVERY corner and pick the biggest.'], [(a + b) * k, `(${k}, ${k}) is not in the region: x + y must be at most ${k}. Use the corners.`]]
      : [[a > b ? `(0, ${k})` : `(${k}, 0)`, 'Work out P at each corner: the corner with the bigger coefficient wins.']];
  },
  // G11_LIMITS: its mistakes are written into each question (problemGenerators.js).
  G11_DIFF_FIRST_PRINCIPLES: (q) => {
    let m;
    if ((m = q.match(/f\(x\) = (\d*)x\^(\d+) from first principles/))) { const a = num(m[1] || 1), n = num(m[2]);
      return [[`${a === 1 ? '' : a}x^${n - 1}`, 'Bring the power down as a multiplier as well.'], [`${a * n}x^${n}`, 'Reduce the power by 1 as well.']]; }
    if ((m = q.match(/f\(x\) = (\d*)x\^(\d+)\. .*f'\((\d+)\)/))) { const a = num(m[1] || 1), n = num(m[2]), x = num(m[3]);
      return [[a * x ** n, `That is f(${x}), the height. The gradient needs f'(x) first.`]]; }
    return [];
  },
  G11_DIFF_APPLICATIONS: (q) => {
    const m = q.match(/f\(x\) = (\d+)x² - (\d+)x \+ (\d+)/); if (!m) return [];
    const [a, b] = [num(m[1]), num(m[2])];
    return [[r(b / (2 * a), 2), "That is the x where the minimum happens. Put it back into f(x) to get the minimum VALUE."]];
  },
  G11_TRIG_GRAPHS: (q) => {
    let m;
    if ((m = q.match(/y = (sin|cos)\((\d+)x\)\. What is the period/))) return [[360 * num(m[2]), 'Multiplying x SQUEEZES the wave: divide 360° by the number, don\'t multiply.']];
    if ((m = q.match(/y = (\d+)(sin|cos)\(x\) \+ (\d+)\. What is the maximum/))) return [[m[1], `Don't forget to move the whole wave up by ${m[3]}.`]];
    if ((m = q.match(/y = (\d+)(sin|cos)\(x\) \+ (\d+)\. What is the minimum/))) return [[`-${m[1]}`, `Don't forget to move the whole wave up by ${m[3]}.`], [num(m[3]) + num(m[1]), 'That is the maximum. The minimum is when the wave is lowest.']];
    if ((m = q.match(/y = (\d+)(sin|cos)\(\d*x\)\. What is the amplitude/))) return [[2 * num(m[1]), 'Amplitude is from the middle line to the top, not from the bottom to the top.']];
    return [];
  },
  G11_TRIG_ADDITION: (q) => {
    const m = q.match(/(sin|cos)\((\d+)° ([+−]) (\d+)°\)/); if (!m) return [];
    const f = Math[m[1]], A = num(m[2]) * D, B = num(m[4]) * D, plus = m[3] === '+';
    return [[fx(plus ? f(A) + f(B) : f(A) - f(B), 3), `${m[1]}(A ${m[3]} B) is not ${m[1]} A ${m[3]} ${m[1]} B: use the formula.`]];
  },
  G11_TRIG_DOUBLE_ANGLE: (q) => {
    const m = q.match(/(sin|cos)\(θ\) = (\d+)\/(\d+)\. Find (sin|cos|tan)\(2θ\)/); if (!m) return [];
    const [g, a, c, w] = [m[1], num(m[2]), num(m[3]), m[4]], b = Math.round(Math.sqrt(c * c - a * a));
    const s = g === 'sin' ? a : b, co = g === 'sin' ? b : a;
    return [[w === 'sin' ? frac(2 * s, c) : w === 'cos' ? frac(2 * co, c) : frac(2 * s, co), `${w}(2θ) is not 2${w}θ: use the double-angle formula.`]];
  },
  G11_VECTORS_3D: (q) => {
    const m = q.match(/\((-?\d+), (-?\d+), (-?\d+)\)/); if (!m) return [];
    const v = m.slice(1).map(Number);
    return [[v.reduce((s, x) => s + Math.abs(x), 0), 'Use √(x² + y² + z²), not the parts added.'], [v.reduce((s, x) => s + x * x, 0), 'That is the length squared. Take the square root.']];
  },
  G11_BINOMIAL_DISTRIBUTION: (q) => {
    const m = q.match(/B\((\d+), ([\d.]+)\)\. Find P\(X (=|≤) (\d)\)/); if (!m) return [];
    const n = num(m[1]), p = num(m[2]), k = num(m[4]), P = (j) => C(n, j) * p ** j * (1 - p) ** (n - j);
    return m[3] === '=' ? [[fx(p ** k * (1 - p) ** (n - k), 4), `Multiply by ${n}C${k}: that counts the different orders the successes can come in.`]]
      : [[fx(P(1), 4), 'X ≤ 1 includes X = 0 as well: add P(X = 0).']];
  },
  G11_NORMAL_DISTRIBUTION: (q, p) => {
    const tail = { 16: '32', 2.5: '5', 0.15: '0.3' }[num(p.answer)];
    if (/above/.test(q) && tail) return [[tail, 'Only ONE tail is above: the rest is split equally between the two tails.']];
    if (/between/.test(q)) return ['68', '95', '99.7'].filter(v => v !== String(p.answer))
      .map(v => [v, 'Count how many standard deviations each end is from the mean first, then use the rule for that many.']);
    return [];
  },
  G12_AREA_UNDER_CURVE: (q) => {
    const m = q.match(/y = (\d*)x(²|³)? and the x-axis from x = (\d+) to x = (\d+)/); if (!m) return [];
    const k = num(m[1] || 1), n = m[2] === '²' ? 2 : m[2] === '³' ? 3 : 1, a = num(m[3]), b = num(m[4]);
    return [[k * (b ** (n + 1) - a ** (n + 1)), 'Divide by the new power after raising it.'], ...(a ? [[frac(k * b ** (n + 1), n + 1), `Subtract the value at x = ${a}, the lower limit.`]] : [])];
  },
  G12_DIFF_EQ_INTRO: (q) => {
    let m;
    if ((m = q.match(/dy\/dx = (\d+)x and y = (\d+) when x = 0\. Find y when x = (\d+)/))) { const [a, c, x] = m.slice(1).map(Number); return c ? [[a * x * x / 2, `Add the constant: y = ${c} when x = 0.`]] : [[a * x, 'Integrate: raise the power of x and divide by the new power.']]; }
    if ((m = q.match(/dy\/dx = (\d+) and y = (\d+) when x = 0\. Find y when x = (\d+)/))) { const [a, c, x] = m.slice(1).map(Number); return c ? [[a * x, `Add the constant: y = ${c} when x = 0.`]] : []; }
    if ((m = q.match(/dy\/dx = (\d+)x² and y = (\d+) when x = 0\. Find y when x = (\d+)/))) { const [a, c, x] = m.slice(1).map(Number); return [[a * x ** 3 + c, 'Divide by the new power (3) after integrating.']]; }
    if ((m = q.match(/Solve dy\/dx = (\d+)x/))) return [[`y = ${m[1]}x²`, 'Integrating x gives x²/2: divide by the new power.']];
    return [];
  },
  G12_FURTHER_INTEGRATION: (q) => {
    let m;
    if ((m = q.match(/integral of (\d+)\/x dx from x = 1 to x = e\./))) return [[num(m[1]) * 2, 'The integral of 1/x is ln|x|, and ln(e) = 1, ln(1) = 0.']];
    if ((m = q.match(/eˣ dx from x = 0 to x = ln\((\d+)\)/))) return [[m[1], 'Subtract the value at x = 0: e⁰ is 1, not 0.']];
    if ((m = q.match(/(\d+)\/x dx from x = 1 to x = e²/))) return [[m[1], 'ln(e²) = 2, not 1.']];
    return [];
  },
  G12_COMPLEX_NUMBERS: (q) => {
    const m = q.match(/z = (\d+) \+ (\d+)i/); if (!m) return [];
    const [a, b] = [num(m[1]), num(m[2])];
    return [[a + b, '|z| is the distance from 0: √(a² + b²), not a + b.'], [a * a + b * b, 'That is |z|². Take the square root.']];
  },
  G12_PARAMETRIC_EQ: (q) => {
    const m = q.match(/x = (\d+)t and y = (\d+)t²\. Find y when x = (\d+)/); if (!m) return [];
    const [p, k, X] = m.slice(1).map(Number);
    return [[k * X * X, `Find t first: x = ${p}t, so t = ${X} ÷ ${p}. Then put t into y.`]];
  },
  G12_VECTORS_ADV: (q) => {
    const m = q.match(/\((-?\d+),(-?\d+),(-?\d+)\) · \((-?\d+),(-?\d+),(-?\d+)\)/); if (!m) return [];
    const v = m.slice(1).map(Number);
    return [[v[0] * v[3] + v[1] * v[4], 'Include the z parts: x₁x₂ + y₁y₂ + z₁z₂.'], [v.reduce((s, x) => s + x, 0), 'Multiply matching parts, then add: not all the numbers added together.']];
  },
  G12_POLAR_COORDS: (q, p) => {
    const m = String(p.answer).match(/^\((-?[\d.]+), (-?[\d.]+)\)$/); if (!m || m[1] === m[2]) return [];
    return [[`(${m[2]}, ${m[1]})`, 'x uses cos θ and y uses sin θ: the two are swapped.']];
  },
  G12_PROOF: (q) => {
    let m;
    if ((m = q.match(/What is 2\^(\d+) − 1\?/))) return [[2 ** num(m[1]), 'Take away the 1 as well.']];
    if ((m = q.match(/Check it for n = (\d+): what is/))) return [[2 * num(m[1]), 'n² means n × n, not 2n.']];
    if ((m = q.match(/n\(n\+1\)\/2 for n = (\d+)/))) return [[num(m[1]) * (num(m[1]) + 1), 'Divide by 2 as well.']];
    return [];
  },
  G12_HYPOTHESIS_TESTING: (q, p) => [[p.answer === 'yes' ? 'no' : 'yes', 'Reject H₀ only when the p-value is SMALLER than the significance level.']],
  G12_CORRELATION_REGRESSION: (q, p) => {
    const [s, d] = String(p.answer).split(' ');
    return [[`${s} ${d === 'positive' ? 'negative' : 'positive'}`, 'The sign of r gives the direction: + is positive, − is negative.'],
      ...['strong', 'moderate', 'weak'].filter(x => x !== s).map(x => [`${x} ${d}`, 'Size of r: 0.7 to 1 is strong, 0.4 to 0.7 moderate, below 0.4 weak.'])];
  },
};

export function seniorMistakes(skillId, p) {
  const f = RULES[skillId];
  if (!f || !p || typeof p.question !== 'string') return [];
  let list;
  try { list = f(p.question.replace(/\s+/g, ' '), p) || []; } catch { return []; }
  return list.filter(([w]) => w != null && w !== '' && String(w) !== 'NaN')
    .map(([w, fb]) => ({ when: typeof w === 'number' ? String(Number(w.toPrecision(12))) : String(w), feedback: fb, source: 'catalogue' }));
}

export const SENIOR_MISTAKE_SKILLS = Object.keys(RULES);
