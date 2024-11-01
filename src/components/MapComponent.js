// MapComponent.js
import React from 'react';
import { MapContainer, LayersControl } from 'react-leaflet';
import TileLayers from './TileLayers';
import AISShipsLayer from './AISShipsLayer';
import MyBoatMarker from './MyBoatMarker';
import TargetMarker from './TargetMarker'; // Import the new TargetMarker component
import 'leaflet/dist/leaflet.css';

const position = [57.573517, 11.9269]; // Initial center coordinates

const MapComponent = ({ apiKey }) => {
  return (
    <MapContainer center={position} zoom={16} style={{ height: "100vh", width: "100%" }}>
      <LayersControl position="topright">
        <TileLayers />
        <AISShipsLayer apiKey={apiKey} />
        <TargetMarker apiKey={apiKey} />
      </LayersControl>
      <MyBoatMarker apiKey={apiKey} />
    </MapContainer>
  );
};

export default MapComponent;
