import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import PlaceItem from './PlaceItem';
import PlaceItemBig from './PlaceItemBig';
import { useNavigation } from '@react-navigation/native';

export default function PlaceList({ placeList = [] }) {
  const navigator = useNavigation();

  const onPlaceClick = (item) => {
    if (item && item.place_id) {  // Check if place_id exists
      navigator.navigate('place-detail', { place: item });
    } else {
      console.error('Invalid place data:', item);
      alert('Unable to navigate. Invalid place data.');
    }
  };

  // Debugging: Log the length of the place list to check data


  return (
    <View style={styles.container}>
      {/* Display the total count of places found above the list */}
      

      {/* List of places */}
      <FlatList
        data={placeList}
        keyExtractor={(item) => item.place_id || `key-${Math.random()}`}  // Use place_id or fallback to a random key
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPlaceClick(item)}
            accessible
            accessibilityLabel={`Navigate to details of ${item.name}`}
          >
            {index % 4 === 0 ? (
              <PlaceItemBig place={item} />
            ) : (
              <PlaceItem place={item} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#333',
    marginLeft: 18,
    marginBottom: 10,  // Space between total count and the list
  },
});
