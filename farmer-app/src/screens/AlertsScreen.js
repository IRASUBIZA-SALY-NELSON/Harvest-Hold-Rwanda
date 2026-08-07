import { useCallback, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatusPill from '../components/StatusPill'
import { toastError, toastSuccess } from '../utils/toast'

export default function AlertsScreen() {
  const { t } = useTranslation()
  const { farmer } = useAuth()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const pad = width >= 768 ? 28 : 20
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setAlerts(await api.alerts(farmer.id))
    } catch (e) {
      toastError(t('common.error'), e.message === 'NETWORK_ERROR' ? t('common.offlineApi') : e.message)
    } finally {
      setLoading(false)
    }
  }, [farmer?.id, t])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const onRead = async (id) => {
    try {
      await api.markAlertRead(farmer.id, id)
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
      toastSuccess(t('alerts.marked'))
    } catch (e) {
      toastError(t('common.error'), e.message)
    }
  }

  const onReadAll = async () => {
    try {
      await api.markAllAlertsRead(farmer.id)
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
      toastSuccess(t('alerts.allMarked'))
    } catch (e) {
      toastError(t('common.error'), e.message)
    }
  }

  return (
    <View className="flex-1 bg-mist" style={{ paddingTop: insets.top }}>
      <View
        className="flex-row items-center justify-between pb-2 pt-4"
        style={{ paddingHorizontal: pad }}
      >
        <Text className="font-display-bold text-3xl text-forest-900">{t('alerts.title')}</Text>
        <Pressable onPress={onReadAll}>
          <Text className="font-sans-semibold text-sm text-forest-600">{t('alerts.markAll')}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 28 }}>
        {loading ? <ActivityIndicator color="#1f7a4d" className="mt-10" /> : null}

        {alerts.map((alert) => (
          <Pressable
            key={alert.id}
            onPress={() => !alert.read && onRead(alert.id)}
            className={`mb-3 rounded-3xl border p-4 ${
              alert.read ? 'border-forest-800/10 bg-white' : 'border-gold-500/40 bg-white'
            }`}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="font-display text-lg text-forest-900">{alert.title}</Text>
                <Text className="mt-1 font-sans text-xs text-ink/45">
                  {alert.unitName} · {alert.time}
                </Text>
              </View>
              <StatusPill status={alert.severity} />
            </View>
            <Text className="mt-3 font-sans text-sm leading-5 text-ink/65">{alert.message}</Text>
            {!alert.read ? (
              <Text className="mt-3 font-sans-semibold text-xs text-gold-600">
                {t('alerts.tapRead')}
              </Text>
            ) : null}
          </Pressable>
        ))}

        {!loading && !alerts.length ? (
          <Text className="mt-10 text-center font-sans text-ink/45">{t('alerts.empty')}</Text>
        ) : null}
      </ScrollView>
    </View>
  )
}
