// MapComponent.js
import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'openmaptiles/dist/openmaptiles.css';

const MapComponent = () => {
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // San Francisco
  const [zoom, setZoom] = useState(12);
  const [markerPosition, setMarkerPosition] = useState([37.7859, -122.4364]); // Example marker position

  return (
    <Map center={mapCenter} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={markerPosition}>
        <Popup>
          <span>This is a marker!</span>
        </Popup>
      </Marker>
    </Map>
  );
};

export default MapComponent;