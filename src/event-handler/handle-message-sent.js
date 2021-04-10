const ServerState = require("../server-state");

function handleMessageSent(webSocket, data) {
    const message = {data: {}};
    const playerId = data.playerId;
    const gameId = data.gameId.toLowerCase();

    const originPlayer = ServerState.getPlayerById(playerId);
    const onlineGame = ServerState.getGameById(gameId);

    message.eventName = 'messageReceived';
    message.data.playerName = originPlayer.getName();
    message.data.message = data.message;
    console.log(message);
    onlineGame.broadcast(JSON.stringify(message));
}

module.exports = handleMessageSent;