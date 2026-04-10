import { describe, expect, it } from 'vitest';

import {
  centsFromDollars,
  dollarsFromCents,
  formatCurrency,
  formatDate,
  getCurrencySymbol,
  sentenceCaseLabel,
  toYMD,
  getMonthEnd,
  shortMonthLabel,
  currentMonth,
  formatMonthYear,
  matchDateRangePreset,
} from './format.js';

describe('centsFromDollars', () => {
  it('converts typical amount', () => {
    expect(centsFromDollars('23.50')).toBe(2350);
  });

  it('converts whole dollars', () => {
    expect(centsFromDollars('10')).toBe(1000);
  });

  it('converts zero', () => {
    expect(centsFromDollars('0')).toBe(0);
  });

  it('avoids floating-point trap for 0.10', () => {
    expect(centsFromDollars('0.10')).toBe(10);
  });

  it('converts 0.01 to 1 cent', () => {
    expect(centsFromDollars('0.01')).toBe(1);
  });

  it('rounds 0.001 to nearest cent', () => {
    expect(centsFromDollars('0.001')).toBe(0);
  });

  it('handles large amount', () => {
    expect(centsFromDollars('9999.99')).toBe(999999);
  });

  it('accepts number input', () => {
    expect(centsFromDollars(23.5)).toBe(2350);
  });

  it('round-trips with dollarsFromCents for 19.99', () => {
    expect(dollarsFromCents(centsFromDollars('19.99'))).toBe('19.99');
  });
});

describe('dollarsFromCents', () => {
  it('formats typical cents', () => {
    expect(dollarsFromCents(2350)).toBe('23.50');
  });

  it('formats zero', () => {
    expect(dollarsFromCents(0)).toBe('0.00');
  });

  it('formats single cent', () => {
    expect(dollarsFromCents(1)).toBe('0.01');
  });

  it('formats large amount', () => {
    expect(dollarsFromCents(999999)).toBe('9999.99');
  });

  it('returns empty string for NaN', () => {
    expect(dollarsFromCents(NaN)).toBe('');
  });

  it('accepts string input', () => {
    expect(dollarsFromCents('2350')).toBe('23.50');
  });

  it('formats negative cents', () => {
    expect(dollarsFromCents(-500)).toBe('-5.00');
  });
});

describe('formatCurrency', () => {
  it('formats EUR cents', () => {
    expect(formatCurrency(2063, 'EUR')).toBe('€20.63');
  });

  it('formats USD cents', () => {
    expect(formatCurrency(10050, 'USD')).toBe('$100.50');
  });

  it('formats zero USD', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('formats negative USD (overspend)', () => {
    expect(formatCurrency(-500, 'USD')).toBe('-$5.00');
  });

  it('uses thousands separator for large USD', () => {
    expect(formatCurrency(1000000, 'USD')).toBe('$10,000.00');
  });
});

describe('getCurrencySymbol', () => {
  it('returns narrow symbol for EUR', () => {
    expect(getCurrencySymbol('EUR')).toBe('€');
  });

  it('returns narrow symbol for USD', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
  });

  it('passes through non-ISO suffixes', () => {
    expect(getCurrencySymbol('%')).toBe('%');
  });
});

describe('formatDate', () => {
  it('formats standard date', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15, 2026');
  });

  it('formats January (month index 0)', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026');
  });

  it('formats December', () => {
    expect(formatDate('2026-12-31')).toBe('Dec 31, 2026');
  });

  it('strips leading zero from day', () => {
    expect(formatDate('2026-03-05')).toBe('Mar 5, 2026');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });
});

describe('centsFromDollars edge cases', () => {
  it('returns 0 for empty string', () => {
    expect(centsFromDollars('')).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(centsFromDollars(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(centsFromDollars(undefined)).toBe(0);
  });

  it('returns 0 for non-numeric string', () => {
    expect(centsFromDollars('abc')).toBe(0);
  });

  it('handles negative amount', () => {
    expect(centsFromDollars('-12.50')).toBe(-1250);
  });
});

describe('formatCurrency edge cases', () => {
  it('defaults to USD when no currency given', () => {
    expect(formatCurrency(500)).toBe('$5.00');
  });

  it('formats very small amount', () => {
    expect(formatCurrency(1, 'USD')).toBe('$0.01');
  });
});

describe('toYMD', () => {
  it('formats a date object to YYYY-MM-DD', () => {
    expect(toYMD(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('pads single-digit month and day', () => {
    expect(toYMD(new Date(2026, 2, 3))).toBe('2026-03-03');
  });

  it('handles December 31', () => {
    expect(toYMD(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('getMonthEnd', () => {
  it('returns last day of January', () => {
    expect(getMonthEnd('2026-01')).toBe('2026-01-31');
  });

  it('returns last day of February (non-leap)', () => {
    expect(getMonthEnd('2026-02')).toBe('2026-02-28');
  });

  it('returns last day of February (leap year)', () => {
    expect(getMonthEnd('2024-02')).toBe('2024-02-29');
  });

  it('returns last day of April (30 days)', () => {
    expect(getMonthEnd('2026-04')).toBe('2026-04-30');
  });
});

describe('shortMonthLabel', () => {
  it('returns abbreviated month + 2-digit year', () => {
    expect(shortMonthLabel('2026-04')).toBe('Apr 26');
  });

  it('handles January', () => {
    expect(shortMonthLabel('2025-01')).toBe('Jan 25');
  });

  it('handles December', () => {
    expect(shortMonthLabel('2026-12')).toBe('Dec 26');
  });
});

describe('currentMonth', () => {
  it('returns YYYY-MM format', () => {
    expect(currentMonth()).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe('formatMonthYear', () => {
  it('formats YYYY-MM to full month name and year', () => {
    const result = formatMonthYear('2026-03');
    expect(result).toContain('March');
    expect(result).toContain('2026');
  });

  it('returns input for invalid format', () => {
    expect(formatMonthYear('bad')).toBe('bad');
  });
});

describe('matchDateRangePreset', () => {
  it('returns all_time for empty range', () => {
    expect(matchDateRangePreset('', '')).toBe('all_time');
  });

  it('returns null for a custom date range', () => {
    expect(matchDateRangePreset('2020-01-01', '2020-06-30')).toBeNull();
  });
});

describe('sentenceCaseLabel', () => {
  it('sentence-cases ALL CAPS', () => {
    expect(sentenceCaseLabel('FIXED INCOME SAVINGS')).toBe('Fixed income savings');
  });

  it('trims and handles single character', () => {
    expect(sentenceCaseLabel('  A  ')).toBe('A');
  });

  it('returns empty for empty', () => {
    expect(sentenceCaseLabel('')).toBe('');
  });
});
