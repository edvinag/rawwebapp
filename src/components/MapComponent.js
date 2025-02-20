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
  const { boatData, follow } = useDataContext(); // Access boatData and follow state from DataContext
  const mapRef = useRef(null);

  const MapEventsHandler = () => {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    return null;
  };

  useEffect(() => {
    if (follow && boatData.path.length > 0) {
      const latestPosition = boatData.path[boatData.path.length - 1];
      
      const map = mapRef.current;
      if (map) {
        map.setView(latestPosition, map.getZoom());
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
        <TargetMarker /> {/* Conditionally render TargetMarker */}
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
