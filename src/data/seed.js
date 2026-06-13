// ─── DATA SEED ──────────────────────────────────────────────────────
export const INIT_TX = [
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

export const INIT_INVOICES = [
  { id:'FAC-2026-041', client:'Empresa ABC S.A.S',  nit:'900123456-1', date:'2026-04-15', due:'2026-05-15', amount:2850000, status:'pending', items:3 },
  { id:'FAC-2026-040', client:'Comercial XYZ Ltda', nit:'900234567-2', date:'2026-04-10', due:'2026-05-10', amount:4500000, status:'paid',    items:5 },
  { id:'FAC-2026-039', client:'Distribuidora DEF',  nit:'900345678-3', date:'2026-04-05', due:'2026-05-05', amount:1750000, status:'overdue', items:2 },
  { id:'FAC-2026-038', client:'Servicios GHI',      nit:'900456789-4', date:'2026-03-28', due:'2026-04-28', amount:3100000, status:'paid',    items:4 },
  { id:'FAC-2026-037', client:'Constructora Norte', nit:'900567890-5', date:'2026-03-20', due:'2026-04-20', amount:5200000, status:'paid',    items:1 },
  { id:'FAC-2026-036', client:'Tienda Central',     nit:'900678901-6', date:'2026-03-15', due:'2026-04-15', amount:890000,  status:'overdue', items:8 },
];

export const INIT_ACCOUNTS = [
  { id:1, name:'Bancolombia Ahorros',  number:'***4521',  balance:18450000, type:'bank',    color:'#1d4ed8', currency:'COP' },
  { id:2, name:'Davivienda Corriente', number:'***8834',  balance:6200000,  type:'bank',    color:'#dc2626', currency:'COP' },
  { id:3, name:'Caja menor',           number:'Efectivo', balance:850000,   type:'cash',    color:'#059669', currency:'COP' },
  { id:4, name:'Cuentas por cobrar',   number:'Clientes', balance:9300000,  type:'receive', color:'#7c3aed', currency:'COP' },
];

export const MONTHLY = [
  { mes:'Nov', ingresos:18500000, gastos:12300000 },
  { mes:'Dic', ingresos:28000000, gastos:16800000 },
  { mes:'Ene', ingresos:15200000, gastos:11400000 },
  { mes:'Feb', ingresos:21000000, gastos:13200000 },
  { mes:'Mar', ingresos:19800000, gastos:12900000 },
  { mes:'Abr', ingresos:24500000, gastos:14100000 },
];

export const CATEGORIES = [
  { name:'Nómina',       pct:38, color:'#dc2626', amount:14100000 },
  { name:'Compras',      pct:28, color:'#ea580c', amount:10400000 },
  { name:'Gastos fijos', pct:20, color:'#ca8a04', amount:7400000 },
  { name:'Comisiones',   pct:9,  color:'#7c3aed', amount:3300000 },
  { name:'Otros',        pct:5,  color:'#475569', amount:1900000 },
];
