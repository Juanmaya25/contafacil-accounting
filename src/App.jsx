import { useState, useMemo, useCallback } from 'react';

import { INIT_TX, INIT_INVOICES, INIT_ACCOUNTS } from './data/seed.js';
import { themes } from './data/themes.js';
import { makeStyles, makeFocusHandlers } from './utils/styles.js';
import { downloadCSV } from './utils/csv.js';
import { nextNumericId, nextInvoiceId } from './utils/ids.js';
import { useToast } from './hooks/useToast.js';
import { useFilteredTransactions } from './hooks/useFilteredTransactions.js';

import { Header } from './components/Header.jsx';
import { TabBar } from './components/TabBar.jsx';
import { Modal } from './components/Modal.jsx';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { Toast } from './components/Toast.jsx';
import { TransactionForm } from './components/TransactionForm.jsx';
import { InvoiceForm } from './components/InvoiceForm.jsx';

import { Dashboard } from './pages/Dashboard.jsx';
import { Transactions } from './pages/Transactions.jsx';
import { Invoices } from './pages/Invoices.jsx';
import { Accounts } from './pages/Accounts.jsx';
import { Reports } from './pages/Reports.jsx';

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
  const [confirm, setConfirm]       = useState(null);

  const [toast, showToast] = useToast();

  const C = themes[theme];
  const S = useMemo(() => makeStyles(C), [C]);
  const focusH = useMemo(() => makeFocusHandlers(C), [C]);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
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
      setInvoices(ii => [{ ...inv, id: nextInvoiceId(ii), status:'pending' }, ...ii]);
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
    downloadCSV(data, name);
    showToast(`${name}.csv descargado`);
  };

  const totalIncome  = useMemo(() => tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [tx]);
  const totalExpense = useMemo(() => tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [tx]);
  const balance      = totalIncome - totalExpense;
  const totalAssets  = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);

  const filteredTx = useFilteredTransactions(tx, txFilter, search);

  const pages = {
    dashboard: (
      <Dashboard
        tx={tx} balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} totalAssets={totalAssets}
        dateFilter={dateFilter} onDateFilter={setDateFilter}
        onExport={() => exportCSV(tx, 'transacciones')} onNavigate={setPage}
        C={C} S={S}
      />
    ),
    transactions: (
      <Transactions
        tx={tx} filteredTx={filteredTx}
        search={search} onSearch={setSearch} txFilter={txFilter} onFilter={setTxFilter}
        onExport={() => exportCSV(filteredTx, 'transacciones')}
        onAdd={() => { setModal('tx'); setEditTarget(null); setForm({type:'income', cat:'Ingresos'}); }}
        onEdit={t => { setModal('tx'); setEditTarget(t); setForm({ ...t }); }}
        onDelete={delTx}
        C={C} S={S} focusH={focusH}
      />
    ),
    invoices: (
      <Invoices
        invoices={invoices} theme={theme}
        onExport={() => exportCSV(invoices, 'facturas')}
        onAdd={() => { setModal('invoice'); setEditTarget(null); setForm({date:'2026-05-01'}); }}
        onEdit={inv => { setModal('invoice'); setEditTarget(inv); setForm({ ...inv }); }}
        onDelete={delInvoice} onMarkPaid={markPaidInvoice}
        C={C} S={S}
      />
    ),
    accounts: (
      <Accounts
        accounts={accounts} totalAssets={totalAssets}
        onAddAccount={() => showToast('Próximamente: agregar cuenta')}
        C={C} S={S}
      />
    ),
    reports: (
      <Reports
        invoices={invoices} accounts={accounts}
        totalIncome={totalIncome} balance={balance} totalAssets={totalAssets}
        C={C} S={S}
      />
    ),
  };

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'tx' && (
        <Modal title={editTarget ? 'Editar transacción' : 'Nueva transacción'} onSave={saveTransaction} onClose={closeModal} C={C} S={S}>
          <TransactionForm form={form} fv={fv} accounts={accounts} S={S} focusH={focusH} />
        </Modal>
      )}

      {modal === 'invoice' && (
        <Modal title={editTarget ? 'Editar factura' : 'Nueva factura'} onSave={saveInvoice} onClose={closeModal} C={C} S={S}>
          <InvoiceForm form={form} fv={fv} S={S} focusH={focusH} />
        </Modal>
      )}

      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} C={C} S={S} />
      <Toast toast={toast} C={C} />

      <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} balance={balance} C={C} />
      <TabBar page={page} onNavigate={setPage} C={C} />

      {/* MAIN */}
      <main style={{maxWidth:1400, margin:'0 auto', padding:'28px 32px 60px'}}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}
