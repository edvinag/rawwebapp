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
  const [fetchPaused, setFetchPaused] = useState(false);
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

  // ✅ Boat Data Fetch
  useEffect(() => {
    const fetchBoatData = async () => {
      if (fetchPaused || !serviceUrl || isFetchingBoatData) return;
      setIsFetchingBoatData(true);
      try {
        let response = null
        if (compassEnabled) {
          response = await fetch(`${serviceUrl}/all?controllerType=compass&refCourse=` + compassHeading);
        }
        else if(holdLineEnabled)
        {
          response = await fetch(`${serviceUrl}/all?controllerType=holdline`);
        }
        else {
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
        setLoading(false);
        setIsFetchingBoatData(false);
      }
    };

    const boatDataInterval = setInterval(fetchBoatData, 500);
    return () => clearInterval(boatDataInterval);
  }, [fetchPaused, serviceUrl, isFetchingBoatData]);

  // ✅ Route Data Fetch
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

  // ✅ Compass Handling
  const handleOrientation = (event) => {
    let heading = null;
  
    if (event.webkitCompassHeading !== undefined) {
      // iOS-specific
      heading = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Other devices
      heading = (360 - event.alpha) % 360;
    }
  
    if (heading !== null) {
      setCompassHeading(heading);
    }
  };

  const enableRoute = () => {
    setHoldLineEnabled(false);
    disableCompass();
  };

  const enableCompass = async () => {
    if (compassListenerActive.current) return; // Already active

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          compassListenerActive.current = true;
          setCompassEnabled(true);
        } else {
          console.error('Permission denied for compass access.');
          setCompassEnabled(false);
        }
      } catch (err) {
        console.error('Compass permission error:', err);
        setCompassEnabled(false);
      }
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      // Android / desktop if supported
      window.addEventListener('deviceorientation', handleOrientation, true);
      compassListenerActive.current = true;
      setCompassEnabled(true);
    } else {
      console.error('Compass not supported on this device.');
      setCompassEnabled(false);
    }
  };

  const disableCompass = () => {
    if (compassListenerActive.current) {
      window.removeEventListener('deviceorientation', handleOrientation);
      compassListenerActive.current = false;
    }
    setCompassHeading(null);
    setCompassEnabled(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => disableCompass(); // Stop compass when component unmounts
  }, []);

  // ✅ Route Push
  const updateRouteData = (newRouteData) => setRouteData(newRouteData);
  const setRouteFetchPaused = (paused) => setFetchPaused(paused);

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
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Route data successfully pushed to server");
        updateRouteData(data);
      } else {
        console.error("Failed to push data to server:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error pushing data to server:", error);
    }
  };

  const pushDarkMode = async (darkMode) => {
    if (!serviceUrl) {
      console.error("Service URL is not set.");
      return;
    }

    let url = `${serviceUrl}/rudder?darkMode=${darkMode}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        console.log("Dark mode successfully pushed to server");
      } else {
        console.error("Failed to push dark mode to server:", response.status, response.statusText);
      }
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
      updateRouteData,
      setRouteFetchPaused,
      pushRouteData,
      compassHeading,        // ✅ Exposed heading
      compassEnabled,       // ✅ Exposed enabled state
      enableCompass,        // ✅ Exposed function to enable
      disableCompass,       // ✅ Exposed function to disable
      holdLineEnabled,
      setHoldLineEnabled,
      enableRoute,
      pushDarkMode
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
