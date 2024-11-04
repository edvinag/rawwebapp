// ApiContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ApiContext = createContext();

// Custom hook to access the context
export const useApi = () => useContext(ApiContext);

// Provider component
export const ApiProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');

  // Load the API key from localStorage if it exists
  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Function to update and save the API key to localStorage
  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('apiKey', key);
  };

  return (
    <ApiContext.Provider value={{ apiKey, saveApiKey }}>
      {children}
    </ApiContext.Provider>
  );
};
