import { StyleSheet, View, Text } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useContext } from 'react';
import Constants from 'expo-constants'; // Import Constants to access extra properties
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { LinearGradient } from "expo-linear-gradient";
import { CreateTripContext } from '../../context/CreateTripContext';

const SearchPlace = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { tripData, setTripData } = useContext(CreateTripContext);

  // Access the Google API key from app.json
  const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Search',
    });
  }, [navigation]);

  useEffect(() => {
    console.log("tripData", tripData);
  }, [tripData]);

  return (
    <LinearGradient colors={["#000000", "#121212", "#1c1f2b"]} style={styles.container}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Search Your Destination</Text>

        {/* Subtitle */}
        <Text style={styles.subTitle}>Explore incredible places to visit in India</Text>

        {/* Google Places Autocomplete */}
        <GooglePlacesAutocomplete
          placeholder='Search Place'
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log(data, details);
            setTripData({
              ...tripData,
              locationInfo: {
                name: data.description,
                coordinate: details?.geometry.location,
                photoRef: details?.photos[0].photo_reference,
                url: details?.url
              },
            });
            router.push('create-trip/traveller');
          }}
          query={{
            key: GOOGLE_API_KEY, // Use the API key from app.json
            language: 'en',
            components: 'country:IN',
          }}
          styles={{
            textInputContainer: {
              borderWidth: 1,
              borderRadius: 20,
              marginTop: 25,
            },
          }}
        />

        {/* Instruction Text */}
        <Text style={styles.instructionText}>
          Type the name of any place, landmark, or city to find your next destination.
        </Text>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Your adventure starts here. Let's explore!
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({
  container: {
    paddingTop: 65,
    padding: 10,
    height: '100%',
  },

  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },

  subTitle: {
    fontSize: 22,
    textAlign: 'center',
    color: '#bbb',
  },

  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#bbb',
  },

  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    marginTop: 30,
  },
});
