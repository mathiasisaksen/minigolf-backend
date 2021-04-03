const OnlineGame = require("./online-game/online-game");
const Player = require("./online-game/player");

const ServerState = (() => {
    const players = {};
    const onlineGames = {};

    function createPlayer(id, name, socket) {
        const newPlayer = Player(id, name, socket, removePlayer);
        players[id] = newPlayer;
        return(newPlayer);
    }

    function removePlayer(id) {
        if (!(id in players)) return(false);
        delete players[id];
    }

    function createGame(gameId) {
        const newGame = OnlineGame(gameId, removeGame);
        onlineGames[gameId] = newGame;
        return(newGame);
    }

    function removeGame(gameId) {
        if (!(gameId in onlineGames)) return;
        delete onlineGames[gameId];
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

    return({ createPlayer, removePlayer, getGameById, getPlayerById, 
        isGameIdInUse, createGame, removeGame });
})();

module.exports = ServerState;