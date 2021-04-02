const WebSocket = require('ws');
const { messageHandler } = require('./message-handler');

const wss = new WebSocket.Server({
    host: 'localhost', 
    port: 5600, 
    clientTracking: true
});

wss.on('listening', () => console.log(`Server started and listening on port ${wss.options.port}`));

wss.on('connection', ws => {
    console.log(wss.clients.size);
    ws.on('message', message => messageHandler(ws, message));
});

process.on('uncaughtException', function (err) {
    console.trace(err.stack);
    console.log("Node NOT Exiting...");
  });

module.exports = { server: wss };
