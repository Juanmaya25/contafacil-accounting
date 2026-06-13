import { useMemo } from 'react';

export function useFilteredTransactions(tx, txFilter, search) {
  return useMemo(() => {
    let arr = txFilter === 'all' ? tx : tx.filter(t => t.type === txFilter);
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(t => t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q));
    }
    return arr;
  }, [tx, txFilter, search]);
}
