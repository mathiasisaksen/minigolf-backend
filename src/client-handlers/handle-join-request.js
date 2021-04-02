const ServerState = require("../server-state");
const { generateId } = require('../utilities/id-utilities')
const { idConfig } = require('../config');

// Check if playername consists of letters, numbers and spaces
function checkValidPlayerName(name) {
    const nameArray = [...name.toLowerCase().replace(' ', '')];
    const isValid = nameArray.every(char => {
        const c = char.charCodeAt(0);
        return((c >= 97 && c <= 122) || (c >= 48 && c <= 57));
    });
    return(isValid);
}

function handleJoinRequest(webSocket, data) {
    const response = {data: {}};
    const playerName = data.playerName;
    const onlineGame = ServerState.getGameById(data.gameId);

    response.eventName = 'joinRequestFailed';
    if (!onlineGame) {
        response.data.errorDescription = 'Game not found';
    } else if (!checkValidPlayerName(playerName)) {
        response.data.errorDescription = 'Invalid username';        
    } else if (onlineGame.isPlayerNameInUse(playerName)) {
        response.data.errorDescription = 'Username already in use';
    } else {
        const playerId = generateId(idConfig.numberOfCharacters);
        const player = ServerState.addPlayer(playerId, playerName, webSocket);
        onlineGame.addPlayer(player);
        player.setOnlineGame(onlineGame);
        response.eventName = 'joinRequestSuccessful';
        response.data = onlineGame.getGameData();
        response.data.playerId = playerId;
    }
    webSocket.send(JSON.stringify(response));
}

module.exports = handleJoinRequest;