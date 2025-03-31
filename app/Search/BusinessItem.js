import { View, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign } from "@expo/vector-icons";
import Colors from '../../components/Colors';
import Constants from 'expo-constants';

export default function BusinessItem({ place }) {
  const [photoUri, setPhotoUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the API key from app.json via Constants
  const googleApiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

  // Fetch the place photo if available
  const fetchPhotoUri = async () => {
    if (place?.photos?.[0]?.photo_reference) {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place?.photos[0]?.photo_reference}&key=${googleApiKey}`;
      setPhotoUri(photoUrl);
      setIsLoading(false);
    } else {
      setIsLoading(false); // If no photo is available, set loading as false
    }
  };

  useEffect(() => {
    fetchPhotoUri();
  }, [place]);

  return (
    <View style={{
      width: 140, height: 210, backgroundColor: Colors.GRAY,
      borderRadius: 15, padding: 10, marginRight: 5, marginBottom: 50, elevation: 0.4
    }}>
      {/* Image or Placeholder */}
      {isLoading ? (
        <Image
          source={require('../../assets/images/placeholder.jpg')}
          style={{ width: 120, height: 80, borderRadius: 10 }}
        />
      ) : photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: 120, height: 80, borderRadius: 10 }}
        />
      ) : (
        <Image
          source={require('../../assets/images/placeholder.jpg')}
          style={{ width: 120, height: 80, borderRadius: 10 }}
        />
      )}

      {/* Business Name */}
      <Text
        numberOfLines={2}
        style={{ fontFamily: 'raleway-bold', fontSize: 16, marginTop: 5 }}
      >
        {place?.name || 'Unnamed Business'} {/* Fallback for undefined name */}
      </Text>

      {/* Business Address or Vicinity */}
      <Text
        numberOfLines={2}
        style={{
          fontFamily: 'raleway', fontSize: 13, marginTop: 5, color: Colors.DARK_GRAY
        }}
      >
        {place?.vicinity || place?.formatted_address || 'No Address Available'} {/* Fallback for address */}
      </Text>

      {/* Rating */}
      <View
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginTop: 5,
          flexDirection: "row",
          marginBottom: -5
        }}
      >
        <AntDesign name="star" size={20} color={Colors.YELLOW} />
        <Text>{place?.rating || 'N/A'}</Text> {/* Fallback for rating */}
      </View>
    </View>
  );
}
