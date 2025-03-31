import { useState,useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import {CreateTripContext} from '../context/CreateTripContext';
import { UserLocationContext } from '../context/UserLocationContext';

export default function RootLayout() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tripData,setTripData] = useState([]);
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
     
    })();
  }, []);
  return (
    <UserLocationContext.Provider 
    value={{location,setLocation}}>
    <CreateTripContext.Provider value={{tripData,setTripData}}>
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Hide the header for the tab navigator
        }}
      />
      <Stack.Screen
        name="+not-found"
        options={{
          headerStyle: {
            backgroundColor: '#25292e', // Set header background color
          },
          headerTitleStyle: {
            color: '#ffffff', // Set title text color
          },
          headerLeft: () => null, // Remove the back arrow
        }}
      />
    </Stack>
    </CreateTripContext.Provider>
    </UserLocationContext.Provider>
  );
}
