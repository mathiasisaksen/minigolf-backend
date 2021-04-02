const { GenerateCourse } = require('../minigolf-components/course-generation');
const GameMechanics = require('../minigolf-components/game-mechanics');
const Course = require('../minigolf-components/course');
const GolfBall = require('../minigolf-components/golf-ball');

function MultiplayerGame() {
    const players = {};
    const playerOrder = [];
    const scoreBoard = {};
    let currentPlayer;
    let courseData;
    let course;
    let golfBall;
    let gameMechanics;

    function addPlayer(player) {
        players[player.clientId] = player;
        playerOrder.push(player.clientId);
        // TODO: WS call to other clients
    }
    function removePlayer(player) {
        delete players[player.clientId];
        playerOrder = playerOrder.filter(id => id != player.clientId);
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
}