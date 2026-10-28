// Tick labels for the fraction number line. Only the ends are named: a line
// that names every tick has already placed the fraction for the child (F22,
// "Place 1/2 on the number line" with 1/2 written under the middle tick).
// `labelTicks` names every tick, for a picture that teaches rather than asks.
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };

export function numberLineLabel(j, steps, denom, max = 1, labelTicks = false) {
  if (j === 0) return '0';
  if (j === steps) return `${max}`;
  if (!labelTicks) return '';
  const g = gcd(j, denom);
  return `${j / g}/${denom / g}`;
}
