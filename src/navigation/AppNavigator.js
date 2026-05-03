import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Map, Bell, User, Calendar, Activity } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AccountScreen from '../screens/AccountScreen';
import ActivityScreen from '../screens/ActivityScreen';
import DogProfileScreen from '../screens/DogProfileScreen';
import AIInsightsScreen from '../screens/AIInsightsScreen';
import ScheduleWalkScreen from '../screens/ScheduleWalkScreen';
import WalkStatusScreen from '../screens/WalkStatusScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import WalkSummaryScreen from '../screens/WalkSummaryScreen';
import AIChatScreen from '../screens/AIChatScreen';
import AIFindWalkScreen from '../screens/AIFindWalkScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.aiPurple,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 15,
          height: 70,
          borderRadius: 35,
          paddingBottom: 15,
          paddingTop: 15,
          backgroundColor: COLORS.white,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Explorar"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Actividad"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
          tabBarBadge: 2,
          tabBarBadgeStyle: { backgroundColor: '#FF3B30', color: 'white', fontSize: 10, minWidth: 16, height: 16, lineHeight: 16 },
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="DogProfile" component={DogProfileScreen} />
        <Stack.Screen name="AIInsights" component={AIInsightsScreen} />
        <Stack.Screen name="ScheduleWalk" component={ScheduleWalkScreen} />
        <Stack.Screen name="WalkStatus" component={WalkStatusScreen} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        <Stack.Screen name="WalkSummary" component={WalkSummaryScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="AIFindWalk" component={AIFindWalkScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
