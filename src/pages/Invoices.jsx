import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { invoiceStatus } from '../data/themes.js';

export function Invoices({ invoices, theme, onExport, onAdd, onEdit, onDelete, onMarkPaid, C, S }) {
  const paidTotal     = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingTotal  = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const overdueTotal  = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>Facturación</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>{invoices.length} facturas registradas</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={onExport}><Icon.download /> Exportar</button>
          <button style={S.btnPri} onClick={onAdd}>
            <Icon.plus /> Nueva factura
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:20}}>
        {[
          { l:'Pagadas',     v:fmt(paidTotal),    n:invoices.filter(i => i.status === 'paid').length,    c:C.success, bg:'#d1fae5', cText:'#065f46' },
          { l:'Pendientes',  v:fmt(pendingTotal), n:invoices.filter(i => i.status === 'pending').length, c:C.warning, bg:'#fef3c7', cText:'#92400e' },
          { l:'Vencidas',    v:fmt(overdueTotal), n:invoices.filter(i => i.status === 'overdue').length, c:C.danger,  bg:'#fee2e2', cText:'#991b1b' },
        ].map(k => (
          <div key={k.l} style={{background:theme==='dark' ? `${k.c}15` : k.bg, border:`1px solid ${theme==='dark' ? k.c+'30' : 'transparent'}`, borderRadius:8, padding:18}}>
            <div style={{fontSize:11, color: theme==='dark' ? k.c : k.cText, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:6}}>{k.l}</div>
            <div style={{fontSize:22, fontWeight:700, color: theme==='dark' ? k.c : k.cText, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px'}}>{k.v}</div>
            <div style={{fontSize:12, color: theme==='dark' ? k.c+'aa' : k.cText, marginTop:4, opacity:.8}}>{k.n} factura{k.n !== 1 ? 's' : ''}</div>
          </div>
        ))}
      </div>

      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:880}}>
            <thead>
              <tr style={{background:C.bg3}}>
                {['Nº Factura','Cliente','NIT','Fecha','Vencimiento','Monto','Estado','Acciones'].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'12px 18px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .12s', borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'14px 18px', fontFamily:'"SF Mono", Consolas, monospace', fontSize:13, color:C.accent, fontWeight:600}}>{inv.id}</td>
                  <td style={{padding:'14px 18px', fontSize:13, fontWeight:500, color:C.text}}>{inv.client}</td>
                  <td style={{padding:'14px 18px', fontSize:12, color:C.text2, fontFamily:'"SF Mono", Consolas, monospace'}}>{inv.nit}</td>
                  <td style={{padding:'14px 18px', fontSize:13, color:C.text2, fontFamily:'"SF Mono", Consolas, monospace'}}>{inv.date}</td>
                  <td style={{padding:'14px 18px', fontSize:13, color: inv.status === 'overdue' ? C.danger : C.text2, fontFamily:'"SF Mono", Consolas, monospace', fontWeight: inv.status === 'overdue' ? 600 : 400}}>{inv.due}</td>
                  <td style={{padding:'14px 18px', fontFamily:'"SF Mono", Consolas, monospace', fontWeight:600, color:C.text, textAlign:'right'}}>{fmt(inv.amount)}</td>
                  <td style={{padding:'14px 18px'}}>
                    <span style={{fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:100, background:invoiceStatus[inv.status].bg, color:invoiceStatus[inv.status].c, display:'inline-flex', alignItems:'center', gap:6}}>
                      <span style={{width:6, height:6, borderRadius:'50%', background:invoiceStatus[inv.status].dot}} />
                      {invoiceStatus[inv.status].l}
                    </span>
                  </td>
                  <td style={{padding:'14px 18px'}}>
                    <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
                      {inv.status !== 'paid' && (
                        <button onClick={() => onMarkPaid(inv.id)} style={{background:'transparent', color:C.success, border:`1px solid ${C.success}40`, borderRadius:6, padding:'5px 10px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
                          <Icon.check /> Pagar
                        </button>
                      )}
                      <button style={S.btnIcon} onClick={() => onEdit(inv)} aria-label="Editar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.accent}15`; e.currentTarget.style.color = C.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                        <Icon.pencil />
                      </button>
                      <button style={S.btnIcon} onClick={() => onDelete(inv.id)} aria-label="Eliminar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.danger}15`; e.currentTarget.style.color = C.danger; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                        <Icon.trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
