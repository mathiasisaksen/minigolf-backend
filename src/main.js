const WebSocket = require('ws');
const { messageHandler } = require('./clientHandler');

const wss = new WebSocket.Server({
    host: 'localhost', 
    port: 5600, 
    clientTracking: true
});

wss.on('listening', () => console.log(`Server started and listening on port ${wss.options.port}`));



wss.on('connection', ws => {
    console.log(wss.clients.size);
    ws.on('message', message => messageHandler(message, ws));
    //wss.clients[0].send("test");
    //console.log(wss.clients);
});

