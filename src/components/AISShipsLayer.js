import React, { useEffect, useState } from 'react';
import { Marker, Popup, LayerGroup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useApi } from '../contexts/ApiContext'; // Import the API context

const { Overlay } = LayersControl;

const AISShipsLayer = () => {
  const { apiKey } = useApi(); // Access apiKey from ApiContext
  const [aisData, setAisData] = useState([]);

  useEffect(() => {
    if (!apiKey) {
      console.warn('No API key provided');
      return;
    }

    fetch('https://ais2.skippo.io/search/bbox?latTop=57.623517&lonLeft=11.8769&latBottom=57.523517&lonRight=11.9769', {
      headers: { 'Authorization': `Basic ${apiKey}` }
    })
      .then(response => response.json())
      .then(data => setAisData(data.ais || []))
      .catch(error => console.error('Error fetching AIS data:', error));
  }, [apiKey]);

  const getBoatIcon = (boatType) => L.icon({
    iconUrl: `https://www.skippo.se/plan/boat-icons/boat_${boatType}.png`,
    iconSize: [25, 41],
  });

  return (
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
  );
};

export default AISShipsLayer;
