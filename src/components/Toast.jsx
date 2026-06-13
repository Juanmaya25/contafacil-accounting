import { Icon } from './icons.jsx';

export function Toast({ toast, C }) {
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background:C.bg2, color:C.text, padding:'12px 18px', borderRadius:8, fontSize:14, fontWeight:500, zIndex:1001, boxShadow:C.shadowLg, display:'flex', alignItems:'center', gap:10, borderLeft:`4px solid ${toast.type === 'error' ? C.danger : C.success}`}}>
      <span style={{color: toast.type === 'error' ? C.danger : C.success}}>
        {toast.type === 'error' ? Icon.alert() : Icon.check()}
      </span>
      {toast.msg}
    </div>
  );
}
