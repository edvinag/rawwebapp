// src/components/RoutePolyline.js
import React from 'react';
import { Polyline, LayersControl, CircleMarker } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';

const { Overlay } = LayersControl;

const RoutePolyline = () => {
  const { routeData } = useDataContext(); // Access route data from DataContext

  // Convert routeData coordinates to Leaflet [lat, lng] format if available
  const coordinates = routeData?.geometry?.coordinates.map(coord => [coord[1], coord[0]]) || [];

  // Function to handle double-click on a CircleMarker
  const handleCircleMarkerDblClick = async (index) => {
    try {
      const response = await fetch(`http://localhost:5000/route?goalIndex=${index}`, {
        method: 'GET',
      });
      if (response.ok) {
        console.log(`Request successful for goalIndex ${index}`);
      } else {
        console.error(`Request failed for goalIndex ${index}`);
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  return (
    <Overlay checked name="Route">
      <>
        <Polyline 
          positions={coordinates} 
          pathOptions={{ color: 'blue' }} 
        />
        {coordinates.map((coord, index) => (
          <CircleMarker
            key={index}
            center={coord}
            radius={3} // Adjust radius size for small circles
            pathOptions={{ color: 'blue' }} // Optional: match polyline color
            eventHandlers={{
              dblclick: () => handleCircleMarkerDblClick(index)
            }}
          />
        ))}
      </>
    </Overlay>
  );
};

export default RoutePolyline;
