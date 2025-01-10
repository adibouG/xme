
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
const connected_users = new Map(); //use a Set ?
const connected_user_keys = new Map();
const posted_messages_events = new Map();

function Message () {
  this.id = "";
  this.to = [];
  this.from = 0;
  this.message = "";
  this.statuses = [];
  this.timestamp = 0;
  return this;
} 
// model for messages

//helpers
const addMessageEvent = (message) => {
  const from_user = message.from
  const messageId = `${from_user}::${message.timestamp}::
    ${posted_messages_events[from_user].length + 1}` 
  message.id = messageId
 
  for (let i = 0; i < message.to.length; i++)
  {
    const to_user = message.to[i];
    if (connected_users[connected_user_keys[to_user]]) {
      message.statuses[i] = { 
        send: Date.now(),
        received: 0,
        read: 0
      };
      posted_messages_events[to_user].push(message);
    }
  }
  posted_messages_events[from_user].push(message);
  return message;  
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
  const isDeleted = (connected_users.delete(data.device_id) &&
     connected_user_keys.delete(data.id))
  if (isDeleted) {
    posted_messages_events.delete(data.id) 
  }
  return isDeleted;
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