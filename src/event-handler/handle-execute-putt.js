const OnlineGame = require("../online-game/online-game");
const ServerState = require("../server-state");


function handleExecutePutt(webSocket, data) {
    const message = {data: {}};

    const playerId = data.playerId;
    const gameId = data.gameId.toLowerCase();
    const speed = data.golfBallSpeed;
    const direction = data.golfBallDirection;

    const player = ServerState.getPlayerById(playerId);
    const onlineGame = ServerState.getGameById(gameId);
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