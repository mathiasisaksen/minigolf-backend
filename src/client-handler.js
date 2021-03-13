const { generateClientIdentifier } = require('./client-identifier');

const clients = {};

function messageHandler(message, ws) {
    console.log(ws.clientName);
    const messageData = JSON.parse(message);
    const eventName = messageData.eventName;
    if (eventName === 'initialSetup') {
        handleSetup(messageData, ws);
    } else if (eventName === 'message')  {
        for (const key in clients) {
            console.log(key);
            clients[key].send(JSON.stringify({data: {
                message: messageData.data.message, 
                clientName: ws.clientName}}));
        }
    }
}

function handleSetup(messageData, ws) {
    const clientIdentifier = generateClientIdentifier();
    ws.clientId = clientIdentifier.id;
    ws.clientPassword = clientIdentifier.password;
    ws.clientName = messageData.name;
    clients[clientIdentifier.id] = ws;

    response = {eventType: 'clientIdentification', data: clientIdentifier};
    ws.send(JSON.stringify(response));
}

module.exports = { messageHandler }