import { describe, it, expect } from 'vitest';
import { nextNumericId, nextInvoiceId } from './ids.js';

describe('nextNumericId', () => {
  it('returns 1 for an empty array', () => {
    expect(nextNumericId([])).toBe(1);
  });

  it('returns max id + 1', () => {
    expect(nextNumericId([{ id: 1 }, { id: 5 }, { id: 3 }])).toBe(6);
  });

  it('ignores non-numeric ids', () => {
    expect(nextNumericId([{ id: 'FAC-2026-001' }, { id: 2 }])).toBe(3);
  });
});

describe('nextInvoiceId', () => {
  it('increments the highest invoice sequence and pads to 3 digits', () => {
    const invoices = [{ id: 'FAC-2026-041' }, { id: 'FAC-2026-040' }];
    expect(nextInvoiceId(invoices)).toBe('FAC-2026-042');
  });

  it('starts at FAC-2026-001 for an empty list', () => {
    expect(nextInvoiceId([])).toBe('FAC-2026-001');
  });
});
