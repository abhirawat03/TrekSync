import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { CreateTripContext } from '../../context/CreateTripContext'; // Importing the context
import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';

const ReviewTripScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

  // Accessing trip data from context
  const { tripData } = useContext(CreateTripContext);

  useEffect(() => {
    // Set navigation options for header customization
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: "#c24e13",
    });
  }, [navigation]);

  return (
    <LinearGradient colors={["#000000", "#121212", "#1c1f2b"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Review Your Trip</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.description}>
            Please review your selection before generating your trip.
          </Text>

          {/* Total Travelers Section */}
          <View style={[styles.flex, { marginTop: 20 }]}>
            <Text style={styles.icon}>🧳</Text>
            <View>
              <Text style={styles.label}>Total Travelers</Text>
              <Text style={styles.value}>
                {tripData?.travelers} {tripData?.travelers === 1 ? "Traveler" : "Travelers"}
              </Text>
            </View>
          </View>

          {/* Destination View */}
          <View style={[styles.flex, { marginTop: 20 }]}>
            <Text style={styles.icon}>📍</Text>
            <View>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>{tripData?.locationInfo?.name}</Text>
            </View>
          </View>

          {/* Travel Date View */}
          <View style={styles.flex}>
            <Text style={styles.icon}>📅</Text>
            <View>
              <Text style={styles.label}>Travel Dates</Text>
              <Text style={styles.value}>
                {moment(tripData?.startDate).format('DD MMM') + " TO " +
                  moment(tripData?.endDate).format('DD MMM') + " (" + tripData?.totalNights + " Nights)"}
              </Text>
            </View>
          </View>

          {/* Traveler Count View */}
          <View style={styles.flex}>
            <Text style={styles.icon}>👥</Text>
            <View>
              <Text style={styles.label}>Who is traveling</Text>
              <Text style={styles.value}>
                {tripData?.travelers === 1 ? "Solo" : tripData?.traveler}
              </Text>
            </View>
          </View>

          {/* Budget View */}
          <View style={styles.flex}>
            <Text style={styles.icon}>💰</Text>
            <View>
              <Text style={styles.label}>Budget</Text>
              <Text style={styles.value}>{tripData?.budget}</Text>
            </View>
          </View>

          {/* Transportation View */}
          <View style={styles.flex}>
            <Text style={styles.icon}>🚗</Text>
            <View>
              <Text style={styles.label}>Transportation</Text>
              <Text style={styles.value}>{tripData?.transportation || "Not Selected"}</Text>
            </View>
          </View>
        </View>

        {/* Button to generate the trip */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/create-trip/Generate-Trip')}
        >
          <Text style={styles.buttonText}>Build My Trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default ReviewTripScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    height: '100%',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50,
    color: '#fff',
  },
  description: {
    fontSize: 20,
    color: '#fff',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  icon: {
    fontSize: 25, // Adjust the size of the emoji icon
    color: '#c24e13', // Set the color of the emoji icon
    marginRight: 5,
  },
  label: {
    fontSize: 20,
    color: '#fff',
  },
  value: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
    paddingRight: 40,
  },
  button: {
    backgroundColor: '#c24e13',
    padding: 15,
    borderRadius: 15,
    marginTop: 40,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
  },
});
