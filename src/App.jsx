import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from "recharts";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_TX = [
  { id:1,  date:'2026-05-01', desc:'Venta productos - Cliente ABC',    cat:'Ingresos',     type:'income',  amount:2850000, account:'Bancolombia',  invoice:'FAC-041' },
  { id:2,  date:'2026-05-01', desc:'Pago arriendo local',              cat:'Gastos fijos', type:'expense', amount:1200000, account:'Davivienda',   invoice:'' },
  { id:3,  date:'2026-04-30', desc:'Venta servicios - Empresa XYZ',    cat:'Ingresos',     type:'income',  amount:4500000, account:'Bancolombia',  invoice:'FAC-040' },
  { id:4,  date:'2026-04-30', desc:'Compra insumos - Proveedor Norte', cat:'Compras',      type:'expense', amount:980000,  account:'Davivienda',   invoice:'' },
  { id:5,  date:'2026-04-29', desc:'Nómina empleados - Abril',         cat:'Nómina',       type:'expense', amount:3200000, account:'Bancolombia',  invoice:'' },
  { id:6,  date:'2026-04-29', desc:'Venta contado - Cliente DEF',      cat:'Ingresos',     type:'income',  amount:1750000, account:'Caja menor',   invoice:'FAC-039' },
  { id:7,  date:'2026-04-28', desc:'Servicios públicos - Abril',       cat:'Gastos fijos', type:'expense', amount:380000,  account:'Davivienda',   invoice:'' },
  { id:8,  date:'2026-04-28', desc:'Comisión ventas - Representante',  cat:'Comisiones',   type:'expense', amount:285000,  account:'Bancolombia',  invoice:'' },
  { id:9,  date:'2026-04-27', desc:'Venta consultoría - GHI Corp',     cat:'Ingresos',     type:'income',  amount:3100000, account:'Bancolombia',  invoice:'FAC-038' },
  { id:10, date:'2026-04-26', desc:'Material oficina',                 cat:'Compras',      type:'expense', amount:145000,  account:'Caja menor',   invoice:'' },
];

const INIT_INVOICES = [
  { id:'FAC-2026-041', client:'Empresa ABC S.A.S',  nit:'900123456-1', date:'2026-04-15', due:'2026-05-15', amount:2850000, status:'pending', items:3 },
  { id:'FAC-2026-040', client:'Comercial XYZ Ltda', nit:'900234567-2', date:'2026-04-10', due:'2026-05-10', amount:4500000, status:'paid',    items:5 },
  { id:'FAC-2026-039', client:'Distribuidora DEF',  nit:'900345678-3', date:'2026-04-05', due:'2026-05-05', amount:1750000, status:'overdue', items:2 },
  { id:'FAC-2026-038', client:'Servicios GHI',      nit:'900456789-4', date:'2026-03-28', due:'2026-04-28', amount:3100000, status:'paid',    items:4 },
  { id:'FAC-2026-037', client:'Constructora Norte', nit:'900567890-5', date:'2026-03-20', due:'2026-04-20', amount:5200000, status:'paid',    items:1 },
  { id:'FAC-2026-036', client:'Tienda Central',     nit:'900678901-6', date:'2026-03-15', due:'2026-04-15', amount:890000,  status:'overdue', items:8 },
];

const INIT_ACCOUNTS = [
  { id:1, name:'Bancolombia Ahorros',  number:'***4521',  balance:18450000, type:'bank',    color:'#1d4ed8', currency:'COP' },
  { id:2, name:'Davivienda Corriente', number:'***8834',  balance:6200000,  type:'bank',    color:'#dc2626', currency:'COP' },
  { id:3, name:'Caja menor',           number:'Efectivo', balance:850000,   type:'cash',    color:'#059669', currency:'COP' },
  { id:4, name:'Cuentas por cobrar',   number:'Clientes', balance:9300000,  type:'receive', color:'#7c3aed', currency:'COP' },
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
  { name:'Nómina',       pct:38, color:'#dc2626', amount:14100000 },
  { name:'Compras',      pct:28, color:'#ea580c', amount:10400000 },
  { name:'Gastos fijos', pct:20, color:'#ca8a04', amount:7400000 },
  { name:'Comisiones',   pct:9,  color:'#7c3aed', amount:3300000 },
  { name:'Otros',        pct:5,  color:'#475569', amount:1900000 },
];

// PALETTE: navy corporativo + acento dorado, mucho whitespace
const themes = {
  light: {
    bg:        '#f1f5f9',
    bg2:       '#ffffff',
    bg3:       '#f8fafc',
    primary:   '#0f172a',          // navy oscuro
    primarySoft:'#1e293b',
    accent:    '#1d4ed8',          // azul corporativo
    accent2:   '#0891b2',
    success:   '#059669',
    danger:    '#dc2626',
    warning:   '#d97706',
    text:      '#0f172a',
    text2:     '#475569',
    text3:     '#94a3b8',
    border:    '#e2e8f0',
    borderDark:'#cbd5e1',
    shadow:    '0 1px 3px rgba(15,23,42,.08), 0 1px 2px rgba(15,23,42,.04)',
    shadowMd:  '0 4px 12px rgba(15,23,42,.08)',
    shadowLg:  '0 12px 32px rgba(15,23,42,.12)',
  },
  dark: {
    bg:        '#0a0f1a',
    bg2:       '#0f172a',
    bg3:       '#1e293b',
    primary:   '#f1f5f9',
    primarySoft:'#cbd5e1',
    accent:    '#60a5fa',
    accent2:   '#22d3ee',
    success:   '#34d399',
    danger:    '#f87171',
    warning:   '#fbbf24',
    text:      '#f1f5f9',
    text2:     '#94a3b8',
    text3:     '#64748b',
    border:    '#1e293b',
    borderDark:'#334155',
    shadow:    '0 1px 3px rgba(0,0,0,.3)',
    shadowMd:  '0 4px 12px rgba(0,0,0,.4)',
    shadowLg:  '0 12px 32px rgba(0,0,0,.5)',
  },
};

const invoiceStatus = {
  paid:    { l:'Pagada',    bg:'#d1fae5', c:'#059669', dot:'#10b981' },
  pending: { l:'Pendiente', bg:'#fef3c7', c:'#d97706', dot:'#f59e0b' },
  overdue: { l:'Vencida',   bg:'#fee2e2', c:'#dc2626', dot:'#ef4444' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');

// ─── SVG ICONS ──────────────────────────────────────────────────────
const Icon = {
  pencil: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  arrowUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  arrowDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  bank: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  cash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  receipt: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  sun: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  building: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M10 22v-4h4v4"/></svg>,
};

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────

function Modal({ title, onSave, onClose, children, size='md', C, S }) {
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(15, 23, 42, .55)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, borderRadius:8, padding:0, width:'100%', maxWidth: size==='lg' ? 720 : 540, boxShadow:C.shadowLg, border:`1px solid ${C.border}`}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{padding:'20px 28px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{fontSize:18, fontWeight:600, margin:0, color:C.text, letterSpacing:'-.3px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, cursor:'pointer', padding:6, borderRadius:6, display:'flex'}}>
            {Icon.close()}
          </button>
        </div>
        <div style={{padding:'24px 28px'}}>{children}</div>
        <div style={{padding:'16px 28px', borderTop:`1px solid ${C.border}`, background:C.bg3, display:'flex', gap:10, justifyContent:'flex-end'}}>
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
      const newId = `FAC-2026-${String(maxNum + 1).padStart(3, '0')}`;
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

  const tabs = [
    { id:'dashboard',    label:'Resumen' },
    { id:'transactions', label:'Transacciones' },
    { id:'invoices',     label:'Facturación' },
    { id:'accounts',     label:'Cuentas' },
    { id:'reports',      label:'Reportes' },
  ];

  const S = {
    card: { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8, padding:24, boxShadow:C.shadow },
    cardFlat: { background:C.bg3, borderRadius:8, padding:18 },
    input: {
      background: C.bg2, border:`1px solid ${C.borderDark}`, borderRadius:6,
      padding:'9px 12px', fontSize:14, color:C.text, outline:'none',
      fontFamily:'inherit', width:'100%', boxSizing:'border-box',
      transition:'border-color .15s, box-shadow .15s',
    },
    label: { fontSize:12, color:C.text2, fontWeight:500, display:'block', marginBottom:6 },
    btnPri: { background:C.accent, color:'#fff', border:'none', borderRadius:6, padding:'9px 18px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'background .15s' },
    btnGhost: { background:C.bg2, color:C.text, border:`1px solid ${C.borderDark}`, borderRadius:6, padding:'9px 16px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, transition:'background .15s' },
    btnIcon: { background:'transparent', color:C.text2, border:'none', cursor:'pointer', padding:7, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
  };

  const focusH = {
    onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}20`; },
    onBlur:  e => { e.target.style.borderColor = C.borderDark; e.target.style.boxShadow = 'none'; },
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="fade-in">
      {/* HEADER ROW */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:500, marginBottom:4, letterSpacing:'.2px'}}>EMPRESA EJEMPLO S.A.S · NIT 900.123.456-1</div>
          <h1 style={{fontSize:28, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.6px'}}>Resumen financiero</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>Período: Mayo 2026</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <select style={{...S.input, width:'auto'}} value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button style={S.btnGhost} onClick={() => exportCSV(tx, 'transacciones')}>
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
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)', gap:16, marginBottom:20}}>
        <div style={S.card}>
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
          <button style={{...S.btnGhost, padding:'6px 12px', fontSize:13}} onClick={() => setPage('transactions')}>Ver todas →</button>
        </div>
        <div style={{margin:'0 -24px'}}>
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

  const renderTransactions = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>Transacciones</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>{filteredTx.length} de {tx.length} registros</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredTx, 'transacciones')}><Icon.download /> Exportar</button>
          <button style={S.btnPri} onClick={() => { setModal('tx'); setEditTarget(null); setForm({type:'income', cat:'Ingresos'}); }}>
            <Icon.plus /> Registrar
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:380}}>
          <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:36}} placeholder="Buscar por descripción o categoría..." value={search} onChange={e => setSearch(e.target.value)} {...focusH} />
        </div>
        <div style={{display:'flex', borderRadius:6, border:`1px solid ${C.borderDark}`, overflow:'hidden'}}>
          {[{v:'all', l:'Todas'}, {v:'income', l:'Ingresos'}, {v:'expense', l:'Egresos'}].map((f, i, arr) => (
            <button
              key={f.v}
              onClick={() => setTxFilter(f.v)}
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
                      <button style={S.btnIcon} onClick={() => { setModal('tx'); setEditTarget(t); setForm({ ...t }); }} aria-label="Editar"
                        onMouseEnter={e => { e.currentTarget.style.background = `${C.accent}15`; e.currentTarget.style.color = C.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                        <Icon.pencil />
                      </button>
                      <button style={S.btnIcon} onClick={() => delTx(t.id)} aria-label="Eliminar"
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

  const renderInvoices = () => {
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
            <button style={S.btnGhost} onClick={() => exportCSV(invoices, 'facturas')}><Icon.download /> Exportar</button>
            <button style={S.btnPri} onClick={() => { setModal('invoice'); setEditTarget(null); setForm({date:'2026-05-01'}); }}>
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
                          <button onClick={() => markPaidInvoice(inv.id)} style={{background:'transparent', color:C.success, border:`1px solid ${C.success}40`, borderRadius:6, padding:'5px 10px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
                            <Icon.check /> Pagar
                          </button>
                        )}
                        <button style={S.btnIcon} onClick={() => { setModal('invoice'); setEditTarget(inv); setForm({ ...inv }); }} aria-label="Editar"
                          onMouseEnter={e => { e.currentTarget.style.background = `${C.accent}15`; e.currentTarget.style.color = C.accent; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent';   e.currentTarget.style.color = C.text2; }}>
                          <Icon.pencil />
                        </button>
                        <button style={S.btnIcon} onClick={() => delInvoice(inv.id)} aria-label="Eliminar"
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
  };

  const renderAccounts = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>Cuentas</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>Total activos · <strong style={{color:C.accent, fontFamily:'"SF Mono", Consolas, monospace'}}>{fmt(totalAssets)}</strong></div>
        </div>
        <button style={S.btnPri} onClick={() => showToast('Próximamente: agregar cuenta')}>
          <Icon.plus /> Nueva cuenta
        </button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16}}>
        {accounts.map(a => (
          <div key={a.id} style={{...S.card, position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', top:0, left:0, right:0, height:3, background:a.color}} />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, marginTop:6}}>
              <div>
                <div style={{fontSize:15, fontWeight:600, marginBottom:3, color:C.text, letterSpacing:'-.2px'}}>{a.name}</div>
                <div style={{fontSize:12, color:C.text2, fontFamily:'"SF Mono", Consolas, monospace'}}>{a.number}</div>
              </div>
              <div style={{width:38, height:38, borderRadius:8, background:`${a.color}15`, color:a.color, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {a.type === 'bank' ? <Icon.bank /> : a.type === 'cash' ? <Icon.cash /> : <Icon.receipt />}
              </div>
            </div>
            <div style={{fontSize:24, fontWeight:700, color:C.text, fontFamily:'"SF Mono", Consolas, monospace', letterSpacing:'-.5px', marginBottom:4}}>{fmt(a.balance)}</div>
            <div style={{fontSize:11, color:C.text3, marginBottom:14, textTransform:'uppercase', letterSpacing:'.3px'}}>Saldo disponible · {a.currency}</div>
            <div style={{height:5, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
              <div style={{width:`${Math.round(a.balance / totalAssets * 100)}%`, height:'100%', background:a.color, borderRadius:3, transition:'width .5s'}} />
            </div>
            <div style={{fontSize:11, color:C.text2, marginTop:6, fontWeight:500}}>{Math.round(a.balance / totalAssets * 100)}% del total</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => {
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

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20}}>
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
          <div style={{margin:'0 -24px'}}>
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
  };

  const pageRender = {
    dashboard:    renderDashboard,
    transactions: renderTransactions,
    invoices:     renderInvoices,
    accounts:     renderAccounts,
    reports:      renderReports,
  }[page] || renderDashboard;

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'tx' && (
        <Modal title={editTarget ? 'Editar transacción' : 'Nueva transacción'} onSave={saveTransaction} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
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
        </Modal>
      )}

      {modal === 'invoice' && (
        <Modal title={editTarget ? 'Editar factura' : 'Nueva factura'} onSave={saveInvoice} onClose={closeModal} C={C} S={S}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Cliente *</label><input style={S.input} value={form.client||''} onChange={fv('client')} placeholder="Empresa ABC S.A.S" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>NIT</label><input style={S.input} value={form.nit||''} onChange={fv('nit')} placeholder="900000000-0" autoComplete="off" {...focusH} /></div>
            <div><label style={S.label}>Nº de items</label><input style={S.input} type="number" min="1" value={form.items||''} onChange={fv('items')} placeholder="1" {...focusH} /></div>
            <div><label style={S.label}>Fecha emisión</label><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} {...focusH} /></div>
            <div><label style={S.label}>Fecha vencimiento</label><input style={S.input} type="date" value={form.due||''} onChange={fv('due')} {...focusH} /></div>
            <div style={{gridColumn:'1/-1'}}><label style={S.label}>Monto total (COP) *</label><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="0" {...focusH} /></div>
          </div>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', inset:0, background:'rgba(15, 23, 42, .55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{background:C.bg2, borderRadius:8, padding:0, maxWidth:400, width:'100%', boxShadow:C.shadowLg, border:`1px solid ${C.border}`, overflow:'hidden'}} onClick={e => e.stopPropagation()}>
            <div style={{padding:24, textAlign:'center'}}>
              <div style={{width:48, height:48, borderRadius:'50%', background:`${C.danger}15`, color:C.danger, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px'}}>
                {Icon.alert()}
              </div>
              <div style={{fontSize:16, fontWeight:600, marginBottom:6, color:C.text}}>{confirm.msg}</div>
              <div style={{fontSize:13, color:C.text2}}>Esta acción no se puede deshacer.</div>
            </div>
            <div style={{padding:'14px 24px', background:C.bg3, borderTop:`1px solid ${C.border}`, display:'flex', gap:10, justifyContent:'flex-end'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.danger}} onClick={confirm.onYes}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background:C.bg2, color:C.text, padding:'12px 18px', borderRadius:8, fontSize:14, fontWeight:500, zIndex:1001, boxShadow:C.shadowLg, display:'flex', alignItems:'center', gap:10, borderLeft:`4px solid ${toast.type === 'error' ? C.danger : C.success}`}}>
          <span style={{color: toast.type === 'error' ? C.danger : C.success}}>
            {toast.type === 'error' ? Icon.alert() : Icon.check()}
          </span>
          {toast.msg}
        </div>
      )}

      {/* HEADER NAVY OSCURO */}
      <header style={{
        background: theme === 'dark' ? C.bg2 : C.primary,
        color:'#f1f5f9',
        padding:'12px 32px',
      }}>
        <div style={{maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20}}>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <div style={{
              width:38, height:38, borderRadius:8,
              background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff',
            }}>
              {Icon.building()}
            </div>
            <div>
              <div style={{fontWeight:700, fontSize:17, letterSpacing:'-.3px'}}>ContaFácil</div>
              <div style={{fontSize:11, opacity:.65, marginTop:1, letterSpacing:'.2px'}}>Empresa Ejemplo S.A.S · NIT 900.123.456-1</div>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <div style={{
              padding:'7px 14px', background:'rgba(255,255,255,.08)',
              borderRadius:6, fontSize:12, fontWeight:600,
              display:'flex', alignItems:'center', gap:8,
            }}>
              <span style={{opacity:.7, fontSize:10, letterSpacing:'.4px', textTransform:'uppercase'}}>Balance</span>
              <span style={{color: balance > 0 ? '#34d399' : '#f87171', fontFamily:'"SF Mono", Consolas, monospace'}}>{fmt(balance)}</span>
            </div>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Tema" style={{background:'rgba(255,255,255,.08)', border:'none', color:'#fff', width:34, height:34, borderRadius:6, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
              {theme === 'light' ? Icon.moon() : Icon.sun()}
            </button>
            <div style={{width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13}}>JM</div>
          </div>
        </div>
      </header>

      {/* TAB BAR */}
      <div style={{background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'0 32px'}}>
        <div style={{maxWidth:1400, margin:'0 auto', display:'flex', gap:0, overflowX:'auto'}}>
          {tabs.map(t => {
            const active = page === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setPage(t.id)}
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

      {/* MAIN */}
      <main style={{maxWidth:1400, margin:'0 auto', padding:'28px 32px 60px'}}>
        {pageRender()}
      </main>
    </div>
  );
}
