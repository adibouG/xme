import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { EventEmitter, Event, EventSource } from 'event';


export function createMapWidget(containerDomNode) {
  console.log('createMapWidget');

  const map = L.map(containerDomNode);
  map.locate({setView: true, maxZoom: 15})
  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }
  ).addTo(map);
  return map;
}

const ChatMessage = (from, to, timestamp, message, state) => {
    return {
        from, to, senderstate, receiverstate,
        sendtimestamp, receivedtimestamp,
        readtimestamp, message, messagestate
    }
} 

L.ChatMessageHandler = L.Handler.extend({
    addHooks: function() {
        L.DomEvent.on(document, 'messageSent', this._handleMessage, this);
        L.DomEvent.on(document, 'messageReceived', this._handleMessage, this);
    },

    removeHooks: function() {
        L.DomEvent.off(document, 'messageSent', this._handleMessage, this);
        L.DomEvent.off(document, 'messageReceived', this._handleMessage, this);
    },

    _handleMessage: function(ev)  {
        if (!this._map) { return; }

        if (ev.type === 'messageSent') {	
            fetch('/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: ev.data,
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })    
        }
        else if (ev.type === 'messageReceived') {
            fetch('/api/messages/receive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: ev.data,
                })
            })
        }   
        // Treat Gamma angle as horizontal pan (1 degree = 1 pixel) and Beta angle as vertical pan
        this._map.panBy( L.point( ev.gamma, ev.beta ) );
    }
});

const PopupWithChatFeature = L.Popup.extend({

    _popup_ref : null,
    _popup_userId: null,
    _popup_sentText: [], 
    _popup_receivedText: [],	

    initialize: function(name, options) {
        this.name = name;
        L.setOptions(this, options);
    },
    
    onAdd: function (map, div) {
        this._map = map;
        this._div = div;
        this._chatDiv = L.DomUtil.create('div', 'chat-popup');
        this._chatDiv.style.backgroundColor = 'white';
        this._chatDiv.style.height = '2em'; 
    }
})

function popupWithChat(options) {
    return new PopupWithChatFeature(options);
}

export function addInputToPopupWidget(map, popupDiv) {
        
  const chatDiv = document.createElement('div');
  const popup = popupWithChat().setLatLng(map.getCenter())
    .setContent(chatDiv)
    .openOn(map);
  return popupDiv;
}
