// MapComponent.js
import React, {useRef, useState, useEffect, LegacyRef } from 'react';
//import { Map, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';
//import 'openmaptiles/dist/openmaptiles.css';

const MapComponent = () => {

  const mapContainerRef = React.useRef<HTMLElement>(null);
  const mapRef = useRef<L.Map|null>(null);
  
  const [mapCenter, setMapCenter] = useState({lng: 37.7749, lat: -122.4194}); // San Francisco
  const [zoom, setZoom] = useState(12);
  const [markerPosition, setMarkerPosition] = useState(mapCenter)//[37.7859, -122.4364]); // Example marker position

  useEffect(() => {
    if (mapRef.current) return; // initialize map only once
    mapRef.current = new L.Map(mapContainerRef.current, { 
      center: L.latLng(mapCenter.lat, mapCenter.lng), 
      zoom: zoom 
    });
      
    
  }, [mapCenter.lat, mapCenter.lng, zoom]);

  return (
    <div  className='map_wrapper'>
      <div ref={mapContainerRef } className='map' />
    </div>
  );
};

export default MapComponent;