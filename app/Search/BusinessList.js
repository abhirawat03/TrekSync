import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, FlatList, TouchableOpacity, View, Text } from "react-native";
import Colors from "../../components/Colors";
import BusinessItem from "./BusinessItem";
import { useNavigation } from "@react-navigation/native";

export default function BusinessList({ placeList = [] }) {
  const navigation = useNavigation();

  const onPlaceClick = (item) => {
    if (item && item.place_id) { // Validate `place_id`
      navigation.navigate("place-detail", { place: item });
    } else {
      console.error("Invalid place data:", item);
      alert("Unable to navigate. Invalid place data.");
    }
  };

  return (
    <View>
      <LinearGradient
        colors={["transparent", Colors.DARK_GRAY]}
        style={{ padding: 20, width: Dimensions.get("screen").width }}
      >
        {placeList.length > 0 ? (
          <FlatList
            data={placeList.slice(0, 8)} // Limit to first 8 items
            horizontal={true}
            keyExtractor={(item, index) => item?.place_id || `key-${index}`} // Ensure unique keys
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onPlaceClick(item)}
                accessible
                accessibilityLabel={`Navigate to details of ${item?.name || "this place"}`}
              >
                <BusinessItem place={item} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: Colors.GREY }}>
            No places available to display.
          </Text>
        )}
      </LinearGradient>
    </View>
  );
}
