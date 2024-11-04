// BoatRouteLine.js
import React from 'react';
import { Polyline, LayersControl, FeatureGroup, Tooltip } from 'react-leaflet';
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

  // Get the goalIndex as the next target point
  const goalIndex = boatData.settings.route.goalIndex;
  const routeCoordinates = routeData.geometry.coordinates;

  // Check that goalIndex is within bounds
  if (goalIndex >= routeCoordinates.length) {
    console.error("Goal index is out of route coordinates bounds.");
    return null;
  }

  const targetPosition = [
    routeCoordinates[goalIndex][1], // latitude
    routeCoordinates[goalIndex][0], // longitude
  ];

  return (
    <Overlay name="Route to Target" checked> {/* checked for initial visibility */}
      <FeatureGroup>
        {/* Draw a line between the boat position and the next target */}
        <Polyline
          positions={[boatPosition, targetPosition]}
          pathOptions={{
            color: 'green',
          }}
        >
        </Polyline>
      </FeatureGroup>
    </Overlay>
  );
};

export default TargetLine;
