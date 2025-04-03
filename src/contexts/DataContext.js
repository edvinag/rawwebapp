import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useApi } from './SettingsContext'; // Import service URL context

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { serviceUrl } = useApi(); // Get the service URL from context

  // Boat and Route Data
  const [boatData, setBoatData] = useState({ path: [] });
  const [routeData, setRouteData] = useState(null);

  // State Flags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [follow, setFollow] = useState(true); // Follow boat checkbox

  // Fetching status flags
  const [isFetchingBoatData, setIsFetchingBoatData] = useState(false);
  const [isFetchingRouteData, setIsFetchingRouteData] = useState(false);

  // Compass Data
  const [compassHeading, setCompassHeading] = useState(null);
  const [compassEnabled, setCompassEnabled] = useState(false);
  const compassListenerActive = useRef(false); // Internal flag for listener status

  // Hold the line
  const [holdLineEnabled, setHoldLineEnabled] = useState(false);

  // Fetch Pause Handling (Replaced useState with useRef)
  const fetchPausedRef = useRef(false);

  const setRouteFetchPaused = (paused) => {
    fetchPausedRef.current = paused; // Toggle fetching without causing re-renders
  };

  // ✅ Boat Data Fetch
  useEffect(() => {
    const fetchBoatData = async () => {
      if (fetchPausedRef.current || !serviceUrl || isFetchingBoatData) return;

      setIsFetchingBoatData(true);
      try {
        let response = null;
        if (compassEnabled) {
          response = await fetch(`${serviceUrl}/all?controllerType=compass&refCourse=` + compassHeading);
        } else if (holdLineEnabled) {
          response = await fetch(`${serviceUrl}/all?controllerType=holdline`);
        } else {
          response = await fetch(`${serviceUrl}/all?controllerType=route`);
        }

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
        setIsFetchingBoatData(false);
        setLoading(false);
      }
    };

    const boatDataInterval = setInterval(fetchBoatData, 1000);
    return () => clearInterval(boatDataInterval);
  }, [serviceUrl, compassEnabled, holdLineEnabled, compassHeading]);

  // ✅ Route Data Fetch
  useEffect(() => {
    const fetchRouteData = async () => {
      if (fetchPausedRef.current || !serviceUrl || isFetchingRouteData) return;

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
  }, [serviceUrl]);

  // ✅ Route Push
  const pushRouteData = async (data, keepIndex, goalIndex = null) => {
    if (!serviceUrl) return;

    let url = `${serviceUrl}/route?keepIndex=${keepIndex}`;
    if (goalIndex !== null) url += `&goalIndex=${goalIndex}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Route data successfully pushed to server");
        setRouteData(data);
      } else {
        console.error("Failed to push data to server:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error pushing data to server:", error);
    }
  };

  const pushDarkMode = async (darkMode) => {
    if (!serviceUrl) return;

    try {
      await fetch(`${serviceUrl}/rudder?darkMode=${darkMode}`, { method: 'GET' });
    } catch (error) {
      console.error("Error pushing dark mode to server:", error);
    }
  };

  return (
    <DataContext.Provider value={{
      boatData,
      routeData,
      loading,
      error,
      follow,
      setFollow,
      setRouteFetchPaused,
      pushRouteData,
      pushDarkMode,
      compassHeading,
      compassEnabled,
      holdLineEnabled,
      setHoldLineEnabled
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
