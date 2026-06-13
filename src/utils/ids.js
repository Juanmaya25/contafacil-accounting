export const nextNumericId = arr =>
  (arr.length ? Math.max(...arr.map(x => typeof x.id === 'number' ? x.id : 0)) : 0) + 1;

export const nextInvoiceId = invoices => {
  const maxNum = invoices.reduce((max, i) => {
    const num = parseInt(i.id.split('-')[2] || '0', 10);
    return Math.max(max, num);
  }, 0);
  return `FAC-2026-${String(maxNum + 1).padStart(3, '0')}`;
};
