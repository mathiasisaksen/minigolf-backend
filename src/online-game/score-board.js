
const ScoreBoard = function() {
    let courseNameIndexMap = {};
    let scoreArray = [];

    function incrementPlayerScore(courseName, playerName) {
        // Has a score for the course already been registered?
        if (!(courseName in courseNameIndexMap)) {
            courseNameIndexMap[courseName] = scoreArray.length;
            scoreArray.push({courseName, scores: []});
        }

        const courseIndex = courseNameIndexMap[courseName];
        const courseScores = scoreArray[courseIndex].scores;

        const playerIndex = courseScores.findIndex(entry => entry.name === playerName);
        if (playerIndex !== -1) {
            courseScores[playerIndex].score += 1;
        } else {
            courseScores.push({name: playerName, score: 1});
        }
    }

    function getScoreArray() {
        return(scoreArray);
    }

    return({ incrementPlayerScore, getScoreArray });
};

module.exports = ScoreBoard;