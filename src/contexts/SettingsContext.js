import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SettingsContext = createContext();

// Custom hook to access the context
export const useApi = () => useContext(SettingsContext);

// Function to get query parameters (serviceUrl or apiKey)
const getQueryParam = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key); // Returns the value of the key if exists, otherwise null
};

// Function to remove a query parameter from the URL without reloading the page
const cleanQueryParam = (key) => {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete(key); // Remove the specified param
  window.history.replaceState({}, document.title, newUrl.toString()); // Update URL without reload
};

// Provider component
export const ApiProvider = ({ children }) => {
  // Retrieve serviceUrl and apiKey from query params if available, else use localStorage or default
  const queryServiceUrl = getQueryParam('serviceUrl');
  const queryApiKey = getQueryParam('apiKey');

  const storedServiceUrl = localStorage.getItem('serviceUrl') || 'http://localhost:5000';
  const storedApiKey = localStorage.getItem('apiKey') || '';

  const initialServiceUrl = queryServiceUrl || storedServiceUrl;
  const initialApiKey = queryApiKey || storedApiKey;

  const [serviceUrl, setServiceUrl] = useState(initialServiceUrl);
  const [apiKey, setApiKey] = useState(initialApiKey);

  // Save new service URL to state and localStorage
  const saveServiceUrl = (url) => {
    console.log('Saving Service URL:', url);
    setServiceUrl(url);
    localStorage.setItem('serviceUrl', url);
  };

  // Save new API key to state and localStorage
  const saveApiKey = (key) => {
    console.log('Saving API Key:', key);
    setApiKey(key);
    localStorage.setItem('apiKey', key);
  };

  // Automatically update localStorage if serviceUrl or apiKey are provided via query params
  useEffect(() => {
    if (queryServiceUrl) {
      saveServiceUrl(queryServiceUrl);
      cleanQueryParam('serviceUrl'); // Remove from URL
    }
    if (queryApiKey) {
      saveApiKey(queryApiKey);
      cleanQueryParam('apiKey'); // Remove from URL
    }
  }, [queryServiceUrl, queryApiKey]);

  return (
    <SettingsContext.Provider value={{ apiKey, saveApiKey, serviceUrl, saveServiceUrl }}>
      {children}
    </SettingsContext.Provider>
  );
};
