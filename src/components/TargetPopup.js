// TargetPopup.js
import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Room, AddLocation } from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';
import { DataContext } from '../contexts/DataContext';

const TargetPopup = ({ markerPosition, closePopup }) => {
  const { apiKey } = useApi();
  const { boatData, routeData, pushRouteData } = useContext(DataContext);

  const fetchRouteData = async (startLongitude, startLatitude) => {
    if (!markerPosition || !apiKey) return null;
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

      if (response.ok) return await response.json();
      console.error("Failed to retrieve data:", response.status, response.statusText);
    } catch (error) {
      console.error("Error making request:", error);
    }
    return null;
  };

  const handleGoToSpot = async () => {
    const { longitude, latitude } = boatData.data.gps.location;
    const data = await fetchRouteData(longitude, latitude);
    if (data) {
      data.geometry.coordinates[0] = [longitude, latitude];
      await pushRouteData(data, false, 1);
      closePopup();
    }
  };

  const handleAddSpot = async () => {
    if (!routeData?.geometry?.coordinates.length) return;
    const lastCoordinate = routeData.geometry.coordinates.at(-1);
    const [startLongitude, startLatitude] = lastCoordinate;
    const newData = await fetchRouteData(startLongitude, startLatitude);

    if (newData) {
      const combinedRouteData = {
        ...routeData,
        geometry: {
          ...routeData.geometry,
          coordinates: [...routeData.geometry.coordinates, ...newData.geometry.coordinates]
        }
      };
      await pushRouteData(combinedRouteData, true);
    }
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
    </div>
  );
};

export default TargetPopup;
