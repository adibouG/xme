// MapComponent.js
import React, {useRef, useLayoutEffect, useState, useEffect, LegacyRef } from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
//import '@maptiler/leaflet-maptilersdk';
import './Map.css';
const APIKEY = import.meta.env.VITE_BASE_API_KEY
//import 'openmaptiles/dist/openmaptiles.css';

const MapComponent = ({ mapCenterLat, mapCenterLng, zoomValue,
   myPos, markerPositions, ...props }) => 
{ 
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const me = { lat: myPos?.coords?.lat || mapCenterLat, lng: myPos?.coords?.lng || mapCenterLng };  
  markerPositions = markerPositions || [];
  /*
  const [mapCenter, setMapCenter] = useState(
    L.latLng(mapCenterLat, mapCenterLng)
  ); // San Francisco
  
  const [zoom, setZoom] = useState(alt);
  const [markerPosition, setMarkerPosition] = useState(me)//[37.7859, -122.4364]); // Example marker position
  const [otherMarkerPositions, setOtherMarkerPositions] = useState(markerPositions)//[37.7859, -122.4364]); // Example marker position
  */
  useEffect(() => {
    console.log('useEffect: ', mapCenterLat, mapCenterLng, zoomValue);
    if (mapRef.current) return //updateMap(mapCenterLat, mapCenterLng, zoomValue); // initialize map only once
    else { //if (mapCenterLat && mapCenterLng) {
      console.log('initialize map');
      initMap();
    }
  }, [  ] );



function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(mapRef.current).bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(mapRef.current);
}
function onLocationError(e) {
  alert(e.message);
}


const initMap = () => {
  const map = new L.Map(mapContainerRef.current).locate({setView: true, maxZoom: 15})
  //      .setView([ mapCenterLat, mapCenterLng ], zoomValue)
  const mtLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' , 
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ).addTo(map);
  mapRef.current = map;      
  mapRef.current.on('locationfound', onLocationFound);
  mapRef.current.on('locationerror', onLocationError);
  };

  const updateMap = (lat, lng, zoom) => {
    console.log('updateMap: ', lat, lng, zoom);
    mapRef.current.panTo(L.LatLng(lat, lng, zoom), {animate: true, duration: 2});

  };

  return (
    <div  className='map_wrapper'>
      <div ref={mapContainerRef} className='map' id='map'>
      </div>
    </div>
  );
};

export default MapComponent;