// MapComponent.js
import React, {useRef, useContext, useLayoutEffect, useState, useEffect, LegacyRef } from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createMapWidget, addInputToPopupWidget } from './MapWidget.js';
//import '@maptiler/leaflet-maptilersdk';
import { getDeviceLocation, lastLocationWatch } from '../../Helpers/GeoLoc/GeoLoc.js';
import { getDeviceType } from '../../Helpers/Device/Device.js';
import ChatPopUpWidget from '../ChatWidget/ChatPopUpWidget.jsx';
import './Map.css';
const APIKEY = import.meta.env.VITE_BASE_API_KEY
//import 'openmaptiles/dist/openmaptiles.css';
import { mocData as DATA } from '../../mocData';
/*
const LeafIcon = L.Icon.extend({
  options: {
      shadowUrl: 'leaf-shadow.png',
      iconSize:     [38, 95],
      shadowSize:   [50, 64],
      iconAnchor:   [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -76]
  }
});
*/

const loggedUser = {
  id: 1,
  username: 'You',
  preference: {
    channels: [],
    categories: []
  },
  location: {
    timestamp: Date.now(),
    coords: {
      lat: 23,
      lng: 45
    }
  }	
}

const UserContext = React.createContext({
  user: loggedUser,
  messages: [],
  setMessages: () => {},
  setUser: () => {},
  setPos : () => {} 
});



 
let CHANNELID_MAP = {}
let layerGroups = {}
const MapComponent = ({ mapCenterLat, mapCenterLng, zoomValue,
   myPos, markerPositions, ...props }) => 
{ 
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const mapFilterRef = useRef('');

  const userCtx = useContext(UserContext);
  
  const clickedMarker = useRef(null);
  const containerRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [openUser, setOpenUser] = useState(null);
  const [group, setGroup] = useState(null);
  
  L.Marker.include({
    chatMessageHandler: L.ChatMessageHandler,
    id: null, 
    user: null,
    onMarkerClick,
    markerClick
  });

  function markerClick (e, mark, userData) {

    if (!e.target) return; 
    clickedMarker.current = this
    console.log('markerClick this', this);
    e.target.options = userData;
    console.log('markerClick', e.target.options);

    const user = e.target.options.user;
    setOpenUser(user);
  }
  
  
  L.Popup.include({
    chatMessageHandler: L.ChatMessageHandler,
    user: null
  })

  
  useEffect(() => {
    console.log('useEffect: init ');
    if (mapRef.current) return; 
    else { 
      if (!layerGroups.length) fetchData();
      console.log('initialize map');
      initMap();
    }
  }, []);

  const makeMarker = (user) => {
    const now = Date.now()
    const userCoord = () => [user.location.coords.lat, user.location.coords.lng]
    const userPopUp = () => `${user.username},\n${(now - user.location.timestamp) / 1000} seconds ago\nchannels: ${user.preference.channels}`
    const userMarker = L.marker(userCoord(), {
      chatMessageHandler: L.ChatMessageHandler,
      id: user.id,
      user: user
    }).bindPopup(userPopUp());
    
 /*   let popupDiv = addInputToPopupWidget(userMarker.getPopup(), user); //addInputToPopupWidget(mapRef.current, userMarker.getPopup(), user), 	
 
    //     chatMessageHandler: L.ChatMessageHandler,
    //     id: user.id,
    //     user: user
    //   }
    // )
   */ 
  userMarker.addEventListener('click', onMarkerClick);
  userMarker.userId = user.id
  userMarker.user = user
  userMarker.chatMessageHandler = L.ChatMessageHandler
  return userMarker
}

  const fetchData = () => {

    if (DATA) 
    { 
      layerGroups = {}; 
      CHANNELID_MAP = {};
      DATA.channels.map(channel => {
        layerGroups[channel.name] = []; //layerGroups[channel.name } || lay[channel.name, []); layerGroups[channel.name] = [];
        CHANNELID_MAP[channel.name] = channel.id;
      });
      console.log('layerGroups: ', layerGroups);
      console.log('CHANNELID_MAP: ', CHANNELID_MAP);


      setConnectedUsers(DATA.users);
    }
  } 

  const initMap = () => {
    const map = createMapWidget(mapContainerRef.current)
    
    mapRef.current = map;      
    mapRef.current.on('locationfound', onLocationFound);
    mapRef.current.on('locationerror', onLocationError); 
  
  };

  useEffect(() => {
    console.log('useEffect: connectedUsers' , connectedUsers);
    if (connectedUsers.length) {
      addMarkers();
    }

  } , [connectedUsers])

  const addMarkers = () => {

    console.log('addMarkers');
  
    if (!connectedUsers.length) return;
    const overlays = makeMarkers(connectedUsers);
    L.control.layers(null, overlays).addTo(mapRef.current);
    setGroup (overlays);
    //layerControl.addTo(mapRef.current);
  }

  const makeMarkers = (users) => {
    console.log('makeMarkers');
    const layers = Object.keys(layerGroups);
    users.forEach((user) => {
      if (user.location.coords.lat && user.location.coords.lng) {
        for (let channel of layers) {
          // no channels for user
          console.log('channel: ', channel);  
          if (!user.preference.channels.length
            || user.preference.channels.includes(CHANNELID_MAP[channel])
          ) 
          { 
            layerGroups[channel].push(
              makeMarker(user)
            )
          }
        }
      }
    })
    const overlays = {};
    for (const layer in layerGroups) {
      console.log('layer: ', layer);
      overlays[layer] = L.layerGroup(layerGroups[layer]);  
    }
    return overlays; 
  };
  

  function onMarkerClick(e) {
    const userPopUp = e.target.user || e.target.options.user 
    || this.options.user || this.user;

    console.log(userPopUp)
    console.log('popupContainer: ', e.target.id);
    setOpenUser(userPopUp)
    const marker = this; //L.DomUtil.get(e.target.id);
    // const marker = L.marker().add(L.DomUtil.get(e.target.id)); // marker(e.target;
    const popupDiv = addInputToPopupWidget(this.getPopup(), this.options.user); //addInputToPopupWidget(mapRef.current, marker.getPopup(), userPopUp);
    marker.getPopup().setContent(popupDiv);
    setPopupContainer(popupDiv);
  }

  // useEffect(() => {
  //   console.log('useEffect: popupContainer: ', popupContainer);
  //   if (popupContainer) {
  //     popupContainer.addEventListener('click', markerClick);
  //   }
  //   return () => {
  //     if (popupContainer) {
  //       popupContainer.removeEventListener('click', markerClick);
  //     }
  //   };
  // }, [popupContainer]);

  function onLocationFound(e) {
    let radius = e.accuracy;
    const marker = L.marker(e.latlng, {user: userCtx}).addTo(mapRef.current).bindPopup("You are within " + radius + " meters from this point", {user: userCtx}).openPopup();
    L.circle(e.latlng, radius).addTo(mapRef.current);
    const popupDiv = addInputToPopupWidget(marker.getPopup(), marker.options.user); //addInputToPopupWidget(mapRef.current, marker.getPopup(), marker.options.user), marker.getElement());
    //marker.getPopup().setContent(popupDiv);
    setOpenUser(userCtx);

    setPopupContainer(popupDiv);
  
  }
  function onLocationError(e) {
    alert(e.message);
  }
  function filterMap(e) { 
   // mapFilterRef.current = e.target.value;
    // const overlays = makeOtherMarkers();
    const overlays = L.geoJSON(null, );
    const layerControl = L.control.layers(null, overlays).addTo(mapRef.current);
    layerControl.removeLayer(layerControl.getLayer(mapFilterRef.current));
    layerControl.addLayer(layerControl.getLayer(mapFilterRef.current));
  }


  const updateMap = (lat, lng, zoom) => {
    console.log('updateMap: ', lat, lng, zoom);
    mapRef.current.panTo(L.LatLng(lat, lng, zoom), {animate: true});
  };

  return (
    <div  className='map_wrapper'>
      <div ref={mapContainerRef} className='map' id='map'>
      {
        popupContainer !== null && ReactDOM.createPortal(
          <>
          { openUser && 
            <ChatPopUpWidget userPopUp={openUser} 
            //userData={user} 
            />
          }
           </>
            ,
          popupContainer
        )
      }
      </div>
      {
        /*
        <div className='filter'> 
        <input ref={mapFilterRef}
         type="input" id="filter" name="filter"
         onChange={(e) => filterMap(e)}
        />
        </div>
        */
      }
    </div>
  );
};

export default MapComponent;