import React from 'react';
import * as Models from './../../../Helpers/Models/Models.js';

const loggedUser = new Models.User({
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
})

const LoggedInUserContext = React.createContext({
  user: loggedUser,
  messages: [],
  setMessages: () => {},
  setUser: (user, cb) => {
    console.log('setUser', user);
    if (cb) cb(user)
  },
  setPos : ({lat, lng}, user, cb) => {
        console.log('setPos', lat, lng);
        user.location.timestamp = Date.now();
        user.location.coords.lat = lat;
        user.location.coords.lng = lng;
        if (cb) cb({lat, lng});
    } 
});
const LoggedUserProvider = LoggedInUserContext.Provider;
const LoggedUserConsumer = LoggedInUserContext.Consumer;
export {LoggedInUserContext, LoggedUserProvider, LoggedUserConsumer};
