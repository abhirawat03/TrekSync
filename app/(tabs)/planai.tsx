import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { collection, DocumentData, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './../../config/FirebaseConfig';
import StartNewTripCard from '../../components/MyTrip/StartNewTripCard';
import UserTripList from '../../components/MyTrip/UserTripList';

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'StartNewTripCard' | 'UserTripList' | null>(null); // State for active component
  const user = auth.currentUser;
  const userEmail = user?.email;

  useEffect(() => {
    if (user) {
      getMyTrip();
    }
  }, [user]);

  const getMyTrip = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(collection(db, 'UserTrip'), where('userEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const trips: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    setUserTrips(trips);

    // Set default view based on trips
    setActiveView(trips.length > 0 ? 'UserTripList' : 'StartNewTripCard');
    setLoading(false);
  };

  return (
    <LinearGradient colors={['#000000', '#121212', '#1c1f2b']} style={styles.container}>
      <ScrollView style={styles.mainView}>
        <View style={styles.flexRowView}>
          <Text style={styles.title}>My Trip</Text>
          <View style={styles.iconRow}>
            {/* Icon for showing StartNewTripCard */}
            <TouchableOpacity onPress={() => setActiveView('StartNewTripCard')}>
              <Ionicons name="add-circle-outline" size={48} color="white" />
            </TouchableOpacity>
            {/* Icon for showing UserTripList */}
            <TouchableOpacity onPress={() => setActiveView('UserTripList')}>
              <Ionicons name="list-circle-outline" size={48} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {loading && <ActivityIndicator size="large" color={'#fff'} />}
        {/* Conditional rendering */}
        {activeView === 'StartNewTripCard' && <StartNewTripCard />}
        {activeView === 'UserTripList' && userTrips.length > 0 && <UserTripList userTrips={userTrips} />}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    paddingTop: 40,
    paddingHorizontal: 15,
    width: '100%',
  },
  title: {
    fontSize: 38,
    color: 'white',
    fontWeight: 'bold',
  },
  flexRowView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
