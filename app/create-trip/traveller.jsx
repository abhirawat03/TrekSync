  import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
  import { useNavigation, useRouter } from 'expo-router';
  import { useEffect, useState, useContext } from "react";
  import { LinearGradient } from 'expo-linear-gradient';
  import { CreateTripContext } from '../../context/CreateTripContext';

  const SelectTravelers = () => {
    const navigation = useNavigation();
    const router = useRouter();

    const [travelers, setTravelers] = useState(1); // Default 1 traveler

    const { tripData, setTripData } = useContext(CreateTripContext);

    useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerTintColor: "#c24e13",
      });
    }, [navigation]);

    useEffect(() => {
      setTripData({
        ...tripData,
        travelers: travelers,
      });
    }, [travelers]);

    const incrementTravelers = () => {
      if (travelers < 10) {
        setTravelers((prev) => prev + 1); // Increment travelers
      } else {
        ToastAndroid.show('Maximum limit of 10 travelers reached', ToastAndroid.SHORT);
      }
    };

    const decrementTravelers = () => {
      if (travelers > 1) {
        setTravelers((prev) => prev - 1); // Decrement travelers (minimum 1)
      } else {
        ToastAndroid.show('At least one traveler is required', ToastAndroid.SHORT);
      }
    };

    const onClickContinue = () => {
      if (travelers < 1) {
        ToastAndroid.show('Please select a valid number of travelers', ToastAndroid.LONG);
        return;
      }
      if (travelers === 1) {
        router.push('/create-trip/travel-date'); // Navigate to Budget screen if 1 traveler
      } else {
        router.push('/create-trip/type'); // Navigate to Travel Type screen if more than 1 traveler
      }
      
    };

    return (
      <LinearGradient
        colors={['#000000', '#121212', '#1c1f2b']} // Gradient for full screen
        style={styles.container}
      >
        <Text style={styles.title}>Travelers</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.button} onPress={decrementTravelers}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{travelers}</Text>
          <TouchableOpacity style={styles.button} onPress={incrementTravelers}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={onClickContinue}>
          <Text style={styles.continueButtonText}>Next</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  export default SelectTravelers;

  const styles = StyleSheet.create({
    container: {
      paddingTop: 85,
      paddingHorizontal: 25,
      height: '100%',
    },
    title: {
      fontSize: 30,
      color: '#FFFFFF', // White text for the gradient background
      textAlign: 'center',
      marginBottom: 30,
    },
    counterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 50,
    },
    button: {
      backgroundColor: '#c24e13', // Green color
      padding: 12,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      width: 70,
      height: 70,
    },
    buttonText: {
      color: '#FFFFFF', // White text
      fontSize: 32,
      textAlign: 'center',
    },
    counterText: {
      fontSize: 30,
      color: '#FFFFFF', // White text for the gradient background
      marginHorizontal: 40,
    },
    continueButton: {
      backgroundColor: '#c24e13', // Green color
      padding: 15,
      borderRadius: 15,
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    continueButtonText: {
      color: '#FFFFFF', // White text
      textAlign: 'center',
      fontSize: 20,
    },
  });
