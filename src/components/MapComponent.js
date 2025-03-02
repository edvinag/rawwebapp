// MapComponent.js
import React, { useEffect, useRef } from 'react';
import { MapContainer, LayersControl, useMap } from 'react-leaflet';
import TileLayers from './TileLayers';
import AISShipsLayer from './AISShipsLayer';
import MyBoatMarker from './MyBoatMarker';
import TargetMarker from './TargetMarker';
import RoutePolyline from './RoutePolyline';
import TargetLine from './TargetLine';
import BoatPath from './BoatPath';
import 'leaflet/dist/leaflet.css';
import { useDataContext } from '../contexts/DataContext'; // Import DataContext

const initialPosition = [57.573517, 11.9269];

const MapComponent = () => {
  const { boatData, follow, setFollow } = useDataContext();
  const mapRef = useRef(null);
  const lastPositionRef = useRef(null); // Store last position to reduce setView calls

  const MapEventsHandler = () => {
    const map = useMap();

    useEffect(() => {
      mapRef.current = map;

      // Disable follow when the user interacts with the map
      const handleUserInteraction = () => setFollow(false);

      map.on('mousedown', handleUserInteraction);
      map.on('touchstart', handleUserInteraction);

      return () => {
        map.off('mousedown', handleUserInteraction);
        map.off('touchstart', handleUserInteraction);
      };
    }, [map]);

    return null;
  };

  useEffect(() => {
    if (follow && boatData.path.length > 0) {
      const latestPosition = boatData.path[boatData.path.length - 1];

      const map = mapRef.current;
      if (map) {
        // Only update the view if the boat moves significantly (prevent excessive updates)
        if (
          !lastPositionRef.current || 
          Math.abs(lastPositionRef.current[0] - latestPosition[0]) > 0.0001 || 
          Math.abs(lastPositionRef.current[1] - latestPosition[1]) > 0.0001
        ) {
          map.setView(latestPosition, map.getZoom());
          lastPositionRef.current = latestPosition; // Update last known position
        }
      }
    }
  }, [boatData, follow]);

  return (
    <MapContainer
      center={initialPosition}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
      doubleClickZoom={false}
      whenCreated={(mapInstance) => {
        console.log('Map created:', mapInstance);
        mapRef.current = mapInstance;
      }}
    >
      <LayersControl position="topright">
        <TileLayers />
        <AISShipsLayer />
        <TargetMarker />
        <TargetLine />
        <RoutePolyline />
        <BoatPath />
      </LayersControl>
      <MyBoatMarker />
      <MapEventsHandler />
    </MapContainer>
  );
};

export default MapComponent;
