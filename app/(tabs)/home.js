import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../Home/Header';
import GoogleMapView from '../Home/GoogleMapView';
import CategoryList from '../Home/CategoryList';
import GlobalApi from '../../Services/GlobalApi';
import PlaceList from '../Home/PlaceList';
import { UserLocationContext } from '../../context/UserLocationContext';

const Home = () => {
  const [placeList, setPlaceList] = useState([]);
  const [destination, setDestination] = useState(null);  // New state to store selected destination
  const [routeDetails, setRouteDetails] = useState(null); // Store route details here
  const { location, setLocation } = useContext(UserLocationContext);

  useEffect(() => {
    if (location && location.coords) {
      GetNearBySearchPlace('restaurant');
    }
  }, [location]);

  const GetNearBySearchPlace = (value) => {
    if (location && location.coords) {
      GlobalApi.nearByPlace(location.coords.latitude, location.coords.longitude, value)
        .then((resp) => {
          setPlaceList(resp.data.results);
        });
    }
  };

  // Function to fetch route from current location to destination
  const fetchRoute = async (destination) => {
    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const dest = `${destination.geometry.location.lat},${destination.geometry.location.lng}`;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      setRouteDetails(data.routes[0].legs[0].steps);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const handleSuggestionClick = (description, destination) => {
    setDestination(destination);  // Store the selected destination
    setPlaceList([]);  // Clear the place list
    fetchRoute(destination);  // Fetch the route to the selected destination
  };

  return (
    <LinearGradient
      colors={['#000000', '#121212', '#1c1f2b']}
      style={styles.container}
    >
      <FlatList
        data={placeList}
        ListHeaderComponent={
          <>
            <Header onSuggestionClick={handleSuggestionClick} />
            <GoogleMapView
              placeList={placeList}
              routeDetails={routeDetails}  // Pass the route details to GoogleMapView
            />
            <CategoryList setSelectedCategory={(value) => GetNearBySearchPlace(value)} />
          </>
        }
        renderItem={({ item }) => (
          <PlaceList placeList={[item]} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<ActivityIndicator size="large" />}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 70,
  },
});

export default Home;
