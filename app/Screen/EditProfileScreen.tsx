import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getAuth, updateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation, useRouter } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    profilePic: '', // Ensure this is a string or null
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: '#c24e13',
      headerLeft: null, // Removes the back button
    });
  }, [navigation]);

  useEffect(() => {
    const auth = getAuth();
    const authUser = auth.currentUser;
  
    if (authUser && authUser.email) {
      setUser(authUser);
  
      const fetchProfile = async () => {
        const userEmail = authUser.email;
  
        if (!userEmail) {
          Alert.alert('Error', 'User email is unavailable.');
          setLoading(false);
          return;
        }
  
        const userDocRef = doc(db, 'users', userEmail); // Ensure that email is valid
        const userSnapshot = await getDoc(userDocRef);
  
        if (userSnapshot.exists()) {
          const data = userSnapshot.data() as { fullName: string; phone: string; address: string; profilePic: string, email: string };
          setFormData({
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            email: data.email,
            profilePic: data.profilePic || '', // Ensure profilePic has a valid value
          });
          setImageUri(data.profilePic || ''); // Set profile picture URI with fallback
        }
        setLoading(false);
      };
  
      fetchProfile();
    } else {
      // Handle case where user email is null or user is not authenticated
      Alert.alert('Error', 'User is not authenticated or email is unavailable.');
      setLoading(false);
    }
  }, []);
  


  const handleSave = async () => {
    // Check if all fields are filled
    if (!formData.fullName || !formData.phone || !formData.address || !formData.email || !imageUri) {
      Alert.alert('Error', 'All fields are required, including profile picture!');
      return;
    }

    // Validate phone number
    if (formData.phone.length !== 10 || isNaN(Number(formData.phone))) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits!');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await updateEmail(user, formData.email);
      }

      // Ensure profilePic is not undefined or null
      const profilePic = imageUri || formData.profilePic || '';

      // Update Firestore with the new data
      const userDocRef = doc(db, 'users', formData.email); // Using email as document ID
      await setDoc(userDocRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        profilePic: profilePic, // Save valid profilePic data
      });

      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : '';
      setImageUri(uri);
      setFormData({ ...formData, profilePic: uri });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c24e13" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#121212', '#1c1f2b']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.profilePicContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <MaterialIcons name="account-circle" size={60} color="#fff" />
            </View>
          )}
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#ccc"
          value={formData.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#ccc"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#c24e13',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#fff',
  },
});

export default EditProfileScreen;
