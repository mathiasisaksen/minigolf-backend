const { generateCourse } = require('../minigolf-components/course-generation');
const GameMechanics = require('../minigolf-components/game-mechanics');
const Course = require('../minigolf-components/course');
const GolfBall = require('../minigolf-components/golf-ball');

function OnlineGame(gameId, removeCallback) {
    const players = [];
    const scoreBoard = {};
    let currentPlayerIndex;
    let courseData;
    let course;
    let golfBall;
    let gameMechanics;

    generateNewCourse();

    function addPlayer(player) {
        const message = {data: {}};
        message.eventName = 'playerJoined';
        message.data.playerName = player.getName();
        broadcast(JSON.stringify(message));

        players.push(player);
    }

    function removePlayer(player) {
        const index = players.findIndex(elem => elem.getId() === player.getId());
        if (index === -1) return;
        const currentPlayerLeft = (player == players[currentPlayerIndex]);
        players.splice(index, 1);
        
        // When last player leaves, remove game
        if (players.length === 0) {
            removeCallback(gameId);
            return;
        }

        const message = {data: {}};
        message.eventName = 'playerLeft';
        message.data.playerName = player.getName();
        message.data.currentPlayerLeft = currentPlayerLeft;
        if (currentPlayerLeft) {        
            currentPlayerIndex %= players.length;
            message.data.newCurrentPlayerName = players[currentPlayerIndex].getName();
        }

        broadcast(JSON.stringify(message));
    }

    function setCurrentPlayer(player) {
        const index = players.findIndex(elem => elem.getId() === player.getId());
        if (index === -1) return;
        currentPlayerIndex = index;
    }

    function goToNextPlayer() {
        currentPlayerIndex++;
        if (currentPlayerIndex === player.length) {
            currentPlayerIndex = 0;
            generateNewCourse();
        }

    }

    function getCourseData() {
        return(courseData);
    }

    function generateNewCourse() {
        courseData = generateCourse();
        course = Course(courseData);
        golfBall = GolfBall(courseData);
        gameMechanics = GameMechanics(golfBall, course);
        // TODO: WS call to all clients
    }

    function computePuttResult() {
        const puttResult = gameMechanics.computePuttResult();
        if (puttResult.isFinished) {
            goToNextPlayer();
            puttResult.nextPlayer = players[currentPlayerIndex].getName();
        }

        // 
        if (currentPlayerIndex === 0) {
            puttResult.isNewCourse = true;
            puttResult.newCourseData = courseData;
        }

        return(puttResult);
        // If puttResult.isFinished is true, go to next player
        // and share with clients. If not, let player do next
        // putt. The position is shared and each client updates
        // based on it
    }

    function getPlayerNames() {
        return(players.map(player => player.getName()));
    }

    function isPlayerNameInUse(playerName) {
        return(getPlayerNames().includes(playerName));
    }

    function getGameData() {
        const data = {};
        data.playerNames = getPlayerNames();
        data.currentPlayer = players[currentPlayerIndex].getName();
        data.courseData = courseData;
        data.scoreBoard = scoreBoard;
        data.golfBallPosition = golfBall.getPosition().getCoordinates();
        return(data);
    }

    function setGolfBallVelocity(speed, direction) {
        golfBall.setSpeed(speed);
        golfBall.setDirection(direction);
    }

    function broadcast(message) {
        players.forEach(player => player.sendMessage(message));
    }

    return({addPlayer, removePlayer, getCourseData, generateNewCourse,
        computePuttResult, isPlayerNameInUse, getGameData,
        broadcast, setGolfBallVelocity, setCurrentPlayer, setGolfBallVelocity })
}

module.exports = OnlineGame;