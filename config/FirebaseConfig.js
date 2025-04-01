import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
// Your Firebase configuration
const Firebase_API_KEY = Constants.expoConfig?.extra?.Firebase_API_KEY;
const firebaseConfig = {
  apiKey: Firebase_API_KEY,
  authDomain: "first-68788.firebaseapp.com",
  projectId: "first-68788",
  storageBucket: "first-68788.firebasestorage.app", 
  messagingSenderId: "609210394976",
  appId: "1:609210394976:web:c8655541f7af72b3a59605",
  measurementId: "G-X0WY3MJ56D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Authentication with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);
