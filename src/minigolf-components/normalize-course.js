
// Rescales course so that the golf ball has radius 1
function normalizeCourse(courseData) {
    const normalizedData = courseData;
    const golfBallRadius = courseData.golfBall.radius;

    normalizedData.golfBall.radius = 1;
    normalizedData.golfBall.initialPosition.x /= golfBallRadius;
    normalizedData.golfBall.initialPosition.y /= golfBallRadius;

    normalizedData.hole.radius /= golfBallRadius;
    normalizedData.hole.position.x /= golfBallRadius;
    normalizedData.hole.position.y /= golfBallRadius;

    for (let i = 0; i < normalizedData.boundary.length; i++) {
        normalizedData.boundary[i].x /= golfBallRadius;
        normalizedData.boundary[i].y /= golfBallRadius;
    }

    if (normalizedData.obstacles) {
        for (let i = 0; i < normalizedData.obstacles.length; i++) {
            for (let j = 0; j < normalizedData.obstacles[i].length; j++) {
                normalizedData.obstacles[i][j].x /= golfBallRadius;
                normalizedData.obstacles[i][j].y /= golfBallRadius;
            }
        }
    }

    if (normalizedData.covers) {
        for (let i = 0; i < normalizedData.covers.length; i++) {
            for (let j = 0; j < normalizedData.covers[i].vertices.length; j++) {
                normalizedData.covers[i].vertices[j].x /= golfBallRadius;
                normalizedData.covers[i].vertices[j].y /= golfBallRadius;
            }
        }
    }

    return(normalizedData);
}

module.exports = { normalizeCourse };