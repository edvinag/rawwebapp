// BoatRouteLine.js
import React from 'react';
import { Polyline, LayersControl, FeatureGroup, CircleMarker } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';

const { Overlay } = LayersControl;

const TargetLine = () => {
  const { boatData, routeData, compassEnabled} = useDataContext();

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

  const targetRoutePosition = [
    routeCoordinates[goalIndex][1], // latitude
    routeCoordinates[goalIndex][0], // longitude
  ];

  const targetPosition = [
    boatData.settings.controller.reflocation.latitude, // latitude
    boatData.settings.controller.reflocation.longitude, // longitude
  ];

  return (
    !compassEnabled ? (
    <Overlay name="To Target" checked> {/* checked for initial visibility */}
      <FeatureGroup>
        {/* Draw a line between the boat position and the next target */}
        <Polyline
          positions={[boatPosition, targetPosition]}
          pathOptions={{
            color: 'green',
            dashArray: '10, 10',
          }}>
        </Polyline>
        <CircleMarker center={targetPosition} radius={3} color='black' fillOpacity={1} />
        <CircleMarker center={targetRoutePosition} radius={10} color='darkblue' fillOpacity={1}/>
      </FeatureGroup>
    </Overlay>
    ) : null
  );
};

export default TargetLine;
