import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Constants from 'expo-constants';
import HotelCard from './HotelCard';

const HotelList = ({ hotelList }) => {
  // Get the API key from Expo constants
  const googleMapsApiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

  // Function to generate the Google Maps static image URL
  

  // Parse geo-coordinates from the string

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏨 Hotel Recommendation</Text>
      <FlatList
        style={styles.hotelItem}
        data={hotelList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <HotelCard item={item} />}
      />
    </View>
  );
};

export default HotelList;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  hotelItem: {
    marginTop: 8,
  },
});
