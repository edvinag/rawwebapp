// RoutePolyline.js
import React, { useRef, useEffect } from 'react';
import { Polyline, LayersControl, Marker, FeatureGroup, useMap } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';
import * as L from 'leaflet';

const { Overlay } = LayersControl;

const createCircleIcon = () => L.divIcon({
  className: 'custom-marker-icon',
  html: `<svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="blue"/></svg>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const RoutePolyline = () => {
  const { routeData, setRouteFetchPaused, pushRouteData } = useDataContext();
  const polylineRef = useRef();
  const markerRefs = useRef([]);
  const coordinates = routeData?.geometry?.coordinates.map(coord => [coord[1], coord[0]]) || [];
  const draggingMarkerIndex = useRef(null);
  const map = useMap();

  useEffect(() => {
    // Cleanup function to remove map event listeners on unmount
    return () => {
      map.off('mousemove');
      map.off('mouseup');
    };
  }, [map]);

  // Function to handle mouse down event for custom drag
  const handleMarkerMouseDown = (event, index) => {
    event.originalEvent.preventDefault();
    draggingMarkerIndex.current = index;
    setRouteFetchPaused(true);
    map.dragging.disable();

    // Add event listeners to track mouse movement and release
    map.on('mousemove', handleMarkerMouseMove);
    map.on('mouseup', handleMarkerMouseUp);
  };

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

  // Updated handleMarkerMouseMove using event.latlng
  const handleMarkerMouseMove = (event) => {
    if (draggingMarkerIndex.current === null) return;

    const markerIndex = draggingMarkerIndex.current;
    const { lat, lng } = event.latlng; // Directly use latlng from the MouseEvent
    coordinates[markerIndex] = [lat, lng];

    // Update Polyline position in real-time
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(coordinates);
    }

    // Update the marker position in real-time
    if (markerRefs.current[markerIndex]) {
      markerRefs.current[markerIndex].setLatLng(event.latlng);
    }
  };

  const handleMarkerMouseUp = async () => {
    if (draggingMarkerIndex.current === null) return;

    // Remove map event listeners
    map.off('mousemove', handleMarkerMouseMove);
    map.off('mouseup', handleMarkerMouseUp);

    if (polylineRef.current) {
      const geoJson = polylineRef.current.toGeoJSON();
      await pushRouteData(geoJson, true);
    }

    draggingMarkerIndex.current = null;
    setRouteFetchPaused(false);
    map.dragging.enable();
  };

  return (
    <Overlay checked name="Route">
      <FeatureGroup>
        <Polyline ref={polylineRef} positions={coordinates} pathOptions={{ color: 'blue' }} />
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            icon={createCircleIcon()}
            position={coord}
            draggable={false}
            ref={(el) => (markerRefs.current[index] = el)}
            eventHandlers={{
              mousedown: (event) => handleMarkerMouseDown(event, index),
              dblclick: () => handleMarkerDblClick(index), // Restore double-click functionality
            }}
          />
        ))}
      </FeatureGroup>
    </Overlay>
  );
};

export default RoutePolyline;
