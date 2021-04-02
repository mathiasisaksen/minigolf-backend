const handleJoinRequest = require("./handle-join-request");
const handleNewOnlineGame = require("./handle-new-online-game");

const eventHandlers = { handleJoinRequest, handleNewOnlineGame };

function eventHandler(webSocket, eventName, data) {
    eventName = eventName[0].toUpperCase() + eventName.slice(1);
    const handlerName = 'handle' + eventName;
    eventHandlers[handlerName](webSocket, data);
}

module.exports = eventHandler;