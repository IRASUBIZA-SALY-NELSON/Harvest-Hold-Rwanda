import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import HomeScreen from '../screens/HomeScreen'
import AlertsScreen from '../screens/AlertsScreen'
import HelpScreen from '../screens/HelpScreen'
import ProfileScreen from '../screens/ProfileScreen'
import UnitDetailScreen from '../screens/UnitDetailScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function TabIcon({ label, focused }) {
  return (
    <View className="items-center pt-1">
      <View className={`h-1.5 w-1.5 rounded-full ${focused ? 'bg-gold-500' : 'bg-transparent'}`} />
      <Text
        className={`mt-1 font-sans-semibold text-[10px] ${
          focused ? 'text-forest-700' : 'text-ink/40'
        }`}
      >
        {label}
      </Text>
    </View>
  )
}

function MainTabs() {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: 'rgba(20,32,26,0.08)',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t('tabs.home')} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t('tabs.alerts')} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t('tabs.help')} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t('tabs.profile')} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="UnitDetail" component={UnitDetailScreen} />
    </Stack.Navigator>
  )
}
