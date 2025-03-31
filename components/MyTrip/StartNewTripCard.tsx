import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function StartNewTripCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>No Trips Planned Yet</Text>
        <Text style={styles.msg}>
          Looks like it's time to plan a new travel experience! Get started below.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/create-trip/Search-Place")}
        >
          <Text style={styles.buttonText}>Start a New Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    width: "100%", // Full width for the card
    maxWidth: 400, // Limit the width for better mobile experience
    borderRadius: 20,
    marginTop:120,
    padding: 30,
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  msg: {
    fontSize: 18,
    color: "#d0d0d0", // Slightly lighter text for readability
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#c24e13", // Subtle orange color for the button
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
