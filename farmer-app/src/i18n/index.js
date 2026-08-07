import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from './locales/en.json'
import rw from './locales/rw.json'
import fr from './locales/fr.json'

export const LANGUAGE_KEY = 'hh_farmer_language'
export const SUPPORTED_LANGS = ['en', 'rw', 'fr']

export function getSystemLanguage() {
  const code = Localization.getLocales()?.[0]?.languageCode?.toLowerCase() || 'en'
  if (code === 'rw' || code === 'rn' || code === 'kin') return 'rw'
  if (code === 'fr') return 'fr'
  return 'en'
}

export async function resolveInitialLanguage() {
  const saved = await AsyncStorage.getItem(LANGUAGE_KEY)
  if (saved === 'system' || !saved) return getSystemLanguage()
  if (SUPPORTED_LANGS.includes(saved)) return saved
  return getSystemLanguage()
}

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    rw: { translation: rw },
    fr: { translation: fr },
  },
  lng: getSystemLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
