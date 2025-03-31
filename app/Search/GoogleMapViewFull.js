import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { UserLocationContext } from '../../context/UserLocationContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions } from 'react-native';
import PlaceMarker from '../Home/PlaceMarker';
import * as Location from 'expo-location';

export default function GoogleMapViewFull({ placeList }) {
  const [mapRegion, setMapRegion] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { location } = useContext(UserLocationContext); // Assuming this is used for another context
  const mapRef = useRef(null);

  // Request location permission
  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      if (status !== 'granted') {
        console.log("Location permission not granted");
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    if (!locationPermission) return;
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching location:", error);
      setIsLoading(false);
    }
  }, [locationPermission]);

  // Track user location
  const trackUserLocation = useCallback(() => {
  const subscription = Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // Update every 5 seconds
      distanceInterval: 5, // Update for every 5 meters moved
    },
    (location) => {
      setMapRegion((prevRegion) => {
        if (
          prevRegion &&
          Math.abs(prevRegion.latitude - location.coords.latitude) < 0.0001 &&
          Math.abs(prevRegion.longitude - location.coords.longitude) < 0.0001
        ) {
          return prevRegion; // No significant change in position
        }
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
      });
    }
  );

  return subscription; // Return the subscription object
}, []);


  // Calculate bounds and adjust the region to fit all markers
  const centerMarkers = useCallback(() => {
    if (placeList.length > 0 && mapRegion) {
      const allCoordinates = placeList.map((item) => ({
        latitude: parseFloat(item.geometry.location.lat),
        longitude: parseFloat(item.geometry.location.lng),
      }));

      allCoordinates.push({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
      });

      const validCoordinates = allCoordinates.filter(
        (coord) => !isNaN(coord.latitude) && !isNaN(coord.longitude)
      );

      if (validCoordinates.length > 0) {
        const latitudes = validCoordinates.map((coord) => coord.latitude);
        const longitudes = validCoordinates.map((coord) => coord.longitude);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        const latitudeDelta = maxLat - minLat;
        const longitudeDelta = maxLng - minLng;

        // Add padding to ensure markers are not too close to the edges of the screen
        const padding = 0.05;

        setMapRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: latitudeDelta + padding,
          longitudeDelta: longitudeDelta + padding,
        });
      }
    }
  }, [placeList, mapRegion]);

  // Request location permission on mount
  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Get current location and start tracking after permission is granted
  useEffect(() => {
    if (locationPermission) {
      getCurrentLocation();
      const locationSubscription = trackUserLocation();
      return () => {
        locationSubscription.remove();
      };
    }
  }, [locationPermission, getCurrentLocation, trackUserLocation]);

  // Recenter map when placeList or location changes
  useEffect(() => {
    if (placeList.length > 0 && mapRegion) {
      centerMarkers(); // Only call centerMarkers if conditions change
    }
  }, [placeList, location]); // Only recenter map when placeList or location changes

  return (
    <View>
      {isLoading ? (
        <Text>Loading your location...</Text>
      ) : mapRegion ? (
        <MapView
          ref={mapRef}
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height * 0.89,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={mapRegion} // Ensure the region is always updated with the user's location
        >
          <Marker title="You" coordinate={mapRegion} /> {/* Current Location Marker */}
          {placeList.slice(0, 8).map((item, index) => (
            <PlaceMarker item={item} key={index} />
          ))}
        </MapView>
      ) : (
        <Text>Unable to fetch location</Text>
      )}
    </View>
  );
}
