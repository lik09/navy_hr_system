// resources/js/components/ui/TblDatePicker.jsx
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { toKhmerDigits } from '../../utils/khmerNumerals';

const S_inp = {
  width: '100%', background: 'transparent', padding: 0,
};

const TblDatePicker = ({ value, onChange, placeholder, style = {}, error = false, khmerDigits = true }) => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === 'km' && khmerDigits;

  return (
    <DatePicker
      value={value ? dayjs(value) : null}
      onChange={d => onChange(d ? d.format('YYYY-MM-DD') : '')}
      format={isKm ? d => toKhmerDigits(d.format('DD/MM/YYYY')) : 'DD/MM/YYYY'}
      inputReadOnly={isKm}
      placeholder={placeholder ?? (isKm ? 'ថ្ងៃ / ខែ / ឆ្នាំ' : 'DD/MM/YYYY')}
      status={error ? 'error' : undefined}
      variant="borderless"
      style={{ ...S_inp, ...style }}
    />
  );
};

export default TblDatePicker;
