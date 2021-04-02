
const ServerState = (() => {
    const players = [];
    const playerIdSocketMap = {};
    const playerIdNameMap = {};

    const onlineGames = {};

    function addPlayer(id, name, socket) {
        players.push(id);
        playerIdSocketMap[id] = socket;
        playerIdNameMap[id] = name;
    }

    function removePlayer(id) {
        const playerIndex = players.findIndex(elem => elem == id);
        if (playerIndex === -1) return;

        players.splice(playerIndex, 1);
        playerIdSocketMap[id].close();
        playerIdSocketMap[id] = null
    }

    return({ addPlayer })
})();

module.exports = ServerState;