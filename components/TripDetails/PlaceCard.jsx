import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { GetPhotoRef } from '../../Services/GooglePlaceApi';

export default function PlaceCard({ place }) {
  const googleMapsApiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
  const [photoRef, setPhotoRef] = useState();

  useEffect(() => {
    // Fetching Google photo reference on component mount or place change
    GetGooglePhotoRef();
  }, [place?.placeDetails.placeName]);

  // Function to fetch photo reference from Google API
  const GetGooglePhotoRef = async () => {
    try {
      const result = await GetPhotoRef(place?.placeDetails.placeName);
      const photoReference = result?.results[0]?.photos?.[0]?.photo_reference;
      if (photoReference) {
        setPhotoRef(photoReference);
      } else {
        console.log('No photo reference found');
      }
    } catch (error) {
      console.error('Error fetching photo reference:', error);
    }
  };

  return (
    <View style={styles.activityContainer}>
      {/* Place Name */}
      <Text style={styles.placeNameText}>{place?.placeDetails.placeName}</Text>

      {/* Place Image */}
      <Image
        source={
          photoRef
            ? {
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${googleMapsApiKey}`,
              }
            : require('./../../assets/images/Designer.jpeg') // Fallback to a local image if no photoRef is available
        }
        style={styles.activityImage}
        onError={(error) => {
          console.error('Image failed to load:', error.nativeEvent.error);
        }}
      />

      <View style={styles.activityDetails}>
        {/* Text Content */}
        <View style={styles.textContainer}>
          {/* Activity Name */}
          <Text style={styles.activityText}>{place?.activity}</Text>

          {/* Best Time to Visit */}
          <Text style={styles.bestTimeText}>Best Time to Visit: {place?.bestTimetoVisit}</Text>

          {/* Suggested Activities */}
          <Text style={styles.suggestedActivitiesText}>Suggested Activities: {place.suggestedActivities}</Text>

          {/* Place Description */}
          <Text style={styles.descriptionText}>{place?.placeDetails.description}</Text>

          {/* Time to Spend */}
          <Text style={styles.timeText}>Time: {place.time}</Text>

          {/* Ticket Price */}
          <Text style={styles.ticketPriceText}>{place?.placeDetails.ticketPrice}</Text>

          {/* Transportation Info */}
          <Text style={styles.transportationText}>Transportation: {place.transportation}</Text>
        </View>
      </View>
    </View>
  );
}

// Styles for the Place Card
const styles = StyleSheet.create({
  activityContainer: {
    marginBottom: 20,
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#34495E',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

  activityImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
    marginBottom: 15,
  },

  activityDetails: {
    flexDirection: 'column',
  },

  textContainer: {
    marginBottom: 20,
  },

  activityText: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  bestTimeText: {
    color: '#8E44AD',
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 8,
  },

  placeNameText: {
    color: '#1E90FF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  suggestedActivitiesText: {
    color: '#F39C12',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },

  descriptionText: {
    color: '#BDC3C7',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },

  timeText: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  ticketPriceText: {
    color: '#F39C12',
    fontSize: 16,
    fontWeight: 'lighter',
    marginBottom: 8,
  },

  transportationText: {
    color: '#16A085',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
