// PALETTE: navy corporativo + acento dorado, mucho whitespace
export const themes = {
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

export const invoiceStatus = {
  paid:    { l:'Pagada',    bg:'#d1fae5', c:'#059669', dot:'#10b981' },
  pending: { l:'Pendiente', bg:'#fef3c7', c:'#d97706', dot:'#f59e0b' },
  overdue: { l:'Vencida',   bg:'#fee2e2', c:'#dc2626', dot:'#ef4444' },
};
