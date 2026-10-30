// ============================================================================
// METER NUMBERS, AS TENANTS ACTUALLY TYPE THEM
//
// The meter number is the only thing joining a payment to a person, and it is
// typed on a phone by someone standing in a corridor. It arrives as "00412",
// "412", "no. 412", "M‑412" (with a non-ASCII hyphen, because that is what the
// landlord's printed notice used), and with a trailing space from autocomplete.
//
// If "412" and "00412" are different meters, the same tenant pays twice into
// two different records and the second payment looks like somebody else's. So
// normalisation is not tidying — it is what makes the join work.
// ============================================================================

/**
 * One canonical form for a meter number.
 * Upper-cased, every separator dropped, and leading zeros removed from a
 * purely numeric meter. "M-412", "m 412", "00412" and "412" all land on "412";
 * "WM00412" keeps its prefix and becomes "WM412".
 */
export const normalizeMeterNo = (raw) => {
  if (raw == null) return '';
  const s = String(raw)
    .normalize('NFKD')                 // non-ASCII dashes, full-width digits
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');        // spaces, dashes, dots, "NO."
  if (!s) return '';
  const m = s.match(/^([A-Z]*)0*(\d+)$/);
  return m ? `${m[1]}${m[2]}` : s;
};

/** Is this even plausibly a meter number? Cheap guard before a lookup. */
export const looksLikeMeterNo = (raw) => {
  const s = normalizeMeterNo(raw);
  return s.length >= 2 && s.length <= 20 && /\d/.test(s);
};

// Words that are a LABEL on the landlord's notice, not part of the number.
// A tenant reading "Meter No. 412" types "no. 412" or "meter 412", and
// normalisation alone turns those into the meters NO412 and METER412 — which
// do not exist, so a tenant who typed their number correctly cannot pay.
const LABELS = ['METERNO', 'METERNUMBER', 'METER', 'MTRNO', 'MTR', 'ACCOUNTNO', 'ACCOUNT', 'ACCNO', 'ACC', 'NUMBER', 'NO'];

/**
 * The forms to try at lookup, best first.
 *
 * Storage always uses normalizeMeterNo — one canonical form, no guessing. This
 * is only about being forgiving with what a person typed: strip a leading
 * label and try that too. Order matters, because a meter genuinely prefixed
 * "NO" must win over the same digits read as a bare number.
 */
export const meterCandidates = (raw) => {
  const base = normalizeMeterNo(raw);
  if (!base) return [];
  const out = [base];
  for (const label of LABELS) {
    if (base.startsWith(label) && base.length > label.length) {
      const stripped = normalizeMeterNo(base.slice(label.length));
      if (stripped && !out.includes(stripped)) out.push(stripped);
      break; // longest match wins; LABELS is ordered longest-first
    }
  }
  return out;
};

/**
 * What a stranger is allowed to see when they type a meter number.
 *
 * Anyone can type any number, so this doubles as an enumeration oracle: walk
 * 1..9999 and you have harvested the tenant list of an estate. The house has
 * to come back — it is how the payer knows they have the right meter — but the
 * full name does not. "Wanjiru Njoroge" becomes "W. Njoroge": enough for the
 * right tenant to recognise themselves, not enough to build a directory.
 *
 * A single-word name is reduced to its initial, because "Wanjiru" alone is
 * already the whole name.
 */
export const maskName = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return `${parts[0][0].toUpperCase()}.`;
  const last = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => `${p[0].toUpperCase()}.`).join(' ');
  return `${initials} ${last}`;
};

/** KES, the way a tenant reads it on a notice: "KES 1,240". */
export const formatKes = (n) => {
  const v = Math.round(Number(n) || 0);
  return `KES ${v.toLocaleString('en-KE')}`;
};

/**
 * Paystack requires an email for the receipt, and a tenant paying by M-Pesa
 * very often does not have one to give. A stable address derived from the
 * meter is better than asking for one and getting "a@a.com": the receipt goes
 * somewhere the landlord controls, and it is the same address every month, so
 * Paystack's own dashboard groups a meter's payments together.
 */
export const receiptEmail = (meterNo, domain) => {
  const m = normalizeMeterNo(meterNo).toLowerCase() || 'unknown';
  return `meter-${m}@${String(domain || 'example.com').replace(/^@/, '')}`;
};
