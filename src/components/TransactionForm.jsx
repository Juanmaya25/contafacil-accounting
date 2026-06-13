export function TransactionForm({ form, fv, accounts, S, focusH }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14}}>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Descripción *</label><input style={S.input} value={form.desc||''} onChange={fv('desc')} placeholder="Descripción de la transacción" autoComplete="off" {...focusH} /></div>
      <div><label style={S.label}>Tipo</label>
        <select style={S.input} value={form.type||'income'} onChange={fv('type')} {...focusH}>
          <option value="income">Ingreso</option>
          <option value="expense">Egreso</option>
        </select>
      </div>
      <div><label style={S.label}>Monto (COP) *</label><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="0" {...focusH} /></div>
      <div><label style={S.label}>Categoría</label>
        <select style={S.input} value={form.cat||''} onChange={fv('cat')} {...focusH}>
          <option value="">Seleccionar...</option>
          <option>Ingresos</option><option>Compras</option><option>Nómina</option>
          <option>Gastos fijos</option><option>Comisiones</option><option>Otros</option>
        </select>
      </div>
      <div><label style={S.label}>Cuenta</label>
        <select style={S.input} value={form.account||''} onChange={fv('account')} {...focusH}>
          <option value="">Seleccionar...</option>
          {accounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
      </div>
      <div style={{gridColumn:'1/-1'}}><label style={S.label}>Fecha</label><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} {...focusH} /></div>
    </div>
  );
}
