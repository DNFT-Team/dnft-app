import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import tc from './tc.json';
import { store } from 'reduxs/store';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: {
        translation: en
      },
      tc: {
        translation: tc,
      },
      // lng: store.getState().lng.lng.value,
      // fallbackLng: 'en',
      keySeparator: '.',
      interpolation: {
        escapeValue: false,
      }
    },
    lng: store.getState()?.lng?.lng,
    fallbackLng: 'en',
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    }
  })
export default i18n;
