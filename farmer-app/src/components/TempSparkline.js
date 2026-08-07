import { Text, View } from 'react-native'

export default function TempSparkline({ values = [], unit = '°C' }) {
  if (!values.length) {
    return (
      <View className="h-20 items-center justify-center">
        <Text className="font-sans text-xs text-ink/40">No history yet</Text>
      </View>
    )
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const latest = values[values.length - 1]

  return (
    <View>
      <View className="mb-2 flex-row items-end justify-between">
        <Text className="font-display text-2xl text-forest-900">
          {Number(latest).toFixed(1)}
          <Text className="font-sans text-sm text-ink/45"> {unit}</Text>
        </Text>
        <Text className="font-sans text-[11px] text-ink/40">
          {min.toFixed(1)} – {max.toFixed(1)} {unit}
        </Text>
      </View>
      <View className="h-20 flex-row items-end gap-1">
        {values.slice(-16).map((v, i) => {
          const h = 14 + ((v - min) / span) * 58
          const hot = v > 22
          const isLast = i === Math.min(values.length, 16) - 1
          return (
            <View
              key={`${v}-${i}`}
              className={`flex-1 rounded-t-sm ${
                hot ? 'bg-alert/75' : isLast ? 'bg-forest-600' : 'bg-forest-600/55'
              }`}
              style={{ height: h }}
            />
          )
        })}
      </View>
    </View>
  )
}
