import { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatusPill from '../components/StatusPill'
import { toastError, toastSuccess } from '../utils/toast'

const TOPIC_KEYS = ['cooling', 'fan', 'water', 'sensor', 'solar', 'other']

export default function HelpScreen() {
  const { t } = useTranslation()
  const { farmer } = useAuth()
  const route = useRoute()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const pad = width >= 768 ? 28 : 20
  const topics = useMemo(
    () => TOPIC_KEYS.map((key) => ({ key, label: t(`help.topics.${key}`) })),
    [t],
  )

  const [units, setUnits] = useState([])
  const [tickets, setTickets] = useState([])
  const [unitId, setUnitId] = useState(route.params?.unitId || '')
  const [topicKey, setTopicKey] = useState('cooling')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const [u, ticketList] = await Promise.all([
      api.units(farmer.id),
      api.helpTickets(farmer.id),
    ])
    setUnits(u)
    setTickets(ticketList)
    if (!unitId && u[0]) setUnitId(u[0].id)
  }, [farmer?.id, unitId])

  useFocusEffect(
    useCallback(() => {
      load().catch((e) => {
        toastError(
          t('common.error'),
          e.message === 'NETWORK_ERROR' ? t('common.offlineApi') : e.message,
        )
      })
    }, [load, t]),
  )

  const submit = async () => {
    if (!details.trim()) {
      toastError(t('common.error'), t('help.needDetails'))
      return
    }
    setLoading(true)
    try {
      await api.createHelpTicket(farmer.id, {
        unitId,
        topic: topics.find((x) => x.key === topicKey)?.label || topicKey,
        details: details.trim(),
      })
      setDetails('')
      toastSuccess(t('help.sent'))
      setTickets(await api.helpTickets(farmer.id))
    } catch (e) {
      toastError(
        t('common.error'),
        e.message === 'NETWORK_ERROR' ? t('common.offlineApi') : e.message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-mist" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 36 }}>
        <Text className="pt-4 font-display-bold text-3xl text-forest-900">{t('help.title')}</Text>
        <Text className="mt-2 font-sans text-sm leading-5 text-ink/55">{t('help.subtitle')}</Text>

        <Text className="mt-6 font-sans-medium text-xs uppercase tracking-widest text-ink/45">
          {t('help.cooler')}
        </Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {units.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => setUnitId(u.id)}
              className={`rounded-full px-3 py-2 ${
                unitId === u.id ? 'bg-forest-900' : 'border border-forest-800/10 bg-white'
              }`}
            >
              <Text
                className={`font-sans-semibold text-xs ${
                  unitId === u.id ? 'text-white' : 'text-forest-800'
                }`}
              >
                {u.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-5 font-sans-medium text-xs uppercase tracking-widest text-ink/45">
          {t('help.topic')}
        </Text>
        <View className="mt-2 gap-2">
          {topics.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setTopicKey(item.key)}
              className={`rounded-2xl border px-4 py-3 ${
                topicKey === item.key ? 'border-gold-500 bg-white' : 'border-forest-800/10 bg-white'
              }`}
            >
              <Text className="font-sans-medium text-sm text-forest-900">{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-5 font-sans-medium text-xs uppercase tracking-widest text-ink/45">
          {t('help.details')}
        </Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
          placeholder={t('help.placeholder')}
          placeholderTextColor="#8a968f"
          className="mt-2 min-h-[110px] rounded-3xl border border-forest-800/10 bg-white p-4 font-sans text-sm text-forest-900"
          textAlignVertical="top"
        />

        <Pressable
          onPress={submit}
          disabled={loading}
          className="mt-5 items-center rounded-2xl bg-gold-500 py-4 active:opacity-90"
        >
          {loading ? (
            <ActivityIndicator color="#0c1f18" />
          ) : (
            <Text className="font-sans-semibold text-forest-950">{t('help.send')}</Text>
          )}
        </Pressable>

        <Text className="mb-3 mt-8 font-display text-xl text-forest-900">
          {t('help.yourTickets')}
        </Text>
        {tickets.map((ticket) => (
          <View
            key={ticket.id}
            className="mb-3 rounded-3xl border border-forest-800/10 bg-white p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 pr-3 font-sans-semibold text-forest-900">{ticket.topic}</Text>
              <StatusPill status={ticket.status} />
            </View>
            <Text className="mt-2 font-sans text-sm text-ink/60">{ticket.details}</Text>
            <Text className="mt-2 font-sans text-xs text-ink/40">
              {ticket.unitId} · {new Date(ticket.createdAt).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
