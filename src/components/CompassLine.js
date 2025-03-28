import React from 'react';
import { Polyline, LayersControl, FeatureGroup } from 'react-leaflet';
import { useDataContext } from '../contexts/DataContext';

const { Overlay } = LayersControl;

const toRadians = (deg) => deg * (Math.PI / 180);
const toDegrees = (rad) => rad * (180 / Math.PI);

// Project a point given start lat/lng, bearing in degrees, and distance in meters
function projectPoint(lat, lon, bearingDeg, distanceMeters) {
  const R = 6371000; // Earth radius in meters
  const bearing = toRadians(bearingDeg);
  const φ1 = toRadians(lat);
  const λ1 = toRadians(lon);

  const δ = distanceMeters / R;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(bearing)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return [toDegrees(φ2), toDegrees(λ2)];
}

const CompassLine = () => {
  const { boatData, compassHeading, compassEnabled } = useDataContext();

  if (
    !boatData ||
    !boatData.data?.gps?.location ||
    compassHeading == null
  ) {
    return null;
  }

  const { latitude, longitude } = boatData.data.gps.location;
  const refCourseDeg = compassHeading;

  const projectedPoint = projectPoint(latitude, longitude, refCourseDeg, 100); // 100 meters ahead

  return (
    compassEnabled ? (
    <Overlay name="Compass Line" checked>
      <FeatureGroup>
        <Polyline
          positions={[
            [latitude, longitude],
            projectedPoint,
          ]}
          pathOptions={{
            color: 'blue',
          }}
        />
      </FeatureGroup>
    </Overlay>
    ) : null
  );
};

export default CompassLine;
