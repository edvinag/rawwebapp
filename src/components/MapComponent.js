import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import TileLayers from './TileLayers';
import AISShipsLayer from './AISShipsLayer';
import MyBoatMarker from './MyBoatMarker';
import 'leaflet/dist/leaflet.css';

const position = [57.573517, 11.9269]; // Initial center coordinates

const MapComponent = ({ apiKey }) => {
  return (
    <MapContainer center={position} zoom={16} style={{ height: "100vh", width: "100%" }}>
      <LayersControl position="topright">
        <TileLayers />
        <AISShipsLayer apiKey={apiKey} />
        <MyBoatMarker apiKey={apiKey} />
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
