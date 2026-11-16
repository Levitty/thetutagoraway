// ============================================================================
// A FIGURE MUST SHOW WHAT ITS COUNTER SAYS (F28), AND READ IN ORDER (F29)
//
// The figures render through the same exports a lesson uses, so these checks
// see what the child's page holds: colours, words and digit order.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { FIGURE } from '../src/ai-tutor/figurePalette.js';
import { isBareSum } from '../src/ai-tutor/questionHeading.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'horeb-figures-'));
const bundle = join(dir, 'figures.cjs');
buildSync({
  stdin: {
    contents: `export { renderToStaticMarkup } from 'react-dom/server';
      export { createElement } from 'react';
      export { InteractiveVisual } from './src/ai-tutor/InteractiveVisual.jsx';
      export { TeachingVisual } from './src/ai-tutor/TeachingVisual.jsx';`,
    resolveDir: root, loader: 'jsx',
  },
  bundle: true, platform: 'node', format: 'cjs', outfile: bundle, logLevel: 'silent',
  loader: { '.js': 'jsx' }, jsx: 'transform',
});
const { renderToStaticMarkup, createElement, InteractiveVisual, TeachingVisual } = createRequire(import.meta.url)(bundle);
rmSync(dir, { recursive: true, force: true });

const figure = (visualType, visualData) =>
  renderToStaticMarkup(createElement(InteractiveVisual, { visualType, visualData, onAnswer: () => {}, disabled: false }));

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const rectFills = (html) => [...html.matchAll(/<rect[^>]*fill="([^"]+)"/g)].map(m => m[1]);

const SVG_FIGURES = [
  ['fraction_bar', { total: 7, mode: 'make' }],
  ['fraction_bar', { total: 4, mode: 'show', shaded: 1 }],
  ['decimal_grid', { mode: 'make' }],
  ['number_line', { denom: 4, max: 1 }],
  ['integer_line', { min: -5, max: 5, start: 2 }],
  ['fraction_compare', { fractions: [{ n: 1, d: 2 }, { n: 2, d: 3 }] }],
  ['fraction_area', { a: 1, b: 2, c: 2, d: 3 }],
  ['place_value_chart', { digits: [3, 4, 5], labels: ['100s', '10s', '1s'], highlight: 1 }],
];

test('a bar waiting to be shaded shows no shaded part', () => {
  const fills = rectFills(figure('fraction_bar', { total: 7, mode: 'make' }));
  assert.equal(fills.length, 7);
  assert.ok(fills.every(f => f === FIGURE.empty), `fills: ${fills}`);
});

test('a hundred square waiting to be shaded shows no shaded square', () => {
  const fills = rectFills(figure('decimal_grid', { mode: 'make' }));
  assert.equal(fills.length, 100);
  assert.ok(fills.every(f => f === FIGURE.empty));
});

test('a part that is shown as shaded differs from one that is not', () => {
  const fills = rectFills(figure('fraction_bar', { total: 4, mode: 'show', shaded: 1 }));
  assert.deepEqual(fills, [FIGURE.filled, FIGURE.empty, FIGURE.empty, FIGURE.empty]);
  assert.ok(contrast(FIGURE.filled, FIGURE.empty) >= 3, 'filled and empty must be told apart');
});

for (const [type, data] of SVG_FIGURES) {
  test(`${type}: no dark empty parts on the light card, and its words can be read`, () => {
    const html = figure(type, data);
    assert.ok(html.includes('<svg'), 'draws');
    for (const dark of ['#0f172a', '#1e293b']) assert.ok(!html.includes(dark), `${dark} in ${type}`);
    for (const [, fill] of html.matchAll(/<text[^>]*fill="(#[0-9a-f]{6})"/g)) {
      assert.ok(contrast(fill, FIGURE.card) >= 4.5, `${fill} on the card in ${type}`);
    }
    for (const [, stroke] of html.matchAll(/<line[^>]*stroke="(#[0-9a-f]{6})"/g)) {
      assert.ok(contrast(stroke, FIGURE.card) >= 3, `line ${stroke} in ${type}`);
    }
  });
}

test('the words under every figure are dark enough for the light card', () => {
  const src = readFileSync(new URL('../src/ai-tutor/InteractiveVisual.jsx', import.meta.url), 'utf8');
  assert.deepEqual(src.match(/text-[a-z]+-[1-5]00\b/g) || [], []);
});

const pageText = (html) => [...html.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]).join('');

test('a column sum reads in order on the page, and the answer stays hidden', () => {
  const html = renderToStaticMarkup(createElement(TeachingVisual, { model: { type: 'column-op', data: { a: 96117, b: 1111, op: '−' } } }));
  assert.equal(pageText(html), '96117−1111?????');
  assert.ok(html.includes('aria-label="Column subtraction: 96117 minus 1111"'));
  assert.ok(!html.includes('95006'), 'the answer is not in the page');
});

test('a column sum with a shorter top number, and the revealed answer, read in order', () => {
  const html = renderToStaticMarkup(createElement(TeachingVisual, { model: { type: 'column-op', data: { a: 58, b: 7, op: '+', showResult: true } } }));
  assert.equal(pageText(html), '158+765');
  assert.ok(html.includes('aria-label="Column addition: 58 plus 7 equals 65"'));
});

test('an instruction stays at reading size; a bare sum stays large', () => {
  for (const q of ['Shade the grid to show 0.54', 'Shade the bar to show 3/7']) assert.equal(isBareSum(q), false, q);
  for (const q of ['7 × 8 = ?', 'What is 7 × 8?', '96117 − 1111 = ?']) assert.equal(isBareSum(q), true, q);
});
