import { View, Text, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import GoogleMapViewFull from '../Search/GoogleMapViewFull';
import SearchBar from '../Search/SearchBar';
import { UserLocationContext } from '../../context/UserLocationContext';
import GlobalApi from '../../Services/GlobalApi';
import BusinessList from '../Search/BusinessList';
import { useFocusEffect } from '@react-navigation/native';

export default function Search() {
  const [placeList, setPlaceList] = useState([]); // Store the places
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const { location } = useContext(UserLocationContext); // Get user location from context

  // Function to fetch places based on a search query
  const GetNearBySearchPlace = useCallback((query) => {
    if (!query || query.trim().length === 0) {
      setPlaceList([]); // Clear the list if no query
      return;
    }

    setLoading(true); // Set loading state to true when fetching data
    GlobalApi.searchByText(query).then((resp) => {
      setPlaceList(resp.data.results); // Update place list with API response
      setLoading(false); // Set loading state to false once data is fetched
    }).catch((error) => {
      console.error('Error fetching places:', error);
      setLoading(false); // Ensure loading state is reset on error
    });
  }, []);

  // Reset to default "restaurant" list on screen focus
  useFocusEffect(
    useCallback(() => {
      GetNearBySearchPlace('restaurant'); // Default to "restaurant" when screen is focused
    }, [GetNearBySearchPlace])
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View style={{ position: 'absolute', zIndex: 20, width: '100%' }}>
        <SearchBar
          setSearchText={(query) => {
            if (query.trim() === '') {
              GetNearBySearchPlace('restaurant'); // Fallback to default search
            } else {
              GetNearBySearchPlace(query); // Fetch places for entered query
            }
          }}
        />
      </View>

      {/* Google Map View */}
      <GoogleMapViewFull placeList={placeList} />

      {/* Business List */}
      <View style={{ position: 'absolute', zIndex: 20, bottom: 0, width: '100%' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator
        ) : (
          <BusinessList placeList={placeList} />
        )}
      </View>
    </View>
  );
}
