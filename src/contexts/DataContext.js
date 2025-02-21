import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './SettingsContext'; // Import service URL context

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { serviceUrl } = useApi(); // Get the service URL from context
  const [boatData, setBoatData] = useState({ path: [] });
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchPaused, setFetchPaused] = useState(false);
  const [follow, setFollow] = useState(true); // Add follow state
  const [isFetchingBoatData, setIsFetchingBoatData] = useState(false); // Track boat data fetch status
  const [isFetchingRouteData, setIsFetchingRouteData] = useState(false); // Track route data fetch status

  useEffect(() => {
    const fetchBoatData = async () => {
      if (fetchPaused || !serviceUrl || isFetchingBoatData) return;
      setIsFetchingBoatData(true);
      try {
        const response = await fetch(`${serviceUrl}/all`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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
        setIsFetchingBoatData(false);
      }
    };

    const boatDataInterval = setInterval(fetchBoatData, 500);
    return () => clearInterval(boatDataInterval);
  }, [fetchPaused, serviceUrl, isFetchingBoatData]);

  useEffect(() => {
    const fetchRouteData = async () => {
      if (fetchPaused || !serviceUrl || isFetchingRouteData) return;
      setIsFetchingRouteData(true);
      try {
        const response = await fetch(`${serviceUrl}/route`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const routeResult = await response.json();
        setRouteData(routeResult);
      } catch (error) {
        console.error("Error fetching route data:", error);
      } finally {
        setIsFetchingRouteData(false);
      }
    };

    const routeDataInterval = setInterval(fetchRouteData, 5000);
    return () => clearInterval(routeDataInterval);
  }, [fetchPaused, serviceUrl, isFetchingRouteData]);

  const updateRouteData = (newRouteData) => setRouteData(newRouteData);
  const setRouteFetchPaused = (paused) => setFetchPaused(paused);

  // Push Route Data Function
  const pushRouteData = async (data, keepIndex, goalIndex = null) => {
    if (!serviceUrl) {
      console.error("Service URL is not set.");
      return;
    }

    let url = `${serviceUrl}/route?keepIndex=${keepIndex}`;
    if (goalIndex !== null) url += `&goalIndex=${goalIndex}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log("Route data successfully pushed to server");
        updateRouteData(data); // Update context route data
      } else {
        console.error("Failed to push data to server:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error pushing data to server:", error);
    }
  };

  return (
    <DataContext.Provider value={{
      boatData,
      routeData,
      loading,
      error,
      follow, // Expose follow state
      setFollow, // Expose setFollow function
      updateRouteData,
      setRouteFetchPaused,
      pushRouteData, // Expose pushRouteData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);