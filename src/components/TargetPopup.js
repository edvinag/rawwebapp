import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Room, AddLocation, ErrorOutline } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import { useApi } from '../contexts/SettingsContext';
import { DataContext } from '../contexts/DataContext';

const TargetPopup = ({ markerPosition, closePopup }) => {
  const { apiKey } = useApi();
  const { boatData, routeData, pushRouteData } = useContext(DataContext);
  const prevRouteDataRef = useRef(routeData);
  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (prevRouteDataRef.current !== routeData && routeData?.geometry?.coordinates.length) {
      closePopup();
    }
    prevRouteDataRef.current = routeData;
  }, [routeData, closePopup]);

  const fetchRouteData = async (startLongitude, startLatitude) => {
    if (!markerPosition) {
      showError("Please select a destination marker.");
      return null;
    }
    if (!apiKey) {
      showError("Missing API key. Please check your settings.");
      return null;
    }

    const api_url = "https://nautical-hub.skippo.io/aws/autoroute";
    const auth_header = `Basic ${apiKey}`;
    const course = `${startLongitude},${startLatitude};${markerPosition.lng},${markerPosition.lat}`;

    const params = new URLSearchParams({
      usehydrographica: "true",
      course: course,
      safetydepth: "1.5",
      safetyheight: "10",
      boatspeed: "10"
    });

    try {
      const response = await fetch(`${api_url}?${params.toString()}`, {
        method: 'GET',
        headers: { "Authorization": auth_header }
      });

      if (!response.ok) {
        showError(`Failed to retrieve data: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      showError("Error while fetching route data. Please check your internet connection.");
      return null;
    }
  };

  const handleGoToSpot = async () => {
    const { longitude, latitude } = boatData.data.gps.location;
    const data = await fetchRouteData(longitude, latitude);
    if (data) {
      data.geometry.coordinates[0] = [longitude, latitude];
      await pushRouteData(data, false, 1);
    }
  };

  const handleAddSpot = async () => {
    if (!routeData?.geometry?.coordinates.length) {
      showError("No existing route found. Please start a new route first.");
      return;
    }

    const lastCoordinate = routeData.geometry.coordinates.at(-1);
    const [startLongitude, startLatitude] = lastCoordinate;
    const newData = await fetchRouteData(startLongitude, startLatitude);

    if (newData) {
      // Skip the first coordinate to avoid duplicating the starting point
      const newCoordinates = newData.geometry.coordinates.slice(1);
  
      const combinedRouteData = {
        ...routeData,
        geometry: {
          ...routeData.geometry,
          coordinates: [...routeData.geometry.coordinates, ...newCoordinates]
        }
      };
      await pushRouteData(combinedRouteData, true);
    }
  };

  const showError = (message) => {
    setError(message);
    setOpenError(true);
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Auto Spot Actions
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <Button
          variant="contained"
          startIcon={<Room />}
          onClick={handleGoToSpot}
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
        >
          Go to spot
        </Button>
        <Button
          variant="contained"
          startIcon={<AddLocation />}
          onClick={handleAddSpot}
          sx={{ backgroundColor: '#FFD700', color: 'black', '&:hover': { backgroundColor: '#FFC107' } }}
        >
          Add spot
        </Button>
      </div>

      {/* Error Snackbar */}
      <Snackbar open={openError} autoHideDuration={5000} onClose={handleCloseError}>
        <Alert severity="error" onClose={handleCloseError} sx={{ width: '100%' }}>
          <ErrorOutline sx={{ marginRight: 1 }} /> {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TargetPopup;
