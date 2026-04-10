import { describe, it, expect } from 'vitest';
import {
  parseOperationsSearchQuery,
  operationMatchesSearch,
  amountSearchHaystack,
} from './operationsSearch.js';

describe('amountSearchHaystack', () => {
  it('concatenates cents and euro form', () => {
    expect(amountSearchHaystack(1700)).toBe('170017.00');
    expect(amountSearchHaystack(100)).toBe('1001.00');
    expect(amountSearchHaystack(-117)).toBe('1171.17');
  });
});

describe('parseOperationsSearchQuery', () => {
  it('returns empty shape when empty or whitespace-only', () => {
    expect(parseOperationsSearchQuery('')).toEqual({
      amountPattern: '',
      labelNeedle: '',
      textQuery: '',
    });
    expect(parseOperationsSearchQuery('   ')).toEqual({
      amountPattern: '',
      labelNeedle: '',
      textQuery: '',
    });
  });

  it('treats null/undefined as empty', () => {
    expect(parseOperationsSearchQuery(null)).toEqual({
      amountPattern: '',
      labelNeedle: '',
      textQuery: '',
    });
    expect(parseOperationsSearchQuery(undefined)).toEqual({
      amountPattern: '',
      labelNeedle: '',
      textQuery: '',
    });
  });

  it('parses amount pattern', () => {
    expect(parseOperationsSearchQuery('amount:1')).toEqual({
      amountPattern: '1',
      labelNeedle: '',
      textQuery: '',
    });
    expect(parseOperationsSearchQuery('amount:17')).toEqual({
      amountPattern: '17',
      labelNeedle: '',
      textQuery: '',
    });
    expect(parseOperationsSearchQuery('amount:12,50')).toEqual({
      amountPattern: '12.50',
      labelNeedle: '',
      textQuery: '',
    });
  });

  it('parses label:', () => {
    expect(parseOperationsSearchQuery('label:foo')).toEqual({
      amountPattern: '',
      labelNeedle: 'foo',
      textQuery: '',
    });
  });

  it('combines free text and clauses', () => {
    expect(parseOperationsSearchQuery('coffee amount:10')).toEqual({
      amountPattern: '10',
      labelNeedle: '',
      textQuery: 'coffee',
    });
  });

  it('uses last amount and last label', () => {
    expect(parseOperationsSearchQuery('amount:1 amount:2')).toEqual({
      amountPattern: '2',
      labelNeedle: '',
      textQuery: '',
    });
    expect(parseOperationsSearchQuery('label:a label:b')).toEqual({
      amountPattern: '',
      labelNeedle: 'b',
      textQuery: '',
    });
  });
});

describe('operationMatchesSearch — amount substring', () => {
  it('amount:1 matches any row whose haystack contains 1', () => {
    expect(operationMatchesSearch({ amount: '100', label: 'X' }, '1', '', '')).toBe(true); // €1.00
    expect(operationMatchesSearch({ amount: '1050', label: 'X' }, '1', '', '')).toBe(true); // €10.50
    expect(operationMatchesSearch({ amount: '999', label: 'X' }, '1', '', '')).toBe(false); // €9.99 — no "1"
  });

  it('amount:17 matches consecutive 17 in cents or euro string', () => {
    expect(operationMatchesSearch({ amount: '1700', label: 'X' }, '17', '', '')).toBe(true);
    expect(operationMatchesSearch({ amount: '1017', label: 'X' }, '17', '', '')).toBe(true);
    expect(operationMatchesSearch({ amount: '999', label: 'X' }, '17', '', '')).toBe(false);
  });

  it('label and amount together', () => {
    expect(operationMatchesSearch({ amount: '100', label: 'Shop' }, '1', 'shop', '')).toBe(true);
    expect(operationMatchesSearch({ amount: '999', label: 'Shop' }, '1', 'shop', '')).toBe(false);
  });
});

describe('operationMatchesSearch — label: needle', () => {
  it('matches only label substring when labelNeedle set', () => {
    expect(
      operationMatchesSearch({ amount: '500', label: 'Coffee shop' }, '', '', 'coffee'),
    ).toBe(true);
    expect(
      operationMatchesSearch({ amount: '500', label: 'Tea' }, '', '', 'coffee'),
    ).toBe(false);
  });

  it('requires all of amount, label needle, and free text when combined', () => {
    expect(
      operationMatchesSearch({ amount: '1000', label: 'Star cafe' }, '10', 'cafe', ''),
    ).toBe(true);
    expect(
      operationMatchesSearch({ amount: '1000', label: 'Other' }, '10', 'cafe', ''),
    ).toBe(false);
  });
});
