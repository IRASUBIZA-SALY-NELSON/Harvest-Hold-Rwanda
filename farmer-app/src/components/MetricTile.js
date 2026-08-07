import { Text, View } from 'react-native'

const tones = {
  default: 'border-forest-800/10 bg-white',
  good: 'border-forest-600/20 bg-forest-50',
  warn: 'border-warn/30 bg-amber-50',
  bad: 'border-alert/30 bg-orange-50',
}

export default function MetricTile({ label, value, unit, hint, tone = 'default' }) {
  return (
    <View className={`flex-1 rounded-2xl border p-3.5 ${tones[tone]}`}>
      <Text className="font-sans-medium text-[10px] uppercase tracking-widest text-ink/45">
        {label}
      </Text>
      <Text className="mt-2 font-display text-2xl text-forest-900">
        {value}
        {unit ? <Text className="font-sans-medium text-sm text-ink/40"> {unit}</Text> : null}
      </Text>
      {hint ? <Text className="mt-1 font-sans text-xs text-ink/50">{hint}</Text> : null}
    </View>
  )
}
