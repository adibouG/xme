// MapComponent.js
import React, {useRef, useState, useEffect, LegacyRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import '@maptiler/leaflet-maptilersdk';
import './Map.css';
const APIKEY = import.meta.env.VITE_BASE_API_KEY
//import 'openmaptiles/dist/openmaptiles.css';

const MapComponent = ({ mapCenterValue, zoomValue, myPos, markerPositions, ...props}) => {
 
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  
  const centered = { lat: mapCenterValue?.coords?.lat || 37.7749, lng: mapCenterValue?.coords?.lng || -122.4194 };  
  const me = { lat: myPos?.coords?.lat || centered.lat, lng: myPos?.coords?.lng || centered.lng };  
  const alt = zoomValue || 12;  
  markerPositions = markerPositions || [];
  const [mapCenter, setMapCenter] = useState(centered); // San Francisco
  const [zoom, setZoom] = useState(alt);
  const [markerPosition, setMarkerPosition] = useState(me)//[37.7859, -122.4364]); // Example marker position
  const [otherMarkerPositions, setOtherMarkerPositions] = useState(markerPositions)//[37.7859, -122.4364]); // Example marker position

  useEffect(() => {
    if (mapRef.current) return; // initialize map only once
    const map = new L.Map('map')
      .setView([centered.lat, centered.lng], alt)

    const mtLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' , 
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(map);
      mapRef.current = map;      
  }, [mapCenter.lat, mapCenter.lng, zoom] );

  return (
    <div  className='map_wrapper'>
      <div ref={mapContainerRef } className='map' id='map'>
      </div>
    </div>
  );
};

export default MapComponent;