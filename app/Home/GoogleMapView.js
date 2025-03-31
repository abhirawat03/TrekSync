import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { UserLocationContext } from '../../context/UserLocationContext';
import PlaceMarker from './PlaceMarker';
import Colors from '../../components/Colors';

export default function GoogleMapView({ placeList, routeDetails }) {
  const [mapRegion, setMapRegion] = useState(null);
  const { location } = useContext(UserLocationContext);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  const renderRoute = () => {
    if (Array.isArray(routeDetails) && routeDetails.length > 0) {
      const coordinates = routeDetails.map(step => ({
        latitude: step.end_location.lat,
        longitude: step.end_location.lng,
      }));
      return (
        <Polyline
          coordinates={coordinates}
          strokeColor="#FF0000"
          strokeWidth={4}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      
      <View>
        {mapRegion ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          >
            <Marker title="You" coordinate={mapRegion} />
            {placeList.map((item, index) => (
              <PlaceMarker item={item} key={index} />
            ))}
            {renderRoute()}
          </MapView>
        ) : (
          <Text style={{ color: Colors.grey, textAlign: 'center' }}>
            Loading map...
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden', // This will apply the border radius effect to the child components like the map
    backgroundColor: Colors.BLACK, // Optional: to ensure the background color looks smooth
  },
  title: {
    fontSize: 20,
    margin: 10,
    marginBottom: 20,
    fontWeight: '600',
    color: '#fff',
  },
  map: {
    width: Dimensions.get('screen').width * 0.92,
    height: Dimensions.get('screen').height * 0.30,
    borderRadius: 20, // Apply the border radius to the map itself
  },
});
