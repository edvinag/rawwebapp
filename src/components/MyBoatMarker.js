// MyBoatMarker.js
import React, { useContext } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../assist/marker.png';
import "leaflet-rotatedmarker";
import { DataContext } from '../contexts/DataContext';

const MyBoatMarker = () => {
  const { boatData } = useContext(DataContext);

  const myBoatIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [18, 26],
    iconAnchor: [9, 13],
  });

  return boatData && boatData.data && boatData.data.gps ? (
    <>
      <Marker
        key={`myboatmarker-${boatData.data.gps.course}`} // Changing key based on course to force re-render
        position={[
          boatData.data.gps.location.latitude,
          boatData.data.gps.location.longitude,
        ]}
        icon={myBoatIcon}
        rotationAngle={boatData.data.gps.course}
        rotationOrigin="center center"
      >
        <Popup>
          <strong>My Boat</strong><br />
          <strong>Course:</strong> {boatData.data.gps.course}<br />
          <strong>Latitude:</strong> {boatData.data.gps.location.latitude}<br />
          <strong>Longitude:</strong> {boatData.data.gps.location.longitude}
        </Popup>
      </Marker>
    </>
  ) : null;
};

export default MyBoatMarker;
