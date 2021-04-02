const { generateId } = require('../utilities/id-utilities')
const { idConfig } = require('../config');
const ServerState = require('../server-state');

// Check if playername consists of letters, numbers and spaces
function checkValidPlayerName(name) {
    const nameArray = [...name.toLowerCase().replace(' ', '')];
    const isValid = nameArray.every(char => {
        const c = char.charCodeAt(0);
        return((c >= 97 && c <= 122) || (c >= 48 && c <= 57));
    });
    return(isValid);
}

function handleConnectionRequest(webSocket, data) {
    const response = {};
    const playerName = data.playerName;
    if (checkValidPlayerName(playerName)) {
        const playerId = generateId(idConfig.numberOfCharacters);
        webSocket.playerId = playerId;
        webSocket.playerName = playerName;

        ServerState.addPlayer(playerId, playerName, webSocket);

        response.eventName = 'connectionEstablished';
        response.data = { playerId };
        webSocket.send(JSON.stringify(response));
    } else {
        response.eventName = 'connectionRefused';
        const errorDescription = 'Invalid username';
        response.data = {errorDescription};
    }
    webSocket.send(JSON.stringify(response));
}