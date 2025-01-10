const { c } = require('vitest/dist/reporters-5f784f42.js')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const initDB = () => {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS user_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, \
      username TEXT NOT NULL UNIQUE)')

    db.run('CREATE TABLE IF NOT EXISTS connected_users (id INTEGER PRIMARY KEY AUTOINCREMENT,\
      username TEXT NOT NULL UNIQUE,\
      device_id TEXT NOT NULL, \
      user_account INTEGER, \
      connected_at INTEGER NOT NULL, \
      FOREIGN KEY(user_account) REFERENCES user_accounts(id) ON DELETE CASCADE)'
    ),
    db.run('CREATE TABLE IF NOT EXISTS connected_users_positions (\
        device_id TEXT NOT NULL PRIMARY KEY UNIQUE, \
        at INTEGER NOT NULL,\
        position TEXT NOT NULL, \
        FOREIGN KEY(device_id) REFERENCES connected_users(device_id) ON DELETE CASCADE)'
    ),
    db.run('CREATE TABLE IF NOT EXISTS user_messages (\
        id INTEGER PRIMARY KEY AUTOINCREMENT, \
        to INTEGER NOT NULL,\
        from INTEGER NOT NULL, \
        message TEXT NOT NULL, \
        FOREIGN KEY(to) REFERENCES connected_users(id), \
                ON DELETE CASCADE, \
        FOREIGN KEY(from) REFERENCES connected_users(id)  , \
            ON DELETE CASCADE)'
    )  
  })
}
//db

//server dynamic data
const connected_users = {}

const connected_user_keys = {}

const posted_messages_events = {}

const Message = { 
    id: 0,
    to: 0,
    from: 0,
    textMessage: "",
    statuses: {
      message: { send: 0, receive: 0, read: 0 },
      from: 0,
      to: 0 
    },
    timestamps: {send: 0, receive: 0, read: 0}
}// model for messages

//helpers
const addMessageEvent = (data) => {
    
}

const addMessage = (data) => {
    
}

const userConnect = (data) => {

    if (connected_users[data.device_id]) {
        return -1;
    }
    
    const user = {
        id:  Object.keys(connected_users).length + 1,
        username: data.username,
        device_id: data.device_id,
        connected_at: Date.now(),
        position: data.position,
    }
     
    connected_users[user.device_id] = user
    connected_user_keys[user.id] = user.device_id 

    return user.id
}

const userDisconnect = (data) => {
  delete connected_users[data.device_id];
  delete connected_user_keys[data.id];
  delete posted_messages_events[data.id];
}

const isSameArea = (user1, user2, offset = 1) => {
    return (Math.abs(user1.position.coords.lat - user2.position.coords.lat) < offset) 
     && (Math.abs(user1.position.coords.lng - user2.position.coords.lng) < offset) 
}

// middleware
const isValidUser = (req, res, next) => {
    const userKey = req.headers['user-key'];
    const userId = req.params?.userId || req.body?.user_id;  
    if (!userKey || !userId) {
        res.status(400).send("No user key or user id");
        return;
    }
    if (connected_user_keys[userId] !== userKey)  {
        res.status(400).send("not a valid user");
        return;
    }
 
    if  (connected_users[userKey].id !== userId) 
    {
      res.status(400).send("not a valid user");
      return
    }
    next();
}

const updateUserPosition = (userId, newPos) => {
  
  if (connected_users[connected_user_keys[userId]]) {
    const last = connected_users[connected_user_keys[userId]].position
    if (last.timestamp < newPos.timestamp) {
      if (last.coords.lat !== newPos.coords.lat ||
        last.coords.lng !== newPos.coords.lng) 
      {
        connected_users[connected_user_keys[userId]].position = newPos;
        return true;
      } 
    }
  } 
  return false;
} 

module.exports = {
    addMessageEvent,
    addMessage,
    initDB,
    db,
    Message,
    posted_messages_events,
    connected_user_keys,
    connected_users,
    userConnect,
    userDisconnect,
    updateUserPosition,
    isValidUser
}       