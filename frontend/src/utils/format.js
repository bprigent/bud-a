export function formatCurrency(cents, currency = 'USD') {
  const dollars = cents / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  } catch {
    return `$${dollars.toFixed(2)}`;
  }
}

/** Narrow symbol for ISO 4217 codes (e.g. EUR → €). Other strings (e.g. "%") pass through unchanged. */
export function getCurrencySymbol(currency = 'USD') {
  const raw = String(currency ?? 'USD').trim();
  if (!/^[A-Za-z]{3}$/.test(raw)) {
    return raw;
  }
  const code = raw.toUpperCase();
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    return parts.find((p) => p.type === 'currency')?.value ?? code;
  } catch {
    return code;
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
}

export function centsFromDollars(dollars) {
  const n = parseFloat(dollars);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function dollarsFromCents(cents) {
  const n = parseInt(cents, 10);
  if (Number.isNaN(n)) return '';
  return (n / 100).toFixed(2);
}

export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Full month name and year from YYYY-MM (e.g. "March 2026"). */
export function formatMonthYear(ym) {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

/** Format a Date to YYYY-MM-DD. */
export function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Last day of a YYYY-MM month as YYYY-MM-DD. */
export function getMonthEnd(month) {
  const [y, m] = month.split('-').map(Number);
  return `${month}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
}

/** First and last day of a YYYY-MM month as `{ start, end }` (YYYY-MM-DD). */
export function getMonthRange(month) {
  return { start: `${month}-01`, end: getMonthEnd(month) };
}

/** Short month label from YYYY-MM key (e.g. "Apr 26"). */
export function shortMonthLabel(key) {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [y, m] = key.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

/** First and last calendar day of the current month (YYYY-MM-DD). */
export function currentMonthDateRange() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const pad = (n) => String(n).padStart(2, '0');
  const start = `${y}-${pad(m)}-01`;
  const lastDay = new Date(y, m, 0).getDate();
  const end = `${y}-${pad(m)}-${pad(lastDay)}`;
  return { start, end };
}

/** Previous calendar month (first day → last day), local time. */
export function lastMonthDateRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  return { start: toYMD(first), end: toYMD(last) };
}

/** First day of last calendar month through last day of this calendar month (local). */
export function thisAndLastMonthDateRange() {
  const { start } = lastMonthDateRange();
  const { end } = currentMonthDateRange();
  return { start, end };
}

/** Map preset id → { start, end } (Operations date filter). */
export function getDateRangePreset(preset) {
  switch (preset) {
    case 'all_time':
      return { start: '', end: '' };
    case 'this_month':
      return currentMonthDateRange();
    case 'last_month':
      return lastMonthDateRange();
    case 'this_and_last_month':
      return thisAndLastMonthDateRange();
    default:
      return currentMonthDateRange();
  }
}

/**
 * Which preset matches these exact start/end strings, or null if none (custom range).
 */
export function matchDateRangePreset(start, end) {
  if (!start && !end) return 'all_time';
  const presets = ['last_month', 'this_month', 'this_and_last_month'];
  for (const id of presets) {
    const r = getDateRangePreset(id);
    if (r.start === start && r.end === end) return id;
  }
  return null;
}

/**
 * Display helper: first character upper, rest lower — avoids ALL CAPS category names in UI.
 */
export function sentenceCaseLabel(str) {
  if (str == null || typeof str !== 'string') return '';
  const t = str.trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
