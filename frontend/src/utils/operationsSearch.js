/**
 * Operations search bar:
 * - `amount:17` — substring match on amount: digits appear in order in cents + formatted EUR (e.g. "17" matches €17.00, €10.17, 1700¢…)
 * - `amount:1` — any amount whose representation contains "1" (€1.00, €10.50, …)
 * - `label:…` — substring on label (case-insensitive)
 */

const RE_AMOUNT = /\bamount:\s*([\d.,]+)/gi;
/** Value runs until another `amount:` / `label:` token or end of string. */
const RE_LABEL = /\blabel:\s*([\s\S]*?)(?=\s+(?:amount|label):|$)/gi;
const RE_STRIP_AMOUNT = /\bamount:\s*[\d.,]+\s*/gi;
const RE_STRIP_LABEL = /\blabel:\s*[\s\S]*?(?=\s+(?:amount|label):|$)/gi;

/**
 * Concatenate raw cents and "12.34" euro form so patterns like "17" or "1.50" match naturally.
 * @param {number} centsSigned
 */
export function amountSearchHaystack(centsSigned) {
  const cents = Math.abs(Math.trunc(Number(centsSigned) || 0));
  const euro = (cents / 100).toFixed(2);
  return `${String(cents)}${euro}`;
}

/**
 * @param {string} raw
 * @returns {{ amountPattern: string, labelNeedle: string, textQuery: string }}
 */
export function parseOperationsSearchQuery(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return { amountPattern: '', labelNeedle: '', textQuery: '' };

  let amountPattern = '';
  let m;
  const reAmt = new RegExp(RE_AMOUNT.source, 'gi');
  while ((m = reAmt.exec(trimmed)) !== null) {
    const chunk = String(m[1]).replace(',', '.').trim();
    if (chunk) amountPattern = chunk;
  }

  let labelNeedle = '';
  const reLab = new RegExp(RE_LABEL.source, 'gi');
  while ((m = reLab.exec(trimmed)) !== null) {
    const chunk = m[1].trim();
    if (chunk) labelNeedle = chunk;
  }

  const textQuery = trimmed
    .replace(RE_STRIP_AMOUNT, ' ')
    .replace(RE_STRIP_LABEL, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { amountPattern, labelNeedle, textQuery };
}

/**
 * @param {{ amount?: string, label?: string }} row
 * @param {string} amountPattern — from `amount:…` (substring on haystack)
 * @param {string} textQuery — free text (matched against label)
 * @param {string} [labelNeedle] — from `label:…`
 */
export function operationMatchesSearch(row, amountPattern, textQuery, labelNeedle = '') {
  const label = (row.label || '').toLowerCase();

  if (amountPattern) {
    const hay = amountSearchHaystack(parseInt(row.amount, 10) || 0);
    if (!hay.includes(amountPattern)) return false;
  }
  if (labelNeedle) {
    if (!label.includes(labelNeedle.toLowerCase())) return false;
  }
  if (textQuery) {
    if (!label.includes(textQuery.toLowerCase())) return false;
  }
  return true;
}
