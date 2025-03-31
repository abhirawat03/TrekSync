import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
export const CreateTripContext = createContext();

// Create provider component
export const CreateTripContextProvider = ({ children }) => {
  // Initial state for the trip data
  const [tripData, setTripData] = useState({
    travelers: 1,   // Default number of travelers
    budget: 0,      // Default budget
    traveler: null, // Default travel companion (none selected yet)
  });

  // Method to update the number of travelers
  const updateTravelers = (newTravelers) => {
    if (newTravelers !== tripData.travelers) {
      setTripData((prevState) => ({
        ...prevState,
        travelers: newTravelers,
      }));
      console.log("Updated travelers:", newTravelers);
    }
  };

  // Method to update the budget
  const updateBudget = (newBudget) => {
    if (newBudget !== tripData.budget) {
      setTripData((prevState) => ({
        ...prevState,
        budget: newBudget,
      }));
      console.log("Updated budget:", newBudget);
    }
  };

  // Method to update the travel companion
  const updateTraveler = (newTraveler) => {
    if (newTraveler !== tripData.traveler) {
      setTripData((prevState) => ({
        ...prevState,
        traveler: newTraveler,
      }));
      console.log("Updated travel companion:", newTraveler);
    }
  };

  // Set default companion ("Solo") if none is selected when moving to the next screen
  const setDefaultCompanion = () => {
    if (!tripData.traveler) {
      setTripData((prevState) => ({
        ...prevState,
        traveler: "Solo",
      }));
      console.log("Default companion set to: Solo");
    }
  };

  // Log tripData changes for debugging purposes
  useEffect(() => {
    console.log("Current tripData in useEffect:", tripData);
  }, [tripData]); // This will trigger the log every time tripData changes

  return (
    <CreateTripContext.Provider
      value={{
        tripData,
        setTripData,
        updateTravelers,
        updateBudget,
        updateTraveler,
        setDefaultCompanion, // Expose the method to set default companion
      }}
    >
      {children}
    </CreateTripContext.Provider>
  );
};

// Custom hook for easier context access
export const useCreateTripContext = () => {
  const context = useContext(CreateTripContext);
  if (!context) {
    throw new Error("useCreateTripContext must be used within a CreateTripContextProvider");
  }
  return context;
};
