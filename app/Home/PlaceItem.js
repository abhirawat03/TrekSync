import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../components/Colors";
import HorizontalLine from "./HorizontalLine";
import Constants from "expo-constants";
export default function PlaceItem({ place }) {
  const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {place?.photos ? (
          <Image
            source={{
              uri:
                "https://maps.googleapis.com/maps/api/place/photo" +
                "?maxwidth=400" +
                "&photo_reference=" +
                place?.photos[0]?.photo_reference +
                "&key="+GOOGLE_API_KEY,
            }}
            style={styles.image}
          />
        ) : (
          <Image
            source={require("../../assets/images/placeholder.jpg")}
            style={styles.image}
          />
        )}
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text numberOfLines={2} style={styles.nameText}>
          {place.name}
        </Text>
        <Text numberOfLines={3} style={styles.vicinityText}>
          {place.vicinity}
        </Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={20} color={Colors.YELLOW} />
          <Text style={styles.ratingText}>{place.rating}</Text>
        </View>
      </View>

      <HorizontalLine />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Aligns image and text horizontally
    alignItems: "center",
    gap: 15,
  },
  imageContainer: {
    flex: 0.3, // Allocates a portion of the row to the image
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 15,
  },
  textContainer: {
    flex: 0.7, // Allocates the rest of the row to the text
    justifyContent: "center",
  },
  nameText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  vicinityText: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.DARK_GRAY,
  },
  ratingContainer: {
    flexDirection: "row", // Aligns star and rating horizontally
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    fontSize: 16,
  },
});
