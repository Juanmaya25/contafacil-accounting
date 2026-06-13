import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { fmt } from '../utils/format.js';
import { MONTHLY, CATEGORIES } from '../data/seed.js';

export function Reports({ invoices, accounts, totalIncome, balance, totalAssets, C, S }) {
  const pendingTotal = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  return (
    <div className="fade-in">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>Reportes financieros</h1>
        <div style={{fontSize:14, color:C.text2, marginTop:4}}>Análisis detallado del período</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:20}}>
        {[
          { l:'Margen bruto',         v:`${totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%`, sub:'Este mes',              c:C.success },
          { l:'Cuentas por cobrar',   v:fmt(pendingTotal),                                                      sub:'Pendientes',            c:C.warning },
          { l:'Cuentas por pagar',    v:fmt(2400000),                                                           sub:'Próximas a vencer',     c:C.danger  },
          { l:'Liquidez',             v:'3.2x',                                                                  sub:'Ratio activos/pasivos', c:C.accent  },
        ].map(k => (
          <div key={k.l} style={{...S.card, borderLeft:`3px solid ${k.c}`, padding:'18px 22px'}}>
            <div style={{fontSize:12, color:C.text2, fontWeight:500, letterSpacing:'.2px', marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:22, fontWeight:700, color:k.c, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px'}}>{k.v}</div>
            <div style={{fontSize:12, color:C.text3, marginTop:5}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="cols-half" style={{display:'grid', gap:16, marginBottom:20}}>
        <div style={S.card}>
          <h2 style={{fontSize:15, fontWeight:600, margin:'0 0 18px', color:C.text, letterSpacing:'-.2px'}}>Tendencia de ingresos</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="contaArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={C.success} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={C.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:12, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, boxShadow:C.shadowMd}} formatter={v => [fmt(v)]} />
              <Area type="monotone" dataKey="ingresos" stroke={C.success} strokeWidth={2} fill="url(#contaArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <h2 style={{fontSize:15, fontWeight:600, margin:'0 0 18px', color:C.text, letterSpacing:'-.2px'}}>Categorías de gasto</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CATEGORIES.map(c => ({ ...c, value:c.pct }))} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                {CATEGORIES.map(c => <Cell key={c.name} fill={c.color} stroke={C.bg2} strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, boxShadow:C.shadowMd}} />
              <Legend wrapperStyle={{fontSize:11}} iconType="square" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={S.card}>
        <h2 style={{fontSize:15, fontWeight:600, margin:'0 0 16px', color:C.text, letterSpacing:'-.2px'}}>Resumen por cuenta</h2>
        <div style={{margin:'0 -24px', overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:C.bg3, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`}}>
                {['Cuenta','Tipo','Balance','% del total'].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'10px 18px', textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'12px 18px', fontWeight:500, fontSize:13, color:C.text}}>{a.name}</td>
                  <td style={{padding:'12px 18px', fontSize:12, color:C.text2}}>{a.type === 'bank' ? 'Banco' : a.type === 'cash' ? 'Efectivo' : 'Por cobrar'}</td>
                  <td style={{padding:'12px 18px', fontFamily:'"SF Mono", Consolas, monospace', fontWeight:600, color:a.color, textAlign:'right'}}>{fmt(a.balance)}</td>
                  <td style={{padding:'12px 18px', fontFamily:'"SF Mono", Consolas, monospace', fontSize:13, color:C.text2}}>{Math.round(a.balance / totalAssets * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
