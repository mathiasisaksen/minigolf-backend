const { gameConfig } = require("../config");
const OnlineGame = require("../online-game/online-game");
const ServerState = require("../server-state");


function handleExecutePutt(webSocket, data) {
    const message = {data: {}};

    const gameId = data.gameId.toLowerCase();
    const onlineGame = ServerState.getGameById(gameId);
    const currentPlayer =  onlineGame.getCurrentPlayer();

    const playerId = data.playerId;
    if (currentPlayer.getId() !== playerId) {
        message.eventName = 'generalError';
        message.data.errorDescription = 'Putt was performed by wrong player';
        webSocket.send(JSON.stringify(message));
        return;
    }

    const speed = Math.min(data.golfBallSpeed, gameConfig.maxSpeed);
    const direction = data.golfBallDirection;

    const player = ServerState.getPlayerById(playerId);
    onlineGame.setGolfBallVelocity(speed, direction);
    const puttResult = onlineGame.computePuttResult();
    
    message.eventName = 'executePutt';
    Object.assign(message.data, 
        puttResult, 
        {playerName: player.getName(),
        golfBallDirection: direction,
        golfBallSpeed: speed});
    onlineGame.broadcast(JSON.stringify(message));
}

module.exports = handleExecutePutt;