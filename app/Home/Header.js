import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { db, auth } from '../../config/FirebaseConfig'; // Import Firebase configuration
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Header() {
  const [fullName, setFullName] = useState(''); // State for storing the full name
  const [userId, setUserId] = useState(null); // State for storing the user ID

  // Fetch user full name from Firestore
  const fetchUserFullName = async (email) => { // No type annotation for uid
    try {
      const userRef = doc(db, 'users', email); // Fetch user data using the uid
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setFullName(userData.fullName || 'User'); // Handle potential undefined data
      } else {
        console.log('No user data available');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Listen for auth state changes to get the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.email); // Store user ID when authenticated
        console.log('User ID:', user.uid); // Debugging user ID
      } else {
        console.log('User is not authenticated');
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Fetch user full name once the user ID is available
  useEffect(() => {
    if (userId) {
      fetchUserFullName(userId); // Pass the uid as a string
    }
  }, [userId]); // Trigger this effect when userId changes

  // Debugging full name state
  useEffect(() => {
    console.log('Full Name:', fullName);
  }, [fullName]);

  return (
    <View style={styles.container}>
      {/* Logo positioned in the left corner */}
      <Image source={require('../../assets/images/app-icon.png')} style={styles.logo} />

      {/* Welcome message with user's full name */}
      <Text style={styles.welcomeText}>Welcome, {fullName}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center', // Ensure alignment of logo and welcome message in one row
    marginTop: 15,
    paddingHorizontal: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 20, // Increased space between logo and welcome text
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Change text color to white for visibility
  },
});
