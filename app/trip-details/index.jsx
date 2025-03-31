import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import moment from 'moment';
import Constants from 'expo-constants';

import HotelList from '../../components/TripDetails/HotelList';
import PlannedTrip from '../../components/TripDetails/PlannedTrip';

const Index = () => {
  const navigation = useNavigation();
  const { trip } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);

  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing data:', error);
      return null;
    }
  };

  const apiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: '#c24e13', // Set the tint color for the header
    });

    if (trip) {
      const parsedTrip = formatData(trip);
      setTripDetails(parsedTrip);
    }
  }, [trip]);

  if (!tripDetails) return null;

  const tripData = formatData(tripDetails?.tripData);
  const photoRef = tripData?.locationInfo?.photoRef;

  const imageUrl = photoRef && apiKey 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxheight=400&photoreference=${photoRef}&key=${apiKey}` 
    : null;

  const hotels = tripDetails?.tripPlan?.hotels || [];
  const tripDailyPlan = tripDetails?.tripPlan?.itinerary || [];

  // Function to handle hotel booking redirect
  const handleHotelBooking = () => {
    // Sort hotels by price in ascending order
    const sortedHotels = hotels.sort((a, b) => {
      const priceA = a?.price || 0; // Default to 0 if price is undefined
      const priceB = b?.price || 0; // Default to 0 if price is undefined
      return priceA - priceB;
    });
  
    // Get the hotel with the lowest price
    const lowestPriceHotel = sortedHotels[0];
    const hotelName = lowestPriceHotel?.name;
    const locationName = tripData?.locationInfo?.name;
  const searchQuery = encodeURIComponent(locationName);
    
    // Generate the Google Hotel search URL with the lowest price hotel
    const googleHotelUrl = `https://www.google.com/travel/hotels?g2lb=2502548%2C2502549%2C2511901%2C2508897&pli=1&q=${searchQuery}`;
    
    // Open the hotel booking URL
    Linking.openURL(googleHotelUrl).catch((err) =>
      console.error('Failed to open hotel booking URL:', err)
    );
  };

  return (
    <ScrollView>
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
        />
      ) : (
        <Image 
          source={require('./../../assets/images/Designer.jpeg')} 
          style={styles.image} 
        />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>
          {tripData?.locationInfo?.name}
        </Text>
        <View style={styles.flexBox}>
          <Text style={styles.smallPara}>
            {moment(tripData?.startDate).format("DD MMM YYYY")}
          </Text>
          <Text style={styles.smallPara}>
            - {moment(tripData?.endDate).format("DD MMM YYYY")}
          </Text>
        </View>
        <Text style={styles.smallPara}>
  🚌 {tripData?.travelers === 1 ? 'Solo' : tripData?.traveler}
</Text>

        {/* Hotel List */}
        <HotelList hotelList={hotels} />

        {/* Hotel Booking Section */}
        <View style={styles.bookingSection}>
          <Text style={styles.bookingText}>
            Want to book a hotel for your stay in {tripData?.locationInfo?.name}? 
            Click below to explore available options and book your stay.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleHotelBooking}>
            <Text style={styles.buttonText}>Book Your Hotel</Text>
          </TouchableOpacity>
        </View>

        {/* Trip Daily Plan */}
        <PlannedTrip details={tripDailyPlan} />
      </View>
    </ScrollView>
  );
}

export default Index;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 280,
  },
  container: {
    padding: 15,
    paddingBottom: 65,
    backgroundColor: '#222222',
    height: '100%',
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#ffffff',
  },
  smallPara: {
    fontFamily: 'Outfit',
    fontSize: 18,
    color: '#cccccc',
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  bookingSection: {
    marginTop: 25,
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  bookingText: {
    color: '#cccccc',
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
