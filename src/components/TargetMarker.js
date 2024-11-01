// TargetMarker.js
import React, { useState } from 'react';
import { Marker, Popup, useMapEvent, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import targetIcon from '../assist/target.png'; // Adjust this path as necessary
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Room, AddLocation } from '@mui/icons-material'; // Import icons from MUI

const { Overlay } = LayersControl;

// Define the custom icon for the target marker
const theTargetIcon = L.icon({
  iconUrl: targetIcon,
  iconSize: [25, 25],
});

// Component to handle clicks and add a target marker at the clicked location
const TargetMarker = ({ apiKey }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [routeData, setRouteData] = useState(null); // State to hold route data

  // Capture map click event to set the marker position
  useMapEvent('click', (event) => {
    setMarkerPosition(event.latlng);
  });

  // Handler function to make the API request
  const fetchRouteData = async () => {
    if (!markerPosition) return;

    const api_url = "https://nautical-hub.skippo.io/aws/autoroute";
    const auth_header = `Basic ${apiKey}`;

    // Define course using the clicked location and a fixed start position
    const course = `11.829217,57.60726;${markerPosition.lng},${markerPosition.lat}`;

    const params = new URLSearchParams({
      usehydrographica: "true",
      course: course,
      safetydepth: "1.5",
      safetyheight: "10",
      boatspeed: "10"
    });

    try {
      // Make the API request with SSL verification disabled (handled in backend or node environment)
      const response = await fetch(`${api_url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          "Authorization": auth_header
        }
      });

      // Check if the request was successful
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
    // You could add code here to adjust the map view, for example
  };

  const handleAddSpot = () => {
    console.log("Spot added at:", markerPosition);
    fetchRouteData();
  };

  return markerPosition ? (
    <Overlay checked name="Target">
      <Marker position={markerPosition} icon={theTargetIcon} draggable={true}>
        <Popup>
          <div style={{ textAlign: 'center' }}>
            {/* Styled title */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Auto Spot Actions
            </Typography>
            
            {/* Buttons in line */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Button
                variant="contained"
                startIcon={<Room />}
                onClick={handleGoToSpot}
                sx={{
                  backgroundColor: '#4CAF50', // Custom green from Coolors
                  '&:hover': { backgroundColor: '#388E3C' } // Darker green on hover
                }}
              >
                Go to spot
              </Button>
              <Button
                variant="contained"
                startIcon={<AddLocation />}
                onClick={handleAddSpot}
                sx={{
                  backgroundColor: '#FFD700', // Custom yellow from Coolors
                  color: 'black', // Ensure text visibility
                  '&:hover': { backgroundColor: '#FFC107' } // Darker yellow on hover
                }}
              >
                Add spot
              </Button>
            </div>
          </div>
          {/* Display the route data if available */}
          {routeData && (
            <Typography variant="body2" style={{ marginTop: '8px' }}>
              Route Data: {JSON.stringify(routeData)}
            </Typography>
          )}
        </Popup>
      </Marker>
    </Overlay>
  ) : null;
};

export default TargetMarker;
