import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { MONTHLY, CATEGORIES } from '../data/seed.js';

export function Dashboard({ tx, balance, totalIncome, totalExpense, totalAssets, dateFilter, onDateFilter, onExport, onNavigate, C, S }) {
  return (
    <div className="fade-in">
      {/* HEADER ROW */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:500, marginBottom:4, letterSpacing:'.2px'}}>EMPRESA EJEMPLO S.A.S · NIT 900.123.456-1</div>
          <h1 style={{fontSize:28, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.6px'}}>Resumen financiero</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>Período: Mayo 2026</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <select style={{...S.input, width:'auto'}} value={dateFilter} onChange={e => onDateFilter(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button style={S.btnGhost} onClick={onExport}>
            <Icon.download /> Exportar
          </button>
        </div>
      </div>

      {/* KPI ROW — estilo banca, números grandes con border-top de color */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, marginBottom:20}}>
        {[
          { l:'Balance del mes',    v:fmt(balance),       sub:'Ingresos − Gastos',    c: balance > 0 ? C.success : C.danger, side: balance > 0 ? C.success : C.danger },
          { l:'Total ingresos',     v:fmt(totalIncome),   sub:`${tx.filter(t => t.type === 'income').length} transacciones`,  c:C.success, side:C.success, icon:<Icon.arrowUp /> },
          { l:'Total egresos',      v:fmt(totalExpense),  sub:`${tx.filter(t => t.type === 'expense').length} transacciones`, c:C.danger,  side:C.danger,  icon:<Icon.arrowDown /> },
          { l:'Total activos',      v:fmt(totalAssets),   sub:'Todas las cuentas',     c:C.accent,  side:C.accent,  icon:<Icon.bank /> },
        ].map(k => (
          <div key={k.l} style={{...S.card, borderLeft:`3px solid ${k.side}`, padding:'18px 22px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
              <div style={{fontSize:12, color:C.text2, fontWeight:500, letterSpacing:'.2px'}}>{k.l}</div>
              {k.icon && <span style={{color:k.side, opacity:.7, display:'flex'}}>{k.icon}</span>}
            </div>
            <div style={{fontSize:24, fontWeight:700, color:k.c, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px', lineHeight:1.1}}>{k.v}</div>
            <div style={{fontSize:12, color:C.text3, marginTop:6}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* GRID 2 cols */}
      <div className="cols-main" style={{display:'grid', gap:16, marginBottom:20}}>
        <div style={{...S.card, minWidth:0}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
            <h2 style={{fontSize:15, fontWeight:600, margin:0, color:C.text, letterSpacing:'-.2px'}}>Ingresos vs Egresos · 6 meses</h2>
            <div style={{display:'flex', gap:14, fontSize:11, color:C.text2}}>
              <span style={{display:'inline-flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:2, background:C.success}}/>Ingresos</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:2, background:C.danger}}/>Egresos</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, boxShadow:C.shadowMd}} formatter={v => [fmt(v)]} />
              <Bar dataKey="ingresos" fill={C.success} radius={[3, 3, 0, 0]} name="Ingresos" />
              <Bar dataKey="gastos"   fill={C.danger}  radius={[3, 3, 0, 0]} name="Egresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <h2 style={{fontSize:15, fontWeight:600, margin:'0 0 18px', color:C.text, letterSpacing:'-.2px'}}>Distribución de gastos</h2>
          {CATEGORIES.map(c => (
            <div key={c.name} style={{marginBottom:14}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                <span style={{fontSize:13, color:C.text}}>{c.name}</span>
                <span style={{fontSize:12, color:C.text2, fontFamily:'"SF Mono", Consolas, monospace'}}>{c.pct}% · {fmt(c.amount)}</span>
              </div>
              <div style={{height:5, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${c.pct}%`, height:'100%', background:c.color, borderRadius:3, transition:'width .5s'}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT TX TABLE */}
      <div style={S.card}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <h2 style={{fontSize:15, fontWeight:600, margin:0, color:C.text, letterSpacing:'-.2px'}}>Últimas transacciones</h2>
          <button style={{...S.btnGhost, padding:'6px 12px', fontSize:13}} onClick={() => onNavigate('transactions')}>Ver todas →</button>
        </div>
        <div style={{margin:'0 -24px', overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:C.bg3, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`}}>
                {['Fecha','Descripción','Categoría','Cuenta','Tipo','Monto'].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'10px 16px', textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tx.slice(0, 5).map(t => (
                <tr key={t.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'12px 16px', fontSize:13, color:C.text2, fontFamily:'"SF Mono", Consolas, monospace'}}>{t.date}</td>
                  <td style={{padding:'12px 16px', fontSize:13, fontWeight:500, color:C.text}}>{t.desc}</td>
                  <td style={{padding:'12px 16px', fontSize:13, color:C.text2}}>{t.cat}</td>
                  <td style={{padding:'12px 16px', fontSize:12, color:C.text2}}>{t.account}</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:4, background: t.type === 'income' ? '#d1fae5' : '#fee2e2', color: t.type === 'income' ? '#065f46' : '#991b1b'}}>
                      {t.type === 'income' ? <Icon.arrowUp /> : <Icon.arrowDown />}
                      {t.type === 'income' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td style={{padding:'12px 16px', fontFamily:'"SF Mono", Consolas, monospace', fontWeight:600, color: t.type === 'income' ? C.success : C.danger, whiteSpace:'nowrap', textAlign:'right'}}>
                    {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
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
