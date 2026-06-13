import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';

export function Transactions({ tx, filteredTx, search, onSearch, txFilter, onFilter, onExport, onAdd, onEdit, onDelete, C, S, focusH }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>Transacciones</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>{filteredTx.length} de {tx.length} registros</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={onExport}><Icon.download /> Exportar</button>
          <button style={S.btnPri} onClick={onAdd}>
            <Icon.plus /> Registrar
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:380}}>
          <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:36}} placeholder="Buscar por descripción o categoría..." value={search} onChange={e => onSearch(e.target.value)} {...focusH} />
        </div>
        <div style={{display:'flex', borderRadius:6, border:`1px solid ${C.borderDark}`, overflow:'hidden'}}>
          {[{v:'all', l:'Todas'}, {v:'income', l:'Ingresos'}, {v:'expense', l:'Egresos'}].map((f, i, arr) => (
            <button
              key={f.v}
              onClick={() => onFilter(f.v)}
              style={{
                background: txFilter === f.v ? C.accent : C.bg2,
                color:      txFilter === f.v ? '#fff' : C.text2,
                border:'none',
                borderRight: i < arr.length - 1 ? `1px solid ${C.borderDark}` : 'none',
                padding:'9px 18px', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit',
                transition:'all .15s',
              }}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:780}}>
            <thead>
              <tr style={{background:C.bg3}}>
                {['Fecha','Descripción','Categoría','Cuenta','Tipo','Monto',''].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'12px 18px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTx.map(t => (
                <tr key={t.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .12s', borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'14px 18px', fontSize:13, color:C.text2, fontFamily:'"SF Mono", Consolas, monospace'}}>{t.date}</td>
                  <td style={{padding:'14px 18px', fontSize:13, fontWeight:500, color:C.text}}>{t.desc}</td>
                  <td style={{padding:'14px 18px', fontSize:13, color:C.text2}}>{t.cat}</td>
                  <td style={{padding:'14px 18px', fontSize:12, color:C.text2}}>{t.account}</td>
                  <td style={{padding:'14px 18px'}}>
                    <span style={{display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:4, background: t.type === 'income' ? '#d1fae5' : '#fee2e2', color: t.type === 'income' ? '#065f46' : '#991b1b'}}>
                      {t.type === 'income' ? <Icon.arrowUp /> : <Icon.arrowDown />}
                      {t.type === 'income' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td style={{padding:'14px 18px', fontFamily:'"SF Mono", Consolas, monospace', fontWeight:600, color: t.type === 'income' ? C.success : C.danger, whiteSpace:'nowrap', textAlign:'right'}}>
                    {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                  </td>
                  <td style={{padding:'14px 18px'}}>
                    <div style={{display:'flex', gap:2, justifyContent:'flex-end'}}>
                      <button style={S.btnIcon} onClick={() => onEdit(t)} aria-label="Editar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.accent}15`; e.currentTarget.style.color = C.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                        <Icon.pencil />
                      </button>
                      <button style={S.btnIcon} onClick={() => onDelete(t.id)} aria-label="Eliminar"
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
