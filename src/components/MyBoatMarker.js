import React, { useContext } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../assist/marker.png';
import "leaflet-rotatedmarker";
import { DataContext } from '../contexts/DataContext'; // Import DataContext

const MyBoatMarker = () => {
  const { data, boatPath } = useContext(DataContext); // Access data and boatPath from context

  const myBoatIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [18, 26],
    iconAnchor: [9, 13],
  });

  return data && data.data && data.data.gps ? (
    <>
      <Marker
        key={data.data.gps.course} // Changing key based on course to force re-render
        position={[
          data.data.gps.location.latitude,
          data.data.gps.location.longitude,
        ]}
        icon={myBoatIcon}
        rotationAngle={data.data.gps.course}
        rotationOrigin="center center"
      >
        <Popup>
          <strong>My Boat</strong><br />
          <strong>Course:</strong> {data.data.gps.course}<br />
          <strong>Latitude:</strong> {data.data.gps.location.latitude}<br />
          <strong>Longitude:</strong> {data.data.gps.location.longitude}
        </Popup>
      </Marker>
      <Polyline 
        positions={boatPath} 
        pathOptions={{
          color: '#305cde', 
          dashArray: '5, 10', // Adjust the pattern for dotted effect
          weight: 2 // Adjust thickness if needed
        }} 
      />
    </>
  ) : null;
};

export default MyBoatMarker;
