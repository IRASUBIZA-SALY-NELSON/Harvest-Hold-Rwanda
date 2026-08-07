import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { toastError, toastSuccess } from '../utils/toast'
import { registerPushWithBackend } from '../services/notifications'
import { api } from '../api/client'

const LANGS = [
  { id: 'system', labelKey: 'login.systemDefault' },
  { id: 'en', label: 'English' },
  { id: 'rw', label: 'Kinyarwanda' },
  { id: 'fr', label: 'Français' },
]

export default function LoginScreen() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const { preference, setLanguagePreference } = useLanguage()
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const isWide = width >= 768
  const contentWidth = Math.min(width - 32, isWide ? 440 : width - 32)

  const [phone, setPhone] = useState('+250 788 123 456')
  const [pin, setPin] = useState('1234')
  const [loading, setLoading] = useState(false)
  const [checkingApi, setCheckingApi] = useState(false)

  const onSubmit = async () => {
    setLoading(true)
    try {
      const data = await login(phone.trim(), pin.trim())
      toastSuccess(t('login.success'), data.farmer?.name || '')
      registerPushWithBackend(data.farmer.id).catch(() => {})
    } catch (e) {
      const msg =
        e.message === 'NETWORK_ERROR' ? t('common.offlineApi') : e.message || t('login.failed')
      toastError(t('login.failed'), msg)
    } finally {
      setLoading(false)
    }
  }

  const checkApi = async () => {
    setCheckingApi(true)
    try {
      await api.health()
      toastSuccess(t('common.connected'), apiBaseHint())
    } catch {
      toastError(t('common.error'), t('common.offlineApi'))
    } finally {
      setCheckingApi(false)
    }
  }

  return (
    <View className="flex-1 bg-forest-950">
      <LinearGradient colors={['#06140f', '#0c1f18', '#1b4d38']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: height < 700 ? 'flex-start' : 'center',
              paddingTop: insets.top + (height < 700 ? 24 : 12),
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            <View style={{ width: contentWidth }}>
              <View className="items-center">
                <Image
                  source={require('../../assets/icon.png')}
                  style={{
                    width: isWide ? 88 : 72,
                    height: isWide ? 88 : 72,
                    borderRadius: 20,
                  }}
                  resizeMode="contain"
                />
                <Text
                  className="mt-5 text-center font-display-bold text-white"
                  style={{ fontSize: isWide ? 40 : 32 }}
                >
                  {t('common.appName')}
                </Text>
                <Text className="mt-1 font-sans-medium text-xs uppercase tracking-[0.28em] text-gold-400">
                  {t('common.farmer')}
                </Text>
                <Text
                  className="mt-4 text-center font-sans leading-5 text-white/70"
                  style={{ fontSize: isWide ? 16 : 14, maxWidth: 360 }}
                >
                  {t('login.tagline')}
                </Text>
              </View>

              <View className="mt-8 rounded-3xl border border-white/10 bg-white p-5 sm:p-6">
                <Text className="mb-2 font-sans-medium text-[10px] uppercase tracking-widest text-ink/45">
                  {t('login.language')}
                </Text>
                <View className="mb-5 flex-row flex-wrap gap-2">
                  {LANGS.map((lang) => {
                    const active = preference === lang.id
                    const label = lang.label || t(lang.labelKey)
                    return (
                      <Pressable
                        key={lang.id}
                        onPress={() => setLanguagePreference(lang.id)}
                        className={`rounded-full px-3 py-1.5 ${
                          active ? 'bg-forest-900' : 'bg-mist'
                        }`}
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

                <Text className="font-sans-medium text-xs uppercase tracking-widest text-ink/45">
                  {t('login.phone')}
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  className="mt-2 border-b border-forest-800/15 pb-3 font-sans-medium text-base text-forest-900"
                />

                <Text className="mt-5 font-sans-medium text-xs uppercase tracking-widest text-ink/45">
                  {t('login.pin')}
                </Text>
                <TextInput
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry
                  keyboardType="number-pad"
                  maxLength={6}
                  className="mt-2 border-b border-forest-800/15 pb-3 font-sans-medium text-base text-forest-900"
                />

                <Text className="mt-4 font-sans text-xs text-ink/40">{t('login.demoHint')}</Text>

                <Pressable
                  onPress={onSubmit}
                  disabled={loading}
                  className="mt-6 items-center rounded-2xl bg-gold-500 py-3.5 active:opacity-90"
                  style={{ minHeight: 48 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#0c1f18" />
                  ) : (
                    <Text className="font-sans-semibold text-base text-forest-950">
                      {t('login.signIn')}
                    </Text>
                  )}
                </Pressable>

                <Pressable onPress={checkApi} disabled={checkingApi} className="mt-3 items-center py-2">
                  <Text className="font-sans-medium text-xs text-forest-600">
                    {checkingApi ? t('common.loading') : t('login.checkServer')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}

function apiBaseHint() {
  return require('../api/client').API_URL
}
