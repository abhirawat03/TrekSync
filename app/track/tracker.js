import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { db } from '../../config/FirebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Tracker = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [trackers, setTrackers] = useState([]);
  const [contactMap, setContactMap] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [distances, setDistances] = useState([]);

  const userPhoneNumber = '9625690703'; // Replace with dynamic phone number if needed

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: '#c24e13',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchLocationAndContacts = async () => {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (location) => setLocation(location.coords)
      );

      const { status: contactsStatus } = await Contacts.requestPermissionsAsync();
      if (contactsStatus === 'granted') {
        const { data: contactsData } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        const phoneContactMap = {};
        contactsData.forEach((contact) => {
          if (contact.phoneNumbers) {
            contact.phoneNumbers.forEach((phone) => {
              const formattedNumber = phone.number.replace(/\D/g, '');
              phoneContactMap[formattedNumber] = contact.name;
            });
          }
        });

        setContactMap(phoneContactMap);
      } else {
        setErrorMsg('Permission to access contacts was denied');
      }
    };

    fetchLocationAndContacts();
  }, []);

  useEffect(() => {
    if (Object.keys(contactMap).length > 0) {
      const userCollectionRef = collection(db, 'users');
      const q = query(userCollectionRef, where('phone', '!=', userPhoneNumber));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedTrackers = snapshot.docs.map((doc) => {
          const data = doc.data();
          const phone = data.phone.replace(/\D/g, '');
          const name = contactMap[phone] || data.fullName;
          return {
            id: phone,
            latitude: data.currentLocation.latitude,
            longitude: data.currentLocation.longitude,
            title: name,
            profilePic: data.profilePic,
          };
        });

        setTrackers(updatedTrackers);
        adjustMapRegion(updatedTrackers);
      });

      return () => unsubscribe();
    }
  }, [contactMap]);

  useEffect(() => {
    if (location && trackers.length > 0) {
      calculateDistances(trackers);
    }
  }, [location, trackers]);

  const adjustMapRegion = (markers) => {
    if (!location || markers.length === 0) return;

    const allCoordinates = [
      ...markers.map((marker) => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      })),
      { latitude: location.latitude, longitude: location.longitude },
    ];

    const latitudes = allCoordinates.map((coord) => coord.latitude);
    const longitudes = allCoordinates.map((coord) => coord.longitude);

    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    const latitudeDelta = maxLatitude - minLatitude + 0.01;
    const longitudeDelta = maxLongitude - minLongitude + 0.01;

    setMapRegion({
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta,
      longitudeDelta,
    });
  };

  const calculateDistances = (markers) => {
    if (!location) return;

    const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in kilometers
    };

    const distancesArray = markers.map((marker) => ({
      id: marker.id,
      title: marker.title,
      distance: calculateHaversineDistance(
        location.latitude,
        location.longitude,
        marker.latitude,
        marker.longitude
      ).toFixed(2), // Format to 2 decimal places
    }));

    setDistances(distancesArray);
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#121212', '#1c1f2b']} style={styles.container}>
      <Text style={styles.heading}>Tracking Multiple Locations</Text>

      {mapRegion ? (
        <MapView style={styles.map} region={mapRegion} showsUserLocation>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Current Location"
            description="This is where you are currently located."
          />
          {trackers.map((tracker) => (
            <Marker
              key={tracker.id}
              coordinate={{
                latitude: tracker.latitude,
                longitude: tracker.longitude,
              }}
              title={tracker.title}
              description={`Location of ${tracker.title}`}
            >
              <Image source={{ uri: tracker.profilePic }} style={styles.profilePic} />
            </Marker>
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading your location...</Text>
      )}

      <ScrollView style={styles.distanceContainer}>
        {distances.map((distance) => (
          <Text key={distance.id} style={styles.distanceText}>
            {distance.title}: {distance.distance} km
          </Text>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 38,
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  distanceContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  distanceText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Tracker;
