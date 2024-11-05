// TargetPopup.js
import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Room, AddLocation } from '@mui/icons-material';
import { useApi } from '../contexts/ApiContext';
import { DataContext } from '../contexts/DataContext';

const TargetPopup = ({ markerPosition, closePopup }) => {
  const { apiKey } = useApi();
  const { boatData, routeData } = useContext(DataContext);

  const fetchRouteData = async (startLongitude, startLatitude) => {
    if (!markerPosition || !apiKey) {
      console.warn("Missing marker position or API key");
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
        headers: {
          "Authorization": auth_header
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("New route:", data);
        console.log("Old route:", routeData);
        return data;
      } else {
        console.error("Failed to retrieve data:", response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error making request:", error);
      return null;
    }
  };

  const pushRouteData = async (data, keepIndex, goalIndex=null) => {
    let url = `http://localhost:5000/route?keepIndex=${keepIndex}`;
    if (goalIndex !== null) {
      url += `&goalIndex=${goalIndex}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log("Route data successfully pushed to local server");
        closePopup(); // Close the popup after a successful push
      } else {
        console.error("Failed to push data to local server:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error pushing data to local server:", error);
    }
  };

  const handleGoToSpot = async () => {
    const { longitude, latitude } = boatData.data.gps.location;
    const data = await fetchRouteData(longitude, latitude);
    if (data) {
      // Modify the first coordinate to be the boat's current position
      data.geometry.coordinates[0] = [longitude, latitude];
  
      // Push the modified route data
      pushRouteData(data, false, 1);
    }
  };

  const handleAddSpot = async () => {
    // Check if routeData has existing coordinates
    if (!routeData || !routeData.geometry || routeData.geometry.coordinates.length === 0) {
      console.warn("No existing route data to extend.");
      return;
    }
  
    // Get the last coordinate from routeData to use as the starting point
    const lastCoordinate = routeData.geometry.coordinates[routeData.geometry.coordinates.length - 1];
    const [startLongitude, startLatitude] = lastCoordinate;
  
    // Fetch new route data starting from the last coordinate
    const newData = await fetchRouteData(startLongitude, startLatitude);
    if (newData) {
      // Combine old route data with new route data
      const combinedRouteData = {
        ...routeData,  // Clone old route data structure
        geometry: {
          ...routeData.geometry,
          coordinates: [...routeData.geometry.coordinates, ...newData.geometry.coordinates]
        }
      };
  
      // Push the combined route data
      pushRouteData(combinedRouteData, true);
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
    </div>
  );
};

export default TargetPopup;
