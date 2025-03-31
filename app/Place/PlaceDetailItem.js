import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from '../../components/Colors';
import Share from '../../Services/Share';
import GoogleMapView from '../Home/GoogleMapView';

export default function PlaceDetailItem({ place, onDirectionClick }) {
  return (
    <View style={styles.container}>
      <Text style={styles.placeName}>
        {place.name}
      </Text>
      
      <View style={styles.ratingContainer}>
        <AntDesign name="star" size={20} color={Colors.YELLOW} />
        <Text style={styles.ratingText}>{place.rating}</Text>
      </View>

      {place?.photos ? (
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo" +
              "?maxwidth=400" +
              "&photo_reference=" +
              place?.photos[0]?.photo_reference +
              "&key=AIzaSyCcRk-HFj5gn_zIVFANyqtiAKK3c-8gmLQ",
          }}
          style={styles.placeImage}
        />
      ) : null}

      <Text style={styles.addressText} numberOfLines={2}>
        {place.vicinity ? place.vicinity : place.formatted_address}
      </Text>

      {place?.opening_hours ? (
        <Text style={styles.openingHoursText}>
          {place?.opening_hours?.open_now === true ? "(Open)" : "(Closed)"}
        </Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onDirectionClick} style={styles.directionButton}>
          <Ionicons name="navigate-circle-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Direction</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Share.SharePlace(place)} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="black" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#1c1c1c', // Dark background
  },
  placeName: {
    fontSize: 26,
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  ratingText: {
    color: 'white',
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginTop: 10,
  },
  addressText: {
    fontSize: 16,
    marginTop: 10,
    color: 'white',
  },
  openingHoursText: {
    fontSize: 20,
    color: 'white',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.PRIMARY,
    width: 110,
    padding: 10,
    borderRadius: 40,
    justifyContent: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.PRIMARY,
    width: 90,
    padding: 10,
    borderRadius: 40,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
