import React, { createContext, useContext, useState } from 'react';

// Create the context
const SettingsContext = createContext();

// Custom hook to access the context
export const useApi = () => useContext(SettingsContext);

// Provider component
export const ApiProvider = ({ children }) => {
  // Retrieve stored API key and service URL from localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [serviceUrl, setServiceUrl] = useState(() => localStorage.getItem('serviceUrl') || 'http://localhost:5000');

  // Function to update and save the API key to localStorage
  const saveApiKey = (key) => {
    console.log('Saving API Key:', key);
    setApiKey(key);
    localStorage.setItem('apiKey', key);
  };

  // Function to update and save the service URL to localStorage
  const saveServiceUrl = (url) => {
    console.log('Saving Service URL:', url);
    setServiceUrl(url);
    localStorage.setItem('serviceUrl', url);
  };

  return (
    <SettingsContext.Provider value={{ apiKey, saveApiKey, serviceUrl, saveServiceUrl }}>
      {children}
    </SettingsContext.Provider>
  );
};
