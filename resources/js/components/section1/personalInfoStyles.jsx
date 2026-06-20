// resources/js/components/section1/personalInfoStyles.jsx
export const NAVY = '#002366';
export const BORDER = '1px solid #bbb';
export const LBL_BG = '#f0f4f8';

// ── Shared styles ─────────────────────────────────────────────────────────────
export const S = {
  section: {
    border: BORDER, marginBottom: 12, overflow: 'hidden',
  },
  secTitle: {
    background: NAVY, color: '#fff', padding: '6px 12px',
    fontSize: 16, fontWeight: 700,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  dot: {
    width: 5, height: 5, background: '#4A9EFF',
    borderRadius: '50%', display: 'inline-block', flexShrink: 0,
  },
  tbl: { width: '100%', borderCollapse: 'collapse' },
  lbl: {
    background: LBL_BG, padding: '8px 10px', fontSize: 16,
    border: BORDER, whiteSpace: 'nowrap', fontWeight: 500,
    color: '#333', verticalAlign: 'middle', width: 150,
    lineHeight: 1.5,
  },
  lbl2: {
    background: LBL_BG, padding: '8px 10px', fontSize: 16,
    border: BORDER, whiteSpace: 'nowrap', fontWeight: 500,
    color: '#333', verticalAlign: 'middle', width: 130,
    lineHeight: 1.5,
  },
  td: {
    border: BORDER, padding: '8px 8px',
    fontSize: 16, verticalAlign: 'middle',
    lineHeight: 1.5,
  },
  inp: {
    width: '100%', border: 'none', outline: 'none',
    fontSize: 16, background: 'transparent',
    fontFamily: 'inherit', padding: '1px 0',
  },
};

// ── Section header ────────────────────────────────────────────────────────────
export const SecTitle = ({ children }) => (
  <div style={S.secTitle}>
    <span style={S.dot} />
    {children}
  </div>
);
