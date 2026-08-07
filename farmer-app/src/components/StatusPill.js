import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

const tones = {
  cooling: 'bg-forest-100',
  alert: 'bg-orange-100',
  offline: 'bg-zinc-200',
  high: 'bg-orange-100',
  medium: 'bg-amber-100',
  low: 'bg-forest-100',
  Open: 'bg-forest-100',
}

const textTones = {
  cooling: 'text-forest-700',
  alert: 'text-alert',
  offline: 'text-zinc-600',
  high: 'text-alert',
  medium: 'text-warn',
  low: 'text-forest-700',
  Open: 'text-forest-700',
}

export default function StatusPill({ status, live = false }) {
  const { t } = useTranslation()
  const label = t(`status.${status}`, {
    defaultValue: String(status || '').charAt(0).toUpperCase() + String(status || '').slice(1),
  })

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${
        tones[status] || tones.cooling
      }`}
    >
      {live ? <View className="h-1.5 w-1.5 rounded-full bg-forest-600" /> : null}
      <Text
        className={`font-sans-semibold text-[11px] ${textTones[status] || textTones.cooling}`}
      >
        {label}
      </Text>
    </View>
  )
}
