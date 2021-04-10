const { generateCourse } = require('../minigolf-components/course-generation');
const GameMechanics = require('../minigolf-components/game-mechanics');
const Course = require('../minigolf-components/course');
const GolfBall = require('../minigolf-components/golf-ball');

function OnlineGame(gameId, removeCallback) {
    const players = [];
    const scoreBoard = {};
    let isGameFinished = false;
    let currentCourseNumber = 0;
    let totalNumberOfCourses;
    let currentPlayerIndex;
    let courseData;
    let course;
    let golfBall;

    function getId() {
        return(gameId);
    }

    function addPlayer(player) {
        const message = {data: {}};
        message.eventName = 'playerJoined';
        message.data.playerName = player.getName();
        broadcast(JSON.stringify(message));

        players.push(player);
    }

    function removePlayer(player) {
        const removeIndex = players.findIndex(elem => elem.getId() === player.getId());
        if (removeIndex === -1) return;

        const isNewCourse = (removeIndex === players.length - 1);
        let currentPlayerLeft = false;
        if (removeIndex <= currentPlayerIndex) {
            currentPlayerLeft = (removeIndex === currentPlayerIndex);
            currentPlayerIndex--;
        }

        players.splice(removeIndex, 1);
        
        const message = {};
        const data = {};
        // When last player leaves, remove game
        if (players.length === 0) {
            removeCallback(game);
            return;
        } else if (currentPlayerLeft) {
            goToNextPlayer();
            data.newCurrentPlayerName = players[currentPlayerIndex].getName();
            if (isNewCourse) {
                data.isNewCourse = true;
                data.newCourseData = courseData;
            } else {
                data.isNewCourse = false;
                golfBall.reset();
            }
        }

        message.eventName = 'playerLeft';
        data.playerName = player.getName();
        data.currentPlayerLeft = currentPlayerLeft;
        message.data = data;

        broadcast(JSON.stringify(message));
    }

    function setCurrentPlayer(player) {
        const index = players.findIndex(elem => elem.getId() === player.getId());
        if (index === -1) return;
        currentPlayerIndex = index;
    }

    function getCurrentPlayer() {
        return(players[currentPlayerIndex]);
    }    

    function goToNextPlayer() {
        currentPlayerIndex++;
        if (currentPlayerIndex === players.length) {
            currentPlayerIndex = 0;
            generateNewCourse();
        } else {
            golfBall.moveToInitialPosition();
        }

    }

    function setNumberOfCourses(number) {
        totalNumberOfCourses = number;
    }

    function getCourseData() {
        return(courseData);
    }

    function generateNewCourse() {
        currentCourseNumber++;
        if (currentCourseNumber > totalNumberOfCourses) {
            isGameFinished = true;
            return;
        }
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
            if (currentPlayerIndex === 0 && !isGameFinished) {
                puttResult.isNewCourse = true;
                puttResult.newCourseData = courseData;
            } else {
                puttResult.isNewCourse = false;
            }
        } else {
            puttResult.isNewCourse = false;
            puttResult.isGameFinished = false;
        }

        console.log(currentPlayerIndex, currentCourseNumber, isGameFinished);
        puttResult.isGameFinished = isGameFinished;
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

    const game = { getId, 
        addPlayer, removePlayer, 
        getCourseData, generateNewCourse,
        computePuttResult, isPlayerNameInUse, getGameData,
        broadcast, setCurrentPlayer, setGolfBallVelocity,
        setNumberOfCourses, getCurrentPlayer };
    return(game)
}

module.exports = OnlineGame;