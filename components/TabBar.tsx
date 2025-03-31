import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#121212"; // Dark background color for the tab bar
const SECONDARY_COLOR = "#ffffff"; // Light color for unfocused tabs
const FOCUSED_COLOR = "#007acc"; // Color for the focused tab (bright accent)

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? FOCUSED_COLOR : "transparent" },
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? SECONDARY_COLOR : FOCUSED_COLOR
            )}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[styles.text, { color: SECONDARY_COLOR }]}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) { // Debugging log to check the route name
    switch (routeName) { // Ensure case-insensitivity
      case "home":
        return <Feather name="home" size={24} color={color} />;
      case "search":
            return <FontAwesome5 name="search" size={24} color={color} />;
      case "planai": // Handle route name as `planAi` or any case variation
        return <FontAwesome6 name="map-location-dot" size={24} color={color} />;
      case "track":
        return <MaterialCommunityIcons name="radar" size={24} color={color} />;
      case "profile":
        return <FontAwesome6 name="circle-user" size={24} color={color} />;
      
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR, // Tab bar background color
    width: "95%",
    alignSelf: "center",
    bottom: 10,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "rgba(255, 255, 255, 0.3)", // Light shadow color for a soft glow effect
    shadowOffset: { width: 0, height: 4 }, // Downward soft shadow
    shadowOpacity: 0.4, // Soft and light opacity
    shadowRadius: 8, // Larger radius for smoother edges
    elevation: 6, // Slight elevation for Android
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 30,
    marginHorizontal: 5, // Added spacing between buttons
  },
  text: {
    marginLeft: 8,
    fontWeight: "500",
    color: SECONDARY_COLOR, // Default color for unfocused tabs
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  userIcon: {
    position: "absolute",
    top: 2, // Adjust this value as needed
    left: 2, // Adjust this value as needed
  },
});

export default CustomNavBar;
