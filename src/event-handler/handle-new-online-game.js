const ServerState = require("../server-state");
const { generateId, checkValidId } = require('../utilities/client-utilities')
const { idConfig, playerConfig } = require('../config');

function handleNewOnlineGame(webSocket, data) {
    const response = {data: {}};
    const playerName = data.playerName;
    let gameId = data.gameId;
    const isGameIdSpecified = data.isGameIdSpecified;

    response.eventName = 'gameCreationFailed';
    if (!playerName) {
        response.data.errorDescription = 'Please enter a name';
    } else if (playerName.length > playerConfig.maxNameLength) {
        response.data.errorDescription = 'The name is too long';
    } else if (isGameIdSpecified && !checkValidId(gameId)) {
        response.data.errorDescription = 'Invalid game ID';        
    } else if (isGameIdSpecified && ServerState.isGameIdInUse(gameId)) {
        response.data.errorDescription = 'Game ID already in use';
    } else {
        response.eventName = 'gameCreationSuccessful';
        const playerId = generateId(idConfig.numberOfCharacters);
        const player = ServerState.createPlayer(playerId, playerName, webSocket);

        gameId = isGameIdSpecified ? gameId : generateId(idConfig.numberOfCharacters);
        gameId = gameId.toLowerCase();
        const onlineGame = ServerState.createGame(gameId);

        onlineGame.addPlayer(player);
        onlineGame.setCurrentPlayer(player);
        player.setOnlineGame(onlineGame);

        response.data = onlineGame.getGameData();
        response.data.playerId = playerId;
        response.data.gameId = gameId;
    }
    webSocket.send(JSON.stringify(response));
}

module.exports = handleNewOnlineGame;