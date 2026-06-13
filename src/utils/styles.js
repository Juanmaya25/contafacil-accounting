export const makeStyles = C => ({
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
});

export const makeFocusHandlers = C => ({
  onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}20`; },
  onBlur:  e => { e.target.style.borderColor = C.borderDark; e.target.style.boxShadow = 'none'; },
});
