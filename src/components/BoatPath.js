// BoatPath.js
import React from 'react';
import { Polyline, LayersControl, FeatureGroup } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';

const { Overlay } = LayersControl;

const BoatPath = () => {
  const { boatData } = useDataContext();

  // Convert path coordinates to Leaflet [lat, lng] format if available
  const coordinates = boatData?.path;

  return (
    <Overlay name="Boat Path" checked> {/* checked for initial visibility */}
      <FeatureGroup>
        {coordinates?.length > 1 && (
          <Polyline
            key={`polyline-${coordinates.length}`}
            positions={coordinates}
            pathOptions={{
              color: 'red',
              dashArray: '5, 10',
              weight: 2,
            }}
          />
        )}
      </FeatureGroup>
    </Overlay>
  );
};

export default BoatPath;
