// src/contexts/DataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [boatData, setBoatData] = useState({ path: [] }); // State for boat data including path
  const [routeData, setRouteData] = useState(null); // State for route data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchPaused, setFetchPaused] = useState(false); // State to pause route fetching

  useEffect(() => {
    const fetchBoatData = async () => {
      if (fetchPaused) {
        console.log('Fetch Boat Data paused');
        return; // Skip fetching route data if paused
      }

      try {
        const response = await fetch('http://localhost:5000/all');
        const result = await response.json();

        // Update boatData with the latest data and path
        setBoatData((prevBoatData) => {
          const newPath = prevBoatData.path || [];
          if (result.data && result.data.gps) {
            const newPosition = [
              result.data.gps.location.latitude,
              result.data.gps.location.longitude,
            ];
            newPath.push(newPosition);
          }
          return { ...result, path: newPath };
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const boatDataInterval = setInterval(fetchBoatData, 500); // Fetch boat data every 1 second
    return () => {
      clearInterval(boatDataInterval);
    };
  }, [fetchPaused]);

  useEffect(() => {
    const fetchRouteData = async () => {
      if (fetchPaused) {
        console.log('Fetch Route Data paused');
        return; // Skip fetching route data if paused
      }

      try {
        const response = await fetch('http://localhost:5000/route');
        const routeResult = await response.json();
        setRouteData(routeResult); // Set the full route data object
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const routeDataInterval = setInterval(fetchRouteData, 5000); // Fetch route data every 10 seconds

    return () => {
      clearInterval(routeDataInterval);
    };
  }, [fetchPaused]);

  // Function to update route data
  const updateRouteData = (newRouteData) => {
    setRouteData(newRouteData);
  };

  // Functions to control the routeFetchPaused state
  const setRouteFetchPaused = (paused) => setFetchPaused(paused);

  return (
    <DataContext.Provider value={{
      boatData,
      routeData,
      loading,
      error,
      updateRouteData,
      setRouteFetchPaused,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
