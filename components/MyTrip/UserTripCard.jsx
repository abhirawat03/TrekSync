import { StyleSheet, Text, View, Image } from 'react-native';
import moment from 'moment';
import Constants from 'expo-constants';

const UserTripCard = ({ trip }) => {
  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing data:', error);
      return null;
    }
  };

  const apiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
  const tripData = formatData(trip?.tripData);
  const photoRef = tripData?.locationInfo?.photoRef;

  const imageUrl = photoRef && apiKey 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxheight=400&photoreference=${photoRef}&key=${apiKey}` 
    : null;

  // Condition to display 'solo' if only one traveler, otherwise show number of travelers
  const travelerText = tripData?.travelers === 1 ? 'Solo' : tripData?.traveler;

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.flexContainer}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
          />
        ) : (
          <Image 
            source={require('../../assets/images/Designer.jpeg')} 
            style={styles.image} 
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.paragraph} numberOfLines={2}> {/* Allow text to wrap on overflow */}
            {tripData?.locationInfo?.name || 'Unknown Destination'}
          </Text>
          <Text style={styles.smallPara}> 
            {moment(tripData?.startDate).format("DD MMM YYYY")}
          </Text>
          <Text style={styles.smallPara}> 
            Travelling: {travelerText}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserTripCard;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1, // Ensure the View takes full screen if needed
   // Optional: Add padding if needed
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',  // Align items at the top to prevent text overflow
    flexWrap: 'wrap', // Allow text to wrap within the container
    paddingBottom:10
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,  // Allow the text container to take up remaining space
  },
  paragraph: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flexShrink: 1,  // Prevent text from overflowing horizontally
  },
  smallPara: {
    fontFamily: 'Outfit',
    fontSize: 14,
    color: '#7d7d7d',
    marginBottom: 3,  // Add space between text lines
    flexShrink: 1,  // Prevent text from overflowing horizontally
  },
});
