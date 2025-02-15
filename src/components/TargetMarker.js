// TargetMarker.js
import React, { useState } from 'react';
import { Popup, useMapEvent, LayersControl } from 'react-leaflet';
import TargetPopup from './TargetPopup';

const { Overlay } = LayersControl;

const TargetMarker = () => {
  const [popupPosition, setPopupPosition] = useState(null);

  useMapEvent('dblclick', (event) => {
    setPopupPosition(event.latlng);
  });

  const closePopup = () => {
    setPopupPosition(null);
  };

  return popupPosition ? (
    <Overlay checked name="Target">
      <Popup position={popupPosition} onClose={closePopup}>
        <TargetPopup 
          markerPosition={popupPosition}
          closePopup={closePopup} // Pass the closePopup function
        />
      </Popup>
    </Overlay>
  ) : null;
};

export default TargetMarker;
