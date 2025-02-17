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

const MapComponent = ({ showTargetMarker }) => {
  const { boatData, follow } = useDataContext(); // Access boatData and follow state from DataContext
  const mapRef = useRef(null);

  const MapEventsHandler = () => {
    const map = useMap();
    useEffect(() => {
      console.log('Map loaded:', map);
      mapRef.current = map;
    }, [map]);
    return null;
  };

  useEffect(() => {
    console.log('Follow state:', follow);
    console.log('Boat data path length:', boatData.path.length);

    if (follow && boatData.path.length > 0) {
      const latestPosition = boatData.path[boatData.path.length - 1];
      console.log('Latest position:', latestPosition);
      const map = mapRef.current;
      if (map) {
        console.log('Map instance:', map);
        console.log('Flying to latest position...');
        map.setView(latestPosition, map.getZoom());
      } else {
        console.log('Map instance is not set yet.');
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
        {showTargetMarker && <TargetMarker />} {/* Conditionally render TargetMarker */}
        <RoutePolyline />
        <BoatPath />
        <TargetLine />
      </LayersControl>
      <MyBoatMarker />
      <MapEventsHandler />
    </MapContainer>
  );
};

export default MapComponent;
