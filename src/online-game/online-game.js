const { GenerateCourse } = require('../minigolf-components/course-generation');
const GameMechanics = require('../minigolf-components/game-mechanics');
const Course = require('../minigolf-components/course');
const GolfBall = require('../minigolf-components/golf-ball');

function MultiplayerGame() {
    const players = [];
    const scoreBoard = {};
    let currentPlayer;
    let courseData;
    let course;
    let golfBall;
    let gameMechanics;

    function addPlayer(player) {
        players.push(player);
        // TODO: WS call to other clients
    }
    function removePlayer(player) {
        const index = players.findIndex(elem => elem.getId() === player.getId());
        if (index === -1) return;
        players.splice(index, 1);
        // TODO: WS call to other clients
    }

    function getCourseData() {
        return(courseData);
    }

    function generateNewCourse() {
        courseData = GenerateCourse();
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

    return({addPlayer, removePlayer, getCourseData, generateNewCourse,
        computePuttResult, isPlayerNameInUse, getGameData})
}