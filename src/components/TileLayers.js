import React from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';

const { BaseLayer } = LayersControl;

const TileLayers = () => (
  <>
    <BaseLayer name="Nautical Map">
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
    <BaseLayer checked name="Hydrographica Map">
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
  </>
);

export default TileLayers;
