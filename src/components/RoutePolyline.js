import React, { useRef, useEffect } from 'react';
import { Polyline, LayersControl, Marker, FeatureGroup, useMap } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';
import { useApi } from '../contexts/SettingsContext';
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
  const { serviceUrl } = useApi();
  const polylineRef = useRef();
  const markerRefs = useRef([]);
  const fetchPausedRef = useRef(false);
  const coordinates = routeData?.geometry?.coordinates.map(coord => [coord[1], coord[0]]) || [];
  const draggingMarkerIndex = useRef(null);
  const map = useMap();

  useEffect(() => {
    return () => {
      map.off('mousemove');
      map.off('mouseup');
    };
  }, [map]);

  const handleMarkerDblClick = async (index) => {
    if (!serviceUrl) return;

    try {
      const response = await fetch(`${serviceUrl}/route?goalIndex=${index}`, { method: 'GET' });
      if (!response.ok) throw new Error(`Request failed for goalIndex ${index}`);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  const handleDrag = (index, event) => {
    const { lat, lng } = event.target.getLatLng();
    coordinates[index] = [lat, lng];

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(coordinates);
    }
  };

  const handleDragEnd = async (index) => {
    if (!serviceUrl) return;

    if (polylineRef.current) {
      const geoJson = polylineRef.current.toGeoJSON();
      await pushRouteData(geoJson, true);
    }

    draggingMarkerIndex.current = null;
    fetchPausedRef.current = false;
    map.dragging.enable();
    setRouteFetchPaused(false);
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
            draggable={true}
            ref={(el) => (markerRefs.current[index] = el)}
            eventHandlers={{
              dragstart: () => {
                draggingMarkerIndex.current = index;
                fetchPausedRef.current = true;
                map.dragging.disable();
                setRouteFetchPaused(true);
              },
              drag: (event) => handleDrag(index, event),
              dragend: () => handleDragEnd(index),
              dblclick: () => handleMarkerDblClick(index),
            }}
          />
        ))}
      </FeatureGroup>
    </Overlay>
  );
};

export default RoutePolyline;
