const OnlineGame = require("./online-game/online-game");
const Player = require("./online-game/player");

const ServerState = (() => {
    const players = {};
    const onlineGames = {};

    function createPlayer(id, name, socket) {
        const newPlayer = Player(id, name, socket);
        players[id] = newPlayer;
        return(newPlayer);
    }

    function removePlayer(id) {
        if (!(id in players)) return(false);
        players[id].removePlayer();
        players[id] = null;
    }

    function createGame(gameId) {
        const newGame = OnlineGame();
        onlineGames[gameId] = newGame;
        return(newGame);
    }

    function removeGame(gameId) {
        if (!(gameId in onlineGames)) return;
        onlineGames[gameId].removeGame();
        onlineGames[gameId] = null;
    }

    function getGameById(gameId) {
        return(onlineGames[gameId]);
    }

    function getPlayerById(playerId) {
        return(players[playerId]);
    }

    function isGameIdInUse(gameId) {
        return(gameId in onlineGames);
    }

    return({ addPlayer: createPlayer, removePlayer, getGameById, getPlayerById, 
        isGameIdInUse, addGame: createGame });
})();

module.exports = ServerState;