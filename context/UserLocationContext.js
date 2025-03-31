import React, { createContext, useState } from 'react';

// Create the context with an initial value of null for location
export const UserLocationContext = createContext(null);

export const UserLocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};
