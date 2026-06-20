import dayjs from 'dayjs';

const KH_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export const toKhmerDigits = (str) => String(str).replace(/[0-9]/g, d => KH_DIGITS[+d]);

export const formatDateDisplay = (value, lang) => {
  if (!value) return '—';
  const f = dayjs(value).format('DD/MM/YYYY');
  return lang === 'km' ? toKhmerDigits(f) : f;
};

export const formatNumberDisplay = (n, lang) => lang === 'km' ? toKhmerDigits(n) : String(n);
