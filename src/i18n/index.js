import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './translations/en';
import it from './translations/it';

// Create resources object
const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: 'v3',
    lng: Localization.locale.split('-')[0], // Determine device language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    keySeparator: '.', // Used to separate nested object keys in translation keys
    detection: {
      // Order and from where to get language options
      order: ['asyncStorage', 'navigator'],
      // Cache user language on async storage
      caches: ['asyncStorage'],
      // Keys used in storage to save the language
      lookupAsyncStorage: 'i18nextLng',
    },
  });

// Function to change language
export const changeLanguage = async (language) => {
  await i18n.changeLanguage(language);
  try {
    await AsyncStorage.setItem('i18nextLng', language);
  } catch (e) {
    console.error('Error saving language setting', e);
  }
};

// Initialize with saved language preference
export const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  } catch (e) {
    console.error('Error loading saved language', e);
  }
};

// Call initialization
initializeLanguage();

export default i18n;
