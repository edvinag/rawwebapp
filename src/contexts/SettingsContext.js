import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SettingsContext = createContext();

// Custom hook to access the context
export const useApi = () => useContext(SettingsContext);

// Function to get serviceUrl from URL query parameters
const getServiceUrlFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('serviceUrl'); // Returns serviceUrl if exists, otherwise null
};

// Function to remove serviceUrl from the URL without reloading the page
const cleanQueryParam = () => {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete('serviceUrl'); // Remove serviceUrl param
  window.history.replaceState({}, document.title, newUrl.toString()); // Update URL without reload
};

// Provider component
export const ApiProvider = ({ children }) => {
  // Retrieve serviceUrl from query params if available, else use localStorage or default
  const queryServiceUrl = getServiceUrlFromQuery();
  const storedServiceUrl = localStorage.getItem('serviceUrl') || 'http://localhost:5000';
  const initialServiceUrl = queryServiceUrl || storedServiceUrl;

  const [serviceUrl, setServiceUrl] = useState(initialServiceUrl);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');

  // Save new service URL to state and localStorage
  const saveServiceUrl = (url) => {
    console.log('Saving Service URL:', url);
    setServiceUrl(url);
    localStorage.setItem('serviceUrl', url);
  };

  // Automatically update localStorage if serviceUrl is provided via query params
  useEffect(() => {
    if (queryServiceUrl) {
      saveServiceUrl(queryServiceUrl);
      cleanQueryParam(); // Remove query param from URL
    }
  }, [queryServiceUrl]);

  return (
    <SettingsContext.Provider value={{ apiKey, saveApiKey: setApiKey, serviceUrl, saveServiceUrl }}>
      {children}
    </SettingsContext.Provider>
  );
};
