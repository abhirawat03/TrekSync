import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import CategoryItem from './CategoryItem';

export default function CategoryList({ setSelectedCategory }) {
  const categoryList = [
    {
      id: 1,
      name: 'Tourism spot',
      value: ['museum', 'historical_site'], // Array of values
      icon: require('../../assets/images/attraction.png'),
    },
    {
      id: 2,
      name: 'Restaurants',
      value: 'restaurant',
      icon: require('../../assets/images/restaurant.png'),
    },
    {
      id: 3,
      name: 'Hotel',
      value: 'lodging',
      icon: require('../../assets/images/hotel.png'),
    },
  ];

  return (
    <View style={{ margin: 20 }}>
      <Text
        style={{
          fontSize: 20,
          color: '#fff',
        }}
      >
        Select Top Category
      </Text>

      <FlatList
        data={categoryList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item.value)}>
            <CategoryItem category={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
