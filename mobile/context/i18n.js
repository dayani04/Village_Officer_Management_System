import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
  en: {
    translation: {
      welcomeMessage: 'Welcome to the Dashboard!',
      // Add other translation keys here
    },
  },
  si: {
    translation: {
      welcomeMessage: 'ආයුබෝවන්!',
      // Add other translation keys here
    },
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: () => {
    const fallback = 'en';
    const supportedLanguages = ['en', 'si'];
    const preferredLanguage = RNLocalize.findBestAvailableLanguage(supportedLanguages);
    return preferredLanguage?.languageTag || fallback;
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
