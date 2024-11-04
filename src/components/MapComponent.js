// MapComponent.js
import React from 'react';
import { MapContainer, LayersControl } from 'react-leaflet';
import TileLayers from './TileLayers';
import AISShipsLayer from './AISShipsLayer';
import MyBoatMarker from './MyBoatMarker';
import TargetMarker from './TargetMarker';
import RoutePolyline from './RoutePolyline';
import TargetLine from './TargetLine';
import BoatPath from './BoatPath';
import 'leaflet/dist/leaflet.css';

const position = [57.573517, 11.9269];

const MapComponent = ({ showTargetMarker }) => {
  return (
    <MapContainer center={position} zoom={16} style={{ height: "100vh", width: "100%" }} doubleClickZoom={false}>
      <LayersControl position="topright">
        <TileLayers />
        <AISShipsLayer />
        {showTargetMarker && <TargetMarker />} {/* Conditionally render TargetMarker */}
        <RoutePolyline />
        <BoatPath />
        <TargetLine />
      </LayersControl>
      <MyBoatMarker />
    </MapContainer>
  );
};

export default MapComponent;
