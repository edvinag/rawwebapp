// TargetMarker.js
import React, { useState, useRef } from 'react';
import { Marker, useMapEvent, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import targetIcon from '../assist/target.png';


import TargetPopup from './TargetPopup';

const { Overlay } = LayersControl;

const theTargetIcon = L.icon({
  iconUrl: targetIcon,
  iconSize: [25, 25],
});

const TargetMarker = () => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const markerRef = useRef(null);

  useMapEvent('click', (event) => {
    setMarkerPosition(event.latlng);
  });

  const closePopup = () => {
    if (markerRef.current) {
      markerRef.current.closePopup();
    }
  };

  return markerPosition ? (
    <Overlay checked name="Target">
      <Marker ref={markerRef} position={markerPosition} icon={theTargetIcon} draggable={true}>
        <TargetPopup 
          markerPosition={markerPosition}
          closePopup={closePopup} // Pass the closePopup function
        />
      </Marker>
    </Overlay>
  ) : null;
};

export default TargetMarker;
