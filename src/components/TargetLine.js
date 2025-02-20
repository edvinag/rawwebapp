// BoatRouteLine.js
import React from 'react';
import { Polyline, LayersControl, FeatureGroup } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';

const { Overlay } = LayersControl;

const TargetLine = () => {
  const { boatData, routeData } = useDataContext();

  // Check if data is available
  if (!boatData || !boatData.data || !boatData.data.gps || !routeData || !routeData.geometry || !routeData.geometry.coordinates) {
    return null;
  }

  const boatPosition = [
    boatData.data.gps.location.latitude,
    boatData.data.gps.location.longitude,
  ];

  const targetPosition = [
    boatData.settings.controller.reflocation.latitude, // latitude
    boatData.settings.controller.reflocation.longitude, // longitude
  ];

  return (
    <Overlay name="Route to Target" checked> {/* checked for initial visibility */}
      <FeatureGroup>
        {/* Draw a line between the boat position and the next target */}
        <Polyline
          positions={[boatPosition, targetPosition]}
          pathOptions={{
            color: 'green',
          }}>
        </Polyline>
      </FeatureGroup>
    </Overlay>
  );
};

export default TargetLine;
