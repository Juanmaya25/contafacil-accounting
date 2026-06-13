import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';

export function Accounts({ accounts, totalAssets, onAddAccount, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.5px'}}>Cuentas</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:4}}>Total activos · <strong style={{color:C.accent, fontFamily:'"SF Mono", Consolas, monospace'}}>{fmt(totalAssets)}</strong></div>
        </div>
        <button style={S.btnPri} onClick={onAddAccount}>
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
}
