import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import StatusPill from './StatusPill'

export default function UnitCard({ unit, onPress }) {
  const { t } = useTranslation()
  const alertTone = unit.status === 'alert'

  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 overflow-hidden rounded-3xl border bg-white p-4 active:opacity-90 ${
        alertTone ? 'border-alert/30' : 'border-forest-800/10'
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-display text-xl text-forest-900">{unit.name}</Text>
          <Text className="mt-1 font-sans text-xs text-ink/50">{unit.location}</Text>
        </View>
        <StatusPill status={unit.status} live={unit.online} />
      </View>

      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-2xl bg-mist px-3 py-3">
          <Text className="font-sans-medium text-[10px] uppercase tracking-widest text-ink/40">
            {t('unit.temperature')}
          </Text>
          <Text className="mt-1 font-display text-xl text-forest-900">{unit.temp}°</Text>
        </View>
        <View className="flex-1 rounded-2xl bg-mist px-3 py-3">
          <Text className="font-sans-medium text-[10px] uppercase tracking-widest text-ink/40">
            {t('unit.humidity')}
          </Text>
          <Text className="mt-1 font-display text-xl text-forest-900">{unit.humidity}%</Text>
        </View>
        <View className="flex-1 rounded-2xl bg-mist px-3 py-3">
          <Text className="font-sans-medium text-[10px] uppercase tracking-widest text-ink/40">
            {t('unit.shelfLife')}
          </Text>
          <Text className="mt-1 font-display text-xl text-forest-900">{unit.shelfLifeDays}d</Text>
        </View>
      </View>

      <Text className="mt-3 font-sans text-xs text-ink/45">
        {unit.crop} · {unit.crates} · {t('home.synced', { time: unit.lastSync })}
      </Text>
    </Pressable>
  )
}
