import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import MetricTile from '../components/MetricTile'
import StatusPill from '../components/StatusPill'
import TempSparkline from '../components/TempSparkline'
import { toastError } from '../utils/toast'

export default function UnitDetailScreen() {
  const { t } = useTranslation()
  const { farmer } = useAuth()
  const route = useRoute()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const pad = width >= 768 ? 28 : 20
  const { unitId } = route.params
  const [unit, setUnit] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setError('')
      setUnit(await api.unit(farmer.id, unitId))
    } catch (e) {
      const msg = e.message === 'NETWORK_ERROR' ? t('common.offlineApi') : e.message
      setError(msg)
      if (!silent) toastError(t('common.error'), msg)
    }
  }, [farmer?.id, unitId, t])

  useFocusEffect(
    useCallback(() => {
      load(false)
    }, [load]),
  )

  useEffect(() => {
    const id = setInterval(() => load(true), 5000)
    return () => clearInterval(id)
  }, [load])

  if (!unit && !error) {
    return (
      <View className="flex-1 items-center justify-center bg-mist">
        <ActivityIndicator color="#1f7a4d" />
      </View>
    )
  }

  const tempTone =
    unit && (unit.temp < unit.targetTemp[0] || unit.temp > unit.targetTemp[1]) ? 'bad' : 'good'
  const waterTone = unit && unit.waterLevel < 30 ? 'warn' : 'default'

  return (
    <View className="flex-1 bg-mist" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <View style={{ paddingHorizontal: pad }} className="pb-2 pt-3">
          <Pressable onPress={() => navigation.goBack()}>
            <Text className="font-sans-semibold text-sm text-forest-600">{t('common.back')}</Text>
          </Pressable>
          <View className="mt-4 flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-display-bold text-3xl text-forest-900">{unit?.name}</Text>
              <Text className="mt-1 font-sans text-sm text-ink/50">{unit?.id}</Text>
            </View>
            {unit ? <StatusPill status={unit.status} live={unit.online} /> : null}
          </View>
        </View>

        {error ? (
          <Text className="mt-4 font-sans text-alert" style={{ paddingHorizontal: pad }}>
            {error}
          </Text>
        ) : (
          <View style={{ paddingHorizontal: pad }} className="pt-4">
            <View className="rounded-3xl border border-forest-800/10 bg-white p-4">
              <Text className="font-sans-medium text-xs uppercase tracking-widest text-ink/40">
                {t('unit.tempTrend')}
              </Text>
              <View className="mt-4">
                <TempSparkline values={unit.history || []} />
              </View>
              <Text className="mt-3 font-sans text-xs text-ink/45">
                {t('unit.target', {
                  min: unit.targetTemp[0],
                  max: unit.targetTemp[1],
                  time: unit.lastSync,
                })}
              </Text>
            </View>

            <View className="mt-3 flex-row gap-3">
              <MetricTile label={t('unit.temperature')} value={unit.temp} unit="°C" tone={tempTone} />
              <MetricTile label={t('unit.humidity')} value={unit.humidity} unit="%" />
            </View>
            <View className="mt-3 flex-row gap-3">
              <MetricTile
                label={t('unit.ethylene')}
                value={t(`status.${unit.ethylene}`, { defaultValue: unit.ethylene })}
                hint={`${unit.ethylenePpm} ppm`}
                tone={unit.ethylene === 'Rising' ? 'warn' : 'good'}
              />
              <MetricTile
                label={t('unit.shelfLife')}
                value={unit.shelfLifeDays}
                unit={t('unit.days')}
                tone="good"
              />
            </View>
            <View className="mt-3 flex-row gap-3">
              <MetricTile label={t('unit.battery')} value={unit.battery} unit="%" />
              <MetricTile label={t('unit.water')} value={unit.waterLevel} unit="%" tone={waterTone} />
            </View>

            <View className="mt-4 rounded-3xl border border-forest-800/10 bg-white p-4">
              <Text className="font-display text-lg text-forest-900">{t('unit.storage')}</Text>
              <Text className="mt-2 font-sans text-sm leading-5 text-ink/65">
                {t('unit.cratesAt', {
                  crop: unit.crop,
                  crates: unit.crates,
                  location: unit.location,
                })}
              </Text>
              <Text className="mt-2 font-sans text-sm text-ink/55">
                {unit.solar ? t('unit.powerSolar') : t('unit.powerBattery')}
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.navigate('Help', { unitId: unit.id })}
              className="mt-5 items-center rounded-2xl bg-forest-900 py-4 active:opacity-90"
            >
              <Text className="font-sans-semibold text-white">{t('unit.requestTech')}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
