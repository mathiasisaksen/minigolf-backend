const { generateId } = require('./utilities/id-utilities');
const { idConfig } = require('./config');

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
    const clientIdentifier = generateId(idConfig.numberOfCharacters);
    ws.clientId = clientIdentifier.id;
    ws.clientName = messageData.playerName;
    clients[clientIdentifier.id] = ws;

    response = {eventType: 'clientIdentification', data: clientIdentifier};
    ws.send(JSON.stringify(response));
}

module.exports = { messageHandler }