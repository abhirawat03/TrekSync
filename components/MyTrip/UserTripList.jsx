import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import UserTripCard from './UserTripCard';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const UserTripList = ({ userTrips }) => { 
  const router = useRouter();

  // Sort trips by start date, from most recent to oldest
  const sortedTrips = userTrips.sort((a, b) => {
    const startDateA = moment(JSON.parse(a.tripData).startDate);
    const startDateB = moment(JSON.parse(b.tripData).startDate);
    return startDateB - startDateA; // Compare in descending order
  });

  const latestTrip = JSON.parse(sortedTrips[0].tripData);
  const apiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
  const photoRef = latestTrip?.locationInfo?.photoRef;

  const imageUrl =
    photoRef && apiKey
      ? `https://maps.googleapis.com/maps/api/place/photo?maxheight=400&photoreference=${photoRef}&key=${apiKey}`
      : null;

  // Check if there is only 1 traveler or more
  const travelerText = latestTrip?.travelers === 1 ? 'Solo' : `${latestTrip?.traveler}`;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../../assets/images/Designer.jpeg')}
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.destination}>
            {latestTrip?.locationInfo?.name || 'Unknown Destination'}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.date}>{moment(latestTrip.startDate).format('DD MMM YYYY')}</Text>
            <Text style={styles.traveler}>🚌 {travelerText}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: '/trip-details',
                params: { trip: JSON.stringify(sortedTrips[0]) },
              })
            }
          >
            <Text style={styles.buttonText}>See Your Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
      {sortedTrips.map((trip, index) => (
        <UserTripCard trip={trip} key={index} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  destination: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  date: {
    fontSize: 16,
    color: '#aaa',
    flexShrink: 1,
    marginRight: 10,
  },
  traveler: {
    fontSize: 16,
    color: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '80%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  button: {
    backgroundColor: '#c24e13',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserTripList;
