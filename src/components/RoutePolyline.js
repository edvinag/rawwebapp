import React, { useRef } from 'react';
import { Polyline, LayersControl, Marker, Popup, FeatureGroup, useMap } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';
import * as L from 'leaflet';

const { Overlay } = LayersControl;

// Define variables for the circle and marker sizes
const circleRadius = 7;

// Create a custom SVG circle icon for markers
const createCircleIcon = () => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <svg width="${circleRadius * 2}" height="${circleRadius * 2}" viewBox="0 0 ${circleRadius * 2} ${circleRadius * 2}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${circleRadius}" cy="${circleRadius}" r="${circleRadius}" fill="blue" stroke="blue" stroke-width="0"/>
      </svg>
    `,
    iconSize: [circleRadius * 2, circleRadius * 2],
    iconAnchor: [circleRadius, circleRadius],
  });
};

const RoutePolyline = () => {
  const { routeData, updateRouteData, setRouteFetchPaused } = useDataContext();
  const polylineRef = useRef();
  const markerRefs = useRef([]); // Array to keep references for each marker
  const coordinates = routeData?.geometry?.coordinates.map(coord => [coord[1], coord[0]]) || [];
  const draggingMarkerIndex = useRef(null); // Track which marker is being dragged
  const map = useMap(); // Access the map instance

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

  // Custom mouse down drag logic
  const handleMarkerMouseDown = (event, index) => {
    event.originalEvent.preventDefault();
    draggingMarkerIndex.current = index;
    setRouteFetchPaused(true); // Pause route fetch during drag
    map.dragging.disable(); // Disable map dragging

    // Add event listeners to track the mouse movement and release
    document.addEventListener('mousemove', handleMarkerMouseMove);
    document.addEventListener('mouseup', handleMarkerMouseUp);
  };

  const handleMarkerMouseMove = (event) => {
    if (draggingMarkerIndex.current === null) return;

    const markerIndex = draggingMarkerIndex.current;
    const latLng = map.containerPointToLatLng([event.clientX, event.clientY]);
    coordinates[markerIndex] = [latLng.lat, latLng.lng];

    // Update Polyline position in real-time
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(coordinates);
    }

    // Update the marker position in real-time
    if (markerRefs.current[markerIndex]) {
      markerRefs.current[markerIndex].setLatLng(latLng);
    }
  };

  const handleMarkerMouseUp = async () => {
    if (draggingMarkerIndex.current === null) return;
    document.removeEventListener('mousemove', handleMarkerMouseMove);
    // Fetch updated route from server with final position
    if (polylineRef.current) {
      const geoJson = polylineRef.current.toGeoJSON();
      try {
        const response = await fetch(`http://localhost:5000/route?keepIndex=true`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geoJson),
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

    // Reset drag state, enable map dragging, and remove event listeners
    draggingMarkerIndex.current = null;
    setRouteFetchPaused(false);
    map.dragging.enable(); // Re-enable map dragging
    
    document.removeEventListener('mouseup', handleMarkerMouseUp);
  };

  return (
    <Overlay checked name="Route">
      <FeatureGroup>
        <Polyline
          ref={polylineRef}
          positions={coordinates}
          pathOptions={{ color: 'blue' }}
        />
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            icon={createCircleIcon()}
            position={coord}
            draggable={false} // Disable default drag; we handle it manually
            ref={(el) => (markerRefs.current[index] = el)} // Store marker reference
            eventHandlers={{
              mousedown: (event) => handleMarkerMouseDown(event, index),
              dblclick: () => handleMarkerDblClick(index), // Keep double-click functionality
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
