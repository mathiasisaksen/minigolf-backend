
function generateCourse() {
    courseData = {
        boundary: [
        {x: 10, y: 40},
        {x: 30, y: 40},
        {x: 30, y: 45},
        {x: 65, y: 45},
        {x: 65, y: 40},
        {x: 90, y: 40},
        {x: 90, y: 60},
        {x: 65, y: 60},
        {x: 65, y: 55},
        {x: 30, y: 55},
        {x: 30, y: 60},
        {x: 10, y: 60}
        ],
        obstacles: [
            [
                {x: 15, y: 55},
                {x: 25, y: 55},
                {x: 25, y: 45},
                {x: 15, y: 45}
            ]
        ],
        initialGolfBallPosition: {x: 80, y: 50},
        hole: {position: {x: 12.5, y: 50}, radius: 2.1}
    };
    return(courseData);
}

module.exports = { generateCourse };