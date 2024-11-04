// MapComponent.js
import React from 'react';
import { MapContainer, LayersControl } from 'react-leaflet';
import TileLayers from './TileLayers';
import AISShipsLayer from './AISShipsLayer';
import MyBoatMarker from './MyBoatMarker';
import TargetMarker from './TargetMarker';
import RoutePolyline from './RoutePolyline';
import BoatPath from './BoatPath'; // Import BoatPath component
import 'leaflet/dist/leaflet.css';

const position = [57.573517, 11.9269]; // Initial center coordinates

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={16} style={{ height: "100vh", width: "100%" }}>
      <LayersControl position="topright">
        <TileLayers />
        <AISShipsLayer />
        <TargetMarker />
        <RoutePolyline />
        <BoatPath />
      </LayersControl>
      <MyBoatMarker />
    </MapContainer>
  );
};

export default MapComponent;
