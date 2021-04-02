const { generateCourse } = require('../minigolf-components/course-generation');
const GameMechanics = require('../minigolf-components/game-mechanics');
const Course = require('../minigolf-components/course');
const GolfBall = require('../minigolf-components/golf-ball');

function OnlineGame() {
    const players = [];
    const scoreBoard = {};
    let currentPlayer;
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
        players.splice(index, 1);

        const message = {data: {}};
        message.eventName = 'playerLeft';
        message.data.playerName = player.getName();
        broadcast(JSON.stringify(message));
        // TODO: If last player leaves, dispose of game in ServerState
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
        data.courseData = courseData;
        return(data);
    }

    function removeGame() {
        // TODO
    }

    function broadcast(message) {
        players.forEach(player => player.sendMessage(message));
    }

    return({addPlayer, removePlayer, getCourseData, generateNewCourse,
        computePuttResult, isPlayerNameInUse, getGameData, removeGame,
        broadcast})
}

module.exports = OnlineGame;