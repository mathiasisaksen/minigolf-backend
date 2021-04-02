const eventHandler = require("./event-handler/event-handler");

function messageHandler(webSocket, message) {
    const parsedMessage = JSON.parse(message);
    const eventName = parsedMessage.eventName;
    const data = parsedMessage.data;
    eventHandler(webSocket, eventName, data);
}

module.exports = { messageHandler }