import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";
import { CreateTripContext } from '../../context/CreateTripContext';

export default function TravelCompanionScreen() {
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
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

  // Update the selected travel companion
  const updateCompanion = (companion: string) => {
    setSelectedCompanion(companion);
    setTripData({ ...tripData, traveler: companion }); // Update context with selected companion
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
        <Text style={styles.texthead}>Travel Companion</Text>
        <View style={styles.content}>
          <Text style={styles.text}>
            Who are you traveling with? Choose one of the options below.
          </Text>

          {/* Travel Companion Options */}
          <View style={styles.optionsContainer}>
            {["Friend", "Family", "Couple", "Cousin"].map((companion) => (
              <TouchableOpacity
                key={companion}
                style={[
                  styles.optionButton,
                  selectedCompanion === companion && styles.selectedOption,
                ]}
                onPress={() => {
                  updateCompanion(companion); // Update travel companion when selected
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCompanion === companion && styles.selectedOptionText,
                  ]}
                >
                  {companion}
                </Text>
                <Ionicons
                  name={
                    companion === "Friend"
                      ? "person"
                      : companion === "Family"
                      ? "people"
                      : companion === "Couple"
                      ? "heart"
                      : "person-add"
                  }
                  size={30}
                  color={selectedCompanion === companion ? "#fff" : "#bbb"}
                  style={styles.icon}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.nextButton, !selectedCompanion && styles.disabledButton]}
            disabled={!selectedCompanion}
            onPress={() => router.push('/create-trip/travel-date')} // Navigate to the next screen
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedOption: {
    backgroundColor: "#1c75bc",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    marginRight: 150,
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  icon: {
    flex: 1,
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
