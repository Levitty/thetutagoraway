// ============================================================================
// READING THE LANDLORD'S SPREADSHEET
//
// The meter list starts life in Excel, or on paper typed into Excel. It is
// pasted into a box. Everything that can be wrong with it will be:
//
//   - a BOM from Excel's "CSV UTF-8", which makes the first header "﻿meter"
//     and the whole import silently produce zero meters
//   - Windows line endings
//   - a trailing comma, or a trailing blank line
//   - "1,240" for an amount, which naively split on commas becomes two columns
//     and an amount of 1
//   - headers in any case, with spaces, or named "Meter No"
//   - an entirely blank row in the middle where someone pressed enter
//
// None of these announce themselves. They produce a smaller import than
// expected, or the right number of rows with the wrong money in them, and
// nobody notices until a tenant is billed KES 1 instead of KES 1,240. So the
// parser is strict about what it accepts and says exactly which line it could
// not read, rather than skipping it.
// ============================================================================

/** Split one CSV line, honouring "quoted, fields". */
export const splitLine = (line) => {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }   // escaped quote
        else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out.map(s => s.trim());
};

/** "Meter No" -> "meterno", so headers match however they were typed. */
const key = (h) => String(h || '').replace(/^﻿/, '').toLowerCase().replace(/[^a-z0-9]/g, '');

// What each column may be called. First match wins.
const COLUMNS = {
  meter_no:    ['meterno', 'meter', 'meternumber', 'number', 'no'],
  house:       ['house', 'unit', 'houseno', 'housenumber', 'door'],
  tenant_name: ['tenantname', 'tenant', 'name', 'occupant'],
  phone:       ['phone', 'mobile', 'phoneno', 'tel', 'telephone'],
  amount_kes:  ['amountkes', 'amount', 'bill', 'kes', 'total', 'due'],
  period:      ['period', 'month', 'billingperiod'],
  reading:     ['reading', 'current', 'currentreading', 'newreading'],
  prev_reading:['prevreading', 'previous', 'previousreading', 'oldreading', 'last'],
};

/**
 * "1,240" and "KES 1,240.00" and "1240" are all 1240.
 * Returns null for anything that is not a number, rather than 0 — an amount
 * that silently becomes zero is a bill nobody owes.
 */
export const parseAmount = (raw) => {
  if (raw == null) return null;
  const s = String(raw).replace(/[^0-9.\-]/g, '');
  if (!s || s === '-' || s === '.') return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.round(n);
};

/**
 * Parse pasted CSV into rows, plus the problems found.
 *
 * Never throws and never silently drops a line: anything unusable comes back
 * in `problems` with its line number, so the person pasting can see that 3 of
 * their 40 meters did not make it.
 */
export const parseCsv = (text, { require: required = ['meter_no'] } = {}) => {
  const rows = [];
  const problems = [];
  const lines = String(text ?? '')
    .replace(/^﻿/, '')
    .split(/\r\n|\r|\n/);

  // The first line that has any content is the header.
  let h = 0;
  while (h < lines.length && !lines[h].trim()) h++;
  if (h >= lines.length) return { rows, problems: [{ line: 1, error: 'Nothing pasted.' }], headers: [] };

  const headers = splitLine(lines[h]).map(key);
  const index = {};
  for (const [field, names] of Object.entries(COLUMNS)) {
    const at = headers.findIndex(x => names.includes(x));
    if (at >= 0) index[field] = at;
  }

  for (const field of required) {
    if (index[field] == null) {
      problems.push({ line: h + 1, error: `No "${field.replace('_', ' ')}" column. Found: ${headers.filter(Boolean).join(', ') || '(none)'}` });
      return { rows, problems, headers };
    }
  }

  for (let i = h + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;                       // blank row: not an error
    const cells = splitLine(line);
    const row = {};
    for (const [field, at] of Object.entries(index)) row[field] = cells[at] ?? '';

    if (!String(row.meter_no || '').trim()) {
      problems.push({ line: i + 1, error: 'No meter number', raw: line.slice(0, 60) });
      continue;
    }
    if (index.amount_kes != null) {
      const amt = parseAmount(row.amount_kes);
      if (amt == null || amt <= 0) {
        problems.push({ line: i + 1, error: `Amount "${row.amount_kes}" is not a number above zero`, raw: line.slice(0, 60) });
        continue;
      }
      row.amount_kes = amt;
    }
    for (const f of ['reading', 'prev_reading']) {
      if (row[f] !== undefined) {
        const v = parseAmount(row[f]);
        row[f] = v == null ? null : v;
      }
    }
    rows.push(row);
  }
  return { rows, problems, headers };
};

/** This month as the period a bill is filed under. */
export const thisPeriod = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
