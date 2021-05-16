const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const { serverConfig } = require('./config');
const { messageHandler } = require('./message-handler');

const httpsServer = https.createServer({
    cert: fs.readFileSync('./src/tls/cert.pem'),
    key: fs.readFileSync('./src/tls/privkey.pem')
});

httpsServer.listen(serverConfig.port);

const wss = new WebSocket.Server({
    server: httpsServer,
    clientTracking: true
});

wss.on('listening', () => console.log(`WS server listening`));

wss.on('connection', (ws, req) => {
    console.log(`Client number ${wss.clients.size} connected`);
    ws.on('message', message => messageHandler(ws, message));
});

process.on('uncaughtException', function (err) {
    console.trace(err.stack);
});

module.exports = { server: wss };
