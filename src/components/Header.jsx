import { Icon } from './icons.jsx';
import { fmt } from '../utils/format.js';

export function Header({ theme, onToggleTheme, balance, C }) {
  return (
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
          <button onClick={onToggleTheme} aria-label="Tema" style={{background:'rgba(255,255,255,.08)', border:'none', color:'#fff', width:34, height:34, borderRadius:6, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
            {theme === 'light' ? Icon.moon() : Icon.sun()}
          </button>
          <div style={{width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13}}>JM</div>
        </div>
      </div>
    </header>
  );
}
