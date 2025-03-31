import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { CreateTripContext } from '../../context/CreateTripContext';

const SelectBudget = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [budget, setBudget] = useState("");

  const { tripData, setTripData } = useContext(CreateTripContext);

  // Set solo travel type for 1 traveler
  useEffect(() => {
    if (tripData.travelers === 1) {
      setTripData((prevData) => ({
        ...prevData, // Automatically set travelType as 'solo' when only 1 traveler
      }));
    }
  }, [tripData.travelers, setTripData]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: "#c24e13",
    });
  }, [navigation]);

  const onClickContinue = () => {
    if (!budget || isNaN(budget) || budget <= 0) {
      ToastAndroid.show('Please enter a valid budget', ToastAndroid.LONG);
      return;
    }
    setTripData({
      ...tripData,
      budget: parseFloat(budget), // Save budget as a number
    });
    router.push('/create-trip/transport');
  };

  // Content for solo vs group
  const travelerContent = tripData.travelers === 1
    ? "You are traveling solo. Set a budget for your personal trip."
    : "You are traveling with others. Set a group budget for the trip.";

  return (
    <LinearGradient
      colors={["#000000", "#121212", "#1c1f2b"]}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Budget</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>{travelerContent}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter budget in numbers"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
        </View>
        
        {/* Common content below the input */}
        
        <TouchableOpacity style={styles.button} onPress={onClickContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.commonContent}>
          Ensure you have enough budget to cover all expenses for your trip. This includes accommodation, transportation, food, and activities.
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SelectBudget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    paddingTop: 35,
    padding: 25,
    height: '100%',
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    color:'#fff',
  },
  subtitle: {
    fontSize: 25,
    marginBottom: 30,
    color:'#fff',
    textAlign:'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC', // Light gray border
    borderRadius: 10,
    padding: 13,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#D8E3D9', // Light gray background
  },
  commonContent: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#c24e13', // Green button
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    textAlign: 'center',
    fontSize: 20,
  },
});
