import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import PlaceCard from './PlaceCard';

// Function to get Google Maps Static API Image URL based on coordinates


// Function to get the image source, either from Google Maps or fallback image


export default function PlannedTrip({ details }) {
    const [loading, setLoading] = useState(false);

    // Sort the days to ensure they are in order (day1, day2, day3...)
    const sortedDays = Object.keys(details).sort((a, b) => {
        const dayA = parseInt(a.replace('day', ''));
        const dayB = parseInt(b.replace('day', ''));
        return dayA - dayB;
    });

    // Show a loading indicator when the map image is being fetched
    useEffect(() => {
        setLoading(true);
        // Simulate image loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>🏕️ Planned Trip</Text>
            {sortedDays.map((dayKey, index) => {
                const dayDetails = details[dayKey]; // Get the details for each day
                const dayNumber = index + 1; // Start day numbering from 1

                return (
                    <View key={dayKey} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>
                            Day {dayNumber} {/* Render the day number dynamically */}
                        </Text>

                        {/* Check if activities exist and are an array */}
                        {Array.isArray(dayDetails?.plan) && dayDetails.plan.length > 0 ? (
                            dayDetails.plan.map((place, index) => (
                                <PlaceCard key={index} place={place} />
                            ))
                        ) : (
                            <Text style={styles.noActivities}>No activities available for Day {dayNumber}</Text>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingHorizontal: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF', // Changed to white for visibility
    },
    dayContainer: {
        marginBottom: 10,
    },
    dayTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 12,
        color: '#FFFFFF', // Changed to white for visibility
    },
    activityContainer: {
        marginBottom: 20,
        backgroundColor: '#2C3E50', // A rich dark navy blue for elegance
        borderRadius: 10, // Smooth edges for a modern look
        borderWidth: 1, // Thin border for a sleek outline
        borderColor: '#34495E', // Slightly lighter than background for subtle effect
        padding: 15, // Spacing for content
        shadowColor: '#000', // Shadow for a floating effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5, // Elevation for Android shadow
    },
    activityImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        resizeMode: 'cover',
        marginBottom: 15,
    },
    activityDetails: {
        flexDirection: 'row', // Arrange text and button horizontally
        justifyContent: 'space-between', // Add space between text and button
        alignItems: 'center', // Center items vertically
    },
    textContainer: {
        flex: 1, // Allow the text container to take up remaining space
        marginRight: 10, // Add some space between the text and button
    },
    buttonContainer: {
        justifyContent: 'center', // Center the button vertically
        alignItems: 'center',
    },
    placeName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF', // Changed to white for visibility
        marginBottom: 8,
    },
    placeDescription: {
        fontSize: 16,
        color: '#D0D3D4', // Light gray for readability
        marginBottom: 8,
    },
    placeTime: {
        fontSize: 16,
        color: '#1ABC9C', // Kept green but ensured it's vibrant
        marginBottom: 8,
    },
    ticketPricing: {
        fontSize: 16,
        color: '#F39C12', // Brightened orange for visibility
    },
    noActivities: {
        fontSize: 18,
        color: '#E74C3C', // Kept red for warnings but is bright
        fontStyle: 'italic',
    },
    navigateButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 7,
    },
});
