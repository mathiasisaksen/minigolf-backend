
function Player(id, name, webSocket, removeCallback) {
    let playerId = id;
    let playerName = name;
    let socket = webSocket;
    socket.on('close', handleSocketClose);

    let onlineGame;

    function getId() {
        return(playerId);
    }

    function getName() {
        return(playerName);
    }

    function getSocket() {
        return(socket);
    }

    function sendMessage(message) {
        socket.send(message);
    }

    function setOnlineGame(game) {
        onlineGame = game;
    }

    function handleSocketClose() {
        onlineGame.removePlayer(player);
        removeCallback(playerId);
    }

    const player = 
    { getId, getName, getSocket, sendMessage,
        setOnlineGame};
    return(player);
}

module.exports = Player;