// TargetPopup.js
import React, { useState } from 'react';
import { Popup } from 'react-leaflet';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Room, AddLocation } from '@mui/icons-material';

const TargetPopup = ({ markerPosition, apiKey, boatData }) => {
  const [routeData, setRouteData] = useState(null);

  // Handler function to make the API request
  const fetchRouteData = async () => {
    if (!markerPosition || !apiKey) {
      console.warn("Missing marker position or API key");
      return;
    }

    const api_url = "https://nautical-hub.skippo.io/aws/autoroute";
    const auth_header = `Basic ${apiKey}`;
    const course = `${boatData.data.gps.location.longitude},${boatData.data.gps.location.latitude};${markerPosition.lng},${markerPosition.lat}`;

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
        headers: {
          "Authorization": auth_header
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRouteData(data);
        console.log("Route data:", data);
      } else {
        console.error("Failed to retrieve data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  // Handler functions for each button
  const handleGoToSpot = () => {
    console.log("Navigating to spot:", markerPosition);
    fetchRouteData();
  };

  const handleAddSpot = () => {
    console.log("Spot added at:", markerPosition);
    fetchRouteData();
  };

  return (
    <Popup>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Auto Spot Actions
        </Typography>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button
            variant="contained"
            startIcon={<Room />}
            onClick={handleGoToSpot}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#388E3C' }
            }}
          >
            Go to spot
          </Button>
          <Button
            variant="contained"
            startIcon={<AddLocation />}
            onClick={handleAddSpot}
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              '&:hover': { backgroundColor: '#FFC107' }
            }}
          >
            Add spot
          </Button>
        </div>
        
        {/* Display the route data if available */}
        {routeData && (
          <Typography variant="body2" style={{ marginTop: '8px' }}>
            Route Data: {JSON.stringify(routeData)}
          </Typography>
        )}
      </div>
    </Popup>
  );
};

export default TargetPopup;
