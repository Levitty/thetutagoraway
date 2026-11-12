// ============================================================================
// THE GRADE 5 MATHS FIGURES (rendering engine phase 2, 12 Nov 2026): what each
// figure is, never how it is drawn (figureDraw.js draws it, stroke by stroke).
//
//   fraction     a bar, a circle or a grid in equal parts, with a second one to
//                compare (equivalence, which is more); the child taps parts to shade
//   numberline   a line from..to in equal steps, labelled as wholes, fractions or
//                decimals, with jumps; the child drags a marker or makes jumps
//   place_value  a chart up to hundreds of thousands; the child builds a number
//   angle        two arms and a protractor; the child turns the arm or the protractor
//   area         a rectangle (or an L) on squares; the child counts the squares
//                (area) or traces the edges (perimeter)
//   graph        axes with numbered steps and points; the child places points
//
// Each type: its PARAMETERS (spec.js kinds), the CONTROLS the child may be given
// (how each action changes the figure, and what it is called in plain words),
// GOALS the app marks itself, its PARTS (for highlight and point), and
// describe(): what it shows now, in plain words, for the tutor's next turn.
// Pure. Tested in tests/draw-figures.test.mjs.
// ============================================================================
import { checkParams, checkControls, checkGoal, recordOf, Refused, roundTo } from './spec.js';

export const fmt = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fracText = (n, d) => (d === 1 ? String(n) : `${n}/${d}`);
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

// ── fraction ────────────────────────────────────────────────────────────────
const modelFields = {
  parts: { kind: 'int', min: 1, max: 12, default: 4 },
  rows: { kind: 'int', min: 1, max: 10, default: 10 },
  cols: { kind: 'int', min: 1, max: 10, default: 10 },
  shaded: { kind: 'int', min: 0, max: 100, default: 0 },
};
/** How many equal parts a model has: a grid's are its squares. */
export const modelParts = (shape, m) => (shape === 'grid' ? m.rows * m.cols : m.parts);
const modelOf = (p, which) => (which === 2 ? p.second : p);
const shadedTotal = (p, st, which) => (which === 2 ? (p.second?.shaded || 0) + st.shade_second.length : p.shaded + st.shade.length);
const shadeAct = (which) => ({
  needs: which === 2 ? (p) => (p.second ? null : 'there is no second model') : null,
  act(p, st, part) {
    const m = modelOf(p, which);
    const n = modelParts(p.shape, m);
    if (!Number.isInteger(part) || part < 1 || part > n || part <= m.shaded) return null;
    const key = which === 2 ? 'shade_second' : 'shade';
    const on = st[key].includes(part);
    const list = on ? st[key].filter((x) => x !== part) : [...st[key], part];
    return { state: { ...st, [key]: list }, text: `${on ? 'took the shading off' : 'shaded'} part ${part}${p.second ? ` of the ${which === 2 ? 'second' : 'first'} ${p.shape}` : ''}` };
  },
});
const shadeGoal = (which) => ({
  control: [which === 2 ? 'shade_second' : 'shade'],
  params: { n: { kind: 'int', min: 0, max: 100 }, d: { kind: 'int', min: 1, max: 100 } },
  rule: (g) => (g.n > g.d ? 'goal: more than the whole' : null),
  met: (p, st, g) => shadedTotal(p, st, which) * g.d === g.n * modelParts(p.shape, modelOf(p, which)),
  text: (g, p) => `shade ${fracText(g.n, g.d)} of the ${p.second ? (which === 2 ? 'second ' : 'first ') : ''}${p.shape}`,
});
export const fraction = {
  type: 'fraction',
  title: 'fraction model',
  params: {
    shape: { kind: 'enum', values: ['bar', 'circle', 'grid'], default: 'bar' },
    ...modelFields,
    second: { kind: 'obj', nullable: true, default: null, fields: modelFields },
    label: { kind: 'bool', default: true },
  },
  rule: (p) => {
    if (p.shaded > modelParts(p.shape, p)) return 'shaded is more than the parts';
    if (p.second && p.second.shaded > modelParts(p.shape, p.second)) return 'second.shaded is more than its parts';
    return null;
  },
  start: () => ({ shade: [], shade_second: [] }),
  controls: { shade: shadeAct(1), shade_second: shadeAct(2) },
  goals: {
    shade: shadeGoal(1),
    shade_second: shadeGoal(2),
    match: {
      control: ['shade', 'shade_second'], params: {},
      rule: (g, p) => (p.second ? null : 'match needs a second model'),
      met: (p, st) => !!p.second && shadedTotal(p, st, 1) * modelParts(p.shape, p.second) === shadedTotal(p, st, 2) * modelParts(p.shape, p),
      text: () => 'shade the same amount of both',
    },
  },
  parts: (p, bar) => modelParts(p.shape, bar === 2 && p.second ? p.second : p),
  describe(p, st) {
    const one = (which) => {
      const n = shadedTotal(p, st, which); const d = modelParts(p.shape, modelOf(p, which));
      const g = gcd(n, d);
      return `${n} of ${d} part${d === 1 ? '' : 's'} shaded (${fracText(n, d)}${n && g > 1 ? ` = ${fracText(n / g, d / g)}` : ''})`;
    };
    let s = `${p.shape}: ${one(1)}`;
    if (p.second) {
      const cmp = shadedTotal(p, st, 1) * modelParts(p.shape, p.second) - shadedTotal(p, st, 2) * modelParts(p.shape, p);
      s += `; second ${p.shape}: ${one(2)}; the first is ${cmp === 0 ? 'the same amount as' : cmp > 0 ? 'more than' : 'less than'} the second`;
    }
    return s;
  },
};

// ── number line ─────────────────────────────────────────────────────────────
const NUM = { kind: 'num', min: -100, max: 1000 };
export const lineStep = (p) => (p.to - p.from) / p.divisions;
export const tickValue = (p, k) => roundTo(p.from + k * lineStep(p), 1e-6);
const onLine = (p, v) => v >= p.from - 1e-9 && v <= p.to + 1e-9;
const tickOf = (p, v) => Math.round((v - p.from) / lineStep(p));
const isTick = (p, v) => onLine(p, v) && near(tickValue(p, tickOf(p, v)), v, 1e-6);
/** Where the child's jumps start: their last landing, else the tutor's last jump's, else `start`, else from. */
export const landing = (p, st) => (st.jumps.length ? st.jumps[st.jumps.length - 1].to : p.start ?? (p.jumps.length ? p.jumps[p.jumps.length - 1].to : p.from));
export const numberline = {
  type: 'numberline',
  title: 'number line',
  params: {
    from: { ...NUM, default: 0 },
    to: { ...NUM, default: 1 },
    divisions: { kind: 'int', min: 1, max: 24, default: 4 },
    label_as: { kind: 'enum', values: ['whole', 'fraction', 'decimal'], default: 'fraction' },
    labels: { kind: 'enum', values: ['every', 'ends', 'wholes'], default: 'every' },
    jumps: { kind: 'list', max: 8, default: [], of: { kind: 'obj', fields: { from: NUM, to: NUM } } },
    jump_label: { kind: 'bool', default: true },
    marker: { ...NUM, nullable: true, default: null },
    start: { ...NUM, nullable: true, default: null },
  },
  rule: (p) => {
    if (p.to <= p.from) return 'to must be more than from';
    if (p.to - p.from > 1000) return 'the line is too long';
    if (p.label_as === 'fraction' && !Number.isInteger(p.divisions / (p.to - p.from))) return 'fraction labels need whole numbers of steps in each whole';
    for (const j of p.jumps) if (!onLine(p, j.from) || !onLine(p, j.to) || near(j.from, j.to)) return 'a jump is off the line';
    if (p.marker != null && !onLine(p, p.marker)) return 'the marker is off the line';
    if (p.start != null && !isTick(p, p.start)) return 'start must be on a tick';
    return null;
  },
  start: (p) => ({ marker: p.marker ?? p.from, jumps: [] }),
  controls: {
    marker: {
      drag: true,
      act(p, st, v) {
        if (typeof v !== 'number' || !Number.isFinite(v)) return null;
        const x = tickValue(p, Math.max(0, Math.min(p.divisions, tickOf(p, v))));
        if (near(x, st.marker)) return null;
        return { state: { ...st, marker: x }, text: `moved the marker to ${numberline.label(p, x)}`, fold: 'marker' };
      },
    },
    jump: {
      act(p, st, v) {
        if (typeof v !== 'number' || !isTick(p, v)) return null;
        const at = landing(p, st);
        if (near(v, at)) {
          if (!st.jumps.length) return null;
          const last = st.jumps[st.jumps.length - 1];
          return { state: { ...st, jumps: st.jumps.slice(0, -1) }, text: `took back the jump to ${numberline.label(p, last.to)}` };
        }
        if (st.jumps.length >= 12) return null;
        const to = tickValue(p, tickOf(p, v));
        return { state: { ...st, jumps: [...st.jumps, { from: at, to }] }, text: `jumped from ${numberline.label(p, at)} to ${numberline.label(p, to)}` };
      },
    },
  },
  goals: {
    marker_at: {
      control: ['marker'], params: { value: NUM }, rule: (g, p) => (isTick(p, g.value) ? null : 'goal: the value is not on a tick'),
      met: (p, st, g) => near(st.marker, g.value, 1e-6), text: (g, p) => `put the marker on ${numberline.label(p, g.value)}`,
    },
    land_on: {
      control: ['jump'], params: { value: NUM }, rule: (g, p) => (isTick(p, g.value) ? null : 'goal: the value is not on a tick'),
      met: (p, st, g) => st.jumps.length > 0 && near(landing(p, st), g.value, 1e-6), text: (g, p) => `jump along to land on ${numberline.label(p, g.value)}`,
    },
  },
  parts: (p) => (p.jumps.length || p.divisions + 1),
  /** A value as the line labels it: 3/4 (in quarters, never simplified), 0.3, or 7. Wholes as whole numbers. */
  label(p, v) {
    if (p.label_as === 'fraction') {
      const d = Math.round(p.divisions / (p.to - p.from));
      const n = Math.round(v * d);
      if (near(n / d, v, 1e-6)) return n % d === 0 ? String(n / d) : `${n}/${d}`;
    }
    return fmt(v);
  },
  describe(p, st) {
    const s = [`a number line from ${fmt(p.from)} to ${fmt(p.to)} in ${p.divisions} equal steps of ${p.label_as === 'fraction' ? fracText(1, Math.round(p.divisions / (p.to - p.from))) : fmt(lineStep(p))}`];
    if (p.jumps.length) s.push(`your jumps: ${p.jumps.map((j) => `${this.label(p, j.from)} to ${this.label(p, j.to)}`).join(', ')}`);
    if (st.jumps.length) s.push(`the child's jumps: ${st.jumps.map((j) => `${this.label(p, j.from)} to ${this.label(p, j.to)}`).join(', ')}, landing on ${this.label(p, landing(p, st))}`);
    if (p.marker != null || st.marker !== p.from) s.push(`the marker is on ${this.label(p, st.marker)}`);
    return s.join('; ');
  },
};

// ── place value ─────────────────────────────────────────────────────────────
export const PLACE_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
const PLACE_ONE = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand'];
export const PLACE_SHORT = ['O', 'T', 'H', 'Th', 'TTh', 'HTh'];
/** The digits of a value in `columns` columns, the leftmost first. */
export const digitsOf = (value, columns) => String(value).padStart(columns, '0').slice(-columns).split('').map(Number);
const valueOf = (digits) => digits.reduce((v, d) => v * 10 + d, 0);
/** 340512 as a Kenyan textbook writes it: 340 512. */
export const spaced = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const placeName = (columns, col) => PLACE_NAMES[columns - 1 - col];
export const placeValue = {
  type: 'place_value',
  title: 'place value chart',
  params: {
    value: { kind: 'int', min: 0, max: 999999, default: 0 },
    columns: { kind: 'int', min: 2, max: 6, default: 4 },
    show: { kind: 'enum', values: ['digits', 'counters'], default: 'digits' },
  },
  rule: (p) => (String(p.value).length > p.columns ? 'the value needs more columns' : null),
  start: (p) => ({ digits: digitsOf(p.value, p.columns) }),
  controls: {
    set: {
      act(p, st, v) {
        if (!v || !Number.isInteger(v.col) || v.col < 0 || v.col >= p.columns || (v.by !== 1 && v.by !== -1)) return null;
        const d = st.digits[v.col] + v.by;
        if (d < 0 || d > 9) return null;
        const digits = st.digits.map((x, i) => (i === v.col ? d : x));
        return { state: { ...st, digits }, text: `made the ${placeName(p.columns, v.col)} ${d}`, fold: `col${v.col}` };
      },
    },
  },
  goals: {
    shows: {
      control: ['set'], params: { value: { kind: 'int', min: 0, max: 999999 } },
      rule: (g, p) => (String(g.value).length > p.columns ? 'goal: the value needs more columns' : null),
      met: (p, st, g) => valueOf(st.digits) === g.value, text: (g) => `make ${spaced(g.value)} on the chart`,
    },
  },
  parts: (p) => p.columns,
  describe(p, st, controls = []) {
    const ds = controls.includes('set') ? st.digits : digitsOf(p.value, p.columns);
    const v = valueOf(ds);
    const heads = PLACE_SHORT.slice(0, p.columns).reverse().join(' ');
    return `a place value chart (${heads}) showing ${spaced(v)} as ${p.show}: ${ds.map((d, i) => `${d} ${d === 1 ? PLACE_ONE[p.columns - 1 - i] : placeName(p.columns, i)}`).join(', ')}`;
  },
};

// ── angle ───────────────────────────────────────────────────────────────────
export const angleKind = (d) => (d === 0 ? 'no turn' : d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : 'straight');
export const SNAP_ALIGN = 3;
export const angle = {
  type: 'angle',
  title: 'angle',
  params: {
    degrees: { kind: 'int', min: 0, max: 180, default: 60 },
    base: { kind: 'enum', values: ['right', 'left'], default: 'right' },
    protractor: { kind: 'bool', default: true },
    protractor_turn: { kind: 'int', min: -90, max: 90, default: 0 },
    arc: { kind: 'bool', default: true },
    show_value: { kind: 'bool', default: false },
  },
  start: (p) => ({ degrees: p.degrees, turn: p.protractor_turn }),
  controls: {
    turn: {
      drag: true,
      act(p, st, v) {
        if (!Number.isFinite(v)) return null;
        const d = Math.max(0, Math.min(180, Math.round(v)));
        if (d === st.degrees) return null;
        return { state: { ...st, degrees: d }, text: `turned the arm to ${d} degrees`, fold: 'turn' };
      },
    },
    protractor: {
      drag: true,
      needs: (p) => (p.protractor ? null : 'the protractor is not on the board'),
      act(p, st, v) {
        if (!Number.isFinite(v)) return null;
        let t = Math.max(-90, Math.min(90, Math.round(v)));
        if (Math.abs(t) <= SNAP_ALIGN) t = 0;
        if (t === st.turn) return null;
        return { state: { ...st, turn: t }, text: t === 0 ? 'lined the protractor up with the fixed arm' : `turned the protractor ${Math.abs(t)} degrees off the fixed arm`, fold: 'protractor' };
      },
    },
  },
  goals: {
    angle_is: {
      control: ['turn'], params: { degrees: { kind: 'int', min: 0, max: 180 }, tolerance: { kind: 'int', min: 0, max: 10, default: 1 } },
      met: (p, st, g) => Math.abs(st.degrees - g.degrees) <= g.tolerance, text: (g) => `turn the arm to make ${g.degrees} degrees`,
    },
    kind_is: {
      control: ['turn'], params: { is: { kind: 'enum', values: ['acute', 'right', 'obtuse', 'straight'] } },
      met: (p, st, g) => angleKind(st.degrees) === g.is, text: (g) => `make ${g.is === 'acute' || g.is === 'obtuse' ? 'an' : 'a'} ${g.is} angle`,
    },
    aligned: {
      control: ['protractor'], params: {},
      met: (p, st) => st.turn === 0, text: () => 'line the protractor up with the fixed arm',
    },
  },
  parts: () => 2,
  describe(p, st) {
    const s = [`an angle of ${st.degrees} degrees (${angleKind(st.degrees)}), the fixed arm pointing ${p.base}`];
    if (p.protractor) s.push(st.turn === 0 ? 'the protractor is on, lined up with the fixed arm' : `the protractor is on, turned ${Math.abs(st.turn)} degrees off the fixed arm`);
    return s.join('; ');
  },
};

// ── area and perimeter ──────────────────────────────────────────────────────
/** The squares of the shape, row by row from the top: [{ r, c }]. A cut takes a block off the top-right corner. */
export const areaCells = (p) => {
  const out = [];
  for (let r = 0; r < p.height; r += 1) {
    for (let c = 0; c < p.width; c += 1) {
      if (p.cut && r < p.cut.h && c >= p.width - p.cut.w) continue;
      out.push({ r, c });
    }
  }
  return out;
};
/** The unit edges round the outside: [{ key, x0, y0, x1, y1 }] in squares, clockwise from the top-left corner. */
export const areaEdges = (p) => {
  const cells = new Set(areaCells(p).map(({ r, c }) => `${r},${c}`));
  const inside = (r, c) => cells.has(`${r},${c}`);
  const out = [];
  for (let r = 0; r <= p.height; r += 1) {
    for (let c = 0; c < p.width; c += 1) if (inside(r - 1, c) !== inside(r, c)) out.push({ key: `h${r}.${c}`, x0: c, y0: r, x1: c + 1, y1: r });
  }
  for (let c = 0; c <= p.width; c += 1) {
    for (let r = 0; r < p.height; r += 1) if (inside(r, c - 1) !== inside(r, c)) out.push({ key: `v${r}.${c}`, x0: c, y0: r, x1: c, y1: r + 1 });
  }
  return out;
};
const unitText = (p, sq) => (p.unit === 'squares' ? (sq ? 'squares' : 'units') : sq ? `square ${p.unit}` : p.unit);
export const area = {
  type: 'area',
  title: 'shape on squares',
  params: {
    width: { kind: 'int', min: 1, max: 12, default: 4 },
    height: { kind: 'int', min: 1, max: 10, default: 3 },
    cut: { kind: 'obj', nullable: true, default: null, fields: { w: { kind: 'int', min: 1, max: 11, default: 1 }, h: { kind: 'int', min: 1, max: 9, default: 1 } } },
    sides: { kind: 'bool', default: false },
    unit: { kind: 'enum', values: ['squares', 'cm', 'm'], default: 'cm' },
  },
  rule: (p) => (p.cut && (p.cut.w >= p.width || p.cut.h >= p.height) ? 'the cut is as big as the shape' : null),
  start: () => ({ count: [], trace: [] }),
  controls: {
    count: {
      act(p, st, part) {
        const n = areaCells(p).length;
        if (!Number.isInteger(part) || part < 1 || part > n) return null;
        const on = st.count.includes(part);
        return { state: { ...st, count: on ? st.count.filter((x) => x !== part) : [...st.count, part] }, text: on ? `took back the count on square ${part}` : `counted square ${part} as ${st.count.length + 1}` };
      },
    },
    trace: {
      act(p, st, key) {
        if (!areaEdges(p).some((e) => e.key === key)) return null;
        const on = st.trace.includes(key);
        return { state: { ...st, trace: on ? st.trace.filter((x) => x !== key) : [...st.trace, key] }, text: on ? 'took back one traced edge' : 'traced one more edge', fold: 'trace' };
      },
    },
  },
  goals: {
    count_all: { control: ['count'], params: {}, met: (p, st) => st.count.length === areaCells(p).length, text: () => 'count every square' },
    trace_all: { control: ['trace'], params: {}, met: (p, st) => st.trace.length === areaEdges(p).length, text: () => 'trace all the way round' },
  },
  parts: (p) => areaCells(p).length,
  describe(p, st) {
    const a = areaCells(p).length; const per = areaEdges(p).length;
    const s = [`${p.cut ? 'an L shape' : `a rectangle ${p.width} by ${p.height}`} on squares: area ${a} ${unitText(p, true)}, perimeter ${per} ${unitText(p, false)}`];
    if (st.count.length) s.push(`the child has counted ${st.count.length} of the ${a} squares`);
    if (st.trace.length) s.push(`the child has traced ${st.trace.length} of the ${per} edges`);
    return s.join('; ');
  },
};

// ── graph ───────────────────────────────────────────────────────────────────
const axis = (name) => ({
  kind: 'obj', default: { from: 0, to: 10, step: 1, name: '' },
  fields: { from: { kind: 'int', min: -20, max: 1000, default: 0 }, to: { kind: 'int', min: -20, max: 1000, default: 10 }, step: { kind: 'int', min: 1, max: 100, default: 1 }, name: { kind: 'text', max: 16, default: '' } },
  name,
});
const steps = (a) => (a.to - a.from) / a.step;
const onGrid = (p, x, y) => [[p.x, x], [p.y, y]].every(([a, v]) => v >= a.from && v <= a.to && near((v - a.from) / a.step, Math.round((v - a.from) / a.step)));
export const MAX_CHILD_POINTS = 8;
export const graph = {
  type: 'graph',
  title: 'graph',
  params: {
    x: axis('x'),
    y: axis('y'),
    grid: { kind: 'bool', default: true },
    points: { kind: 'list', max: 12, default: [], of: { kind: 'obj', fields: { x: { kind: 'num', min: -20, max: 1000 }, y: { kind: 'num', min: -20, max: 1000 }, label: { kind: 'text', max: 8, default: '' } } } },
    connect: { kind: 'bool', default: false },
  },
  rule: (p) => {
    for (const a of [p.x, p.y]) {
      if (a.to <= a.from) return 'an axis must go up';
      if (!Number.isInteger(steps(a)) || steps(a) > 12) return 'an axis needs at most 12 whole steps';
    }
    for (const q of p.points) if (q.x < p.x.from || q.x > p.x.to || q.y < p.y.from || q.y > p.y.to) return 'a point is off the axes';
    return null;
  },
  start: () => ({ points: [] }),
  controls: {
    place: {
      act(p, st, v) {
        if (!Array.isArray(v) || v.length !== 2 || !onGrid(p, v[0], v[1])) return null;
        const has = st.points.findIndex(([x, y]) => near(x, v[0]) && near(y, v[1]));
        if (has >= 0) return { state: { ...st, points: st.points.filter((_, i) => i !== has) }, text: `took away the point (${fmt(v[0])}, ${fmt(v[1])})` };
        if (st.points.length >= MAX_CHILD_POINTS) return null;
        return { state: { ...st, points: [...st.points, [v[0], v[1]]] }, text: `put a point at (${fmt(v[0])}, ${fmt(v[1])})` };
      },
    },
  },
  goals: {
    point_at: {
      control: ['place'], params: { x: { kind: 'num', min: -20, max: 1000 }, y: { kind: 'num', min: -20, max: 1000 } },
      rule: (g, p) => (onGrid(p, g.x, g.y) ? null : 'goal: the point is not on a grid crossing'),
      met: (p, st, g) => st.points.some(([x, y]) => near(x, g.x) && near(y, g.y)), text: (g) => `put a point at (${fmt(g.x)}, ${fmt(g.y)})`,
    },
  },
  parts: (p) => p.points.length,
  describe(p, st) {
    const nm = (a, d) => a.name || d;
    const s = [`a graph: ${nm(p.x, 'across')} from ${p.x.from} to ${p.x.to} in steps of ${p.x.step}, ${nm(p.y, 'up')} from ${p.y.from} to ${p.y.to} in steps of ${p.y.step}`];
    if (p.points.length) s.push(`your points: ${p.points.map((q) => `${q.label ? `${q.label} ` : ''}(${fmt(q.x)}, ${fmt(q.y)})`).join(', ')}`);
    if (st.points.length) s.push(`the child's points: ${st.points.map(([x, y]) => `(${fmt(x)}, ${fmt(y)})`).join(', ')}`);
    return s.join('; ');
  },
};

// ── the catalogue ───────────────────────────────────────────────────────────
export const FIGURES = [fraction, numberline, placeValue, angle, area, graph];
export const FIGURE = Object.fromEntries(FIGURES.map((t) => [t.type, t]));
export const FIGURE_TYPES = FIGURES.map((t) => t.type);
export const FIGURE_CONTROLS = [...new Set(FIGURES.flatMap((t) => Object.keys(t.controls)))];

/**
 * A request for a figure: { type, params, controls?, goal? }, params and goal as records or as
 * JSON text (as the model writes them). Returns { ok: true, figure } or { ok: false, error }. Never throws.
 */
export function validateFigure(raw) {
  try {
    if (!raw || typeof raw !== 'object') throw new Refused('not a request');
    const type = FIGURE[raw.type];
    if (!type) throw new Refused(`unknown figure ${String(raw.type).slice(0, 30)}`);
    const params = checkParams(type, recordOf(raw.params, 'params') ?? {});
    const controls = checkControls(type, raw.controls, params);
    const goal = checkGoal(type, recordOf(raw.goal, 'goal', 300), params, controls);
    return { ok: true, figure: { type: type.type, params, controls, goal } };
  } catch (e) {
    if (e instanceof Refused) return { ok: false, error: e.message };
    throw e;
  }
}

/** How many parts a figure has (highlight and point `part`; `bar` 2 is a fraction's second model). */
export const figureParts = (item, bar) => (FIGURE[item?.type] ? FIGURE[item.type].parts(item.params, bar) : 0);
export const goalText = (item) => (item?.goal ? FIGURE[item.type].goals[item.goal.kind].text(item.goal, item.params) : null);
export const goalMet = (item, state) => (item?.goal ? !!FIGURE[item.type].goals[item.goal.kind].met(item.params, state, item.goal) : null);

export default { FIGURES, FIGURE, FIGURE_TYPES, FIGURE_CONTROLS, validateFigure, figureParts, goalText, goalMet };
