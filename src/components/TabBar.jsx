export const TABS = [
  { id:'dashboard',    label:'Resumen' },
  { id:'transactions', label:'Transacciones' },
  { id:'invoices',     label:'Facturación' },
  { id:'accounts',     label:'Cuentas' },
  { id:'reports',      label:'Reportes' },
];

export function TabBar({ page, onNavigate, C }) {
  return (
    <div style={{background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'0 32px'}}>
      <div style={{maxWidth:1400, margin:'0 auto', display:'flex', gap:0, overflowX:'auto'}}>
        {TABS.map(t => {
          const active = page === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              style={{
                background:'transparent',
                color: active ? C.accent : C.text2,
                border:'none',
                borderBottom: active ? `2px solid ${C.accent}` : '2px solid transparent',
                padding:'14px 20px', fontSize:14, fontWeight: active ? 600 : 500,
                cursor:'pointer', fontFamily:'inherit',
                whiteSpace:'nowrap', transition:'all .15s',
                marginBottom:-1,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = C.text2; }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
