import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { GetPhotoRef } from '../../Services/GooglePlaceApi';

export default function HotelCard({ item }) {
  const googleMapsApiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

  if (!googleMapsApiKey) {
    console.error('Google Maps API key is missing. Please check your app.json or app.config.js');
    return null; // Return early if the API key is missing
  }

  const [photoRef, setPhotoRef] = useState(null);

  useEffect(() => {
    GetGooglePhotoRef();
  }, [item.hotelName, item.address]);

  const GetGooglePhotoRef = async () => {
    try {
      const combinedNameAddress = `${item.hotelName} ${item.address}`;
      const result = await GetPhotoRef(combinedNameAddress);
      const reference = result?.results?.[0]?.photos?.[0]?.photo_reference || null;
      setPhotoRef(reference);
    } catch (error) {
      console.error('Error fetching photo reference:', error);
    }
  };

  return (
    <View style={{ marginRight: 20, width: 180 }}>
      <Image
        source={
          photoRef
            ? {
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${googleMapsApiKey}`,
              }
            : require('./../../assets/images/Designer.jpeg') // Ensure this path is correct
        }
        style={styles.image}
        onError={(error) => {
          console.error('Image failed to load:', error.nativeEvent.error);
        }}
      />
      <View>
        <Text style={[styles.hotelName, { color: '#fff' }]}>{item.hotelName}</Text>
        <View style={styles.flexContainer}>
          <Text style={[{ fontFamily: 'Outfit', color: '#fff' }]}>🌟 {item.rating}</Text>
          <Text style={[{ fontFamily: 'Outfit', color: '#fff' }]}>💰 {item.pricePerNight}/night</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hotelName: {
    fontSize: 17,
  },
  image: {
    width: 180,
    height: 140,
    borderRadius: 15,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
