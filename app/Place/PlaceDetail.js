import { View, Text, ScrollView, TouchableOpacity, Platform, Linking, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import PlaceDetailItem from './PlaceDetailItem';
import GoogleMapView from '../../app/Home/GoogleMapView';
import { Ionicons } from "@expo/vector-icons";

export default function PlaceDetail({ navigation }) {
  const param = useRoute().params;
  const [place, setPlace] = useState({});  // Changed to an object

  useEffect(() => {
    setPlace(param.place);

    // Update header options for the PlaceDetail screen
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: '#c24e13', // Sets the color of the header text and icons
    });
  }, [param, navigation]);

  const onDirectionClick = () => {
    if (place?.geometry?.location?.lat && place?.geometry?.location?.lng) {
      const url = Platform.select({
        android: `geo:${place.geometry.location.lat},${place.geometry.location.lng}?q=${place.vicinity}`,
        ios: `http://maps.apple.com/?daddr=${place.geometry.location.lat},${place.geometry.location.lng}&q=${place.vicinity}`,
      });
      Linking.openURL(url);
    } else {
      console.error("Invalid place data.");
      // Optionally, you can show a fallback error message or UI to the user.
    }
  };

  return (
    <ScrollView style={styles.container}> {/* Light black background */}
      <PlaceDetailItem
        place={place}
        onDirectionClick={onDirectionClick}
      />
      {place?.geometry?.location?.lat && place?.geometry?.location?.lng ? (
        <GoogleMapView placeList={[place]} />
      ) : (
        <Text style={styles.errorText}>Location data is unavailable</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onDirectionClick}
      >
        <Ionicons name="navigate-circle-outline" size={25} color="white" />
        <Text style={styles.buttonText}>
          Get Direction on Google Map
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20, // Adjust left and right padding for overall spacing
    backgroundColor: '#1c1c1c', // Light black background
  },
  button: {
    backgroundColor: '#6200ea', // Primary color for button
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 85,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    textAlign: "center",
    color: 'white', // White text for better contrast on dark background
    paddingLeft: 10, // Adjust for better spacing
  },
  errorText: {
    textAlign: 'center',
    color: 'red',  // Error message in red
    padding: 20,
  },
});
