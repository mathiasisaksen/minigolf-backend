const WebSocket = require('ws');
const { serverConfig } = require('./config');
const { messageHandler } = require('./message-handler');

const wss = new WebSocket.Server({
    port: serverConfig.port, 
    clientTracking: true
});

wss.on('listening', () => console.log(`Server started and listening on port ${wss.options.port}`));

wss.on('connection', ws => {
    console.log(wss.clients.size);
    ws.on('message', message => messageHandler(ws, message));
});

process.on('uncaughtException', function (err) {
    console.trace(err.stack);
});

module.exports = { server: wss };
