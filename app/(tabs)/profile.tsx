import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { auth } from '../../config/FirebaseConfig';

const LOCATION_TASK_NAME = 'background-location-task';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null, // Disable the back button
    });
  }, [navigation]);

  // Request both foreground and background location permissions
  const getLocationPermission = async () => {
    // Request foreground permission
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to update your location.');
      return;
    }

    // Request background permission
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== 'granted') {
      Alert.alert('Background Permission Denied', 'Background location permission is required for continuous updates.');
      return;
    }

    setHasPermission(true);
    startBackgroundLocationTracking();
  };

  // Start background location tracking
  const startBackgroundLocationTracking = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 10, // Don't wait for movement
        showsBackgroundLocationIndicator: true,
      });
    } catch (error) {
      console.error('Error starting background location updates:', error);
    }
  };

  // Update location in Firestore
  const updateLocationInFirestore = async (latitude: number, longitude: number) => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser?.email || '');
      await updateDoc(userDocRef, {
        currentLocation: { latitude, longitude },
        updatedAt: new Date().toISOString(),
      });
      console.log('Location updated in Firestore');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  useEffect(() => {
    // Register background task to handle location updates
    getLocationPermission();

    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
      if (error) {
        console.error('Background location error:', error);
        return;
      }

      if (data) {
        const { locations } = data as any;
        const { latitude, longitude } = locations[0].coords;
        console.log('Location received:', latitude, longitude); // Log the location data
        await updateLocationInFirestore(latitude, longitude);
      }
    });

    // Clean up task on component unmount or permission change
    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
        .catch((error) => {
          console.error('Error stopping location updates:', error);
        });
    };
  }, [hasPermission]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        try {
          // Fetch profile data from Firestore using email as document ID
          const userDocRef = doc(db, 'users', authUser.email || '');
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setProfileData(userData);
          } else {
            setProfileData({
              fullName: 'User',
              email: 'N/A',
              phone: 'N/A',
              address: 'N/A',
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        }
      } else {
        router.push('/Screen/Login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const handleLogout = async () => {
    const auth = getAuth();
    try {
      // Ensure background location updates are stopped only if the task is registered
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch((error) => {
        console.error('Error stopping location updates during logout:', error);
      });

      // Sign out the user
      await signOut(auth);

      // Redirect to login screen
      router.replace('/Screen/Login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c24e13" />
      </View>
    );
  }

  if (!profileData || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#121212', '#1c1f2b']} style={styles.container}>
      <View style={styles.profilePicContainer}>
        {profileData?.profilePic ? (
          <Image source={{ uri: profileData.profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <MaterialIcons name="account-circle" size={60} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.userName}>{profileData.fullName || 'User'}</Text>
      <Text style={styles.userEmail}>{profileData.email || 'No email available'}</Text>
      <Text style={styles.userPhone}>Phone: {profileData.phone || 'N/A'}</Text>
      <Text style={styles.userAddress}>Address: {profileData.address || 'N/A'}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push('/Screen/EditProfileScreen')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setLogoutModalVisible(true)}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Custom Logout Modal */}
      <Modal
        transparent={true}
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={() => {
                  setLogoutModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.modalLogoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4d4d',
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  profilePicPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
  },
  userName: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  userPhone: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  userAddress: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#ff8c00',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color:'#fff',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  modalLogoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  modalLogoutButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProfileScreen;
