import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import Colors from "../../components/Colors";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

export default function SearchBar({ setSearchText }) {
  const [isFocused, setIsFocused] = useState(false); // Track focus for showing autocomplete list
  const [inputText, setInputText] = useState(""); // Track input text
  const googlePlacesRef = useRef(null); // Create a ref for GooglePlacesAutocomplete
  const screenWidth = Dimensions.get("screen").width;

  const handleClear = () => {
    googlePlacesRef.current?.clear(); // Clear the input field
    setInputText(""); // Clear the input text
    setIsFocused(false); // Hide the autocomplete list when text is cleared
    setSearchText("");
  };

  const handleFocus = () => {
    setIsFocused(true); // Trigger when input is focused to show the list
  };

  const handleBlur = () => {
    setIsFocused(false); // Trigger when input is blurred to hide the list
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#D8E3D9', "transparent"]}
        style={styles.searchContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Discover</Text>
        </View>

        {/* Search bar container */}
        <View style={styles.searchBarContainer}>
          <GooglePlacesAutocomplete
            ref={googlePlacesRef} // Attach the ref
            placeholder="Search"
            onPress={(data, details = null) => {
              setSearchText(data.description); // Handle the selected place
              setInputText(data.description); // Set input text to the selected place
              setIsFocused(false); // Hide the autocomplete list after selection
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
              components: "country:IN",
            }}
            fetchDetails={false} // Disable fetching details to avoid history
            styles={styles.textInputStyle}
            onFocus={handleFocus} // Trigger when input is focused
            onBlur={handleBlur} // Trigger when input is blurred
            onChangeText={(text) => setInputText(text)} // Update input text
            renderLeftButton={() => (
              <Ionicons
                name="search"
                size={24}
                color={Colors.DARK_GRAY}
                style={styles.searchIcon}
              />
            )}
          />

          {/* Close icon wrapped inside the input container */}
          <TouchableOpacity
            onPress={handleClear} // Clear input and reset search text
            style={styles.clearIconContainer}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Autocomplete list container */}
      {isFocused && inputText.length >= 2 && (
        <View style={styles.autocompleteListContainer}>
          <GooglePlacesAutocomplete
            ref={googlePlacesRef} // Attach the ref
            placeholder="Search"
            onPress={(data, details = null) => {
              setSearchText(data.description); // Handle the selected place
              setInputText(data.description); // Set input text to the selected place
              setIsFocused(false); // Hide the autocomplete list after selection
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
              components: "country:IN",
            }}
            fetchDetails={false} // Disable fetching details to avoid history
            styles={styles.autocompleteListStyle}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 20,
    width: Dimensions.get("screen").width,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontFamily: "raleway-bold",
    fontSize: 35,
  },
  searchBarContainer: {
    marginTop: 5,
    padding: 10,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
    elevation: 0.7,
    flexDirection: "row",
    alignItems: "center",
  },
  textInputStyle: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    padding: 10,
    color: Colors.DARK_GRAY,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
    alignSelf: "center",
  },
  clearIconContainer: {
    position: "absolute",  // Position the close icon inside the input container
    right: 10,  // Right alignment inside the input field
    top: 20,  // Align vertically with the input text
  },
  autocompleteListContainer: {
    width: Dimensions.get("screen").width - 40,
    marginHorizontal: 20,
    marginTop: 10,
  },
  autocompleteListStyle: {
    container: {
      width: Dimensions.get("screen").width - 40,
      alignSelf: "center",
    },
    listView: {
      backgroundColor: Colors.WHITE,
      borderRadius: 5,
      elevation: 3,
      shadowColor: Colors.BLACK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    row: {
      padding: 15,
      height: 50,
      flexDirection: "row",
      alignItems: "center",
    },
    separator: {
      height: 0.5,
      backgroundColor: Colors.LIGHT_GRAY,
    },
  },
});
