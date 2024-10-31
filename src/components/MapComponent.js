import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet-rotatedmarker";
import 'leaflet/dist/leaflet.css';
import markerIcon from '../assist/marker.png'; // Adjust this path as necessary

const { BaseLayer, Overlay } = LayersControl;
const position = [57.573517, 11.9269]; // Initial center coordinates

const MapComponent = ({ apiKey }) => {
  const [aisData, setAisData] = useState([]);
  const [boatData, setBoatData] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      console.warn('No API key provided');
      return;
    }

    // Fetch AIS data
    const aisUrl = 'https://ais2.skippo.io/search/bbox?latTop=57.623517&lonLeft=11.8769&latBottom=57.523517&lonRight=11.9769';
    fetch(aisUrl, {
      headers: {
        'Authorization': `Basic ${apiKey}`,
      }
    })
      .then(response => response.json())
      .then(data => setAisData(data.ais || []))
      .catch(error => console.error('Error fetching AIS data:', error));

    // Fetch boat data from Flask API
    fetch("http://localhost:5000/all")
      .then(response => response.json())
      .then(data => setBoatData(data))
      .catch(error => console.error("Error fetching boat data:", error));
  }, [apiKey]);

  const getBoatIcon = (boatType) => {
    return L.icon({
      iconUrl: `https://www.skippo.se/plan/boat-icons/boat_${boatType}.png`,
      iconSize: [25, 41],
    });
  };

  // Custom icon for your boat
  const myBoatIcon = L.icon({
    iconUrl: markerIcon, // Use the imported marker image
  });

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <LayersControl position="topright">
        <BaseLayer checked name="Nautical Map">
          <TileLayer
            url="https://{s}.eniro.no/geowebcache/service/tms1.0.0/nautical2x/{z}/{x}/{y}.png?c=crc&v=20200602"
            maxZoom={17}
            minZoom={3}
            noWrap={true}
            subdomains={["map01", "map02", "map03", "map04"]}
            tileSize={256}
            tms={true}
            zoomOffset={0}
          />
        </BaseLayer>
        <BaseLayer name="Hydrographica Map">
          <TileLayer
            url="https://{s}.eniro.no/geowebcache/service/tms1.0.0/hydrographica2x/{z}/{x}/{y}.png?c=crc&v=20240523"
            maxZoom={17}
            minZoom={3}
            noWrap={true}
            subdomains={["map01", "map02", "map03", "map04"]}
            tileSize={256}
            tms={true}
            zoomOffset={0}
          />
        </BaseLayer>
        <BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </BaseLayer>
        
        {/* LayerGroup for AIS Ships */}
        <Overlay name="AIS Ships">
          <LayerGroup>
            {aisData.map(ship => (
              <Marker
                key={ship.mmsi}
                position={[ship.latitude, ship.longitude]}
                icon={getBoatIcon(ship.boatType)}
                rotationAngle={ship.course}
                rotationOrigin="center"
              >
                <Popup>
                  <strong>Name:</strong> {ship.name}<br />
                  <strong>Type:</strong> {ship.shipType}<br />
                  <strong>Destination:</strong> {ship.destination}<br />
                  <strong>Speed:</strong> {ship.speed} knots<br />
                  <strong>ETA:</strong> {ship.eta}
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </Overlay>
      </LayersControl>
      {boatData && boatData.data && boatData.data.gps && (
              <Marker
                position={[
                  boatData.data.gps.location.latitude,
                  boatData.data.gps.location.longitude
                ]}
                icon={myBoatIcon}
                rotationAngle={boatData.data.gps.course}
                rotationOrigin="center"
              >
                <Popup>
                  <strong>My Boat</strong><br />
                  <strong>Course:</strong> {boatData.data.gps.course}<br />
                  <strong>Latitude:</strong> {boatData.data.gps.location.latitude}<br />
                  <strong>Longitude:</strong> {boatData.data.gps.location.longitude}
                </Popup>
              </Marker>
            )}
    </MapContainer>
  );
};

export default MapComponent;
