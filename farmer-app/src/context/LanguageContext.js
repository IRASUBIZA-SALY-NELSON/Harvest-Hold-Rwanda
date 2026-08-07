import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n, {
  LANGUAGE_KEY,
  SUPPORTED_LANGS,
  getSystemLanguage,
  resolveInitialLanguage,
} from '../i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [preference, setPreference] = useState('system') // system | en | rw | fr
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY)
      const pref = saved || 'system'
      setPreference(pref)
      const lang = await resolveInitialLanguage()
      await i18n.changeLanguage(lang)
      setReady(true)
    })()
  }, [])

  const value = useMemo(
    () => ({
      ready,
      preference,
      activeLanguage: i18n.language,
      systemLanguage: getSystemLanguage(),
      setLanguagePreference: async (next) => {
        setPreference(next)
        await AsyncStorage.setItem(LANGUAGE_KEY, next)
        const lang =
          next === 'system'
            ? getSystemLanguage()
            : SUPPORTED_LANGS.includes(next)
              ? next
              : 'en'
        await i18n.changeLanguage(lang)
      },
    }),
    [ready, preference],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
