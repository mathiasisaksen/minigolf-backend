const ServerState = require("../server-state");
const { generateId, checkValidId } = require('../utilities/client-utilities')
const { idConfig } = require('../config');
const OnlineGame = require("../online-game/online-game");

function handleNewOnlineGame(webSocket, data) {
    const response = {data: {}};
    const playerName = data.playerName;
    let gameId = data.gameId;
    const isGameIdSpecified = data.isGameIdSpecified;

    response.eventName = 'gameCreationFailed';   
    if (isGameIdSpecified && !checkValidId(gameId)) {
        response.data.errorDescription = 'Invalid game ID';        
    } else if (isGameIdSpecified && ServerState.isGameIdInUse(gameId)) {
        response.data.errorDescription = 'Game ID already in use';
    } else {
        response.eventName = 'gameCreationSuccessful';
        const playerId = generateId(idConfig.numberOfCharacters);
        const player = ServerState.addPlayer(playerId, playerName, webSocket);

        gameId = isGameIdSpecified ? gameId : generateId(idConfig.numberOfCharacters);
        gameId = gameId.toLowerCase();
        const onlineGame = ServerState.addGame(gameId);

        onlineGame.addPlayer(player);
        player.setOnlineGame(onlineGame);

        response.data = onlineGame.getGameData();
        response.data.playerId = playerId;
        response.data.gameId = gameId;
    }
    webSocket.send(JSON.stringify(response));
}

module.exports = handleNewOnlineGame;