import React, { useEffect, useRef } from 'react';
import { MapContainer, LayersControl, useMap } from 'react-leaflet';
import TileLayers from './TileLayers';
import AISShipsLayer from './AISShipsLayer';
import MyBoatMarker from './MyBoatMarker';
import TargetMarker from './TargetMarker';
import RoutePolyline from './RoutePolyline';
import TargetLine from './TargetLine';
import CompassLine from './CompassLine';
import BoatPath from './BoatPath';
import 'leaflet/dist/leaflet.css';
import { useDataContext } from '../contexts/DataContext';

const initialPosition = [57.573517, 11.9269];

const MapComponent = () => {
  const { boatData, follow, setFollow } = useDataContext();
  const mapRef = useRef(null);
  const lastPositionRef = useRef(null);

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
        if (
          !lastPositionRef.current || 
          Math.abs(lastPositionRef.current[0] - latestPosition[0]) > 0.0001 || 
          Math.abs(lastPositionRef.current[1] - latestPosition[1]) > 0.0001
        ) {
          map.setView(latestPosition, map.getZoom());
          lastPositionRef.current = latestPosition;
        }
      }
    }
  }, [boatData, follow]);

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <MapContainer
        center={initialPosition}
        zoom={16}
        style={{ flex: 1, width: "100%" }} // Uses flex instead of fixed height
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
          <CompassLine />
        </LayersControl>
        <MyBoatMarker />
        <MapEventsHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
