import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import UnitCard from '../components/UnitCard'
import { toastError } from '../utils/toast'
import { notifyLocalAlert } from '../services/notifications'

export default function HomeScreen() {
  const { t } = useTranslation()
  const { farmer } = useAuth()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const pad = width >= 768 ? 28 : 20
  const [units, setUnits] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const lastUnread = useRef(null)

  const load = useCallback(async () => {
    if (!farmer?.id) return
    setError('')
    try {
      const [unitData, unreadData] = await Promise.all([
        api.units(farmer.id),
        api.unreadCount(farmer.id),
      ])
      setUnits(unitData)
      const count = unreadData.count || 0
      setUnread(count)

      if (lastUnread.current !== null && count > lastUnread.current) {
        await notifyLocalAlert({
          title: t('alerts.newPushTitle'),
          body: t('alerts.newPushBody', { count }),
          data: { type: 'alerts' },
        })
      }
      lastUnread.current = count
    } catch (e) {
      const msg = e.message === 'NETWORK_ERROR' ? t('common.offlineApi') : e.message
      setError(msg)
      toastError(t('home.loadError'), msg)
    } finally {
      setLoading(false)
    }
  }, [farmer?.id, t])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  useEffect(() => {
    const id = setInterval(load, 8000)
    return () => clearInterval(id)
  }, [load])

  const alertUnits = units.filter((u) => u.status === 'alert').length

  return (
    <View className="flex-1 bg-mist" style={{ paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor="#1f7a4d" />
        }
      >
        <View className="bg-forest-950 pb-8 pt-4" style={{ paddingHorizontal: pad }}>
          <Text className="font-sans-medium text-xs uppercase tracking-[0.22em] text-gold-400">
            {t('home.greeting')}
          </Text>
          <Text className="mt-2 font-display-bold text-3xl text-white">{farmer?.name}</Text>
          <Text className="mt-1 font-sans text-sm text-white/60">
            {farmer?.cooperative} · {farmer?.district}
          </Text>

          <View className={`mt-6 gap-3 ${width >= 768 ? 'flex-row' : 'flex-row'}`}>
            <View className="min-w-0 flex-1 rounded-2xl bg-white/10 px-3 py-3">
              <Text className="font-sans text-[11px] text-white/50">{t('home.myCoolers')}</Text>
              <Text className="mt-1 font-display text-2xl text-white">{units.length}</Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('Alerts')}
              className="min-w-0 flex-1 rounded-2xl bg-white/10 px-3 py-3"
            >
              <Text className="font-sans text-[11px] text-white/50">{t('home.unreadAlerts')}</Text>
              <Text className="mt-1 font-display text-2xl text-gold-400">{unread}</Text>
            </Pressable>
            <View className="min-w-0 flex-1 rounded-2xl bg-white/10 px-3 py-3">
              <Text className="font-sans text-[11px] text-white/50">{t('home.needAttention')}</Text>
              <Text className="mt-1 font-display text-2xl text-white">{alertUnits}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: pad }} className="pt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-display text-2xl text-forest-900">{t('home.yourUnits')}</Text>
            <Pressable onPress={() => navigation.navigate('Help')}>
              <Text className="font-sans-semibold text-sm text-forest-600">
                {t('home.requestHelp')}
              </Text>
            </Pressable>
          </View>

          {loading && !units.length ? <ActivityIndicator color="#1f7a4d" className="mt-10" /> : null}

          {error ? (
            <View className="rounded-2xl border border-alert/20 bg-orange-50 p-4">
              <Text className="font-sans-semibold text-alert">{t('home.loadError')}</Text>
              <Text className="mt-1 font-sans text-sm text-ink/60">{error}</Text>
              <Text className="mt-2 font-sans text-xs text-ink/45">{t('home.loadHint')}</Text>
            </View>
          ) : null}

          <View className={width >= 900 ? 'flex-row flex-wrap gap-3' : ''}>
            {units.map((unit) => (
              <View key={unit.id} style={width >= 900 ? { width: '48%' } : undefined}>
                <UnitCard
                  unit={unit}
                  onPress={() => navigation.navigate('UnitDetail', { unitId: unit.id })}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
