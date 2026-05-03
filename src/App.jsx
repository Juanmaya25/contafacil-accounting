import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from "recharts";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_TX = [
  { id:1,  date:'2025-05-01', desc:'Venta productos - Cliente ABC',    cat:'Ingresos',     type:'income',  amount:2850000, account:'Bancolombia',  invoice:'FAC-041' },
  { id:2,  date:'2025-05-01', desc:'Pago arriendo local',              cat:'Gastos fijos', type:'expense', amount:1200000, account:'Davivienda',   invoice:'' },
  { id:3,  date:'2025-04-30', desc:'Venta servicios - Empresa XYZ',    cat:'Ingresos',     type:'income',  amount:4500000, account:'Bancolombia',  invoice:'FAC-040' },
  { id:4,  date:'2025-04-30', desc:'Compra insumos - Proveedor Norte', cat:'Compras',      type:'expense', amount:980000,  account:'Davivienda',   invoice:'' },
  { id:5,  date:'2025-04-29', desc:'Nómina empleados - Abril',         cat:'Nómina',       type:'expense', amount:3200000, account:'Bancolombia',  invoice:'' },
  { id:6,  date:'2025-04-29', desc:'Venta contado - Cliente DEF',      cat:'Ingresos',     type:'income',  amount:1750000, account:'Caja menor',   invoice:'FAC-039' },
  { id:7,  date:'2025-04-28', desc:'Servicios públicos - Abril',       cat:'Gastos fijos', type:'expense', amount:380000,  account:'Davivienda',   invoice:'' },
  { id:8,  date:'2025-04-28', desc:'Comisión ventas - Representante',  cat:'Comisiones',   type:'expense', amount:285000,  account:'Bancolombia',  invoice:'' },
  { id:9,  date:'2025-04-27', desc:'Venta consultoría - GHI Corp',     cat:'Ingresos',     type:'income',  amount:3100000, account:'Bancolombia',  invoice:'FAC-038' },
  { id:10, date:'2025-04-26', desc:'Material oficina',                  cat:'Compras',      type:'expense', amount:145000,  account:'Caja menor',   invoice:'' },
];

const INIT_INVOICES = [
  { id:'FAC-2025-041', client:'Empresa ABC S.A.S',  nit:'900123456-1', date:'2025-04-15', due:'2025-05-15', amount:2850000, status:'pending', items:3 },
  { id:'FAC-2025-040', client:'Comercial XYZ Ltda', nit:'900234567-2', date:'2025-04-10', due:'2025-05-10', amount:4500000, status:'paid',    items:5 },
  { id:'FAC-2025-039', client:'Distribuidora DEF',  nit:'900345678-3', date:'2025-04-05', due:'2025-05-05', amount:1750000, status:'overdue', items:2 },
  { id:'FAC-2025-038', client:'Servicios GHI',      nit:'900456789-4', date:'2025-03-28', due:'2025-04-28', amount:3100000, status:'paid',    items:4 },
  { id:'FAC-2025-037', client:'Constructora Norte', nit:'900567890-5', date:'2025-03-20', due:'2025-04-20', amount:5200000, status:'paid',    items:1 },
  { id:'FAC-2025-036', client:'Tienda Central',     nit:'900678901-6', date:'2025-03-15', due:'2025-04-15', amount:890000,  status:'overdue', items:8 },
];

const INIT_ACCOUNTS = [
  { id:1, name:'Bancolombia Ahorros',  number:'***4521',  balance:18450000, type:'bank',    color:'#fbbf24', currency:'COP' },
  { id:2, name:'Davivienda Corriente', number:'***8834',  balance:6200000,  type:'bank',    color:'#ef4444', currency:'COP' },
  { id:3, name:'Caja menor',           number:'Efectivo', balance:850000,   type:'cash',    color:'#22c55e', currency:'COP' },
  { id:4, name:'Cuentas por cobrar',   number:'Clientes', balance:9300000,  type:'receive', color:'#3b82f6', currency:'COP' },
];

const MONTHLY = [
  { mes:'Nov', ingresos:18500000, gastos:12300000 },
  { mes:'Dic', ingresos:28000000, gastos:16800000 },
  { mes:'Ene', ingresos:15200000, gastos:11400000 },
  { mes:'Feb', ingresos:21000000, gastos:13200000 },
  { mes:'Mar', ingresos:19800000, gastos:12900000 },
  { mes:'Abr', ingresos:24500000, gastos:14100000 },
];

const CATEGORIES = [
  { name:'Nómina',       pct:38, color:'#f87171', amount:14100000 },
  { name:'Compras',      pct:28, color:'#fb923c', amount:10400000 },
  { name:'Gastos fijos', pct:20, color:'#facc15', amount:7400000 },
  { name:'Comisiones',   pct:9,  color:'#a78bfa', amount:3300000 },
  { name:'Otros',        pct:5,  color:'#94a3b8', amount:1900000 },
];

const themes = {
  light: { bg:'#f9fafb', bg2:'#ffffff', bg3:'#f3f4f6', accent:'#1d4ed8', accent2:'#059669', red:'#dc2626', text:'#111827', text2:'#6b7280', text3:'#9ca3af', border:'#e5e7eb', kpiPos:'#ecfdf5', kpiNeg:'#fef2f2', kpiNeutral:'#eff6ff' },
  dark:  { bg:'#0f172a', bg2:'#1e293b', bg3:'#334155', accent:'#60a5fa', accent2:'#34d399', red:'#f87171', text:'#f1f5f9', text2:'#94a3b8', text3:'#64748b', border:'#334155', kpiPos:'#064e3b22', kpiNeg:'#7f1d1d22', kpiNeutral:'#1e3a8a22' },
};

const invoiceStatus = {
  paid:    { l:'Pagada',    bg:'rgba(16,185,129,.15)', c:'#059669' },
  pending: { l:'Pendiente', bg:'rgba(251,191,36,.15)', c:'#d97706' },
  overdue: { l:'Vencida',   bg:'rgba(239,68,68,.15)',  c:'#dc2626' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');
const accountIcon = type => type === 'bank' ? '🏦' : type === 'cash' ? '💵' : '📋';

// ─── COMPONENTES TOP-LEVEL ──────────────────────────────────────────

function KPI({ label, value, sub, color, bg, icon, trend, C, S }) {
  return (
    <div
      style={{...S.card, background: bg || C.bg2, transition:'transform .2s'}}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
        <div style={{fontSize:11, color:C.text2, textTransform:'uppercase', letterSpacing:'.5px'}}>{label}</div>
        {icon && <span style={{fontSize:18, opacity:.6}}>{icon}</span>}
      </div>
      <div style={{fontSize:20, fontWeight:700, color, fontFamily:'monospace', marginBottom:4}}>{value}</div>
      <div style={{fontSize:12, color:C.text3, display:'flex', alignItems:'center', gap:6}}>
        {trend !== undefined && trend !== null && (
          <span style={{color: trend > 0 ? C.accent2 : C.red, fontWeight:700}}>
            {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}

function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.5)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{...S.card, width:'100%', maxWidth: size==='lg' ? 720 : 520, boxShadow:'0 30px 80px rgba(0,0,0,.3)'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
          <h2 style={{fontSize:16, fontWeight:700, margin:0, color:C.text}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, fontSize:22, cursor:'pointer', lineHeight:1, padding:0}}>×</button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:22}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]           = useState('light');
  const [page, setPage]             = useState('dashboard');
  const [tx, setTx]                 = useState(INIT_TX);
  const [invoices, setInvoices]     = useState(INIT_INVOICES);
  const [accounts]                  = useState(INIT_ACCOUNTS);
  const [modal, setModal]           = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState({});
  const [search, setSearch]         = useState('');
  const [txFilter, setTxFilter]     = useState('all');
  const [dateFilter, setDateFilter] = useState('month');
  const [toast, setToast]           = useState(null);
  const [confirm, setConfirm]       = useState(null);

  const C = themes[theme];

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const nextNumericId = arr => (arr.length ? Math.max(...arr.map(x => typeof x.id === 'number' ? x.id : 0)) : 0) + 1;
  const closeModal = useCallback(() => { setModal(null); setEditTarget(null); setForm({}); }, []);

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`"${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  const saveTransaction = () => {
    if (!validate([['Descripción', form.desc], ['Monto', form.amount]])) return;
    const t = { ...form, amount: +form.amount || 0, date: form.date || new Date().toISOString().split('T')[0] };
    if (!editTarget) {
      setTx(tt => [{ ...t, id: nextNumericId(tt) }, ...tt]);
      showToast('Transacción registrada');
    } else {
      setTx(tt => tt.map(x => x.id === editTarget.id ? { ...x, ...t } : x));
      showToast('Transacción actualizada');
    }
    closeModal();
  };

  const delTx = id => setConfirm({
    msg: '¿Eliminar esta transacción?',
    onYes: () => { setTx(tt => tt.filter(x => x.id !== id)); showToast('Transacción eliminada'); setConfirm(null); }
  });

  const saveInvoice = () => {
    if (!validate([['Cliente', form.client], ['Monto', form.amount]])) return;
    const inv = { ...form, amount: +form.amount || 0, items: +form.items || 1 };
    if (!editTarget) {
      const maxNum = invoices.reduce((max, i) => {
        const num = parseInt(i.id.split('-')[2] || '0', 10);
        return Math.max(max, num);
      }, 0);
      const newId = `FAC-2025-${String(maxNum + 1).padStart(3, '0')}`;
      setInvoices(ii => [{ ...inv, id: newId, status:'pending' }, ...ii]);
      showToast('Factura creada');
    } else {
      setInvoices(ii => ii.map(x => x.id === editTarget.id ? { ...x, ...inv } : x));
      showToast('Factura actualizada');
    }
    closeModal();
  };

  const markPaidInvoice = id => {
    setInvoices(ii => ii.map(i => i.id === id ? { ...i, status:'paid' } : i));
    showToast('Factura marcada como pagada');
  };

  const delInvoice = id => setConfirm({
    msg: '¿Eliminar esta factura?',
    onYes: () => { setInvoices(ii => ii.filter(x => x.id !== id)); showToast('Factura eliminada'); setConfirm(null); }
  });

  const exportCSV = (data, name) => {
    if (!data.length) { showToast('No hay datos', 'error'); return; }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${name}.csv descargado`);
  };

  const totalIncome  = useMemo(() => tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [tx]);
  const totalExpense = useMemo(() => tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [tx]);
  const balance      = totalIncome - totalExpense;
  const totalAssets  = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);

  const filteredTx = useMemo(() => {
    let arr = txFilter === 'all' ? tx : tx.filter(t => t.type === txFilter);
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(t => t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q));
    }
    return arr;
  }, [tx, txFilter, search]);

  const nav = [
    { id:'dashboard',    label:'Resumen',       icon:'📊' },
    { id:'transactions', label:'Transacciones', icon:'↕️' },
    { id:'invoices',     label:'Facturas',      icon:'🧾' },
    { id:'accounts',     label:'Cuentas',       icon:'🏦' },
    { id:'reports',      label:'Reportes',      icon:'📈' },
  ];

  const S = {
    card:     { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22 },
    input:    { background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 14px', fontSize:13, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' },
    label:    { fontSize:11, color:C.text3, fontWeight:600, display:'block', marginBottom:6, letterSpacing:'.5px', textTransform:'uppercase' },
    btnPri:   { background:C.accent, color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
    btnGhost: { background:'transparent', color:C.text2, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 20px', fontSize:13, cursor:'pointer', fontFamily:'inherit' },
    btnEdit:  { background:`${C.accent}25`, color:C.accent, border:'none', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
    btnDel:   { background:`${C.red}20`, color:C.red, border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontFamily:'inherit' },
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div>
          <div style={{fontSize:22, fontWeight:700}}>Resumen Financiero</div>
          <div style={{fontSize:13, color:C.text2, marginTop:2}}>Empresa Ejemplo S.A.S · Mayo 2025</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <select style={{...S.input, width:'auto'}} value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button style={S.btnGhost} onClick={() => exportCSV(tx, 'transacciones')}>📥 Exportar</button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginTop:18, marginBottom:18}}>
        <KPI C={C} S={S} label="Balance del mes" value={fmt(balance)}      sub="Ingresos - Gastos"                                       color={balance > 0 ? C.accent2 : C.red} bg={balance > 0 ? C.kpiPos : C.kpiNeg} icon="💰" trend={15} />
        <KPI C={C} S={S} label="Total ingresos"  value={fmt(totalIncome)}  sub={`${tx.filter(t => t.type === 'income').length} transacciones`}  color={C.accent2} bg={C.kpiPos}     icon="↑"  trend={12} />
        <KPI C={C} S={S} label="Total gastos"    value={fmt(totalExpense)} sub={`${tx.filter(t => t.type === 'expense').length} transacciones`} color={C.red}     bg={C.kpiNeg}     icon="↓"  trend={-5} />
        <KPI C={C} S={S} label="Total activos"   value={fmt(totalAssets)}  sub="Todas las cuentas"                                       color={C.accent}  bg={C.kpiNeutral} icon="🏦" />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:14, marginBottom:14}}>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Ingresos vs Gastos · 6 meses</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [fmt(v)]} />
              <Legend wrapperStyle={{fontSize:12}} />
              <Bar dataKey="ingresos" fill={C.accent2} radius={[4, 4, 0, 0]} name="Ingresos" />
              <Bar dataKey="gastos"   fill={C.red}     radius={[4, 4, 0, 0]} name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Distribución gastos</div>
          {CATEGORIES.map(c => (
            <div key={c.name} style={{marginBottom:14}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                <span style={{fontSize:13, color:C.text}}>{c.name}</span>
                <span style={{fontSize:12, color:C.text2, fontFamily:'monospace'}}>{c.pct}% · {fmt(c.amount)}</span>
              </div>
              <div style={{height:6, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${c.pct}%`, height:'100%', background:c.color, borderRadius:3, transition:'width .5s'}} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
          <div style={{fontSize:14, fontWeight:700}}>Últimas transacciones</div>
          <button style={{...S.btnGhost, fontSize:12, padding:'5px 12px'}} onClick={() => setPage('transactions')}>Ver todas →</button>
        </div>
        {tx.slice(0, 5).map(t => (
          <div key={t.id} style={{display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:38, height:38, borderRadius:10, background: t.type === 'income' ? C.kpiPos : C.kpiNeg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, color: t.type === 'income' ? C.accent2 : C.red, fontWeight:700}}>
              {t.type === 'income' ? '↑' : '↓'}
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13, fontWeight:500}}>{t.desc}</div>
              <div style={{fontSize:11, color:C.text3}}>{t.cat} · {t.account} · {t.date}</div>
            </div>
            <div style={{fontFamily:'monospace', fontWeight:700, color: t.type === 'income' ? C.accent2 : C.red, fontSize:14, whiteSpace:'nowrap'}}>
              {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Transacciones</div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredTx, 'transacciones')}>📥 Exportar</button>
          <button style={S.btnPri}   onClick={() => { setModal('tx'); setEditTarget(null); setForm({type:'income', cat:'Ingresos'}); }}>+ Registrar</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{filteredTx.length} de {tx.length} transacciones</div>
      <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap'}}>
        <input style={{...S.input, maxWidth:280}} placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
        {[{v:'all', l:'Todas'}, {v:'income', l:'Ingresos'}, {v:'expense', l:'Gastos'}].map(f => (
          <button
            key={f.v}
            onClick={() => setTxFilter(f.v)}
            style={{background: txFilter === f.v ? C.accent : 'transparent', color: txFilter === f.v ? '#fff' : C.text2, border:`1px solid ${txFilter === f.v ? C.accent : C.border}`, borderRadius:100, padding:'7px 18px', fontSize:13, cursor:'pointer', fontFamily:'inherit'}}
          >
            {f.l}
          </button>
        ))}
      </div>
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:800}}>
            <thead>
              <tr style={{background:C.bg3}}>
                {['Fecha','Descripción','Categoría','Cuenta','Tipo','Monto',''].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'12px 16px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTx.map(t => (
                <tr key={t.id}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{transition:'background .15s', borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'12px 16px', fontSize:13, color:C.text2, fontFamily:'monospace'}}>{t.date}</td>
                  <td style={{padding:'12px 16px', fontSize:13, fontWeight:500}}>{t.desc}</td>
                  <td style={{padding:'12px 16px', fontSize:13, color:C.text2}}>{t.cat}</td>
                  <td style={{padding:'12px 16px', fontSize:12, color:C.text2}}>{t.account}</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background: t.type === 'income' ? C.kpiPos : C.kpiNeg, color: t.type === 'income' ? C.accent2 : C.red}}>
                      {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td style={{padding:'12px 16px', fontFamily:'monospace', fontWeight:700, color: t.type === 'income' ? C.accent2 : C.red, whiteSpace:'nowrap'}}>
                    {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                  </td>
                  <td style={{padding:'12px 16px'}}>
                    <div style={{display:'flex', gap:6}}>
                      <button style={S.btnEdit} onClick={() => { setModal('tx'); setEditTarget(t); setForm({ ...t }); }}>✏️</button>
                      <button style={S.btnDel}  onClick={() => delTx(t.id)}>🗑️</button>
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

  const renderInvoices = () => {
    const paidTotal     = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const pendingTotal  = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
    const overdueTotal  = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
    return (
      <div className="fade-in">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
          <div style={{fontSize:22, fontWeight:700}}>Facturas</div>
          <div style={{display:'flex', gap:8}}>
            <button style={S.btnGhost} onClick={() => exportCSV(invoices, 'facturas')}>📥 Exportar</button>
            <button style={S.btnPri}   onClick={() => { setModal('invoice'); setEditTarget(null); setForm({date:'2025-05-01'}); }}>+ Nueva factura</button>
          </div>
        </div>
        <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{invoices.length} facturas registradas</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:18}}>
          <div style={{background:C.kpiPos, border:`1px solid ${C.accent2}30`, borderRadius:12, padding:18}}>
            <div style={{fontSize:11, color:C.accent2, fontWeight:600, marginBottom:6}}>PAGADAS</div>
            <div style={{fontSize:22, fontWeight:700, color:C.accent2, fontFamily:'monospace'}}>{fmt(paidTotal)}</div>
            <div style={{fontSize:12, color:C.text2}}>{invoices.filter(i => i.status === 'paid').length} facturas</div>
          </div>
          <div style={{background:'rgba(251,191,36,.12)', border:'1px solid rgba(251,191,36,.3)', borderRadius:12, padding:18}}>
            <div style={{fontSize:11, color:'#d97706', fontWeight:600, marginBottom:6}}>PENDIENTES</div>
            <div style={{fontSize:22, fontWeight:700, color:'#d97706', fontFamily:'monospace'}}>{fmt(pendingTotal)}</div>
            <div style={{fontSize:12, color:C.text2}}>{invoices.filter(i => i.status === 'pending').length} facturas</div>
          </div>
          <div style={{background:C.kpiNeg, border:`1px solid ${C.red}30`, borderRadius:12, padding:18}}>
            <div style={{fontSize:11, color:C.red, fontWeight:600, marginBottom:6}}>VENCIDAS</div>
            <div style={{fontSize:22, fontWeight:700, color:C.red, fontFamily:'monospace'}}>{fmt(overdueTotal)}</div>
            <div style={{fontSize:12, color:C.text2}}>{invoices.filter(i => i.status === 'overdue').length} facturas</div>
          </div>
        </div>
        <div style={{...S.card, padding:0, overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:800}}>
              <thead>
                <tr style={{background:C.bg3}}>
                  {['N° Factura','Cliente','NIT','Fecha','Vencimiento','Monto','Estado','Acción'].map(h => (
                    <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'12px 16px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    style={{transition:'background .15s', borderBottom:`1px solid ${C.border}`}}>
                    <td style={{padding:'12px 16px', fontFamily:'monospace', fontSize:13, color:C.accent, fontWeight:600}}>{inv.id}</td>
                    <td style={{padding:'12px 16px', fontSize:13, fontWeight:500}}>{inv.client}</td>
                    <td style={{padding:'12px 16px', fontSize:12, color:C.text2, fontFamily:'monospace'}}>{inv.nit}</td>
                    <td style={{padding:'12px 16px', fontSize:13, color:C.text2, fontFamily:'monospace'}}>{inv.date}</td>
                    <td style={{padding:'12px 16px', fontSize:13, color: inv.status === 'overdue' ? C.red : C.text2, fontFamily:'monospace'}}>{inv.due}</td>
                    <td style={{padding:'12px 16px', fontFamily:'monospace', fontWeight:700}}>{fmt(inv.amount)}</td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:12, background:invoiceStatus[inv.status].bg, color:invoiceStatus[inv.status].c}}>{invoiceStatus[inv.status].l}</span>
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex', gap:6}}>
                        {inv.status !== 'paid' && <button style={{...S.btnEdit, background:`${C.accent2}20`, color:C.accent2}} onClick={() => markPaidInvoice(inv.id)}>✓ Pagar</button>}
                        <button style={S.btnEdit} onClick={() => { setModal('invoice'); setEditTarget(inv); setForm({ ...inv }); }}>✏️</button>
                        <button style={S.btnDel}  onClick={() => delInvoice(inv.id)}>🗑️</button>
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
  };

  const renderAccounts = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div>
          <div style={{fontSize:22, fontWeight:700}}>Cuentas</div>
          <div style={{fontSize:13, color:C.text2, marginTop:2}}>Total activos: <strong style={{color:C.accent}}>{fmt(totalAssets)}</strong></div>
        </div>
        <button style={S.btnPri} onClick={() => showToast('Próximamente: agregar cuenta')}>+ Nueva cuenta</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:14, marginTop:18}}>
        {accounts.map(a => (
          <div key={a.id}
            style={{...S.card, transition:'transform .2s'}}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16}}>
              <div>
                <div style={{fontSize:15, fontWeight:700, marginBottom:3}}>{a.name}</div>
                <div style={{fontSize:12, color:C.text2, fontFamily:'monospace'}}>{a.number}</div>
              </div>
              <div style={{width:42, height:42, borderRadius:12, background:`${a.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>{accountIcon(a.type)}</div>
            </div>
            <div style={{fontSize:26, fontWeight:700, color:a.color, fontFamily:'monospace', marginBottom:4}}>{fmt(a.balance)}</div>
            <div style={{fontSize:11, color:C.text3}}>Saldo disponible · {a.currency}</div>
            <div style={{marginTop:16, height:5, background:C.bg3, borderRadius:3}}>
              <div style={{width:`${Math.round(a.balance / totalAssets * 100)}%`, height:'100%', background:a.color, borderRadius:3, transition:'width .5s'}} />
            </div>
            <div style={{fontSize:11, color:C.text3, marginTop:5}}>{Math.round(a.balance / totalAssets * 100)}% del total</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => {
    const pendingTotal = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
    return (
      <div className="fade-in">
        <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>Reportes</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Análisis financiero detallado</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:18}}>
          <KPI C={C} S={S} label="Margen bruto"        value={`${totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%`} sub="Este mes"               color={C.accent2} icon="📊" trend={5} />
          <KPI C={C} S={S} label="Cuentas por cobrar"  value={fmt(pendingTotal)}                                                       sub="Pendientes"             color="#f59e0b"   icon="📋" />
          <KPI C={C} S={S} label="Cuentas por pagar"   value={fmt(2400000)}                                                            sub="Próximas a vencer"      color={C.red}     icon="📤" />
          <KPI C={C} S={S} label="Liquidez"            value="3.2x"                                                                    sub="Ratio activos/pasivos"  color={C.accent}  icon="💧" trend={8} />
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
          <div style={S.card}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Tendencia ingresos</div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.accent2} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.accent2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="mes" tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:11, fill:C.text2}} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} formatter={v => [fmt(v)]} />
                <Area type="monotone" dataKey="ingresos" stroke={C.accent2} strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={S.card}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Categorías de gasto</div>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={CATEGORIES.map(c => ({ ...c, value:c.pct }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {CATEGORIES.map(c => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{background:C.bg3, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12}} />
                <Legend wrapperStyle={{fontSize:11}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Resumen por cuenta</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr>{['Cuenta','Tipo','Balance','% del total'].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'10px 12px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id}>
                    <td style={{padding:'12px', fontWeight:600, fontSize:13}}>{a.name}</td>
                    <td style={{padding:'12px', fontSize:12, color:C.text2}}>{a.type === 'bank' ? 'Banco' : a.type === 'cash' ? 'Efectivo' : 'Por cobrar'}</td>
                    <td style={{padding:'12px', fontFamily:'monospace', fontWeight:700, color:a.color}}>{fmt(a.balance)}</td>
                    <td style={{padding:'12px', fontFamily:'monospace', fontSize:13}}>{Math.round(a.balance / totalAssets * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const pageRender = {
    dashboard:    renderDashboard,
    transactions: renderTransactions,
    invoices:     renderInvoices,
    accounts:     renderAccounts,
    reports:      renderReports,
  }[page] || renderDashboard;

  return (
    <div style={{position:'relative', minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:C.text, fontSize:14}}>

      {/* MODAL: TRANSACTION */}
      {modal === 'tx' && (
        <Modal title={editTarget ? 'Editar transacción' : 'Nueva transacción'} onSave={saveTransaction} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Descripción *</label><input style={S.input} value={form.desc||''} onChange={fv('desc')} placeholder="Descripción de la transacción" autoComplete="off" /></div>
            <div><label style={S.label}>Tipo</label>
              <select style={S.input} value={form.type||'income'} onChange={fv('type')}>
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <div><label style={S.label}>Monto (COP) *</label><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="0" /></div>
            <div><label style={S.label}>Categoría</label>
              <select style={S.input} value={form.cat||''} onChange={fv('cat')}>
                <option value="">Seleccionar...</option>
                <option>Ingresos</option><option>Compras</option><option>Nómina</option>
                <option>Gastos fijos</option><option>Comisiones</option><option>Otros</option>
              </select>
            </div>
            <div><label style={S.label}>Cuenta</label>
              <select style={S.input} value={form.account||''} onChange={fv('account')}>
                <option value="">Seleccionar...</option>
                {accounts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Fecha</label><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} /></div>
          </div>
        </Modal>
      )}

      {/* MODAL: INVOICE */}
      {modal === 'invoice' && (
        <Modal title={editTarget ? 'Editar factura' : 'Nueva factura'} onSave={saveInvoice} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Cliente *</label><input style={S.input} value={form.client||''} onChange={fv('client')} placeholder="Empresa ABC S.A.S" autoComplete="off" /></div>
            <div><label style={S.label}>NIT</label><input style={S.input} value={form.nit||''} onChange={fv('nit')} placeholder="900000000-0" autoComplete="off" /></div>
            <div><label style={S.label}>N° de items</label><input style={S.input} type="number" min="1" value={form.items||''} onChange={fv('items')} placeholder="1" /></div>
            <div><label style={S.label}>Fecha emisión</label><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} /></div>
            <div><label style={S.label}>Fecha vencimiento</label><input style={S.input} type="date" value={form.due||''} onChange={fv('due')} /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Monto total (COP) *</label><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="0" /></div>
          </div>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{...S.card, maxWidth:380, textAlign:'center'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:36, marginBottom:14}}>⚠️</div>
            <div style={{fontSize:15, fontWeight:600, marginBottom:20}}>{confirm.msg}</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.red}} onClick={confirm.onYes}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent2, color:'#fff', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:1001, boxShadow:'0 8px 24px rgba(0,0,0,.2)', display:'flex', alignItems:'center', gap:10}}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'220px 1fr'}}>
        {/* SIDEBAR */}
        <div style={{background:C.bg2, borderRight:`1px solid ${C.border}`, minHeight:'100vh', padding:'22px 0', display:'flex', flexDirection:'column', position:'sticky', top:0}}>
          <div style={{padding:'0 20px 22px', borderBottom:`1px solid ${C.border}`, marginBottom:14}}>
            <div style={{fontSize:18, fontWeight:700, color:C.accent}}>ContaFácil</div>
            <div style={{fontSize:11, color:C.text2, marginTop:2}}>Empresa Ejemplo S.A.S</div>
          </div>
          {nav.map(n => (
            <div key={n.id}
              onClick={() => setPage(n.id)}
              role="button" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPage(n.id); } }}
              style={{display:'flex', alignItems:'center', gap:10, padding:'10px 20px', cursor:'pointer', fontSize:13, background: page === n.id ? `${C.accent}14` : 'transparent', color: page === n.id ? C.accent : C.text2, fontWeight: page === n.id ? 600 : 400, borderRight: page === n.id ? `3px solid ${C.accent}` : '3px solid transparent', transition:'all .15s', marginBottom:2, userSelect:'none'}}>
              <span style={{fontSize:16}}>{n.icon}</span>{n.label}
            </div>
          ))}
          <div style={{marginTop:'auto', padding:'18px', borderTop:`1px solid ${C.border}`}}>
            <div style={{background:C.bg3, borderRadius:10, padding:14, marginBottom:12}}>
              <div style={{fontSize:11, color:C.text3, marginBottom:4}}>BALANCE ACTUAL</div>
              <div style={{fontSize:18, fontWeight:700, color: balance > 0 ? C.accent2 : C.red, fontFamily:'monospace'}}>{fmt(balance)}</div>
            </div>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{...S.btnGhost, fontSize:12, padding:'7px 14px', width:'100%'}}>
              {theme === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
            </button>
          </div>
        </div>
        <div style={{padding:'24px 30px', overflowY:'auto'}}>{pageRender()}</div>
      </div>
    </div>
  );
}
