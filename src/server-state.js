const Player = require("./online-game/player");

const ServerState = (() => {
    const players = {};
    const onlineGames = {};

    function addPlayer(id, name, socket) {
        const newPlayer = Player(id, name, socket);
        players.push(newPlayer);
        return(newPlayer);
    }

    function removePlayer(id) {
        if (!players[id]) return(false);
        players[id].removePlayer();
        players[id] = null;
    }

    function getGameById(gameId) {
        return(onlineGames[gameId]);
    }

    function getPlayerById(playerId) {
        return(players[playerId]);
    }

    return({ addPlayer, removePlayer, getGameById, getPlayerById })
})();

module.exports = ServerState;