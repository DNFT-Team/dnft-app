import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zh from './zh.json';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      zh: {
        translation: zh,
      },
      en: {
        translation: en
      },
      lng: 'en',
      fallbackLng: 'en',
      keySeparator: '.',
      interpolation: {
        escapeValue: false,
      }

    }
  })
export default i18n;
