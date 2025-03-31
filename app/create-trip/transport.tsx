import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";
import { CreateTripContext } from '../../context/CreateTripContext';

export default function TransportationScreen() {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const navigation = useNavigation();
  const router = useRouter();

  // Access context
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#c24e13",
    });
  }, [navigation]);

  // Update the selected transportation option
  const updateTransportation = (transport: string) => {
    setSelectedTransport(transport);
    setTripData({ ...tripData, transportation: transport }); // Update context with selected transportation
  };

  useEffect(() => {
    console.log("Updated tripData:", tripData);
  }, [tripData]);

  return (
    <LinearGradient
      colors={["#000000", "#121212", "#1c1f2b"]}
      style={styles.container}
    >
      <View style={styles.head}>
        <Text style={styles.texthead}>Transportation</Text>
        <View style={styles.content}>
          <Text style={styles.text}>
            How would you like to travel? Choose one of the options below.
          </Text>

          {/* Transportation Options */}
          <View style={styles.optionsContainer}>
            {["My Personal Bike", "My Personal Car", "Public Transportation"].map((transport) => (
              <TouchableOpacity
              key={transport}
              style={[
                styles.optionButton,
                selectedTransport === transport && styles.selectedOption,
              ]}
              onPress={() => {
                updateTransportation(transport); // Update transportation selection
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedTransport === transport && styles.selectedOptionText,
                ]}
              >
                {transport}
              </Text>
              <Ionicons
                name={
                  transport === "Bike"
                    ? "bicycle"
                    : transport === "Car"
                    ? "car"
                    : "bus"
                }
                size={30}
                color={selectedTransport === transport ? "#fff" : "#bbb"}
                style={styles.icon}
              />
            </TouchableOpacity>
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.nextButton, !selectedTransport && styles.disabledButton]}
            disabled={!selectedTransport}
            onPress={() => router.push('/create-trip/review-trip')} // Navigate to the next screen
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  head: {
    padding: 25,
    paddingTop: 75,
  },
  texthead: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  content: {
    marginTop: 50,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: "#333",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between text and icon
  },
  selectedOption: {
    backgroundColor: "#1c75bc",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    flex: 1, // Make text occupy available space
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 20, // Add spacing between text and icon
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#c24e13",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#555",
    opacity: 0.6,
  },
});
