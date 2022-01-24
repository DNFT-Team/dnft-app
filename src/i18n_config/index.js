import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zh from './zh.json';

i18n
  .use(initReactI18next)
  .init({
    // debug: true,
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh,
      },
      lng: 'en',
      fallbackLng: 'en',
      keySeparator: '.',
      interpolation: {
        escapeValue: false,
      }

    },
    fallbackLng: 'en',
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    }
  })
export default i18n;
