import { Icon } from './icons.jsx';

export function Modal({ title, onSave, onClose, children, size='md', C, S }) {
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
