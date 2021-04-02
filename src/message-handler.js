const errorHandler = require("./error-handler/error-handler");
const eventHandler = require("./event-handler/event-handler");

function messageHandler(webSocket, message) {
    try {        
        const parsedMessage = JSON.parse(message);
        const eventName = parsedMessage.eventName;
        const data = parsedMessage.data;
        eventHandler(webSocket, eventName, data);
    } catch(error) {
        errorHandler(webSocket, error);
    }
}

module.exports = { messageHandler }