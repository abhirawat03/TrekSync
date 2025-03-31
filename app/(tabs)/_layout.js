import React from 'react'; // Import React
import { Tabs } from 'expo-router';
import 'react-native-get-random-values';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from "@/components/TabBar";
import HomeNavigation from '../Navigator/HomeNavigation'; // Import HomeNavigation
import PlanAi from './planai';
import Profile from './profile';
import Search from './search';
import Track from './track';

export default function TabLayout() {
  const Tab = createBottomTabNavigator(); // Using Tab Navigator

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />} // Custom TabBar
      screenOptions={{
        tabBarActiveTintColor: '#c24e13',
        headerStyle: {
          backgroundColor: '#121212', // Header color
        },
        headerShadowVisible: true,
        headerTintColor: '#c24e13',
        headerShown: false, // Set to false to hide header
      }}
    >
      {/* Always show Home (index) first */}
      <Tab.Screen
        name="home"
        component={HomeNavigation}
        options={{
          title: 'Home', // Tab title
        }}
      />
      {/* Other Tabs */}
      <Tab.Screen
        name="search"
        component={Search} // Add the Search component
        options={{
          title: 'Search', // Tab title
        }}
      />
      <Tab.Screen
        name="planai"
        component={PlanAi} // Add the PlanAi component
        options={{
          title: 'PlanAI', // Tab title
        }}
      />
      
      <Tab.Screen
        name="track"
        component={Track} // Add the Profile component
        options={{
          title: 'Track', // Tab title
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile} // Add the Profile component
        options={{
          title: 'Profile', // Tab title
        }}
      />
    </Tab.Navigator>
  );
}
