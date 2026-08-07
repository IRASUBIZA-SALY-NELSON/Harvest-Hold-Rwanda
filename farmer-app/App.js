import './global.css'
import './src/i18n'
import { ActivityIndicator, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces'
import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
} from '@expo-google-fonts/sora'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { LanguageProvider, useLanguage } from './src/context/LanguageContext'
import AppNavigator from './src/navigation/AppNavigator'
import LoginScreen from './src/screens/LoginScreen'

function Root() {
  const { isAuthenticated, booting } = useAuth()
  const { ready } = useLanguage()

  if (booting || !ready) {
    return (
      <View className="flex-1 items-center justify-center bg-forest-950">
        <ActivityIndicator color="#d4af37" />
      </View>
    )
  }

  return isAuthenticated ? <AppNavigator /> : <LoginScreen />
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
  })

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-forest-950">
        <ActivityIndicator color="#d4af37" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Root />
            <Toast />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  )
}
