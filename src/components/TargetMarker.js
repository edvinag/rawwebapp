// TargetMarker.js
import React, { useState, useContext } from 'react';
import { Marker, useMapEvent, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import targetIcon from '../assist/target.png';
import { useApi } from '../contexts/ApiContext';
import { DataContext } from '../contexts/DataContext';
import TargetPopup from './TargetPopup';

const { Overlay } = LayersControl;

const theTargetIcon = L.icon({
  iconUrl: targetIcon,
  iconSize: [25, 25],
});

const TargetMarker = () => {
  const { apiKey } = useApi();
  const [markerPosition, setMarkerPosition] = useState(null);
  const { boatData } = useContext(DataContext);

  useMapEvent('click', (event) => {
    setMarkerPosition(event.latlng);
  });

  return markerPosition ? (
    <Overlay checked name="Target">
      <Marker position={markerPosition} icon={theTargetIcon} draggable={true}>
        <TargetPopup 
          markerPosition={markerPosition} 
          apiKey={apiKey} 
          boatData={boatData} 
        />
      </Marker>
    </Overlay>
  ) : null;
};

export default TargetMarker;
