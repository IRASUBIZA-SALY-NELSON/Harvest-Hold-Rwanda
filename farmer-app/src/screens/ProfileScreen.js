import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_URL } from '../api/client'
import { toastInfo, toastSuccess } from '../utils/toast'
import {
  ensureNotificationPermissions,
  registerPushWithBackend,
} from '../services/notifications'

const LANG_OPTIONS = [
  { id: 'system', labelKey: 'login.systemDefault' },
  { id: 'en', label: 'English' },
  { id: 'rw', label: 'Kinyarwanda' },
  { id: 'fr', label: 'Français' },
]

export default function ProfileScreen() {
  const { t } = useTranslation()
  const { farmer, logout } = useAuth()
  const { preference, setLanguagePreference, systemLanguage } = useLanguage()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const pad = width >= 768 ? 28 : 20
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    ensureNotificationPermissions().then(setPushEnabled)
  }, [])

  const onLanguage = async (id) => {
    await setLanguagePreference(id)
    toastSuccess(t('profile.langChanged'))
  }

  const onEnablePush = async () => {
    const result = await registerPushWithBackend(farmer.id)
    setPushEnabled(result.granted)
    toastInfo(
      t('profile.notifications'),
      result.granted ? t('profile.notificationsOn') : t('profile.notificationsOff'),
    )
  }

  const onLogout = async () => {
    await logout()
    toastSuccess(t('profile.signedOut'))
  }

  return (
    <View className="flex-1 bg-mist" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 36 }}>
        <Text className="pt-4 font-display-bold text-3xl text-forest-900">
          {t('profile.title')}
        </Text>

        <View className="mt-6 rounded-3xl border border-forest-800/10 bg-white p-5">
          <Text className="font-display text-2xl text-forest-900">{farmer?.name}</Text>
          <Text className="mt-1 font-sans text-sm text-ink/55">{farmer?.phone}</Text>

          <View className="mt-5 gap-3 border-t border-forest-800/10 pt-4">
            <Row label={t('profile.cooperative')} value={farmer?.cooperative} />
            <Row label={t('profile.district')} value={farmer?.district} />
            <Row label={t('profile.village')} value={farmer?.village} />
            <Row label={t('profile.role')} value={t('profile.roleFarmer')} />
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-forest-800/10 bg-white p-4">
          <Text className="font-sans-medium text-xs uppercase tracking-widest text-ink/40">
            {t('profile.language')}
          </Text>
          <Text className="mt-1 font-sans text-xs text-ink/45">
            {t('login.systemDefault')}: {systemLanguage.toUpperCase()}
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {LANG_OPTIONS.map((lang) => {
              const active = preference === lang.id
              const label = lang.label || t(lang.labelKey)
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => onLanguage(lang.id)}
                  className={`rounded-full px-3 py-2 ${active ? 'bg-forest-900' : 'bg-mist'}`}
                >
                  <Text
                    className={`font-sans-semibold text-xs ${
                      active ? 'text-white' : 'text-forest-800'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-forest-800/10 bg-white p-4">
          <Text className="font-sans-medium text-xs uppercase tracking-widest text-ink/40">
            {t('profile.notifications')}
          </Text>
          <Text className="mt-2 font-sans text-sm text-ink/60">
            {pushEnabled ? t('profile.notificationsOn') : t('profile.notificationsOff')}
          </Text>
          <Pressable
            onPress={onEnablePush}
            className="mt-3 items-center rounded-2xl bg-forest-900 py-3"
          >
            <Text className="font-sans-semibold text-white">{t('profile.enablePush')}</Text>
          </Pressable>
        </View>

        <View className="mt-4 rounded-3xl border border-forest-800/10 bg-white p-4">
          <Text className="font-sans-medium text-xs uppercase tracking-widest text-ink/40">
            {t('profile.apiEndpoint')}
          </Text>
          <Text className="mt-2 font-sans text-xs text-ink/55">{API_URL}</Text>
        </View>

        <Pressable
          onPress={onLogout}
          className="mt-8 items-center rounded-2xl border border-forest-800/15 bg-white py-4 active:opacity-90"
        >
          <Text className="font-sans-semibold text-alert">{t('profile.signOut')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

function Row({ label, value }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-sans text-sm text-ink/45">{label}</Text>
      <Text className="font-sans-medium text-sm text-forest-900">{value}</Text>
    </View>
  )
}
