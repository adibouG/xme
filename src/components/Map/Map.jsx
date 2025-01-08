// MapComponent.js
import React, {useRef, useLayoutEffect, useState, useEffect, LegacyRef } from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
//import '@maptiler/leaflet-maptilersdk';
import './Map.css';
const APIKEY = import.meta.env.VITE_BASE_API_KEY
//import 'openmaptiles/dist/openmaptiles.css';
import { mocData as DATA } from '../../mocData';
const MapComponent = ({ mapCenterLat, mapCenterLng, zoomValue,
   myPos, markerPositions, ...props }) => 
{ 
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const me = { lat: myPos?.coords?.lat || mapCenterLat, lng: myPos?.coords?.lng || mapCenterLng };  
  markerPositions = markerPositions || [];
  
  useEffect(() => {
    console.log('useEffect: init ');
    if (mapRef.current) return; 
    else { 
      console.log('initialize map');
      initMap();
    }
  }, [] );

  const makeOtherMarkers = () => {
    const now = Date.now()
    const userCoord = (user) => [user.location.coords.lat, user.location.coords.lng]
    const userPopUp = (user) => `${user.username} },\n${(now - user.location.timestamp) / 1000} seconds ago\nchannels: ${user.preference.channels}`
    const layerGroups = {}
    const CHANNELID_MAP = {}
    DATA.channels.forEach((channel) => {
      layerGroups[channel.name] = [];
      CHANNELID_MAP[channel.id] = channel.name;
    });
    DATA.users.forEach((user) => {
      if (user.location.coords.lat && user.location.coords.lng) {
    
        for (let channel in layerGroups) {
          // no channels for user
          if (!user.preference.channels.length) 
          { 
            layerGroups[channel].push(
              L.marker(userCoord(user))
                .bindPopup(userPopUp(user))
            )
          }
          else 
          {
            user.preference.channels.forEach((channelId) => {
              if (CHANNELID_MAP[channelId] === channel) {
                layerGroups[channel].push(
                  L.marker(userCoord(user))
                  .bindPopup(userPopUp(user)) 
                ) 
              }
            })
          }
        }
      }
    })
    const overlays = {};
    for (let layer in layerGroups) {
      overlays[layer] = (L.layerGroup(layerGroups[layer]))  
    }
    return overlays; 
  };
  


  function onLocationFound(e) {
    let radius = e.accuracy;
    L.marker(e.latlng).addTo(mapRef.current).bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(mapRef.current);
  }
  function onLocationError(e) {
    alert(e.message);
  }


  const initMap = () => {
    const map = new L.Map(mapContainerRef.current).locate({setView: true, maxZoom: 15})
    const mtLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' , 
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(map);

    mapRef.current = map;      
    mapRef.current.on('locationfound', onLocationFound);
    mapRef.current.on('locationerror', onLocationError);

    const overlays = makeOtherMarkers();
    const layerControl = L.control.layers(null, overlays).addTo(mapRef.current);
 
  };

  const updateMap = (lat, lng, zoom) => {
    console.log('updateMap: ', lat, lng, zoom);
    mapRef.current.panTo(L.LatLng(lat, lng, zoom), {animate: true});
  };

  return (
    <div  className='map_wrapper'>
      <div ref={mapContainerRef} className='map' id='map'>
      </div>
    </div>
  );
};

export default MapComponent;