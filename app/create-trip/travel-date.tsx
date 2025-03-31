import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from 'expo-router';
import { Calendar } from "react-native-calendars";
import { CreateTripContext } from "../../context/CreateTripContext"; // Adjust path as needed

export default function App() {
  const navigation = useNavigation();
  const router = useRouter();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { tripData, setTripData } = useContext(CreateTripContext);

  // Format date to "DD/MM/YYYY"
  
  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      // Set the start date
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (new Date(day.dateString) < new Date(startDate || "")) { // Provide fallback value for startDate
        Alert.alert("Invalid Selection", "The end date cannot be before the start date.");
        return;
      }

      // Set the end date and update context
      setEndDate(day.dateString);
      const totalNights = calculateTotalNights(day.dateString);
      setTripData({
        ...tripData,
        startDate: startDate,  // Store formatted start date
        endDate: day.dateString,  // Store formatted end date
        totalNights,  // Store the total nights in the context
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: "#c24e13",
    });
  }, [navigation]);

  const getRangeDates = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const range: { [key: string]: any } = {};

    if (startDate > endDate) {
      return range;
    }

    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (dateString === start) {
        range[dateString] = { selected: true, startingDay: true, color: "#c24e13", textColor: "white" };
      } else if (dateString === end) {
        range[dateString] = { selected: true, endingDay: true, color: "#c24e13", textColor: "white" };
      } else {
        range[dateString] = { selected: true, color: "#c24e13", textColor: "white" };
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return range;
  };

  const calculateTotalNights = (end: string | null) => {
    if (!startDate || !end) return 0;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(end);
    const differenceInTime = endDateObj.getTime() - startDateObj.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Calculate days difference
  };

  const totalNights = calculateTotalNights(endDate);

  return (
    <LinearGradient colors={["#000000", "#121212", "#1c1f2b"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select a Date Range</Text>
        <Text style={styles.subHeaderText}>Tap to select a start date and an end date.</Text>
      </View>

      <View style={styles.container}>
        <Calendar
          current={startDate || new Date().toISOString().split("T")[0]}
          markedDates={
            startDate && endDate
              ? getRangeDates(startDate, endDate)
              : startDate
              ? { [startDate]: { selected: true, startingDay: true, endingDay: true, color: "#c24e13", textColor: "white" } }
              : {}
          }
          onDayPress={onDayPress}
          monthFormat={"MMM yyyy"}
          firstDay={1}
          hideExtraDays={true}
          markingType={"period"}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#fff",
            dayTextColor: "#fff",
            monthTextColor: "#fff",
            todayTextColor: "#56f084",
            arrowColor: "white",
          }}
        />

        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            Start Date: {startDate ? startDate : "None"}
          </Text>
          <Text style={styles.selectedDateText}>
            End Date: {endDate ? endDate : "None"}
          </Text>
          <Text style={styles.selectedDateText}>
            Total Nights: {totalNights > 0 ? totalNights : "0"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, !(startDate && endDate) && styles.disabledButton]}
          onPress={() => {
            router.push('/create-trip/budget')
          }}
          disabled={!(startDate && endDate)}
        >
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#c24e13",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
  },
  selectedDateContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  selectedDateText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  confirmButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#c24e13",
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#808080",
  },
});
