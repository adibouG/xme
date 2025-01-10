const routes = require('express').Router()
const server = require('./server');
const { uuid } = require('crypto');

routes.post('/users/connect', (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        if (!data.username) {
            return res.sendStatus(400)
        }
    
        if (!data.position) {
            return res.sendStatus(400)
        }
    
        if (!data.device_id) {
            data.user_id = req.ip 
            data.device_id = uuid();    
        }
        
        if (server.connected_users[data.device_id]) {
            return res.sendStatus(400)    
        }

        for (const users in server.connected_users){
            if (server.connected_users[users].username === data.username){
                return res.status(400).send('Username already in use')
            } 
        }

        const id = server.userConnect(data);
        const cookieOptions = {
            maxAge: 900000, 
            httpOnly: true,
            sameSite: 'strict',
        }
        res.cookie('device_id', data.device_id, cookieOptions );
        res.cookie('username', data.username, cookieOptions );
        res.cookie('user_id', id, cookieOptions );
        res.sendStatus(200)
    }    
    catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

routes.post('/users/disconnect/:userId', 
    server.isValidUser,
    (req, res) => {
      try {
        const userId = req.params.userId
        const data = req.body;
    /* if (!data.device_id) {
            return res.sendStatus(400)
        }
        
        if (!server.connected_users[data.device_id]) {
            return res.sendStatus(400)
        }

        if (server.connected_users[data.device_id].id !== userId) {
            return res.sendStatus(400)
        }
    */    
      
        server.userDisconnect(data);
        res.sendStatus(200)
    }    
    catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

routes.get('/events/:userId', server.isValidUser, (req, res) => {
    
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const userId = req.params.userId;
    const userKey = req.headers['user-key'];
    const userPos = req.headers['user-location'];
    
    const user = res.locals.user;    
    if (userPos) {
       server.updateUserPosition(user.id, userPos)     
    }
    const payload = '{ messages: [\n';
    if (server.posted_messages_events[key]) 
    {
        const messages = server.posted_messages_events[key];
        for (const message of messages) {
            payload += JSON.stringify(message) + ',\n'
        } 
        delete server.posted_messages_events[key];
    }
    payload += '], positions: [\n' ;
    for (const users of Object.values(server.connected_users)) { // for (const users in server.connected_users) {
        if (users.id !== user.id && isSameArea(user, users)) 
        {
            payload += JSON.stringify(users) + ',\n'
        } 
    } 
    payload +=  ']\n'
    payload += '}\n\n';
    
    
    
    // If client closes connection, stop sending events
    res.on('close', () => {
        console.log('client dropped me');
        // maybe disconnected user TODO
        res.end();
    });
    
    res.send(payload)
})

routes.post('/api/messages/send',  (req, res) => {
    
    console.log(req.body)
    const data = req.body;
    const isAdded = server.addMessage(data);
    if (isAdded) res.sendStatus(200)
    else res.sendStatus(400)
})

routes.post('/api/messages/receive', (req, res) => {
    
    console.log(req.body)
    // res.send('Hello World!')
    res.sendStatus(200)
  
})

module.exports = routes
