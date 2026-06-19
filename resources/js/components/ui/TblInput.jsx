// resources/js/components/ui/TblInput.jsx

const S_inp = {
  width: '100%', border: 'none', outline: 'none',
  fontSize: 16, background: 'transparent',
  fontFamily: 'inherit', padding: '1px 0',
};

const TblInput = ({ value, onChange, placeholder, type = 'text', style = {}, className = '' }) => (
  <input
    style={{ ...S_inp, ...style }}
    type={type}
    value={value ?? ''}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    className={className}
  />
);

export default TblInput;