import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api, setAuthToken } from '../api/client'
import { registerPushWithBackend } from '../services/notifications'

const AuthContext = createContext(null)
const SESSION_KEY = 'hh_farmer_session'

export function AuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null)
  const [token, setToken] = useState(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY)
        if (raw) {
          const session = JSON.parse(raw)
          setFarmer(session.farmer)
          setToken(session.token)
          setAuthToken(session.token)
          if (session.farmer?.id) {
            registerPushWithBackend(session.farmer.id).catch(() => {})
          }
        }
      } finally {
        setBooting(false)
      }
    })()
  }, [])

  const value = useMemo(
    () => ({
      farmer,
      token,
      booting,
      isAuthenticated: !!farmer && !!token,
      login: async (phone, pin) => {
        const data = await api.login(phone, pin)
        setFarmer(data.farmer)
        setToken(data.token)
        setAuthToken(data.token)
        await AsyncStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ farmer: data.farmer, token: data.token }),
        )
        registerPushWithBackend(data.farmer.id).catch(() => {})
        return data
      },
      logout: async () => {
        setFarmer(null)
        setToken(null)
        setAuthToken(null)
        await AsyncStorage.removeItem(SESSION_KEY)
      },
    }),
    [farmer, token, booting],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
