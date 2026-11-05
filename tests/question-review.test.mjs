import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeXlsx, readXlsx } from '../scripts/lib/xlsx.mjs';

test('the sign-off sheet survives a write and read, with awkward text', () => {
  const rows = [['Family', 'Decision', 'Comment'], ['g9.a', 'OK', 'x < 3 & y > 2'], ['g9.b', '', '"quoted"']];
  const back = readXlsx(writeXlsx(rows, { lists: { 1: ['OK', 'Change', 'Drop'] } }));
  assert.equal(back[1][0], 'g9.a'); assert.equal(back[1][2], 'x < 3 & y > 2'); assert.equal(back[2][2], '"quoted"');
});
