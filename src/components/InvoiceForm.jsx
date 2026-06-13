export function InvoiceForm({ form, fv, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14}}>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Cliente *</label><input style={S.input} value={form.client||''} onChange={fv('client')} placeholder="Empresa ABC S.A.S" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>NIT</label><input style={S.input} value={form.nit||''} onChange={fv('nit')} placeholder="900000000-0" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Nº de items</label><input style={S.input} type="number" min="1" value={form.items||''} onChange={fv('items')} placeholder="1" {...focusH} /></div>
      <div><label style={S.label}>Fecha emisión</label><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} {...focusH} /></div>
      <div><label style={S.label}>Fecha vencimiento</label><input style={S.input} type="date" value={form.due||''} onChange={fv('due')} {...focusH} /></div>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Monto total (COP) *</label><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="0" {...focusH} /></div>
    </div>
  );
}
