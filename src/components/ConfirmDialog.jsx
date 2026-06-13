import { Icon } from './icons.jsx';

export function ConfirmDialog({ confirm, onCancel, C, S }) {
  if (!confirm) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(15, 23, 42, .55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={onCancel}>
      <div style={{background:C.bg2, borderRadius:8, padding:0, maxWidth:400, width:'100%', boxShadow:C.shadowLg, border:`1px solid ${C.border}`, overflow:'hidden'}} onClick={e => e.stopPropagation()}>
        <div style={{padding:24, textAlign:'center'}}>
          <div style={{width:48, height:48, borderRadius:'50%', background:`${C.danger}15`, color:C.danger, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px'}}>
            {Icon.alert()}
          </div>
          <div style={{fontSize:16, fontWeight:600, marginBottom:6, color:C.text}}>{confirm.msg}</div>
          <div style={{fontSize:13, color:C.text2}}>Esta acción no se puede deshacer.</div>
        </div>
        <div style={{padding:'14px 24px', background:C.bg3, borderTop:`1px solid ${C.border}`, display:'flex', gap:10, justifyContent:'flex-end'}}>
          <button style={S.btnGhost} onClick={onCancel}>Cancelar</button>
          <button style={{...S.btnPri, background:C.danger}} onClick={confirm.onYes}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
