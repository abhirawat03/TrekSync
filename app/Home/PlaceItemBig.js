import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../components/Colors";
import { AntDesign } from "@expo/vector-icons";
import HorizontalLine from "./HorizontalLine";
import Constants from "expo-constants";
export default function PlaceItemBig({ place }) {
  const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {/* Image View */}
        <View>
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

        {/* Text View */}
        <View style={styles.textContainer}>
          {/* Name of the place */}
          <Text numberOfLines={3} style={styles.nameText}>
            {place.name}
          </Text>

          {/* Vicinity of the place */}
          <Text style={styles.vicinityText} numberOfLines={6}>
            {place.vicinity}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={20} color={Colors.YELLOW} />
            <Text style={styles.ratingText}>{place.rating}</Text>
          </View>
        </View>
      </View>

      <HorizontalLine />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin:5,
  },
  rowContainer: {
    flexDirection: "row", // Place image and text side by side
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 15,
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Ensure the text view takes up remaining space
    justifyContent: "space-between", // Space text elements evenly
  },
  nameText: {
    fontSize: 18,
    marginBottom: 5,
    color: "#fff",
    fontWeight: "bold",
  },
  vicinityText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#fff",
  },
  ratingContainer: {
    flexDirection: "row", // Star and rating number side by side
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    color: "#fff",
    fontSize: 16,
  },
});
