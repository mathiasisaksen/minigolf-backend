const ServerState = require("../server-state");
const { generateId } = require('../utilities/client-utilities')
const { idConfig, playerConfig } = require('../config');

function handleJoinRequest(webSocket, data) {
    const response = {data: {}};
    const playerName = data.playerName;
    const gameId = data.gameId.toLowerCase();
    const onlineGame = ServerState.getGameById(gameId);

    response.eventName = 'joinRequestFailed';
    if (!playerName) {
        response.data.errorDescription = 'Please enter a name';
    } else if (playerName.length > playerConfig.maxNameLength) {
        response.data.errorDescription = 'The name is too long';
    } else if (!onlineGame) {
        response.data.errorDescription = 'Game not found';
    } else if (onlineGame.isPlayerNameInUse(playerName)) {
        response.data.errorDescription = 'Player name already in use';
    } else {
        response.eventName = 'joinRequestSuccessful';
        
        const playerId = generateId(idConfig.numberOfCharacters);
        const player = ServerState.createPlayer(playerId, playerName, webSocket);
        onlineGame.addPlayer(player);
        player.setOnlineGame(onlineGame);
        
        response.data = onlineGame.getGameData();
        response.data.playerId = playerId;
        response.data.gameId = gameId;
    }
    webSocket.send(JSON.stringify(response));
}

module.exports = handleJoinRequest;