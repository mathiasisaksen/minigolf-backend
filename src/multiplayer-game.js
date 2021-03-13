const { GenerateCourse } = require("./minigolf-components/course-generation");

function MultiplayerGame() {
    const players = {};
    let currentPlayer;
    let courseData;
    let course;
    let golfBall;

    function addPlayer(player) {
        players[player.clientId] = player;
    }
    function removePlayer(player) {
        delete players[player.clientId];
    }

    function getCourseData() {
        return(courseData);
    }

    function generateNewCourse() {
        courseData = GenerateCourse();
    }

    //function computePosition
}