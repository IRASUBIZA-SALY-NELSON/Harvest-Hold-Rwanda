import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { api } from '../api/client'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export async function ensureNotificationPermissions() {
  if (!Device.isDevice && Platform.OS !== 'web') {
    // Simulators still allow local notifications on iOS/Android in many cases
  }

  const current = await Notifications.getPermissionsAsync()
  let status = current.status
  if (status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync()
    status = asked.status
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Cooler alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1f7a4d',
    })
  }

  return status === 'granted'
}

export async function getExpoPushTokenSafe() {
  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId

    if (projectId) {
      const token = await Notifications.getExpoPushTokenAsync({ projectId })
      return token.data
    }

    // Expo Go / local dev without EAS project id
    const token = await Notifications.getExpoPushTokenAsync()
    return token.data
  } catch {
    return null
  }
}

export async function registerPushWithBackend(farmerId) {
  const granted = await ensureNotificationPermissions()
  if (!granted) {
    return { granted: false, token: null }
  }

  const pushToken = await getExpoPushTokenSafe()
  if (pushToken && farmerId) {
    try {
      await api.registerDeviceToken(farmerId, {
        token: pushToken,
        platform: Platform.OS,
        deviceName: Device.modelName || Device.deviceName || 'unknown',
      })
    } catch {
      // Backend may be briefly unavailable; local notifications still work
    }
  }

  return { granted: true, token: pushToken }
}

export async function notifyLocalAlert({ title, body, data = {} }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: 'alerts' } : {}),
    },
    trigger: null,
  })
}
