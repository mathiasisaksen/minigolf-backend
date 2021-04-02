
function Player(id, name, webSocket) {
    let playerId = id;
    let playerName = name;
    let socket = webSocket;

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

    function removePlayer() {
        onlineGame.leave(playerId);
        // TODO
    }

    function setOnlineGame(game) {
        onlineGame = game;
    }

    return({ getId, getName, getSocket, sendMessage, removePlayer,
        setOnlineGame});
}

module.exports = Player;