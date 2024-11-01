import React, { useEffect, useState } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../assist/marker.png'; // Adjust this path as necessary
import "leaflet-rotatedmarker";

const MyBoatMarker = ({ apiKey }) => {
  const [boatData, setBoatData] = useState(null);
  const [boatPath, setBoatPath] = useState([]); // To store the boat path

  useEffect(() => {
    // Define the fetch function
    const fetchBoatData = () => {
      fetch("http://localhost:5000/all")
        .then(response => response.json())
        .then(data => {
          setBoatData(data);
          console.log("Fetched boat data:", data);

          // Update the path with the new position
          const newPosition = [
            data.data.gps.location.latitude,
            data.data.gps.location.longitude
          ];
          setBoatPath(prevPath => [...prevPath, newPosition]);
        })
        .catch(error => console.error("Error fetching boat data:", error));
    };

    // Fetch data initially
    fetchBoatData();

    // Set up an interval to fetch data every second
    const interval = setInterval(fetchBoatData, 300);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [apiKey]);

  const myBoatIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [18, 26],
    iconAnchor: [9, 13]
  });

  return boatData && boatData.data && boatData.data.gps ? (
    <>
      <Marker
        key={boatData.data.gps.course} // Changing key based on course to force re-render
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
