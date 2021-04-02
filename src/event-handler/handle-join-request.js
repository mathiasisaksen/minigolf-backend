const ServerState = require("../server-state");
const { generateId, checkValidId } = require('../utilities/client-utilities')
const { idConfig } = require('../config');

function handleJoinRequest(webSocket, data) {
    const response = {data: {}};
    const playerName = data.playerName;
    const onlineGame = ServerState.getGameById(data.gameId);

    response.eventName = 'joinRequestFailed';
    if (!onlineGame) {
        response.data.errorDescription = 'Game not found';
    } else if (onlineGame.isPlayerNameInUse(playerName)) {
        response.data.errorDescription = 'Username already in use';
    } else {
        response.eventName = 'joinRequestSuccessful';
        
        const playerId = generateId(idConfig.numberOfCharacters);
        const player = ServerState.addPlayer(playerId, playerName, webSocket);
        onlineGame.addPlayer(player);
        player.setOnlineGame(onlineGame);
        
        response.data = onlineGame.getGameData();
        response.data.playerId = playerId;
    }
    webSocket.send(JSON.stringify(response));
}

module.exports = handleJoinRequest;