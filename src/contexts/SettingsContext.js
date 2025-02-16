import React, { createContext, useContext, useState } from 'react';

// Create the context
const SettingsContext = createContext();

// Custom hook to access the context
export const useApi = () => useContext(SettingsContext);

// Provider component
export const ApiProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => {
    // Get the API key from localStorage at the time of state initialization
    return localStorage.getItem('apiKey') || '';
  });

  // Function to update and save the API key to localStorage
  const saveApiKey = (key) => {
    console.log('Saving API Key:', key); // Debugging
    setApiKey(key);
    localStorage.setItem('apiKey', key);
  };

  return (
    <SettingsContext.Provider value={{ apiKey, saveApiKey }}>
      {children}
    </SettingsContext.Provider>
  );
};
