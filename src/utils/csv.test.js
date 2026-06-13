import { describe, it, expect } from 'vitest';
import { toCSV } from './csv.js';

describe('toCSV', () => {
  it('returns an empty string for no rows', () => {
    expect(toCSV([])).toBe('');
  });

  it('builds a header row from object keys', () => {
    const csv = toCSV([{ a: 1, b: 2 }]);
    expect(csv.split('\n')[0]).toBe('a,b');
  });

  it('quotes values and escapes embedded double quotes', () => {
    const csv = toCSV([{ desc: 'Venta "especial"' }]);
    expect(csv.split('\n')[1]).toBe('"Venta ""especial"""');
  });

  it('serialises every data row', () => {
    const csv = toCSV([{ x: 1 }, { x: 2 }]);
    expect(csv.split('\n')).toHaveLength(3); // header + 2 rows
  });
});
