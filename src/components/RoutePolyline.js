// src/components/RoutePolyline.js
import React, { useRef } from 'react';
import { Polyline, LayersControl, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';
import * as L from 'leaflet';

const { Overlay } = LayersControl;

// Define variables for the circle and marker sizes
const circleRadius = 7; // Adjust this value to change the marker icon size

// Create a custom SVG circle icon for markers
const createCircleIcon = () => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <svg width="${circleRadius * 2}" height="${circleRadius * 2}" viewBox="0 0 ${circleRadius * 2} ${circleRadius * 2}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${circleRadius}" cy="${circleRadius}" r="${circleRadius}" fill="blue" stroke="blue" stroke-width="0"/>
      </svg>
    `,
    iconSize: [circleRadius * 2, circleRadius * 2], // Adjust icon size based on circle radius
    iconAnchor: [circleRadius, circleRadius], // Position the icon so its center is the marker location
  });
};

const RoutePolyline = () => {
  const { routeData, updateRouteData, setRouteFetchPaused } = useDataContext();
  const polylineRef = useRef(); // Reference to the Polyline

  // Convert routeData coordinates to Leaflet [lat, lng] format if available
  const coordinates = routeData?.geometry?.coordinates.map(coord => [coord[1], coord[0]]) || [];

  // Function to handle double-click on a Marker
  const handleMarkerDblClick = async (index) => {
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

  // Function to handle marker drag start
  const handleMarkerDragStart = () => {
    setRouteFetchPaused(true); // Pause route fetch on drag start
    console.log('Drag started');
  };

  // Function to handle marker drag to update polyline in real-time
  const handleMarkerDrag = (event, index) => {
    const { lat, lng } = event.target.getLatLng();
    coordinates[index] = [lat, lng]; // Update the coordinate in the array

    // Update the Polyline with the new coordinates
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(coordinates);
    }
  };

  // Function to handle marker drag end to update route on the server
  const handleMarkerDragEnd = async (event, index) => {
    const { lat, lng } = event.target.getLatLng();
    coordinates[index] = [lat, lng]; // Ensure final position is set

    if (polylineRef.current) {
      const geoJson = polylineRef.current.toGeoJSON();

      try {
        const response = await fetch(`http://localhost:5000/route?keepIndex=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(geoJson), // Send GeoJSON to server
        });

        if (response.ok) {
          const updatedRouteData = await response.json();
          updateRouteData(updatedRouteData);
        } else {
          console.error(`Failed to update route`);
        }
      } catch (error) {
        console.error('Error updating route:', error);
      }
    }
    setRouteFetchPaused(false); // Resume route fetch after drag end
  };

  return (
    <Overlay checked name="Route">
      <FeatureGroup>
        <Polyline
          ref={polylineRef} // Reference to access the Polyline for GeoJSON conversion
          positions={coordinates}
          pathOptions={{ color: 'blue' }}
        />
        {coordinates.map((coord, index) => (
          <Marker
            key={`route-marker-${index}`}
            icon={createCircleIcon()}
            position={coord}
            draggable={true} // Enable dragging for each marker
            eventHandlers={{
              dblclick: () => handleMarkerDblClick(index),
              dragstart: handleMarkerDragStart, // Pause route fetch on drag start
              drag: (event) => handleMarkerDrag(event, index), // Real-time update on `drag`
              dragend: (event) => handleMarkerDragEnd(event, index), // Send data to server on `dragend`
            }}
          >
            <Popup>Point {index}</Popup>
          </Marker>
        ))}
      </FeatureGroup>
    </Overlay>
  );
};

export default RoutePolyline;
