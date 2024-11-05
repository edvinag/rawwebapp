// src/contexts/DataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [boatData, setBoatData] = useState({ path: [] });
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchPaused, setFetchPaused] = useState(false);

  useEffect(() => {
    const fetchBoatData = async () => {
      if (fetchPaused) return;
      try {
        const response = await fetch('http://localhost:5000/all');
        const result = await response.json();
        setBoatData((prevBoatData) => {
          const newPath = prevBoatData.path || [];
          if (result.data?.gps) {
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

    const boatDataInterval = setInterval(fetchBoatData, 500);
    return () => clearInterval(boatDataInterval);
  }, [fetchPaused]);

  useEffect(() => {
    const fetchRouteData = async () => {
      if (fetchPaused) return;
      try {
        const response = await fetch('http://localhost:5000/route');
        const routeResult = await response.json();
        setRouteData(routeResult);
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const routeDataInterval = setInterval(fetchRouteData, 5000);
    return () => clearInterval(routeDataInterval);
  }, [fetchPaused]);

  const updateRouteData = (newRouteData) => setRouteData(newRouteData);
  const setRouteFetchPaused = (paused) => setFetchPaused(paused);

  // New pushRouteData function
  const pushRouteData = async (data, keepIndex, goalIndex = null) => {
    let url = `http://localhost:5000/route?keepIndex=${keepIndex}`;
    if (goalIndex !== null) url += `&goalIndex=${goalIndex}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log("Route data successfully pushed to local server");
        updateRouteData(data); // Update context route data
      } else {
        console.error("Failed to push data to local server:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error pushing data to local server:", error);
    }
  };

  return (
    <DataContext.Provider value={{
      boatData,
      routeData,
      loading,
      error,
      updateRouteData,
      setRouteFetchPaused,
      pushRouteData, // Expose pushRouteData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
