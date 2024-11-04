// src/components/RoutePolyline.js
import React from 'react';
import { Polyline, LayersControl, CircleMarker } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';

const { Overlay } = LayersControl;

const RoutePolyline = () => {
  const { routeData } = useDataContext(); // Access route data from DataContext

  // Convert routeData coordinates to Leaflet [lat, lng] format if available
  const coordinates = routeData?.geometry?.coordinates.map(coord => [coord[1], coord[0]]) || [];

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
          />
        ))}
      </>
    </Overlay>
  );
};

export default RoutePolyline;
