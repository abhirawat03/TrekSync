import { View, Text } from 'react-native';
import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import Home from '../(tabs)/home';
import PlaceDetail from '../Place/PlaceDetail';
import Search from '../(tabs)/search'; // Import the Search screen

export default function HomeNavigation() {
  const isAndroid = true;
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        ...(isAndroid && TransitionPresets.ModalPresentationIOS),
      }}
    >
      <Stack.Screen
        name='home-screen'
        options={{ headerShown: false }}
        component={Home}
      />
      <Stack.Screen
        name='place-detail'
        component={PlaceDetail}
        options={{ title: '', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
