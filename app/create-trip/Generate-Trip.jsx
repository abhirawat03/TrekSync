import { StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useContext, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { CreateTripContext } from '../../context/CreateTripContext';
import { chatSession } from '../../config/AiModel';
import { AI_PROMPT } from '../../constants/data';
import { auth, db } from '../../config/FirebaseConfig';
import { setDoc, doc } from 'firebase/firestore'; // Correct Firebase import
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const GenerateTrip = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const { tripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set navigation options for header customization
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: "#c24e13",
    });
  }, [navigation]);

  useEffect(() => {
    generateAiTrip();
  }, []);

  const generateAiTrip = async () => {
    try {
      setLoading(true);

      // Add transportation-specific logic
      let transportationDetails = '';
      if (tripData?.transportation === 'My Personal Car') {
        transportationDetails = 'Transportation will be by car, providing flexibility and comfort during the trip.';
      } else if (tripData?.transportation === 'My Personal Bike') {
        transportationDetails = 'Transportation will be by bike, allowing for an adventurous and eco-friendly travel experience.';
      } else if (tripData?.transportation === 'Public Transportation') {
        transportationDetails = 'Transportation will be by public transport, offering an affordable and local travel experience.';
      } else {
        transportationDetails = 'Transportation details are not provided.';
      }

      // Construct FINAL_PROMPT
      const FINAL_PROMPT = AI_PROMPT.replace('{location}', tripData?.locationInfo?.name)
        .replace('{totalDay}', tripData?.totalNights + 1)
        .replace('{totalNight}', tripData?.totalNights)
        .replace('{travelers}', tripData?.travelers)
        .replace('{budget}', tripData?.budget)
        .replace('{traveler}', tripData?.travelers === 1 ? 'solo' : tripData?.traveler) // Condition added here
        .replace('{transportation}', tripData?.transportation)
        .replace('{transportation_details}', transportationDetails); // Replace transportation details dynamically

      console.log('FINAL_PROMPT', FINAL_PROMPT);

      const result = await chatSession.sendMessage(FINAL_PROMPT);

      // Assuming the response text is a JSON string
      const tripResponse = JSON.parse(result.response.text());
      console.log(tripResponse);
      setLoading(false);

      // Save generating trip data to Firebase
      const docId = Date.now().toString();
      await setDoc(doc(db, 'UserTrip', docId), {
        userEmail: user.email,
        tripPlan: tripResponse, // AI Generate Result
        tripData: JSON.stringify(tripData), // User Selection data
        docId: docId,
      });

      router.push('/(tabs)/planai');
    } catch (error) {
      console.error('Error generating trip:', error);
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#000000", "#121212", "#1c1f2b"]} // Gradient colors
      style={styles.container} // Applying gradient to the container
    >
      <Text style={styles.title}>Please Wait .........</Text>
      <Text style={styles.paragraph}>We are working on generating your dream Trip</Text>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/plane.gif')} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      <Text style={styles.paragraph}>Don't go back.</Text>
    </LinearGradient>
  );
};

export default GenerateTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 85,
    padding: 25,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
    color: '#fff', // Text color to contrast with dark background
  },
  paragraph: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff', // Text color to contrast with dark background
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: 200,
  },
  paragraphGray: {
    fontSize: 20,
    color: '#808080',
    textAlign: 'center',
  },
});
