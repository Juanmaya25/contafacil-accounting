import { describe, it, expect } from 'vitest';
import { fmt } from './format.js';

describe('fmt', () => {
  it('formats a number as Colombian pesos with thousands separators', () => {
    expect(fmt(2850000)).toBe('$2.850.000');
  });

  it('returns $0 for null, undefined or NaN', () => {
    expect(fmt(null)).toBe('$0');
    expect(fmt(undefined)).toBe('$0');
    expect(fmt(NaN)).toBe('$0');
  });

  it('handles zero and small values', () => {
    expect(fmt(0)).toBe('$0');
    expect(fmt(500)).toBe('$500');
  });
});
