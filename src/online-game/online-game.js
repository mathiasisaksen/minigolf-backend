const { generateCourse } = require('../minigolf-components/course-generation');
const GameMechanics = require('../minigolf-components/game-mechanics');
const Course = require('../minigolf-components/course');
const GolfBall = require('../minigolf-components/golf-ball');
const ScoreBoard = require('./score-board');
const CourseLoader = require('../minigolf-components/course-loader');

function OnlineGame(gameId, removeCallback) {
    const players = [];
    const scoreBoard = ScoreBoard();
    let isGameFinished = false;
    let currentCourseNumber = 0;
    let totalNumberOfCourses;
    let currentPlayerIndex;
    let courseData;
    let course;
    let golfBall;

    let courseArray;

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
                data.newCourseName = currentCourseNumber;
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
            prepareNextCourse();
        } else {
            golfBall.moveToInitialPosition();
        }

    }

    function setNumberOfCourses(number) {
        totalNumberOfCourses = number;
    }

    function getNumberOfCourses() {
        return(totalNumberOfCourses);
    }

    function getCourseData() {
        return(courseData);
    }

    function prepareCourses(numberOfCourses) {
        courseArray = CourseLoader.getRandomCourses(numberOfCourses);
        setNumberOfCourses(courseArray.length);
    }

    function prepareNextCourse() {
        currentCourseNumber++;
        if (currentCourseNumber > totalNumberOfCourses) {
            isGameFinished = true;
            return;
        }
        loadNextCourse();
        course = Course(courseData);
        golfBall = GolfBall(courseData);
        gameMechanics = GameMechanics(golfBall, course);
    }

    function loadNextCourse() {
        courseData = CourseLoader.getCourseByFilename(courseArray[currentCourseNumber - 1]);
    }

    function computePuttResult() {
        const currentPlayer = players[currentPlayerIndex];
        scoreBoard.incrementPlayerScore(currentCourseNumber, currentPlayer.getName());
        const puttResult = gameMechanics.computePuttResult();
        if (puttResult.isFinished) {
            goToNextPlayer();
            puttResult.nextPlayer = players[currentPlayerIndex].getName();
            if (currentPlayerIndex === 0 && !isGameFinished) {
                puttResult.isNewCourse = true;
                puttResult.newCourseData = courseData;
                puttResult.newCourseName = currentCourseNumber;
            } else {
                puttResult.isNewCourse = false;
            }
        } else {
            puttResult.isNewCourse = false;
            puttResult.isGameFinished = false;
        }

        puttResult.isGameFinished = isGameFinished;
        return(puttResult);
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
        data.golfBallPosition = golfBall.getPosition().getCoordinates();
        return(data);
    }

    function getGolfBall() {
        return(golfBall);
    }

    function setGolfBallVelocity(speed, direction) {
        golfBall.setSpeed(speed);
        golfBall.setDirection(direction);
    }

    function broadcast(message) {
        players.forEach(player => player.sendMessage(message));
    }

    function getCourseNumber() {
        return(currentCourseNumber);
    }

    function getScoreArray() {
        return(scoreBoard.getScoreArray());
    }

    const game = { getId, 
        addPlayer, removePlayer, 
        getCourseData, prepareNextCourse,
        computePuttResult, isPlayerNameInUse, getGameData,
        broadcast, setCurrentPlayer, setGolfBallVelocity, getGolfBall,
        setNumberOfCourses, getCurrentPlayer, getCourseNumber,
        getScoreArray, getNumberOfCourses, prepareCourses };
    return(game)
}

module.exports = OnlineGame;