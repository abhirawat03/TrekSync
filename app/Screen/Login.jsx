import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, BackHandler, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [showExitModal, setShowExitModal] = useState(false);

  // Back button handler function
  const backAction = () => {
    setShowExitModal(true); // Show the exit confirmation modal
    return true; // Prevent default back button behavior
  };

  // Handle exiting the app
  const handleExit = () => {
    setShowExitModal(false);
    BackHandler.exitApp(); // Exit the app
  };

  useEffect(() => {
    // Set navigation options to remove the back button on the Login screen
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: "#c24e13",
      headerLeft: () => null, // Remove the back button
    });

    // Add event listener for the back button only when the screen is focused
    const focusListener = navigation.addListener('focus', () => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      // Cleanup the event listener when the screen is blurred or unmounted
      return () => backHandler.remove();
    });

    // Cleanup event listener on unmount
    return () => focusListener();
  }, [navigation]);

  return (
    <View>
      <View>
        <Image 
          source={require('../../assets/images/Designer.jpeg')} 
          style={styles.image} 
        />
      </View>
      <LinearGradient colors={["#102027", "#37474F", "#263238"]} style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to TrekSync</Text>
          <Text style={styles.paragraph}>
            Discover your next adventure effortlessly with TrekSync. Plan trips, sync itineraries, and explore curated travel recommendations tailored just for you.
          </Text>
          <TouchableOpacity onPress={() => router.push('auth/sign-in')} style={styles.button}>
            <Text style={styles.buttonText}>Start Your Journey</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Custom Exit Modal */}
      <Modal
        transparent={true}
        visible={showExitModal}
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Hold on!</Text>
            <Text style={styles.modalMessage}>Do you want to exit the app?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowExitModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
                <Text style={styles.exitButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '50%',
    marginTop: -28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 17,
  },
  image: {
    width: '100%',
    height: 390,
  },
  title: {
    fontSize: 30,
    color: '#E1F5FE',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 17,
    textAlign: 'center',
    color: '#B0BEC5',
    marginTop: 10,
    lineHeight: 24,
  },
  button: {
    padding: 15,
    backgroundColor: '#FF7043',
    borderRadius: 99,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#666',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  exitButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Login;
