import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import km from './km.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      km: { translation: km },
    },
    lng: localStorage.getItem('rcn-lang') || 'km',
    fallbackLng: 'km',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('rcn-lang', lng);
});

export default i18n;
