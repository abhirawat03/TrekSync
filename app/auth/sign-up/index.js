import { StyleSheet, Text, View, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore"; 
import { Alert } from 'react-native';
import Modal from 'react-native-modal';  // Import react-native-modal

const SignUP = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [message, setMessage] = useState(""); // State to store the message for modal

  // Refs for input fields
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Handle Android back button press
  useEffect(() => {
    const backAction = () => {
      router.replace('auth/sign-in');  // Navigate to sign-in screen when back button is pressed
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Cleanup when the component unmounts
  }, [router]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onCreateAccount = async () => {
    if (!email || !password || !fullName) {
      showCustomAlert('Please Enter all details');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save full name to Firestore, using email as the document ID
      const userDoc = doc(db, "users", email);  // Use email as the document ID
      await setDoc(userDoc, {
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString(),
      });
  
      showCustomAlert('Account created successfully!');
      router.replace('/home');
      console.log('User created:', user);
    } catch (error) {
      console.error('Error creating account:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        showCustomAlert('This email is already registered. Please sign in.');
      } else {
        showCustomAlert(error.message);
      }
    }
  };
  

  const showCustomAlert = (message) => {
    setMessage(message);  // Set the message for the modal
    setIsModalVisible(true);  // Show the modal with the message
  };

  const hideModal = () => {
    setIsModalVisible(false);  // Hide the modal when 'OK' is pressed
  };

  return (
    <LinearGradient colors={['#000000', '#1c1f2b', '#232323']} style={styles.container}>
      <Svg height="100%" width="100%" style={styles.backgroundSvg}>
        <Circle cx="15%" cy="15%" r="100" fill="rgba(109, 213, 237, 0.4)" />
        <Circle cx="85%" cy="85%" r="150" fill="rgba(59, 89, 152, 0.3)" />
        <Path d="M0,250 Q150,300 300,200 T600,150 L600,0 L0,0 Z" fill="rgba(109, 213, 237, 0.2)" />
        <Path d="M0,350 Q200,450 400,300 T600,250 L600,0 L0,0 Z" fill="rgba(59, 89, 152, 0.15)" />
        <Circle cx="50%" cy="50%" r="200" fill="rgba(109, 213, 237, 0.05)" />
      </Svg>

      <View style={styles.formContainer}>
        {/* Back Button for navigating to previous screen */}
        <TouchableOpacity onPress={() => router.replace('auth/sign-in')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Create New Account</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            placeholderTextColor="#aaa"
            returnKeyType="next"
            onChangeText={(value) => setFullName(value)}
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            ref={emailInputRef}
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#aaa"
            returnKeyType="next"
            keyboardType="email-address"
            autoComplete="email"
            onChangeText={(value) => setEmail(value)}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            secureTextEntry={true}
            placeholder="Enter Password"
            placeholderTextColor="#aaa"
            returnKeyType="done"
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onCreateAccount}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonInverter]}
          onPress={() => router.replace('auth/sign-in')}
        >
          <Text style={{ textAlign: 'center', color: '#000' }}>Sign In</Text>
        </TouchableOpacity>

        {/* Custom Modal with gradient background */}
        <Modal isVisible={isModalVisible} onBackdropPress={hideModal} onBackButtonPress={hideModal}>
          <View style={styles.modalContent}> {/* Removed LinearGradient and used a simple View */}
            <Text style={styles.modalText}>{message}</Text>
            <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  formContainer: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginTop: 30,
    color: '#fff',
  },
  inputLabel: {
    color: '#fff',
    fontSize: 17,
    marginBottom: 5,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    color: '#fff',
    borderColor: '#7d7d7d',
    marginBottom: 5,
    fontSize: 16,
  },
  button: {
    padding: 20,
    backgroundColor: '#c24e13',
    borderRadius: 15,
    marginTop: 20,
  },
  buttonInverter: {
    backgroundColor: '#fff',
    borderWidth: 1,
    marginTop: 10,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#1c1f2b', // Use a solid color for the background
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#c24e13',
    padding: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUP;
